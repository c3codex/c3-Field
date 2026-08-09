import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./submit-assessment"

const env = {
  OPERATOR_DISPATCH_KEY: "operator-test-key",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
}

const assessmentMetadata = {
  assessment_mechanics: {
    questions: [
      {
        question_key: "q1",
        question: "Where does standing live?",
        options: [
          { value: "browser", label: "Browser", condition_tags: ["critical_ai_drift_condition"] },
          { value: "registry", label: "Registry", condition_tags: ["governed_review_condition"] },
        ],
      },
      {
        question_key: "q2",
        question: "How is MAP resolved?",
        options: [
          { value: "hardcoded", label: "Hardcoded", condition_tags: ["emerging_ai_drift_condition"] },
          { value: "server", label: "Server", condition_tags: ["governed_review_condition"] },
        ],
      },
    ],
  },
  assessment_interpretation: {
    scoring_thresholds: [
      {
        min: 0,
        max: 40,
        standing_key: "structured_governance_candidate",
        standing: "Structured Governance Candidate",
        assessment_result: "Governed Review Ready",
        continuation_pathway: "MAP 101",
      },
      {
        min: 41,
        max: 100,
        standing_key: "active_structural_drift",
        standing: "Active Runtime Exposure",
        assessment_result: "Active Structural Drift Detected",
        continuation_pathway: "MAP 101",
      },
    ],
    standing_rules: [],
    email_artifact_template: {
      subject: "{assessment_result}",
      preview: "{environmental_standing}",
      body: ["Standing: {environmental_standing}"],
    },
    report_labels: {
      assessment_title: "MEASURES AI ENVIRONMENT ASSESSMENT",
      recommended_response_label: "Recommended Operational Response",
    },
    finding_map: {
      critical_ai_drift_condition: "Browser authority drift found",
      emerging_ai_drift_condition: "MAP pathway drift found",
      governed_review_condition: "Governed review condition found",
    },
  },
}

function request(body: unknown) {
  return new Request("https://example.com/api/submit-assessment", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

function payload(overrides: Record<string, unknown> = {}) {
  return {
    institutionName: "Example Institution",
    contactName: "Jane Doe",
    contactEmail: "jane@example.com",
    evaluationAnswers: {
      q1: { selected: "browser", label: "Browser", institutional_context: "" },
      q2: { selected: "hardcoded", label: "Hardcoded", institutional_context: "" },
    },
    allFields: {
      institution_name: "Example Institution",
      contact_name: "Jane Doe",
      contact_email: "jane@example.com",
      role_title: "Director",
      assessment_result_email_consent: "true",
      assessment_boundary_acknowledgment: "true",
    },
    report: {
      standing_key: "client_forged",
      environmental_standing: "Client Forged Standing",
    },
    ...overrides,
  }
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

test("resolves assessment standing server-side from seated mechanics", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []

  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
        return Response.json([{ metadata: assessmentMetadata }])
      }
      if (url.endsWith("/rest/v1/measures_iis_eval_gate1_capture") && method === "POST") {
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/api/dispatch-assessment-notification") && method === "POST") {
        return Response.json({ dispatch_state: "sent" })
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    () => onRequestPost({ request: request(payload()), env } as never),
  )

  assert.equal((response as Response).status, 200)
  const body = await (response as Response).json() as Record<string, any>
  assert.equal(body.report.standing_key, "active_structural_drift")
  assert.equal(body.report.environmental_standing, "Active Runtime Exposure")
  assert.equal(body.emailArtifact.source, "server_scoring_threshold_contract")
  assert.equal(body.c2Resolution.governed_map_encounter, "map_portal")

  const captureInsert = calls.find((call) => call.url.endsWith("/rest/v1/measures_iis_eval_gate1_capture"))
  assert.ok(captureInsert)
  const captureBody = JSON.parse(captureInsert!.body) as { metadata: Record<string, any> }
  assert.equal(captureBody.metadata.environmental_standing_report.standing_key, "active_structural_drift")
  assert.equal(captureBody.metadata.assessment_result_binding.environmental_standing_report.standing_key, "active_structural_drift")
  assert.equal(captureBody.metadata.assessment_result_binding.environmental_standing_report.standing_key === "client_forged", false)
  assert.equal(captureBody.metadata.institutional_identity_relation.named_individual_registration_inferred, false)
  assert.equal(captureBody.metadata.institutional_identity_relation.operator_standing_inferred, false)
})

test("rejects incomplete answers before capture persistence", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
        return Response.json([{ metadata: assessmentMetadata }])
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    () =>
      onRequestPost({
        request: request(payload({ evaluationAnswers: { q1: { selected: "browser", label: "Browser" } } })),
        env,
      } as never),
  )

  assert.equal((response as Response).status, 400)
  const body = await (response as Response).json() as Record<string, unknown>
  assert.equal(body.error, "assessment answers are incomplete or do not match seated mechanics")
  assert.equal(calls.some((call) => call.url.endsWith("/rest/v1/measures_iis_eval_gate1_capture")), false)
})
