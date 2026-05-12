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
const targetBucket = "measures-media"
const targetProvider = "cloudflare_r2"
const manifestPath = "docs/_source/working/media/l2_bucket_manifest_v1.txt"
const evidencePath = "docs/oar/measures_of_inanna/migrate_pre_codex_exhibition_media_to_l2_v1.json"
const migrationOar2 = "oar2_migrate_pre_codex_exhibition_media_to_l2_v1"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
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

async function main() {
  const manifestKeys = readManifestObjectKeys()
  if (!manifestKeys) throw new Error(`L2 manifest not found: ${manifestPath}`)
  const manifestSet = new Set(manifestKeys)

  const sourceRows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .eq("bucket", sourceBucket)
      .order("media_key", { ascending: true }),
    "source row query failed",
  ) ?? []

  const matchedRows = sourceRows.filter((row) => manifestSet.has(row.storage_path))
  const unmatchedRows = sourceRows.filter((row) => !manifestSet.has(row.storage_path))

  const migratedRows = []
  for (const row of matchedRows) {
    const nextMetadata = {
      ...(row.metadata ?? {}),
      previous_bucket: row.bucket,
      migration_oar2: migrationOar2,
      migration_reason: "unify_inanna_r2_runtime_delivery",
    }

    assertOk(
      await supabase
        .from("codex_media_asset")
        .update({
          bucket: targetBucket,
          storage_provider: row.storage_provider ?? targetProvider,
          metadata: nextMetadata,
        })
        .eq("media_key", row.media_key)
        .eq("bucket", sourceBucket),
      `migration failed for ${row.media_key}`,
    )

    migratedRows.push({
      media_key: row.media_key,
      title: row.title,
      media_type: row.media_type,
      previous_bucket: row.bucket,
      new_bucket: targetBucket,
      storage_provider: row.storage_provider ?? targetProvider,
      storage_path: row.storage_path,
      status: row.status,
    })
  }

  const bucketCounts = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("bucket,storage_provider"),
    "bucket count query failed",
  ) ?? []

  const routedRowsAfter = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .in("media_key", sourceRows.map((row) => row.media_key))
      .order("media_key", { ascending: true }),
    "routed rows after query failed",
  ) ?? []

  const evidence = {
    sourceBucket,
    targetBucket,
    sourcePreCodexRowCount: sourceRows.length,
    l2ManifestFound: true,
    l2ManifestPath: manifestPath,
    l2ManifestObjectCount: manifestKeys.length,
    exactMatchedRowsCount: matchedRows.length,
    migratedRows,
    unmatchedRows: unmatchedRows.map((row) => ({
      media_key: row.media_key,
      title: row.title,
      media_type: row.media_type,
      bucket: row.bucket,
      storage_provider: row.storage_provider,
      storage_path: row.storage_path,
      status: row.status,
      reason: "no exact L2 manifest object-key match",
    })),
    bucketCountAfterMigration: Object.values(
      bucketCounts.reduce((acc, row) => {
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
  }

  fs.mkdirSync(path.dirname(evidencePath), { recursive: true })
  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)

  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
