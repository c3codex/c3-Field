import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type {
  AssessmentConditionTrace,
  AssessmentMechanicOption,
  AssessmentMechanicQuestion,
  AssessmentEmailArtifact,
  EnvironmentalStandingReport,
  StructuredEvalAnswer,
} from "../measuresAssessmentTypes"
import type { LandingSectionRow, MediaRow } from "./registeredRuntimeTypes"

export type { AssessmentMechanicQuestion, AssessmentMechanicOption, StructuredEvalAnswer, EnvironmentalStandingReport, AssessmentEmailArtifact, AssessmentConditionTrace }

export function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

export function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

export function asActionArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : []
}

export function asRecordArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : []
}

export function asRecordFromPaths(...values: unknown[]) {
  for (const value of values) {
    const record = asRecord(value)
    if (record) return record
  }
  return null
}

export function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

const GOVERNED_STATUS_KEYS = [
  "held_state",
  "status_state",
  "missing_state",
  "incomplete_state",
  "unavailable_state",
  "renderer_gap_state",
]

const RECOGNIZED_STATUS_VALUES = new Set([
  "held",
  "pending",
  "under_review",
  "missing",
  "incomplete",
  "unavailable",
  "sealed",
  "not_yet_active",
  "renderer_gap",
  "source_absent",
  "file_absent",
  "chamber_not_ready",
  "encounter_not_ready",
])

const RECOGNIZED_SURFACE_ROLES = new Set([
  "payment",
  "c3_key",
  "c3_map",
  "recognition",
  "conversion",
  "processor",
  "wallet_migration",
  "permission",
  "encounter",
  "chamber",
  "file",
  "source",
  "renderer",
  "route",
  "media",
])

const PROHIBITED_STATUS_DISPLAY_TERMS = [
  "payment complete",
  "conversion complete",
  "recognized",
  "verified",
  "access granted",
  "permission activated",
  "c3 key issued",
  "wallet-bound",
  "nft minted",
  "dao voting active",
  "distribution eligible",
  "processor connected",
  "webhook active",
  "automatic enrollment",
  "automatic conversion",
  "guaranteed acceptance",
  "c3 map access active",
]

export type GovernedStatusCopy = {
  status: string
  surfaceRole: string
  displayTitle: string | null
  displayBody: string | null
  allowedNextStep: string | null
  activationBoundary: string
}

function containsProhibitedStatusDisplay(value: string) {
  const normalized = value.toLocaleLowerCase()
  return PROHIBITED_STATUS_DISPLAY_TERMS.some((term) => normalized.includes(term))
}

export function governedStatusCopy(metadata: Record<string, unknown>): GovernedStatusCopy | null {
  for (const key of GOVERNED_STATUS_KEYS) {
    const payload = asRecord(metadata[key])
    if (!payload || payload.support_safe !== true) continue

    const status = asString(payload.status)
    const surfaceRole = asString(payload.surface_role)
    const activationBoundary = asString(payload.activation_boundary)
    if (
      !status ||
      !surfaceRole ||
      !activationBoundary ||
      !RECOGNIZED_STATUS_VALUES.has(status) ||
      !RECOGNIZED_SURFACE_ROLES.has(surfaceRole)
    ) {
      continue
    }

    const displayTitle = asString(payload.display_title)
    const displayBody = asString(payload.display_body)
    const allowedNextStep = asString(payload.allowed_next_step)
    const displayFields = [
      displayTitle,
      displayBody,
      allowedNextStep,
      activationBoundary,
      status,
      surfaceRole,
    ].filter((value): value is string => Boolean(value))

    if (displayFields.some(containsProhibitedStatusDisplay)) continue

    return {
      status,
      surfaceRole,
      displayTitle,
      displayBody,
      allowedNextStep,
      activationBoundary,
    }
  }

  return null
}

export function allAssessmentMechanics(metadataValue: unknown): AssessmentMechanicQuestion[] {
  const metadata = asRecord(metadataValue)
  const questions = asRecordArray(metadata?.questions)

  return questions
    .map((question) => {
      const questionKey = asString(question.question_key)
      const questionText = asString(question.question)
      const options = asRecordArray(question.options)
        .map((option) => {
          const value = asString(option.value)
          const label = asString(option.label)
          if (!value || !label) return null
          return {
            value,
            label,
            conditionTags: asStringArray(option.condition_tags),
          }
        })
        .filter((option): option is AssessmentMechanicOption => Boolean(option))

      if (!questionKey || !questionText || options.length === 0) return null

      return {
        questionKey,
        question: questionText,
        contextLabel: asString(question.context_label) ?? "Additional institutional context (optional)",
        contextStatement: asString(question.context_statement),
        options,
      }
    })
    .filter((question): question is AssessmentMechanicQuestion => Boolean(question))
}

export function selectedConditionTraces(
  mechanics: AssessmentMechanicQuestion[],
  answers: Record<string, StructuredEvalAnswer>,
): AssessmentConditionTrace[] {
  return mechanics.flatMap((question) => {
    const answer = answers[question.questionKey]
    if (!answer?.selected) return []
    const option = question.options.find((candidate) => candidate.value === answer.selected)
    return [{
      question_key: question.questionKey,
      selected: answer.selected,
      label: answer.label,
      condition_tags: option?.conditionTags ?? [],
    }]
  })
}

export function replaceTemplateTokens(value: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (current, [key, replacement]) => current.replaceAll(`{${key}}`, replacement),
    value,
  )
}

export function resolveEnvironmentalReport(
  interpretationValue: unknown,
  traces: AssessmentConditionTrace[],
): { report: EnvironmentalStandingReport; emailArtifact: AssessmentEmailArtifact } | null {
  const interpretation = asRecord(interpretationValue)
  const standingRules = asRecordArray(interpretation?.standing_rules)
  const reportTemplates = asRecord(interpretation?.report_templates)
  const emailTemplate = asRecord(interpretation?.email_artifact_template)
  const reportLabels = asRecord(interpretation?.report_labels)
  if (standingRules.length === 0 || !reportTemplates || !emailTemplate) return null

  const tagCounts = traces.reduce<Record<string, number>>((counts, trace) => {
    for (const tag of trace.condition_tags) counts[tag] = (counts[tag] ?? 0) + 1
    return counts
  }, {})
  const submittedTags = Object.keys(tagCounts)

  const scoredRules = standingRules.map((rule, index) => {
    const standingKey = asString(rule.standing_key)
    const standing = asString(rule.standing)
    const priority = typeof rule.priority === "number" ? rule.priority : 0
    const anyTags = asStringArray(rule.any_tags)
    const allTags = asStringArray(rule.all_tags)
    const matchedAny = anyTags.filter((tag) => submittedTags.includes(tag))
    const matchedAll = allTags.filter((tag) => submittedTags.includes(tag))
    const allSatisfied = allTags.length === matchedAll.length
    const score = (allSatisfied ? allTags.length * 3 : 0) + matchedAny.length

    return {
      index,
      standingKey,
      standing,
      priority,
      ruleKey: asString(rule.rule_key) ?? standingKey ?? `rule_${index}`,
      score,
      matchedTags: [...new Set([...matchedAll, ...matchedAny])],
      eligible: Boolean(standingKey && standing && score > 0 && allSatisfied),
    }
  })

  const selected =
    scoredRules
      .filter((rule) => rule.eligible)
      .sort((a, b) => b.score - a.score || b.priority - a.priority || a.index - b.index)[0] ??
    scoredRules.find((rule) => rule.standingKey === "structured_governance_candidate") ??
    null

  if (!selected?.standingKey || !selected.standing) return null

  const template = asRecord(reportTemplates[selected.standingKey])
  if (!template) return null

  const findingMap = asRecord(interpretation?.finding_map)
  const findings = [
    ...new Set(
      submittedTags.flatMap((tag) => {
        const mapped = findingMap?.[tag]
        return typeof mapped === "string" ? [mapped] : []
      }),
    ),
  ]

  const detectedConditions = submittedTags
    .map((tag) => asString(asRecord(interpretation?.condition_labels)?.[tag]) ?? tag.replaceAll("_", " "))
    .slice(0, 8)

  const report: EnvironmentalStandingReport = {
    environmental_standing: selected.standing,
    standing_key: selected.standingKey,
    assessment_title:
      asString(reportLabels?.assessment_title) ?? "MEASURES AI ENVIRONMENT ASSESSMENT",
    assessment_result:
      asString(template.assessment_result) ??
      asString(reportLabels?.assessment_result) ??
      "Structural Drift Detected",
    detected_conditions: detectedConditions,
    findings,
    operational_exposure_summary:
      asString(template.operational_exposure_summary) ??
      "Submitted conditions were resolved through seated deterministic standing rules.",
    recommended_structured_action:
      asString(template.recommended_structured_action) ??
      "Continue through the Measures Structured Environment pathway.",
    recommended_response_label:
      asString(reportLabels?.recommended_response_label) ?? "Recommended Operational Response",
    continuation_pathway:
      asString(template.continuation_pathway) ?? "Structured Environment continuation",
    explainability: {
      question_keys: traces.map((trace) => trace.question_key),
      condition_tags: submittedTags,
      standing_rule: selected.ruleKey,
    },
  }

  const replacements = {
    assessment_title: report.assessment_title,
    assessment_result: report.assessment_result,
    environmental_standing: report.environmental_standing,
    operational_exposure_summary: report.operational_exposure_summary,
    recommended_structured_action: report.recommended_structured_action,
    recommended_response_label: report.recommended_response_label,
    continuation_pathway: report.continuation_pathway,
    findings: report.findings.join(", "),
    detected_conditions: report.detected_conditions.join(", "),
  }

  return {
    report,
    emailArtifact: {
      subject: replaceTemplateTokens(
        asString(emailTemplate.subject) ?? "Measures AI Environment Assessment",
        replacements,
      ),
      preview: replaceTemplateTokens(
        asString(emailTemplate.preview) ?? report.operational_exposure_summary,
        replacements,
      ),
      body: asStringArray(emailTemplate.body).map((line) => replaceTemplateTokens(line, replacements)),
      source: "assessment_interpretation_metadata",
    },
  }
}

export function resolveEnvironmentalReportByScore(
  mechanics: AssessmentMechanicQuestion[],
  traces: AssessmentConditionTrace[],
  interpretationValue: unknown,
): { report: EnvironmentalStandingReport; emailArtifact: AssessmentEmailArtifact; score: number } | null {
  const interpretation = asRecord(interpretationValue)
  const scoringThresholds = asRecordArray(interpretation?.scoring_thresholds)
  const emailTemplate = asRecord(interpretation?.email_artifact_template)
  const reportLabels = asRecord(interpretation?.report_labels)
  const findingMap = asRecord(interpretation?.finding_map)

  if (scoringThresholds.length === 0 || !emailTemplate) {
    const fallback = resolveEnvironmentalReport(interpretationValue, traces)
    if (!fallback) return null
    return { ...fallback, score: -1 }
  }

  let totalScore = 0
  let maxScore = 0
  for (const question of mechanics) {
    const tagCounts = question.options.map((o) => o.conditionTags.length)
    const minTags = Math.min(...tagCounts)
    const maxTags = Math.max(...tagCounts)
    maxScore += maxTags - minTags
    const trace = traces.find((t) => t.question_key === question.questionKey)
    if (trace) totalScore += Math.max(0, trace.condition_tags.length - minTags)
  }
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  const threshold =
    scoringThresholds.find((t) => {
      const min = typeof t.min === "number" ? t.min : 0
      const max = typeof t.max === "number" ? t.max : 100
      return scorePercent >= min && scorePercent <= max
    }) ?? scoringThresholds[scoringThresholds.length - 1]

  if (!threshold) return null

  const standingKey = asString(threshold.standing_key) ?? "structural_drift_detected"
  const standing = asString(threshold.standing) ?? "Structural Drift Detected"

  const submittedTags = [...new Set(traces.flatMap((t) => t.condition_tags))]
  const findings = [
    ...new Set(
      submittedTags.flatMap((tag) => {
        const mapped = findingMap?.[tag]
        return typeof mapped === "string" ? [mapped] : []
      }),
    ),
  ]
  const detectedConditions = submittedTags
    .map((tag) => asString(asRecord(interpretation?.condition_labels)?.[tag]) ?? tag.replaceAll("_", " "))
    .slice(0, 8)

  const report: EnvironmentalStandingReport = {
    environmental_standing: standing,
    standing_key: standingKey,
    assessment_title: asString(reportLabels?.assessment_title) ?? "MEASURES AI ENVIRONMENT ASSESSMENT",
    assessment_result: asString(threshold.assessment_result) ?? standing,
    detected_conditions: detectedConditions,
    findings,
    operational_exposure_summary:
      asString(threshold.operational_exposure_summary) ??
      "Assessment resolved through seated scoring contract.",
    recommended_structured_action:
      asString(threshold.recommended_structured_action) ??
      "Continue through the Measures structured pathway.",
    recommended_response_label:
      asString(reportLabels?.recommended_response_label) ?? "Recommended Operational Response",
    continuation_pathway:
      asString(threshold.continuation_pathway) ?? "Structured Environment continuation",
    explainability: {
      question_keys: traces.map((t) => t.question_key),
      condition_tags: submittedTags,
      standing_rule: `scoring_threshold_${standingKey}`,
    },
  }

  const replacements = {
    assessment_title: report.assessment_title,
    assessment_result: report.assessment_result,
    environmental_standing: report.environmental_standing,
    operational_exposure_summary: report.operational_exposure_summary,
    recommended_structured_action: report.recommended_structured_action,
    recommended_response_label: report.recommended_response_label,
    continuation_pathway: report.continuation_pathway,
    findings: report.findings.join(", "),
    detected_conditions: report.detected_conditions.join(", "),
  }

  return {
    score: scorePercent,
    report,
    emailArtifact: {
      subject: replaceTemplateTokens(
        asString(emailTemplate.subject) ?? "Measures AI Environment Assessment",
        replacements,
      ),
      preview: replaceTemplateTokens(
        asString(emailTemplate.preview) ?? report.operational_exposure_summary,
        replacements,
      ),
      body: asStringArray(emailTemplate.body).map((line) => replaceTemplateTokens(line, replacements)),
      source: "scoring_threshold_contract",
    },
  }
}

export function mediaUrl(row?: MediaRow): string | null {
  const metadata = asRecord(row?.metadata)
  return resolveRuntimeMediaUrl({
    publicUrl: asString(metadata?.public_url) ?? asString(metadata?.exact_url_seated),
    bucketName: row?.storage_bucket,
    storagePath: row?.storage_path,
    storageProvider: asString(metadata?.storage_provider),
  })
}

export function cssTokenName(tokenKey: string, mediaQuery: string | null): string {
  const suffix = mediaQuery ? "-mobile" : ""
  return `--registry-${tokenKey.replaceAll("_", "-")}${suffix}`
}

export function sectionCopy(row?: LandingSectionRow) {
  const metadata = asRecord(row?.metadata) ?? {}
  return {
    functionLayer: asString(metadata.function_layer),
    stateExpression: asString(metadata.state_expression),
    renderer: asString(metadata.renderer),
    header: asRecord(metadata.header),
    eyebrow: asString(metadata.eyebrow),
    title: asString(metadata.title) ?? row?.display_title ?? null,
    subtitle: asString(metadata.subtitle),
    informationalParagraph: asString(metadata.informational_paragraph),
    plaques: asRecordArray(metadata.plaques),
    entryLabel: asString(metadata.entry_label),
    entryHeadline: asString(metadata.entry_headline),
    entrySub: asString(metadata.entry_sub),
    breakdownBlocks: Array.isArray(metadata.breakdown_blocks)
      ? metadata.breakdown_blocks.filter((item): item is string => typeof item === "string")
      : [],
    resolutionShift: asString(metadata.resolution_shift),
    transitionStatement: asString(metadata.transition_statement),
    coreStatement: asString(metadata.core_statement),
    paragraphs: Array.isArray(metadata.paragraphs)
      ? metadata.paragraphs.filter((item): item is string => typeof item === "string")
      : [],
    sections: asRecordArray(metadata.sections),
    diagnosticText: asString(metadata.diagnostic_text),
    evaluationEntry: asRecord(metadata.evaluation_entry),
    assessmentMechanics: asRecord(metadata.assessment_mechanics),
    assessmentInterpretation: asRecord(metadata.assessment_interpretation),
    assessmentChamber: asRecord(metadata.assessment_chamber),
    assessmentCompletion: asRecord(metadata.assessment_completion),
    encounterContract: asRecord(metadata.encounter_contract),
    layoutContract: asRecord(metadata.layout_contract),
    stylingContract: asRecordFromPaths(
      metadata.styling_contract,
      asRecord(metadata.encounter_contract)?.styling_contract,
    ),
    srcIntakeContract: asRecordFromPaths(
      metadata.src_intake_contract,
      asRecord(metadata.encounter_contract)?.src_intake_contract,
    ),
    featuredPublication: asRecord(metadata.featured_publication),
    subscriptionEntry: asRecord(metadata.subscription_entry),
    heroPaths: asRecordArray(metadata.hero_paths),
    evaluationSections: asRecordArray(metadata.evaluation_sections),
    resolutionText: asString(metadata.resolution_text),
    outcomeStatement: asString(metadata.outcome_statement),
    closingStatement: asString(metadata.closing_statement),
    entityReference: asString(metadata.entity_reference),
    fields: asRecordArray(metadata.fields),
    ctaPrimary: asString(metadata.cta_primary),
    ctaSecondary: asString(metadata.cta_secondary),
    successMessage: asString(metadata.success_message),
    successSubtext: asString(metadata.success_subtext),
    offeringKey: asString(metadata.offering_key),
    dataSource: asString(metadata.data_source),
    allowedTransitions: asRecord(metadata.allowed_transitions),
    capture: asRecord(metadata.capture),
    mediaRenderMode: asString(metadata.media_render_mode),
    videoMode: asString(metadata.video_mode),
    options: asRecordArray(metadata.options),
    more: asRecord(metadata.more),
    actions: asActionArray(metadata.actions),
    mediaBehaviorContract: asRecord(metadata.media_behavior_contract),
    brandingContract: asRecord(metadata.branding_contract),
    contentContract: asRecord(metadata.content_contract),
    crystalContentContracts: asRecord(metadata.crystal_chamber_content_contracts),
    publicRuntimeBoundary: asRecord(metadata.measures_registry_public_runtime_boundary_v1),
    routeCards: asRecordArray(metadata.route_cards),
    governedStatus: governedStatusCopy(metadata),
  }
}

export type SectionCopy = ReturnType<typeof sectionCopy>

export function dispatchIssueLabel(dispatch: { issue_number?: string | null; metadata?: Record<string, unknown> | null }): string {
  const metadata = dispatch.metadata ?? {}
  return (
    asString(metadata.issue_number) ??
    asString(metadata.issue) ??
    asString(metadata.issue_label) ??
    dispatch.issue_number ??
    "Issue metadata not seated"
  )
}

export function dispatchTypeLabel(dispatch: { metadata?: Record<string, unknown> | null }): string {
  const metadata = dispatch.metadata ?? {}
  return asString(metadata.dispatch_type) ?? asString(metadata.type) ?? "Field Note"
}

export function dispatchThesis(dispatch: { excerpt?: string | null; seo_description?: string | null; metadata?: Record<string, unknown> | null }): string | null {
  const metadata = dispatch.metadata ?? {}
  return asString(metadata.diagnostic_thesis) ?? dispatch.excerpt ?? dispatch.seo_description ?? null
}

export function publicationAssetUrl(
  path: string | null,
  getPublicUrl: (path: string) => string,
): string | null {
  if (!path) return null
  const normalized = path.startsWith("measures-registry/")
    ? path.slice("measures-registry/".length)
    : path
  return getPublicUrl(normalized)
}

export function youtubeEmbedUrl(url: string | null): string | null {
  if (!url) return null
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`
  const watchMatch = url.match(/[?&]v=([^?&]+)/)
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`
  return null
}

export function markdownBlocks(markdown: string): string[] {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !/^\[!\[\]\(.+\)\]\(.+\)$/.test(block))
    .filter((block) => !/^!\[\]\(.+\)$/.test(block))
    .filter((block) => !/^\[Subscribe\]\(.+\)$/.test(block))
}

export function cleanMarkdownText(value: string): string {
  return value
    .replace(/^#+\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim()
}
