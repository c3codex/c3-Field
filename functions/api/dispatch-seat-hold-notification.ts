type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type CaptureRow = {
  id: string
  email: string
  offering_key: string
  source_encounter_key: string
  notification_state: string
  metadata: Record<string, unknown> | null
}

type TemplateRow = {
  subject: string
  body: string
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

function textBody(body: string) {
  return body
}

function htmlBody(body: string) {
  return body
    .split("\n")
    .map((line) => `<p>${line.replace(/[&<>"']/g, (char) => {
      const entities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }
      return entities[char]
    })}</p>`)
    .join("")
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

async function insertDispatchLog(
  env: Env,
  payload: Record<string, unknown>,
) {
  await supabaseFetch(env, "measures_seat_hold_notification_dispatch_log", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
}

async function updateCapture(
  env: Env,
  captureId: string,
  payload: Record<string, unknown>,
) {
  await supabaseFetch(env, `measures_seat_hold_capture?id=eq.${captureId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  })
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.RESEND_API_KEY) {
      return jsonResponse({ error: "RESEND_API_KEY is not configured" }, 503)
    }

    if (!env.OPERATOR_DISPATCH_KEY) {
      return jsonResponse({ error: "OPERATOR_DISPATCH_KEY is not configured" }, 503)
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

    const [capture] = await supabaseFetch<CaptureRow[]>(
      env,
      `measures_seat_hold_capture?id=eq.${captureId}&select=id,email,offering_key,source_encounter_key,notification_state,metadata&limit=1`,
    )

    if (!capture) {
      return jsonResponse({ error: "seat hold capture row not found" }, 404)
    }

    if (capture.notification_state !== "queued") {
      await insertDispatchLog(env, {
        capture_id: capture.id,
        offering_key: capture.offering_key,
        source_encounter_key: capture.source_encounter_key,
        recipient_email: capture.email,
        dispatch_state: "failed",
        provider: "resend_error",
        error_message: "capture is not queued",
        metadata: { source_oar2: "seat_hold_notification_provider_integration_v1" },
      })

      return jsonResponse({ error: "capture is not queued" }, 409)
    }

    const [template] = await supabaseFetch<TemplateRow[]>(
      env,
      `measures_seat_hold_notification_template?offering_key=eq.${capture.offering_key}&is_active=eq.true&select=subject,body&limit=1`,
    )

    if (!template) {
      await updateCapture(env, capture.id, {
        notification_state: "failed",
        metadata: {
          ...(capture.metadata ?? {}),
          dispatch_error: "active template missing",
          source_oar2: "seat_hold_notification_provider_integration_v1",
        },
      })

      await insertDispatchLog(env, {
        capture_id: capture.id,
        offering_key: capture.offering_key,
        source_encounter_key: capture.source_encounter_key,
        recipient_email: capture.email,
        dispatch_state: "failed",
        provider: "resend_error",
        error_message: "active template missing",
        metadata: { source_oar2: "seat_hold_notification_provider_integration_v1" },
      })

      return jsonResponse({ error: "active template missing" }, 409)
    }

    await insertDispatchLog(env, {
      capture_id: capture.id,
      offering_key: capture.offering_key,
      source_encounter_key: capture.source_encounter_key,
      recipient_email: capture.email,
      dispatch_state: "attempted",
      provider: "resend",
      metadata: {
        source_oar2: "seat_hold_notification_provider_integration_v1",
        explicit_operator_dispatch: true,
        subject: template.subject,
      },
    })

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: "Measures Registry <connect@measuresregistry.com>",
        to: [capture.email],
        reply_to: "connect@measuresregistry.com",
        subject: template.subject,
        text: textBody(template.body),
        html: htmlBody(template.body),
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

      await updateCapture(env, capture.id, {
        notification_state: "failed",
        metadata: {
          ...(capture.metadata ?? {}),
          dispatch_error: errorMessage,
          source_oar2: "seat_hold_notification_provider_integration_v1",
        },
      })

      await insertDispatchLog(env, {
        capture_id: capture.id,
        offering_key: capture.offering_key,
        source_encounter_key: capture.source_encounter_key,
        recipient_email: capture.email,
        dispatch_state: "failed",
        provider: "resend_error",
        error_message: errorMessage,
        metadata: { source_oar2: "seat_hold_notification_provider_integration_v1" },
      })

      return jsonResponse({ error: errorMessage }, 502)
    }

    const notifiedAt = new Date().toISOString()
    await updateCapture(env, capture.id, {
      notification_state: "notified",
      notified_at: notifiedAt,
      metadata: {
        ...(capture.metadata ?? {}),
        last_dispatch_provider: "resend",
        last_dispatch_provider_message_id: resendPayload.id,
        last_dispatch_subject: template.subject,
        source_oar2: "seat_hold_notification_provider_integration_v1",
      },
    })

    await insertDispatchLog(env, {
      capture_id: capture.id,
      offering_key: capture.offering_key,
      source_encounter_key: capture.source_encounter_key,
      recipient_email: capture.email,
      dispatch_state: "sent",
      provider: "resend",
      provider_message_id: resendPayload.id,
      metadata: {
        source_oar2: "seat_hold_notification_provider_integration_v1",
        explicit_operator_dispatch: true,
        subject: template.subject,
      },
    })

    return jsonResponse({
      capture_id: capture.id,
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

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
