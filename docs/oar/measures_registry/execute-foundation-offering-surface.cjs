require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const campaignKey = "agents_of_chaos_integrity_governance"
const encounterKey = "foundation_offering"

const metadata = {
  function_layer: "orientation",
  state_expression: "public_offering_surface",
  renderer: "offering_surface",
  entry_label: "FOUNDATION SEAT",
  entry_headline: "Learn why systems fail before you try to fix them.",
  entry_sub:
    "A structured entry into coherence, failure diagnosis, and system responsibility.",
  core_statement:
    "The Foundation Seat is for people who need the language, structure, and orientation to understand why AI-enabled systems drift, fragment, and fail to resolve.",
  sections: [
    {
      title: "What this establishes",
      body: "You will learn how coherence, role integrity, registered behavior, and verification shape trustworthy systems.",
    },
    {
      title: "What this is not",
      body: "This is not a prompt course, productivity tutorial, or AI trend overview.",
    },
    {
      title: "What changes",
      body: "You stop treating failure as a tool problem and begin seeing the environment that produces it.",
    },
  ],
  outcome_statement:
    "You leave with a clearer operating frame for recognizing drift, restoring distinction, and preparing for deeper systems work.",
  cta_primary: "RESERVE FOUNDATION SEAT",
  cta_secondary: "Back to Seats",
  media_roles: ["foundation_intro_video"],
  media_render_mode: "intro_then_content",
  video_mode: "muted_autoplay",
  fallback: "still_frame",
  actions: [
    {
      action_key: "reserve_foundation_seat",
      label: "RESERVE FOUNDATION SEAT",
      behavior: "route_surface",
      target_encounter_key: "foundation_seat_hold",
    },
    {
      action_key: "back_to_seats",
      label: "Back to Seats",
      behavior: "route_surface",
      target_encounter_key: "reserve_seat",
    },
  ],
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(
        {
          registry_key: encounterKey,
          display_title: "FOUNDATION SEAT",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1045,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_learning_offering",
            source: "foundation_offering_surface_v1",
            parent: "measures_registry_runtime",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Foundation offering registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, metadata")
      .eq("registry_key", encounterKey)
      .limit(1),
    "Foundation offering registry id lookup failed",
  )

  const registryId = registryRows[0]?.id
  if (!registryId) throw new Error("Foundation offering registry id missing")

  const existingRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Foundation offering encounter lookup failed",
  )

  const payload = {
    registry_id: registryId,
    encounter_key: encounterKey,
    display_title: "FOUNDATION SEAT",
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1045,
    pause_allowed: true,
    is_entry_surface: false,
    is_active: true,
    metadata,
  }

  if (existingRows.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: payload.display_title,
          metadata: payload.metadata,
        })
        .eq("id", existingRows[0].id),
      "Foundation offering encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(payload),
      "Foundation offering encounter insert failed",
    )
  }

  const media = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role")
      .eq("campaign_key", campaignKey)
      .eq("media_role", "foundation_intro_video")
      .eq("is_active", true),
    "Foundation offering media verification failed",
  )

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Foundation offering validation failed",
  )

  const row = seated[0]
  const rowMetadata = row?.metadata ?? {}
  const actions = rowMetadata.actions ?? []

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        foundationOfferingExists: seated.length === 1,
        parent: registryRows[0]?.metadata?.parent,
        function_layer: rowMetadata.function_layer,
        state_expression: rowMetadata.state_expression,
        renderer: rowMetadata.renderer,
        sectionCount: rowMetadata.sections?.length ?? 0,
        foundationIntroVideoSeated: media.length > 0,
        missingMediaRoles: media.length > 0 ? [] : ["foundation_intro_video"],
        primaryActionTarget: actions[0]?.target_encounter_key,
        formFieldsPresent: Boolean(rowMetadata.fields),
        srcRpcPresent: JSON.stringify(rowMetadata).includes("submit_src_intake_request"),
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
