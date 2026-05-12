const fs = require("fs")
const path = require("path")
const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config({ path: ".env" })

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, serviceRoleKey)
const sourceBucket = "pre-codex-exhibition"
const supabaseImageBucket = "measures-registry"
const r2HeavyBucket = "measures-media"
const sourceProvider = "cloudflare_r2"
const supabaseProvider = "supabase"
const r2Provider = "cloudflare_r2"
const manifestPath = "docs/_source/working/media/l2_bucket_manifest_v1.txt"
const evidencePath = "docs/oar/measures_of_inanna/reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1.json"
const migrationOar2 = "oar2_reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1"

const imageExtensions = new Set(["png", "webp", "jpeg", "jpg"])
const heavyExtensions = new Set(["mp4", "mov", "mp3", "wav"])

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function extensionFor(storagePath) {
  return String(storagePath).split(".").pop().toLowerCase()
}

function rowClass(row) {
  const extension = extensionFor(row.storage_path)
  if (imageExtensions.has(extension)) return "image"
  if (heavyExtensions.has(extension)) return "heavy"
  return "unknown"
}

function readManifestObjectKeys() {
  const absolute = path.resolve(manifestPath)
  if (!fs.existsSync(absolute)) return null

  const lines = fs.readFileSync(absolute, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const keys = []
  for (let index = 0; index < lines.length; index += 6) {
    if (lines[index]) keys.push(lines[index])
  }

  return keys
}

async function listSupabaseRootObjectNames() {
  const data = assertOk(
    await supabase.storage.from(supabaseImageBucket).list("", { limit: 1000 }),
    `${supabaseImageBucket} object list failed`,
  )

  return new Set((data ?? []).map((object) => object.name))
}

function withMigrationMetadata(row, targetBucket, targetProvider, reason) {
  return {
    ...(row.metadata ?? {}),
    previous_bucket: row.bucket,
    previous_storage_provider: row.storage_provider ?? sourceProvider,
    migration_oar2: migrationOar2,
    migration_reason: reason,
    reconciled_to_bucket: targetBucket,
    reconciled_storage_provider: targetProvider,
  }
}

async function migrateRow(row, targetBucket, targetProvider, reason) {
  assertOk(
    await supabase
      .from("codex_media_asset")
      .update({
        bucket: targetBucket,
        storage_provider: targetProvider,
        metadata: withMigrationMetadata(row, targetBucket, targetProvider, reason),
      })
      .eq("media_key", row.media_key)
      .eq("bucket", sourceBucket),
    `migration failed for ${row.media_key}`,
  )

  return {
    media_key: row.media_key,
    title: row.title,
    media_type: row.media_type,
    storage_classification: rowClass(row),
    previous_bucket: row.bucket,
    previous_storage_provider: row.storage_provider,
    new_bucket: targetBucket,
    new_storage_provider: targetProvider,
    storage_path: row.storage_path,
    status: row.status,
  }
}

async function main() {
  const manifestKeys = readManifestObjectKeys()
  if (!manifestKeys) throw new Error(`L2 manifest not found: ${manifestPath}`)
  const r2ObjectSet = new Set(manifestKeys)
  const supabaseObjectSet = await listSupabaseRootObjectNames()

  const sourceRows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .eq("bucket", sourceBucket)
      .order("media_key", { ascending: true }),
    "source row query failed",
  ) ?? []

  const imageRows = sourceRows.filter((row) => rowClass(row) === "image")
  const heavyRows = sourceRows.filter((row) => rowClass(row) === "heavy")
  const unknownRows = sourceRows.filter((row) => rowClass(row) === "unknown")

  const supabaseMatchedImageRows = imageRows.filter((row) => supabaseObjectSet.has(row.storage_path))
  const r2MatchedHeavyRows = heavyRows.filter((row) => r2ObjectSet.has(row.storage_path))

  const repointedRows = []
  for (const row of supabaseMatchedImageRows) {
    repointedRows.push(await migrateRow(
      row,
      supabaseImageBucket,
      supabaseProvider,
      "restore_supabase_image_delivery_for_inanna",
    ))
  }

  for (const row of r2MatchedHeavyRows) {
    repointedRows.push(await migrateRow(
      row,
      r2HeavyBucket,
      r2Provider,
      "restore_heavy_runtime_delivery_for_inanna",
    ))
  }

  const allCodexRows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("bucket,storage_provider"),
    "bucket/provider count query failed",
  ) ?? []

  const routedRowsAfter = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .in("media_key", sourceRows.map((row) => row.media_key))
      .order("media_key", { ascending: true }),
    "routed rows after query failed",
  ) ?? []

  const unmatchedRows = [
    ...imageRows
      .filter((row) => !supabaseObjectSet.has(row.storage_path))
      .map((row) => ({
        media_key: row.media_key,
        title: row.title,
        media_type: row.media_type,
        storage_classification: "image",
        bucket: row.bucket,
        storage_provider: row.storage_provider,
        storage_path: row.storage_path,
        status: row.status,
        reason: `exact object not found in Supabase bucket ${supabaseImageBucket}`,
      })),
    ...heavyRows
      .filter((row) => !r2ObjectSet.has(row.storage_path))
      .map((row) => ({
        media_key: row.media_key,
        title: row.title,
        media_type: row.media_type,
        storage_classification: "heavy",
        bucket: row.bucket,
        storage_provider: row.storage_provider,
        storage_path: row.storage_path,
        status: row.status,
        reason: `exact object not found in R2 bucket ${r2HeavyBucket}`,
      })),
    ...unknownRows.map((row) => ({
      media_key: row.media_key,
      title: row.title,
      media_type: row.media_type,
      storage_classification: "unknown",
      bucket: row.bucket,
      storage_provider: row.storage_provider,
      storage_path: row.storage_path,
      status: row.status,
      reason: "unsupported storage extension for this OAR2",
    })),
  ].sort((left, right) => left.media_key.localeCompare(right.media_key))

  const evidence = {
    sourceBucket,
    sourcePreCodexRowCount: sourceRows.length,
    imageRowsCount: imageRows.length,
    heavyMediaRowsCount: heavyRows.length,
    unknownRowsCount: unknownRows.length,
    supabaseImageBucket,
    supabaseObjectMatchesCount: supabaseMatchedImageRows.length,
    supabaseObjectMatches: supabaseMatchedImageRows.map((row) => ({
      media_key: row.media_key,
      storage_path: row.storage_path,
    })),
    r2HeavyBucket,
    r2ManifestFound: true,
    r2ManifestPath: manifestPath,
    r2ManifestObjectCount: manifestKeys.length,
    r2ObjectMatchesCount: r2MatchedHeavyRows.length,
    r2ObjectMatches: r2MatchedHeavyRows.map((row) => ({
      media_key: row.media_key,
      storage_path: row.storage_path,
    })),
    repointedRows,
    unmatchedRows,
    bucketProviderCountAfterReconciliation: Object.values(
      allCodexRows.reduce((acc, row) => {
        const key = `${row.bucket}||${row.storage_provider}`
        acc[key] ??= {
          bucket: row.bucket,
          storage_provider: row.storage_provider,
          count: 0,
        }
        acc[key].count += 1
        return acc
      }, {}),
    ).sort((left, right) => `${left.bucket}:${left.storage_provider}`.localeCompare(`${right.bucket}:${right.storage_provider}`)),
    routedRowsAfter,
    surfaceMappingsMutated: false,
    frontendMutationPerformed: false,
    mediaResolverMutated: false,
    supersededL2OnlyMigrationRun: false,
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
