import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from "react"
import { useRef, useState } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import { PublicAssessmentResult } from "../../PublicAssessmentResult"
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
} from "../shared/encounterRendererUtils"

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

function surfaceBgStyle(url: string | null): CSSProperties {
  if (!url) return {}
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }
}

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function ObsidianChamberRenderer(props: ObsidianChamberProps) {
  const { encounter } = props
  const { surface } = encounter

  if (surface === "obsidian_chamber_orientation") {
    return <ObsidianOrientationThreshold {...props} />
  }
  if (surface === "obsidian_chamber_encounter_surface") {
    return <MeasuresAssessment {...props} />
  }
  if (surface === "obsidian_chamber_C1_compact") {
    return <ObsidianC1Compact {...props} />
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

// --- obsidian_chamber_orientation -------------------------------------------
// Assessment orientation surface. Shows obsidian video + content profile copy + Begin Assessment CTA.
// Media role: "obsidian". No passage. No L/R split. Single CTA → assessment surface.

function ObsidianOrientationThreshold({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: ObsidianChamberProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoAudioEnabled, setVideoAudioEnabled] = useState(false)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const contentProfile = asRecord(meta?.content_profile)
  const title = asString(contentProfile?.title) ?? encounter.encounterDef?.display_title ?? "Before You Begin"
  // Lead: prefer new `lead` field, fall back to legacy subtitle/body
  const lead = asString(contentProfile?.lead) ?? asString(contentProfile?.subtitle) ?? asString(contentProfile?.body)
  const reviewSections = Array.isArray(contentProfile?.review_sections)
    ? (contentProfile.review_sections as unknown[]).filter((s): s is Record<string, unknown> => Boolean(asRecord(s)))
    : []
  const assessmentDetails = Array.isArray(contentProfile?.assessment_details)
    ? (contentProfile.assessment_details as unknown[]).filter((d): d is string => typeof d === "string")
    : []
  const privacyNote = asString(contentProfile?.privacy_note)
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Begin Assessment"
  const next = resolveNextSurface(encounter)

  const videoUrl = mediaUrl(encounter.mediaByRole.get("obsidian"))
  const bgUrl = mediaUrl(encounter.mediaByRole.get("obsidian_orientation_surface"))

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  function handleVideoAudio() {
    const video = videoRef.current
    if (!video) return
    if (!videoAudioEnabled) {
      video.muted = false
      video.volume = 1
      void video.play().catch(() => {
        video.muted = true
        setVideoAudioEnabled(false)
      })
      setVideoAudioEnabled(true)
    } else {
      video.muted = true
      setVideoAudioEnabled(false)
    }
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="obsidian"
      data-layout-contract="obsidian_orientation"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(meta?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...surfaceBgStyle(bgUrl) }}
    >
      {renderHeader({ title })}
      <section className="registry-obsidian-orientation" aria-label={title}>
        <div className="registry-obsidian-orientation-media">
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              playsInline
              preload="auto"
              aria-label={title}
            />
          ) : (
            <div className="registry-obsidian-orientation-media-absent" role="presentation" />
          )}
        </div>
        <div className="registry-obsidian-orientation-content">
          <div className="registry-obsidian-orientation-copy">
            <h2 className="registry-obsidian-orientation-title">{title}</h2>
            {lead ? <p className="registry-obsidian-orientation-lead">{lead}</p> : null}
            {reviewSections.length > 0 ? (
              <div className="registry-obsidian-orientation-sections">
                {reviewSections.map((section, si) => {
                  const heading = asString(section.heading)
                  const items = Array.isArray(section.items)
                    ? (section.items as unknown[]).filter((it): it is Record<string, unknown> => Boolean(asRecord(it)))
                    : []
                  return (
                    <div key={si} className="registry-obsidian-orientation-section">
                      {heading ? (
                        <h3 className="registry-obsidian-orientation-section-heading">{heading}</h3>
                      ) : null}
                      {items.length > 0 ? (
                        <ul className="registry-obsidian-orientation-items">
                          {items.map((item, ii) => (
                            <li key={ii} className="registry-obsidian-orientation-item">
                              {asString(item.label) ? (
                                <span className="registry-obsidian-orientation-item-label">
                                  {asString(item.label)}
                                </span>
                              ) : null}
                              {asString(item.copy) ? (
                                <p className="registry-obsidian-orientation-item-copy">
                                  {asString(item.copy)}
                                </p>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
            {assessmentDetails.length > 0 ? (
              <ul className="registry-obsidian-orientation-details">
                {assessmentDetails.map((detail, i) => (
                  <li key={i} className="registry-obsidian-orientation-detail">{detail}</li>
                ))}
              </ul>
            ) : null}
            {privacyNote ? (
              <p className="registry-obsidian-orientation-privacy">{privacyNote}</p>
            ) : null}
          </div>
          <div className="registry-obsidian-orientation-controls">
            <button
              type="button"
              className="registry-obsidian-orientation-cta"
              onClick={handleContinue}
            >
              {ctaLabel}
            </button>
            {videoUrl ? (
              <button
                type="button"
                className="registry-obsidian-orientation-audio"
                onClick={handleVideoAudio}
              >
                {videoAudioEnabled ? "Video Audio On" : "Enable Video Audio"}
              </button>
            ) : null}
          </div>
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
  const [evalSectionIndex, setEvalSectionIndex] = useState(0)
  const [evalReport, setEvalReport] = useState<EnvironmentalStandingReport | null>(null)
  const [evalEmailArtifact, setEvalEmailArtifact] = useState<AssessmentEmailArtifact | null>(null)
  const [passageMuted, setPassageMuted] = useState(true)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const styleProfile = asString(encounter.surfaceAssignmentMetadata?.style_profile)
  const directoryKey = asString(meta?.directory_key)
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
      const finalReport = resolved?.report ?? null
      const finalEmailArtifact = resolved?.emailArtifact ?? null
      try {
        sessionStorage.setItem("__mreg_c1_pending", JSON.stringify({
          evaluationAnswers: Object.fromEntries(
            Object.entries(evalAnswers).filter(([, a]) => a.selected),
          ),
          conditionTraces: traces,
          evalReport: finalReport,
          evalEmailArtifact: finalEmailArtifact,
          evalFields,
          assessmentContactCaptureContract: asRecord(meta?.assessment_contact_capture_oar1_binding_contract_v1),
          assessmentEvaluationReportContract: asRecord(meta?.assessment_evaluation_report_contract_v1),
          assessmentCompletion: asRecord(meta?.assessment_completion),
        }))
      } catch { /* ignore */ }
      setEvalError(null)
      onNavigate("obsidian_chamber_C1_compact")
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

    // Store report for passage and MAP session (report read after passage, standing_key + email read by MAP).
    try {
      sessionStorage.setItem("__mreg_pending_report", JSON.stringify({
        report: evalReport,
        emailArtifact: evalEmailArtifact,
        fields: evalFields,
        assessmentCompletion: asRecord(meta?.assessment_completion),
        reportContract: asRecord(meta?.assessment_evaluation_report_contract_v1),
      }))
    } catch { /* ignore */ }

    if (next) onNavigate(next as EncounterSurface)
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
      styleProfile={styleProfile}
      directoryKey={directoryKey}
      evalAnswers={evalAnswers}
      evalEmailArtifact={evalEmailArtifact}
      evalError={evalError}
      evalFields={evalFields}
      evalReport={evalReport}
      evalSectionIndex={evalSectionIndex}
      evalStep={evalStep}
      evalSubmitted={false}
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
      assessmentContactCaptureContract={asRecord(meta?.assessment_contact_capture_oar1_binding_contract_v1)}
      assessmentEvaluationReportContract={asRecord(meta?.assessment_evaluation_report_contract_v1)}
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

// --- obsidian_chamber_C1_compact --------------------------------------------
// Contact/consent capture surface. Receives eval state from sessionStorage
// (__mreg_c1_pending) written by MeasuresAssessment on question completion.
// Calls onCaptureAssessment, writes __mreg_pending_report, navigates to marble_chamber_orientation.

type C1Pending = {
  evaluationAnswers: Record<string, unknown>
  conditionTraces: AssessmentConditionTrace[]
  evalReport: EnvironmentalStandingReport | null
  evalEmailArtifact: AssessmentEmailArtifact | null
  evalFields: Record<string, string>
  assessmentContactCaptureContract: Record<string, unknown> | null
  assessmentEvaluationReportContract: Record<string, unknown> | null
  assessmentCompletion: Record<string, unknown> | null
}

function ObsidianC1Compact({
  encounter,
  registryTokenStyle,
  onNavigate,
  onCaptureAssessment,
  renderHeader,
  renderSystemFooter,
}: ObsidianChamberProps) {
  const [pending] = useState<C1Pending | null>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_c1_pending")
      return raw ? (JSON.parse(raw) as C1Pending) : null
    } catch { return null }
  })

  const [fields, setFields] = useState<Record<string, string>>(pending?.evalFields ?? {})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = resolveNextSurface(encounter)
  const contract = pending?.assessmentContactCaptureContract ?? null
  const contactForm = asRecord(contract?.post_assessment_contact_form)
  const consentFields = Array.isArray(contract?.consent_fields)
    ? (contract.consent_fields as unknown[]).filter((f): f is Record<string, unknown> => Boolean(asRecord(f)))
    : []
  const optionalFields = Array.isArray(contract?.optional_opt_in_fields)
    ? (contract.optional_opt_in_fields as unknown[]).filter((f): f is Record<string, unknown> => Boolean(asRecord(f)))
    : []
  const formFields = [
    ...(Array.isArray(contactForm?.fields)
      ? (contactForm.fields as unknown[]).filter((f): f is Record<string, unknown> => Boolean(asRecord(f)))
      : []),
    ...consentFields,
    ...optionalFields,
  ]

  const resultWithheldCopy =
    asString(contract?.result_withheld_transition_copy) ??
    "Your assessment evaluation is ready. Enter your information to receive the evaluation and recommended actions."
  const contactHelperCopy =
    asString(contract?.public_helper_copy) ??
    asString(contactForm?.public_helper_copy) ??
    "Enter your contact information to receive your assessment evaluation."
  const privacyNotice = asString(contract?.privacy_notice)
  const termsNotice = asString(contract?.terms_notice)
  const submissionNotice = asString(contract?.assessment_submission_notice)
  const standingBoundaryNote =
    asString(contract?.standing_boundary_note) ??
    asString(contactForm?.standing_boundary_note) ??
    "This assessment does not create approval, enrollment, implementation, or verified registry status."

  function renderField(field: Record<string, unknown>) {
    const key = asString(field.field_key)
    const label = asString(field.public_label)
    if (!key || !label) return null
    const type = asString(field.type) ?? "text"
    const required = field.required === true
    const value = fields[key] ?? ""
    if (type === "checkbox") {
      return (
        <label key={key} className="registry-consent-field">
          <input
            type="checkbox"
            checked={value === "true"}
            required={required}
            onChange={(e) => {
              setFields((f) => ({ ...f, [key]: e.target.checked ? "true" : "" }))
            }}
          />
          <span>{label}</span>
        </label>
      )
    }
    if (type === "select" || type === "text_or_select") {
      const options = Array.isArray(field.options)
        ? (field.options as unknown[]).filter((o): o is string => typeof o === "string")
        : []
      if (type === "text_or_select" && options.length === 0) {
        return (
          <label key={key}>
            <span>{label}</span>
            <input
              type="text"
              value={value}
              required={required}
              onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
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
            onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
          >
            <option value="">Select</option>
            {options.map((o) => (
              <option key={o} value={o}>{o.replaceAll("_", " ")}</option>
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
          value={value}
          required={required}
          onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
        />
      </label>
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    if (onCaptureAssessment && pending) {
      const payload: AssessmentCapturePayload = {
        institutionName: fields.institution_name?.trim() ?? "",
        contactName: fields.contact_name?.trim() ?? "",
        contactEmail: fields.contact_email?.trim() ?? "",
        evaluationAnswers: pending.evaluationAnswers,
        conditionTraces: pending.conditionTraces,
        allFields: fields,
        emailArtifact: pending.evalEmailArtifact,
        report: pending.evalReport,
      }
      const { error: captureError } = await onCaptureAssessment(payload)
      setSubmitting(false)
      if (captureError) {
        setError(captureError)
        return
      }
    } else {
      setSubmitting(false)
    }

    if (pending) {
      try {
        sessionStorage.setItem("__mreg_pending_report", JSON.stringify({
          report: pending.evalReport,
          emailArtifact: pending.evalEmailArtifact,
          fields,
          assessmentCompletion: pending.assessmentCompletion,
          reportContract: pending.assessmentEvaluationReportContract,
        }))
        sessionStorage.removeItem("__mreg_c1_pending")
      } catch { /* ignore */ }
    }

    if (next) onNavigate(next as EncounterSurface)
  }

  if (!pending) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="obsidian_chamber_C1_compact"
        data-material-family="obsidian"
        data-release-standing="held_missing_session"
        style={registryTokenStyle}
      >
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state" role="status">
          <span>Obsidian Chamber</span>
          <p>Complete the AI Operations Assessment to continue.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="obsidian_chamber_C1_compact"
      data-material-family="obsidian"
      data-layout-contract="contact_compact"
      data-release-standing="public_contact_gated"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={registryTokenStyle}
    >
      {renderHeader({ title: "Measures Registry" })}
      <section className="registry-iis-eval registry-assessment-chamber" aria-label="Contact and Consent">
        <div className="registry-chamber-heading">
          <span>Assessment evaluation ready</span>
          <h2>{resultWithheldCopy}</h2>
          <p className="registry-assessment-support">{contactHelperCopy}</p>
        </div>
        <form className="registry-iis-eval-form registry-contact-capture" onSubmit={(e) => void handleSubmit(e)}>
          <p className="registry-contact-standing-note">{standingBoundaryNote}</p>
          {submissionNotice ? (
            <p className="registry-consent-submission-notice">{submissionNotice}</p>
          ) : null}
          <fieldset>
            <legend>Contact and Consent</legend>
            {formFields.length > 0 ? (
              formFields.map(renderField)
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
          {error ? <p className="registry-form-error">{error}</p> : null}
          <div className="registry-diagnostic-passage-controls">
            <button type="submit" disabled={submitting || formFields.length === 0}>
              {submitting ? "Submitting" : "Receive Evaluation"}
            </button>
          </div>
        </form>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
