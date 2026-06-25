import type {
  ChamberAssignment,
  ComposedEncounter,
  EncounterSurface,
  EncounterSurfaceAssignmentRow,
  MaterialIdentity,
  RegistryResolverData,
  RegistryRow,
  TransitionNode,
} from "../types/encounterRendererTypes"

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

// Assembles encounter state from seated registry data.
// Pure — no authority decisions, no release checks, no routing.
// Caller (encounterProfileLoader) validates inputs before calling.
export function composeEncounter(
  surface: EncounterSurface,
  assignment: EncounterSurfaceAssignmentRow,
  registryRow: RegistryRow,
  materialIdentity: MaterialIdentity,
  chamberAssignment: ChamberAssignment,
  resolverData: RegistryResolverData,
): ComposedEncounter {
  const encounterDef =
    resolverData.encounterDefRows.find((d) => d.encounter_key === assignment.registry_key) ?? null

  const mediaByRole = new Map(
    resolverData.mediaRows
      .filter((row) => row.is_active !== false)
      .map((row) => [row.media_role, row]),
  )

  const rootRow = resolverData.registryRows.find(
    (r) => r.registry_key === "measures_registry_root",
  )
  const transitionNodes = extractTransitionNodes(rootRow?.metadata ?? null)

  return {
    surface,
    registryKey: assignment.registry_key,
    registryRow,
    encounterDef,
    mediaByRole,
    transitionNodes,
    materialIdentity,
    chamberAssignment,
  }
}
