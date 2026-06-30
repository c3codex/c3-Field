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

  if (surface === "map_integrity_governance" || surface === "marble_chamber_orientation_passage") {
    return <MapIntegrityGovernance {...props} onInitiateMapPayment={props.onInitiateMapPayment} />
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
  onInitiateMapPayment,
  renderHeader,
  renderSystemFooter,
}: MarbleChamberProps) {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [emailInput, setEmailInput] = useState("")

  // Read assessment session for standing key and contact email.
  // Written by handleSubmitEvaluation after assessment contact capture.
  const [mapSession] = useState<MapSession>(() => {
    try {
      const raw = sessionStorage.getItem("__mreg_pending_report")
      return raw ? (JSON.parse(raw) as MapSession) : null
    } catch { return null }
  })

  const standingKey = asString((mapSession?.report as Record<string, unknown> | null | undefined)?.standing_key) ?? ""
  const contactEmail = asString(mapSession?.fields?.contact_email)?.trim() ?? ""

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

  async function handlePayment(mapPathway: string) {
    if (!onInitiateMapPayment) return
    const email = contactEmail || emailInput.trim()
    if (!email) { setCheckoutError("Email address is required."); return }
    if (!standingKey) { setCheckoutError("Complete the AI Operations Assessment to begin MAP checkout."); return }
    setCheckoutLoading(true)
    setCheckoutError(null)
    const { error } = await onInitiateMapPayment({ mapPathway, mapStanding: standingKey, contactEmail: email })
    setCheckoutLoading(false)
    if (error) setCheckoutError(error)
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="map_integrity_governance"
      data-material-family="marble"
      data-layout-contract="marble_chamber_directory"
      data-release-standing="public"
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

        {/* PAYMENT STATE */}
        {onInitiateMapPayment ? (
          <>
            {!standingKey ? (
              <p className="registry-map-assessment-required">
                Complete the AI Operations Assessment to receive your recommended MAP pathway and begin checkout.
              </p>
            ) : !contactEmail ? (
              <div className="registry-map-email-entry">
                <label htmlFor="map-checkout-email">Email for checkout</label>
                <input
                  id="map-checkout-email"
                  type="email"
                  value={emailInput}
                  placeholder="email@organization.com"
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
            ) : null}
            {checkoutError ? (
              <p className="registry-marble-checkout-error" role="alert">{checkoutError}</p>
            ) : null}
          </>
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
                  {onInitiateMapPayment && cardMapPathway ? (
                    <div className="registry-marble-circuit-payment-action">
                      <button
                        type="button"
                        className="registry-marble-circuit-payment-cta"
                        disabled={checkoutLoading || !standingKey}
                        onClick={() => void handlePayment(cardMapPathway)}
                      >
                        {checkoutLoading ? "Processing..." : (asString(card.cta) ?? `Select ${cardTitle}`)}
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
