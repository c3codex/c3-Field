// POST /api/dispatch-assessment-operator-notification
// Sends the governed, DB-templated internal operator alert for a completed
// AI Operations Assessment. Distinct from dispatch-assessment-notification.ts,
// which sends the (separately gated, consent-checked) participant confirmation —
// that function and its notification_state semantics are untouched by this one.
// OAR2: oar2_seat_assessment_and_payment_notification_dispatch_v1

type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  OPERATOR_NOTIFY_EMAIL?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type AssessmentCaptureRow = {
  id: string
  institution_name: string
  contact_name: string
  contact_email: string
  created_at: string
  metadata: Record<string, unknown> | null
}

type TemplateRow = {
  template_key: string
  subject: string
  body: string
}

const EVENT_TYPE = "assessment_completed"
const RECIPIENT_CLASS = "operator"
const SOURCE_TABLE = "measures_iis_eval_gate1_capture"

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

async function supabaseFetch<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
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

async function insertDispatchLog(env: Env, payload: Record<string, unknown>) {
  await supabaseFetch(env, "measures_notification_dispatch_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "RESEND_API_KEY is not configured" }, 503)
    }
    if (!env.OPERATOR_DISPATCH_KEY) {
      return jsonResponse({ error: "OPERATOR_DISPATCH_KEY is not configured" }, 503)
    }
    if (!env.OPERATOR_NOTIFY_EMAIL) {
      return jsonResponse(
        { error: "OPERATOR_NOTIFY_EMAIL is not configured", code: "missing_required" },
        503,
      )
    }

    const operatorKey = request.headers.get("x-operator-dispatch-key")
    if (operatorKey !== env.OPERATOR_DISPATCH_KEY) {
      return jsonResponse({ error: "dispatch access denied" }, 403)
    }

    const { capture_id: captureId } = (await request.json().catch(() => ({}))) as {
      capture_id?: string
    }
    if (!captureId) {
      return jsonResponse({ error: "capture_id is required" }, 400)
    }

    // Idempotency: the append-only dispatch log is authoritative. A prior "sent" row
    // for this event/recipient-class/source blocks a duplicate send (also enforced by
    // a partial unique index at the DB level). This capture table's own
    // notification_state column belongs to the separate participant-confirmation
    // dispatch and is intentionally not read or written here.
    const priorSent = await supabaseFetch<{ id: string }[]>(
      env,
      `measures_notification_dispatch_log?event_type=eq.${EVENT_TYPE}&recipient_class=eq.${RECIPIENT_CLASS}&source_id=eq.${captureId}&dispatch_state=eq.sent&select=id&limit=1`,
    )
    if (priorSent.length > 0) {
      return jsonResponse({ capture_id: captureId, dispatch_state: "blocked", reason: "already sent" }, 409)
    }

    const [capture] = await supabaseFetch<AssessmentCaptureRow[]>(
      env,
      `${SOURCE_TABLE}?id=eq.${captureId}&select=id,institution_name,contact_name,contact_email,created_at,metadata&limit=1`,
    )
    if (!capture) {
      return jsonResponse({ error: "assessment capture row not found" }, 404)
    }

    const [template] = await supabaseFetch<TemplateRow[]>(
      env,
      `measures_notification_template?event_type=eq.${EVENT_TYPE}&recipient_class=eq.${RECIPIENT_CLASS}&is_active=eq.true&select=template_key,subject,body&limit=1`,
    )

    const metadata = capture.metadata ?? {}
    const standingReport = asRecord(metadata.environmental_standing_report)
    const carryForward = asRecord(metadata.carry_forward)

    const tokens: Record<string, string> = {
      capture_id: capture.id,
      institution_name: capture.institution_name,
      contact_name: capture.contact_name,
      contact_email: capture.contact_email,
      business_type:
        asString(metadata.organization_type) ?? asString(carryForward.organization_type) ?? "not provided",
      assessment_result: asString(standingReport.assessment_result) ?? "not seated",
      environmental_standing: asString(standingReport.environmental_standing) ?? "not seated",
      continuation_pathway:
        asString(standingReport.continuation_pathway) ?? asString(carryForward.continuation_pathway) ?? "not seated",
      submitted_at: capture.created_at,
      review_reference: capture.id,
    }

    if (!template) {
      await insertDispatchLog(env, {
        event_type: EVENT_TYPE,
        recipient_class: RECIPIENT_CLASS,
        source_table: SOURCE_TABLE,
        source_id: captureId,
        recipient_email: env.OPERATOR_NOTIFY_EMAIL,
        dispatch_state: "failed",
        provider: "resend_error",
        error_message: "active template missing",
        metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
      })
      return jsonResponse({ error: "active template missing" }, 409)
    }

    const subject = renderTemplate(template.subject, tokens)
    const body = renderTemplate(template.body, tokens)

    await insertDispatchLog(env, {
      event_type: EVENT_TYPE,
      recipient_class: RECIPIENT_CLASS,
      source_table: SOURCE_TABLE,
      source_id: captureId,
      recipient_email: env.OPERATOR_NOTIFY_EMAIL,
      template_key: template.template_key,
      dispatch_state: "attempted",
      provider: "resend",
      metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1", subject },
    })

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: "Measures Registry <connect@measuresregistry.com>",
        to: [env.OPERATOR_NOTIFY_EMAIL],
        reply_to: capture.contact_email,
        subject,
        text: body,
        html: body
          .split("\n")
          .map((line) => `<p>${escapeHtml(line)}</p>`)
          .join(""),
      }),
    })

    const resendPayload = (await resendResponse.json().catch(() => ({}))) as {
      id?: string
      message?: string
      name?: string
    }

    if (!resendResponse.ok || !resendPayload.id) {
      const errorMessage =
        resendPayload.message ?? resendPayload.name ?? `Resend request failed: ${resendResponse.status}`

      await insertDispatchLog(env, {
        event_type: EVENT_TYPE,
        recipient_class: RECIPIENT_CLASS,
        source_table: SOURCE_TABLE,
        source_id: captureId,
        recipient_email: env.OPERATOR_NOTIFY_EMAIL,
        template_key: template.template_key,
        dispatch_state: "failed",
        provider: "resend_error",
        error_message: errorMessage,
        metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1" },
      })

      return jsonResponse({ error: errorMessage }, 502)
    }

    await insertDispatchLog(env, {
      event_type: EVENT_TYPE,
      recipient_class: RECIPIENT_CLASS,
      source_table: SOURCE_TABLE,
      source_id: captureId,
      recipient_email: env.OPERATOR_NOTIFY_EMAIL,
      template_key: template.template_key,
      dispatch_state: "sent",
      provider: "resend",
      provider_message_id: resendPayload.id,
      metadata: { source_oar2: "seat_assessment_and_payment_notification_dispatch_v1", subject },
    })

    return jsonResponse({
      capture_id: captureId,
      dispatch_state: "sent",
      provider: "resend",
      provider_message_id: resendPayload.id,
    })
  } catch (error) {
    return jsonResponse({ error: error instanceof Error ? error.message : "dispatch failed" }, 500)
  }
}

export const onRequest: PagesFunction<Env> = async () => jsonResponse({ error: "method not allowed" }, 405)
