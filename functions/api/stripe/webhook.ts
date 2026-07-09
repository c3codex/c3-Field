// POST /api/stripe/webhook
// Receives Stripe webhook events and verifies payment via HMAC-SHA256 signature.
// payment_status = 'paid' and scheduling_state = 'released' only after verified webhook.
// STRIPE_WEBHOOK_SECRET: configure in Cloudflare dashboard after endpoint is registered in Stripe.
// OAR2: oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1
// OAR2: oar2_seat_assessment_and_payment_notification_dispatch_v1 — added claim_stripe_webhook_event
// idempotency, checkout.session.expired / payment_intent.payment_failed handling, and governed
// operator + participant notification dispatch for map_payment_completed/failed/canceled.

type Env = {
  RESEND_API_KEY?: string
  OPERATOR_NOTIFY_EMAIL?: string
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

type StripePaymentIntent = {
  id: string
  metadata: Record<string, string>
  last_payment_error?: { message?: string } | null
}

type StripeEvent = {
  id: string
  type: string
  data: { object: StripeCheckoutSession | StripePaymentIntent }
}

type MapPaymentEventRow = {
  map_order_id: string
  contact_email: string
  stripe_payment_intent_id: string | null
  amount_paid: number | null
  currency: string | null
  paid_at: string | null
}

type TemplateRow = {
  template_key: string
  subject: string
  body: string
}

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function escapeHtml(str: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }
  return str.replace(/[&<>"']/g, (char) => entities[char])
}

function renderTemplate(template: string, tokens: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match,
  )
}

async function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): Promise<boolean> {
  let timestamp: string | undefined
  const v1Signatures: string[] = []
  for (const part of signatureHeader.split(",")) {
    const [key, ...rest] = part.split("=")
    const value = rest.join("=")
    if (key === "t") timestamp = value
    else if (key === "v1" && value) v1Signatures.push(value)
  }
  if (!timestamp || v1Signatures.length === 0) return false

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

  // Stripe sends multiple v1= signatures during signing-secret rotation; any match is valid.
  return v1Signatures.includes(computed)
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

async function claimWebhookEvent(
  env: Env,
  stripeEventId: string,
  eventType: string,
  checkoutSessionId: string | null,
  paymentIntentId: string | null,
) {
  const [result] = await supabaseFetch<{ should_process: boolean; duplicate_event: boolean; prior_status: string }[]>(
    env,
    "rpc/claim_stripe_webhook_event",
    {
      method: "POST",
      body: JSON.stringify({
        p_stripe_event_id: stripeEventId,
        p_event_type: eventType,
        p_checkout_session_id: checkoutSessionId,
        p_payment_intent_id: paymentIntentId,
      }),
    },
  )
  return result
}

async function markWebhookEventStatus(env: Env, stripeEventId: string, status: "processed" | "failed", error?: string) {
  await supabaseFetch(env, `stripe_webhook_events?stripe_event_id=eq.${encodeURIComponent(stripeEventId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      processed_at: status === "processed" ? new Date().toISOString() : null,
      error: error ?? null,
    }),
  })
}

// Idempotency for the notification side is independent of (and in addition to) the
// stripe_webhook_events claim above — it is keyed on the governed dispatch log so a
// duplicate successful send is blocked even if a webhook event is somehow reprocessed.
async function alreadySent(env: Env, eventType: string, recipientClass: string, sourceId: string) {
  const rows = await supabaseFetch<{ id: string }[]>(
    env,
    `measures_notification_dispatch_log?event_type=eq.${eventType}&recipient_class=eq.${recipientClass}&source_id=eq.${encodeURIComponent(sourceId)}&dispatch_state=eq.sent&select=id&limit=1`,
  )
  return rows.length > 0
}

async function insertDispatchLog(env: Env, payload: Record<string, unknown>) {
  await supabaseFetch(env, "measures_notification_dispatch_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
}

async function loadTemplate(env: Env, eventType: string, recipientClass: string) {
  const [template] = await supabaseFetch<TemplateRow[]>(
    env,
    `measures_notification_template?event_type=eq.${eventType}&recipient_class=eq.${recipientClass}&is_active=eq.true&select=template_key,subject,body&limit=1`,
  )
  return template ?? null
}

async function sendGovernedNotification(
  env: Env,
  opts: {
    eventType: string
    recipientClass: "operator" | "participant"
    sourceId: string
    recipientEmail: string
    tokens: Record<string, string>
  },
) {
  const { eventType, recipientClass, sourceId, recipientEmail, tokens } = opts

  if (await alreadySent(env, eventType, recipientClass, sourceId)) {
    return { dispatch_state: "blocked" as const, reason: "already sent" }
  }

  const template = await loadTemplate(env, eventType, recipientClass)
  if (!template) {
    await insertDispatchLog(env, {
      event_type: eventType,
      recipient_class: recipientClass,
      source_table: "map_payment_events",
      source_id: sourceId,
      recipient_email: recipientEmail,
      dispatch_state: "failed",
      provider: "resend_error",
      error_message: "active template missing",
      metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
    })
    return { dispatch_state: "failed" as const, reason: "active template missing" }
  }

  const subject = renderTemplate(template.subject, tokens)
  const body = renderTemplate(template.body, tokens)

  await insertDispatchLog(env, {
    event_type: eventType,
    recipient_class: recipientClass,
    source_table: "map_payment_events",
    source_id: sourceId,
    recipient_email: recipientEmail,
    template_key: template.template_key,
    dispatch_state: "attempted",
    provider: "resend",
    metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1", subject },
  })

  if (!env.RESEND_API_KEY) {
    await insertDispatchLog(env, {
      event_type: eventType,
      recipient_class: recipientClass,
      source_table: "map_payment_events",
      source_id: sourceId,
      recipient_email: recipientEmail,
      template_key: template.template_key,
      dispatch_state: "skipped",
      provider: "resend_error",
      error_message: "RESEND_API_KEY is not configured",
      metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
    })
    return { dispatch_state: "skipped" as const, reason: "RESEND_API_KEY is not configured" }
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Measures Registry <connect@measuresregistry.com>",
      to: [recipientEmail],
      reply_to: "connect@measuresregistry.com",
      subject,
      text: body,
      html: body.split("\n").map((line) => `<p>${escapeHtml(line)}</p>`).join(""),
    }),
  })

  const resendPayload = (await resendResponse.json().catch(() => ({}))) as {
    id?: string
    message?: string
    name?: string
  }

  if (!resendResponse.ok || !resendPayload.id) {
    const errorMessage = resendPayload.message ?? resendPayload.name ?? `Resend request failed: ${resendResponse.status}`
    await insertDispatchLog(env, {
      event_type: eventType,
      recipient_class: recipientClass,
      source_table: "map_payment_events",
      source_id: sourceId,
      recipient_email: recipientEmail,
      template_key: template.template_key,
      dispatch_state: "failed",
      provider: "resend_error",
      error_message: errorMessage,
      metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
    })
    return { dispatch_state: "failed" as const, reason: errorMessage }
  }

  await insertDispatchLog(env, {
    event_type: eventType,
    recipient_class: recipientClass,
    source_table: "map_payment_events",
    source_id: sourceId,
    recipient_email: recipientEmail,
    template_key: template.template_key,
    provider: "resend",
    provider_message_id: resendPayload.id,
    dispatch_state: "sent",
    metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1", subject },
  })

  return { dispatch_state: "sent" as const, provider_message_id: resendPayload.id }
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

  const handledTypes = ["checkout.session.completed", "checkout.session.expired", "payment_intent.payment_failed"]
  if (!handledTypes.includes(event.type)) {
    return jsonResponse({ received: true, ignored: event.type })
  }

  const checkoutSessionId = event.type.startsWith("checkout.session.")
    ? (event.data.object as StripeCheckoutSession).id
    : null
  const paymentIntentId = event.type.startsWith("checkout.session.")
    ? (event.data.object as StripeCheckoutSession).payment_intent
    : (event.data.object as StripePaymentIntent).id

  let claim: { should_process: boolean; duplicate_event: boolean; prior_status: string }
  try {
    claim = await claimWebhookEvent(env, event.id, event.type, checkoutSessionId, paymentIntentId)
  } catch {
    // Idempotency ledger itself failed — fail closed and let Stripe retry rather than
    // risk an unlogged duplicate-processing pass.
    return jsonResponse({ error: "webhook idempotency check failed" }, 500)
  }

  if (!claim.should_process) {
    return jsonResponse({ received: true, duplicate: true, prior_status: claim.prior_status })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as StripeCheckoutSession
      const mapOrderId = session.metadata?.["map_order_id"]

      if (mapOrderId && session.payment_status === "paid") {
        await supabaseFetch(env, `map_payment_events?map_order_id=eq.${mapOrderId}`, {
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
        })

        const [paymentEvent] = await supabaseFetch<MapPaymentEventRow[]>(
          env,
          `map_payment_events?map_order_id=eq.${mapOrderId}&select=map_order_id,contact_email,stripe_payment_intent_id,amount_paid,currency,paid_at&limit=1`,
        )

        if (paymentEvent) {
          const tokens: Record<string, string> = {
            map_order_id: paymentEvent.map_order_id,
            evaluation_result_id: session.metadata?.["assessment_result_id"] ?? "not linked",
            contact_email: paymentEvent.contact_email,
            map_pathway: session.metadata?.["map_pathway"] ?? "not seated",
            amount_paid: paymentEvent.amount_paid != null ? String(paymentEvent.amount_paid) : "not recorded",
            currency: (paymentEvent.currency ?? "usd").toUpperCase(),
            payment_status: "paid",
            stripe_payment_intent_id: paymentEvent.stripe_payment_intent_id ?? "not recorded",
            paid_at: paymentEvent.paid_at ?? new Date().toISOString(),
          }

          await sendGovernedNotification(env, {
            eventType: "map_payment_completed",
            recipientClass: "operator",
            sourceId: mapOrderId,
            recipientEmail: env.OPERATOR_NOTIFY_EMAIL ?? "",
            tokens,
          })

          if (paymentEvent.contact_email) {
            await sendGovernedNotification(env, {
              eventType: "map_payment_completed",
              recipientClass: "participant",
              sourceId: mapOrderId,
              recipientEmail: paymentEvent.contact_email,
              tokens,
            })
          }
        }
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as StripeCheckoutSession
      const mapOrderId = session.metadata?.["map_order_id"]

      if (mapOrderId) {
        await supabaseFetch(env, `map_payment_events?map_order_id=eq.${mapOrderId}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            payment_status: "canceled",
            webhook_event_id: event.id,
            oar_state: "payment_canceled",
          }),
        })

        await sendGovernedNotification(env, {
          eventType: "map_payment_canceled",
          recipientClass: "operator",
          sourceId: mapOrderId,
          recipientEmail: env.OPERATOR_NOTIFY_EMAIL ?? "",
          tokens: {
            map_order_id: mapOrderId,
            contact_email: session.customer_email ?? session.metadata?.["contact_email"] ?? "not recorded",
            map_pathway: session.metadata?.["map_pathway"] ?? "not seated",
            canceled_at: new Date().toISOString(),
          },
        })

        // Participant notification for a canceled checkout is intentionally not sent —
        // OAR2 marks it "optional only if safe and non-confusing"; logged, not sent.
        await insertDispatchLog(env, {
          event_type: "map_payment_canceled",
          recipient_class: "participant",
          source_table: "map_payment_events",
          source_id: mapOrderId,
          recipient_email: session.customer_email ?? "unknown",
          dispatch_state: "skipped",
          provider: "not_attempted",
          error_message: "participant cancellation notice held by design — optional per OAR2",
          metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
        })
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as StripePaymentIntent
      const mapOrderId = intent.metadata?.["map_order_id"]

      if (mapOrderId) {
        await supabaseFetch(env, `map_payment_events?map_order_id=eq.${mapOrderId}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            stripe_payment_intent_id: intent.id,
            payment_status: "failed",
            webhook_event_id: event.id,
            oar_state: "payment_failed",
          }),
        })

        const [paymentEvent] = await supabaseFetch<MapPaymentEventRow[]>(
          env,
          `map_payment_events?map_order_id=eq.${mapOrderId}&select=map_order_id,contact_email&limit=1`,
        )

        await sendGovernedNotification(env, {
          eventType: "map_payment_failed",
          recipientClass: "operator",
          sourceId: mapOrderId,
          recipientEmail: env.OPERATOR_NOTIFY_EMAIL ?? "",
          tokens: {
            map_order_id: mapOrderId,
            contact_email: paymentEvent?.contact_email ?? "not recorded",
            map_pathway: intent.metadata?.["map_pathway"] ?? "not seated",
            stripe_payment_intent_id: intent.id,
            failed_at: new Date().toISOString(),
          },
        })

        await insertDispatchLog(env, {
          event_type: "map_payment_failed",
          recipient_class: "participant",
          source_table: "map_payment_events",
          source_id: mapOrderId,
          recipient_email: paymentEvent?.contact_email ?? "unknown",
          dispatch_state: "skipped",
          provider: "not_attempted",
          error_message: "participant failure notice held by design — optional per OAR2",
          metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
        })
      }
    }

    await markWebhookEventStatus(env, event.id, "processed")
    return jsonResponse({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "webhook processing failed"
    try {
      await markWebhookEventStatus(env, event.id, "failed", message)
    } catch {
      // best effort — the claim row stays "processing" and will be eligible for
      // retry after the 5-minute window in claim_stripe_webhook_event regardless.
    }
    // Non-2xx so Stripe retries; claim_stripe_webhook_event allows reprocessing
    // once the prior "processing" attempt is more than 5 minutes old.
    return jsonResponse({ error: message }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
