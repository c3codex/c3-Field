import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"
const DESIGN_REGISTRY_KEY = "measures_registry"

const REQUIRED_SECTION_KEYS = [
  "landing_intro_video",
  "landing_path_choice",
  "understand_failure",
] as const
const REQUIRED_MEDIA_ROLES = [
  "hero_video",
  "hero_poster",
  "path_choice_background",
  "registry_mark",
] as const
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

type SurfaceState = "intro" | "path_choice" | "understand_failure" | "orientation" | "reserve_seat"
const HISTORY_SOURCE = "measures_registry"
const SURFACE_QUERY: Record<SurfaceState, string> = {
  intro: "landing_intro_video",
  path_choice: "landing_path_choice",
  understand_failure: "understand_failure",
  orientation: "orientation_placeholder",
  reserve_seat: "reserve_seat",
}

function surfaceFromQuery(value: string | null): SurfaceState {
  const match = Object.entries(SURFACE_QUERY).find(([, queryValue]) => queryValue === value)
  return (match?.[0] as SurfaceState | undefined) ?? "intro"
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

type ReserveSeatForm = {
  origin_type: "named_individual" | "institution_in_service"
  full_name: string
  email: string
  role_or_title: string
  institution_name: string
  interest_area: string
  course_intent: string
  message: string
}

const initialReserveSeatForm: ReserveSeatForm = {
  origin_type: "named_individual",
  full_name: "",
  email: "",
  role_or_title: "",
  institution_name: "",
  interest_area: "",
  course_intent: "",
  message: "",
}

function optionalValue(value: string) {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
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
  const [readError, setReadError] = useState<string | null>(null)
  const [form, setForm] = useState<ReserveSeatForm>(initialReserveSeatForm)
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )
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
        return
      }

      const [sectionResult, mediaResult, tokenResult] = await Promise.all([
        supabase
          .from("measures_encounter_def")
          .select("encounter_key, display_title, metadata")
          .in("encounter_key", [...REQUIRED_SECTION_KEYS])
          .order("sequence_order", { ascending: true }),
        supabase
          .from("measures_media_map")
          .select("media_role, storage_bucket, storage_path, mime_type, is_active")
          .eq("campaign_key", CAMPAIGN_KEY)
          .in("media_role", [...REQUIRED_MEDIA_ROLES])
          .order("sort_order", { ascending: true }),
        supabase
          .from("measures_design_token")
          .select("token_key, token_value, media_query, is_active")
          .eq("registry_key", DESIGN_REGISTRY_KEY)
          .eq("is_active", true),
      ])

      if (cancelled) return

      if (sectionResult.error || mediaResult.error || tokenResult.error) {
        setReadError("Measures Registry landing records could not be read.")
        setSections([])
        setMediaRows([])
        setDesignTokens([])
        return
      }

      setSections(((sectionResult.data ?? []) as LandingSectionRow[]) ?? [])
      setMediaRows(((mediaResult.data ?? []) as MediaRow[]) ?? [])
      setDesignTokens(((tokenResult.data ?? []) as DesignTokenRow[]) ?? [])
    }

    loadLanding()

    return () => {
      cancelled = true
    }
  }, [])

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
  const introCopy = sectionCopy(sectionMap.get("landing_intro_video"))
  const pathChoiceCopy = sectionCopy(sectionMap.get("landing_path_choice"))
  const understandFailureCopy = sectionCopy(sectionMap.get("understand_failure"))
  const heroVideoUrl = mediaUrl(mediaMap.get("hero_video"))
  const heroPosterUrl = mediaUrl(mediaMap.get("hero_poster"))
  const pathChoiceBackgroundUrl = mediaUrl(mediaMap.get("path_choice_background"))
  const registryMarkUrl = mediaUrl(mediaMap.get("registry_mark"))

  function updateForm<K extends keyof ReserveSeatForm>(key: K, value: ReserveSeatForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (submitState !== "idle") setSubmitState("idle")
  }

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

  function handleAction(actionKey: string | null, actions = pathChoiceCopy.actions) {
    const action = actionByKey(actionKey, actions)
    const behavior = asString(action?.behavior)
    const target = asString(action?.target_encounter_key)

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

    if (behavior === "route_surface" && target === "orientation_placeholder") {
      navigateSurface("orientation")
    }
  }

  async function handleReserveSeatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (supabaseConfigError) {
      setSubmitState("error")
      return
    }

    setSubmitState("submitting")

    const { data, error } = await supabase.rpc("submit_src_intake_request", {
      p_origin_type: form.origin_type,
      p_full_name: form.full_name.trim(),
      p_email: form.email.trim(),
      p_role_or_title: optionalValue(form.role_or_title),
      p_institution_name: optionalValue(form.institution_name),
      p_interest_area: optionalValue(form.interest_area),
      p_course_intent: optionalValue(form.course_intent),
      p_message: optionalValue(form.message),
    })

    const response = data as { ok?: boolean } | null

    if (error || response?.ok !== true) {
      setSubmitState("error")
      return
    }

    setForm(initialReserveSeatForm)
    setSubmitState("success")
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

  function renderIntroSurface() {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="landing_intro_video"
        style={registryTokenStyle}
      >
        {renderCorrectionReport()}
        <section className="registry-intro-video" aria-label={introCopy.title ?? undefined}>
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              poster={heroPosterUrl ?? undefined}
              autoPlay
              muted
              playsInline
              onEnded={() => navigateSurface("path_choice")}
              aria-label={introCopy.title ?? "Measures Registry intro video"}
            />
          ) : null}
          <div className="registry-intro-copy">
            {introCopy.title ? <h1>{introCopy.title}</h1> : null}
            {introCopy.subtitle ? <p>{introCopy.subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="registry-intro-skip"
            onClick={() => navigateSurface("path_choice")}
          >
            Skip
          </button>
        </section>
      </main>
    )
  }

  function renderPathChoiceSurface() {
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
          </div>

          <div className="registry-path-choice-contrast">
            {plaques.map((plaque, index) => {
              const actionKey = asString(plaque.action_key)
              const title = asString(plaque.title) ?? asString(plaque.label)
              const body = asString(plaque.body)

              return (
                <article key={actionKey ?? title ?? index} data-choice={asString(plaque.side)}>
                  <span>{title}</span>
                  <p>{body}</p>
                  {actionKey ? (
                    <button type="button" onClick={() => handleAction(actionKey)}>
                      {actionLabel(actionKey)}
                    </button>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      </main>
    )
  }

  function renderUnderstandFailureSurface() {
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

  function renderOrientationSurface() {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="orientation_placeholder"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section id="orientation" className="registry-landing-section">
          <span>Orientation</span>
          <h2>Public orientation surface pending</h2>
          <button type="button" onClick={() => navigateSurface("path_choice")}>
            Back to Path Choice
          </button>
        </section>
      </main>
    )
  }

  function renderReserveSeatSurface() {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="reserve_seat"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section id="reserve-seat" className="reserve-seat-panel" aria-label="Reserve your seat">
          <div className="reserve-seat-copy">
            <span>June Cohort</span>
            <h2>{actionLabel("reserve_seat")}</h2>
          </div>

          <form className="reserve-seat-form" onSubmit={handleReserveSeatSubmit}>
            <label>
              Origin
              <select
                required
                value={form.origin_type}
                onChange={(event) =>
                  updateForm(
                    "origin_type",
                    event.target.value as ReserveSeatForm["origin_type"],
                  )
                }
              >
                <option value="named_individual">Named individual</option>
                <option value="institution_in_service">Institution in service</option>
              </select>
            </label>

            <label>
              Full name
              <input
                required
                value={form.full_name}
                onChange={(event) => updateForm("full_name", event.target.value)}
                autoComplete="name"
              />
            </label>

            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                autoComplete="email"
              />
            </label>

            <label>
              Role or title
              <input
                value={form.role_or_title}
                onChange={(event) => updateForm("role_or_title", event.target.value)}
                autoComplete="organization-title"
              />
            </label>

            <label>
              Institution
              <input
                value={form.institution_name}
                onChange={(event) => updateForm("institution_name", event.target.value)}
                autoComplete="organization"
              />
            </label>

            <label>
              Interest area
              <input
                value={form.interest_area}
                onChange={(event) => updateForm("interest_area", event.target.value)}
              />
            </label>

            <label>
              Course intent
              <input
                value={form.course_intent}
                onChange={(event) => updateForm("course_intent", event.target.value)}
              />
            </label>

            <label className="reserve-seat-message">
              Message
              <textarea
                value={form.message}
                onChange={(event) => updateForm("message", event.target.value)}
              />
            </label>

            <button type="submit" disabled={submitState === "submitting"}>
              {submitState === "submitting" ? "Submitting..." : actionLabel("reserve_seat")}
            </button>
            <button type="button" onClick={() => navigateSurface("path_choice")}>
              Back to Path Choice
            </button>

            {submitState === "success" ? (
              <p className="reserve-seat-success">Your seat request has been received.</p>
            ) : null}
            {submitState === "error" ? (
              <p className="reserve-seat-error">Submission failed. Please try again.</p>
            ) : null}
          </form>
        </section>
      </main>
    )
  }

  if (activeSurface === "path_choice") return renderPathChoiceSurface()
  if (activeSurface === "understand_failure") return renderUnderstandFailureSurface()
  if (activeSurface === "orientation") return renderOrientationSurface()
  if (activeSurface === "reserve_seat") return renderReserveSeatSurface()

  return renderIntroSurface()
}
