export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type TransitionKind =
  | "progression"
  | "pause"
  | "return"
  | "release"
  | "seal"
  | "dependency_unlock"
  | "connect_request_prompt"

export type RuleState = "active" | "held" | "inactive"

export type ReleaseState = "sealed" | "held" | "released" | "open" | "closed"
export type AccessState =
  | "gated"
  | "visible"
  | "callable"
  | "encounterable"
  | "archived"

export type ActionKind =
  | "navigate"
  | "pause"
  | "return"
  | "release"
  | "seal"
  | "prompt"

export type ActionEmphasis = "primary" | "secondary" | "quiet"

export type PromptKind =
  | "connect_request"
  | "release_notice"
  | "dependency_notice"
  | "none"

export type RendererKind =
  | "generic_media_encounter"
  | "generic_text_encounter"
  | "generic_passage_encounter"
  | "generic_phase_encounter"

export type RendererLayout = "single_surface" | "stacked" | "split" | "immersive"

export type EncounterRow = {
  registry_id: string
  registry_key: string
  registry_title: string
  registry_family: string
  encounter_id: string
  encounter_key: string
  encounter_title: string
  encounter_type: string
  material_family: string
  surface_type: string
  sequence_order: number | null
  pause_allowed: boolean
  is_entry_surface: boolean
  encounter_metadata: Record<string, Json> | null
  live_release_state: ReleaseState | null
  live_access_state: AccessState | null
  release_reason: string | null
  access_reason: string | null
  phase_label: string | null
}

export type TransitionRow = {
  id: string
  transition_kind: TransitionKind
  rule_state: RuleState
  requires_release: boolean
  requires_dependency_satisfied: boolean
  requires_passage_ready: boolean
  requires_connect_prompt: boolean
  sort_order: number
  metadata: Record<string, Json> | null
  to_registry_id: string | null
  to_registry_key: string | null
  to_encounter_id: string | null
  to_encounter_key: string | null
  to_encounter_title: string | null
  to_live_release_state: ReleaseState | null
  to_live_access_state: AccessState | null
  to_release_reason: string | null
  to_access_reason: string | null
  dependency_registry_id: string | null
  dependency_registry_key: string | null
  dependency_live_release_state: ReleaseState | null
  dependency_live_access_state: AccessState | null
}

export type RuntimeMediaItem = {
  label: string | null
  mediaType: string
  bucketName: string
  storagePath: string
  renderOrder: number
}

export type ResolvedAction = {
  id: string
  label: string
  kind: ActionKind
  emphasis: ActionEmphasis
  blocked: boolean
  blockedReason: string | null
  promptEnabled: boolean
  promptKind: PromptKind
  targetRegistryKey: string | null
  targetEncounterKey: string | null
  transitionKind: TransitionKind
  sortOrder: number
  metadata: Record<string, Json> | null
}

export type EncounterResolution = {
  encounter: {
    registryId: string
    registryKey: string
    displayTitle: string
    registryFamily: string
    encounterId: string
    encounterKey: string
    encounterTitle: string
    encounterType: string
    materialFamily: string
    surfaceType: string
    sequenceOrder: number | null
    pauseAllowed: boolean
    isEntrySurface: boolean
    metadata: Record<string, Json> | null
  }
  state: {
    releaseState: ReleaseState | null
    accessState: AccessState | null
    releaseReason: string | null
    accessReason: string | null
    phaseLabel: string | null
  }
  renderer: {
    kind: RendererKind
    layout: RendererLayout
    showActionRail: boolean
    showReleaseState: boolean
    showHeader: boolean
    showSubheader: boolean
    playback: {
      videoMode: string | null
      audioMode: string | null
      settleToStill: boolean
      autoAdvanceOnVideoEnd: boolean
      advanceDelayMs: number
    }
  }
  media: RuntimeMediaItem[]
  actions: ResolvedAction[]
}
