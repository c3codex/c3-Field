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

async function readEncounterMetadata(encounterKey) {
  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .eq("encounter_key", encounterKey),
    `read ${encounterKey}`,
  )
  return rows[0] ?? null
}

async function main() {
  console.log("=== Left Path Route State Inspection ===\n")

  const keys = [
    "evaluate_structure_path",
    "eval_passage",
    "connect_src",
    "measures_assessment",
  ]

  for (const key of keys) {
    const row = await readEncounterMetadata(key)
    if (!row) {
      console.log(`${key}: NOT FOUND IN DB`)
      continue
    }

    const meta = row.metadata ?? {}
    const report = {
      encounter_key: key,
      is_active: row.is_active,
      function_layer: meta.function_layer ?? null,
      state_expression: meta.state_expression ?? null,
      renderer: meta.renderer ?? null,
      plaques: meta.plaques ?? null,
      more: meta.more ?? null,
      coherence: meta.coherence ?? null,
      actions: meta.actions ?? null,
    }

    console.log(JSON.stringify(report, null, 2))
    console.log()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
