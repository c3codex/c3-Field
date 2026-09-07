type Env = {
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type CaptureRow = {
  id: string
  contact_name: string | null
  contact_email: string | null
  institution_name: string | null
  metadata: Record<string, unknown> | null
}

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders })
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function isOpaqueDeliveryToken(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
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

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const url = new URL(request.url)
    const token = asString(url.searchParams.get("token"))
    if (!token || !isOpaqueDeliveryToken(token)) {
      return jsonResponse({ error: "valid evaluation delivery token is required" }, 400)
    }

    const rows = await supabaseFetch<CaptureRow[]>(
      env,
      `measures_iis_eval_gate1_capture?metadata->>evaluation_delivery_token=eq.${encodeURIComponent(token)}&select=id,contact_name,contact_email,institution_name,metadata&limit=1`,
    )
    const capture = rows[0]
    if (!capture) return jsonResponse({ error: "evaluation delivery token not found" }, 404)

    const metadata = capture.metadata ?? {}
    const report = asRecord(metadata.environmental_standing_report)
    const evaluation = asRecord(report?.evaluation_v2)
    const c2Resolution = asRecord(metadata.c2_resolution)
    const currentStateKey = asString(c2Resolution?.current_state_key) ?? asString(metadata.current_state_key)

    if (!report || !evaluation) {
      return jsonResponse({ error: "persisted evaluation is not available for this delivery token" }, 409)
    }

    return jsonResponse({
      delivery: {
        permitted_encounter: asString(metadata.evaluation_delivery_permitted_encounter) ?? "marble_chamber_orientation",
        continuation: asString(metadata.evaluation_delivery_continuation) ?? "map_the_environment",
      },
      pendingReport: {
        assessmentRef: asString(metadata.assessment_ref) ?? asString(evaluation.assessment_ref),
        report,
        emailArtifact: asRecord(metadata.structured_email_artifact),
        fields: {
          institution_name: capture.institution_name ?? "",
          contact_name: capture.contact_name ?? "",
          contact_email: capture.contact_email ?? "",
        },
        assessmentCompletion: null,
        reportContract: null,
        c2Resolution: {
          ...(c2Resolution ?? {}),
          current_state_key: currentStateKey,
        },
      },
    })
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "evaluation delivery lookup failed" },
      500,
    )
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
