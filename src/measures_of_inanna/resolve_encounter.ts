import { supabase } from "@/integrations/supabase/client"
import type {
  ChamberplateContract,
  CaptureContract,
  EncounterResolution,
  PlaybackContract,
  RendererContract,
  ResolvedAction,
  RuntimeMediaItem,
} from "./types"

type JsonRecord = Record<string, unknown>

type EncounterRow = {
  id: string
  registry_id: string
  encounter_key: string
  surface_type: string
  metadata: JsonRecord | null
  measures_registry?: { registry_key?: string | null } | { registry_key?: string | null }[] | null
}

type TransitionRuntimeRow = {
  id: string
  transition_kind: string
  rule_state: string
  sort_order: number | null
  metadata: JsonRecord | null
  to_registry_key: string | null
  to_encounter_key: string | null
  to_encounter_title: string | null
}

type MediaBridgeRow = {
  label: string | null
  media_type: string
  bucket_name: string
  storage_path: string
  render_order: number | null
  is_active: boolean | null
}

function asRecord(value: unknown): JsonRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as JsonRecord
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" ? value : null
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null
}

function resolveRegistryKey(data: EncounterRow, fallback: string) {
  const registry = Array.isArray(data.measures_registry)
    ? data.measures_registry[0]
    : data.measures_registry

  return registry?.registry_key ?? fallback
}

function resolveActions(metadata: JsonRecord): ResolvedAction[] {
  const actions = metadata.actions

  if (!Array.isArray(actions)) return []

  return actions.flatMap((value, index) => {
    const action = asRecord(value)
    if (!action) return []

    const targetRegistryKey =
      asString(action.targetRegistryKey) ??
      asString(action.target_registry_key) ??
      asString(action.to_registry) ??
      asString(action.to_encounter)

    return {
      id: asString(action.id) ?? targetRegistryKey ?? `action-${index}`,
      label: asString(action.label) ?? "",
      kind: asString(action.kind) ?? "navigate",
      emphasis: asString(action.emphasis),
      blocked: asBoolean(action.blocked) ?? false,
      blockedReason: asString(action.blockedReason) ?? asString(action.blocked_reason),
      targetRegistryKey,
      targetEncounterKey:
        asString(action.targetEncounterKey) ?? asString(action.target_encounter_key),
      targetAfterPassage:
        asString(action.targetAfterPassage) ?? asString(action.target_after_passage),
      transitionKind: asString(action.transitionKind) ?? asString(action.transition_kind),
      sortOrder: asNumber(action.sortOrder) ?? asNumber(action.sort_order),
      metadata: action,
    }
  }).sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

function resolveTransitionActions(rows: TransitionRuntimeRow[]): ResolvedAction[] {
  return rows
    .filter((row) => row.rule_state === "active")
    .map((row) => {
      const metadata = asRecord(row.metadata) ?? {}
      const action = asRecord(metadata.action) ?? {}

      return {
        id: asString(action.id) ?? row.id,
        label: asString(action.label) ?? row.to_encounter_title ?? "",
        kind: asString(action.kind) ?? row.transition_kind,
        emphasis: asString(action.emphasis),
        blocked: false,
        blockedReason: null,
        targetRegistryKey: row.to_registry_key,
        targetEncounterKey: row.to_encounter_key,
        targetAfterPassage:
          asString(metadata.targetAfterPassage) ??
          asString(metadata.target_after_passage) ??
          asString(action.targetAfterPassage) ??
          asString(action.target_after_passage),
        transitionKind: row.transition_kind,
        sortOrder: row.sort_order,
        metadata,
      }
    })
    .sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

function resolvePlayback(metadata: JsonRecord): PlaybackContract | null {
  const playback = asRecord(metadata.playback)
  if (!playback) return null

  return {
    mode: asString(playback.mode),
    fade_ms: asNumber(playback.fade_ms) ?? undefined,
    settle_ms: asNumber(playback.settle_ms) ?? undefined,
    video_mode: asString(playback.video_mode) ?? asString(playback.videoMode),
    audio_mode: asString(playback.audio_mode) ?? asString(playback.audioMode),
    settle_to_still:
      asBoolean(playback.settle_to_still) ?? asBoolean(playback.settleToStill) ?? undefined,
    auto_advance_on_video_end:
      asBoolean(playback.auto_advance_on_video_end) ??
      asBoolean(playback.autoAdvanceOnVideoEnd) ??
      undefined,
    advance_delay_ms:
      asNumber(playback.advance_delay_ms) ?? asNumber(playback.advanceDelayMs) ?? undefined,
  }
}

function resolveAutoAdvanceTo(metadata: JsonRecord): string | null {
  const playback = asRecord(metadata.playback)

  return (
    asString(metadata.auto_advance_to) ??
    asString(metadata.autoAdvanceTo) ??
    asString(playback?.auto_advance_to) ??
    asString(playback?.autoAdvanceTo)
  )
}

export function toPublicMediaUrl(item: RuntimeMediaItem): string {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!supabaseUrl || !item.bucketName || !item.storagePath) {
    return ""
  }

  return `${supabaseUrl}/storage/v1/object/public/${item.bucketName}/${item.storagePath}`
}

export async function resolveEncounter(registryKey: string): Promise<EncounterResolution> {
  const { data, error } = await supabase
    .from("measures_encounter_def")
    .select(
      `
      id,
      registry_id,
      encounter_key,
      surface_type,
      metadata,
      measures_registry!inner (
        registry_key
      )
    `
    )
    .eq("measures_registry.registry_key", registryKey)
    .single()

  if (error || !data) {
    throw new Error(`Failed to resolve encounter: ${registryKey}`)
  }

  const encounter = data as EncounterRow
  const metadata = encounter.metadata ?? {}
  const resolvedRegistryKey = resolveRegistryKey(encounter, registryKey)

  const { data: transitionData, error: transitionError } = await supabase
    .from("v_measures_transition_runtime")
    .select(
      `
      id,
      transition_kind,
      rule_state,
      sort_order,
      metadata,
      to_registry_key,
      to_encounter_key,
      to_encounter_title
    `
    )
    .eq("from_registry_id", encounter.registry_id)
    .eq("from_encounter_id", encounter.id)
    .eq("rule_state", "active")
    .order("sort_order", { ascending: true })

  if (transitionError) {
    console.error("Transition lookup failed", {
      registryKey: resolvedRegistryKey,
      encounterKey: encounter.encounter_key,
      transitionError,
    })
  }

  const { data: mediaData, error: mediaError } = await supabase
    .from("temp_exhibition_media")
    .select("label, media_type, bucket_name, storage_path, render_order, is_active")
    .in("surface_key", [resolvedRegistryKey, encounter.encounter_key])
    .order("render_order", { ascending: true })

  if (mediaError) {
    console.error("Media lookup failed", { registryKey: resolvedRegistryKey, mediaError })
  }

  const media: RuntimeMediaItem[] = ((mediaData ?? []) as MediaBridgeRow[])
    .filter((row) => row.is_active !== false)
    .map((row) => ({
      label: row.label ?? null,
      mediaType: row.media_type,
      bucketName: row.bucket_name,
      storagePath: row.storage_path,
      renderOrder: row.render_order ?? 999,
      isActive: row.is_active ?? true,
    }))
  const metadataActions = resolveActions(metadata)
  const transitionActions = resolveTransitionActions(
    ((transitionData ?? []) as TransitionRuntimeRow[]) ?? []
  )
  const actions = metadataActions.length > 0 ? metadataActions : transitionActions

  return {
    registryKey: resolvedRegistryKey,
    encounterKey: encounter.encounter_key,
    surfaceType: encounter.surface_type,
    autoAdvanceTo: resolveAutoAdvanceTo(metadata),
    metadata: {
      ...metadata,
      renderer: asRecord(metadata.renderer) as RendererContract | null,
      playback: resolvePlayback(metadata),
      actions: Array.isArray(metadata.actions) ? (metadata.actions as JsonRecord[]) : null,
      chamberplate: asRecord(metadata.chamberplate) as ChamberplateContract | null,
      phase_map: asRecord(metadata.phase_map) as EncounterResolution["phase_map"],
      capture: asRecord(metadata.capture) as CaptureContract | null,
    },

    renderer: asRecord(metadata.renderer) as RendererContract | null,
    playback: resolvePlayback(metadata),
    actions,
    chamberplate: asRecord(metadata.chamberplate) as ChamberplateContract | null,
    phase_map: asRecord(metadata.phase_map) as EncounterResolution["phase_map"],
    capture: asRecord(metadata.capture) as CaptureContract | null,

    media,
  }
}
