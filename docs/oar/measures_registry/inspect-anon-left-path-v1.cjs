require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !anonKey) throw new Error("Supabase anon credentials missing")

const anon = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

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

async function main() {
  console.log("=== Anon Key Left Path Readability ===\n")
  console.log(`supabaseUrl: ${supabaseUrl}`)
  console.log(`anonKey: ${anonKey ? anonKey.slice(0, 20) + "..." : "MISSING"}\n`)

  const result = await anon
    .from("measures_encounter_def")
    .select("encounter_key, is_active")
    .in("encounter_key", REGISTERED_ENCOUNTER_KEYS)
    .order("encounter_key")

  if (result.error) {
    console.error("ERROR:", result.error.message)
    return
  }

  const returned = result.data.map((r) => r.encounter_key)
  const missing = REGISTERED_ENCOUNTER_KEYS.filter((k) => !returned.includes(k))

  console.log("returned by anon:", returned)
  console.log("\nmissing from anon result:", missing.length === 0 ? "none" : missing)

  for (const row of result.data) {
    console.log(`  ${row.encounter_key}: is_active=${row.is_active}`)
  }

  const connectSrc = result.data.find((r) => r.encounter_key === "connect_src")
  console.log("\nconnect_src anon-visible:", connectSrc ? `yes, is_active=${connectSrc.is_active}` : "NO — BLOCKED OR MISSING")

  const measuresAssessment = result.data.find((r) => r.encounter_key === "measures_assessment")
  console.log("measures_assessment anon-visible:", measuresAssessment ? `yes, is_active=${measuresAssessment.is_active}` : "NO — BLOCKED OR MISSING")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
