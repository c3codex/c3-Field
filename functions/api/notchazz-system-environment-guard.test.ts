import assert from "node:assert/strict"
import test from "node:test"

import { validateSystemEnvironmentCurrent } from "./notchazz-system-environment-guard"

test("passes same-system Measures Registry environment Current relation", () => {
  const result = validateSystemEnvironmentCurrent({
    active_system_key: "measures_registry",
    target_env_key: "env_measures_registry",
    environment_system_key: "measures_registry",
    resolved_current_state_key: "current_env_measures_registry_v1",
    resolved_current_env_key: "env_measures_registry",
    target_registry_system_key: "measures_registry",
    evidence_system_key: "measures_registry",
    mutation_system_key: "measures_registry",
    source_execution_instance_id: "correct_measures_current_and_notchazz_env_guard_codex_001",
  })

  assert.equal(result.standing, "pass")
  assert.equal(result.classification, "SYSTEM_ENVIRONMENT_MATCH")
  assert.equal(result.not_chazz_action, "allow_relation")
  assert.equal(result.grants_authority, false)
})

test("holds Measures Registry relation resolved through Measures of Inanna Current", () => {
  const result = validateSystemEnvironmentCurrent({
    active_system_key: "measures_registry",
    target_env_key: "env_measures_registry",
    environment_system_key: "measures_registry",
    resolved_current_state_key: "current_env_measures_of_inanna_v1",
    resolved_current_env_key: "env_measures_of_inanna",
    target_registry_system_key: "measures_registry",
    evidence_system_key: "measures_of_inanna",
    source_execution_instance_id: "normalize_measures_current_assessment_map_carrythrough_codex_001",
  })

  assert.equal(result.standing, "hold")
  assert.equal(result.classification, "SYSTEM_ENVIRONMENT_MISMATCH")
  assert.equal(result.not_chazz_action, "hold_for_operator_disposition")
  assert.equal(result.review_route, "optics_review")
  assert.equal(result.grants_authority, false)
  assert.ok(result.reasons.includes("resolved_current_env_key_does_not_match_target_env_key"))
  assert.ok(result.reasons.includes("evidence_system_key_cross_system_without_registered_relation"))
})
