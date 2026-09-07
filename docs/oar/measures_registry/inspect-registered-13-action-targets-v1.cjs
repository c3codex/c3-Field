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

const REGISTERED_13 = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "connect_src",
  "measures_assessment",
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "structural_drift_publication",
  "measures_eval_email_contract",
  "reserve_seat",
  "phase_payment",
]

const DEPRECATED_TARGETS = [
  "educate_eval_encounter",
  "iis_eval_gate1",
  "cohort_conversion_encounter",
  "understand_failure",
  "foundation_offering",
  "systems_offering",
  "foundation_seat_hold",
  "systems_seat_hold",
]

async function main() {
  console.log("=== Registered 13 Action Target Inspection ===\n")

  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", REGISTERED_13),
    "read registered 13",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  console.log("--- Registered 13 DB State ---")
  for (const key of REGISTERED_13) {
    const row = byKey[key]
    if (!row) {
      console.log(`MISSING: ${key}`)
      continue
    }
    console.log(`\n[${key}] is_active=${row.is_active}`)

    const actions = row.metadata?.actions
    if (!Array.isArray(actions) || actions.length === 0) {
      console.log("  actions: none")
      continue
    }
    for (const action of actions) {
      const target = action.target_encounter_key
      const isDeprecated = target && DEPRECATED_TARGETS.includes(target)
      console.log(`  action: ${action.action_key} | behavior: ${action.behavior} | target: ${target ?? "(none)"} ${isDeprecated ? "*** DEPRECATED TARGET ***" : ""}`)
    }

    // Check hero_paths
    const heroPaths = row.metadata?.hero_paths
    if (Array.isArray(heroPaths)) {
      for (const path of heroPaths) {
        const isDeprecated = path.action_key === "route_cohort_conversion"
        console.log(`  hero_path: side=${path.side} action_key=${path.action_key} ${isDeprecated ? "*** DEPRECATED ACTION ***" : ""}`)
      }
    }
  }

  console.log("\n--- connect_src Metadata ---")
  const connectSrc = byKey["connect_src"]
  if (connectSrc) {
    console.log(`renderer: ${connectSrc.metadata?.renderer}`)
    console.log(`function_layer: ${connectSrc.metadata?.function_layer}`)
    console.log(`state_expression: ${connectSrc.metadata?.state_expression}`)
    const softFields = connectSrc.metadata?.soft_src_fields
    console.log(`soft_src_fields: ${JSON.stringify(softFields ?? null)}`)
  }

  console.log("\n--- ai_isnt_broken_intro hero_paths ---")
  const intro = byKey["ai_isnt_broken_intro"]
  if (intro) {
    console.log(JSON.stringify(intro.metadata?.hero_paths ?? "none", null, 2))
    console.log("\nactions:")
    console.log(JSON.stringify(intro.metadata?.actions ?? [], null, 2))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
