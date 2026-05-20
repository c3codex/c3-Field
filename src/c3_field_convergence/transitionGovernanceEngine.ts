import type { OarProcessInstance, OarTransitionLogEntry, SpineValidationCheck } from "./operationsSpine"

export type TransitionAuthorityStanding = "permitted" | "held" | "blocked"
export type ContinuityPressureStanding = "clear" | "pressure" | "critical"
export type CorrectionPropagationStanding = "none" | "local" | "downstream"
export type PassageStanding = "encounterable" | "held" | "blocked"
export type ReleaseCadenceStanding = "ready" | "conditioned" | "not_authorized"

export type BranchTransitionGovernance = {
  branch_key: string
  transition_authority: TransitionAuthorityStanding
  continuity_pressure: ContinuityPressureStanding
  correction_propagation: CorrectionPropagationStanding
  passage_engine: PassageStanding
  release_cadence: ReleaseCadenceStanding
  reasons: string[]
  evidence_references: string[]
}

export type RuntimeTransitionGovernanceState = {
  engine_key: "runtime_transition_governance_engine_v1"
  read_only: true
  branches: BranchTransitionGovernance[]
  summary: {
    encounterable: number
    held: number
    blocked: number
    pressure: number
    correction: number
  }
}

function transitionEvidenceFor(instance: OarProcessInstance, transitionLog: OarTransitionLogEntry[]) {
  return transitionLog
    .filter((entry) => entry.process_instance_key === instance.process_instance_key)
    .flatMap((entry) => (entry.evidence_reference ? [entry.evidence_reference] : []))
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))]
}

function continuityPressure(instance: OarProcessInstance, hasTransitionEvidence: boolean): ContinuityPressureStanding {
  const missingCloseout = !instance.actual_oar1_path || !instance.evidence_path
  const missingConfirmation = instance.seeded_reference_standing !== "seeded"
  const pendingValidation =
    instance.validation_standing === "pending_validation" ||
    instance.validation_standing === "operator_required" ||
    instance.validation_standing === "chazz_review_required"

  if (instance.validation_standing === "correction_required" || instance.execution_standing === "blocked") {
    return "critical"
  }

  if (missingCloseout || missingConfirmation || pendingValidation || !hasTransitionEvidence) {
    return "pressure"
  }

  return "clear"
}

function correctionPropagation(instance: OarProcessInstance): CorrectionPropagationStanding {
  if (instance.validation_standing !== "correction_required" && !instance.correction_oar2_path) {
    return "none"
  }

  return instance.correction_scope || instance.correction_source_oar2_path ? "downstream" : "local"
}

function releaseCadence(instance: OarProcessInstance, pressure: ContinuityPressureStanding): ReleaseCadenceStanding {
  if (instance.deploy_standing === "not_authorized" || instance.execution_standing === "blocked") {
    return "not_authorized"
  }

  if (
    instance.deploy_standing === "configured" &&
    instance.execution_standing === "completed" &&
    instance.source_oar2_standing === "confirmed" &&
    instance.seeded_reference_standing === "seeded" &&
    pressure === "clear"
  ) {
    return "ready"
  }

  return "conditioned"
}

function branchReasons(
  instance: OarProcessInstance,
  pressure: ContinuityPressureStanding,
  correction: CorrectionPropagationStanding,
  release: ReleaseCadenceStanding,
) {
  const reasons: string[] = []

  if (instance.source_oar2_standing !== "confirmed") reasons.push(`source OAR2 is ${instance.source_oar2_standing}`)
  if (instance.seeded_reference_standing !== "seeded") reasons.push(`seeded reference is ${instance.seeded_reference_standing}`)
  if (!instance.actual_oar1_path) reasons.push("OAR1 closeout not recorded")
  if (!instance.evidence_path) reasons.push("evidence path not recorded")
  if (instance.held_standing) reasons.push(instance.held_standing)
  if (instance.validation_standing !== "automatic_pass") reasons.push(`validation is ${instance.validation_standing}`)
  if (correction !== "none") reasons.push(`correction propagation is ${correction}`)
  if (pressure !== "clear") reasons.push(`continuity pressure is ${pressure}`)
  if (release !== "ready") reasons.push(`release cadence is ${release}`)

  return reasons.length > 0 ? reasons : ["all seated standing permits encounter"]
}

function transitionAuthority(instance: OarProcessInstance, pressure: ContinuityPressureStanding): TransitionAuthorityStanding {
  if (
    instance.source_oar2_standing !== "confirmed" ||
    instance.execution_standing === "blocked" ||
    instance.seeded_reference_standing === "unseeded_blocked" ||
    instance.validation_standing === "correction_required"
  ) {
    return "blocked"
  }

  if (instance.held_standing || pressure !== "clear") return "held"

  return "permitted"
}

function passageStanding(authority: TransitionAuthorityStanding, release: ReleaseCadenceStanding): PassageStanding {
  if (authority === "blocked" || release === "not_authorized") return "blocked"
  if (authority === "held" || release === "conditioned") return "held"
  return "encounterable"
}

export function deriveRuntimeTransitionGovernance(
  processInstances: OarProcessInstance[],
  transitionLog: OarTransitionLogEntry[],
): RuntimeTransitionGovernanceState {
  const branches = processInstances.map((instance) => {
    const transitionEvidence = transitionEvidenceFor(instance, transitionLog)
    const evidenceReferences = unique([
      instance.source_oar2_path,
      instance.expected_oar1_path,
      instance.actual_oar1_path ?? "",
      instance.evidence_path ?? "",
      instance.correction_oar2_path ?? "",
      ...transitionEvidence,
    ])
    const pressure = continuityPressure(instance, transitionEvidence.length > 0)
    const correction = correctionPropagation(instance)
    const release = releaseCadence(instance, pressure)
    const authority = transitionAuthority(instance, pressure)
    const passage = passageStanding(authority, release)

    return {
      branch_key: instance.process_instance_key,
      transition_authority: authority,
      continuity_pressure: pressure,
      correction_propagation: correction,
      passage_engine: passage,
      release_cadence: release,
      reasons: branchReasons(instance, pressure, correction, release),
      evidence_references: evidenceReferences,
    }
  })

  return {
    engine_key: "runtime_transition_governance_engine_v1",
    read_only: true,
    branches,
    summary: {
      encounterable: branches.filter((branch) => branch.passage_engine === "encounterable").length,
      held: branches.filter((branch) => branch.passage_engine === "held").length,
      blocked: branches.filter((branch) => branch.passage_engine === "blocked").length,
      pressure: branches.filter((branch) => branch.continuity_pressure !== "clear").length,
      correction: branches.filter((branch) => branch.correction_propagation !== "none").length,
    },
  }
}

export function validateRuntimeTransitionGovernance(
  governance: RuntimeTransitionGovernanceState,
): SpineValidationCheck[] {
  const allBranchesGoverned = governance.branches.every(
    (branch) =>
      branch.transition_authority &&
      branch.continuity_pressure &&
      branch.correction_propagation &&
      branch.passage_engine &&
      branch.release_cadence,
  )
  const blockedExplainWhy = governance.branches
    .filter((branch) => branch.passage_engine === "blocked")
    .every((branch) => branch.reasons.length > 0)
  const readOnly = governance.read_only === true

  return [
    {
      check_key: "transition_governance_structures_present",
      standing: allBranchesGoverned ? "passed" : "correction_required",
      evidence: "Each branch has derived authority, continuity, correction, passage, and release standing.",
    },
    {
      check_key: "blocked_branch_reasons_visible",
      standing: blockedExplainWhy ? "passed" : "correction_required",
      evidence: "Blocked branches expose seated standing reasons instead of route availability.",
    },
    {
      check_key: "transition_governance_read_only_v1",
      standing: readOnly ? "passed" : "correction_required",
      evidence: "Runtime transition governance v1 derives standing only and introduces no mutation path.",
    },
  ]
}
