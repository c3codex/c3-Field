export type RegisteredSurface =
  | "intro"
  | "path_choice"
  | "eval_passage"
  | "connect_src"
  | "measures_assessment"
  | "structure_passage"
  | "structured_eval"
  | "measures_eval_email_contract"
  | "measures_phases_reveal"
  | "about_measures_registry"
  | "structural_drift_dispatches"
  | "reserve_seat"
  | "phase_payment"
  | "publication_dispatch"

export type LandingSectionRow = {
  encounter_key: string
  display_title?: string | null
  metadata: Record<string, unknown> | null
}

export type MediaRow = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type?: string | null
  is_active: boolean | null
}

export type DesignTokenRow = {
  token_key: string
  token_value: string
  media_query: string | null
  is_active: boolean | null
}

export type SeatOfferingRow = {
  offering_key: string
  label: string
  short_label: string | null
  description: string | null
  offering_type: string
  sequence_order: number
  enrollment_state: "open" | "coming_soon" | "held" | "closed"
  hold_target_key: string | null
  offering_surface_key: string | null
  metadata: Record<string, unknown> | null
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
