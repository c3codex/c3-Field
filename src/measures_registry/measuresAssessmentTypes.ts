export type EvalStep = "src_capture" | "diagnostic" | "resolving" | "contact_capture"

export type AssessmentMechanicOption = {
  value: string
  label: string
  conditionTags: string[]
}

export type AssessmentMechanicQuestion = {
  questionKey: string
  question: string
  contextLabel: string
  contextStatement: string | null
  options: AssessmentMechanicOption[]
}

export type StructuredEvalAnswer = {
  selected: string
  label: string
  institutional_context: string
}

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
  matrix_version: string
  evaluation_standing: string
  evaluation_standing_key: string
  matrix_cells: AssessmentEvaluationV2Cell[]
  priority_cells: string[]
  verification_limits: string[]
  relational_exposures: string[]
  system_consequences: string[]
  map_scope: {
    map_pathway: "foundational" | "optimization" | "remediation"
    public_label: string
    amount_usd: 333 | 777 | 999
    standing: string
  }
}

export type EnvironmentalStandingReport = {
  environmental_standing: string
  standing_key: string
  assessment_title: string
  assessment_result: string
  detected_conditions: string[]
  findings: string[]
  operational_exposure_summary: string
  recommended_structured_action: string
  recommended_response_label: string
  continuation_pathway: string
  explainability: {
    question_keys: string[]
    condition_tags: string[]
    standing_rule: string
  }
  evaluation_v2?: AssessmentEvaluationV2
}

export type AssessmentEmailArtifact = {
  subject: string
  preview: string
  body: string[]
  source: string
}
