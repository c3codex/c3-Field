import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { useState } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import { PublicAssessmentSurface } from "../../PublicAssessmentSurface"
import type { EncounterMediaRow, EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"
import type {
  AssessmentConditionTrace,
  AssessmentEmailArtifact,
  AssessmentMechanicOption,
  AssessmentMechanicQuestion,
  EnvironmentalStandingReport,
  EvalStep,
  StructuredEvalAnswer,
} from "../../measuresAssessmentTypes"
import {
  allAssessmentMechanics,
  asRecord,
  asString,
  asStringArray,
  resolveEnvironmentalReportByScore,
  selectedConditionTraces,
} from "../../registered_runtime/registeredRuntimeUtils"

// Payload passed to Encounter Boundary for contact capture persistence.
// Encounter Boundary owns the DB write; chamber owns the form state and presentation.
export type AssessmentCapturePayload = {
  institutionName: string
  contactName: string
  contactEmail: string
  evaluationAnswers: Record<string, unknown>
  conditionTraces: AssessmentConditionTrace[]
  // Full form state — orchestrator uses for consent flags, role, website, etc.
  allFields: Record<string, string>
  emailArtifact: AssessmentEmailArtifact | null
  report: EnvironmentalStandingReport | null
}

export type ObsidianChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  // Optional until Encounter Boundary wires the callback. Omitting disables DB capture.
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

// --- Helpers ----------------------------------------------------------------

function mediaUrl(row: EncounterMediaRow | undefined): string | null {
  if (!row) return null
  const meta = asRecord(row.metadata)
  return resolveRuntimeMediaUrl({
    publicUrl: asString(meta?.public_url) ?? asString(meta?.exact_url_seated),
    bucketName: row.storage_bucket,
    storagePath: row.storage_path,
  })
}

function resolveNextSurface(encounter: RenderableEncounter): string | null {
  return asString(encounter.transitionNodes[encounter.surface]?.next_surface)
}

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function ObsidianChamberRenderer(props: ObsidianChamberProps) {
  const { encounter } = props
  const { surface } = encounter

  if (surface === "eval_passage" || surface === "structural_coherence_explainer" || surface === "obsidian_chamber_orientation_passage") {
    return <EvalPassage {...props} />
  }
  if (surface === "measures_assessment") {
    return <MeasuresAssessment {...props} />
  }
  if (surface === "obsidian_to_marble_passage_video") {
    return <ObsidianToMarblePassage {...props} />
  }

  // Renderer gap: surface is obsidian-assigned but presentation not yet seated
  return (
    <main
      className="measures-registry-runtime"
      data-surface={surface}
      data-material-family="obsidian"
      data-release-standing="renderer_gap"
      style={props.registryTokenStyle}
    >
      {props.renderHeader({ title: encounter.encounterDef?.display_title ?? "Measures Registry" })}
      <section className="registry-held-state" role="status">
        <span>Obsidian Chamber</span>
        <p>Presentation for obsidian surface <code>{surface}</code> is not yet seated.</p>
      </section>
      {props.renderSystemFooter()}
    </main>
  )
}

// --- eval_passage / structural_coherence_explainer --------------------------

function EvalPassage({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: ObsidianChamberProps) {
  const [muted, setMuted] = useState(true)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const unseeded = asString(meta?.status_note)?.includes("Seated without final public copy") ?? false
  const title = (unseeded ? null : encounter.encounterDef?.display_title)
    ?? "Before evaluation, recognize the environment."
  const videoUrl = mediaUrl(encounter.mediaByRole.get("explainer_video"))
  const next = resolveNextSurface(encounter)

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="obsidian"
      data-layout-contract="passage"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="registry-diagnostic-passage" aria-label={title}>
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={handleContinue}
            aria-label={title}
          />
        ) : null}
        <div className="registry-diagnostic-passage-controls">
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
          {videoUrl ? (
            <button type="button" onClick={() => setMuted((m) => !m)}>
              {muted ? "Audio" : "Mute"}
            </button>
          ) : null}
        </div>
        <div>
          <h1>{title}</h1>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- obsidian_to_marble_passage_video ---------------------------------------

function ObsidianToMarblePassage({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: ObsidianChamberProps) {
  const [muted, setMuted] = useState(true)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const title = encounter.encounterDef?.display_title ?? asString(meta?.title) ?? "Before the Pathway"
  const videoUrl = mediaUrl(encounter.mediaByRole.get("before_the_pathway_obsidian_to_marble_passage_video"))
  const next = resolveNextSurface(encounter)
  const transcriptLines = asStringArray(meta?.passage_transcript)
  const ctaLabel = asString(asRecord(meta?.cta)?.label) ?? "Begin Pathway Review"

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="obsidian_to_marble_passage_video"
      data-material-family="obsidian"
      data-layout-contract="passage"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader({ title: "Measures Registry" })}
      <section
        className="registry-held-state registry-assessment-contract-held registry-pathway-passage"
        aria-label={title}
      >
        <span>Pathway review passage</span>
        <h2>{title}</h2>
        {videoUrl ? (
          <div className="registry-pathway-passage-video-frame">
            <video
              className="registry-pathway-passage-video"
              src={videoUrl}
              autoPlay
              muted={muted}
              playsInline
              preload="auto"
              aria-label="Before the Pathway"
              onEnded={handleContinue}
            />
          </div>
        ) : (
          <p className="registry-media-absence">Pathway passage video is not seated.</p>
        )}
        {transcriptLines.length > 0 ? (
          <div className="registry-report-group">
            {transcriptLines.slice(-2).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        ) : null}
        <div className="registry-diagnostic-passage-controls registry-report-controls">
          <button type="button" onClick={handleContinue}>
            {ctaLabel}
          </button>
          <button type="button" onClick={() => setMuted((m) => !m)}>
            {muted ? "Audio" : "Mute"}
          </button>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- measures_assessment ----------------------------------------------------

function MeasuresAssessment({
  encounter,
  registryTokenStyle,
  onNavigate,
  onCaptureAssessment,
  renderHeader,
  renderSystemFooter,
}: ObsidianChamberProps) {
  const [evalStep, setEvalStep] = useState<EvalStep>("src_capture")
  const [evalFields, setEvalFields] = useState<Record<string, string>>({})
  const [evalAnswers, setEvalAnswers] = useState<Record<string, StructuredEvalAnswer>>({})
  const [evalError, setEvalError] = useState<string | null>(null)
  const [evalSubmitting, setEvalSubmitting] = useState(false)
  const [evalSubmitted, setEvalSubmitted] = useState(false)
  const [evalSectionIndex, setEvalSectionIndex] = useState(0)
  const [evalReport, setEvalReport] = useState<EnvironmentalStandingReport | null>(null)
  const [evalEmailArtifact, setEvalEmailArtifact] = useState<AssessmentEmailArtifact | null>(null)
  const [passageMuted, setPassageMuted] = useState(true)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const mechanics = allAssessmentMechanics(meta?.assessment_mechanics)
  const traces: AssessmentConditionTrace[] = selectedConditionTraces(mechanics, evalAnswers)
  const next = resolveNextSurface(encounter)

  const obsidianContactVisualUrl = mediaUrl(encounter.mediaByRole.get("obsidian_contact_surface_visual"))
  const obsidianAssessmentVisualUrl = mediaUrl(encounter.mediaByRole.get("obsidian_assessment_surface_visual"))
  const obsidianEvalResultVisualUrl = mediaUrl(encounter.mediaByRole.get("obsidian_eval_result_surface_visual"))
  const marbleAccentReferenceUrl = mediaUrl(encounter.mediaByRole.get("right_measured_hero"))
  const registryMarkUrl = mediaUrl(encounter.mediaByRole.get("registry_mark"))
  const registryWatermarkUrl = mediaUrl(encounter.mediaByRole.get("registry_watermark"))
  const registryBackgroundUrl = mediaUrl(encounter.mediaByRole.get("lapis_background"))
  const structuredEnvironmentPassageVideoUrl = mediaUrl(
    encounter.mediaByRole.get("structured_environment_passage_video"),
  )

  function handleContinueToDiagnostic() {
    const required = ["institution_name", "contact_name", "contact_email"]
    const missing = required.filter((f) => !evalFields[f]?.trim())
    if (missing.length > 0) {
      setEvalError(`Required fields: ${missing.join(", ")}`)
      return
    }
    setEvalError(null)
    setEvalStep("diagnostic")
    setEvalSectionIndex(0)
  }

  function handleContinueQuestion(currentQuestion: AssessmentMechanicQuestion) {
    if (!evalAnswers[currentQuestion.questionKey]?.selected) {
      setEvalError("Select an answer before continuing.")
      return
    }
    if (evalSectionIndex < mechanics.length - 1) {
      setEvalSectionIndex((i) => i + 1)
      setEvalError(null)
    } else {
      const resolved = resolveEnvironmentalReportByScore(mechanics, traces, meta?.assessment_interpretation)
      if (resolved) {
        setEvalReport(resolved.report)
        setEvalEmailArtifact(resolved.emailArtifact)
      }
      setEvalStep("contact_capture")
      setEvalError(null)
    }
  }

  function handleCompleteQuestionClick(
    event: MouseEvent<HTMLButtonElement>,
    currentQuestion: AssessmentMechanicQuestion | null,
  ) {
    if (currentQuestion && evalAnswers[currentQuestion.questionKey]?.selected) return
    event.preventDefault()
  }

  async function handleSubmitEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (evalSubmitting) return
    setEvalSubmitting(true)
    setEvalError(null)

    if (onCaptureAssessment) {
      const payload: AssessmentCapturePayload = {
        institutionName: evalFields.institution_name?.trim() ?? "",
        contactName: evalFields.contact_name?.trim() ?? "",
        contactEmail: evalFields.contact_email?.trim() ?? "",
        evaluationAnswers: Object.fromEntries(
          Object.entries(evalAnswers).filter(([, a]) => a.selected),
        ),
        conditionTraces: traces,
        allFields: evalFields,
        emailArtifact: evalEmailArtifact,
        report: evalReport,
      }
      const { error } = await onCaptureAssessment(payload)
      setEvalSubmitting(false)
      if (error) {
        setEvalError(error)
        return
      }
    } else {
      setEvalSubmitting(false)
    }

    setEvalSubmitted(true)
  }

  function handleEnterStructuredEnvironment() {
    const structureNext =
      asString(encounter.transitionNodes["measures_structured_environments"]?.next_surface) ??
      "structure_passage"
    onNavigate(structureNext as EncounterSurface)
  }

  function handleStructuredEnvironmentVideoEnded() {
    onNavigate("structure_passage" as EncounterSurface)
  }

  const questionContractReady = mechanics.length > 0

  return (
    <PublicAssessmentSurface
      encounterKey={encounter.registryKey}
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
      marbleAccentReferenceUrl={marbleAccentReferenceUrl}
      obsidianContactVisualUrl={obsidianContactVisualUrl}
      obsidianAssessmentVisualUrl={obsidianAssessmentVisualUrl}
      obsidianEvalResultVisualUrl={obsidianEvalResultVisualUrl}
      registryBackgroundUrl={registryBackgroundUrl}
      registryMarkUrl={registryMarkUrl}
      registryWatermarkUrl={registryWatermarkUrl}
      registryTokenStyle={registryTokenStyle}
      structuredEnvironmentPassageVideoUrl={structuredEnvironmentPassageVideoUrl}
      structuredQuestions={mechanics}
      questionContractStanding={
        !questionContractReady
          ? {
              ready: false,
              expectedQuestionCount: 7,
              actualQuestionCount: mechanics.length,
              displayTitle: "Assessment mechanics are not seated.",
              displayBody:
                "The assessment question body requires mechanics seated in encounter definition metadata.",
              allowedNextStep:
                "Seat assessment_mechanics in the measures_assessment encounter definition.",
            }
          : undefined
      }
      assessmentCompletion={asRecord(meta?.assessment_completion)}
      assessmentContactCaptureContract={asRecord(meta?.assessment_contact_capture_contract)}
      assessmentEvaluationReportContract={asRecord(meta?.assessment_evaluation_report_contract)}
      renderSystemFooter={renderSystemFooter}
      onBackQuestion={() => setEvalSectionIndex((i) => Math.max(0, i - 1))}
      onBeginPathwayReview={() => {
        if (next) onNavigate(next as EncounterSurface)
      }}
      onCompleteQuestionClick={handleCompleteQuestionClick}
      onContinueQuestion={handleContinueQuestion}
      onContinueToDiagnostic={handleContinueToDiagnostic}
      onEnterStructuredEnvironment={handleEnterStructuredEnvironment}
      onSetEvalAnswerContext={(question, value) => {
        setEvalAnswers((current) => ({
          ...current,
          [question.questionKey]: {
            selected: current[question.questionKey]?.selected ?? "",
            label: current[question.questionKey]?.label ?? "",
            institutional_context: value,
          },
        }))
      }}
      onSetEvalAnswerSelection={(question, option) => {
        setEvalAnswers((current) => ({
          ...current,
          [question.questionKey]: {
            selected: option.value,
            label: option.label,
            institutional_context: current[question.questionKey]?.institutional_context ?? "",
          },
        }))
        setEvalError(null)
      }}
      onSetEvalField={(key, value) => {
        setEvalFields((current) => ({ ...current, [key]: value }))
        setEvalError(null)
      }}
      onSubmitEvaluation={handleSubmitEvaluation}
      onStructuredEnvironmentVideoEnded={handleStructuredEnvironmentVideoEnded}
      onTogglePassageMuted={() => setPassageMuted((m) => !m)}
    />
  )
}
