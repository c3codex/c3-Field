import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./create-checkout-session"

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  STRIPE_SECRET_KEY: "sk_test",
  STRIPE_MAP_FOUNDATIONAL_PRICE_ID: "price_foundational",
  STRIPE_MAP_OPTIMIZATION_PRICE_ID: "price_optimization",
  STRIPE_MAP_REMEDIATION_PRICE_ID: "price_remediation",
}

const pathwayOptions = {
  foundational: {
    map_circuit_key: "pre_deployment",
    map_pathway: "foundational",
    product_name: "MAP Foundational Review",
    amount_usd: 333,
    currency: "usd",
    stripe_product_id: "prod_foundational",
    stripe_price_id: "price_foundational",
    stripe_price_env_key: "STRIPE_MAP_FOUNDATIONAL_PRICE_ID",
    applicable_standing_keys: ["eval_result_01"],
  },
  optimization: {
    map_circuit_key: "optimization",
    map_pathway: "optimization",
    product_name: "MAP Optimization Review",
    amount_usd: 777,
    currency: "usd",
    stripe_product_id: "prod_optimization",
    stripe_price_id: "price_optimization",
    stripe_price_env_key: "STRIPE_MAP_OPTIMIZATION_PRICE_ID",
    applicable_standing_keys: ["eval_result_02"],
  },
  remediation: {
    map_circuit_key: "remediation",
    map_pathway: "remediation",
    product_name: "MAP Remediation Review",
    amount_usd: 999,
    currency: "usd",
    stripe_product_id: "prod_remediation",
    stripe_price_id: "price_remediation",
    stripe_price_env_key: "STRIPE_MAP_REMEDIATION_PRICE_ID",
    applicable_standing_keys: ["eval_result_03"],
  },
} as const

async function invoke(pathway: keyof typeof pathwayOptions, clientPriceId?: string) {
  const paymentOption = pathwayOptions[pathway]
  const calls: Array<{ url: string; method: string; body: string; headers: Headers }> = []
  const originalFetch = globalThis.fetch

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const body = String(init?.body ?? "")
    const headers = new Headers(init?.headers)
    calls.push({ url, method, body, headers })

    if (url.endsWith("/rest/v1/rpc/resolve_c3_current") && method === "POST") {
      return Response.json([{
        resolution_standing: "resolved_current_state",
        current_state_key: "current_env_measures_registry_v1",
        env_key: "env_measures_registry",
      }])
    }
    if (url.includes("c3_environment?env_key=eq.env_measures_registry")) {
      return Response.json([{ env_key: "env_measures_registry", system_key: "measures_registry" }])
    }
    if (url.includes("map_c2_circuit?")) return Response.json(Object.values(pathwayOptions))
    if (url.endsWith("/rest/v1/map_payment_events") && method === "POST") {
      return Response.json([{
        map_order_id: "00000000-0000-4000-8000-000000000001",
        current_state_key: "current_env_measures_registry_v1",
      }])
    }
    if (url.includes("api.stripe.com/v1/checkout/sessions")) {
      return Response.json({ id: "cs_test", url: "https://checkout.stripe.test/session" })
    }
    if (url.includes("map_payment_events?map_order_id=eq.")) return new Response(null, { status: 204 })
    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }) as typeof fetch

  try {
    const response = await onRequestPost({
      request: new Request("https://example.com/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          evaluation_result_id: paymentOption.applicable_standing_keys[0],
          current_state_key: "current_env_measures_registry_v1",
          map_standing: paymentOption.applicable_standing_keys[0],
          map_pathway: pathway,
          contact_email: "operator@example.com",
          success_url: "https://example.com/map-confirmation",
          cancel_url: "https://example.com/map-review",
          price_id: clientPriceId,
        }),
      }),
      env,
    } as never)
    return { response, body: await response.json() as Record<string, unknown>, calls }
  } finally {
    globalThis.fetch = originalFetch
  }
}

for (const pathway of ["foundational", "optimization", "remediation"] as const) {
  test(`creates ${pathway} checkout with its server-side price`, async () => {
    const result = await invoke(pathway, "price_client_supplied_must_be_ignored")
    assert.equal(result.response.status, 200)
    const stripeCall = result.calls.find((call) => call.url.includes("api.stripe.com"))
    assert.ok(stripeCall)
    const params = new URLSearchParams(stripeCall.body)
    assert.equal(params.get("line_items[0][price]"), env[`STRIPE_MAP_${pathway.toUpperCase()}_PRICE_ID` as keyof typeof env])
    assert.equal(params.has("line_items[0][price_data][unit_amount]"), false)
    assert.equal(params.get("metadata[offer_type]"), "map")
    assert.equal(params.get("metadata[map_pathway]"), pathway)
    assert.equal(params.get("metadata[current_state_key]"), "current_env_measures_registry_v1")
    assert.equal(params.get("metadata[creates_seat]"), "false")
    assert.match(stripeCall.headers.get("Idempotency-Key") ?? "", /^map-checkout-/)

    const paymentInsert = result.calls.find((call) => call.url.endsWith("/rest/v1/map_payment_events"))
    assert.ok(paymentInsert)
    assert.equal(JSON.parse(paymentInsert.body).current_state_key, "current_env_measures_registry_v1")
  })
}

test("rejects an unapproved pathway before creating records", async () => {
  const originalFetch = globalThis.fetch
  let fetchCount = 0
  globalThis.fetch = (async () => {
    fetchCount += 1
    return new Response(null, { status: 500 })
  }) as typeof fetch

  try {
    const response = await onRequestPost({
      request: new Request("https://example.com/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          map_standing: "eval_result_01",
          map_pathway: "seat",
          contact_email: "operator@example.com",
          success_url: "https://example.com/map-confirmation",
          cancel_url: "https://example.com/map-review",
        }),
      }),
      env,
    } as never)
    assert.equal(response.status, 400)
    assert.equal(fetchCount, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})
