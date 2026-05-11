require("dotenv").config({ path: ".env.inanna" })
require("dotenv").config({ path: ".env.local", override: false })
require("dotenv").config({ path: ".env.cloudflare", override: true })

const crypto = require("node:crypto")
const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const bucket = process.env.L2_SHARED_MEDIA_BUCKET || "measures-media"

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")
if (!accountId || !accessKeyId || !secretAccessKey) throw new Error("Cloudflare R2 credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const manifestPath = "docs/_source/working/media/l2_bucket_manifest_v1.txt"
const evidencePath = "docs/oar/measures_registry/reconcile_registry_unmatched_l2_media_v1.json"
const migrationOar = "oar2_reconcile_registry_unmatched_l2_media_v1"
const l2Bucket = "measures-media"
const exactTargets = [
  "structural_coherence_explainer_45s.mp4",
  "registry_epigraph_fracture_to_alignment_15s.mp4",
  "right_measured_hero_motion_graphic.mp4",
]
const integrityPath = "integrity_governance_intro.mp4"

function hmac(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding)
}

function sha256(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex")
}

function signingKey(dateStamp) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  const regionKey = hmac(dateKey, "auto")
  const serviceKey = hmac(regionKey, "s3")
  return hmac(serviceKey, "aws4_request")
}

function signedListUrl(continuationToken = null) {
  const host = `${accountId}.r2.cloudflarestorage.com`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const dateStamp = amzDate.slice(0, 8)
  const params = new URLSearchParams({ "list-type": "2" })
  if (continuationToken) params.set("continuation-token", continuationToken)
  const canonicalQuery = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&")
  const canonicalUri = `/${bucket}`
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date"
  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    "UNSIGNED-PAYLOAD",
  ].join("\n")
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n")
  const signature = hmac(signingKey(dateStamp), stringToSign, "hex")
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    url: `https://${host}${canonicalUri}?${canonicalQuery}`,
    headers: {
      Authorization: authorization,
      "x-amz-content-sha256": "UNSIGNED-PAYLOAD",
      "x-amz-date": amzDate,
    },
  }
}

function xmlText(block, tag) {
  const match = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return match ? match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : null
}

function guessMime(key) {
  if (/\.mp4$/i.test(key)) return "video/mp4"
  if (/\.mov$/i.test(key)) return "video/quicktime"
  if (/\.mp3$/i.test(key)) return "audio/mpeg"
  if (/\.wav$/i.test(key)) return "audio/wav"
  if (/\.webp$/i.test(key)) return "image/webp"
  if (/\.png$/i.test(key)) return "image/png"
  if (/\.jpe?g$/i.test(key)) return "image/jpeg"
  return "application/octet-stream"
}

async function listR2Objects() {
  const objects = []
  let token = null

  do {
    const request = signedListUrl(token)
    const response = await fetch(request.url, { headers: request.headers })
    const text = await response.text()
    if (!response.ok) throw new Error(`R2 list failed: ${response.status} ${text}`)

    for (const match of text.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const block = match[1]
      objects.push({
        key: xmlText(block, "Key"),
        size: Number(xmlText(block, "Size") ?? 0),
        lastModified: xmlText(block, "LastModified"),
      })
    }

    const truncated = xmlText(text, "IsTruncated") === "true"
    token = truncated ? xmlText(text, "NextContinuationToken") : null
  } while (token)

  return objects.filter((object) => object.key)
}

function writeManifest(objects) {
  const body = objects
    .sort((left, right) => left.key.localeCompare(right.key))
    .map((object) => [
      object.key,
      guessMime(object.key),
      "Standard",
      `${object.size} bytes`,
      object.lastModified ?? "",
      "UTC",
      "",
      "",
    ].join("\n"))
    .join("")
  writeFileSync(manifestPath, body)
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const objects = await listR2Objects()
  writeManifest(objects)
  const objectKeys = new Set(objects.map((object) => object.key))

  const storageRows = await assertOk(
    await supabase
      .from("media_storage_registry")
      .select("storage_key,bucket,status")
      .eq("storage_key", "l2_shared_media")
      .eq("bucket", l2Bucket)
      .eq("status", "active"),
    "L2 storage row lookup failed",
  )
  if (storageRows.length === 0) throw new Error("active l2_shared_media storage row missing")

  const targetRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .in("storage_path", [...exactTargets, integrityPath]),
    "target media row lookup failed",
  )
  const rowsByPath = new Map(targetRows.map((row) => [row.storage_path, row]))
  const migrated = []
  const unmatched = []

  for (const path of exactTargets) {
    const row = rowsByPath.get(path)
    if (!row) {
      unmatched.push({ storage_path: path, reason: "target media row not present" })
      continue
    }
    if (!objectKeys.has(path)) {
      unmatched.push({
        id: row.id,
        storage_path: path,
        reason: "exact object key not returned by R2 list",
      })
      continue
    }

    await assertOk(
      await supabase
        .from("measures_media_map")
        .update({
          storage_bucket: l2Bucket,
          storage_path: path,
          metadata: {
            ...(row.metadata ?? {}),
            migrated_to_storage_key: "l2_shared_media",
            previous_bucket: row.storage_bucket,
            previous_storage_path: row.storage_path,
            migration_source_manifest: manifestPath,
            migration_oar: migrationOar,
            migration_match_strategy: "r2_exact_object_key_match",
            heavy_media_only: true,
            legacy_reference_preserved: true,
          },
        })
        .eq("id", row.id),
      `target media migration failed for ${path}`,
    )

    migrated.push({
      id: row.id,
      registry_key: row.registry_key,
      encounter_key: row.encounter_key,
      media_role: row.media_role,
      previous_bucket: row.storage_bucket,
      previous_storage_path: row.storage_path,
      new_bucket: l2Bucket,
      new_storage_path: path,
    })
  }

  const integrityRow = rowsByPath.get(integrityPath)
  const integrityStanding = integrityRow
    ? {
        presentInMediaMap: true,
        isActive: integrityRow.is_active === true,
        presentInR2: objectKeys.has(integrityPath),
        action: "not_mutated",
        standing:
          integrityRow.is_active === true
            ? objectKeys.has(integrityPath)
              ? "active_reference_present_in_r2_but_not_routed_for_migration"
              : "active_reference_missing_l2_payload"
            : "legacy_unresolved_unused_candidate",
      }
    : {
        presentInMediaMap: false,
        presentInR2: objectKeys.has(integrityPath),
        action: "not_mutated",
        standing: "not_referenced_in_media_map",
      }

  const imageRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id,storage_bucket,storage_path,mime_type")
      .or("mime_type.ilike.image/%,storage_path.ilike.%.webp,storage_path.ilike.%.png,storage_path.ilike.%.jpg,storage_path.ilike.%.jpeg"),
    "image media row inspection failed",
  )
  const validationRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .eq("storage_bucket", l2Bucket)
      .order("id", { ascending: true }),
    "validation query failed",
  )
  const remainingHeavyRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("id,registry_key,encounter_key,media_role,storage_bucket,storage_path,mime_type,is_active")
      .neq("storage_bucket", l2Bucket)
      .or("mime_type.ilike.video/%,mime_type.ilike.audio/%,storage_path.ilike.%.mp4,storage_path.ilike.%.mov,storage_path.ilike.%.mp3,storage_path.ilike.%.wav"),
    "remaining heavy media inspection failed",
  )

  const evidence = {
    l2StorageRowFound: true,
    l2ManifestFound: true,
    manifestSource: "cloudflare_r2_list_objects_v2",
    manifestPath,
    r2ObjectCount: objects.length,
    exactMediaRowsMigratedCount: migrated.length,
    migratedRows: migrated,
    integrityGovernanceIntroUsageStanding: integrityStanding,
    imageRowsPreservedCount: imageRows.length,
    unmatchedRowsRemaining: [...unmatched, ...remainingHeavyRows.map((row) => ({
      id: row.id,
      registry_key: row.registry_key,
      encounter_key: row.encounter_key,
      media_role: row.media_role,
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
      mime_type: row.mime_type,
      is_active: row.is_active,
      reason: "remaining non-L2 heavy media reference",
    }))],
    validationQueryOutput: validationRows,
    frontendMutationPerformed: false,
    measuresOfInannaMutationPerformed: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
