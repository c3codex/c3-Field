import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties, FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"

const REQUIRED_SECTION_KEYS = ["landing_intro_video", "landing_path_choice"] as const
const REQUIRED_MEDIA_ROLES = ["hero_video", "path_choice_background"] as const

type SurfaceState = "intro" | "path_choice" | "orientation" | "reserve_seat"
const HISTORY_SOURCE = "measures_registry"
const SURFACE_QUERY: Record<SurfaceState, string> = {
  intro: "landing_intro_video",
  path_choice: "landing_path_choice",
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

function mediaUrl(row?: MediaRow) {
  if (!row?.storage_bucket || !row.storage_path) return null
  return supabase.storage.from(row.storage_bucket).getPublicUrl(row.storage_path).data.publicUrl
}

function sectionCopy(row?: LandingSectionRow) {
  const metadata = asRecord(row?.metadata) ?? {}
  return {
    eyebrow: asString(metadata.eyebrow),
    title: asString(metadata.title) ?? row?.display_title ?? null,
    body: asString(metadata.body),
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
        return
      }

      const [sectionResult, mediaResult] = await Promise.all([
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
      ])

      if (cancelled) return

      if (sectionResult.error || mediaResult.error) {
        setReadError("Measures Registry landing records could not be read.")
        setSections([])
        setMediaRows([])
        return
      }

      setSections(((sectionResult.data ?? []) as LandingSectionRow[]) ?? [])
      setMediaRows(((mediaResult.data ?? []) as MediaRow[]) ?? [])
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
  const showDiagnostics = new URLSearchParams(window.location.search).get("diagnostics") === "1"
  const introCopy = sectionCopy(sectionMap.get("landing_intro_video"))
  const pathChoiceCopy = sectionCopy(sectionMap.get("landing_path_choice"))
  const heroVideoUrl = mediaUrl(mediaMap.get("hero_video"))
  const pathChoiceBackgroundUrl = mediaUrl(mediaMap.get("path_choice_background"))

  function updateForm<K extends keyof ReserveSeatForm>(key: K, value: ReserveSeatForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (submitState !== "idle") setSubmitState("idle")
  }

  function actionLabel(actionKey: string) {
    const action = pathChoiceCopy.actions.find((item) => asString(item.action_key) === actionKey)
    return asString(action?.label)
  }

  function handlePathAction(actionKey: string | null) {
    if (actionKey === "reserve_seat") {
      navigateSurface("reserve_seat")
      return
    }

    if (actionKey === "explore_system") {
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
    if (missingSections.length === 0 && missingMediaRoles.length === 0 && !readError) return null

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
      </section>
    )
  }

  function renderIntroSurface() {
    return (
      <main className="measures-registry-runtime" data-surface="landing_intro_video">
        {renderCorrectionReport()}
        <section className="registry-intro-video" aria-label={introCopy.title ?? undefined}>
          {heroVideoUrl ? (
            <video
              src={heroVideoUrl}
              autoPlay
              muted
              playsInline
              onEnded={() => navigateSurface("path_choice")}
              aria-label={introCopy.title ?? "Measures Registry intro video"}
            />
          ) : null}
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
    const more = pathChoiceCopy.more
    const coherence = pathChoiceCopy.coherence
    const style = pathChoiceBackgroundUrl
      ? ({ "--path-choice-background": `url(${pathChoiceBackgroundUrl})` } as CSSProperties)
      : undefined

    return (
      <main className="measures-registry-runtime" data-surface="landing_path_choice">
        {renderCorrectionReport()}
        <section className="registry-path-choice" style={style}>
          <div className="registry-path-choice-copy">
            {pathChoiceCopy.eyebrow ? <span>{pathChoiceCopy.eyebrow}</span> : null}
            {pathChoiceCopy.title ? <h1>{pathChoiceCopy.title}</h1> : null}
            {pathChoiceCopy.body ? <p>{pathChoiceCopy.body}</p> : null}
          </div>

          <div className="registry-path-choice-contrast">
            <article data-choice="more">
              <span>{asString(more?.label)}</span>
              <p>{asString(more?.body)}</p>
            </article>
            <article data-choice="coherence">
              <span>{asString(coherence?.label)}</span>
              <p>{asString(coherence?.body)}</p>
            </article>
          </div>

          <div className="registry-path-choice-actions">
            <button type="button" onClick={() => handlePathAction("explore_system")}>
              {actionLabel("explore_system")}
            </button>
            <button type="button" onClick={() => handlePathAction("reserve_seat")}>
              {actionLabel("reserve_seat")}
            </button>
          </div>
        </section>
      </main>
    )
  }

  function renderOrientationSurface() {
    return (
      <main className="measures-registry-runtime" data-surface="orientation_placeholder">
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
      <main className="measures-registry-runtime" data-surface="reserve_seat">
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
  if (activeSurface === "orientation") return renderOrientationSurface()
  if (activeSurface === "reserve_seat") return renderReserveSeatSurface()

  return renderIntroSurface()
}
