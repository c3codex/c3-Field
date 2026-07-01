import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { PublicAssessmentResult } from "./PublicAssessmentResult"
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

type PublicAssessmentSurfaceProps = {
  encounterKey: string
  styleProfile?: string | null
  directoryKey?: string | null
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
  questionContractStanding?: {
    ready: boolean
    expectedQuestionCount: number
    actualQuestionCount: number
    displayTitle: string
    displayBody: string
    allowedNextStep: string
  }
  passageMuted: boolean
  publicResultBoundary?: {
    pathwayLabels: string[]
    recommendationCopy?: string | null
    heldCopy?: string | null
  } | null
  assessmentCompletion?: Record<string, unknown> | null
  assessmentContactCaptureContract?: Record<string, unknown> | null
  assessmentEvaluationReportContract?: Record<string, unknown> | null
  marbleAccentReferenceUrl: string | null
  obsidianContactVisualUrl?: string | null
  obsidianAssessmentVisualUrl?: string | null
  obsidianEvalResultVisualUrl?: string | null
  registryBackgroundUrl: string | null
  registryMarkUrl: string | null
  registryWatermarkUrl: string | null
  registryTokenStyle: CSSProperties
  layoutContract?: Record<string, unknown>
  stylingContract?: Record<string, unknown>
  resolutionText?: string
  governedStatus?: ReactNode
  renderSystemFooter?: () => ReactNode
  showQuestionContext?: boolean
  structuredEnvironmentPassageVideoUrl: string | null
  structuredQuestions: AssessmentMechanicQuestion[]
  onBackQuestion: () => void
  onBeginPathwayReview: () => void
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

export function PublicAssessmentSurface({
  encounterKey,
  styleProfile,
  directoryKey,
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
  questionContractStanding,
  passageMuted,
  publicResultBoundary,
  assessmentCompletion,
  assessmentContactCaptureContract,
  assessmentEvaluationReportContract,
  marbleAccentReferenceUrl,
  obsidianContactVisualUrl,
  obsidianAssessmentVisualUrl,
  obsidianEvalResultVisualUrl,
  registryBackgroundUrl,
  registryMarkUrl,
  registryTokenStyle,
  layoutContract,
  stylingContract,
  resolutionText,
  governedStatus,
  renderSystemFooter,
  showQuestionContext = true,
  structuredEnvironmentPassageVideoUrl,
  structuredQuestions,
  onBackQuestion,
  onBeginPathwayReview,
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
}: PublicAssessmentSurfaceProps) {
  const currentQuestion = structuredQuestions[evalSectionIndex] ?? null
  const questionContractHeld = questionContractStanding && !questionContractStanding.ready
  const finalDiagnosticQuestion = evalSectionIndex >= Math.max(structuredQuestions.length - 1, 0)
  const currentQuestionAnswered = Boolean(currentQuestion && evalAnswers[currentQuestion.questionKey]?.selected)
  const progressLabel =
    !questionContractHeld && structuredQuestions.length > 0
      ? `${evalSectionIndex + 1} of ${structuredQuestions.length}`
      : null
  const progressValue =
    !questionContractHeld && structuredQuestions.length > 0
      ? ((evalSectionIndex + 1) / structuredQuestions.length) * 100
      : 0
  const layoutViewportFit =
    typeof layoutContract?.viewport_fit === "string" ? layoutContract.viewport_fit : "standard"
  const layoutCopyDensity =
    typeof layoutContract?.copy_density === "string" ? layoutContract.copy_density : "standard"
  const materialFamily =
    typeof stylingContract?.material_family === "string"
      ? stylingContract.material_family
      : typeof stylingContract?.foundation_material === "string"
      ? stylingContract.foundation_material
        : "obsidian"
  const layoutContractName = evalSubmitted
    ? "result_gate"
    : evalStep === "contact_capture"
    ? "contact_contract"
    : "assessment"
  const headingEyebrow =
    assessmentEyebrow && assessmentEyebrow.trim().toLowerCase() !== "measures registry"
      ? assessmentEyebrow
      : null
  const chamberStyle = {
    ...registryTokenStyle,
    ...(registryBackgroundUrl ? { "--registry-assessment-background-image": `url("${registryBackgroundUrl}")` } : {}),
    ...(marbleAccentReferenceUrl ? { "--registry-marble-accent-image": `url("${marbleAccentReferenceUrl}")` } : {}),
    ...(obsidianContactVisualUrl ? { "--registry-obsidian-contact-visual": `url("${obsidianContactVisualUrl}")` } : {}),
    ...(obsidianAssessmentVisualUrl ? { "--registry-obsidian-assessment-visual": `url("${obsidianAssessmentVisualUrl}")` } : {}),
    ...(obsidianEvalResultVisualUrl ? { "--registry-obsidian-eval-result-visual": `url("${obsidianEvalResultVisualUrl}")` } : {}),
  } as CSSProperties
  const asRecord = (value: unknown): Record<string, unknown> | null =>
    value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null
  const asString = (value: unknown): string | null => typeof value === "string" ? value : null
  const asBoolean = (value: unknown): boolean => value === true
  const asFormFields = (value: unknown) =>
    Array.isArray(value)
      ? value.filter((field): field is Record<string, unknown> => Boolean(asRecord(field)))
      : []
  const contactForm = asRecord(assessmentContactCaptureContract?.post_assessment_contact_form)
  const consentFields = asFormFields(assessmentContactCaptureContract?.consent_fields)
  const optionalOptInFields = asFormFields(assessmentContactCaptureContract?.optional_opt_in_fields)
  const contactFields = [
    ...asFormFields(contactForm?.fields),
    ...consentFields,
    ...optionalOptInFields,
  ]
  const resultWithheldCopy =
    asString(assessmentContactCaptureContract?.result_withheld_transition_copy) ??
    "Your assessment evaluation is ready. Enter your information to receive the evaluation and recommended actions."
  const contactHelperCopy =
    asString(assessmentContactCaptureContract?.public_helper_copy) ??
    asString(contactForm?.public_helper_copy) ??
    "Enter your information to receive the assessment evaluation and recommended actions."
  const assessmentSubmissionNotice = asString(assessmentContactCaptureContract?.assessment_submission_notice)
  const privacyNotice = asString(assessmentContactCaptureContract?.privacy_notice)
  const termsNotice = asString(assessmentContactCaptureContract?.terms_notice)
  const renderContactField = (field: Record<string, unknown>) => {
    const key = asString(field.field_key)
    const label = asString(field.public_label)
    if (!key || !label) return null
    const type = asString(field.type) ?? "text"
    const required = asBoolean(field.required)
    const value = evalFields[key] ?? ""
    if (type === "checkbox") {
      return (
        <label key={key} className="registry-consent-field">
          <input
            type="checkbox"
            checked={value === "true"}
            required={required}
            onChange={(event) => onSetEvalField(key, event.target.checked ? "true" : "")}
          />
          <span>{label}</span>
        </label>
      )
    }
    if (type === "textarea") {
      return (
        <label key={key}>
          <span>{label}</span>
          <textarea
            value={value}
            required={required}
            onChange={(event) => onSetEvalField(key, event.target.value)}
          />
        </label>
      )
    }
    if (type === "select" || type === "text_or_select") {
      const options = Array.isArray(field.options)
        ? field.options.filter((option): option is string => typeof option === "string")
        : []
      if (type === "text_or_select" && options.length === 0) {
        return (
          <label key={key}>
            <span>{label}</span>
            <input
              type="text"
              value={value}
              required={required}
              onChange={(event) => onSetEvalField(key, event.target.value)}
            />
          </label>
        )
      }
      return (
        <label key={key}>
          <span>{label}</span>
          <select
            value={value}
            required={required}
            onChange={(event) => onSetEvalField(key, event.target.value)}
          >
            <option value="">Select</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      )
    }
    return (
      <label key={key}>
        <span>{label}</span>
        <input
          type={type === "email" ? "email" : "text"}
          inputMode={type === "url" ? "url" : undefined}
          value={value}
          required={required}
          onChange={(event) => onSetEvalField(key, event.target.value)}
        />
      </label>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounterKey}
      data-chamber-state={evalStep}
      data-copy-density={layoutCopyDensity}
      data-layout-contract={layoutContractName}
      data-layout-fit={layoutViewportFit}
      data-material-family={materialFamily}
      data-release-standing="public_contact_gated"
      data-style-profile={styleProfile ?? undefined}
      data-directory-key={directoryKey ?? undefined}
      style={chamberStyle}
    >
      <header className="registry-public-header">
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
          <span>Measures Registry</span>
        </div>
      </header>
      <section className="registry-iis-eval registry-assessment-chamber" aria-label={assessmentProcessTitle}>
        {!registryMarkUrl ? (
          <p className="registry-media-absence">
            Measures Registry mark is not seated in the runtime registry.
          </p>
        ) : null}
        <div className="registry-chamber-heading">
          {headingEyebrow ? <span>{headingEyebrow}</span> : null}
          <h1>{assessmentProcessTitle}</h1>
          <p>{assessmentSubSupportLine}</p>
        </div>
        {governedStatus}

        {questionContractHeld ? (
          <div className="registry-held-state registry-assessment-contract-held" role="status" aria-live="polite">
            <span>Runtime registry held state</span>
            <h2>{questionContractStanding.displayTitle}</h2>
            <p>{questionContractStanding.displayBody}</p>
            <p>
              Expected {questionContractStanding.expectedQuestionCount} seated questions; found{" "}
              {questionContractStanding.actualQuestionCount}.
            </p>
            <p>{questionContractStanding.allowedNextStep}</p>
          </div>
        ) : evalSubmitted ? (
          <PublicAssessmentResult
            assessmentCompletion={assessmentCompletion}
            emailArtifact={evalEmailArtifact}
            passageMuted={passageMuted}
            publicResultBoundary={publicResultBoundary}
            report={evalReport}
            reportContract={assessmentEvaluationReportContract}
            reportFields={evalFields}
            resolutionText={resolutionText}
            structuredEnvironmentPassageVideoUrl={structuredEnvironmentPassageVideoUrl}
            onBeginPathwayReview={onBeginPathwayReview}
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
        ) : evalStep === "contact_capture" ? (
          <form className="registry-iis-eval-form registry-contact-capture" onSubmit={onSubmitEvaluation}>
            <div className="registry-chamber-copy">
              <span>Assessment evaluation ready</span>
              <h2>{resultWithheldCopy}</h2>
              <p className="registry-assessment-support">{contactHelperCopy}</p>
            </div>
            <p className="registry-contact-standing-note">
              {asString(assessmentContactCaptureContract?.standing_boundary_note) ??
               asString(contactForm?.standing_boundary_note) ??
               "This assessment does not create approval, enrollment, implementation, or verified registry status. It provides an operational evaluation and a recommended next step."}
            </p>
            {assessmentSubmissionNotice ? (
              <p className="registry-consent-submission-notice">{assessmentSubmissionNotice}</p>
            ) : null}
            <fieldset>
              <legend>Contact and Consent</legend>
              {contactFields.length > 0 ? (
                contactFields.map(renderContactField)
              ) : (
                <p className="registry-media-absence">Contact capture contract is not seated.</p>
              )}
            </fieldset>
            {(privacyNotice || termsNotice) ? (
              <div className="registry-consent-legal-notices">
                {privacyNotice ? <p>{privacyNotice}</p> : null}
                {termsNotice ? <p>{termsNotice}</p> : null}
              </div>
            ) : null}
            {evalError ? <p className="registry-form-error">{evalError}</p> : null}
            <div className="registry-diagnostic-passage-controls">
              <button type="submit" disabled={evalSubmitting || contactFields.length === 0}>
                {evalSubmitting ? "Submitting" : "Receive Evaluation"}
              </button>
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
              {currentQuestion ? (
                <button
                  type="button"
                  disabled={!currentQuestionAnswered}
                  onClick={() => onContinueQuestion(currentQuestion)}
                >
                  Continue
                </button>
              ) : null}
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
