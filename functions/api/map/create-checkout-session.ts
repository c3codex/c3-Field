// POST /api/map/create-checkout-session
// Creates a Stripe Checkout Session server-side from DB-held MAP commerce contract.
// Frontend must not hardcode prices, product IDs, or Stripe URLs.
// OAR2: oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1

type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  STRIPE_SECRET_KEY?: string
}

type MapCommerceContract = {
  contract_key: string
  map_circuit_key: string
  product_name: string
  amount_usd: number
  currency: string
  stripe_product_id: string | null
  applicable_standing_keys: string[]
  seat_contract_state: string
  seat_hold_notice: string
}

type MapPaymentEventRow = {
  map_order_id: string
}

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
  try {
    const stripeKey = env.STRIPE_SECRET_KEY
    if (!stripeKey) return jsonResponse({ error: "Payment processor is not configured" }, 503)

    const body = (await request.json().catch(() => ({}))) as {
      evaluation_result_id?: string
      map_standing?: string
      contact_email?: string
      success_url?: string
      cancel_url?: string
    }

    const { evaluation_result_id, map_standing, success_url, cancel_url } = body
    const contact_email = normalizeEmail(body.contact_email ?? "")

    if (!map_standing) return jsonResponse({ error: "map_standing is required" }, 400)
    if (!contact_email || !isValidEmail(contact_email)) {
      return jsonResponse({ error: "valid contact_email is required" }, 400)
    }
    if (!success_url || !cancel_url) {
      return jsonResponse({ error: "success_url and cancel_url are required" }, 400)
    }

    // Load MAP contracts from DB — server-side authority only
    const contracts = await supabaseFetch<MapCommerceContract[]>(
      env,
      "map_commerce_contracts?select=contract_key,map_circuit_key,product_name,amount_usd,currency,stripe_product_id,applicable_standing_keys,seat_contract_state,seat_hold_notice&release_state=eq.active",
    )

    const contract = contracts.find(
      (c) => Array.isArray(c.applicable_standing_keys) && c.applicable_standing_keys.includes(map_standing),
    )

    if (!contract) {
      return jsonResponse({ error: "No MAP contract found for the provided evaluation standing" }, 404)
    }

    if (!contract.stripe_product_id) {
      return jsonResponse({ error: "MAP contract payment configuration is incomplete" }, 503)
    }

    // Record payment event before redirecting to Stripe
    const [paymentEvent] = await supabaseFetch<MapPaymentEventRow[]>(env, "map_payment_events", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        evaluation_result_id: evaluation_result_id ?? null,
        map_standing,
        map_circuit_key: contract.map_circuit_key,
        contract_key: contract.contract_key,
        contact_email,
        payment_status: "checkout_created",
        oar_state: "checkout_initiated",
        scheduling_state: "held",
      }),
    })

    if (!paymentEvent?.map_order_id) {
      return jsonResponse({ error: "Payment record could not be created" }, 500)
    }

    // Create Stripe Checkout Session with price_data — no static price IDs required
    const params = new URLSearchParams({
      "line_items[0][price_data][currency]": contract.currency,
      "line_items[0][price_data][unit_amount]": String(contract.amount_usd * 100),
      "line_items[0][price_data][product]": contract.stripe_product_id,
      "line_items[0][quantity]": "1",
      mode: "payment",
      success_url: `${success_url}?map_order_id=${paymentEvent.map_order_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url,
      "metadata[map_order_id]": paymentEvent.map_order_id,
      "metadata[map_standing]": map_standing,
      "metadata[map_circuit_key]": contract.map_circuit_key,
      "metadata[contact_email]": contact_email,
      customer_email: contact_email,
    })

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    })

    if (!stripeResponse.ok) {
      const stripeErr = (await stripeResponse.json().catch(() => ({}))) as { error?: { message?: string } }
      return jsonResponse(
        { error: stripeErr.error?.message ?? "Stripe checkout session could not be created" },
        502,
      )
    }

    const session = (await stripeResponse.json()) as { id: string; url: string }

    // Record Stripe session ID
    await supabaseFetch(
      env,
      `map_payment_events?map_order_id=eq.${paymentEvent.map_order_id}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({ stripe_checkout_session_id: session.id }),
      },
    )

    return jsonResponse({
      checkout_url: session.url,
      map_order_id: paymentEvent.map_order_id,
      session_id: session.id,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "checkout session creation failed"
    return jsonResponse({ error: message }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
