import type { ReactNode, CSSProperties } from "react"

// Compile-time type unions — not assignment authority.
// Assignment authority is seated in measures_encounter_surface_assignment.

export type MaterialIdentity = "obsidian" | "crystal" | "lapis" | "marble"

export type ChamberAssignment =
  | "ObsidianChamberRenderer"
  | "CrystalSeatRenderer"
  | "LapisChamberRenderer"
  | "MarbleChamberRenderer"

export type EncounterSurface =
  | "intro"
  | "intro_hook"
  | "path_choice"
  | "structural_coherence_explainer"
  | "measures_structured_environments"
  | "about_measures_registry"
  | "eval_passage"
  | "measures_assessment"
  | "obsidian_to_marble_passage_video"
  | "map_integrity_governance"
  | "structure_passage"
  | "structural_drift_dispatches"
  | "publication_dispatch"

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

// Composed encounter — fully assembled state before gate evaluation

export type ComposedEncounter = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: ChamberAssignment
}

// Encounter profile — composed encounter with gate result attached

export type EncounterProfile = {
  surface: EncounterSurface
  registryKey: string
  registryRow: RegistryRow
  gateResult: GateResult
  encounterDef: EncounterDefRow | null
  mediaByRole: Map<string, EncounterMediaRow>
  transitionNodes: Record<string, TransitionNode>
  materialIdentity: MaterialIdentity
  chamberAssignment: ChamberAssignment
}

export type EncounterProfileResult =
  | { loaded: true; profile: EncounterProfile }
  | { loaded: false; reason: string }

// Chamber renderer props contract

export type EncounterRendererProps = {
  activeSurface: EncounterSurface
  resolverData: RegistryResolverData
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
