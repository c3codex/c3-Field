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
    ],
  },
  assessment_interpretation: {
    scoring_thresholds: [
      {
        min: 0,
        max: 100,
        standing_key: "structured_governance_candidate",
        standing: "Structured Governance Candidate",
        assessment_result: "Governed Review Ready",
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
    },
  },
}

function request() {
  return new Request("https://example.com/api/submit-assessment", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      institutionName: "Example Institution",
      contactName: "Jane Doe",
      contactEmail: "jane@example.com",
      evaluationAnswers: {
        q1: { selected: "browser", label: "Browser" },
      },
      allFields: {
        institution_name: "Example Institution",
        contact_name: "Jane Doe",
        contact_email: "jane@example.com",
        role_title: "Director",
        assessment_result_email_consent: "true",
        assessment_boundary_acknowledgment: "true",
      },
    }),
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

test("handles and logs provider failure without dispatch loopback", async () => {
  const captures = new Map<string, Record<string, any>>()
  const artifacts = new Map<string, Record<string, any>>()
  const patches: Array<{
    confirmation_email_state?: string;
    notification_state?: string;
    metadata: {
      confirmation_receipt_state?: string;
      confirmation_receipt_failure_reason?: string;
      assessment_result_email_state?: string;
      dispatch_error?: string;
    }
  }> = []
  const logs: Array<{
    dispatch_state: string;
    error_message: string;
    metadata: {
      notification_class: string;
    }
  }> = []

  const response = await withMockedFetch(
    (url, method, body) => {
      if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
        return Response.json([{ metadata: assessmentMetadata }])
      }
      if (url.endsWith("/rest/v1/rpc/resolve_c3_current") && method === "POST") {
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
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_evaluation_cell_v2") && method === "POST") {
        assert.equal(JSON.parse(body).length, 9)
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/rest/v1/mr_assessment_evaluation_exposure_v2") && method === "POST") {
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
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/api/dispatch-assessment-receipt") && method === "POST") {
        throw new Error(`Unexpected dispatch loopback: ${method} ${url}`)
      }
      if (url.endsWith("/api/dispatch-assessment-notification") && method === "POST") {
        throw new Error(`Unexpected dispatch loopback: ${method} ${url}`)
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "GET") {
        const captureId = decodeURIComponent(url.match(/id=eq\.([^&]+)/)?.[1] ?? "")
        const row = captures.get(captureId)
        return Response.json(row ? [row] : [])
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "PATCH") {
        patches.push(JSON.parse(body))
        return new Response(null, { status: 204 })
      }
      if (url.includes("measures_notification_template?template_key=eq.assessment_receipt_participant_v1")) {
        return Response.json([{
          template_key: "assessment_receipt_participant_v1",
          subject: "Receipt {{assessment_ref}}",
          body: "Receipt {{assessment_ref}}",
        }])
      }
      if (url.includes("measures_notification_template?template_key=eq.assessment_completed_participant_v1")) {
        return Response.json([{
          template_key: "assessment_completed_participant_v1",
          subject: "Result {{environmental_standing}}",
          body: "Standing {{environmental_standing}}",
        }])
      }
      if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
        logs.push(JSON.parse(body))
        return new Response(null, { status: 201 })
      }
      if (url.includes("api.resend.com/emails") && method === "POST") {
        return new Response(JSON.stringify({ message: "RESEND_API_KEY is not configured" }), { status: 503 })
      }
      throw new Error(`Unexpected fetch: ${method} ${url}`)
    },
    () => onRequestPost({ request: request(), env } as never),
  )

  assert.equal((response as Response).status, 200)
  const body = await (response as Response).json() as {
    success: boolean;
    receiptDispatch: { status: number; error?: string };
    dispatch: { status: number; error?: string };
  }
  assert.equal(body.success, true)
  assert.equal(body.receiptDispatch.status, 503)
  assert.equal(body.receiptDispatch.error, "RESEND_API_KEY is not configured")
  assert.equal(body.dispatch.status, 503)
  assert.equal(body.dispatch.error, "RESEND_API_KEY is not configured")
  assert.equal([...artifacts.values()][0]?.delivery_standing, "provider_failed")

  // Verify that the database was correctly updated with the failed statuses
  assert.ok(patches.length >= 2)
  const receiptPatch = patches.find(p => p.confirmation_email_state === "failed")
  assert.ok(receiptPatch)
  assert.equal(receiptPatch!.metadata.confirmation_receipt_state, "failed")
  assert.match(receiptPatch!.metadata.confirmation_receipt_failure_reason || "", /RESEND_API_KEY is not configured/)

  const notificationPatch = patches.find(p => p.notification_state === "failed")
  assert.ok(notificationPatch)
  assert.equal(notificationPatch!.metadata.assessment_result_email_state, "failed")
  assert.match(notificationPatch!.metadata.dispatch_error || "", /RESEND_API_KEY is not configured/)

  // Verify that the dispatch logs were correctly generated
  assert.equal(logs.length, 2)
  const receiptLog = logs.find(l => l.metadata.notification_class === "assessment_receipt")
  assert.ok(receiptLog)
  assert.equal(receiptLog!.dispatch_state, "failed")
  assert.match(receiptLog!.error_message || "", /RESEND_API_KEY is not configured/)

  const notificationLog = logs.find(l => l.metadata.notification_class === "assessment_result")
  assert.ok(notificationLog)
  assert.equal(notificationLog!.dispatch_state, "failed")
  assert.match(notificationLog!.error_message || "", /RESEND_API_KEY is not configured/)
})
