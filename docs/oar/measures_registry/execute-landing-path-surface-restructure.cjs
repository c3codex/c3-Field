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
const source = "landing_path_surface_restructure_v1"

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function updateEncounter(encounterKey, metadataPatch, label) {
  const [row] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    `${label} lookup failed`,
  )

  if (!row) throw new Error(`${label} row missing`)

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        metadata: {
          ...(row.metadata ?? {}),
          ...metadataPatch,
          source_restructure: source,
        },
      })
      .eq("id", row.id),
    `${label} update failed`,
  )
}

async function main() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  await updateEncounter(
    "landing_path_choice",
    {
      title: "AI isn't broken.\nSystems are.",
      subtitle: "Most AI failures aren't intelligence problems.\nThey're system failures.",
      breakdown_blocks: [
        "Register behavior.",
        "Surface drift.",
        "Govern alignment.",
      ],
      plaques: [
        {
          side: "left",
          title: "UNDERSTAND FAILURE",
          body: "Outputs drift. Results change without cause.",
          action_key: "explore_system",
          action_label: "Explore System",
        },
        {
          side: "right",
          title: "BUILD COHERENCE",
          body: "Integrity governance for AI-accelerated systems.",
          action_key: "reserve_seat",
          action_label: "Reserve Your Seat",
        },
      ],
      more: {
        label: "UNDERSTAND FAILURE",
        body: "Outputs drift. Results change without cause.",
        action_key: "explore_system",
        action_label: "Explore System",
      },
      coherence: {
        label: "BUILD COHERENCE",
        body: "Integrity governance for AI-accelerated systems.",
        action_key: "reserve_seat",
        action_label: "Reserve Your Seat",
      },
    },
    "Landing path choice",
  )

  await updateEncounter(
    "understand_failure",
    {
      entry_label: "UNDERSTAND FAILURE",
      entry_headline: "This isn't an AI problem.",
      entry_sub: "It's a system problem.",
      breakdown_blocks: [
        "Outputs drift.\nResults change without cause.",
        "Decisions don't stabilize.\nEvery pass produces a new answer.",
        "Systems don't align.\nTools operate without shared structure.",
        "Scale increases noise.\nMore input, less resolution.",
      ],
      resolution_shift: "This isn't an AI problem.\nIt's a system problem.",
      transition_statement: null,
    },
    "Understand Failure",
  )

  await updateEncounter(
    "reserve_seat",
    {
      entry_label: "BUILD COHERENCE",
      entry_headline: "Integrity governance for AI-accelerated systems.",
      entry_sub: "Before automation outruns accountability.",
      core_statement: "Integrity governance for AI-accelerated systems.",
      sections: [
        { body: "Register behavior." },
        { body: "Surface drift." },
        { body: "Govern system alignment." },
      ],
    },
    "Build Coherence",
  )

  await updateEncounter(
    "orientation_placeholder",
    {
      entry_label: "ABOUT",
      entry_headline: null,
      entry_sub: null,
      sections: [
        {
          title: "HOW IT RELATES",
          body: "Measures Registry is developed and operated by the registered institution in service.",
        },
      ],
      closing_statement: null,
    },
    "About",
  )

  const rows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", [
        "landing_path_choice",
        "understand_failure",
        "reserve_seat",
        "orientation_placeholder",
      ]),
    "Validation load failed",
  )

  const byKey = new Map(rows.map((row) => [row.encounter_key, row.metadata ?? {}]))
  const landing = byKey.get("landing_path_choice") ?? {}
  const failure = byKey.get("understand_failure") ?? {}
  const build = byKey.get("reserve_seat") ?? {}
  const about = byKey.get("orientation_placeholder") ?? {}
  const allText = JSON.stringify(rows)

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        landingContainsOnlyRecognition:
          landing.title === "AI isn't broken.\nSystems are." &&
          landing.subtitle === "Most AI failures aren't intelligence problems.\nThey're system failures." &&
          Array.isArray(landing.breakdown_blocks) &&
          landing.breakdown_blocks.length === 3,
        landingCompressedSignal: landing.breakdown_blocks,
        understandFailureStatements: failure.breakdown_blocks,
        understandFailureAnchor: failure.resolution_shift,
        buildCoherenceStatement: build.core_statement,
        buildCoherenceLines: (build.sections ?? []).map((section) => section.body),
        aboutSections: about.sections,
        aboutReducedToInstitutionalContext:
          about.sections?.length === 1 &&
          about.sections[0]?.body === "Measures Registry is developed and operated by the registered institution in service.",
        noSaasBlocks:
          !allText.includes("WHAT IT IS") &&
          !allText.includes("WHAT IT DOES"),
        routingIntegrity: "epigraph -> landing_path_choice -> path selection",
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
