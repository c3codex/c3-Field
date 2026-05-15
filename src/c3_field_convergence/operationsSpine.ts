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
    process_instance_key: "blocked_proposed_surface_example",
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
