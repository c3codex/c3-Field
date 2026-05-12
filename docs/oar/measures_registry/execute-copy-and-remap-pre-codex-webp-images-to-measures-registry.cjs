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

const sourceBucket = "pre-codex-exhibition"
const targetBucket = "measures-registry"
const targetPrefix = "measures_registry/pre_codex_exhibition/images"
const evidencePath = "docs/oar/measures_registry/copy_and_remap_pre_codex_webp_images_to_measures_registry_v1.json"
const oar2 = "oar2_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function extension(path) {
  const match = String(path).toLowerCase().match(/\.([a-z0-9]+)$/)
  return match ? match[1] : ""
}

function basename(path) {
  return String(path).split("/").pop()
}

function stem(path) {
  return basename(path).replace(/\.[^.]+$/, "").toLowerCase()
}

function isImageRow(row) {
  return row.media_type === "image" || ["png", "webp", "jpeg", "jpg"].includes(extension(row.storage_path))
}

async function listObjects(bucket, prefix = "") {
  const rows = assertOk(
    await supabase.storage.from(bucket).list(prefix, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    }),
    `list ${bucket}/${prefix}`,
  ) ?? []

  const objects = []
  for (const row of rows) {
    const path = prefix ? `${prefix}/${row.name}` : row.name
    if (row.id === null || row.metadata === null) {
      objects.push(...await listObjects(bucket, path))
      continue
    }

    objects.push({
      path,
      name: row.name,
      size: Number(row.metadata?.size ?? row.size ?? 0),
      mimetype: row.metadata?.mimetype ?? row.metadata?.mimeType ?? null,
      updated_at: row.updated_at ?? null,
    })
  }
  return objects
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

async function copyIfNeeded(sourcePath, targetPath) {
  const existing = await getTargetObject(targetPath)
  if (existing?.size > 0) {
    return { action: "already_present", targetObject: existing }
  }

  if (existing && existing.size === 0) {
    throw new Error(`target object exists with zero size: ${targetPath}`)
  }

  const sourceBlob = assertOk(
    await supabase.storage.from(sourceBucket).download(sourcePath),
    `download ${sourceBucket}/${sourcePath}`,
  )

  const arrayBuffer = await sourceBlob.arrayBuffer()
  if (arrayBuffer.byteLength === 0) {
    throw new Error(`source object has zero size: ${sourcePath}`)
  }

  assertOk(
    await supabase.storage.from(targetBucket).upload(targetPath, Buffer.from(arrayBuffer), {
      contentType: "image/webp",
      upsert: false,
    }),
    `upload ${targetBucket}/${targetPath}`,
  )

  const uploaded = await getTargetObject(targetPath)
  if (!uploaded || uploaded.size === 0) {
    throw new Error(`uploaded target object did not verify nonzero: ${targetPath}`)
  }

  return { action: "copied", targetObject: uploaded }
}

async function verifyRetrieval(targetPath) {
  const signed = assertOk(
    await supabase.storage.from(targetBucket).createSignedUrl(targetPath, 60),
    `signed url ${targetBucket}/${targetPath}`,
  )

  const response = await fetch(signed.signedUrl, { method: "GET" })
  if (!response.ok) {
    throw new Error(`signed URL retrieval failed for ${targetPath}: ${response.status}`)
  }

  return {
    signedUrlGenerated: true,
    signedUrlFetchStatus: response.status,
    retrievedBytes: Number(response.headers.get("content-length") ?? 0),
  }
}

async function main() {
  const sourceObjects = await listObjects(sourceBucket)
  const sourceWebpObjects = sourceObjects.filter((object) => object.path.toLowerCase().endsWith(".webp"))

  const sourceRows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,status,metadata")
      .eq("bucket", sourceBucket)
      .order("media_key", { ascending: true }),
    "source codex_media_asset query",
  ) ?? []
  const imageRows = sourceRows.filter(isImageRow)
  const webpByPath = new Map(sourceWebpObjects.map((object) => [object.path, object]))
  const webpByStem = new Map(sourceWebpObjects.map((object) => [stem(object.path), object]))

  const exactRows = imageRows
    .filter((row) => webpByPath.has(row.storage_path))
    .map((row) => ({
      media_key: row.media_key,
      title: row.title,
      storage_path: row.storage_path,
      target_path: `${targetPrefix}/${basename(row.storage_path)}`,
      mapping_confidence: "exact_existing_webp_storage_path",
    }))

  const heldRows = imageRows
    .filter((row) => !webpByPath.has(row.storage_path))
    .map((row) => {
      const candidate = webpByStem.get(stem(row.storage_path))
      return {
        media_key: row.media_key,
        title: row.title,
        current_storage_path: row.storage_path,
        candidate_webp_path: candidate?.path ?? null,
        candidate_target_path: candidate ? `${targetPrefix}/${basename(candidate.path)}` : null,
        hold_reason: candidate
          ? "extension-normalized filename candidate requires operator confirmation; filename similarity not used as proof"
          : "no exact webp object or extension-normalized candidate found",
      }
    })

  const copiedObjects = []
  for (const object of sourceWebpObjects) {
    const targetPath = `${targetPrefix}/${basename(object.path)}`
    const copyResult = await copyIfNeeded(object.path, targetPath)
    const retrieval = await verifyRetrieval(targetPath)
    copiedObjects.push({
      source_bucket: sourceBucket,
      source_path: object.path,
      source_size: object.size,
      target_bucket: targetBucket,
      target_path: targetPath,
      action: copyResult.action,
      target_size: copyResult.targetObject.size,
      target_mimetype: copyResult.targetObject.mimetype,
      verification: retrieval,
    })
  }

  const evidence = {
    oar2,
    sourceBucket,
    targetBucket,
    targetPrefix,
    sourceObjectCount: sourceObjects.length,
    sourceWebpObjectCount: sourceWebpObjects.length,
    sourceWebpObjects,
    sourcePreCodexImageRowCount: imageRows.length,
    exactDbRowsEligibleAfterVerificationCount: exactRows.length,
    exactDbRowsEligibleAfterVerification: exactRows,
    dbRowsHeldCount: heldRows.length,
    dbRowsHeld: heldRows,
    copiedObjectCount: copiedObjects.length,
    copiedObjects,
    copiedTargetObjectsVerifiedCount: copiedObjects.filter((object) => object.target_size > 0 && object.verification.signedUrlGenerated).length,
    copiedCountMatchesIntendedRemapCount: copiedObjects.length === sourceWebpObjects.length,
    dbMutationPerformed: false,
    dbMutationHoldReason: heldRows.length > 0
      ? "ambiguous converted filename mappings present; OAR2 requires inventory table and stop before DB mutation"
      : "db remap intentionally held for operator review of copied evidence",
    sourceObjectsDeleted: false,
    frontendMutationPerformed: false,
    mediaResolverMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
