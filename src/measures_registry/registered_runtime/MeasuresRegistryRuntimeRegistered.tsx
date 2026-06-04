import "./styles/registry.runtime.css"
import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import type { EvalStep } from "../measuresAssessmentTypes"
import {
  allAssessmentMechanics,
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
  cssTokenName,
  mediaUrl,
  resolveEnvironmentalReportByScore,
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
} from "./registeredRuntimeTypes"
import RegisteredIntro from "./renderers/RegisteredIntro"
import RegisteredPathChoice from "./renderers/RegisteredPathChoice"
import RegisteredPassage from "./renderers/RegisteredPassage"
import RegisteredPublicAssessment from "./renderers/RegisteredPublicAssessment"
import RegisteredStructuralDrift from "./renderers/RegisteredStructuralDrift"
import RegisteredPublicUnderstand from "./renderers/RegisteredPublicUnderstand"
import RegisteredCrystalChamber from "./renderers/RegisteredCrystalChamber"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const DESIGN_REGISTRY_KEY = "measures_registry"
const HISTORY_SOURCE = "measures_registry_registered"

const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "measures_assessment",
  "obsidian_to_marble_passage_video",
  "marble_pathway_reveal",
  "structure_passage",
  "crystal_chamber",
  "structural_drift_publication",
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
  "structural_drift_feature_image",
  "structural_drift_featured_image",
  "structural_drift_cover",
  "structural_drift_cover_photo",
  "structural_drift_publication_cover",
  "publication_structural_drift_cover",
  "questions_ungoverned_systems_cannot_answer_video",
  "before_the_pathway_obsidian_to_marble_passage_video",
] as const

const SURFACE_QUERY: Record<RegisteredSurface, string> = {
  intro: "ai_isnt_broken_intro",
  path_choice: "evaluate_structure_path",
  eval_passage: "eval_passage",
  measures_assessment: "measures_assessment",
  obsidian_to_marble_passage_video: "obsidian_to_marble_passage_video",
  marble_pathway_reveal: "marble_pathway_reveal",
  structure_passage: "structure_passage",
  crystal_chamber: "crystal_chamber",
  structural_drift_dispatches: "structural_drift_publication",
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
const PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7

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
  const [evalReport, setEvalReport] = useState<EnvironmentalStandingReport | null>(null)
  const [evalEmailArtifact, setEvalEmailArtifact] = useState<AssessmentEmailArtifact | null>(null)
  const [evalError, setEvalError] = useState<string | null>(null)
  const [conditionTraces, setConditionTraces] = useState<import("./registeredRuntimeUtils").AssessmentConditionTrace[]>([])

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

      const [sectionResult, mediaResult, tokenResult, publicationResult, dispatchResult] =
        await Promise.all([
          supabase
            .from("measures_encounter_def")
            .select("encounter_key, display_title, metadata")
            .in("encounter_key", [...REGISTERED_ENCOUNTER_KEYS])
            .order("sequence_order", { ascending: true }),
          supabase
            .from("measures_media_map")
            .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
            .in("campaign_key", [CAMPAIGN_KEY, "measures_registry_crystal_chamber"])
            .in("media_role", [...REGISTERED_MEDIA_ROLES])
            .order("sort_order", { ascending: true }),
          supabase
            .from("measures_design_token")
            .select("token_key, token_value, media_query, is_active")
            .eq("registry_key", DESIGN_REGISTRY_KEY)
            .eq("is_active", true),
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

  function navigate(surface: RegisteredSurface) {
    navigationSourceRef.current = "app"
    setActiveSurface(surface)
  }

  // URL sync: runs after every activeSurface change so URL always matches visible surface
  useEffect(() => {
    if (navigationSourceRef.current === "history") {
      // Surface was set by popstate — browser already updated URL; just reset ref
      navigationSourceRef.current = "app"
      return
    }
    const state = window.history.state
    if (state?.source === HISTORY_SOURCE && state.surface === activeSurface) return
    const method = state?.source === HISTORY_SOURCE ? "pushState" : "replaceState"
    writeHistory(method, activeSurface)
  }, [activeSurface])

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state?.source !== HISTORY_SOURCE || !event.state.surface) return
      navigationSourceRef.current = "history"
      setActiveSurface(event.state.surface as RegisteredSurface)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // Assessment surfaces must always render questions, never a completion carry-over.
  // evalSubmitted persists across SPA surface changes via browser back/forward navigation.
  // Resetting it here ensures measures_assessment always starts in question mode.
  useEffect(() => {
    if (activeSurface === "measures_assessment") {
      setEvalSubmitted(false)
      setEvalStep("diagnostic")
      setEvalError(null)
    }
  }, [activeSurface])

  // --- derived copy ---

  const introCopy = sectionCopy(sectionMap.get("ai_isnt_broken_intro"))
  const pathChoiceCopy = sectionCopy(sectionMap.get("evaluate_structure_path"))
  const evalPassageCopy = sectionCopy(sectionMap.get("eval_passage"))
  const evaluationChamberCopy = sectionCopy(sectionMap.get("measures_assessment"))
  const obsidianToMarblePassageCopy = sectionCopy(sectionMap.get("obsidian_to_marble_passage_video"))
  const marblePathwayRevealCopy = sectionCopy(sectionMap.get("marble_pathway_reveal"))
  const structurePassageCopy = sectionCopy(sectionMap.get("structure_passage"))
  const crystalChamberCopy = sectionCopy(sectionMap.get("crystal_chamber"))
  const structuralDriftCopy = sectionCopy(sectionMap.get("structural_drift_publication"))
  const publicAssessBoundary = asRecord(
    asRecord(evaluationChamberCopy.publicRuntimeBoundary?.public_paths)?.assess_environment ??
    evaluationChamberCopy.publicRuntimeBoundary?.public_paths,
  )
  const publicAssessPathwayLabels = asStringArray(publicAssessBoundary?.allowed_public_pathway_labels)
  const publicRecommendationCopy = asStringArray(
    asRecord(evaluationChamberCopy.publicRuntimeBoundary?.commerce_circuit_public_boundary)?.public_copy_allowed,
  )[0] ?? null
  const publicAssessmentResultBoundary =
    publicAssessPathwayLabels.length > 0
      ? {
          pathwayLabels: publicAssessPathwayLabels,
          recommendationCopy: publicRecommendationCopy,
        }
      : null

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
  const structuralDriftFeatureImageUrl =
    mediaUrl(mediaMap.get("structural_drift_cover")) ??
    mediaUrl(mediaMap.get("structural_drift_cover_photo")) ??
    mediaUrl(mediaMap.get("structural_drift_publication_cover")) ??
    mediaUrl(mediaMap.get("publication_structural_drift_cover")) ??
    mediaUrl(mediaMap.get("structural_drift_feature_image")) ??
    mediaUrl(mediaMap.get("structural_drift_featured_image"))
  const questionsUngovernedSystemsVideoUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer_video"))
  const beforeThePathwayVideoUrl = mediaUrl(mediaMap.get("before_the_pathway_obsidian_to_marble_passage_video"))
  const structuredEnvironmentPassageVideoUrl =
    mediaUrl(mediaMap.get("structured_environment_passage_video")) ??
    mediaUrl(mediaMap.get("measures_structured_enviroments"))
  const marbleToneUrl =
    mediaUrl(mediaMap.get("marble_tone")) ??
    mediaUrl(mediaMap.get("installation_tone_marble")) ??
    mediaUrl(mediaMap.get("installation_tone_marble_rise_return_v1"))

  // --- assessment active copy ---

  const activeEvaluationCopy = evaluationChamberCopy
  const assessmentBindingContract = activeEvaluationCopy.assessmentContactCaptureBindingContract
  const assessmentContactForm = asRecord(assessmentBindingContract?.post_assessment_contact_form)

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

  function requiredAssessmentContactFields(): string[] {
    const formFields = asRecordArray(assessmentContactForm?.fields)
    const consentFields = asRecordArray(assessmentBindingContract?.consent_fields)
    return [...formFields, ...consentFields]
      .filter((field) => field.required === true)
      .map((field) => asString(field.field_key))
      .filter((field): field is string => Boolean(field))
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

    if (evalStep === "contact_capture") {
      if (!evalReport || !evalEmailArtifact) {
        setEvalSubmitting(false)
        setEvalError("Assessment result is not ready for contact binding.")
        return
      }

      const requiredContactFields = requiredAssessmentContactFields()
      const missingContactFields = requiredContactFields.filter((field) => !evalFields[field]?.trim())
      if (missingContactFields.length > 0) {
        setEvalSubmitting(false)
        setEvalError("Please complete the required contact and consent fields.")
        return
      }

      const { error } = await supabase.from("measures_iis_eval_gate1_capture").insert({
        institution_name: evalFields.institution_name?.trim() ?? "",
        institution_address: evalFields.website?.trim() ?? "",
        institution_phone: "",
        contact_name: evalFields.contact_name?.trim() ?? "",
        contact_position: evalFields.role_title?.trim() ?? "",
        contact_email: evalFields.contact_email?.trim() ?? "",
        evaluation_answers: Object.fromEntries(
          Object.entries(evalAnswers).filter(([, answer]) => answer.selected),
        ),
        capture_context: "measures_assessment_contact_gated_delivery",
        intent: "assessment_result_delivery_request",
        eligibility: {
          gate_1: "complete",
          assessment_returned: true,
          contact_capture_submitted: true,
          consent_confirmed: true,
          minimum_identity_captured: true,
          src_requirements_satisfied: true,
          implementation_src_requirements_satisfied: false,
          deferred_src_fields_held: true,
        },
        campaign_tag: "measures_assessment_contact_gated_delivery",
        notification_state: "queued",
        confirmation_email_state: "queued",
        metadata: {
          encounter_key: "measures_ai_operational_evaluation",
          organization_type: evalFields.organization_type?.trim() ?? "",
          ai_deployment_status: evalFields.ai_deployment_status?.trim() ?? "",
          next_support_question: evalFields.next_support_question?.trim() || null,
          assessment_result_email_consent: evalFields.assessment_result_email_consent === "true",
          assessment_boundary_acknowledgment: evalFields.assessment_boundary_acknowledgment === "true",
          measures_registry_updates_opt_in: evalFields.measures_registry_updates_opt_in === "true",
          required_contact_fields: requiredContactFields,
          source_runtime: "registered_runtime_v1",
          assessment_result_binding: {
            environmental_standing_report: evalReport,
            institution_name: evalFields.institution_name?.trim() ?? "",
            organization_type: evalFields.organization_type?.trim() ?? "",
            contact_name: evalFields.contact_name?.trim() ?? "",
            contact_email: evalFields.contact_email?.trim() ?? "",
            role_title: evalFields.role_title?.trim() ?? "",
            website: evalFields.website?.trim() || null,
            ai_deployment_status: evalFields.ai_deployment_status?.trim() ?? "",
            next_support_question: evalFields.next_support_question?.trim() || null,
            assessment_result_email_consent: evalFields.assessment_result_email_consent === "true",
            assessment_boundary_acknowledgment: evalFields.assessment_boundary_acknowledgment === "true",
            measures_registry_updates_opt_in: evalFields.measures_registry_updates_opt_in === "true",
            continuation_pathway: evalReport.continuation_pathway,
            public_internal_boundary_preserved: true,
          },
          environmental_standing_report: evalReport,
          structured_email_artifact: evalEmailArtifact,
          condition_traces: conditionTraces,
          contact_gated_result_delivery: true,
          result_displayed_after_contact_capture: true,
        },
      })

      setEvalSubmitting(false)

      if (error) {
        setEvalError("Evaluation could not be seated. Please try again.")
        return
      }

      setEvalSubmitted(true)
      return
    }

    const populatedEvalAnswers = Object.fromEntries(
      Object.entries(evalAnswers).filter(([, answer]) => answer.selected),
    )

    const activeAssessmentMechanics = allAssessmentMechanics(activeEvaluationCopy.assessmentMechanics)
    if (activeAssessmentMechanics.length !== PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT) {
      setEvalSubmitting(false)
      setEvalError("Assessment contract is incomplete in the runtime registry.")
      return
    }

    const missingEvaluationAnswers = activeAssessmentMechanics.filter(
      (question) => !populatedEvalAnswers[question.questionKey],
    )

    if (missingEvaluationAnswers.length > 0) {
      setEvalSubmitting(false)
      setEvalError("Please complete each evaluation question before assessment.")
      return
    }

    const traces = selectedConditionTraces(activeAssessmentMechanics, evalAnswers)
    const interpretation = resolveEnvironmentalReportByScore(
      activeAssessmentMechanics,
      traces,
      activeEvaluationCopy.assessmentInterpretation,
    )

    if (!interpretation) {
      setEvalSubmitting(false)
      setEvalError("Scoring contract is not seated for this assessment.")
      return
    }

    setEvalSubmitting(false)

    setConditionTraces(traces)
    setEvalReport(interpretation.report)
    setEvalEmailArtifact(interpretation.emailArtifact)
    setEvalStep("contact_capture")
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
    const footerCopy = (() => {
      const activeCopy = sectionCopy(sectionMap.get(SURFACE_QUERY[activeSurface]))
      const contract = activeCopy.footerContract
      const lines = asStringArray(contract?.copy_lines)
      if (lines.length > 0) return lines

      const copyright = asString(contract?.copyright)
      const systemStatement = asString(contract?.system_statement)
      const operatorStatement = asString(contract?.operator_statement)
      return [copyright, systemStatement, operatorStatement].filter((line): line is string => Boolean(line))
    })()

    if (footerCopy.length === 0) return null

    return (
      <footer className="registry-system-footer">
        {footerCopy.map((line) => (
          <p key={line}>{line}</p>
        ))}
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
  const activeAssessmentContractKeys = asStringArray(
    evaluationChamberCopy.activeContractKeyReconciliation?.active_contract_keys,
  )
  const measuresAssessmentContractSeated = activeAssessmentContractKeys.includes("measures_assessment_contract")
  const publicAssessmentQuestionContractReady =
    measuresAssessmentContractSeated &&
    measuresMechanics.length === PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT
  const renderedMeasuresMechanics = publicAssessmentQuestionContractReady ? measuresMechanics : []
  const questionContractStanding = {
    ready: publicAssessmentQuestionContractReady,
    expectedQuestionCount: PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT,
    actualQuestionCount: measuresMechanics.length,
    displayTitle: measuresAssessmentContractSeated
      ? "Assessment question contract is incomplete."
      : "Assessment contract is not seated.",
    displayBody: measuresAssessmentContractSeated
      ? "The active assessment content is seated in the runtime registry, but the registered public question body is not seated with the required seven-question AI Operations Assessment."
      : "The public assessment route is active, but the required measures_assessment_contract is not seated in the runtime registry.",
    allowedNextStep: "Public rendering is held until Measures seats the complete registered assessment content.",
  }

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
    onEnterStructuredEnvironment: () => navigate("structure_passage"),
    onSetEvalAnswerContext: setEvalAnswerContext,
    onSetEvalAnswerSelection: setEvalAnswerSelection,
    onSetEvalField: setEvalField,
    onSubmitEvaluation: submitIisEvaluation,
    onStructuredEnvironmentVideoEnded: () => navigate("structure_passage"),
    onTogglePassageMuted: () => setPassageMuted((current) => !current),
    renderSystemFooter,
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
        onLeftChoice={() => navigate("eval_passage")}
        onRightChoice={() => navigate("structure_passage")}
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
        renderSystemFooter={renderSystemFooter}
        onContinue={() => navigate("measures_assessment")}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "structure_passage") {
    activeSurfaceElement = (
      <RegisteredPublicUnderstand
        registryTokenStyle={registryTokenStyle}
        structurePassageCopy={structurePassageCopy}
        talkingHeadVideoUrl={structuredEnvironmentPassageVideoUrl}
        passageMuted={passageMuted}
        renderHeader={() => renderHeader(structurePassageCopy.header)}
        renderSystemFooter={renderSystemFooter}
        onContinueToCrystal={() => navigate("crystal_chamber")}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "crystal_chamber") {
    activeSurfaceElement = (
      <RegisteredCrystalChamber
        registryTokenStyle={registryTokenStyle}
        crystalChamberCopy={crystalChamberCopy}
        chamberCarrierCopy={structurePassageCopy}
        questionsVideoUrl={questionsUngovernedSystemsVideoUrl}
        structuralDriftCoverUrl={structuralDriftFeatureImageUrl}
        registryMarkUrl={registryMarkUrl}
        structuralDriftAvailable={Boolean(structuralDriftPublication || structuralDriftDispatches.length > 0)}
        renderHeader={() => renderHeader(crystalChamberCopy.header ?? structurePassageCopy.header)}
        renderSystemFooter={renderSystemFooter}
        onAssessEnvironment={() => navigate("eval_passage")}
        onStructuralDrift={() => navigate("structural_drift_dispatches")}
      />
    )
  } else if (activeSurface === "measures_assessment") {
    activeSurfaceElement = (
      <RegisteredPublicAssessment
        {...sharedAssessmentProps}
        encounterCopy={evaluationChamberCopy}
        questionContractStanding={questionContractStanding}
        publicResultBoundary={publicAssessmentResultBoundary}
        structuredQuestions={renderedMeasuresMechanics}
        onBeginPathwayReview={() => navigate("obsidian_to_marble_passage_video")}
        onContinueQuestion={(currentQuestion) => {
          if (!validateDiagnosticSection([currentQuestion])) return
          setEvalSectionIndex((current) => Math.min(renderedMeasuresMechanics.length - 1, current + 1))
        }}
        onCompleteQuestionClick={(event, currentQuestion) => {
          if (currentQuestion && validateDiagnosticSection([currentQuestion])) return
          event.preventDefault()
        }}
      />
    )
  } else if (activeSurface === "obsidian_to_marble_passage_video") {
    const passageTitle = asString(obsidianToMarblePassageCopy.title) ?? "Before the Pathway"
    const passageTranscript = obsidianToMarblePassageCopy.passageTranscript
    const passageCta = obsidianToMarblePassageCopy.cta
    const passageCtaLabel = asString(passageCta?.label) ?? "Begin Pathway Reveal"
    activeSurfaceElement = (
      <main className="measures-registry-runtime" data-surface="obsidian_to_marble_passage_video" style={registryTokenStyle}>
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state registry-assessment-contract-held registry-pathway-passage" aria-label={passageTitle}>
          <span>Pathway review passage</span>
          <h2>{passageTitle}</h2>
          {beforeThePathwayVideoUrl ? (
            <div className="registry-pathway-passage-video-frame">
              <video
                className="registry-pathway-passage-video"
                src={beforeThePathwayVideoUrl}
                autoPlay
                muted={passageMuted}
                controls
                playsInline
                preload="auto"
                aria-label="Before the Pathway"
              />
            </div>
          ) : (
            <p className="registry-media-absence">Before the Pathway video is not seated in the runtime registry.</p>
          )}
          {passageTranscript.length > 0 ? (
            <div className="registry-report-group">
              <strong>Before the Pathway</strong>
              {passageTranscript.slice(-2).map((line) => <p key={line}>{line}</p>)}
            </div>
          ) : null}
          <div className="registry-diagnostic-passage-controls registry-report-controls">
            <button type="button" onClick={() => navigate("marble_pathway_reveal")}>{passageCtaLabel}</button>
            <button type="button" onClick={() => setPassageMuted((current) => !current)}>
              {passageMuted ? "Audio" : "Mute"}
            </button>
          </div>
        </section>
        {renderSystemFooter()}
      </main>
    )
  } else if (activeSurface === "marble_pathway_reveal") {
    const heldCopy = marblePathwayRevealCopy.heldCopy
    activeSurfaceElement = (
      <main className="measures-registry-runtime" data-surface="marble_pathway_reveal" style={registryTokenStyle}>
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state registry-assessment-contract-held" role="status" aria-live="polite">
          <span>Marble Chamber</span>
          <h2>{asString(heldCopy?.title) ?? "Recommended Governed Pathway is held."}</h2>
          <p>{asString(heldCopy?.body) ?? "The pathway reveal is held until seated."}</p>
          <p>{asString(heldCopy?.allowed_next_step) ?? "Seat the Marble reveal boundary in a later OAR2."}</p>
        </section>
        {renderSystemFooter()}
      </main>
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
        onContinueToAssessmentPackage={() => navigate("eval_passage")}
        onGoToEvalPassage={() => navigate("eval_passage")}
        onPublicationEmailChange={setPublicationEmail}
        onPublicationOrganizationChange={setPublicationOrganization}
        onSubmitSubscription={submitPublicationSubscription}
        renderSystemFooter={renderSystemFooter}
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


