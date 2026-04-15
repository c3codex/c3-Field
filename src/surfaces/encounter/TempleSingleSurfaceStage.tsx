import { useState } from "react"
import EncounterStageMedia from "@/surfaces/encounter/EncounterStageMedia"
import type { ResolvedAction, RuntimeMediaItem } from "@/systems/measures/types"

type PlaybackConfig = {
  videoMode?: string
  audioMode?: string
  settleToStill?: boolean
  autoAdvanceOnVideoEnd?: boolean
  advanceDelayMs?: number
}

type Props = {
  action: ResolvedAction | null
  primaryVideo?: RuntimeMediaItem | null
  primaryStill?: RuntimeMediaItem | null
  tonalAudio?: RuntimeMediaItem | null
  showMutedAutoplayVideo?: boolean
  playback?: PlaybackConfig
  refractionMode?: string
  showStill?: boolean
  videoVisible?: boolean
  onAction?: (action: ResolvedAction) => void
  onPrimaryVideoEnded?: () => void
}

export default function TempleSingleSurfaceStage({
  action,
  primaryVideo,
  primaryStill,
  tonalAudio,
  showMutedAutoplayVideo,
  playback,
  refractionMode,
  showStill,
  videoVisible,
  onAction,
  onPrimaryVideoEnded,
}: Props) {
  const [isHoveringTemple, setIsHoveringTemple] = useState(false)

  const actionLabel = action?.label?.trim()
  const isActionAvailable = Boolean(action && !action.blocked)

  function handleTempleClick() {
    if (!action || action.blocked) return
    onAction?.(action)
  }

  return (
    <div
      role={isActionAvailable ? "button" : undefined}
      tabIndex={isActionAvailable ? 0 : -1}
      aria-label={actionLabel}
      onClick={handleTempleClick}
      onMouseEnter={() => setIsHoveringTemple(true)}
      onMouseLeave={() => setIsHoveringTemple(false)}
      onKeyDown={(event) => {
        if (!isActionAvailable) return
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleTempleClick()
        }
      }}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        cursor: isActionAvailable ? "pointer" : "default",
        outline: "none",
      }}
    >
      <EncounterStageMedia
        primaryVideo={primaryVideo}
        primaryStill={primaryStill}
        tonalAudio={tonalAudio}
        showMutedAutoplayVideo={showMutedAutoplayVideo}
        playback={playback}
        isCrystalTempleHome
        showStill={showStill}
        videoVisible={videoVisible}
        onPrimaryVideoEnded={onPrimaryVideoEnded}
      />

      {refractionMode === "crystal_soft" ? (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 50% 38%, rgba(190,220,255,0.18) 0%, rgba(190,220,255,0.06) 18%, rgba(4,8,18,0) 48%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(115deg, rgba(255,255,255,0.04) 18%, rgba(160,210,255,0.10) 28%, rgba(255,255,255,0.03) 35%, rgba(4,8,18,0) 44%)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        </>
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHoveringTemple
            ? "radial-gradient(circle at 50% 52%, rgba(210,235,255,0.10) 0%, rgba(210,235,255,0.03) 18%, rgba(0,0,0,0) 42%)"
            : "radial-gradient(circle at 50% 52%, rgba(210,235,255,0.05) 0%, rgba(210,235,255,0.015) 18%, rgba(0,0,0,0) 42%)",
          transition: "background 260ms ease",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {isHoveringTemple && actionLabel ? (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "8vh",
            transform: "translateX(-50%)",
            zIndex: 4,
            padding: "10px 18px",
            borderRadius: 999,
            border: "1px solid rgba(210,230,255,0.12)",
            background: "rgba(8,12,24,0.22)",
            color: "rgba(245,248,255,0.96)",
            backdropFilter: "blur(8px)",
            fontSize: "0.92rem",
            letterSpacing: "0.02em",
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            pointerEvents: "none",
          }}
        >
          {actionLabel}
        </div>
      ) : null}
    </div>
  )
}