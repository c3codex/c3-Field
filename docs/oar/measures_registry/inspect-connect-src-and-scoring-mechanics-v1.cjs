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
  // 1. connect_src full metadata
  console.log("=== connect_src FULL METADATA ===\n")
  const connectRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, is_active, metadata")
      .eq("encounter_key", "connect_src"),
    "read connect_src",
  )
  const connectRow = connectRows[0]
  if (!connectRow) {
    console.log("MISSING: connect_src not found")
  } else {
    console.log(`display_title: ${connectRow.display_title}`)
    console.log(`is_active: ${connectRow.is_active}`)
    console.log("metadata:")
    console.log(JSON.stringify(connectRow.metadata, null, 2))
  }

  // 2. measures_assessment — questions with options and condition_tags
  console.log("\n\n=== measures_assessment — QUESTIONS AND OPTIONS ===\n")
  const assessRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "measures_assessment"),
    "read measures_assessment",
  )
  const assessRow = assessRows[0]
  if (!assessRow) {
    console.log("MISSING: measures_assessment not found")
  } else {
    const mechanics = assessRow.metadata?.assessment_mechanics
    const questions = Array.isArray(mechanics?.questions) ? mechanics.questions : []
    console.log(`Total questions: ${questions.length}\n`)
    for (const [qi, q] of questions.entries()) {
      console.log(`Q${qi + 1}: ${q.question_key}`)
      console.log(`  question: ${q.question}`)
      const options = Array.isArray(q.options) ? q.options : []
      for (const opt of options) {
        const tags = Array.isArray(opt.condition_tags) ? opt.condition_tags : []
        console.log(`  [${opt.value}] "${opt.label}" | condition_tags: [${tags.join(", ")}]`)
      }
      console.log("")
    }
  }

  // 3. measures_assessment — assessment_interpretation standing_rules summary
  console.log("\n=== measures_assessment — assessment_interpretation STANDING_RULES ===\n")
  if (assessRow) {
    const interp = assessRow.metadata?.assessment_interpretation
    const standingRules = Array.isArray(interp?.standing_rules) ? interp.standing_rules : []
    console.log(`standing_rules count: ${standingRules.length}`)
    for (const rule of standingRules) {
      console.log(`  rule_key=${rule.rule_key ?? rule.standing_key} | standing_key=${rule.standing_key} | standing="${rule.standing}" | priority=${rule.priority ?? 0}`)
      if (Array.isArray(rule.any_tags) && rule.any_tags.length > 0) console.log(`    any_tags: [${rule.any_tags.join(", ")}]`)
      if (Array.isArray(rule.all_tags) && rule.all_tags.length > 0) console.log(`    all_tags: [${rule.all_tags.join(", ")}]`)
    }

    const reportTemplates = interp?.report_templates ?? {}
    console.log(`\nreport_templates keys: ${Object.keys(reportTemplates).join(", ")}`)
    for (const [key, template] of Object.entries(reportTemplates)) {
      if (typeof template === "object" && template !== null) {
        console.log(`  [${key}] assessment_result="${template.assessment_result}" | recommended_structured_action="${template.recommended_structured_action}"`)
      }
    }

    console.log(`\nfinding_map present: ${Boolean(interp?.finding_map)}`)
    if (interp?.finding_map) {
      for (const [tag, finding] of Object.entries(interp.finding_map)) {
        console.log(`  ${tag} -> "${finding}"`)
      }
    }

    console.log(`\nscoring_thresholds present: ${Boolean(interp?.scoring_thresholds)}`)
    if (interp?.scoring_thresholds) {
      console.log(JSON.stringify(interp.scoring_thresholds, null, 2))
    }
  }

  console.log("\n--- INSPECTION COMPLETE (read-only) ---")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
