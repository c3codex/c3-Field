import type { CSSProperties, RefObject } from "react"
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
  onEpigraphEnter,
  onEpigraphMuteToggle,
  onEpigraphSkip,
  onEpigraphError,
  onEpigraphEnd,
  onThresholdMotionSettled,
  onLeftChoice,
  onRightChoice,
}: Props) {
  function renderThresholdSeat(
    side: "left" | "right",
    stillUrl: string | null,
    motionUrl: string | null,
    copy: { body: string; cta: string; ariaLabel: string },
    onChoice: () => void,
  ) {
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
    <main className="measures-registry-runtime" data-surface="landing_root" style={registryTokenStyle}>
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
              <p>AI is not broken.</p>
              <p>The systems are.</p>
              <span>Integrity Governance begins where behavior becomes measurable.</span>
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
      ) : (
        <section className="registry-threshold-hero" aria-label="Measures Registry threshold">
          {renderThresholdSeat(
            "left",
            thresholdLeftStillUrl,
            thresholdLeftMotionUrl,
            {
              body: "Complexity is scaling faster than clarity. Your systems are producing outcomes nobody can fully explain.",
              cta: "Evaluate the Environment",
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
              body: "Coherence must be structured. Measured environments produce stable and governable outcomes.",
              cta: "Structure the Environment",
              ariaLabel: "Measured environment motion",
            },
            onRightChoice,
          )}
        </section>
      )}
    </main>
  )
}
