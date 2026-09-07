import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./dispatch-assessment-receipt"

const env = {
  OPERATOR_DISPATCH_KEY: "operator-test-key",
  RESEND_API_KEY: "resend-test-key",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
}

function request(captureId = "capture-1") {
  return new Request("https://example.com/api/dispatch-assessment-receipt", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-operator-dispatch-key": "operator-test-key",
    },
    body: JSON.stringify({ capture_id: captureId }),
  })
}

test("sends distinct participant assessment receipt bound to assessment and Current", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const body = String(init?.body ?? "")
    calls.push({ url, method, body })

    if (url.includes("measures_iis_eval_gate1_capture?id=eq.capture-1") && method === "GET") {
      return Response.json([{
        id: "capture-1",
        contact_name: "Jane Doe",
        contact_email: "jane@example.com",
        institution_name: "Example Institution",
        confirmation_email_state: "queued",
        metadata: {
          assessment_ref: "assessment_capture-1",
          current_state_key: "current_env_measures_registry_v1",
          environmental_standing_report: { standing_key: "active_structural_drift" },
        },
      }])
    }
    if (url.includes("measures_notification_template?template_key=eq.assessment_receipt_participant_v1")) {
      return Response.json([{
        template_key: "assessment_receipt_participant_v1",
        subject: "We received your Measures Registry assessment",
        body: "Thank you{{contact_name}}. We received {{assessment_ref}}.",
      }])
    }
    if (url.includes("api.resend.com/emails")) return Response.json({ id: "email_receipt_1" })
    if (url.includes("measures_iis_eval_gate1_capture?id=eq.capture-1") && method === "PATCH") {
      return new Response(null, { status: 204 })
    }
    if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
      return new Response(null, { status: 201 })
    }
    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }) as typeof fetch

  try {
    const response = await onRequestPost({ request: request(), env } as never)
    assert.equal(response.status, 200)
    const body = await response.json() as Record<string, unknown>
    assert.equal(body.dispatch_state, "sent")
    assert.equal(body.template_key, "assessment_receipt_participant_v1")
    assert.equal(body.current_state_key, "current_env_measures_registry_v1")

    const resendCall = calls.find((call) => call.url.includes("api.resend.com/emails"))
    assert.ok(resendCall)
    assert.equal(JSON.parse(resendCall.body).subject, "We received your Measures Registry assessment")

    const logCall = calls.find((call) => call.url.endsWith("/rest/v1/measures_notification_dispatch_log"))
    assert.ok(logCall)
    const logBody = JSON.parse(logCall!.body) as Record<string, any>
    assert.equal(logBody.template_key, "assessment_receipt_participant_v1")
    assert.equal(logBody.metadata.notification_class, "assessment_receipt")
    assert.equal(logBody.metadata.current_state_key, "current_env_measures_registry_v1")
    assert.equal(logBody.metadata.does_not_include_assessment_result, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})
