import type { OarProcessInstance, SpineValidationCheck } from "./operationsSpine"
import type { AutomationBridgeBranch, OperatorGatedAutomationBridgeState } from "./operatorGatedAutomationBridge"
import type { BranchTransitionGovernance, RuntimeTransitionGovernanceState } from "./transitionGovernanceEngine"

export type BranchEncounterReadinessState =
  | "not_ready"
  | "held"
  | "blocked"
  | "correction_required"
  | "sealed"
  | "released"
  | "encounterable"

export type BranchEncounterReadinessReason =
  | "dependency_missing"
  | "correction_open"
  | "oar1_missing"
  | "evidence_missing"
  | "seeded_reference_unresolved"
  | "release_state_unavailable"
  | "operator_authorization_required"
  | "validation_pending"
  | "closed_and_encounterable"
  | "source_not_confirmed"
  | "route_visibility_not_permission"

export type BranchEncounterReadiness = {
  branch_key: string
  readiness_state: BranchEncounterReadinessState
  read_only: true
  permission_source: "seated_runtime_standing"
  route_visibility_permission: false
  reasons: BranchEncounterReadinessReason[]
  reason_details: string[]
  transition_standing: {
    transition_authority: BranchTransitionGovernance["transition_authority"]
    continuity_pressure: BranchTransitionGovernance["continuity_pressure"]
    correction_propagation: BranchTransitionGovernance["correction_propagation"]
    passage_engine: BranchTransitionGovernance["passage_engine"]
    release_cadence: BranchTransitionGovernance["release_cadence"]
  }
  automation_gate: AutomationBridgeBranch["operator_gate"] | "missing"
  optics_downstream: {
    material_behavior: "bright" | "held" | "sealed" | "blocked"
    topology: "open_relation" | "held_relation" | "sealed_relation" | "fracture_relation"
    inscription_weight: "light" | "medium" | "heavy"
  }
}

export type RuntimeBranchEncounterReadiness = {
  readiness_key: "runtime_branch_encounter_readiness_v1"
  consumes_transition_governance: RuntimeTransitionGovernanceState["engine_key"]
  consumes_automation_bridge: OperatorGatedAutomationBridgeState["bridge_key"]
  read_only: true
  permission_boundary: "encounter_permission_derives_from_seated_standing"
  branches: BranchEncounterReadiness[]
  summary: Record<BranchEncounterReadinessState, number>
}

const emptySummary: Record<BranchEncounterReadinessState, number> = {
  not_ready: 0,
  held: 0,
  blocked: 0,
  correction_required: 0,
  sealed: 0,
  released: 0,
  encounterable: 0,
}

function byBranch<T extends { branch_key: string }>(items: T[]) {
  return new Map(items.map((item) => [item.branch_key, item]))
}

function readinessReasons(
  instance: OarProcessInstance,
  branch: BranchTransitionGovernance | undefined,
  automation: AutomationBridgeBranch | undefined,
) {
  const reasons: BranchEncounterReadinessReason[] = ["route_visibility_not_permission"]
  const details: string[] = ["Route existence, file existence, UI visibility, and branch cards do not grant encounter permission."]

  if (!branch) {
    reasons.push("dependency_missing")
    details.push("Runtime transition governance branch is missing.")
    return { reasons, details }
  }

  if (instance.source_oar2_standing !== "confirmed") {
    reasons.push("source_not_confirmed")
    details.push(`Source OAR2 standing is ${instance.source_oar2_standing}.`)
  }
  if (!instance.actual_oar1_path) {
    reasons.push("oar1_missing")
    details.push(`OAR1 closeout required: ${instance.expected_oar1_path}.`)
  }
  if (!instance.evidence_path) {
    reasons.push("evidence_missing")
    details.push("Evidence path is required before readiness can resolve.")
  }
  if (instance.seeded_reference_standing !== "seeded") {
    reasons.push("seeded_reference_unresolved")
    details.push(`Seeded reference standing is ${instance.seeded_reference_standing}.`)
  }
  if (branch.correction_propagation !== "none" || instance.validation_standing === "correction_required") {
    reasons.push("correction_open")
    details.push(`Correction propagation is ${branch.correction_propagation}.`)
  }
  if (branch.release_cadence !== "ready") {
    reasons.push("release_state_unavailable")
    details.push(`Release cadence is ${branch.release_cadence}.`)
  }
  if (
    instance.validation_standing === "pending_validation" ||
    instance.validation_standing === "operator_required" ||
    instance.validation_standing === "chazz_review_required"
  ) {
    reasons.push("validation_pending")
    details.push(`Validation standing is ${instance.validation_standing}.`)
  }
  if (automation?.operator_gate === "required") {
    reasons.push("operator_authorization_required")
    details.push("Operator authorization remains required before mutation-bearing transition.")
  }
  if (branch.passage_engine === "encounterable" && instance.execution_standing === "completed") {
    reasons.push("closed_and_encounterable")
    details.push("Seated standing permits encounter after completed execution and evidence continuity.")
  }

  return { reasons: [...new Set(reasons)], details: [...new Set(details)] }
}

function readinessState(
  instance: OarProcessInstance,
  branch: BranchTransitionGovernance | undefined,
  automation: AutomationBridgeBranch | undefined,
): BranchEncounterReadinessState {
  if (!branch) return "not_ready"
  if (branch.transition_authority === "blocked" || branch.passage_engine === "blocked") return "blocked"
  if (branch.correction_propagation !== "none" || instance.validation_standing === "correction_required") {
    return "correction_required"
  }
  if (instance.held_standing || branch.transition_authority === "held" || branch.continuity_pressure !== "clear") {
    return "held"
  }
  if (branch.release_cadence === "not_authorized") return "sealed"
  if (branch.release_cadence === "conditioned" || automation?.operator_gate === "required") return "released"
  if (branch.passage_engine === "encounterable" && branch.release_cadence === "ready") return "encounterable"

  return "not_ready"
}

function opticsFor(state: BranchEncounterReadinessState): BranchEncounterReadiness["optics_downstream"] {
  if (state === "encounterable" || state === "released") {
    return { material_behavior: "bright", topology: "open_relation", inscription_weight: "light" }
  }
  if (state === "blocked" || state === "correction_required") {
    return { material_behavior: "blocked", topology: "fracture_relation", inscription_weight: "heavy" }
  }
  if (state === "sealed") {
    return { material_behavior: "sealed", topology: "sealed_relation", inscription_weight: "medium" }
  }
  return { material_behavior: "held", topology: "held_relation", inscription_weight: "medium" }
}

export function deriveRuntimeBranchEncounterReadiness(
  processInstances: OarProcessInstance[],
  governance: RuntimeTransitionGovernanceState,
  automationBridge: OperatorGatedAutomationBridgeState,
): RuntimeBranchEncounterReadiness {
  const governanceMap = byBranch(governance.branches)
  const automationMap = byBranch(automationBridge.branches)
  const branches = processInstances.map((instance) => {
    const branch = governanceMap.get(instance.process_instance_key)
    const automation = automationMap.get(instance.process_instance_key)
    const state = readinessState(instance, branch, automation)
    const { reasons, details } = readinessReasons(instance, branch, automation)

    return {
      branch_key: instance.process_instance_key,
      readiness_state: state,
      read_only: true,
      permission_source: "seated_runtime_standing",
      route_visibility_permission: false,
      reasons,
      reason_details: details,
      transition_standing: {
        transition_authority: branch?.transition_authority ?? "blocked",
        continuity_pressure: branch?.continuity_pressure ?? "critical",
        correction_propagation: branch?.correction_propagation ?? "local",
        passage_engine: branch?.passage_engine ?? "blocked",
        release_cadence: branch?.release_cadence ?? "not_authorized",
      },
      automation_gate: automation?.operator_gate ?? "missing",
      optics_downstream: opticsFor(state),
    }
  })

  const summary = branches.reduce(
    (current, branch) => ({
      ...current,
      [branch.readiness_state]: current[branch.readiness_state] + 1,
    }),
    { ...emptySummary },
  )

  return {
    readiness_key: "runtime_branch_encounter_readiness_v1",
    consumes_transition_governance: governance.engine_key,
    consumes_automation_bridge: automationBridge.bridge_key,
    read_only: true,
    permission_boundary: "encounter_permission_derives_from_seated_standing",
    branches,
    summary,
  }
}

export function validateRuntimeBranchEncounterReadiness(
  readiness: RuntimeBranchEncounterReadiness,
): SpineValidationCheck[] {
  const statesPresent = readiness.branches.every((branch) => Boolean(branch.readiness_state))
  const reasonsVisible = readiness.branches.every((branch) => branch.reasons.length > 0 && branch.reason_details.length > 0)
  const routeNotPermission = readiness.branches.every((branch) => branch.route_visibility_permission === false)
  const readOnly = readiness.read_only === true && readiness.permission_boundary === "encounter_permission_derives_from_seated_standing"
  const opticsDownstream = readiness.branches.every((branch) => Boolean(branch.optics_downstream.material_behavior))

  return [
    {
      check_key: "branch_readiness_states_defined",
      standing: statesPresent ? "passed" : "correction_required",
      evidence: "Each branch resolves a derived encounter readiness state.",
    },
    {
      check_key: "branch_readiness_reasons_visible",
      standing: reasonsVisible ? "passed" : "correction_required",
      evidence: "Each branch exposes readiness reasons without treating route visibility as permission.",
    },
    {
      check_key: "branch_route_visibility_not_permission",
      standing: routeNotPermission ? "passed" : "correction_required",
      evidence: "Route existence, file existence, UI visibility, and branch cards remain non-authoritative.",
    },
    {
      check_key: "branch_readiness_read_only",
      standing: readOnly ? "passed" : "correction_required",
      evidence: "Branch encounter readiness is read-only derived runtime standing.",
    },
    {
      check_key: "branch_readiness_optics_downstream_only",
      standing: opticsDownstream ? "passed" : "correction_required",
      evidence: "Optics receive readiness expression hints but do not decide readiness.",
    },
  ]
}
