export type RegisteredSurface =
  | "intro"
  | "path_choice"
  | "ai_operations_assessment_landing"
  | "eval_passage"
  | "measures_assessment"
  | "obsidian_to_marble_passage_video"
  | "marble_pathway_reveal"
  | "structure_passage"
  | "crystal_chamber"
  | "structural_drift_dispatches"
  | "publication_dispatch"

export type LandingSectionRow = {
  encounter_key: string
  display_title?: string | null
  metadata: Record<string, unknown> | null
}

export type LandingUnitRow = {
  registry_key: string
  release_state: string | null
  access_state: string | null
  metadata: Record<string, unknown> | null
}

export type MediaRow = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type?: string | null
  is_active: boolean | null
  metadata?: Record<string, unknown> | null
}

export type DesignTokenRow = {
  token_key: string
  token_value: string
  media_query: string | null
  is_active: boolean | null
}

export type PublicationRegistryRow = {
  publication_key: string
  title: string
  subtitle: string | null
  publication_type: string
  status: string
  external_url: string | null
  tone: string[] | null
  metadata: Record<string, unknown> | null
}

export type MapCommerceContractRow = {
  contract_key: string
  map_circuit_key: string
  evaluation_standing: string
  applicable_standing_keys: string[]
  product_name: string
  amount_usd: number
  currency: string
  stripe_product_id: string | null
  release_state: string
  seat_contract_state: string
  map_boundary: string
  access_boundary: string
  deliverables: string[]
  seat_hold_notice: string
}

export type PublicationDispatchRow = {
  publication_key: string
  dispatch_key: string
  issue_number: string | null
  title: string
  dispatch_body: string
  excerpt: string | null
  seo_description: string | null
  tags: string[] | null
  primary_cta: string | null
  secondary_cta: string | null
  references: Record<string, unknown>[] | null
  media_manifest: Record<string, unknown> | null
  internal_route: string | null
  article_url: string | null
  external_url: string | null
  status: string
  published_at: string | null
  metadata: Record<string, unknown> | null
}
