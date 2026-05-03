require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const landingRows = [
  {
    key: "landing_video_hero",
    title: "Integrity Governance for AI Systems",
    eyebrow: "Measures Registry",
    body: "A public orientation surface for agents, institutions, and systems entering governed acceleration.",
    items: ["Reserve Your Seat", "Explore System"],
  },
  {
    key: "landing_problem",
    title: "AI acceleration is outpacing institutional coherence.",
    eyebrow: "Problem",
    body: "Measures Registry creates a governance surface where system behavior, human accountability, and operational trust can be reviewed before scale hardens drift.",
    items: [
      "Unverified automation compounds risk.",
      "Institutional AI needs traceable decision surfaces.",
      "Governance must be operational, not decorative.",
    ],
  },
  {
    key: "landing_path_choice",
    title: "Choose a path into accountable implementation.",
    eyebrow: "Path Choice",
    body: "The registry distinguishes orientation, cohort readiness, and contribution intake so each actor enters through the correct governance route.",
    items: ["Individuals", "Institutions", "Operators"],
  },
  {
    key: "landing_courses",
    title: "Courses seat practice before deployment pressure.",
    eyebrow: "Courses",
    body: "Training surfaces convert abstract AI governance into repeatable review habits, source discipline, and implementation constraints.",
    items: ["Integrity governance", "AI operating protocols", "Source-backed implementation"],
  },
  {
    key: "landing_principle",
    title: "Measure precedes acceleration.",
    eyebrow: "Principle",
    body: "A system should not move faster than its ability to account for what it is doing, who it affects, and what it changes.",
    items: ["Trace before trust", "Constraint before scale", "Governance before automation"],
  },
  {
    key: "landing_final_cta",
    title: "Enter the June cohort with the system in view.",
    eyebrow: "Final Call",
    body: "Reserve a seat to begin orientation through Measures Registry and its integrity governance pathway.",
    items: ["Reserve Your Seat"],
  },
]

async function assertOk(result, label) {
  if (result.error) {
    throw new Error(`${label}: ${result.error.message}`)
  }
  return result.data
}

async function run() {
  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )

  const registryPayload = landingRows.map((row, index) => ({
    registry_key: row.key,
    display_title: row.title,
    registry_family: "spine",
    encounter_type: "view",
    material_family: "lapis",
    sequence_order: 1010 + index * 10,
    release_state: "released",
    access_state: "callable",
    is_active: true,
    metadata: {
      role: "measures_registry_landing",
      source: "db_seed",
    },
  }))

  await assertOk(
    await supabase
      .from("measures_registry")
      .upsert(registryPayload, { onConflict: "registry_key" }),
    "Registry landing row upsert failed",
  )

  const registryRows = await assertOk(
    await supabase
      .from("measures_registry")
      .select("id, registry_key")
      .in(
        "registry_key",
        landingRows.map((row) => row.key),
      ),
    "Registry landing row read failed",
  )

  const registryIdByKey = new Map(
    registryRows.map((row) => [row.registry_key, row.id]),
  )

  const encounterPayload = landingRows.map((row, index) => ({
    registry_id: registryIdByKey.get(row.key),
    encounter_key: row.key,
    display_title: row.title,
    encounter_type: "view",
    material_family: "lapis",
    surface_type: "threshold",
    sequence_order: 1010 + index * 10,
    pause_allowed: false,
    is_entry_surface: row.key === "landing_video_hero",
    is_active: true,
    metadata: {
      renderer: "measures_registry_landing",
      eyebrow: row.eyebrow,
      title: row.title,
      body: row.body,
      items: row.items,
    },
  }))

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .upsert(encounterPayload, { onConflict: "registry_id" }),
    "Landing encounter upsert failed",
  )

  const seated = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key")
      .in(
        "encounter_key",
        landingRows.map((row) => row.key),
      ),
    "Landing encounter verification failed",
  )

  const heroVideo = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, is_active")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .eq("media_role", "hero_video")
      .eq("is_active", true),
    "Hero video verification failed",
  )

  console.log(
    JSON.stringify(
      {
        dbConnection: "active",
        landingEncounterCount: seated.length,
        heroVideoFromMeasuresMediaMap:
          heroVideo.length > 0 &&
          Boolean(heroVideo[0].storage_bucket) &&
          Boolean(heroVideo[0].storage_path),
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
