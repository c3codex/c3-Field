import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { MeasuresAssessmentChamber } from "../../MeasuresAssessmentChamber"
import { asString } from "../registeredRuntimeUtils"
import type {
  AssessmentEmailArtifact,
  AssessmentMechanicOption,
  AssessmentMechanicQuestion,
  EnvironmentalStandingReport,
  StructuredEvalAnswer,
  SectionCopy,
} from "../registeredRuntimeUtils"
import type { EvalStep } from "../../measuresAssessmentTypes"

type Props = {
  encounterCopy: SectionCopy
  structuredQuestions: AssessmentMechanicQuestion[]
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
  lapisBackgroundUrl: string | null
  registryMarkUrl: string | null
  marbleAccentReferenceUrl: string | null
  registryWatermarkUrl: string | null
  registryTokenStyle: CSSProperties
  structuredEnvironmentPassageVideoUrl: string | null
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
  renderSystemFooter?: () => ReactNode
}

export default function RegisteredAssessment({
  encounterCopy,
  structuredQuestions,
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
  lapisBackgroundUrl,
  registryMarkUrl,
  marbleAccentReferenceUrl,
  registryWatermarkUrl,
  registryTokenStyle,
  structuredEnvironmentPassageVideoUrl,
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
  renderSystemFooter,
}: Props) {
  return (
    <MeasuresAssessmentChamber
      encounterKey="measures_ai_operational_evaluation"
      assessmentEyebrow={asString(encounterCopy.eyebrow) ?? undefined}
      assessmentProcessTitle={
        asString(encounterCopy.assessmentChamber?.title) ??
        asString(
          encounterCopy.encounterContract?.content_blocks &&
          (encounterCopy.encounterContract.content_blocks as Record<string, unknown>)?.process_title,
        ) ??
        asString(encounterCopy.title) ??
        undefined
      }
      assessmentSupportLine={
        asString(
          encounterCopy.encounterContract?.content_blocks &&
          (encounterCopy.encounterContract.content_blocks as Record<string, unknown>)?.support_line,
        ) ?? undefined
      }
      assessmentSubSupportLine={
        asString(
          encounterCopy.encounterContract?.content_blocks &&
          (encounterCopy.encounterContract.content_blocks as Record<string, unknown>)?.sub_support_line,
        ) ??
        asString(encounterCopy.subtitle) ??
        undefined
      }
      evalAnswers={evalAnswers}
      evalEmailArtifact={evalEmailArtifact}
      evalError={evalError}
      evalFields={evalFields}
      evalReport={evalReport}
      evalSectionIndex={evalSectionIndex}
      evalStep={evalStep}
      evalSubmitted={evalSubmitted}
      evalSubmitting={evalSubmitting}
      passageMuted={passageMuted}
      registryBackgroundUrl={lapisBackgroundUrl}
      registryMarkUrl={registryMarkUrl}
      marbleAccentReferenceUrl={marbleAccentReferenceUrl}
      registryWatermarkUrl={registryWatermarkUrl}
      registryTokenStyle={registryTokenStyle}
      assessmentCompletion={encounterCopy.assessmentCompletion}
      layoutContract={encounterCopy.layoutContract ?? undefined}
      srcIntakeContract={encounterCopy.srcIntakeContract ?? undefined}
      stylingContract={encounterCopy.stylingContract ?? undefined}
      resolutionText={encounterCopy.resolutionText ?? undefined}
      showQuestionContext={false}
      structuredEnvironmentPassageVideoUrl={structuredEnvironmentPassageVideoUrl}
      structuredQuestions={structuredQuestions}
      onBackQuestion={onBackQuestion}
      onCompleteQuestionClick={onCompleteQuestionClick}
      onContinueQuestion={onContinueQuestion}
      onContinueToDiagnostic={onContinueToDiagnostic}
      onEnterStructuredEnvironment={onEnterStructuredEnvironment}
      onSetEvalAnswerContext={onSetEvalAnswerContext}
      onSetEvalAnswerSelection={onSetEvalAnswerSelection}
      onSetEvalField={onSetEvalField}
      onSubmitEvaluation={onSubmitEvaluation}
      onStructuredEnvironmentVideoEnded={onStructuredEnvironmentVideoEnded}
      onTogglePassageMuted={onTogglePassageMuted}
      renderSystemFooter={renderSystemFooter}
    />
  )
}
