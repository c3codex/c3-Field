import { supabase } from "@/integrations/supabase/client"
import type {
  EncounterResolution,
  EncounterRow,
  Json,
  RendererKind,
  RendererLayout,
  RuntimeMediaItem,
  TransitionRow,
} from "@/systems/measures/types"

function asRecord(value: unknown): Record<string, Json> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json>)
    : null
}

function asString<T extends string>(value: unknown, fallback: T): T {
  return typeof value === "string" && value.trim() ? (value as T) : fallback
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback
}

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function deriveRendererDefaults(surfaceType: string): {
  kind: RendererKind
  layout: RendererLayout
} {
  switch (surfaceType) {
    case "passage":
      return { kind: "generic_passage_encounter", layout: "single_surface" }
    case "phase_map":
      return { kind: "generic_phase_encounter", layout: "single_surface" }
    case "inscription":
    case "scroll":
      return { kind: "generic_text_encounter", layout: "single_surface" }
    default:
      return { kind: "generic_media_encounter", layout: "single_surface" }
  }
}

function isReleaseSatisfied(releaseState: string | null): boolean {
  return releaseState === "released" || releaseState === "open"
}

function isDependencySatisfied(
  dependencyReleaseState: string | null,
  dependencyAccessState: string | null,
): boolean {
  if (!dependencyReleaseState && !dependencyAccessState) return true

  const releaseOk =
    dependencyReleaseState === "released" || dependencyReleaseState === "open"
  const accessOk =
    dependencyAccessState === "visible" ||
    dependencyAccessState === "callable" ||
    dependencyAccessState === "encounterable"

  return releaseOk || accessOk
}

function buildBlockedReason(row: TransitionRow): string | null {
  if (row.requires_release && !isReleaseSatisfied(row.to_live_release_state)) {
    return row.to_release_reason || row.to_access_reason || "Release not available."
  }

  if (
    row.requires_dependency_satisfied &&
    !isDependencySatisfied(
      row.dependency_live_release_state,
      row.dependency_live_access_state,
    )
  ) {
    return "Dependency not yet satisfied."
  }

  return null
}

function isBlocked(row: TransitionRow): boolean {
  if (row.rule_state !== "active") return true

  if (row.requires_release && !isReleaseSatisfied(row.to_live_release_state)) {
    return true
  }

  if (
    row.requires_dependency_satisfied &&
    !isDependencySatisfied(
      row.dependency_live_release_state,
      row.dependency_live_access_state,
    )
  ) {
    return true
  }

  return false
}

function normalizeAction(
  row: TransitionRow,
  blocked: boolean,
  blockedReason: string | null,
) {
  const metadata = asRecord(row.metadata)
  const actionMeta = asRecord(metadata?.action)

  return {
    id: asString(actionMeta?.id, row.id),
    kind: row.transition_kind,
    label: asString(actionMeta?.label, row.to_encounter_title ?? "Continue"),
    blocked,
    blockedReason,
    targetRegistryKey: row.to_registry_key,
    targetEncounterKey: row.to_encounter_key,
    requiresConnectPrompt: row.requires_connect_prompt,
    metadata,
  }
}

function buildPublicMediaUrl(bucketName: string, storagePath: string) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error("VITE_SUPABASE_URL is required")
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`
}

async function fetchEncounterRow(registryKey: string): Promise<EncounterRow> {
  const { data, error } = await supabase
    .from("v_measures_encounter_runtime")
    .select(`
      registry_id,
      registry_key,
      registry_title,
      registry_family,
      encounter_id,
      encounter_key,
      encounter_title,
      encounter_type,
      material_family,
      surface_type,
      sequence_order,
      pause_allowed,
      is_entry_surface,
      encounter_metadata,
      live_release_state,
      live_access_state,
      release_reason,
      access_reason,
      phase_label
    `)
    .eq("registry_key", registryKey)
    .order("is_entry_surface", { ascending: false })
    .order("sequence_order", { ascending: true, nullsFirst: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(
      `Failed to resolve encounter for registry key: ${registryKey} (${error.message})`,
    )
  }

  if (!data) {
    throw new Error(`No encounter runtime row found for registry key: ${registryKey}`)
  }

  return {
    registry_id: data.registry_id,
    registry_key: data.registry_key,
    registry_title: data.registry_title,
    registry_family: data.registry_family,
    encounter_id: data.encounter_id,
    encounter_key: data.encounter_key,
    encounter_title: data.encounter_title,
    encounter_type: data.encounter_type,
    material_family: data.material_family,
    surface_type: data.surface_type,
    sequence_order: data.sequence_order,
    pause_allowed: data.pause_allowed,
    is_entry_surface: data.is_entry_surface,
    encounter_metadata: asRecord(data.encounter_metadata),
    live_release_state: data.live_release_state,
    live_access_state: data.live_access_state,
    release_reason: data.release_reason,
    access_reason: data.access_reason,
    phase_label: data.phase_label,
  }
}

async function fetchTransitionRows(encounter: EncounterRow): Promise<TransitionRow[]> {
  const { data, error } = await supabase
    .from("v_measures_transition_runtime")
    .select(`
      id,
      transition_kind,
      rule_state,
      requires_release,
      requires_dependency_satisfied,
      requires_passage_ready,
      requires_connect_prompt,
      sort_order,
      metadata,
      to_registry_id,
      to_registry_key,
      to_encounter_id,
      to_encounter_key,
      to_encounter_title,
      to_live_release_state,
      to_live_access_state,
      to_release_reason,
      to_access_reason,
      dependency_registry_id,
      dependency_registry_key,
      dependency_live_release_state,
      dependency_live_access_state
    `)
    .eq("from_registry_id", encounter.registry_id)
    .eq("from_encounter_id", encounter.encounter_id)
    .eq("rule_state", "active")
    .order("sort_order", { ascending: true })

  if (error) {
    throw new Error(
      `Failed to resolve transition rules for: ${encounter.encounter_key} (${error.message})`,
    )
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    transition_kind: row.transition_kind,
    rule_state: row.rule_state,
    requires_release: row.requires_release,
    requires_dependency_satisfied: row.requires_dependency_satisfied,
    requires_passage_ready: row.requires_passage_ready,
    requires_connect_prompt: row.requires_connect_prompt,
    sort_order: row.sort_order,
    metadata: asRecord(row.metadata),
    to_registry_id: row.to_registry_id,
    to_registry_key: row.to_registry_key,
    to_encounter_id: row.to_encounter_id,
    to_encounter_key: row.to_encounter_key,
    to_encounter_title: row.to_encounter_title,
    to_live_release_state: row.to_live_release_state,
    to_live_access_state: row.to_live_access_state,
    to_release_reason: row.to_release_reason,
    to_access_reason: row.to_access_reason,
    dependency_registry_id: row.dependency_registry_id,
    dependency_registry_key: row.dependency_registry_key,
    dependency_live_release_state: row.dependency_live_release_state,
    dependency_live_access_state: row.dependency_live_access_state,
  }))
}

async function fetchMediaRows(encounter: EncounterRow): Promise<RuntimeMediaItem[]> {
  const { data, error } = await supabase
    .from("v_measures_media_runtime")
    .select(`
      label,
      media_type,
      bucket_name,
      storage_path,
      render_order
    `)
    .eq("registry_key", encounter.registry_key)
    .eq("encounter_key", encounter.encounter_key)
    .order("render_order", { ascending: true })

  if (error) {
    throw new Error(
      `Failed to resolve media for: ${encounter.encounter_key} (${error.message})`,
    )
  }

  return (data ?? []).map((row) => ({
    label: row.label,
    mediaType: row.media_type,
    bucketName: row.bucket_name,
    storagePath: row.storage_path,
    renderOrder: row.render_order,
  }))
}

export function toPublicMediaUrl(item: RuntimeMediaItem): string {
  return buildPublicMediaUrl(item.bucketName, item.storagePath)
}

export async function resolveEncounter(
  registryKey: string,
): Promise<EncounterResolution> {
  const encounter = await fetchEncounterRow(registryKey)
  const [transitionRows, media] = await Promise.all([
    fetchTransitionRows(encounter),
    fetchMediaRows(encounter),
  ])

  const encounterMeta = asRecord(encounter.encounter_metadata)
  const rendererMeta = asRecord(encounterMeta?.renderer)
  const behaviorMeta = asRecord(encounterMeta?.behavior)
  const presentationMeta = asRecord(encounterMeta?.presentation)
  const playbackMeta = asRecord(presentationMeta?.playback)

  const defaults = deriveRendererDefaults(encounter.surface_type)

  const actions = transitionRows.map((row) => {
    const blocked = isBlocked(row)
    const blockedReason = blocked ? buildBlockedReason(row) : null
    return normalizeAction(row, blocked, blockedReason)
  })

  return {
    registryKey: encounter.registry_key,
    encounter: {
      registryId: encounter.registry_id,
      registryKey: encounter.registry_key,
      displayTitle: encounter.registry_title,
      registryFamily: encounter.registry_family,
      encounterId: encounter.encounter_id,
      encounterKey: encounter.encounter_key,
      encounterTitle: encounter.encounter_title,
      encounterType: encounter.encounter_type,
      materialFamily: encounter.material_family,
      surfaceType: encounter.surface_type,
      sequenceOrder: encounter.sequence_order,
      pauseAllowed: encounter.pause_allowed,
      isEntrySurface: encounter.is_entry_surface,
      metadata: {
        ...(encounterMeta ?? {}),
        presentation: presentationMeta,
      },
    },
    state: {
      releaseState: encounter.live_release_state,
      accessState: encounter.live_access_state,
      releaseReason: encounter.release_reason,
      accessReason: encounter.access_reason,
      phaseLabel: encounter.phase_label,
    },
    renderer: {
      kind: asString(rendererMeta?.kind, defaults.kind),
      layout: asString(rendererMeta?.layout, defaults.layout),
      showActionRail: asBoolean(behaviorMeta?.show_action_rail, true),
      showReleaseState: asBoolean(behaviorMeta?.show_release_state, true),
      showHeader: asBoolean(behaviorMeta?.show_header, true),
      showSubheader: asBoolean(behaviorMeta?.show_subheader, true),
      playback: {
        videoMode: asString(playbackMeta?.videoMode ?? playbackMeta?.video_mode, "default"),
        audioMode: asString(playbackMeta?.audioMode ?? playbackMeta?.audio_mode, "default"),
        settleToStill: asBoolean(playbackMeta?.settleToStill ?? playbackMeta?.settle_to_still, false),
        autoAdvanceOnVideoEnd: asBoolean(
          playbackMeta?.autoAdvanceOnVideoEnd ?? playbackMeta?.auto_advance_on_video_end,
          false,
        ),
        advanceDelayMs: asNumber(playbackMeta?.advanceDelayMs ?? playbackMeta?.advance_delay_ms, 0),
      },
    },
    media,
    actions,
  }
}

