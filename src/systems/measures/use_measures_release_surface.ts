import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export type MeasuresReleaseSurfaceRow = {
  registry_key: string
  display_title: string
  release_state: string
  access_state: string
  encounter_key: string | null
  surface_type: string | null
  material_family: string | null
  sequence_order: number | null
}

type UseMeasuresReleaseSurfaceResult = {
  rows: MeasuresReleaseSurfaceRow[]
  loading: boolean
  error: string | null
}

function normalizeRows(data: unknown): MeasuresReleaseSurfaceRow[] {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((row) => {
    const item = (row ?? {}) as Record<string, unknown>

    return {
      registry_key: String(item.registry_key ?? ""),
      display_title: String(item.display_title ?? ""),
      release_state: String(item.release_state ?? ""),
      access_state: String(item.access_state ?? ""),
      encounter_key:
        typeof item.encounter_key === "string" ? item.encounter_key : null,
      surface_type:
        typeof item.surface_type === "string" ? item.surface_type : null,
      material_family:
        typeof item.material_family === "string" ? item.material_family : null,
      sequence_order:
        typeof item.sequence_order === "number" ? item.sequence_order : null,
    }
  })
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Unknown release surface error"
}

export function useMeasuresReleaseSurface(): UseMeasuresReleaseSurfaceResult {
  const [rows, setRows] = useState<MeasuresReleaseSurfaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("v_measures_release_surface_v1")
        .select(`
          registry_key,
          display_title,
          release_state,
          access_state,
          encounter_key,
          surface_type,
          material_family,
          sequence_order
        `)

      if (!isMounted) {
        return
      }

      if (error) {
        setRows([])
        setError(getErrorMessage(error))
        setLoading(false)
        return
      }

      setRows(normalizeRows(data))
      setLoading(false)
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  return { rows, loading, error }
}
