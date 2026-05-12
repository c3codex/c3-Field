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

const targetBucket = "measures-registry"
const intendedTargetProvider = "supabase"
const targetPrefix = "measures_registry/pre_codex_exhibition/images"
const oar2 = "oar2_confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1"
const evidencePath = "docs/oar/measures_registry/confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1.json"

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

async function verifyTarget(file) {
  const targetPath = `${targetPrefix}/${file}`
  const object = await getTargetObject(targetPath)
  if (!object) {
    return {
      file,
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
      file,
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
    file,
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

function rowMatchesAsset(row, asset) {
  if (!isImageRow(row)) return false
  const rowBase = basename(row.storage_path)
  return rowBase === asset || stem(rowBase) === stem(asset)
}

function proposedRemap(row, verification, asset) {
  return {
    media_key: row.media_key,
    title: row.title,
    media_type: row.media_type,
    confirmed_asset: asset,
    previous_bucket: row.bucket,
    previous_storage_provider: row.storage_provider,
    previous_storage_path: row.storage_path,
    new_bucket: targetBucket,
    intended_new_storage_provider: intendedTargetProvider,
    new_storage_path: verification.target_path,
    chamberplate_scoped_artwork: chamberplateArtworkAssets.has(asset),
    hold_reason: "codex_media_asset storage_provider constraint currently rejects Supabase provider values; preserving cloudflare_r2 with a Supabase bucket/path would create runtime resolver ambiguity",
  }
}

async function main() {
  const verifiedObjects = []
  for (const asset of confirmedAssets) {
    verifiedObjects.push(await verifyTarget(asset))
  }

  const sourceRows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .order("media_key", { ascending: true }),
    "codex_media_asset inventory",
  ) ?? []

  const verifiedByAsset = new Map(verifiedObjects.map((entry) => [entry.file, entry]))
  const proposedRemapRows = []
  const heldRows = []
  const usedMediaKeys = new Set()

  for (const asset of confirmedAssets) {
    const verification = verifiedByAsset.get(asset)
    const matches = sourceRows
      .filter((row) => rowMatchesAsset(row, asset))
      .filter((row) => !usedMediaKeys.has(row.media_key))

    if (!verification?.exists || !verification.nonzero_size || !verification.retrievable) {
      heldRows.push({
        confirmed_asset: asset,
        target_path: verification?.target_path ?? `${targetPrefix}/${asset}`,
        matching_db_rows: matches.map((row) => ({
          media_key: row.media_key,
          title: row.title,
          bucket: row.bucket,
          storage_provider: row.storage_provider,
          storage_path: row.storage_path,
        })),
        hold_reason: verification?.reason ?? "target object failed retrieval verification",
      })
      continue
    }

    if (matches.length === 0) {
      heldRows.push({
        confirmed_asset: asset,
        target_path: verification.target_path,
        matching_db_rows: [],
        hold_reason: "no matching seated DB media row exists",
      })
      continue
    }

    for (const row of matches) {
      proposedRemapRows.push(proposedRemap(row, verification, asset))
      usedMediaKeys.add(row.media_key)
    }
  }

  const validationRows = proposedRemapRows.length > 0
    ? assertOk(
      await supabase
        .from("codex_media_asset")
        .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
        .in("media_key", proposedRemapRows.map((row) => row.media_key))
        .order("media_key", { ascending: true }),
      "validation query",
    ) ?? []
    : []

  const evidence = {
    oar2,
    targetBucket,
    targetPrefix,
    confirmedAssets,
    verifiedObjectCount: verifiedObjects.filter((entry) => entry.exists && entry.nonzero_size && entry.retrievable).length,
    verifiedObjects,
    remappedDbRowCount: 0,
    remappedRows: [],
    proposedRemapRowsHeldCount: proposedRemapRows.length,
    proposedRemapRowsHeld: proposedRemapRows,
    heldRowCount: heldRows.length,
    heldRows,
    unmatchedConfirmedAssets: heldRows
      .filter((entry) => entry.matching_db_rows.length === 0)
      .map((entry) => entry.confirmed_asset),
    validationQueryOutput: validationRows,
    dbMutationPerformed: false,
    dbMutationHoldReason: "Supabase target bucket/path requires a Supabase-compatible storage_provider contract, but codex_media_asset currently constrains storage_provider to cloudflare_r2 only.",
    frontendMutationPerformed: false,
    mediaResolverMutationPerformed: false,
    sourceObjectsDeleted: false,
    inventedRowsCreated: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
