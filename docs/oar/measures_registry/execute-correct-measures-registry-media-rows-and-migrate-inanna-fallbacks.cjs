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
const oar2 = "oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1"
const evidencePath = "docs/oar/measures_registry/correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1.json"
const r2BaseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""

const staleRegistryRoles = [
  "hero_image",
  "hero_measured_image",
  "path_choice_background",
  "paragraph_cover",
  "registry_banner",
  "social_card",
]

const authorizedAssets = [
  {
    media_key: "temple_antechamber_still_image_v1",
    title: "Temple Antechamber Still Image",
    media_type: "image",
    storage_provider: "supabase",
    bucket: "measures-registry",
    storage_path: "measures_registry/pre_codex_exhibition/images/antechamber.webp",
    surface_key: "temple_antechamber",
    role: "image",
    sequence_index: 10,
    runtime_use: "temple_antechamber still image",
  },
  {
    media_key: "epigraph_still_image_support_v1",
    title: "Epigraph Still Image Support",
    media_type: "image",
    storage_provider: "supabase",
    bucket: "measures-registry",
    storage_path: "measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp",
    surface_key: "epigraph",
    role: "image",
    sequence_index: 10,
    runtime_use: "epigraph still/image support only",
  },
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function encodeObjectKey(objectKey) {
  return objectKey.split("/").map((segment) => encodeURIComponent(segment)).join("/")
}

function resolveRuntimeMediaUrl(input) {
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

function assetPayload(asset) {
  return {
    media_key: asset.media_key,
    title: asset.title,
    media_type: asset.media_type,
    storage_provider: asset.storage_provider,
    bucket: asset.bucket,
    storage_path: asset.storage_path,
    public_url: null,
    poster_url: null,
    status: "active",
    metadata: {
      source_oar2: oar2,
      runtime_use: asset.runtime_use,
      frontend_hardcode_allowed: false,
      video_replacement: false,
    },
  }
}

function mappingPayload(asset) {
  return {
    surface_key: asset.surface_key,
    media_key: asset.media_key,
    role: asset.role,
    sequence_index: asset.sequence_index,
    status: "active",
    metadata: {
      source_oar2: oar2,
      runtime_use: asset.runtime_use,
      frontend_hardcode_allowed: false,
    },
  }
}

async function correctHeroVideo() {
  const r2Url = resolveRuntimeMediaUrl({
    storageProvider: "cloudflare_r2",
    bucketName: "measures-media",
    storagePath: "integrity_governance_intro.mp4",
  })
  const r2Retrieval = await retrievalStatus(r2Url)
  if (!r2Retrieval.ok) {
    return {
      corrected: false,
      reason: "expected R2 object did not verify 200",
      expectedR2Url: r2Url,
      expectedR2Retrieval: r2Retrieval,
    }
  }

  const rows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .eq("media_role", "hero_video"),
    "hero_video lookup",
  )

  if (rows.length !== 1) {
    return {
      corrected: false,
      reason: `expected exactly one hero_video row, found ${rows.length}`,
      expectedR2Url: r2Url,
      expectedR2Retrieval: r2Retrieval,
    }
  }

  const row = rows[0]
  const metadata = {
    ...(row.metadata ?? {}),
    corrected_by_oar2: oar2,
    previous_storage_bucket: row.storage_bucket,
    previous_storage_path: row.storage_path,
    storage_provider_note: "measures_media_map has no storage_provider column; measures-media bucket routes through R2 resolver",
    expected_storage_provider: "cloudflare_r2",
  }

  const updated = assertOk(
    await supabase
      .from("measures_media_map")
      .update({
        storage_bucket: "measures-media",
        storage_path: "integrity_governance_intro.mp4",
        is_active: true,
        metadata,
      })
      .eq("id", row.id)
      .select("*"),
    "hero_video update",
  )[0]

  const runtimeUrl = resolveRuntimeMediaUrl({
    bucketName: updated.storage_bucket,
    storagePath: updated.storage_path,
  })
  const runtimeRetrieval = await retrievalStatus(runtimeUrl)

  return {
    corrected: true,
    previous: {
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
    },
    current: {
      storage_bucket: updated.storage_bucket,
      storage_path: updated.storage_path,
      is_active: updated.is_active,
    },
    expectedR2Url: r2Url,
    expectedR2Retrieval: r2Retrieval,
    runtimeUrl,
    runtimeRetrieval,
    storageProviderColumnPresent: false,
  }
}

async function holdStaleRegistryRows() {
  const rows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .in("media_role", staleRegistryRoles),
    "stale registry row lookup",
  )

  const held = []
  for (const row of rows) {
    const currentUrl = resolveRuntimeMediaUrl({
      bucketName: row.storage_bucket,
      storagePath: row.storage_path,
    })
    const currentRetrieval = await retrievalStatus(currentUrl)
    const metadata = {
      ...(row.metadata ?? {}),
      held_by_oar2: oar2,
      hold_reason: currentRetrieval.ok
        ? "named stale row was active but current URL verified; held only because OAR2 named it"
        : "active DB media reference returned non-200 retrieval",
      previous_is_active: row.is_active,
      retrieval_status_at_hold: currentRetrieval.status ?? null,
    }
    const updated = assertOk(
      await supabase
        .from("measures_media_map")
        .update({ is_active: false, metadata })
        .eq("id", row.id)
        .select("*"),
      `hold ${row.media_role}`,
    )[0]

    held.push({
      media_role: row.media_role,
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
      retrieval: currentRetrieval,
      previous_is_active: row.is_active,
      current_is_active: updated.is_active,
      non_destructive_hold: true,
    })
  }

  return {
    activeField: "is_active",
    heldCount: held.length,
    held,
  }
}

async function seatAuthorizedAssets() {
  const validationsBefore = []
  for (const asset of authorizedAssets) {
    const url = resolveRuntimeMediaUrl({
      storageProvider: asset.storage_provider,
      bucketName: asset.bucket,
      storagePath: asset.storage_path,
    })
    validationsBefore.push({
      media_key: asset.media_key,
      bucket: asset.bucket,
      storage_path: asset.storage_path,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }

  const failed = validationsBefore.filter((entry) => !entry.retrieval.ok)
  if (failed.length > 0) {
    return {
      seated: false,
      reason: "authorized target asset failed retrieval validation",
      validationsBefore,
    }
  }

  const assetRows = assertOk(
    await supabase.from("codex_media_asset").upsert(authorizedAssets.map(assetPayload), {
      onConflict: "media_key",
    }).select("*"),
    "authorized codex media asset upsert",
  )

  const mappingRows = assertOk(
    await supabase.from("measures_surface_media_map").upsert(authorizedAssets.map(mappingPayload), {
      onConflict: "surface_key,media_key,role",
    }).select("*"),
    "authorized surface media map upsert",
  )

  const validationRows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, media_key, role, sequence_index, status, metadata, codex_media_asset!inner(media_key,title,media_type,storage_provider,bucket,storage_path,status,metadata)")
      .in("media_key", authorizedAssets.map((asset) => asset.media_key))
      .order("surface_key", { ascending: true }),
    "authorized mapping validation",
  )

  const validationWithRetrieval = []
  for (const row of validationRows) {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    const url = resolveRuntimeMediaUrl({
      storageProvider: asset.storage_provider,
      bucketName: asset.bucket,
      storagePath: asset.storage_path,
      publicUrl: asset.public_url,
    })
    validationWithRetrieval.push({
      surface_key: row.surface_key,
      media_key: row.media_key,
      role: row.role,
      map_status: row.status,
      media_type: asset.media_type,
      storage_provider: asset.storage_provider,
      bucket: asset.bucket,
      storage_path: asset.storage_path,
      asset_status: asset.status,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }

  return {
    seated: true,
    upsertedMediaAssetCount: assetRows.length,
    upsertedMappingCount: mappingRows.length,
    validationsBefore,
    validationWithRetrieval,
  }
}

async function fallbackStanding() {
  const rows = assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("*")
      .in("surface_key", ["temple_antechamber", "epigraph"])
      .order("surface_key", { ascending: true }),
    "fallback standing lookup",
  )

  return {
    deactivatedFallbackCount: 0,
    reasonFallbacksRemainActive:
      "current resolve_encounter runtime only reads measures_surface_media_map for surface_type=chamberplate; temple_antechamber is threshold and epigraph is aspect, so disabling fallback would remove current runtime media before a resolver OAR.",
    rows: rows.map((row) => ({
      id: row.id,
      surface_key: row.surface_key,
      media_type: row.media_type,
      bucket_name: row.bucket_name,
      storage_path: row.storage_path,
      is_active: row.is_active,
      standing: row.surface_key === "epigraph" && row.media_type === "video"
        ? "held; no valid video replacement authorized"
        : "left active until resolver supports governed non-chamberplate mappings",
    })),
  }
}

async function finalRegistryValidation() {
  const roles = ["hero_video", ...staleRegistryRoles]
  const rows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("*")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .in("media_role", roles)
      .order("media_role", { ascending: true }),
    "final registry validation",
  )

  const output = []
  for (const row of rows) {
    const url = resolveRuntimeMediaUrl({
      bucketName: row.storage_bucket,
      storagePath: row.storage_path,
    })
    output.push({
      media_role: row.media_role,
      storage_bucket: row.storage_bucket,
      storage_path: row.storage_path,
      is_active: row.is_active,
      resolvedUrl: url,
      retrieval: await retrievalStatus(url),
    })
  }
  return output
}

async function main() {
  const heroVideo = await correctHeroVideo()
  const staleRows = await holdStaleRegistryRows()
  const seatedAssets = await seatAuthorizedAssets()
  const fallback = await fallbackStanding()
  const registryValidation = await finalRegistryValidation()

  const evidence = {
    oar2,
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    sourceObjectsDeleted: false,
    frontendMutationPerformed: false,
    resolverMutationPerformed: false,
    broadFallbackMigrationPerformed: false,
    copyPerformed: false,
    heroVideo,
    staleRows,
    seatedAssets,
    fallback,
    epigraphVideoStanding: {
      storage_path: "inanna_encounter_intro.mp4",
      standing: "held",
      reason: "no valid epigraph video object authorized; inanna_epigraph.webp seated as image support only",
    },
    copyDecisionAssetsHeld: [
      "obsidian_chamberplate_gate01 (1).jpeg",
      "temple_antechamber_return.webp",
    ],
    registryValidation,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({
    evidencePath,
    mutationPerformed: true,
    heroVideoCorrected: heroVideo.corrected,
    staleRowsHeld: staleRows.heldCount,
    seatedAssets: seatedAssets.upsertedMediaAssetCount ?? 0,
    seatedMappings: seatedAssets.upsertedMappingCount ?? 0,
    deactivatedFallbackCount: fallback.deactivatedFallbackCount,
    sourceObjectsDeleted: false,
    frontendMutationPerformed: false,
    resolverMutationPerformed: false,
    broadFallbackMigrationPerformed: false,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
