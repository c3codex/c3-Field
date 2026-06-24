// POST /api/stripe/webhook
// Verified MAP-only Stripe webhook processing with durable event idempotency.

type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
}

type MapPathway = "foundational" | "optimization" | "remediation"

type StripeEventObject = {
  id: string
  payment_intent?: string | null
  payment_status?: string
  amount_total?: number | null
  amount_received?: number | null
  currency?: string | null
  customer_email?: string | null
  metadata?: Record<string, string>
}

type StripeEvent = {
  id: string
  type: string
  data: { object: StripeEventObject }
}

type WebhookClaim = {
  should_process: boolean
  duplicate_event: boolean
  prior_status: string
}

const REQUIRED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.expired",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
])

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function isMapPathway(value: unknown): value is MapPathway {
  return value === "foundational" || value === "optimization" || value === "remediation"
}

function hasValidMapBoundary(metadata: Record<string, string>) {
  return metadata.system === "measures_registry"
    && metadata.offer_type === "map"
    && isMapPathway(metadata.map_pathway)
    && metadata.creates_seat === "false"
    && metadata.creates_c3_key === "false"
    && metadata.creates_certification === "false"
}

async function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string) {
  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.split("=")
    if (key) acc[key] = rest.join("=")
    return acc
  }, {})

  const timestamp = parts.t
  const signature = parts.v1
  if (!timestamp || !signature || !/^\d+$/.test(timestamp) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return false
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (age > 300) return false

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  )
  const expected = new Uint8Array(signed)
  const actual = Uint8Array.from(signature.match(/.{2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
  if (actual.length !== expected.length) return false

  let mismatch = 0
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected[index] ^ actual[index]
  }
  return mismatch === 0
}

async function supabaseFetch<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase server credentials not configured")

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed: ${response.status}`)
  }

  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

async function claimWebhookEvent(env: Env, event: StripeEvent) {
  const object = event.data.object
  const [claim] = await supabaseFetch<WebhookClaim[]>(
    env,
    "rpc/claim_stripe_webhook_event",
    {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        p_stripe_event_id: event.id,
        p_event_type: event.type,
        p_checkout_session_id: event.type.startsWith("checkout.session.") ? object.id : null,
        p_payment_intent_id: event.type.startsWith("payment_intent.") ? object.id : object.payment_intent ?? null,
        p_metadata: object.metadata ?? {},
      }),
    },
  )
  if (!claim) throw new Error("Webhook event claim returned no result")
  return claim
}

async function markWebhookEvent(
  env: Env,
  eventId: string,
  status: "processed" | "failed",
  error: string | null = null,
) {
  await supabaseFetch(env, `stripe_webhook_events?stripe_event_id=eq.${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      processed_at: status === "processed" ? new Date().toISOString() : null,
      error,
    }),
  })
}

async function updateMapPayment(
  env: Env,
  mapOrderId: string,
  payload: Record<string, unknown>,
  preservePaid = false,
) {
  const paidFilter = preservePaid ? "&payment_status=neq.paid" : ""
  await supabaseFetch(
    env,
    `map_payment_events?map_order_id=eq.${encodeURIComponent(mapOrderId)}${paidFilter}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(payload),
    },
  )
}

async function processRequiredEvent(env: Env, event: StripeEvent) {
  const object = event.data.object
  const metadata = object.metadata ?? {}
  const mapOrderId = metadata.map_order_id
  if (!mapOrderId || !hasValidMapBoundary(metadata)) {
    throw new Error("Stripe event metadata does not satisfy the MAP-only boundary")
  }

  if (event.type === "checkout.session.completed") {
    if (object.payment_status !== "paid") {
      throw new Error("Checkout session completed without paid standing")
    }
    await updateMapPayment(env, mapOrderId, {
      stripe_payment_intent_id: object.payment_intent ?? null,
      payment_status: "paid",
      amount_paid: object.amount_total ?? null,
      currency: object.currency ?? null,
      paid_at: new Date().toISOString(),
      webhook_event_id: event.id,
      oar_state: "payment_confirmed",
      scheduling_state: "released",
    })
    return
  }

  if (event.type === "payment_intent.succeeded") {
    // Primary fulfillment remains checkout.session.completed. The event registry
    // records this success exactly once without opening MAP access a second time.
    return
  }

  if (event.type === "payment_intent.payment_failed") {
    await updateMapPayment(env, mapOrderId, {
      stripe_payment_intent_id: object.id,
      payment_status: "failed",
      webhook_event_id: event.id,
      oar_state: "payment_failed",
      scheduling_state: "held",
    }, true)
    return
  }

  if (event.type === "checkout.session.expired") {
    await updateMapPayment(env, mapOrderId, {
      payment_status: "expired",
      webhook_event_id: event.id,
      oar_state: "checkout_expired",
      scheduling_state: "held",
    }, true)
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return jsonResponse({ error: "Webhook secret is not configured" }, 503)

  const signatureHeader = request.headers.get("stripe-signature")
  if (!signatureHeader) return jsonResponse({ error: "Missing stripe-signature header" }, 400)

  const rawBody = await request.text()
  if (!await verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return jsonResponse({ error: "Webhook signature verification failed" }, 400)
  }

  let event: StripeEvent
  try {
    event = JSON.parse(rawBody) as StripeEvent
  } catch {
    return jsonResponse({ error: "Invalid webhook payload" }, 400)
  }

  if (!event.id || !event.type || !event.data?.object?.id) {
    return jsonResponse({ error: "Invalid Stripe event shape" }, 400)
  }

  let claimed = false
  try {
    const claim = await claimWebhookEvent(env, event)
    if (!claim.should_process) {
      return jsonResponse({ received: true, duplicate: true })
    }
    claimed = true

    if (REQUIRED_EVENTS.has(event.type)) {
      await processRequiredEvent(env, event)
    }

    await markWebhookEvent(env, event.id, "processed")
    return jsonResponse({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed"
    if (claimed) {
      try {
        await markWebhookEvent(env, event.id, "failed", message)
      } catch {
        // Preserve the original processing failure so Stripe retries delivery.
      }
    }
    return jsonResponse({ received: false, error: "Webhook processing failed" }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
