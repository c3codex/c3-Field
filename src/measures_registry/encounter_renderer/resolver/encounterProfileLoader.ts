import type {
  ChamberAssignment,
  EncounterProfile,
  EncounterProfileResult,
  EncounterSurface,
  MaterialIdentity,
  RegistryResolverData,
  TransitionNode,
} from "../types/encounterRendererTypes"
import { checkReleaseGate } from "./releaseGate"

// Type guards — validate DB values against compile-time unions.
// These catch malformed data; they do not carry assignment authority.
const VALID_MATERIAL_IDENTITIES = new Set<string>(["obsidian", "crystal", "lapis", "marble"])
const VALID_CHAMBER_ASSIGNMENTS = new Set<string>([
  "ObsidianChamberRenderer",
  "CrystalSeatRenderer",
  "LapisChamberRenderer",
  "MarbleChamberRenderer",
])

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
  const assignment = resolverData.surfaceAssignmentRows.find((r) => r.surface_key === surface)
  if (!assignment) {
    return { loaded: false, reason: "missing_surface_assignment" }
  }

  const { registry_key: registryKey, material_identity, chamber_assignment } = assignment

  if (!VALID_MATERIAL_IDENTITIES.has(material_identity)) {
    return { loaded: false, reason: `invalid_material_identity:${material_identity}` }
  }
  if (!VALID_CHAMBER_ASSIGNMENTS.has(chamber_assignment)) {
    return { loaded: false, reason: `invalid_chamber_assignment:${chamber_assignment}` }
  }

  const materialIdentity = material_identity as MaterialIdentity
  const chamberAssignment = chamber_assignment as ChamberAssignment

  const registryRow = resolverData.registryRows.find((r) => r.registry_key === registryKey)
  if (!registryRow) {
    return { loaded: false, reason: "missing_registry_record" }
  }

  const gateResult = checkReleaseGate(registryRow)
  if (gateResult.status !== "released") {
    return { loaded: false, reason: `gate_held:${gateResult.reason}` }
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
