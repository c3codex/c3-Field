const fs = require("fs")
const path = require("path")
const { execFileSync } = require("child_process")

const oar2 = "oar2_promote_current_inanna_build_artifact_v1"
const evidencePath = path.resolve(
  process.cwd(),
  "docs/oar/measures_registry/promote_current_inanna_build_artifact_v1.json",
)
const distIndexPath = path.resolve(process.cwd(), "dist-inanna/index.html")
const distJsPath = path.resolve(process.cwd(), "dist-inanna/assets/index-DNR-DxGl.js")
const liveHost = "https://www.measuresofinanna.com/"
const beforeAsset = "index-qPbY_Yxd.js"
const expectedAfterAsset = "index-DNR-DxGl.js"

function parseAssetPath(html) {
  const match = html.match(/assets\/[^"' ]+\.js/)
  return match ? match[0] : null
}

function parseCssPath(html) {
  const match = html.match(/assets\/[^"' ]+\.css/)
  return match ? match[0] : null
}

function assetName(assetPath) {
  return assetPath ? assetPath.split("/").pop() : null
}

function resolverStanding(js) {
  return {
    hasGovernedSetTriple: js.includes('["chamberplate","aspect","threshold"]'),
    hasChamberplateOnlyGate: js.includes('surface_type==="chamberplate"'),
  }
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function trimSlashes(value) {
  return value.replace(/^\/+|\/+$/g, "")
}

function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null
}

function asString(value) {
  return typeof value === "string" ? value : null
}

function metadataEncounterKey(metadata) {
  const record = asRecord(metadata)
  if (!record) return null
  return (
    asString(record.encounter_key) ??
    asString(record.encounterKey) ??
    asString(record.encounter_def_key) ??
    asString(record.encounterDefKey)
  )
}

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
}

function orderEncounterRows(rows, encounterKeys) {
  return [...rows].sort((left, right) => {
    const leftIndex = encounterKeys.indexOf(left.encounter_key)
    const rightIndex = encounterKeys.indexOf(right.encounter_key)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

function registryMediaAsset(row) {
  return Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
}

function registryMediaToRuntime(row) {
  const asset = registryMediaAsset(row)
  if (!asset) return null
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
  }
}

function fallbackMediaToRuntime(row) {
  return {
    source: "temp_exhibition_media",
    surfaceKey: row.surface_key ?? null,
    mediaKey: null,
    role: row.media_type,
    mediaType: row.media_type,
    bucketName: row.bucket_name,
    storagePath: row.storage_path,
    storageProvider: null,
    publicUrl: null,
    renderOrder: row.render_order ?? 999,
  }
}

function resolveRuntimeMediaUrl(item, r2BaseUrl, supabase) {
  if (!item) return null
  if (item.publicUrl) return item.publicUrl
  if (!item.bucketName || !item.storagePath) return null
  if (
    item.storageProvider?.toLowerCase() === "cloudflare_r2" ||
    item.bucketName === "measures-media"
  ) {
    return `${r2BaseUrl}/${encodeObjectKey(trimSlashes(item.storagePath))}`
  }
  return supabase.storage.from(item.bucketName).getPublicUrl(item.storagePath).data.publicUrl
}

async function probeUrl(url) {
  let response = await fetch(url, { method: "HEAD" }).catch(() => null)
  if (!response || response.status === 405) response = await fetch(url)
  return {
    url,
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
  }
}

async function resolveRoute(supabase, registryKey, deployedReadsGoverned, r2BaseUrl) {
  const { data: registryData } = await supabase
    .from("measures_registry")
    .select("id, registry_key, metadata")
    .eq("registry_key", registryKey)
    .maybeSingle()

  if (!registryData) {
    return {
      routeUrl: `${liveHost}?registry_key=${encodeURIComponent(registryKey)}`,
      registryKey,
      error: "Registry row not found",
    }
  }

  const encounterKeys = uniqueStrings([
    registryData.registry_key,
    metadataEncounterKey(registryData.metadata),
    `${registryData.registry_key}_view`,
  ])

  const { data: encounterData } = await supabase
    .from("measures_encounter_def")
    .select(
      `
      id,
      registry_id,
      encounter_key,
      surface_type,
      metadata,
      measures_registry (
        registry_key
      )
    `,
    )
    .eq("registry_id", registryData.id)
    .in("encounter_key", encounterKeys)

  const encounter = orderEncounterRows(encounterData ?? [], encounterKeys)[0]
  if (!encounter) {
    return {
      routeUrl: `${liveHost}?registry_key=${encodeURIComponent(registryKey)}`,
      registryKey,
      error: "Encounter could not be resolved",
    }
  }

  const resolvedRegistryKey = Array.isArray(encounter.measures_registry)
    ? encounter.measures_registry[0]?.registry_key ?? registryKey
    : encounter.measures_registry?.registry_key ?? registryKey

  const surfaceKeys = [resolvedRegistryKey, encounter.encounter_key]

  const { data: governedRows } = await supabase
    .from("measures_surface_media_map")
    .select(
      "surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, storage_provider, public_url, poster_url, status, metadata)",
    )
    .in("surface_key", surfaceKeys)
    .eq("status", "active")
    .order("sequence_index", { ascending: true })

  const { data: fallbackRows } = await supabase
    .from("temp_exhibition_media")
    .select("surface_key, label, media_type, bucket_name, storage_path, render_order, is_active")
    .in("surface_key", surfaceKeys)
    .order("render_order", { ascending: true })

  const governedMedia = (governedRows ?? []).map(registryMediaToRuntime).filter(Boolean)
  const fallbackMedia = (fallbackRows ?? [])
    .filter((row) => row.is_active !== false)
    .map(fallbackMediaToRuntime)

  const selectedMedia = deployedReadsGoverned
    ? governedMedia.length > 0
      ? governedMedia
      : fallbackMedia
    : fallbackMedia
  const finalSelectedMedia = selectedMedia[0] ?? null
  const finalResolvedUrl = resolveRuntimeMediaUrl(finalSelectedMedia, r2BaseUrl, supabase)
  const finalRetrieval = finalResolvedUrl ? await probeUrl(finalResolvedUrl) : null

  return {
    routeUrl: `${liveHost}?registry_key=${encodeURIComponent(registryKey)}`,
    registryKey,
    resolvedRegistryKey,
    encounterKey: encounter.encounter_key,
    surfaceType: encounter.surface_type,
    governedMediaRead: deployedReadsGoverned,
    governedMediaRowsReturned: governedMedia.map((item) => ({
      mediaKey: item.mediaKey,
      role: item.role,
      mediaType: item.mediaType,
      storagePath: item.storagePath,
    })),
    fallbackMediaRowsReturned: fallbackMedia.map((item) => ({
      role: item.role,
      mediaType: item.mediaType,
      storagePath: item.storagePath,
    })),
    finalSelectedMedia: finalSelectedMedia
      ? {
          source: finalSelectedMedia.source,
          mediaKey: finalSelectedMedia.mediaKey,
          role: finalSelectedMedia.role,
          mediaType: finalSelectedMedia.mediaType,
          storagePath: finalSelectedMedia.storagePath,
        }
      : null,
    finalResolvedUrl,
    finalRetrieval,
  }
}

async function main() {
  const localHtml = fs.readFileSync(distIndexPath, "utf8")
  const localJs = fs.readFileSync(distJsPath, "utf8")
  const localAssetPath = parseAssetPath(localHtml)
  const localCssPath = parseCssPath(localHtml)
  const localResolver = resolverStanding(localJs)

  const liveHtmlResponse = await fetch(liveHost)
  const liveHtml = await liveHtmlResponse.text()
  const liveAssetPath = parseAssetPath(liveHtml)
  const liveCssPath = parseCssPath(liveHtml)
  const liveAssetUrl = new URL(liveAssetPath, liveHost).toString()
  const liveJs = await (await fetch(liveAssetUrl)).text()
  const liveResolver = resolverStanding(liveJs)

  const supabaseUrl = (liveJs.match(/https:\/\/[a-z0-9]+\.supabase\.co/) || [])[0]
  const publishableKey = (liveJs.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0]
  const r2BaseUrl = (liveJs.match(/https:\/\/media\.c3field\.online/) || [])[0]
  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { apikey: publishableKey } },
  })

  const deployedReadsGovernedForEpigraph = liveResolver.hasGovernedSetTriple
  const deployedReadsGovernedForThreshold = liveResolver.hasGovernedSetTriple

  const epigraph = await resolveRoute(supabase, "epigraph", deployedReadsGovernedForEpigraph, r2BaseUrl)
  const templeAntechamber = await resolveRoute(
    supabase,
    "temple_antechamber",
    deployedReadsGovernedForThreshold,
    r2BaseUrl,
  )

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    deployAction: {
      route: "established git-push deployment path",
      command: "git push origin measures",
      commit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
      branch: "measures",
      targetProject: "Measures of Inanna Cloudflare Pages domain binding intended",
    },
    localBuild: {
      assetBeforePromotion: expectedAfterAsset,
      assetPath: localAssetPath,
      assetName: assetName(localAssetPath),
      cssPath: localCssPath,
      resolver: localResolver,
    },
    deployedBundle: {
      beforeHash: beforeAsset,
      afterHash: assetName(liveAssetPath),
      assetPath: liveAssetPath,
      cssPath: liveCssPath,
      resolver: liveResolver,
      changedFromBefore: assetName(liveAssetPath) !== beforeAsset,
      matchesExpectedCurrent: assetName(liveAssetPath) === expectedAfterAsset,
    },
    routeValidation: {
      epigraph,
      templeAntechamber,
    },
    mutationCount: {
      db: 0,
      media: 0,
      bucket: 0,
    },
    filesChanged: [],
    result:
      assetName(liveAssetPath) === expectedAfterAsset &&
      liveResolver.hasGovernedSetTriple &&
      !liveResolver.hasChamberplateOnlyGate &&
      epigraph.finalRetrieval?.status === 200 &&
      templeAntechamber.finalRetrieval?.status === 200
        ? "resolved"
        : "not_resolved",
    exactStanding:
      assetName(liveAssetPath) === beforeAsset
        ? "git push completed but deployed Inanna host still serves stale bundle"
        : "deployed host changed but validation did not fully pass",
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8")
  console.log(
    JSON.stringify({
      evidencePath: path.relative(process.cwd(), evidencePath).replace(/\\/g, "/"),
      afterHash: evidence.deployedBundle.afterHash,
      result: evidence.result,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
