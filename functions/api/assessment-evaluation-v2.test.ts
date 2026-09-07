import assert from "node:assert/strict"
import test from "node:test"

import { evaluateAssessmentV2 } from "./assessment-evaluation-v2"

test("resolves v2 matrix, held limits, and MAP pricing route without score authority", () => {
  const evaluation = evaluateAssessmentV2({
    assessment_ref: "assessment_capture-1",
    capture_id: "capture-1",
    current_state_key: "current_env_measures_registry_v1",
    env_key: "env_measures_registry",
    traces: [
      {
        question_key: "ai_deployment_status",
        selected: "production",
        label: "Production",
        condition_tags: ["emerging_ai_drift_condition"],
      },
      {
        question_key: "active_ai_system_visibility",
        selected: "visible",
        label: "Visible",
        condition_tags: ["governed_review_condition"],
      },
      {
        question_key: "failure_traceability",
        selected: "traceable",
        label: "Traceable",
        condition_tags: ["governed_review_condition"],
      },
      {
        question_key: "persistent_review_standard",
        selected: "present",
        label: "Present",
        condition_tags: ["governed_review_condition"],
      },
      {
        question_key: "role_authority_boundary",
        selected: "defined",
        label: "Defined",
        condition_tags: ["governed_review_condition"],
      },
      {
        question_key: "implementation_boundary",
        selected: "missing",
        label: "Missing",
        condition_tags: ["critical_ai_drift_condition"],
      },
      {
        question_key: "safe_ai_acceleration_capacity",
        selected: "partial",
        label: "Partial",
        condition_tags: ["probable_ai_drift_condition"],
      },
    ],
  })

  assert.equal(evaluation.evaluation_id, "evaluation_capture-1")
  assert.equal(evaluation.matrix_version, "mr_assessment_evaluation_v2_3x3_v1")
  assert.equal(evaluation.matrix_cells.length, 9)
  assert.ok(evaluation.priority_cells.includes("change_govern"))
  assert.equal(evaluation.map_scope.map_pathway, "remediation")
  assert.equal(evaluation.map_scope.amount_usd, 999)
  assert.equal(evaluation.pricing_standing.approved_offering, "remediation_999")
  assert.equal(evaluation.pricing_standing.creates_certification, false)
  assert.equal(evaluation.continuation.next_encounter_key, "marble_chamber_orientation")
  assert.ok(evaluation.verification_limits.some((limit) => limit.includes("does not create SEAT standing")))
  assert.equal(Object.prototype.hasOwnProperty.call(evaluation, "score"), false)
})
