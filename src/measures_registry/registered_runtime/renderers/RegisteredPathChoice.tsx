import type { CSSProperties } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  pathChoiceCopy: SectionCopy
  pathChoiceBackgroundUrl: string | null
  registryMarkUrl: string | null
  onLeftChoice: () => void
  onRightChoice: () => void
}

export default function RegisteredPathChoice({
  registryTokenStyle,
  pathChoiceCopy,
  pathChoiceBackgroundUrl,
  registryMarkUrl,
  onLeftChoice,
  onRightChoice,
}: Props) {
  const plaques =
    pathChoiceCopy.plaques.length > 0
      ? pathChoiceCopy.plaques
      : [pathChoiceCopy.more, pathChoiceCopy.coherence].filter(
          (item): item is Record<string, unknown> => Boolean(item),
        )

  const backgroundStyle = pathChoiceBackgroundUrl
    ? ({ "--path-choice-background": `url(${pathChoiceBackgroundUrl})` } as CSSProperties)
    : undefined

  function choiceHandler(index: number) {
    return index === 0 ? onLeftChoice : onRightChoice
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="landing_path_choice"
      style={registryTokenStyle}
    >
      <header className="registry-public-header">
        <div className="registry-public-brand">
          {registryMarkUrl ? <img src={registryMarkUrl} alt="" /> : null}
        </div>
        <nav className="registry-public-nav" aria-label="Measures Registry navigation" />
      </header>

      <section className="registry-path-choice" style={backgroundStyle}>
        <div className="registry-path-choice-copy">
          {pathChoiceCopy.eyebrow ? <span>{pathChoiceCopy.eyebrow}</span> : null}
          {pathChoiceCopy.title ? <h1>{pathChoiceCopy.title}</h1> : null}
          {pathChoiceCopy.subtitle ? <p>{pathChoiceCopy.subtitle}</p> : null}
          {pathChoiceCopy.breakdownBlocks.length > 0 ? (
            <div className="registry-path-signal" aria-label="System signal">
              {pathChoiceCopy.breakdownBlocks.map((block) => (
                <p key={block}>{block}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="registry-path-choice-contrast">
          {plaques.map((plaque, index) => {
            const title = asString(plaque.title) ?? asString(plaque.label)
            const body = asString(plaque.body)
            const side = asString(plaque.side) ?? (index === 0 ? "left" : "right")

            return (
              <button
                key={title ?? index}
                type="button"
                className="registry-route-plate"
                data-choice={side}
                onClick={choiceHandler(index)}
              >
                <span>{title}</span>
                <p>{body}</p>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
