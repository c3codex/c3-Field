require("dotenv").config({ path: ".env" })
require("dotenv").config({ path: ".env.inanna", override: false })
require("dotenv").config({ path: ".env.local", override: false })
require("dotenv").config({ path: ".env.cloudflare", override: false })

const { existsSync, readFileSync, writeFileSync } = require("node:fs")
const { join } = require("node:path")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const evidencePath = "docs/oar/measures_registry/diagnose_measures_media_runtime_resolution_v1.json"
const oar2 = "oar2_diagnose_measures_media_runtime_resolution_v1"
const R2_BUCKETS = new Set(["measures-media"])

const activeSurfaceKeys = [
  "epigraph",
  "temple_antechamber",
  "chamber_epithets_01_primus_artus",
  "chamber_epithets_02_gemynd_corpus",
  "chamber_epithets_03_percipari",
  "gate_1_crown_removed",
  "gate_3_lapis_necklace",
]

const registryCampaignKey = "agents_of_chaos_integrity_governance"
const registryMediaRoles = [
  "epigraph_video",
  "hero_image",
  "explainer_video",
  "hero_video",
  "hero_poster",
  "path_choice_background",
  "registry_mark",
  "foundation_intro_video",
  "systems_intro_video",
  "c3_field_video",
  "hero_measured_image",
  "left_hero_fracture",
  "left_hero_fracture_motion",
  "right_measured_hero",
  "measured_hero_motion_graphic",
  "paragraph_agents_of_chaos",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function isR2Media(input) {
  const provider = input.storageProvider?.toLowerCase() ?? null
  return provider === "cloudflare_r2" || Boolean(input.bucketName && R2_BUCKETS.has(input.bucketName))
}

function resolveRuntimeMediaUrl(input) {
  if (input.publicUrl) return input.publicUrl
  if (!input.bucketName || !input.storagePath) return null

  if (isR2Media(input)) {
    const baseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""
    return baseUrl ? `${baseUrl}/${encodeObjectKey(trimSlashes(input.storagePath))}` : null
  }

  return supabase.storage.from(input.bucketName).getPublicUrl(input.storagePath).data.publicUrl
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, reason: "no resolved url" }

  try {
    const response = await fetch(url, { method: "GET" })
    return {
      tested: true,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    }
  } catch (error) {
    return { tested: true, ok: false, error: error.message }
  }
}

function registryMediaAsset(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

function classifyRenderDecision(row, retrieval) {
  if (!row.resolvedUrl) return "not rendered: resolver returned null"
  if (retrieval.tested && !retrieval.ok) return `not rendered: retrieval ${retrieval.status ?? "failed"}`
  return "renderable by URL and media_type"
}

async function registryLookup(registryKey) {
  return assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key, metadata")
      .eq("registry_key", registryKey)
      .maybeSingle(),
    `measures_registry ${registryKey}`,
  )
}

function metadataEncounterKey(metadata) {
  if (!metadata || typeof metadata !== "object") return null
  return metadata.encounter_key ?? metadata.encounterKey ?? metadata.encounter_def_key ?? metadata.encounterDefKey ?? null
}

async function encounterLookup(registryKey) {
  const registry = await registryLookup(registryKey)
  if (!registry) return null

  const encounterKeys = [...new Set([
    registry.registry_key,
    metadataEncounterKey(registry.metadata),
    `${registry.registry_key}_view`,
  ].filter(Boolean))]

  const encounters = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key, surface_type, metadata, measures_registry(registry_key)")
      .eq("registry_id", registry.id)
      .in("encounter_key", encounterKeys),
    `measures_encounter_def ${registryKey}`,
  ) ?? []

  const encounter = [...encounters].sort((left, right) => {
    return encounterKeys.indexOf(left.encounter_key) - encounterKeys.indexOf(right.encounter_key)
  })[0] ?? null

  return {
    registry,
    encounter,
    encounterCandidateKeys: encounterKeys,
    surfaceKeys: encounter ? [registry.registry_key, encounter.encounter_key] : [registry.registry_key],
  }
}

async function registryMediaRows(surfaceKeys) {
  return assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, storage_provider, public_url, poster_url, status, metadata)")
      .in("surface_key", surfaceKeys)
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    `measures_surface_media_map ${surfaceKeys.join(",")}`,
  ) ?? []
}

async function fallbackMediaRows(surfaceKeys) {
  return assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key, label, media_type, bucket_name, storage_path, render_order, is_active")
      .in("surface_key", surfaceKeys)
      .order("render_order", { ascending: true }),
    `temp_exhibition_media ${surfaceKeys.join(",")}`,
  ) ?? []
}

async function diagnoseSurface(registryKey) {
  const resolved = await encounterLookup(registryKey)
  if (!resolved?.encounter) {
    return { registryKey, resolved: false, failureReason: "encounter could not be resolved" }
  }

  const { encounter, surfaceKeys } = resolved
  const isChamberplate = encounter.surface_type === "chamberplate"
  const registryRows = isChamberplate ? await registryMediaRows(surfaceKeys) : []
  const tempRows = registryRows.length === 0 ? await fallbackMediaRows(surfaceKeys) : []

  const rows = registryRows.length > 0
    ? registryRows.map((row) => {
      const asset = registryMediaAsset(row)
      return {
        source: "measures_surface_media_map",
        surfaceKey: row.surface_key,
        requestedMediaKey: asset?.media_key ?? null,
        role: row.role,
        mediaType: asset?.media_type ?? null,
        storageProvider: asset?.storage_provider ?? null,
        bucketName: asset?.bucket ?? null,
        storagePath: asset?.storage_path ?? null,
        publicUrlPresent: Boolean(asset?.public_url),
        posterUrlPresent: Boolean(asset?.poster_url),
        status: row.status,
        assetStatus: asset?.status ?? null,
      }
    })
    : tempRows.filter((row) => row.is_active !== false).map((row) => ({
      source: "temp_exhibition_media",
      surfaceKey: row.surface_key,
      requestedMediaKey: null,
      role: row.media_type,
      mediaType: row.media_type,
      storageProvider: null,
      bucketName: row.bucket_name,
      storagePath: row.storage_path,
      publicUrlPresent: false,
      posterUrlPresent: false,
      status: row.is_active === false ? "inactive" : "active",
      assetStatus: null,
    }))

  const diagnosticRows = []
  for (const row of rows) {
    const resolvedUrl = resolveRuntimeMediaUrl(row)
    const retrieval = await retrievalStatus(resolvedUrl)
    diagnosticRows.push({
      ...row,
      resolvedUrl,
      retrieval,
      renderDecision: classifyRenderDecision({ ...row, resolvedUrl }, retrieval),
      failureReason: resolvedUrl
        ? retrieval.ok === false
          ? `resolved URL retrieval returned ${retrieval.status ?? "failure"}`
          : null
        : "provider resolver returned no URL",
    })
  }

  return {
    registryKey,
    resolved: true,
    encounterKey: encounter.encounter_key,
    surfaceType: encounter.surface_type,
    renderer: encounter.metadata?.renderer ?? null,
    playback: encounter.metadata?.playback ?? null,
    encounterCandidateKeys: resolved.encounterCandidateKeys,
    queryPath: isChamberplate && registryRows.length > 0
      ? "measures_surface_media_map joined to codex_media_asset"
      : "temp_exhibition_media fallback",
    queryFilters: isChamberplate && registryRows.length > 0
      ? { surface_key: surfaceKeys, map_status: "active", order: "sequence_index asc" }
      : { surface_key: surfaceKeys, order: "render_order asc", client_filters: "is_active !== false" },
    registryMediaReturnedRowCount: registryRows.length,
    tempMediaReturnedRowCount: tempRows.length,
    diagnosticRows,
  }
}

async function diagnoseMeasuresRegistryMedia() {
  const rows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, sort_order")
      .eq("campaign_key", registryCampaignKey)
      .in("media_role", registryMediaRoles)
      .order("sort_order", { ascending: true }),
    "measures_media_map registry media",
  ) ?? []

  const diagnostics = []
  for (const row of rows) {
    const input = {
      bucketName: row.storage_bucket,
      storagePath: row.storage_path,
      storageProvider: null,
      publicUrl: null,
    }
    const resolvedUrl = resolveRuntimeMediaUrl(input)
    const retrieval = await retrievalStatus(resolvedUrl)
    diagnostics.push({
      source: "measures_media_map",
      campaignKey: registryCampaignKey,
      mediaRole: row.media_role,
      mediaType: row.mime_type?.startsWith("video/") ? "video" : row.mime_type?.startsWith("image/") ? "image" : row.mime_type,
      storageProvider: null,
      bucketName: row.storage_bucket,
      storagePath: row.storage_path,
      isActive: row.is_active,
      resolvedUrl,
      retrieval,
      renderDecision: classifyRenderDecision({ resolvedUrl }, retrieval),
      failureReason: resolvedUrl
        ? retrieval.ok === false
          ? `resolved URL retrieval returned ${retrieval.status ?? "failure"}`
          : null
        : "provider resolver returned no URL",
    })
  }

  const missingRoles = registryMediaRoles.filter((role) => !rows.some((row) => row.media_role === role))

  return {
    route: "MeasuresRegistryRuntime.tsx",
    queryPath: "measures_media_map",
    queryFilters: {
      campaign_key: registryCampaignKey,
      media_role: registryMediaRoles,
      order: "sort_order asc",
      client_filters: "is_active !== false",
    },
    returnedRowCount: rows.length,
    missingRoles,
    diagnostics,
  }
}

function buildMarkers() {
  const files = [
    "dist-inanna",
    "dist-registry",
  ]

  return files.map((dir) => {
    const root = join(process.cwd(), dir, "assets")
    if (!existsSync(root)) return { artifact: dir, exists: false }

    const markerText = require("node:fs")
      .readdirSync(root)
      .filter((file) => file.endsWith(".js"))
      .map((file) => readFileSync(join(root, file), "utf8"))
      .join("\n")

    return {
      artifact: dir,
      exists: true,
      publishableKeyMarkerPresent: markerText.includes("sb_publishable"),
      r2PublicBaseMarkerPresent: markerText.includes("media.c3field.online"),
      supabaseUrlMarkerPresent: markerText.includes("zfihrspxvennjzazxcbj.supabase.co"),
    }
  })
}

async function main() {
  const surfaces = []
  for (const key of activeSurfaceKeys) surfaces.push(await diagnoseSurface(key))
  const measuresRegistryMedia = await diagnoseMeasuresRegistryMedia()

  const diagnosticRows = surfaces.flatMap((surface) =>
    (surface.diagnosticRows ?? []).map((row) => ({
      surface: surface.registryKey,
      encounter: surface.encounterKey,
      surfaceType: surface.surfaceType,
      requestedMediaKey: row.requestedMediaKey,
      role: row.role,
      dbRowFound: true,
      provider: row.storageProvider,
      bucketPath: `${row.bucketName}/${row.storagePath}`,
      resolvedUrl: row.resolvedUrl,
      retrievalStatus: row.retrieval.status ?? null,
      rendered: row.renderDecision === "renderable by URL and media_type",
      failureReason: row.failureReason,
    })),
  )

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationPerformed: false,
    activeRuntimeSurface: {
      app: "Measures of Inanna",
      route: "Temple.tsx",
      entryRegistryKey: "epigraph",
      componentPath: "src/measures_of_inanna/Temple.tsx -> GenericEncounter.tsx -> EncounterStageMedia.tsx",
    },
    resolverContract: {
      supabase: "storage_provider != cloudflare_r2 and bucket != measures-media resolves through Supabase Storage public URL",
      cloudflareR2: "storage_provider = cloudflare_r2 or bucket = measures-media resolves through VITE_R2_PUBLIC_BASE_URL plus encoded storage_path",
      componentHardcodedPaths: false,
    },
    buildMarkers: buildMarkers(),
    measuresRegistryMedia,
    surfaces,
    diagnosticRows,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({
    evidencePath,
    mutationPerformed: evidence.mutationPerformed,
    surfaces: surfaces.map((surface) => ({
      registryKey: surface.registryKey,
      encounterKey: surface.encounterKey,
      surfaceType: surface.surfaceType,
      queryPath: surface.queryPath,
      rowCount: surface.diagnosticRows?.length ?? 0,
      failedRows: surface.diagnosticRows?.filter((row) => row.failureReason).length ?? 0,
    })),
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
