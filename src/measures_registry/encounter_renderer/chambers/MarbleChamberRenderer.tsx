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

// --- Entry point ------------------------------------------------------------

// Receives only RenderableEncounter. No DB access. No authority decisions.
// No assessment logic. No payment logic. No certification logic.
// Dispatches to sub-presentations by surface key (seated in DB via surface assignment).
export default function MarbleChamberRenderer(props: MarbleChamberProps) {
  const { surface } = props.encounter

  if (surface === "marble_chamber_C2_compact" || surface === "marble_chamber_orientation_passage") {
    return <MapIntegrityGovernance {...props} />
  }
  if (surface === "marble_chamber_orientation") {
    return <MarbleOrientationSeat {...props} />
  }
  if (surface === "marble_chamber_encounter") {
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
  // Read assessment session for standing key (used to identify recommended pathway).
  // Written by ObsidianC1Compact after contact capture.
  const [mapSession] = useState<MapSession>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_pending_report")
      return raw ? (JSON.parse(raw) as MapSession) : null
    } catch { return null }
  })

  const standingKey = asString((mapSession?.report as Record<string, unknown> | null | undefined)?.standing_key) ?? ""

  const meta = asRecord(encounter.encounterDef?.metadata)
  const governanceHeader = asRecord(meta?.governance_header)
  const mapFraming = asRecord(meta?.map_framing)
  const actionReadiness = asRecord(meta?.action_readiness)
  const pathwayCards = asRecordArray(meta?.pathway_cards)
  const seatHold = asRecord(meta?.seat_hold)

  const title =
    asString(governanceHeader?.title) ??
    encounter.encounterDef?.display_title ??
    "MAP Integrity Governance"
  const governanceDescription = asString(governanceHeader?.description)
  const governancePrinciple = asString(governanceHeader?.principle)

  const mapFramingTitle = asString(mapFraming?.title)
  const mapFramingBody = asString(mapFraming?.body)

  const actionReadinessTitle = asString(actionReadiness?.title)
  const actionReadinessBody = asString(actionReadiness?.body)
  const actionCtaLabel = asString(actionReadiness?.cta_label)
  const actionCtaRoute = asString(actionReadiness?.cta_route)

  const seatHoldStatement = asString(seatHold?.statement)

  const marbleAccentUrl = mediaUrl(encounter.mediaByRole.get("right_measured_hero"))
    ?? mediaUrl(encounter.mediaByRole.get("installation_tone_marble"))
  const marbleRiseUrl = mediaUrl(encounter.mediaByRole.get("installation_tone_marble_rise_return_v1"))

  const next = resolveNextSurface(encounter)

  function handleSelectPathway(mapPathway: string) {
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
      data-layout-contract="marble_chamber_directory"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-directory" aria-label={title}>

        {marbleAccentUrl ? (
          <img
            src={marbleAccentUrl}
            alt=""
            className="registry-marble-accent"
            aria-hidden="true"
          />
        ) : null}

        {/* GOVERNANCE HEADER */}
        <header className="registry-marble-directory-header">
          <h2>{title}</h2>
          {governanceDescription ? <p>{governanceDescription}</p> : null}
          {governancePrinciple ? <p>{governancePrinciple}</p> : null}
        </header>

        {/* MAP FRAMING */}
        {mapFramingTitle || mapFramingBody ? (
          <section className="registry-marble-map-framing" aria-label={mapFramingTitle ?? "MAP framing"}>
            {mapFramingTitle ? <strong>{mapFramingTitle}</strong> : null}
            {mapFramingBody ? <p>{mapFramingBody}</p> : null}
          </section>
        ) : null}

        {/* ASSESSMENT STANDING */}
        {!standingKey ? (
          <p className="registry-map-assessment-required">
            Complete the AI Operations Assessment to receive your recommended MAP pathway.
          </p>
        ) : null}

        {/* PATHWAY CARDS */}
        {pathwayCards.length > 0 ? (
          <div className="registry-marble-circuit-list">
            {pathwayCards.map((card) => {
              const cardTitle = asString(card.title)
              const cardMapPathway = asString(card.map_pathway)
              const priceLabel = asString(card.price_label)
              const boundary = asString(card.map_boundary)
              const accessBoundary = asString(card.access_boundary)
              const deliverables = asStringArray(card.deliverables)
              const paymentBoundary = asString(card.payment_boundary)
              const seatHoldNotice = asString(card.seat_hold_notice)
              const applicableKeys = asStringArray(card.applicable_standing_keys)
              const isRecommended = standingKey
                ? applicableKeys.includes(standingKey)
                : card.recommended === true
              if (!cardTitle) return null
              return (
                <article
                  key={cardTitle}
                  className={`registry-marble-circuit-card${isRecommended ? " registry-marble-circuit-card--recommended" : ""}`}
                  aria-label={cardTitle}
                >
                  {isRecommended ? (
                    <span className="registry-marble-circuit-recommendation">
                      Evaluation-Determined Recommendation
                    </span>
                  ) : null}
                  <h3>{cardTitle}</h3>
                  {priceLabel ? (
                    <div className="registry-marble-circuit-price">
                      <strong className="registry-marble-circuit-price-label">{priceLabel}</strong>
                      <span>MAP the Environment</span>
                    </div>
                  ) : null}
                  {boundary ? (
                    <div className="registry-marble-circuit-description">
                      <strong>MAP Boundary</strong>
                      <p>{boundary}</p>
                    </div>
                  ) : null}
                  {accessBoundary ? (
                    <div className="registry-marble-circuit-access">
                      <strong>Access Requirement</strong>
                      <p>{accessBoundary}</p>
                    </div>
                  ) : null}
                  {deliverables.length > 0 ? (
                    <div className="registry-marble-circuit-deliverables">
                      <strong>Deliverables</strong>
                      <ul>
                        {deliverables.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  {paymentBoundary ? (
                    <div className="registry-marble-circuit-seat-hold">
                      <p>{paymentBoundary}</p>
                    </div>
                  ) : null}
                  {cardMapPathway ? (
                    <div className="registry-marble-circuit-payment-action">
                      <button
                        type="button"
                        className="registry-marble-circuit-payment-cta"
                        disabled={!standingKey}
                        onClick={() => handleSelectPathway(cardMapPathway)}
                      >
                        {asString(card.cta) ?? `Select ${cardTitle}`}
                      </button>
                    </div>
                  ) : null}
                  {seatHoldNotice ? (
                    <p className="registry-marble-seat-hold-notice">{seatHoldNotice}</p>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}

        {/* ACTION READINESS */}
        {actionReadinessTitle || actionReadinessBody ? (
          <section className="registry-marble-action-readiness" aria-label={actionReadinessTitle ?? "Action readiness"}>
            {actionReadinessTitle ? <strong>{actionReadinessTitle}</strong> : null}
            {actionReadinessBody ? <p>{actionReadinessBody}</p> : null}
            {actionCtaRoute && actionCtaLabel ? (
              <a className="registry-marble-cta" href={actionCtaRoute}>
                {actionCtaLabel}
              </a>
            ) : next && actionCtaLabel ? (
              <button
                type="button"
                className="registry-marble-cta"
                onClick={() => onNavigate(next as EncounterSurface)}
              >
                {actionCtaLabel}
              </button>
            ) : null}
          </section>
        ) : null}

        {/* SEAT HOLD */}
        {seatHoldStatement ? (
          <p className="registry-map-seat-hold">{seatHoldStatement}</p>
        ) : null}

        {/* TRANSITION */}
        {next && !actionCtaLabel ? (
          <section className="registry-marble-navigation">
            <button
              type="button"
              onClick={() => onNavigate(next as EncounterSurface)}
            >
              Continue
            </button>
          </section>
        ) : null}

        {/* Marble tone media */}
        {marbleRiseUrl ? (
          <div className="registry-marble-tone" aria-hidden="true">
            <img src={marbleRiseUrl} alt="" />
          </div>
        ) : null}

      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_orientation ---------------------------------------------
// Media explainer before assessment findings report.
// Media role: assessment_report_orientation. Navigate to marble_chamber_encounter on continue.

function MarbleOrientationSeat({
  encounter,
  registryTokenStyle,
  onNavigate,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const [muted, setMuted] = useState(false)

  const meta = asRecord(encounter.encounterDef?.metadata)
  const contentProfile = asRecord(meta?.content_profile)
  const title = asString(contentProfile?.title) ?? encounter.encounterDef?.display_title ?? "Pathway Review"
  const next = resolveNextSurface(encounter)
  const videoUrl = mediaUrl(encounter.mediaByRole.get("assessment_report_orientation"))

  function handleContinue() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_orientation"
      data-material-family="marble"
      data-layout-contract="orientation_media"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(meta?.directory_key) ?? undefined}
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-orientation" aria-label={title}>
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            muted={muted}
            playsInline
            preload="auto"
            onEnded={handleContinue}
            aria-label={title}
          />
        ) : (
          <p className="registry-media-absence">Marble orientation media is not seated.</p>
        )}
        <div className="registry-diagnostic-passage-controls">
          <button type="button" onClick={handleContinue}>
            Continue
          </button>
          {videoUrl ? (
            <button type="button" onClick={() => setMuted((m) => !m)}>
              {muted ? "Audio" : "Mute"}
            </button>
          ) : null}
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}

// --- marble_chamber_encounter -----------------------------------------------
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

  function handleBeginPathwayReview() {
    if (next) onNavigate(next as EncounterSurface)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_encounter"
      data-material-family="marble"
      data-layout-contract="findings_report"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={registryTokenStyle}
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
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Proceed to Payment"
  const ctaLoadingLabel = asString(contentProfile?.cta_loading) ?? "Processing..."
  const effectiveEmail = contactEmail || emailInput.trim()

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
        style={registryTokenStyle}
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
      data-layout-contract="payment_agreement"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(encounter.encounterDef?.metadata?.directory_key) ?? undefined}
      style={registryTokenStyle}
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
  const ctaLabel = asString(contentProfile?.cta_label) ?? "Return to Measures Registry"

  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_chamber_C2_resolution"
      data-material-family="marble"
      data-layout-contract="confirmation_resolution"
      data-release-standing="public"
      data-style-profile={asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined}
      data-directory-key={asString(meta?.directory_key) ?? undefined}
      style={registryTokenStyle}
    >
      {renderHeader({ title })}
      <section className="registry-marble-chamber registry-marble-resolution" aria-label={title}>
        <header className="registry-marble-directory-header">
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{body}</p>
        </header>
        <div className="registry-marble-resolution-actions">
          <button
            type="button"
            className="registry-marble-cta"
            onClick={() => onNavigate("crystal_seat_encounter")}
          >
            {ctaLabel}
          </button>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
