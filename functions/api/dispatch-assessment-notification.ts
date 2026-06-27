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
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
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

    const [capture] = await supabaseFetch<AssessmentCaptureRow[]>(
      env,
      `measures_iis_eval_gate1_capture?id=eq.${captureId}&select=id,contact_name,contact_email,institution_name,notification_state,metadata&limit=1`,
    )

    if (!capture) {
      return jsonResponse({ error: "assessment capture row not found" }, 404)
    }

    if (capture.notification_state !== "queued") {
      return jsonResponse(
        { error: "capture is not queued", notification_state: capture.notification_state },
        409,
      )
    }

    const metadata = capture.metadata ?? {}
    const consentGiven = metadata.assessment_result_email_consent === true

    if (!consentGiven) {
      await updateCapture(env, captureId, {
        notification_state: "held",
        metadata: {
          ...metadata,
          dispatch_held_reason: "assessment_result_email_consent not given",
          source_oar2: "oar2_implement_assessment_and_connect_email_dispatch_functions_v1",
        },
      })
      return jsonResponse({
        capture_id: captureId,
        dispatch_state: "held",
        reason: "assessment_result_email_consent not given",
      })
    }

    if (!capture.contact_email) {
      return jsonResponse({ error: "contact_email is absent on capture row" }, 409)
    }

    const artifact = metadata.structured_email_artifact as {
      subject?: string
      body?: unknown
    } | null

    const bodyLines: string[] =
      Array.isArray(artifact?.body) && (artifact.body as unknown[]).length > 0
        ? (artifact.body as string[])
        : [
            `Thank you for completing the Measures Registry AI Operations Assessment${capture.contact_name ? ", " + capture.contact_name : ""}.`,
            `Your submission has been received. A Measures Registry team member may follow up.`,
            `Assessment results are informational and do not create certification, SEAT standing, c3 Key issuance, or professional advice.`,
            `Questions? Contact us at connect@measuresregistry.com.`,
          ]

    const emailSubject =
      typeof artifact?.subject === "string" && artifact.subject
        ? artifact.subject
        : "Your Measures Registry Assessment Results"

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
        text: bodyLines.join("\n\n"),
        html: bodyLines.map((line) => `<p>${escapeHtml(line)}</p>`).join(""),
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
          source_oar2: "oar2_implement_assessment_and_connect_email_dispatch_functions_v1",
        },
      })

      return jsonResponse({ error: errorMessage }, 502)
    }

    const notifiedAt = new Date().toISOString()

    await updateCapture(env, captureId, {
      notification_state: "notified",
      metadata: {
        ...metadata,
        last_dispatch_provider: "resend",
        last_dispatch_provider_message_id: resendPayload.id,
        last_dispatch_subject: emailSubject,
        notified_at: notifiedAt,
        source_oar2: "oar2_implement_assessment_and_connect_email_dispatch_functions_v1",
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

export const onRequest: PagesFunction<Env> = async () =>
  jsonResponse({ error: "method not allowed" }, 405)
