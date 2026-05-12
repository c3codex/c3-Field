require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const evidencePath = "docs/oar/measures_registry/reconcile_measures_registry_and_pre_codex_media_inventory_v1.json"
const oar2 = "oar2_reconcile_measures_registry_and_pre_codex_media_inventory_v1"
const targetPrefix = "measures_registry/pre_codex_exhibition/images"
const imagePattern = /\.(avif|gif|jpe?g|png|svg|webp)$/i
const webpPattern = /\.webp$/i
const R2_BUCKETS = new Set(["measures-media"])

const measuresRegistryCorrectionKeys = [
  "integrity_governance_intro.mp4",
  "more_vs_coherence_path.webp",
  "hero_fracture_measure.webp",
  "measured_hero_right.webp",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function trimSlashes(value) {
  return String(value).replace(/^\/+|\/+$/g, "")
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function basename(path) {
  return String(path ?? "").split("/").filter(Boolean).pop() ?? ""
}

function ext(path) {
  const name = basename(path)
  const match = name.match(/(\.[^.]+)$/)
  return match ? match[1].toLowerCase() : ""
}

function stem(path) {
  return basename(path).replace(/\.[^.]+$/, "").toLowerCase()
}

function isR2Media(input) {
  const provider = input.storageProvider?.toLowerCase() ?? null
  return provider === "cloudflare_r2" || Boolean(input.bucketName && R2_BUCKETS.has(input.bucketName))
}

function resolveRuntimeMediaUrl(input) {
  if (input.publicUrl) return input.publicUrl
  if (!input.bucketName || !input.storagePath) return null

  if (isR2Media(input)) {
    const baseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""
    return baseUrl ? `${baseUrl}/${encodeObjectKey(trimSlashes(input.storagePath))}` : null
  }

  return supabase.storage.from(input.bucketName).getPublicUrl(input.storagePath).data.publicUrl
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, reason: "no resolved url" }

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

function storageObjectPath(prefix, name) {
  return [prefix, name].filter(Boolean).join("/")
}

function isFolderEntry(entry) {
  return !entry.metadata && !entry.mimetype && !/\.[a-z0-9]{2,5}$/i.test(entry.name)
}

async function listBucketObjects(bucket, prefix = "") {
  const rows = assertOk(
    await supabase.storage.from(bucket).list(prefix, {
      limit: 1000,
      sortBy: { column: "name", order: "asc" },
    }),
    `list ${bucket}/${prefix}`,
  ) ?? []

  const objects = []
  for (const row of rows) {
    const path = storageObjectPath(prefix, row.name)
    if (isFolderEntry(row)) {
      objects.push(...await listBucketObjects(bucket, path))
      continue
    }

    objects.push({
      bucket,
      path,
      name: row.name,
      extension: ext(row.name),
      size: Number(row.metadata?.size ?? row.size ?? 0),
      mimetype: row.metadata?.mimetype ?? row.metadata?.mimeType ?? row.mimetype ?? null,
      updatedAt: row.updated_at ?? row.created_at ?? null,
    })
  }

  return objects
}

async function queryInventories() {
  const [
    codexRows,
    registryRows,
    tempRows,
    surfaceRows,
  ] = await Promise.all([
    supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,bucket,storage_provider,storage_path,public_url,poster_url,status,legacy_key,metadata")
      .order("media_key", { ascending: true }),
    supabase
      .from("measures_media_map")
      .select("campaign_key,registry_key,encounter_key,media_role,storage_bucket,storage_path,mime_type,is_active,sort_order")
      .order("media_role", { ascending: true }),
    supabase
      .from("temp_exhibition_media")
      .select("display_context,surface_type,surface_key,label,media_type,bucket_name,storage_path,render_order,is_active")
      .order("surface_key", { ascending: true }),
    supabase
      .from("measures_surface_media_map")
      .select("surface_key,role,status,sequence_index,codex_media_asset!inner(media_key,title,media_type,bucket,storage_provider,storage_path,public_url,poster_url,status,metadata)")
      .order("surface_key", { ascending: true }),
  ])

  return {
    codexRows: assertOk(codexRows, "codex_media_asset"),
    registryRows: assertOk(registryRows, "measures_media_map"),
    tempRows: assertOk(tempRows, "temp_exhibition_media"),
    surfaceRows: assertOk(surfaceRows, "measures_surface_media_map"),
  }
}

function assetFromSurfaceRow(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

function referencesForPath(rows, bucketField, pathField, bucket, path) {
  return rows.filter((row) => row[bucketField] === bucket && row[pathField] === path)
}

function objectIndex(objects) {
  return new Map(objects.map((object) => [object.path, object]))
}

function basenameIndex(objects) {
  const index = new Map()
  for (const object of objects) {
    const key = basename(object.path).toLowerCase()
    if (!index.has(key)) index.set(key, [])
    index.get(key).push(object)
  }
  return index
}

function stemIndex(objects) {
  const index = new Map()
  for (const object of objects) {
    const key = stem(object.path)
    if (!index.has(key)) index.set(key, [])
    index.get(key).push(object)
  }
  return index
}

async function classifyMeasuresMediaMapRows(registryRows, targetWebpObjects) {
  const targetPaths = objectIndex(targetWebpObjects)
  const targetBasenames = basenameIndex(targetWebpObjects)
  const targetStems = stemIndex(targetWebpObjects)
  const rows = []

  for (const row of registryRows) {
    const input = {
      bucketName: row.storage_bucket,
      storagePath: row.storage_path,
      storageProvider: null,
      publicUrl: null,
    }
    const resolvedUrl = resolveRuntimeMediaUrl(input)
    const retrieval = await retrievalStatus(resolvedUrl)
    const exactTarget = row.storage_bucket === "measures-registry" ? targetPaths.get(row.storage_path) : null
    const basenameTargets = targetBasenames.get(basename(row.storage_path).toLowerCase()) ?? []
    const stemTargets = targetStems.get(stem(row.storage_path)) ?? []

    let classification = "active db row"
    if (row.storage_bucket === "measures-media") classification = "valid R2 row"
    if (row.storage_bucket === "measures-registry" && exactTarget) classification = "already copied and mapped"
    if (retrieval.tested && retrieval.ok === false) classification = "stale DB row"
    if (row.media_role === "hero_video" && row.storage_path === "integrity_governance_intro.mp4") {
      classification = "valid R2 row misclassified as Supabase"
    }

    rows.push({
      mediaRole: row.media_role,
      campaignKey: row.campaign_key,
      bucket: row.storage_bucket,
      storagePath: row.storage_path,
      mimeType: row.mime_type,
      isActive: row.is_active,
      resolvedUrl,
      retrieval,
      classification,
      targetObjectExactMatch: Boolean(exactTarget),
      targetObjectBasenameMatches: basenameTargets.map((object) => object.path),
      targetObjectStemMatches: stemTargets.map((object) => object.path),
      recommendedStanding: row.media_role === "hero_video" && row.storage_path === "integrity_governance_intro.mp4"
        ? {
          storage_provider: "cloudflare_r2",
          bucket: "measures-media",
          storage_path: "integrity_governance_intro.mp4",
        }
        : null,
    })
  }

  return rows
}

function classifyPreCodexObjects(preCodexImages, targetWebpObjects, inventories) {
  const targetBasenames = basenameIndex(targetWebpObjects)
  const targetStems = stemIndex(targetWebpObjects)

  return preCodexImages.map((object) => {
    const sameBasenameTargets = targetBasenames.get(basename(object.path).toLowerCase()) ?? []
    const sameStemTargets = targetStems.get(stem(object.path)) ?? []
    const codexRefs = referencesForPath(inventories.codexRows, "bucket", "storage_path", "pre-codex-exhibition", object.path)
    const tempRefs = referencesForPath(inventories.tempRows, "bucket_name", "storage_path", "pre-codex-exhibition", object.path)
    const registryRefs = referencesForPath(inventories.registryRows, "storage_bucket", "storage_path", "pre-codex-exhibition", object.path)

    const hasTargetMatch = sameBasenameTargets.length > 0 || sameStemTargets.length > 0
    const hasDbReference = codexRefs.length > 0 || tempRefs.length > 0 || registryRefs.length > 0

    let classification = "still in pre-codex-exhibition"
    if (hasTargetMatch && hasDbReference) classification = "already copied; DB reference exists"
    if (hasTargetMatch && !hasDbReference) classification = "copied but no seated DB row"
    if (!hasTargetMatch && !hasDbReference) classification = "still in pre-codex-exhibition; requires copy decision and new seating OAR"
    if (!hasTargetMatch && hasDbReference) {
      classification = "still in pre-codex-exhibition; migration candidate"
    }

    return {
      sourceBucket: object.bucket,
      sourcePath: object.path,
      size: object.size,
      mimetype: object.mimetype,
      classification,
      targetBasenameMatches: sameBasenameTargets.map((target) => target.path),
      targetStemMatches: sameStemTargets.map((target) => target.path),
      dbReferences: {
        codex_media_asset: codexRefs.map((row) => row.media_key),
        temp_exhibition_media: tempRefs.map((row) => row.surface_key),
        measures_media_map: registryRefs.map((row) => row.media_role),
      },
      recommendedTargetPath: `${targetPrefix}/${basename(object.path).replace(/\.(png|jpe?g)$/i, ".webp")}`,
      requiresCopy: !hasTargetMatch,
      requiresNewSeatingOar: !hasDbReference,
    }
  })
}

function classifyTempRows(tempRows, targetWebpObjects, codexRows) {
  const targetBasenames = basenameIndex(targetWebpObjects)
  const targetStems = stemIndex(targetWebpObjects)
  const codexByStem = new Map()
  for (const row of codexRows) {
    const key = stem(row.storage_path)
    if (!codexByStem.has(key)) codexByStem.set(key, [])
    codexByStem.get(key).push(row)
  }

  return tempRows
    .filter((row) => row.is_active !== false)
    .map((row) => {
      const basenameMatches = targetBasenames.get(basename(row.storage_path).toLowerCase()) ?? []
      const stemMatches = targetStems.get(stem(row.storage_path)) ?? []
      const codexMatches = codexByStem.get(stem(row.storage_path)) ?? []

      let recommendation = "migrate to codex_media_asset then deprecate fallback after registry media mapping is seated"
      if (basenameMatches.length > 0 || stemMatches.length > 0 || codexMatches.length > 0) {
        recommendation = "remap to existing measures-registry/codex media row then deprecate fallback"
      }
      if (row.bucket_name === "pre-codex-exhibition" && basenameMatches.length === 0 && stemMatches.length === 0 && codexMatches.length === 0) {
        recommendation = "hold for new asset upload or copy under follow-up OAR"
      }

      return {
        surfaceKey: row.surface_key,
        displayContext: row.display_context ?? null,
        mediaType: row.media_type,
        bucket: row.bucket_name,
        storagePath: row.storage_path,
        renderOrder: row.render_order,
        classification: "legacy fallback row requiring migration",
        matchingTargetObjects: [...new Set([...basenameMatches, ...stemMatches].map((target) => target.path))],
        matchingCodexMediaKeys: codexMatches.map((match) => match.media_key),
        recommendation,
      }
    })
}

function classifyCodexRows(codexRows, targetWebpObjects) {
  const targetPaths = objectIndex(targetWebpObjects)
  const targetStems = stemIndex(targetWebpObjects)

  return codexRows.map((row) => {
    const exactTarget = row.bucket === "measures-registry" ? targetPaths.get(row.storage_path) : null
    const stemMatches = targetStems.get(stem(row.storage_path)) ?? []
    let classification = "db row"
    if (row.bucket === "measures-registry" && exactTarget) classification = "already copied and remapped"
    if (row.bucket === "measures-registry" && !exactTarget) classification = "missing from target bucket"
    if (row.bucket === "pre-codex-exhibition") classification = "still in pre-codex-exhibition"
    if (isR2Media({ bucketName: row.bucket, storageProvider: row.storage_provider })) classification = "valid R2 row"

    return {
      mediaKey: row.media_key,
      title: row.title,
      mediaType: row.media_type,
      storageProvider: row.storage_provider,
      bucket: row.bucket,
      storagePath: row.storage_path,
      status: row.status,
      classification,
      targetStemMatches: stemMatches.map((target) => target.path),
    }
  })
}

async function correctionCandidates(registryRows) {
  const candidates = []
  for (const key of measuresRegistryCorrectionKeys) {
    const dbRows = registryRows.filter((row) => basename(row.storage_path) === key || row.storage_path === key)
    const expectedR2Url = resolveRuntimeMediaUrl({
      bucketName: "measures-media",
      storagePath: key,
      storageProvider: "cloudflare_r2",
    })
    const expectedR2Retrieval = await retrievalStatus(expectedR2Url)
    candidates.push({
      asset: key,
      currentRows: dbRows.map((row) => ({
        mediaRole: row.media_role,
        bucket: row.storage_bucket,
        storagePath: row.storage_path,
        isActive: row.is_active,
      })),
      expectedStanding: key === "integrity_governance_intro.mp4"
        ? "cloudflare_r2 / measures-media / integrity_governance_intro.mp4"
        : "invalid/stale unless matching target object exists",
      expectedR2Retrieval,
      recommendation: key === "integrity_governance_intro.mp4" && expectedR2Retrieval.ok
        ? "correct DB reference to R2 under follow-up mutation OAR"
        : "hold/remove-or-replace candidate under follow-up mutation OAR",
    })
  }
  return candidates
}

async function r2ReferencedRows(inventories) {
  const rows = []
  for (const row of inventories.registryRows.filter((entry) => entry.storage_bucket === "measures-media")) {
    const url = resolveRuntimeMediaUrl({ bucketName: row.storage_bucket, storagePath: row.storage_path })
    rows.push({
      source: "measures_media_map",
      key: row.media_role,
      bucket: row.storage_bucket,
      storagePath: row.storage_path,
      retrieval: await retrievalStatus(url),
    })
  }

  for (const row of inventories.codexRows.filter((entry) => isR2Media({ bucketName: entry.bucket, storageProvider: entry.storage_provider }))) {
    const url = resolveRuntimeMediaUrl({
      bucketName: row.bucket,
      storagePath: row.storage_path,
      storageProvider: row.storage_provider,
      publicUrl: row.public_url,
    })
    rows.push({
      source: "codex_media_asset",
      key: row.media_key,
      bucket: row.bucket,
      storageProvider: row.storage_provider,
      storagePath: row.storage_path,
      retrieval: await retrievalStatus(url),
    })
  }

  return rows
}

async function main() {
  const [preCodexObjects, measuresRegistryObjects, inventories] = await Promise.all([
    listBucketObjects("pre-codex-exhibition"),
    listBucketObjects("measures-registry"),
    queryInventories(),
  ])

  const preCodexImages = preCodexObjects.filter((object) => imagePattern.test(object.path))
  const targetWebpObjects = measuresRegistryObjects.filter((object) => webpPattern.test(object.path))
  const measuresMediaMapClassifications = await classifyMeasuresMediaMapRows(inventories.registryRows, targetWebpObjects)
  const preCodexClassifications = classifyPreCodexObjects(preCodexImages, targetWebpObjects, inventories)
  const tempClassifications = classifyTempRows(inventories.tempRows, targetWebpObjects, inventories.codexRows)
  const codexClassifications = classifyCodexRows(inventories.codexRows, targetWebpObjects)
  const corrections = await correctionCandidates(inventories.registryRows)
  const r2Rows = await r2ReferencedRows(inventories)

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationPerformed: false,
    storageInventory: {
      preCodexExhibition: {
        bucket: "pre-codex-exhibition",
        objectCount: preCodexObjects.length,
        imageObjectCount: preCodexImages.length,
        imageObjects: preCodexImages,
      },
      measuresRegistry: {
        bucket: "measures-registry",
        objectCount: measuresRegistryObjects.length,
        webpObjectCount: targetWebpObjects.length,
        webpObjects: targetWebpObjects,
      },
      r2ReferencedByDb: r2Rows,
    },
    dbInventory: {
      codexMediaAssetCount: inventories.codexRows.length,
      measuresMediaMapCount: inventories.registryRows.length,
      tempExhibitionMediaCount: inventories.tempRows.length,
      measuresSurfaceMediaMapCount: inventories.surfaceRows.length,
    },
    classifications: {
      codex_media_asset: codexClassifications,
      measures_media_map: measuresMediaMapClassifications,
      pre_codex_images: preCodexClassifications,
      legacy_temp_exhibition_media: tempClassifications,
    },
    correctionCandidates: corrections,
    copiedButNoSeatedDbRow: preCodexClassifications.filter((entry) =>
      entry.classification === "copied but no seated DB row",
    ),
    remainingPreCodexCopyCandidates: preCodexClassifications.filter((entry) =>
      entry.requiresCopy,
    ),
    staleDbRows: [
      ...measuresMediaMapClassifications.filter((entry) => entry.classification === "stale DB row"),
      ...codexClassifications.filter((entry) => entry.classification === "missing from target bucket"),
    ],
    validR2CorrectionList: corrections.filter((entry) => entry.asset === "integrity_governance_intro.mp4" && entry.expectedR2Retrieval.ok),
    legacyFallbackMigrationCandidates: tempClassifications,
    recommendedNextOar2: "OAR2 to correct Measures Registry stale media rows and migrate legacy Inanna fallback rows with an operator-confirmed object list; include DB mutation authority and any required copy authority explicitly.",
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({
    evidencePath,
    mutationPerformed: false,
    preCodexImageCount: preCodexImages.length,
    measuresRegistryWebpCount: targetWebpObjects.length,
    r2ReferencedRowCount: r2Rows.length,
    staleDbRowCount: evidence.staleDbRows.length,
    legacyFallbackMigrationCandidateCount: tempClassifications.length,
    copiedButNoSeatedDbRowCount: evidence.copiedButNoSeatedDbRow.length,
    remainingPreCodexCopyCandidateCount: evidence.remainingPreCodexCopyCandidates.length,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
