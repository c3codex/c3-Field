import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { PublicAssessmentSurface } from "../../PublicAssessmentSurface"
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
import RegisteredGovernedStatus from "./RegisteredGovernedStatus"

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
  lapisBackgroundUrl: string | null
  registryMarkUrl: string | null
  marbleAccentReferenceUrl: string | null
  obsidianContactVisualUrl?: string | null
  obsidianAssessmentVisualUrl?: string | null
  obsidianEvalResultVisualUrl?: string | null
  registryWatermarkUrl: string | null
  registryTokenStyle: CSSProperties
  structuredEnvironmentPassageVideoUrl: string | null
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
  renderSystemFooter?: () => ReactNode
}

export default function RegisteredPublicAssessment({
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
  questionContractStanding,
  passageMuted,
  publicResultBoundary,
  registryMarkUrl,
  marbleAccentReferenceUrl,
  obsidianContactVisualUrl,
  obsidianAssessmentVisualUrl,
  obsidianEvalResultVisualUrl,
  registryTokenStyle,
  structuredEnvironmentPassageVideoUrl,
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
  renderSystemFooter,
}: Props) {
  return (
    <PublicAssessmentSurface
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
      questionContractStanding={questionContractStanding}
      passageMuted={passageMuted}
      publicResultBoundary={publicResultBoundary}
      registryBackgroundUrl={null}
      registryMarkUrl={registryMarkUrl}
      marbleAccentReferenceUrl={marbleAccentReferenceUrl}
      obsidianContactVisualUrl={obsidianContactVisualUrl}
      obsidianAssessmentVisualUrl={obsidianAssessmentVisualUrl}
      obsidianEvalResultVisualUrl={obsidianEvalResultVisualUrl}
      registryWatermarkUrl={null}
      registryTokenStyle={registryTokenStyle}
      assessmentCompletion={encounterCopy.assessmentCompletion}
      assessmentContactCaptureContract={encounterCopy.assessmentContactCaptureBindingContract}
      assessmentEvaluationReportContract={encounterCopy.assessmentEvaluationReportContract}
      layoutContract={encounterCopy.layoutContract ?? undefined}
      srcIntakeContract={encounterCopy.srcIntakeContract ?? undefined}
      stylingContract={encounterCopy.stylingContract ?? undefined}
      resolutionText={encounterCopy.resolutionText ?? undefined}
      governedStatus={<RegisteredGovernedStatus status={encounterCopy.governedStatus} />}
      showQuestionContext={false}
      structuredEnvironmentPassageVideoUrl={structuredEnvironmentPassageVideoUrl}
      structuredQuestions={structuredQuestions}
      onBackQuestion={onBackQuestion}
      onBeginPathwayReview={onBeginPathwayReview}
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
