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
}

export type AssessmentEmailArtifact = {
  subject: string
  preview: string
  body: string[]
  source: string
}
