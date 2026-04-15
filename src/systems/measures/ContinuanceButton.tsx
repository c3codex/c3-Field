import React from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useMeasuresContinuance } from "@/systems/measures/use_measures_continuance"

type Props = {
  sessionKey: string
  registryKey: string
  encounterKey: string
  label?: string
  className?: string
}

async function recordEncounterView(input: {
  sessionKey: string
  registryKey: string
  encounterKey: string
}) {
  const { error } = await supabase.rpc("record_measures_encounter_view", {
    p_session_key: input.sessionKey,
    p_registry_key: input.registryKey,
    p_encounter_key: input.encounterKey,
  })

  if (error) {
    throw error
  }
}

async function resolveMeasuresNext(input: {
  sessionKey: string
  registryKey: string
  encounterKey: string
}) {
  const { data, error } = await supabase.rpc("resolve_measures_next_step", {
    p_session_key: input.sessionKey,
    p_registry_key: input.registryKey,
    p_encounter_key: input.encounterKey,
  })

  if (error) {
    throw error
  }

  if (Array.isArray(data)) {
    return (data[0] ?? {}) as Record<string, unknown>
  }

  return (data ?? {}) as Record<string, unknown>
}

export default function ContinuanceButton({
  sessionKey,
  registryKey,
  encounterKey,
  label = "Continue",
  className,
}: Props) {
  const navigate = useNavigate()

  const { loading, error, recordAndResolve } = useMeasuresContinuance({
    sessionKey,
    registryKey,
    encounterKey,
    recordView: recordEncounterView,
    resolveNext: resolveMeasuresNext,
  })

  async function handleContinue() {
    const target = await recordAndResolve()

    if (!target) {
      return
    }

    navigate(target.pathname, {
      state: target.state,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleContinue}
        disabled={loading}
        className={
          className ??
          "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm"
        }
      >
        {loading ? "Resolving..." : label}
      </button>

      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : null}
    </div>
  )
}
