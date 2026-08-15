type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type AssessmentCaptureRow = {
  id: string
  contact_name: string
  contact_email: string
  institution_name: string
  notification_state: string
  created_at: string
  metadata: Record<string, unknown> | null
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

function escapeHtml(str: string) {
  const entities: Record<string, string> = {
    "&": "&" + "amp;",
    "<": "&" + "lt;",
    ">": "&" + "gt;",
    '"': "&" + "quot;",
    "'": "&#" + "39;",
  }
  return str.replace(/[&<>"']/g, (char) => entities[char])
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

async function updateCapture(
  env: Env,
  captureId: string,
  payload: Record<string, unknown>,
) {
  await supabaseFetch(env, `measures_iis_eval_gate1_capture?id=eq.${captureId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
}

async function writeDispatchLog(
  env: Env,
  log: {
    event_type: string
    recipient_class: string
    source_table: string
    source_id: string
    recipient_email: string
    template_key: string
    provider: string
    provider_message_id?: string
    dispatch_state: string
    error_message?: string
    metadata?: Record<string, unknown>
  },
) {
  await supabaseFetch(env, `measures_notification_dispatch_log`, {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      ...log,
      created_at: new Date().toISOString(),
    }),
  })
}

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  try {
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "RESEND_API_KEY is not configured" }, 503)
    }

    const { capture_id: captureId } = (await request.json().catch(() => ({}))) as {
      capture_id?: string
    }

    if (!captureId) {
      return jsonResponse({ error: "capture_id is required" }, 400)
    }

    const [capture] = await supabaseFetch<AssessmentCaptureRow[]>(
      env,
      `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,notification_state,created_at,metadata&limit=1`,
    )

    if (!capture) {
      return jsonResponse({ error: "assessment capture row not found" }, 404)
    }

    // x-operator-dispatch-key check
    const operatorKey = request.headers.get("x-operator-dispatch-key")
    const isOperator = !!env.OPERATOR_DISPATCH_KEY && operatorKey === env.OPERATOR_DISPATCH_KEY

    // RA-003: Require operator/internal dispatch credential for generic dispatch
    if (!isOperator) {
      return jsonResponse({ error: "dispatch access denied" }, 403)
    }

    // Idempotency: Prevent duplicate participant sends using existing state
    if (capture.notification_state !== "queued") {
      return jsonResponse(
        { error: "capture is not queued", notification_state: capture.notification_state },
        409,
      )
    }

    const metadata = capture.metadata ?? {}
    const consentGiven = metadata.assessment_result_email_consent === true

    // N-006 — Consent boundary
    if (!consentGiven) {
      const notConsentState = "skipped"
      await updateCapture(env, captureId, {
        notification_state: notConsentState,
        metadata: {
          ...metadata,
          dispatch_held_reason: "assessment_result_email_consent not given",
          assessment_result_email_state: "skipped",
          source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
        },
      })

      await writeDispatchLog(env, {
        event_type: "assessment_completed",
        recipient_class: "participant",
        source_table: "measures_iis_eval_gate1_capture",
        source_id: captureId,
        recipient_email: capture.contact_email || "no_email_consent_false",
        template_key: "assessment_completed_participant_v1",
        provider: "internal",
        dispatch_state: "skipped",
        error_message: "assessment_result_email_consent not given",
        metadata: {
          consent_given: false,
          source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
        },
      })

      return jsonResponse({
        capture_id: captureId,
        dispatch_state: "skipped",
        reason: "assessment_result_email_consent not given",
      })
    }

    if (!capture.contact_email) {
      return jsonResponse({ error: "contact_email is absent on capture row" }, 409)
    }

    // N-004 — DB-Seated template loading
    const templates = await supabaseFetch<{ subject: string; body: string }[]>(
      env,
      `measures_notification_template?template_key=eq.assessment_completed_participant_v1&is_active=eq.true&limit=1`,
    )
    const template = Array.isArray(templates) ? templates[0] : null

    const report = metadata.environmental_standing_report as Record<string, unknown> | null
    const contactName = capture.contact_name ? capture.contact_name.trim() : ""

    const placeholders: Record<string, string> = {
      contact_name: contactName ? `, ${contactName}` : "",
      assessment_result: typeof report?.environmental_standing === "string" ? report.environmental_standing : "Completed",
      environmental_standing: typeof report?.environmental_standing === "string" ? report.environmental_standing : "Completed",
      operational_exposure_summary: typeof report?.operational_exposure_summary === "string" ? report.operational_exposure_summary : "",
      recommended_structured_action: typeof report?.recommended_structured_action === "string" ? report.recommended_structured_action : "",
      continuation_pathway: typeof report?.continuation_pathway === "string" ? report.continuation_pathway : "",
    }

    let emailSubject = template?.subject || "Your Measures Registry AI Operations Assessment Results"
    let emailBody = template?.body || `Thank you for completing the Measures Registry AI Operations Assessment{{contact_name}}.

Here are your assessment results:
- Assessment result: {{assessment_result}}
- Environmental standing: {{environmental_standing}}
- Operational exposure summary: {{operational_exposure_summary}}
- Recommended structured action: {{recommended_structured_action}}
- Continuation pathway: {{continuation_pathway}}

These assessment results are purely informational and do not create or imply any official Registry Certification, SEAT standing, c3 Key issuance, or professional advice.

Questions? Contact us at connect@measuresregistry.com.`

    // Perform placeholders replacement
    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g")
      emailSubject = emailSubject.replace(regex, value)
      emailBody = emailBody.replace(regex, value)
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: "Measures Registry <connect@measuresregistry.com>",
        to: [capture.contact_email],
        reply_to: "connect@measuresregistry.com",
        subject: emailSubject,
        text: emailBody,
        html: emailBody.split("\n\n").map((line) => `<p>${escapeHtml(line)}</p>`).join(""),
      }),
    })

    const resendPayload = (await resendResponse.json().catch(() => ({}))) as {
      id?: string
      message?: string
      name?: string
    }

    if (!resendResponse.ok || !resendPayload.id) {
      const errorMessage =
        resendPayload.message ??
        resendPayload.name ??
        `Resend request failed: ${resendResponse.status}`

      await updateCapture(env, captureId, {
        notification_state: "failed",
        metadata: {
          ...metadata,
          dispatch_error: errorMessage,
          assessment_result_email_state: "failed",
          source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
        },
      })

      await writeDispatchLog(env, {
        event_type: "assessment_completed",
        recipient_class: "participant",
        source_table: "measures_iis_eval_gate1_capture",
        source_id: captureId,
        recipient_email: capture.contact_email,
        template_key: "assessment_completed_participant_v1",
        provider: "resend",
        dispatch_state: "failed",
        error_message: errorMessage,
        metadata: {
          error: true,
          source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
        },
      })

      return jsonResponse({ error: errorMessage }, 502)
    }

    const notifiedAt = new Date().toISOString()

    await updateCapture(env, captureId, {
      notification_state: "notified",
      metadata: {
        ...metadata,
        assessment_result_email_state: "sent",
        assessment_result_email_template_key: "assessment_completed_participant_v1",
        last_dispatch_provider: "resend",
        last_dispatch_provider_message_id: resendPayload.id,
        last_dispatch_subject: emailSubject,
        notified_at: notifiedAt,
        source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
      },
    })

    // Write general append-only dispatch evidence
    await writeDispatchLog(env, {
      event_type: "assessment_completed",
      recipient_class: "participant",
      source_table: "measures_iis_eval_gate1_capture",
      source_id: captureId,
      recipient_email: capture.contact_email,
      template_key: "assessment_completed_participant_v1",
      provider: "resend",
      provider_message_id: resendPayload.id,
      dispatch_state: "sent",
      metadata: {
        success: true,
        notified_at: notifiedAt,
        source_oar2: "correct_assessment_notification_and_ccc_continuity_cline_001",
      },
    })

    return jsonResponse({
      capture_id: captureId,
      dispatch_state: "sent",
      notification_state: "notified",
      provider: "resend",
      provider_message_id: resendPayload.id,
      notified_at: notifiedAt,
    })
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "dispatch failed",
      },
      500,
    )
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
