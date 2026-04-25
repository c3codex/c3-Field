import type { CSSProperties } from "react"
import { toPublicMediaUrl } from "./resolve_encounter"
import type {
  PlaybackContract,
  RuntimeMediaItem,
  ResolvedAction,
} from "./types"

type Props = {
  primaryVideo?: RuntimeMediaItem | null
  primaryStill?: RuntimeMediaItem | null
  tonalAudio?: RuntimeMediaItem | null
  showMutedAutoplayVideo?: boolean
  playback?: PlaybackContract | null
  isIntroEncounter?: boolean
  isCrystalTempleHome?: boolean
  isTempleAntechamber?: boolean
  isTempleHarrumukPassage?: boolean
  showStill?: boolean
  videoVisible?: boolean
  onPrimaryVideoEnded?: () => void
  primaryImageAction?: ResolvedAction | null
  onAction?: (action: ResolvedAction) => void
  extraItem?: RuntimeMediaItem
}

function RenderMediaItem({
  item,
  autoPlayMuted,
  onEnded,
  hidden,
}: {
  item: RuntimeMediaItem
  autoPlayMuted?: boolean
  onEnded?: () => void
  hidden?: boolean
}) {
  const src = toPublicMediaUrl(item)

  if (!src) {
    return <div className="media-empty">media unavailable</div>
  }

  const commonStyle: CSSProperties = {
    objectFit: "var(--encounter-media-object-fit, cover)",
    display: hidden ? "none" : "block",
    transition: "opacity 1400ms ease",
  }

  if (item.mediaType === "video") {
    return (
      <video
        src={src}
        autoPlay={autoPlayMuted}
        muted={autoPlayMuted}
        playsInline
        preload="auto"
        controls={!autoPlayMuted}
        onEnded={onEnded}
        onError={onEnded}
        style={commonStyle}
        ref={(node) => {
          if (node && autoPlayMuted) {
            node.muted = true
            node.defaultMuted = true
          }
        }}
      />
    )
  }

  if (item.mediaType === "image") {
    return <img src={src} alt={item.label ?? ""} style={commonStyle} />
  }

  if (item.mediaType === "audio") {
    return (
      <audio
        src={src}
        autoPlay
        playsInline
        preload="auto"
        controls={!hidden}
        style={
          hidden
            ? {
                position: "absolute",
                width: 1,
                height: 1,
                overflow: "hidden",
                opacity: 0,
                pointerEvents: "none",
              }
            : { display: "block" }
        }
        ref={(node) => {
          if (node) node.volume = 0.14
        }}
      />
    )
  }

  return <div className="media-empty">unsupported media type: {item.mediaType}</div>
}

export default function EncounterStageMedia({
  primaryVideo,
  primaryStill,
  tonalAudio,
  showMutedAutoplayVideo,
  playback,
  isIntroEncounter,
  isCrystalTempleHome,
  isTempleAntechamber,
  isTempleHarrumukPassage,
  showStill = true,
  videoVisible = true,
  onPrimaryVideoEnded,
  primaryImageAction,
  onAction,
  extraItem,
}: Props) {
  const shouldShowVideo = Boolean(primaryVideo && videoVisible)
  const shouldShowStill = Boolean(primaryStill && showStill)
  const audioMode = playback?.audioMode ?? playback?.audio_mode ?? "default"
  const shouldRenderTonalAudio = Boolean(tonalAudio && audioMode !== "disabled")

  return (
    <section
      className={[
        "encounter-stage-media",
        isIntroEncounter ? "intro-encounter" : "",
        isCrystalTempleHome ? "crystal-temple-home" : "",
        isTempleAntechamber ? "temple-antechamber" : "",
        isTempleHarrumukPassage ? "temple-harrumuk-passage" : "",
      ].join(" ")}
    >
      {shouldShowVideo && primaryVideo && (
        <div className="media-video">
          <RenderMediaItem
            item={primaryVideo}
            autoPlayMuted={showMutedAutoplayVideo}
            onEnded={onPrimaryVideoEnded}
          />
        </div>
      )}

      {shouldShowStill && primaryStill && (
        primaryImageAction && onAction ? (
          <button
            type="button"
            className="media-still"
            onClick={() => onAction(primaryImageAction)}
          >
            <RenderMediaItem item={primaryStill} />
          </button>
        ) : (
          <div className="media-still">
            <RenderMediaItem item={primaryStill} />
          </div>
        )
      )}

      {shouldRenderTonalAudio && tonalAudio && (
        <div className="media-audio">
          <RenderMediaItem item={tonalAudio} hidden />
        </div>
      )}

      {extraItem && (
        <div className="media-extra">
          <RenderMediaItem item={extraItem} />
        </div>
      )}
    </section>
  )
}
