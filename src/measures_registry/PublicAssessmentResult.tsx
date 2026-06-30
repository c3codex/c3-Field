import type { AssessmentEmailArtifact, EnvironmentalStandingReport } from "./measuresAssessmentTypes"
import { ASSESSMENT_TITLE } from "./measuresAssessmentCopy"
import { asString, asStringArray } from "./encounter_renderer/shared/encounterRendererUtils"


type PublicAssessmentResultProps = {
  assessmentCompletion?: Record<string, unknown> | null
  emailArtifact: AssessmentEmailArtifact | null
  passageMuted: boolean
  publicResultBoundary?: {
    pathwayLabels: string[]
    recommendationCopy?: string | null
    heldCopy?: string | null
  } | null
  report: EnvironmentalStandingReport | null
  reportContract?: Record<string, unknown> | null
  reportFields?: Record<string, string>
  resolutionText?: string
  structuredEnvironmentPassageVideoUrl: string | null
  onBeginPathwayReview: () => void
  onEnterStructuredEnvironment: () => void
  onStructuredEnvironmentVideoEnded: () => void
  onTogglePassageMuted: () => void
}

export function PublicAssessmentResult({
  assessmentCompletion,
  emailArtifact,
  passageMuted,
  publicResultBoundary,
  report,
  reportContract,
  reportFields = {},
  resolutionText,
  structuredEnvironmentPassageVideoUrl,
  onBeginPathwayReview,
  onEnterStructuredEnvironment,
  onStructuredEnvironmentVideoEnded,
  onTogglePassageMuted,
}: PublicAssessmentResultProps) {
  const completion = assessmentCompletion ?? {}
  const completionLabel =
    typeof completion.assessment_completion_label === "string" ? completion.assessment_completion_label : "Assessment Complete"
  const clarificationTitle =
    typeof completion.clarification_title === "string" ? completion.clarification_title : null
  const clarificationBody =
    typeof completion.clarification_body === "string" ? completion.clarification_body : null
  const measuresStandingTitle =
    typeof completion.measures_registry_standing_title === "string" ? completion.measures_registry_standing_title : null
  const measuresStandingBody =
    typeof completion.measures_registry_standing_body === "string" ? completion.measures_registry_standing_body : null
  const progressionLabel =
    typeof completion.progression_threshold_label === "string" ? completion.progression_threshold_label : null
  const progressionTitle =
    typeof completion.progression_threshold_title === "string" ? completion.progression_threshold_title : null
  const progressionBody =
    typeof completion.progression_threshold_body === "string" ? completion.progression_threshold_body : null
  const progressionCta =
    typeof completion.progression_threshold_cta === "string" ? completion.progression_threshold_cta : "Enter Structured Environment"
  const publicPathwayLabels = publicResultBoundary?.pathwayLabels ?? []
  const reportHeader = reportContract?.report_header && typeof reportContract.report_header === "object"
    ? reportContract.report_header as Record<string, unknown>
    : null
  const reportTemplates = reportContract?.report_templates && typeof reportContract.report_templates === "object"
    ? reportContract.report_templates as Record<string, unknown>
    : null
  const reportTemplate =
    report?.standing_key && reportTemplates?.[report.standing_key] && typeof reportTemplates[report.standing_key] === "object"
      ? reportTemplates[report.standing_key] as Record<string, unknown>
      : null
  const reportTitle = typeof reportHeader?.title === "string"
    ? reportHeader.title
    : "Measures Registry Assessment Evaluation Report"
  const reportSubtitle = typeof reportHeader?.subtitle === "string"
    ? reportHeader.subtitle
    : "Governed System Integrity for Optimized AI Deployment"
  const reportDescriptor = typeof reportHeader?.descriptor === "string"
    ? reportHeader.descriptor
    : "Integrity Governance for AI-Accelerated Systems"
  const boundaryNote = typeof reportContract?.report_boundary_note === "string"
    ? reportContract.report_boundary_note
    : "This report provides an environment evaluation and recommended actions based on the assessment responses submitted. It does not create approval, enrollment, implementation, or verified registry status."
  const reportCta = reportContract?.report_cta && typeof reportContract.report_cta === "object"
    ? reportContract.report_cta as Record<string, unknown>
    : null
  const reportCtaLabel = typeof reportCta?.label === "string" ? reportCta.label : "Begin Pathway Review"
  const institutionName = reportFields.institution_name?.trim() || "Submitted Institution"
  const organizationType = reportFields.organization_type?.trim()
  const reportTimestamp = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date())
  const templateSummary = typeof reportTemplate?.summary === "string" ? reportTemplate.summary : null
  const detectedConditions = Array.isArray(reportTemplate?.detected_conditions)
    ? reportTemplate.detected_conditions.filter((item): item is string => typeof item === "string")
    : report?.detected_conditions ?? []
  const findings = Array.isArray(reportTemplate?.findings)
    ? reportTemplate.findings.filter((item): item is string => typeof item === "string")
    : report?.findings ?? []
  const recommendedActions = Array.isArray(reportTemplate?.recommended_actions)
    ? reportTemplate.recommended_actions.filter((item): item is string => typeof item === "string")
    : []
  const informationalNoticeLines =
    Array.isArray(reportContract?.informational_notice)
      ? (reportContract.informational_notice as unknown[]).filter((l): l is string => typeof l === "string")
      : typeof reportContract?.informational_notice === "string"
        ? [reportContract.informational_notice as string]
        : []
  const recommendation =
    typeof reportContract?.recommendation === "string" ? reportContract.recommendation as string : null
  const indicatorsLabel =
    typeof reportContract?.key_environmental_indicators_label === "string"
      ? reportContract.key_environmental_indicators_label as string
      : "Key Environmental Indicators"
  const conditionIndicatorMap =
    reportContract?.condition_indicator_map && typeof reportContract.condition_indicator_map === "object"
      ? reportContract.condition_indicator_map as Record<string, unknown>
      : null

  // Derive indicators: prefer findings already returned (capped at 3),
  // fall back to condition_tag lookup via condition_indicator_map.
  const indicators: string[] = (() => {
    if (findings.length > 0) return findings.slice(0, 3)
    if (!conditionIndicatorMap || !report?.explainability?.condition_tags) return []
    return [...new Set(
      report.explainability.condition_tags
        .map((tag) => asString(conditionIndicatorMap[tag]))
        .filter((s): s is string => Boolean(s)),
    )].slice(0, 3)
  })()

  return (
    <div className="registry-eval-resolution registry-assessment-complete">
      {report ? (
        <section className="registry-standing-report registry-branded-assessment-report" aria-label={reportTitle}>
          <header className="registry-report-header">
            <span>{completionLabel}</span>
            <h2>{reportTitle}</h2>
            <p>{reportSubtitle}</p>
            <small>{reportDescriptor}</small>
          </header>
          <div className="registry-report-meta">
            <p>Prepared for: {institutionName}</p>
            {organizationType ? <p>Organization type: {organizationType.replaceAll("_", " ")}</p> : null}
            <p>Report generated: {reportTimestamp}</p>
          </div>
          {/* 1. Informational Notice */}
          {informationalNoticeLines.length > 0 ? (
            <section className="registry-report-informational-notice" aria-label="Measures Registry Informational Notice">
              {informationalNoticeLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </section>
          ) : null}

          {/* 2. Environment Finding */}
          <div className="registry-report-result">
            <span>{report.assessment_title ?? ASSESSMENT_TITLE}</span>
            <h3>{reportTemplate?.report_title as string ?? report.assessment_result}</h3>
            <p>{templateSummary ?? report.operational_exposure_summary}</p>
            <strong>{report.environmental_standing}</strong>
          </div>

          {/* 3. Key Environmental Indicators */}
          {indicators.length > 0 ? (
            <div className="registry-report-group registry-report-key-indicators">
              <strong>{indicatorsLabel}</strong>
              <ul>
                {indicators.map((indicator) => (
                  <li key={indicator}>{indicator}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* 4. Recommendation */}
          {recommendation ? (
            <div className="registry-report-recommendation">
              <p>{recommendation}</p>
            </div>
          ) : null}
          {clarificationTitle || clarificationBody ? (
            <section className="registry-standing-clarification">
              {clarificationTitle ? <strong>{clarificationTitle}</strong> : null}
              {clarificationBody ? <p>{clarificationBody}</p> : null}
            </section>
          ) : null}
          {measuresStandingTitle || measuresStandingBody ? (
            <section className="registry-standing-measures">
              {measuresStandingTitle ? <strong>{measuresStandingTitle}</strong> : null}
              {measuresStandingBody ? <p>{measuresStandingBody}</p> : null}
            </section>
          ) : null}
          <p className="registry-report-boundary">{boundaryNote}</p>
          <div className="registry-diagnostic-passage-controls registry-report-controls" aria-label="Assessment report controls">
            <button type="button" onClick={onBeginPathwayReview}>
              {reportCtaLabel}
            </button>
          </div>
        </section>
      ) : (
        <p>{resolutionText ?? "Structural conditions have been recorded."}</p>
      )}
      {emailArtifact && !reportContract ? (
        <section className="registry-email-artifact" aria-label="Structured email artifact">
          <span>Assessment Delivery</span>
          <strong>{emailArtifact.subject}</strong>
          <p>{emailArtifact.preview}</p>
        </section>
      ) : null}
      {!reportContract && (progressionLabel || progressionTitle || progressionBody) ? (
        <section className="registry-progression-threshold">
          {progressionLabel ? <span>{progressionLabel}</span> : null}
          {progressionTitle ? <strong>{progressionTitle}</strong> : null}
          {progressionBody ? <p>{progressionBody}</p> : null}
        </section>
      ) : !reportContract && publicResultBoundary ? (
        <section className="registry-progression-threshold" aria-label="Public pathway recommendation">
          <span>Governed Pathways</span>
          <strong>Public continuation labels only</strong>
          {publicResultBoundary.recommendationCopy ? <p>{publicResultBoundary.recommendationCopy}</p> : null}
          {publicPathwayLabels.length > 0 ? (
            <ul className="registry-public-pathway-list">
              {publicPathwayLabels.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          ) : null}
          {publicResultBoundary.heldCopy ? <p>{publicResultBoundary.heldCopy}</p> : null}
        </section>
      ) : !reportContract ? (
        <p>Continue into the Structured Environment.</p>
      ) : null}
      {!reportContract && !publicResultBoundary && structuredEnvironmentPassageVideoUrl ? (
        <video
          src={structuredEnvironmentPassageVideoUrl}
          autoPlay
          muted={passageMuted}
          controls
          playsInline
          preload="auto"
          onEnded={onStructuredEnvironmentVideoEnded}
          aria-label="Structured Environment passage"
        />
      ) : !reportContract && !publicResultBoundary ? (
        <p className="registry-media-absence">Structured Environment passage media is not seated in the runtime registry.</p>
      ) : null}
      {!reportContract && !publicResultBoundary ? (
        <div className="registry-diagnostic-passage-controls" aria-label="Structured Environment passage controls">
          <button type="button" onClick={onEnterStructuredEnvironment}>
            {progressionCta}
          </button>
          <button type="button" onClick={onTogglePassageMuted}>
            {passageMuted ? "Audio" : "Mute"}
          </button>
        </div>
      ) : null}
    </div>
  )
}
