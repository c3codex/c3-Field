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
const encounterKey = "systems_offering"

const metadata = {
  function_layer: "orientation",
  state_expression: "public_offering_surface",
  renderer: "offering_surface",
  entry_label: "SYSTEMS SEAT",
  entry_headline: "Apply coherence to real systems.",
  entry_sub: "From understanding failure to structuring environments that resolve.",
  core_statement:
    "The Systems Seat moves from diagnosis into application-how coherence is structured, enforced, and sustained across real environments.",
  sections: [
    {
      title: "What this applies",
      body: "You move from recognizing failure into structuring systems that maintain alignment under pressure.",
    },
    {
      title: "What this is not",
      body: "This is not theory, trend analysis, or surface-level frameworks.",
    },
    {
      title: "What changes",
      body: "You begin building environments where outputs stabilize, decisions resolve, and systems remain coherent as they scale.",
    },
  ],
  outcome_statement:
    "You leave with the ability to structure, evaluate, and maintain systems that do not drift under complexity.",
  media_roles: ["systems_intro_video"],
  media_render_mode: "intro_then_content",
  video_mode: "muted_autoplay",
  fallback: "still_frame",
  actions: [
    {
      action_key: "reserve_systems_seat",
      label: "RESERVE SYSTEMS SEAT",
      behavior: "route_surface",
      target_encounter_key: "systems_seat_hold",
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
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
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
          display_title: "SYSTEMS SEAT",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1050,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_learning_offering",
            source: "systems_offering_surface_v1",
            parent: "measures_registry_runtime",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Systems offering registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", encounterKey)
      .limit(1),
    "Systems offering registry id lookup failed",
  )

  const registryId = registryRows[0]?.id
  if (!registryId) throw new Error("Systems offering registry id missing")

  const existingRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Systems offering encounter lookup failed",
  )

  const payload = {
    registry_id: registryId,
    encounter_key: encounterKey,
    display_title: "SYSTEMS SEAT",
    encounter_type: "view",
    material_family: "obsidian",
    surface_type: "threshold",
    sequence_order: 1050,
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
      "Systems offering encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert(payload),
      "Systems offering encounter insert failed",
    )
  }

  const media = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role")
      .eq("campaign_key", campaignKey)
      .eq("media_role", "systems_intro_video")
      .eq("is_active", true),
    "Systems offering media verification failed",
  )

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "Systems offering validation failed",
  )

  const row = seated[0]

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        systemsOfferingExists: seated.length === 1,
        function_layer: row?.metadata?.function_layer,
        state_expression: row?.metadata?.state_expression,
        renderer: row?.metadata?.renderer,
        sectionCount: row?.metadata?.sections?.length ?? 0,
        systemsIntroVideoSeated: media.length > 0,
        missingMediaRoles: media.length > 0 ? [] : ["systems_intro_video"],
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
