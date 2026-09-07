import assert from "node:assert/strict"
import test from "node:test"

import { onRequestGet } from "./assessment-evaluation"

const env = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
}

async function withMockedFetch(
  handler: (url: string, method: string) => Response | Promise<Response>,
  run: () => Promise<unknown>,
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    return handler(url, method)
  }) as typeof fetch
  try {
    return await run()
  } finally {
    globalThis.fetch = originalFetch
  }
}

test("resolves opaque evaluation delivery token to persisted Marble pending report", async () => {
  const token = "123e4567-e89b-12d3-a456-426614174000"
  const response = await withMockedFetch(
    (url, method) => {
      assert.equal(method, "GET")
      assert.match(url, /metadata->>evaluation_delivery_token=eq\.123e4567-e89b-12d3-a456-426614174000/)
      return Response.json([{
        id: "capture-1",
        contact_name: "Jane Doe",
        contact_email: "jane@example.com",
        institution_name: "Example Institution",
        metadata: {
          assessment_ref: "assessment_capture-1",
          evaluation_delivery_token: token,
          evaluation_delivery_permitted_encounter: "marble_chamber_orientation",
          evaluation_delivery_continuation: "map_the_environment",
          c2_resolution: { current_state_key: "current_env_measures_registry_v1" },
          structured_email_artifact: { subject: "ready", preview: "open", body: ["open"], source: "test" },
          environmental_standing_report: {
            standing_key: "environment_pre_deployment_review_required",
            evaluation_v2: {
              evaluation_id: "evaluation_capture-1",
              assessment_ref: "assessment_capture-1",
              evaluation_standing_key: "environment_pre_deployment_review_required",
              map_scope: { map_pathway: "foundational", amount_usd: 333, public_label: "Pre-Deployment" },
            },
          },
        },
      }])
    },
    () => onRequestGet({
      request: new Request(`https://example.com/api/assessment-evaluation?token=${token}`),
      env,
    } as never),
  )

  assert.equal((response as Response).status, 200)
  const body = await (response as Response).json() as Record<string, any>
  assert.equal(body.delivery.permitted_encounter, "marble_chamber_orientation")
  assert.equal(body.delivery.continuation, "map_the_environment")
  assert.equal(body.pendingReport.assessmentRef, "assessment_capture-1")
  assert.equal(body.pendingReport.report.evaluation_v2.evaluation_id, "evaluation_capture-1")
  assert.equal(body.pendingReport.c2Resolution.current_state_key, "current_env_measures_registry_v1")
  assert.equal(body.pendingReport.fields.contact_email, "jane@example.com")
})

test("rejects non-opaque evaluation delivery tokens", async () => {
  const response = await onRequestGet({
    request: new Request("https://example.com/api/assessment-evaluation?token=evaluation_capture-1"),
    env,
  } as never)

  assert.equal(response.status, 400)
})
