import { useEffect, useRef, useState } from "react"
import GenericEncounter from "./GenericEncounter"
import {
  loadViewedRegistryKeys,
  recordEncounterView,
} from "./encounter_history"
import { resolveEncounter } from "./resolve_encounter"
import type { EncounterResolution } from "./types"

const ENTRY_REGISTRY_KEY = "epigraph"

type NavigateOptions = {
  targetAfterPassage?: string | null
}

export default function Temple() {
  const [currentKey, setCurrentKey] = useState(ENTRY_REGISTRY_KEY)
  const [resolution, setResolution] = useState<EncounterResolution | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [viewedKeys, setViewedKeys] = useState<string[]>([])
  const [pendingPassageTarget, setPendingPassageTarget] = useState<string | null>(null)
  const viewedKeysRef = useRef<string[]>([])

  function navigate(registryKey: string, options?: NavigateOptions) {
    setPendingPassageTarget(options?.targetAfterPassage ?? null)
    setCurrentKey(registryKey)
  }

  function mergeViewedKeys(keys: string[]) {
    setViewedKeys((current) => {
      const merged = [...new Set([...current, ...keys])]
      viewedKeysRef.current = merged
      return merged
    })
  }

  function withPhaseMapViewedKeys(
    nextResolution: EncounterResolution,
    nextViewedKeys = viewedKeysRef.current,
  ): EncounterResolution {
    if (!nextResolution.phase_map) return nextResolution

    const viewed_registry_keys = [
      ...new Set([
        ...(nextResolution.phase_map.viewed_registry_keys ?? []),
        ...nextViewedKeys,
      ]),
    ]

    return {
      ...nextResolution,
      metadata: {
        ...nextResolution.metadata,
        phase_map: {
          ...nextResolution.phase_map,
          viewed_registry_keys,
        },
      },
      phase_map: {
        ...nextResolution.phase_map,
        viewed_registry_keys,
      },
    }
  }

  useEffect(() => {
    let cancelled = false

    loadViewedRegistryKeys().then((keys) => {
      if (!cancelled) mergeViewedKeys(keys)
    })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setResolution((current) =>
      current?.phase_map ? withPhaseMapViewedKeys(current, viewedKeys) : current,
    )
  }, [viewedKeys])

  useEffect(() => {
    let cancelled = false

    setError(null)
    setResolution(null)

    resolveEncounter(currentKey)
      .then((nextResolution) => {
        if (!cancelled) {
          const resolved =
            nextResolution.surfaceType === "passage" && pendingPassageTarget
              ? {
                  ...nextResolution,
                  autoAdvanceTo: pendingPassageTarget,
                  metadata: {
                    ...nextResolution.metadata,
                    auto_advance_to: pendingPassageTarget,
                  },
                }
              : nextResolution
          const nextViewedKeys = [
            ...new Set([...viewedKeysRef.current, nextResolution.registryKey]),
          ]

          setResolution(withPhaseMapViewedKeys(resolved, nextViewedKeys))
          if (nextResolution.surfaceType !== "passage" && pendingPassageTarget) {
            setPendingPassageTarget(null)
          }
          mergeViewedKeys([nextResolution.registryKey])
          recordEncounterView(nextResolution)
        }
      })
      .catch(() => {
        if (!cancelled) setError("Encounter could not be resolved.")
      })

    return () => {
      cancelled = true
    }
  }, [currentKey, pendingPassageTarget])

  if (error) return <main className="encounter-error">{error}</main>
  if (!resolution) return <main className="encounter-loading">loading...</main>

  return (
    <GenericEncounter
      resolution={resolution}
      onNavigate={navigate}
      activeRegistryKey={currentKey}
      viewedRegistryKeys={viewedKeys}
    />
  )
}
