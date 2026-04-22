import { useEffect, useState } from "react"
import GenericEncounter from "@/surfaces/encounter/GenericEncounter"
import { resolveEncounter } from "@/systems/measures/resolve_encounter"
import type {
  EncounterResolution,
  ResolvedAction,
} from "@/systems/measures/types"

export default function Temple() {
  const [resolution, setResolution] = useState<EncounterResolution | null>(null)
  const [currentRegistryKey, setCurrentRegistryKey] = useState("inanna_encounter")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const next = await resolveEncounter(currentRegistryKey)
        if (active) setResolution(next)
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to resolve encounter.")
          setResolution(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [currentRegistryKey])

  function handleAction(action: ResolvedAction) {
    if (action.blocked) return
    if (action.promptEnabled && action.promptKind === "connect_request") return

    if (action.targetRegistryKey) {
      setCurrentRegistryKey(action.targetRegistryKey)
    }
  }

  if (loading) {
    return <section>Loading encounter…</section>
  }

  if (error) {
    return <section>{error}</section>
  }

  if (!resolution) {
    return <section>No encounter resolved.</section>
  }

  return <GenericEncounter resolution={resolution} onAction={handleAction} />
}
