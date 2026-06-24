// POST /api/stripe/webhook
// Receives Stripe webhook events and verifies payment via HMAC-SHA256 signature.
// payment_status = 'paid' and scheduling_state = 'released' only after verified webhook.
// STRIPE_WEBHOOK_SECRET: configure in Cloudflare dashboard after endpoint is registered in Stripe.
// OAR2: oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1

type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  STRIPE_WEBHOOK_SECRET?: string
}

type StripeCheckoutSession = {
  id: string
  payment_intent: string | null
  payment_status: string
  amount_total: number | null
  currency: string | null
  customer_email: string | null
  metadata: Record<string, string>
}

type StripeEvent = {
  id: string
  type: string
  data: { object: StripeCheckoutSession }
}

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.split("=")
    if (key) acc[key] = rest.join("=")
    return acc
  }, {})

  const timestamp = parts["t"]
  const signature = parts["v1"]
  if (!timestamp || !signature) return false

  const age = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (age > 300) return false // reject events older than 5 minutes

  const payload = `${timestamp}.${rawBody}`
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return computed === signature
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

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    // Pending: configure STRIPE_WEBHOOK_SECRET in Cloudflare after registering endpoint in Stripe
    return jsonResponse({ error: "Webhook secret is not configured" }, 503)
  }

  const signatureHeader = request.headers.get("stripe-signature")
  if (!signatureHeader) return jsonResponse({ error: "Missing stripe-signature header" }, 400)

  const rawBody = await request.text()

  const verified = await verifyStripeSignature(rawBody, signatureHeader, webhookSecret)
  if (!verified) return jsonResponse({ error: "Webhook signature verification failed" }, 400)

  let event: StripeEvent
  try {
    event = JSON.parse(rawBody) as StripeEvent
  } catch {
    return jsonResponse({ error: "Invalid webhook payload" }, 400)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const mapOrderId = session.metadata?.["map_order_id"]

    if (mapOrderId && session.payment_status === "paid") {
      try {
        await supabaseFetch(
          env,
          `map_payment_events?map_order_id=eq.${mapOrderId}`,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              stripe_payment_intent_id: session.payment_intent ?? null,
              payment_status: "paid",
              amount_paid: session.amount_total ?? null,
              currency: session.currency ?? null,
              paid_at: new Date().toISOString(),
              webhook_event_id: event.id,
              oar_state: "payment_confirmed",
              scheduling_state: "released",
            }),
          },
        )
      } catch {
        // Log failure but return 200 — Stripe will retry if we return non-2xx
        return jsonResponse({ received: true, warning: "payment event update failed" })
      }
    }
  }

  return jsonResponse({ received: true })
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
