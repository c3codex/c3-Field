// POST /api/map/create-checkout-session
// Creates a Stripe Checkout Session server-side from the DB-held MAP C2 circuit.
// Frontend must not hardcode prices, product IDs, or Stripe URLs.
// OAR2: oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1

import { validateSystemEnvironmentCurrent } from "../notchazz-system-environment-guard"

type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  STRIPE_SECRET_KEY?: string
  STRIPE_MAP_FOUNDATIONAL_PRICE_ID?: string
  STRIPE_MAP_OPTIMIZATION_PRICE_ID?: string
  STRIPE_MAP_REMEDIATION_PRICE_ID?: string
  STRIPE_PRICE_PREDEPLOY_MAP?: string
  STRIPE_PRICE_OPTIMIZATION_MAP?: string
  STRIPE_PRICE_REMEDIATION_MAP?: string
}

type MapPathway = "foundational" | "optimization" | "remediation"

type MapC2CircuitRow = {
  map_circuit_key: string
  map_pathway: MapPathway
  product_name: string
  amount_usd: number
  currency: string
  stripe_product_id: string | null
  stripe_price_id: string | null
  stripe_price_env_key: string
  applicable_standing_keys: string[]
}

type MapPaymentEventRow = {
  map_order_id: string
  current_state_key: string | null
}

type CurrentResolutionRow = {
  resolution_standing?: string
  current_state_key?: string | null
  env_key?: string | null
}

type EnvironmentRow = {
  env_key: string
  system_key: string
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

function isMapPathway(value: unknown): value is MapPathway {
  return value === "foundational" || value === "optimization" || value === "remediation"
}

function stripePriceForPathway(env: Env, pathway: MapPathway) {
  if (pathway === "foundational") {
    return env.STRIPE_MAP_FOUNDATIONAL_PRICE_ID ?? env.STRIPE_PRICE_PREDEPLOY_MAP
  }
  if (pathway === "optimization") {
    return env.STRIPE_MAP_OPTIMIZATION_PRICE_ID ?? env.STRIPE_PRICE_OPTIMIZATION_MAP
  }
  return env.STRIPE_MAP_REMEDIATION_PRICE_ID ?? env.STRIPE_PRICE_REMEDIATION_MAP
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
      map_pathway?: string
      contact_email?: string
      current_state_key?: string
      success_url?: string
      cancel_url?: string
    }

    const { evaluation_result_id, map_standing, map_pathway, success_url, cancel_url } = body
    const currentStateKey = typeof body.current_state_key === "string" && body.current_state_key.trim()
      ? body.current_state_key.trim()
      : null
    const contact_email = normalizeEmail(body.contact_email ?? "")

    if (!map_standing) return jsonResponse({ error: "map_standing is required" }, 400)
    if (!isMapPathway(map_pathway)) {
      return jsonResponse({ error: "approved map_pathway is required" }, 400)
    }
    if (!contact_email || !isValidEmail(contact_email)) {
      return jsonResponse({ error: "valid contact_email is required" }, 400)
    }
    if (!currentStateKey) {
      return jsonResponse({ error: "current_state_key is required" }, 400)
    }
    if (!success_url || !cancel_url) {
      return jsonResponse({ error: "success_url and cancel_url are required" }, 400)
    }

    const activeSystemKey = "measures_registry"
    const envKey = "env_measures_registry"
    const [currentResolution] = await supabaseFetch<CurrentResolutionRow[]>(env, "rpc/resolve_c3_current", {
      method: "POST",
      body: JSON.stringify({ p_env_key: envKey }),
    })
    const [environmentRow] = await supabaseFetch<EnvironmentRow[]>(
      env,
      `c3_environment?env_key=eq.${envKey}&select=env_key,system_key&limit=1`,
    )
    const currentGuard = validateSystemEnvironmentCurrent({
      active_system_key: activeSystemKey,
      target_env_key: envKey,
      environment_system_key: environmentRow?.system_key ?? null,
      resolved_current_state_key: currentResolution?.current_state_key ?? null,
      resolved_current_env_key: currentResolution?.env_key ?? null,
      target_registry_system_key: activeSystemKey,
      evidence_system_key: activeSystemKey,
      mutation_system_key: activeSystemKey,
      source_execution_instance_id: "resolve_measures_map_identity_confirmation_current_payment_codex_001",
    })
    if (currentGuard.standing === "hold" || currentResolution?.current_state_key !== currentStateKey) {
      return jsonResponse({
        error: "system/environment/current mismatch",
        notchazz: currentGuard,
        expected_current_state_key: currentResolution?.current_state_key ?? null,
      }, 409)
    }

    // Load MAP payment options from the C2 circuit; DB state remains server-side authority.
    const paymentOptions = await supabaseFetch<MapC2CircuitRow[]>(
      env,
      "map_c2_circuit?select=map_circuit_key,map_pathway,product_name,amount_usd,currency,stripe_product_id,stripe_price_id,stripe_price_env_key,applicable_standing_keys&release_state=eq.active",
    )

    const paymentOption = paymentOptions.find(
      (c) => c.map_pathway === map_pathway
        && Array.isArray(c.applicable_standing_keys)
        && c.applicable_standing_keys.includes(map_standing),
    )

    if (!paymentOption) {
      return jsonResponse({ error: "No MAP payment option found for the provided evaluation standing" }, 404)
    }

    const stripePriceId = stripePriceForPathway(env, map_pathway)
    if (!stripePriceId || !stripePriceId.startsWith("price_")) {
      return jsonResponse({ error: "MAP payment option configuration is incomplete" }, 503)
    }

    // Record payment event before redirecting to Stripe
    const [paymentEvent] = await supabaseFetch<MapPaymentEventRow[]>(env, "map_payment_events", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        evaluation_result_id: evaluation_result_id ?? null,
        map_standing,
        map_circuit_key: paymentOption.map_circuit_key,
        contact_email,
        current_state_key: currentStateKey,
        payment_status: "checkout_created",
        oar_state: "checkout_initiated",
        scheduling_state: "held",
      }),
    })

    if (!paymentEvent?.map_order_id) {
      return jsonResponse({ error: "Payment record could not be created" }, 500)
    }

    // Create Stripe Checkout Session from the verified server-side Price ID.
    const params = new URLSearchParams({
      "line_items[0][price]": stripePriceId,
      "line_items[0][quantity]": "1",
      mode: "payment",
      success_url: `${success_url}?map_order_id=${paymentEvent.map_order_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url,
      "metadata[map_order_id]": paymentEvent.map_order_id,
      "metadata[system]": "measures_registry",
      "metadata[offer_type]": "map",
      "metadata[map_pathway]": map_pathway,
      "metadata[map_standing]": map_standing,
      "metadata[map_circuit_key]": paymentOption.map_circuit_key,
      "metadata[assessment_result_id]": evaluation_result_id ?? "",
      "metadata[current_state_key]": currentStateKey ?? "",
      "metadata[contact_email]": contact_email,
      "metadata[creates_seat]": "false",
      "metadata[creates_c3_key]": "false",
      "metadata[creates_certification]": "false",
      "payment_intent_data[metadata][map_order_id]": paymentEvent.map_order_id,
      "payment_intent_data[metadata][system]": "measures_registry",
      "payment_intent_data[metadata][offer_type]": "map",
      "payment_intent_data[metadata][map_pathway]": map_pathway,
      "payment_intent_data[metadata][assessment_result_id]": evaluation_result_id ?? "",
      "payment_intent_data[metadata][current_state_key]": currentStateKey ?? "",
      "payment_intent_data[metadata][creates_seat]": "false",
      "payment_intent_data[metadata][creates_c3_key]": "false",
      "payment_intent_data[metadata][creates_certification]": "false",
      customer_email: contact_email,
    })

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `map-checkout-${paymentEvent.map_order_id}`,
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
      current_state_key: paymentEvent.current_state_key ?? currentStateKey,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "checkout session creation failed"
    return jsonResponse({ error: message }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
