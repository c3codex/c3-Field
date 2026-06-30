import "./styles/registry.encounter.css"
import { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useRegistryResolver } from "./resolver/registryResolver"
import EncounterEntry from "./EncounterEntry"
import type { AssessmentCapturePayload } from "./chambers/ObsidianChamberRenderer"
import type { ConnectCapturePayload } from "./chambers/CrystalSeatRenderer"
import type { SubscriptionCapturePayload } from "./chambers/LapisChamberRenderer"
import type { MapPaymentParams } from "./chambers/MarbleChamberRenderer"
import type { EncounterSurface } from "./types/encounterRendererTypes"
import { cssTokenName } from "./shared/encounterRendererUtils"
import RegisteredPrivacy from "./legal/RegisteredPrivacy"
import RegisteredTerms from "./legal/RegisteredTerms"

// FREE — Frontend Replacement Encounter Environment.
// Top-level orchestrator. Owns navigation, URL sync, token style, and DB capture callbacks.
// Delegates determination and rendering to EncounterEntry → EncounterBoundary → ChamberRouter.
// Does not infer authority. Does not bypass EncounterBoundary.

type OrchestratorSurface = EncounterSurface | "privacy" | "terms"

const HISTORY_SOURCE = "measures_registry_free"

const ROUTE_SURFACE_MAP: Record<string, OrchestratorSurface> = {
  "/ai-operations-assessment": "measures_assessment",
  "/structural-drift": "structural_drift_dispatches",
  "/undrifted": "structural_drift_dispatches",
  "/map-integrity-governance": "map_integrity_governance",
  "/about": "about_measures_registry",
  "/about-measures-registry": "about_measures_registry",
  "/privacy": "privacy",
  "/terms": "terms",
}

const PUBLIC_ROUTE_BY_SURFACE: Partial<Record<OrchestratorSurface, string>> = {
  measures_assessment: "/ai-operations-assessment",
  about_measures_registry: "/about",
  map_integrity_governance: "/map-integrity-governance",
  structural_drift_dispatches: "/undrifted",
  publication_dispatch: "/publication/structural_drift",
  privacy: "/privacy",
  terms: "/terms",
  intro_hook: "/",
  intro: "/",
}

function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}

function initialSurface(): OrchestratorSurface {
  const pathname = normalizePathname(window.location.pathname)
  const mapped = ROUTE_SURFACE_MAP[pathname]
  if (mapped) return mapped
  if (pathname.startsWith("/publication/structural_drift/")) return "publication_dispatch"
  if (pathname === "/publication/structural_drift") return "structural_drift_dispatches"
  return "intro_hook"
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

  function navigate(surface: OrchestratorSurface) {
    navigationSourceRef.current = "app"
    setActiveSurface(surface)
  }

  function renderHeader({ title }: { title: string }) {
    return (
      <header className="registry-public-header" aria-label={title}>
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
          {title ? <span>{title}</span> : null}
        </div>
        <nav className="registry-public-nav" aria-label="Measures Registry navigation" />
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
          <a href="/about" onClick={(e) => { e.preventDefault(); navigate("about_measures_registry") }}>Contact</a>
        </nav>
      </footer>
    )
  }

  async function onCaptureAssessment(payload: AssessmentCapturePayload): Promise<{ error: string | null }> {
    const captureId = crypto.randomUUID()
    const normalizedWebsite = normalizeWebsite(payload.allFields.website)

    const { error } = await supabase.from("measures_iis_eval_gate1_capture").insert({
      id: captureId,
      institution_name: payload.institutionName,
      institution_address: normalizedWebsite,
      institution_phone: "",
      contact_name: payload.contactName,
      contact_position: payload.allFields.role_title?.trim() ?? "",
      contact_email: payload.contactEmail,
      evaluation_answers: payload.evaluationAnswers,
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
      metadata: {
        encounter_key: "measures_ai_operational_evaluation",
        organization_type: payload.allFields.organization_type?.trim() ?? "",
        ai_deployment_status: payload.allFields.ai_deployment_status?.trim() ?? "",
        next_support_question: payload.allFields.next_support_question?.trim() || null,
        assessment_result_email_consent: payload.allFields.assessment_result_email_consent === "true",
        assessment_boundary_acknowledgment: payload.allFields.assessment_boundary_acknowledgment === "true",
        measures_registry_updates_opt_in: payload.allFields.measures_registry_updates_opt_in === "true",
        source_runtime: "free_encounter_renderer_v1",
        carry_forward: {
          source_surface: "measures_assessment",
          passage_surface: "obsidian_to_marble_passage_video",
          destination_surface: "map_integrity_governance",
          organization_name: payload.institutionName,
          contact_name: payload.contactName,
          contact_email: payload.contactEmail,
          current_ai_usage: payload.allFields.ai_deployment_status?.trim() ?? "",
          circuit_identification: payload.report?.standing_key ?? "",
          continuation_pathway: payload.report?.continuation_pathway ?? "",
          state: "carried_forward",
        },
        assessment_result_binding: {
          environmental_standing_report: payload.report,
          institution_name: payload.institutionName,
          contact_name: payload.contactName,
          contact_email: payload.contactEmail,
          role_title: payload.allFields.role_title?.trim() ?? "",
          website: normalizedWebsite || null,
          ai_deployment_status: payload.allFields.ai_deployment_status?.trim() ?? "",
          assessment_result_email_consent: payload.allFields.assessment_result_email_consent === "true",
          assessment_boundary_acknowledgment: payload.allFields.assessment_boundary_acknowledgment === "true",
          measures_registry_updates_opt_in: payload.allFields.measures_registry_updates_opt_in === "true",
          public_internal_boundary_preserved: true,
        },
        environmental_standing_report: payload.report,
        structured_email_artifact: payload.emailArtifact,
        condition_traces: payload.conditionTraces,
        contact_gated_result_delivery: true,
      },
    })

    return { error: error?.message ?? null }
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
          success_url: `${origin}/map-integrity-governance`,
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

  return (
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
  )
}
