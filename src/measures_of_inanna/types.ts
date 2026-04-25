export type PhaseMapNode = {
  label?: string
  displayTitle?: string
  display_title?: string
  family?: string
  material?: string
  sequence_order?: number
  release_state?: string
  access_state?: string
  phase_label?: string | null
  phase_key?: string | null
  anchor_name?: string | null
  anchor_date?: string | null
  phase_sequence_order?: number | null
  standing_type?: string | null
  node_state?: string
  registry_key?: string
  registryKey?: string
  position?: PhaseMapPosition
  angleDeg?: number
  angle_deg?: number
  band?: number
  isReleased?: boolean
  is_released?: boolean
  isInteractive?: boolean
  is_interactive?: boolean
}

export type PhaseMapPosition = {
  x: number
  y: number
}

export type PhaseMapEdge = {
  from: string
  to: string
  kind?: string
}

export type PhaseMapNodeState = {
  release_state?: string
  access_state?: string
  is_interactive?: boolean
  label?: string
}

export type PhaseMapNodeStatesContract = {
  source?: string
  open_states?: string[]
  sealed_states?: string[]
}

export type PhaseMapRouting = {
  target_registry_key?: string
  targetRegistryKey?: string
}

export type PhaseMapRoutingContract = {
  on_open_node?: string
  on_sealed_node?: string
  return_target?: string
  nodes?: Record<string, PhaseMapRouting>
}

export type PhaseMapLegendItem = {
  material?: string
  family?: string
  label: string
}

export type PhaseMapContract = {
  node_source?: string
  nodes?: PhaseMapNode[]
  positions?: Record<string, PhaseMapPosition>
  edges?: PhaseMapEdge[]
  center_node?: {
    registry_key?: string
    registryKey?: string
    label?: string
  }
  cadence?: {
    sequence?: string[]
    center_label?: string
    complete_target_registry_key?: string
    completeTargetRegistryKey?: string
  }
  next_release?: {
    label?: string
    title?: string
    body?: string
    registry_key?: string
    registryKey?: string
    anchor_name?: string
    anchorName?: string
    anchor_date?: string
    anchorDate?: string
  }
  active_registry_key?: string
  viewed_registry_keys?: string[]
  layout?: {
    class_name?: string
    mode?: string
    mobile_mode?: string
    rings?: Array<{
      family?: string
      radius?: number
      label?: string
    }>
  }
  routing?: PhaseMapRoutingContract
  node_states?: Record<string, PhaseMapNodeState> | PhaseMapNodeStatesContract
  node_state_overrides?: Record<string, string>
  labels?: {
    title?: string
    open_label?: string
    sealed_label?: string
    connect_prompt_label?: string
  }
  legend?: PhaseMapLegendItem[]
  explanation?: {
    title?: string
    body?: string[]
  }
}

export type RuntimeMediaItem = {
  label: string | null
  mediaType: string
  bucketName: string
  storagePath: string
  renderOrder: number
  isActive?: boolean
}

export type ChamberplateMode =
  | "media_primary"
  | "passage"
  | "choice_surface"
  | "plaque_overlay"
  | "phase_map"
  | "inscription_focus"

export type ChamberplateContract = {
  mode?: ChamberplateMode | string
  media_role?: string
  render_order?: string[]
  audio_role?: string
  text_bodies?: string[]
  text_delay_ms?: number
  plaque_delay_ms?: number
  interaction_mode?: "none" | "guided" | "choice" | "capture" | "gated" | string
  return_behavior?: "phase_map" | "antechamber" | "previous_valid_surface" | "none" | string
  material_binding?: "registry" | "chamber" | "explicit" | string
  route_targets?: string[]
  capture_enabled?: boolean
  panel_mode?: string
}

export type ResolvedAction = {
  id: string
  label: string
  kind: string
  emphasis?: string | null
  blocked?: boolean
  blockedReason?: string | null
  targetRegistryKey?: string | null
  targetEncounterKey?: string | null
  targetAfterPassage?: string | null
  transitionKind?: string | null
  sortOrder?: number | null
  metadata?: Record<string, unknown> | null
}

export type CaptureContract = {
  enabled: boolean
  mode?: string
  target_table?: string
  fields?: string[]
  required_fields?: string[]
  trigger_label?: string
  submit_label?: string
  success_message?: string
}

export type RendererContract = {
  layout?: string
  kind?: string
  show_action_rail?: boolean
  showActionRail?: boolean
  choice_surface_mode?: string
  media_fit?: string
  media_max_width?: string
  media_max_height?: string
}

export type PlaybackContract = {
  mode?: string | null
  fade_ms?: number
  settle_ms?: number
  video_mode?: string | null
  videoMode?: string | null
  audio_mode?: string | null
  audioMode?: string | null
  settle_to_still?: boolean
  settleToStill?: boolean
  auto_advance_on_video_end?: boolean
  autoAdvanceOnVideoEnd?: boolean
  advance_delay_ms?: number
  advanceDelayMs?: number
}

export type PlaqueContract = {
  title?: string
  body?: string[]
  secondary_title?: string
  secondary_body?: string[]
  position?: string
}

export type EncounterMetadata = {
  renderer?: RendererContract | null
  playback?: PlaybackContract | null
  actions?: Record<string, unknown>[] | null
  chamberplate?: ChamberplateContract | null
  phase_map?: {
    node_source?: string
    nodes?: PhaseMapNode[]
  } | PhaseMapContract | null
  capture?: CaptureContract | null
  presentation?: {
    refraction_mode?: string
    plaque?: PlaqueContract
    [key: string]: unknown
  } | null
  plaque?: PlaqueContract | null
  [key: string]: unknown
}

export type EncounterResolution = {
  registryKey: string
  encounterKey: string
  surfaceType: string
  autoAdvanceTo?: string | null
  metadata: EncounterMetadata

  renderer?: RendererContract | null
  playback?: PlaybackContract | null
  actions: ResolvedAction[]
  chamberplate?: ChamberplateContract | null
  phase_map?: PhaseMapContract | null
  capture?: CaptureContract | null

  media: RuntimeMediaItem[]
}
