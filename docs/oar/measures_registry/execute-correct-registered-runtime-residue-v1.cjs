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
  console.log("=== Execute: Correct Registered Runtime Residue ===\n")

  // --- 1. ai_isnt_broken_intro: right path route_cohort_conversion → route_structure_passage ---
  console.log("[1] ai_isnt_broken_intro — correct right path action")
  const introRow = await readRow("ai_isnt_broken_intro")
  const introMeta = { ...introRow.metadata }

  // Update actions array: replace route_cohort_conversion with route_structure_passage
  const updatedIntroActions = (introMeta.actions ?? []).map((action) => {
    if (action.action_key === "route_cohort_conversion") {
      return {
        ...action,
        action_key: "route_structure_passage",
        target_encounter_key: "structure_passage",
        label: action.label ?? "Structured Evaluation",
      }
    }
    return action
  })

  // Update hero_paths: replace route_cohort_conversion with route_structure_passage
  const updatedHeroPaths = (introMeta.hero_paths ?? []).map((path) => {
    if (path.action_key === "route_cohort_conversion") {
      return { ...path, action_key: "route_structure_passage" }
    }
    return path
  })

  introMeta.actions = updatedIntroActions
  introMeta.hero_paths = updatedHeroPaths

  await updateMetadata("ai_isnt_broken_intro", introMeta, "ai_isnt_broken_intro right action → route_structure_passage")

  // Verify
  const introVerify = await readRow("ai_isnt_broken_intro")
  const rightAction = introVerify.metadata?.actions?.find((a) => a.action_key === "route_structure_passage")
  const rightPath = introVerify.metadata?.hero_paths?.find((p) => p.action_key === "route_structure_passage")
  const oldAction = introVerify.metadata?.actions?.find((a) => a.action_key === "route_cohort_conversion")
  console.log(`  route_structure_passage action present: ${!!rightAction}`)
  console.log(`  route_structure_passage hero_path present: ${!!rightPath}`)
  console.log(`  route_cohort_conversion action removed: ${!oldAction}`)

  // --- 2. structural_drift_publication: begin_structural_evaluation target → measures_assessment ---
  console.log("\n[2] structural_drift_publication — correct begin_structural_evaluation target")
  const sdpRow = await readRow("structural_drift_publication")
  const sdpMeta = { ...sdpRow.metadata }

  const updatedSdpActions = (sdpMeta.actions ?? []).map((action) => {
    if (action.action_key === "begin_structural_evaluation") {
      return { ...action, target_encounter_key: "measures_assessment" }
    }
    return action
  })
  sdpMeta.actions = updatedSdpActions

  await updateMetadata("structural_drift_publication", sdpMeta, "structural_drift_publication begin_structural_evaluation → measures_assessment")

  const sdpVerify = await readRow("structural_drift_publication")
  const sdpAction = sdpVerify.metadata?.actions?.find((a) => a.action_key === "begin_structural_evaluation")
  console.log(`  begin_structural_evaluation target: ${sdpAction?.target_encounter_key}`)

  // --- 3. phase_payment: back_to_offering target → reserve_seat ---
  console.log("\n[3] phase_payment — correct back_to_offering target")
  const ppRow = await readRow("phase_payment")
  const ppMeta = { ...ppRow.metadata }

  const updatedPpActions = (ppMeta.actions ?? []).map((action) => {
    if (action.action_key === "back_to_offering") {
      return { ...action, target_encounter_key: "reserve_seat" }
    }
    return action
  })
  ppMeta.actions = updatedPpActions

  await updateMetadata("phase_payment", ppMeta, "phase_payment back_to_offering → reserve_seat")

  const ppVerify = await readRow("phase_payment")
  const ppAction = ppVerify.metadata?.actions?.find((a) => a.action_key === "back_to_offering")
  console.log(`  back_to_offering target: ${ppAction?.target_encounter_key}`)

  // --- 4. connect_src: update renderer, add soft_src_fields ---
  console.log("\n[4] connect_src — update renderer and seat soft_src_fields")
  const csRow = await readRow("connect_src")
  const csMeta = { ...csRow.metadata }

  csMeta.renderer = "soft_src_intake_surface"
  csMeta.soft_src_fields = ["institution_name", "institution_type", "contact_name", "contact_email"]
  csMeta.route_after_capture = "connectSrcNextEncounter"
  csMeta.frontend_hardcode_allowed = false

  await updateMetadata("connect_src", csMeta, "connect_src renderer → soft_src_intake_surface + soft_src_fields")

  const csVerify = await readRow("connect_src")
  console.log(`  renderer: ${csVerify.metadata?.renderer}`)
  console.log(`  soft_src_fields: ${JSON.stringify(csVerify.metadata?.soft_src_fields)}`)
  console.log(`  route_after_capture: ${csVerify.metadata?.route_after_capture}`)

  console.log("\n=== All corrections applied ===")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
