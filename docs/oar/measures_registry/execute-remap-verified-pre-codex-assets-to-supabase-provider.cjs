require("dotenv").config({ path: ".env" })
require("dotenv").config({ path: ".env.inanna", override: false })
require("dotenv").config({ path: ".env.local", override: false })
require("dotenv").config({ path: ".env.cloudflare", override: false })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const oar2 = "oar2_remap_verified_pre_codex_assets_to_supabase_provider_v1"
const evidencePath = "docs/oar/measures_registry/remap_verified_pre_codex_assets_to_supabase_provider_v1.json"
const targetBucket = "measures-registry"
const targetProvider = "supabase"
const targetPrefix = "measures_registry/pre_codex_exhibition/images"

const confirmedAssets = [
  "antechamber.webp",
  "gemynd_corpus.webp",
  "gemynd_corpus_original_art.webp",
  "inanna_epigraph.webp",
  "marble_chamber_codexstone.webp",
  "obsidian_chamberplate_gate01.webp",
  "obsidian_chamberplate_gate03.webp",
  "og.webp",
  "percipari_original_artwork.webp",
  "primus_artus_epithet01_chamberplate.webp",
  "primus_artus_original_artwork.webp",
]

const chamberplateArtworkAssets = new Set([
  "gemynd_corpus_original_art.webp",
  "percipari_original_artwork.webp",
  "primus_artus_original_artwork.webp",
])

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function basename(path) {
  return String(path).split("/").pop()
}

function stem(path) {
  return basename(path).replace(/\.[^.]+$/, "").toLowerCase()
}

function isImageRow(row) {
  return row.media_type === "image" || /\.(webp|png|jpe?g)$/i.test(row.storage_path)
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
    const baseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""
    return baseUrl ? `${baseUrl}/${encodeObjectKey(trimSlashes(input.storagePath))}` : null
  }

  return supabase.storage.from(input.bucketName).getPublicUrl(input.storagePath).data.publicUrl
}

async function getTargetObject(path) {
  const directory = path.split("/").slice(0, -1).join("/")
  const name = basename(path)
  const rows = assertOk(
    await supabase.storage.from(targetBucket).list(directory, {
      limit: 1000,
      search: name,
      sortBy: { column: "name", order: "asc" },
    }),
    `list ${targetBucket}/${directory}`,
  ) ?? []

  const match = rows.find((row) => row.name === name)
  if (!match) return null
  return {
    path,
    name,
    size: Number(match.metadata?.size ?? match.size ?? 0),
    mimetype: match.metadata?.mimetype ?? match.metadata?.mimeType ?? null,
    updated_at: match.updated_at ?? null,
  }
}

async function verifyTarget(asset) {
  const targetPath = `${targetPrefix}/${asset}`
  const object = await getTargetObject(targetPath)
  if (!object) {
    return {
      asset,
      target_bucket: targetBucket,
      target_path: targetPath,
      exists: false,
      nonzero_size: false,
      retrievable: false,
      reason: "target object missing",
    }
  }
  if (object.size <= 0) {
    return {
      asset,
      target_bucket: targetBucket,
      target_path: targetPath,
      exists: true,
      nonzero_size: false,
      retrievable: false,
      target_size: object.size,
      reason: "target object has zero size",
    }
  }

  const signed = assertOk(
    await supabase.storage.from(targetBucket).createSignedUrl(targetPath, 60),
    `signed url ${targetBucket}/${targetPath}`,
  )
  const response = await fetch(signed.signedUrl, { method: "GET" })
  return {
    asset,
    target_bucket: targetBucket,
    target_path: targetPath,
    exists: true,
    nonzero_size: true,
    target_size: object.size,
    target_mimetype: object.mimetype,
    signed_url_generated: true,
    retrievable: response.ok,
    retrieval_status: response.status,
  }
}

async function fetchRows() {
  return assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .order("media_key", { ascending: true }),
    "codex_media_asset inventory",
  ) ?? []
}

function rowMatchesAsset(row, asset) {
  if (!isImageRow(row)) return false
  const rowBase = basename(row.storage_path)
  return rowBase === asset || stem(rowBase) === stem(asset)
}

async function updateRow(row, asset, targetVerification) {
  const update = {
    storage_provider: targetProvider,
    bucket: targetBucket,
    storage_path: targetVerification.target_path,
    metadata: {
      ...(row.metadata ?? {}),
      previous_bucket: row.bucket,
      previous_storage_provider: row.storage_provider,
      previous_storage_path: row.storage_path,
      remap_oar2: oar2,
      remap_authority: "operator_confirmed_verified_target",
      remap_confirmed_asset: asset,
      remap_target_bucket: targetBucket,
      remap_target_provider: targetProvider,
      remap_target_path: targetVerification.target_path,
      chamberplate_scoped_artwork: chamberplateArtworkAssets.has(asset),
    },
  }

  assertOk(
    await supabase
      .from("codex_media_asset")
      .update(update)
      .eq("media_key", row.media_key),
    `remap ${row.media_key}`,
  )

  return {
    media_key: row.media_key,
    title: row.title,
    media_type: row.media_type,
    confirmed_asset: asset,
    previous_storage_provider: row.storage_provider,
    previous_bucket: row.bucket,
    previous_storage_path: row.storage_path,
    new_storage_provider: targetProvider,
    new_bucket: targetBucket,
    new_storage_path: targetVerification.target_path,
    target_verification_status: {
      exists: targetVerification.exists,
      nonzero_size: targetVerification.nonzero_size,
      retrievable: targetVerification.retrievable,
      retrieval_status: targetVerification.retrieval_status ?? null,
    },
    chamberplate_scoped_artwork: chamberplateArtworkAssets.has(asset),
  }
}

function providerCounts(rows) {
  return Object.values(rows.reduce((acc, row) => {
    const key = `${row.bucket}||${row.storage_provider}`
    acc[key] ??= { bucket: row.bucket, storage_provider: row.storage_provider, count: 0 }
    acc[key].count += 1
    return acc
  }, {})).sort((left, right) => `${left.bucket}:${left.storage_provider}`.localeCompare(`${right.bucket}:${right.storage_provider}`))
}

async function main() {
  const rowsBefore = await fetchRows()
  const targetVerifications = []
  for (const asset of confirmedAssets) targetVerifications.push(await verifyTarget(asset))

  const verificationByAsset = new Map(targetVerifications.map((entry) => [entry.asset, entry]))
  const remappedRows = []
  const heldRows = []
  const usedMediaKeys = new Set()

  for (const asset of confirmedAssets) {
    const targetVerification = verificationByAsset.get(asset)
    const matches = rowsBefore
      .filter((row) => rowMatchesAsset(row, asset))
      .filter((row) => !usedMediaKeys.has(row.media_key))

    if (!targetVerification?.exists || !targetVerification.nonzero_size || !targetVerification.retrievable) {
      heldRows.push({
        confirmed_asset: asset,
        target_path: targetVerification?.target_path ?? `${targetPrefix}/${asset}`,
        matching_db_rows: matches.map((row) => ({
          media_key: row.media_key,
          title: row.title,
          bucket: row.bucket,
          storage_provider: row.storage_provider,
          storage_path: row.storage_path,
        })),
        hold_reason: targetVerification?.reason ?? "target verification failed",
      })
      continue
    }

    if (matches.length === 0) {
      heldRows.push({
        confirmed_asset: asset,
        target_path: targetVerification.target_path,
        matching_db_rows: [],
        hold_reason: "no matching seated DB media row exists",
      })
      continue
    }

    for (const row of matches) {
      remappedRows.push(await updateRow(row, asset, targetVerification))
      usedMediaKeys.add(row.media_key)
    }
  }

  const rowsAfter = await fetchRows()
  const remappedAfter = rowsAfter.filter((row) => remappedRows.some((remapped) => remapped.media_key === row.media_key))
  const runtimeVerificationRows = [
    remappedRows.find((row) => !row.chamberplate_scoped_artwork),
    remappedRows.find((row) => row.chamberplate_scoped_artwork),
    remappedRows.find((row) => /epigraph|passage|encounter/i.test(`${row.media_key} ${row.title} ${row.confirmed_asset}`)),
  ].filter(Boolean)
  const seenRuntimeKeys = new Set()
  const runtimeVerification = runtimeVerificationRows
    .filter((row) => {
      if (seenRuntimeKeys.has(row.media_key)) return false
      seenRuntimeKeys.add(row.media_key)
      return true
    })
    .map((row) => ({
      media_key: row.media_key,
      title: row.title,
      category: row.chamberplate_scoped_artwork
        ? "original_artwork"
        : /epigraph|passage|encounter/i.test(`${row.media_key} ${row.title} ${row.confirmed_asset}`)
          ? "epigraph_or_passage"
          : "chamberplate_or_oracle",
      input: {
        storageProvider: row.new_storage_provider,
        bucketName: row.new_bucket,
        storagePath: row.new_storage_path,
      },
      resolvedUrl: resolveRuntimeMediaUrl({
        storageProvider: row.new_storage_provider,
        bucketName: row.new_bucket,
        storagePath: row.new_storage_path,
      }),
    }))

  const evidence = {
    oar2,
    confirmedAssets,
    targetVerifications,
    providerCountsBefore: providerCounts(rowsBefore),
    remappedDbRowCount: remappedRows.length,
    remappedRows,
    heldRowCount: heldRows.length,
    heldRows,
    runtimeVerification,
    runtimeVerificationGap: runtimeVerification.some((entry) => entry.category === "epigraph_or_passage")
      ? null
      : "no matching epigraph or passage DB row existed in the authorized candidate set; asset remains held instead of invented",
    validationQueryOutput: remappedAfter,
    providerCountsAfter: providerCounts(rowsAfter),
    unrelatedRowsUnchangedCount: rowsAfter.length - remappedRows.length,
    mediaRowsInvented: false,
    frontendMutationPerformed: false,
    mediaResolverMutationPerformed: false,
    sourceObjectsDeleted: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
