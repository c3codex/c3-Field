import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import test from "node:test"

import { onRequestPost } from "./webhook"

const secret = "whsec_test_map_only"
const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  STRIPE_WEBHOOK_SECRET: secret,
}

type MockOptions = {
  duplicate?: boolean
}

function mapMetadata(overrides: Record<string, string> = {}) {
  return {
    map_order_id: "00000000-0000-4000-8000-000000000001",
    system: "measures_registry",
    offer_type: "map",
    map_pathway: "foundational",
    creates_seat: "false",
    creates_c3_key: "false",
    creates_certification: "false",
    ...overrides,
  }
}

function stripeEvent(type: string, object: Record<string, unknown> = {}) {
  return {
    id: `evt_${type.replace(/\W/g, "_")}`,
    type,
    data: {
      object: {
        id: type.startsWith("payment_intent.") ? "pi_test" : "cs_test",
        metadata: mapMetadata(),
        ...object,
      },
    },
  }
}

function signedRequest(event: unknown, signatureSecret = secret) {
  const body = JSON.stringify(event)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const signature = createHmac("sha256", signatureSecret)
    .update(`${timestamp}.${body}`)
    .digest("hex")
  return new Request("https://example.com/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": `t=${timestamp},v1=${signature}` },
    body,
  })
}

async function invoke(event: unknown, options: MockOptions = {}) {
  const calls: Array<{ url: string; method: string; body: unknown }> = []
  const originalFetch = globalThis.fetch

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const body = init?.body ? JSON.parse(String(init.body)) : null
    calls.push({ url, method, body })

    if (url.includes("/rest/v1/rpc/claim_stripe_webhook_event")) {
      return Response.json([{
        should_process: !options.duplicate,
        duplicate_event: Boolean(options.duplicate),
        prior_status: options.duplicate ? "processed" : "new",
      }])
    }

    if (url.includes("/rest/v1/map_payment_events?") || url.includes("/rest/v1/stripe_webhook_events?")) {
      return new Response(null, { status: 204 })
    }

    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }) as typeof fetch

  try {
    const response = await onRequestPost({ request: signedRequest(event), env } as never)
    return { response, body: await response.json() as Record<string, unknown>, calls }
  } finally {
    globalThis.fetch = originalFetch
  }
}

test("rejects an invalid Stripe signature before persistence", async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(null, { status: 500 })
  }) as typeof fetch

  try {
    const event = stripeEvent("checkout.session.completed", { payment_status: "paid" })
    const response = await onRequestPost({ request: signedRequest(event, "wrong-secret"), env } as never)
    assert.equal(response.status, 400)
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("returns 200 for a duplicate event without repeating fulfillment", async () => {
  const result = await invoke(
    stripeEvent("checkout.session.completed", { payment_status: "paid" }),
    { duplicate: true },
  )
  assert.equal(result.response.status, 200)
  assert.equal(result.body.duplicate, true)
  assert.equal(result.calls.filter((call) => call.url.includes("map_payment_events")).length, 0)
})

test("fulfills a paid MAP checkout once", async () => {
  const result = await invoke(stripeEvent("checkout.session.completed", {
    payment_status: "paid",
    payment_intent: "pi_paid",
    amount_total: 33300,
    currency: "usd",
  }))
  assert.equal(result.response.status, 200)
  const paymentCalls = result.calls.filter((call) => call.url.includes("map_payment_events"))
  assert.equal(paymentCalls.length, 1)
  assert.deepEqual(paymentCalls[0].body, {
    stripe_payment_intent_id: "pi_paid",
    payment_status: "paid",
    amount_paid: 33300,
    currency: "usd",
    paid_at: (paymentCalls[0].body as Record<string, unknown>).paid_at,
    webhook_event_id: "evt_checkout_session_completed",
    oar_state: "payment_confirmed",
    scheduling_state: "released",
  })
})

test("rejects completion when payment is not paid", async () => {
  const result = await invoke(stripeEvent("checkout.session.completed", { payment_status: "unpaid" }))
  assert.equal(result.response.status, 500)
  assert.equal(result.calls.filter((call) => call.url.includes("map_payment_events")).length, 0)
  const eventUpdates = result.calls.filter((call) => call.url.includes("stripe_webhook_events"))
  assert.equal((eventUpdates.at(-1)?.body as Record<string, unknown>).status, "failed")
})

test("records an expired checkout without opening access", async () => {
  const result = await invoke(stripeEvent("checkout.session.expired"))
  assert.equal(result.response.status, 200)
  const payment = result.calls.find((call) => call.url.includes("map_payment_events"))
  assert.equal((payment?.body as Record<string, unknown>).payment_status, "expired")
  assert.equal((payment?.body as Record<string, unknown>).scheduling_state, "held")
})

test("records a failed payment intent without opening access", async () => {
  const result = await invoke(stripeEvent("payment_intent.payment_failed"))
  assert.equal(result.response.status, 200)
  const payment = result.calls.find((call) => call.url.includes("map_payment_events"))
  assert.equal((payment?.body as Record<string, unknown>).payment_status, "failed")
  assert.equal((payment?.body as Record<string, unknown>).scheduling_state, "held")
})

test("rejects missing MAP metadata", async () => {
  const result = await invoke(stripeEvent("checkout.session.completed", {
    payment_status: "paid",
    metadata: {},
  }))
  assert.equal(result.response.status, 500)
  assert.equal(result.calls.filter((call) => call.url.includes("map_payment_events")).length, 0)
})

test("rejects an unapproved MAP pathway", async () => {
  const result = await invoke(stripeEvent("checkout.session.completed", {
    payment_status: "paid",
    metadata: mapMetadata({ map_pathway: "seat" }),
  }))
  assert.equal(result.response.status, 500)
  assert.equal(result.calls.filter((call) => call.url.includes("map_payment_events")).length, 0)
})
