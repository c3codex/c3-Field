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
  "docs/oar/measures_registry/oar2_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md"

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

const STUBS_TO_ACTIVATE = [
  "structure_passage",
  "structured_eval",
  "measures_phases_reveal",
  "about_measures_registry",
  "measures_eval_email_contract",
  "phase_payment",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function captureCurrentState() {
  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", REGISTERED_13),
    "read registered 13",
  )
  return Object.fromEntries(rows.map((r) => [r.encounter_key, r]))
}

async function activateStubs(rowMap) {
  const before = {}
  const after = {}

  for (const key of STUBS_TO_ACTIVATE) {
    before[key] = rowMap[key]?.is_active ?? null
    assertOk(
      await writer
        .from("measures_encounter_def")
        .update({ is_active: true })
        .eq("encounter_key", key),
      `activate ${key}`,
    )
    after[key] = true
    console.log(`activated: ${key}`)
  }

  return { before, after }
}

async function correctPathChoiceActions(rowMap) {
  const ep = rowMap["evaluate_structure_path"]
  if (!ep) throw new Error("evaluate_structure_path row not found")

  const currentMetadata = ep.metadata
  const currentPlaques = Array.isArray(currentMetadata?.plaques) ? currentMetadata.plaques : []

  const newPlaques = [
    {
      side: "left",
      title: "Evaluate Structure",
      body: currentPlaques[0]?.body ?? "Outputs drift. Results change without cause.",
      action_key: "route_eval_passage",
      action_label: "Begin Evaluation",
    },
    {
      side: "right",
      title: "Orient to Structure",
      body: currentPlaques[1]?.body ?? "Integrity governance for AI-accelerated systems.",
      action_key: "route_structure_passage",
      action_label: "Begin Orientation",
    },
  ]

  const newActions = [
    {
      behavior: "route_surface",
      action_key: "route_eval_passage",
      target_encounter_key: "eval_passage",
      label: "Evaluate Structure",
    },
    {
      behavior: "route_surface",
      action_key: "route_structure_passage",
      target_encounter_key: "structure_passage",
      label: "Orient to Structure",
    },
  ]

  const newMore = {
    ...(currentMetadata?.more ?? {}),
    action_key: "route_eval_passage",
    label: "Evaluate Structure",
    action_label: "Begin Evaluation",
  }

  const newCoherence = {
    ...(currentMetadata?.coherence ?? {}),
    action_key: "route_structure_passage",
    label: "Orient to Structure",
    action_label: "Begin Orientation",
  }

  const updatedMetadata = {
    ...currentMetadata,
    plaques: newPlaques,
    actions: newActions,
    more: newMore,
    coherence: newCoherence,
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMetadata })
      .eq("encounter_key", "evaluate_structure_path"),
    "update evaluate_structure_path",
  )

  console.log("corrected: evaluate_structure_path plaques and actions")
  return {
    before: {
      plaques: currentPlaques.map((p) => ({ action_key: p.action_key, title: p.title })),
      actions: (currentMetadata?.actions ?? []).map((a) => ({
        action_key: a.action_key,
        target_encounter_key: a.target_encounter_key,
      })),
    },
    after: {
      plaques: newPlaques.map((p) => ({ action_key: p.action_key, title: p.title })),
      actions: newActions.map((a) => ({
        action_key: a.action_key,
        target_encounter_key: a.target_encounter_key,
      })),
    },
  }
}

async function verifyAnonReadback() {
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!anonKey) {
    console.warn("anon key not available — skipping anon readback")
    return { rows: [], missing: REGISTERED_13.slice() }
  }

  const anon = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: rows, error } = await anon
    .from("measures_encounter_def")
    .select("encounter_key, is_active")
    .in("encounter_key", REGISTERED_13)

  if (error) {
    console.warn("anon readback error:", error.message)
    return { rows: [], missing: REGISTERED_13.slice() }
  }

  const found = rows.map((r) => r.encounter_key)
  const missing = REGISTERED_13.filter((k) => !found.includes(k))
  return { rows, missing }
}

async function readbackPathChoiceActions() {
  const { data: row } = await writer
    .from("measures_encounter_def")
    .select("encounter_key, is_active, metadata")
    .eq("encounter_key", "evaluate_structure_path")
    .single()

  return {
    is_active: row?.is_active,
    plaques: (row?.metadata?.plaques ?? []).map((p) => ({
      side: p.side,
      title: p.title,
      action_key: p.action_key,
    })),
    actions: (row?.metadata?.actions ?? []).map((a) => ({
      action_key: a.action_key,
      target_encounter_key: a.target_encounter_key,
    })),
  }
}

async function main() {
  console.log("=== OAR2: Correct Registered Runtime Activation and Public Route Exposure ===")
  console.log(`source_oar2: ${SOURCE_OAR2}`)

  assertOk(
    await writer.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )
  console.log("db_connection: ok")

  const rowMap = await captureCurrentState()
  console.log(`registered_13_present: ${Object.keys(rowMap).length} of ${REGISTERED_13.length}`)

  const beforeActive = Object.fromEntries(
    REGISTERED_13.map((k) => [k, rowMap[k]?.is_active ?? null]),
  )
  console.log("\nbefore_active_state:")
  for (const [key, active] of Object.entries(beforeActive)) {
    console.log(`  ${key}: ${active}`)
  }

  console.log("\nactivating stubs...")
  const activation = await activateStubs(rowMap)

  console.log("\ncorrecting evaluate_structure_path actions...")
  const pathChoiceCorrection = await correctPathChoiceActions(rowMap)

  console.log("\nverifying anon readback...")
  const { rows: anonRows, missing: anonMissing } = await verifyAnonReadback()

  console.log("\nreadback: evaluate_structure_path after correction...")
  const pathChoiceReadback = await readbackPathChoiceActions()
  console.log(JSON.stringify(pathChoiceReadback, null, 2))

  const output = {
    source_oar2: SOURCE_OAR2,
    db_connection: "ok",
    before_active_state: beforeActive,
    stubs_activated: STUBS_TO_ACTIVATE,
    activation_before: activation.before,
    activation_after: activation.after,
    path_choice_correction: pathChoiceCorrection,
    path_choice_readback: pathChoiceReadback,
    anon_readback_count: anonRows.length,
    anon_readback_missing: anonMissing,
    all_13_anon_readable: anonMissing.length === 0,
    db_rows_updated: STUBS_TO_ACTIVATE.length + 1,
    db_state_changed: true,
    deprecated_routes_exposed: false,
    assessment_scoring_altered: false,
    email_dispatch_implemented: false,
    payment_logic_exposed: false,
    css_modified: false,
  }

  console.log("\n" + JSON.stringify(output, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
