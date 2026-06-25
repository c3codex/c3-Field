import type {
  EncounterSurface,
  RegistryRow,
  TransitionNode,
} from "../types/encounterRendererTypes"
import { SURFACE_REGISTRY_KEY, ENCOUNTER_SURFACE_SET } from "../types/encounterRendererTypes"
import { checkReleaseGate } from "./releaseGate"

export function resolveTransition(
  node: TransitionNode | null | undefined,
  surfaceKey: string,
  registryRows: RegistryRow[],
): EncounterSurface | null {
  if (!node) return null

  const rawSurface = node[surfaceKey]
  if (typeof rawSurface !== "string") return null
  if (!ENCOUNTER_SURFACE_SET.has(rawSurface)) return null

  const surface = rawSurface as EncounterSurface
  const registryKey = SURFACE_REGISTRY_KEY[surface]
  if (!registryKey) return null

  const row = registryRows.find((r) => r.registry_key === registryKey)
  if (!row) return null

  const gate = checkReleaseGate(row)
  if (gate.status !== "released") return null

  return surface
}
