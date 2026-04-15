import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type MeasuresTransition = {
  transition_id: string
  from_registry_id: string | null
  from_registry_key: string | null
  from_encounter_id: string | null
  from_encounter_key: string | null

  to_registry_id: string | null
  to_registry_key: string | null
  to_encounter_id: string | null
  to_encounter_key: string | null

  transition_kind:
    | "progression"
    | "pause"
    | "return"
    | "release"
    | "seal"
    | "dependency_unlock"
    | "connect_request_prompt"
  rule_state: "active"
  requires_release: boolean | null
  requires_dependency_satisfied: boolean | null
  requires_passage_ready: boolean | null
  requires_connect_prompt: boolean | null
  sort_order: number | null
  transition_metadata: Record<string, unknown> | null
}

export type UseMeasuresTransitionsResult = {
  transitions: MeasuresTransition[]
  loading: boolean
  error: string | null
}

export function useMeasuresTransitions(
  fromEncounterKey: string
): UseMeasuresTransitionsResult {
  const [transitions, setTransitions] = useState<MeasuresTransition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!fromEncounterKey) {
        setTransitions([])
        setLoading(false)
        setError("fromEncounterKey is required")
        return
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("v_measures_active_transitions_v1")
        .select("*")
        .eq("from_encounter_key", fromEncounterKey)
        .order("sort_order", { ascending: true })

      if (cancelled) return

      if (error) {
        setError(error.message)
        setTransitions([])
        setLoading(false)
        return
      }

      setTransitions((data as MeasuresTransition[]) ?? [])
      setLoading(false)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [fromEncounterKey])

  return { transitions, loading, error }
}
