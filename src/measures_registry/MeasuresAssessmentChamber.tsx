import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { MeasuresAssessmentBrandLayer } from "./MeasuresAssessmentBrandLayer"
import { MeasuresAssessmentResult } from "./MeasuresAssessmentResult"
import {
  ASSESSMENT_PROCESS_TITLE,
  ASSESSMENT_SUB_SUPPORT_LINE,
  ASSESSMENT_SUPPORT_LINE,
} from "./measuresAssessmentCopy"
import type {
  AssessmentEmailArtifact,
  AssessmentMechanicOption,
  AssessmentMechanicQuestion,
  EnvironmentalStandingReport,
  EvalStep,
  StructuredEvalAnswer,
} from "./measuresAssessmentTypes"

type MeasuresAssessmentChamberProps = {
  encounterKey: string
  assessmentEyebrow?: string
  assessmentProcessTitle?: string
  assessmentSupportLine?: string
  assessmentSubSupportLine?: string
  evalAnswers: Record<string, StructuredEvalAnswer>
  evalEmailArtifact: AssessmentEmailArtifact | null
  evalError: string | null
  evalFields: Record<string, string>
  evalReport: EnvironmentalStandingReport | null
  evalSectionIndex: number
  evalStep: EvalStep
  evalSubmitted: boolean
  evalSubmitting: boolean
  passageMuted: boolean
  assessmentCompletion?: Record<string, unknown> | null
  marbleAccentReferenceUrl: string | null
  registryBackgroundUrl: string | null
  registryMarkUrl: string | null
  registryWatermarkUrl: string | null
  registryTokenStyle: CSSProperties
  layoutContract?: Record<string, unknown>
  srcIntakeContract?: Record<string, unknown>
  stylingContract?: Record<string, unknown>
  resolutionText?: string
  governedStatus?: ReactNode
  renderSystemFooter?: () => ReactNode
  showQuestionContext?: boolean
  structuredEnvironmentPassageVideoUrl: string | null
  structuredQuestions: AssessmentMechanicQuestion[]
  onBackQuestion: () => void
  onCompleteQuestionClick: (event: MouseEvent<HTMLButtonElement>, question: AssessmentMechanicQuestion | null) => void
  onContinueQuestion: (question: AssessmentMechanicQuestion) => void
  onContinueToDiagnostic: () => void
  onEnterStructuredEnvironment: () => void
  onSetEvalAnswerContext: (question: AssessmentMechanicQuestion, value: string) => void
  onSetEvalAnswerSelection: (question: AssessmentMechanicQuestion, option: AssessmentMechanicOption) => void
  onSetEvalField: (key: string, value: string) => void
  onSubmitEvaluation: (event: FormEvent<HTMLFormElement>) => void
  onStructuredEnvironmentVideoEnded: () => void
  onTogglePassageMuted: () => void
}

export function MeasuresAssessmentChamber({
  encounterKey,
  assessmentEyebrow,
  assessmentProcessTitle = ASSESSMENT_PROCESS_TITLE,
  assessmentSupportLine = ASSESSMENT_SUPPORT_LINE,
  assessmentSubSupportLine = ASSESSMENT_SUB_SUPPORT_LINE,
  evalAnswers,
  evalEmailArtifact,
  evalError,
  evalFields,
  evalReport,
  evalSectionIndex,
  evalStep,
  evalSubmitted,
  evalSubmitting,
  passageMuted,
  assessmentCompletion,
  marbleAccentReferenceUrl,
  registryBackgroundUrl,
  registryMarkUrl,
  registryWatermarkUrl,
  registryTokenStyle,
  layoutContract,
  srcIntakeContract,
  stylingContract,
  resolutionText,
  governedStatus,
  renderSystemFooter,
  showQuestionContext = true,
  structuredEnvironmentPassageVideoUrl,
  structuredQuestions,
  onBackQuestion,
  onCompleteQuestionClick,
  onContinueQuestion,
  onContinueToDiagnostic,
  onEnterStructuredEnvironment,
  onSetEvalAnswerContext,
  onSetEvalAnswerSelection,
  onSetEvalField,
  onSubmitEvaluation,
  onStructuredEnvironmentVideoEnded,
  onTogglePassageMuted,
}: MeasuresAssessmentChamberProps) {
  const currentQuestion = structuredQuestions[evalSectionIndex] ?? null
  const finalDiagnosticQuestion = evalSectionIndex >= Math.max(structuredQuestions.length - 1, 0)
  const currentQuestionAnswered = Boolean(currentQuestion && evalAnswers[currentQuestion.questionKey]?.selected)
  const progressLabel = structuredQuestions.length > 0 ? `${evalSectionIndex + 1} of ${structuredQuestions.length}` : null
  const progressValue = structuredQuestions.length > 0 ? ((evalSectionIndex + 1) / structuredQuestions.length) * 100 : 0
  const layoutViewportFit =
    typeof layoutContract?.viewport_fit === "string" ? layoutContract.viewport_fit : "standard"
  const layoutCopyDensity =
    typeof layoutContract?.copy_density === "string" ? layoutContract.copy_density : "standard"
  const materialFamily =
    typeof stylingContract?.material_family === "string"
      ? stylingContract.material_family
      : typeof stylingContract?.foundation_material === "string"
        ? stylingContract.foundation_material
        : "standard"
  const visibleSrcFields = Array.isArray(srcIntakeContract?.visible_fields)
    ? srcIntakeContract.visible_fields.filter((field): field is string => typeof field === "string")
    : ["institution_name", "institution_type", "contact_name", "contact_email"]
  const srcFieldLabels = {
    institution_name: "Company / Organization Name",
    institution_type: "Type of Business / Organization",
    contact_name: "Contact Name",
    contact_email: "Contact Email",
  } as Record<string, string>
  const srcFieldTypes = {
    institution_name: "text",
    institution_type: "text",
    contact_name: "text",
    contact_email: "email",
  } as Record<string, string>
  const chamberStyle = {
    ...registryTokenStyle,
    ...(registryBackgroundUrl ? { "--registry-assessment-background-image": `url("${registryBackgroundUrl}")` } : {}),
    ...(marbleAccentReferenceUrl ? { "--registry-marble-accent-image": `url("${marbleAccentReferenceUrl}")` } : {}),
  } as CSSProperties

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounterKey}
      data-chamber-state={evalStep}
      data-copy-density={layoutCopyDensity}
      data-layout-fit={layoutViewportFit}
      data-material-family={materialFamily}
      style={chamberStyle}
    >
      <header className="registry-public-header">
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
          <span>Measures Registry</span>
        </div>
      </header>
      <section className="registry-iis-eval registry-assessment-chamber" aria-label={assessmentProcessTitle}>
        <MeasuresAssessmentBrandLayer registryMarkUrl={registryMarkUrl} registryWatermarkUrl={registryWatermarkUrl} />
        {!registryBackgroundUrl || !registryWatermarkUrl || !registryMarkUrl ? (
          <p className="registry-media-absence">
            Evaluation chamber media role mapping is incomplete in the runtime registry.
          </p>
        ) : null}
        <div className="registry-chamber-heading">
          <span>{assessmentEyebrow ?? "Measures Registry"}</span>
          <h1>{assessmentProcessTitle}</h1>
          <p>{assessmentSubSupportLine}</p>
        </div>
        {governedStatus}

        {evalSubmitted ? (
          <MeasuresAssessmentResult
            assessmentCompletion={assessmentCompletion}
            emailArtifact={evalEmailArtifact}
            passageMuted={passageMuted}
            report={evalReport}
            resolutionText={resolutionText}
            structuredEnvironmentPassageVideoUrl={structuredEnvironmentPassageVideoUrl}
            onEnterStructuredEnvironment={onEnterStructuredEnvironment}
            onStructuredEnvironmentVideoEnded={onStructuredEnvironmentVideoEnded}
            onTogglePassageMuted={onTogglePassageMuted}
          />
        ) : evalStep === "resolving" ? (
          <div className="registry-eval-resolution registry-assessment-resolving">
            <span>Resolving environmental standing</span>
            <h2>Reviewing operating conditions.</h2>
            <p className="registry-assessment-support">{assessmentSupportLine}</p>
            <ol>
              <li>Resolving environmental standing...</li>
              <li>Reviewing operating conditions...</li>
              <li>Assessing implementation structure...</li>
            </ol>
          </div>
        ) : evalStep === "src_capture" ? (
          <form
            className="registry-iis-eval-form registry-src-capture"
            onSubmit={(event) => {
              event.preventDefault()
              onContinueToDiagnostic()
            }}
          >
            <div className="registry-chamber-copy">
              <span>Environment Identity</span>
              <h2>Before the evaluation begins, identify the environment being assessed.</h2>
              <p className="registry-assessment-support">{assessmentSubSupportLine}</p>
            </div>
            <fieldset>
              <legend>Institutional Contact</legend>
              {visibleSrcFields.map((key) => (
                <label key={key}>
                  <span>{srcFieldLabels[key] ?? key.replaceAll("_", " ")}</span>
                  <input
                    type={srcFieldTypes[key] ?? "text"}
                    value={evalFields[key] ?? ""}
                    onChange={(event) => onSetEvalField(key, event.target.value)}
                    required
                  />
                </label>
              ))}
            </fieldset>
            {evalError ? <p className="registry-form-error">{evalError}</p> : null}
            <div className="registry-diagnostic-passage-controls">
              <button type="submit">Begin Evaluation</button>
              <button type="button" onClick={onTogglePassageMuted}>
                {passageMuted ? "Audio" : "Mute"}
              </button>
            </div>
          </form>
        ) : (
          <form className="registry-iis-eval-form" onSubmit={onSubmitEvaluation}>
            {progressLabel ? (
              <div className="registry-question-progress" aria-label={`Evaluation progress ${progressLabel}`}>
                <span>{progressLabel}</span>
                <div aria-hidden="true">
                  <i style={{ width: `${progressValue}%` }} />
                </div>
              </div>
            ) : null}

            {currentQuestion ? (
              <fieldset className="registry-single-question-fieldset">
                <legend className="registry-question-legend">Operational Evaluation</legend>
                <div className="registry-structured-question" key={currentQuestion.questionKey}>
                  {currentQuestion.contextStatement ? (
                    <p className="registry-structured-context-statement">{currentQuestion.contextStatement}</p>
                  ) : null}
                  <span className="registry-structured-question-text">{currentQuestion.question}</span>
                  <div className="registry-structured-options" role="radiogroup" aria-label={currentQuestion.question}>
                    {currentQuestion.options.map((option) => (
                      <label key={option.value} className="registry-structured-option">
                        <input
                          type="radio"
                          name={currentQuestion.questionKey}
                          value={option.value}
                          checked={evalAnswers[currentQuestion.questionKey]?.selected === option.value}
                          onChange={() => onSetEvalAnswerSelection(currentQuestion, option)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {showQuestionContext ? (
                    <label className="registry-structured-context">
                      <span>{currentQuestion.contextLabel}</span>
                      <textarea
                        value={evalAnswers[currentQuestion.questionKey]?.institutional_context ?? ""}
                        onChange={(event) => onSetEvalAnswerContext(currentQuestion, event.target.value)}
                      />
                    </label>
                  ) : null}
                </div>
              </fieldset>
            ) : (
              <p className="registry-media-absence">Evaluation questions are not seated in the runtime registry.</p>
            )}

            {evalError ? <p className="registry-form-error">{evalError}</p> : null}
            <div className="registry-diagnostic-passage-controls">
              {evalSectionIndex > 0 ? (
                <button type="button" onClick={onBackQuestion}>
                  Back
                </button>
              ) : null}
              {!finalDiagnosticQuestion && currentQuestion ? (
                <button type="button" disabled={!currentQuestionAnswered} onClick={() => onContinueQuestion(currentQuestion)}>
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={evalSubmitting || !currentQuestionAnswered}
                  onClick={(event) => onCompleteQuestionClick(event, currentQuestion)}
                >
                  {evalSubmitting ? "Resolving Assessment" : "Complete Evaluation"}
                </button>
              )}
              <button type="button" onClick={onTogglePassageMuted}>
                {passageMuted ? "Audio" : "Mute"}
              </button>
            </div>
          </form>
        )}
      </section>
      {renderSystemFooter?.()}
    </main>
  )
}
