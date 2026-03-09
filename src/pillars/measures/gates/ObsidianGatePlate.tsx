// src/pillars/measures/gates/ObsidianGatePlate.tsx

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import MeasuresReturnGlyph from "@/pillars/measures/components/MeasuresReturnGlyph"
import { useMeasuresAudioBus } from "@/pillars/measures/audio/MeasuresAudioBusProvider"
import { useMeasuresGatePlate } from "@/pillars/measures/data/useMeasuresGatePlate"
import { MEASURES_ASSETS } from "@/pillars/measures/measuresAssets"
import { useGateNavigation } from "./useGateNavigation"

const AUTO_STATIC_AFTER_MS = 6000
const FADE_MS = 900
const ENCOUNTER_PAUSE_MS = 3000
const PLAQUE_OPEN_DELAY_MS = AUTO_STATIC_AFTER_MS + ENCOUNTER_PAUSE_MS

const VALID_GATE_SLUGS = new Set([
  "gate-0",
  "gate-i",
  "gate-ii",
  "gate-iii",
  "gate-iv",
  "gate-v",
  "gate-vi",
  "gate-vii",
])

export default function ObsidianGatePlate() {
  const nav = useNavigate()
  const { gateId } = useParams<{ gateId?: string }>()

  const isValidGateId = useMemo(() => {
    return gateId ? VALID_GATE_SLUGS.has(gateId.toLowerCase()) : false
  }, [gateId])

  useEffect(() => {
    if (!gateId) return
    if (!isValidGateId) nav("/measures/gates", { replace: true })
  }, [gateId, isValidGateId, nav])

  const bus = useMeasuresAudioBus()
  const safeGateId = isValidGateId ? gateId : undefined
  const { row, loading, error } = useMeasuresGatePlate(safeGateId)

  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [mediaMode, setMediaMode] = useState<"animated" | "still">("animated")
  const [showStill, setShowStill] = useState(false)
  const [videoFading, setVideoFading] = useState(false)

  const [plaqueOpen, setPlaqueOpen] = useState(false)
  const [plaqueMinimized, setPlaqueMinimized] = useState(false)

  const { setObsidianActive, restore } = bus

  useEffect(() => {
    setObsidianActive(true)
    return () => restore()
  }, [setObsidianActive, restore])

  const slug = row?.slug ?? null
  const isGate0 = slug === "gate-0"

  const { nextGate, isGateUnlocked } = useGateNavigation(slug)

  useEffect(() => {
    if (!slug) return

    const timers: number[] = []

    const clearAll = () => timers.forEach(t => clearTimeout(t))

    const v = videoRef.current
    if (v) v.playbackRate = 0.85

    timers.push(
      window.setTimeout(() => {
        setShowStill(true)
        setVideoFading(true)

        timers.push(
          window.setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.pause()
              videoRef.current.currentTime = 0
            }
            setMediaMode("still")
          }, FADE_MS)
        )
      }, AUTO_STATIC_AFTER_MS)
    )

    timers.push(
      window.setTimeout(() => {
        setPlaqueOpen(true)
        setPlaqueMinimized(false)
      }, PLAQUE_OPEN_DELAY_MS)
    )

    return clearAll
  }, [slug])

  if (loading) {
    return <div className="min-h-screen bg-black p-8 text-stone-200">Loading…</div>
  }

  if (error || !row) {
    return <div className="min-h-screen bg-black p-8 text-red-200">Gate missing</div>
  }

  if (!row.gate_released) {
    return (
      <section className="min-h-screen bg-black text-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm opacity-60">This gate remains sealed</div>

          <div className="mt-8">
            <MeasuresReturnGlyph to="/measures/gates" ariaLabel="Return to Gates" />
          </div>
        </div>
      </section>
    )
  }

  const still =
    row.media_still_url ??
    (isGate0 ? MEASURES_ASSETS.kumurrah.plates.gate0.still : null)

  const animated =
    row.media_animated_url ??
    (isGate0 ? MEASURES_ASSETS.kumurrah.plates.gate0.animated : null)

  if (!still) {
    return <div className="min-h-screen bg-black p-8 text-stone-200">Missing media</div>
  }

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">

      <img
        src={still}
        alt="Gate Plate"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {mediaMode === "animated" && animated && (
        <video
          ref={videoRef}
          src={animated}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: videoFading ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
          }}
        />
      )}

      <div className="absolute top-5 right-5">
        <MeasuresReturnGlyph to="/measures" ariaLabel="Return to Temple" />
      </div>

      {plaqueOpen && !plaqueMinimized && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-4 rounded-xl backdrop-blur">

          <div className="text-center text-stone-100">
            {row.removal_item || "Gate"}
          </div>

          {nextGate && isGateUnlocked(nextGate) && (
            <button
              onClick={() => nav(`/measures/gates/${nextGate}`)}
              className="mt-4 px-4 py-2 bg-white/10 rounded hover:bg-white/20"
            >
              Continue
            </button>
          )}

        </div>
      )}

    </section>
  )
}