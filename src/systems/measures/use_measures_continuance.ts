import { useCallback, useMemo, useState } from "react"
import {
  ContinuanceResolution,
  MeasuresRouteTarget,
  resolveContinuanceTarget,
} from "@/systems/measures/resolve_measures_route"

type RecordViewInput = {
  sessionKey: string
  registryKey: string
  encounterKey: string
}

type ResolveNextInput = {
  sessionKey: string
  registryKey: string
  encounterKey: string
}

type UseMeasuresContinuanceArgs = {
  sessionKey: string
  registryKey: string
  encounterKey: string
  recordView: (input: RecordViewInput) => Promise<void>
  resolveNext: (input: ResolveNextInput) => Promise<ContinuanceResolution>
}

type UseMeasuresContinuanceResult = {
  loading: boolean
  error: string | null
  nextTarget: MeasuresRouteTarget | null
  refreshNext: () => Promise<MeasuresRouteTarget | null>
  recordAndResolve: () => Promise<MeasuresRouteTarget | null>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Unknown continuance error"
}

export function useMeasuresContinuance(
  args: UseMeasuresContinuanceArgs
): UseMeasuresContinuanceResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextTarget, setNextTarget] = useState<MeasuresRouteTarget | null>(null)

  const resolveOnly = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await args.resolveNext({
        sessionKey: args.sessionKey,
        registryKey: args.registryKey,
        encounterKey: args.encounterKey,
      })

      const target = resolveContinuanceTarget(result, {
        sessionKey: args.sessionKey,
        fromRegistryKey: args.registryKey,
        fromEncounterKey: args.encounterKey,
      })

      setNextTarget(target)
      return target
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      setNextTarget(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [args])

  const recordAndResolve = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      await args.recordView({
        sessionKey: args.sessionKey,
        registryKey: args.registryKey,
        encounterKey: args.encounterKey,
      })

      const result = await args.resolveNext({
        sessionKey: args.sessionKey,
        registryKey: args.registryKey,
        encounterKey: args.encounterKey,
      })

      const target = resolveContinuanceTarget(result, {
        sessionKey: args.sessionKey,
        fromRegistryKey: args.registryKey,
        fromEncounterKey: args.encounterKey,
      })

      setNextTarget(target)
      return target
    } catch (err) {
      const message = getErrorMessage(err)
      setError(message)
      setNextTarget(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [args])

  return useMemo(
    () => ({
      loading,
      error,
      nextTarget,
      refreshNext: resolveOnly,
      recordAndResolve,
    }),
    [error, loading, nextTarget, recordAndResolve, resolveOnly]
  )
}
