import type { ReactNode, CSSProperties } from "react"

// Compile-time type unions — not assignment authority.
// Assignment authority is seated in measures_encounter_surface_assignment.

export type MaterialIdentity = "obsidian" | "crystal" | "lapis" | "marble"

export type EncounterEnvironmentAssignment =
  | "obsidian"
  | "crystal_seat"
  | "lapis"
  | "marble"
  | "public_relational_encounter"

export type EncounterSurface =
  | "measures_registry_home"
  | "measures_registry_faq"
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
  | "marble_chamber_results"
  | "marble_chamber_C2_compact"
  | "marble_chamber_C2_agreement"
  | "marble_chamber_C2_resolution"
  | "obsidian_to_marble_passage_video"
  | "publication_dispatch"
  | "eval_passage"
  | "structure_passage"
  | "crystal_seat_orientation_passage"
  | "obsidian_chamber_orientation_passage"
  | "marble_chamber_orientation_passage"
  | "measures_structured_environments"

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

export type EncounterIssuePageRow = {
  page_key: string
  publication_key: string
  issue_id: string
  page_number: number
  page_role: string
  title: string
  subtitle: string | null
  asset_id: string | null
  dispatch_key: string | null
  banner_asset_id: string | null
  route_path: string | null
  layout_profile_key: string
  release_state: string
  visibility_state: string
  metadata: Record<string, unknown> | null
}

export type EncounterPublicationReleaseRow = {
  release_id: string
  issue_id: string
  active_issue: boolean
  publication_state: string
  archive_state: string
  renderer_eligibility: boolean
  db_sync_status: string
  is_active: boolean
  metadata: Record<string, unknown> | null
}

// Published article state from measures_publication_dispatch. FREE may render it, but does
// not change title/body/standing/route authority. Public RLS exposes only status=published.
export type EncounterPublicationDispatchRow = {
  publication_key: string
  dispatch_key: string
  title: string
  dispatch_body: string | null
  excerpt: string | null
  media_manifest: Record<string, unknown> | null
  internal_route: string | null
  external_url: string | null
  article_url: string | null
  status: string
  published_at: string | null
  issue_number: string | null
  metadata: Record<string, unknown> | null
}

export type RegistryResolverData = {
  registryRows: RegistryRow[]
  encounterDefRows: EncounterDefRow[]
  mediaRows: EncounterMediaRow[]
  designTokenRows: EncounterDesignTokenRow[]
  surfaceAssignmentRows: EncounterSurfaceAssignmentRow[]
  issuePageRows: EncounterIssuePageRow[]
  publicationReleaseRows: EncounterPublicationReleaseRow[]
  publicationDispatchRows: EncounterPublicationDispatchRow[]
  loading: boolean
  error: string | null
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

export type RoleCallStanding = {
  standing: Record<string, unknown> | null
  nativeRoleRegistry: Record<string, unknown> | null
  passageModes: Record<string, unknown> | null
  legacyFieldMapping: Record<string, unknown> | null
}

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
  surfaceAssignmentMetadata: Record<string, unknown> | null
  issuePages: EncounterIssuePageRow[]
  publicationReleases: EncounterPublicationReleaseRow[]
  publicationDispatches: EncounterPublicationDispatchRow[]
}

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
  issuePages: EncounterIssuePageRow[]
  publicationReleases: EncounterPublicationReleaseRow[]
  publicationDispatches: EncounterPublicationDispatchRow[]
  gateResult: { status: "released" }
}

export type HeldEncounterState = {
  surface: EncounterSurface
  reason: string
}

export type RenderableEncounterResult =
  | { renderable: true; encounter: RenderableEncounter }
  | { renderable: false; reason: string }

export type EncounterRendererProps = {
  activeSurface: EncounterSurface
  resolverData: RegistryResolverData
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
