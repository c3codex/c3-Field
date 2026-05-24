import type { CSSProperties, ReactNode } from "react"
import { asString, asStringArray } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"
import type { LandingSectionRow } from "../registeredRuntimeTypes"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  marbleAccentReferenceUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onContinue: () => void
}

export default function RegisteredAbout({
  registryTokenStyle,
  aboutCopy,
  marbleAccentReferenceUrl,
  renderHeader,
  renderSystemFooter,
  onContinue,
}: Props) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="about_measures_registry"
      data-material-family="marble"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-about-authority" aria-label={aboutCopy.title ?? "About Measures Registry"}>
        {marbleAccentReferenceUrl ? (
          <img className="registry-about-marble" src={marbleAccentReferenceUrl} alt="" aria-hidden="true" />
        ) : null}
        <div className="registry-encounter-entry">
          {aboutCopy.eyebrow ? <span>{aboutCopy.eyebrow}</span> : <span>ABOUT MEASURES REGISTRY</span>}
          <h1>{aboutCopy.title ?? "A registered environment for governing AI behavior."}</h1>
          {aboutCopy.subtitle ? <p>{aboutCopy.subtitle}</p> : null}
        </div>
        <div className="registry-encounter-actions">
          <button type="button" onClick={onContinue}>
            {aboutCopy.ctaPrimary ?? "Read Structural Drift"}
          </button>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
