import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import {
  TempExhibitionRow,
  groupBySurface,
  SurfaceGroup,
} from "@/systems/measures/group_by_surface"

type UseTempExhibitionMediaResult = {
  rows: TempExhibitionRow[]
  groups: Record<string, SurfaceGroup>
  loading: boolean
  error: string | null
}

const DISPLAY_CONTEXT = "measures_of_inanna"

export function useTempExhibitionMedia(): UseTempExhibitionMediaResult {
  const [rows, setRows] = useState<TempExhibitionRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("v_temp_exhibition_media_active")
        .select("*")
        .eq("display_context", DISPLAY_CONTEXT)
        .order("surface_type", { ascending: true })
        .order("surface_key", { ascending: true })
        .order("render_order", { ascending: true })

      if (!isMounted) return

      if (error) {
        setRows([])
        setError(error.message)
        setLoading(false)
        return
      }

      setRows((data ?? []) as TempExhibitionRow[])
      setLoading(false)
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  const groups = useMemo(() => groupBySurface(rows), [rows])

  return {
    rows,
    groups,
    loading,
    error,
  }
}
