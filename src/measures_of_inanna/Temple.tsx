import { useEffect, useState } from "react"
import GenericEncounter from "./GenericEncounter"
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

  function navigate(registryKey: string, options?: NavigateOptions) {
    setPendingPassageTarget(options?.targetAfterPassage ?? null)
    setCurrentKey(registryKey)
  }

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

          setResolution(resolved)
          if (nextResolution.surfaceType !== "passage" && pendingPassageTarget) {
            setPendingPassageTarget(null)
          }
          setViewedKeys((current) =>
            current.includes(nextResolution.registryKey)
              ? current
              : [...current, nextResolution.registryKey],
          )
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
