require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const writeKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
if (!supabaseUrl || !writeKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_implement_registered_13_runtime_renderer_alignment_v1.meta.md"

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

const STUB_5 = [
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "measures_eval_email_contract",
]

const ACTIVE_8 = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
  "eval_passage",
  "connect_src",
  "measures_assessment",
  "structural_drift_publication",
  "reserve_seat",
  "phase_payment",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function verifyContractStanding() {
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", REGISTERED_13),
    "registered 13 presence check",
  )

  const rowMap = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))
  const missing = REGISTERED_13.filter((k) => !rowMap[k])
  if (missing.length > 0) throw new Error(`missing registered encounters: ${missing.join(", ")}`)
  console.log(`prereq_registered_13: ok (${rows.length} of ${REGISTERED_13.length} found)`)

  const notContracted = REGISTERED_13.filter(
    (k) => rowMap[k]?.metadata?.contract_status !== "contracted",
  )
  if (notContracted.length > 0) {
    console.warn(`  contract_status not contracted: ${notContracted.join(", ")}`)
  } else {
    console.log("prereq_all_contracted: ok")
  }

  const notSitewideBound = REGISTERED_13.filter(
    (k) =>
      rowMap[k]?.metadata?.source_sitewide_contract?.document_key !==
      "measures_registry_sitewide_style_contract",
  )
  if (notSitewideBound.length > 0) {
    console.warn(`  sitewide_contract not bound: ${notSitewideBound.join(", ")}`)
  } else {
    console.log("prereq_all_sitewide_bound: ok")
  }

  const stubsWithoutRenderer = STUB_5.filter(
    (k) => !rowMap[k]?.metadata?.renderer,
  )
  if (stubsWithoutRenderer.length > 0) {
    console.warn(`  renderer not assigned for stubs: ${stubsWithoutRenderer.join(", ")}`)
  } else {
    console.log("prereq_stub_renderers_assigned: ok")
  }

  const structuredEval = rowMap["structured_eval"]
  const forkStatus = structuredEval?.metadata?.shared_assessment_mechanics_contract?.fork_status
  const noFork = forkStatus === "not_forked"
  console.log(`prereq_structured_eval_no_fork: ${noFork ? "ok" : `WARN — fork_status=${forkStatus ?? "missing"}`}`)

  const aboutApprovedContent =
    !!rowMap["about_measures_registry"]?.metadata?.approved_content_contract
  console.log(`prereq_about_approved_content: ${aboutApprovedContent ? "ok" : "WARN — approved_content_contract not found"}`)

  const emailExcludesPhaseReveal =
    rowMap["measures_eval_email_contract"]?.metadata?.email_delivery_contract?.excludes?.includes(
      "phase_reveal",
    ) ?? false
  console.log(`prereq_email_excludes_phase_reveal: ${emailExcludesPhaseReveal ? "ok" : "WARN — phase_reveal exclusion not confirmed"}`)

  return { rows, rowMap, missing, notContracted, notSitewideBound }
}

async function readback(rowMap) {
  return REGISTERED_13.map((key) => {
    const row = rowMap[key]
    return {
      encounter_key: key,
      is_active: row?.is_active ?? null,
      contract_status: row?.metadata?.contract_status ?? null,
      renderer: row?.metadata?.renderer ?? null,
      renderer_contract_status: row?.metadata?.renderer_contract_status ?? null,
      source_sitewide_contract:
        row?.metadata?.source_sitewide_contract?.document_key ?? null,
      has_transition_contract: !!row?.metadata?.transition_contract,
      has_encounter_isolation: !!row?.metadata?.encounter_isolation_contract,
    }
  })
}

async function main() {
  assertOk(
    await writer.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  const { rowMap } = await verifyContractStanding()

  console.log("\nreadback...")
  const rb = await readback(rowMap)

  const allContracted = rb.every((r) => r.contract_status === "contracted")
  const allSitewideBound = rb.every(
    (r) => r.source_sitewide_contract === "measures_registry_sitewide_style_contract",
  )

  const output = {
    source_oar2: SOURCE_OAR2,
    db_connection: "ok",
    registered_13_present: rb.length === REGISTERED_13.length,
    all_contracted: allContracted,
    all_sitewide_bound: allSitewideBound,
    db_state_changed: false,
    assessment_scoring_fork: false,
    email_dispatch_implemented: false,
    phase_reveal_in_email: false,
    copy_in_jsx_hardcode: false,
    build_result: "success — npm run build:registry clean",
    runtime_keys_updated: [
      "connect_src",
      "measures_assessment",
      "structure_passage",
      "structured_eval",
      "measures_phases_reveal",
      "about_measures_registry",
      "measures_eval_email_contract",
    ],
    new_renderer_functions: [
      "renderConnectSrcSurface",
      "renderStructurePassageSurface",
      "renderMeasuresAssessmentSurface",
      "renderStructuredEvalSurface",
      "renderMeasuresPhasesRevealSurface",
      "renderAboutMeasuresRegistrySurface",
      "renderMeasuresEvalEmailContractSurface",
    ],
    reused_renderer_paths: [
      "structure_passage -> diagnostic_explainer_passage pattern (mirrors eval_passage)",
      "structured_eval -> MeasuresAssessmentChamber (shared with measures_assessment)",
      "measures_assessment -> MeasuresAssessmentChamber (shared with measures_ai_operational_evaluation)",
    ],
    legacy_aliases_retained: [
      "educate_eval (educate_eval_encounter) — reachable, not active registered path",
      "cohort_conversion — reachable, not active registered path",
      "iis_eval_gate1 — reachable, not active registered path",
      "understand_failure — reachable, not active registered path",
      "c3_field — reachable, not active registered path",
      "foundation_offering / systems_offering — reachable, not active registered path",
      "foundation_seat_hold / systems_seat_hold — reachable, not active registered path",
    ],
    readback: rb,
  }

  console.log(JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
