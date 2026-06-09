import type { CSSProperties, ReactNode } from "react"
import type { MapCommerceContractRow } from "../registeredRuntimeTypes"
import type { EnvironmentalStandingReport } from "../registeredRuntimeUtils"

type PaymentReturnStatus = {
  mapOrderId: string
  verifying: boolean
  schedulingReleased: boolean
  error: string | null
}

type Props = {
  registryTokenStyle: CSSProperties
  evalReport: EnvironmentalStandingReport | null
  mapCommerceContracts: MapCommerceContractRow[]
  checkoutLoading: boolean
  checkoutError: string | null
  paymentReturn: PaymentReturnStatus | null
  marbleAccentReferenceUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onProceedToPayment: (contract: MapCommerceContractRow) => void
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)
}

export default function MarbleCommerceDirectory({
  registryTokenStyle,
  evalReport,
  mapCommerceContracts,
  checkoutLoading,
  checkoutError,
  paymentReturn,
  marbleAccentReferenceUrl,
  renderHeader,
  renderSystemFooter,
  onProceedToPayment,
}: Props) {
  const standingKey = evalReport?.standing_key ?? null

  const recommendedContract = standingKey
    ? mapCommerceContracts.find(
        (c) => Array.isArray(c.applicable_standing_keys) && c.applicable_standing_keys.includes(standingKey),
      ) ?? null
    : null

  // Payment return: verifying or confirmed
  if (paymentReturn) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="marble_pathway_reveal"
        data-material-family="marble"
        data-layout-contract="payment_confirmation"
        data-release-standing={paymentReturn.schedulingReleased ? "scheduling_released" : "payment_verifying"}
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-marble-chamber registry-payment-confirmation" aria-label="MAP Payment Confirmation">
          {marbleAccentReferenceUrl ? (
            <img src={marbleAccentReferenceUrl} alt="" className="registry-marble-accent" aria-hidden="true" />
          ) : null}
          <span>MAP the Environment</span>
          {paymentReturn.verifying ? (
            <>
              <h2>Verifying payment.</h2>
              <p>Confirming payment standing before releasing scheduling.</p>
            </>
          ) : paymentReturn.error ? (
            <>
              <h2>Payment verification could not complete.</h2>
              <p>{paymentReturn.error}</p>
            </>
          ) : paymentReturn.schedulingReleased ? (
            <>
              <h2>Payment confirmed.</h2>
              <p>
                Your MAP the Environment order has been received. System Readiness Consultation scheduling is now
                available.
              </p>
              <div className="registry-marble-scheduling-unlock" role="status" aria-live="polite">
                <strong>Scheduling Released</strong>
                <p>
                  A System Readiness Consultation will be scheduled to begin your MAP the Environment engagement.
                </p>
                <p className="registry-map-seat-hold">
                  A full SEAT Contract may be generated only after MAP the Environment is complete.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2>Payment is being processed.</h2>
              <p>If payment was completed, confirmation will be issued shortly.</p>
            </>
          )}
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // No evaluation result — passage integrity required
  if (!evalReport || !standingKey) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="marble_pathway_reveal"
        data-material-family="marble"
        data-layout-contract="passage_required"
        data-release-standing="held_eval_result_required"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status" aria-live="polite">
          <span>Marble Chamber</span>
          <h2>Evaluation result is required to enter the Marble Chamber.</h2>
          <p>Complete the AI Operations Assessment to receive your evaluation-determined pathway.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // MAP contracts not yet loaded
  if (mapCommerceContracts.length === 0) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="marble_pathway_reveal"
        data-material-family="marble"
        data-layout-contract="loading"
        data-release-standing="contracts_loading"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status" aria-live="polite">
          <span>Marble Chamber</span>
          <h2>Loading governed pathway.</h2>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // Marble Chamber Directory — evaluation-determined MAP circuit
  return (
    <main
      className="measures-registry-runtime"
      data-surface="marble_pathway_reveal"
      data-material-family="marble"
      data-layout-contract="marble_chamber_directory"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-marble-chamber registry-marble-directory" aria-label="Marble Chamber Directory">
        {marbleAccentReferenceUrl ? (
          <img src={marbleAccentReferenceUrl} alt="" className="registry-marble-accent" aria-hidden="true" />
        ) : null}

        <header className="registry-marble-directory-header">
          <span>Marble Chamber</span>
          <h2>Governed Pathway</h2>
          <p>
            A structured environmental alignment path has been prepared for your review. The circuit below reflects your
            evaluation-determined standing.
          </p>
        </header>

        <div className="registry-marble-circuit-list">
          {mapCommerceContracts.map((contract) => {
            const isRecommended = contract.contract_key === recommendedContract?.contract_key

            return (
              <article
                key={contract.contract_key}
                className={`registry-marble-circuit-card${isRecommended ? " registry-marble-circuit-card--recommended" : ""}`}
                data-map-circuit={contract.map_circuit_key}
                data-recommended={isRecommended ? "true" : undefined}
                aria-label={contract.product_name}
              >
                {isRecommended ? (
                  <span className="registry-marble-circuit-recommendation">Evaluation-Determined Recommendation</span>
                ) : null}

                <h3>{contract.product_name}</h3>

                <div className="registry-marble-circuit-standing">
                  <strong>System Standing</strong>
                  <p>{evalReport.environmental_standing}</p>
                </div>

                <div className="registry-marble-circuit-description">
                  <strong>MAP Boundary</strong>
                  <p>{contract.map_boundary}</p>
                </div>

                <div className="registry-marble-circuit-access">
                  <strong>Access Requirement</strong>
                  <p>{contract.access_boundary}</p>
                </div>

                {Array.isArray(contract.deliverables) && contract.deliverables.length > 0 ? (
                  <div className="registry-marble-circuit-deliverables">
                    <strong>Deliverables</strong>
                    <ul>
                      {contract.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="registry-marble-circuit-price">
                  <strong>{formatUsd(contract.amount_usd)}</strong>
                </div>

                <div className="registry-marble-circuit-seat-hold">
                  <p>{contract.seat_hold_notice}</p>
                </div>

                {isRecommended ? (
                  <div className="registry-marble-circuit-action">
                    <button
                      type="button"
                      className="registry-marble-circuit-payment-cta"
                      onClick={() => onProceedToPayment(contract)}
                      disabled={checkoutLoading}
                      aria-busy={checkoutLoading}
                    >
                      {checkoutLoading ? "Preparing payment…" : "Proceed to MAP Payment"}
                    </button>
                    {checkoutError ? (
                      <p className="registry-marble-checkout-error" role="alert">
                        {checkoutError}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>

        <div className="registry-marble-directory-holds" aria-label="Post-launch held systems">
          <p>
            SEAT standing, c3 Key issuance, wallet integration, Registry Certification, and Registered System standing
            are held until MAP the Environment is complete.
          </p>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
