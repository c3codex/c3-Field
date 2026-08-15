type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type AssessmentCaptureRow = {
  id: string
  contact_name: string | null
  contact_email: string | null
  institution_name: string | null
  confirmation_email_state: string | null
  metadata: Record<string, unknown> | null
}

type TemplateRow = {
  template_key: string
  subject: string
  body: string
}

const TEMPLATE_KEY = "assessment_receipt_participant_v1"
const SOURCE_OAR2 = "oar2_resolve_measures_map_identity_confirmation_current_payment_codex_v1"
const EXECUTION_INSTANCE_ID = "resolve_measures_map_identity_confirmation_current_payment_codex_001"

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
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }
  return str.replace(/[&<>"']/g, (char) => entities[char])
}

function renderTemplate(template: string, tokens: Record<string, string>) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(tokens, key) ? tokens[key] : match,
  )
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null
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
    recipientEmail: string
    sourceId: string
    templateKey: string
    provider: string
    providerMessageId?: string
    dispatchState: string
    errorMessage?: string
    metadata?: Record<string, unknown>
  },
) {
  await supabaseFetch(env, "measures_notification_dispatch_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      event_type: "assessment_completed",
      recipient_class: "participant",
      source_table: "measures_iis_eval_gate1_capture",
      source_id: log.sourceId,
      recipient_email: log.recipientEmail,
      template_key: log.templateKey,
      provider: log.provider,
      provider_message_id: log.providerMessageId,
      dispatch_state: log.dispatchState,
      error_message: log.errorMessage,
      metadata: {
        notification_class: "assessment_receipt",
        source_oar2: SOURCE_OAR2,
        execution_instance_id: EXECUTION_INSTANCE_ID,
        ...(log.metadata ?? {}),
      },
      created_at: new Date().toISOString(),
    }),
  })
}

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  try {
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "RESEND_API_KEY is not configured" }, 503)
    }

    const operatorKey = request.headers.get("x-operator-dispatch-key")
    const isOperator = !!env.OPERATOR_DISPATCH_KEY && operatorKey === env.OPERATOR_DISPATCH_KEY
    if (!isOperator) {
      return jsonResponse({ error: "dispatch access denied" }, 403)
    }

    const { capture_id: captureId } = (await request.json().catch(() => ({}))) as {
      capture_id?: string
    }
    if (!captureId) {
      return jsonResponse({ error: "capture_id is required" }, 400)
    }

    const [capture] = await supabaseFetch<AssessmentCaptureRow[]>(
      env,
      `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,confirmation_email_state,metadata&limit=1`,
    )
    if (!capture) {
      return jsonResponse({ error: "assessment capture row not found" }, 404)
    }
    if (!capture.contact_email) {
      return jsonResponse({ error: "contact_email is absent on capture row" }, 409)
    }

    const metadata = capture.metadata ?? {}
    const assessmentRef = asString(metadata.assessment_ref)
    const currentStateKey = asString(metadata.current_state_key)
      ?? asString(asRecord(metadata.assessment_result_binding)?.current_state_key)
      ?? asString(asRecord(metadata.governed_assessment_instance)?.current_state_key)

    if (!assessmentRef || !currentStateKey) {
      return jsonResponse({ error: "assessment_ref and current_state_key are required for receipt dispatch" }, 409)
    }

    if (metadata.confirmation_receipt_state === "sent" || capture.confirmation_email_state === "sent") {
      return jsonResponse({
        capture_id: captureId,
        dispatch_state: "already_sent",
        template_key: asString(metadata.confirmation_receipt_template_key) ?? TEMPLATE_KEY,
        assessment_ref: assessmentRef,
        current_state_key: currentStateKey,
      })
    }

    const [template] = await supabaseFetch<TemplateRow[]>(
      env,
      `measures_notification_template?template_key=eq.${TEMPLATE_KEY}&is_active=eq.true&select=template_key,subject,body&limit=1`,
    )
    if (!template) {
      await updateCapture(env, captureId, {
        confirmation_email_state: "failed",
        metadata: {
          ...metadata,
          confirmation_receipt_state: "failed",
          confirmation_receipt_failure_reason: "active receipt template missing",
          source_oar2: SOURCE_OAR2,
        },
      })
      await writeDispatchLog(env, {
        sourceId: captureId,
        recipientEmail: capture.contact_email,
        templateKey: TEMPLATE_KEY,
        provider: "internal",
        dispatchState: "failed",
        errorMessage: "active receipt template missing",
        metadata: { assessment_ref: assessmentRef, current_state_key: currentStateKey },
      })
      return jsonResponse({ error: "active receipt template missing" }, 409)
    }

    const contactName = capture.contact_name?.trim()
    const tokens = {
      contact_name: contactName ? `, ${contactName}` : "",
      assessment_ref: assessmentRef,
      current_state_key: currentStateKey,
      institution_name: capture.institution_name ?? "",
    }
    const emailSubject = renderTemplate(template.subject, tokens)
    const emailBody = renderTemplate(template.body, tokens)

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
        confirmation_email_state: "failed",
        metadata: {
          ...metadata,
          confirmation_receipt_state: "failed",
          confirmation_receipt_failure_reason: errorMessage,
          confirmation_receipt_template_key: TEMPLATE_KEY,
          source_oar2: SOURCE_OAR2,
        },
      })
      await writeDispatchLog(env, {
        sourceId: captureId,
        recipientEmail: capture.contact_email,
        templateKey: TEMPLATE_KEY,
        provider: "resend",
        dispatchState: "failed",
        errorMessage,
        metadata: { assessment_ref: assessmentRef, current_state_key: currentStateKey },
      })
      return jsonResponse({ error: errorMessage }, 502)
    }

    const sentAt = new Date().toISOString()
    await updateCapture(env, captureId, {
      confirmation_email_state: "sent",
      metadata: {
        ...metadata,
        confirmation_receipt_state: "sent",
        confirmation_receipt_template_key: TEMPLATE_KEY,
        confirmation_receipt_provider: "resend",
        confirmation_receipt_provider_message_id: resendPayload.id,
        confirmation_receipt_subject: emailSubject,
        confirmation_receipt_sent_at: sentAt,
        confirmation_receipt_assessment_ref: assessmentRef,
        confirmation_receipt_current_state_key: currentStateKey,
        source_oar2: SOURCE_OAR2,
      },
    })
    await writeDispatchLog(env, {
      sourceId: captureId,
      recipientEmail: capture.contact_email,
      templateKey: TEMPLATE_KEY,
      provider: "resend",
      providerMessageId: resendPayload.id,
      dispatchState: "sent",
      metadata: {
        assessment_ref: assessmentRef,
        current_state_key: currentStateKey,
        sent_at: sentAt,
        subject: emailSubject,
        does_not_include_assessment_result: true,
      },
    })

    return jsonResponse({
      capture_id: captureId,
      dispatch_state: "sent",
      template_key: TEMPLATE_KEY,
      provider: "resend",
      provider_message_id: resendPayload.id,
      assessment_ref: assessmentRef,
      current_state_key: currentStateKey,
      sent_at: sentAt,
    })
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "receipt dispatch failed" },
      500,
    )
  }
}

export const onRequest = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
