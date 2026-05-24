import type { CSSProperties, ReactNode } from "react"
import type { SectionCopy } from "../registeredRuntimeUtils"
import type { SeatOfferingRow } from "../registeredRuntimeTypes"

type Props = {
  registryTokenStyle: CSSProperties
  reserveSeatCopy: SectionCopy
  seatOfferings: SeatOfferingRow[]
  renderHeader: () => ReactNode
  onSelectOffering: () => void
}

export default function RegisteredReserveSeat({
  registryTokenStyle,
  reserveSeatCopy,
  seatOfferings,
  renderHeader,
  onSelectOffering,
}: Props) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="reserve_seat"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section id="reserve-seat" className="registry-reserve-selector" aria-label={reserveSeatCopy.entryLabel ?? undefined}>
        <div className="registry-encounter-entry">
          {reserveSeatCopy.entryLabel ? <span>{reserveSeatCopy.entryLabel}</span> : null}
          {reserveSeatCopy.entryHeadline ? <h1>{reserveSeatCopy.entryHeadline}</h1> : null}
          {reserveSeatCopy.entrySub ? <p>{reserveSeatCopy.entrySub}</p> : null}
        </div>

        {reserveSeatCopy.coreStatement ? (
          <p className="registry-offering-core">{reserveSeatCopy.coreStatement}</p>
        ) : null}

        {reserveSeatCopy.sections.length > 0 ? (
          <div className="registry-path-signal" aria-label="Governance structure">
            {reserveSeatCopy.sections.map((section) => {
              const body = typeof section.body === "string" ? section.body : null
              return body ? <p key={body}>{body}</p> : null
            })}
          </div>
        ) : null}

        <div className="registry-reserve-options">
          {seatOfferings.map((offering) => {
            const isOpen = offering.enrollment_state === "open"
            return (
              <button
                key={offering.offering_key}
                type="button"
                className="registry-reserve-option"
                data-state={offering.enrollment_state}
                disabled={!isOpen}
                onClick={onSelectOffering}
              >
                <span>{offering.label}</span>
                {offering.description ? <p>{offering.description}</p> : null}
                <small>{offering.enrollment_state.replaceAll("_", " ")}</small>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
