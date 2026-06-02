import type { AssessmentEmailArtifact, EnvironmentalStandingReport } from "./measuresAssessmentTypes"
import { ASSESSMENT_SUB_SUPPORT_LINE, ASSESSMENT_TITLE } from "./measuresAssessmentCopy"

type RecommendedOperatingProtocolProps = {
  report: EnvironmentalStandingReport
}

function RecommendedOperatingProtocol({ report }: RecommendedOperatingProtocolProps) {
  return (
    <div>
      <strong>{report.recommended_response_label}</strong>
      <p>{report.recommended_structured_action}</p>
    </div>
  )
}

type MeasuresAssessmentResultProps = {
  assessmentCompletion?: Record<string, unknown> | null
  emailArtifact: AssessmentEmailArtifact | null
  passageMuted: boolean
  publicResultBoundary?: {
    pathwayLabels: string[]
    recommendationCopy?: string | null
    heldCopy?: string | null
  } | null
  report: EnvironmentalStandingReport | null
  resolutionText?: string
  structuredEnvironmentPassageVideoUrl: string | null
  onEnterStructuredEnvironment: () => void
  onStructuredEnvironmentVideoEnded: () => void
  onTogglePassageMuted: () => void
}

export function MeasuresAssessmentResult({
  assessmentCompletion,
  emailArtifact,
  passageMuted,
  publicResultBoundary,
  report,
  resolutionText,
  structuredEnvironmentPassageVideoUrl,
  onEnterStructuredEnvironment,
  onStructuredEnvironmentVideoEnded,
  onTogglePassageMuted,
}: MeasuresAssessmentResultProps) {
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

  return (
    <div className="registry-eval-resolution registry-assessment-complete">
      <span>{completionLabel}</span>
      <h2>{report?.assessment_title ?? ASSESSMENT_TITLE}</h2>
      <p className="registry-assessment-support">{ASSESSMENT_SUB_SUPPORT_LINE}</p>
      {report ? (
        <section className="registry-standing-report" aria-label="Environmental standing report">
          <span>Assessment</span>
          <h3>{report.assessment_result}</h3>
          <p>{report.operational_exposure_summary}</p>
          {report.findings.length > 0 ? (
            <div className="registry-standing-findings">
              <strong>Findings</strong>
              <ul>
                {report.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <RecommendedOperatingProtocol report={report} />
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
          <small>
            Assessment basis: {report.explainability.question_keys.length} response keys / {report.explainability.condition_tags.length} condition signals
          </small>
        </section>
      ) : (
        <p>{resolutionText ?? "Structural conditions have been recorded."}</p>
      )}
      {emailArtifact ? (
        <section className="registry-email-artifact" aria-label="Structured email artifact">
          <span>Assessment Delivery</span>
          <strong>{emailArtifact.subject}</strong>
          <p>{emailArtifact.preview}</p>
        </section>
      ) : null}
      {progressionLabel || progressionTitle || progressionBody ? (
        <section className="registry-progression-threshold">
          {progressionLabel ? <span>{progressionLabel}</span> : null}
          {progressionTitle ? <strong>{progressionTitle}</strong> : null}
          {progressionBody ? <p>{progressionBody}</p> : null}
        </section>
      ) : publicResultBoundary ? (
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
      ) : (
        <p>Continue into the Structured Environment.</p>
      )}
      {!publicResultBoundary && structuredEnvironmentPassageVideoUrl ? (
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
      ) : !publicResultBoundary ? (
        <p className="registry-media-absence">Structured Environment passage media is not seated in the runtime registry.</p>
      ) : null}
      {!publicResultBoundary ? (
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
