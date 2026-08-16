import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost } from "./submit-assessment"

const env = {
  OPERATOR_DISPATCH_KEY: "operator-test-key",
  RESEND_API_KEY: "resend-test-key",
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
  const captures = new Map<string, Record<string, any>>()
  const evaluations: Array<Record<string, any>> = []
  const cells: Array<Record<string, any>> = []
  const exposures: Array<Record<string, any>> = []
  const artifacts = new Map<string, Record<string, any>>()
  const continuations: Array<Record<string, any>> = []
  const dispatchLogs: Array<Record<string, any>> = []
  const providerSends: Array<Record<string, any>> = []

  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.endsWith("/api/dispatch-assessment-receipt") || url.endsWith("/api/dispatch-assessment-notification")) {
        throw new Error(`Unexpected dispatch loopback: ${method} ${url}`)
      }
      if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
        return Response.json([{ metadata: assessmentMetadata }])
      }
      if (url.endsWith("/rest/v1/rpc/resolve_c3_current") && method === "POST") {
        assert.equal(JSON.parse(body).p_env_key, "env_measures_registry")
        return Response.json([{
          resolution_standing: "resolved_current_state",
          current_state_key: "current_env_measures_registry_v1",
          env_key: "env_measures_registry",
        }])
      }
      if (url.includes("c3_environment?env_key=eq.env_measures_registry")) {
        return Response.json([{ env_key: "env_measures_registry", system_key: "measures_registry" }])
      }
      if (url.endsWith("/rest/v1/measures_iis_eval_gate1_capture") && method === "POST") {
        const row = JSON.parse(body)
        captures.set(row.id, row)
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_evaluation_v2") && method === "POST") {
        evaluations.push(JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_evaluation_cell_v2") && method === "POST") {
        cells.push(...JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_evaluation_exposure_v2") && method === "POST") {
        exposures.push(...JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_delivery_artifact_v2") && method === "POST") {
        const row = JSON.parse(body)
        artifacts.set(row.evaluation_id, row)
        return new Response(null, { status: 201 })
      }
      if (url.includes("mr_assessment_delivery_artifact_v2?evaluation_id=eq.") && method === "PATCH") {
        const evaluationId = decodeURIComponent(url.match(/evaluation_id=eq\.([^&]+)/)?.[1] ?? "")
        const existing = artifacts.get(evaluationId)
        if (existing) artifacts.set(evaluationId, { ...existing, ...JSON.parse(body) })
        return new Response(null, { status: 204 })
      }
      if (url.endsWith("/rest/v1/mr_map_continuation_state_v2") && method === "POST") {
        continuations.push(JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "GET") {
        const captureId = decodeURIComponent(url.match(/id=eq\.([^&]+)/)?.[1] ?? "")
        const row = captures.get(captureId)
        return Response.json(row ? [row] : [])
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "PATCH") {
        const captureId = decodeURIComponent(url.match(/id=eq\.([^&]+)/)?.[1] ?? "")
        const patch = JSON.parse(body)
        const existing = captures.get(captureId)
        if (existing) captures.set(captureId, { ...existing, ...patch })
        return new Response(null, { status: 204 })
      }
      if (url.includes("measures_notification_template?template_key=eq.assessment_receipt_participant_v1")) {
        return Response.json([{
          template_key: "assessment_receipt_participant_v1",
          subject: "We received your Measures Registry assessment",
          body: "Thank you{{contact_name}}. We received {{assessment_ref}}.",
        }])
      }
      if (url.includes("measures_notification_template?template_key=eq.assessment_completed_participant_v1")) {
        return Response.json([{
          template_key: "assessment_completed_participant_v1",
          subject: "Your Measures Registry AI Operations Assessment Results",
          body: "Standing: {{environmental_standing}}\nContinue: {{continuation_pathway}}",
        }])
      }
      if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
        dispatchLogs.push(JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.includes("api.resend.com/emails") && method === "POST") {
        providerSends.push(JSON.parse(body))
        return Response.json({ id: `email_${providerSends.length}` })
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
  assert.equal(body.evaluationV2.matrix_cells.length, 9)
  assert.equal(body.report.evaluation_v2.evaluation_id, body.evaluationV2.evaluation_id)
  assert.equal(body.c2Resolution.active_commerce_scope, "map_the_environment")
  assert.equal(body.c2Resolution.governed_map_encounter, "MAP the Environment")
  assert.equal(body.c2Resolution.creates_portal_admission, false)
  assert.equal(body.receiptDispatch.dispatch_state, "sent")
  assert.equal(body.receiptDispatch.template_key, "assessment_receipt_participant_v1")
  assert.equal(body.dispatch.dispatch_state, "sent")
  assert.equal(calls.some((call) => call.url.endsWith("/api/dispatch-assessment-receipt")), false)
  assert.equal(calls.some((call) => call.url.endsWith("/api/dispatch-assessment-notification")), false)
  assert.equal(providerSends.length, 2)
  const resultEmail = providerSends[1]
  assert.equal(resultEmail.subject, "Your Measures Registry evaluation is ready")
  assert.match(resultEmail.text, new RegExp(body.evaluationV2.evaluation_id))
  assert.match(resultEmail.text, /MAP the Environment/)
  assert.doesNotMatch(resultEmail.text, /Governed System Integrity Implementation/)
  assert.match(resultEmail.text, /does not create verified compliance, certification, SEAT standing/)
  assert.doesNotMatch(resultEmail.text, /creates certification|creates SEAT standing|authorizes implementation/i)

  const captureInsert = calls.find((call) => call.url.endsWith("/rest/v1/measures_iis_eval_gate1_capture"))
  assert.ok(captureInsert)
  const captureBody = JSON.parse(captureInsert!.body) as { metadata: Record<string, any> }
  assert.equal(captureBody.metadata.current_state_key, "current_env_measures_registry_v1")
  assert.equal(captureBody.metadata.env_key, "env_measures_registry")
  assert.equal(captureBody.metadata.notchazz_system_environment_guard.standing, "pass")
  assert.equal(captureBody.metadata.carry_forward.destination_surface, "map_the_environment")
  assert.equal(captureBody.metadata.environmental_standing_report.standing_key, "active_structural_drift")
  assert.equal(captureBody.metadata.evaluation_id, body.evaluationV2.evaluation_id)
  assert.equal(captureBody.metadata.matrix_cells.length, 9)
  assert.equal(captureBody.metadata.map_scope.map_pathway, body.evaluationV2.map_scope.map_pathway)
  assert.equal(captureBody.metadata.assessment_result_binding.environmental_standing_report.standing_key, "active_structural_drift")
  assert.equal(captureBody.metadata.assessment_result_binding.environmental_standing_report.standing_key === "client_forged", false)
  assert.equal(captureBody.metadata.institutional_identity_relation.named_individual_registration_inferred, false)
  assert.equal(captureBody.metadata.institutional_identity_relation.operator_standing_inferred, false)
  const updatedCapture = captures.get(JSON.parse(captureInsert!.body).id)
  assert.equal(updatedCapture?.metadata.assessment_ref, captureBody.metadata.assessment_ref)
  assert.equal(updatedCapture?.metadata.confirmation_receipt_state, "sent")
  assert.equal(updatedCapture?.metadata.assessment_result_email_state, "sent")
  assert.equal(evaluations.length, 1)
  assert.equal(evaluations[0].evaluation_id, body.evaluationV2.evaluation_id)
  assert.equal(cells.length, 9)
  assert.equal(exposures.length, 4)
  assert.equal(continuations.length, 1)
  assert.equal(continuations[0].evaluation_id, body.evaluationV2.evaluation_id)
  assert.equal(artifacts.get(body.evaluationV2.evaluation_id)?.delivery_standing, "provider_accepted")
  assert.equal(dispatchLogs.length, 2)
})

test("holds system environment mismatch before capture persistence", async () => {
  const calls: Array<{ url: string; method: string; body: string }> = []
  const response = await withMockedFetch(
    (url, method, body) => {
      calls.push({ url, method, body })
      if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
        return Response.json([{ metadata: assessmentMetadata }])
      }
      if (url.endsWith("/rest/v1/rpc/resolve_c3_current") && method === "POST") {
        return Response.json([{
          resolution_standing: "resolved_current_state",
          current_state_key: "current_env_measures_of_inanna_v1",
          env_key: "env_measures_of_inanna",
        }])
      }
      if (url.includes("c3_environment?env_key=eq.env_measures_registry")) {
        return Response.json([{ env_key: "env_measures_registry", system_key: "measures_registry" }])
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    () => onRequestPost({ request: request(payload()), env } as never),
  )

  assert.equal((response as Response).status, 409)
  const body = await (response as Response).json() as Record<string, any>
  assert.equal(body.notchazz.classification, "SYSTEM_ENVIRONMENT_MISMATCH")
  assert.equal(body.notchazz.not_chazz_action, "hold_for_operator_disposition")
  assert.equal(body.notchazz.grants_authority, false)
  assert.equal(calls.some((call) => call.url.endsWith("/rest/v1/measures_iis_eval_gate1_capture")), false)
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
