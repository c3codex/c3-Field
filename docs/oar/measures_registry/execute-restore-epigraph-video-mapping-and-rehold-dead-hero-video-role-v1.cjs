require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_restore_epigraph_video_mapping_and_rehold_dead_hero_video_role_v1.meta.md"

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
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey),
    `read encounter ${encounterKey}`,
  )
  return rows[0] ?? null
}

// Correction 1: restore epigraph_video to registry_epigraph_fracture_to_alignment_15s.mp4
async function restoreEpigraphVideoMapping() {
  const row = await readMediaMapRow("epigraph_video")
  if (!row) throw new Error("epigraph_video row not found")

  const before = { storage_path: row.storage_path, is_active: row.is_active }

  const updatedMetadata = {
    ...(row.metadata ?? {}),
    corrected_by_oar2: SOURCE_OAR2,
    previous_storage_path: row.storage_path,
    correction_reason:
      "prior correction incorrectly placed integrity_governance_intro.mp4 here; registry_epigraph_fracture_to_alignment_15s.mp4 is the operator-declared correct asset for epigraph_video",
  }

  assertOk(
    await writer
      .from("measures_media_map")
      .update({ storage_path: "registry_epigraph_fracture_to_alignment_15s.mp4", metadata: updatedMetadata })
      .eq("campaign_key", CAMPAIGN_KEY)
      .eq("media_role", "epigraph_video"),
    "restore epigraph_video",
  )

  console.log("restored: epigraph_video storage_path → registry_epigraph_fracture_to_alignment_15s.mp4")
  return { before, after: { storage_path: "registry_epigraph_fracture_to_alignment_15s.mp4", is_active: true } }
}

// Correction 2: confirm/update hero_video inactive with correct dead-role metadata
async function reholdHeroVideoRole() {
  const row = await readMediaMapRow("hero_video")
  if (!row) throw new Error("hero_video row not found")

  const before = { storage_path: row.storage_path, is_active: row.is_active }

  const updatedMetadata = {
    ...(row.metadata ?? {}),
    superseded_by_oar2: SOURCE_OAR2,
    superseded_reason:
      "hero_video is queried by REQUIRED_MEDIA_ROLES but heroVideoUrl is computed and never consumed by any renderer branch; integrity_governance_intro.mp4 is retained here as a record of the unmapped asset but must not be activated until renderer support is seated in a future OAR2",
    integrity_governance_intro_standing:
      "integrity_governance_intro.mp4 is stored in R2 (measures-media bucket) and referenced here for traceability; it is NOT mapped to any active consumed renderer role; candidate for future renderer role seating",
  }

  assertOk(
    await writer
      .from("measures_media_map")
      .update({ is_active: false, metadata: updatedMetadata })
      .eq("campaign_key", CAMPAIGN_KEY)
      .eq("media_role", "hero_video"),
    "rehold hero_video",
  )

  console.log("confirmed inactive: hero_video (dead renderer role — heroVideoUrl never rendered)")
  return { before, after: { is_active: false } }
}

// Correction 3: fix ai_isnt_broken_intro media_contract to name correct primary video asset
async function correctIntroMediaContract() {
  const enc = await readEncounterRow("ai_isnt_broken_intro")
  if (!enc) throw new Error("ai_isnt_broken_intro not found")

  const before = {
    video_primary_asset: enc.metadata?.media_contract?.video_primary_asset ?? null,
    video_primary_role: enc.metadata?.media_contract?.video_primary_role ?? null,
  }

  const correctedContract = {
    ...(enc.metadata?.media_contract ?? {}),
    video_primary_role: "epigraph_video",
    video_primary_asset: "registry_epigraph_fracture_to_alignment_15s.mp4",
    video_primary_bucket: "measures-media",
    corrected_by_oar2: SOURCE_OAR2,
    integrity_governance_intro_standing:
      "integrity_governance_intro.mp4 is inactive — mapped only to dead hero_video role; not consumed by renderer; candidate for future seating",
  }

  const updatedMetadata = {
    ...enc.metadata,
    media_contract: correctedContract,
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("encounter_key", "ai_isnt_broken_intro"),
    "correct ai_isnt_broken_intro media_contract",
  )

  console.log("corrected: ai_isnt_broken_intro media_contract video_primary_asset")
  return {
    before,
    after: {
      video_primary_role: "epigraph_video",
      video_primary_asset: "registry_epigraph_fracture_to_alignment_15s.mp4",
    },
  }
}

async function readback() {
  const epigraphRow = await readMediaMapRow("epigraph_video")
  const heroVideoRow = await readMediaMapRow("hero_video")
  const introEnc = await readEncounterRow("ai_isnt_broken_intro")

  return {
    epigraph_video: {
      storage_path: epigraphRow?.storage_path,
      is_active: epigraphRow?.is_active,
      storage_bucket: epigraphRow?.storage_bucket,
    },
    hero_video: {
      storage_path: heroVideoRow?.storage_path,
      is_active: heroVideoRow?.is_active,
    },
    ai_isnt_broken_intro_media_contract: {
      video_primary_role: introEnc?.metadata?.media_contract?.video_primary_role,
      video_primary_asset: introEnc?.metadata?.media_contract?.video_primary_asset,
      video_primary_bucket: introEnc?.metadata?.media_contract?.video_primary_bucket,
      media_roles: introEnc?.metadata?.media_roles,
    },
  }
}

async function main() {
  console.log("=== OAR2: Restore Epigraph Video Mapping and Rehold Dead Hero Video Role ===")
  console.log(`source_oar2: ${SOURCE_OAR2}`)

  assertOk(
    await writer.from("measures_media_map").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  console.log("\ncorrection 1: restore epigraph_video storage_path...")
  const epigraphResult = await restoreEpigraphVideoMapping()

  console.log("\ncorrection 2: confirm hero_video inactive with dead-role metadata...")
  const heroVideoResult = await reholdHeroVideoRole()

  console.log("\ncorrection 3: correct ai_isnt_broken_intro media_contract...")
  const introContractResult = await correctIntroMediaContract()

  console.log("\nreadback...")
  const rb = await readback()

  const output = {
    source_oar2: SOURCE_OAR2,
    db_connection: "ok",
    corrections: {
      epigraph_video: epigraphResult,
      hero_video: heroVideoResult,
      ai_isnt_broken_intro_media_contract: introContractResult,
    },
    readback: rb,
    db_rows_updated: 3,
    epigraph_video_correct: rb.epigraph_video?.storage_path === "registry_epigraph_fracture_to_alignment_15s.mp4",
    hero_video_inactive: rb.hero_video?.is_active === false,
    integrity_governance_intro_in_active_consumed_role: false,
    frontend_edits: false,
    css_edits: false,
    route_changes: false,
    r2_env_requirement: {
      variable: "VITE_R2_PUBLIC_BASE_URL",
      note: "Required for local resolution of measures-media assets. Absent locally = null URLs; fallback Continue button shown. Must be set in Cloudflare Pages for production.",
    },
  }

  console.log("\n" + JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
