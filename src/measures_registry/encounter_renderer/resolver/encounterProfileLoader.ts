import type {
  EncounterEnvironmentAssignment,
  EncounterSurface,
  MaterialIdentity,
  RegistryResolverData,
  RenderableEncounter,
  RenderableEncounterResult,
} from "../types/encounterRendererTypes"
import { composeEncounter } from "../composition/encounterComposition"
import { checkReleaseGate } from "./releaseGate"

// Type guards — validate DB values against compile-time unions.
// Catch malformed DB data; they do not carry assignment authority.
const VALID_MATERIAL_IDENTITIES = new Set<string>(["obsidian", "crystal", "lapis", "marble"])
const VALID_CHAMBER_ASSIGNMENTS = new Set<string>([
  "obsidian",
  "crystal_seat",
  "lapis",
  "marble",
])

// Orchestration only. Finds seated data, delegates assembly to composition
// layer, applies release gate, returns renderable encounter or fail-closed result.
export function loadEncounterProfile(
  surface: EncounterSurface,
  resolverData: RegistryResolverData,
): RenderableEncounterResult {
  // 1. Surface assignment
  const assignment = resolverData.surfaceAssignmentRows.find((r) => r.surface_key === surface)
  if (!assignment) {
    return { renderable: false, reason: "missing_surface_assignment" }
  }

  // 2. Validate DB-carried type values
  const { material_identity, chamber_assignment } = assignment
  if (!VALID_MATERIAL_IDENTITIES.has(material_identity)) {
    return { renderable: false, reason: `invalid_material_identity:${material_identity}` }
  }
  if (!VALID_CHAMBER_ASSIGNMENTS.has(chamber_assignment)) {
    return { renderable: false, reason: `invalid_chamber_assignment:${chamber_assignment}` }
  }

  const materialIdentity = material_identity as MaterialIdentity
  const chamberAssignment = chamber_assignment as EncounterEnvironmentAssignment

  // 3. Registry standing
  const registryRow = resolverData.registryRows.find(
    (r) => r.registry_key === assignment.registry_key,
  )
  if (!registryRow) {
    return { renderable: false, reason: "missing_registry_record" }
  }

  // 4. Encounter composition
  const composed = composeEncounter(
    surface,
    assignment,
    registryRow,
    materialIdentity,
    chamberAssignment,
    resolverData,
  )

  // 5. Release gate — evaluated against registry standing after composition.
  // Gate failure returns renderable:false; held state never reaches a chamber renderer.
  const gateResult = checkReleaseGate(registryRow)
  if (gateResult.status !== "released") {
    return { renderable: false, reason: `gate_held:${gateResult.reason}` }
  }

  const encounter: RenderableEncounter = { ...composed, gateResult }
  return { renderable: true, encounter }
}
