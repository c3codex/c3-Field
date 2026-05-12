require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { readFileSync, writeFileSync } = require("node:fs")
const crypto = require("node:crypto")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const oar2 = "oar2_seat_epigraph_governed_animated_media_v1"
const evidencePath = "docs/oar/measures_registry/seat_epigraph_governed_animated_media_v1.json"
const animatedObjectKey = "inanna_epigraph.MP4"
const staleObjectKey = "inanna_encounter_intro.mp4"
const animatedMediaKey = "epigraph_governed_animated_media_v1"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function resolveUrl(input) {
  if (input.publicUrl) return input.publicUrl
  if (!input.bucketName || !input.storagePath) return null
  if (input.storageProvider === "cloudflare_r2" || input.bucketName === "measures-media") {
    return r2BaseUrl ? `${r2BaseUrl}/${encodeObjectKey(input.storagePath.replace(/^\/+|\/+$/g, ""))}` : null
  }
  return supabase.storage.from(input.bucketName).getPublicUrl(input.storagePath).data.publicUrl
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, ok: false, reason: "no resolved url" }
  try {
    const response = await fetch(url, { method: "GET" })
    return {
      tested: true,
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      contentLength: response.headers.get("content-length"),
    }
  } catch (error) {
    return { tested: true, ok: false, error: error.message }
  }
}

function signR2Request({ method, bucket, query = "", prefix = "" }) {
  const account = process.env.CLOUDFLARE_ACCOUNT_ID
  const access = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  if (!account || !access || !secret) return null

  const region = "auto"
  const service = "s3"
  const host = `${account}.r2.cloudflarestorage.com`
  const path = `/${bucket}${prefix ? `/${prefix}` : ""}`
  const now = new Date()
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "")
  const date = amzDate.slice(0, 8)
  const emptyHash = crypto.createHash("sha256").update("").digest("hex")
  const headers = {
    host,
    "x-amz-content-sha256": emptyHash,
    "x-amz-date": amzDate,
  }
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date"
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key]}\n`)
    .join("")
  const canonicalRequest = [
    method,
    path,
    query,
    canonicalHeaders,
    signedHeaders,
    emptyHash,
  ].join("\n")
  const scope = `${date}/${region}/${service}/aws4_request`
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n")
  const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value).digest(encoding)
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secret}`, date), region), service), "aws4_request")
  const signature = hmac(signingKey, stringToSign, "hex")
  headers.authorization =
    `AWS4-HMAC-SHA256 Credential=${access}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

  return {
    url: `https://${host}${path}${query ? `?${query}` : ""}`,
    headers,
  }
}

async function listR2Prefix(prefix) {
  const bucket = process.env.L2_SHARED_MEDIA_BUCKET || "measures-media"
  const query = `list-type=2&prefix=${encodeURIComponent(prefix)}`
  const signed = signR2Request({ method: "GET", bucket, query })
  if (!signed) return { available: false, reason: "R2 listing credentials unavailable" }
  const response = await fetch(signed.url, { headers: signed.headers })
  const body = await response.text()
  const keys = [...body.matchAll(/<Key>(.*?)<\/Key>/g)].map((match) => match[1])
  return {
    available: true,
    ok: response.ok,
    status: response.status,
    bucket,
    prefix,
    keys,
  }
}

function mediaAssetPayload() {
  return {
    media_key: animatedMediaKey,
    title: "Epigraph Governed Animated Media",
    media_type: "video",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: animatedObjectKey,
    public_url: null,
    poster_url: null,
    status: "active",
    metadata: {
      source_oar2: oar2,
      runtime_use: "epigraph governed animated/video primary",
      stale_replaced_key_reference: staleObjectKey,
      frontend_hardcode_allowed: false,
    },
  }
}

function mappingPayload() {
  return {
    surface_key: "epigraph",
    media_key: animatedMediaKey,
    role: "featured_video",
    sequence_index: 5,
    status: "active",
    metadata: {
      source_oar2: oar2,
      runtime_use: "epigraph governed animated/video primary",
      render_behavior: "autoplay_after_passage",
      audio_embedded: true,
      skip_enabled: true,
      stale_replaced_key_reference: staleObjectKey,
      frontend_hardcode_allowed: false,
    },
  }
}

function registryAsset(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

function rowToRuntime(row) {
  const asset = registryAsset(row)
  return {
    source: "registry_media",
    surfaceKey: row.surface_key,
    mediaKey: asset.media_key,
    role: row.role,
    mediaType: asset.media_type,
    bucketName: asset.bucket,
    storagePath: asset.storage_path,
    storageProvider: asset.storage_provider,
    publicUrl: asset.public_url,
    renderOrder: row.sequence_index ?? 999,
    mapStatus: row.status,
    assetStatus: asset.status,
    mapMetadata: row.metadata ?? null,
  }
}

async function epigraphRuntimeValidation() {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,poster_url,status,metadata)")
      .eq("surface_key", "epigraph")
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    "epigraph governed media validation",
  ) ?? []

  const resolved = []
  for (const row of rows) {
    const media = rowToRuntime(row)
    const url = resolveUrl(media)
    resolved.push({
      ...media,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }

  const primaryVideo =
    resolved.find((row) => row.mediaType === "video" && row.role === "featured_video") ??
    resolved.find((row) => row.mediaType === "video") ??
    null
  const primaryStill =
    resolved.find((row) => row.mediaType === "image" && ["oracle_card", "image"].includes(row.role)) ??
    resolved.find((row) => row.mediaType === "image") ??
    null

  return {
    activeGovernedRowCount: resolved.length,
    resolvedMedia: resolved,
    primaryVideo,
    primaryStill,
    animatedBeforeStill:
      Boolean(primaryVideo && primaryStill) &&
      primaryVideo.renderOrder <= primaryStill.renderOrder,
  }
}

async function fallbackStanding() {
  return assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key,media_type,bucket_name,storage_path,is_active")
      .eq("surface_key", "epigraph")
      .order("render_order", { ascending: true }),
    "epigraph fallback standing",
  )
}

async function chamberplateValidation() {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, sequence_index, role, status, codex_media_asset!inner(media_key,media_type,bucket,storage_path,storage_provider,public_url,status)")
      .eq("surface_key", "chamber_epithets_01_primus_artus")
      .eq("status", "active")
      .order("sequence_index", { ascending: true }),
    "chamberplate validation",
  ) ?? []
  return {
    surfaceKey: "chamber_epithets_01_primus_artus",
    activeGovernedRowCount: rows.length,
  }
}

async function main() {
  const r2List = await listR2Prefix("inanna")
  const animatedUrl = resolveUrl({
    storageProvider: "cloudflare_r2",
    bucketName: "measures-media",
    storagePath: animatedObjectKey,
  })
  const animatedRetrieval = await retrievalStatus(animatedUrl)
  const staleUrl = resolveUrl({
    storageProvider: "cloudflare_r2",
    bucketName: "measures-media",
    storagePath: staleObjectKey,
  })
  const staleRetrieval = await retrievalStatus(staleUrl)

  if (!animatedRetrieval.ok) {
    throw new Error(`Animated epigraph object failed retrieval: ${animatedObjectKey}`)
  }

  const mediaAssetRows = assertOk(
    await supabase.from("codex_media_asset").upsert(mediaAssetPayload(), {
      onConflict: "media_key",
    }).select("*"),
    "epigraph animated media asset upsert",
  )
  const mappingRows = assertOk(
    await supabase.from("measures_surface_media_map").upsert(mappingPayload(), {
      onConflict: "surface_key,media_key,role",
    }).select("*"),
    "epigraph animated mapping upsert",
  )

  const runtimeValidation = await epigraphRuntimeValidation()
  const sourceText = readFileSync("src/measures_of_inanna/resolve_encounter.ts", "utf8")

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    sourceObjectsDeleted: false,
    frontendMutationPerformed: false,
    resolverMutationPerformed: false,
    bucketCopyPerformed: false,
    animatedObject: {
      exactObjectKey: animatedObjectKey,
      publicUrl: animatedUrl,
      mediaType: animatedRetrieval.contentType,
      retrieval: animatedRetrieval,
      r2Listing: r2List,
    },
    staleNamingReference: {
      objectKey: staleObjectKey,
      publicUrl: staleUrl,
      retrieval: staleRetrieval,
      standing: "legacy/stale naming; left untouched as fallback safety reference",
    },
    upsertedRows: {
      codex_media_asset: mediaAssetRows.map((row) => ({
        media_key: row.media_key,
        media_type: row.media_type,
        storage_provider: row.storage_provider,
        bucket: row.bucket,
        storage_path: row.storage_path,
        status: row.status,
      })),
      measures_surface_media_map: mappingRows.map((row) => ({
        surface_key: row.surface_key,
        media_key: row.media_key,
        role: row.role,
        sequence_index: row.sequence_index,
        status: row.status,
      })),
    },
    runtimeValidation,
    fallbackRowsStillPresent: await fallbackStanding(),
    chamberplateValidation: await chamberplateValidation(),
    hardcodedMediaPathIntroduced: /inanna_epigraph\.MP4|inanna_epigraph\.mp4|inanna_encounter_intro\.mp4/.test(sourceText),
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({
    evidencePath,
    animatedObjectKey,
    animatedRetrievalStatus: animatedRetrieval.status,
    upsertedMediaAssetCount: mediaAssetRows.length,
    upsertedMappingCount: mappingRows.length,
    primaryVideo: runtimeValidation.primaryVideo?.mediaKey ?? null,
    primaryStill: runtimeValidation.primaryStill?.mediaKey ?? null,
    animatedBeforeStill: runtimeValidation.animatedBeforeStill,
    fallbackRowsStillPresent: evidence.fallbackRowsStillPresent.length,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
