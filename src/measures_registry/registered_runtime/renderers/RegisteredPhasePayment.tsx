import type { CSSProperties, FormEvent, ReactNode } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  phasePaymentCopy: SectionCopy
  holdEmail: string
  holdSubmitting: boolean
  holdStatus: string | null
  holdError: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onHoldEmailChange: (value: string) => void
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export default function RegisteredPhasePayment({
  registryTokenStyle,
  phasePaymentCopy,
  holdEmail,
  holdSubmitting,
  holdStatus,
  holdError,
  renderHeader,
  renderSystemFooter,
  onHoldEmailChange,
  onBack,
  onSubmit,
}: Props) {
  const emailField = phasePaymentCopy.fields.find(
    (field) =>
      asString(field.key) === "email" &&
      asString(field.type) === "email" &&
      field.required === true,
  )

  const primaryLabel =
    phasePaymentCopy.ctaPrimary ??
    asString(
      phasePaymentCopy.actions.find((action) => asString(action.action_key) === "reserve_seat_hold")?.label,
    ) ??
    "Reserve Seat"

  const backHeaderAction = {
    label: "Back",
    behavior: "route_surface",
    action_key: "back_to_reserve_seat",
    target_encounter_key: "reserve_seat",
  }

  return (
    <main className="measures-registry-runtime" data-surface="phase_payment" style={registryTokenStyle}>
      {renderHeader()}
      <section className="registry-hold-surface" aria-label={phasePaymentCopy.entryLabel ?? "Seat Hold"}>
        <div className="registry-encounter-entry">
          {phasePaymentCopy.entryLabel ? <span>{phasePaymentCopy.entryLabel}</span> : null}
          {phasePaymentCopy.entryHeadline ? <h1>{phasePaymentCopy.entryHeadline}</h1> : <h1>Reserve Your Seat</h1>}
          {phasePaymentCopy.entrySub ? <p>{phasePaymentCopy.entrySub}</p> : null}
        </div>

        <form className="registry-hold-form" onSubmit={onSubmit}>
          {emailField ? (
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={holdEmail}
                onChange={(event) => onHoldEmailChange(event.target.value)}
              />
            </label>
          ) : null}
          <div className="registry-encounter-actions">
            <button type="submit" disabled={holdSubmitting || !emailField}>
              {holdSubmitting ? "Reserving..." : primaryLabel}
            </button>
            <button type="button" onClick={onBack}>
              Back
            </button>
          </div>
          {holdStatus ? (
            <p className="reserve-seat-success">
              {holdStatus}
              {phasePaymentCopy.successSubtext ? <span>{phasePaymentCopy.successSubtext}</span> : null}
            </p>
          ) : null}
          {holdError ? <p className="reserve-seat-error">{holdError}</p> : null}
        </form>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
