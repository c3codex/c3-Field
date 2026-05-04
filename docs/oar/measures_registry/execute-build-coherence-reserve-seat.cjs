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

const reserveSeatMetadata = {
  function_layer: "intake",
  state_expression: "public_learning_reserve_seat",
  renderer: "reserve_seat_selector",
  entry_label: "BUILD COHERENCE",
  entry_headline: "Choose your point of entry.",
  entry_sub: "Structured learning precedes system alignment.",
  options: [
    {
      key: "foundation_seat",
      label: "FOUNDATION SEAT",
      description: "Establish core understanding of system coherence.",
      state: "open",
      target_encounter_key: "foundation_offering",
    },
    {
      key: "systems_seat",
      label: "SYSTEMS SEAT",
      description: "Apply coherence principles to structured environments.",
      state: "open",
      target_encounter_key: "systems_offering",
    },
    {
      key: "cohort",
      label: "COHORT REGISTRATION",
      description: "Guided institutional implementation.",
      state: "coming_soon",
    },
  ],
  actions: [
    {
      action_key: "back_to_path",
      label: "Back",
      behavior: "route_surface",
      target_encounter_key: "landing_path_choice",
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
          registry_key: "reserve_seat",
          display_title: "BUILD COHERENCE",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1040,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_learning_intake",
            source: "build_coherence_reserve_seat_v1",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Reserve seat registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id")
      .eq("registry_key", "reserve_seat")
      .limit(1),
    "Reserve seat registry id lookup failed",
  )

  const registryId = registryRows[0]?.id
  if (!registryId) throw new Error("Reserve seat registry id missing")

  const existingRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", "reserve_seat")
      .limit(1),
    "Reserve seat encounter lookup failed",
  )

  if (existingRows.length > 0) {
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          display_title: "BUILD COHERENCE",
          metadata: reserveSeatMetadata,
        })
        .eq("id", existingRows[0].id),
      "Reserve seat encounter update failed",
    )
  } else {
    await assertOk(
      await supabase.from("measures_encounter_def").insert({
        registry_id: registryId,
        encounter_key: "reserve_seat",
        display_title: "BUILD COHERENCE",
        encounter_type: "view",
        material_family: "obsidian",
        surface_type: "threshold",
        sequence_order: 1040,
        pause_allowed: true,
        is_entry_surface: false,
        is_active: true,
        metadata: reserveSeatMetadata,
      }),
      "Reserve seat encounter insert failed",
    )
  }

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "reserve_seat")
      .limit(1),
    "Reserve seat validation failed",
  )

  const metadata = seated[0]?.metadata ?? {}
  const options = metadata.options ?? []

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        reserveSeatSeated: seated.length === 1,
        function_layer: metadata.function_layer,
        state_expression: metadata.state_expression,
        renderer: metadata.renderer,
        optionCount: options.length,
        openOptions: options.filter((option) => option.state === "open").map((option) => option.key),
        disabledOptions: options.filter((option) => option.state !== "open").map((option) => option.key),
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
