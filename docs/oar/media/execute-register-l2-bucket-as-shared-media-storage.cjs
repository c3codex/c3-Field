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
const evidencePath = "docs/oar/media/register_l2_bucket_as_shared_media_storage_v1.json"

const ddl = `
create extension if not exists pgcrypto;

create table if not exists public.media_storage_registry (
  id uuid primary key default gen_random_uuid(),
  storage_key text not null unique,
  provider text not null,
  bucket text not null,
  status text not null default 'active',
  scope text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.media_storage_registry to anon, authenticated;
create index if not exists media_storage_registry_status_idx on public.media_storage_registry(status, scope);
`

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

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function withSchemaRetry(operation, label) {
  let lastError = null

  for (let attempt = 1; attempt <= 8; attempt += 1) {
    const result = await operation()
    if (!result.error) return result.data
    lastError = result.error
    if (!/schema cache|Could not find|does not exist/i.test(result.error.message)) break
    await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")
    await sleep(1000)
  }

  throw new Error(`${label}: ${lastError?.message ?? "unknown error"}`)
}

function summarizeBucketRows(rows, bucketField) {
  const grouped = new Map()
  for (const row of rows) {
    const bucket = row[bucketField] ?? "(null)"
    grouped.set(bucket, (grouped.get(bucket) ?? 0) + 1)
  }
  return Object.fromEntries([...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)))
}

async function main() {
  const manifestRows = parseManifest(readFileSync(manifestPath, "utf8"))

  const beforeSchema = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  }).then((response) => response.json())
  const definitions = beforeSchema.definitions ?? beforeSchema.components?.schemas ?? {}
  const storageRegistryExistedBefore = Boolean(definitions.media_storage_registry)

  await execSql(ddl, "media storage registry DDL failed")
  await execSql("notify pgrst, 'reload schema';", "PostgREST schema reload failed")

  const storagePayload = {
    storage_key: "l2_shared_media",
    provider: "cloudflare_r2",
    bucket: "measures-media",
    status: "active",
    scope: "shared_runtime_media",
    metadata: {
      contains: ["mp3", "mp4", "mov", "wav"],
      used_by: ["measures_of_inanna", "measures_registry"],
      manifest: manifestPath,
      manifest_object_count: manifestRows.length,
      frontend_hardcode_allowed: false,
    },
  }

  await withSchemaRetry(
    () => supabase.from("media_storage_registry").upsert(storagePayload, { onConflict: "storage_key" }),
    "L2 storage registry upsert failed",
  )

  const activeL2Rows = await withSchemaRetry(
    () => supabase
      .from("media_storage_registry")
      .select("storage_key,provider,bucket,status,scope,metadata,created_at,updated_at")
      .eq("storage_key", "l2_shared_media"),
    "L2 storage registry validation failed",
  )

  const codexRows = await assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,media_type,storage_provider,bucket,storage_path,status,legacy_key,metadata")
      .neq("bucket", "measures-media"),
    "codex media asset inspection failed",
  )
  const surfaceRows = await assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key,role,status,codex_media_asset!inner(media_key,bucket,storage_provider,storage_path,status)")
      .neq("codex_media_asset.bucket", "measures-media"),
    "surface media map inspection failed",
  )
  const tempRows = await assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("display_context,surface_type,surface_key,bucket_name,storage_path,is_active")
      .neq("bucket_name", "measures-media"),
    "temp exhibition media inspection failed",
  )
  const registryRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("registry_key,encounter_key,campaign_key,media_role,storage_bucket,storage_path,is_active")
      .neq("storage_bucket", "measures-media"),
    "measures registry media map inspection failed",
  )
  const dispatchRows = await assertOk(
    await supabase
      .from("measures_publication_dispatch")
      .select("publication_key,dispatch_key,media_manifest,status"),
    "publication dispatch media manifest inspection failed",
  )

  const publicationDispatchesWithMedia = dispatchRows.filter(
    (row) => row.media_manifest && Object.keys(row.media_manifest).length > 0,
  )

  const evidence = {
    manifestFound: true,
    manifestPath,
    l2ObjectCountFromManifest: manifestRows.length,
    storageRegistrySurface: storageRegistryExistedBefore ? "reused" : "created",
    activeL2StorageRegistryRow: activeL2Rows[0] ?? null,
    observedPriorBucketsStorageProviders: {
      codex_media_asset: {
        buckets: summarizeBucketRows(codexRows, "bucket"),
        storageProviders: summarizeBucketRows(codexRows, "storage_provider"),
      },
      temp_exhibition_media: {
        buckets: summarizeBucketRows(tempRows, "bucket_name"),
      },
      measures_media_map: {
        buckets: summarizeBucketRows(registryRows, "storage_bucket"),
      },
      publication_dispatch_media_manifest_count: publicationDispatchesWithMedia.length,
    },
    mediaRowsRequiringMigrationBySystem: {
      measures_of_inanna: {
        codex_media_asset_non_l2_count: codexRows.filter((row) =>
          row.legacy_key || row.metadata?.source?.includes("inanna") || row.metadata?.source?.includes("pre_codex"),
        ).length,
        measures_surface_media_map_non_l2_count: surfaceRows.length,
        temp_exhibition_media_non_l2_count: tempRows.filter((row) => row.display_context === "measures_of_inanna").length,
      },
      measures_registry: {
        measures_media_map_non_l2_count: registryRows.length,
        publication_dispatches_with_media_manifest_count: publicationDispatchesWithMedia.length,
      },
      unknown_needs_classification: {
        codex_media_asset_non_l2_count: codexRows.filter((row) => !row.legacy_key).length,
      },
    },
    oldStorageReferencesPreserved: true,
    perSiteMediaMigrationPerformed: false,
    frontendMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
