import { supabase } from "@/integrations/supabase/client"
import { resolveRuntimeMediaUrl } from "@/shared/media/runtimeMediaUrl"
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

type RegistryRow = {
  id: string
  registry_key: string
  metadata: JsonRecord | null
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
  surface_key?: string | null
  label: string | null
  media_type: string
  bucket_name: string
  storage_path: string
  render_order: number | null
  is_active: boolean | null
}

type RegistryMediaRow = {
  surface_key: string
  sequence_index: number | null
  role: string
  status: string | null
  metadata: JsonRecord | null
  codex_media_asset:
    | {
        media_key: string
        title: string
        media_type: string
        bucket: string
        storage_path: string
        storage_provider: string | null
        public_url: string | null
        poster_url: string | null
        status: string | null
        metadata: JsonRecord | null
      }
    | Array<{
        media_key: string
        title: string
        media_type: string
        bucket: string
        storage_path: string
        storage_provider: string | null
        public_url: string | null
        poster_url: string | null
        status: string | null
        metadata: JsonRecord | null
      }>
}

const GOVERNED_MEDIA_SURFACE_TYPES = new Set(["chamberplate", "aspect", "threshold", "passage"])

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

function uniqueStrings(values: Array<string | null | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}

function metadataEncounterKey(metadata: JsonRecord | null) {
  if (!metadata) return null

  return (
    asString(metadata.encounter_key) ??
    asString(metadata.encounterKey) ??
    asString(metadata.encounter_def_key) ??
    asString(metadata.encounterDefKey)
  )
}

function orderEncounterRows(rows: EncounterRow[], encounterKeys: string[]) {
  return [...rows].sort((left, right) => {
    const leftIndex = encounterKeys.indexOf(left.encounter_key)
    const rightIndex = encounterKeys.indexOf(right.encounter_key)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

async function resolveEncounterRow(inputKey: string) {
  const { data: registryData, error: registryError } = await supabase
    .from("measures_registry")
    .select("id, registry_key, metadata")
    .eq("registry_key", inputKey)
    .maybeSingle()

  if (registryError) {
    console.error("Registry lookup failed", { inputKey, registryError })
  }

  if (registryData) {
    const registry = registryData as RegistryRow
    const encounterKeys = uniqueStrings([
      registry.registry_key,
      metadataEncounterKey(registry.metadata),
      `${registry.registry_key}_view`,
      `${registry.registry_key}_encounter`,
    ])

    const { data: encounterData, error: encounterError } = await supabase
      .from("measures_encounter_def")
      .select(
        `
        id,
        registry_id,
        encounter_key,
        surface_type,
        metadata,
        measures_registry (
          registry_key
        )
      `
      )
      .eq("registry_id", registry.id)
      .in("encounter_key", encounterKeys)

    if (encounterError) {
      throw encounterError
    }

    const ordered = orderEncounterRows((encounterData ?? []) as EncounterRow[], encounterKeys)
    if (ordered[0]) return ordered[0]

    throw new Error(`Failed to resolve encounter for registry key: ${inputKey}`)
  }

  const { data: legacyData, error: legacyError } = await supabase
    .from("measures_encounter_def")
    .select(
      `
      id,
      registry_id,
      encounter_key,
      surface_type,
      metadata,
      measures_registry (
        registry_key
      )
    `
    )
    .eq("encounter_key", inputKey)
    .maybeSingle()

  if (legacyError || !legacyData) {
    throw legacyError ?? new Error(`Failed to resolve encounter: ${inputKey}`)
  }

  return legacyData as EncounterRow
}

function resolveActions(metadata: JsonRecord): ResolvedAction[] {
  const resolution = asRecord(metadata.resolution)
  const actions = [
    ...(Array.isArray(metadata.actions) ? metadata.actions : []),
    ...(Array.isArray(resolution?.actions) ? resolution.actions : []),
  ]

  if (!actions.length) return []

  const resolved = actions.flatMap((value, index) => {
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
  })

  const deduped = new Map<string, ResolvedAction>()
  for (const action of resolved) {
    const key = action.id || `${action.kind}:${action.targetRegistryKey ?? ""}`
    if (!deduped.has(key)) deduped.set(key, action)
  }

  return [...deduped.values()].sort(
    (left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999),
  )
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
  return resolveRuntimeMediaUrl(item) ?? ""
}

function registryMediaAsset(row: RegistryMediaRow) {
  return Array.isArray(row.codex_media_asset)
    ? row.codex_media_asset[0]
    : row.codex_media_asset
}

function registryMediaToRuntime(row: RegistryMediaRow): RuntimeMediaItem | null {
  const asset = registryMediaAsset(row)
  if (!asset) return null

  return {
    label: asset.title ?? row.role,
    mediaType: asset.media_type,
    bucketName: asset.bucket,
    storagePath: asset.storage_path,
    storageProvider: asset.storage_provider,
    renderOrder: row.sequence_index ?? 999,
    isActive: row.status !== "inactive" && asset.status !== "inactive",
    source: "registry_media",
    surfaceKey: row.surface_key,
    role: row.role,
    mediaKey: asset.media_key,
    title: asset.title,
    publicUrl: asset.public_url,
    posterUrl: asset.poster_url,
    status: asset.status,
    mapMetadata: row.metadata ?? null,
    assetMetadata: asset.metadata ?? null,
  }
}

async function resolveRegistryMedia(
  resolvedRegistryKey: string,
  encounterKey: string,
): Promise<RuntimeMediaItem[]> {
  const { data: registryMediaData, error: registryMediaError } = await supabase
    .from("measures_surface_media_map")
    .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, storage_provider, public_url, poster_url, status, metadata)")
    .in("surface_key", [resolvedRegistryKey, encounterKey])
    .eq("status", "active")
    .order("sequence_index", { ascending: true })

  if (registryMediaError) {
    console.error("Registry media lookup failed", { registryKey: resolvedRegistryKey, registryMediaError })
  }

  return ((registryMediaData ?? []) as RegistryMediaRow[])
    .map(registryMediaToRuntime)
    .filter((item): item is RuntimeMediaItem => Boolean(item))
    .filter((item) => item.isActive !== false)
}

async function resolveFallbackMedia(
  resolvedRegistryKey: string,
  encounterKey: string,
): Promise<RuntimeMediaItem[]> {
  const { data: mediaData, error: mediaError } = await supabase
    .from("temp_exhibition_media")
    .select("surface_key, label, media_type, bucket_name, storage_path, render_order, is_active")
    .in("surface_key", [resolvedRegistryKey, encounterKey])
    .order("render_order", { ascending: true })

  if (mediaError) {
    console.error("Media lookup failed", { registryKey: resolvedRegistryKey, mediaError })
  }

  return ((mediaData ?? []) as MediaBridgeRow[])
    .filter((row) => row.is_active !== false)
    .map((row) => ({
      label: row.label ?? null,
      mediaType: row.media_type,
      bucketName: row.bucket_name,
      storagePath: row.storage_path,
      renderOrder: row.render_order ?? 999,
      isActive: row.is_active ?? true,
      source: "temp_exhibition_media",
      surfaceKey: row.surface_key ?? null,
      role: row.media_type,
      mediaKey: null,
      title: row.label ?? null,
      publicUrl: null,
      posterUrl: null,
      status: row.is_active === false ? "inactive" : "active",
      mapMetadata: null,
      assetMetadata: null,
    }))
}

function supplementMissingMediaTypes(
  governedMedia: RuntimeMediaItem[],
  fallbackMedia: RuntimeMediaItem[],
) {
  const governedTypes = new Set(governedMedia.map((item) => item.mediaType))
  const supplementalFallback = fallbackMedia.filter((item) => !governedTypes.has(item.mediaType))
  return [...governedMedia, ...supplementalFallback]
}

export async function resolveEncounter(registryKey: string): Promise<EncounterResolution> {
  const encounter = await resolveEncounterRow(registryKey)
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

  let media: RuntimeMediaItem[] = []
  const readsGovernedMedia = GOVERNED_MEDIA_SURFACE_TYPES.has(encounter.surface_type)

  if (readsGovernedMedia) {
    media = await resolveRegistryMedia(resolvedRegistryKey, encounter.encounter_key)
  }

  if (media.length === 0) {
    media = await resolveFallbackMedia(resolvedRegistryKey, encounter.encounter_key)
  } else if (readsGovernedMedia && encounter.surface_type !== "chamberplate") {
    const fallbackMedia = await resolveFallbackMedia(resolvedRegistryKey, encounter.encounter_key)
    media = supplementMissingMediaTypes(media, fallbackMedia)
  }
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
