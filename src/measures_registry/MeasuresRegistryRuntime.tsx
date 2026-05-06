import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const DESIGN_REGISTRY_KEY = "measures_registry"

const REQUIRED_SECTION_KEYS = [
  "landing_root",
  "educational_diagnostic_passage",
  "landing_path_choice",
  "educate_eval_encounter",
  "cohort_conversion_encounter",
  "iis_eval_gate1",
  "understand_failure",
  "c3_field",
  "reserve_seat",
  "foundation_offering",
  "systems_offering",
  "foundation_seat_hold",
  "systems_seat_hold",
] as const
const OPERATOR_SECTION_KEYS = ["seat_hold_notification_review"] as const
const QUERY_SECTION_KEYS = [...REQUIRED_SECTION_KEYS, ...OPERATOR_SECTION_KEYS] as const
const REQUIRED_MEDIA_ROLES = [
  "epigraph_video",
  "hero_image",
  "explainer_video",
  "hero_video",
  "hero_poster",
  "path_choice_background",
  "registry_mark",
] as const
const OPTIONAL_MEDIA_ROLES = [
  "foundation_intro_video",
  "systems_intro_video",
  "c3_field_video",
  "hero_measured_image",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "paragraph_agents_of_chaos",
] as const
const QUERY_MEDIA_ROLES = [...REQUIRED_MEDIA_ROLES, ...OPTIONAL_MEDIA_ROLES] as const
const REQUIRED_DESIGN_TOKEN_KEYS = [
  "text_primary",
  "text_secondary",
  "text_muted",
  "background_obsidian",
  "panel_obsidian",
  "border_subtle",
  "accent_warm",
  "accent_cool",
  "entry_label",
  "entry_headline",
  "entry_sub",
  "body",
  "section_headline",
  "plaque_title",
  "plaque_body",
  "section_spacing_desktop",
  "section_spacing_mobile",
  "page_padding_desktop",
  "page_padding_mobile",
  "plaque_padding_desktop",
  "plaque_padding_mobile",
  "content_max_width",
  "text_max_width",
  "header_height",
  "mobile_breakpoint",
] as const

type SurfaceState =
  | "intro"
  | "educational_diagnostic_passage"
  | "path_choice"
  | "educate_eval"
  | "cohort_conversion"
  | "iis_eval_gate1"
  | "understand_failure"
  | "c3_field"
  | "reserve_seat"
  | "foundation_offering"
  | "systems_offering"
  | "foundation_seat_hold"
  | "systems_seat_hold"
  | "seat_hold_notification_review"
const HISTORY_SOURCE = "measures_registry"
const SURFACE_QUERY: Record<SurfaceState, string> = {
  intro: "landing_root",
  educational_diagnostic_passage: "educational_diagnostic_passage",
  path_choice: "landing_path_choice",
  educate_eval: "educate_eval_encounter",
  cohort_conversion: "cohort_conversion_encounter",
  iis_eval_gate1: "iis_eval_gate1",
  understand_failure: "understand_failure",
  c3_field: "c3_field",
  reserve_seat: "reserve_seat",
  foundation_offering: "foundation_offering",
  systems_offering: "systems_offering",
  foundation_seat_hold: "foundation_seat_hold",
  systems_seat_hold: "systems_seat_hold",
  seat_hold_notification_review: "seat_hold_notification_review",
}

function surfaceFromQuery(value: string | null): SurfaceState {
  const match = Object.entries(SURFACE_QUERY).find(([, queryValue]) => queryValue === value)
  return (match?.[0] as SurfaceState | undefined) ?? "intro"
}

function surfaceFromEncounterKey(value: string | null): SurfaceState | null {
  const match = Object.entries(SURFACE_QUERY).find(([, queryValue]) => queryValue === value)
  return (match?.[0] as SurfaceState | undefined) ?? null
}

type RequiredSectionKey = (typeof REQUIRED_SECTION_KEYS)[number]
type RequiredMediaRole = (typeof REQUIRED_MEDIA_ROLES)[number]

type LandingSectionRow = {
  encounter_key: string
  display_title?: string | null
  metadata: Record<string, unknown> | null
}

type MediaRow = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type?: string | null
  is_active: boolean | null
}

type DesignTokenRow = {
  token_key: string
  token_value: string
  media_query: string | null
  is_active: boolean | null
}

type SeatOfferingRow = {
  offering_key: string
  label: string
  short_label: string | null
  description: string | null
  offering_type: string
  sequence_order: number
  enrollment_state: "open" | "coming_soon" | "held" | "closed"
  hold_target_key: string | null
  offering_surface_key: string | null
  metadata: Record<string, unknown> | null
}

type CodexEntityRow = {
  entity_key: string
  entity_name: string
  entity_type: string | null
  legal_status: string | null
  jurisdiction: string | null
}

type NotificationReviewRow = {
  capture_id: string
  email: string
  offering_key: string | null
  source_encounter_key: string | null
  notification_state: string | null
  seat_lifecycle_state: string | null
  created_at: string
  notified_at: string | null
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown) {
  return typeof value === "string" ? value : null
}

function asActionArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : []
}

function asRecordArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : []
}

function mediaUrl(row?: MediaRow) {
  if (!row?.storage_bucket || !row.storage_path) return null
  return supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl
}

function cssTokenName(tokenKey: string, mediaQuery: string | null) {
  const suffix = mediaQuery ? "-mobile" : ""
  return `--registry-${tokenKey.replaceAll("_", "-")}${suffix}`
}

function sectionCopy(row?: LandingSectionRow) {
  const metadata = asRecord(row?.metadata) ?? {}
  return {
    functionLayer: asString(metadata.function_layer),
    stateExpression: asString(metadata.state_expression),
    renderer: asString(metadata.renderer),
    header: asRecord(metadata.header),
    eyebrow: asString(metadata.eyebrow),
    title: asString(metadata.title) ?? row?.display_title ?? null,
    subtitle: asString(metadata.subtitle),
    plaques: asRecordArray(metadata.plaques),
    entryLabel: asString(metadata.entry_label),
    entryHeadline: asString(metadata.entry_headline),
    entrySub: asString(metadata.entry_sub),
    breakdownBlocks: Array.isArray(metadata.breakdown_blocks)
      ? metadata.breakdown_blocks.filter((item): item is string => typeof item === "string")
      : [],
    resolutionShift: asString(metadata.resolution_shift),
    transitionStatement: asString(metadata.transition_statement),
    coreStatement: asString(metadata.core_statement),
    paragraphs: Array.isArray(metadata.paragraphs)
      ? metadata.paragraphs.filter((item): item is string => typeof item === "string")
      : [],
    sections: asRecordArray(metadata.sections),
    diagnosticText: asString(metadata.diagnostic_text),
    educationalResources: asRecordArray(metadata.educational_resources),
    evaluationEntry: asRecord(metadata.evaluation_entry),
    featuredPublication: asRecord(metadata.featured_publication),
    subscriptionEntry: asRecord(metadata.subscription_entry),
    heroPaths: asRecordArray(metadata.hero_paths),
    evaluationSections: asRecordArray(metadata.evaluation_sections),
    cohortStructure: asRecordArray(metadata.cohort_structure),
    liveStructuralReview: asRecord(metadata.live_structural_review),
    structuralDriftIndex: Array.isArray(metadata.structural_drift_index)
      ? metadata.structural_drift_index.filter((item): item is string => typeof item === "string")
      : [],
    readinessConditions: Array.isArray(metadata.readiness_conditions)
      ? metadata.readiness_conditions.filter((item): item is string => typeof item === "string")
      : [],
    recognitionTouchpoints: Array.isArray(metadata.recognition_touchpoints)
      ? metadata.recognition_touchpoints.filter((item): item is string => typeof item === "string")
      : [],
    threshold: asRecord(metadata.threshold),
    governedConversionTouchpoints: Array.isArray(metadata.governed_conversion_touchpoints)
      ? metadata.governed_conversion_touchpoints.filter((item): item is string => typeof item === "string")
      : [],
    resolutionText: asString(metadata.resolution_text),
    outcomeStatement: asString(metadata.outcome_statement),
    closingStatement: asString(metadata.closing_statement),
    entityReference: asString(metadata.entity_reference),
    fields: asRecordArray(metadata.fields),
    fieldExpressions: asRecordArray(metadata.field_expressions),
    ctaPrimary: asString(metadata.cta_primary),
    ctaSecondary: asString(metadata.cta_secondary),
    successMessage: asString(metadata.success_message),
    successSubtext: asString(metadata.success_subtext),
    offeringKey: asString(metadata.offering_key),
    dataSource: asString(metadata.data_source),
    allowedTransitions: asRecord(metadata.allowed_transitions),
    constraints: asRecord(metadata.constraints),
    capture: asRecord(metadata.capture),
    mediaRenderMode: asString(metadata.media_render_mode),
    videoMode: asString(metadata.video_mode),
    fallback: asString(metadata.fallback),
    options: asRecordArray(metadata.options),
    mediaRoles: Array.isArray(metadata.media_roles)
      ? metadata.media_roles.filter((item): item is string => typeof item === "string")
      : [],
    more: asRecord(metadata.more),
    coherence: asRecord(metadata.coherence),
    actions: asActionArray(metadata.actions),
  }
}

export default function MeasuresRegistryRuntime() {
  const [activeSurface, setActiveSurface] = useState<SurfaceState>(() =>
    surfaceFromQuery(new URLSearchParams(window.location.search).get("surface")),
  )
  const [sections, setSections] = useState<LandingSectionRow[]>([])
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([])
  const [designTokens, setDesignTokens] = useState<DesignTokenRow[]>([])
  const [seatOfferings, setSeatOfferings] = useState<SeatOfferingRow[]>([])
  const [codexEntities, setCodexEntities] = useState<CodexEntityRow[]>([])
  const [readError, setReadError] = useState<string | null>(null)
  const [holdEmail, setHoldEmail] = useState("")
  const [holdSubmitting, setHoldSubmitting] = useState(false)
  const [holdStatus, setHoldStatus] = useState<Record<string, string | null>>({})
  const [holdError, setHoldError] = useState<Record<string, string | null>>({})
  const [reviewRows, setReviewRows] = useState<NotificationReviewRow[]>([])
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewTransitioning, setReviewTransitioning] = useState<string | null>(null)
  const [reviewDispatching, setReviewDispatching] = useState<string | null>(null)
  const [operatorDispatchKey, setOperatorDispatchKey] = useState(() =>
    window.sessionStorage.getItem("measures_registry_operator_dispatch_key") ?? "",
  )
  const [epigraphEntered, setEpigraphEntered] = useState(true)
  const [epigraphMuted, setEpigraphMuted] = useState(true)
  const [epigraphFailed, setEpigraphFailed] = useState(false)
  const [landingHeroReady, setLandingHeroReady] = useState(false)
  const [thresholdMotionSettled, setThresholdMotionSettled] = useState({
    left: false,
    right: false,
  })
  const [evalFields, setEvalFields] = useState<Record<string, string>>({})
  const [evalAnswers, setEvalAnswers] = useState<Record<string, string>>({})
  const [evalSubmitting, setEvalSubmitting] = useState(false)
  const [evalSubmitted, setEvalSubmitted] = useState(false)
  const [evalError, setEvalError] = useState<string | null>(null)
  const epigraphVideoRef = useRef<HTMLVideoElement | null>(null)
  const navigationSourceRef = useRef<"app" | "history">("app")

  function historyUrl(surface: SurfaceState) {
    const url = new URL(window.location.href)
    url.searchParams.set("surface", SURFACE_QUERY[surface])
    return `${url.pathname}${url.search}${url.hash}`
  }

  function writeHistory(method: "pushState" | "replaceState", surface: SurfaceState) {
    window.history[method](
      {
        source: HISTORY_SOURCE,
        surface,
        surface_key: SURFACE_QUERY[surface],
      },
      "",
      historyUrl(surface),
    )
  }

  function navigateSurface(surface: SurfaceState) {
    if (navigationSourceRef.current === "app") {
      writeHistory("pushState", surface)
    }
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
      setActiveSurface(event.state.surface)
      window.setTimeout(() => {
        navigationSourceRef.current = "app"
      }, 0)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadLanding() {
      setReadError(null)

      if (supabaseConfigError) {
        setReadError(supabaseConfigError)
        setSections([])
        setMediaRows([])
        setDesignTokens([])
        setSeatOfferings([])
        setCodexEntities([])
        return
      }

      const [sectionResult, mediaResult, tokenResult, offeringResult] = await Promise.all([
        supabase
          .from("measures_encounter_def")
          .select("encounter_key, display_title, metadata")
          .in("encounter_key", [...QUERY_SECTION_KEYS])
          .order("sequence_order", { ascending: true }),
        supabase
          .from("measures_media_map")
          .select("media_role, storage_bucket, storage_path, mime_type, is_active")
          .eq("campaign_key", CAMPAIGN_KEY)
          .in("media_role", [...QUERY_MEDIA_ROLES])
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
      ])

      if (cancelled) return

      if (sectionResult.error || mediaResult.error || tokenResult.error || offeringResult.error) {
        setReadError("Measures Registry landing records could not be read.")
        setSections([])
        setMediaRows([])
        setDesignTokens([])
        setSeatOfferings([])
        setCodexEntities([])
        return
      }

      const nextSections = ((sectionResult.data ?? []) as LandingSectionRow[]) ?? []
      const entityReferences = Array.from(
        new Set(
          nextSections
            .map((section) => asString(asRecord(section.metadata)?.entity_reference))
            .filter((reference): reference is string => Boolean(reference)),
        ),
      )
      const entityResult =
        entityReferences.length > 0
          ? await supabase
              .from("codex_entity")
              .select("entity_key, entity_name, entity_type, legal_status, jurisdiction")
              .in("entity_key", entityReferences)
          : { data: [], error: null }

      if (cancelled) return

      setSections(nextSections)
      setMediaRows(((mediaResult.data ?? []) as MediaRow[]) ?? [])
      setDesignTokens(((tokenResult.data ?? []) as DesignTokenRow[]) ?? [])
      setSeatOfferings(((offeringResult.data ?? []) as SeatOfferingRow[]) ?? [])
      setCodexEntities(entityResult.error ? [] : (((entityResult.data ?? []) as CodexEntityRow[]) ?? []))
    }

    loadLanding()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!epigraphEntered || epigraphFailed) return
    const video = epigraphVideoRef.current
    if (!video) return

    video.muted = epigraphMuted
    void video.play().catch(() => {
      setEpigraphFailed(true)
    })
  }, [epigraphEntered, epigraphFailed, epigraphMuted])

  const sectionMap = useMemo(
    () => new Map(sections.map((section) => [section.encounter_key, section])),
    [sections],
  )
  const mediaMap = useMemo(
    () =>
      new Map(
        mediaRows
          .filter((row) => row.is_active !== false)
          .map((row) => [row.media_role, row]),
      ),
    [mediaRows],
  )
  const missingSections = REQUIRED_SECTION_KEYS.filter((key) => !sectionMap.has(key))
  const missingMediaRoles = REQUIRED_MEDIA_ROLES.filter((role) => !mediaMap.has(role))
  const activeTokenKeys = useMemo(
    () => new Set(designTokens.filter((token) => !token.media_query).map((token) => token.token_key)),
    [designTokens],
  )
  const missingDesignTokens = REQUIRED_DESIGN_TOKEN_KEYS.filter((key) => !activeTokenKeys.has(key))
  const registryTokenStyle = useMemo(() => {
    const style: Record<string, string> = {}

    for (const token of designTokens) {
      if (token.is_active === false) continue
      style[cssTokenName(token.token_key, token.media_query)] = token.token_value
    }

    return style as CSSProperties
  }, [designTokens])
  const showDiagnostics = false
  const landingRootCopy = sectionCopy(sectionMap.get("landing_root"))
  const educationalDiagnosticPassageCopy = sectionCopy(sectionMap.get("educational_diagnostic_passage"))
  const introCopy = landingRootCopy
  const pathChoiceCopy = sectionCopy(sectionMap.get("landing_path_choice"))
  const educateEvalCopy = sectionCopy(sectionMap.get("educate_eval_encounter"))
  const cohortConversionCopy = sectionCopy(sectionMap.get("cohort_conversion_encounter"))
  const iisEvalCopy = sectionCopy(sectionMap.get("iis_eval_gate1"))
  const understandFailureCopy = sectionCopy(sectionMap.get("understand_failure"))
  const c3FieldCopy = sectionCopy(sectionMap.get("c3_field"))
  const reserveSeatCopy = sectionCopy(sectionMap.get("reserve_seat"))
  const foundationOfferingCopy = sectionCopy(sectionMap.get("foundation_offering"))
  const systemsOfferingCopy = sectionCopy(sectionMap.get("systems_offering"))
  const foundationSeatHoldCopy = sectionCopy(sectionMap.get("foundation_seat_hold"))
  const systemsSeatHoldCopy = sectionCopy(sectionMap.get("systems_seat_hold"))
  const notificationReviewCopy = sectionCopy(sectionMap.get("seat_hold_notification_review"))
  const heroVideoUrl = mediaUrl(mediaMap.get("hero_video"))
  const epigraphVideoUrl = mediaUrl(mediaMap.get("epigraph_video"))
  const splitHeroImageUrl = mediaUrl(mediaMap.get("hero_image"))
  const explainerVideoUrl = mediaUrl(mediaMap.get("explainer_video"))
  const heroMeasuredImageUrl = mediaUrl(mediaMap.get("hero_measured_image"))
  const thresholdLeftStillUrl = mediaUrl(mediaMap.get("left_hero_fracture")) ?? splitHeroImageUrl
  const thresholdLeftMotionUrl = mediaUrl(mediaMap.get("left_hero_fracture_motion"))
  const thresholdRightStillUrl = mediaUrl(mediaMap.get("right_measured_hero")) ?? heroMeasuredImageUrl ?? splitHeroImageUrl
  const thresholdRightMotionUrl = mediaUrl(mediaMap.get("measured_hero_motion_graphic"))
  const agentsOfChaosImageUrl = mediaUrl(mediaMap.get("paragraph_agents_of_chaos"))
  const pathChoiceBackgroundUrl = mediaUrl(mediaMap.get("path_choice_background"))
  const registryMarkUrl = mediaUrl(mediaMap.get("registry_mark"))
  const c3FieldVideoUrl = mediaUrl(mediaMap.get("c3_field_video"))

  function actionLabel(actionKey: string, actions = pathChoiceCopy.actions) {
    const plaque = pathChoiceCopy.plaques.find(
      (item) => asString(item.action_key) === actionKey,
    )
    const action = actions.find((item) => asString(item.action_key) === actionKey)
    return asString(plaque?.action_label) ?? asString(action?.label) ?? actionKey
  }

  function actionByKey(actionKey: string | null, actions = pathChoiceCopy.actions) {
    if (!actionKey) return null
    return actions.find((item) => asString(item.action_key) === actionKey) ?? null
  }

  function formatCodexValue(value: string | null) {
    if (!value) return null
    return value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  }

  function entityRoleLabel(entityType: string | null) {
    if (entityType === "institution_in_service") return "Institution in Service"
    return formatCodexValue(entityType)
  }

  function entityByReference(entityReference: string | null) {
    if (!entityReference) return null
    return codexEntities.find((entity) => entity.entity_key === entityReference) ?? null
  }

  const loadNotificationReviewRows = async () => {
    setReviewError(null)

    const { data, error } = await supabase
      .from("measures_seat_hold_notification_review_v1")
      .select("capture_id, email, offering_key, source_encounter_key, notification_state, seat_lifecycle_state, created_at, notified_at")
      .order("created_at", { ascending: false })

    if (error) {
      setReviewRows([])
      setReviewError("Operator review records could not be read.")
      return
    }

    setReviewRows((data ?? []) as NotificationReviewRow[])
  }

  useEffect(() => {
    if (activeSurface !== "seat_hold_notification_review") return
    void loadNotificationReviewRows()
  }, [activeSurface])

  function transitionOptions(state: string | null) {
    const notificationTransitions =
      asRecord(notificationReviewCopy.allowedTransitions?.notification_state) ??
      notificationReviewCopy.allowedTransitions
    const options = notificationTransitions?.[state ?? ""]
    return Array.isArray(options)
      ? options.filter((option): option is string => typeof option === "string")
      : []
  }

  function lifecycleTransitionOptions(state: string | null) {
    const options = notificationReviewCopy.allowedTransitions?.seat_lifecycle_state
    const currentOptions = asRecord(options)?.[state ?? ""]
    return Array.isArray(currentOptions)
      ? currentOptions.filter((option): option is string => typeof option === "string")
      : []
  }

  async function transitionNotification(row: NotificationReviewRow, nextState: string) {
    const key = row.capture_id
    setReviewTransitioning(key)
    setReviewError(null)

    const { error } = await supabase.rpc("update_measures_seat_hold_notification_state", {
      p_email: row.email,
      p_source_encounter_key: row.source_encounter_key,
      p_created_at: row.created_at,
      p_next_state: nextState,
    })

    setReviewTransitioning(null)

    if (error) {
      setReviewError("Notification transition was blocked.")
      return
    }

    await loadNotificationReviewRows()
  }

  async function transitionLifecycle(row: NotificationReviewRow, nextState: string) {
    const key = row.capture_id
    setReviewTransitioning(key)
    setReviewError(null)

    const { error } = await supabase.rpc("update_measures_seat_hold_lifecycle_state", {
      p_capture_id: row.capture_id,
      p_next_state: nextState,
    })

    setReviewTransitioning(null)

    if (error) {
      setReviewError("Lifecycle transition was blocked.")
      return
    }

    await loadNotificationReviewRows()
  }

  async function dispatchNotification(row: NotificationReviewRow) {
    if (!operatorDispatchKey.trim()) {
      setReviewError("Operator dispatch key is required.")
      return
    }

    window.sessionStorage.setItem(
      "measures_registry_operator_dispatch_key",
      operatorDispatchKey.trim(),
    )

    setReviewDispatching(row.capture_id)
    setReviewError(null)

    const response = await fetch("/api/dispatch-seat-hold-notification", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-operator-dispatch-key": operatorDispatchKey.trim(),
      },
      body: JSON.stringify({
        capture_id: row.capture_id,
      }),
    })

    setReviewDispatching(null)

    if (!response.ok) {
      setReviewError("Notification dispatch was blocked.")
      return
    }

    await loadNotificationReviewRows()
  }

  function handleAction(actionKey: string | null, actions = pathChoiceCopy.actions) {
    const action = actionByKey(actionKey, actions)
    const behavior = asString(action?.behavior)
    const target = asString(action?.target_encounter_key)

    if (behavior === "route_surface" && target === "landing_root") {
      setLandingHeroReady(true)
      navigateSurface("intro")
      return
    }

    if (
      behavior === "route_surface" &&
      (target === "educational_diagnostic_passage" || actionKey === "route_educate_eval")
    ) {
      navigateSurface("educational_diagnostic_passage")
      return
    }

    if (
      behavior === "route_surface" &&
      (target === "educate_eval_encounter" || actionKey === "continue_to_evaluation")
    ) {
      navigateSurface("educate_eval")
      return
    }

    if (
      behavior === "route_surface" &&
      (target === "cohort_conversion_encounter" || actionKey === "route_cohort_conversion")
    ) {
      navigateSurface("cohort_conversion")
      return
    }

    if (
      behavior === "route_surface" &&
      (target === "iis_eval_gate1" || actionKey === "begin_evaluation")
    ) {
      navigateSurface("iis_eval_gate1")
      return
    }

    if (behavior === "route_surface" && actionKey === "route_course_review") {
      navigateSurface("reserve_seat")
      return
    }

    if (actionKey === "request_cohort_consideration") {
      navigateSurface("reserve_seat")
      return
    }

    if (behavior === "open_src_intake" || actionKey === "reserve_seat") {
      navigateSurface("reserve_seat")
      return
    }

    if (behavior === "route_surface" && target === "understand_failure") {
      navigateSurface("understand_failure")
      return
    }

    if (behavior === "route_surface" && target === "landing_path_choice") {
      navigateSurface("path_choice")
      return
    }

    if (
      behavior === "route_surface" &&
      (target === "c3_field" || target === "orientation_placeholder")
    ) {
      navigateSurface("c3_field")
      return
    }

    if (behavior === "route_surface" && target === "systems_offering") {
      navigateSurface("systems_offering")
      return
    }

    if (behavior === "route_surface" && target === "systems_seat_hold") {
      navigateSurface("systems_seat_hold")
      return
    }

    if (behavior === "route_surface" && target === "foundation_seat_hold") {
      navigateSurface("foundation_seat_hold")
      return
    }

    if (behavior === "route_surface" && target === "foundation_offering") {
      navigateSurface("foundation_offering")
    }
  }

  function renderCorrectionReport() {
    if (!showDiagnostics) return null
    if (
      missingSections.length === 0 &&
      missingMediaRoles.length === 0 &&
      missingDesignTokens.length === 0 &&
      !readError
    ) {
      return null
    }

    return (
      <section className="registry-missing-records" aria-label="Missing DB records">
        <h2>Missing DB Records</h2>
        {readError ? <p>{readError}</p> : null}
        {missingSections.length > 0 ? (
          <>
            <span>measures_encounter_def.encounter_key</span>
            <ul>
              {missingSections.map((key: RequiredSectionKey) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </>
        ) : null}
        {missingMediaRoles.length > 0 ? (
          <>
            <span>measures_media_map.media_role</span>
            <ul>
              {missingMediaRoles.map((role: RequiredMediaRole) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </>
        ) : null}
        {missingDesignTokens.length > 0 ? (
          <>
            <span>measures_design_token.token_key</span>
            <ul>
              {missingDesignTokens.map((key) => (
                <li key={key}>{key}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    )
  }

  function reportMissingClassification(surface: string, copy: ReturnType<typeof sectionCopy>) {
    if (copy.functionLayer && copy.stateExpression && copy.renderer) return false

    console.error("Measures Registry classification missing", {
      surface,
      function_layer: copy.functionLayer,
      state_expression: copy.stateExpression,
      renderer: copy.renderer,
    })

    return true
  }

  function renderHeader(headerOverride?: Record<string, unknown> | null, actionsOverride?: Record<string, unknown>[]) {
    const header = headerOverride ?? pathChoiceCopy.header
    const headerActions = asActionArray(header?.actions)
    const actions = actionsOverride ?? headerActions
    const title = asString(header?.title)

    return (
      <header className="registry-public-header" aria-label={title ?? undefined}>
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
          {title ? <span>{title}</span> : null}
        </div>
        <nav className="registry-public-nav" aria-label="Measures Registry navigation">
          {actions.map((action) => {
            const actionKey = asString(action.action_key)
            const label = asString(action.label)
            if (!actionKey || !label) return null

            return (
              <button key={actionKey} type="button" onClick={() => handleAction(actionKey, actions)}>
                {label}
              </button>
            )
          })}
        </nav>
      </header>
    )
  }

  function setEvalField(key: string, value: string) {
    setEvalFields((current) => ({ ...current, [key]: value }))
  }

  function setEvalAnswer(key: string, value: string) {
    setEvalAnswers((current) => ({ ...current, [key]: value }))
  }

  async function submitIisEvaluation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEvalSubmitting(true)
    setEvalError(null)

    const requiredFields = [
      "institution_name",
      "institution_address",
      "institution_phone",
      "contact_name",
      "contact_position",
      "contact_email",
    ]
    const missing = requiredFields.filter((field) => !evalFields[field]?.trim())

    if (missing.length > 0) {
      setEvalSubmitting(false)
      setEvalError(`Missing required fields: ${missing.join(", ")}`)
      return
    }

    const { error } = await supabase.from("measures_iis_eval_gate1_capture").insert({
      institution_name: evalFields.institution_name.trim(),
      institution_address: evalFields.institution_address.trim(),
      institution_phone: evalFields.institution_phone.trim(),
      contact_name: evalFields.contact_name.trim(),
      contact_position: evalFields.contact_position.trim(),
      contact_email: evalFields.contact_email.trim(),
      evaluation_answers: evalAnswers,
      capture_context: "iis_eval_gate1",
      intent: "system_evaluation_request",
      eligibility: {
        foundational_courses: true,
        conversion_assessment: "pending_review",
      },
      campaign_tag: "iis_eval_gate1",
      notification_state: "queued",
      confirmation_email_state: "queued",
    })

    setEvalSubmitting(false)

    if (error) {
      setEvalError("Evaluation could not be seated. Please try again.")
      return
    }

    setEvalSubmitted(true)
  }

  function renderIntroSurface() {
    if (reportMissingClassification("landing_root", landingRootCopy)) return null
    const leftAction =
      asString(landingRootCopy.heroPaths.find((path) => asString(path.side) === "left")?.action_key) ??
      "route_educate_eval"
    const rightAction =
      asString(landingRootCopy.heroPaths.find((path) => asString(path.side) === "right")?.action_key) ??
      "route_cohort_conversion"

    function settleThresholdMotion(side: "left" | "right") {
      setThresholdMotionSettled((current) =>
        current[side] ? current : { ...current, [side]: true },
      )
    }

    function renderThresholdSeat(
      side: "left" | "right",
      stillUrl: string | null,
      motionUrl: string | null,
      copy: {
        body: string
        cta: string
        actionKey: string
        ariaLabel: string
      },
    ) {
      const isSettled = thresholdMotionSettled[side] || !motionUrl

      return (
        <button
          type="button"
          className="registry-threshold-seat"
          data-side={side}
          onClick={() => handleAction(copy.actionKey, landingRootCopy.actions)}
        >
          {stillUrl ? (
            <img className="registry-threshold-still" src={stillUrl} alt="" aria-hidden="true" />
          ) : null}
          {motionUrl && !isSettled ? (
            <video
              className="registry-threshold-motion"
              src={motionUrl}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => settleThresholdMotion(side)}
              onError={() => settleThresholdMotion(side)}
              aria-label={copy.ariaLabel}
            />
          ) : null}
          <span className="registry-threshold-copy">
            <span>{copy.body}</span>
            <strong>{copy.cta}</strong>
          </span>
        </button>
      )
    }

    return (
      <main
        className="measures-registry-runtime"
        data-surface="landing_root"
        style={registryTokenStyle}
      >
        {renderCorrectionReport()}
        {!landingHeroReady ? (
          <section
            className="registry-intro-video"
            aria-label="Measures Registry epigraph"
            data-entered={epigraphEntered}
            data-failed={epigraphFailed}
          >
            {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
              <video
                ref={epigraphVideoRef}
                src={epigraphVideoUrl}
                preload="auto"
                autoPlay
                muted={epigraphMuted}
                playsInline
                onEnded={() => setLandingHeroReady(true)}
                onError={() => setEpigraphFailed(true)}
                aria-label="Measures Registry epigraph"
              />
            ) : null}
            {!epigraphEntered || epigraphFailed || !epigraphVideoUrl ? (
              <button
                type="button"
                className="registry-epigraph-enter"
                aria-label={epigraphFailed ? "Continue" : "Enter"}
                onClick={() => {
                  if (epigraphFailed || !epigraphVideoUrl) {
                    setLandingHeroReady(true)
                    return
                  }

                  setEpigraphEntered(true)
                }}
              >
                {epigraphFailed || !epigraphVideoUrl ? "Continue" : null}
              </button>
            ) : null}
            {epigraphEntered && !epigraphFailed && epigraphVideoUrl && epigraphMuted ? (
              <div className="registry-epigraph-context">
                <p>AI is not broken.</p>
                <p>The systems are.</p>
                <span>Integrity Governance begins where behavior becomes measurable.</span>
              </div>
            ) : null}
            {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
              <div className="registry-epigraph-controls">
                <button
                  type="button"
                  className="registry-epigraph-mute"
                  aria-label={epigraphMuted ? "Enable sound" : "Mute"}
                  onClick={() => setEpigraphMuted((current) => !current)}
                >
                  {epigraphMuted ? "Sound" : "Mute"}
                </button>
                <button
                  type="button"
                  className="registry-epigraph-skip"
                  onClick={() => setLandingHeroReady(true)}
                >
                  Skip
                </button>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="registry-threshold-hero" aria-label={landingRootCopy.title ?? "Measures Registry threshold"}>
            {renderThresholdSeat("left", thresholdLeftStillUrl, thresholdLeftMotionUrl, {
              body: "Complexity is scaling faster than clarity. Your systems are producing outcomes nobody can fully explain.",
              cta: "Evaluate the Environment",
              actionKey: leftAction,
              ariaLabel: "Fractured environment motion",
            })}
            <div className="registry-threshold-divide" aria-hidden="true" />
            {renderThresholdSeat("right", thresholdRightStillUrl, thresholdRightMotionUrl, {
              body: "Coherence must be structured. Measured environments produce stable and governable outcomes.",
              cta: "Structure the Environment",
              actionKey: rightAction,
              ariaLabel: "Measured environment motion",
            })}
          </section>
        )}
      </main>
    )
  }

  function renderPathChoiceSurface() {
    if (reportMissingClassification("landing_path_choice", pathChoiceCopy)) return null

    const plaques =
      pathChoiceCopy.plaques.length > 0
        ? pathChoiceCopy.plaques
        : [pathChoiceCopy.more, pathChoiceCopy.coherence].filter(
            (item): item is Record<string, unknown> => Boolean(item),
          )
    const style = pathChoiceBackgroundUrl
      ? ({ "--path-choice-background": `url(${pathChoiceBackgroundUrl})` } as CSSProperties)
      : undefined

    return (
      <main
        className="measures-registry-runtime"
        data-surface="landing_path_choice"
        style={registryTokenStyle}
      >
        {renderCorrectionReport()}
        {renderHeader()}
        <section className="registry-path-choice" style={style}>
          <div className="registry-path-choice-copy">
            {pathChoiceCopy.eyebrow ? <span>{pathChoiceCopy.eyebrow}</span> : null}
            {pathChoiceCopy.title ? <h1>{pathChoiceCopy.title}</h1> : null}
            {pathChoiceCopy.subtitle ? <p>{pathChoiceCopy.subtitle}</p> : null}
            {pathChoiceCopy.breakdownBlocks.length > 0 ? (
              <div className="registry-path-signal" aria-label="System signal">
                {pathChoiceCopy.breakdownBlocks.map((block) => (
                  <p key={block}>{block}</p>
                ))}
              </div>
            ) : null}
          </div>

          <div className="registry-path-choice-contrast">
            {plaques.map((plaque, index) => {
              const actionKey = asString(plaque.action_key)
              const title = asString(plaque.title) ?? asString(plaque.label)
              const body = asString(plaque.body)
              const side = asString(plaque.side) ?? (index === 0 ? "left" : "right")

              return (
                <button
                  key={actionKey ?? title ?? index}
                  type="button"
                  className="registry-route-plate"
                  data-choice={side}
                  onClick={() => handleAction(actionKey)}
                  disabled={!actionKey}
                >
                  <span>{title}</span>
                  <p>{body}</p>
                  {actionKey ? <strong>{actionLabel(actionKey)}</strong> : null}
                </button>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderEducationalDiagnosticPassageSurface() {
    if (reportMissingClassification("educational_diagnostic_passage", educationalDiagnosticPassageCopy)) return null

    const continueAction =
      educationalDiagnosticPassageCopy.actions.find((action) => asString(action.action_key) === "continue_to_evaluation") ??
      educationalDiagnosticPassageCopy.actions.find((action) => asString(action.target_encounter_key) === "educate_eval_encounter")

    return (
      <main
        className="measures-registry-runtime"
        data-surface="educational_diagnostic_passage"
        style={registryTokenStyle}
      >
        <section className="registry-diagnostic-passage" aria-label={educationalDiagnosticPassageCopy.title ?? undefined}>
          {explainerVideoUrl ? (
            <video
              src={explainerVideoUrl}
              autoPlay
              controls
              playsInline
              preload="auto"
              onEnded={() => navigateSurface("educate_eval")}
              aria-label="Measures Registry diagnostic passage"
            />
          ) : null}
          <div>
            {educationalDiagnosticPassageCopy.eyebrow ? <span>{educationalDiagnosticPassageCopy.eyebrow}</span> : null}
            {educationalDiagnosticPassageCopy.title ? <h1>{educationalDiagnosticPassageCopy.title}</h1> : null}
            {educationalDiagnosticPassageCopy.subtitle ? <p>{educationalDiagnosticPassageCopy.subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={() => handleAction(asString(continueAction?.action_key) ?? "continue_to_evaluation", educationalDiagnosticPassageCopy.actions)}
          >
            {asString(continueAction?.label) ?? "Continue to Evaluation"}
          </button>
        </section>
      </main>
    )
  }

  function renderEducateEvalSurface() {
    if (reportMissingClassification("educate_eval_encounter", educateEvalCopy)) return null
    const beginAction = educateEvalCopy.actions.find(
      (action) => asString(action.action_key) === "begin_evaluation",
    )
    const backAction = educateEvalCopy.actions.find(
      (action) => asString(action.action_key) === "back_landing_root",
    )
    const diagnosticText =
      educateEvalCopy.diagnosticText ??
      educateEvalCopy.subtitle ??
      "Unstable AI behavior is rarely isolated to a single output. It usually indicates missing authority, validation, implementation structure, or governance capacity inside the environment producing it."
    const resources =
      educateEvalCopy.educationalResources.length > 0
        ? educateEvalCopy.educationalResources
        : educateEvalCopy.sections
    const evaluationTitle =
      asString(educateEvalCopy.evaluationEntry?.title) ?? "Begin Structured Institutional Assessment"
    const evaluationBody =
      asString(educateEvalCopy.evaluationEntry?.body) ??
      "Enter the diagnostic intake when your institution is ready to name its AI usage scope, deployment conditions, witnessed instability, and governance gaps."
    const evaluationSignals = Array.isArray(educateEvalCopy.evaluationEntry?.signals)
      ? educateEvalCopy.evaluationEntry?.signals.filter((item): item is string => typeof item === "string")
      : [
          "AI usage scope",
          "Deployment duration",
          "Website or system structure condition",
          "Witnessed instability or ambiguity",
          "Implementation and governance gaps",
        ]
    const featuredPublication = educateEvalCopy.featuredPublication
    const publicationTitle = asString(featuredPublication?.title) ?? "Agents of Chaos"
    const publicationSubtitle =
      asString(featuredPublication?.subtitle) ??
      asString(featuredPublication?.description) ??
      "A Measures Registry publication context for recognizing system instability, authority absence, and governed evaluation need."
    const publicationUrl = asString(featuredPublication?.url)
    const publicationSource = asString(featuredPublication?.source) ?? "Paragraph"
    const publicationRelevance = asString(featuredPublication?.registry_relevance)
    const subscriptionEntry = educateEvalCopy.subscriptionEntry
    const subscriptionTitle = asString(subscriptionEntry?.title) ?? "Receive Registry Dispatches"
    const subscriptionBody =
      asString(subscriptionEntry?.body) ??
      "Subscribe for Measures Registry publication updates, diagnostic context, and institutional governance dispatches."
    const subscriptionUrl = asString(subscriptionEntry?.url) ?? publicationUrl

    return (
      <main className="measures-registry-runtime" data-surface="educate_eval_encounter" style={registryTokenStyle}>
        <section className="registry-diagnostic-encounter" aria-label={educateEvalCopy.title ?? undefined}>
          <div className="registry-diagnostic-threshold">
            {educateEvalCopy.eyebrow ? <span>{educateEvalCopy.eyebrow}</span> : null}
            {educateEvalCopy.title ? <h1>{educateEvalCopy.title}</h1> : null}
          </div>

          <section className="registry-diagnostic-recognition" aria-label="Diagnostic recognition">
            <span>Diagnostic Recognition</span>
            <p>{diagnosticText}</p>
          </section>

          <section className="registry-featured-publication" aria-label="Featured publication">
            {agentsOfChaosImageUrl ? <img src={agentsOfChaosImageUrl} alt="" /> : null}
            <div>
              <span>{publicationSource}</span>
              <h2>{publicationTitle}</h2>
              <p>{publicationSubtitle}</p>
              {publicationRelevance ? <p>{publicationRelevance}</p> : null}
              {publicationUrl ? (
                <a href={publicationUrl} target="_blank" rel="noreferrer">
                  Open Publication
                </a>
              ) : null}
            </div>
          </section>

          <section className="registry-education-resources" aria-label="Educational resources">
            <div>
              <span>Educational Grounding</span>
              <h2>Context before evaluation.</h2>
            </div>
            <div className="registry-education-resource-list">
              {resources.map((resource, index) => {
                const title = asString(resource.title) ?? asString(resource.label)
                const body = asString(resource.body) ?? asString(resource.description)
                const type = asString(resource.type)
                const href = asString(resource.href) ?? asString(resource.url)

                return (
                  <article key={title ?? body ?? index}>
                    {type ? <span>{type}</span> : null}
                    {title ? <h3>{title}</h3> : null}
                    {body ? <p>{body}</p> : null}
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer">
                        Open Resource
                      </a>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </section>

          <section className="registry-diagnostic-entry" aria-label="Evaluation entry">
            <div>
              <span>Operational Diagnostic Intake</span>
              <h2>{evaluationTitle}</h2>
              <p>{evaluationBody}</p>
            </div>
            <ul>
              {evaluationSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
            <div className="registry-diagnostic-actions">
              {beginAction ? (
                <button type="button" onClick={() => handleAction("begin_evaluation", educateEvalCopy.actions)}>
                  {asString(beginAction.label) ?? "Begin Evaluation"}
                </button>
              ) : null}
              {backAction ? (
                <button type="button" onClick={() => handleAction("back_landing_root", educateEvalCopy.actions)}>
                  {asString(backAction.label) ?? "Back"}
                </button>
              ) : null}
            </div>
          </section>

          <section className="registry-publication-subscription" aria-label="Measures Registry subscription">
            <div>
              <span>Registry Publication</span>
              <h2>{subscriptionTitle}</h2>
              <p>{subscriptionBody}</p>
            </div>
            {subscriptionUrl ? (
              <a href={subscriptionUrl} target="_blank" rel="noreferrer">
                {asString(subscriptionEntry?.label) ?? "Subscribe to Measures Registry"}
              </a>
            ) : (
              <span>{asString(subscriptionEntry?.label) ?? "Subscribe to Measures Registry"}</span>
            )}
          </section>
        </section>
      </main>
    )
  }

  function renderCohortConversionSurface() {
    if (reportMissingClassification("cohort_conversion_encounter", cohortConversionCopy)) return null
    const thresholdTitle = asString(cohortConversionCopy.threshold?.title)
    const thresholdBody = asString(cohortConversionCopy.threshold?.body)
    const liveReviewTitle = asString(cohortConversionCopy.liveStructuralReview?.title)
    const liveReviewBody = asString(cohortConversionCopy.liveStructuralReview?.body)

    return (
      <main className="measures-registry-runtime" data-surface="cohort_conversion_encounter" style={registryTokenStyle}>
        {renderHeader(null, cohortConversionCopy.actions)}
        <section className="registry-cohort-conversion" aria-label={cohortConversionCopy.title ?? undefined}>
          {heroMeasuredImageUrl ? <img src={heroMeasuredImageUrl} alt="" /> : null}
          {cohortConversionCopy.eyebrow ? <span>{cohortConversionCopy.eyebrow}</span> : null}
          {cohortConversionCopy.title ? <h1>{cohortConversionCopy.title}</h1> : null}
          {cohortConversionCopy.subtitle ? <p>{cohortConversionCopy.subtitle}</p> : null}
          {cohortConversionCopy.coreStatement ? (
            <p className="registry-cohort-core">{cohortConversionCopy.coreStatement}</p>
          ) : null}

          {cohortConversionCopy.cohortStructure.length > 0 ? (
            <div className="registry-cohort-phases" aria-label="3-Phase Cohort">
              {cohortConversionCopy.cohortStructure.map((phase) => {
                const title = asString(phase.title)
                const session = asString(phase.session)
                const failureSignature = asString(phase.failure_signature)
                const artifact = asString(phase.artifact)
                const gates = Array.isArray(phase.three_gates)
                  ? phase.three_gates.filter((item): item is string => typeof item === "string")
                  : []
                const roleContracts = Array.isArray(phase.three_ai_role_contracts)
                  ? phase.three_ai_role_contracts.filter((item): item is string => typeof item === "string")
                  : []
                const implementations = Array.isArray(phase.three_governing_implementations)
                  ? phase.three_governing_implementations.filter((item): item is string => typeof item === "string")
                  : []

                return (
                  <article key={title ?? session}>
                    {title ? <h2>{title}</h2> : null}
                    {session ? <p><strong>Session:</strong> {session}</p> : null}
                    {failureSignature ? <p><strong>Failure Signature:</strong> {failureSignature}</p> : null}
                    {artifact ? <p><strong>Artifact:</strong> {artifact}</p> : null}
                    {gates.length > 0 ? (
                      <ol>
                        {gates.map((gate) => <li key={gate}>{gate}</li>)}
                      </ol>
                    ) : null}
                    {roleContracts.length > 0 ? (
                      <ol>
                        {roleContracts.map((contract) => <li key={contract}>{contract}</li>)}
                      </ol>
                    ) : null}
                    {implementations.length > 0 ? (
                      <ol>
                        {implementations.map((implementation) => <li key={implementation}>{implementation}</li>)}
                      </ol>
                    ) : null}
                  </article>
                )
              })}
            </div>
          ) : null}

          {liveReviewTitle || liveReviewBody ? (
            <section className="registry-cohort-review">
              {liveReviewTitle ? <h2>{liveReviewTitle}</h2> : null}
              {liveReviewBody ? <p>{liveReviewBody}</p> : null}
            </section>
          ) : null}

          {cohortConversionCopy.structuralDriftIndex.length > 0 ? (
            <section>
              <h2>Structural Drift Index</h2>
              <p>No scoring system permitted.</p>
              <ul>
                {cohortConversionCopy.structuralDriftIndex.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ) : null}

          {cohortConversionCopy.readinessConditions.length > 0 ? (
            <section>
              <h2>Conversion Readiness Conditions</h2>
              <ul>
                {cohortConversionCopy.readinessConditions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>
          ) : null}

          {cohortConversionCopy.recognitionTouchpoints.length > 0 ? (
            <section>
              <h2>Recognition Circuit — 6 Touchpoints</h2>
              <ol>
                {cohortConversionCopy.recognitionTouchpoints.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </section>
          ) : null}

          {thresholdTitle || thresholdBody ? (
            <section>
              {thresholdTitle ? <h2>{thresholdTitle}</h2> : null}
              {thresholdBody ? <p>{thresholdBody}</p> : null}
            </section>
          ) : null}

          {cohortConversionCopy.governedConversionTouchpoints.length > 0 ? (
            <section>
              <h2>Governed Conversion Circuit — 6 Touchpoints</h2>
              <ol>
                {cohortConversionCopy.governedConversionTouchpoints.map((item) => <li key={item}>{item}</li>)}
              </ol>
            </section>
          ) : null}

          {cohortConversionCopy.sections.map((section) => {
            const title = asString(section.title)
            const body = asString(section.body)

            return (
              <section key={title ?? body}>
                {title ? <h2>{title}</h2> : null}
                {body ? <p>{body}</p> : null}
              </section>
            )
          })}
          <div className="registry-encounter-actions">
            {cohortConversionCopy.actions.map((action) => {
              const actionKey = asString(action.action_key)
              const label = asString(action.label)
              if (!actionKey || !label) return null

              return (
                <button key={actionKey} type="button" onClick={() => handleAction(actionKey, cohortConversionCopy.actions)}>
                  {label}
                </button>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderIisEvalGateSurface() {
    if (reportMissingClassification("iis_eval_gate1", iisEvalCopy)) return null

    return (
      <main className="measures-registry-runtime" data-surface="iis_eval_gate1" style={registryTokenStyle}>
        {renderHeader(null, iisEvalCopy.actions)}
        <section className="registry-iis-eval" aria-label={iisEvalCopy.title ?? undefined}>
          {iisEvalCopy.eyebrow ? <span>{iisEvalCopy.eyebrow}</span> : null}
          {iisEvalCopy.title ? <h1>{iisEvalCopy.title}</h1> : null}
          {iisEvalCopy.subtitle ? <p>{iisEvalCopy.subtitle}</p> : null}

          {evalSubmitted ? (
            <div className="registry-eval-resolution">
              <p>{iisEvalCopy.resolutionText}</p>
            </div>
          ) : (
            <form className="registry-iis-eval-form" onSubmit={submitIisEvaluation}>
              <fieldset>
                <legend>Institution</legend>
                {[
                  ["institution_name", "Institution Name"],
                  ["institution_address", "Institution Address"],
                  ["institution_phone", "Institution Phone"],
                ].map(([key, label]) => (
                  <label key={key}>
                    <span>{label}</span>
                    <input
                      value={evalFields[key] ?? ""}
                      onChange={(event) => setEvalField(key, event.target.value)}
                      required
                    />
                  </label>
                ))}
              </fieldset>

              <fieldset>
                <legend>Contact</legend>
                {[
                  ["contact_name", "Contact Name"],
                  ["contact_position", "Contact Position"],
                  ["contact_email", "Contact Email"],
                ].map(([key, label]) => (
                  <label key={key}>
                    <span>{label}</span>
                    <input
                      type={key === "contact_email" ? "email" : "text"}
                      value={evalFields[key] ?? ""}
                      onChange={(event) => setEvalField(key, event.target.value)}
                      required
                    />
                  </label>
                ))}
              </fieldset>

              {iisEvalCopy.evaluationSections.map((section) => {
                const title = asString(section.title)
                const questions = Array.isArray(section.questions)
                  ? section.questions.filter((item): item is string => typeof item === "string")
                  : []

                return (
                  <fieldset key={title}>
                    {title ? <legend>{title}</legend> : null}
                    {questions.map((question) => (
                      <label key={question}>
                        <span>{question}</span>
                        <textarea
                          value={evalAnswers[question] ?? ""}
                          onChange={(event) => setEvalAnswer(question, event.target.value)}
                        />
                      </label>
                    ))}
                  </fieldset>
                )
              })}

              {evalError ? <p className="registry-form-error">{evalError}</p> : null}
              <button type="submit" disabled={evalSubmitting}>
                {evalSubmitting ? "Seating Evaluation" : "Submit Evaluation"}
              </button>
            </form>
          )}
        </section>
      </main>
    )
  }

  function renderUnderstandFailureSurface() {
    if (reportMissingClassification("understand_failure", understandFailureCopy)) return null

    const actions = understandFailureCopy.actions

    return (
      <main
        className="measures-registry-runtime"
        data-surface="understand_failure"
        style={registryTokenStyle}
      >
        {renderCorrectionReport()}
        {renderHeader(understandFailureCopy.header, actions)}
        <section className="registry-encounter-surface">
          <div className="registry-encounter-entry">
            {understandFailureCopy.entryLabel ? <span>{understandFailureCopy.entryLabel}</span> : null}
            {understandFailureCopy.entryHeadline ? <h1>{understandFailureCopy.entryHeadline}</h1> : null}
            {understandFailureCopy.entrySub ? <p>{understandFailureCopy.entrySub}</p> : null}
          </div>

          <div className="registry-breakdown-grid">
            {understandFailureCopy.breakdownBlocks.map((block) => (
              <article key={block}>
                <p>{block}</p>
              </article>
            ))}
          </div>

          <div className="registry-resolution-shift">
            {understandFailureCopy.resolutionShift ? <p>{understandFailureCopy.resolutionShift}</p> : null}
            {understandFailureCopy.transitionStatement ? <h2>{understandFailureCopy.transitionStatement}</h2> : null}
          </div>

          <div className="registry-encounter-actions">
            {actions.map((action) => {
              const actionKey = asString(action.action_key)
              if (!actionKey) return null

              return (
                <button key={actionKey} type="button" onClick={() => handleAction(actionKey, actions)}>
                  {actionLabel(actionKey, actions)}
                </button>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderC3FieldSurface() {
    if (reportMissingClassification("c3_field", c3FieldCopy)) return null

    return (
      <main
        className="measures-registry-runtime"
        data-surface="c3_field"
        style={registryTokenStyle}
      >
        <section id="c3-field" className="registry-authority-surface" aria-label={c3FieldCopy.title ?? undefined}>
          {c3FieldCopy.title ? <h1>{c3FieldCopy.title}</h1> : null}
          {c3FieldCopy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {c3FieldVideoUrl ? (
            <video
              className="registry-authority-video"
              src={c3FieldVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-label="c3 Field expression"
            />
          ) : null}
          {c3FieldCopy.fieldExpressions.length > 0 ? (
            <div className="registry-field-expressions" aria-label="Field Expressions">
              <h2>Field Expressions</h2>
              {c3FieldCopy.fieldExpressions.map((expression) => {
                const name = asString(expression.name)
                const description = asString(expression.description)

                return (
                  <section key={name ?? description}>
                    {name ? <h3>{name}</h3> : null}
                    {description ? <p>{description}</p> : null}
                  </section>
                )
              })}
            </div>
          ) : null}
        </section>
      </main>
    )
  }
  function renderReserveSeatSurface() {
    if (reportMissingClassification("reserve_seat", reserveSeatCopy)) return null
    const backAction = reserveSeatCopy.actions.find(
      (action) => asString(action.action_key) === "back_to_path",
    )
    const offerings = seatOfferings

    return (
      <main
        className="measures-registry-runtime"
        data-surface="reserve_seat"
        style={registryTokenStyle}
      >
        {renderHeader(null, backAction ? [backAction] : reserveSeatCopy.actions)}
        <section id="reserve-seat" className="registry-reserve-selector" aria-label={reserveSeatCopy.entryLabel ?? undefined}>
          <div className="registry-encounter-entry">
            {reserveSeatCopy.entryLabel ? <span>{reserveSeatCopy.entryLabel}</span> : null}
            {reserveSeatCopy.entryHeadline ? <h1>{reserveSeatCopy.entryHeadline}</h1> : null}
            {reserveSeatCopy.entrySub ? <p>{reserveSeatCopy.entrySub}</p> : null}
          </div>

          {reserveSeatCopy.coreStatement ? (
            <p className="registry-offering-core">{reserveSeatCopy.coreStatement}</p>
          ) : null}

          {reserveSeatCopy.sections.length > 0 ? (
            <div className="registry-path-signal" aria-label="Governance structure">
              {reserveSeatCopy.sections.map((section) => {
                const body = asString(section.body)
                return body ? <p key={body}>{body}</p> : null
              })}
            </div>
          ) : null}

          <div className="registry-reserve-options">
            {offerings.map((offering) => {
              const isOpen = offering.enrollment_state === "open"

              return (
                <button
                  key={offering.offering_key}
                  type="button"
                  className="registry-reserve-option"
                  data-state={offering.enrollment_state}
                  disabled={!isOpen}
                  onClick={() => {
                    if (offering.offering_surface_key === "systems_offering") {
                      navigateSurface("systems_offering")
                    }

                    if (offering.offering_surface_key === "foundation_offering") {
                      navigateSurface("foundation_offering")
                    }
                  }}
                >
                  <span>{offering.label}</span>
                  {offering.description ? <p>{offering.description}</p> : null}
                  <small>{offering.enrollment_state.replaceAll("_", " ")}</small>
                </button>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderOfferingSurface(
    encounterKey: "foundation_offering" | "systems_offering",
    copy: ReturnType<typeof sectionCopy>,
    mediaRole: "foundation_intro_video" | "systems_intro_video",
  ) {
    if (reportMissingClassification(encounterKey, copy)) return null
    const offeringVideoUrl = mediaUrl(mediaMap.get(mediaRole))

    return (
      <main
        className="measures-registry-runtime"
        data-surface={encounterKey}
        style={registryTokenStyle}
      >
        {renderHeader(null, copy.actions)}
        <section className="registry-offering-surface">
          {offeringVideoUrl ? (
            <video
              src={offeringVideoUrl}
              autoPlay={copy.videoMode === "muted_autoplay"}
              muted={copy.videoMode === "muted_autoplay"}
              playsInline
            />
          ) : null}

          <div className="registry-encounter-entry">
            {copy.entryLabel ? <span>{copy.entryLabel}</span> : null}
            {copy.entryHeadline ? <h1>{copy.entryHeadline}</h1> : null}
            {copy.entrySub ? <p>{copy.entrySub}</p> : null}
          </div>

          {copy.coreStatement ? (
            <p className="registry-offering-core">{copy.coreStatement}</p>
          ) : null}

          <div className="registry-offering-sections">
            {copy.sections.map((section) => {
              const title = asString(section.title)
              const body = asString(section.body)

              return (
                <article key={title ?? body}>
                  {title ? <span>{title}</span> : null}
                  {body ? <p>{body}</p> : null}
                </article>
              )
            })}
          </div>

          {copy.outcomeStatement ? (
            <p className="registry-offering-outcome">{copy.outcomeStatement}</p>
          ) : null}

          <div className="registry-encounter-actions">
            {copy.actions.map((action) => {
              const actionKey = asString(action.action_key)
              if (!actionKey) return null

              return (
                <button
                  key={actionKey}
                  type="button"
                  onClick={() => handleAction(actionKey, copy.actions)}
                >
                  {actionLabel(actionKey, copy.actions)}
                </button>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  async function submitSeatHold(
    event: FormEvent<HTMLFormElement>,
    encounterKey: "foundation_seat_hold" | "systems_seat_hold",
    copy: ReturnType<typeof sectionCopy>,
  ) {
    event.preventDefault()

    const normalizedEmail = holdEmail.trim().toLowerCase()
    setHoldStatus((current) => ({ ...current, [encounterKey]: null }))
    setHoldError((current) => ({ ...current, [encounterKey]: null }))

    if (!normalizedEmail) {
      setHoldError((current) => ({ ...current, [encounterKey]: "Email is required." }))
      return
    }

    if (!copy.offeringKey) {
      setHoldError((current) => ({
        ...current,
        [encounterKey]: "Seat hold offering is not seated correctly.",
      }))
      return
    }

    setHoldSubmitting(true)

    const response = await fetch("/api/create-seat-hold-capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: normalizedEmail,
        offering_key: copy.offeringKey,
      }),
    })

    setHoldSubmitting(false)

    if (!response.ok) {
      setHoldError((current) => ({
        ...current,
        [encounterKey]: "Seat hold could not be recorded.",
      }))
      return
    }

    const result = (await response.json().catch(() => ({}))) as {
      hold_target_key?: string
    }
    const targetSurface = surfaceFromEncounterKey(result.hold_target_key ?? null)

    setHoldEmail("")
    setHoldStatus((current) => ({
      ...current,
      [encounterKey]: copy.successMessage ?? "Your seat hold has been recorded.",
    }))

    if (targetSurface) {
      navigateSurface(targetSurface)
    }
  }

  function renderHoldSurface(
    encounterKey: "foundation_seat_hold" | "systems_seat_hold",
    copy: ReturnType<typeof sectionCopy>,
  ) {
    if (reportMissingClassification(encounterKey, copy)) return null

    const emailField = copy.fields.find(
      (field) =>
        asString(field.key) === "email" &&
        asString(field.type) === "email" &&
        field.required === true,
    )
    const actions = copy.actions
    const backAction = actions.find((action) => asString(action.action_key) === "back_to_offering")
    const primaryLabel =
      copy.ctaPrimary ??
      asString(actions.find((action) => asString(action.action_key) === "reserve_seat_hold")?.label)
    const secondaryLabel = copy.ctaSecondary ?? asString(backAction?.label)

    return (
      <main
        className="measures-registry-runtime"
        data-surface={encounterKey}
        style={registryTokenStyle}
      >
        {renderHeader(null, backAction ? [backAction] : actions)}
        <section className="registry-hold-surface" aria-label={copy.entryLabel ?? undefined}>
          <div className="registry-encounter-entry">
            {copy.entryLabel ? <span>{copy.entryLabel}</span> : null}
            {copy.entryHeadline ? <h1>{copy.entryHeadline}</h1> : null}
            {copy.entrySub ? <p>{copy.entrySub}</p> : null}
          </div>

          <form className="registry-hold-form" onSubmit={(event) => submitSeatHold(event, encounterKey, copy)}>
            {emailField ? (
              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={holdEmail}
                  onChange={(event) => setHoldEmail(event.target.value)}
                />
              </label>
            ) : null}

            <div className="registry-encounter-actions">
              <button type="submit" disabled={holdSubmitting || !emailField}>
                {holdSubmitting ? "Reserving..." : primaryLabel}
              </button>
              {backAction ? (
                <button type="button" onClick={() => handleAction(asString(backAction.action_key), actions)}>
                  {secondaryLabel}
                </button>
              ) : null}
            </div>

            {holdStatus[encounterKey] ? (
              <p className="reserve-seat-success">
                {holdStatus[encounterKey]}
                {copy.successSubtext ? <span>{copy.successSubtext}</span> : null}
              </p>
            ) : null}
            {holdError[encounterKey] ? (
              <p className="reserve-seat-error">{holdError[encounterKey]}</p>
            ) : null}
          </form>
        </section>
      </main>
    )
  }

  function renderNotificationReviewSurface() {
    if (reportMissingClassification("seat_hold_notification_review", notificationReviewCopy)) return null

    return (
      <main
        className="measures-registry-runtime"
        data-surface="seat_hold_notification_review"
        style={registryTokenStyle}
      >
        <section className="registry-review-surface" aria-label={notificationReviewCopy.entryLabel ?? undefined}>
          <div className="registry-encounter-entry">
            {notificationReviewCopy.entryLabel ? <span>{notificationReviewCopy.entryLabel}</span> : null}
            {notificationReviewCopy.entryHeadline ? <h1>{notificationReviewCopy.entryHeadline}</h1> : null}
            {notificationReviewCopy.entrySub ? <p>{notificationReviewCopy.entrySub}</p> : null}
          </div>

          <div className="registry-review-note">
            <span>Operator only</span>
            <p>Dispatch sends one queued notification through the server-side Resend provider.</p>
          </div>

          <label className="registry-review-key">
            <span>Operator dispatch key</span>
            <input
              type="password"
              value={operatorDispatchKey}
              onChange={(event) => setOperatorDispatchKey(event.target.value)}
              autoComplete="off"
            />
          </label>

          {reviewError ? <p className="reserve-seat-error">{reviewError}</p> : null}

          <div className="registry-review-table" role="table" aria-label="Seat hold notification review">
            <div className="registry-review-row registry-review-head" role="row">
              <span role="columnheader">Email</span>
              <span role="columnheader">Offering</span>
              <span role="columnheader">Source</span>
              <span role="columnheader">Notification</span>
              <span role="columnheader">Lifecycle</span>
              <span role="columnheader">Created</span>
              <span role="columnheader">Notified</span>
              <span role="columnheader">Transitions</span>
            </div>

            {reviewRows.map((row) => {
              const options = transitionOptions(row.notification_state)
              const lifecycleOptions = lifecycleTransitionOptions(row.seat_lifecycle_state)
              const key = row.capture_id
              const canDispatch =
                row.notification_state === "queued" && row.seat_lifecycle_state === "approved"
              const hasAnyTransition = options.length > 0 || lifecycleOptions.length > 0

              return (
                <div className="registry-review-row" role="row" key={key}>
                  <span role="cell">{row.email}</span>
                  <span role="cell">{row.offering_key}</span>
                  <span role="cell">{row.source_encounter_key}</span>
                  <span role="cell">{row.notification_state}</span>
                  <span role="cell">{row.seat_lifecycle_state}</span>
                  <span role="cell">{new Date(row.created_at).toLocaleString()}</span>
                  <span role="cell">
                    {row.notified_at ? new Date(row.notified_at).toLocaleString() : "Not sent"}
                  </span>
                  <span role="cell" className="registry-review-actions">
                    {canDispatch ? (
                      <button
                        type="button"
                        disabled={reviewDispatching === key}
                        onClick={() => dispatchNotification(row)}
                      >
                        Dispatch
                      </button>
                    ) : null}
                    {options.length > 0 ? (
                      options.map((option) => (
                        <button
                          key={`notification-${option}`}
                          type="button"
                          disabled={reviewTransitioning === key || reviewDispatching === key}
                          onClick={() => transitionNotification(row, option)}
                        >
                          {option}
                        </button>
                      ))
                    ) : null}
                    {lifecycleOptions.map((option) => (
                      <button
                        key={`lifecycle-${option}`}
                        type="button"
                        disabled={reviewTransitioning === key || reviewDispatching === key}
                        onClick={() => transitionLifecycle(row, option)}
                      >
                        {option === "reviewed"
                          ? "Mark Reviewed"
                          : option.charAt(0).toUpperCase() + option.slice(1)}
                      </button>
                    ))}
                    {!hasAnyTransition && !canDispatch ? <small>No transition</small> : null}
                  </span>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  if (activeSurface === "path_choice") return renderPathChoiceSurface()
  if (activeSurface === "educational_diagnostic_passage") return renderEducationalDiagnosticPassageSurface()
  if (activeSurface === "educate_eval") return renderEducateEvalSurface()
  if (activeSurface === "cohort_conversion") return renderCohortConversionSurface()
  if (activeSurface === "iis_eval_gate1") return renderIisEvalGateSurface()
  if (activeSurface === "understand_failure") return renderUnderstandFailureSurface()
  if (activeSurface === "c3_field") return renderC3FieldSurface()
  if (activeSurface === "reserve_seat") return renderReserveSeatSurface()
  if (activeSurface === "foundation_offering") {
    return renderOfferingSurface("foundation_offering", foundationOfferingCopy, "foundation_intro_video")
  }
  if (activeSurface === "systems_offering") {
    return renderOfferingSurface("systems_offering", systemsOfferingCopy, "systems_intro_video")
  }
  if (activeSurface === "foundation_seat_hold") {
    return renderHoldSurface("foundation_seat_hold", foundationSeatHoldCopy)
  }
  if (activeSurface === "systems_seat_hold") {
    return renderHoldSurface("systems_seat_hold", systemsSeatHoldCopy)
  }
  if (activeSurface === "seat_hold_notification_review") {
    return renderNotificationReviewSurface()
  }

  return renderIntroSurface()
}
