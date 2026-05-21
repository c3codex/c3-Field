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
  emailArtifact: AssessmentEmailArtifact | null
  passageMuted: boolean
  report: EnvironmentalStandingReport | null
  resolutionText?: string
  structuredEnvironmentPassageVideoUrl: string | null
  onEnterStructuredEnvironment: () => void
  onStructuredEnvironmentVideoEnded: () => void
  onTogglePassageMuted: () => void
}

export function MeasuresAssessmentResult({
  emailArtifact,
  passageMuted,
  report,
  resolutionText,
  structuredEnvironmentPassageVideoUrl,
  onEnterStructuredEnvironment,
  onStructuredEnvironmentVideoEnded,
  onTogglePassageMuted,
}: MeasuresAssessmentResultProps) {
  return (
    <div className="registry-eval-resolution registry-assessment-complete">
      <span>Assessment Complete</span>
      <h2>{report?.assessment_title ?? ASSESSMENT_TITLE}</h2>
      <p className="registry-assessment-support">{ASSESSMENT_SUB_SUPPORT_LINE}</p>
      {report ? (
        <section className="registry-standing-report" aria-label="Environmental standing report">
          <span>Assessment</span>
          <h3>{report.assessment_result}</h3>
          <p>{report.operational_exposure_summary}</p>
          {report.findings.length > 0 ? (
            <div>
              <strong>Findings</strong>
              <ul>
                {report.findings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <RecommendedOperatingProtocol report={report} />
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
      <p>Continue into the Structured Environment.</p>
      {structuredEnvironmentPassageVideoUrl ? (
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
      ) : (
        <p className="registry-media-absence">Structured Environment passage media is not seated in the runtime registry.</p>
      )}
      <div className="registry-diagnostic-passage-controls" aria-label="Structured Environment passage controls">
        <button type="button" onClick={onEnterStructuredEnvironment}>
          Enter Structured Environment
        </button>
        <button type="button" onClick={onTogglePassageMuted}>
          {passageMuted ? "Audio" : "Mute"}
        </button>
      </div>
    </div>
  )
}
