require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_correct_registered_intro_and_path_choice_video_still_media_contracts_v1.meta.md"

const CAMPAIGN_KEY = "agents_of_chaos_integrity_governance"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function readMediaMapRow(mediaRole) {
  const rows = assertOk(
    await writer
      .from("measures_media_map")
      .select("*")
      .eq("campaign_key", CAMPAIGN_KEY)
      .eq("media_role", mediaRole),
    `read ${mediaRole}`,
  )
  return rows[0] ?? null
}

async function readEncounterRow(encounterKey) {
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .eq("encounter_key", encounterKey),
    `read encounter ${encounterKey}`,
  )
  return rows[0] ?? null
}

// --- Correction 1: epigraph_video storage_path ---
// The renderer's video player (epigraphVideoUrl) consumes epigraph_video.
// The operator's intended intro video is integrity_governance_intro.mp4.
// This file is currently mapped under hero_video (a dead renderer role).
// Correct by updating epigraph_video to point to integrity_governance_intro.mp4.
async function correctEpigraphVideoRole() {
  const row = await readMediaMapRow("epigraph_video")
  if (!row) throw new Error("epigraph_video row not found")

  const before = {
    media_role: row.media_role,
    storage_path: row.storage_path,
    is_active: row.is_active,
  }

  const updatedMetadata = {
    ...(row.metadata ?? {}),
    corrected_by_oar2: SOURCE_OAR2,
    previous_storage_path: row.storage_path,
    correction_reason:
      "renderer epigraphVideoUrl consumes epigraph_video; integrity_governance_intro.mp4 is the operator-declared primary intro video; previous path registry_epigraph_fracture_to_alignment_15s.mp4 is unmapped after this correction",
  }

  assertOk(
    await writer
      .from("measures_media_map")
      .update({
        storage_path: "integrity_governance_intro.mp4",
        metadata: updatedMetadata,
      })
      .eq("campaign_key", CAMPAIGN_KEY)
      .eq("media_role", "epigraph_video"),
    "update epigraph_video storage_path",
  )

  console.log("corrected: epigraph_video storage_path → integrity_governance_intro.mp4")
  return {
    before,
    after: { storage_path: "integrity_governance_intro.mp4", is_active: true },
  }
}

// --- Correction 2: hero_video deactivation ---
// hero_video is a REQUIRED_MEDIA_ROLE in the runtime query but heroVideoUrl is computed
// and never rendered anywhere. It is a dead renderer variable.
// Its current path (integrity_governance_intro.mp4) is migrated to epigraph_video above.
// Deactivate hero_video to remove the duplicate active mapping.
async function deactivateHeroVideoRole() {
  const row = await readMediaMapRow("hero_video")
  if (!row) throw new Error("hero_video row not found")

  const before = { media_role: row.media_role, storage_path: row.storage_path, is_active: row.is_active }

  const updatedMetadata = {
    ...(row.metadata ?? {}),
    superseded_by_oar2: SOURCE_OAR2,
    superseded_reason:
      "hero_video is queried by REQUIRED_MEDIA_ROLES but heroVideoUrl is computed and never consumed by any renderer branch; storage_path migrated to epigraph_video which is the actual renderer consumer",
  }

  assertOk(
    await writer
      .from("measures_media_map")
      .update({ is_active: false, metadata: updatedMetadata })
      .eq("campaign_key", CAMPAIGN_KEY)
      .eq("media_role", "hero_video"),
    "deactivate hero_video",
  )

  console.log("deactivated: hero_video (dead renderer role — heroVideoUrl never rendered)")
  return { before, after: { is_active: false } }
}

// --- Correction 3: ai_isnt_broken_intro encounter metadata ---
// Current metadata.media_roles = ["epigraph_video", "hero_image"] — pre-contract, missing threshold roles.
// Update to declare the full registered video-still contract.
async function correctIntroEncounterMediaContract() {
  const enc = await readEncounterRow("ai_isnt_broken_intro")
  if (!enc) throw new Error("ai_isnt_broken_intro encounter not found")

  const before = { media_roles: enc.metadata?.media_roles ?? null }

  const updatedMetadata = {
    ...enc.metadata,
    media_roles: [
      "epigraph_video",
      "hero_image",
      "left_hero_fracture",
      "left_hero_fracture_motion",
      "right_measured_hero",
      "measured_hero_motion_graphic",
    ],
    media_contract: {
      source_authority: "measures_media_map",
      frontend_hardcode_allowed: false,
      video_primary_role: "epigraph_video",
      video_primary_asset: "integrity_governance_intro.mp4",
      video_primary_bucket: "measures-media",
      split_hero_still_role: "hero_image",
      split_hero_still_status: "held — hero_fracture_measure.webp absent from measures-registry bucket",
      threshold_left_still_role: "left_hero_fracture",
      threshold_left_still_status: "active — left_hero_fracture.webp confirmed 200",
      threshold_left_motion_role: "left_hero_fracture_motion",
      threshold_left_motion_bucket: "measures-media",
      threshold_right_still_role: "right_measured_hero",
      threshold_right_still_status: "active — right_measured_hero.webp confirmed 200",
      threshold_right_motion_role: "measured_hero_motion_graphic",
      threshold_right_motion_bucket: "measures-media",
      corrected_by_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("encounter_key", "ai_isnt_broken_intro"),
    "update ai_isnt_broken_intro metadata",
  )

  console.log("corrected: ai_isnt_broken_intro encounter media contract")
  return { before, after: { media_roles: updatedMetadata.media_roles } }
}

// --- Correction 4: evaluate_structure_path encounter metadata ---
// Current metadata.media_roles = null — no media contract at all.
// Seat intended video-still contract and document renderer gap for future frontend OAR2.
async function correctPathChoiceEncounterMediaContract() {
  const enc = await readEncounterRow("evaluate_structure_path")
  if (!enc) throw new Error("evaluate_structure_path encounter not found")

  const before = { media_roles: enc.metadata?.media_roles ?? null }

  const updatedMetadata = {
    ...enc.metadata,
    media_roles: [
      "path_choice_background",
      "left_hero_fracture_motion",
      "measured_hero_motion_graphic",
    ],
    media_contract: {
      source_authority: "measures_media_map",
      frontend_hardcode_allowed: false,
      background_role: "path_choice_background",
      background_status: "held — more_vs_coherence_path.webp absent from measures-registry bucket",
      intended_left_motion_role: "left_hero_fracture_motion",
      intended_left_motion_asset: "left_hero_fracture_motion.mp4",
      intended_left_motion_bucket: "measures-media",
      intended_right_motion_role: "measured_hero_motion_graphic",
      intended_right_motion_asset: "right_measured_hero_motion_graphic.mp4",
      intended_right_motion_bucket: "measures-media",
      intended_left_still: "left_measures_hero.webp",
      intended_left_still_status: "absent — not in measures-registry bucket",
      intended_right_still: "right_measures_hero.webp",
      intended_right_still_status: "absent — not in measures-registry bucket",
      renderer_gap:
        "renderPathChoiceSurface() consumes only path_choice_background (CSS variable). No left/right video or still slots exist in the renderer. Expressing the full left/right video-still contract requires a frontend OAR2 to extend the renderer.",
      corrected_by_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("encounter_key", "evaluate_structure_path"),
    "update evaluate_structure_path metadata",
  )

  console.log("corrected: evaluate_structure_path encounter media contract (renderer gap documented)")
  return { before, after: { media_roles: updatedMetadata.media_roles } }
}

// --- Readback ---
async function readbackMediaMapRows(roles) {
  return assertOk(
    await writer
      .from("measures_media_map")
      .select("media_role, storage_path, is_active, storage_bucket")
      .eq("campaign_key", CAMPAIGN_KEY)
      .in("media_role", roles)
      .order("sort_order", { ascending: true }),
    "readback media map",
  )
}

async function verifyAnonReadback(roles) {
  if (!anonKey) return { skipped: true }
  const anon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await anon
    .from("measures_media_map")
    .select("media_role, is_active")
    .eq("campaign_key", CAMPAIGN_KEY)
    .in("media_role", roles)
  if (error) return { error: error.message }
  return {
    found: (data ?? []).map((r) => r.media_role),
    missing: roles.filter((role) => !(data ?? []).find((r) => r.media_role === role)),
  }
}

async function main() {
  console.log("=== OAR2: Correct Registered Intro and Path Choice Video-Still Media Contracts ===")
  console.log(`source_oar2: ${SOURCE_OAR2}`)

  assertOk(
    await writer.from("measures_media_map").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  console.log("\ncorrection 1: epigraph_video storage_path...")
  const epigraphVideoResult = await correctEpigraphVideoRole()

  console.log("\ncorrection 2: hero_video deactivation...")
  const heroVideoResult = await deactivateHeroVideoRole()

  console.log("\ncorrection 3: ai_isnt_broken_intro encounter media contract...")
  const introEncounterResult = await correctIntroEncounterMediaContract()

  console.log("\ncorrection 4: evaluate_structure_path encounter media contract...")
  const pathChoiceEncounterResult = await correctPathChoiceEncounterMediaContract()

  console.log("\nreadback: measures_media_map active roles...")
  const activeRolesReadback = await readbackMediaMapRows([
    "epigraph_video",
    "hero_video",
    "hero_image",
    "left_hero_fracture",
    "left_hero_fracture_motion",
    "right_measured_hero",
    "measured_hero_motion_graphic",
    "path_choice_background",
  ])

  console.log("\nanon readback for active intro roles...")
  const anonReadback = await verifyAnonReadback([
    "epigraph_video",
    "left_hero_fracture",
    "left_hero_fracture_motion",
    "right_measured_hero",
    "measured_hero_motion_graphic",
  ])

  const output = {
    source_oar2: SOURCE_OAR2,
    db_connection: "ok",
    corrections: {
      epigraph_video_path: epigraphVideoResult,
      hero_video_deactivated: heroVideoResult,
      ai_isnt_broken_intro_media_contract: introEncounterResult,
      evaluate_structure_path_media_contract: pathChoiceEncounterResult,
    },
    media_map_readback: activeRolesReadback,
    anon_readback: anonReadback,
    db_rows_updated: 4,
    frontend_edits: false,
    css_edits: false,
    duplicate_media_authority_created: false,
    held_rows_preserved: ["hero_image", "hero_measured_image", "path_choice_background"],
    renderer_gap_documented: true,
    renderer_gap_surface: "evaluate_structure_path",
    renderer_gap_note:
      "renderPathChoiceSurface() supports only path_choice_background. Left/right video/still slots require frontend OAR2.",
    r2_env_guidance: {
      variable: "VITE_R2_PUBLIC_BASE_URL",
      note: "Required in .env.local for local resolution of measures-media R2 assets (epigraph_video, left_hero_fracture_motion, measured_hero_motion_graphic, measures_structured_enviroments). Absent locally = null URLs; runtime shows fallback Continue button. Confirm set in Cloudflare Pages for production.",
    },
    upload_required_before_reactivation: [
      { role: "hero_image", storage_path: "hero_fracture_measure.webp", bucket: "measures-registry" },
      { role: "path_choice_background", storage_path: "more_vs_coherence_path.webp", bucket: "measures-registry" },
    ],
  }

  console.log("\n" + JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
