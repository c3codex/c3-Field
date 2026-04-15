import { toPublicMediaUrl } from "@/systems/measures/resolve_encounter"
import type { RuntimeMediaItem } from "@/systems/measures/types"

type PlaybackConfig = {
  videoMode?: string
  audioMode?: string
  settleToStill?: boolean
  autoAdvanceOnVideoEnd?: boolean
  advanceDelayMs?: number
}

type Props = {
  primaryVideo?: RuntimeMediaItem | null
  primaryStill?: RuntimeMediaItem | null
  tonalAudio?: RuntimeMediaItem | null
  showMutedAutoplayVideo?: boolean
  playback?: PlaybackConfig
  isIntroEncounter?: boolean
  isCrystalTempleHome?: boolean
  isTempleAntechamber?: boolean
  isTempleHarrumukPassage?: boolean
  showStill?: boolean
  videoVisible?: boolean
  onPrimaryVideoEnded?: () => void
  extraItem?: RuntimeMediaItem
}

function RenderMediaItem({
  item,
  autoPlayMuted,
  onEnded,
  hidden,
  fit = "cover",
  stageMode = "default",
  opacity = 1,
}: {
  item: RuntimeMediaItem
  autoPlayMuted?: boolean
  onEnded?: () => void
  hidden?: boolean
  fit?: "cover" | "contain"
  stageMode?: "default" | "intro" | "home"
  opacity?: number
}) {
  const mediaUrl = toPublicMediaUrl(item)
  const immersiveMode = stageMode === "intro" || stageMode === "home"

  const commonStyle: React.CSSProperties = {
    width: "100%",
    display: hidden ? "none" : "block",
    borderRadius: immersiveMode ? 0 : 24,
    objectFit: fit,
    opacity,
    transition: "opacity 1400ms ease, transform 300ms ease, filter 300ms ease",
    maxHeight: stageMode === "intro" ? "82vh" : undefined,
    background: "transparent",
  }

  if (item.mediaType === "image") {
    return <img src={mediaUrl} alt={item.label || ""} style={commonStyle} />
  }

  if (item.mediaType === "video") {
    return (
      <video
        src={mediaUrl}
        controls={!autoPlayMuted}
        autoPlay={autoPlayMuted}
        muted={autoPlayMuted}
        playsInline
        preload="auto"
        onEnded={onEnded}
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

  if (item.mediaType === "audio") {
    return (
      <audio
        src={mediaUrl}
        autoPlay
        playsInline
        style={{ display: hidden ? "none" : "block" }}
        ref={(node) => {
          if (node) {
            node.volume = 1
          }
        }}
      />
    )
  }

  return (
    <a
      href={mediaUrl}
      target="_blank"
      rel="noreferrer"
      style={{ display: hidden ? "none" : "inline" }}
    >
      {item.label || mediaUrl}
    </a>
  )
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
  showStill,
  videoVisible,
  onPrimaryVideoEnded,
  extraItem,
}: Props) {
  if (extraItem) {
    return <RenderMediaItem item={extraItem} />
  }

  const fit =
    isIntroEncounter || isTempleHarrumukPassage ? "contain" : "cover"

  const stageMode =
    isIntroEncounter || isTempleHarrumukPassage
      ? "intro"
      : isCrystalTempleHome || isTempleAntechamber
        ? "home"
        : "default"

  return (
    <>
      {primaryVideo ? (
        <RenderMediaItem
          item={primaryVideo}
          autoPlayMuted={showMutedAutoplayVideo}
          onEnded={showMutedAutoplayVideo ? onPrimaryVideoEnded : undefined}
          hidden={playback?.settleToStill && !videoVisible}
          fit={fit}
          stageMode={stageMode}
          opacity={videoVisible ? 1 : 0}
        />
      ) : null}

      {primaryStill ? (
        <RenderMediaItem
          item={primaryStill}
          hidden={primaryVideo !== null && playback?.settleToStill && !showStill}
          fit={fit}
          stageMode={stageMode}
          opacity={showStill || !primaryVideo ? 1 : 0}
        />
      ) : null}

      {tonalAudio && playback?.audioMode === "separate_tonal_audio" ? (
        <div
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <RenderMediaItem item={tonalAudio} />
        </div>
      ) : null}
    </>
  )
}
