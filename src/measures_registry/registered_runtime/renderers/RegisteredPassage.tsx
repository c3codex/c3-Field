import type { CSSProperties, ReactNode } from "react"
import { asString } from "../registeredRuntimeUtils"
import type { SectionCopy } from "../registeredRuntimeUtils"

type Props = {
  variant: "eval" | "structure"
  registryTokenStyle: CSSProperties
  passageCopy: SectionCopy
  passageVideoUrl: string | null
  passageMuted: boolean
  renderHeader: () => ReactNode
  renderSystemFooter: () => ReactNode
  onContinue: () => void
  onToggleMuted: () => void
}

export default function RegisteredPassage({
  variant,
  registryTokenStyle,
  passageCopy,
  passageVideoUrl,
  passageMuted,
  renderHeader,
  renderSystemFooter,
  onContinue,
  onToggleMuted,
}: Props) {
  const materialFamily =
    typeof passageCopy.stylingContract?.material_family === "string"
      ? passageCopy.stylingContract.material_family
      : variant === "structure" ? "crystal" : "obsidian"

  const layoutMode = typeof passageCopy.layoutContract?.layout_mode === "string"
    ? passageCopy.layoutContract.layout_mode
    : "passage_explainer"

  const isSplitScreen = layoutMode === "split_screen_passage"

  const surfaceKey = variant === "eval" ? "eval_passage" : "structure_passage"

  const title =
    passageCopy.title ??
    (variant === "eval"
      ? "Before evaluation, recognize the environment."
      : "How does a structured environment optimize AI performance?")

  const subtitle =
    passageCopy.subtitle ??
    (variant === "eval"
      ? "Most AI instability is not model failure alone. It emerges where authority, validation, oversight, implementation structure, and behavioral registration are unclear or absent."
      : null)

  const continueLabel =
    asString(passageCopy.actions.find((a) => asString(a.action_key) === "continue_to_evaluation")?.label) ??
    (variant === "eval" ? "Continue to Evaluation" : "Continue to Structured Evaluation")

  const ctaPrimary = passageCopy.ctaPrimary ?? continueLabel
  const ctaSecondary = passageCopy.ctaSecondary ?? (passageMuted ? "Audio" : "Mute")
  const informationalParagraph = passageCopy.informationalParagraph ?? subtitle

  const autoAdvanceOnEnd = passageCopy.mediaBehaviorContract?.auto_advance_on_end !== false

  if (isSplitScreen) {
    return (
      <main
        className="measures-registry-runtime"
        data-surface={surfaceKey}
        data-material-family={materialFamily}
        data-layout-contract="passage"
        data-layout-mode={layoutMode}
        data-release-standing="public"
        style={registryTokenStyle}
      >
        {renderHeader()}
        <section className="registry-diagnostic-passage registry-passage-split" aria-label={title}>
          <div className="registry-passage-media-panel">
            {passageVideoUrl ? (
              <video
                src={passageVideoUrl}
                autoPlay
                muted={passageMuted}
                playsInline
                preload="auto"
                onEnded={autoAdvanceOnEnd ? onContinue : undefined}
                aria-label="Passage"
              />
            ) : null}
          </div>
          <div className="registry-passage-information-panel">
            <div className="registry-encounter-entry">
              {passageCopy.eyebrow ? <span>{passageCopy.eyebrow}</span> : null}
              <h1>{title}</h1>
              {informationalParagraph ? <p>{informationalParagraph}</p> : null}
            </div>
            <div className="registry-encounter-actions">
              <button type="button" onClick={onContinue}>
                {ctaPrimary}
              </button>
              <button
                type="button"
                onClick={onToggleMuted}
                className="registry-passage-audio-control"
              >
                {passageMuted ? ctaSecondary : "Mute"}
              </button>
            </div>
          </div>
        </section>
        {renderSystemFooter()}
      </main>
    )
  }

  return (
    <main
      className="measures-registry-runtime"
      data-surface={surfaceKey}
      data-material-family={materialFamily}
      data-layout-contract="passage"
      data-layout-mode={layoutMode}
      data-release-standing="public"
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-diagnostic-passage" aria-label={title}>
        {passageVideoUrl ? (
          <video
            src={passageVideoUrl}
            autoPlay
            muted={passageMuted}
            playsInline
            preload="auto"
            onEnded={onContinue}
            aria-label="Passage"
          />
        ) : null}
        <div className="registry-diagnostic-passage-controls" aria-label="Passage controls">
          <button type="button" onClick={onContinue}>
            Continue
          </button>
          {passageVideoUrl ? (
            <button type="button" onClick={onToggleMuted}>
              {passageMuted ? "Audio" : "Mute"}
            </button>
          ) : null}
        </div>
        <div>
          {passageCopy.eyebrow ? <span>{passageCopy.eyebrow}</span> : null}
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <button type="button" onClick={onContinue}>
          {ctaPrimary}
        </button>
      </section>
      {renderSystemFooter()}
    </main>
  )
}
