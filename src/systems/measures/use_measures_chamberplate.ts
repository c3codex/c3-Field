import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type MeasuresChamberplate = {
  registry_id: string
  registry_key: string
  registry_title: string
  registry_family: "gate" | "epithet" | "me"
  material_family: "obsidian" | "crystal" | "marble" | "lapis"
  registry_sequence_order: number | null

  release_state: "sealed" | "held" | "released" | "open" | "closed" | null
  access_state: "gated" | "visible" | "callable" | "encounterable" | "archived" | null
  release_reason: string | null
  access_reason: string | null
  effective_at: string | null

  encounter_id: string
  encounter_key: string
  encounter_title: string
  encounter_type: string
  surface_type: "chamberplate"
  encounter_sequence_order: number | null
  pause_allowed: boolean | null
  is_entry_surface: boolean | null
  encounter_is_active: boolean | null

  encounter_metadata: Record<string, unknown> | null
  release_metadata: Record<string, unknown> | null
}

export type UseMeasuresChamberplateResult = {
  chamberplate: MeasuresChamberplate | null
  loading: boolean
  error: string | null
}

export function useMeasuresChamberplate(
  encounterKey: string
): UseMeasuresChamberplateResult {
  const [chamberplate, setChamberplate] = useState<MeasuresChamberplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!encounterKey) {
        setChamberplate(null)
        setLoading(false)
        setError("encounterKey is required")
        return
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("v_measures_chamberplate_v1")
        .select("*")
        .eq("encounter_key", encounterKey)
        .maybeSingle()

      if (cancelled) return

      if (error) {
        setError(error.message)
        setChamberplate(null)
        setLoading(false)
        return
      }

      setChamberplate((data as MeasuresChamberplate | null) ?? null)
      setLoading(false)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [encounterKey])

  return { chamberplate, loading, error }
}
