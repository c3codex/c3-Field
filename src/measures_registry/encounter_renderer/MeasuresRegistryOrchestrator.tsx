import "./styles/registry.encounter.css"
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react"
import type { MaterialIdentity } from "./types/encounterRendererTypes"
import type { CSSProperties } from "react"
import { supabase } from "@/integrations/supabase/client"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import { useRegistryResolver } from "./resolver/registryResolver"
import EncounterEntry from "./EncounterEntry"
import type { AssessmentCapturePayload, AssessmentCaptureResult } from "./chambers/ObsidianChamberRenderer"
import type { ConnectCapturePayload } from "./chambers/CrystalSeatRenderer"
import type { SubscriptionCapturePayload } from "./chambers/LapisChamberRenderer"
import type { MapPaymentParams } from "./chambers/MarbleChamberRenderer"
import type { EncounterSurface } from "./types/encounterRendererTypes"
import { cssTokenName } from "./shared/encounterRendererUtils"
import RegisteredPrivacy from "./legal/RegisteredPrivacy"
import RegisteredTerms from "./legal/RegisteredTerms"
import EnterSeatSurface from "../EnterSeatSurface"
import { MapPortalSurface } from "../MapPortalSurface"
// Lazy — internal diagnostic surface (899 lines), not part of any typical visitor path.
const GovernanceAuditSurface = lazy(() => import("../governance/GovernanceAuditSurface"))

// FREE — Frontend Replacement Encounter Environment.
// Top-level orchestrator. Owns navigation, URL sync, token style, and DB capture callbacks.
// Delegates determination and rendering to EncounterEntry → EncounterBoundary → ChamberRouter.
// Does not infer authority. Does not bypass EncounterBoundary.

type OrchestratorSurface = EncounterSurface | "privacy" | "terms" | "governance_audit" | "enter_seat" | "map_portal"

const SURFACE_MATERIAL: Partial<Record<OrchestratorSurface, MaterialIdentity>> = {
  crystal_seat_threshold: "crystal",
  crystal_seat_orientation: "crystal",
  crystal_seat_encounter: "crystal",
  lapis_chamber_encounter: "lapis",
  obsidian_chamber_orientation: "obsidian",
  obsidian_chamber_encounter_surface: "obsidian",
  obsidian_chamber_C1_compact: "obsidian",
  marble_chamber_orientation: "marble",
  marble_chamber_encounter: "marble",
  marble_chamber_results: "marble",
  marble_chamber_C2_compact: "marble",
  marble_chamber_C2_agreement: "marble",
  marble_chamber_C2_resolution: "marble",
}

const MATERIAL_TONE_ROLE: Record<MaterialIdentity, string> = {
  crystal: "crystal_tone",
  lapis: "lapis_tone",
  obsidian: "obsidian_tone",
  marble: "marble_tone",
}

const MATERIAL_TONE_VOLUME: Record<MaterialIdentity, number> = {
  crystal: 0.035,
  lapis: 0.03,
  obsidian: 0.025,
  marble: 0.02,
}

// Tones held — ambient audio competes with video audio unlock on mobile browsers.
// Re-enable by setting to false once video audio and tone coexistence is verified.
const TONES_HELD = true

const HISTORY_SOURCE = "measures_registry_free"

const ROUTE_SURFACE_MAP: Record<string, OrchestratorSurface> = {
  "/ai-operations-assessment": "obsidian_chamber_encounter_surface",
  "/structural-drift": "lapis_chamber_encounter",
  "/undrifted": "lapis_chamber_encounter",
  "/undrifted/field-findings-2026-w28": "lapis_chamber_encounter",
  "/undrifted/ai-agents-are-not-entering-empty-systems": "lapis_chamber_encounter",
  "/map-integrity-governance": "marble_chamber_C2_compact", // legacy_route_alias — retained for Stripe cancel_url dependency
  "/about": "crystal_seat_encounter",
  "/about-measures-registry": "crystal_seat_encounter",
  "/privacy": "privacy",
  "/terms": "terms",
  "/governance-audit": "governance_audit",
  "/enter-seat": "enter_seat",
  "/seat-portal": "enter_seat",
  "/map-portal": "map_portal",
}

const PUBLIC_ROUTE_BY_SURFACE: Partial<Record<OrchestratorSurface, string>> = {
  obsidian_chamber_encounter_surface: "/ai-operations-assessment",
  crystal_seat_encounter: "/about",
  marble_chamber_C2_compact: "/map-integrity-governance",
  lapis_chamber_encounter: "/undrifted",
  publication_dispatch: "/publication/structural_drift",
  privacy: "/privacy",
  terms: "/terms",
  governance_audit: "/governance-audit",
  enter_seat: "/seat-portal",
  map_portal: "/map-portal",
  crystal_seat_intro: "/",
  crystal_seat_threshold: "/",
  crystal_seat_orientation: "/",
}

function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}

function initialSurface(): OrchestratorSurface {
  const url = new URL(window.location.href)
  const pathname = normalizePathname(url.pathname)
  if (url.searchParams.get("payment") === "success") return "marble_chamber_C2_resolution"
  const mapped = ROUTE_SURFACE_MAP[pathname]
  if (mapped) return mapped
  // publication_dispatch deprecated (OAR2 "Deprecate Stale Publication Dispatch Surface") —
  // /undrifted is the active governed publication index; route all /publication/structural_drift*
  // paths there rather than to the unprofiled publication_dispatch surface.
  if (pathname === "/publication/structural_drift" || pathname.startsWith("/publication/structural_drift/")) {
    return "lapis_chamber_encounter"
  }
  return "crystal_seat_intro"
}

function historyUrl(surface: OrchestratorSurface): string {
  const url = new URL(window.location.href)
  url.pathname = PUBLIC_ROUTE_BY_SURFACE[surface] ?? "/"
  url.searchParams.delete("surface")
  return `${url.pathname}${url.search}${url.hash}`
}

function writeHistory(method: "pushState" | "replaceState", surface: OrchestratorSurface) {
  window.history[method](
    { source: HISTORY_SOURCE, surface },
    "",
    historyUrl(surface),
  )
}

function normalizeWebsite(value: string | undefined): string {
  const trimmed = value?.trim() ?? ""
  return /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed
}

export default function MeasuresRegistryOrchestrator() {
  const resolverData = useRegistryResolver()
  const [activeSurface, setActiveSurface] = useState<OrchestratorSurface>(initialSurface)
  const ambientAudioRef = useRef<HTMLAudioElement>(null)
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [toneBlocked, setToneBlocked] = useState(false)

  const navigationSourceRef = useRef<"app" | "history">("app")
  const activeRouteDefaultSurface = ROUTE_SURFACE_MAP[normalizePathname(window.location.pathname)] ?? null

  // Redirect legacy /structural-drift alias
  useEffect(() => {
    if (window.location.pathname === "/structural-drift") {
      window.location.replace("/undrifted")
    }
  }, [])

  // URL sync
  useEffect(() => {
    if (activeRouteDefaultSurface === activeSurface) return
    if (navigationSourceRef.current === "history") {
      navigationSourceRef.current = "app"
      return
    }
    const state = window.history.state
    if (state?.source === HISTORY_SOURCE && state.surface === activeSurface) return
    const method = state?.source === HISTORY_SOURCE ? "pushState" : "replaceState"
    writeHistory(method, activeSurface)
  }, [activeRouteDefaultSurface, activeSurface])

  // popstate
  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      if (event.state?.source !== HISTORY_SOURCE || !event.state.surface) return
      navigationSourceRef.current = "history"
      setActiveSurface(event.state.surface as OrchestratorSurface)
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const registryTokenStyle = useMemo<CSSProperties>(() => {
    const style: Record<string, string> = {}
    for (const token of resolverData.designTokenRows) {
      if (token.is_active === false) continue
      style[cssTokenName(token.token_key, token.media_query)] = token.token_value
    }
    return style as CSSProperties
  }, [resolverData.designTokenRows])

  const registryMarkUrl = useMemo(() => {
    const row = resolverData.mediaRows.find(
      (r) => r.media_role === "registry_mark" && r.is_active !== false,
    )
    if (!row) return null
    const meta = row.metadata as Record<string, unknown> | null
    const publicUrl = typeof meta?.public_url === "string" ? meta.public_url : null
    const exactUrl = typeof meta?.exact_url_seated === "string" ? meta.exact_url_seated : null
    return publicUrl ?? exactUrl ?? null
  }, [resolverData.mediaRows])

  const toneUrlByMaterial = useMemo(() => {
    const map = {} as Record<MaterialIdentity, string | null>
    for (const material of ["crystal", "lapis", "obsidian", "marble"] as MaterialIdentity[]) {
      const role = MATERIAL_TONE_ROLE[material]
      const row = resolverData.mediaRows.find((r) => r.media_role === role && r.is_active !== false)
      if (!row) { map[material] = null; continue }
      const meta = row.metadata as Record<string, unknown> | null
      map[material] = resolveRuntimeMediaUrl({
        publicUrl: typeof meta?.exact_url_seated === "string" ? meta.exact_url_seated : null,
        bucketName: row.storage_bucket,
        storagePath: row.storage_path,
      })
    }
    return map
  }, [resolverData.mediaRows])

  const activeMaterial = SURFACE_MATERIAL[activeSurface] ?? null
  const activeToneUrl = TONES_HELD ? null : (activeMaterial ? (toneUrlByMaterial[activeMaterial] ?? null) : null)
  const activeToneVolume = activeMaterial ? MATERIAL_TONE_VOLUME[activeMaterial] : 0.08

  useEffect(() => {
    const el = ambientAudioRef.current
    if (!el) return

    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }

    if (!activeToneUrl) {
      if (!el.paused) {
        fadeRef.current = setInterval(() => {
          if (!ambientAudioRef.current) return
          const v = Math.max(0, ambientAudioRef.current.volume - 0.005)
          ambientAudioRef.current.volume = v
          if (v === 0) {
            clearInterval(fadeRef.current!)
            fadeRef.current = null
            ambientAudioRef.current.pause()
          }
        }, 50)
      }
      return () => {
        if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null }
      }
    }

    const target = activeToneVolume
    el.pause()
    el.src = activeToneUrl
    el.volume = 0
    el.loop = true
    el.load()
    void el.play().then(() => {
      setToneBlocked(false)
      fadeRef.current = setInterval(() => {
        if (!ambientAudioRef.current) return
        const v = Math.min(target, ambientAudioRef.current.volume + 0.005)
        ambientAudioRef.current.volume = v
        if (v >= target) {
          clearInterval(fadeRef.current!)
          fadeRef.current = null
        }
      }, 50)
    }).catch(() => {
      setToneBlocked(true)
    })

    return () => {
      if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null }
    }
  }, [activeToneUrl, activeToneVolume])

  // Document title — resolved from surface assignment → encounter_def → display_title.
  // Never falls back to static index.html title.
  useEffect(() => {
    if (resolverData.loading) return
    const LEGAL_TITLES: Partial<Record<OrchestratorSurface, string>> = {
      privacy: "Privacy Policy — Measures Registry",
      terms: "Terms of Use — Measures Registry",
      governance_audit: "Measures Registry Governance Audit",
    }
    if (activeSurface in LEGAL_TITLES) {
      document.title = LEGAL_TITLES[activeSurface as keyof typeof LEGAL_TITLES]!
      return
    }
    const assignment = resolverData.surfaceAssignmentRows.find((r) => r.surface_key === activeSurface)
    if (!assignment?.encounter_key) return
    const def = resolverData.encounterDefRows.find((r) => r.encounter_key === assignment.encounter_key)
    if (def?.display_title) document.title = def.display_title
  }, [activeSurface, resolverData.loading, resolverData.surfaceAssignmentRows, resolverData.encounterDefRows])

  function navigate(surface: OrchestratorSurface) {
    navigationSourceRef.current = "app"
    setActiveSurface(surface)
  }

  function renderHeader({ title }: { title: string }) {
    return (
      <header className="registry-public-header" aria-label={title}>
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" loading="eager" /> : null}
          {title ? <span>{title}</span> : null}
        </div>
        <nav className="registry-public-nav" aria-label="Measures Registry navigation">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("crystal_seat_intro") }}>Home</a>
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate("crystal_seat_encounter") }}>About</a>
          <a
            href="/ai-operations-assessment"
            onClick={(e) => { e.preventDefault(); navigate("obsidian_chamber_encounter_surface") }}
          >
            Assess the Environment
          </a>
          <a href="/undrifted" onClick={(e) => { e.preventDefault(); navigate("lapis_chamber_encounter") }}>
            Understand the Environment
          </a>
        </nav>
      </header>
    )
  }

  function renderSystemFooter() {
    const encounterDef = resolverData.encounterDefRows.find(
      (r) => r.encounter_key === activeSurface || r.encounter_key === "ai_isnt_broken_intro",
    )
    const meta = encounterDef?.metadata as Record<string, unknown> | null
    const footerContract = meta?.footer_contract as Record<string, unknown> | null
    const copyLines = Array.isArray(footerContract?.copy_lines)
      ? (footerContract.copy_lines as unknown[]).filter((l): l is string => typeof l === "string")
      : []

    return (
      <footer
        className="registry-system-footer"
        data-layout-contract="footer"
        data-release-standing="system_frame"
      >
        {copyLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <nav className="registry-footer-legal-links" aria-label="Legal">
          <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("privacy") }}>Privacy</a>
          <span aria-hidden="true">·</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("terms") }}>Terms</a>
          <span aria-hidden="true">·</span>
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate("crystal_seat_encounter") }}>Contact</a>
        </nav>
        <nav className="registry-footer-social-links" aria-label="Measures Registry public profiles">
          <a href="https://twitter.com/measures_c3" target="_blank" rel="me noreferrer">X</a>
          <a href="https://instagram.com/measures_registry" target="_blank" rel="me noreferrer">Instagram</a>
          {/* LinkedIn removed per OAR2 "Resolve Final Launch Blockers" — prior link did not
              resolve to a valid business profile. Restore only once a real profile is seated;
              do not substitute a personal LinkedIn without explicit operator approval. */}
          <a href="https://paragraph.com/@undrifted" target="_blank" rel="me noreferrer">unDrifted / Paragraph</a>
        </nav>
      </footer>
    )
  }

  async function onCaptureAssessment(payload: AssessmentCapturePayload): Promise<AssessmentCaptureResult> {
    try {
      const response = await fetch("/api/submit-assessment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await response.json()) as AssessmentCaptureResult
      if (!response.ok || data.error) {
        return { error: data.error || `Server returned ${response.status}` }
      }
      return { ...data, error: null }
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) }
    }
  }

  async function onCaptureConnect(payload: ConnectCapturePayload): Promise<{ error: string | null }> {
    const fields = payload.fields
    const { error } = await supabase.from("measures_registry_connect_capture").insert({
      name: fields.name?.trim() ?? "",
      organization: fields.organization?.trim() ?? "",
      email: fields.email?.trim() ?? "",
      message: fields.message?.trim() || null,
      capture_context: "about_measures_registry_connect",
      notification_state: "queued",
      metadata: {
        source_surface: "about_measures_registry",
        source_runtime: "free_encounter_renderer_v1",
      },
    })
    return { error: error?.message ?? null }
  }

  async function onInitiateMapPayment({ mapPathway, mapStanding, contactEmail }: MapPaymentParams): Promise<{ error: string | null }> {
    const origin = window.location.origin
    try {
      const response = await fetch("/api/map/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          evaluation_result_id: null,
          map_standing: mapStanding,
          map_pathway: mapPathway,
          contact_email: contactEmail,
          success_url: `${origin}/map-integrity-governance?payment=success`,
          cancel_url: `${origin}/map-integrity-governance`,
        }),
      })
      const data = (await response.json()) as { checkout_url?: string; error?: string }
      if (data.checkout_url) {
        window.location.href = data.checkout_url
        return { error: null }
      }
      return { error: data.error ?? "Payment could not be initiated." }
    } catch {
      return { error: "Payment could not be initiated. Please try again." }
    }
  }

  async function onCaptureSubscription(payload: SubscriptionCapturePayload): Promise<{ error: string | null }> {
    const { error } = await supabase.from("measures_registry_connect_capture").insert({
      email: payload.email,
      organization: payload.organization ?? null,
      capture_context: payload.dispatchKey ?? "lapis_subscription",
      notification_state: "queued",
      metadata: {
        source_surface: "structural_drift_dispatches",
        source_runtime: "free_encounter_renderer_v1",
        dispatch_key: payload.dispatchKey,
      },
    })
    return { error: error?.message ?? null }
  }

  if (activeSurface === "privacy") {
    return (
      <RegisteredPrivacy
        registryTokenStyle={registryTokenStyle}
        renderHeader={() => renderHeader({ title: "Measures Registry" })}
        renderSystemFooter={renderSystemFooter}
      />
    )
  }

  if (activeSurface === "terms") {
    return (
      <RegisteredTerms
        registryTokenStyle={registryTokenStyle}
        renderHeader={() => renderHeader({ title: "Measures Registry" })}
        renderSystemFooter={renderSystemFooter}
      />
    )
  }

  if (activeSurface === "governance_audit") {
    return (
      <Suspense fallback={null}>
        <GovernanceAuditSurface />
      </Suspense>
    )
  }

  if (activeSurface === "enter_seat") {
    return (
      <EnterSeatSurface
        renderHeader={() => renderHeader({ title: "Measures Registry" })}
        renderSystemFooter={renderSystemFooter}
      />
    )
  }

  function handleEnableTone() {
    const el = ambientAudioRef.current
    if (!el || !activeToneUrl) return
    el.volume = 0
    void el.play().then(() => {
      setToneBlocked(false)
      if (fadeRef.current) { clearInterval(fadeRef.current); fadeRef.current = null }
      const target = activeToneVolume
      fadeRef.current = setInterval(() => {
        if (!ambientAudioRef.current) return
        const v = Math.min(target, ambientAudioRef.current.volume + 0.005)
        ambientAudioRef.current.volume = v
        if (v >= target) {
          clearInterval(fadeRef.current!)
          fadeRef.current = null
        }
      }, 50)
    })
  }

  return (
    <>
      <audio
        ref={ambientAudioRef}
        aria-hidden="true"
        style={{ position: "fixed", width: 0, height: 0, opacity: 0, pointerEvents: "none" }}
      />
      {toneBlocked && activeToneUrl ? (
        <button
          onClick={handleEnableTone}
          aria-label="About site tones"
          style={{
            position: "fixed",
            bottom: "4.5rem",
            right: "1rem",
            zIndex: 50,
            background: "transparent",
            border: "1px solid currentColor",
            borderRadius: "2rem",
            padding: "0.3rem 0.7rem",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            cursor: "pointer",
            opacity: 0.4,
            color: "inherit",
          }}
        >
          About Site Tones
        </button>
      ) : null}
      <EncounterEntry
        activeSurface={activeSurface}
        resolverData={resolverData}
        registryTokenStyle={registryTokenStyle}
        onNavigate={navigate}
        onCaptureAssessment={onCaptureAssessment}
        onCaptureConnect={onCaptureConnect}
        onCaptureSubscription={onCaptureSubscription}
        onInitiateMapPayment={onInitiateMapPayment}
        renderHeader={renderHeader}
        renderSystemFooter={renderSystemFooter}
      />
    </>
  )
}
