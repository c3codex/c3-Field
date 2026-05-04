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

const mappings = [
  {
    encounter_key: "landing_intro_video",
    function_layer: "entry",
    state_expression: "public_intro_video",
    renderer: "measures_registry_intro",
  },
  {
    encounter_key: "landing_path_choice",
    function_layer: "choice",
    state_expression: "public_binary_path_choice",
    renderer: "measures_registry_path_choice",
  },
  {
    encounter_key: "understand_failure",
    function_layer: "encounter",
    state_expression: "public_system_encounter",
    renderer: "generic_media_encounter",
  },
  {
    encounter_key: "reserve_seat",
    function_layer: "intake",
    state_expression: "src_intake_entry",
    renderer: "src_intake_surface",
  },
]

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
          display_title: "Reserve Your Seat",
          registry_family: "spine",
          encounter_type: "view",
          material_family: "obsidian",
          sequence_order: 1040,
          release_state: "released",
          access_state: "callable",
          is_active: true,
          metadata: {
            role: "measures_registry_intake",
            source: "registry_isomorphic_surface_classification_v1",
          },
        },
        { onConflict: "registry_key" },
      ),
    "Reserve seat registry row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key")
      .in(
        "registry_key",
        mappings.map((mapping) => mapping.encounter_key),
      ),
    "Registry row lookup failed",
  )

  const registryIdByKey = new Map(
    registryRows.map((row) => [row.registry_key, row.id]),
  )

  const existingEncounters = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .in(
        "encounter_key",
        mappings.map((mapping) => mapping.encounter_key),
      ),
    "Encounter lookup failed",
  )

  const encounterByKey = new Map(
    existingEncounters.map((row) => [row.encounter_key, row]),
  )

  for (const mapping of mappings) {
    const registryId = registryIdByKey.get(mapping.encounter_key)
    if (!registryId) {
      throw new Error(`Registry id missing for ${mapping.encounter_key}`)
    }

    const existing = encounterByKey.get(mapping.encounter_key)
    const metadata = {
      ...(existing?.metadata ?? {}),
      function_layer: mapping.function_layer,
      state_expression: mapping.state_expression,
      renderer: mapping.renderer,
    }

    if (existing) {
      await assertOk(
        await supabase
          .from("measures_encounter_def")
          .update({ metadata })
          .eq("id", existing.id),
        `Classification update failed for ${mapping.encounter_key}`,
      )
      continue
    }

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .insert({
          registry_id: registryId,
          encounter_key: mapping.encounter_key,
          display_title: "Reserve Your Seat",
          encounter_type: "view",
          material_family: "obsidian",
          surface_type: "threshold",
          sequence_order: 1040,
          pause_allowed: true,
          is_entry_surface: false,
          is_active: true,
          metadata,
        }),
      `Reserve seat encounter insert failed`,
    )
  }

  const validation = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in(
        "encounter_key",
        mappings.map((mapping) => mapping.encounter_key),
      )
      .order("encounter_key"),
    "Classification validation failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        classifiedCount: validation.length,
        rows: validation.map((row) => ({
          encounter_key: row.encounter_key,
          function_layer: row.metadata?.function_layer ?? null,
          state_expression: row.metadata?.state_expression ?? null,
          renderer: row.metadata?.renderer ?? null,
        })),
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
