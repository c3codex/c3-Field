require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const serviceUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = (process.env.VITE_R2_PUBLIC_BASE_URL || "").replace(/\/+$/g, "")

if (!serviceUrl || !serviceKey || !r2BaseUrl) {
  throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and VITE_R2_PUBLIC_BASE_URL are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const evidencePath =
  "docs/oar/measures_registry/refine_ceremonial_traversal_and_installation_tones_v1.json"

const toneAssets = [
  {
    media_key: "installation_tone_crystal_rise_return_v1",
    title: "Installation Crystal Tone",
    tone_family: "crystal",
    storage_path: "crystal_tone_rise_return_5min.wav",
  },
  {
    media_key: "installation_tone_lapis_rise_return_v1",
    title: "Installation Lapis Tone",
    tone_family: "lapis",
    storage_path: "lapis_tone_rise_return_5min.wav",
  },
  {
    media_key: "installation_tone_obsidian_rise_return_v1",
    title: "Installation Obsidian Tone",
    tone_family: "obsidian",
    storage_path: "obsidian_tone_rise_return_5min.wav",
  },
  {
    media_key: "installation_tone_marble_rise_return_v1",
    title: "Installation Marble Tone",
    tone_family: "marble",
    storage_path: "marble_tone_rise_return_5min.wav",
  },
]

const toneSurfacePlans = [
  { surface_key: "epigraph", media_key: "installation_tone_crystal_rise_return_v1", sequence_index: 90 },
  { surface_key: "crystal_temple_home", media_key: "installation_tone_crystal_rise_return_v1", sequence_index: 90 },
  { surface_key: "kumurrah_passage", media_key: "installation_tone_lapis_rise_return_v1", sequence_index: 90 },
  { surface_key: "temple_antechamber", media_key: "installation_tone_lapis_rise_return_v1", sequence_index: 90 },
  { surface_key: "temple_harrumuk_passage", media_key: "installation_tone_obsidian_rise_return_v1", sequence_index: 90 },
  { surface_key: "gates_passage_01", media_key: "installation_tone_obsidian_rise_return_v1", sequence_index: 90 },
  { surface_key: "me_01", media_key: "installation_tone_marble_rise_return_v1", sequence_index: 90 },
]

const encounterKeysToPatch = [
  "crystal_temple_home_view",
  "kumurrah_passage",
  "temple_harrumuk_passage_view",
  "gates_passage_01_encounter",
  "gates_passage_02_encounter",
  "gates_passage_03_encounter",
  "epithets_passage_01_encounter",
  "epithets_passage_02_encounter",
  "gate_2_lapis_beads_encounter",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function retrievalStatus(url) {
  const response = await fetch(url, { method: "HEAD" })
  return {
    url,
    ok: response.ok,
    status: response.status,
    contentType: response.headers.get("content-type"),
    contentLength: response.headers.get("content-length"),
  }
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function upsertPlaybackContract(metadata, patch) {
  const next = clone(metadata ?? {})
  const playback = typeof next.playback === "object" && next.playback && !Array.isArray(next.playback)
    ? { ...next.playback }
    : {}

  Object.assign(playback, patch)
  next.playback = playback
  return next
}

function upsertPresentationPlayback(metadata, patch) {
  const next = clone(metadata ?? {})
  const presentation =
    typeof next.presentation === "object" && next.presentation && !Array.isArray(next.presentation)
      ? { ...next.presentation }
      : {}
  const playback =
    typeof presentation.playback === "object" && presentation.playback && !Array.isArray(presentation.playback)
      ? { ...presentation.playback }
      : {}

  Object.assign(playback, patch)
  presentation.playback = playback
  next.presentation = presentation
  return next
}

function patchCrystalTemple(metadata) {
  const next = upsertPlaybackContract(
    upsertPresentationPlayback(metadata, {
      audio_mode: "separate_tonal_audio",
      video_mode: "still_choice",
      settle_to_still: false,
      auto_advance_on_video_end: false,
    }),
    {
      fade_ms: 900,
      settle_ms: 1800,
      auto_advance_on_video_end: false,
    },
  )

  if (Array.isArray(next.actions)) {
    next.actions = next.actions.map((action) => {
      if (!action || typeof action !== "object") return action
      if (action.id !== "enter_antechamber") return action
      return {
        ...action,
        target_registry_key: "kumurrah_passage",
        target_after_passage: "temple_antechamber",
      }
    })
  }

  if (
    next.presentation &&
    typeof next.presentation === "object" &&
    next.presentation.choice_behaviors &&
    typeof next.presentation.choice_behaviors === "object"
  ) {
    const left = next.presentation.choice_behaviors.left
    if (left && typeof left === "object") {
      next.presentation.choice_behaviors = {
        ...next.presentation.choice_behaviors,
        left: {
          ...left,
          target_registry_key: "kumurrah_passage",
          target_after_passage: "temple_antechamber",
        },
      }
    }
  }

  next.contract_source_oar2 = "oar2_refine_ceremonial_traversal_and_installation_tones_v1"
  return next
}

function patchPassageEncounter(metadata, autoAdvanceTo) {
  const next = upsertPlaybackContract(
    upsertPresentationPlayback(metadata, {
      audio_mode: "separate_tonal_audio",
      video_mode: "muted_autoplay",
      settle_to_still: false,
      advance_delay_ms: 3400,
      auto_advance_on_video_end: true,
    }),
    {
      mode: "video_passage",
      fade_ms: 900,
      settle_ms: 2200,
      advance_delay_ms: 3400,
      auto_advance_on_video_end: true,
    },
  )

  if (autoAdvanceTo) next.auto_advance_to = autoAdvanceTo
  next.contract_source_oar2 = "oar2_refine_ceremonial_traversal_and_installation_tones_v1"
  return next
}

function patchGate2Encounter(metadata) {
  const next = clone(metadata ?? {})
  if (Array.isArray(next.actions)) {
    next.actions = next.actions.map((action) => {
      if (!action || typeof action !== "object") return action
      if (action.id !== "continue_descent_to_gate_03") return action
      return {
        ...action,
        target_registry_key: "gates_passage_01",
        target_after_passage: "gate_3_lapis_necklace",
      }
    })
  }

  next.contract_source_oar2 = "oar2_refine_ceremonial_traversal_and_installation_tones_v1"
  return next
}

async function main() {
  const toneChecks = []
  for (const asset of toneAssets) {
    const url = `${r2BaseUrl}/${encodeURIComponent(asset.storage_path)}`
    const retrieval = await retrievalStatus(url)
    toneChecks.push({ media_key: asset.media_key, storage_path: asset.storage_path, retrieval })
    if (!retrieval.ok) {
      throw new Error(`Tone retrieval failed for ${asset.storage_path}: ${retrieval.status}`)
    }
  }

  const toneAssetRows = toneAssets.map((asset) => ({
    media_key: asset.media_key,
    title: asset.title,
    media_type: "audio",
    storage_provider: "cloudflare_r2",
    bucket: "measures-media",
    storage_path: asset.storage_path,
    public_url: null,
    poster_url: null,
    status: "active",
    metadata: {
      source_oar2: "oar2_refine_ceremonial_traversal_and_installation_tones_v1",
      runtime_use: `${asset.tone_family} installation tone`,
      tone_family: asset.tone_family,
      audio_role: "installation_tone",
      frontend_hardcode_allowed: false,
    },
  }))

  const upsertedToneAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .upsert(toneAssetRows, { onConflict: "media_key" })
      .select("media_key,title,storage_path,status"),
    "tone asset upsert",
  )

  const toneMapRows = toneSurfacePlans.map((plan) => {
    const toneAsset = toneAssets.find((asset) => asset.media_key === plan.media_key)
    return {
      surface_key: plan.surface_key,
      media_key: plan.media_key,
      role: "audio",
      sequence_index: plan.sequence_index,
      status: "active",
      metadata: {
        source_oar2: "oar2_refine_ceremonial_traversal_and_installation_tones_v1",
        runtime_use: `${plan.surface_key} installation tone`,
        tone_family: toneAsset?.tone_family ?? null,
        audio_role: "installation_tone",
        render_behavior: "audio_play",
        default_volume: plan.surface_key.includes("passage") ? 0.16 : 0.12,
        contract_excluded_from_universal_slots: true,
        frontend_hardcode_allowed: false,
      },
    }
  })

  const upsertedToneMaps = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .upsert(toneMapRows, { onConflict: "surface_key,media_key,role" })
      .select("surface_key,media_key,role,sequence_index,status"),
    "tone map upsert",
  )

  const encounterRows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .in("encounter_key", encounterKeysToPatch),
    "encounter lookup",
  )

  const encounterMap = new Map(encounterRows.map((row) => [row.encounter_key, row]))
  const updates = []

  for (const encounterKey of encounterKeysToPatch) {
    const row = encounterMap.get(encounterKey)
    if (!row) continue

    let patched = clone(row.metadata ?? {})
    if (encounterKey === "crystal_temple_home_view") {
      patched = patchCrystalTemple(patched)
    } else if (encounterKey === "kumurrah_passage") {
      patched = patchPassageEncounter(patched, "temple_antechamber")
    } else if (encounterKey === "temple_harrumuk_passage_view") {
      patched = patchPassageEncounter(patched, "phase_map")
    } else if (encounterKey === "gates_passage_01_encounter") {
      patched = patchPassageEncounter(patched, "gate_2_lapis_beads")
    } else if (encounterKey === "gates_passage_02_encounter") {
      patched = patchPassageEncounter(patched, "gate_3_lapis_necklace")
    } else if (encounterKey === "gates_passage_03_encounter") {
      patched = patchPassageEncounter(patched, "gate_3_lapis_necklace")
    } else if (encounterKey === "epithets_passage_01_encounter") {
      patched = patchPassageEncounter(patched, "chamber_epithets_02_gemynd_corpus")
    } else if (encounterKey === "epithets_passage_02_encounter") {
      patched = patchPassageEncounter(patched, "chamber_epithets_03_percipari")
    } else if (encounterKey === "gate_2_lapis_beads_encounter") {
      patched = patchGate2Encounter(patched)
    }

    updates.push({
      id: row.id,
      encounter_key: encounterKey,
      metadata: patched,
    })
  }

  const updatedEncounters = []
  for (const update of updates) {
    const data = assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ metadata: update.metadata })
        .eq("id", update.id)
        .select("encounter_key, metadata")
        .single(),
      `encounter update ${update.encounter_key}`,
    )
    updatedEncounters.push(data)
  }

  const validationRows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key,role,sequence_index,metadata,codex_media_asset!inner(media_key,storage_path,storage_provider,status)")
      .in("surface_key", toneSurfacePlans.map((plan) => plan.surface_key))
      .eq("role", "audio")
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "tone validation",
  )

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    source_oar2: "oar2_refine_ceremonial_traversal_and_installation_tones_v1",
    toneChecks,
    upsertedToneAssets,
    upsertedToneMaps,
    updatedEncounterKeys: updatedEncounters.map((row) => row.encounter_key),
    validationRows,
    notes: [
      "Phase Map gate-family traversal now routes through existing return_target in frontend runtime.",
      "Epithet full-song and material-tone roles were not collapsed or reseated.",
      "Passage auto-advance timing is governed through playback.advance_delay_ms plus frontend fade sequencing.",
    ],
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
