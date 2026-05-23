require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const reader = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

const REGISTERED_ENCOUNTER_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "connect_src",
  "measures_assessment",
  "structural_drift_publication",
  "phase_payment",
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "measures_eval_email_contract",
]

const REQUIRED_SECTION_KEYS = [
  "landing_root",
  "educational_diagnostic_passage",
  "landing_path_choice",
  "educate_eval_encounter",
  "structural_drift_dispatches",
  "cohort_conversion_encounter",
  "measures_ai_operational_evaluation",
  "iis_eval_gate1",
  "understand_failure",
  "c3_field",
  "reserve_seat",
  "foundation_offering",
  "systems_offering",
  "foundation_seat_hold",
  "systems_seat_hold",
  "registered_process_log",
]

function findCohortRoutes(meta, encounterKey) {
  const found = []

  function scanActions(actions, source) {
    if (!Array.isArray(actions)) return
    for (const action of actions) {
      if (
        action?.target_encounter_key === "cohort_conversion_encounter" ||
        action?.action_key === "route_cohort_conversion"
      ) {
        found.push({ source, action_key: action.action_key, target: action.target_encounter_key, behavior: action.behavior })
      }
    }
  }

  scanActions(meta?.actions, "actions")

  // Check hero_paths (intro surface)
  if (Array.isArray(meta?.hero_paths)) {
    for (const path of meta.hero_paths) {
      if (path?.action_key === "route_cohort_conversion") {
        found.push({ source: "hero_paths", side: path.side, action_key: path.action_key })
      }
    }
  }

  // Check plaques
  if (Array.isArray(meta?.plaques)) {
    for (const plaque of meta.plaques) {
      if (plaque?.action_key === "route_cohort_conversion") {
        found.push({ source: "plaques", side: plaque.side, action_key: plaque.action_key })
      }
    }
  }

  return found
}

async function main() {
  console.log("=== Route Bleed Inspection: cohort_conversion_encounter ===\n")

  const allKeys = [...new Set([...REGISTERED_ENCOUNTER_KEYS, ...REQUIRED_SECTION_KEYS])]

  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", allKeys),
    "read all encounters",
  )

  console.log("Scanning for cohort_conversion_encounter route targets...\n")

  const bleeds = []
  for (const row of rows) {
    const routes = findCohortRoutes(row.metadata, row.encounter_key)
    if (routes.length > 0) {
      bleeds.push({ encounter_key: row.encounter_key, is_active: row.is_active, routes })
    }
  }

  if (bleeds.length === 0) {
    console.log("No direct DB action routes to cohort_conversion_encounter found in any registered or required section.")
  } else {
    for (const bleed of bleeds) {
      console.log(JSON.stringify(bleed, null, 2))
    }
  }

  // Show ai_isnt_broken_intro hero_paths specifically
  const intro = rows.find((r) => r.encounter_key === "ai_isnt_broken_intro")
  if (intro) {
    console.log("\n--- ai_isnt_broken_intro hero_paths ---")
    console.log(JSON.stringify(intro.metadata?.hero_paths ?? "none", null, 2))
  }

  // Show cohort_conversion_encounter row state
  const cohort = rows.find((r) => r.encounter_key === "cohort_conversion_encounter")
  if (cohort) {
    console.log("\n--- cohort_conversion_encounter ---")
    console.log(`is_active: ${cohort.is_active}`)
    console.log(`function_layer: ${cohort.metadata?.function_layer}`)
    console.log(`renderer: ${cohort.metadata?.renderer}`)
    console.log(`actions:`, JSON.stringify(cohort.metadata?.actions ?? [], null, 2))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
