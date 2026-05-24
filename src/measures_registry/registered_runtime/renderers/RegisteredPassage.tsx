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
  onContinue,
  onToggleMuted,
}: Props) {
  const materialFamily =
    typeof passageCopy.stylingContract?.material_family === "string"
      ? passageCopy.stylingContract.material_family
      : variant === "structure" ? "obsidian" : "standard"

  const surfaceKey = variant === "eval" ? "educational_diagnostic_passage" : "structure_passage"

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

  return (
    <main
      className="measures-registry-runtime"
      data-surface={surfaceKey}
      data-material-family={materialFamily}
      style={registryTokenStyle}
    >
      {renderHeader()}
      <section className="registry-diagnostic-passage" aria-label={title}>
        {passageVideoUrl ? (
          <video
            src={passageVideoUrl}
            autoPlay
            muted={passageMuted}
            controls
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
          {continueLabel}
        </button>
      </section>
    </main>
  )
}
