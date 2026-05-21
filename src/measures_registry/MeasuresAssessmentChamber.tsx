import type { CSSProperties, FormEvent, MouseEvent } from "react"
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
  registryMarkUrl: string | null
  registryTokenStyle: CSSProperties
  resolutionText?: string
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
  registryMarkUrl,
  registryTokenStyle,
  resolutionText,
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
  const progressLabel = structuredQuestions.length > 0 ? `${evalSectionIndex + 1} of ${structuredQuestions.length}` : null
  const progressValue = structuredQuestions.length > 0 ? ((evalSectionIndex + 1) / structuredQuestions.length) * 100 : 0

  return (
    <main className="measures-registry-runtime" data-surface="iis_eval_gate1" data-chamber-state={evalStep} style={registryTokenStyle}>
      <section className="registry-iis-eval registry-assessment-chamber" aria-label={ASSESSMENT_PROCESS_TITLE}>
        <MeasuresAssessmentBrandLayer registryMarkUrl={registryMarkUrl} />
        <div className="registry-chamber-heading">
          <span>Measures Registry</span>
          <h1>{ASSESSMENT_PROCESS_TITLE}</h1>
          <p>{`${ASSESSMENT_SUPPORT_LINE} ${ASSESSMENT_SUB_SUPPORT_LINE}`}</p>
        </div>

        {evalSubmitted ? (
          <MeasuresAssessmentResult
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
            <p className="registry-assessment-support">{ASSESSMENT_SUPPORT_LINE}</p>
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
              <p className="registry-assessment-support">{ASSESSMENT_SUB_SUPPORT_LINE}</p>
            </div>
            <fieldset>
              <legend>Institutional Contact</legend>
              {[
                ["institution_name", "Company / Organization Name", "text"],
                ["organization_type", "Type of Business / Organization", "text"],
                ["contact_name", "Contact Name", "text"],
                ["contact_email", "Email", "email"],
              ].map(([key, label, type]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type={type}
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
            <div className="registry-chamber-copy">
              <h2>{ASSESSMENT_SUPPORT_LINE}</h2>
              <p className="registry-assessment-support">{ASSESSMENT_SUB_SUPPORT_LINE}</p>
              {progressLabel ? (
                <div className="registry-question-progress" aria-label={`Evaluation progress ${progressLabel}`}>
                  <span>{progressLabel}</span>
                  <div aria-hidden="true">
                    <i style={{ width: `${progressValue}%` }} />
                  </div>
                </div>
              ) : null}
            </div>

            {currentQuestion ? (
              <fieldset className="registry-single-question-fieldset">
                <legend className="registry-question-legend">Operational Evaluation</legend>
                <div className="registry-structured-question" key={currentQuestion.questionKey}>
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
                  <label className="registry-structured-context">
                    <span>{currentQuestion.contextLabel}</span>
                    <textarea
                      value={evalAnswers[currentQuestion.questionKey]?.institutional_context ?? ""}
                      onChange={(event) => onSetEvalAnswerContext(currentQuestion, event.target.value)}
                    />
                  </label>
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
                <button type="button" onClick={() => onContinueQuestion(currentQuestion)}>
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={evalSubmitting}
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
    </main>
  )
}
