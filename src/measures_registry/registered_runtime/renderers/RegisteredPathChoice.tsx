import { useState } from "react"
import type { CSSProperties } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  pathChoiceCopy: SectionCopy
  leftHeroUrl: string | null
  leftMotionUrl: string | null
  rightHeroUrl: string | null
  rightMotionUrl: string | null
  onLeftChoice: () => void
  onRightChoice: () => void
}

export default function RegisteredPathChoice({
  registryTokenStyle,
  pathChoiceCopy,
  leftHeroUrl,
  leftMotionUrl,
  rightHeroUrl,
  rightMotionUrl,
  onLeftChoice,
  onRightChoice,
}: Props) {
  const [leftSettled, setLeftSettled] = useState(false)
  const [rightSettled, setRightSettled] = useState(false)
  // plaques → heroPaths → [more] fallback chain
  const plaques =
    pathChoiceCopy.plaques.length > 0
      ? pathChoiceCopy.plaques
      : pathChoiceCopy.heroPaths.length > 0
      ? pathChoiceCopy.heroPaths
      : [pathChoiceCopy.more].filter(
          (item): item is Record<string, unknown> => Boolean(item),
        )

  function choiceHandler(plaque: Record<string, unknown>, index: number) {
    const side = asString(plaque.side)
    if (side === "right") return onRightChoice
    if (side === "left") return onLeftChoice
    return index === 0 ? onLeftChoice : onRightChoice
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="landing_path_choice"
      data-material-family="lapis"
      data-layout-contract="transition_choice"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      <section className="registry-path-choice" aria-label="Choose a Measures Registry path">
        <div className="registry-path-choice-contrast">
          {plaques.map((plaque, index) => {
            const title = asString(plaque.title) ?? asString(plaque.cta) ?? asString(plaque.label)
            const body = asString(plaque.body)
            const side = asString(plaque.side) ?? (index === 0 ? "left" : "right")
            const heroUrl = side === "left" ? leftHeroUrl : rightHeroUrl

            const motionUrl = side === "left" ? leftMotionUrl : rightMotionUrl
            const settled = side === "left" ? leftSettled : rightSettled
            const onSettled = side === "left"
              ? () => setLeftSettled(true)
              : () => setRightSettled(true)

            return (
              <button
                key={side}
                type="button"
                className="registry-route-plate"
                data-choice={side}
                data-motion-settled={settled ? "true" : undefined}
                onClick={choiceHandler(plaque, index)}
              >
                {motionUrl && !settled ? (
                  <video
                    className="registry-route-plate-image"
                    src={motionUrl}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                    onEnded={onSettled}
                  />
                ) : heroUrl ? (
                  <img className="registry-route-plate-image" src={heroUrl} alt="" aria-hidden="true" />
                ) : null}
                {title ? <span>{title}</span> : null}
                {body ? <p>{body}</p> : null}
                <span className="registry-route-plate-cta" aria-hidden="true">→</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
