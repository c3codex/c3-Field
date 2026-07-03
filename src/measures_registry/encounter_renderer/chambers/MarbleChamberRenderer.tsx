import { useState } from "react"
import type { CSSProperties, ReactNode } from "react"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
import type { EncounterMediaRow, EncounterSurface, RenderableEncounter } from "../types/encounterRendererTypes"
import {
  asRecord,
  asRecordArray,
  asString,
  asStringArray,
} from "../shared/encounterRendererUtils"
import { PublicAssessmentResult } from "../../PublicAssessmentResult"
import type { AssessmentEmailArtifact, EnvironmentalStandingReport } from "../../measuresAssessmentTypes"

export type MapPaymentParams = {
  mapPathway: string
  mapStanding: string
  contactEmail: string
}

export type MarbleChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onInitiateMapPayment?: (params: MapPaymentParams) => Promise<{ error: string | null }>
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

function marbleBgStyle(url: string | null): CSSProperties {
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
// No assessment logic. No payment logic. No certification logic.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function MarbleChamberRenderer(props: MarbleChamberProps) {
  const { surface } = props.encounter

  if (surface === "marble_chamber_C2_compact") {
    return <MapIntegrityGovernance {...props} />
  }
  if (surface === "marble_chamber_orientation") {
    return <MarbleOrientationSeat {...props} />
  }
  if (surface === "marble_chamber_encounter") {
    // legacy_alias_for_marble_chamber_results — forward immediately
    props.onNavigate("marble_chamber_results")
    return null
  }
  if (surface === "marble_chamber_results") {
    return <MarbleChamberEncounter {...props} />
  }
  if (surface === "marble_chamber_C2_agreement") {
    return <MarbleC2Agreement {...props} />
  }
  if (surface === "marble_chamber_C2_resolution") {
    return <MarbleC2Resolution {...props} />
  }

  // Renderer gap: surface is marble-assigned but presentation not yet seated
  return (
    <main
      className="measures-registry-runtime"
      data-surface={surface}
      data-material-family="marble"
      data-release-standing="renderer_gap"
      style={props.registryTokenStyle}
    >
      {props.renderHeader({ title: props.encounter.encounterDef?.display_title ?? "Measures Registry" })}
      <section className="registry-held-state" role="status">
        <span>Marble</span>
        <p>Presentation for marble surface <code>{surface}</code> is not yet seated.</p>
      </section>
      {props.renderSystemFooter()}
    </main>
  )
}

// --- MapCARUnit -------------------------------------------------------------
// Single expandable Contractual Acknowledgment Record unit.
// open → read → confirm → collapsed with confirmed badge.

function MapCARUnit({
  unit,
  confirmed,
  onConfirm,
}: {
  unit: Record<string, unknown>
  confirmed: boolean
  onConfirm: (key: string) => void
}) {
  const [open, setOpen] = useState(false)
  const key = asString(unit.key) ?? ""
  const title = asString(unit.title) ?? ""
  const body = asString(unit.body) ?? ""

  return (
    <div
      className={`registry-marble-car-unit${confirmed ? " registry-marble-car-unit--confirmed" : ""}`}
      data-key={key}
    >
      <button
        type="button"
        className="registry-marble-car-header"
        onClick={() => { if (!confirmed) setOpen((o) => !o) }}
        aria-expanded={open && !confirmed}
        disabled={confirmed}
      >
        <span className="registry-marble-car-title">{title}</span>
        {confirmed ? (
          <span className="registry-marble-car-status" aria-label="Confirmed">✓</span>
        ) : (
          <span className="registry-marble-car-indicator" aria-hidden="true">{open ? "−" : "+"}</span>
        )}
      </button>
      {open && !confirmed ? (
        <div className="registry-marble-car-body">
          <p>{body}</p>
          <button
            type="button"
            className="registry-marble-car-confirm"
            onClick={() => { onConfirm(key); setOpen(false) }}
          >
            I acknowledge
          </button>
        </div>
      ) : null}
    </div>
  )
}

// --- map_integrity_governance -----------------------------------------------

type MapSession = {
  report: { standing_key?: string } | null
  fields: Record<string, string>
} | null

function MapIntegrityGovernance({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const [mapSession] = useState<MapSession>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_pending_report")
      return raw ? (JSON.parse(raw) as MapSession) : null
    } catch { return null }
  })

  const standingKey = asString((mapSession?.report as Record<string, unknown> | null | undefined)?.standing_key) ?? ""

  const [confirmedCARs, setConfirmedCARs] = useState<Record<string, boolean>>({})

  const meta = asRecord(encounter.encounterDef?.metadata)
  const centerPanel = asRecord(meta?.center_panel)
  const mapFraming = asRecord(meta?.map_framing)
  const carAck = asRecord(meta?.c3_7_acknowledgment)
  const carUnits = asRecordArray(carAck?.units)
  const pathwayCards = asRecordArray(meta?.pathway_cards)
  const seatHold = asRecord(meta?.seat_hold)

  const centerHeading = asString(centerPanel?.heading) ?? asString(mapFraming?.title) ?? "MAP the Environment"
  const centerSubheading = asString(centerPanel?.subheading) ?? ""
  const carLabel = asString(carAck?.label) ?? "Acknowledgments"
  const carInstruction = asString(carAck?.instruction) ?? "Open, read, and confirm each acknowledgment to continue."
  const seatHoldBody = asString(seatHold?.body)

  const mapBgUrl = mediaUrl(encounter.mediaByRole.get("marble_map_surface"))
  const marbleRiseUrl = mediaUrl(encounter.mediaByRole.get("installation_tone_marble_rise_return_v1"))

  const next = resolveNextSurface(encounter)

  // Recommended pathway from assessment standing
  const recommendedCard = pathwayCards.find((card) => {
    const applicableKeys = asStringArray(card.applicable_standing_keys)
    return standingKey ? applicableKeys.includes(standingKey) : card.recommended === true
  }) ?? pathwayCards[0]

  const allCARsConfirmed = carUnits.length > 0 && carUnits.every((u) => confirmedCARs[asString(u.key) ?? ""] === true)

  function handleConfirmCAR(key: string) {
    setConfirmedCARs((prev) => ({ ...prev, [key]: true }))
  }

  function handleContinueToPayment() {
    if (!allCARsConfirmed) return
    const mapPathway = asString(recommendedCard?.map_pathway) ?? ""
    try {
      sessionStorage.setItem("__mreg_c2_pending", JSON.stringify({
        mapPathway,
        mapStanding: standingKey,
      }))
    } catch { /* ignore */ }
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="map_integrity_governance"
      data-material-family="marble"
      data-layout-contract="marble_map_three_panel"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...marbleBgStyle(mapBgUrl) }}
    >
      {renderHeader({ title: centerHeading })}

      <div className="registry-marble-map-layout">

        {/* LEFT — CAR Acknowledgments */}
        <aside className="registry-marble-map-car-panel" aria-label={carLabel}>
          <p className="registry-marble-car-label">{carLabel}</p>
          {carInstruction ? (
            <p className="registry-marble-car-instruction">{carInstruction}</p>
          ) : null}
          {carUnits.length > 0 ? (
            <div className="registry-marble-car-list">
              {carUnits.map((unit) => {
                const key = asString(unit.key) ?? ""
                return (
                  <MapCARUnit
                    key={key}
                    unit={unit}
                    confirmed={confirmedCARs[key] === true}
                    onConfirm={handleConfirmCAR}
                  />
                )
              })}
            </div>
          ) : (
            <p className="registry-map-assessment-required">
              Acknowledgment content is not yet seated.
            </p>
          )}
        </aside>

        {/* CENTER — MAP Overview */}
        <section className="registry-marble-map-center-panel" aria-label={centerHeading}>
          <div className="registry-marble-map-center-content">
            <h2 className="registry-marble-map-heading">{centerHeading}</h2>
            {centerSubheading ? (
              <p className="registry-marble-map-subheading">{centerSubheading}</p>
            ) : null}
            {!standingKey ? (
              <p className="registry-map-assessment-required">
                Complete the AI Operations Assessment to receive your MAP pathway determination.
              </p>
            ) : null}
            {marbleRiseUrl ? (
              <div className="registry-marble-map-visual" aria-hidden="true">
                <img src={marbleRiseUrl} alt="" />
              </div>
            ) : null}
          </div>
        </section>

        {/* RIGHT — MAP Summary & Exchange */}
        {recommendedCard ? (
          <aside className="registry-marble-map-exchange-panel" aria-label="MAP Exchange">
            <div className="registry-marble-map-exchange-content">
              <p className="registry-marble-map-exchange-label">map_pathway_standing</p>
              <strong className="registry-marble-map-exchange-title">{asString(recommendedCard.title)}</strong>
              {asString(recommendedCard.price_label) ? (
                <div className="registry-marble-map-exchange-amount">
                  <span className="registry-marble-map-exchange-standing-label">map_exchange_standing</span>
                  <strong>{asString(recommendedCard.price_label)}</strong>
                </div>
              ) : null}
              {asString(recommendedCard.map_boundary) ? (
                <p className="registry-marble-map-exchange-scope">{asString(recommendedCard.map_boundary)}</p>
              ) : null}
              {asStringArray(recommendedCard.deliverables).length > 0 ? (
                <ul className="registry-marble-map-exchange-deliverables">
                  {asStringArray(recommendedCard.deliverables).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              ) : null}
              {seatHoldBody ? (
                <p className="registry-marble-map-seat-hold">{seatHoldBody}</p>
              ) : null}
            </div>
            <div className="registry-marble-map-cta-zone">
              {!allCARsConfirmed ? (
                <p className="registry-marble-map-cta-hold">
                  Confirm all acknowledgments to continue.
                </p>
              ) : null}
              <button
                type="button"
                className="registry-marble-circuit-payment-cta"
                disabled={!allCARsConfirmed || !standingKey}
                onClick={handleContinueToPayment}
              >
                Continue to Payment
              </button>
            </div>
          </aside>
        ) : (
          <aside className="registry-marble-map-exchange-panel registry-marble-map-exchange-panel--empty" aria-label="MAP Exchange">
            <p className="registry-map-assessment-required">
              Complete the AI Operations Assessment to receive your MAP pathway.
            </p>
          </aside>
        )}

      </div>

      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_orientation ---------------------------------------------
// ASSESSMENT COMPLETE surface. Reads content_profile from encounter_def.
// Background: marble_orientation_surface. Navigate to marble_chamber_results on continue.

function MarbleOrientationSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const meta = asRecord(encounter.encounterDef?.metadata)
  const contentProfile = asRecord(meta?.content_profile)
  const eyebrow = asString(contentProfile?.eyebrow) ?? "ASSESSMENT COMPLETE"
  const title = asString(contentProfile?.title) ?? encounter.encounterDef?.display_title ?? "Assessment Complete"
  const body = asString(contentProfile?.body)
  const supporting = asString(contentProfile?.supporting)
  const statusLabel = asString(contentProfile?.status_label)
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Continue"
  const next = resolveNextSurface(encounter)

  const bgUrl = mediaUrl(encounter.mediaByRole.get("marble_orientation_surface"))
  const videoUrl = mediaUrl(encounter.mediaByRole.get("assessment_report_orientation"))

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_orientation"
      data-material-family="marble"
      data-layout-contract="marble_orientation"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(meta?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...marbleBgStyle(bgUrl) }}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-orientation-content" aria-label={title}>
        <div className="registry-marble-orientation-card">
          {videoUrl ? (
            <div className="registry-marble-orientation-video-frame">
              <video
                className="registry-marble-orientation-video"
                src={videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />
            </div>
          ) : null}
          {eyebrow ? (
            <span className="registry-marble-orientation-eyebrow">{eyebrow}</span>
          ) : null}
          <h2 className="registry-marble-orientation-title">{title}</h2>
          {body ? <p className="registry-marble-orientation-body">{body}</p> : null}
          {supporting ? <p className="registry-marble-orientation-supporting">{supporting}</p> : null}
          {statusLabel ? (
            <p className="registry-marble-orientation-status" role="status" aria-live="polite">
              {statusLabel}
            </p>
          ) : null}
          <div className="registry-marble-orientation-cta">
            <button type="button" onClick={handleContinue}>
              {ctaLabel}
            </button>
          </div>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_encounter / marble_chamber_results ----------------------
// Assessment findings report surface. Reads __mreg_pending_report from sessionStorage.
// Renders PublicAssessmentResult. Navigate to marble_chamber_C2_compact on continue.

type PendingReport = {
  report: EnvironmentalStandingReport | null
  emailArtifact: AssessmentEmailArtifact | null
  fields: Record<string, string>
  assessmentCompletion: Record<string, unknown> | null
  reportContract: Record<string, unknown> | null
}

function MarbleChamberEncounter({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const [muted, setMuted] = useState(false)
  const [pendingReport] = useState<PendingReport | null>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_pending_report")
      return raw ? (JSON.parse(raw) as PendingReport) : null
    } catch { return null }
  })

  const next = resolveNextSurface(encounter)

  const bgUrl =
    mediaUrl(encounter.mediaByRole.get("marble_results_surface")) ??
    null

  function handleBeginPathwayReview() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={encounter.surface}
      data-material-family="marble"
      data-layout-contract="findings_report"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...marbleBgStyle(bgUrl) }}
    >
      {renderHeader({ title: "Measures Registry" })}
      <section className="registry-iis-eval registry-assessment-chamber" aria-label="Assessment Evaluation Report">
        {pendingReport ? (
          <PublicAssessmentResult
            assessmentCompletion={pendingReport.assessmentCompletion}
            emailArtifact={pendingReport.emailArtifact}
            passageMuted={muted}
            report={pendingReport.report}
            reportContract={pendingReport.reportContract}
            reportFields={pendingReport.fields}
            structuredEnvironmentPassageVideoUrl={null}
            onBeginPathwayReview={handleBeginPathwayReview}
            onEnterStructuredEnvironment={handleBeginPathwayReview}
            onStructuredEnvironmentVideoEnded={handleBeginPathwayReview}
            onTogglePassageMuted={() => setMuted((m) => !m)}
          />
        ) : (
          <div className="registry-held-state" role="status">
            <p>Assessment report is not ready. Complete the AI Operations Assessment to continue.</p>
          </div>
        )}
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_C2_agreement --------------------------------------------
// Payment agreement surface. Reads selected pathway from __mreg_c2_pending.
// Calls onInitiateMapPayment with existing callback (no Stripe logic rewrite).

type C2Pending = {
  mapPathway: string
  mapStanding: string
}

function MarbleC2Agreement({
  encounter,
  registryTokenStyle,
  onNavigate,
  onInitiateMapPayment,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const [c2Pending] = useState<C2Pending | null>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_c2_pending")
      return raw ? (JSON.parse(raw) as C2Pending) : null
    } catch { return null }
  })
  const [contactEmail, setContactEmail] = useState(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_pending_report")
      if (!raw) return ""
      const parsed = JSON.parse(raw) as { fields?: Record<string, string> }
      return parsed.fields?.contact_email?.trim() ?? ""
    } catch { return "" }
  })
  const [emailInput, setEmailInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = resolveNextSurface(encounter)
  const contentProfile = asRecord(encounter.encounterDef?.metadata?.content_profile)
  const title = asString(contentProfile?.title) ?? encounter.encounterDef?.display_title ?? "Payment Agreement"
  const heldBody = asString(contentProfile?.held_body) ?? "Select a MAP pathway to continue to payment."
  const heldCtaLabel = asString(contentProfile?.held_cta_label) ?? "Return to MAP"
  const pathwayPrefix = asString(contentProfile?.pathway_prefix) ?? "Selected pathway:"
  const emailLabel = asString(contentProfile?.email_label) ?? "Email for checkout"
  const emailPlaceholder = asString(contentProfile?.email_placeholder) ?? "email@organization.com"
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Continue to Payment"
  const ctaLoadingLabel = asString(contentProfile?.cta_loading) ?? "Processing..."
  const effectiveEmail = contactEmail || emailInput.trim()

  const bgUrl =
    mediaUrl(encounter.mediaByRole.get("marble_map_surface")) ??
    null

  async function handleInitiatePayment() {
    if (!onInitiateMapPayment || !c2Pending) return
    if (!effectiveEmail) { setError("Email address is required."); return }
    setLoading(true)
    setError(null)
    const { error: payError } = await onInitiateMapPayment({
      mapPathway: c2Pending.mapPathway,
      mapStanding: c2Pending.mapStanding,
      contactEmail: effectiveEmail,
    })
    setLoading(false)
    if (payError) setError(payError)
  }

  if (!c2Pending) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="marble_chamber_C2_agreement"
        data-material-family="marble"
        data-release-standing="held_missing_session"
        data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
        data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
        style={{ ...registryTokenStyle, ...marbleBgStyle(bgUrl) }}
      >
        {renderHeader({ title })}
        <section className="registry-held-state" role="status">
          <span>Marble</span>
          <p>{heldBody}</p>
          {next ? (
            <button type="button" onClick={() => onNavigate(next as EncounterSurface)}>
              {heldCtaLabel}
            </button>
          ) : null}
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_C2_agreement"
      data-material-family="marble"
      data-layout-contract="centered_exchange_panel"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...marbleBgStyle(bgUrl) }}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-payment-agreement" aria-label={title}>
        <header className="registry-marble-directory-header">
          <h2>{title}</h2>
          <p>{pathwayPrefix} {c2Pending.mapPathway.replaceAll("_", " ")}</p>
        </header>
        {!contactEmail ? (
          <div className="registry-map-email-entry">
            <label htmlFor="c2-checkout-email">{emailLabel}</label>
            <input
              id="c2-checkout-email"
              type="email"
              value={emailInput}
              placeholder={emailPlaceholder}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </div>
        ) : null}
        {error ? <p className="registry-marble-checkout-error" role="alert">{error}</p> : null}
        {onInitiateMapPayment ? (
          <div className="registry-marble-circuit-payment-action">
            <button
              type="button"
              className="registry-marble-circuit-payment-cta"
              disabled={loading || !effectiveEmail}
              onClick={() => void handleInitiatePayment()}
            >
              {loading ? ctaLoadingLabel : ctaLabel}
            </button>
          </div>
        ) : (
          <p className="registry-media-absence">Payment initiation is not available.</p>
        )}
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_C2_resolution -------------------------------------------
// Payment confirmation surface. Reached via Stripe success_url redirect.
// Terminal surface — no next_surface in encounter_structure.

function MarbleC2Resolution({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const meta = asRecord(encounter.encounterDef?.metadata)
  const contentProfile = asRecord(meta?.content_profile)
  const eyebrow = asString(contentProfile?.eyebrow) ?? "MAP Registration"
  const title = asString(contentProfile?.title) ?? encounter.encounterDef?.display_title ?? "Registration Received"
  const body = asString(contentProfile?.body) ?? "Your MAP the Environment registration has been received."
  const receiptCopy = asString(contentProfile?.receipt_copy)
  const accessCopy = asString(contentProfile?.access_copy)
  const surveyLabel = asString(contentProfile?.survey_label)
  const surveyUrl = asString(contentProfile?.survey_url)
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Finish"

  const bgUrl =
    mediaUrl(encounter.mediaByRole.get("marble_orientation_surface")) ??
    null

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_C2_resolution"
      data-material-family="marble"
      data-layout-contract="centered_confirmation_panel"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(meta?.directory_key) ?? undefined}
      style={{ ...registryTokenStyle, ...marbleBgStyle(bgUrl) }}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-resolution" aria-label={title}>
        <header className="registry-marble-directory-header">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{body}</p>
          {receiptCopy ? <p className="registry-marble-resolution-receipt">{receiptCopy}</p> : null}
          {accessCopy ? <p className="registry-marble-resolution-access">{accessCopy}</p> : null}
        </header>
        <div className="registry-marble-resolution-actions">
          <button
            type="button"
            className="registry-marble-cta"
            onClick={() => onNavigate("crystal_seat_encounter")}
          >
            {ctaLabel}
          </button>
          {surveyUrl && surveyLabel ? (
            <a
              className="registry-marble-resolution-survey"
              href={surveyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {surveyLabel}
            </a>
          ) : null}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
