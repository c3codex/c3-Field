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

test("handles and logs dispatcher 403 boundary failure gracefully", async () => {
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
        return new Response(null, { status: 201 })
      }
      if (url.endsWith("/api/dispatch-assessment-receipt") && method === "POST") {
        // Return 403 Forbidden to trigger our failure observability
        return new Response(JSON.stringify({ error: "dispatch access denied" }), { status: 403 })
      }
      if (url.endsWith("/api/dispatch-assessment-notification") && method === "POST") {
        // Return 503 to trigger failure observability
        return new Response(JSON.stringify({ error: "RESEND_API_KEY is not configured" }), { status: 503 })
      }
      if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "PATCH") {
        patches.push(JSON.parse(body))
        return new Response(null, { status: 204 })
      }
      if (url.endsWith("/rest/v1/measures_notification_dispatch_log") && method === "POST") {
        logs.push(JSON.parse(body))
        return new Response(null, { status: 201 })
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
  assert.equal(body.receiptDispatch.status, 403)
  assert.equal(body.receiptDispatch.error, "dispatch access denied")
  assert.equal(body.dispatch.status, 503)
  assert.equal(body.dispatch.error, "RESEND_API_KEY is not configured")

  // Verify that the database was correctly updated with the failed statuses
  assert.ok(patches.length >= 2)
  const receiptPatch = patches.find(p => p.confirmation_email_state === "failed")
  assert.ok(receiptPatch)
  assert.equal(receiptPatch!.metadata.confirmation_receipt_state, "failed")
  assert.match(receiptPatch!.metadata.confirmation_receipt_failure_reason || "", /dispatch access denied/)

  const notificationPatch = patches.find(p => p.notification_state === "failed")
  assert.ok(notificationPatch)
  assert.equal(notificationPatch!.metadata.assessment_result_email_state, "failed")
  assert.match(notificationPatch!.metadata.dispatch_error || "", /RESEND_API_KEY is not configured/)

  // Verify that the dispatch logs were correctly generated
  assert.equal(logs.length, 2)
  const receiptLog = logs.find(l => l.metadata.notification_class === "assessment_receipt")
  assert.ok(receiptLog)
  assert.equal(receiptLog!.dispatch_state, "failed")
  assert.match(receiptLog!.error_message || "", /dispatch access denied/)

  const notificationLog = logs.find(l => l.metadata.notification_class === "assessment_result")
  assert.ok(notificationLog)
  assert.equal(notificationLog!.dispatch_state, "failed")
  assert.match(notificationLog!.error_message || "", /RESEND_API_KEY is not configured/)
})
