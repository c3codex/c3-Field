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
const sourcePath = "inanna_epigraph.webp"
const targetPath = "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp"
const evidencePath = "docs/oar/measures_registry/copy_corrected_inanna_epigraph_asset_v1.json"
const oar2 = "oar2_copy_corrected_inanna_epigraph_asset_v1"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function basename(path) {
  return String(path).split("/").pop()
}

async function getObject(bucket, path) {
  const directory = path.split("/").slice(0, -1).join("/")
  const name = basename(path)
  const rows = assertOk(
    await supabase.storage.from(bucket).list(directory, {
      limit: 1000,
      search: name,
      sortBy: { column: "name", order: "asc" },
    }),
    `list ${bucket}/${directory}`,
  ) ?? []
  const match = rows.find((row) => row.name === name)
  if (!match) return null
  return {
    bucket,
    path,
    name,
    size: Number(match.metadata?.size ?? match.size ?? 0),
    mimetype: match.metadata?.mimetype ?? match.metadata?.mimeType ?? null,
    updated_at: match.updated_at ?? null,
  }
}

async function verifyRetrieval(bucket, path) {
  const signed = assertOk(
    await supabase.storage.from(bucket).createSignedUrl(path, 60),
    `signed url ${bucket}/${path}`,
  )
  const response = await fetch(signed.signedUrl, { method: "GET" })
  return {
    signed_url_generated: true,
    retrievable: response.ok,
    retrieval_status: response.status,
    retrieved_bytes: Number(response.headers.get("content-length") ?? 0),
  }
}

async function verifyObject(bucket, path) {
  const object = await getObject(bucket, path)
  if (!object) {
    return {
      bucket,
      path,
      exists: false,
      nonzero_size: false,
      retrievable: false,
      reason: "object missing",
    }
  }
  if (object.size <= 0) {
    return {
      ...object,
      exists: true,
      nonzero_size: false,
      retrievable: false,
      reason: "object has zero size",
    }
  }
  return {
    ...object,
    exists: true,
    nonzero_size: true,
    ...(await verifyRetrieval(bucket, path)),
  }
}

async function copySourceToTarget() {
  const targetBefore = await verifyObject(targetBucket, targetPath)
  if (targetBefore.exists && targetBefore.nonzero_size && targetBefore.retrievable) {
    return {
      action: "already_present",
      target_verification: targetBefore,
    }
  }

  const downloaded = assertOk(
    await supabase.storage.from(sourceBucket).download(sourcePath),
    `download ${sourceBucket}/${sourcePath}`,
  )
  const bytes = Buffer.from(await downloaded.arrayBuffer())
  if (bytes.byteLength === 0) throw new Error(`source object has zero bytes: ${sourcePath}`)

  if (targetBefore.exists) {
    assertOk(
      await supabase.storage.from(targetBucket).update(targetPath, bytes, {
        contentType: "image/webp",
        upsert: true,
      }),
      `update ${targetBucket}/${targetPath}`,
    )
  } else {
    assertOk(
      await supabase.storage.from(targetBucket).upload(targetPath, bytes, {
        contentType: "image/webp",
        upsert: false,
      }),
      `upload ${targetBucket}/${targetPath}`,
    )
  }

  return {
    action: targetBefore.exists ? "updated_existing_target" : "copied",
    target_verification: await verifyObject(targetBucket, targetPath),
  }
}

async function main() {
  const sourceVerification = await verifyObject(sourceBucket, sourcePath)
  let copyResult = null
  let held = null

  if (sourceVerification.exists && sourceVerification.nonzero_size && sourceVerification.retrievable) {
    copyResult = await copySourceToTarget()
  } else {
    held = {
      source_path: sourcePath,
      target_path: targetPath,
      hold_reason: sourceVerification.reason ?? "source retrieval verification failed",
    }
  }

  const evidence = {
    oar2,
    sourceBucket,
    sourcePath,
    targetBucket,
    targetPath,
    sourceVerification,
    copyAction: copyResult?.action ?? null,
    targetVerification: copyResult?.target_verification ?? null,
    copiedTargetCount: copyResult ? 1 : 0,
    verifiedTargetCount: copyResult?.target_verification?.exists &&
      copyResult.target_verification.nonzero_size &&
      copyResult.target_verification.retrievable &&
      copyResult.target_verification.retrieval_status === 200
      ? 1
      : 0,
    held,
    dbMutationPerformed: false,
    dbMutationCount: 0,
    frontendMutationPerformed: false,
    frontendMutationCount: 0,
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
