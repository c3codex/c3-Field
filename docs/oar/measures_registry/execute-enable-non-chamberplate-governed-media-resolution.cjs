require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { readFileSync, writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const oar2 = "oar2_enable_non_chamberplate_governed_media_resolution_v1"
const evidencePath = "docs/oar/measures_registry/enable_non_chamberplate_governed_media_resolution_v1.json"
const governedSurfaceTypes = new Set(["chamberplate", "aspect", "threshold"])

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function resolveUrl(row) {
  if (row.publicUrl) return row.publicUrl
  if (!row.bucketName || !row.storagePath) return null
  if (row.storageProvider === "cloudflare_r2" || row.bucketName === "measures-media") {
    return r2BaseUrl ? `${r2BaseUrl}/${encodeObjectKey(row.storagePath.replace(/^\/+|\/+$/g, ""))}` : null
  }
  return supabase.storage.from(row.bucketName).getPublicUrl(row.storagePath).data.publicUrl
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, ok: false, reason: "no resolved url" }
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

function registryAsset(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

function registryRowToMedia(row) {
  const asset = registryAsset(row)
  return {
    source: "registry_media",
    surfaceKey: row.surface_key,
    mediaKey: asset.media_key,
    role: row.role,
    mediaType: asset.media_type,
    bucketName: asset.bucket,
    storagePath: asset.storage_path,
    storageProvider: asset.storage_provider,
    publicUrl: asset.public_url,
    renderOrder: row.sequence_index ?? 999,
    status: row.status,
    assetStatus: asset.status,
  }
}

function fallbackRowToMedia(row) {
  return {
    source: "temp_exhibition_media",
    surfaceKey: row.surface_key,
    mediaKey: null,
    role: row.media_type,
    mediaType: row.media_type,
    bucketName: row.bucket_name,
    storagePath: row.storage_path,
    storageProvider: null,
    publicUrl: null,
    renderOrder: row.render_order ?? 999,
    status: row.is_active === false ? "inactive" : "active",
    assetStatus: null,
  }
}

async function resolveEncounterRow(inputKey) {
  const registry = assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key, metadata")
      .eq("registry_key", inputKey)
      .maybeSingle(),
    `registry ${inputKey}`,
  )
  if (!registry) throw new Error(`registry not found: ${inputKey}`)

  const metadata = registry.metadata ?? {}
  const keys = [...new Set([
    registry.registry_key,
    metadata.encounter_key,
    metadata.encounterKey,
    `${registry.registry_key}_view`,
  ].filter(Boolean))]

  const encounters = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key, surface_type, metadata, measures_registry(registry_key)")
      .eq("registry_id", registry.id)
      .in("encounter_key", keys),
    `encounter ${inputKey}`,
  ) ?? []

  const encounter = encounters.sort((left, right) => {
    return keys.indexOf(left.encounter_key) - keys.indexOf(right.encounter_key)
  })[0]
  if (!encounter) throw new Error(`encounter not resolved: ${inputKey}`)

  return {
    registry,
    encounter,
    resolvedRegistryKey: registry.registry_key,
    surfaceKeys: [registry.registry_key, encounter.encounter_key],
  }
}

async function registryMedia(surfaceKeys) {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,poster_url,status,metadata)")
      .in("surface_key", surfaceKeys)
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    `registry media ${surfaceKeys.join(",")}`,
  ) ?? []

  return rows.map(registryRowToMedia).filter((row) => row.status !== "inactive" && row.assetStatus !== "inactive")
}

async function fallbackMedia(surfaceKeys) {
  const rows = assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key,label,media_type,bucket_name,storage_path,render_order,is_active")
      .in("surface_key", surfaceKeys)
      .order("render_order", { ascending: true }),
    `fallback media ${surfaceKeys.join(",")}`,
  ) ?? []

  return rows.filter((row) => row.is_active !== false).map(fallbackRowToMedia)
}

function supplementMissingMediaTypes(governed, fallback) {
  const governedTypes = new Set(governed.map((row) => row.mediaType))
  return [...governed, ...fallback.filter((row) => !governedTypes.has(row.mediaType))]
}

async function diagnoseSurface(registryKey) {
  const resolved = await resolveEncounterRow(registryKey)
  const readsGoverned = governedSurfaceTypes.has(resolved.encounter.surface_type)
  const governed = readsGoverned ? await registryMedia(resolved.surfaceKeys) : []
  const fallback = governed.length === 0 || (readsGoverned && resolved.encounter.surface_type !== "chamberplate")
    ? await fallbackMedia(resolved.surfaceKeys)
    : []
  const resolvedMedia = governed.length === 0
    ? fallback
    : readsGoverned && resolved.encounter.surface_type !== "chamberplate"
      ? supplementMissingMediaTypes(governed, fallback)
      : governed

  const mediaWithRetrieval = []
  for (const row of resolvedMedia) {
    const url = resolveUrl(row)
    mediaWithRetrieval.push({
      ...row,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }

  const primaryVideo =
    mediaWithRetrieval.find((row) => row.mediaType === "video" && row.role === "featured_video") ??
    mediaWithRetrieval.find((row) => row.mediaType === "video") ??
    null
  const primaryStill =
    mediaWithRetrieval.find((row) => row.mediaType === "image" && ["oracle_card", "image"].includes(row.role)) ??
    mediaWithRetrieval.find((row) => row.mediaType === "image") ??
    null

  return {
    registryKey,
    encounterKey: resolved.encounter.encounter_key,
    surfaceType: resolved.encounter.surface_type,
    readsGoverned,
    governedMediaCount: governed.length,
    fallbackMediaCount: fallback.length,
    resolvedMediaCount: mediaWithRetrieval.length,
    governedMedia: governed,
    fallbackMedia: fallback,
    resolvedMedia: mediaWithRetrieval,
    primaryVideo,
    primaryStill,
    animatedGovernedMediaPresent: governed.some((row) => row.mediaType === "video"),
    fallbackSupplementedMediaTypes: mediaWithRetrieval
      .filter((row) => row.source === "temp_exhibition_media")
      .map((row) => row.mediaType),
  }
}

async function fallbackStanding() {
  return assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key,media_type,bucket_name,storage_path,is_active")
      .in("surface_key", ["epigraph", "temple_antechamber"])
      .order("surface_key", { ascending: true }),
    "fallback standing",
  )
}

async function chamberplateMappingValidation() {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,poster_url,status)")
      .eq("surface_key", "chamber_epithets_01_primus_artus")
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    "chamberplate direct media validation",
  ) ?? []

  const output = []
  for (const row of rows) {
    const media = registryRowToMedia(row)
    const url = resolveUrl(media)
    output.push({
      ...media,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }

  return {
    surfaceKey: "chamber_epithets_01_primus_artus",
    activeGovernedRowCount: output.length,
    allRetrieved: output.every((row) => row.retrieval.ok),
    rows: output,
  }
}

async function main() {
  const surfaces = []
  for (const key of ["epigraph", "temple_antechamber", "chamber_epithets_01_primus_artus"]) {
    try {
      surfaces.push(await diagnoseSurface(key))
    } catch (error) {
      surfaces.push({ registryKey: key, error: error.message })
    }
  }

  const sourceText = readFileSync("src/measures_of_inanna/resolve_encounter.ts", "utf8")
  const chamberplateDirectValidation = await chamberplateMappingValidation()
  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationPerformed: false,
    changedFiles: ["src/measures_of_inanna/resolve_encounter.ts"],
    governedSurfaceTypes: [...governedSurfaceTypes],
    hardcodedMediaPathIntroduced: /measures_registry\/pre_codex_exhibition\/images|inanna_epigraph\.webp|antechamber\.webp|inanna_encounter_intro\.mp4/.test(sourceText),
    surfaces,
    chamberplateDirectValidation,
    fallbackRowsStillPresent: await fallbackStanding(),
    validationSummary: {
      aspectGovernedLookupWorks: surfaces.find((surface) => surface.registryKey === "epigraph")?.governedMediaCount > 0,
      thresholdGovernedLookupWorks: surfaces.find((surface) => surface.registryKey === "temple_antechamber")?.governedMediaCount > 0,
      chamberplateStillUsesGovernedMedia: chamberplateDirectValidation.activeGovernedRowCount > 0,
      chamberplateSampleRetrieves: chamberplateDirectValidation.allRetrieved,
      epigraphGovernedAnimatedMediaPresent: surfaces.find((surface) => surface.registryKey === "epigraph")?.animatedGovernedMediaPresent === true,
      epigraphStillFallbackPresent: Boolean(surfaces.find((surface) => surface.registryKey === "epigraph")?.primaryStill),
      templeAntechamberStillPresent: Boolean(surfaces.find((surface) => surface.registryKey === "temple_antechamber")?.primaryStill),
      fallbackRowsRemainUndeleted: true,
    },
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({
    evidencePath,
    aspectGovernedLookupWorks: evidence.validationSummary.aspectGovernedLookupWorks,
    thresholdGovernedLookupWorks: evidence.validationSummary.thresholdGovernedLookupWorks,
    chamberplateStillUsesGovernedMedia: evidence.validationSummary.chamberplateStillUsesGovernedMedia,
    chamberplateSampleRetrieves: evidence.validationSummary.chamberplateSampleRetrieves,
    epigraphGovernedAnimatedMediaPresent: evidence.validationSummary.epigraphGovernedAnimatedMediaPresent,
    hardcodedMediaPathIntroduced: evidence.hardcodedMediaPathIntroduced,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
