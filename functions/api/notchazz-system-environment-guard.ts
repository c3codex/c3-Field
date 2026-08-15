export const SYSTEM_ENVIRONMENT_MISMATCH = "SYSTEM_ENVIRONMENT_MISMATCH" as const

export type NotChazzSystemEnvironmentGuardInput = {
  active_system_key: string
  target_env_key: string
  environment_system_key?: string | null
  resolved_current_state_key?: string | null
  resolved_current_env_key?: string | null
  target_registry_system_key?: string | null
  evidence_system_key?: string | null
  mutation_system_key?: string | null
  explicit_cross_system_relation?: boolean
  source_execution_instance_id?: string
}

export type NotChazzSystemEnvironmentGuardResult = {
  standing: "pass" | "hold"
  classification: typeof SYSTEM_ENVIRONMENT_MISMATCH | "SYSTEM_ENVIRONMENT_MATCH"
  not_chazz_action: "allow_relation" | "hold_for_operator_disposition"
  grants_authority: false
  active_system_key: string
  intended_system_key: string
  mismatched_system_key: string | null
  target_env_key: string
  resolved_current_state_key: string | null
  resolved_current_env_key: string | null
  source_execution_instance_id?: string
  reasons: string[]
  review_route?: "optics_review"
}

function nonblank(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0
}

export function validateSystemEnvironmentCurrent(
  input: NotChazzSystemEnvironmentGuardInput,
): NotChazzSystemEnvironmentGuardResult {
  const reasons: string[] = []
  const mismatchedSystems = new Set<string>()
  const activeSystem = input.active_system_key
  const targetEnv = input.target_env_key

  if (!nonblank(activeSystem)) reasons.push("missing_active_system_key")
  if (!nonblank(targetEnv)) reasons.push("missing_target_env_key")

  if (!nonblank(input.environment_system_key)) {
    reasons.push("missing_environment_system_key")
  } else if (input.environment_system_key !== activeSystem) {
    reasons.push("active_system_key_does_not_match_environment_system_key")
    mismatchedSystems.add(input.environment_system_key)
  }

  if (!nonblank(input.resolved_current_state_key)) {
    reasons.push("missing_resolved_current_state_key")
  }

  if (!nonblank(input.resolved_current_env_key)) {
    reasons.push("missing_resolved_current_env_key")
  } else if (input.resolved_current_env_key !== targetEnv) {
    reasons.push("resolved_current_env_key_does_not_match_target_env_key")
    if (nonblank(input.environment_system_key)) mismatchedSystems.add(input.environment_system_key)
  }

  if (
    nonblank(input.target_registry_system_key) &&
    input.target_registry_system_key !== activeSystem &&
    !input.explicit_cross_system_relation
  ) {
    reasons.push("target_registry_system_key_cross_system_without_registered_relation")
    mismatchedSystems.add(input.target_registry_system_key)
  }

  if (
    nonblank(input.evidence_system_key) &&
    input.evidence_system_key !== activeSystem &&
    !input.explicit_cross_system_relation
  ) {
    reasons.push("evidence_system_key_cross_system_without_registered_relation")
    mismatchedSystems.add(input.evidence_system_key)
  }

  if (
    nonblank(input.mutation_system_key) &&
    input.mutation_system_key !== activeSystem &&
    !input.explicit_cross_system_relation
  ) {
    reasons.push("mutation_system_key_cross_system_without_registered_relation")
    mismatchedSystems.add(input.mutation_system_key)
  }

  if (reasons.length > 0) {
    return {
      standing: "hold",
      classification: SYSTEM_ENVIRONMENT_MISMATCH,
      not_chazz_action: "hold_for_operator_disposition",
      grants_authority: false,
      active_system_key: activeSystem,
      intended_system_key: activeSystem,
      mismatched_system_key: Array.from(mismatchedSystems)[0] ?? null,
      target_env_key: targetEnv,
      resolved_current_state_key: input.resolved_current_state_key ?? null,
      resolved_current_env_key: input.resolved_current_env_key ?? null,
      source_execution_instance_id: input.source_execution_instance_id,
      reasons,
      review_route: "optics_review",
    }
  }

  return {
    standing: "pass",
    classification: "SYSTEM_ENVIRONMENT_MATCH",
    not_chazz_action: "allow_relation",
    grants_authority: false,
    active_system_key: activeSystem,
    intended_system_key: activeSystem,
    mismatched_system_key: null,
    target_env_key: targetEnv,
    resolved_current_state_key: input.resolved_current_state_key ?? null,
    resolved_current_env_key: input.resolved_current_env_key ?? null,
    source_execution_instance_id: input.source_execution_instance_id,
    reasons: [],
  }
}
