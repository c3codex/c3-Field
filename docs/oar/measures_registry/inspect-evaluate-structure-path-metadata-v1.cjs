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

async function main() {
  console.log("=== evaluate_structure_path metadata inspection ===\n")

  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, is_active, metadata")
      .eq("encounter_key", "evaluate_structure_path"),
    "read evaluate_structure_path",
  )

  const row = rows[0]
  if (!row) {
    console.log("MISSING: evaluate_structure_path row not found in DB")
    return
  }

  console.log(`encounter_key: ${row.encounter_key}`)
  console.log(`display_title: ${row.display_title}`)
  console.log(`is_active: ${row.is_active}`)

  const meta = row.metadata ?? {}

  console.log(`\n--- top-level copy fields ---`)
  console.log(`eyebrow: ${meta.eyebrow ?? "(null)"}`)
  console.log(`title: ${meta.title ?? "(null)"}`)
  console.log(`subtitle: ${meta.subtitle ?? "(null)"}`)
  console.log(`renderer: ${meta.renderer ?? "(null)"}`)
  console.log(`function_layer: ${meta.function_layer ?? "(null)"}`)

  console.log(`\n--- plaques (${Array.isArray(meta.plaques) ? meta.plaques.length : "null"} items) ---`)
  if (Array.isArray(meta.plaques) && meta.plaques.length > 0) {
    console.log(JSON.stringify(meta.plaques, null, 2))
  } else {
    console.log("(empty or absent)")
  }

  console.log(`\n--- hero_paths (${Array.isArray(meta.hero_paths) ? meta.hero_paths.length : "null"} items) ---`)
  if (Array.isArray(meta.hero_paths) && meta.hero_paths.length > 0) {
    console.log(JSON.stringify(meta.hero_paths, null, 2))
  } else {
    console.log("(empty or absent)")
  }

  console.log(`\n--- more field ---`)
  console.log(JSON.stringify(meta.more ?? null, null, 2))

  console.log(`\n--- actions (${Array.isArray(meta.actions) ? meta.actions.length : "null"} items) ---`)
  if (Array.isArray(meta.actions) && meta.actions.length > 0) {
    for (const action of meta.actions) {
      console.log(`  action_key=${action.action_key} behavior=${action.behavior} target=${action.target_encounter_key ?? "(none)"}`)
    }
  } else {
    console.log("(empty or absent)")
  }

  console.log(`\n--- breakdown_blocks ---`)
  console.log(JSON.stringify(meta.breakdown_blocks ?? null, null, 2))

  console.log(`\n--- full metadata keys ---`)
  console.log(Object.keys(meta).join(", "))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
