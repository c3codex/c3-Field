import { useEffect, useMemo, useState } from "react"
import TempleMediaBridge from "./TempleMediaBridge"
import PassageMediaSurface from "@/surfaces/passage/PassageMediaSurface"
import ChamberplateSurface from "@/surfaces/chamberplate/ChamberplateSurface"
import CodexstoneResolveSurface from "@/surfaces/resolve/CodexstoneResolveSurface"
import Antechamber from "@/surfaces/antechamber/Antechamber"
import { supabase } from "@/integrations/supabase/client"

type Step =
  | "temple"
  | "inanna_encounter"
  | "harrumuk_to_phase_map"
  | "gate_1"
  | "gate_2"
  | "kumurrah_to_epithet_1"
  | "epithet_1"
  | "epithet_2"
  | "epithet_3"
  | "kumurrah_to_codexstone"
  | "codexstone"
  | "harrumuk_to_antechamber"
  | "antechamber"

type TempleZoneTargets = {
  top: string | null
  center: string | null
  bottom: string | null
}

function mapRegistryKeyToStep(
  registryKey: string | null | undefined
): Step | null {
  switch (registryKey) {
    case "inanna_encounter":
      return "inanna_encounter"
    case "harrumuk_passage":
      return "harrumuk_to_phase_map"
    case "antechamber":
      return "antechamber"
    default:
      return null
  }
}

export default function TempleFlowController() {
  const [step, setStep] = useState<Step>("temple")
  const [zoneTargets, setZoneTargets] = useState<TempleZoneTargets>({
    top: null,
    center: null,
    bottom: null,
  })

  useEffect(() => {
    let isMounted = true

    async function loadTempleZones() {
      const { data, error } = await supabase
        .from("measures_encounter_def")
        .select("encounter_key, metadata")
        .eq("encounter_key", "temple_home")
        .single()

      if (error) {
        console.error("Failed to load temple_home metadata", error)
        return
      }

      const metadata = (data?.metadata ?? {}) as Record<string, any>

      if (!isMounted) return

      setZoneTargets({
        top: metadata?.zone_top?.to_registry_key ?? null,
        center: metadata?.zone_center?.to_registry_key ?? null,
        bottom: metadata?.zone_bottom?.to_registry_key ?? null,
      })
    }

    loadTempleZones()

    return () => {
      isMounted = false
    }
  }, [])

  const goNext = (current: Step) => {
    const map: Record<Step, Step> = {
      temple: "harrumuk_to_phase_map",
      inanna_encounter: "temple",
      harrumuk_to_phase_map: "gate_1",
      gate_1: "gate_2",
      gate_2: "kumurrah_to_epithet_1",
      kumurrah_to_epithet_1: "epithet_1",
      epithet_1: "epithet_2",
      epithet_2: "epithet_3",
      epithet_3: "kumurrah_to_codexstone",
      kumurrah_to_codexstone: "codexstone",
      codexstone: "harrumuk_to_antechamber",
      harrumuk_to_antechamber: "antechamber",
      antechamber: "antechamber",
    }

    setStep(map[current])
  }

  const render = useMemo(() => {
    switch (step) {
      case "temple":
        return (
          <div
            style={{
              position: "relative",
              width: "100%",
            }}
          >
            <div style={{ pointerEvents: "none" }}>
  <TempleMediaBridge />
</div>

            <button
              type="button"
              aria-label="Inanna Encounter"
              onClick={() => {
                const target = mapRegistryKeyToStep(zoneTargets.top)
                if (target) setStep(target)
              }}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "28%",
                background: "transparent",
                border: "none",
                cursor: zoneTargets.top ? "pointer" : "default",
                zIndex: 10,
              }}
            />

            <button
              type="button"
              aria-label="Enter Exhibition"
              onClick={() => {
                const target = mapRegistryKeyToStep(zoneTargets.center)
                if (target) setStep(target)
              }}
              style={{
                position: "absolute",
                top: "28%",
                left: "18%",
                width: "64%",
                height: "44%",
                background: "transparent",
                border: "none",
                cursor: zoneTargets.center ? "pointer" : "default",
                zIndex: 10,
              }}
            />

            <button
              type="button"
              aria-label="Enter Antechamber"
              onClick={() => {
                const target = mapRegistryKeyToStep(zoneTargets.bottom)
                if (target) setStep(target)
              }}
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                height: "22%",
                background: "transparent",
                border: "none",
                cursor: zoneTargets.bottom ? "pointer" : "default",
                zIndex: 10,
              }}
            />
          </div>
        )

      case "inanna_encounter":
        return (
          <div onClick={() => setStep("temple")} style={{ cursor: "pointer" }}>
            <TempleMediaBridge surfaceKey="temple_main" />
          </div>
        )

      case "harrumuk_to_phase_map":
        return (
          <PassageMediaSurface
            surfaceKey="harrumuk_passage"
            onComplete={() => goNext("harrumuk_to_phase_map")}
          />
        )

      case "gate_1":
        return (
          <div onClick={() => goNext("gate_1")} style={{ cursor: "pointer" }}>
            <ChamberplateSurface surfaceType="gate" surfaceKey="gate_01" />
          </div>
        )

      case "gate_2":
        return (
          <div onClick={() => goNext("gate_2")} style={{ cursor: "pointer" }}>
            <ChamberplateSurface surfaceType="gate" surfaceKey="gate_02" />
          </div>
        )

      case "kumurrah_to_epithet_1":
        return (
          <PassageMediaSurface
            surfaceKey="kumurrah_passage"
            onComplete={() => goNext("kumurrah_to_epithet_1")}
          />
        )

      case "epithet_1":
        return (
          <div onClick={() => goNext("epithet_1")} style={{ cursor: "pointer" }}>
            <ChamberplateSurface surfaceType="epithet" surfaceKey="epithet_01" />
          </div>
        )

      case "epithet_2":
        return (
          <div onClick={() => goNext("epithet_2")} style={{ cursor: "pointer" }}>
            <ChamberplateSurface surfaceType="epithet" surfaceKey="epithet_02" />
          </div>
        )

      case "epithet_3":
        return (
          <div onClick={() => goNext("epithet_3")} style={{ cursor: "pointer" }}>
            <ChamberplateSurface surfaceType="epithet" surfaceKey="epithet_03" />
          </div>
        )

      case "kumurrah_to_codexstone":
        return (
          <PassageMediaSurface
            surfaceKey="kumurrah_passage"
            onComplete={() => goNext("kumurrah_to_codexstone")}
          />
        )

      case "codexstone":
        return (
          <div onClick={() => goNext("codexstone")} style={{ cursor: "pointer" }}>
            <CodexstoneResolveSurface />
          </div>
        )

      case "harrumuk_to_antechamber":
        return (
          <PassageMediaSurface
            surfaceKey="harrumuk_passage"
            onComplete={() => goNext("harrumuk_to_antechamber")}
          />
        )

      case "antechamber":
        return <Antechamber />

      default:
        return null
    }
  }, [step, zoneTargets])

  return <section style={{ width: "100%" }}>{render}</section>
}

