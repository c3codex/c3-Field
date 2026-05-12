require("dotenv").config({ path: ".env" })
require("dotenv").config({ path: ".env.inanna", override: false })
require("dotenv").config({ path: ".env.local", override: false })
require("dotenv").config({ path: ".env.cloudflare", override: false })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2PublicBaseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const oar2 = "oar2_expand_codex_media_asset_storage_provider_contract_v1"
const evidencePath = "docs/oar/measures_registry/expand_codex_media_asset_storage_provider_contract_v1.json"
const migrationPath = "supabase/migrations/202605120001_expand_codex_media_asset_storage_provider.sql"
const probeKey = "__oar2_storage_provider_contract_probe_supabase__"
const cloudflareProbeKey = "__oar2_storage_provider_contract_probe_cloudflare__"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function execSql(sql, label) {
  const { error } = await supabase.rpc("exec_sql", { sql })
  if (error) throw new Error(`${label}: ${error.message}`)
}

function providerCounts(rows) {
  return Object.values(rows.reduce((acc, row) => {
    const key = `${row.bucket}||${row.storage_provider}`
    acc[key] ??= {
      bucket: row.bucket,
      storage_provider: row.storage_provider,
      count: 0,
    }
    acc[key].count += 1
    return acc
  }, {})).sort((left, right) => (
    `${left.bucket}:${left.storage_provider}`.localeCompare(`${right.bucket}:${right.storage_provider}`)
  ))
}

async function readProviderRows() {
  return assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,bucket,storage_provider,storage_path,media_type,status")
      .order("media_key", { ascending: true }),
    "codex_media_asset provider inventory",
  ) ?? []
}

async function cleanupProbe(mediaKey) {
  await supabase.from("codex_media_asset").delete().eq("media_key", mediaKey)
}

async function tryProbe({ mediaKey, storageProvider, bucket, storagePath }) {
  await cleanupProbe(mediaKey)
  const payload = {
    media_key: mediaKey,
    title: "OAR2 Storage Provider Contract Probe",
    media_type: "image",
    storage_provider: storageProvider,
    bucket,
    storage_path: storagePath,
    status: "held",
    metadata: {
      oar2,
      temporary_contract_probe: true,
    },
  }

  const result = await supabase.from("codex_media_asset").insert(payload).select("media_key,storage_provider,bucket,storage_path")
  if (result.error) {
    return {
      accepted: false,
      error_code: result.error.code ?? null,
      error_message: result.error.message,
    }
  }

  await cleanupProbe(mediaKey)
  return {
    accepted: true,
    inserted_then_deleted: true,
    row: Array.isArray(result.data) ? result.data[0] : result.data,
  }
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

function resolveRuntimeMediaUrl(input) {
  if (input.publicUrl) return input.publicUrl
  if (!input.bucketName || !input.storagePath) return null

  const provider = input.storageProvider?.toLowerCase() ?? null
  const isR2 = provider === "cloudflare_r2" || input.bucketName === "measures-media"
  if (isR2) {
    return r2PublicBaseUrl
      ? `${r2PublicBaseUrl}/${encodeObjectKey(trimSlashes(input.storagePath))}`
      : null
  }

  return supabase.storage.from(input.bucketName).getPublicUrl(input.storagePath).data.publicUrl
}

async function main() {
  const beforeRows = await readProviderRows()
  const beforeSupabaseProbe = await tryProbe({
    mediaKey: probeKey,
    storageProvider: "supabase",
    bucket: "measures-registry",
    storagePath: "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp",
  })

  await execSql(`
alter table public.codex_media_asset
  drop constraint if exists codex_media_asset_storage_provider_check;

alter table public.codex_media_asset
  add constraint codex_media_asset_storage_provider_check
  check (storage_provider in ('cloudflare_r2', 'supabase'));

notify pgrst, 'reload schema';
`, "expand codex_media_asset storage provider constraint")

  const afterSupabaseProbe = await tryProbe({
    mediaKey: probeKey,
    storageProvider: "supabase",
    bucket: "measures-registry",
    storagePath: "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp",
  })
  const afterCloudflareProbe = await tryProbe({
    mediaKey: cloudflareProbeKey,
    storageProvider: "cloudflare_r2",
    bucket: "measures-media",
    storagePath: "primus_artus.mp3",
  })
  const afterRows = await readProviderRows()

  const resolverVerification = {
    cloudflare_r2: {
      input: {
        storageProvider: "cloudflare_r2",
        bucketName: "measures-media",
        storagePath: "primus_artus.mp3",
      },
      resolvedUrl: resolveRuntimeMediaUrl({
        storageProvider: "cloudflare_r2",
        bucketName: "measures-media",
        storagePath: "primus_artus.mp3",
      }),
      expectedAuthority: "VITE_R2_PUBLIC_BASE_URL plus encoded storage_path",
    },
    supabase: {
      input: {
        storageProvider: "supabase",
        bucketName: "measures-registry",
        storagePath: "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp",
      },
      resolvedUrl: resolveRuntimeMediaUrl({
        storageProvider: "supabase",
        bucketName: "measures-registry",
        storagePath: "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp",
      }),
      expectedAuthority: "Supabase storage public URL from seated bucket and storage_path",
    },
  }

  const evidence = {
    oar2,
    migrationPath,
    contractBefore: {
      sourceDefinition: "codex_media_asset_storage_provider_check check (storage_provider in ('cloudflare_r2'))",
      supabaseProbe: beforeSupabaseProbe,
      providerCounts: providerCounts(beforeRows),
      rowCount: beforeRows.length,
    },
    appliedContractChange: {
      type: "CHECK constraint replacement",
      table: "public.codex_media_asset",
      constraint: "codex_media_asset_storage_provider_check",
      allowedValues: ["cloudflare_r2", "supabase"],
    },
    contractAfter: {
      supabaseProbe: afterSupabaseProbe,
      cloudflareR2Probe: afterCloudflareProbe,
      providerCounts: providerCounts(afterRows),
      rowCount: afterRows.length,
      existingCloudflareRowsRemainValid: afterCloudflareProbe.accepted === true &&
        afterRows.some((row) => row.storage_provider === "cloudflare_r2"),
    },
    resolverVerification,
    mediaRowsRemapped: false,
    mediaRowsRemappedCount: 0,
    frontendHardcodedPathsIntroduced: false,
    frontendMutationPerformed: false,
    sourceObjectsDeleted: false,
    probeRowsRemaining: afterRows.filter((row) => [probeKey, cloudflareProbeKey].includes(row.media_key)),
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch(async (error) => {
  await cleanupProbe(probeKey)
  await cleanupProbe(cloudflareProbeKey)
  console.error(error)
  process.exitCode = 1
})
