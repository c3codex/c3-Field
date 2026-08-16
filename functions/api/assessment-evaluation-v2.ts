export type AssessmentConditionTrace = {
  question_key: string
  selected: string
  label: string
  condition_tags: string[]
}

export type AssessmentEvaluationV2Cell = {
  cell_key: string
  row_axis: "system" | "environment" | "change"
  column_axis: "identify" | "govern" | "verify"
  standing: "aligned" | "drifted" | "unverified" | "held"
  evidence_question_keys: string[]
  evidence_tags: string[]
  finding: string
  consequence: string
  next_action: string
}

export type AssessmentEvaluationV2 = {
  evaluation_id: string
  assessment_ref: string
  capture_id: string
  matrix_version: "mr_assessment_evaluation_v2_3x3_v1"
  evaluation_standing: string
  evaluation_standing_key: string
  current_state_key: string
  env_key: string
  reported_conditions: string[]
  matrix_cells: AssessmentEvaluationV2Cell[]
  priority_cells: string[]
  relational_exposures: string[]
  system_consequences: string[]
  verification_limits: string[]
  unknown_unresolved_held: string[]
  continuation: {
    surface: "map_the_environment"
    label: "MAP the Environment"
    next_encounter_key: "marble_chamber_orientation"
    marble_order: string[]
  }
  map_scope: {
    map_pathway: "foundational" | "optimization" | "remediation"
    public_label: "Pre-Deployment" | "Optimization" | "Remediation"
    amount_usd: 333 | 777 | 999
    standing: string
  }
  pricing_standing: {
    source: "server_side_v2_evaluation"
    approved_offering: "pre_deployment_333" | "optimization_777" | "remediation_999"
    creates_identity: false
    creates_authority: false
    creates_certification: false
  }
  six_touchpoint_chain: string[]
}

const MATRIX_PLAN: Array<{
  cell_key: string
  row_axis: AssessmentEvaluationV2Cell["row_axis"]
  column_axis: AssessmentEvaluationV2Cell["column_axis"]
  question_keys: string[]
  finding: string
  consequence: string
  next_action: string
}> = [
  {
    cell_key: "system_identify",
    row_axis: "system",
    column_axis: "identify",
    question_keys: ["ai_deployment_status", "active_ai_system_visibility"],
    finding: "Computational participation visibility was evaluated.",
    consequence: "Unseen AI participation can hide operational influence.",
    next_action: "Inventory the active AI surfaces and participating workflows.",
  },
  {
    cell_key: "system_govern",
    row_axis: "system",
    column_axis: "govern",
    question_keys: ["role_authority_boundary", "persistent_review_standard"],
    finding: "System authority and review ownership were evaluated.",
    consequence: "Loose authority boundaries can turn tool output into ungoverned operating fact.",
    next_action: "Seat owner, reviewer, and operator boundaries for AI-influenced work.",
  },
  {
    cell_key: "system_verify",
    row_axis: "system",
    column_axis: "verify",
    question_keys: ["failure_traceability"],
    finding: "System traceability was evaluated.",
    consequence: "Failures without traces cannot be reliably corrected or audited.",
    next_action: "Preserve failure evidence and correction records before optimization.",
  },
  {
    cell_key: "environment_identify",
    row_axis: "environment",
    column_axis: "identify",
    question_keys: ["active_ai_system_visibility"],
    finding: "Environment custody visibility was evaluated.",
    consequence: "Unmapped environments make ownership and data flow claims weak.",
    next_action: "Map environment surfaces, custody points, and source-of-truth routes.",
  },
  {
    cell_key: "environment_govern",
    row_axis: "environment",
    column_axis: "govern",
    question_keys: ["persistent_review_standard", "role_authority_boundary"],
    finding: "Environmental operating influence was evaluated.",
    consequence: "Operational influence can outrun review when environment rules are implicit.",
    next_action: "Register the review standard for recurring AI-shaped operations.",
  },
  {
    cell_key: "environment_verify",
    row_axis: "environment",
    column_axis: "verify",
    question_keys: ["failure_traceability"],
    finding: "Environmental evidence traceability was evaluated.",
    consequence: "Audit confidence remains limited where evidence cannot be replayed.",
    next_action: "Create a bounded evidence index for observed environment behavior.",
  },
  {
    cell_key: "change_identify",
    row_axis: "change",
    column_axis: "identify",
    question_keys: ["ai_deployment_status"],
    finding: "Change-state visibility was evaluated.",
    consequence: "Planning, piloting, and production change states need different controls.",
    next_action: "Name the current AI change state before selecting a MAP scope.",
  },
  {
    cell_key: "change_govern",
    row_axis: "change",
    column_axis: "govern",
    question_keys: ["implementation_boundary"],
    finding: "Implementation boundary standing was evaluated.",
    consequence: "Unbounded implementation can create remediation work before authority exists.",
    next_action: "Hold implementation claims until scope, authority, and accountable review are seated.",
  },
  {
    cell_key: "change_verify",
    row_axis: "change",
    column_axis: "verify",
    question_keys: ["safe_ai_acceleration_capacity", "failure_traceability"],
    finding: "Change verification capacity was evaluated.",
    consequence: "Acceleration without verification increases operational correction cost.",
    next_action: "Tie any acceleration plan to testable evidence and rollback criteria.",
  },
]

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))]
}

function cellStanding(traces: AssessmentConditionTrace[], questionKeys: string[]): AssessmentEvaluationV2Cell["standing"] {
  const matching = traces.filter((trace) => questionKeys.includes(trace.question_key))
  if (matching.length === 0) return "unverified"
  const tags = matching.flatMap((trace) => trace.condition_tags)
  if (tags.includes("critical_ai_drift_condition") || tags.includes("emerging_ai_drift_condition")) return "drifted"
  if (tags.includes("probable_ai_drift_condition")) return "held"
  if (tags.includes("governed_review_condition")) return "aligned"
  return "held"
}

function deriveMapScope(cells: AssessmentEvaluationV2Cell[]) {
  const drifted = cells.filter((cell) => cell.standing === "drifted").length
  const held = cells.filter((cell) => cell.standing === "held" || cell.standing === "unverified").length

  if (drifted >= 4 || cells.some((cell) => cell.cell_key === "change_govern" && cell.standing === "drifted")) {
    return {
      map_pathway: "remediation" as const,
      public_label: "Remediation" as const,
      amount_usd: 999 as const,
      standing: "remediation_scope_recommended",
      approved_offering: "remediation_999" as const,
    }
  }
  if (drifted >= 2 || held >= 3) {
    return {
      map_pathway: "optimization" as const,
      public_label: "Optimization" as const,
      amount_usd: 777 as const,
      standing: "optimization_scope_recommended",
      approved_offering: "optimization_777" as const,
    }
  }
  return {
    map_pathway: "foundational" as const,
    public_label: "Pre-Deployment" as const,
    amount_usd: 333 as const,
    standing: "pre_deployment_scope_recommended",
    approved_offering: "pre_deployment_333" as const,
  }
}

export function evaluateAssessmentV2({
  assessment_ref,
  capture_id,
  current_state_key,
  env_key,
  traces,
}: {
  assessment_ref: string
  capture_id: string
  current_state_key: string
  env_key: string
  traces: AssessmentConditionTrace[]
}): AssessmentEvaluationV2 {
  const matrix_cells = MATRIX_PLAN.map((cell) => {
    const evidence = traces.filter((trace) => cell.question_keys.includes(trace.question_key))
    const evidence_tags = unique(evidence.flatMap((trace) => trace.condition_tags))
    return {
      ...cell,
      standing: cellStanding(traces, cell.question_keys),
      evidence_question_keys: unique(evidence.map((trace) => trace.question_key)),
      evidence_tags,
    }
  })
  const driftedCells = matrix_cells.filter((cell) => cell.standing === "drifted")
  const unresolvedCells = matrix_cells.filter((cell) => cell.standing === "held" || cell.standing === "unverified")
  const map = deriveMapScope(matrix_cells)
  const evaluation_standing_key =
    driftedCells.length >= 4 ? "material_environment_drift_requires_remediation"
      : driftedCells.length > 0 ? "environment_optimization_required"
        : unresolvedCells.length > 0 ? "environment_pre_deployment_review_required"
          : "environment_pre_deployment_review_ready"

  return {
    evaluation_id: `evaluation_${capture_id}`,
    assessment_ref,
    capture_id,
    matrix_version: "mr_assessment_evaluation_v2_3x3_v1",
    evaluation_standing:
      evaluation_standing_key === "material_environment_drift_requires_remediation" ? "Material Environment Drift Requires Remediation"
        : evaluation_standing_key === "environment_optimization_required" ? "Environment Optimization Required"
          : evaluation_standing_key === "environment_pre_deployment_review_required" ? "Environment Pre-Deployment Review Required"
            : "Environment Pre-Deployment Review Ready",
    evaluation_standing_key,
    current_state_key,
    env_key,
    reported_conditions: unique(traces.flatMap((trace) => trace.condition_tags)),
    matrix_cells,
    priority_cells: driftedCells.length > 0
      ? driftedCells.map((cell) => cell.cell_key).slice(0, 4)
      : unresolvedCells.map((cell) => cell.cell_key).slice(0, 4),
    relational_exposures: [
      "participant_institution_relation",
      "institution_environment_relation",
      "assessment_to_current_state_relation",
      "assessment_to_map_continuation_relation",
    ],
    system_consequences: unique(matrix_cells
      .filter((cell) => cell.standing !== "aligned")
      .map((cell) => cell.consequence)),
    verification_limits: [
      "assessment responses are participant-declared until MAP evidence work observes the environment",
      "v2 evaluation does not create SEAT standing, certification, c3 Key, authority, or portal admission",
      "MAP price route is a bounded continuation recommendation, not a completed engagement",
    ],
    unknown_unresolved_held: unresolvedCells.map((cell) => cell.cell_key),
    continuation: {
      surface: "map_the_environment",
      label: "MAP the Environment",
      next_encounter_key: "marble_chamber_orientation",
      marble_order: [
        "marble_chamber_orientation",
        "marble_chamber_results",
        "marble_chamber_C2_agreement",
        "marble_chamber_C2_resolution",
      ],
    },
    map_scope: {
      map_pathway: map.map_pathway,
      public_label: map.public_label,
      amount_usd: map.amount_usd,
      standing: map.standing,
    },
    pricing_standing: {
      source: "server_side_v2_evaluation",
      approved_offering: map.approved_offering,
      creates_identity: false,
      creates_authority: false,
      creates_certification: false,
    },
    six_touchpoint_chain: [
      "assessment_capture",
      "server_side_v2_evaluation",
      "current_state_binding",
      "delivery_artifact",
      "marble_orientation",
      "map_c2_checkout",
    ],
  }
}
