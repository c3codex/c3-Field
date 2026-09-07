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

function printEncounterContracts(row) {
  const m = row.metadata ?? {}
  console.log(`display_title: ${row.display_title}`)
  console.log(`eyebrow: ${m.eyebrow ?? "(none)"}`)
  console.log(`title: ${m.title ?? "(none)"}`)
  console.log(`subtitle: ${m.subtitle ?? "(none)"}`)
  console.log(`informational_paragraph: ${m.informational_paragraph ?? "(none)"}`)
  console.log(`cta_primary: ${m.cta_primary ?? "(none)"}`)
  console.log(`cta_secondary: ${m.cta_secondary ?? "(none)"}`)
  console.log("layout_contract:", JSON.stringify(m.layout_contract ?? null, null, 2))
  console.log("styling_contract:", JSON.stringify(m.styling_contract ?? m.encounter_contract?.styling_contract ?? null, null, 2))
  console.log("branding_contract:", JSON.stringify(m.branding_contract ?? null, null, 2))
  console.log("footer_contract:", JSON.stringify(m.footer_contract ?? null, null, 2))
  console.log("media_behavior_contract:", JSON.stringify(m.media_behavior_contract ?? null, null, 2))
  console.log("media_roles:", JSON.stringify(m.media_roles ?? null, null, 2))
}

async function main() {
  // 1. eval_passage
  console.log("=== eval_passage ===\n")
  const epRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .eq("encounter_key", "eval_passage"),
    "read eval_passage",
  )
  if (!epRows[0]) { console.log("MISSING"); } else { printEncounterContracts(epRows[0]) }

  // 2. measures_assessment — full metadata including questions
  console.log("\n\n=== measures_assessment ===\n")
  const maRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .eq("encounter_key", "measures_assessment"),
    "read measures_assessment",
  )
  const maRow = maRows[0]
  if (!maRow) {
    console.log("MISSING")
  } else {
    printEncounterContracts(maRow)
    console.log("\n--- QUESTIONS ---")
    const questions = maRow.metadata?.assessment_mechanics?.questions ?? []
    for (const [i, q] of questions.entries()) {
      console.log(`\nQ${i + 1}: ${q.question_key}`)
      console.log(`  question: ${q.question}`)
      console.log(`  context_statement: ${q.context_statement ?? "(none)"}`)
      console.log(`  context_label: ${q.context_label ?? "(none)"}`)
    }
  }

  // 3. structured_eval
  console.log("\n\n=== structured_eval ===\n")
  const seRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .eq("encounter_key", "structured_eval"),
    "read structured_eval",
  )
  const seRow = seRows[0]
  if (!seRow) {
    console.log("MISSING")
  } else {
    printEncounterContracts(seRow)
    console.log("\n--- QUESTIONS ---")
    const questions = seRow.metadata?.assessment_mechanics?.questions ?? []
    if (questions.length === 0) {
      console.log("(no questions — uses measures_assessment questions)")
    } else {
      for (const [i, q] of questions.entries()) {
        console.log(`\nQ${i + 1}: ${q.question_key}`)
        console.log(`  question: ${q.question}`)
        console.log(`  context_statement: ${q.context_statement ?? "(none)"}`)
      }
    }
  }

  console.log("\n--- INSPECTION COMPLETE (read-only) ---")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
