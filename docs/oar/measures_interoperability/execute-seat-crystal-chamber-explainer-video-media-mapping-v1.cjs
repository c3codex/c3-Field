require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and a Supabase write key are required")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_interoperability/oar2_seat_crystal_chamber_explainer_video_media_mapping_v1.meta.md"
const TARGET_ROW = "structure_passage"
const MEDIA_KEY = "questions_ungoverned_systems_cannot_answer_video"
const TALKING_HEAD_KEY = "talking_head_passage_video"
const URL = "https://media.c3field.online/questions_ungoverned_systems_cannot_answer.mp4"
const STORAGE_PATH = "questions_ungoverned_systems_cannot_answer.mp4"

const ACTIVATION_STANDING = {
  payment: false,
  c3_key: false,
  temp_c3_key: false,
  wallet_connect: false,
  temp_payment_provider: false,
  SRC_binding: false,
  permission: false,
  recognition: false,
  conversion: false,
  certification: false,
  DAO: false,
  distribution: false,
}

const PUBLIC_BOUNDARY = {
  may_mention: [
    "AI drift",
    "structural drift",
    "ungoverned systems",
    "Measures Integrity System",
    "system integrity",
    "AI-accelerated systems",
    "MAP the Environment",
    "runtime structure",
    "governed findings",
    "critical / emerging / probable AI drift conditions",
  ],
  may_not_expose: [
    "C1 / C2 / C3",
    "pricing",
    "payment",
    "wallet connect",
    "temp payment provider",
    "c3 Key assignment",
    "temp c3 Key assignment",
    "SRC binding mechanics",
    "permission standing",
    "recognition standing",
    "conversion standing",
    "certification standing",
    "Crystal Chamber",
    "Marble Governance Chamber",
    "Obsidian route",
    "Lapis route",
    "material-family chamber labels",
  ],
}

const MEDIA_MAPPING = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  media_key: MEDIA_KEY,
  title: "The Questions Ungoverned AI Systems Cannot Answer",
  media_type: "measures_explainer_video",
  role: "explainer / comparison / public education video",
  surface: "Understand the Environment",
  parent_chamber_contract: "crystal_chamber_contract",
  parent_public_path: "understand_environment",
  placement: "crystal_chamber_education_content",
  storage: "R2 / media.c3field.online",
  url: URL,
  aspect_ratio: "16:9",
  display_mode: "contained",
  object_fit: "contain",
  public_material_naming_allowed: false,
  renderer_rule: "render_seated_state_only",
  frontend_hardcode_allowed: false,
  runtime_final_pass_authorized: false,
  talking_head_passage_distinction: {
    media_key: TALKING_HEAD_KEY,
    role: "already-seated passage video / opens Understand the Environment",
    remains_distinct: true,
    may_replace: false,
    may_rename: false,
    may_collapse: false,
  },
  placement_contract: {
    preferred_placement:
      "After about_measures_registry_encounter and before or alongside MAP the Environment education.",
    allowed_sequence: [
      "Understand the Environment",
      "talking_head_passage_video",
      "about_measures_registry_encounter",
      "questions_ungoverned_systems_cannot_answer_video",
      "c3_map_education_encounter",
      "measures_conversion_education_encounter",
      "assess_environment_cta_encounter",
    ],
    renderer_may_place_as: [
      "education video card",
      "embedded wide video panel",
      "pathway explainer section",
      "comparison video section",
    ],
    renderer_may_not_place_as: [
      "replacement for talking-head passage",
      "payment gate",
      "MAP execution entry",
      "certification claim",
      "commerce activation surface",
    ],
  },
  display_contract: {
    aspect_ratio: "16:9",
    display_mode: "contained",
    object_fit: "contain",
    max_width: "responsive",
    crop_allowed: false,
    vertical_crop_allowed: false,
    full_bleed_crop_allowed: false,
    controls_allowed: true,
    poster_optional: true,
    renderer_must_avoid: [
      "object-fit: cover",
      "vertical hero crop",
      "mobile crop without fallback",
      "forced full-screen crop",
      "text overlap on video frame",
    ],
  },
  purpose:
    "The Questions Ungoverned AI Systems Cannot Answer explains why ungoverned AI-accelerated systems cannot answer operational accountability questions once AI begins shaping real operations.",
  positioning:
    "Supports Measures Registry positioning as Integrity Governance for AI-Accelerated Systems and reinforces MAP the Environment as a bounded runtime audit for AI drift conditions, not a full institutional audit.",
  public_boundary: PUBLIC_BOUNDARY,
  activation_standing: ACTIVATION_STANDING,
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function seatMediaMapRow() {
  const payload = {
    registry_key: "measures_registry",
    encounter_key: TARGET_ROW,
    campaign_key: "measures_registry_crystal_chamber",
    media_role: MEDIA_KEY,
    storage_bucket: "measures-media",
    storage_path: STORAGE_PATH,
    mime_type: "video/mp4",
    sort_order: 214,
    is_active: true,
    metadata: {
      source_oar2: SOURCE_OAR2,
      media_key: MEDIA_KEY,
      title: MEDIA_MAPPING.title,
      media_type: MEDIA_MAPPING.media_type,
      role: MEDIA_MAPPING.role,
      storage_provider: "cloudflare_r2",
      public_url: URL,
      exact_url_seated: URL,
      aspect_ratio: "16:9",
      display_mode: "contained",
      object_fit: "contain",
      crop_allowed: false,
      parent_chamber_contract: "crystal_chamber_contract",
      parent_public_path: "understand_environment",
      placement: "crystal_chamber_education_content",
      talking_head_passage_video_replaced: false,
      runtime_final_pass_authorized: false,
      frontend_hardcode_allowed: false,
      public_material_naming_allowed: false,
    },
  }

  const existing = assertOk(
    await supabase
      .from("measures_media_map")
      .select("id, media_role, storage_path, metadata")
      .eq("media_role", MEDIA_KEY)
      .limit(1),
    "fetch media map",
  )

  if (existing.length > 0) {
    return assertOk(
      await supabase
        .from("measures_media_map")
        .update(payload)
        .eq("id", existing[0].id)
        .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
        .single(),
      "update media map",
    )
  }

  return assertOk(
    await supabase
      .from("measures_media_map")
      .insert(payload)
      .select("media_role, storage_bucket, storage_path, mime_type, is_active, metadata")
      .single(),
    "insert media map",
  )
}

async function seatEncounterMetadata() {
  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", TARGET_ROW)
      .single(),
    "fetch structure_passage",
  )

  const metadata = clone(row.metadata)
  const contentContracts = clone(metadata.crystal_chamber_content_contracts)
  const understandPassage = clone(contentContracts.understand_environment_passage)

  contentContracts.questions_ungoverned_systems_cannot_answer_video_media_mapping =
    MEDIA_MAPPING
  contentContracts.understand_environment_passage = {
    ...understandPassage,
    explainer_video_media_mapping: MEDIA_MAPPING,
    talking_head_passage_video_replaced: false,
  }

  const nextMetadata = {
    ...metadata,
    questions_ungoverned_systems_cannot_answer_video_media_mapping: MEDIA_MAPPING,
    crystal_chamber_content_contracts: contentContracts,
    crystal_chamber_explainer_video_media_mapping_seating: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      status: "seated",
      target_row: TARGET_ROW,
      media_key: MEDIA_KEY,
      exact_url_seated: URL,
      talking_head_passage_video_replaced: false,
      runtime_final_pass_authorized: false,
      frontend_hardcode_allowed: false,
      public_material_naming_allowed: false,
      activation_standing: ACTIVATION_STANDING,
    },
  }

  return assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    "update structure_passage metadata",
  )
}

async function main() {
  assertOk(
    await supabase.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )

  const mediaRow = await seatMediaMapRow()
  const encounter = await seatEncounterMetadata()

  const talkHeadRows = assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_path, is_active, metadata")
      .in("media_role", [TALKING_HEAD_KEY, "explainer_video"]),
    "talking head distinction check",
  )

  const errors = []
  const mapping =
    encounter.metadata?.questions_ungoverned_systems_cannot_answer_video_media_mapping
  if (mapping?.media_key !== MEDIA_KEY) errors.push("metadata mapping missing")
  if (mapping?.url !== URL) errors.push("exact URL not seated")
  if (mapping?.media_type !== "measures_explainer_video") {
    errors.push("video not classified as measures explainer video")
  }
  if (mapping?.talking_head_passage_distinction?.remains_distinct !== true) {
    errors.push("talking-head distinction missing")
  }
  if (mediaRow.media_role === TALKING_HEAD_KEY || mapping.media_key === TALKING_HEAD_KEY) {
    errors.push("explainer video mapped as talking-head passage video")
  }
  if (mapping?.aspect_ratio !== "16:9") errors.push("aspect ratio missing")
  if (mapping?.display_contract?.display_mode !== "contained") {
    errors.push("contained display missing")
  }
  if (
    mapping?.display_contract?.crop_allowed !== false ||
    mapping?.display_contract?.vertical_crop_allowed !== false ||
    mapping?.display_contract?.full_bleed_crop_allowed !== false
  ) {
    errors.push("crop prohibition missing")
  }
  if (mapping?.placement !== "crystal_chamber_education_content") {
    errors.push("Crystal chamber placement missing")
  }
  for (const [key, value] of Object.entries(mapping?.activation_standing || {})) {
    if (value !== false) errors.push(`${key} activated`)
  }
  if (mapping?.runtime_final_pass_authorized !== false) {
    errors.push("runtime final pass not blocked")
  }
  if (mediaRow.metadata?.public_url !== URL) errors.push("media row exact URL missing")
  if (mediaRow.storage_path !== STORAGE_PATH) errors.push("media row storage path mismatch")

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        media_key: MEDIA_KEY,
        media_role: mediaRow.media_role,
        exact_url: URL,
        storage_bucket: mediaRow.storage_bucket,
        storage_path: mediaRow.storage_path,
        mime_type: mediaRow.mime_type,
        aspect_ratio: mapping.aspect_ratio,
        display_mode: mapping.display_contract.display_mode,
        object_fit: mapping.display_contract.object_fit,
        crop_allowed: mapping.display_contract.crop_allowed,
        talking_head_passage_video_replaced: false,
        talking_head_distinction_rows_found: talkHeadRows.map((row) => row.media_role),
        runtime_final_pass_authorized: mapping.runtime_final_pass_authorized,
        activation_standing: mapping.activation_standing,
        validation: "PASS",
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
