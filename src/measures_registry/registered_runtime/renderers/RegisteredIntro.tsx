import type { CSSProperties, RefObject } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  registryTokenStyle: CSSProperties
  epigraphVideoRef: RefObject<HTMLVideoElement>
  epigraphVideoUrl: string | null
  epigraphEntered: boolean
  epigraphMuted: boolean
  epigraphFailed: boolean
  landingHeroReady: boolean
  thresholdMotionSettled: { left: boolean; right: boolean }
  thresholdLeftStillUrl: string | null
  thresholdLeftMotionUrl: string | null
  thresholdRightStillUrl: string | null
  thresholdRightMotionUrl: string | null
  introCopy: SectionCopy
  thresholdCopy: SectionCopy
  onEpigraphEnter: () => void
  onEpigraphMuteToggle: () => void
  onEpigraphSkip: () => void
  onEpigraphError: () => void
  onEpigraphEnd: () => void
  onThresholdMotionSettled: (side: "left" | "right") => void
  onLeftChoice: () => void
  onRightChoice: () => void
}

export default function RegisteredIntro({
  registryTokenStyle,
  epigraphVideoRef,
  epigraphVideoUrl,
  epigraphEntered,
  epigraphMuted,
  epigraphFailed,
  landingHeroReady,
  thresholdMotionSettled,
  thresholdLeftStillUrl,
  thresholdLeftMotionUrl,
  thresholdRightStillUrl,
  thresholdRightMotionUrl,
  introCopy,
  thresholdCopy,
  onEpigraphEnter,
  onEpigraphMuteToggle,
  onEpigraphSkip,
  onEpigraphError,
  onEpigraphEnd,
  onThresholdMotionSettled,
  onLeftChoice,
  onRightChoice,
}: Props) {
  const thresholdRecords = thresholdCopy.plaques.length > 0 ? thresholdCopy.plaques : thresholdCopy.heroPaths
  const leftThreshold = thresholdRecords.find((record) => asString(record.side) === "left") ?? thresholdRecords[0]
  const rightThreshold = thresholdRecords.find((record) => asString(record.side) === "right") ?? thresholdRecords[1]

  function renderThresholdSeat(
    side: "left" | "right",
    stillUrl: string | null,
    motionUrl: string | null,
    copy: { body: string | null; cta: string | null; ariaLabel: string },
    onChoice: () => void,
  ) {
    if (!copy.body || !copy.cta) return null
    const isSettled = thresholdMotionSettled[side] || !motionUrl

    return (
      <button
        type="button"
        className="registry-threshold-seat"
        data-side={side}
        onClick={onChoice}
      >
        {stillUrl ? (
          <img className="registry-threshold-still" src={stillUrl} alt="" aria-hidden="true" />
        ) : null}
        {motionUrl && !isSettled ? (
          <video
            className="registry-threshold-motion"
            src={motionUrl}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => onThresholdMotionSettled(side)}
            onError={() => onThresholdMotionSettled(side)}
            aria-label={copy.ariaLabel}
          />
        ) : null}
        <span className="registry-threshold-copy">
          <span>{copy.body}</span>
          <strong>{copy.cta}</strong>
        </span>
      </button>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface="landing_root"
      data-material-family="crystal"
      data-layout-contract="intro"
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {!landingHeroReady ? (
        <section
          className="registry-intro-video"
          aria-label="Measures Registry epigraph"
          data-entered={epigraphEntered}
          data-failed={epigraphFailed}
        >
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
            <video
              ref={epigraphVideoRef}
              src={epigraphVideoUrl}
              preload="auto"
              autoPlay
              muted={epigraphMuted}
              playsInline
              onEnded={onEpigraphEnd}
              onError={onEpigraphError}
              aria-label="Measures Registry epigraph"
            />
          ) : null}
          {!epigraphEntered || epigraphFailed || !epigraphVideoUrl ? (
            <button
              type="button"
              className="registry-epigraph-enter"
              aria-label={epigraphFailed ? "Continue" : "Enter"}
              onClick={() => {
                if (epigraphFailed || !epigraphVideoUrl) {
                  onEpigraphSkip()
                  return
                }
                onEpigraphEnter()
              }}
            >
              {epigraphFailed || !epigraphVideoUrl ? "Continue" : null}
            </button>
          ) : null}
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl && epigraphMuted ? (
            <div className="registry-epigraph-context">
              {introCopy.title ? <p>{introCopy.title}</p> : null}
              {introCopy.subtitle ? <span>{introCopy.subtitle}</span> : null}
            </div>
          ) : null}
          {epigraphEntered && !epigraphFailed && epigraphVideoUrl ? (
            <div className="registry-epigraph-controls">
              <button
                type="button"
                className="registry-epigraph-mute"
                aria-label={epigraphMuted ? "Enable sound" : "Mute"}
                onClick={onEpigraphMuteToggle}
              >
                {epigraphMuted ? "Audio" : "Mute"}
              </button>
              <button type="button" className="registry-epigraph-skip" onClick={onEpigraphSkip}>
                Continue
              </button>
            </div>
          ) : null}
        </section>
      ) : thresholdRecords.length >= 2 ? (
        <section className="registry-threshold-hero" aria-label={thresholdCopy.title ?? "Measures Registry threshold"}>
          {renderThresholdSeat(
            "left",
            thresholdLeftStillUrl,
            thresholdLeftMotionUrl,
            {
              body: asString(leftThreshold?.body),
              cta: asString(leftThreshold?.title) ?? asString(leftThreshold?.cta) ?? asString(leftThreshold?.label),
              ariaLabel: "Fractured environment motion",
            },
            onLeftChoice,
          )}
          <div className="registry-threshold-divide" aria-hidden="true" />
          {renderThresholdSeat(
            "right",
            thresholdRightStillUrl,
            thresholdRightMotionUrl,
            {
              body: asString(rightThreshold?.body),
              cta: asString(rightThreshold?.title) ?? asString(rightThreshold?.cta) ?? asString(rightThreshold?.label),
              ariaLabel: "Measured environment motion",
            },
            onRightChoice,
          )}
        </section>
      ) : (
        <section className="registry-held-state" role="status" data-release-standing="held_missing_registry_content">
          <p>Public threshold content is not seated in the registry.</p>
        </section>
      )}
    </main>
  )
}
