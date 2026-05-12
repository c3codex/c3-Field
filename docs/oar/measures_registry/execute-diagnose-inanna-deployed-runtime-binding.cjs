const fs = require("fs")
const path = require("path")

const oar2 = "oar2_diagnose_inanna_deployed_runtime_binding_v1"
const evidencePath = path.resolve(
  process.cwd(),
  "docs/oar/measures_registry/diagnose_inanna_deployed_runtime_binding_v1.json",
)
const localIndexPath = path.resolve(process.cwd(), "dist-inanna/index.html")
const localAssetsDir = path.resolve(process.cwd(), "dist-inanna/assets")
const siteUrls = [
  "https://www.measuresofinanna.com/",
  "https://measuresofinanna.com/",
]
const probeRegistryKeys = [
  "epigraph",
  "temple_antechamber",
  "chamber_epithets_01_primus_artus",
]

function fail(message) {
  throw new Error(message)
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

function uniqueStrings(values) {
  return [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))]
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

function orderEncounterRows(rows, encounterKeys) {
  return [...rows].sort((left, right) => {
    const leftIndex = encounterKeys.indexOf(left.encounter_key)
    const rightIndex = encounterKeys.indexOf(right.encounter_key)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

function parseAssetPath(html) {
  const match = html.match(/assets\/[^"' ]+\.js/)
  return match ? match[0] : null
}

function parseCssPath(html) {
  const match = html.match(/assets\/[^"' ]+\.css/)
  return match ? match[0] : null
}

function assetNameFromPath(assetPath) {
  return assetPath ? assetPath.split("/").pop() : null
}

function extractPublicMarkers(js) {
  const supabaseUrlMatch = js.match(/https:\/\/[a-z0-9]+\.supabase\.co/)
  const publishableMatch = js.match(/sb_publishable_[A-Za-z0-9_-]+/)
  const r2Match = js.match(/https:\/\/media\.c3field\.online/)

  return {
    supabaseUrlPresent: Boolean(supabaseUrlMatch),
    supabaseUrlValue: supabaseUrlMatch?.[0] ?? null,
    publishableKeyPresent: Boolean(publishableMatch),
    publishableKeyPrefix: publishableMatch ? "sb_publishable_" : null,
    publishableKeyLength: publishableMatch?.[0]?.length ?? 0,
    r2PublicBasePresent: Boolean(r2Match),
    r2PublicBaseValue: r2Match?.[0] ?? null,
  }
}

function classifyResolver(js) {
  const chamberplateOnly = js.includes('surface_type==="chamberplate"')
  const setTriple =
    js.includes('new Set(["chamberplate","aspect","threshold"])') ||
    js.includes('Set(["chamberplate","aspect","threshold"])') ||
    js.includes('["chamberplate","aspect","threshold"]')

  const snippetMatch = js.match(/.{0,140}surface_type===.{0,260}/)

  return {
    chamberplateOnly,
    setTriple,
    snippet: snippetMatch ? snippetMatch[0] : null,
    mode: setTriple
      ? "governed_media_for_chamberplate_aspect_threshold"
      : chamberplateOnly
        ? "governed_media_for_chamberplate_only"
        : "unclassified",
  }
}

async function fetchText(url) {
  const response = await fetch(url)
  return {
    url,
    ok: response.ok,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    text: await response.text(),
  }
}

async function probeUrl(url) {
  let response = await fetch(url, { method: "HEAD" }).catch(() => null)
  if (!response || response.status === 405) {
    response = await fetch(url)
  }

  return {
    url,
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
  }
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
    mapStatus: row.status ?? null,
    assetStatus: asset.status ?? null,
    mapMetadata: row.metadata ?? null,
    assetMetadata: asset.metadata ?? null,
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
    mapStatus: row.is_active === false ? "inactive" : "active",
    assetStatus: row.is_active === false ? "inactive" : "active",
    mapMetadata: null,
    assetMetadata: null,
  }
}

function resolveRuntimeMediaUrl(item, r2BaseUrl, supabase) {
  if (item.publicUrl) return item.publicUrl
  if (!item.bucketName || !item.storagePath) return null
  if (
    item.storageProvider?.toLowerCase() === "cloudflare_r2" ||
    item.bucketName === "measures-media"
  ) {
    if (!r2BaseUrl) return null
    return `${r2BaseUrl}/${encodeObjectKey(trimSlashes(item.storagePath))}`
  }

  return supabase.storage.from(item.bucketName).getPublicUrl(item.storagePath).data.publicUrl
}

function summarizeMedia(item) {
  if (!item) return null
  return {
    source: item.source,
    surfaceKey: item.surfaceKey,
    mediaKey: item.mediaKey,
    role: item.role,
    mediaType: item.mediaType,
    bucketName: item.bucketName,
    storagePath: item.storagePath,
    storageProvider: item.storageProvider,
    renderOrder: item.renderOrder,
  }
}

async function main() {
  if (!fs.existsSync(localIndexPath)) fail("dist-inanna/index.html not found")

  const localHtml = fs.readFileSync(localIndexPath, "utf8")
  const localAssetPath = parseAssetPath(localHtml)
  const localCssPath = parseCssPath(localHtml)
  if (!localAssetPath) fail("Local dist-inanna asset path not found")

  const localJsPath = path.resolve(process.cwd(), "dist-inanna", localAssetPath)
  const localJs = fs.readFileSync(localJsPath, "utf8")

  const liveHtmlFetches = []
  for (const url of siteUrls) {
    liveHtmlFetches.push(await fetchText(url))
  }

  const liveHtml = liveHtmlFetches[0].text
  const liveAssetPath = parseAssetPath(liveHtml)
  const liveCssPath = parseCssPath(liveHtml)
  if (!liveAssetPath) fail("Live asset path not found")

  const liveAssetUrl = new URL(liveAssetPath, siteUrls[0]).toString()
  const liveJsFetch = await fetchText(liveAssetUrl)
  const liveJs = liveJsFetch.text

  const localMarkers = extractPublicMarkers(localJs)
  const liveMarkers = extractPublicMarkers(liveJs)
  const localResolver = classifyResolver(localJs)
  const liveResolver = classifyResolver(liveJs)

  if (!liveMarkers.supabaseUrlValue || !liveMarkers.publishableKeyPresent || !liveMarkers.r2PublicBaseValue) {
    fail("Live bundle missing one or more required public markers")
  }

  const livePublishableKey = (liveJs.match(/sb_publishable_[A-Za-z0-9_-]+/) || [])[0]
  const { createClient } = await import("@supabase/supabase-js")
  const supabase = createClient(liveMarkers.supabaseUrlValue, livePublishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { apikey: livePublishableKey } },
  })

  async function resolveEncounterRow(inputKey) {
    const { data: registryData, error: registryError } = await supabase
      .from("measures_registry")
      .select("id, registry_key, metadata")
      .eq("registry_key", inputKey)
      .maybeSingle()

    if (registryError) {
      return { error: registryError.message, registry: null, encounter: null }
    }

    if (registryData) {
      const encounterKeys = uniqueStrings([
        registryData.registry_key,
        metadataEncounterKey(registryData.metadata),
        `${registryData.registry_key}_view`,
      ])

      const { data: encounterData, error: encounterError } = await supabase
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

      if (encounterError) {
        return { error: encounterError.message, registry: registryData, encounter: null }
      }

      const ordered = orderEncounterRows(encounterData ?? [], encounterKeys)
      return {
        error: ordered[0] ? null : `No encounter found for registry ${inputKey}`,
        registry: registryData,
        encounter: ordered[0] ?? null,
      }
    }

    const { data: legacyData, error: legacyError } = await supabase
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
      .eq("encounter_key", inputKey)
      .maybeSingle()

    return {
      error: legacyError?.message ?? (legacyData ? null : `No legacy encounter found for ${inputKey}`),
      registry: null,
      encounter: legacyData ?? null,
    }
  }

  const routeResults = []
  for (const registryKey of probeRegistryKeys) {
    const resolved = await resolveEncounterRow(registryKey)
    const routeUrl = `https://www.measuresofinanna.com/?registry_key=${encodeURIComponent(registryKey)}`

    if (resolved.error || !resolved.encounter) {
      routeResults.push({
        routeUrl,
        registryKey,
        error: resolved.error ?? "Encounter resolution failed",
      })
      continue
    }

    const encounter = resolved.encounter
    const resolvedRegistryKey =
      Array.isArray(encounter.measures_registry)
        ? encounter.measures_registry[0]?.registry_key ?? registryKey
        : encounter.measures_registry?.registry_key ?? registryKey

    const surfaceKeys = [resolvedRegistryKey, encounter.encounter_key]

    const { data: governedRows, error: governedError } = await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, sequence_index, role, status, metadata, codex_media_asset!inner(media_key, title, media_type, bucket, storage_path, storage_provider, public_url, poster_url, status, metadata)",
      )
      .in("surface_key", surfaceKeys)
      .eq("status", "active")
      .order("sequence_index", { ascending: true })

    const { data: fallbackRows, error: fallbackError } = await supabase
      .from("temp_exhibition_media")
      .select("surface_key, label, media_type, bucket_name, storage_path, render_order, is_active")
      .in("surface_key", surfaceKeys)
      .order("render_order", { ascending: true })

    const governedMedia = (governedRows ?? []).map(registryMediaToRuntime).filter(Boolean)
    const fallbackMedia = (fallbackRows ?? [])
      .filter((row) => row.is_active !== false)
      .map(fallbackMediaToRuntime)

    const deployedReadsGoverned = liveResolver.mode === "governed_media_for_chamberplate_aspect_threshold"
      ? ["chamberplate", "aspect", "threshold"].includes(encounter.surface_type)
      : encounter.surface_type === "chamberplate"

    let selectedMedia = []
    if (deployedReadsGoverned) {
      selectedMedia = governedMedia.length > 0 ? governedMedia : fallbackMedia
    } else {
      selectedMedia = fallbackMedia
    }

    const finalSelectedMedia = selectedMedia[0] ?? null
    const finalResolvedUrl = finalSelectedMedia
      ? resolveRuntimeMediaUrl(finalSelectedMedia, liveMarkers.r2PublicBaseValue, supabase)
      : null
    const finalRetrieval = finalResolvedUrl ? await probeUrl(finalResolvedUrl) : null

    routeResults.push({
      routeUrl,
      registryKey,
      resolvedRegistryKey,
      encounterKey: encounter.encounter_key,
      surfaceType: encounter.surface_type,
      deployedReadsGoverned,
      governedQueryError: governedError?.message ?? null,
      fallbackQueryError: fallbackError?.message ?? null,
      governedMediaRowsReturned: governedMedia.map(summarizeMedia),
      fallbackMediaRowsReturned: fallbackMedia.map(summarizeMedia),
      finalSelectedMedia: summarizeMedia(finalSelectedMedia),
      finalResolvedUrl,
      finalRetrieval,
    })
  }

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationCount: 0,
    mutationPerformed: false,
    deployedHostsTested: liveHtmlFetches.map((item) => ({
      url: item.url,
      status: item.status,
      assetPath: parseAssetPath(item.text),
      cssPath: parseCssPath(item.text),
    })),
    deployedBundle: {
      assetPath: liveAssetPath,
      assetName: assetNameFromPath(liveAssetPath),
      cssPath: liveCssPath,
      resolver: liveResolver,
      markers: {
        supabaseUrlPresent: liveMarkers.supabaseUrlPresent,
        publishableKeyPresent: liveMarkers.publishableKeyPresent,
        r2PublicBasePresent: liveMarkers.r2PublicBasePresent,
      },
    },
    localBundle: {
      assetPath: localAssetPath,
      assetName: assetNameFromPath(localAssetPath),
      cssPath: localCssPath,
      resolver: localResolver,
      markers: {
        supabaseUrlPresent: localMarkers.supabaseUrlPresent,
        publishableKeyPresent: localMarkers.publishableKeyPresent,
        r2PublicBasePresent: localMarkers.r2PublicBasePresent,
      },
    },
    comparison: {
      assetHashMatches: assetNameFromPath(liveAssetPath) === assetNameFromPath(localAssetPath),
      resolverModeMatches: liveResolver.mode === localResolver.mode,
      envMarkersMatch:
        liveMarkers.supabaseUrlPresent === localMarkers.supabaseUrlPresent &&
        liveMarkers.publishableKeyPresent === localMarkers.publishableKeyPresent &&
        liveMarkers.r2PublicBasePresent === localMarkers.r2PublicBasePresent,
    },
    routeResults,
    localValidationComparison: {
      expectedFromOar1: {
        governedResolverSurfaceTypes: ["chamberplate", "aspect", "threshold"],
        epigraphGovernedPrimary: "epigraph_governed_animated_media_v1",
        epigraphGovernedVideoUrl: "https://media.c3field.online/inanna_epigraph.MP4",
      },
      observedDeployedDifference: {
        liveResolverMode: liveResolver.mode,
        localResolverMode: localResolver.mode,
      },
    },
    exactFailureSeam:
      !(
        assetNameFromPath(liveAssetPath) === assetNameFromPath(localAssetPath)
      ) && liveResolver.mode === "governed_media_for_chamberplate_only"
        ? "stale deployment bundle"
        : liveMarkers.publishableKeyPresent && !liveMarkers.r2PublicBasePresent
          ? "missing deployed env var"
          : "unclassified",
    recommendedNextOar2:
      "Seat a deployment/runtime binding correction OAR that promotes the current Inanna build artifact and verifies the Pages project/output binding serves the latest bundle with governed media for aspect and threshold.",
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8")
  console.log(JSON.stringify({
    evidencePath: path.relative(process.cwd(), evidencePath).replace(/\\/g, "/"),
    liveAsset: evidence.deployedBundle.assetName,
    localAsset: evidence.localBundle.assetName,
    exactFailureSeam: evidence.exactFailureSeam,
  }))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
