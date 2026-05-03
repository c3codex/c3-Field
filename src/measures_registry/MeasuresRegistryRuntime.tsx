import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { supabase, supabaseConfigError } from "@/integrations/supabase/client"
import {
  DB_HELD_CODEX_SOURCE_RECORDS,
  resolveOar2Governance,
  type Oar2Governance,
} from "@/shared/c3/oar2Governance"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"

const REQUIRED_SECTION_KEYS = [
  "landing_video_hero",
  "landing_problem",
  "landing_path_choice",
  "landing_courses",
  "landing_principle",
  "landing_final_cta",
] as const

const REQUIRED_MEDIA_ROLES = [
  "hero_video",
  "hero_poster",
  "registry_mark",
  "registry_banner",
  "social_card",
  "paragraph_cover",
] as const

type RequiredSectionKey = (typeof REQUIRED_SECTION_KEYS)[number]
type RequiredMediaRole = (typeof REQUIRED_MEDIA_ROLES)[number]

type RuntimeEncounterRow = {
  metadata: Record<string, unknown> | null
}

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

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
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
    items: asStringArray(metadata.items),
  }
}

function statusText(governance: Oar2Governance) {
  if (governance.missing_paths.length > 0) return "correction_required"
  if (governance.blocked_paths.length > 0) return "blocked"
  return "routable"
}

export default function MeasuresRegistryRuntime() {
  const [runtimeMetadata, setRuntimeMetadata] = useState<Record<string, unknown> | null>(null)
  const [sections, setSections] = useState<LandingSectionRow[]>([])
  const [mediaRows, setMediaRows] = useState<MediaRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [readError, setReadError] = useState<string | null>(null)
  const [form, setForm] = useState<ReserveSeatForm>(initialReserveSeatForm)
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  )

  useEffect(() => {
    let cancelled = false

    async function loadLanding() {
      setIsLoading(true)
      setReadError(null)

      if (supabaseConfigError) {
        setReadError(supabaseConfigError)
        setSections([])
        setMediaRows([])
        setIsLoading(false)
        return
      }

      const [runtimeResult, sectionResult, mediaResult] = await Promise.all([
        supabase
          .from("measures_encounter_def")
          .select(
            `
            metadata,
            measures_registry!inner (
              registry_key
            )
          `,
          )
          .eq("measures_registry.registry_key", "measures_registry_runtime")
          .eq("encounter_key", "measures_registry_runtime")
          .single(),
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

      if (runtimeResult.error) {
        setRuntimeMetadata(null)
      } else {
        setRuntimeMetadata(
          ((runtimeResult.data as RuntimeEncounterRow | null)?.metadata ?? null) as Record<
            string,
            unknown
          > | null,
        )
      }

      if (sectionResult.error || mediaResult.error) {
        setReadError("Measures Registry landing records could not be read.")
        setSections([])
        setMediaRows([])
      } else {
        setSections(((sectionResult.data ?? []) as LandingSectionRow[]) ?? [])
        setMediaRows(((mediaResult.data ?? []) as MediaRow[]) ?? [])
      }

      setIsLoading(false)
    }

    loadLanding()

    return () => {
      cancelled = true
    }
  }, [])

  const governance = useMemo(
    () => resolveOar2Governance(runtimeMetadata ?? {}),
    [runtimeMetadata],
  )
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
  const heroVideoUrl = mediaUrl(mediaMap.get("hero_video"))
  const heroPosterUrl = mediaUrl(mediaMap.get("hero_poster"))
  const registryMarkUrl = mediaUrl(mediaMap.get("registry_mark"))
  const registryBannerUrl = mediaUrl(mediaMap.get("registry_banner"))

  function updateForm<K extends keyof ReserveSeatForm>(key: K, value: ReserveSeatForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    if (submitState !== "idle") setSubmitState("idle")
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

  function renderSection(key: RequiredSectionKey) {
    const copy = sectionCopy(sectionMap.get(key))

    if (!sectionMap.has(key)) return null

    return (
      <section className="registry-landing-section" data-section={key} key={key}>
        {copy.eyebrow ? <span>{copy.eyebrow}</span> : null}
        {copy.title ? <h2>{copy.title}</h2> : null}
        {copy.body ? <p>{copy.body}</p> : null}
        {copy.items.length > 0 ? (
          <ul>
            {copy.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </section>
    )
  }

  return (
    <main className="measures-registry-runtime">
      <section className="registry-landing-hero" data-loading={isLoading}>
        {heroVideoUrl ? (
          <video
            src={heroVideoUrl}
            poster={heroPosterUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Measures Registry launch media"
          />
        ) : heroPosterUrl ? (
          <img src={heroPosterUrl} alt="" />
        ) : null}

        <div className="registry-landing-hero-content">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" className="registry-mark" /> : null}
          <p>Measures Registry</p>
          <h1>Integrity Governance for AI Systems</h1>
          <div className="registry-landing-actions">
            <a href="#reserve-seat">Reserve Your Seat</a>
            <a href="#orientation">Explore System</a>
          </div>
        </div>
      </section>

      {registryBannerUrl ? (
        <img src={registryBannerUrl} alt="" className="registry-banner" />
      ) : null}

      {missingSections.length > 0 || missingMediaRoles.length > 0 || readError ? (
        <section className="registry-missing-records" aria-label="Missing DB records">
          <h2>Missing DB Records</h2>
          {readError ? <p>{readError}</p> : null}
          {missingSections.length > 0 ? (
            <>
              <span>measures_encounter_def.encounter_key</span>
              <ul>
                {missingSections.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            </>
          ) : null}
          {missingMediaRoles.length > 0 ? (
            <>
              <span>measures_media_map.media_role</span>
              <ul>
                {missingMediaRoles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}

      {REQUIRED_SECTION_KEYS.map(renderSection)}

      <section id="orientation" className="registry-landing-section">
        <span>Orientation</span>
        <h2>Public orientation surface pending</h2>
      </section>

      <section id="reserve-seat" className="reserve-seat-panel" aria-label="Reserve your seat">
        <div className="reserve-seat-copy">
          <span>June Cohort</span>
          <h2>Reserve Your Seat</h2>
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
            {submitState === "submitting" ? "Submitting..." : "Reserve Your Seat"}
          </button>

          {submitState === "success" ? (
            <p className="reserve-seat-success">Your seat request has been received.</p>
          ) : null}
          {submitState === "error" ? (
            <p className="reserve-seat-error">Submission failed. Please try again.</p>
          ) : null}
        </form>
      </section>

      {showDiagnostics ? (
        <section className="registry-diagnostics" aria-label="Operator diagnostics">
          <article>
            <span>Codex Sources</span>
            <strong>{`${governance.codex_source_records.length}/4 seated`}</strong>
          </article>
          <article>
            <span>OAR2 Route</span>
            <strong>{statusText(governance)}</strong>
          </article>
          <article>
            <span>Integrity Alignment</span>
            <strong>{governance.integrity_governance.alignment_status}</strong>
          </article>
          <article>
            <span>Phase Map</span>
            <strong>{governance.phase_map_state}</strong>
          </article>
          <article>
            <span>Antechamber</span>
            <strong>{governance.antechamber_state}</strong>
          </article>
          <article>
            <span>DB-held Codex Source Records</span>
            <strong>{DB_HELD_CODEX_SOURCE_RECORDS.join(", ")}</strong>
          </article>
        </section>
      ) : null}
    </main>
  )
}
