import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./dispatch-assessment-operator-notification"

const env = {
  RESEND_API_KEY: "resend-test",
  OPERATOR_DISPATCH_KEY: "operator-test-key",
  OPERATOR_NOTIFY_EMAIL: "operator@example.com",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
}

const captureRow = {
  id: "11111111-1111-4111-8111-111111111111",
  institution_name: "Example Institution",
  contact_name: "Jane Doe",
  contact_email: "jane@example.com",
  created_at: "2026-07-01T00:00:00.000Z",
  metadata: {
    organization_type: "nonprofit",
    environmental_standing_report: {
      assessment_result: "Active Structural Drift Detected",
      environmental_standing: "Active Runtime Exposure",
      continuation_pathway: "MAP the Environment",
    },
  },
}

const templateRow = {
  template_key: "assessment_completed_operator_v1",
  subject: "New assessment completed — {{institution_name}}",
  body: "Institution: {{institution_name}}\nContact: {{contact_name}} <{{contact_email}}>",
}

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("https://example.com/api/dispatch-assessment-operator-notification", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  })
}

async function withMockedFetch(
  handler: (url: string, method: string, body: string) => Response | Promise<Response>,
  run: () => Promise<unknown>,
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const body = String(init?.body ?? "")
    return handler(url, method, body)
  }) as typeof fetch
  try {
    return await run()
  } finally {
    globalThis.fetch = originalFetch
  }
}

test("rejects requests without the operator dispatch key", async () => {
  const response = await onRequestPost({
    request: request({ capture_id: captureRow.id }),
    env,
  } as never)
  assert.equal(response.status, 403)
})

test("sends the governed operator alert and logs sent", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []

  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.includes("measures_notification_dispatch_log?event_type=eq.assessment_completed") && method === "GET") {
        return Response.json([])
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.")) {
        return Response.json([captureRow])
      }
      if (url.includes("measures_notification_template?event_type=eq.assessment_completed")) {
        return Response.json([templateRow])
      }
      if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
        return new Response(null, { status: 201 })
      }
      if (url.includes("api.resend.com/emails")) {
        return Response.json({ id: "resend-msg-1" })
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    () =>
      onRequestPost({
        request: request({ capture_id: captureRow.id }, { "x-operator-dispatch-key": "operator-test-key" }),
        env,
      } as never),
  )

  const body = await (response as Response).json() as Record<string, unknown>
  assert.equal((response as Response).status, 200)
  assert.equal(body.dispatch_state, "sent")
  assert.equal(body.provider_message_id, "resend-msg-1")

  const resendCall = calls.find((c) => c.url.includes("api.resend.com"))
  assert.ok(resendCall)
  const payload = JSON.parse(resendCall!.body) as { to: string[]; subject: string; text: string }
  assert.deepEqual(payload.to, ["operator@example.com"])
  assert.equal(payload.subject, "New assessment completed — Example Institution")
  assert.match(payload.text, /Contact: Jane Doe <jane@example.com>/)

  const logInserts = calls.filter(
    (c) => c.url.endsWith("/rest/v1/measures_notification_dispatch_log") && c.method === "POST",
  )
  const states = logInserts.map((c) => (JSON.parse(c.body) as { dispatch_state: string }).dispatch_state)
  assert.deepEqual(states, ["attempted", "sent"])
})

test("blocks a second send once one is already logged as sent", async () => {
  const response = await withMockedFetch(
    (url) => {
      if (url.includes("measures_notification_dispatch_log?event_type=eq.assessment_completed")) {
        return Response.json([{ id: "already-sent-log-row" }])
      }
      throw new Error(`Unexpected fetch: ${url}`)
    },
    () =>
      onRequestPost({
        request: request({ capture_id: captureRow.id }, { "x-operator-dispatch-key": "operator-test-key" }),
        env,
      } as never),
  )

  assert.equal((response as Response).status, 409)
  const body = await (response as Response).json() as Record<string, unknown>
  assert.equal(body.dispatch_state, "blocked")
})
