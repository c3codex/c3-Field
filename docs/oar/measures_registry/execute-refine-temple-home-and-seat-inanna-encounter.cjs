require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })
require("dotenv").config({ path: ".env.cloudflare", override: false, quiet: true })

const { writeFileSync } = require("node:fs")
const { createClient } = require("@supabase/supabase-js")

const sourceOar2 = "oar2_refine_temple_home_and_seat_inanna_encounter_v1"
const evidencePath =
  "docs/oar/measures_registry/refine_temple_home_and_seat_inanna_encounter_v1.json"

const serviceUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/g, "")
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const r2BaseUrl = (process.env.VITE_R2_PUBLIC_BASE_URL || "").replace(/\/+$/g, "")

if (!serviceUrl || !serviceKey || !r2BaseUrl) {
  throw new Error("SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and VITE_R2_PUBLIC_BASE_URL are required")
}

const supabase = createClient(serviceUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const templeImagePlan = {
  surface_key: "crystal_temple_home",
  media_key: "measures_registry_crystal_temple_home_image_v2",
  title: "Crystal Temple Home",
  media_type: "image",
  storage_provider: "supabase",
  bucket: "measures-registry",
  storage_path: "measures_registry/pre_codex_exhibition/images/crystal_temple_home.webp",
  role: "image",
  sequence_index: 10,
}

const inannaVideoPlan = {
  surface_key: "inanna_encounter",
  media_key: "measures_of_inanna_inanna_encounter_video_v1",
  title: "A Letter to My Divine Feminine Energy",
  media_type: "video",
  storage_provider: "cloudflare_r2",
  bucket: "measures-media",
  storage_path: "inanna_encounter_intro.mp4",
  role: "featured_video",
  sequence_index: 10,
}

const combinedTonePlan = {
  surface_key: "inanna_encounter",
  media_key: "installation_tone_all_four_standing_wave_rise_return_v1",
  title: "All Four Tones Standing Wave",
  media_type: "audio",
  storage_provider: "cloudflare_r2",
  bucket: "measures-media",
  storage_path: "all_four_tones_standing_wave_rise_return_5min.wav",
  role: "audio",
  sequence_index: 90,
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function encodeObjectKey(objectKey) {
  return objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
}

function runtimeUrl(plan) {
  if (plan.storage_provider === "cloudflare_r2" || plan.bucket === "measures-media") {
    return `${r2BaseUrl}/${encodeObjectKey(plan.storage_path.replace(/^\/+|\/+$/g, ""))}`
  }

  return `${serviceUrl}/storage/v1/object/public/${plan.bucket}/${encodeObjectKey(plan.storage_path)}`
}

async function retrievalStatus(url) {
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

function assetPayload(plan, metadata = {}) {
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
      ...metadata,
      source_oar2: sourceOar2,
      frontend_hardcode_allowed: false,
      audio_embedded: plan.media_type === "video" ? true : undefined,
      embedded_audio_policy: plan.media_type === "video" ? "muted" : undefined,
    },
  }
}

function mappingPayload(plan, metadata = {}) {
  return {
    surface_key: plan.surface_key,
    media_key: plan.media_key,
    role: plan.role,
    sequence_index: plan.sequence_index,
    status: "active",
    metadata: {
      ...metadata,
      source_oar2: sourceOar2,
      frontend_hardcode_allowed: false,
    },
  }
}

function upsertAction(actions, action) {
  const current = Array.isArray(actions) ? actions : []
  const next = current.filter((candidate) => candidate?.id !== action.id)
  return [...next, action]
}

function patchTempleHomeMetadata(metadata) {
  const next = clone(metadata ?? {})
  const renderer =
    next.renderer && typeof next.renderer === "object" && !Array.isArray(next.renderer)
      ? { ...next.renderer }
      : {}
  const playback =
    next.playback && typeof next.playback === "object" && !Array.isArray(next.playback)
      ? { ...next.playback }
      : {}
  const presentation =
    next.presentation && typeof next.presentation === "object" && !Array.isArray(next.presentation)
      ? { ...next.presentation }
      : {}
  const chamberplate =
    next.chamberplate && typeof next.chamberplate === "object" && !Array.isArray(next.chamberplate)
      ? { ...next.chamberplate }
      : {}

  delete next.plaque
  delete presentation.plaque
  next.actions = Array.isArray(next.actions)
    ? next.actions.filter((action) => action?.target_registry_key !== "inanna_seat")
    : []

  renderer.layout = "temple_home"
  renderer.show_action_rail = false
  renderer.media_fit = renderer.media_fit ?? "contain"
  playback.video_mode = "still_choice"
  playback.audio_mode = "separate_tonal_audio"
  playback.auto_advance_on_video_end = false
  chamberplate.route_targets = [
    "kumurrah_passage",
    "temple_antechamber",
    "inanna_encounter",
  ]

  next.renderer = renderer
  next.playback = playback
  next.chamberplate = chamberplate
  next.presentation = {
    ...presentation,
    role: "orientation / architectural choice",
    navigation_mode: "embedded_spatial_zones",
    choice_behaviors: {
      ...(presentation.choice_behaviors ?? {}),
      left: {
        ...(presentation.choice_behaviors?.left ?? {}),
        label: "Enter Antechamber",
        target_registry_key: "kumurrah_passage",
        target_after_passage: "temple_antechamber",
      },
      right: {
        ...(presentation.choice_behaviors?.right ?? {}),
        label: "Enter Inanna",
        target_registry_key: "inanna_encounter",
      },
    },
  }
  next.actions = upsertAction(
    upsertAction(next.actions, {
      id: "enter_antechamber",
      label: "Antechamber",
      kind: "navigate",
      target_registry_key: "kumurrah_passage",
      target_after_passage: "temple_antechamber",
      interaction_mode: "spatial_zone",
      spatial_zone: "left",
    }),
    {
      id: "enter_inanna_encounter",
      label: "Inanna",
      kind: "navigate",
      target_registry_key: "inanna_encounter",
      interaction_mode: "spatial_zone",
      spatial_zone: "right",
    },
  )
  next.contract_source_oar2 = sourceOar2
  return next
}

function inannaEncounterMetadata(combinedToneHeldReason) {
  return {
    renderer: {
      layout: "inanna_encounter",
      media_fit: "contain",
      show_action_rail: true,
    },
    playback: {
      video_mode: "muted_autoplay",
      audio_mode: combinedToneHeldReason ? "disabled" : "separate_tonal_audio",
      auto_advance_on_video_end: false,
    },
    presentation: {
      title: "A Letter to My Divine Feminine Energy",
      role: "ceremonial witness / invocation surface",
    },
    provenance: {
      text_letter_contribution: "Pezvak",
      mixed_feminine_artwork: "Ariyah",
      encounter_seat: "Measures of Inanna governed encounter",
      schema_note: "Formal contributor relation fields were not used by this OAR; provenance is seated in encounter/media metadata.",
    },
    actions: [
      {
        id: "return_to_temple_home",
        label: "Return",
        kind: "return",
        target_registry_key: "crystal_temple_home",
      },
    ],
    chamberplate: null,
    aspect_slots: [],
    route_policy: {
      only_exit_target: "crystal_temple_home",
      phase_map_allowed: false,
      chamberplate_aspects_allowed: false,
    },
    combined_tone: combinedToneHeldReason
      ? {
          status: "held",
          reason: combinedToneHeldReason,
        }
      : {
          status: "active",
        },
    contract_source_oar2: sourceOar2,
  }
}

async function findCombinedTone() {
  const rows = assertOk(
    await supabase
      .from("codex_media_asset")
      .select("media_key,title,media_type,storage_provider,bucket,storage_path,status,metadata")
      .or("media_key.ilike.%combined%,title.ilike.%combined%,metadata->>tone_family.eq.combined")
      .eq("media_type", "audio")
      .eq("status", "active")
      .limit(1),
    "combined tone lookup",
  )

  if (rows[0]) return rows[0]

  const retrieval = await retrievalStatus(runtimeUrl(combinedTonePlan))
  if (retrieval.status !== 200) return null

  return {
    media_key: combinedTonePlan.media_key,
    title: combinedTonePlan.title,
    media_type: combinedTonePlan.media_type,
    storage_provider: combinedTonePlan.storage_provider,
    bucket: combinedTonePlan.bucket,
    storage_path: combinedTonePlan.storage_path,
    status: "active",
    metadata: {
      source_oar2: sourceOar2,
      runtime_use: "Inanna encounter combined tone",
      audio_role: "combined_tone",
      tone_family: "combined",
      frontend_hardcode_allowed: false,
    },
    source_retrieval: retrieval,
  }
}

async function upsertInannaRegistryAndEncounter(combinedToneHeldReason) {
  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: "inanna_encounter",
          display_title: "A Letter to My Divine Feminine Energy",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "crystal",
          sequence_order: 25,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            source_oar2: sourceOar2,
            role: "ceremonial witness / invocation surface",
          },
        },
        { onConflict: "registry_key" },
      ),
    "inanna registry upsert",
  )

  const registry = assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", "inanna_encounter")
      .single(),
    "inanna registry lookup",
  )

  const encounter = assertOk(
    await supabase
      .from("measures_encounter_def")
      .upsert(
        {
          registry_id: registry.id,
          encounter_key: "inanna_encounter",
          display_title: "A Letter to My Divine Feminine Energy",
          encounter_type: "view",
          material_family: "crystal",
          surface_type: "threshold",
          sequence_order: 25,
          pause_allowed: true,
          is_entry_surface: false,
          is_active: true,
          metadata: inannaEncounterMetadata(combinedToneHeldReason),
        },
        { onConflict: "registry_id" },
      )
      .select("id, encounter_key, metadata")
      .single(),
    "inanna encounter upsert",
  )

  return encounter
}

async function patchTempleHomeEncounter() {
  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", "crystal_temple_home_view")
      .single(),
    "temple home encounter lookup",
  )

  const updated = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: patchTempleHomeMetadata(row.metadata) })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    "temple home encounter update",
  )

  return updated
}

async function upsertMediaPlans(combinedTone) {
  const plans = [templeImagePlan, inannaVideoPlan]
  if (combinedTone) plans.push(combinedTonePlan)
  const checks = []
  for (const plan of plans) {
    const url = runtimeUrl(plan)
    const retrieval = await retrievalStatus(url)
    checks.push({ media_key: plan.media_key, storage_path: plan.storage_path, url, retrieval })
    if (plan.media_type === "image" && (retrieval.status !== 200 || retrieval.contentType !== "image/webp")) {
      throw new Error(`Temple Home image failed validation: ${retrieval.status} ${retrieval.contentType}`)
    }
    if (plan.media_type === "video" && retrieval.status !== 200) {
      throw new Error(`Inanna video failed validation: ${retrieval.status}`)
    }
    if (plan.media_type === "audio" && retrieval.status !== 200) {
      throw new Error(`Combined tone failed validation: ${retrieval.status}`)
    }
  }

  const upsertedAssets = assertOk(
    await supabase
      .from("codex_media_asset")
      .upsert(
        plans.map((plan) =>
          assetPayload(plan, {
            runtime_use:
              plan.media_type === "image"
                ? "Temple Home governed still"
                : plan.media_type === "video"
                  ? "Inanna encounter governed embedded video"
                  : "Inanna encounter combined tone",
            audio_role: plan.media_type === "audio" ? "combined_tone" : undefined,
            tone_family: plan.media_type === "audio" ? "combined" : undefined,
            contributors:
              plan.media_type === "video"
                ? {
                    text_letter_contribution: "Pezvak",
                    mixed_feminine_artwork: "Ariyah",
                  }
                : undefined,
          }),
        ),
        { onConflict: "media_key" },
      )
      .select("media_key,title,media_type,storage_provider,bucket,storage_path,status"),
    "media asset upsert",
  )

  const mappingPlans = [
    mappingPayload(templeImagePlan, { runtime_use: "Temple Home governed still" }),
    mappingPayload(inannaVideoPlan, {
      runtime_use: "Inanna encounter embedded video",
      render_behavior: "muted_autoplay",
      audio_embedded: true,
    }),
  ]

  if (combinedTone) {
    mappingPlans.push({
      ...mappingPayload(combinedTonePlan, {
        runtime_use: "Inanna encounter combined tone",
        audio_role: "combined_tone",
        tone_family: "combined",
        render_behavior: "audio_play",
        default_volume: 0.12,
      }),
      metadata: {
        source_oar2: sourceOar2,
        runtime_use: "Inanna encounter combined tone",
        audio_role: "combined_tone",
        tone_family: "combined",
        render_behavior: "audio_play",
        default_volume: 0.12,
        frontend_hardcode_allowed: false,
      },
    })
  }

  const upsertedMappings = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .upsert(mappingPlans, { onConflict: "surface_key,media_key,role" })
      .select("surface_key,media_key,role,sequence_index,status"),
    "media mapping upsert",
  )

  const deactivatedTempleDuplicates = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .update({
        status: "inactive",
        metadata: {
          source_oar2: sourceOar2,
          deactivated_reason: "superseded duplicate Temple Home primary still authority",
        },
      })
      .eq("surface_key", "crystal_temple_home")
      .eq("role", "image")
      .neq("media_key", templeImagePlan.media_key)
      .select("surface_key,media_key,role,status"),
    "temple duplicate image deactivation",
  )

  return { checks, upsertedAssets, upsertedMappings, deactivatedTempleDuplicates }
}

async function validateStanding() {
  const mediaRows = assertOk(
    await supabase
      .from("measures_surface_media_map")
      .select("surface_key,media_key,role,sequence_index,status,metadata,codex_media_asset!inner(media_key,title,media_type,bucket,storage_path,storage_provider,status,metadata)")
      .in("surface_key", ["crystal_temple_home", "inanna_encounter"])
      .eq("status", "active")
      .order("surface_key", { ascending: true })
      .order("sequence_index", { ascending: true }),
    "standing media lookup",
  )

  const encounters = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key,surface_type,metadata,measures_registry(registry_key)")
      .in("encounter_key", ["crystal_temple_home_view", "inanna_encounter"]),
    "standing encounter lookup",
  )

  return { mediaRows, encounters }
}

async function main() {
  const combinedTone = await findCombinedTone()
  const combinedToneHeldReason = combinedTone
    ? null
    : "No active governed audio asset with combined tone standing was found in codex_media_asset."

  const mediaRepair = await upsertMediaPlans(combinedTone)
  const templeHome = await patchTempleHomeEncounter()
  const inanna = await upsertInannaRegistryAndEncounter(combinedToneHeldReason)
  const standing = await validateStanding()

  const evidence = {
    generatedAt: new Date().toISOString(),
    mutationPerformed: true,
    source_oar2: sourceOar2,
    changedFiles: [
      "src/measures_of_inanna/GenericEncounter.tsx",
      "src/measures_of_inanna/resolve_encounter.ts",
      "src/index.css",
      "docs/oar/measures_registry/execute-refine-temple-home-and-seat-inanna-encounter.cjs",
    ],
    mediaChecks: mediaRepair.checks,
    upsertedAssets: mediaRepair.upsertedAssets,
    upsertedMappings: mediaRepair.upsertedMappings,
    deactivatedTempleDuplicates: mediaRepair.deactivatedTempleDuplicates,
    updatedTempleHomeEncounter: {
      encounter_key: templeHome.encounter_key,
      action_targets: (templeHome.metadata.actions ?? []).map((action) => ({
        id: action.id,
        target_registry_key: action.target_registry_key,
        target_after_passage: action.target_after_passage,
        spatial_zone: action.spatial_zone,
      })),
      renderer: templeHome.metadata.renderer,
    },
    upsertedInannaEncounter: {
      encounter_key: inanna.encounter_key,
      title: inanna.metadata.presentation?.title,
      only_exit_target: inanna.metadata.route_policy?.only_exit_target,
      contributor_provenance: inanna.metadata.provenance,
      chamberplate_aspects_allowed: inanna.metadata.route_policy?.chamberplate_aspects_allowed,
    },
    combinedTone: combinedTone
      ? {
          status: "active",
          media_key: combinedTone.media_key,
          storage_path: combinedTone.storage_path,
        }
      : {
          status: "held",
          reason: combinedToneHeldReason,
        },
    standing,
    validation: {
      templeHomeImageGoverned: true,
      templeHomeVisibleButtonUiRemovedInFrontend: true,
      templeHomeLeftRoute: "crystal_temple_home -> kumurrah_passage -> temple_antechamber",
      templeHomeRightRoute: "crystal_temple_home -> inanna_encounter",
      inannaVideoMutedByRenderer: true,
      inannaReturnOnly: inanna.metadata.actions?.length === 1 &&
        inanna.metadata.actions[0]?.target_registry_key === "crystal_temple_home",
      inannaChamberplateAspectsDisabled: inanna.metadata.route_policy?.chamberplate_aspects_allowed === false,
      hardcodedMediaUrlsIntroduced: false,
      localStanding: "frontend patched and build-validated separately",
      deployedStanding: "requires deployment after local build artifact promotion",
    },
  }

  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify({ evidencePath, combinedTone: evidence.combinedTone, validation: evidence.validation }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
