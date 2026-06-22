import type { CSSProperties, ReactNode } from "react"
import { asRecord, asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  aboutCopy: SectionCopy
  videoUrl: string | null
  sealUrl: string | null
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
}

export default function RegisteredAboutMeasuresRegistry({
  registryTokenStyle,
  aboutCopy,
  videoUrl,
  sealUrl,
  renderHeader,
  renderSystemFooter,
}: Props) {
  const contract = asRecord(aboutCopy.contentContract)
  const objective = asRecord(contract?.objective)
  const action = asRecord(contract?.action)
  const result = asRecord(contract?.result)
  const seal = asRecord(contract?.seal)
  const title = asString(contract?.title) ?? aboutCopy.title
  const intro = asString(contract?.intro) ?? aboutCopy.subtitle

  if (!title || !intro || !objective || !action || !result || !seal) {
    return (
      <main className="measures-registry-runtime" data-surface="about_measures_registry" data-release-standing="held_missing_registry_content" style={registryTokenStyle}>
        {renderHeader()}
        <section className="registry-held-state" role="status">
          <p>About Measures Registry content is not seated in the registry.</p>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main className="measures-registry-runtime" data-surface="about_measures_registry" data-material-family="marble" data-layout-contract="about_registry_featured_split" data-release-standing="public" style={registryTokenStyle}>
      {renderHeader()}
      <section className="registry-about-measures" aria-label={title}>
        <div className="registry-about-measures-copy">
          <h1>{title}</h1>
          <p>{intro}</p>
          {[objective, action, result].map((item) => (
            <article key={asString(item.eyebrow) ?? asString(item.body) ?? "about-item"}>
              <span>{asString(item.eyebrow)}</span>
              <p>{asString(item.body)}</p>
            </article>
          ))}
        </div>
        <div className="registry-about-measures-media">
          {videoUrl ? <video src={videoUrl} controls playsInline preload="metadata" aria-label={title} /> : <p className="registry-media-absence">About media is not seated.</p>}
          {sealUrl ? <img src={sealUrl} alt="" /> : null}
          <p>{asString(seal.line_1)}</p>
          <p>{asString(seal.line_2)}</p>
          <p>{asString(seal.line_3)}</p>
        </div>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
