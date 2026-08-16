import assert from "node:assert/strict"
import test from "node:test"

import { onRequestPost as submitAssessment } from "./submit-assessment"
import { onRequestPost as dispatchReceipt } from "./dispatch-assessment-receipt"
import { onRequestPost as dispatchResultEmail } from "./dispatch-assessment-notification"
import { onRequestPost as createCheckout } from "./map/create-checkout-session"
import { onRequestGet as paymentStatus } from "./map/payment-status/[map_order_id]"

const env = {
  OPERATOR_DISPATCH_KEY: "operator-test-key",
  RESEND_API_KEY: "resend-test-key",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-test",
  STRIPE_SECRET_KEY: "sk_test",
  STRIPE_MAP_FOUNDATIONAL_PRICE_ID: "price_foundational",
}

const assessmentMetadata = {
  assessment_mechanics: {
    questions: [
      {
        question_key: "q1",
        question: "Where is result authority seated?",
        options: [
          { value: "browser", label: "Browser", condition_tags: ["critical_ai_drift_condition"] },
          { value: "registry", label: "Registry", condition_tags: ["governed_review_condition"] },
        ],
      },
      {
        question_key: "q2",
        question: "Where should Current resolve?",
        options: [
          { value: "cross_system", label: "Cross-system", condition_tags: ["emerging_ai_drift_condition"] },
          { value: "measures_registry", label: "Measures Registry", condition_tags: ["governed_review_condition"] },
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
        operational_exposure_summary: "Governed controls are visible.",
        recommended_structured_action: "Continue through MAP the Environment.",
        continuation_pathway: "MAP the Environment",
      },
      {
        min: 41,
        max: 100,
        standing_key: "active_structural_drift",
        standing: "Active Runtime Exposure",
        assessment_result: "Active Structural Drift Detected",
        operational_exposure_summary: "Runtime drift is present.",
        recommended_structured_action: "Continue through MAP the Environment.",
        continuation_pathway: "MAP the Environment",
      },
    ],
    standing_rules: [],
    email_artifact_template: {
      subject: "{assessment_result}",
      preview: "{environmental_standing}",
      body: ["Standing: {environmental_standing}", "Continue: {continuation_pathway}"],
    },
    report_labels: {
      assessment_title: "MEASURES AI ENVIRONMENT ASSESSMENT",
      recommended_response_label: "Recommended Operational Response",
    },
    finding_map: {
      critical_ai_drift_condition: "Browser authority drift found",
      emerging_ai_drift_condition: "Cross-system Current drift found",
      governed_review_condition: "Governed review condition found",
    },
  },
}

function assessmentPayload() {
  return {
    institutionName: "Controlled Test Institution",
    contactName: "Codex Test",
    contactEmail: "codex-test@example.com",
    evaluationAnswers: {
      q1: { selected: "browser", label: "Browser", institutional_context: "" },
      q2: { selected: "cross_system", label: "Cross-system", institutional_context: "" },
    },
    allFields: {
      institution_name: "Controlled Test Institution",
      contact_name: "Codex Test",
      contact_email: "codex-test@example.com",
      role_title: "Validation Executor",
      assessment_result_email_consent: "true",
      assessment_boundary_acknowledgment: "true",
    },
    report: {
      standing_key: "client_forged",
      environmental_standing: "Client Forged Standing",
    },
  }
}

test("validates assessment to Current-bound C2 passage without production side effects", async () => {
  const originalFetch = globalThis.fetch
  const captures = new Map<string, Record<string, any>>()
  const evaluations: Array<Record<string, any>> = []
  const cells: Array<Record<string, any>> = []
  const artifacts = new Map<string, Record<string, any>>()
  const payments = new Map<string, Record<string, any>>()
  const dispatchLogs: Array<Record<string, any>> = []
  const providerSends: Array<Record<string, any>> = []
  const stripeBodies: URLSearchParams[] = []
  let currentMode: "measures" | "inanna" = "measures"

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? "GET"
    const rawBody = String(init?.body ?? "")

    if (url.endsWith("/api/dispatch-assessment-receipt") && method === "POST") {
      return dispatchReceipt({
        request: new Request(url, {
          method,
          headers: init?.headers,
          body: rawBody,
        }),
        env,
      } as never)
    }
    if (url.endsWith("/api/dispatch-assessment-notification") && method === "POST") {
      return dispatchResultEmail({
        request: new Request(url, {
          method,
          headers: init?.headers,
          body: rawBody,
        }),
        env,
      } as never)
    }

    if (url.includes("measures_encounter_def?encounter_key=eq.measures_assessment")) {
      return Response.json([{ metadata: assessmentMetadata }])
    }
    if (url.endsWith("/rest/v1/rpc/resolve_c3_current") && method === "POST") {
      return Response.json(currentMode === "measures"
        ? [{
            resolution_standing: "resolved_current_state",
            current_state_key: "current_env_measures_registry_v1",
            env_key: "env_measures_registry",
          }]
        : [{
            resolution_standing: "resolved_current_state",
            current_state_key: "current_env_measures_of_inanna_v1",
            env_key: "env_measures_of_inanna",
          }])
    }
    if (url.includes("c3_environment?env_key=eq.env_measures_registry")) {
      return Response.json([{ env_key: "env_measures_registry", system_key: "measures_registry" }])
    }
    if (url.endsWith("/rest/v1/measures_iis_eval_gate1_capture") && method === "POST") {
      const row = JSON.parse(rawBody)
      captures.set(row.id, row)
      return new Response(null, { status: 201 })
    }
    if (url.endsWith("/rest/v1/mr_assessment_evaluation_v2") && method === "POST") {
      evaluations.push(JSON.parse(rawBody))
      return new Response(null, { status: 201 })
    }
    if (url.endsWith("/rest/v1/mr_assessment_evaluation_cell_v2") && method === "POST") {
      cells.push(...JSON.parse(rawBody))
      return new Response(null, { status: 201 })
    }
    if (url.endsWith("/rest/v1/mr_assessment_evaluation_exposure_v2") && method === "POST") {
      return new Response(null, { status: 201 })
    }
    if (url.endsWith("/rest/v1/mr_assessment_delivery_artifact_v2") && method === "POST") {
      const row = JSON.parse(rawBody)
      artifacts.set(row.evaluation_id, row)
      return new Response(null, { status: 201 })
    }
    if (url.includes("mr_assessment_delivery_artifact_v2?evaluation_id=eq.") && method === "PATCH") {
      const evaluationId = decodeURIComponent(url.match(/evaluation_id=eq\.([^&]+)/)?.[1] ?? "")
      const existing = artifacts.get(evaluationId)
      if (existing) artifacts.set(evaluationId, { ...existing, ...JSON.parse(rawBody) })
      return new Response(null, { status: 204 })
    }
    if (url.endsWith("/rest/v1/mr_map_continuation_state_v2") && method === "POST") {
      return new Response(null, { status: 201 })
    }
    if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "GET") {
      const id = new URL(url).pathname.split("id=eq.")[1] ?? url.match(/id=eq\.([^&]+)/)?.[1]
      const captureId = decodeURIComponent(id?.split("&")[0] ?? "")
      const row = captures.get(captureId)
      return Response.json(row ? [row] : [])
    }
    if (url.includes("measures_iis_eval_gate1_capture?id=eq.") && method === "PATCH") {
      const captureId = decodeURIComponent(url.match(/id=eq\.([^&]+)/)?.[1] ?? "")
      const patch = JSON.parse(rawBody)
      const existing = captures.get(captureId)
      if (existing) captures.set(captureId, { ...existing, ...patch })
      return new Response(null, { status: 204 })
    }
    if (url.includes("measures_notification_template?template_key=eq.assessment_receipt_participant_v1")) {
      return Response.json([{
        template_key: "assessment_receipt_participant_v1",
        subject: "We received your Measures Registry assessment",
        body: "Thank you{{contact_name}}. We received {{assessment_ref}}. Result delivery will follow.",
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
      dispatchLogs.push(JSON.parse(rawBody))
      return new Response(null, { status: 201 })
    }
    if (url.includes("api.resend.com/emails") && method === "POST") {
      const send = JSON.parse(rawBody)
      providerSends.push(send)
      return Response.json({ id: `email_${providerSends.length}` })
    }

    if (url.includes("map_c2_circuit?")) {
      return Response.json([{
        map_circuit_key: "pre_deployment",
        map_pathway: "foundational",
        product_name: "MAP Foundational Review",
        amount_usd: 333,
        currency: "usd",
        stripe_product_id: "prod_foundational",
        stripe_price_id: "price_foundational",
        stripe_price_env_key: "STRIPE_MAP_FOUNDATIONAL_PRICE_ID",
        applicable_standing_keys: ["active_structural_drift"],
      }])
    }
    if (url.endsWith("/rest/v1/map_payment_events") && method === "POST") {
      const row = {
        map_order_id: "00000000-0000-4000-8000-000000000001",
        ...JSON.parse(rawBody),
      }
      payments.set(row.map_order_id, row)
      return Response.json([{ map_order_id: row.map_order_id, current_state_key: row.current_state_key }])
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "PATCH") {
      const id = decodeURIComponent(url.match(/map_order_id=eq\.([^&]+)/)?.[1] ?? "")
      const existing = payments.get(id)
      if (existing) payments.set(id, { ...existing, ...JSON.parse(rawBody) })
      return new Response(null, { status: 204 })
    }
    if (url.includes("map_payment_events?map_order_id=eq.") && method === "GET") {
      const id = decodeURIComponent(url.match(/map_order_id=eq\.([^&]+)/)?.[1] ?? "")
      const row = payments.get(id)
      return Response.json(row ? [row] : [])
    }
    if (url.includes("api.stripe.com/v1/checkout/sessions") && method === "POST") {
      const params = new URLSearchParams(rawBody)
      stripeBodies.push(params)
      return Response.json({ id: "cs_test_current_carrythrough", url: "https://checkout.stripe.test/current" })
    }

    throw new Error(`Unexpected fetch: ${method} ${url}`)
  }) as typeof fetch

  try {
    const submitResponse = await submitAssessment({
      request: new Request("https://example.com/api/submit-assessment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(assessmentPayload()),
      }),
      env,
    } as never)
    assert.equal(submitResponse.status, 200)
    const submitBody = await submitResponse.json() as Record<string, any>
    assert.equal(submitBody.report.standing_key, "active_structural_drift")
    assert.equal(submitBody.c2Resolution.current_state_key, "current_env_measures_registry_v1")
    assert.equal(submitBody.c2Resolution.evaluation_id, submitBody.evaluationV2.evaluation_id)
    assert.equal(submitBody.c2Resolution.active_commerce_scope, "map_the_environment")
    assert.equal(submitBody.receiptDispatch.template_key, "assessment_receipt_participant_v1")
    assert.equal(submitBody.dispatch.dispatch_state, "sent")

    const capture = captures.get(submitBody.capture_id)
    assert.ok(capture)
    assert.equal(capture.metadata.notchazz_system_environment_guard.standing, "pass")
    assert.equal(capture.metadata.current_state_key, "current_env_measures_registry_v1")
    assert.equal(capture.metadata.environmental_standing_report.standing_key, submitBody.report.standing_key)
    assert.equal(capture.metadata.evaluation_v2.evaluation_id, submitBody.evaluationV2.evaluation_id)
    assert.equal(capture.metadata.matrix_cells.length, 9)
    assert.equal(capture.metadata.carry_forward.destination_surface, "map_the_environment")
    assert.equal(capture.metadata.confirmation_receipt_state, "sent")
    assert.equal(capture.metadata.assessment_result_email_state, "sent")
    assert.equal(capture.confirmation_email_state, "sent")
    assert.equal(capture.notification_state, "notified")
    assert.equal(evaluations.length, 1)
    assert.equal(cells.length, 9)
    assert.equal(artifacts.get(submitBody.evaluationV2.evaluation_id)?.delivery_standing, "provider_accepted")

    const receiptLog = dispatchLogs.find((log) => log.template_key === "assessment_receipt_participant_v1")
    const resultLog = dispatchLogs.find((log) => log.template_key === "assessment_completed_participant_v1")
    assert.ok(receiptLog)
    assert.ok(resultLog)
    assert.equal(receiptLog.metadata.notification_class, "assessment_receipt")
    assert.equal(receiptLog.metadata.current_state_key, "current_env_measures_registry_v1")
    assert.equal(receiptLog.metadata.does_not_include_assessment_result, true)
    assert.equal(resultLog.metadata.success, true)
    for (const send of providerSends) {
      const text = `${send.subject}\n${send.text}\n${send.html}`
      assert.equal(/\bC[123]\b/.test(text), false)
      assert.equal(/map-portal|seat-portal|portal admission|certification/i.test(text), false)
    }

    const duplicateReceipt = await dispatchReceipt({
      request: new Request("https://example.com/api/dispatch-assessment-receipt", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-operator-dispatch-key": "operator-test-key",
        },
        body: JSON.stringify({ capture_id: submitBody.capture_id }),
      }),
      env,
    } as never)
    assert.equal((await duplicateReceipt.json() as Record<string, unknown>).dispatch_state, "already_sent")
    assert.equal(providerSends.filter((send) => send.subject === "We received your Measures Registry assessment").length, 1)

    const checkoutResponse = await createCheckout({
      request: new Request("https://example.com/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          evaluation_result_id: submitBody.assessment_ref,
          current_state_key: submitBody.c2Resolution.current_state_key,
          map_standing: submitBody.report.standing_key,
          map_pathway: "foundational",
          contact_email: "codex-test@example.com",
          success_url: "https://example.com/map-confirmation",
          cancel_url: "https://example.com/map-the-environment",
        }),
      }),
      env,
    } as never)
    assert.equal(checkoutResponse.status, 200)
    const checkoutBody = await checkoutResponse.json() as Record<string, any>
    const payment = payments.get(checkoutBody.map_order_id)
    assert.ok(payment)
    assert.equal(payment.evaluation_result_id, submitBody.assessment_ref)
    assert.equal(payment.current_state_key, "current_env_measures_registry_v1")
    assert.equal(payment.oar_state, "checkout_initiated")
    assert.equal(payment.scheduling_state, "held")
    assert.equal(stripeBodies[0].get("metadata[assessment_result_id]"), submitBody.assessment_ref)
    assert.equal(stripeBodies[0].get("metadata[current_state_key]"), "current_env_measures_registry_v1")
    assert.equal(stripeBodies[0].get("metadata[creates_seat]"), "false")
    assert.equal(stripeBodies[0].get("metadata[creates_c3_key]"), "false")
    assert.equal(stripeBodies[0].get("metadata[creates_certification]"), "false")

    payments.set(checkoutBody.map_order_id, {
      ...payment,
      payment_status: "paid",
      scheduling_state: "released",
      paid_at: "2026-08-15T04:55:00.000Z",
    })
    const statusResponse = await paymentStatus({
      params: { map_order_id: checkoutBody.map_order_id },
      env,
    } as never)
    const statusBody = await statusResponse.json() as Record<string, any>
    assert.equal(statusBody.scheduling_released, true)
    assert.equal(statusBody.current_state_key, "current_env_measures_registry_v1")

    currentMode = "inanna"
    const mismatchResponse = await submitAssessment({
      request: new Request("https://example.com/api/submit-assessment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(assessmentPayload()),
      }),
      env,
    } as never)
    assert.equal(mismatchResponse.status, 409)
    const mismatchBody = await mismatchResponse.json() as Record<string, any>
    assert.equal(mismatchBody.notchazz.classification, "SYSTEM_ENVIRONMENT_MISMATCH")
    assert.equal(mismatchBody.notchazz.grants_authority, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
