import type {
  EncounterProfile,
  EncounterProfileResult,
  EncounterSurface,
  RegistryResolverData,
  TransitionNode,
} from "../types/encounterRendererTypes"
import {
  REGISTRY_KEY_CHAMBER,
  REGISTRY_KEY_MATERIAL,
  SURFACE_REGISTRY_KEY,
} from "../types/encounterRendererTypes"
import { checkReleaseGate } from "./releaseGate"

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return null
}

function extractTransitionNodes(
  rootMetadata: Record<string, unknown> | null,
): Record<string, TransitionNode> {
  const structure = asRecord(rootMetadata?.encounter_structure)
  if (!structure) return {}
  const nodes: Record<string, TransitionNode> = {}
  for (const [key, value] of Object.entries(structure)) {
    const node = asRecord(value)
    if (node) nodes[key] = node as TransitionNode
  }
  return nodes
}

export function loadEncounterProfile(
  surface: EncounterSurface,
  resolverData: RegistryResolverData,
): EncounterProfileResult {
  const registryKey = SURFACE_REGISTRY_KEY[surface]
  if (!registryKey) {
    return { loaded: false, reason: "unknown_surface" }
  }

  const registryRow = resolverData.registryRows.find((r) => r.registry_key === registryKey)
  if (!registryRow) {
    return { loaded: false, reason: "missing_registry_record" }
  }

  const gateResult = checkReleaseGate(registryRow)
  if (gateResult.status !== "released") {
    return { loaded: false, reason: `gate_held:${gateResult.reason}` }
  }

  const materialIdentity = REGISTRY_KEY_MATERIAL[registryKey]
  if (!materialIdentity) {
    return { loaded: false, reason: "unknown_material_identity" }
  }

  const chamberAssignment = REGISTRY_KEY_CHAMBER[registryKey]
  if (!chamberAssignment) {
    return { loaded: false, reason: "unknown_chamber_assignment" }
  }

  const encounterDef =
    resolverData.encounterDefRows.find((d) => d.encounter_key === registryKey) ?? null

  const mediaByRole = new Map(
    resolverData.mediaRows
      .filter((row) => row.is_active !== false)
      .map((row) => [row.media_role, row]),
  )

  const rootRow = resolverData.registryRows.find((r) => r.registry_key === "measures_registry_root")
  const transitionNodes = extractTransitionNodes(rootRow?.metadata ?? null)

  const profile: EncounterProfile = {
    surface,
    registryKey,
    registryRow,
    gateResult,
    encounterDef,
    mediaByRole,
    transitionNodes,
    materialIdentity,
    chamberAssignment,
  }

  return { loaded: true, profile }
}
