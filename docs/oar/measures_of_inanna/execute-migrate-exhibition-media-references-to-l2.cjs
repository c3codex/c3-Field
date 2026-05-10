require("dotenv").config({ path: ".env.inanna" })
require("dotenv").config({ path: ".env.local", override: false })

const { readFileSync, writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const manifestPath = "docs/_source/working/media/l2_bucket_manifest_v1.txt"
const evidencePath = "docs/oar/measures_of_inanna/migrate_exhibition_media_references_to_l2_v1.json"
const migrationOar = "oar2_migrate_exhibition_media_references_to_l2_v1"
const l2Bucket = "measures-media"

function parseManifest(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const rows = []

  for (let index = 0; index < lines.length;) {
    const object_path = lines[index]
    const media_type = lines[index + 1]
    if (!object_path || !media_type?.includes("/")) {
      index += 1
      continue
    }
    const storage_class = lines[index + 2] ?? null
    const size = lines[index + 3] ?? null
    const date = lines[index + 4] ?? null
    const timezone = /^[A-Z]{2,5}$/.test(lines[index + 5] ?? "") ? lines[index + 5] : null
    rows.push({
      object_path,
      media_type,
      storage_class,
      size,
      updated_at: [date, timezone].filter(Boolean).join(" "),
    })
    index += timezone ? 6 : 5
  }

  return rows
}

function extension(path) {
  const match = path.toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : ""
}

function normalizeBase(path) {
  return path
    .split(/[\\/]/)
    .pop()
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function mediaFamilyFromMime(mime, path) {
  if (mime.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(path)) return "video"
  if (mime.startsWith("audio/") || /\.(mp3|wav|m4a|aac|ogg)$/i.test(path)) return "audio"
  if (mime.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(path)) return "image"
  return "other"
}

function assetFamily(asset) {
  return asset.media_type
}

function buildManifestIndex(rows) {
  return {
    exact: new Map(rows.map((row) => [row.object_path.toLowerCase(), row])),
    normalized: new Map(rows.map((row) => [`${normalizeBase(row.object_path)}:${extension(row.object_path)}`, row])),
    base: new Map(rows.map((row) => [normalizeBase(row.object_path), row])),
  }
}

function matchAsset(asset, manifestIndex) {
  const current = asset.storage_path
  const exact = manifestIndex.exact.get(current.toLowerCase())
  if (exact && mediaFamilyFromMime(exact.media_type, exact.object_path) === assetFamily(asset)) {
    return { row: exact, strategy: "exact_filename_match" }
  }

  const normalized = manifestIndex.normalized.get(`${normalizeBase(current)}:${extension(current)}`)
  if (normalized && mediaFamilyFromMime(normalized.media_type, normalized.object_path) === assetFamily(asset)) {
    return { row: normalized, strategy: "normalized_filename_match" }
  }

  const sameBase = manifestIndex.base.get(normalizeBase(current))
  if (sameBase && mediaFamilyFromMime(sameBase.media_type, sameBase.object_path) === assetFamily(asset)) {
    return { row: sameBase, strategy: "extension_aware_match" }
  }

  return { row: null, strategy: null }
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const storageRows = await assertOk(
    await supabase
      .from("media_storage_registry")
      .select("storage_key,bucket,status,provider,scope,metadata")
      .eq("storage_key", "l2_shared_media")
      .eq("bucket", l2Bucket)
      .eq("status", "active"),
    "L2 storage row lookup failed",
  )
  if (storageRows.length === 0) throw new Error("active l2_shared_media storage row missing")

  const manifestRows = parseManifest(readFileSync(manifestPath, "utf8"))
  const manifestIndex = buildManifestIndex(manifestRows)

  const assets = await assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,storage_provider,bucket,storage_path,status,legacy_key,material_key,metadata")
      .neq("bucket", l2Bucket),
    "codex media asset lookup failed",
  )

  const matched = []
  const unmatched = []

  for (const asset of assets) {
    const { row, strategy } = matchAsset(asset, manifestIndex)
    if (!row) {
      unmatched.push({
        table: "codex_media_asset",
        media_key: asset.media_key,
        bucket: asset.bucket,
        storage_path: asset.storage_path,
        media_type: asset.media_type,
        reason: "no deterministic L2 manifest match",
      })
      continue
    }

    matched.push({ asset, manifestRow: row, strategy })
  }

  for (const item of matched) {
    const asset = item.asset
    await assertOk(
      await supabase
        .from("codex_media_asset")
        .update({
          bucket: l2Bucket,
          storage_provider: "cloudflare_r2",
          storage_path: item.manifestRow.object_path,
          metadata: {
            ...(asset.metadata ?? {}),
            migrated_to_storage_key: "l2_shared_media",
            previous_bucket: asset.bucket,
            previous_storage_path: asset.storage_path,
            migration_source_manifest: manifestPath,
            migration_oar: migrationOar,
            migration_match_strategy: item.strategy,
            legacy_reference_preserved: true,
          },
        })
        .eq("media_key", asset.media_key),
      `codex media asset migration failed for ${asset.media_key}`,
    )
  }

  const surfaceRows = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key,role,sequence_index,status,media_key")
      .order("surface_key", { ascending: true }),
    "surface media map validation failed",
  )
  const tempRows = await assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("display_context,surface_type,surface_key,bucket_name,storage_path,is_active")
      .eq("display_context", "measures_of_inanna"),
    "temp exhibition media validation failed",
  )
  const migratedRows = await assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .eq("bucket", l2Bucket)
      .eq("storage_provider", "cloudflare_r2")
      .order("media_key", { ascending: true }),
    "migrated media validation failed",
  )
  const chamberplateRows = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, media_type, bucket, storage_path, metadata)")
      .in("surface_key", [
        "chamber_epithets_01_primus_artus",
        "chamber_epithets_02_gemynd_corpus",
        "chamber_epithets_03_percipari",
      ])
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true })
      .order("role", { ascending: true }),
    "chamberplate validation failed",
  )

  const evidence = {
    l2StorageRowFound: true,
    l2ManifestFound: true,
    l2ManifestObjectCount: manifestRows.length,
    codexMediaAssetRowsMigratedCount: matched.length,
    migratedMediaKeys: matched.map((item) => ({
      media_key: item.asset.media_key,
      previous_bucket: item.asset.bucket,
      previous_storage_path: item.asset.storage_path,
      new_bucket: l2Bucket,
      new_storage_path: item.manifestRow.object_path,
      match_strategy: item.strategy,
    })),
    measuresSurfaceMediaMapRowsPreservedCount: surfaceRows.length,
    tempExhibitionMediaRowsUnchangedCount: tempRows.length,
    tempExhibitionMediaLegacyMarkedCount: 0,
    chamberplateFeaturedVideosSeatedCount: chamberplateRows.filter(
      (row) => row.status === "active" && row.role === "featured_video",
    ).length,
    chamberplateTonesSeatedCount: chamberplateRows.filter(
      (row) => row.status === "active" && ["lapis_tone", "material_tone"].includes(row.role),
    ).length,
    unmatchedMediaRows: unmatched,
    validationQueryOutput: migratedRows,
    chamberplateValidationQueryOutput: chamberplateRows.map((row) => {
      const asset = Array.isArray(row.codex_media_asset)
        ? row.codex_media_asset[0]
        : row.codex_media_asset
      return {
        surface_key: row.surface_key,
        sequence_index: row.sequence_index,
        role: row.role,
        status: row.status,
        media_key: asset.media_key,
        media_type: asset.media_type,
        bucket: asset.bucket,
        storage_path: asset.storage_path,
        map_metadata: row.metadata,
        asset_metadata: asset.metadata,
      }
    }),
    mappingsMutated: false,
    tempExhibitionMediaMutated: false,
    frontendMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
