import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import type { EvalStep } from "../measuresAssessmentTypes"
import {
  allAssessmentMechanics,
  asRecord,
  asString,
  cssTokenName,
  mediaUrl,
  resolveEnvironmentalReport,
  sectionCopy,
  selectedConditionTraces,
} from "./registeredRuntimeUtils"
import type {
  AssessmentEmailArtifact,
  AssessmentMechanicOption,
  AssessmentMechanicQuestion,
  EnvironmentalStandingReport,
  StructuredEvalAnswer,
} from "./registeredRuntimeUtils"
import type {
  DesignTokenRow,
  LandingSectionRow,
  MediaRow,
  PublicationDispatchRow,
  PublicationRegistryRow,
  RegisteredSurface,
  SeatOfferingRow,
} from "./registeredRuntimeTypes"
import RegisteredIntro from "./renderers/RegisteredIntro"
import RegisteredPathChoice from "./renderers/RegisteredPathChoice"
import RegisteredPassage from "./renderers/RegisteredPassage"
import RegisteredAssessment from "./renderers/RegisteredAssessment"
import RegisteredEvalEmailContract from "./renderers/RegisteredEvalEmailContract"
import RegisteredPhaseReveal from "./renderers/RegisteredPhaseReveal"
import RegisteredAbout from "./renderers/RegisteredAbout"
import RegisteredStructuralDrift from "./renderers/RegisteredStructuralDrift"
import RegisteredReserveSeat from "./renderers/RegisteredReserveSeat"
import RegisteredPhasePayment from "./renderers/RegisteredPhasePayment"
import RegisteredConnectSrc from "./renderers/RegisteredConnectSrc"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const DESIGN_REGISTRY_KEY = "measures_registry"
const HISTORY_SOURCE = "measures_registry_registered"

const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "connect_src",
  "measures_assessment",
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "structural_drift_publication",
  "measures_eval_email_contract",
  "reserve_seat",
  "phase_payment",
] as const

const REGISTERED_MEDIA_ROLES = [
  "epigraph_video",
  "explainer_video",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "path_choice_background",
  "background",
  "lapis_background",
  "watermark",
  "registry_watermark",
  "registry_mark",
  "marble_accent_reference",
  "evaluation_reference_image",
  "structured_environment_passage_video",
  "measures_structured_enviroments",
  "marble_tone",
  "installation_tone_marble",
  "installation_tone_marble_rise_return_v1",
] as const

const SURFACE_QUERY: Record<RegisteredSurface, string> = {
  intro: "ai_isnt_broken_intro",
  path_choice: "evaluate_structure_path",
  eval_passage: "eval_passage",
  connect_src: "connect_src",
  measures_assessment: "measures_assessment",
  structure_passage: "structure_passage",
  structured_eval: "structured_eval",
  measures_eval_email_contract: "measures_eval_email_contract",
  measures_phases_reveal: "measures_phases_reveal",
  about_measures_registry: "about_measures_registry",
  structural_drift_dispatches: "structural_drift_publication",
  reserve_seat: "reserve_seat",
  phase_payment: "phase_payment",
  publication_dispatch: "publication_dispatch",
}

const SURFACE_QUERY_ALIASES: Record<string, RegisteredSurface> = {
  landing_root: "intro",
  ai_isnt_broken_intro: "intro",
  landing_path_choice: "path_choice",
  evaluate_structure_path: "path_choice",
  educational_diagnostic_passage: "eval_passage",
  structural_drift_dispatches: "structural_drift_dispatches",
}

const STRUCTURAL_DRIFT_DISPATCHES_ROUTE = "/publication/structural_drift"

function initialSurface(): RegisteredSurface {
  if (window.location.pathname.startsWith(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`)) return "publication_dispatch"
  if (window.location.pathname === STRUCTURAL_DRIFT_DISPATCHES_ROUTE) return "structural_drift_dispatches"

  const queryValue = new URLSearchParams(window.location.search).get("surface")
  if (!queryValue) return "intro"

  const match = Object.entries(SURFACE_QUERY).find(([, v]) => v === queryValue)
  if (match) return match[0] as RegisteredSurface

  return SURFACE_QUERY_ALIASES[queryValue] ?? "intro"
}

export default function MeasuresRegistryRuntimeRegistered() {
  const [activeSurface, setActiveSurface] = useState<RegisteredSurface>(initialSurface)
  const [sections, setSections] = useState<LandingSectionRow[]>([])
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([])
  const [designTokens, setDesignTokens] = useState<DesignTokenRow[]>([])
  const [seatOfferings, setSeatOfferings] = useState<SeatOfferingRow[]>([])
  const [publicationRows, setPublicationRows] = useState<PublicationRegistryRow[]>([])
  const [publicationDispatchRows, setPublicationDispatchRows] = useState<PublicationDispatchRow[]>([])

  const [epigraphEntered, setEpigraphEntered] = useState(true)
  const [epigraphMuted, setEpigraphMuted] = useState(true)
  const [epigraphFailed, setEpigraphFailed] = useState(false)
  const [landingHeroReady, setLandingHeroReady] = useState(false)
  const [passageMuted, setPassageMuted] = useState(true)
  const [thresholdMotionSettled, setThresholdMotionSettled] = useState({ left: false, right: false })

  const [evalFields, setEvalFields] = useState<Record<string, string>>({})
  const [evalAnswers, setEvalAnswers] = useState<Record<string, StructuredEvalAnswer>>({})
  const [evalStep, setEvalStep] = useState<EvalStep>("diagnostic")
  const [evalSectionIndex, setEvalSectionIndex] = useState(0)
  const [evalSubmitting, setEvalSubmitting] = useState(false)
  const [evalSubmitted, setEvalSubmitted] = useState(false)
  const [emailContractResolving, setEmailContractResolving] = useState(false)
  const [evalReport, setEvalReport] = useState<EnvironmentalStandingReport | null>(null)
  const [evalEmailArtifact, setEvalEmailArtifact] = useState<AssessmentEmailArtifact | null>(null)
  const [evalError, setEvalError] = useState<string | null>(null)

  const [holdEmail, setHoldEmail] = useState("")
  const [holdSubmitting, setHoldSubmitting] = useState(false)
  const [holdStatus, setHoldStatus] = useState<Record<string, string | null>>({})
  const [holdError, setHoldError] = useState<Record<string, string | null>>({})

  const [publicationEmail, setPublicationEmail] = useState("")
  const [publicationOrganization, setPublicationOrganization] = useState("")
  const [publicationSubmitting, setPublicationSubmitting] = useState(false)
  const [publicationStatus, setPublicationStatus] = useState<string | null>(null)
  const [publicationError, setPublicationError] = useState<string | null>(null)

  const epigraphVideoRef = useRef<HTMLVideoElement | null>(null)
  const navigationSourceRef = useRef<"app" | "history">("app")

  // --- data fetch ---

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      if (supabaseConfigError) return

      const [sectionResult, mediaResult, tokenResult, offeringResult, publicationResult, dispatchResult] =
        await Promise.all([
          supabase
            .from("measures_encounter_def")
            .select("encounter_key, display_title, metadata")
            .in("encounter_key", [...REGISTERED_ENCOUNTER_KEYS])
            .order("sequence_order", { ascending: true }),
          supabase
            .from("measures_media_map")
            .select("media_role, storage_bucket, storage_path, mime_type, is_active")
            .eq("campaign_key", CAMPAIGN_KEY)
            .in("media_role", [...REGISTERED_MEDIA_ROLES])
            .order("sort_order", { ascending: true }),
          supabase
            .from("measures_design_token")
            .select("token_key, token_value, media_query, is_active")
            .eq("registry_key", DESIGN_REGISTRY_KEY)
            .eq("is_active", true),
          supabase
            .from("measures_seat_offering")
            .select("offering_key, label, short_label, description, offering_type, sequence_order, enrollment_state, hold_target_key, offering_surface_key, metadata")
            .eq("system_key", DESIGN_REGISTRY_KEY)
            .order("sequence_order", { ascending: true }),
          supabase
            .from("measures_publication_registry")
            .select("publication_key, title, subtitle, publication_type, status, external_url, tone, metadata")
            .eq("publication_key", "structural_drift")
            .eq("status", "published"),
          supabase
            .from("measures_publication_dispatch")
            .select("publication_key, dispatch_key, issue_number, title, dispatch_body, excerpt, seo_description, tags, primary_cta, secondary_cta, references, media_manifest, internal_route, article_url, external_url, status, published_at, metadata")
            .eq("publication_key", "structural_drift")
            .eq("status", "published")
            .order("issue_number", { ascending: true }),
        ])

      if (cancelled) return

      if (!sectionResult.error) setSections((sectionResult.data ?? []) as LandingSectionRow[])
      if (!mediaResult.error) setMediaRows((mediaResult.data ?? []) as MediaRow[])
      if (!tokenResult.error) setDesignTokens((tokenResult.data ?? []) as DesignTokenRow[])
      if (!offeringResult.error) setSeatOfferings((offeringResult.data ?? []) as SeatOfferingRow[])
      if (!publicationResult.error) setPublicationRows((publicationResult.data ?? []) as PublicationRegistryRow[])
      if (!dispatchResult.error) setPublicationDispatchRows((dispatchResult.data ?? []) as PublicationDispatchRow[])
    }

    void loadData()
    return () => { cancelled = true }
  }, [])

  // --- epigraph video ---

  useEffect(() => {
    if (!epigraphEntered || epigraphFailed) return
    const video = epigraphVideoRef.current
    if (!video) return
    video.muted = epigraphMuted
    void video.play().catch(() => setEpigraphFailed(true))
  }, [epigraphEntered, epigraphFailed, epigraphMuted])

  // --- navigation ---

  const sectionMap = useMemo(
    () => new Map(sections.map((section) => [section.encounter_key, section])),
    [sections],
  )

  const mediaMap = useMemo(
    () => new Map(
      mediaRows.filter((row) => row.is_active !== false).map((row) => [row.media_role, row]),
    ),
    [mediaRows],
  )

  const registryTokenStyle = useMemo(() => {
    const style: Record<string, string> = {}
    for (const token of designTokens) {
      if (token.is_active === false) continue
      style[cssTokenName(token.token_key, token.media_query)] = token.token_value
    }
    return style as CSSProperties
  }, [designTokens])

  function historyUrl(surface: RegisteredSurface) {
    const url = new URL(window.location.href)
    url.searchParams.set("surface", SURFACE_QUERY[surface])
    return `${url.pathname}${url.search}${url.hash}`
  }

  function writeHistory(method: "pushState" | "replaceState", surface: RegisteredSurface) {
    window.history[method](
      { source: HISTORY_SOURCE, surface, surface_key: SURFACE_QUERY[surface] },
      "",
      historyUrl(surface),
    )
  }

  function navigate(surface: RegisteredSurface) {
    if (navigationSourceRef.current === "app") writeHistory("pushState", surface)
    setActiveSurface(surface)
  }

  useEffect(() => {
    const currentState = window.history.state
    if (currentState?.source !== HISTORY_SOURCE || currentState.surface !== activeSurface) {
      writeHistory("replaceState", activeSurface)
    }

    function handlePopState(event: PopStateEvent) {
      if (event.state?.source !== HISTORY_SOURCE || !event.state.surface) return
      navigationSourceRef.current = "history"
      setActiveSurface(event.state.surface as RegisteredSurface)
      window.setTimeout(() => { navigationSourceRef.current = "app" }, 0)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // --- derived copy ---

  const introCopy = sectionCopy(sectionMap.get("ai_isnt_broken_intro"))
  const pathChoiceCopy = sectionCopy(sectionMap.get("evaluate_structure_path"))
  const evalPassageCopy = sectionCopy(sectionMap.get("eval_passage"))
  const connectSrcCopy = sectionCopy(sectionMap.get("connect_src"))
  const evaluationChamberCopy = sectionCopy(sectionMap.get("measures_assessment"))
  const structurePassageCopy = sectionCopy(sectionMap.get("structure_passage"))
  const structuredEvalCopy = sectionCopy(sectionMap.get("structured_eval"))
  const measuresPhasesRevealCopy = sectionCopy(sectionMap.get("measures_phases_reveal"))
  const aboutMeasuresRegistryCopy = sectionCopy(sectionMap.get("about_measures_registry"))
  const structuralDriftCopy = sectionCopy(sectionMap.get("structural_drift_publication"))
  const measuresEvalEmailCopy = sectionCopy(sectionMap.get("measures_eval_email_contract"))
  const reserveSeatCopy = sectionCopy(sectionMap.get("reserve_seat"))
  const phasePaymentCopy = sectionCopy(sectionMap.get("phase_payment"))

  const structuralDriftPublication = publicationRows.find((row) => row.publication_key === "structural_drift") ?? null
  const structuralDriftDispatches = publicationDispatchRows.filter((row) => row.publication_key === "structural_drift")
  const selectedDispatchKey = window.location.pathname.startsWith(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`)
    ? window.location.pathname.slice(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`.length)
    : null
  const selectedPublicationDispatch =
    structuralDriftDispatches.find((row) => row.dispatch_key === selectedDispatchKey) ??
    structuralDriftDispatches[0] ??
    null

  // --- media URLs ---

  const epigraphVideoUrl = mediaUrl(mediaMap.get("epigraph_video"))
  const explainerVideoUrl = mediaUrl(mediaMap.get("explainer_video"))
  const thresholdLeftStillUrl = mediaUrl(mediaMap.get("left_hero_fracture"))
  const thresholdLeftMotionUrl = mediaUrl(mediaMap.get("left_hero_fracture_motion"))
  const thresholdRightStillUrl = mediaUrl(mediaMap.get("right_measured_hero"))
  const thresholdRightMotionUrl = mediaUrl(mediaMap.get("measured_hero_motion_graphic"))
  const pathChoiceBackgroundUrl = mediaUrl(mediaMap.get("path_choice_background"))
  const lapisBackgroundUrl = mediaUrl(mediaMap.get("background")) ?? mediaUrl(mediaMap.get("lapis_background"))
  const registryWatermarkUrl = mediaUrl(mediaMap.get("watermark")) ?? mediaUrl(mediaMap.get("registry_watermark"))
  const registryMarkUrl = mediaUrl(mediaMap.get("registry_mark"))
  const marbleAccentReferenceUrl = mediaUrl(mediaMap.get("marble_accent_reference"))
  const structuredEnvironmentPassageVideoUrl =
    mediaUrl(mediaMap.get("structured_environment_passage_video")) ??
    mediaUrl(mediaMap.get("measures_structured_enviroments"))
  const marbleToneUrl =
    mediaUrl(mediaMap.get("marble_tone")) ??
    mediaUrl(mediaMap.get("installation_tone_marble")) ??
    mediaUrl(mediaMap.get("installation_tone_marble_rise_return_v1"))

  // --- assessment active copy ---

  const activeEvaluationCopy =
    activeSurface === "structured_eval" && structuredEvalCopy.assessmentMechanics
      ? structuredEvalCopy
      : evaluationChamberCopy

  // --- assessment handlers ---

  function setEvalField(key: string, value: string) {
    setEvalFields((current) => ({ ...current, [key]: value }))
  }

  function setEvalAnswerSelection(mechanic: AssessmentMechanicQuestion, option: AssessmentMechanicOption) {
    setEvalAnswers((current) => ({
      ...current,
      [mechanic.questionKey]: {
        selected: option.value,
        label: option.label,
        institutional_context: current[mechanic.questionKey]?.institutional_context ?? "",
      },
    }))
  }

  function setEvalAnswerContext(mechanic: AssessmentMechanicQuestion, value: string) {
    setEvalAnswers((current) => {
      const existing = current[mechanic.questionKey]
      return {
        ...current,
        [mechanic.questionKey]: {
          selected: existing?.selected ?? "",
          label: existing?.label ?? "",
          institutional_context: value,
        },
      }
    })
  }

  function validateDiagnosticSection(questions: AssessmentMechanicQuestion[]): boolean {
    const missing = questions.filter((question) => !evalAnswers[question.questionKey]?.selected)
    if (missing.length > 0) {
      setEvalError("Please select an answer before continuing.")
      return false
    }
    setEvalError(null)
    return true
  }

  function requiredEvalIdentityFields(): string[] {
    const requiredFields = activeEvaluationCopy.srcIntakeContract?.entry_required_fields
    return Array.isArray(requiredFields)
      ? requiredFields.filter((field): field is string => typeof field === "string")
      : ["institution_name", "institution_type", "contact_name", "contact_email"]
  }

  function continueToDiagnostic() {
    const requiredFields = requiredEvalIdentityFields()
    const missing = requiredFields.filter((field) => !evalFields[field]?.trim())
    if (missing.length > 0) {
      setEvalError(`Missing required fields: ${missing.join(", ")}`)
      return
    }
    setEvalError(null)
    setEvalStep("diagnostic")
    setEvalSectionIndex(0)
  }

  async function submitIisEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEvalSubmitting(true)
    setEvalError(null)

    const populatedEvalAnswers = Object.fromEntries(
      Object.entries(evalAnswers).filter(([, answer]) => answer.selected),
    )

    const activeAssessmentMechanics = allAssessmentMechanics(activeEvaluationCopy.assessmentMechanics)
    const missingEvaluationAnswers = activeAssessmentMechanics.filter(
      (question) => !populatedEvalAnswers[question.questionKey],
    )

    if (missingEvaluationAnswers.length > 0) {
      setEvalSubmitting(false)
      setEvalError("Please complete each evaluation question before assessment.")
      return
    }

    const traces = selectedConditionTraces(activeAssessmentMechanics, evalAnswers)
    const interpretation = resolveEnvironmentalReport(activeEvaluationCopy.assessmentInterpretation, traces)

    if (!interpretation) {
      setEvalSubmitting(false)
      setEvalError("Deterministic interpretation routing is not seated for this assessment.")
      return
    }

    const requiredFields = requiredEvalIdentityFields()

    const { error } = await supabase.from("measures_iis_eval_gate1_capture").insert({
      institution_name: evalFields.institution_name?.trim() ?? "",
      institution_address: evalFields.institution_address?.trim() ?? "",
      institution_phone: evalFields.institution_phone?.trim() ?? "",
      contact_name: evalFields.contact_name?.trim() ?? "",
      contact_position: evalFields.contact_position?.trim() ?? "",
      contact_email: evalFields.contact_email?.trim() ?? "",
      evaluation_answers: populatedEvalAnswers,
      capture_context: evalFields.capture_context?.trim() || "iis_eval_gate1",
      intent: evalFields.intent?.trim() || "system_evaluation_request",
      eligibility: {
        gate_1: "complete",
        assessment_returned: true,
        minimum_identity_captured: true,
        src_requirements_satisfied: true,
        implementation_src_requirements_satisfied: false,
        deferred_src_fields_held: true,
        foundational_courses: true,
        conversion_assessment: "pending_review",
      },
      campaign_tag: "iis_eval_gate1",
      notification_state: "queued",
      confirmation_email_state: "queued",
      metadata: {
        encounter_key: "measures_ai_operational_evaluation",
        institution_type: evalFields.institution_type?.trim() ?? "",
        deferred_src_fields: {
          institution_address: evalFields.institution_address?.trim() || null,
          institution_phone: evalFields.institution_phone?.trim() || null,
          contact_position: evalFields.contact_position?.trim() || null,
          assessment_intent: evalFields.intent?.trim() || null,
          capture_context: evalFields.capture_context?.trim() || null,
        },
        visible_src_fields: requiredFields,
        minimum_identity_captured: true,
        src_requirements_satisfied: true,
        implementation_src_requirements_satisfied: false,
        source_runtime: "registered_runtime_v1",
        environmental_standing_report: interpretation.report,
        structured_email_artifact: interpretation.emailArtifact,
        condition_traces: traces,
      },
    })

    setEvalSubmitting(false)

    if (error) {
      setEvalStep("diagnostic")
      setEvalError("Evaluation could not be seated. Please try again.")
      return
    }

    setEvalReport(interpretation.report)
    setEvalEmailArtifact(interpretation.emailArtifact)
    setEvalSubmitted(true)
    navigate("measures_eval_email_contract")
  }

  // --- seat hold handler ---

  async function submitSeatHold(
    event: FormEvent<HTMLFormElement>,
    encounterKey: "phase_payment",
    offeringKey: string | null,
    successMessage: string | null,
    successSubtext: string | null,
  ) {
    event.preventDefault()

    const normalizedEmail = holdEmail.trim().toLowerCase()
    setHoldStatus((current) => ({ ...current, [encounterKey]: null }))
    setHoldError((current) => ({ ...current, [encounterKey]: null }))

    if (!normalizedEmail) {
      setHoldError((current) => ({ ...current, [encounterKey]: "Email is required." }))
      return
    }

    if (!offeringKey) {
      setHoldError((current) => ({ ...current, [encounterKey]: "Seat hold offering is not seated correctly." }))
      return
    }

    setHoldSubmitting(true)

    const response = await fetch("/api/create-seat-hold-capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, offering_key: offeringKey }),
    })

    setHoldSubmitting(false)

    if (!response.ok) {
      setHoldError((current) => ({ ...current, [encounterKey]: "Seat hold could not be recorded." }))
      return
    }

    setHoldEmail("")
    setHoldStatus((current) => ({
      ...current,
      [encounterKey]: successMessage ?? "Your seat hold has been recorded.",
    }))
  }

  // --- publication subscription ---

  async function submitPublicationSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPublicationStatus(null)
    setPublicationError(null)

    const email = publicationEmail.trim().toLowerCase()
    if (!email) {
      setPublicationError("Email is required.")
      return
    }

    setPublicationSubmitting(true)
    const { error } = await supabase.from("measures_publication_subscription_capture").insert({
      publication_key: structuralDriftPublication?.publication_key ?? "structural_drift",
      dispatch_key: selectedPublicationDispatch?.dispatch_key ?? null,
      email,
      organization: publicationOrganization.trim() || null,
      capture_source: asString(selectedPublicationDispatch?.metadata?.capture_source) ?? "structural_drift_dispatch",
      metadata: {
        source: "publication_dispatch_renderer",
        internal_route: selectedPublicationDispatch?.internal_route ?? STRUCTURAL_DRIFT_DISPATCHES_ROUTE,
      },
    })
    setPublicationSubmitting(false)

    if (error) {
      setPublicationError("Subscription could not be recorded.")
      return
    }

    setPublicationEmail("")
    setPublicationOrganization("")
    setPublicationStatus("Registry dispatch subscription recorded.")
  }

  // --- shared header (Measures Registry branding only) ---

  function renderHeader(headerOverride?: Record<string, unknown> | null) {
    const header = headerOverride ?? null
    const title = asString(header?.title)

    return (
      <header className="registry-public-header" aria-label={title ?? undefined}>
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
          {title ? <span>{title}</span> : null}
        </div>
        <nav className="registry-public-nav" aria-label="Measures Registry navigation" />
      </header>
    )
  }

  function renderSystemFooter() {
    return (
      <footer className="registry-system-footer">
        <p>&copy; 2026 c3 Community Partners DAO, LLC</p>
        <p>Measures Registry is a registered c3 Field system.</p>
      </footer>
    )
  }

  function renderMarbleToneContinuity() {
    if (passageMuted || !marbleToneUrl) return null
    return (
      <audio
        className="registry-marble-tone"
        src={marbleToneUrl}
        autoPlay
        loop
        preload="auto"
        aria-hidden="true"
        ref={(node) => { if (node) node.volume = 0.08 }}
      />
    )
  }

  // --- assessment mechanics ---

  const measuresMechanics = allAssessmentMechanics(evaluationChamberCopy.assessmentMechanics)
  const structuredMechanics = allAssessmentMechanics(
    structuredEvalCopy.assessmentMechanics ?? evaluationChamberCopy.assessmentMechanics,
  )

  const sharedAssessmentProps = {
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
    onBackQuestion: () => setEvalSectionIndex((current) => Math.max(0, current - 1)),
    onContinueToDiagnostic: continueToDiagnostic,
    onEnterStructuredEnvironment: () => navigate("measures_eval_email_contract"),
    onSetEvalAnswerContext: setEvalAnswerContext,
    onSetEvalAnswerSelection: setEvalAnswerSelection,
    onSetEvalField: setEvalField,
    onSubmitEvaluation: submitIisEvaluation,
    onStructuredEnvironmentVideoEnded: () => navigate("measures_eval_email_contract"),
    onTogglePassageMuted: () => setPassageMuted((current) => !current),
  }

  // --- surface dispatcher ---

  let activeSurfaceElement: React.ReactNode

  if (activeSurface === "intro") {
    activeSurfaceElement = (
      <RegisteredIntro
        registryTokenStyle={registryTokenStyle}
        epigraphVideoRef={epigraphVideoRef}
        epigraphVideoUrl={epigraphVideoUrl}
        epigraphEntered={epigraphEntered}
        epigraphMuted={epigraphMuted}
        epigraphFailed={epigraphFailed}
        landingHeroReady={landingHeroReady}
        thresholdMotionSettled={thresholdMotionSettled}
        thresholdLeftStillUrl={thresholdLeftStillUrl}
        thresholdLeftMotionUrl={thresholdLeftMotionUrl}
        thresholdRightStillUrl={thresholdRightStillUrl}
        thresholdRightMotionUrl={thresholdRightMotionUrl}
        introCopy={introCopy}
        onEpigraphEnter={() => setEpigraphEntered(true)}
        onEpigraphMuteToggle={() => setEpigraphMuted((current) => !current)}
        onEpigraphSkip={() => setLandingHeroReady(true)}
        onEpigraphError={() => setEpigraphFailed(true)}
        onEpigraphEnd={() => setLandingHeroReady(true)}
        onThresholdMotionSettled={(side) =>
          setThresholdMotionSettled((current) =>
            current[side] ? current : { ...current, [side]: true },
          )
        }
        onLeftChoice={() => navigate("path_choice")}
        onRightChoice={() => navigate("path_choice")}
      />
    )
  } else if (activeSurface === "path_choice") {
    activeSurfaceElement = (
      <RegisteredPathChoice
        registryTokenStyle={registryTokenStyle}
        pathChoiceCopy={pathChoiceCopy}
        pathChoiceBackgroundUrl={pathChoiceBackgroundUrl}
        leftHeroUrl={thresholdLeftStillUrl}
        rightHeroUrl={thresholdRightStillUrl}
        registryMarkUrl={registryMarkUrl}
        onLeftChoice={() => navigate("eval_passage")}
        onRightChoice={() => navigate("structure_passage")}
      />
    )
  } else if (activeSurface === "eval_passage") {
    activeSurfaceElement = (
      <RegisteredPassage
        variant="eval"
        registryTokenStyle={registryTokenStyle}
        passageCopy={evalPassageCopy}
        passageVideoUrl={explainerVideoUrl}
        passageMuted={passageMuted}
        renderHeader={() => renderHeader(evalPassageCopy.header)}
        onContinue={() => navigate("measures_assessment")}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "structure_passage") {
    activeSurfaceElement = (
      <RegisteredPassage
        variant="structure"
        registryTokenStyle={registryTokenStyle}
        passageCopy={structurePassageCopy}
        passageVideoUrl={structuredEnvironmentPassageVideoUrl}
        passageMuted={passageMuted}
        renderHeader={() => renderHeader(structurePassageCopy.header)}
        onContinue={() => navigate("structured_eval")}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "measures_assessment") {
    activeSurfaceElement = (
      <RegisteredAssessment
        {...sharedAssessmentProps}
        encounterCopy={evaluationChamberCopy}
        structuredQuestions={measuresMechanics}
        onContinueQuestion={(currentQuestion) => {
          if (!validateDiagnosticSection([currentQuestion])) return
          setEvalSectionIndex((current) => Math.min(measuresMechanics.length - 1, current + 1))
        }}
        onCompleteQuestionClick={(event, currentQuestion) => {
          if (currentQuestion && validateDiagnosticSection([currentQuestion])) return
          event.preventDefault()
        }}
      />
    )
  } else if (activeSurface === "structured_eval") {
    activeSurfaceElement = (
      <RegisteredAssessment
        {...sharedAssessmentProps}
        encounterCopy={{
          ...evaluationChamberCopy,
          assessmentChamber: structuredEvalCopy.assessmentChamber ?? evaluationChamberCopy.assessmentChamber,
          assessmentCompletion: structuredEvalCopy.assessmentCompletion ?? evaluationChamberCopy.assessmentCompletion,
          layoutContract: structuredEvalCopy.layoutContract ?? evaluationChamberCopy.layoutContract,
          srcIntakeContract: structuredEvalCopy.srcIntakeContract ?? evaluationChamberCopy.srcIntakeContract,
          stylingContract: structuredEvalCopy.stylingContract ?? evaluationChamberCopy.stylingContract,
          resolutionText: structuredEvalCopy.resolutionText ?? evaluationChamberCopy.resolutionText,
        }}
        structuredQuestions={structuredMechanics}
        onContinueQuestion={(currentQuestion) => {
          if (!validateDiagnosticSection([currentQuestion])) return
          setEvalSectionIndex((current) => Math.min(structuredMechanics.length - 1, current + 1))
        }}
        onCompleteQuestionClick={(event, currentQuestion) => {
          if (currentQuestion && validateDiagnosticSection([currentQuestion])) return
          event.preventDefault()
        }}
      />
    )
  } else if (activeSurface === "measures_eval_email_contract") {
    activeSurfaceElement = (
      <RegisteredEvalEmailContract
        registryTokenStyle={registryTokenStyle}
        emailContractResolving={emailContractResolving}
        evalReport={evalReport}
        evalFields={evalFields}
        emailCopy={measuresEvalEmailCopy}
        renderHeader={() => renderHeader(measuresEvalEmailCopy.header)}
        onFieldChange={(key, value) => setEvalFields((current) => ({ ...current, [key]: value }))}
        onSubmit={(event) => {
          event.preventDefault()
          setEmailContractResolving(true)
          window.setTimeout(() => navigate("measures_phases_reveal"), 4000)
        }}
      />
    )
  } else if (activeSurface === "measures_phases_reveal") {
    activeSurfaceElement = (
      <RegisteredPhaseReveal
        registryTokenStyle={registryTokenStyle}
        phaseRevealCopy={measuresPhasesRevealCopy}
        lapisBackgroundUrl={lapisBackgroundUrl}
        evalReport={evalReport}
        renderHeader={() => renderHeader(measuresPhasesRevealCopy.header)}
        onContinue={() => navigate("about_measures_registry")}
      />
    )
  } else if (activeSurface === "about_measures_registry") {
    activeSurfaceElement = (
      <RegisteredAbout
        registryTokenStyle={registryTokenStyle}
        aboutCopy={aboutMeasuresRegistryCopy}
        marbleAccentReferenceUrl={marbleAccentReferenceUrl}
        renderHeader={() => renderHeader(aboutMeasuresRegistryCopy.header)}
        renderSystemFooter={renderSystemFooter}
        onContinue={() => navigate("structural_drift_dispatches")}
      />
    )
  } else if (activeSurface === "structural_drift_dispatches" || activeSurface === "publication_dispatch") {
    activeSurfaceElement = (
      <RegisteredStructuralDrift
        registryTokenStyle={registryTokenStyle}
        variant={activeSurface === "publication_dispatch" ? "article" : "index"}
        structuralDriftCopy={structuralDriftCopy}
        structuralDriftPublication={structuralDriftPublication}
        structuralDriftDispatches={structuralDriftDispatches}
        selectedPublicationDispatch={selectedPublicationDispatch}
        evalReport={evalReport}
        publicationEmail={publicationEmail}
        publicationOrganization={publicationOrganization}
        publicationSubmitting={publicationSubmitting}
        publicationStatus={publicationStatus}
        publicationError={publicationError}
        onBeginEvaluation={() => navigate("measures_assessment")}
        onContinueToAssessmentPackage={() => navigate("reserve_seat")}
        onGoToEvalPassage={() => navigate("eval_passage")}
        onPublicationEmailChange={setPublicationEmail}
        onPublicationOrganizationChange={setPublicationOrganization}
        onSubmitSubscription={submitPublicationSubscription}
        renderSystemFooter={renderSystemFooter}
      />
    )
  } else if (activeSurface === "reserve_seat") {
    activeSurfaceElement = (
      <RegisteredReserveSeat
        registryTokenStyle={registryTokenStyle}
        reserveSeatCopy={reserveSeatCopy}
        seatOfferings={seatOfferings}
        renderHeader={() => renderHeader()}
        onSelectOffering={() => navigate("phase_payment")}
      />
    )
  } else if (activeSurface === "phase_payment") {
    activeSurfaceElement = (
      <RegisteredPhasePayment
        registryTokenStyle={registryTokenStyle}
        phasePaymentCopy={phasePaymentCopy}
        holdEmail={holdEmail}
        holdSubmitting={holdSubmitting}
        holdStatus={holdStatus["phase_payment"] ?? null}
        holdError={holdError["phase_payment"] ?? null}
        renderHeader={() => renderHeader()}
        onHoldEmailChange={setHoldEmail}
        onBack={() => navigate("reserve_seat")}
        onSubmit={(event) =>
          submitSeatHold(
            event,
            "phase_payment",
            phasePaymentCopy.offeringKey,
            phasePaymentCopy.successMessage,
            phasePaymentCopy.successSubtext,
          )
        }
      />
    )
  } else if (activeSurface === "connect_src") {
    activeSurfaceElement = (
      <RegisteredConnectSrc
        registryTokenStyle={registryTokenStyle}
        connectSrcCopy={connectSrcCopy}
        evalFields={evalFields}
        renderHeader={() => renderHeader(connectSrcCopy.header)}
        onFieldChange={(key, value) => setEvalFields((current) => ({ ...current, [key]: value }))}
        onSubmit={(event) => {
          event.preventDefault()
          navigate("measures_assessment")
        }}
      />
    )
  } else {
    activeSurfaceElement = (
      <RegisteredIntro
        registryTokenStyle={registryTokenStyle}
        epigraphVideoRef={epigraphVideoRef}
        epigraphVideoUrl={epigraphVideoUrl}
        epigraphEntered={epigraphEntered}
        epigraphMuted={epigraphMuted}
        epigraphFailed={epigraphFailed}
        landingHeroReady={landingHeroReady}
        thresholdMotionSettled={thresholdMotionSettled}
        thresholdLeftStillUrl={thresholdLeftStillUrl}
        thresholdLeftMotionUrl={thresholdLeftMotionUrl}
        thresholdRightStillUrl={thresholdRightStillUrl}
        thresholdRightMotionUrl={thresholdRightMotionUrl}
        introCopy={introCopy}
        onEpigraphEnter={() => setEpigraphEntered(true)}
        onEpigraphMuteToggle={() => setEpigraphMuted((current) => !current)}
        onEpigraphSkip={() => setLandingHeroReady(true)}
        onEpigraphError={() => setEpigraphFailed(true)}
        onEpigraphEnd={() => setLandingHeroReady(true)}
        onThresholdMotionSettled={(side) =>
          setThresholdMotionSettled((current) =>
            current[side] ? current : { ...current, [side]: true },
          )
        }
        onLeftChoice={() => navigate("path_choice")}
        onRightChoice={() => navigate("path_choice")}
      />
    )
  }

  return (
    <>
      {renderMarbleToneContinuity()}
      {activeSurfaceElement}
    </>
  )
}
