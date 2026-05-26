import type { CSSProperties, ReactNode } from "react"
import { asRecord, asRecordArray, asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  structuralDriftFeatureImageUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onNavigateRoute: (route: string) => void
}

export default function RegisteredAbout({
  registryTokenStyle,
  aboutCopy,
  structuralDriftFeatureImageUrl,
  renderHeader,
  renderSystemFooter,
  onNavigateRoute,
}: Props) {
  const materialFamily =
    typeof aboutCopy.stylingContract?.material_family === "string"
      ? aboutCopy.stylingContract.material_family
      : "lapis"

  const aboutSections = asRecordArray(asRecord(aboutCopy.contentContract)?.about_sections)
  const featured = asRecord(asRecord(aboutCopy.contentContract)?.featured)

  const routeCards = aboutCopy.routeCards
  const primaryCards = routeCards.filter((c) => asString(c.priority) === "primary")
  const supportCards = routeCards.filter((c) => asString(c.priority) !== "primary")

  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-material-family={materialFamily}
      style={registryTokenStyle}
    >
      {renderHeader()}
      <div className="registry-about-split">
        <section className="registry-about-primary" aria-label={aboutCopy.title ?? "About Measures Registry"}>
          <div className="registry-encounter-entry">
            {aboutCopy.eyebrow ? <span>{aboutCopy.eyebrow}</span> : null}
            {aboutCopy.title ? <h1>{aboutCopy.title}</h1> : null}
            {aboutCopy.subtitle ? <p>{aboutCopy.subtitle}</p> : null}
          </div>

          {aboutSections.length > 0 ? (
            <div className="registry-about-sections">
              {aboutSections.map((section, index) => {
                const title = asString(section.title)
                const body = asString(section.body)
                return (
                  <div key={title ?? index} className="registry-about-section">
                    {title ? <h3>{title}</h3> : null}
                    {body ? <p>{body}</p> : null}
                  </div>
                )
              })}
            </div>
          ) : null}

          <div className="registry-about-actions">
            {primaryCards.map((card, index) => {
              const title = asString(card.title)
              const route = asString(card.route)
              return (
                <button
                  key={route ?? index}
                  type="button"
                  className="registry-about-cta registry-about-cta--primary"
                  onClick={() => route && onNavigateRoute(route)}
                >
                  {title}
                </button>
              )
            })}
            {supportCards.map((card, index) => {
              const title = asString(card.title)
              const route = asString(card.route)
              return (
                <button
                  key={route ?? index}
                  type="button"
                  className="registry-about-cta registry-about-cta--support"
                  onClick={() => route && onNavigateRoute(route)}
                >
                  {title}
                </button>
              )
            })}
          </div>
        </section>

        {featured ? (
          <aside className="registry-about-featured" aria-label="Featured Field Note">
            {asString(featured.eyebrow) ? (
              <span className="registry-about-featured-eyebrow">{asString(featured.eyebrow)}</span>
            ) : null}
            {structuralDriftFeatureImageUrl ? (
              <img
                className="registry-about-featured-image"
                src={structuralDriftFeatureImageUrl}
                alt=""
                aria-hidden="true"
              />
            ) : null}
            {asString(featured.title) ? (
              <h2 className="registry-about-featured-title">{asString(featured.title)}</h2>
            ) : null}
            {asString(featured.body) ? (
              <p className="registry-about-featured-body">{asString(featured.body)}</p>
            ) : null}
            {asString(featured.cta_label) && asString(featured.route) ? (
              <button
                type="button"
                className="registry-about-featured-cta"
                onClick={() => {
                  const route = asString(featured.route)
                  if (route) onNavigateRoute(route)
                }}
              >
                {asString(featured.cta_label)}
              </button>
            ) : null}
          </aside>
        ) : null}
      </div>
      {renderSystemFooter()}
    </main>
  )
}
