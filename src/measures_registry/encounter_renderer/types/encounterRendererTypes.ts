import type { ReactNode, CSSProperties } from "react"

// Compile-time type unions — not assignment authority.
// Assignment authority is seated in measures_encounter_surface_assignment.

export type MaterialIdentity = "obsidian" | "crystal" | "lapis" | "marble"

export type EncounterEnvironmentAssignment =
  | "obsidian"
  | "crystal_seat"
  | "lapis"
  | "marble"

export type EncounterSurface =
  // Active SEAT surfaces — final canonical 13-term structure
  | "crystal_seat_intro"
  | "crystal_seat_threshold"
  | "crystal_seat_orientation"
  | "crystal_seat_encounter"
  | "lapis_chamber_encounter"
  | "obsidian_chamber_orientation"
  | "obsidian_chamber_encounter_surface"
  | "obsidian_chamber_C1_compact"
  | "marble_chamber_orientation"
  | "marble_chamber_encounter"
  | "marble_chamber_C2_compact"
  | "marble_chamber_C2_agreement"
  | "marble_chamber_C2_resolution"
  // Active passage transition (not in 13 SEAT terms; held for secured/scale)
  | "obsidian_to_marble_passage_video"
  // Audit-trace / held — DB rows retained, not active public launch surfaces
  | "publication_dispatch"
  | "eval_passage"
  | "structure_passage"
  | "crystal_seat_orientation_passage"
  | "obsidian_chamber_orientation_passage"
  | "marble_chamber_orientation_passage"
  | "measures_structured_environments"

// DB row types

export type RegistryRow = {
  registry_key: string
  is_active: boolean
  release_state: string | null
  access_state: string | null
  metadata: Record<string, unknown> | null
}

export type EncounterDefRow = {
  encounter_key: string
  display_title: string | null
  metadata: Record<string, unknown> | null
}

export type EncounterMediaRow = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
  is_active: boolean | null
  metadata: Record<string, unknown> | null
}

export type EncounterDesignTokenRow = {
  token_key: string
  token_value: string
  media_query: string | null
  is_active: boolean | null
}

export type EncounterSurfaceAssignmentRow = {
  surface_key: string
  registry_key: string
  encounter_key: string | null
  material_identity: string
  chamber_assignment: string
  public_routes: string[]
  metadata: Record<string, unknown> | null
}

// Resolver output — all raw DB rows; no authority decisions

export type RegistryResolverData = {
  registryRows: RegistryRow[]
  encounterDefRows: EncounterDefRow[]
  mediaRows: EncounterMediaRow[]
  designTokenRows: EncounterDesignTokenRow[]
  surfaceAssignmentRows: EncounterSurfaceAssignmentRow[]
  loading: boolean
  error: string | null
}

// Gate result

export type GateResult =
  | { status: "released" }
  | { status: "held"; reason: string }

// Transition node — from measures_registry_root.metadata.encounter_structure

export type TransitionNode = {
  content_encounter_key?: string | null
  next_surface?: string | null
  left?: TransitionNode | null
  right?: TransitionNode | null
  [key: string]: unknown
}

// role_call standing read from measures_registry_root.
// Structural encounter authorities only — not login, gating, or access control.

export type RoleCallStanding = {
  standing: Record<string, unknown> | null
  nativeRoleRegistry: Record<string, unknown> | null
  passageModes: Record<string, unknown> | null
  legacyFieldMapping: Record<string, unknown> | null
}

// Composed encounter — fully assembled state before gate evaluation

export type ComposedEncounter = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: EncounterEnvironmentAssignment
  roleCallStanding: RoleCallStanding
  // Surface assignment metadata — carries style_profile, directory_key, registered_surface.
  // Threaded from measures_encounter_surface_assignment.metadata for FREE consumption.
  surfaceAssignmentMetadata: Record<string, unknown> | null
}

// Renderable encounter — composed encounter after release gate passes.
// gateResult is narrowed to released only; held state cannot reach this type.
// Chamber renderers and chamber router accept only RenderableEncounter.

export type RenderableEncounter = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: EncounterEnvironmentAssignment
  roleCallStanding: RoleCallStanding
  surfaceAssignmentMetadata: Record<string, unknown> | null
  gateResult: { status: "released" }
}

// Held encounter state — surface key and sanitized reason only.
// Must not expose internal registry standing or gate internals.

export type HeldEncounterState = {
  surface: EncounterSurface
  reason: string
}

export type RenderableEncounterResult =
  | { renderable: true; encounter: RenderableEncounter }
  | { renderable: false; reason: string }

// Chamber renderer props contract

export type EncounterRendererProps = {
  activeSurface: EncounterSurface
  resolverData: RegistryResolverData
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
