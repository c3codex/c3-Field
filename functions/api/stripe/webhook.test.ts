import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./webhook"

const webhookSecret = "whsec_test_secret"

const env = {
  RESEND_API_KEY: "resend-test",
  OPERATOR_NOTIFY_EMAIL: "operator@example.com",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  STRIPE_WEBHOOK_SECRET: webhookSecret,
}

async function signedRequest(payload: unknown) {
  const rawBody = JSON.stringify(payload)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signedPayload = `${timestamp}.${rawBody}`
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload))
  const signature = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("")

  return new Request("https://example.com/api/stripe/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": `t=${timestamp},v1=${signature}`,
    },
    body: rawBody,
  })
}

async function withMockedFetch(
  handler: (url: string, method: string, body: string) => Response | Promise<Response>,
  run: () => Promise<unknown>,
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const body = String(init?.body ?? "")
    return handler(url, method, body)
  }) as typeof fetch
  try {
    return await run()
  } finally {
    globalThis.fetch = originalFetch
  }
}

const templates: Record<string, { template_key: string; subject: string; body: string }> = {
  "map_payment_completed:operator": {
    template_key: "map_payment_completed_operator_v1",
    subject: "MAP payment received — {{contact_email}}",
    body: "Order: {{map_order_id}} Pathway: {{map_pathway}}",
  },
  "map_payment_completed:participant": {
    template_key: "map_payment_completed_participant_v1",
    subject: "Your MAP payment is confirmed",
    body: "Pathway: {{map_pathway}}",
  },
  "map_payment_canceled:operator": {
    template_key: "map_payment_canceled_operator_v1",
    subject: "MAP payment canceled — {{contact_email}}",
    body: "Order: {{map_order_id}}",
  },
  "map_payment_failed:operator": {
    template_key: "map_payment_failed_operator_v1",
    subject: "MAP payment failed — {{contact_email}}",
    body: "Order: {{map_order_id}}",
  },
}

function baseRouter(calls: Array<{ url: string; method: string; body: string }>) {
  return (url: string, method: string, body: string): Response => {
    calls.push({ url, method, body })

    if (url.includes("rpc/claim_stripe_webhook_event")) {
      return Response.json([{ should_process: true, duplicate_event: false, prior_status: "new" }])
    }
    if (url.includes("measures_notification_dispatch_log") && method === "GET") {
      return Response.json([]) // nothing sent yet
    }
    if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
      return new Response(null, { status: 201 })
    }
    if (url.includes("measures_notification_template")) {
      const eventType = /event_type=eq\.([a-z_]+)/.exec(url)?.[1]
      const recipientClass = /recipient_class=eq\.([a-z_]+)/.exec(url)?.[1]
      const key = `${eventType}:${recipientClass}`
      return Response.json(templates[key] ? [templates[key]] : [])
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "PATCH") {
      return new Response(null, { status: 204 })
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "GET") {
      return Response.json([
        {
          map_order_id: "order-1",
          contact_email: "participant@example.com",
          stripe_payment_intent_id: "pi_123",
          amount_paid: 77700,
          currency: "usd",
          paid_at: "2026-07-06T00:00:00.000Z",
        },
      ])
    }
    if (url.includes("api.resend.com/emails")) {
      return Response.json({ id: `resend-${calls.length}` })
    }
    if (url.includes("stripe_webhook_events") && method === "PATCH") {
      return new Response(null, { status: 204 })
    }
    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }
}

test("rejects a request with a bad signature", async () => {
  const response = await onRequestPost({
    request: new Request("https://example.com/api/stripe/webhook", {
      method: "POST",
      headers: { "content-type": "application/json", "stripe-signature": "t=1,v1=bad" },
      body: "{}",
    }),
    env,
  } as never)
  assert.equal(response.status, 400)
})

test("checkout.session.completed marks payment paid and dispatches operator + participant notifications", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = {
    id: "evt_1",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_intent: "pi_123",
        payment_status: "paid",
        amount_total: 77700,
        currency: "usd",
        customer_email: "participant@example.com",
        metadata: { map_order_id: "order-1", map_pathway: "optimization" },
      },
    },
  }

  const response = await withMockedFetch(baseRouter(calls), async () =>
    onRequestPost({ request: await signedRequest(event), env } as never),
  )

  assert.equal((response as Response).status, 200)

  const resendCalls = calls.filter((c) => c.url.includes("api.resend.com"))
  assert.equal(resendCalls.length, 2, "expected one operator email and one participant email")

  const recipients = resendCalls.map((c) => (JSON.parse(c.body) as { to: string[] }).to[0])
  assert.deepEqual(recipients.sort(), ["operator@example.com", "participant@example.com"].sort())

  const markProcessed = calls.find((c) => c.url.includes("stripe_webhook_events") && c.method === "PATCH")
  assert.ok(markProcessed)
  assert.equal((JSON.parse(markProcessed!.body) as { status: string }).status, "processed")
})

test("duplicate webhook delivery is blocked before any side effects", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = {
    id: "evt_dup",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_intent: "pi_123",
        payment_status: "paid",
        amount_total: 77700,
        currency: "usd",
        customer_email: "participant@example.com",
        metadata: { map_order_id: "order-1", map_pathway: "optimization" },
      },
    },
  }

  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.includes("rpc/claim_stripe_webhook_event")) {
        return Response.json([{ should_process: false, duplicate_event: true, prior_status: "processed" }])
      }
      throw new Error(`Unexpected fetch after duplicate should short-circuit: ${method} ${url}`)
    },
    async () => onRequestPost({ request: await signedRequest(event), env } as never),
  )

  const body = await (response as Response).json() as Record<string, unknown>
  assert.equal(body.duplicate, true)
  assert.equal(calls.length, 1, "only the idempotency claim call should have been made")
})

test("already-sent notification is not re-sent on a second call", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = {
    id: "evt_2",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        payment_intent: "pi_123",
        payment_status: "paid",
        amount_total: 77700,
        currency: "usd",
        customer_email: "participant@example.com",
        metadata: { map_order_id: "order-1", map_pathway: "optimization" },
      },
    },
  }

  const router = (url: string, method: string, body: string): Response => {
    calls.push({ url, method, body })
    if (url.includes("rpc/claim_stripe_webhook_event")) {
      return Response.json([{ should_process: true, duplicate_event: true, prior_status: "processing" }])
    }
    if (url.includes("measures_notification_dispatch_log") && method === "GET") {
      return Response.json([{ id: "already-sent" }]) // both operator + participant already sent
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "PATCH") {
      return new Response(null, { status: 204 })
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "GET") {
      return Response.json([
        { map_order_id: "order-1", contact_email: "participant@example.com", stripe_payment_intent_id: "pi_123", amount_paid: 77700, currency: "usd", paid_at: null },
      ])
    }
    if (url.includes("stripe_webhook_events") && method === "PATCH") {
      return new Response(null, { status: 204 })
    }
    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }

  await withMockedFetch(router, async () => onRequestPost({ request: await signedRequest(event), env } as never))

  const resendCalls = calls.filter((c) => c.url.includes("api.resend.com"))
  assert.equal(resendCalls.length, 0, "no email should be sent when already marked sent")
})

test("checkout.session.expired marks canceled and notifies operator only", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = {
    id: "evt_3",
    type: "checkout.session.expired",
    data: {
      object: {
        id: "cs_2",
        payment_intent: null,
        payment_status: "unpaid",
        amount_total: null,
        currency: null,
        customer_email: "participant@example.com",
        metadata: { map_order_id: "order-2", map_pathway: "foundational" },
      },
    },
  }

  const response = await withMockedFetch(baseRouter(calls), async () =>
    onRequestPost({ request: await signedRequest(event), env } as never),
  )

  assert.equal((response as Response).status, 200)
  const resendCalls = calls.filter((c) => c.url.includes("api.resend.com"))
  assert.equal(resendCalls.length, 1)
  assert.equal((JSON.parse(resendCalls[0].body) as { to: string[] }).to[0], "operator@example.com")

  const skippedLog = calls.find(
    (c) =>
      c.url.endsWith("/rest/v1/measures_notification_dispatch_log") &&
      c.method === "POST" &&
      (JSON.parse(c.body) as { recipient_class?: string }).recipient_class === "participant",
  )
  assert.ok(skippedLog)
  assert.equal((JSON.parse(skippedLog!.body) as { dispatch_state: string }).dispatch_state, "skipped")
})

test("payment_intent.payment_failed marks failed and notifies operator only", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = {
    id: "evt_4",
    type: "payment_intent.payment_failed",
    data: {
      object: {
        id: "pi_999",
        metadata: { map_order_id: "order-1", map_pathway: "optimization" },
        last_payment_error: { message: "card_declined" },
      },
    },
  }

  const response = await withMockedFetch(baseRouter(calls), async () =>
    onRequestPost({ request: await signedRequest(event), env } as never),
  )

  assert.equal((response as Response).status, 200)
  const resendCalls = calls.filter((c) => c.url.includes("api.resend.com"))
  assert.equal(resendCalls.length, 1)
  assert.equal((JSON.parse(resendCalls[0].body) as { to: string[] }).to[0], "operator@example.com")
})

test("ignores unrelated event types without side effects beyond the idempotency claim", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const event = { id: "evt_5", type: "charge.refunded", data: { object: { id: "ch_1", metadata: {} } } }

  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    async () => onRequestPost({ request: await signedRequest(event), env } as never),
  )

  assert.equal((response as Response).status, 200)
  const body = await (response as Response).json() as Record<string, unknown>
  assert.equal(body.ignored, "charge.refunded")
  assert.equal(calls.length, 0)
})
