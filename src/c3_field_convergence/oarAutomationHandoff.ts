import type { OarProcessInstance, SpineValidationCheck } from "./operationsSpine"

export type OarAutomationQueueStatus =
  | "awaiting_operator_confirm"
  | "queued_for_cody"
  | "executing"
  | "oar1_submitted"
  | "blocked"
  | "held"

export type Oar2AutomationPermissions = {
  inspect: boolean
  mutate_db: boolean
  mutate_src: boolean
  deploy: boolean
}

export type CodyExecutionHandoff = {
  handoff_status: OarAutomationQueueStatus
  source_oar2_path: string
  expected_oar1_path: string
  operator_gate: "satisfied" | "required" | "blocked"
  cody_instruction: string | null
  blocked_reason: string | null
}

export type ChazzReviewPrompt = {
  prompt_status: "ready" | "blocked"
  authority_boundary: "thread_prompt_only"
  source_oar2_path: string
  oar1_path: string | null
  evidence_path: string | null
  prompt: string | null
  blocked_reason: string | null
}

const requestedChazzDecision = "`validated`, `correction_required`, or `held`"

export function deriveCodyExecutionHandoff(
  instance: OarProcessInstance,
  operatorConfirmed: boolean,
): CodyExecutionHandoff {
  if (instance.source_oar2_standing !== "confirmed") {
    return {
      handoff_status: "blocked",
      source_oar2_path: instance.source_oar2_path,
      expected_oar1_path: instance.expected_oar1_path,
      operator_gate: "blocked",
      cody_instruction: null,
      blocked_reason: `source OAR2 standing is ${instance.source_oar2_standing}`,
    }
  }

  if (!operatorConfirmed) {
    return {
      handoff_status: "awaiting_operator_confirm",
      source_oar2_path: instance.source_oar2_path,
      expected_oar1_path: instance.expected_oar1_path,
      operator_gate: "required",
      cody_instruction: null,
      blocked_reason: "operator confirmation required before Cody execution",
    }
  }

  return {
    handoff_status: instance.execution_standing === "executing" ? "executing" : "queued_for_cody",
    source_oar2_path: instance.source_oar2_path,
    expected_oar1_path: instance.expected_oar1_path,
    operator_gate: "satisfied",
    cody_instruction: `Execute only from confirmed OAR2: ${instance.source_oar2_path}. Expected OAR1: ${instance.expected_oar1_path}.`,
    blocked_reason: null,
  }
}

export function buildChazzReviewPrompt(instance: OarProcessInstance): ChazzReviewPrompt {
  if (!instance.actual_oar1_path || !instance.evidence_path) {
    return {
      prompt_status: "blocked",
      authority_boundary: "thread_prompt_only",
      source_oar2_path: instance.source_oar2_path,
      oar1_path: instance.actual_oar1_path,
      evidence_path: instance.evidence_path,
      prompt: null,
      blocked_reason: "OAR1 path and evidence path are required before Chazz prompt generation",
    }
  }

  const prompt = [
    "Review this OAR1 against its source OAR2.",
    "",
    `Source OAR2: ${instance.source_oar2_path}`,
    `OAR1: ${instance.actual_oar1_path}`,
    `Evidence: ${instance.evidence_path}`,
    `Execution standing: ${instance.execution_standing}`,
    `DB mutation standing: ${instance.db_mutation_standing}`,
    `src mutation standing: ${instance.src_mutation_standing}`,
    `Deploy standing: ${instance.deploy_standing}`,
    `What Cody changed: ${instance.execution_result}`,
    `Requested Chazz decision: ${requestedChazzDecision}.`,
    "",
    "This prompt is a review surface only. Final standing must be seated back into governed DB/Measures state.",
  ].join("\n")

  return {
    prompt_status: "ready",
    authority_boundary: "thread_prompt_only",
    source_oar2_path: instance.source_oar2_path,
    oar1_path: instance.actual_oar1_path,
    evidence_path: instance.evidence_path,
    prompt,
    blocked_reason: null,
  }
}

export function validateOperatorGatedOarAutomation(
  instances: OarProcessInstance[],
  operatorConfirmations: Record<string, boolean> = {},
): SpineValidationCheck[] {
  const confirmedCanHandoff = instances
    .filter((instance) => instance.source_oar2_standing === "confirmed")
    .every((instance) => {
      const handoff = deriveCodyExecutionHandoff(instance, operatorConfirmations[instance.process_instance_key] === true)
      return handoff.operator_gate !== "blocked"
    })
  const unconfirmedBlocked = instances
    .filter((instance) => instance.source_oar2_standing !== "confirmed")
    .every((instance) => deriveCodyExecutionHandoff(instance, true).handoff_status === "blocked")
  const promptsRequireEvidence = instances.every((instance) => {
    const prompt = buildChazzReviewPrompt(instance)
    return prompt.prompt_status === "ready" ? Boolean(instance.actual_oar1_path && instance.evidence_path) : true
  })
  const promptsRemainReviewOnly = instances
    .map(buildChazzReviewPrompt)
    .every((prompt) => prompt.authority_boundary === "thread_prompt_only")
  const standingRequiresSeating = instances
    .filter((instance) => buildChazzReviewPrompt(instance).prompt_status === "ready")
    .every((instance) => instance.validation_standing !== "automatic_pass")

  return [
    {
      check_key: "operator_confirmation_routes_confirmed_oar2_to_cody",
      standing: confirmedCanHandoff ? "passed" : "correction_required",
      evidence: "Confirmed OAR2 records can derive a Cody handoff after operator confirmation.",
    },
    {
      check_key: "unconfirmed_oar2_cannot_execute",
      standing: unconfirmedBlocked ? "passed" : "correction_required",
      evidence: "Proposed and review-only OAR2 records produce blocked Cody handoffs.",
    },
    {
      check_key: "chazz_prompt_requires_oar1_evidence",
      standing: promptsRequireEvidence ? "passed" : "correction_required",
      evidence: "Chazz review prompt generation requires both OAR1 and evidence paths.",
    },
    {
      check_key: "chazz_prompt_thread_only_not_authority",
      standing: promptsRemainReviewOnly && standingRequiresSeating ? "passed" : "correction_required",
      evidence: "Generated Chazz prompts remain review surfaces and do not finalize standing without DB/Measures seating.",
    },
  ]
}
