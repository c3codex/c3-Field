import { useEffect, useMemo, useRef, useState } from "react"
import { ActionRail } from "@/components/actions/ActionRail"
import EncounterStageMedia from "@/surfaces/encounter/EncounterStageMedia"
import TempleSingleSurfaceStage from "@/surfaces/encounter/TempleSingleSurfaceStage"
import AntechamberPlaque from "@/surfaces/encounter/AntechamberPlaque"
import GuestRegistryCapture from "@/surfaces/encounter/GuestRegistryCapture"
import PhaseMap from "@/surfaces/phase_map/PhaseMap"
import type {
  EncounterResolution,
  ResolvedAction,
} from "@/systems/measures/types"

type Props = {
  resolution: EncounterResolution
  onAction?: (action: ResolvedAction) => void
}

type PlaqueContent = {
  title?: string
  body?: string[]
  secondary_title?: string
  secondary_body?: string[]
  position?: string
}

type GuestRegistryField = {
  key: string
  label: string
  type: "text" | "email"
  required?: boolean
}

type GuestRegistryConfig = {
  enabled?: boolean
  mode?: string
  position?: string
  trigger_label?: string
  title?: string
  supporting_text?: string
  fields?: GuestRegistryField[]
  submit_label?: string
  success_message?: string
}

type PlaybackConfig = {
  videoMode?: string
  audioMode?: string
  settleToStill?: boolean
  autoAdvanceOnVideoEnd?: boolean
  advanceDelayMs?: number
}

export default function GenericEncounter({ resolution, onAction }: Props) {
  const { encounter, state, renderer, media, actions } = resolution

  const presentation =
    (encounter.metadata?.presentation as Record<string, unknown> | undefined) ??
    {}

  const playbackFromPresentation =
    (presentation.playback as PlaybackConfig | undefined) ?? undefined

  const playback = playbackFromPresentation ??
    renderer.playback ?? {
      videoMode: "default",
      audioMode: "default",
      settleToStill: false,
      autoAdvanceOnVideoEnd: false,
      advanceDelayMs: 0,
    }

  const refractionMode =
    typeof presentation.refraction_mode === "string"
      ? presentation.refraction_mode
      : "none"

  const plaque =
    (presentation.plaque as PlaqueContent | undefined) ?? undefined

  const guestRegistry =
    (presentation.guest_registry as GuestRegistryConfig | undefined) ?? undefined

  const isIntroEncounter = encounter.encounterKey === "temple_inanna_view"

  const isCrystalTempleHome =
    encounter.encounterKey === "crystal_temple_home_view"

  const isTempleAntechamber =
    encounter.encounterKey === "temple_antechamber_view"

  const isTempleHarrumukPassage =
    encounter.encounterKey === "temple_harrumuk_passage_view"

  const isPhaseMapEncounter =
    encounter.encounterKey === "phase_map" || encounter.registryKey === "phase_map"

  const autoAdvanceTimeoutRef = useRef<number | null>(null)
  const [showStill, setShowStill] = useState(false)
  const [videoVisible, setVideoVisible] = useState(true)

  const primaryVideo = useMemo(
    () => media.find((item) => item.mediaType === "video") ?? null,
    [media]
  )

  const primaryStill = useMemo(
    () => media.find((item) => item.mediaType === "image") ?? null,
    [media]
  )

  const tonalAudio = useMemo(
    () => media.find((item) => item.mediaType === "audio") ?? null,
    [media]
  )

  const singleSurfaceAction = useMemo(
    () =>
      actions.find(
        (action) =>
          !action.blocked &&
          action.metadata?.interaction_mode === "single_surface" &&
          action.metadata?.interaction_target === "temple_image"
      ) ?? null,
    [actions]
  )

  const useSingleSurfaceTempleInteraction =
    isCrystalTempleHome && singleSurfaceAction !== null

  useEffect(() => {
    setShowStill(false)
    setVideoVisible(true)

    return () => {
      if (autoAdvanceTimeoutRef.current) {
        window.clearTimeout(autoAdvanceTimeoutRef.current)
      }
    }
  }, [encounter.encounterKey])

  function triggerAutoAdvance() {
    if (!playback.autoAdvanceOnVideoEnd) return

    const targetAction =
      actions.find((action) => !action.blocked && action.targetRegistryKey) ??
      null

    if (!targetAction) return

    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      onAction?.(targetAction)
    }, playback.advanceDelayMs)
  }

  function handlePrimaryVideoEnded() {
    if (playback.settleToStill) {
      setShowStill(true)
      window.setTimeout(() => {
        setVideoVisible(false)
      }, 220)
    }

    triggerAutoAdvance()
  }

  const showMutedAutoplayVideo = playback.videoMode === "muted_autoplay"

  const stageStyle: React.CSSProperties = isIntroEncounter
    ? {
        minHeight: "calc(100vh - 48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
      }
    : isCrystalTempleHome ||
        isTempleAntechamber ||
        isTempleHarrumukPassage ||
        isPhaseMapEncounter
      ? {
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          marginBottom: 0,
        }
      : {
          display: "grid",
          gap: 20,
          marginBottom: 24,
        }

  const mediaInnerStyle: React.CSSProperties = isIntroEncounter
    ? {
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gap: 16,
      }
    : isCrystalTempleHome ||
        isTempleAntechamber ||
        isTempleHarrumukPassage ||
        isPhaseMapEncounter
      ? {
          position: "relative",
          width: "100%",
          maxWidth:
            isTempleHarrumukPassage || isPhaseMapEncounter ? "100vw" : "1180px",
          minHeight: "100vh",
          margin: "0 auto",
        }
      : {
          width: "100%",
          display: "grid",
          gap: 20,
        }

  return (
    <section
      style={{
        minHeight: "100vh",
        padding:
          isIntroEncounter || isCrystalTempleHome || isTempleAntechamber
            ? 0
            : 24,
        position: "relative",
      }}
    >
      <div style={stageStyle}>
        <div style={mediaInnerStyle}>
          {isPhaseMapEncounter ? (
            <PhaseMap
              activeRegistryKey={encounter.registryKey}
              onNodeAction={(registryKey) => {
                const targetAction =
                  actions.find(
                    (action) =>
                      !action.blocked &&
                      action.targetRegistryKey === registryKey
                  ) ?? null

                if (targetAction) {
                  onAction?.(targetAction)
                }
              }}
            />
          ) : useSingleSurfaceTempleInteraction ? (
            <TempleSingleSurfaceStage
              action={singleSurfaceAction}
              primaryVideo={primaryVideo}
              primaryStill={primaryStill}
              tonalAudio={tonalAudio}
              showMutedAutoplayVideo={showMutedAutoplayVideo}
              playback={playback}
              refractionMode={refractionMode}
              showStill={showStill}
              videoVisible={videoVisible}
              onAction={onAction}
              onPrimaryVideoEnded={handlePrimaryVideoEnded}
            />
          ) : (
            <>
              <EncounterStageMedia
                primaryVideo={primaryVideo}
                primaryStill={primaryStill}
                tonalAudio={tonalAudio}
                showMutedAutoplayVideo={showMutedAutoplayVideo}
                playback={playback}
                isIntroEncounter={isIntroEncounter}
                isCrystalTempleHome={isCrystalTempleHome}
                isTempleAntechamber={isTempleAntechamber}
                isTempleHarrumukPassage={isTempleHarrumukPassage}
                showStill={showStill}
                videoVisible={videoVisible}
                onPrimaryVideoEnded={handlePrimaryVideoEnded}
              />

              {(isCrystalTempleHome || isTempleAntechamber) &&
              refractionMode === "crystal_soft" ? (
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

              {isTempleAntechamber && plaque ? (
                <AntechamberPlaque plaque={plaque} />
              ) : null}

              {isTempleAntechamber && guestRegistry ? (
                <GuestRegistryCapture
                  config={guestRegistry}
                  encounterKey={encounter.encounterKey}
                  registryKey={encounter.registryKey}
                />
              ) : null}

              {!isCrystalTempleHome &&
              !isTempleAntechamber &&
              !isTempleHarrumukPassage &&
              !isPhaseMapEncounter
                ? media
                    .filter((item) => {
                      const urlKey = `${item.bucketName}/${item.storagePath}/${item.renderOrder}`
                      const primaryVideoKey = primaryVideo
                        ? `${primaryVideo.bucketName}/${primaryVideo.storagePath}/${primaryVideo.renderOrder}`
                        : null
                      const primaryStillKey = primaryStill
                        ? `${primaryStill.bucketName}/${primaryStill.storagePath}/${primaryStill.renderOrder}`
                        : null
                      const tonalAudioKey = tonalAudio
                        ? `${tonalAudio.bucketName}/${tonalAudio.storagePath}/${tonalAudio.renderOrder}`
                        : null

                      return (
                        urlKey !== primaryVideoKey &&
                        urlKey !== primaryStillKey &&
                        urlKey !== tonalAudioKey
                      )
                    })
                    .map((item) => (
                      <EncounterStageMedia
                        key={`${item.bucketName}/${item.storagePath}/${item.renderOrder}`}
                        extraItem={item}
                      />
                    ))
                : null}
            </>
          )}
        </div>
      </div>

      {!isIntroEncounter &&
      !isCrystalTempleHome &&
      !isTempleHarrumukPassage &&
      !isPhaseMapEncounter &&
      renderer.showActionRail ? (
        <div
          style={{
            padding: isTempleAntechamber ? "0 24px 24px" : 0,
            position: isTempleAntechamber ? "absolute" : "relative",
            left: isTempleAntechamber ? "50%" : undefined,
            bottom: isTempleAntechamber ? "6vh" : undefined,
            transform: isTempleAntechamber ? "translateX(-50%)" : undefined,
            zIndex: isTempleAntechamber ? 5 : undefined,
            width: isTempleAntechamber ? "auto" : undefined,
          }}
        >
          <ActionRail actions={actions} onAction={onAction} />
        </div>
      ) : null}
    </section>
  )
}
