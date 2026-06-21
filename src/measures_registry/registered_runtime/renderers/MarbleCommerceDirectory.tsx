import type { CSSProperties, ReactNode } from "react"
import type { MapC2CircuitRow } from "../registeredRuntimeTypes"
import type { AssessmentConditionTrace, EnvironmentalStandingReport } from "../registeredRuntimeUtils"

type PaymentReturnStatus = {
  mapOrderId: string
  verifying: boolean
  schedulingReleased: boolean
  error: string | null
}

type Props = {
  registryTokenStyle: CSSProperties
  evalReport: EnvironmentalStandingReport | null
  organizationName: string | null
  currentAiUsage: string | null
  conditionTraces: AssessmentConditionTrace[]
  environmentScore: number | null
  mapC2Circuit: MapC2CircuitRow[]
  checkoutLoading: boolean
  checkoutError: string | null
  paymentReturn: PaymentReturnStatus | null
  marbleAccentReferenceUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onProceedToPayment: (paymentOption: MapC2CircuitRow) => void
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)
}

export default function MarbleCommerceDirectory({
  registryTokenStyle,
  evalReport,
  organizationName,
  currentAiUsage,
  conditionTraces,
  environmentScore,
  mapC2Circuit,
  checkoutLoading,
  checkoutError,
  paymentReturn,
  marbleAccentReferenceUrl,
  renderHeader,
  renderSystemFooter,
  onProceedToPayment,
}: Props) {
  const standingKey = evalReport?.standing_key ?? null

  const recommendedOption = standingKey
    ? mapC2Circuit.find(
        (c) => Array.isArray(c.applicable_standing_keys) && c.applicable_standing_keys.includes(standingKey),
      ) ?? null
    : null

  // Payment return: verifying or confirmed
  if (paymentReturn) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="map_integrity_governance"
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
                  MAP review prepares operational findings and next-step recommendations. It does not create certification,
                  registration, governance standing, or system authority.
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

  // No evaluation result — assessment context required
  if (!evalReport || !standingKey) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="map_integrity_governance"
        data-material-family="marble"
        data-layout-contract="context_required"
        data-release-standing="held_assessment_context_required"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status" aria-live="polite">
          <h2>Assessment context unavailable.</h2>
          <p>Please return to the assessment to continue.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  // MAP C2 circuit payment options not yet loaded
  if (mapC2Circuit.length === 0) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface="map_integrity_governance"
        data-material-family="marble"
        data-layout-contract="loading"
        data-release-standing="contracts_loading"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-held-state" role="status" aria-live="polite">
          <h2>Loading governed pathway.</h2>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  const selectedIndicators = conditionTraces.slice(0, 3)
  const scoreDisplay = environmentScore !== null ? String(environmentScore) : evalReport.environmental_standing

  // MAP Integrity Governance — evaluation-determined MAP circuit
  return (
    <main
      className="measures-registry-runtime"
      data-surface="map_integrity_governance"
      data-material-family="marble"
      data-layout-contract="marble_chamber_directory"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-marble-chamber registry-marble-directory" aria-label="MAP Integrity Governance">
        {marbleAccentReferenceUrl ? (
          <img src={marbleAccentReferenceUrl} alt="" className="registry-marble-accent" aria-hidden="true" />
        ) : null}

        <header className="registry-marble-directory-header">
          <h2>MAP Integrity Governance</h2>
          <p>
            Your initial assessment identified the review path. The MAP is not a repeat of that assessment. It is the
            structured MAP review required to measure, audit, and prepare your operational environment.
          </p>
          <p>
            Measures Registry does not provide generic helpful suggestions from this assessment. Suggestions can
            describe possible improvements, but they do not verify authority, role boundaries, evidence paths, review
            ownership, or implementation readiness. The selected MAP is the governed review path for determining what
            can be acted on responsibly.
          </p>
        </header>

        <div className="registry-marble-assessment-standing">
          <strong>Assessment Standing</strong>
          <p>Your result has been matched to a structured review path.</p>
          {organizationName ? (
            <div className="registry-marble-personalization">
              <p>For {organizationName}, the assessment result identified:</p>
              <ul>
                <li>Environment score: {scoreDisplay}</li>
                <li>Selected review path: {recommendedOption?.product_name ?? evalReport.continuation_pathway}</li>
                {currentAiUsage ? <li>Current AI usage: {currentAiUsage}</li> : null}
              </ul>
            </div>
          ) : null}
          {selectedIndicators.length > 0 ? (
            <div className="registry-marble-assessment-indicators">
              <strong>Assessment Indicators</strong>
              <ul>
                {selectedIndicators.map((trace) => (
                  <li key={trace.question_key}>{trace.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="registry-marble-circuit-list">
          {mapC2Circuit.map((paymentOption) => {
            const isRecommended = paymentOption.map_circuit_key === recommendedOption?.map_circuit_key

            return (
              <article
                key={paymentOption.map_circuit_key}
                className={`registry-marble-circuit-card${isRecommended ? " registry-marble-circuit-card--recommended" : ""}`}
                data-map-circuit={paymentOption.map_circuit_key}
                data-recommended={isRecommended ? "true" : undefined}
                aria-label={paymentOption.product_name}
              >
                {isRecommended ? (
                  <span className="registry-marble-circuit-recommendation">Evaluation-Determined Recommendation</span>
                ) : null}

                <h3>{paymentOption.product_name}</h3>

                <div className="registry-marble-circuit-description">
                  <strong>MAP Boundary</strong>
                  <p>{paymentOption.public_map_boundary}</p>
                </div>

                <div className="registry-marble-circuit-access">
                  <strong>Access Requirement</strong>
                  <p>{paymentOption.public_access_boundary}</p>
                </div>

                {Array.isArray(paymentOption.deliverables) && paymentOption.deliverables.length > 0 ? (
                  <div className="registry-marble-circuit-deliverables">
                    <strong>Deliverables</strong>
                    <ul>
                      {paymentOption.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="registry-marble-circuit-price">
                  <strong>{formatUsd(paymentOption.amount_usd)}</strong>
                </div>

                <div className="registry-marble-circuit-seat-hold">
                  <p>{paymentOption.public_payment_boundary}</p>
                </div>

                {isRecommended ? (
                  <div className="registry-marble-circuit-action">
                    <button
                      type="button"
                      className="registry-marble-circuit-payment-cta"
                      onClick={() => onProceedToPayment(paymentOption)}
                      disabled={checkoutLoading}
                      aria-busy={checkoutLoading}
                    >
                      {checkoutLoading ? "Preparing payment…" : "Begin MAP Review"}
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

      </section>
      {renderSystemFooter()}
    </main>
  )
}
