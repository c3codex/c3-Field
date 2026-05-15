export type SourceOar2Standing = "confirmed" | "proposed" | "review_only"
export type ExecutionStanding =
  | "not_queued"
  | "queued"
  | "executing"
  | "completed"
  | "blocked"
  | "held"
export type ValidationStanding =
  | "not_ready"
  | "pending_validation"
  | "automatic_pass"
  | "chazz_review_required"
  | "operator_required"
  | "correction_required"
export type DeployStanding = "not_authorized" | "not_applicable" | "configured" | "deployed" | "held"
export type HeldStanding =
  | "held_pending_operator"
  | "held_pending_source"
  | "held_pending_validation"
  | "held_pending_identity"
  | "held_pending_deployment"
  | "held_pending_correction_oar2"
export type Actor = "operator" | "chazz" | "cody" | "measures" | "notchazz"

export type OarProcessInstance = {
  process_instance_key: string
  lifecycle_type: "valid" | "held" | "correction" | "blocked"
  source_oar2_path: string
  source_oar2_standing: SourceOar2Standing
  expected_oar1_path: string
  actual_oar1_path: string | null
  evidence_path: string | null
  execution_standing: ExecutionStanding
  validation_standing: ValidationStanding
  deploy_standing: DeployStanding
  held_standing: HeldStanding | null
  correction_source_oar2_path: string | null
  correction_oar2_path: string | null
  validation_finding: string | null
  execution_result: string
}

export type OarTransitionLogEntry = {
  process_instance_key: string
  actor: Actor
  from_status: string
  to_status: string
  timestamp: string
  notes: string
  evidence_reference: string | null
}

export type SpineValidationCheck = {
  check_key: string
  standing: "passed" | "held" | "correction_required"
  evidence: string
}

export function canEnterOarQueue(instance: OarProcessInstance) {
  return instance.source_oar2_standing === "confirmed"
}

export function queueBlockReason(instance: OarProcessInstance) {
  if (instance.source_oar2_standing === "review_only") return "review_only surfaces cannot execute"
  if (instance.source_oar2_standing === "proposed") return "proposed-only standing cannot execute"
  return null
}

export const oarProcessInstances: OarProcessInstance[] = [
  {
    process_instance_key: "c3fc_phase_1_oar_operations_spine_v1",
    lifecycle_type: "valid",
    source_oar2_path: "docs/oar/c3_field_convergence/oar2_phase_1_oar_operations_spine_v1.meta.md",
    source_oar2_standing: "confirmed",
    expected_oar1_path: "docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md",
    actual_oar1_path: "docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md",
    evidence_path: "src/c3_field_convergence/operationsSpine.ts",
    execution_standing: "completed",
    validation_standing: "pending_validation",
    deploy_standing: "configured",
    held_standing: null,
    correction_source_oar2_path: null,
    correction_oar2_path: null,
    validation_finding: null,
    execution_result: "Minimum viable OAR operations spine implemented as bounded runtime console.",
  },
  {
    process_instance_key: "controlled_valid_oar2_cycle_v1",
    lifecycle_type: "valid",
    source_oar2_path: "docs/oar/c3_field_convergence/oar2_controlled_valid_cycle_v1.meta.md",
    source_oar2_standing: "confirmed",
    expected_oar1_path: "docs/oar/c3_field_convergence/oar1_controlled_valid_cycle_v1.meta.md",
    actual_oar1_path: "docs/oar/c3_field_convergence/oar1_controlled_valid_cycle_v1.meta.md",
    evidence_path: "src/c3_field_convergence/operationsSpine.ts",
    execution_standing: "completed",
    validation_standing: "chazz_review_required",
    deploy_standing: "not_applicable",
    held_standing: null,
    correction_source_oar2_path: null,
    correction_oar2_path: null,
    validation_finding: "Controlled valid lifecycle preserves OAR2 -> execution -> OAR1 -> validation continuity.",
    execution_result: "Valid controlled lifecycle completed and routed to Chazz review.",
  },
  {
    process_instance_key: "controlled_held_oar2_cycle_v1",
    lifecycle_type: "held",
    source_oar2_path: "docs/oar/c3_field_convergence/oar2_controlled_held_cycle_v1.meta.md",
    source_oar2_standing: "confirmed",
    expected_oar1_path: "docs/oar/c3_field_convergence/oar1_controlled_held_cycle_v1.meta.md",
    actual_oar1_path: null,
    evidence_path: "src/c3_field_convergence/operationsSpine.ts",
    execution_standing: "held",
    validation_standing: "operator_required",
    deploy_standing: "held",
    held_standing: "held_pending_operator",
    correction_source_oar2_path: null,
    correction_oar2_path: null,
    validation_finding: "Held standing remains visible and does not silently execute.",
    execution_result: "Held lifecycle stopped before OAR1 proof until operator condition is resolved.",
  },
  {
    process_instance_key: "controlled_correction_lineage_oar2_cycle_v1",
    lifecycle_type: "correction",
    source_oar2_path: "docs/oar/c3_field_convergence/oar2_controlled_correction_cycle_v1.meta.md",
    source_oar2_standing: "confirmed",
    expected_oar1_path: "docs/oar/c3_field_convergence/oar1_controlled_correction_cycle_v1.meta.md",
    actual_oar1_path: "docs/oar/c3_field_convergence/oar1_controlled_partial_cycle_v1.meta.md",
    evidence_path: "src/c3_field_convergence/operationsSpine.ts",
    execution_standing: "held",
    validation_standing: "correction_required",
    deploy_standing: "not_authorized",
    held_standing: "held_pending_correction_oar2",
    correction_source_oar2_path: "docs/oar/c3_field_convergence/oar2_controlled_correction_cycle_v1.meta.md",
    correction_oar2_path: "docs/oar/c3_field_convergence/oar2_controlled_correction_followup_v1.meta.md",
    validation_finding: "Correction lineage retains source OAR2, partial OAR1, validation finding, and follow-up scope.",
    execution_result: "Correction lifecycle retained lineage and blocked deployment.",
  },
  {
    process_instance_key: "blocked_proposed_surface_example",
    lifecycle_type: "blocked",
    source_oar2_path: "docs/oar/c3_field_convergence/example_proposed_only.meta.md",
    source_oar2_standing: "proposed",
    expected_oar1_path: "unavailable",
    actual_oar1_path: null,
    evidence_path: null,
    execution_standing: "blocked",
    validation_standing: "not_ready",
    deploy_standing: "not_authorized",
    held_standing: "held_pending_source",
    correction_source_oar2_path: null,
    correction_oar2_path: null,
    validation_finding: "Queue rule demonstration: proposed-only standing is not executable.",
    execution_result: "Blocked before Cody execution.",
  },
  {
    process_instance_key: "blocked_review_only_surface_example",
    lifecycle_type: "blocked",
    source_oar2_path: "docs/oar/c3_field_convergence/example_review_only.meta.md",
    source_oar2_standing: "review_only",
    expected_oar1_path: "unavailable",
    actual_oar1_path: null,
    evidence_path: null,
    execution_standing: "blocked",
    validation_standing: "not_ready",
    deploy_standing: "not_authorized",
    held_standing: "held_pending_operator",
    correction_source_oar2_path: null,
    correction_oar2_path: null,
    validation_finding: "Queue rule demonstration: review-only surfaces cannot execute.",
    execution_result: "Blocked before Cody execution.",
  },
]

export const oarTransitionLog: OarTransitionLogEntry[] = [
  {
    process_instance_key: "c3fc_phase_1_oar_operations_spine_v1",
    actor: "operator",
    from_status: "not_queued",
    to_status: "confirmed",
    timestamp: "2026-05-14T00:00:00-05:00",
    notes: "OAR2 routed as Phase 1 operational spine implementation surface.",
    evidence_reference: "docs/oar/c3_field_convergence/oar2_phase_1_oar_operations_spine_v1.meta.md",
  },
  {
    process_instance_key: "c3fc_phase_1_oar_operations_spine_v1",
    actor: "cody",
    from_status: "confirmed",
    to_status: "executing",
    timestamp: "2026-05-14T00:10:00-05:00",
    notes: "Cody execution began from seated OAR2 authority.",
    evidence_reference: "src/c3_field_convergence/operationsSpine.ts",
  },
  {
    process_instance_key: "c3fc_phase_1_oar_operations_spine_v1",
    actor: "cody",
    from_status: "executing",
    to_status: "pending_validation",
    timestamp: "2026-05-14T00:20:00-05:00",
    notes: "OAR operations console implemented; OAR1 proof required for closeout.",
    evidence_reference: "docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md",
  },
  {
    process_instance_key: "controlled_valid_oar2_cycle_v1",
    actor: "cody",
    from_status: "queued",
    to_status: "completed",
    timestamp: "2026-05-14T00:30:00-05:00",
    notes: "Controlled valid lifecycle reached OAR1 proof and external validation queue.",
    evidence_reference: "src/c3_field_convergence/operationsSpine.ts",
  },
  {
    process_instance_key: "controlled_held_oar2_cycle_v1",
    actor: "notchazz",
    from_status: "queued",
    to_status: "held_pending_operator",
    timestamp: "2026-05-14T00:40:00-05:00",
    notes: "Held lifecycle preserved visible stop condition before execution completion.",
    evidence_reference: "src/c3_field_convergence/operationsSpine.ts",
  },
  {
    process_instance_key: "controlled_correction_lineage_oar2_cycle_v1",
    actor: "chazz",
    from_status: "pending_validation",
    to_status: "correction_required",
    timestamp: "2026-05-14T00:50:00-05:00",
    notes: "Correction lineage preserved source OAR2, partial OAR1, finding, and correction OAR2 route.",
    evidence_reference: "docs/oar/c3_field_convergence/oar2_controlled_correction_followup_v1.meta.md",
  },
]

export const heldStates: HeldStanding[] = [
  "held_pending_operator",
  "held_pending_source",
  "held_pending_validation",
  "held_pending_identity",
  "held_pending_deployment",
  "held_pending_correction_oar2",
]

export const validationStates: ValidationStanding[] = [
  "pending_validation",
  "automatic_pass",
  "chazz_review_required",
  "operator_required",
  "correction_required",
]

export function validateQueueIntegrity(instances: OarProcessInstance[]): SpineValidationCheck[] {
  const proposedBlocked = instances
    .filter((instance) => instance.source_oar2_standing === "proposed")
    .every((instance) => instance.execution_standing === "blocked")
  const reviewOnlyBlocked = instances
    .filter((instance) => instance.source_oar2_standing === "review_only")
    .every((instance) => instance.execution_standing === "blocked")
  const confirmedVisible = instances
    .filter((instance) => instance.source_oar2_standing === "confirmed")
    .every((instance) => instance.execution_standing !== "not_queued")

  return [
    {
      check_key: "confirmed_oar2_entry_visible",
      standing: confirmedVisible ? "passed" : "correction_required",
      evidence: "Confirmed OAR2 instances carry explicit execution standing.",
    },
    {
      check_key: "proposed_standing_blocked",
      standing: proposedBlocked ? "passed" : "correction_required",
      evidence: "Proposed-only surfaces remain blocked before Cody execution.",
    },
    {
      check_key: "review_only_standing_blocked",
      standing: reviewOnlyBlocked ? "passed" : "correction_required",
      evidence: "Review-only surfaces remain blocked before Cody execution.",
    },
  ]
}

export function validateImmutableTransitionLog(log: OarTransitionLogEntry[]): SpineValidationCheck[] {
  const hasEvidence = log.every((entry) => Boolean(entry.evidence_reference))
  const hasActors = log.every((entry) => Boolean(entry.actor))
  const orderedByTimestamp = log.every((entry, index) => {
    if (index === 0) return true
    return Date.parse(entry.timestamp) >= Date.parse(log[index - 1].timestamp)
  })

  return [
    {
      check_key: "transition_log_evidence_present",
      standing: hasEvidence ? "passed" : "correction_required",
      evidence: "Every transition entry retains an evidence reference.",
    },
    {
      check_key: "transition_log_actor_continuity",
      standing: hasActors ? "passed" : "correction_required",
      evidence: "Every transition entry retains actor standing.",
    },
    {
      check_key: "transition_log_timestamp_continuity",
      standing: orderedByTimestamp ? "passed" : "correction_required",
      evidence: "Transition entries remain reconstructable in timestamp order.",
    },
  ]
}

export const seededReferenceReview: SpineValidationCheck[] = [
  {
    check_key: "infrastructure_oar1_upstream",
    standing: "passed",
    evidence: "docs/oar/c3_field_convergence/oar1_c3field_online_infrastructure_activation_v1.meta.md remains deployment standing reference.",
  },
  {
    check_key: "role_oar1_upstream",
    standing: "passed",
    evidence: "docs/oar/c3_field_convergence/oar1_foundational_role_registration_v1.meta.md remains role continuity reference.",
  },
  {
    check_key: "unseeded_surfaces_do_not_govern",
    standing: "passed",
    evidence: "Controlled proposed and review-only surfaces are blocked before execution.",
  },
]
