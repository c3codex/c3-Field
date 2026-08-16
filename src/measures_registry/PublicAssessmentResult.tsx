import type { AssessmentEmailArtifact, AssessmentEvaluationV2Cell, EnvironmentalStandingReport } from "./measuresAssessmentTypes"
import { ASSESSMENT_TITLE } from "./measuresAssessmentCopy"
import { asString } from "./encounter_renderer/shared/encounterRendererUtils"

const MATRIX_ROWS = [
  { key: "system", label: "System" },
  { key: "environment", label: "Environment" },
  { key: "change", label: "Change" },
] as const

const MATRIX_COLUMNS = [
  { key: "identify", label: "Identify" },
  { key: "govern", label: "Govern" },
  { key: "verify", label: "Verify" },
] as const

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

function cellLabel(cell: AssessmentEvaluationV2Cell | undefined) {
  return cell ? cell.standing.replaceAll("_", " ") : "unverified"
}

function cellDetail(cell: AssessmentEvaluationV2Cell | undefined) {
  if (!cell) return "No persisted cell state was available."
  return cell.finding || cell.next_action || cell.consequence
}

function displayListValue(value: string) {
  return value.replaceAll("_", " ")
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
    typeof completion.progression_threshold_cta === "string" ? completion.progression_threshold_cta : "MAP the Environment"
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
    : "Measures Registry Assessment & Evaluation"
  const reportSubtitle = typeof reportHeader?.subtitle === "string"
    ? reportHeader.subtitle
    : "Persisted Assessment & Evaluation v2 state"
  const reportDescriptor = typeof reportHeader?.descriptor === "string"
    ? reportHeader.descriptor
    : "MAP the Environment continuation"
  const boundaryNote = typeof reportContract?.report_boundary_note === "string"
    ? reportContract.report_boundary_note
    : "This evaluation is based on submitted assessment responses and persisted runtime state. It does not create approval, certification, SEAT standing, a c3 Key, or implementation authority."
  const reportCta = reportContract?.report_cta && typeof reportContract.report_cta === "object"
    ? reportContract.report_cta as Record<string, unknown>
    : null
  const reportCtaLabel = typeof reportCta?.label === "string" ? reportCta.label : "Continue to MAP the Environment"
  const institutionName = reportFields.institution_name?.trim() || "Submitted Institution"
  const organizationType = reportFields.organization_type?.trim()
  const reportTimestamp = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date())
  const evaluationV2 = report?.evaluation_v2 ?? null
  const evaluationMatrixCells = evaluationV2?.matrix_cells ?? []
  const evaluationCellByAxis = new Map(
    evaluationMatrixCells.map((cell) => [`${cell.row_axis}:${cell.column_axis}`, cell]),
  )
  const reportedConditions = evaluationV2?.reported_conditions ?? report?.explainability?.condition_tags ?? []
  const relationalFindings = evaluationV2?.relational_exposures ?? []
  const systemConsequences = evaluationV2?.system_consequences ?? []
  const verificationLimits = evaluationV2?.verification_limits ?? []
  const priorityCells = evaluationV2?.priority_cells ?? []
  const continuationLabel = evaluationV2?.continuation?.label ?? "MAP the Environment"

  const templateSummary = typeof reportTemplate?.summary === "string" ? reportTemplate.summary : null
  const detectedConditions = Array.isArray(reportTemplate?.detected_conditions)
    ? reportTemplate.detected_conditions.filter((item): item is string => typeof item === "string")
    : report?.detected_conditions ?? []
  const findings = Array.isArray(reportTemplate?.findings)
    ? reportTemplate.findings.filter((item): item is string => typeof item === "string")
    : report?.findings ?? []
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
            {evaluationV2?.evaluation_id ? <p>Evaluation reference: {evaluationV2.evaluation_id}</p> : null}
            {evaluationV2?.assessment_ref ? <p>Assessment reference: {evaluationV2.assessment_ref}</p> : null}
          </div>

          {evaluationV2 ? (
            <>
              <div className="registry-report-result registry-report-v2-standing">
                <span>{report.assessment_title ?? ASSESSMENT_TITLE}</span>
                <h3>{evaluationV2.evaluation_standing}</h3>
                <p>
                  This delivered evaluation renders the persisted Assessment & Evaluation v2 state. MAP the Environment
                  is the governed continuation for evidence work.
                </p>
                <strong>{displayListValue(evaluationV2.evaluation_standing_key)}</strong>
              </div>

              <section className="registry-report-group registry-report-v2-conditions" aria-label="Reported condition boundary">
                <strong>Reported-Condition Boundary</strong>
                <p>
                  These conditions are self-reported until MAP evidence work observes the environment. They do not
                  establish compliance, certification, SEAT standing, a c3 Key, or implementation authority.
                </p>
                {reportedConditions.length > 0 ? (
                  <ul>
                    {reportedConditions.map((condition) => (
                      <li key={condition}>{displayListValue(condition)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <section className="registry-report-group registry-report-v2-matrix" aria-label="Evaluation matrix">
                <strong>3x3 Evaluation Matrix</strong>
                <div className="registry-v2-matrix-grid" role="table" aria-label="Assessment and Evaluation v2 3x3 matrix">
                  <div className="registry-v2-matrix-row registry-v2-matrix-row--header" role="row">
                    <span role="columnheader">Axis</span>
                    {MATRIX_COLUMNS.map((column) => (
                      <span key={column.key} role="columnheader">{column.label}</span>
                    ))}
                  </div>
                  {MATRIX_ROWS.map((row) => (
                    <div className="registry-v2-matrix-row" role="row" key={row.key}>
                      <span className="registry-v2-matrix-axis" role="rowheader">{row.label}</span>
                      {MATRIX_COLUMNS.map((column) => {
                        const cell = evaluationCellByAxis.get(`${row.key}:${column.key}`)
                        return (
                          <div className="registry-v2-matrix-cell" role="cell" key={`${row.key}-${column.key}`}>
                            <span>{cellLabel(cell)}</span>
                            <p>{cellDetail(cell)}</p>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </section>

              {relationalFindings.length > 0 ? (
                <section className="registry-report-group registry-report-v2-relational" aria-label="Relational findings">
                  <strong>Relational Findings</strong>
                  <ul>
                    {relationalFindings.map((finding) => (
                      <li key={finding}>{displayListValue(finding)}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {systemConsequences.length > 0 ? (
                <section className="registry-report-group registry-report-v2-consequences" aria-label="System consequences">
                  <strong>System Consequences</strong>
                  <ul>
                    {systemConsequences.map((consequence) => (
                      <li key={consequence}>{consequence}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {verificationLimits.length > 0 ? (
                <section className="registry-report-group registry-report-v2-limits" aria-label="Verification limits">
                  <strong>Verification Limits</strong>
                  <ul>
                    {verificationLimits.map((limit) => (
                      <li key={limit}>{limit}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="registry-report-group registry-report-v2-map" aria-label="MAP examination scope">
                <strong>MAP Examination Scope</strong>
                <p>
                  Your evaluation indicates further examination should focus on the priority conditions surfaced across
                  System, Environment, and Change. Current continuation: {continuationLabel}.
                </p>
                {priorityCells.length > 0 ? (
                  <ul>
                    {priorityCells.map((cell) => (
                      <li key={cell}>{displayListValue(cell)}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </>
          ) : (
            <>
              <div className="registry-report-result">
                <span>{report.assessment_title ?? ASSESSMENT_TITLE}</span>
                <h3>{reportTemplate?.report_title as string ?? report.assessment_result}</h3>
                <p>{templateSummary ?? report.operational_exposure_summary}</p>
                <strong>{report.environmental_standing}</strong>
              </div>
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
              {recommendation ? (
                <div className="registry-report-recommendation">
                  <p>{recommendation}</p>
                </div>
              ) : null}
            </>
          )}

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
        <p>Continue to MAP the Environment.</p>
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
