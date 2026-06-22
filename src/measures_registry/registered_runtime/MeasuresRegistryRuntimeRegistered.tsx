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
  LandingUnitRow,
  MapC2CircuitRow,
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
import RegisteredAssessmentLanding from "./renderers/RegisteredAssessmentLanding"
import MarbleCommerceDirectory from "./renderers/MarbleCommerceDirectory"
import RegisteredAboutMeasuresRegistry from "./renderers/RegisteredAboutMeasuresRegistry"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const DESIGN_REGISTRY_KEY = "measures_registry"
const HISTORY_SOURCE = "measures_registry_registered"

const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "ai_operations_assessment_landing",
  "eval_passage",
  "measures_assessment",
  "obsidian_to_marble_passage_video",
  "marble_pathway_reveal",
  "map_integrity_governance",
  "structure_passage",
  "about_measures_registry",
  "structural_drift_publication",
] as const

const REGISTERED_MEDIA_ROLES = [
  "intro_hook_video",
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
  "about_measures_registry_video",
  "official_codexstone_seal",
  "agents_with_keys_cover",
  "fables_and_myths_cover",
  "before_the_pathway_obsidian_to_marble_passage_video",
  "obsidian_contact_surface_visual",
  "obsidian_assessment_surface_visual",
  "obsidian_eval_result_surface_visual",
] as const

const SURFACE_QUERY: Record<RegisteredSurface, string> = {
  intro: "ai_isnt_broken_intro",
  intro_hook: "ai_isnt_broken_intro",
  path_choice: "evaluate_structure_path",
  structural_coherence_explainer: "eval_passage",
  measures_structured_environments: "structure_passage",
  about_measures_registry: "about_measures_registry",
  ai_operations_assessment_landing: "ai_operations_assessment_landing",
  eval_passage: "eval_passage",
  measures_assessment: "measures_assessment",
  obsidian_to_marble_passage_video: "obsidian_to_marble_passage_video",
  map_integrity_governance: "map_integrity_governance",
  structure_passage: "structure_passage",
  structural_drift_dispatches: "structural_drift_publication",
  publication_dispatch: "publication_dispatch",
}

const STRUCTURAL_DRIFT_DISPATCHES_ROUTE = "/publication/structural_drift"
const PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7

const ROUTE_SURFACE_ALIASES: Record<string, RegisteredSurface> = {
  "/ai-operations-assessment": "measures_assessment",
  "/structural-drift": "structural_drift_dispatches",
  "/undrifted": "structural_drift_dispatches",
  "/map-integrity-governance": "map_integrity_governance",
  "/about-measures-registry": "about_measures_registry",
}

const PUBLIC_ROUTE_BY_SURFACE: Partial<Record<RegisteredSurface, string>> = {
  measures_assessment: "/ai-operations-assessment",
  about_measures_registry: "/about-measures-registry",
  map_integrity_governance: "/map-integrity-governance",
  structural_drift_dispatches: "/undrifted",
  publication_dispatch: STRUCTURAL_DRIFT_DISPATCHES_ROUTE,
}

const ROUTE_UNIT_KEYS: Record<string, string> = {
  "/": "measures_registry_root",
  "/structural-drift": "structural_drift_landing",
  "/undrifted": "undrifted_publication_landing",
  // Governed held state: renders landing_unit_missing until map_integrity_governance_landing is seated in measures_registry.
  "/map-integrity-governance": "map_integrity_governance_landing",
}

const REGISTERED_SURFACES = new Set<RegisteredSurface>(Object.keys(SURFACE_QUERY) as RegisteredSurface[])

function historyUrl(surface: RegisteredSurface) {
  const url = new URL(window.location.href)
  url.pathname = PUBLIC_ROUTE_BY_SURFACE[surface] ?? "/"
  url.searchParams.delete("surface")
  return `${url.pathname}${url.search}${url.hash}`
}

function cssImageUrl(url: string | null) {
  return url ? `url("${url.replace(/"/g, "\\\"")}")` : undefined
}

function writeHistory(method: "pushState" | "replaceState", surface: RegisteredSurface) {
  window.history[method](
    { source: HISTORY_SOURCE, surface, surface_key: SURFACE_QUERY[surface] },
    "",
    historyUrl(surface),
  )
}

function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}

function initialSurface(): RegisteredSurface | null {
  const pathname = normalizePathname(window.location.pathname)
  const routeSurface = ROUTE_SURFACE_ALIASES[pathname]
  if (routeSurface) return routeSurface
  if (pathname.startsWith(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`)) return "publication_dispatch"
  if (pathname === STRUCTURAL_DRIFT_DISPATCHES_ROUTE) return "structural_drift_dispatches"

  return null
}

export default function MeasuresRegistryRuntimeRegistered() {
  const [activeSurface, setActiveSurface] = useState<RegisteredSurface | null>(initialSurface)
  const [sections, setSections] = useState<LandingSectionRow[]>([])
  const [landingUnits, setLandingUnits] = useState<LandingUnitRow[]>([])
  const [landingUnitsLoaded, setLandingUnitsLoaded] = useState(false)
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([])
  const [designTokens, setDesignTokens] = useState<DesignTokenRow[]>([])
  const [publicationRows, setPublicationRows] = useState<PublicationRegistryRow[]>([])
  const [publicationDispatchRows, setPublicationDispatchRows] = useState<PublicationDispatchRow[]>([])
  const [mapC2Circuit, setMapC2Circuit] = useState<MapC2CircuitRow[]>([])

  const [mapCheckoutLoading, setMapCheckoutLoading] = useState(false)
  const [mapCheckoutError, setMapCheckoutError] = useState<string | null>(null)
  const [mapPaymentReturn, setMapPaymentReturn] = useState<{
    mapOrderId: string
    verifying: boolean
    schedulingReleased: boolean
    error: string | null
  } | null>(() => {
    const params = new URLSearchParams(window.location.search)
    const mapOrderId = params.get("map_order_id")
    const sessionId = params.get("session_id")
    if (mapOrderId && sessionId) {
      return { mapOrderId, verifying: true, schedulingReleased: false, error: null }
    }
    return null
  })

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
  const [evalScore, setEvalScore] = useState<number | null>(null)
  const [evalCaptureId, setEvalCaptureId] = useState<string | null>(null)
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
  const governedRouteSurfaceAppliedRef = useRef(false)

  // --- data fetch ---

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      if (supabaseConfigError) return

      const [sectionResult, landingUnitResult, mediaResult, tokenResult, publicationResult, dispatchResult, mapC2CircuitResult] =
        await Promise.all([
          supabase
            .from("measures_encounter_def")
            .select("encounter_key, display_title, metadata")
            .in("encounter_key", [...REGISTERED_ENCOUNTER_KEYS])
            .order("sequence_order", { ascending: true }),
          supabase
            .from("measures_registry")
            .select("registry_key, release_state, access_state, metadata")
            .in("registry_key", Object.values(ROUTE_UNIT_KEYS))
            .eq("is_active", true),
          supabase
            .from("measures_media_map")
            .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
            .in("campaign_key", [CAMPAIGN_KEY, "measures_registry_root_authority_v1"])
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
            .in("publication_key", ["structural_drift", "undrifted"])
            .eq("status", "published"),
          supabase
            .from("measures_publication_dispatch")
            .select("publication_key, dispatch_key, issue_number, title, dispatch_body, excerpt, seo_description, tags, primary_cta, secondary_cta, references, media_manifest, internal_route, article_url, external_url, status, published_at, metadata")
            .eq("publication_key", "undrifted")
            .eq("status", "published")
            .order("issue_number", { ascending: true }),
          supabase
            .from("map_c2_circuit")
            .select("map_circuit_key, map_pathway, evaluation_standing, applicable_standing_keys, product_name, amount_usd, currency, stripe_product_id, release_state, map_boundary, access_boundary, public_map_boundary, public_access_boundary, public_payment_boundary, deliverables")
            .eq("release_state", "active")
            .order("amount_usd", { ascending: true }),
        ])

      if (cancelled) return

      if (!sectionResult.error) setSections((sectionResult.data ?? []) as LandingSectionRow[])
      if (!landingUnitResult.error) setLandingUnits((landingUnitResult.data ?? []) as LandingUnitRow[])
      setLandingUnitsLoaded(true)
      if (!mediaResult.error) setMediaRows((mediaResult.data ?? []) as MediaRow[])
      if (!tokenResult.error) setDesignTokens((tokenResult.data ?? []) as DesignTokenRow[])
      if (!publicationResult.error) setPublicationRows((publicationResult.data ?? []) as PublicationRegistryRow[])
      if (!dispatchResult.error) setPublicationDispatchRows((dispatchResult.data ?? []) as PublicationDispatchRow[])
      if (!mapC2CircuitResult.error) setMapC2Circuit((mapC2CircuitResult.data ?? []) as MapC2CircuitRow[])
    }

    void loadData()
    return () => { cancelled = true }
  }, [])

  // --- MAP payment return verification ---

  useEffect(() => {
    if (!mapPaymentReturn?.verifying) return
    let cancelled = false

    void fetch(`/api/map/payment-status/${mapPaymentReturn.mapOrderId}`)
      .then((res) => res.json() as Promise<{ scheduling_released?: boolean; payment_status?: string; error?: string }>)
      .then((data) => {
        if (cancelled) return
        if (data.error) {
          setMapPaymentReturn((prev) => prev ? { ...prev, verifying: false, error: data.error ?? "Payment verification failed." } : null)
          return
        }
        setMapPaymentReturn((prev) =>
          prev ? { ...prev, verifying: false, schedulingReleased: data.scheduling_released === true, error: null } : null,
        )
        if (data.scheduling_released) {
          navigate("map_integrity_governance")
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMapPaymentReturn((prev) =>
            prev ? { ...prev, verifying: false, error: "Payment verification could not complete." } : null,
          )
        }
      })

    return () => { cancelled = true }
  }, [mapPaymentReturn?.verifying, mapPaymentReturn?.mapOrderId])

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

  const landingUnitMap = useMemo(
    () => new Map(landingUnits.map((unit) => [unit.registry_key, unit])),
    [landingUnits],
  )

  const activeRouteUnitKey = ROUTE_UNIT_KEYS[normalizePathname(window.location.pathname)] ?? null
  const activeRouteUnit = activeRouteUnitKey ? landingUnitMap.get(activeRouteUnitKey) ?? null : null
  const undriftedLandingUnit = landingUnitMap.get("undrifted_publication_landing") ?? null
  const activeRouteDefaultSurface = ROUTE_SURFACE_ALIASES[normalizePathname(window.location.pathname)] ?? null

  function governedSurface(unit: LandingUnitRow | null, metadataKey: string) {
    const surface = asString(unit?.metadata?.[metadataKey])
    return surface && REGISTERED_SURFACES.has(surface as RegisteredSurface) ? surface as RegisteredSurface : null
  }

  const rootRouteUnit = landingUnitMap.get("measures_registry_root") ?? null

  function rootStructureNode(key: string) {
    return asRecord(asRecord(rootRouteUnit?.metadata?.encounter_structure)?.[key])
  }

  function governedNodeSurface(node: Record<string, unknown> | null, metadataKey: string) {
    const surface = asString(node?.[metadataKey])
    return surface && REGISTERED_SURFACES.has(surface as RegisteredSurface) ? surface as RegisteredSurface : null
  }

  useEffect(() => {
    if (governedRouteSurfaceAppliedRef.current) return
    const surface = governedSurface(activeRouteUnit, "runtime_surface")
    if (surface && activeSurface !== surface) {
      governedRouteSurfaceAppliedRef.current = true
      navigate(surface)
      return
    }
    if (surface) governedRouteSurfaceAppliedRef.current = true
  }, [activeRouteUnit, activeSurface])

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
    if (!activeSurface) return
    if (activeRouteDefaultSurface === activeSurface) return
    if (navigationSourceRef.current === "history") {
      // Surface was set by popstate — browser already updated URL; just reset ref
      navigationSourceRef.current = "app"
      return
    }
    const state = window.history.state
    if (state?.source === HISTORY_SOURCE && state.surface === activeSurface) return
    const method = state?.source === HISTORY_SOURCE ? "pushState" : "replaceState"
    writeHistory(method, activeSurface)
  }, [activeRouteDefaultSurface, activeSurface])

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state?.source !== HISTORY_SOURCE || !event.state.surface) return
      navigationSourceRef.current = "history"
      setActiveSurface(event.state.surface as RegisteredSurface)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  // /structural-drift is a deprecated alias. Redirect to the active /undrifted public route.
  useEffect(() => {
    if (window.location.pathname === "/structural-drift") {
      window.location.replace("/undrifted")
    }
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

  // Carry-forward DB resolution: if MAP surface loads without session-state evalReport but a
  // capture ID exists (user navigated back or page reloaded mid-session), reconstruct from DB.
  useEffect(() => {
    if (activeSurface !== "map_integrity_governance") return
    if (evalReport || !evalCaptureId) return
    let cancelled = false
    void supabase
      .from("measures_iis_eval_gate1_capture")
      .select("id, metadata")
      .eq("id", evalCaptureId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (cancelled || fetchError || !data) return
        const binding = asRecord(asRecord(data.metadata)?.assessment_result_binding)
        const report = binding?.environmental_standing_report as EnvironmentalStandingReport | undefined
        const cf = asRecord(asRecord(data.metadata)?.carry_forward)
        if (report) setEvalReport(report)
        if (cf) {
          setEvalFields((prev) => ({
            ...prev,
            institution_name: asString(cf.organization_name) || prev.institution_name || "",
            ai_deployment_status: asString(cf.current_ai_usage) || prev.ai_deployment_status || "",
          }))
        }
      })
    return () => { cancelled = true }
  }, [activeSurface, evalCaptureId, evalReport])

  // --- derived copy ---

  const introCopy = sectionCopy(sectionMap.get("ai_isnt_broken_intro"))
  const pathChoiceCopy = sectionCopy(sectionMap.get("evaluate_structure_path"))
  const evalPassageCopy = sectionCopy(sectionMap.get("eval_passage"))
  const evaluationChamberCopy = sectionCopy(sectionMap.get("measures_assessment"))
  const obsidianToMarblePassageCopy = sectionCopy(sectionMap.get("obsidian_to_marble_passage_video"))
  const structurePassageCopy = sectionCopy(sectionMap.get("structure_passage"))
  const aboutMeasuresRegistryCopy = sectionCopy(sectionMap.get("about_measures_registry"))
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
  const undriftedPublication = publicationRows.find((row) => row.publication_key === "undrifted") ?? null
  const structuralDriftDispatches = publicationDispatchRows.filter((row) => row.publication_key === "undrifted")
  const selectedDispatchKey = window.location.pathname.startsWith(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`)
    ? window.location.pathname.slice(`${STRUCTURAL_DRIFT_DISPATCHES_ROUTE}/`.length)
    : null
  const selectedPublicationDispatch =
    structuralDriftDispatches.find((row) => row.dispatch_key === selectedDispatchKey) ??
    structuralDriftDispatches[0] ??
    null

  // --- media URLs ---

  const epigraphVideoUrl = mediaUrl(mediaMap.get("intro_hook_video"))
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
  const aboutMeasuresRegistryVideoUrl = mediaUrl(mediaMap.get("about_measures_registry_video"))
  const officialCodexstoneSealUrl = mediaUrl(mediaMap.get("official_codexstone_seal"))
  const agentsWithKeysCoverUrl = mediaUrl(mediaMap.get("agents_with_keys_cover"))
  const fablesAndMythsCoverUrl = mediaUrl(mediaMap.get("fables_and_myths_cover"))
  const beforeThePathwayVideoUrl = mediaUrl(mediaMap.get("before_the_pathway_obsidian_to_marble_passage_video"))
  const structuredEnvironmentPassageVideoUrl =
    mediaUrl(mediaMap.get("structured_environment_passage_video")) ??
    mediaUrl(mediaMap.get("measures_structured_enviroments"))
  const marbleToneUrl =
    mediaUrl(mediaMap.get("marble_tone")) ??
    mediaUrl(mediaMap.get("installation_tone_marble")) ??
    mediaUrl(mediaMap.get("installation_tone_marble_rise_return_v1"))

  const obsidianContactVisualUrl = mediaUrl(mediaMap.get("obsidian_contact_surface_visual"))
  const obsidianAssessmentVisualUrl = mediaUrl(mediaMap.get("obsidian_assessment_surface_visual"))
  const obsidianEvalResultVisualUrl = mediaUrl(mediaMap.get("obsidian_eval_result_surface_visual"))

  const launchMediaStyle = useMemo(() => {
    const style = { ...registryTokenStyle } as Record<string, string>
    const obsidianSource = cssImageUrl(thresholdLeftStillUrl)
    const crystalSource = cssImageUrl(thresholdRightStillUrl)
    const lapisSource = cssImageUrl(pathChoiceBackgroundUrl)
    if (obsidianSource) style["--registry-obsidian-source-image"] = obsidianSource
    if (crystalSource) style["--registry-crystal-source-image"] = crystalSource
    if (lapisSource) style["--registry-lapis-source-image"] = lapisSource
    return style as CSSProperties
  }, [pathChoiceBackgroundUrl, registryTokenStyle, thresholdLeftStillUrl, thresholdRightStillUrl])

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

  function normalizeAssessmentWebsite(value: string | undefined): string {
    const trimmed = value?.trim() ?? ""
    return /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed
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

      const normalizedWebsite = normalizeAssessmentWebsite(evalFields.website)

      const { data: captureData, error } = await supabase.from("measures_iis_eval_gate1_capture").insert({
        institution_name: evalFields.institution_name?.trim() ?? "",
        institution_address: normalizedWebsite,
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
          carry_forward: {
            source_surface: "measures_assessment",
            passage_surface: "obsidian_to_marble_passage_video",
            destination_surface: "map_integrity_governance",
            destination_legacy_alias: "marble_pathway_reveal",
            environment_score: evalScore,
            circuit_identification: evalReport.standing_key,
            continuation_pathway: evalReport.continuation_pathway,
            organization_name: evalFields.institution_name?.trim() ?? "",
            contact_name: evalFields.contact_name?.trim() ?? "",
            contact_email: evalFields.contact_email?.trim() ?? "",
            current_ai_usage: evalFields.ai_deployment_status?.trim() ?? "",
            state: "carried_forward",
          },
          oar1_trace: {
            objective: "Carry completed assessment standing into governed review.",
            action: "Assessment result computed; contact submitted; durable carry-forward created; assessment standing bound for passage.",
            result: "Assessment standing ready for MAP circuit review.",
            source_oar2: "oar2_deactivate_deprecated_eval_residue_and_seat_obsidian_to_marble_carry_forward_v1",
            carry_forward_version: "1",
          },
          assessment_result_binding: {
            environmental_standing_report: evalReport,
            institution_name: evalFields.institution_name?.trim() ?? "",
            organization_type: evalFields.organization_type?.trim() ?? "",
            contact_name: evalFields.contact_name?.trim() ?? "",
            contact_email: evalFields.contact_email?.trim() ?? "",
            role_title: evalFields.role_title?.trim() ?? "",
            website: normalizedWebsite || null,
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
          passage_autoloads_after_submit: true,
        },
      }).select("id").single()

      setEvalSubmitting(false)

      if (error) {
        setEvalError("Evaluation could not be seated. Please try again.")
        return
      }

      if (captureData?.id) setEvalCaptureId(captureData.id)
      setEvalSubmitted(true)
      navigate("obsidian_to_marble_passage_video")
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
    setEvalScore(interpretation.score)
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
      publication_key: undriftedPublication?.publication_key ?? "undrifted",
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

  // --- MAP payment ---

  async function handleProceedToMapPayment(paymentOption: MapC2CircuitRow) {
    setMapCheckoutLoading(true)
    setMapCheckoutError(null)

    try {
      const origin = window.location.origin
      const successUrl = `${origin}/map-integrity-governance`
      const cancelUrl = `${origin}/map-integrity-governance`

      const response = await fetch("/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          evaluation_result_id: evalReport?.standing_key ?? null,
          map_standing: evalReport?.standing_key ?? paymentOption.evaluation_standing,
          map_pathway: paymentOption.map_pathway,
          contact_email: evalFields.contact_email ?? "",
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      })

      const data = (await response.json()) as { checkout_url?: string; error?: string }

      if (!response.ok || !data.checkout_url) {
        setMapCheckoutError(data.error ?? "Payment could not be initiated.")
        setMapCheckoutLoading(false)
        return
      }

      window.location.href = data.checkout_url
    } catch {
      setMapCheckoutError("Payment could not be initiated. Please try again.")
      setMapCheckoutLoading(false)
    }
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
    const rootFooterContract = asRecord(rootRouteUnit?.metadata?.footer_contract)
    const footerCopy = (() => {
      if (!activeSurface) return []
      const activeCopy = sectionCopy(sectionMap.get(SURFACE_QUERY[activeSurface]))
      const contract = activeCopy.footerContract
      const lines = asStringArray(contract?.copy_lines)
      if (lines.length > 0) return lines

      const copyright = asString(contract?.copyright)
      const systemStatement = asString(contract?.system_statement)
      const operatorStatement = asString(contract?.operator_statement)
      return [copyright, systemStatement, operatorStatement].filter((line): line is string => Boolean(line))
    })()

    const branchPrefix = asString(rootFooterContract?.copy_prefix)
    const branchLabel = asString(rootFooterContract?.link_label)
    const branchUrl = asString(rootFooterContract?.link_url)
    const branchStanding = asString(rootFooterContract?.link_standing)

    if (footerCopy.length === 0 && !branchPrefix && !branchLabel) return null

    return (
      <footer
        className="registry-system-footer"
        data-layout-contract="footer"
        data-release-standing="system_frame"
      >
        {footerCopy.map((line) => (
          <p key={line}>{line}</p>
        ))}
        {branchPrefix && branchLabel ? (
          <p className="registry-footer-branch" data-link-standing={branchStanding ?? undefined}>
            {branchPrefix}
            {branchUrl ? <a href={branchUrl}>{branchLabel}</a> : <span>{branchLabel}</span>}
          </p>
        ) : null}
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
    obsidianContactVisualUrl,
    obsidianAssessmentVisualUrl,
    obsidianEvalResultVisualUrl,
    registryWatermarkUrl,
    registryTokenStyle: launchMediaStyle,
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
  const routeCtaSurface = governedSurface(activeRouteUnit, "cta_surface")
  const introHookNode = rootStructureNode("intro_hook")
  const pathChoiceNode = rootStructureNode("path_choice")
  const leftChoiceNode = asRecord(pathChoiceNode?.left)
  const rightChoiceNode = asRecord(pathChoiceNode?.right)
  const explainerNode = rootStructureNode("structural_coherence_explainer")
  const structuredEnvironmentNode = rootStructureNode("measures_structured_environments")

  if (activeRouteUnitKey && !landingUnitsLoaded) {
    activeSurfaceElement = (
      <main className="measures-registry-runtime" data-surface="root_authority_loading" data-release-standing="loading_registry_authority" style={launchMediaStyle}>
        <section className="registry-held-state" role="status"><p>Resolving registry authority.</p></section>
      </main>
    )
  } else if (activeRouteUnitKey && landingUnitsLoaded && !activeRouteUnit) {
    activeSurfaceElement = (
      <main
        className="measures-registry-runtime"
        data-surface="landing_unit_missing"
        data-material-family="obsidian"
        data-layout-contract="missing_governed_route"
        data-release-standing="missing_registry_state"
        style={launchMediaStyle}
      >
        {renderHeader({ title: "Measures Registry" })}
        <section className="registry-held-state registry-assessment-contract-held" role="status" aria-live="polite">
          <span>Governed route metadata</span>
          <h2>Landing page registry unit is not seated.</h2>
          <p>{activeRouteUnitKey} is required before this route may render as public truth.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  } else if (activeSurface === "intro_hook" || activeSurface === "intro") {
    activeSurfaceElement = (
      <RegisteredIntro
        registryTokenStyle={launchMediaStyle}
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
        thresholdCopy={pathChoiceCopy}
        onEpigraphEnter={() => setEpigraphEntered(true)}
        onEpigraphMuteToggle={() => setEpigraphMuted((current) => !current)}
        onEpigraphSkip={() => {
          const next = governedNodeSurface(introHookNode, "next_surface")
          if (next) navigate(next)
        }}
        onEpigraphError={() => setEpigraphFailed(true)}
        onEpigraphEnd={() => {
          const next = governedNodeSurface(introHookNode, "next_surface")
          if (next) navigate(next)
        }}
        onThresholdMotionSettled={(side) =>
          setThresholdMotionSettled((current) =>
            current[side] ? current : { ...current, [side]: true },
          )
        }
        onLeftChoice={() => { const next = governedNodeSurface(leftChoiceNode, "next_surface"); if (next) navigate(next) }}
        onRightChoice={() => { const next = governedNodeSurface(rightChoiceNode, "next_surface"); if (next) navigate(next) }}
      />
    )
  } else if (activeSurface === "path_choice") {
    activeSurfaceElement = (
      <RegisteredPathChoice
        registryTokenStyle={launchMediaStyle}
        pathChoiceCopy={pathChoiceCopy}
        pathChoiceBackgroundUrl={pathChoiceBackgroundUrl}
        leftHeroUrl={thresholdLeftStillUrl}
        rightHeroUrl={thresholdRightStillUrl}
        registryMarkUrl={registryMarkUrl}
        onLeftChoice={() => { const next = governedNodeSurface(leftChoiceNode, "next_surface"); if (next) navigate(next) }}
        onRightChoice={() => { const next = governedNodeSurface(rightChoiceNode, "next_surface"); if (next) navigate(next) }}
      />
    )
  } else if (activeSurface === "ai_operations_assessment_landing") {
    activeSurfaceElement = (
      <RegisteredAssessmentLanding
        registryTokenStyle={launchMediaStyle}
        landingUnit={activeRouteUnit}
        renderHeader={() => renderHeader({ title: "Measures Registry" })}
        renderSystemFooter={renderSystemFooter}
        onAssessEnvironment={() => navigate(governedSurface(activeRouteUnit, "cta_surface") ?? "eval_passage")}
      />
    )
  } else if (activeSurface === "structural_coherence_explainer" || activeSurface === "eval_passage") {
    activeSurfaceElement = (
      <RegisteredPassage
        variant="eval"
        registryTokenStyle={launchMediaStyle}
        passageCopy={evalPassageCopy}
        passageVideoUrl={explainerVideoUrl}
        passageMuted={passageMuted}
        routeShell={activeRouteUnitKey === "ai_operations_assessment_landing" ? activeRouteUnitKey : null}
        renderHeader={() => renderHeader(evalPassageCopy.header)}
        renderSystemFooter={renderSystemFooter}
        onContinue={() => {
          const next = activeSurface === "structural_coherence_explainer"
            ? governedNodeSurface(explainerNode, "next_surface")
            : routeCtaSurface
          if (next) navigate(next)
        }}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "measures_structured_environments" || activeSurface === "structure_passage") {
    activeSurfaceElement = (
      <RegisteredPublicUnderstand
        registryTokenStyle={launchMediaStyle}
        structurePassageCopy={structurePassageCopy}
        talkingHeadVideoUrl={structuredEnvironmentPassageVideoUrl}
        passageMuted={passageMuted}
        renderHeader={() => renderHeader(structurePassageCopy.header)}
        renderSystemFooter={renderSystemFooter}
        onContinue={() => {
          const next = activeSurface === "measures_structured_environments"
            ? governedNodeSurface(structuredEnvironmentNode, "next_surface")
            : null
          if (next) navigate(next)
        }}
        onToggleMuted={() => setPassageMuted((current) => !current)}
      />
    )
  } else if (activeSurface === "about_measures_registry") {
    activeSurfaceElement = (
      <RegisteredAboutMeasuresRegistry
        registryTokenStyle={launchMediaStyle}
        aboutCopy={aboutMeasuresRegistryCopy}
        videoUrl={aboutMeasuresRegistryVideoUrl}
        sealUrl={officialCodexstoneSealUrl}
        renderHeader={() => renderHeader(aboutMeasuresRegistryCopy.header)}
        renderSystemFooter={renderSystemFooter}
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
      <main
        className="measures-registry-runtime"
        data-surface="obsidian_to_marble_passage_video"
        data-material-family="obsidian"
        data-layout-contract="passage"
        data-release-standing="held_continuation"
        style={launchMediaStyle}
      >
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
                playsInline
                preload="auto"
                aria-label="Before the Pathway"
                onEnded={() => navigate("map_integrity_governance")}
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
            <button type="button" onClick={() => navigate("map_integrity_governance")}>{passageCtaLabel}</button>
            <button type="button" onClick={() => setPassageMuted((current) => !current)}>
              {passageMuted ? "Audio" : "Mute"}
            </button>
          </div>
        </section>
        {renderSystemFooter()}
      </main>
    )
  } else if (activeSurface === "map_integrity_governance") {
    activeSurfaceElement = (
      <MarbleCommerceDirectory
        registryTokenStyle={launchMediaStyle}
        evalReport={evalReport}
        organizationName={evalFields.institution_name?.trim() || null}
        currentAiUsage={evalFields.ai_deployment_status?.trim() || null}
        conditionTraces={conditionTraces}
        environmentScore={evalScore}
        mapC2Circuit={mapC2Circuit}
        checkoutLoading={mapCheckoutLoading}
        checkoutError={mapCheckoutError}
        paymentReturn={mapPaymentReturn}
        marbleAccentReferenceUrl={marbleAccentReferenceUrl}
        renderHeader={() => renderHeader({ title: "Measures Registry" })}
        renderSystemFooter={renderSystemFooter}
        onProceedToPayment={handleProceedToMapPayment}
      />
    )
  } else if (activeSurface === "structural_drift_dispatches" || activeSurface === "publication_dispatch") {
    activeSurfaceElement = (
      <RegisteredStructuralDrift
        registryTokenStyle={launchMediaStyle}
        variant={activeSurface === "publication_dispatch" ? "article" : "index"}
        routePath={window.location.pathname}
        structuralDriftCopy={structuralDriftCopy}
        publicationLandingUnit={activeRouteUnitKey === "undrifted_publication_landing" || activeRouteUnitKey === "structural_drift_landing" ? undriftedLandingUnit : null}
        undriftedPublication={undriftedPublication}
        structuralDriftPublication={structuralDriftPublication}
        structuralDriftDispatches={structuralDriftDispatches}
        selectedPublicationDispatch={selectedPublicationDispatch}
        evalReport={evalReport}
        publicationEmail={publicationEmail}
        publicationOrganization={publicationOrganization}
        publicationSubmitting={publicationSubmitting}
        publicationStatus={publicationStatus}
        publicationError={publicationError}
        onBeginEvaluation={() => navigate(routeCtaSurface ?? "measures_assessment")}
        onContinueToAssessmentPackage={() => navigate(routeCtaSurface ?? "eval_passage")}
        onGoToEvalPassage={() => navigate(routeCtaSurface ?? "eval_passage")}
        onAboutMeasuresRegistry={() => navigate("about_measures_registry")}
        questionsUngovernedVideoUrl={questionsUngovernedSystemsVideoUrl}
        agentsWithKeysCoverUrl={agentsWithKeysCoverUrl}
        fablesAndMythsCoverUrl={fablesAndMythsCoverUrl}
        onPublicationEmailChange={setPublicationEmail}
        onPublicationOrganizationChange={setPublicationOrganization}
        onSubmitSubscription={submitPublicationSubscription}
        renderSystemFooter={renderSystemFooter}
      />
    )
  } else {
    activeSurfaceElement = (
      <main className="measures-registry-runtime" data-surface="missing_root_authority" data-release-standing="held_missing_registry_authority" style={launchMediaStyle}>
        <section className="registry-held-state" role="status"><p>Root route authority is not seated.</p></section>
      </main>
    )
  }

  return (
    <>
      {renderMarbleToneContinuity()}
      {activeSurfaceElement}
    </>
  )
}
