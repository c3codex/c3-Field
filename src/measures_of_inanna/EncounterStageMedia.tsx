import { useEffect, useState } from "react"
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
  audioVolume?: number
  primaryVideoMuted?: boolean
}

const MEDIA_UNLOCK_SESSION_KEY = "c3_media_audio_unlocked"

function mediaDefaultVolume(item?: RuntimeMediaItem | null, fallback = 0.07) {
  const mapVolume = item?.mapMetadata?.default_volume
  const assetVolume = item?.assetMetadata?.default_volume
  const value =
    typeof mapVolume === "number"
      ? mapVolume
      : typeof assetVolume === "number"
        ? assetVolume
        : fallback

  return Math.min(1, Math.max(0, value))
}

function mediaBoolean(item: RuntimeMediaItem, key: string) {
  const mapValue = item.mapMetadata?.[key]
  const assetValue = item.assetMetadata?.[key]
  if (typeof mapValue === "boolean") return mapValue
  if (typeof assetValue === "boolean") return assetValue
  return null
}

function browserHasUserActivation() {
  if (typeof navigator === "undefined") return false
  return navigator.userActivation?.hasBeenActive === true
}

function useMediaAudioUnlocked() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false
    return (
      window.sessionStorage.getItem(MEDIA_UNLOCK_SESSION_KEY) === "true" ||
      browserHasUserActivation()
    )
  })

  useEffect(() => {
    if (typeof window === "undefined" || unlocked) return

    const unlock = () => {
      window.sessionStorage.setItem(MEDIA_UNLOCK_SESSION_KEY, "true")
      setUnlocked(true)
    }

    if (browserHasUserActivation()) {
      unlock()
      return
    }

    window.addEventListener("pointerdown", unlock, { once: true, passive: true })
    window.addEventListener("keydown", unlock, { once: true })

    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
  }, [unlocked])

  return unlocked
}

function RenderMediaItem({
  item,
  autoPlayMuted,
  muted,
  onEnded,
  hidden,
  audioVolume,
}: {
  item: RuntimeMediaItem
  autoPlayMuted?: boolean
  muted?: boolean
  onEnded?: () => void
  hidden?: boolean
  audioVolume?: number
}) {
  const src = toPublicMediaUrl(item)
  const mediaAudioUnlocked = useMediaAudioUnlocked()

  if (!src) {
    return <div className="media-empty">media unavailable</div>
  }

  const commonStyle: CSSProperties = {
    objectFit: "var(--encounter-media-object-fit, cover)" as CSSProperties["objectFit"],
    display: hidden ? "none" : "block",
    transition: "opacity 1400ms ease",
  }

  if (item.mediaType === "video") {
    const shouldLoop = mediaBoolean(item, "loop") === true
    const shouldAutoplay = Boolean(autoPlayMuted || shouldLoop)
    const explicitlyMuted =
      muted === true ||
      mediaBoolean(item, "muted") === true ||
      mediaBoolean(item, "muted_autoplay") === true
    const videoMuted = shouldAutoplay
      ? !mediaAudioUnlocked || explicitlyMuted
      : Boolean(muted ?? explicitlyMuted)

    return (
      <video
        src={src}
        autoPlay={shouldAutoplay}
        loop={shouldLoop}
        muted={videoMuted}
        playsInline
        preload="auto"
        controls={!shouldAutoplay || !videoMuted}
        onEnded={onEnded}
        onError={onEnded}
        style={commonStyle}
        ref={(node) => {
          if (node) {
            node.volume = mediaDefaultVolume(item, 1)
            node.muted = Boolean(videoMuted)
            node.defaultMuted = Boolean(videoMuted)
            if (shouldAutoplay) {
              const playPromise = node.play()
              if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                  node.muted = true
                  node.defaultMuted = true
                  const mutedPlayPromise = node.play()
                  if (mutedPlayPromise && typeof mutedPlayPromise.catch === "function") {
                    mutedPlayPromise.catch(() => undefined)
                  }
                })
              }
            }
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
        autoPlay={mediaAudioUnlocked}
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
          if (node) {
            node.volume = audioVolume ?? mediaDefaultVolume(item)
            if (mediaAudioUnlocked) {
              const playPromise = node.play()
              if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => undefined)
              }
            }
          }
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
  audioVolume,
  primaryVideoMuted,
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
            muted={primaryVideoMuted}
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
          <RenderMediaItem
            item={tonalAudio}
            hidden
            audioVolume={mediaDefaultVolume(tonalAudio, audioVolume)}
          />
        </div>
      )}

      {extraItem && (
        <div className="media-extra">
          <RenderMediaItem
            item={extraItem}
            audioVolume={extraItem.mediaType === "audio" ? mediaDefaultVolume(extraItem, audioVolume) : undefined}
          />
        </div>
      )}
    </section>
  )
}
