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
  "docs/oar/measures_registry/diagnose_passage_runtime_and_enforce_epithet_contract_v1.json"

const passageKeys = [
  "crystal_temple_home",
  "temple_harrumuk_passage",
  "kumurrah_passage",
  "gates_passage_01",
  "gates_passage_02",
  "gates_passage_03",
  "epithets_passage_01",
  "epithets_passage_02",
]

const epithetKeys = [
  "chamber_epithets_01_primus_artus",
  "chamber_epithets_02_gemynd_corpus",
  "chamber_epithets_03_percipari",
]

const primusFeaturedVideoPlan = {
  surface_key: "chamber_epithets_01_primus_artus",
  media_key: "chamber_epithets_01_primus_artus_featured_video_primus_artus_obsidian_tone_v1",
  title: "Primus Artus Featured Video",
  media_type: "video",
  storage_provider: "cloudflare_r2",
  bucket: "measures-media",
  storage_path: "primus_artus_obsidian_tone.MOV",
  role: "featured_video",
  sequence_index: 10,
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

async function inspectLiveBundle() {
  const html = await fetch("https://www.measuresofinanna.com/").then((response) => response.text())
  const assetPath = (html.match(/assets\/[^"' ]+\.js/) || [])[0] ?? null
  const js = assetPath
    ? await fetch(`https://www.measuresofinanna.com/${assetPath}`).then((response) => response.text())
    : ""

  return {
    assetPath,
    htmlTitle: (html.match(/<title>([^<]+)<\/title>/i) || [])[1] ?? null,
    hasPassageLookup: js.includes('"passage"') && js.includes("threshold") && js.includes("chamberplate"),
    hasOriginalArtworkMarker: js.includes("original_artwork"),
    hasSurfaceTypeDataAttribute: js.includes("data-surface-type"),
  }
}

async function inspectPassageStanding() {
  const encounterRows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, surface_type, metadata, measures_registry!inner(registry_key)")
      .in("measures_registry.registry_key", passageKeys),
    "passage encounter lookup",
  )

  const mediaRows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, role, sequence_index, status, metadata, codex_media_asset!inner(media_key, media_type, storage_provider, bucket, storage_path, public_url, status)",
      )
      .in("surface_key", passageKeys)
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "passage media lookup",
  )

  const byKey = new Map()
  for (const key of passageKeys) byKey.set(key, { media: [], encounter: null })

  for (const row of encounterRows) {
    const registry = Array.isArray(row.measures_registry) ? row.measures_registry[0] : row.measures_registry
    if (!registry?.registry_key) continue
    byKey.set(registry.registry_key, {
      ...(byKey.get(registry.registry_key) ?? { media: [], encounter: null }),
      encounter: {
        encounter_key: row.encounter_key,
        surface_type: row.surface_type,
        renderer_layout: row.metadata?.renderer?.layout ?? null,
        video_mode: row.metadata?.playback?.video_mode ?? row.metadata?.playback?.videoMode ?? null,
        auto_advance_on_video_end:
          row.metadata?.playback?.auto_advance_on_video_end ??
          row.metadata?.playback?.autoAdvanceOnVideoEnd ??
          null,
      },
    })
  }

  for (const row of mediaRows) {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    const url = resolveRuntimeMediaUrl(asset)
    byKey.get(row.surface_key)?.media.push({
      role: row.role,
      media_key: asset.media_key,
      media_type: asset.media_type,
      storage_provider: asset.storage_provider,
      bucket: asset.bucket,
      storage_path: asset.storage_path,
      render_behavior: row.metadata?.render_behavior ?? null,
      retrieval: await retrievalStatus(url),
    })
  }

  return Object.fromEntries(byKey)
}

async function inspectEpithetStanding() {
  const rows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select(
        "surface_key, role, sequence_index, status, metadata, codex_media_asset!inner(media_key, media_type, storage_provider, bucket, storage_path, public_url, status)",
      )
      .in("surface_key", epithetKeys)
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "epithet media lookup",
  )

  const byKey = new Map()
  for (const key of epithetKeys) byKey.set(key, [])

  for (const row of rows) {
    const asset = Array.isArray(row.codex_media_asset) ? row.codex_media_asset[0] : row.codex_media_asset
    const url = resolveRuntimeMediaUrl(asset)
    byKey.get(row.surface_key)?.push({
      role: row.role,
      media_key: asset.media_key,
      media_type: asset.media_type,
      storage_provider: asset.storage_provider,
      bucket: asset.bucket,
      storage_path: asset.storage_path,
      render_behavior: row.metadata?.render_behavior ?? null,
      retrieval: await retrievalStatus(url),
    })
  }

  return Object.fromEntries(byKey)
}

async function seatPrimusFeaturedVideo() {
  const url = resolveRuntimeMediaUrl(primusFeaturedVideoPlan)
  const retrieval = await retrievalStatus(url)
  if (retrieval.status !== 200) {
    throw new Error(`Primus featured video source expected 200, got ${retrieval.status ?? "no status"}`)
  }

  const assetUpsert = assertOk(
    await supabase
      .from("codex_media_asset")
      .upsert(
        {
          media_key: primusFeaturedVideoPlan.media_key,
          title: primusFeaturedVideoPlan.title,
          media_type: primusFeaturedVideoPlan.media_type,
          storage_provider: primusFeaturedVideoPlan.storage_provider,
          bucket: primusFeaturedVideoPlan.bucket,
          storage_path: primusFeaturedVideoPlan.storage_path,
          public_url: null,
          poster_url: null,
          status: "active",
          metadata: {
            source_oar2: "oar2_diagnose_passage_runtime_and_enforce_epithet_contract_v1",
            runtime_use: "primus_artus featured governed motion",
            frontend_hardcode_allowed: false,
          },
        },
        { onConflict: "media_key" },
      )
      .select("media_key, title, media_type, storage_provider, bucket, storage_path, status"),
    "primus featured asset upsert",
  )

  const mappingUpsert = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .upsert(
        {
          surface_key: primusFeaturedVideoPlan.surface_key,
          media_key: primusFeaturedVideoPlan.media_key,
          role: primusFeaturedVideoPlan.role,
          sequence_index: primusFeaturedVideoPlan.sequence_index,
          status: "active",
          metadata: {
            source_oar2: "oar2_diagnose_passage_runtime_and_enforce_epithet_contract_v1",
            render_behavior: "autoplay_after_passage",
            featured: true,
            audio_embedded: true,
            show_text_overlay: false,
            skip_enabled: true,
            on_complete: "reveal_chamberplate_aspects",
            on_skip: "reveal_chamberplate_aspects",
            frontend_hardcode_allowed: false,
          },
        },
        { onConflict: "surface_key,media_key,role" },
      )
      .select("surface_key, media_key, role, sequence_index, status"),
    "primus featured mapping upsert",
  )

  return {
    sourceVerification: {
      url,
      retrieval,
    },
    assetUpsert,
    mappingUpsert,
  }
}

async function main() {
  const liveBundle = await inspectLiveBundle()
  const primusRepair = await seatPrimusFeaturedVideo()
  const passageStanding = await inspectPassageStanding()
  const epithetStanding = await inspectEpithetStanding()

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    mutationCount: primusRepair.assetUpsert.length + primusRepair.mappingUpsert.length,
    liveBundle,
    localRuntimeRepairsPlanned: [
      "emit resolution.surfaceType as encounter class for passage/threshold styling contracts",
      "allow original_artwork to act as settled still fallback when oracle_card is absent",
      "exclude current settled still from click-to-open aspect rail",
    ],
    passageStanding,
    epithetStanding,
    primusRepair,
    boundedHolds: [
      {
        surface_key: "chamber_epithets_03_percipari",
        reason: "no verified featured governed motion source returned 200",
      },
      {
        surface_key: "gate_2_lapis_beads",
        reason: "held-source boundary preserved",
      },
      {
        surface_key: "inanna_seat",
        reason: "held-source boundary preserved",
      },
      {
        surface_key: "gates_passage_02",
        reason: "held-source boundary preserved",
      },
      {
        surface_key: "gates_passage_03",
        reason: "held-source boundary preserved",
      },
      {
        surface_key: "me_01",
        reason: "held-source boundary preserved",
      },
    ],
    frontendHardcodedMediaPathsIntroduced: false,
    fallbackAuthorityRestored: false,
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(
    JSON.stringify({
      evidencePath,
      mutationCount: evidence.mutationCount,
      liveAssetPath: liveBundle.assetPath,
    }),
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
