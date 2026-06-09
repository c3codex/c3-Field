// GET /api/map/payment-status/:map_order_id
// Returns payment standing for a MAP order. Used by frontend to confirm payment after Stripe return.
// Only returns paid + released orders — no pending state is surfaced publicly.
// OAR2: oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1

type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type MapPaymentEventRow = {
  map_order_id: string
  map_standing: string
  map_circuit_key: string
  payment_status: string
  scheduling_state: string
  paid_at: string | null
  contact_email: string
}

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
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

export const onRequestGet: PagesFunction<Env, "map_order_id"> = async ({ params, env }) => {
  try {
    const mapOrderId = params.map_order_id
    if (!mapOrderId || typeof mapOrderId !== "string") {
      return jsonResponse({ error: "map_order_id is required" }, 400)
    }

    const [event] = await supabaseFetch<MapPaymentEventRow[]>(
      env,
      `map_payment_events?map_order_id=eq.${encodeURIComponent(mapOrderId)}&select=map_order_id,map_standing,map_circuit_key,payment_status,scheduling_state,paid_at,contact_email`,
    )

    if (!event) return jsonResponse({ error: "MAP order not found" }, 404)

    // Never reveal scheduling release to client without confirmed payment
    const schedulingReleased = event.payment_status === "paid" && event.scheduling_state === "released"

    return jsonResponse({
      map_order_id: event.map_order_id,
      payment_status: event.payment_status,
      scheduling_released: schedulingReleased,
      map_circuit_key: schedulingReleased ? event.map_circuit_key : null,
      paid_at: schedulingReleased ? event.paid_at : null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "payment status lookup failed"
    return jsonResponse({ error: message }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
