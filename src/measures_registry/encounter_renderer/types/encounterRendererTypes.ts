import type { ReactNode, CSSProperties } from "react"

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

export type GateResult =
  | { status: "released" }
  | { status: "held"; reason: string }

export type TransitionNode = {
  content_encounter_key?: string | null
  next_surface?: string | null
  left?: TransitionNode | null
  right?: TransitionNode | null
  [key: string]: unknown
}

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

export type RegistryResolverData = {
  registryRows: RegistryRow[]
  encounterDefRows: EncounterDefRow[]
  mediaRows: EncounterMediaRow[]
  designTokenRows: EncounterDesignTokenRow[]
  loading: boolean
  error: string | null
}

export type EncounterRendererProps = {
  activeSurface: EncounterSurface
  resolverData: RegistryResolverData
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}

// Surface → registry key. Authority: registry standing.
export const SURFACE_REGISTRY_KEY: Record<EncounterSurface, string> = {
  intro: "ai_isnt_broken_intro",
  intro_hook: "ai_isnt_broken_intro",
  path_choice: "evaluate_structure_path",
  structural_coherence_explainer: "eval_passage",
  measures_structured_environments: "structure_passage",
  about_measures_registry: "about_measures_registry",
  eval_passage: "eval_passage",
  measures_assessment: "measures_assessment",
  obsidian_to_marble_passage_video: "obsidian_to_marble_passage_video",
  map_integrity_governance: "map_integrity_governance",
  structure_passage: "structure_passage",
  structural_drift_dispatches: "structural_drift_publication",
  publication_dispatch: "structural_drift_publication",
}

export const REGISTRY_KEY_MATERIAL: Record<string, MaterialIdentity> = {
  ai_isnt_broken_intro: "crystal",
  evaluate_structure_path: "crystal",
  eval_passage: "obsidian",
  measures_assessment: "obsidian",
  obsidian_to_marble_passage_video: "obsidian",
  map_integrity_governance: "marble",
  structure_passage: "crystal",
  about_measures_registry: "crystal",
  structural_drift_publication: "lapis",
}

export const REGISTRY_KEY_CHAMBER: Record<string, ChamberAssignment> = {
  ai_isnt_broken_intro: "CrystalSeatRenderer",
  evaluate_structure_path: "CrystalSeatRenderer",
  eval_passage: "ObsidianChamberRenderer",
  measures_assessment: "ObsidianChamberRenderer",
  obsidian_to_marble_passage_video: "ObsidianChamberRenderer",
  map_integrity_governance: "MarbleChamberRenderer",
  structure_passage: "CrystalSeatRenderer",
  about_measures_registry: "CrystalSeatRenderer",
  structural_drift_publication: "LapisChamberRenderer",
}

export const ENCOUNTER_SURFACE_SET = new Set<string>(Object.keys(SURFACE_REGISTRY_KEY))
