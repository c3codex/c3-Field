import type { OarProcessInstance, SpineValidationCheck } from "./operationsSpine"
import type { BranchTransitionGovernance, RuntimeTransitionGovernanceState } from "./transitionGovernanceEngine"

export type AutomationTransitionState =
  | "derived_only"
  | "awaiting_operator"
  | "authorized"
  | "executing"
  | "executed"
  | "validated"
  | "closed"
  | "blocked"
  | "held"

export type AutomationBridgeAction =
  | "prepare_oar_transfer"
  | "prepare_path_continuity"
  | "prepare_expected_manifest"
  | "check_oar1_requirement"
  | "verify_file_existence"
  | "check_commit_readiness"
  | "prompt_continuation"
  | "remind_seeded_reference"

export type OperatorAuthorizationMap = Record<string, boolean>

export type AutomationBridgeBranch = {
  branch_key: string
  automation_state: AutomationTransitionState
  operator_gate: "required" | "satisfied" | "not_applicable" | "blocked"
  mutation_allowed: false
  bridge_boundary: "governed_propagation_only"
  lifecycle_required: "OAR2 -> execution -> OAR1 -> validation -> commit -> closeout"
  handoff_surfaces: AutomationBridgeAction[]
  blocked_reasons: string[]
  continuity_prompts: string[]
  source_standing: {
    transition_authority: BranchTransitionGovernance["transition_authority"]
    continuity_pressure: BranchTransitionGovernance["continuity_pressure"]
    correction_propagation: BranchTransitionGovernance["correction_propagation"]
    passage_engine: BranchTransitionGovernance["passage_engine"]
    release_cadence: BranchTransitionGovernance["release_cadence"]
  }
}

export type OperatorGatedAutomationBridgeState = {
  bridge_key: "operator_gated_runtime_automation_bridge_v1"
  consumes_engine: RuntimeTransitionGovernanceState["engine_key"]
  read_only: true
  authority_boundary: "automation_routes_governed_state_only"
  operator_authorization_required: true
  branches: AutomationBridgeBranch[]
  summary: Record<AutomationTransitionState, number>
}

const emptySummary: Record<AutomationTransitionState, number> = {
  derived_only: 0,
  awaiting_operator: 0,
  authorized: 0,
  executing: 0,
  executed: 0,
  validated: 0,
  closed: 0,
  blocked: 0,
  held: 0,
}

function governanceByBranch(governance: RuntimeTransitionGovernanceState) {
  return new Map(governance.branches.map((branch) => [branch.branch_key, branch]))
}

function handoffSurfaces(instance: OarProcessInstance): AutomationBridgeAction[] {
  const actions: AutomationBridgeAction[] = [
    "prepare_oar_transfer",
    "prepare_path_continuity",
    "prepare_expected_manifest",
    "check_oar1_requirement",
    "verify_file_existence",
    "check_commit_readiness",
    "prompt_continuation",
    "remind_seeded_reference",
  ]

  if (instance.actual_oar1_path) {
    return actions.filter((action) => action !== "check_oar1_requirement")
  }

  return actions
}

function continuityPrompts(instance: OarProcessInstance, branch: BranchTransitionGovernance) {
  const prompts: string[] = []

  if (!instance.actual_oar1_path) prompts.push(`OAR1 required: ${instance.expected_oar1_path}`)
  if (!instance.evidence_path) prompts.push("Evidence path required before validation")
  if (instance.seeded_reference_standing !== "seeded") {
    prompts.push(`Seeded reference standing is ${instance.seeded_reference_standing}`)
  }
  if (branch.correction_propagation !== "none") {
    prompts.push(`Correction route required before propagation: ${branch.correction_propagation}`)
  }
  if (branch.continuity_pressure !== "clear") {
    prompts.push(`Continuity pressure is ${branch.continuity_pressure}`)
  }

  return prompts.length > 0 ? prompts : ["Continuity evidence is present"]
}

function transitionState(
  instance: OarProcessInstance,
  branch: BranchTransitionGovernance,
  operatorAuthorized: boolean,
): AutomationTransitionState {
  if (branch.transition_authority === "blocked" || branch.passage_engine === "blocked") return "blocked"
  if (branch.correction_propagation !== "none") return "held"
  if (instance.validation_standing === "automatic_pass" && instance.actual_oar1_path && instance.evidence_path) {
    return "closed"
  }
  if (instance.validation_standing === "automatic_pass") return "validated"
  if (instance.execution_standing === "completed") return "executed"
  if (instance.execution_standing === "executing") return "executing"
  if (branch.transition_authority === "held" || branch.continuity_pressure !== "clear") return "held"
  if (operatorAuthorized && branch.release_cadence === "ready") return "authorized"

  return "awaiting_operator"
}

function operatorGateFor(
  state: AutomationTransitionState,
  branch: BranchTransitionGovernance,
  operatorAuthorized: boolean,
): AutomationBridgeBranch["operator_gate"] {
  if (state === "blocked") return "blocked"
  if (state === "closed" || state === "validated") return "not_applicable"
  if (operatorAuthorized && branch.release_cadence === "ready") return "satisfied"
  return "required"
}

export function deriveOperatorGatedAutomationBridge(
  processInstances: OarProcessInstance[],
  governance: RuntimeTransitionGovernanceState,
  operatorAuthorizations: OperatorAuthorizationMap = {},
): OperatorGatedAutomationBridgeState {
  const branchMap = governanceByBranch(governance)
  const branches = processInstances.map((instance) => {
    const branch = branchMap.get(instance.process_instance_key)

    if (!branch) {
      return {
        branch_key: instance.process_instance_key,
        automation_state: "blocked" as const,
        operator_gate: "blocked" as const,
        mutation_allowed: false as const,
        bridge_boundary: "governed_propagation_only" as const,
        lifecycle_required: "OAR2 -> execution -> OAR1 -> validation -> commit -> closeout" as const,
        handoff_surfaces: handoffSurfaces(instance),
        blocked_reasons: ["runtime transition governance branch missing"],
        continuity_prompts: ["Derive runtime transition governance before automation routing"],
        source_standing: {
          transition_authority: "blocked" as const,
          continuity_pressure: "critical" as const,
          correction_propagation: "local" as const,
          passage_engine: "blocked" as const,
          release_cadence: "not_authorized" as const,
        },
      }
    }

    const operatorAuthorized = operatorAuthorizations[instance.process_instance_key] === true
    const automationState = transitionState(instance, branch, operatorAuthorized)

    return {
      branch_key: instance.process_instance_key,
      automation_state: automationState,
      operator_gate: operatorGateFor(automationState, branch, operatorAuthorized),
      mutation_allowed: false,
      bridge_boundary: "governed_propagation_only",
      lifecycle_required: "OAR2 -> execution -> OAR1 -> validation -> commit -> closeout",
      handoff_surfaces: handoffSurfaces(instance),
      blocked_reasons:
        automationState === "blocked" || automationState === "held" || automationState === "awaiting_operator"
          ? branch.reasons
          : [],
      continuity_prompts: continuityPrompts(instance, branch),
      source_standing: {
        transition_authority: branch.transition_authority,
        continuity_pressure: branch.continuity_pressure,
        correction_propagation: branch.correction_propagation,
        passage_engine: branch.passage_engine,
        release_cadence: branch.release_cadence,
      },
    }
  })

  const summary = branches.reduce(
    (current, branch) => ({
      ...current,
      [branch.automation_state]: current[branch.automation_state] + 1,
    }),
    { ...emptySummary },
  )

  return {
    bridge_key: "operator_gated_runtime_automation_bridge_v1",
    consumes_engine: governance.engine_key,
    read_only: true,
    authority_boundary: "automation_routes_governed_state_only",
    operator_authorization_required: true,
    branches,
    summary,
  }
}

export function validateOperatorGatedAutomationBridge(
  bridge: OperatorGatedAutomationBridgeState,
): SpineValidationCheck[] {
  const mutationBlocked = bridge.branches.every((branch) => branch.mutation_allowed === false)
  const lifecyclePreserved = bridge.branches.every((branch) =>
    branch.lifecycle_required.includes("OAR1"),
  )
  const blockedExplainWhy = bridge.branches
    .filter((branch) => branch.automation_state === "blocked" || branch.automation_state === "held")
    .every((branch) => branch.blocked_reasons.length > 0)
  const operatorGateVisible = bridge.branches.every((branch) => Boolean(branch.operator_gate))
  const readOnly = bridge.read_only === true && bridge.authority_boundary === "automation_routes_governed_state_only"

  return [
    {
      check_key: "automation_bridge_boundary_explicit",
      standing: readOnly ? "passed" : "correction_required",
      evidence: "Automation bridge is read-only derived standing and routes governed propagation only.",
    },
    {
      check_key: "operator_gate_required_for_bridge",
      standing: operatorGateVisible ? "passed" : "correction_required",
      evidence: "Each automation branch exposes operator gate standing before transition propagation.",
    },
    {
      check_key: "automation_bridge_mutation_blocked",
      standing: mutationBlocked ? "passed" : "correction_required",
      evidence: "Bridge branches do not grant autonomous mutation or release authority.",
    },
    {
      check_key: "automation_bridge_oar_lifecycle_preserved",
      standing: lifecyclePreserved ? "passed" : "correction_required",
      evidence: "Bridge lifecycle requires OAR2 -> execution -> OAR1 -> validation -> commit -> closeout.",
    },
    {
      check_key: "automation_bridge_blocked_reasons_visible",
      standing: blockedExplainWhy ? "passed" : "correction_required",
      evidence: "Blocked and held automation branches expose governance-derived reasons.",
    },
  ]
}
