require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!serviceUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const service = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const evidencePath =
  "docs/oar/measures_registry/diagnose_inanna_full_encounter_matrix_v1.json"

const TARGET_KEYS = [
  "epigraph",
  "crystal_temple_home",
  "inanna_seat",
  "temple_antechamber",
  "temple_harrumuk_passage",
  "phase_map",
  "kumurrah_passage",
  "gate_1_crown_removed",
  "gates_passage_01",
  "gate_2_lapis_beads",
  "gates_passage_02",
  "gate_3_lapis_necklace",
  "gates_passage_03",
  "chamber_epithets_01_primus_artus",
  "epithets_passage_01",
  "chamber_epithets_02_gemynd_corpus",
  "epithets_passage_02",
  "chamber_epithets_03_percipari",
  "codexstone",
  "me_01",
]

const GOVERNED_MEDIA_SURFACE_TYPES = new Set(["chamberplate", "aspect", "threshold"])
const SUPPORTED_RENDERERS = new Set([
  "encounter_focus",
  "choice_surface",
  "plaque_overlay",
  "phase_map",
  "passage_only",
])

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null
}

function asString(value) {
  return typeof value === "string" ? value : null
}

function asBoolean(value) {
  return typeof value === "boolean" ? value : null
}

function asNumber(value) {
  return typeof value === "number" ? value : null
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
}

function metadataEncounterKey(metadata) {
  const record = asRecord(metadata)
  if (!record) return null
  return (
    asString(record.encounter_key) ??
    asString(record.encounterKey) ??
    asString(record.encounter_def_key) ??
    asString(record.encounterDefKey)
  )
}

function summarizeRenderer(metadata) {
  const renderer = asRecord(asRecord(metadata)?.renderer)
  if (!renderer) return null
  return {
    layout: asString(renderer.layout),
    media_fit: asString(renderer.media_fit),
    show_action_rail:
      asBoolean(renderer.show_action_rail) ?? asBoolean(renderer.showActionRail) ?? null,
  }
}

function resolveActions(metadata) {
  const record = asRecord(metadata) ?? {}
  const resolution = asRecord(record.resolution)
  const actions = [
    ...(Array.isArray(record.actions) ? record.actions : []),
    ...(Array.isArray(resolution?.actions) ? resolution.actions : []),
  ]

  const resolved = actions.flatMap((value, index) => {
    const action = asRecord(value)
    if (!action) return []
    return {
      id:
        asString(action.id) ??
        asString(action.target_registry_key) ??
        asString(action.targetRegistryKey) ??
        `action-${index}`,
      label: asString(action.label) ?? "",
      kind: asString(action.kind) ?? "navigate",
      targetRegistryKey:
        asString(action.targetRegistryKey) ??
        asString(action.target_registry_key) ??
        asString(action.to_registry) ??
        asString(action.to_encounter),
      targetEncounterKey:
        asString(action.targetEncounterKey) ?? asString(action.target_encounter_key),
      targetAfterPassage:
        asString(action.targetAfterPassage) ?? asString(action.target_after_passage),
      emphasis: asString(action.emphasis),
      sortOrder: asNumber(action.sortOrder) ?? asNumber(action.sort_order) ?? null,
    }
  })

  const deduped = new Map()
  for (const action of resolved) {
    if (!deduped.has(action.id)) deduped.set(action.id, action)
  }

  return [...deduped.values()].sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

function resolveTransitionActions(rows) {
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
        targetRegistryKey: row.to_registry_key,
        targetEncounterKey: row.to_encounter_key,
        targetAfterPassage:
          asString(metadata.targetAfterPassage) ??
          asString(metadata.target_after_passage) ??
          asString(action.targetAfterPassage) ??
          asString(action.target_after_passage),
        sortOrder: row.sort_order,
      }
    })
    .sort((left, right) => (left.sortOrder ?? 999) - (right.sortOrder ?? 999))
}

function orderEncounterRows(rows, candidateKeys) {
  return [...rows].sort((left, right) => {
    const leftIndex = candidateKeys.indexOf(left.encounter_key)
    const rightIndex = candidateKeys.indexOf(right.encounter_key)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

async function fetchStatus(url) {
  if (!url) return null
  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.status
  } catch (error) {
    return `fetch_error:${error.message}`
  }
}

async function getLiveBundleConfig() {
  const htmlResponse = await fetch("https://www.measuresofinanna.com/")
  const html = await htmlResponse.text()
  const assetPath = (html.match(/assets\/[^"' ]+\.js/) || [])[0] ?? null
  if (!assetPath) throw new Error("live Inanna asset path not found")

  const js = await fetch(`https://www.measuresofinanna.com/${assetPath}`).then((response) =>
    response.text(),
  )
  const publicUrl = (js.match(/https:\/\/[a-z0-9]+\.supabase\.co/) || [])[0] ?? null
  const publicKey = (js.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0] ?? null
  const r2BaseUrl = (js.match(/https:\/\/media\.c3field\.online/) || [])[0] ?? null

  if (!publicUrl || !publicKey) throw new Error("live public supabase config not found")

  return {
    assetPath,
    htmlTitle: (html.match(/<title>([^<]+)<\/title>/i) || [])[1] ?? null,
    publicUrl,
    publicKey,
    r2BaseUrl,
    bundleEncounterFallbackInspection:
      js.includes("_encounter") && js.includes("gate_1_crown_removed_encounter")
        ? "marker_present"
        : "inconclusive_from_minified_bundle",
  }
}

function createPublicClient(config) {
  return createClient(config.publicUrl, config.publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { apikey: config.publicKey } },
  })
}

function resolveRuntimeMediaUrl(item, r2BaseUrl, publicUrl) {
  if (!item) return null
  if (item.publicUrl) return item.publicUrl
  if (!item.bucketName || !item.storagePath) return null
  const provider = item.storageProvider?.toLowerCase() ?? null
  const isR2 = provider === "cloudflare_r2" || item.bucketName === "measures-media"
  if (isR2) {
    if (!r2BaseUrl) return null
    return `${r2BaseUrl.replace(/\/+$/g, "")}/${encodeObjectKey(trimSlashes(item.storagePath))}`
  }
  return `${publicUrl}/storage/v1/object/public/${item.bucketName}/${encodeObjectKey(item.storagePath)}`
}

function choosePrimaryByType(mediaItems, mediaType) {
  return mediaItems.find((item) => item.mediaType === mediaType) ?? null
}

async function inspectKey(key, publicClient, liveConfig) {
  const registryData = assertOk(
    await service.from("measures_registry").select("id, registry_key, metadata").eq("registry_key", key).maybeSingle(),
    `registry lookup for ${key}`,
  )

  const fallbackRowsAll = assertOk(
    await service
      .from("temp_exhibition_media")
      .select("surface_key, label, media_type, bucket_name, storage_path, render_order, is_active")
      .in("surface_key", [key, `${key}_view`, `${key}_encounter`])
      .order("render_order", { ascending: true }),
    `fallback media lookup for ${key}`,
  )

  const base = {
    registry_key_requested: key,
    registry_row_exists: Boolean(registryData),
    registry_id: registryData?.id ?? null,
    parent_registry_id: null,
    family: asString(asRecord(registryData?.metadata)?.family) ?? null,
    surface_type: null,
    release_standing: [],
    access_standing: [],
    expected_encounter_key_candidates: [],
    candidate_resolution_table: {},
    resolved_encounter_key: null,
    encounter_def_exists: false,
    renderer: null,
    renderer_supported: null,
    governed_media_row_count: 0,
    fallback_media_row_count: fallbackRowsAll.filter((row) => row.is_active !== false).length,
    governed_media_roles: [],
    fallback_media_roles: fallbackRowsAll
      .filter((row) => row.is_active !== false)
      .map((row) => ({ media_type: row.media_type, storage_path: row.storage_path })),
    primary_video_media_key: null,
    primary_still_media_key: null,
    primary_audio_media_key: null,
    media_retrieval_statuses: {},
    transition_targets: {
      primary: null,
      secondary: null,
      return: null,
      all: [],
    },
    live_deployed_route_result: "unresolved",
    failure_class: "unknown / requires follow-up",
  }

  if (!registryData) {
    return { ...base, failure_class: "missing registry row" }
  }

  base.parent_registry_id =
    asString(asRecord(registryData.metadata)?.parent_registry_id) ??
    asString(asRecord(registryData.metadata)?.parent_registry_key) ??
    null

  const candidates = uniqueStrings([
    registryData.registry_key,
    metadataEncounterKey(registryData.metadata),
    `${registryData.registry_key}_view`,
    `${registryData.registry_key}_encounter`,
  ])
  base.expected_encounter_key_candidates = candidates

  const allServiceEncounters = assertOk(
    await service
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key, surface_type, metadata")
      .eq("registry_id", registryData.id),
    `all encounter lookup for ${key}`,
  )

  const candidateServiceEncounters = allServiceEncounters.filter((row) =>
    candidates.includes(row.encounter_key),
  )
  const candidatePublicEncounters = assertOk(
    await publicClient
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key, surface_type, metadata")
      .eq("registry_id", registryData.id)
      .in("encounter_key", candidates),
    `public encounter lookup for ${key}`,
  )

  for (const candidate of candidates) {
    base.candidate_resolution_table[candidate] = {
      service: allServiceEncounters.some((row) => row.encounter_key === candidate),
      public: candidatePublicEncounters.some((row) => row.encounter_key === candidate),
    }
  }

  const orderedService = orderEncounterRows(candidateServiceEncounters, candidates)
  const resolvedEncounter = orderedService[0] ?? null

  if (!resolvedEncounter) {
    const nonCandidateEncounter = allServiceEncounters[0] ?? null
    return {
      ...base,
      surface_type: nonCandidateEncounter?.surface_type ?? null,
      failure_class: nonCandidateEncounter
        ? "encounter key candidate mismatch"
        : "missing encounter_def",
    }
  }

  base.resolved_encounter_key = resolvedEncounter.encounter_key
  base.encounter_def_exists = true
  base.surface_type = resolvedEncounter.surface_type
  base.renderer = summarizeRenderer(resolvedEncounter.metadata)
  base.renderer_supported = base.renderer
    ? SUPPORTED_RENDERERS.has(base.renderer.layout ?? "")
    : null

  const releaseRows = assertOk(
    await service
      .from("measures_release_state")
      .select("release_state, access_state, metadata")
      .eq("registry_id", registryData.id),
    `release standing for ${key}`,
  )
  base.release_standing = releaseRows.map((row) => row.release_state)
  base.access_standing = releaseRows.map((row) => row.access_state)

  const transitionRows = assertOk(
    await publicClient
      .from("v_measures_transition_runtime")
      .select(
        "id, transition_kind, rule_state, sort_order, metadata, to_registry_key, to_encounter_key, to_encounter_title",
      )
      .eq("from_registry_id", resolvedEncounter.registry_id)
      .eq("from_encounter_id", resolvedEncounter.id)
      .eq("rule_state", "active")
      .order("sort_order", { ascending: true }),
    `transition lookup for ${key}`,
  )
  const metadataActions = resolveActions(resolvedEncounter.metadata)
  const transitionActions = resolveTransitionActions(transitionRows)
  const actions = metadataActions.length > 0 ? metadataActions : transitionActions
  base.transition_targets.all = actions.map((action) => ({
    id: action.id,
    label: action.label,
    kind: action.kind,
    targetRegistryKey: action.targetRegistryKey ?? null,
    targetEncounterKey: action.targetEncounterKey ?? null,
    targetAfterPassage: action.targetAfterPassage ?? null,
    emphasis: action.emphasis ?? null,
  }))
  base.transition_targets.primary =
    actions.find((action) => action.emphasis === "primary") ?? actions[0] ?? null
  base.transition_targets.secondary =
    actions.find((action) => action.emphasis === "secondary") ?? null
  base.transition_targets.return =
    actions.find((action) => action.kind === "return" || action.id.includes("return")) ?? null

  const governedRows = assertOk(
    await publicClient
      .from("measures_surface_media_map")
      .select(
        "surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, storage_provider, public_url, poster_url, status, metadata)",
      )
      .in("surface_key", [registryData.registry_key, resolvedEncounter.encounter_key])
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    `governed media lookup for ${key}`,
  )

  base.governed_media_row_count = governedRows.length
  base.governed_media_roles = governedRows.map((row) => {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    return {
      surface_key: row.surface_key,
      role: row.role,
      media_key: asset?.media_key ?? null,
      media_type: asset?.media_type ?? null,
      storage_provider: asset?.storage_provider ?? null,
      storage_path: asset?.storage_path ?? null,
    }
  })

  const fallbackRows = fallbackRowsAll.filter((row) => row.is_active !== false)

  const governedItems = governedRows.map((row) => {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    return {
      source: "registry_media",
      surfaceKey: row.surface_key,
      role: row.role,
      mediaKey: asset?.media_key ?? null,
      mediaType: asset?.media_type ?? null,
      bucketName: asset?.bucket ?? null,
      storagePath: asset?.storage_path ?? null,
      storageProvider: asset?.storage_provider ?? null,
      publicUrl: asset?.public_url ?? null,
      renderOrder: row.sequence_index ?? 999,
    }
  })

  const fallbackItems = fallbackRows.map((row) => ({
    source: "temp_exhibition_media",
    surfaceKey: row.surface_key,
    role: row.media_type,
    mediaKey: null,
    mediaType: row.media_type,
    bucketName: row.bucket_name,
    storagePath: row.storage_path,
    storageProvider: null,
    publicUrl: null,
    renderOrder: row.render_order ?? 999,
  }))

  let selectedMedia = []
  if (GOVERNED_MEDIA_SURFACE_TYPES.has(resolvedEncounter.surface_type)) {
    selectedMedia = [...governedItems]
    if (selectedMedia.length === 0) {
      selectedMedia = [...fallbackItems]
    } else if (resolvedEncounter.surface_type !== "chamberplate") {
      const governedTypes = new Set(selectedMedia.map((item) => item.mediaType))
      selectedMedia = [
        ...selectedMedia,
        ...fallbackItems.filter((item) => !governedTypes.has(item.mediaType)),
      ]
    }
  } else {
    selectedMedia = [...fallbackItems]
  }
  selectedMedia.sort((left, right) => (left.renderOrder ?? 999) - (right.renderOrder ?? 999))

  const primaryVideo = choosePrimaryByType(selectedMedia, "video")
  const primaryStill =
    choosePrimaryByType(selectedMedia, "image") ??
    choosePrimaryByType(selectedMedia, "still") ??
    choosePrimaryByType(selectedMedia, "webp")
  const primaryAudio = choosePrimaryByType(selectedMedia, "audio")

  base.primary_video_media_key = primaryVideo?.mediaKey ?? primaryVideo?.storagePath ?? null
  base.primary_still_media_key = primaryStill?.mediaKey ?? primaryStill?.storagePath ?? null
  base.primary_audio_media_key = primaryAudio?.mediaKey ?? primaryAudio?.storagePath ?? null

  const retrievals = {}
  for (const [label, item] of [
    ["primary_video", primaryVideo],
    ["primary_still", primaryStill],
    ["primary_audio", primaryAudio],
  ]) {
    const url = resolveRuntimeMediaUrl(item, liveConfig.r2BaseUrl, liveConfig.publicUrl)
    retrievals[label] = {
      mediaKey: item?.mediaKey ?? null,
      storagePath: item?.storagePath ?? null,
      source: item?.source ?? null,
      url,
      status: await fetchStatus(url),
    }
  }
  base.media_retrieval_statuses = retrievals

  const publicResolved = candidatePublicEncounters.some(
    (row) => row.encounter_key === base.resolved_encounter_key,
  )

  if (!publicResolved) {
    base.live_deployed_route_result = "public encounter unresolved"
    base.failure_class = "public read policy issue"
    return base
  }

  const videoStatus = retrievals.primary_video?.status
  const stillStatus = retrievals.primary_still?.status
  const hasRenderableMedia =
    videoStatus === 200 || stillStatus === 200 || resolvedEncounter.surface_type === "phase_map"

  if (!base.renderer_supported) {
    base.live_deployed_route_result = "renderer unsupported"
    base.failure_class = "unsupported renderer"
  } else if (
    primaryVideo &&
    videoStatus !== 200 &&
    primaryStill &&
    stillStatus === 200 &&
    (resolvedEncounter.surface_type === "chamberplate" || resolvedEncounter.surface_type === "passage")
  ) {
    base.live_deployed_route_result = "video selected but retrieval fails while still is available"
    base.failure_class = "video/still fallback precedence failure"
  } else if ((primaryVideo || primaryStill || primaryAudio) && !hasRenderableMedia) {
    base.live_deployed_route_result = "media selected but retrieval fails"
    base.failure_class = "media URL retrieval failure"
  } else if ((governedItems.length === 0 && fallbackItems.length === 0) && resolvedEncounter.surface_type !== "phase_map") {
    base.live_deployed_route_result = "no media rows selected"
    base.failure_class = GOVERNED_MEDIA_SURFACE_TYPES.has(resolvedEncounter.surface_type)
      ? "missing governed media"
      : "unknown / requires follow-up"
  } else {
    base.live_deployed_route_result = hasRenderableMedia ? "renderable" : "unknown"
    if (base.failure_class === "unknown / requires follow-up" && hasRenderableMedia) {
      base.failure_class = "renderable"
    }
  }

  return base
}

async function main() {
  const liveConfig = await getLiveBundleConfig()
  const publicClient = createPublicClient(liveConfig)

  const matrix = []
  for (const key of TARGET_KEYS) {
    matrix.push(await inspectKey(key, publicClient, liveConfig))
  }

  const failingSurfaces = matrix.filter((row) => row.failure_class !== "renderable")

  const candidateResolutionTable = matrix.map((row) => ({
    registry_key_requested: row.registry_key_requested,
    candidates: row.candidate_resolution_table,
    resolved_encounter_key: row.resolved_encounter_key,
  }))

  const mediaRolePrecedenceTable = matrix.map((row) => ({
    registry_key_requested: row.registry_key_requested,
    surface_type: row.surface_type,
    governed_media_roles: row.governed_media_roles,
    fallback_media_roles: row.fallback_media_roles,
    primary_video_media_key: row.primary_video_media_key,
    primary_still_media_key: row.primary_still_media_key,
    primary_audio_media_key: row.primary_audio_media_key,
    media_retrieval_statuses: row.media_retrieval_statuses,
    failure_class: row.failure_class,
  }))

  const transitionTargetTable = matrix.map((row) => ({
    registry_key_requested: row.registry_key_requested,
    transition_targets: row.transition_targets,
  }))

  const patternSummary = {
    by_surface_type: summarizeCounts(matrix.map((row) => row.surface_type ?? "none")),
    by_failure_class: summarizeCounts(failingSurfaces.map((row) => row.failure_class)),
    by_renderer: summarizeCounts(matrix.map((row) => row.renderer?.layout ?? "none")),
    bundle: {
      assetPath: liveConfig.assetPath,
      htmlTitle: liveConfig.htmlTitle,
      r2BaseUrlPresent: Boolean(liveConfig.r2BaseUrl),
      bundleEncounterFallbackInspection: liveConfig.bundleEncounterFallbackInspection,
    },
    clustered_findings: [
      liveConfig.bundleEncounterFallbackInspection === "inconclusive_from_minified_bundle"
        ? "minified live bundle inspection is inconclusive for direct _encounter fallback verification"
        : null,
      failingSurfaces.some((row) => row.failure_class === "media URL retrieval failure")
        ? "media retrieval failures cluster across passage and fallback-driven surfaces"
        : null,
      failingSurfaces.some((row) => row.failure_class === "video/still fallback precedence failure")
        ? "some surfaces select failed video before available still fallback"
        : null,
      failingSurfaces.some((row) => row.surface_type === "passage")
        ? "passage surfaces are a concentrated failure family"
        : null,
    ].filter(Boolean),
  }

  const recommendedRepairOrder = []
  if (failingSurfaces.some((row) => row.surface_type === "passage")) {
    recommendedRepairOrder.push(
      "diagnose passage-family media retrieval and fallback selection for Harrumuk and gate/epithet passages",
    )
  }
  if (failingSurfaces.some((row) => row.failure_class === "media URL retrieval failure")) {
    recommendedRepairOrder.push(
      "audit failing media object URLs and provider/bucket mappings for the unresolved families",
    )
  }
  if (failingSurfaces.some((row) => row.failure_class === "video/still fallback precedence failure")) {
    recommendedRepairOrder.push(
      "repair video/still precedence so failed motion does not block valid still fallback",
    )
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationCount: 0,
    mutationPerformed: false,
    liveBundle: liveConfig,
    fullEncounterMatrix: matrix,
    exactFailingSurfaces: failingSurfaces.map((row) => ({
      registry_key_requested: row.registry_key_requested,
      failure_class: row.failure_class,
      live_deployed_route_result: row.live_deployed_route_result,
    })),
    candidateResolutionTable,
    mediaRolePrecedenceTable,
    transitionTargetTable,
    patternSummary,
    recommendedRepairOrder,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      liveAssetPath: liveConfig.assetPath,
      failingSurfaceCount: failingSurfaces.length,
      recommendedRepairOrder,
    }),
  )
}

function summarizeCounts(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] ?? 0) + 1
    return acc
  }, {})
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
