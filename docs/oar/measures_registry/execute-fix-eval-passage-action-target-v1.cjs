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

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_audit_left_path_post_passage_dead_surface_and_vite_placeholder_warning_v1.meta.md"

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  console.log("=== Fix eval_passage action target_encounter_key ===")
  console.log(`source_oar2: ${SOURCE_OAR2}\n`)

  // Read current eval_passage row
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "eval_passage"),
    "read eval_passage",
  )
  const row = rows[0]
  if (!row) throw new Error("eval_passage row not found")

  const meta = row.metadata ?? {}
  const actions = Array.isArray(meta.actions) ? meta.actions : []

  // Find the continue_to_evaluation action
  const actionIdx = actions.findIndex((a) => a?.action_key === "continue_to_evaluation")
  if (actionIdx === -1) throw new Error("continue_to_evaluation action not found in eval_passage")

  const before = {
    action_key: actions[actionIdx].action_key,
    behavior: actions[actionIdx].behavior,
    target_encounter_key: actions[actionIdx].target_encounter_key,
  }

  console.log("before:", JSON.stringify(before))

  // Correct: left path after eval_passage goes to connect_src
  const correctedActions = actions.map((action, idx) => {
    if (idx !== actionIdx) return action
    return {
      ...action,
      target_encounter_key: "connect_src",
      corrected_by_oar2: SOURCE_OAR2,
      correction_note: "left-path route target corrected from educate_eval_encounter to connect_src; renderer Continue buttons are hardwired but action data must reflect actual left-path destination",
    }
  })

  const updatedMetadata = {
    ...meta,
    actions: correctedActions,
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("encounter_key", "eval_passage"),
    "update eval_passage action",
  )

  // Readback
  const readbackRows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("metadata")
      .eq("encounter_key", "eval_passage"),
    "readback",
  )
  const readbackActions = readbackRows[0]?.metadata?.actions ?? []
  const correctedAction = readbackActions.find((a) => a?.action_key === "continue_to_evaluation")

  const after = {
    action_key: correctedAction?.action_key,
    behavior: correctedAction?.behavior,
    target_encounter_key: correctedAction?.target_encounter_key,
  }

  console.log("after:", JSON.stringify(after))

  const output = {
    source_oar2: SOURCE_OAR2,
    encounter_key: "eval_passage",
    action_key: "continue_to_evaluation",
    before,
    after,
    target_corrected: after.target_encounter_key === "connect_src",
    db_rows_updated: 1,
    renderer_note: "Continue buttons in renderEducationalDiagnosticPassageSurface are hardwired to connect_src — this correction aligns DB data with actual routing, does not change renderer behavior",
  }

  console.log("\n" + JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
