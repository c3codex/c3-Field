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
  "docs/oar/measures_registry/repair_governed_chamberplate_media_authority_v1.json"

const governedPlans = [
  {
    surface_key: "gate_1_crown_removed",
    media_key: "pre_codex_exhibition_obsidian_chamberplate_gate01_video_v1",
    expected: {
      media_type: "video",
      storage_provider: "cloudflare_r2",
      bucket: "measures-media",
      storage_path: "obsidian_chamberplate_gate01.mov",
      status: 200,
    },
    mapping: {
      role: "featured_video",
      sequence_index: 10,
    },
    runtime_use: "gate_1_crown_removed governed chamberplate motion",
  },
  {
    surface_key: "gate_1_crown_removed",
    media_key: "pre_codex_exhibition_obsidian_chamberplate_gate01_image_v1",
    expected: {
      media_type: "image",
      storage_provider: "supabase",
      bucket: "measures-registry",
      storage_path: "measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate01.webp",
      status: 200,
    },
    mapping: {
      role: "image",
      sequence_index: 20,
    },
    runtime_use: "gate_1_crown_removed governed chamberplate still fallback",
  },
  {
    surface_key: "gate_3_lapis_necklace",
    media_key: "pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1",
    expected: {
      media_type: "image",
      storage_provider: "supabase",
      bucket: "measures-registry",
      storage_path: "measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate03.webp",
      status: 200,
    },
    mapping: {
      role: "image",
      sequence_index: 20,
    },
    runtime_use: "gate_3_lapis_necklace governed chamberplate still authority",
  },
]

const heldSourceChecks = [
  {
    surface_key: "gate_2_lapis_beads",
    label: "gate_2_lapis_beads image",
    url: `${r2BaseUrl}/obsidian_chamberplate_gate02.webp`,
  },
  {
    surface_key: "gate_2_lapis_beads",
    label: "gate_2_lapis_beads video",
    url: `${r2BaseUrl}/obsidian_chamberplate_gate02.mp4`,
  },
]

const percipariOracleMapping = {
  surface_key: "chamber_epithets_03_percipari",
  media_key: "chamber_epithets_03_percipari_oracle_card_v1",
  role: "oracle_card",
}

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
    return r2BaseUrl
      ? `${r2BaseUrl}/${encodeObjectKey(input.storage_path.replace(/^\/+|\/+$/g, ""))}`
      : null
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

function withRepairMetadata(existingMetadata, plan) {
  return {
    ...(existingMetadata ?? {}),
    source_oar2: "oar2_repair_governed_chamberplate_media_authority_v1",
    runtime_use: plan.runtime_use,
    frontend_hardcode_allowed: false,
    governed_chamberplate_authority_verified: true,
  }
}

async function verifyGovernedSources() {
  const existingAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key, title, media_type, storage_provider, bucket, storage_path, status, metadata")
      .in(
        "media_key",
        governedPlans.map((plan) => plan.media_key),
      ),
    "governed asset lookup",
  )

  const assetMap = new Map(existingAssets.map((row) => [row.media_key, row]))
  const validations = []

  for (const plan of governedPlans) {
    const asset = assetMap.get(plan.media_key)
    if (!asset) {
      throw new Error(`Missing codex_media_asset row for ${plan.media_key}`)
    }

    const expected = plan.expected
    if (
      asset.media_type !== expected.media_type ||
      asset.storage_provider !== expected.storage_provider ||
      asset.bucket !== expected.bucket ||
      asset.storage_path !== expected.storage_path
    ) {
      throw new Error(`Asset contract mismatch for ${plan.media_key}`)
    }

    const url = resolveRuntimeMediaUrl(asset)
    const retrieval = await retrievalStatus(url)
    validations.push({
      surface_key: plan.surface_key,
      media_key: plan.media_key,
      url,
      retrieval,
    })

    if (retrieval.status !== expected.status) {
      throw new Error(
        `Expected ${plan.media_key} to return ${expected.status}, got ${retrieval.status ?? "no status"}`,
      )
    }
  }

  return { assetMap, validations }
}

async function verifyHeldGate2() {
  const checks = []
  for (const entry of heldSourceChecks) {
    checks.push({
      ...entry,
      retrieval: await retrievalStatus(entry.url),
    })
  }
  return checks
}

async function upsertGovernedMappings(assetMap) {
  const assetRows = governedPlans.map((plan) => {
    const asset = assetMap.get(plan.media_key)
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
      metadata: withRepairMetadata(asset.metadata, plan),
    }
  })

  const upsertedAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .upsert(assetRows, { onConflict: "media_key" })
      .select("media_key, title, media_type, storage_provider, bucket, storage_path, status"),
    "asset metadata repair upsert",
  )

  const upsertedMappings = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .upsert(
        governedPlans.map((plan) => ({
          surface_key: plan.surface_key,
          media_key: plan.media_key,
          role: plan.mapping.role,
          sequence_index: plan.mapping.sequence_index,
          status: "active",
          metadata: {
            source_oar2: "oar2_repair_governed_chamberplate_media_authority_v1",
            runtime_use: plan.runtime_use,
            governed_precedence: plan.mapping.role === "featured_video" ? "primary" : "fallback_support",
            frontend_hardcode_allowed: false,
          },
        })),
        { onConflict: "surface_key,media_key,role" },
      )
      .select("surface_key, media_key, role, sequence_index, status"),
    "governed mapping upsert",
  )

  return { upsertedAssets, upsertedMappings }
}

async function deactivateBrokenPercipariOracle() {
  const lookup = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, media_key, role, sequence_index, status, metadata")
      .eq("surface_key", percipariOracleMapping.surface_key)
      .eq("media_key", percipariOracleMapping.media_key)
      .eq("role", percipariOracleMapping.role)
      .maybeSingle(),
    "percipari oracle mapping lookup",
  )

  if (!lookup) {
    return { changed: false, row: null }
  }

  const asset = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key, title, media_type, storage_provider, bucket, storage_path, status, metadata")
      .eq("media_key", percipariOracleMapping.media_key)
      .single(),
    "percipari oracle asset lookup",
  )

  const url = resolveRuntimeMediaUrl(asset)
  const retrieval = await retrievalStatus(url)

  if (retrieval.status === 200) {
    return {
      changed: false,
      row: {
        ...lookup,
        retrieval,
        resolved_url: url,
      },
    }
  }

  const updated = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .update({
        status: "inactive",
        metadata: {
          ...(lookup.metadata ?? {}),
          source_oar2: "oar2_repair_governed_chamberplate_media_authority_v1",
          deactivated_reason: "verified_runtime_404",
          deactivated_verified_url: url,
          frontend_hardcode_allowed: false,
        },
      })
      .eq("surface_key", percipariOracleMapping.surface_key)
      .eq("media_key", percipariOracleMapping.media_key)
      .eq("role", percipariOracleMapping.role)
      .select("surface_key, media_key, role, sequence_index, status"),
    "percipari oracle mapping deactivate",
  )

  return {
    changed: true,
    row: updated[0] ?? null,
    retrieval,
    resolved_url: url,
  }
}

async function validateSurfaceMappings() {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, media_key, role, sequence_index, status, metadata, codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,public_url,status,metadata)",
      )
      .in("surface_key", [
        "gate_1_crown_removed",
        "gate_3_lapis_necklace",
        "chamber_epithets_03_percipari",
      ])
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "post-repair mapping validation",
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

async function inspectRemainingHeldSurfaces() {
  return assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key, media_key, role, sequence_index, status")
      .in("surface_key", ["gate_2_lapis_beads", "inanna_seat", "gates_passage_02", "gates_passage_03", "me_01"])
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "held surface standing lookup",
  )
}

async function main() {
  const { assetMap, validations } = await verifyGovernedSources()
  const gate2Checks = await verifyHeldGate2()
  const { upsertedAssets, upsertedMappings } = await upsertGovernedMappings(assetMap)
  const percipariOracleRepair = await deactivateBrokenPercipariOracle()
  const mappingValidation = await validateSurfaceMappings()
  const heldSurfaceStanding = await inspectRemainingHeldSurfaces()

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    mutationCount:
      upsertedAssets.length +
      upsertedMappings.length +
      (percipariOracleRepair.changed ? 1 : 0),
    changedFiles: [],
    changedRows: {
      codex_media_asset: upsertedAssets.length,
      measures_surface_media_map:
        upsertedMappings.length + (percipariOracleRepair.changed ? 1 : 0),
    },
    governedSourceValidations: validations,
    heldGate2Checks: gate2Checks,
    upsertedAssets,
    upsertedMappings,
    percipariOracleRepair,
    mappingValidation,
    heldSurfaceStanding,
    fallbackDeletionPerformed: false,
    frontendHardcodedMediaPathsIntroduced: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      changedAssetRows: upsertedAssets.length,
      changedMappingRows: upsertedMappings.length + (percipariOracleRepair.changed ? 1 : 0),
      heldGate2Checks: gate2Checks.length,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
