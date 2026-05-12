require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = process.env.VITE_R2_PUBLIC_BASE_URL?.replace(/\/+$/g, "") ?? ""

if (!serviceUrl || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const evidencePath =
  "docs/oar/measures_registry/repair_inanna_governed_media_authority_across_passages_v1.json"

const assetPlans = [
  {
    surface_key: "crystal_temple_home",
    media_key: "pre_codex_exhibition_crystal_temple_image_v1",
    title: "Crystal Temple Home",
    media_type: "image",
    storage_provider: "supabase",
    bucket: "measures-registry",
    storage_path: "measures_registry/pre_codex_exhibition/images/crystal_temple_home.webp",
    role: "image",
    sequence_index: 10,
    runtime_use: "crystal_temple_home still image",
    expected_status: 200,
  },
  {
    surface_key: "temple_harrumuk_passage",
    media_key: "pre_codex_exhibition_harrumuk_passage_video_v1",
    title: "Harrumuk Passage",
    media_type: "video",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: "harrumuk_passage.mp4",
    role: "featured_video",
    sequence_index: 10,
    runtime_use: "temple_harrumuk_passage featured video",
    expected_status: 200,
  },
  {
    surface_key: "kumurrah_passage",
    media_key: "pre_codex_exhibition_kumurrah_passage_video_v1",
    title: "Kumurrah Passage",
    media_type: "video",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: "kumurrah_passage.mp4",
    role: "featured_video",
    sequence_index: 10,
    runtime_use: "kumurrah_passage featured video",
    expected_status: 200,
  },
  {
    surface_key: "gates_passage_01",
    media_key: "pre_codex_exhibition_gates_passage_01_video_v1",
    title: "Gates Passage 01",
    media_type: "video",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: "gates_passage_01.mp4",
    role: "featured_video",
    sequence_index: 10,
    runtime_use: "gates_passage_01 featured video",
    expected_status: 200,
  },
  {
    surface_key: "epithets_passage_01",
    media_key: "pre_codex_exhibition_epithets_passage_01_video_v1",
    title: "Epithets Passage 01",
    media_type: "video",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: "epithet_passage_01.mp4",
    role: "featured_video",
    sequence_index: 10,
    runtime_use: "epithets_passage_01 featured video",
    expected_status: 200,
  },
]

const mappingReusePlans = [
  {
    surface_key: "epithets_passage_02",
    media_key: "pre_codex_exhibition_epithets_passage_01_video_v1",
    role: "featured_video",
    sequence_index: 10,
    runtime_use: "epithets_passage_02 reuses explicit passage video from session_25 apply_passage_01_media_reuse_patch",
  },
]

const rendererRepairKeys = ["gates_passage_02", "gates_passage_03"]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function resolveRuntimeMediaUrl(input) {
  if (!input) return null
  if (input.public_url) return input.public_url
  if (!input.bucket || !input.storage_path) return null

  if (input.storage_provider === "cloudflare_r2" || input.bucket === "measures-media") {
    return r2BaseUrl ? `${r2BaseUrl}/${encodeObjectKey(input.storage_path.replace(/^\/+|\/+$/g, ""))}` : null
  }

  return `${serviceUrl}/storage/v1/object/public/${input.bucket}/${encodeObjectKey(input.storage_path)}`
}

async function retrievalStatus(url) {
  if (!url) return { tested: false, ok: false, reason: "no resolved url" }
  try {
    const response = await fetch(url, { method: "HEAD" })
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

function assetPayload(plan, existingMetadata = null) {
  return {
    media_key: plan.media_key,
    title: plan.title,
    media_type: plan.media_type,
    storage_provider: plan.storage_provider,
    bucket: plan.bucket,
    storage_path: plan.storage_path,
    public_url: null,
    poster_url: null,
    status: "active",
    metadata: {
      ...(existingMetadata ?? {}),
      source_oar2: "oar2_repair_inanna_governed_media_authority_across_passages_v1",
      runtime_use: plan.runtime_use,
      frontend_hardcode_allowed: false,
    },
  }
}

function mappingPayload(plan) {
  return {
    surface_key: plan.surface_key,
    media_key: plan.media_key,
    role: plan.role,
    sequence_index: plan.sequence_index,
    status: "active",
    metadata: {
      source_oar2: "oar2_repair_inanna_governed_media_authority_across_passages_v1",
      runtime_use: plan.runtime_use,
      frontend_hardcode_allowed: false,
    },
  }
}

async function validatePlanSources() {
  const validations = []
  for (const plan of assetPlans) {
    const url = resolveRuntimeMediaUrl(plan)
    const retrieval = await retrievalStatus(url)
    validations.push({
      media_key: plan.media_key,
      surface_key: plan.surface_key,
      url,
      retrieval,
    })
    if (retrieval.status !== plan.expected_status) {
      throw new Error(
        `Expected ${plan.media_key} to return ${plan.expected_status}, got ${retrieval.status ?? "no status"}`,
      )
    }
  }
  return validations
}

async function upsertAssetsAndMappings() {
  const existingAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key, metadata")
      .in("media_key", assetPlans.map((plan) => plan.media_key)),
    "existing codex media asset lookup",
  )

  const existingAssetMap = new Map(existingAssets.map((row) => [row.media_key, row]))

  const upsertedAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .upsert(
        assetPlans.map((plan) =>
          assetPayload(plan, existingAssetMap.get(plan.media_key)?.metadata ?? null),
        ),
        { onConflict: "media_key" },
      )
      .select("media_key, title, media_type, storage_provider, bucket, storage_path, status"),
    "codex media asset upsert",
  )

  const mappingRows = [...assetPlans, ...mappingReusePlans].map(mappingPayload)
  const upsertedMappings = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .upsert(mappingRows, { onConflict: "surface_key,media_key,role" })
      .select("surface_key, media_key, role, sequence_index, status"),
    "surface media map upsert",
  )

  return { upsertedAssets, upsertedMappings }
}

async function repairSingleSurfaceRenderers() {
  const repaired = []
  for (const key of rendererRepairKeys) {
    const registry = assertOk(
      await supabase.from("measures_registry").select("id, registry_key").eq("registry_key", key).single(),
      `registry lookup for ${key}`,
    )

    const encounterRows = assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id, encounter_key, metadata")
        .eq("registry_id", registry.id),
      `encounter lookup for ${key}`,
    )

    for (const row of encounterRows) {
      const metadata = row.metadata ?? {}
      const renderer = { ...(metadata.renderer ?? {}) }
      const previousLayout = renderer.layout ?? null
      renderer.layout = "passage_only"
      renderer.media_fit = renderer.media_fit ?? "contain"
      renderer.show_action_rail = false

      const updatedMetadata = { ...metadata, renderer }

      await assertOk(
        await supabase
          .from("measures_encounter_def")
          .update({ metadata: updatedMetadata })
          .eq("id", row.id)
          .select("id"),
        `renderer update for ${row.encounter_key}`,
      )

      repaired.push({
        registry_key: key,
        encounter_key: row.encounter_key,
        previous_layout: previousLayout,
        current_layout: renderer.layout,
      })
    }
  }
  return repaired
}

async function validateMappings() {
  const surfaces = [
    "crystal_temple_home",
    "temple_harrumuk_passage",
    "kumurrah_passage",
    "gates_passage_01",
    "epithets_passage_01",
    "epithets_passage_02",
  ]

  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, media_key, role, sequence_index, status, metadata, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,status)",
      )
      .in("surface_key", surfaces)
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "post-upsert validation lookup",
  )

  const validated = []
  for (const row of rows) {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    const url = resolveRuntimeMediaUrl(asset)
    validated.push({
      surface_key: row.surface_key,
      media_key: row.media_key,
      role: row.role,
      media_type: asset.media_type,
      storage_provider: asset.storage_provider,
      bucket: asset.bucket,
      storage_path: asset.storage_path,
      resolved_url: url,
      retrieval: await retrievalStatus(url),
    })
  }
  return validated
}

async function inspectHeldItems() {
  const held = []

  const fallbackRows = assertOk(
    await supabase
      .from("temp_exhibition_media")
      .select("surface_key, media_type, bucket_name, storage_path, render_order, is_active")
      .in("surface_key", ["inanna_seat", "inanna_seat_view", "gates_passage_02", "gates_passage_03", "me_01"])
      .order("surface_key", { ascending: true })
      .order("render_order", { ascending: true }),
    "held fallback lookup",
  )

  held.push({
    surface_key: "inanna_seat",
    reason: "no verified governed source object was confirmed for the seated runtime still",
    fallback_rows: fallbackRows.filter((row) => row.surface_key === "inanna_seat" || row.surface_key === "inanna_seat_view"),
  })

  held.push({
    surface_key: "gates_passage_02",
    reason: "single_surface renderer was repaired, but no uniquely verified governed source object was confirmed beyond ambiguous legacy fallback reuse",
    fallback_rows: fallbackRows.filter((row) => row.surface_key === "gates_passage_02"),
  })

  held.push({
    surface_key: "gates_passage_03",
    reason: "single_surface renderer was repaired, but no verified governed source object was available",
    fallback_rows: fallbackRows.filter((row) => row.surface_key === "gates_passage_03"),
  })

  held.push({
    surface_key: "me_01",
    reason: "no verified governed source image was confirmed for me_01 chamberplate runtime",
    fallback_rows: fallbackRows.filter((row) => row.surface_key === "me_01"),
  })

  return held
}

async function main() {
  const sourceValidations = await validatePlanSources()
  const { upsertedAssets, upsertedMappings } = await upsertAssetsAndMappings()
  const rendererRepairs = await repairSingleSurfaceRenderers()
  const mappingValidation = await validateMappings()
  const heldItems = await inspectHeldItems()

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    mutationCount:
      upsertedAssets.length + upsertedMappings.length + rendererRepairs.length + 1,
    changedFiles: [
      "src/measures_of_inanna/resolve_encounter.ts",
      "docs/oar/measures_registry/execute-diagnose-inanna-full-encounter-matrix.cjs",
    ],
    changedRows: {
      codex_media_asset: upsertedAssets.length,
      measures_surface_media_map: upsertedMappings.length,
      measures_encounter_def: rendererRepairs.length,
    },
    governedLookupRepair: {
      addedSurfaceType: "passage",
      frontendHardcodedMediaPathsIntroduced: false,
    },
    sourceValidations,
    upsertedAssets,
    upsertedMappings,
    rendererRepairs,
    mappingValidation,
    heldItems,
    fallbackDeletionPerformed: false,
    supabaseLargeMediaDriftIntroduced: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      changedAssetRows: upsertedAssets.length,
      changedMappingRows: upsertedMappings.length,
      rendererRepairs: rendererRepairs.length,
      heldItemCount: heldItems.length,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
