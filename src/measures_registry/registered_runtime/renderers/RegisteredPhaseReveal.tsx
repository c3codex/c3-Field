import type { CSSProperties, ReactNode } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { EnvironmentalStandingReport, SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  phaseRevealCopy: SectionCopy
  lapisBackgroundUrl: string | null
  evalReport: EnvironmentalStandingReport | null
  renderHeader: () => ReactNode
  onContinue: () => void
}

export default function RegisteredPhaseReveal({
  registryTokenStyle,
  phaseRevealCopy,
  lapisBackgroundUrl,
  evalReport,
  renderHeader,
  onContinue,
}: Props) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_phases_reveal"
      data-material-family="marble"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-phases-reveal" aria-label={phaseRevealCopy.title ?? "Measures phases reveal"}>
        {lapisBackgroundUrl ? (
          <img className="registry-phases-background" src={lapisBackgroundUrl} alt="" aria-hidden="true" />
        ) : null}
        <div className="registry-encounter-entry">
          {phaseRevealCopy.eyebrow ? <span>{phaseRevealCopy.eyebrow}</span> : null}
          {phaseRevealCopy.title ? <h1>{phaseRevealCopy.title}</h1> : null}
          {phaseRevealCopy.subtitle ? <p>{phaseRevealCopy.subtitle}</p> : null}
        </div>
        {evalReport ? (
          <div className="registry-phases-standing" aria-label="Assessment standing">
            <span>{evalReport.assessment_title}</span>
            <h2>{evalReport.assessment_result}</h2>
            {evalReport.environmental_standing ? <p>{evalReport.environmental_standing}</p> : null}
            {evalReport.recommended_structured_action ? (
              <p>{evalReport.recommended_structured_action}</p>
            ) : null}
          </div>
        ) : null}
        {phaseRevealCopy.sections.length > 0 ? (
          <div className="registry-phases-sections">
            {phaseRevealCopy.sections.map((section, index) => {
              const title = asString(section.title)
              const body = asString(section.body)
              return (
                <article key={title ?? index}>
                  {title ? <h3>{title}</h3> : null}
                  {body ? <p>{body}</p> : null}
                </article>
              )
            })}
          </div>
        ) : null}
        <div className="registry-encounter-actions">
          <button type="button" onClick={onContinue}>
            {phaseRevealCopy.ctaPrimary ?? "Continue"}
          </button>
        </div>
      </section>
    </main>
  )
}
