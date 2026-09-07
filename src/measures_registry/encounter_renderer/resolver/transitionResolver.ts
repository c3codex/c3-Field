import type {
  EncounterSurface,
  EncounterSurfaceAssignmentRow,
  RegistryRow,
  TransitionNode,
} from "../types/encounterRendererTypes"
import { checkReleaseGate } from "./releaseGate"

export function resolveTransition(
  node: TransitionNode | null | undefined,
  surfaceKey: string,
  registryRows: RegistryRow[],
  surfaceAssignmentRows: EncounterSurfaceAssignmentRow[],
): EncounterSurface | null {
  if (!node) return null

  const rawSurface = node[surfaceKey]
  if (typeof rawSurface !== "string") return null

  const assignment = surfaceAssignmentRows.find((r) => r.surface_key === rawSurface)
  if (!assignment) return null

  const registryKey = assignment.registry_key
  const row = registryRows.find((r) => r.registry_key === registryKey)
  if (!row) return null

  const gate = checkReleaseGate(row)
  if (gate.status !== "released") return null

  return rawSurface as EncounterSurface
}
