export type AssessmentDeliveryEnv = {
  RESEND_API_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type ReceiptCaptureRow = {
  id: string
  contact_name: string | null
  contact_email: string | null
  institution_name: string | null
  confirmation_email_state: string | null
  metadata: Record<string, unknown> | null
}

type ResultCaptureRow = {
  id: string
  contact_name: string
  contact_email: string
  institution_name: string
  notification_state: string
  created_at: string
  metadata: Record<string, unknown> | null
}

type TemplateRow = {
  template_key?: string
  subject: string
  body: string
}

type DeliveryResult = {
  body: Record<string, unknown>
  status: number
}

const RECEIPT_TEMPLATE_KEY = "assessment_receipt_participant_v1"
const RESULT_TEMPLATE_KEY = "assessment_completed_participant_v1"
const RECEIPT_SOURCE_OAR2 = "oar2_resolve_measures_map_identity_confirmation_current_payment_codex_v1"
const RECEIPT_EXECUTION_INSTANCE_ID = "resolve_measures_map_identity_confirmation_current_payment_codex_001"
const RESULT_SOURCE_OAR2 = "correct_assessment_notification_and_ccc_continuity_cline_001"

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
  env: AssessmentDeliveryEnv,
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
  env: AssessmentDeliveryEnv,
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
  env: AssessmentDeliveryEnv,
  log: {
    event_type?: string
    recipient_class?: string
    source_table?: string
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
  await supabaseFetch(env, "measures_notification_dispatch_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      id: crypto.randomUUID(),
      event_type: log.event_type ?? "assessment_completed",
      recipient_class: log.recipient_class ?? "participant",
      source_table: log.source_table ?? "measures_iis_eval_gate1_capture",
      source_id: log.source_id,
      recipient_email: log.recipient_email,
      template_key: log.template_key,
      provider: log.provider,
      provider_message_id: log.provider_message_id,
      dispatch_state: log.dispatch_state,
      error_message: log.error_message,
      metadata: log.metadata,
      created_at: new Date().toISOString(),
    }),
  })
}

async function updateDeliveryArtifactV2(
  env: AssessmentDeliveryEnv,
  metadata: Record<string, unknown>,
  payload: Record<string, unknown>,
) {
  const evaluationId = asString(metadata.evaluation_id)
  if (!evaluationId) return
  await supabaseFetch(env, `mr_assessment_delivery_artifact_v2?evaluation_id=eq.${encodeURIComponent(evaluationId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString(),
    }),
  })
}

async function sendEmail(
  env: AssessmentDeliveryEnv,
  message: {
    to: string
    subject: string
    body: string
  },
) {
  if (!env.RESEND_API_KEY) {
    return {
      ok: false,
      status: 503,
      error: "RESEND_API_KEY is not configured",
    }
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Measures Registry <connect@measuresregistry.com>",
      to: [message.to],
      reply_to: "connect@measuresregistry.com",
      subject: message.subject,
      text: message.body,
      html: message.body.split("\n\n").map((line) => `<p>${escapeHtml(line)}</p>`).join(""),
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as {
    id?: string
    message?: string
    name?: string
  }

  if (!response.ok || !payload.id) {
    return {
      ok: false,
      status: response.status,
      error: payload.message ?? payload.name ?? `Resend request failed: ${response.status}`,
    }
  }

  return {
    ok: true,
    status: response.status,
    providerMessageId: payload.id,
  }
}

export async function deliverAssessmentReceipt(
  env: AssessmentDeliveryEnv,
  captureId: string,
): Promise<DeliveryResult> {
  if (!captureId) return { status: 400, body: { error: "capture_id is required" } }

  const [capture] = await supabaseFetch<ReceiptCaptureRow[]>(
    env,
    `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,confirmation_email_state,metadata&limit=1`,
  )
  if (!capture) return { status: 404, body: { error: "assessment capture row not found" } }
  if (!capture.contact_email) return { status: 409, body: { error: "contact_email is absent on capture row" } }

  const metadata = capture.metadata ?? {}
  const assessmentRef = asString(metadata.assessment_ref)
  const currentStateKey = asString(metadata.current_state_key)
    ?? asString(asRecord(metadata.assessment_result_binding)?.current_state_key)
    ?? asString(asRecord(metadata.governed_assessment_instance)?.current_state_key)

  if (!assessmentRef || !currentStateKey) {
    return { status: 409, body: { error: "assessment_ref and current_state_key are required for receipt dispatch" } }
  }

  if (metadata.confirmation_receipt_state === "sent" || capture.confirmation_email_state === "sent") {
    return {
      status: 200,
      body: {
        capture_id: captureId,
        dispatch_state: "already_sent",
        template_key: asString(metadata.confirmation_receipt_template_key) ?? RECEIPT_TEMPLATE_KEY,
        assessment_ref: assessmentRef,
        current_state_key: currentStateKey,
      },
    }
  }

  const [template] = await supabaseFetch<TemplateRow[]>(
    env,
    `measures_notification_template?template_key=eq.${RECEIPT_TEMPLATE_KEY}&is_active=eq.true&select=template_key,subject,body&limit=1`,
  )
  if (!template) {
    await updateCapture(env, captureId, {
      confirmation_email_state: "failed",
      metadata: {
        ...metadata,
        confirmation_receipt_state: "failed",
        confirmation_receipt_failure_reason: "active receipt template missing",
        source_oar2: RECEIPT_SOURCE_OAR2,
      },
    })
    await writeDispatchLog(env, {
      event_type: "assessment_receipt",
      source_id: captureId,
      recipient_email: capture.contact_email,
      template_key: RECEIPT_TEMPLATE_KEY,
      provider: "internal",
      dispatch_state: "failed",
      error_message: "active receipt template missing",
      metadata: {
        notification_class: "assessment_receipt",
        source_oar2: RECEIPT_SOURCE_OAR2,
        execution_instance_id: RECEIPT_EXECUTION_INSTANCE_ID,
        assessment_ref: assessmentRef,
        current_state_key: currentStateKey,
      },
    })
    return { status: 409, body: { error: "active receipt template missing" } }
  }

  const contactName = capture.contact_name?.trim()
  const emailSubject = renderTemplate(template.subject, {
    contact_name: contactName ? `, ${contactName}` : "",
    assessment_ref: assessmentRef,
    current_state_key: currentStateKey,
    institution_name: capture.institution_name ?? "",
  })
  const emailBody = renderTemplate(template.body, {
    contact_name: contactName ? `, ${contactName}` : "",
    assessment_ref: assessmentRef,
    current_state_key: currentStateKey,
    institution_name: capture.institution_name ?? "",
  })

  const provider = await sendEmail(env, { to: capture.contact_email, subject: emailSubject, body: emailBody })
  if (!provider.ok) {
    const errorMessage = provider.error ?? "email provider failed"
    await updateCapture(env, captureId, {
      confirmation_email_state: "failed",
      metadata: {
        ...metadata,
        confirmation_receipt_state: "failed",
        confirmation_receipt_failure_reason: errorMessage,
        confirmation_receipt_template_key: RECEIPT_TEMPLATE_KEY,
        source_oar2: RECEIPT_SOURCE_OAR2,
      },
    })
    await writeDispatchLog(env, {
      event_type: "assessment_receipt",
      source_id: captureId,
      recipient_email: capture.contact_email,
      template_key: RECEIPT_TEMPLATE_KEY,
      provider: provider.status === 503 ? "internal" : "resend",
      dispatch_state: "failed",
      error_message: errorMessage,
      metadata: {
        notification_class: "assessment_receipt",
        source_oar2: RECEIPT_SOURCE_OAR2,
        execution_instance_id: RECEIPT_EXECUTION_INSTANCE_ID,
        assessment_ref: assessmentRef,
        current_state_key: currentStateKey,
      },
    })
    return { status: provider.status === 503 ? 503 : 502, body: { error: errorMessage, status: provider.status } }
  }

  const sentAt = new Date().toISOString()
  await updateCapture(env, captureId, {
    confirmation_email_state: "sent",
    metadata: {
      ...metadata,
      confirmation_receipt_state: "sent",
      confirmation_receipt_template_key: RECEIPT_TEMPLATE_KEY,
      confirmation_receipt_provider: "resend",
      confirmation_receipt_provider_message_id: provider.providerMessageId,
      confirmation_receipt_subject: emailSubject,
      confirmation_receipt_sent_at: sentAt,
      confirmation_receipt_assessment_ref: assessmentRef,
      confirmation_receipt_current_state_key: currentStateKey,
      source_oar2: RECEIPT_SOURCE_OAR2,
    },
  })
  await writeDispatchLog(env, {
    event_type: "assessment_receipt",
    source_id: captureId,
    recipient_email: capture.contact_email,
    template_key: RECEIPT_TEMPLATE_KEY,
    provider: "resend",
    provider_message_id: provider.providerMessageId,
    dispatch_state: "sent",
    metadata: {
      notification_class: "assessment_receipt",
      source_oar2: RECEIPT_SOURCE_OAR2,
      execution_instance_id: RECEIPT_EXECUTION_INSTANCE_ID,
      assessment_ref: assessmentRef,
      current_state_key: currentStateKey,
      sent_at: sentAt,
      subject: emailSubject,
      does_not_include_assessment_result: true,
    },
  })

  return {
    status: 200,
    body: {
      capture_id: captureId,
      dispatch_state: "sent",
      template_key: RECEIPT_TEMPLATE_KEY,
      provider: "resend",
      provider_message_id: provider.providerMessageId,
      assessment_ref: assessmentRef,
      current_state_key: currentStateKey,
      sent_at: sentAt,
    },
  }
}

export async function deliverAssessmentResultEmail(
  env: AssessmentDeliveryEnv,
  captureId: string,
): Promise<DeliveryResult> {
  if (!captureId) return { status: 400, body: { error: "capture_id is required" } }

  const [capture] = await supabaseFetch<ResultCaptureRow[]>(
    env,
    `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,notification_state,created_at,metadata&limit=1`,
  )
  if (!capture) return { status: 404, body: { error: "assessment capture row not found" } }

  if (capture.notification_state !== "queued") {
    return {
      status: 409,
      body: { error: "capture is not queued", notification_state: capture.notification_state },
    }
  }

  const metadata = capture.metadata ?? {}
  const consentGiven = metadata.assessment_result_email_consent === true
  if (!consentGiven) {
    await updateCapture(env, captureId, {
      notification_state: "skipped",
      metadata: {
        ...metadata,
        dispatch_held_reason: "assessment_result_email_consent not given",
        assessment_result_email_state: "skipped",
        source_oar2: RESULT_SOURCE_OAR2,
      },
    })
    await writeDispatchLog(env, {
      source_id: captureId,
      recipient_email: capture.contact_email || "no_email_consent_false",
      template_key: RESULT_TEMPLATE_KEY,
      provider: "internal",
      dispatch_state: "skipped",
      error_message: "assessment_result_email_consent not given",
      metadata: {
        notification_class: "assessment_result",
        consent_given: false,
        source_oar2: RESULT_SOURCE_OAR2,
      },
    })
    return {
      status: 200,
      body: {
        capture_id: captureId,
        dispatch_state: "skipped",
        reason: "assessment_result_email_consent not given",
      },
    }
  }

  if (!capture.contact_email) return { status: 409, body: { error: "contact_email is absent on capture row" } }

  const templates = await supabaseFetch<TemplateRow[]>(
    env,
    `measures_notification_template?template_key=eq.${RESULT_TEMPLATE_KEY}&is_active=eq.true&limit=1`,
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

  for (const [key, value] of Object.entries(placeholders)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g")
    emailSubject = emailSubject.replace(regex, value)
    emailBody = emailBody.replace(regex, value)
  }

  const provider = await sendEmail(env, { to: capture.contact_email, subject: emailSubject, body: emailBody })
  if (!provider.ok) {
    const errorMessage = provider.error ?? "email provider failed"
    await updateDeliveryArtifactV2(env, metadata, {
      delivery_standing: "provider_failed",
      provider: provider.status === 503 ? "internal" : "resend",
      error_message: errorMessage,
      template_key: RESULT_TEMPLATE_KEY,
      rendered_subject: emailSubject,
    })
    await updateCapture(env, captureId, {
      notification_state: "failed",
      metadata: {
        ...metadata,
        dispatch_error: errorMessage,
        assessment_result_email_state: "failed",
        source_oar2: RESULT_SOURCE_OAR2,
      },
    })
    await writeDispatchLog(env, {
      source_id: captureId,
      recipient_email: capture.contact_email,
      template_key: RESULT_TEMPLATE_KEY,
      provider: provider.status === 503 ? "internal" : "resend",
      dispatch_state: "failed",
      error_message: errorMessage,
      metadata: {
        notification_class: "assessment_result",
        error: true,
        source_oar2: RESULT_SOURCE_OAR2,
      },
    })
    return { status: provider.status === 503 ? 503 : 502, body: { error: errorMessage, status: provider.status } }
  }

  const notifiedAt = new Date().toISOString()
  await updateDeliveryArtifactV2(env, metadata, {
    delivery_standing: "provider_accepted",
    provider: "resend",
    provider_message_id: provider.providerMessageId,
    template_key: RESULT_TEMPLATE_KEY,
    rendered_subject: emailSubject,
  })
  await updateCapture(env, captureId, {
    notification_state: "notified",
    metadata: {
      ...metadata,
      assessment_result_email_state: "sent",
      assessment_result_email_template_key: RESULT_TEMPLATE_KEY,
      last_dispatch_provider: "resend",
      last_dispatch_provider_message_id: provider.providerMessageId,
      last_dispatch_subject: emailSubject,
      notified_at: notifiedAt,
      source_oar2: RESULT_SOURCE_OAR2,
    },
  })
  await writeDispatchLog(env, {
    source_id: captureId,
    recipient_email: capture.contact_email,
    template_key: RESULT_TEMPLATE_KEY,
    provider: "resend",
    provider_message_id: provider.providerMessageId,
    dispatch_state: "sent",
    metadata: {
      notification_class: "assessment_result",
      success: true,
      notified_at: notifiedAt,
      source_oar2: RESULT_SOURCE_OAR2,
    },
  })

  return {
    status: 200,
    body: {
      capture_id: captureId,
      dispatch_state: "sent",
      notification_state: "notified",
      provider: "resend",
      provider_message_id: provider.providerMessageId,
      notified_at: notifiedAt,
    },
  }
}
