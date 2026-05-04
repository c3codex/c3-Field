type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type CaptureRow = {
  capture_id: string
  hold_target_key: string
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function supabaseFetch<T>(
  env: Env,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured")
  }

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
    const { email: rawEmail, offering_key: offeringKey } = (await request
      .json()
      .catch(() => ({}))) as {
      email?: string
      offering_key?: string
    }

    const email = normalizeEmail(rawEmail ?? "")

    if (!email || !isValidEmail(email)) {
      return jsonResponse({ error: "valid email is required" }, 400)
    }

    if (!offeringKey) {
      return jsonResponse({ error: "offering_key is required" }, 400)
    }

    const [capture] = await supabaseFetch<CaptureRow[]>(
      env,
      "rpc/create_measures_seat_hold_capture",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          p_email: email,
          p_offering_key: offeringKey,
        }),
      },
    )

    if (!capture) {
      return jsonResponse({ error: "seat hold capture could not be created" }, 500)
    }

    return jsonResponse({
      capture_id: capture.capture_id,
      hold_target_key: capture.hold_target_key,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "seat hold capture failed"
    const status =
      message.includes("not found")
        ? 404
        : message.includes("not open") ||
            message.includes("already exists") ||
            message.includes("not seated")
          ? 409
          : 500

    return jsonResponse({ error: message }, status)
  }
}

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
