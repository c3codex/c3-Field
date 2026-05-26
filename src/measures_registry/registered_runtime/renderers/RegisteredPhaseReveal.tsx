import type { CSSProperties, ReactNode } from "react"
import { asRecord, asRecordArray, asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  phaseRevealCopy: SectionCopy
  lapisBackgroundUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onNavigateRoute: (route: string) => void
}

export default function RegisteredPhaseReveal({
  registryTokenStyle,
  phaseRevealCopy,
  lapisBackgroundUrl,
  renderHeader,
  renderSystemFooter,
  onNavigateRoute,
}: Props) {
  const materialFamily =
    typeof phaseRevealCopy.stylingContract?.material_family === "string"
      ? phaseRevealCopy.stylingContract.material_family
      : "lapis"

  const guidedSessions = asRecordArray(
    asRecord(phaseRevealCopy.contentContract)?.guided_sessions
  )

  const routeCards = phaseRevealCopy.routeCards
  const primaryCards = routeCards.filter((c) => asString(c.priority) === "primary")
  const supportCards = routeCards.filter((c) => asString(c.priority) !== "primary")

  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_phases_reveal"
      data-material-family={materialFamily}
      style={registryTokenStyle}
    >
      {renderHeader()}
      {lapisBackgroundUrl ? (
        <img className="registry-phases-background" src={lapisBackgroundUrl} alt="" aria-hidden="true" />
      ) : null}
      <section className="registry-phases-reveal" aria-label={phaseRevealCopy.title ?? "Conversion Pathway"}>
        <div className="registry-encounter-entry">
          {phaseRevealCopy.eyebrow ? <span>{phaseRevealCopy.eyebrow}</span> : null}
          {phaseRevealCopy.title ? <h1>{phaseRevealCopy.title}</h1> : null}
          {phaseRevealCopy.subtitle ? <p>{phaseRevealCopy.subtitle}</p> : null}
        </div>

        {guidedSessions.length > 0 ? (
          <div className="registry-phases-sessions">
            {guidedSessions.map((session, index) => {
              const number = asString(session.session_number)
              const title = asString(session.title)
              const body = asString(session.body)
              const assets = asStringArray(session.retained_assets)
              return (
                <article key={number ?? index} className="registry-session-card">
                  {number ? <span className="registry-session-number">{number}</span> : null}
                  {title ? <h3>{title}</h3> : null}
                  {body ? <p>{body}</p> : null}
                  {assets.length > 0 ? (
                    <ul className="registry-session-assets">
                      {assets.map((asset) => (
                        <li key={asset}>{asset}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : null}

        {primaryCards.length > 0 ? (
          <div className="registry-phases-primary-cta">
            {primaryCards.map((card, index) => {
              const title = asString(card.title)
              const body = asString(card.body)
              const route = asString(card.route)
              return (
                <button
                  key={route ?? index}
                  type="button"
                  className="registry-route-card registry-route-card--primary"
                  onClick={() => route && onNavigateRoute(route)}
                >
                  {title ? <span className="registry-route-card-title">{title}</span> : null}
                  {body ? <span className="registry-route-card-body">{body}</span> : null}
                </button>
              )
            })}
          </div>
        ) : null}

        {supportCards.length > 0 ? (
          <nav className="registry-phases-support-links" aria-label="Learn more">
            {supportCards.map((card, index) => {
              const title = asString(card.title)
              const body = asString(card.body)
              const route = asString(card.route)
              return (
                <button
                  key={route ?? index}
                  type="button"
                  className="registry-route-card registry-route-card--support"
                  onClick={() => route && onNavigateRoute(route)}
                >
                  {title ? <span className="registry-route-card-title">{title}</span> : null}
                  {body ? <span className="registry-route-card-body">{body}</span> : null}
                </button>
              )
            })}
          </nav>
        ) : null}
      </section>
      {renderSystemFooter()}
    </main>
  )
}
