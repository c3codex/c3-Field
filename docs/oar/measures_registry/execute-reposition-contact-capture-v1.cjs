require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function readRow(encounterKey) {
  const result = await writer
    .from("measures_encounter_def")
    .select("encounter_key, metadata")
    .eq("encounter_key", encounterKey)
    .single()
  assertOk(result, `read ${encounterKey}`)
  return result.data
}

async function updateMetadata(encounterKey, metadata, label) {
  const result = await writer
    .from("measures_encounter_def")
    .update({ metadata })
    .eq("encounter_key", encounterKey)
  assertOk(result, label)
  console.log(`  updated: ${label}`)
}

async function main() {
  console.log("=== Execute: Reposition Contact Capture ===\n")

  // --- 1. eval_passage: continue_to_evaluation target -> measures_assessment ---
  console.log("[1] eval_passage — correct continue_to_evaluation target")
  const epRow = await readRow("eval_passage")
  const epMeta = { ...epRow.metadata }

  const updatedEpActions = (epMeta.actions ?? []).map((action) => {
    if (action.action_key === "continue_to_evaluation") {
      return { ...action, target_encounter_key: "measures_assessment" }
    }
    return action
  })
  epMeta.actions = updatedEpActions

  await updateMetadata("eval_passage", epMeta, "eval_passage continue_to_evaluation -> measures_assessment")

  const epVerify = await readRow("eval_passage")
  const epAction = epVerify.metadata?.actions?.find((a) => a.action_key === "continue_to_evaluation")
  console.log(`  continue_to_evaluation target: ${epAction?.target_encounter_key}`)

  // --- 2. connect_src: mark as held (pre-assessment intake deferred) ---
  console.log("\n[2] connect_src — mark as held pre-assessment intake")
  const csRow = await readRow("connect_src")
  const csMeta = { ...csRow.metadata }

  csMeta.standing = "held_pre_assessment_intake"
  csMeta.standing_note = "connect_src removed from active registered flow. Retained as future institutional intake surface. Not reached from registered public path."

  await updateMetadata("connect_src", csMeta, "connect_src standing -> held_pre_assessment_intake")

  const csVerify = await readRow("connect_src")
  console.log(`  standing: ${csVerify.metadata?.standing}`)

  // --- 3. measures_eval_email_contract: note route_after_capture ---
  console.log("\n[3] measures_eval_email_contract — seat route_after_capture")
  const mecRow = await readRow("measures_eval_email_contract")
  const mecMeta = { ...mecRow.metadata }

  mecMeta.route_after_capture = "measures_phases_reveal"

  await updateMetadata("measures_eval_email_contract", mecMeta, "measures_eval_email_contract route_after_capture -> measures_phases_reveal")

  const mecVerify = await readRow("measures_eval_email_contract")
  console.log(`  route_after_capture: ${mecVerify.metadata?.route_after_capture}`)

  console.log("\n=== All corrections applied ===")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
