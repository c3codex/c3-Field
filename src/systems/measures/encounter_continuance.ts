import { useEffect, useState } from "react"
import { getOriginIdentity } from "@/systems/measures/origin_identity"

export type MeasuresNextStepResult = {
  origin_key: string
  from_registry_key: string
  from_encounter_key: string
  from_viewed: boolean
  next_transition_kind: string | null
  next_registry_key: string | null
  next_encounter_key: string | null
  sort_order: number | null
  resolution_reason: string
  is_allowed: boolean
}

type SupabaseLike = {
  rpc: (
    fn: string,
    args: Record<string, unknown>
  ) => Promise<{ data: unknown; error: { message?: string } | null }>
}

export async function recordEncounterViewAndResolveNext(
  supabase: SupabaseLike,
  encounterKey: string
): Promise<MeasuresNextStepResult | null> {
  const { originKey, originKeyType } = getOriginIdentity()

  const viewWrite = await supabase.rpc("record_measures_encounter_view", {
    p_origin_key: originKey,
    p_origin_key_type: originKeyType,
    p_encounter_key: encounterKey,
  })

  if (viewWrite.error) {
    throw new Error(viewWrite.error.message ?? "Failed to record encounter view")
  }

  const nextRead = await supabase.rpc("resolve_measures_next_step", {
    p_origin_key: originKey,
    p_from_encounter_key: encounterKey,
  })

  if (nextRead.error) {
    throw new Error(nextRead.error.message ?? "Failed to resolve next step")
  }

  const rows = Array.isArray(nextRead.data) ? nextRead.data : []
  return (rows[0] as MeasuresNextStepResult | undefined) ?? null
}

export function useEncounterContinuance(
  supabase: SupabaseLike,
  encounterKey: string | null | undefined
) {
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState<MeasuresNextStepResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function run() {
      if (!encounterKey) {
        setNextStep(null)
        setError(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const next = await recordEncounterViewAndResolveNext(supabase, encounterKey)

        if (!active) return
        setNextStep(next)
      } catch (err) {
        if (!active) return
        const message =
          err instanceof Error ? err.message : "Failed to resolve encounter continuance"
        setError(message)
        setNextStep(null)
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [supabase, encounterKey])

  return {
    loading,
    nextStep,
    error,
  }
}
