require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required")
}

const supabase = createClient(supabaseUrl, supabaseKey)
const SOURCE = "registered_13_encounter_rows_reconciliation_v1"

const RENAMES = [
  { from: "landing_root", to: "ai_isnt_broken_intro", stateExpression: "public_ai_isnt_broken_intro", sequenceOrder: 1000 },
  { from: "landing_path_choice", to: "evaluate_structure_path", stateExpression: "public_evaluate_structure_path", sequenceOrder: 1001 },
  { from: "educational_diagnostic_passage", to: "eval_passage", stateExpression: "public_eval_passage", sequenceOrder: 1002 },
  { from: "c3_field", to: "connect_src", stateExpression: "public_connect_src", sequenceOrder: 1003 },
  { from: "measures_ai_operational_evaluation", to: "measures_assessment", stateExpression: "public_measures_assessment", sequenceOrder: 1004 },
  { from: "structural_drift_dispatches", to: "structural_drift_publication", stateExpression: "native_structural_drift_publication", sequenceOrder: 1035 },
]

const DEPRECATIONS = [
  {
    key: "educate_eval_encounter",
    replacement: "eval_passage",
    reason: "Redundant educational threshold absorbed into eval_passage routing",
  },
  {
    key: "iis_eval_gate1",
    replacement: "measures_assessment",
    reason: "Legacy evaluation gate; authority transferred to measures_assessment",
  },
  {
    key: "cohort_conversion_encounter",
    replacement: null,
    reason: "Conversion experiment; no target slot in registered 13-surface runtime",
  },
  {
    key: "understand_failure",
    replacement: null,
    reason: "Generic media encounter; no target slot in registered 13-surface runtime",
  },
  {
    key: "foundation_offering",
    replacement: null,
    reason: "Offering surface; split-program model not in registered runtime",
  },
  {
    key: "systems_offering",
    replacement: null,
    reason: "Shared renderer group with foundation_offering; deprecated with foundation_offering",
  },
  {
    key: "systems_seat_hold",
    replacement: "phase_payment",
    reason: "Split-program hold model; merged into phase_payment from foundation_seat_hold",
  },
]

const STUBS = [
  {
    key: "structure_passage",
    display_title: "Structure Passage",
    function_layer: "education_diagnostic",
    state_expression: "public_structure_passage",
    sequence_order: 1010,
  },
  {
    key: "structured_eval",
    display_title: "Structured Evaluation",
    function_layer: "diagnostic_capture",
    state_expression: "public_structured_eval",
    sequence_order: 1020,
  },
  {
    key: "measures_phases_reveal",
    display_title: "Measures Phases",
    function_layer: "orientation",
    state_expression: "public_measures_phases_reveal",
    sequence_order: 1025,
  },
  {
    key: "about_measures_registry",
    display_title: "About Measures Registry",
    function_layer: "authority",
    state_expression: "public_about_measures_registry",
    sequence_order: 1030,
  },
  {
    key: "measures_eval_email_contract",
    display_title: "Measures Evaluation Email Contract",
    function_layer: "intake",
    state_expression: "public_measures_eval_email_contract",
    sequence_order: 1040,
  },
]

// Registered 13 runtime route structure
const ROUTES = [
  {
    from: "ai_isnt_broken_intro",
    to: "evaluate_structure_path",
    kind: "progression",
    sort: 10,
    action_id: "route_evaluate_structure_path",
    action_label: "Continue",
    emphasis: "primary",
  },
  {
    from: "evaluate_structure_path",
    to: "eval_passage",
    kind: "progression",
    sort: 10,
    action_id: "route_eval_passage",
    action_label: "Evaluate Structure",
    emphasis: "primary",
  },
  {
    from: "evaluate_structure_path",
    to: "structure_passage",
    kind: "progression",
    sort: 20,
    action_id: "route_structure_passage",
    action_label: "Orient to Structure",
    emphasis: "secondary",
  },
  {
    from: "eval_passage",
    to: "connect_src",
    kind: "progression",
    sort: 10,
    action_id: "route_connect_src_from_eval",
    action_label: "Continue",
    emphasis: "primary",
  },
  {
    from: "structure_passage",
    to: "connect_src",
    kind: "progression",
    sort: 10,
    action_id: "route_connect_src_from_structure",
    action_label: "Continue",
    emphasis: "primary",
  },
  {
    from: "connect_src",
    to: "measures_assessment",
    kind: "progression",
    sort: 10,
    action_id: "route_measures_assessment",
    action_label: "Begin Evaluation",
    emphasis: "primary",
  },
  {
    from: "connect_src",
    to: "structured_eval",
    kind: "progression",
    sort: 20,
    action_id: "route_structured_eval",
    action_label: "Begin Structured Evaluation",
    emphasis: "secondary",
  },
  {
    from: "measures_assessment",
    to: "measures_phases_reveal",
    kind: "progression",
    sort: 10,
    action_id: "route_phases_reveal_from_assessment",
    action_label: "View Phases",
    emphasis: "primary",
  },
  {
    from: "structured_eval",
    to: "measures_phases_reveal",
    kind: "progression",
    sort: 10,
    action_id: "route_phases_reveal_from_structured",
    action_label: "View Phases",
    emphasis: "primary",
  },
  {
    from: "measures_phases_reveal",
    to: "about_measures_registry",
    kind: "progression",
    sort: 10,
    action_id: "route_about_measures_registry",
    action_label: "About Measures Registry",
    emphasis: "primary",
  },
  {
    from: "about_measures_registry",
    to: "structural_drift_publication",
    kind: "progression",
    sort: 10,
    action_id: "route_structural_drift_publication",
    action_label: "Continue",
    emphasis: "primary",
  },
  {
    from: "structural_drift_publication",
    to: "measures_eval_email_contract",
    kind: "progression",
    sort: 10,
    action_id: "route_measures_eval_email_contract",
    action_label: "Continue",
    emphasis: "primary",
  },
  {
    from: "measures_eval_email_contract",
    to: "reserve_seat",
    kind: "progression",
    sort: 10,
    action_id: "route_reserve_seat",
    action_label: "Reserve Seat",
    emphasis: "primary",
  },
  {
    from: "reserve_seat",
    to: "phase_payment",
    kind: "progression",
    sort: 10,
    action_id: "route_phase_payment",
    action_label: "Complete Phase Payment",
    emphasis: "primary",
  },
]

const TARGET_KEYS = [
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

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  const phase = process.argv[2] || "all"

  await assertOk(
    await supabase.from("measures_registry").select("id").limit(1),
    "DB connection failed",
  )
  console.log("db_connection: ok")

  if (phase === "readback") {
    await readBack()
    return
  }

  // --- PHASE 1: RENAMES ---
  console.log("\n--- phase_1_renames ---")
  const renameResults = []

  for (const { from: fromKey, to: toKey, stateExpression, sequenceOrder } of RENAMES) {
    const [alreadyTarget] = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id, metadata")
        .eq("encounter_key", toKey)
        .limit(1),
      `${toKey} existence check failed`,
    )

    if (alreadyTarget) {
      console.log(`${fromKey} → ${toKey}: already at target key (idempotent)`)
      renameResults.push({ from: fromKey, to: toKey, status: "already_renamed" })
      continue
    }

    const [sourceRow] = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id, metadata")
        .eq("encounter_key", fromKey)
        .limit(1),
      `${fromKey} source lookup failed`,
    )

    if (!sourceRow) {
      console.warn(`${fromKey}: source row not found — skipping`)
      renameResults.push({ from: fromKey, to: toKey, status: "source_not_found" })
      continue
    }

    const updatedMetadata = {
      ...(sourceRow.metadata ?? {}),
      state_expression: stateExpression,
      reconciled_from: fromKey,
      reconciliation_source: SOURCE,
    }

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ encounter_key: toKey, sequence_order: sequenceOrder, metadata: updatedMetadata })
        .eq("id", sourceRow.id),
      `${fromKey} → ${toKey} encounter_def rename failed`,
    )

    const registryUpdate = await supabase
      .from("measures_registry")
      .update({ registry_key: toKey, sequence_order: sequenceOrder })
      .eq("registry_key", fromKey)
    if (registryUpdate.error) {
      console.warn(
        `${fromKey} → ${toKey} registry_key rename warning: ${registryUpdate.error.message}`,
      )
    }

    console.log(`${fromKey} → ${toKey}: ok (state_expression: ${stateExpression})`)
    renameResults.push({ from: fromKey, to: toKey, status: "renamed", stateExpression })
  }

  // --- PHASE 2: RESERVE_SEAT ---
  console.log("\n--- phase_2_reserve_seat ---")
  const [reserveSeat] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, metadata")
      .eq("encounter_key", "reserve_seat")
      .limit(1),
    "reserve_seat lookup failed",
  )

  if (!reserveSeat) {
    console.warn("reserve_seat: not found")
  } else if (reserveSeat.metadata?.state_expression !== "public_learning_reserve_seat") {
    const prior = reserveSeat.metadata?.state_expression
    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({
          metadata: {
            ...(reserveSeat.metadata ?? {}),
            state_expression: "public_learning_reserve_seat",
            reconciliation_source: SOURCE,
          },
        })
        .eq("id", reserveSeat.id),
      "reserve_seat state_expression correction failed",
    )
    console.log(`reserve_seat: state_expression corrected (was: ${prior ?? "null"})`)
  } else {
    console.log("reserve_seat: state_expression correct (public_learning_reserve_seat)")
  }

  // --- PHASE 3: DEPRECATIONS ---
  console.log("\n--- phase_3_deprecations ---")
  const deprecationResults = []

  for (const { key, replacement, reason } of DEPRECATIONS) {
    const [row] = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id, metadata")
        .eq("encounter_key", key)
        .limit(1),
      `${key} deprecation lookup failed`,
    )

    if (!row) {
      console.warn(`${key}: not found — skipping deprecation`)
      deprecationResults.push({ key, status: "not_found" })
      continue
    }

    if (row.metadata?.deprecated === true) {
      console.log(`${key}: already deprecated (idempotent)`)
      deprecationResults.push({ key, status: "already_deprecated" })
      continue
    }

    const deprecationMetadata = {
      ...(row.metadata ?? {}),
      deprecated: true,
      deprecated_by: "registered_13_surface_runtime_v1",
      deprecation_reason: reason,
      deprecation_source: SOURCE,
      ...(replacement ? { replacement_encounter_key: replacement } : {}),
    }

    await assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ is_active: false, metadata: deprecationMetadata })
        .eq("id", row.id),
      `${key} deprecation update failed`,
    )

    console.log(`${key}: deprecated ok${replacement ? ` → ${replacement}` : ""}`)
    deprecationResults.push({ key, status: "deprecated", replacement: replacement ?? null })
  }

  // --- PHASE 4: PHASE_PAYMENT ---
  console.log("\n--- phase_4_phase_payment ---")

  const [existingPhasePayment] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id")
      .eq("encounter_key", "phase_payment")
      .limit(1),
    "phase_payment existence check failed",
  )

  if (existingPhasePayment) {
    console.log("phase_payment: already exists (idempotent)")
  } else {
    const [foundationHold] = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("metadata, encounter_type, material_family, surface_type, pause_allowed")
        .eq("encounter_key", "foundation_seat_hold")
        .limit(1),
      "foundation_seat_hold baseline lookup failed",
    )

    let registryId = null
    const [ppRegistry] = await assertOk(
      await supabase
        .from("measures_registry")
        .select("id")
        .eq("registry_key", "phase_payment")
        .limit(1),
      "phase_payment registry lookup failed",
    )

    if (ppRegistry) {
      registryId = ppRegistry.id
    } else {
      const inserted = await assertOk(
        await supabase
          .from("measures_registry")
          .insert({
            registry_key: "phase_payment",
            display_title: "Phase Payment",
            registry_family: "spine",
            encounter_type: "view",
            material_family: "obsidian",
            sequence_order: 1055,
            release_state: "held",
            access_state: "encounterable",
            is_active: false,
            metadata: { source: SOURCE, reconciliation_origin: "foundation_seat_hold_merge" },
          })
          .select("id"),
        "phase_payment registry insert failed",
      )
      registryId = inserted[0].id
    }

    const baseMetadata = { ...(foundationHold?.metadata ?? {}) }
    delete baseMetadata.deprecated
    delete baseMetadata.deprecated_by
    delete baseMetadata.deprecation_reason
    delete baseMetadata.replacement_encounter_key

    const phasePaymentMetadata = {
      ...baseMetadata,
      function_layer: "intake",
      state_expression: "public_phase_payment",
      renderer: foundationHold?.metadata?.renderer ?? "hold_surface",
      contract_status: "pending_contract",
      reconciliation_origin: "foundation_seat_hold_merge",
      reconciliation_source: SOURCE,
    }

    await assertOk(
      await supabase.from("measures_encounter_def").insert({
        registry_id: registryId,
        encounter_key: "phase_payment",
        display_title: "Phase Payment",
        encounter_type: foundationHold?.encounter_type ?? "view",
        material_family: foundationHold?.material_family ?? "obsidian",
        surface_type: foundationHold?.surface_type ?? "threshold",
        sequence_order: 1055,
        pause_allowed: foundationHold?.pause_allowed ?? true,
        is_entry_surface: false,
        is_active: false,
        metadata: phasePaymentMetadata,
      }),
      "phase_payment insert failed",
    )
    console.log("phase_payment: created ok")
  }

  // --- PHASE 5: STUB ROWS ---
  console.log("\n--- phase_5_stub_rows ---")

  for (const stub of STUBS) {
    const [existing] = await assertOk(
      await supabase
        .from("measures_encounter_def")
        .select("id")
        .eq("encounter_key", stub.key)
        .limit(1),
      `${stub.key} existence check failed`,
    )

    if (existing) {
      console.log(`${stub.key}: already exists (idempotent)`)
      continue
    }

    let registryId = null
    const [stubRegistry] = await assertOk(
      await supabase
        .from("measures_registry")
        .select("id")
        .eq("registry_key", stub.key)
        .limit(1),
      `${stub.key} registry lookup failed`,
    )

    if (stubRegistry) {
      registryId = stubRegistry.id
    } else {
      const inserted = await assertOk(
        await supabase
          .from("measures_registry")
          .insert({
            registry_key: stub.key,
            display_title: stub.display_title,
            registry_family: "spine",
            encounter_type: "view",
            material_family: "obsidian",
            sequence_order: stub.sequence_order,
            release_state: "held",
            access_state: "encounterable",
            is_active: false,
            metadata: { source: SOURCE },
          })
          .select("id"),
        `${stub.key} registry insert failed`,
      )
      registryId = inserted[0].id
    }

    await assertOk(
      await supabase.from("measures_encounter_def").insert({
        registry_id: registryId,
        encounter_key: stub.key,
        display_title: stub.display_title,
        encounter_type: "view",
        material_family: "obsidian",
        surface_type: "threshold",
        sequence_order: stub.sequence_order,
        pause_allowed: false,
        is_entry_surface: false,
        is_active: false,
        metadata: {
          function_layer: stub.function_layer,
          state_expression: stub.state_expression,
          renderer: null,
          contract_status: "pending_contract",
          reconciliation_source: SOURCE,
        },
      }),
      `${stub.key} stub insert failed`,
    )
    console.log(`${stub.key}: stub created ok`)
  }

  // --- PHASE 6: RUNTIME SEQUENCE + ROUTE STRUCTURE ---
  console.log("\n--- phase_6_runtime_sequence_and_routes ---")

  // Build encounter lookup: key → { enc_id, reg_id }
  const encounterRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, registry_id, encounter_key")
      .in("encounter_key", TARGET_KEYS),
    "encounter id lookup for route seating failed",
  )

  const encMap = Object.fromEntries(
    encounterRows.map((r) => [r.encounter_key, { enc_id: r.id, reg_id: r.registry_id }]),
  )

  const routeResults = []

  for (const route of ROUTES) {
    const fromEnc = encMap[route.from]
    const toEnc = encMap[route.to]

    if (!fromEnc) {
      console.warn(`route ${route.from} → ${route.to}: from encounter not found — skipping`)
      routeResults.push({ from: route.from, to: route.to, status: "from_not_found" })
      continue
    }
    if (!toEnc) {
      console.warn(`route ${route.from} → ${route.to}: to encounter not found — skipping`)
      routeResults.push({ from: route.from, to: route.to, status: "to_not_found" })
      continue
    }

    // Idempotency check
    const [existing] = await assertOk(
      await supabase
        .from("measures_transition_rule")
        .select("id")
        .eq("from_encounter_id", fromEnc.enc_id)
        .eq("to_encounter_id", toEnc.enc_id)
        .limit(1),
      `route existence check ${route.from} → ${route.to} failed`,
    )

    if (existing) {
      console.log(`route ${route.from} → ${route.to}: already exists (idempotent)`)
      routeResults.push({ from: route.from, to: route.to, status: "already_exists" })
      continue
    }

    await assertOk(
      await supabase.from("measures_transition_rule").insert({
        from_registry_id: fromEnc.reg_id,
        from_encounter_id: fromEnc.enc_id,
        to_registry_id: toEnc.reg_id,
        to_encounter_id: toEnc.enc_id,
        transition_kind: route.kind,
        rule_state: "active",
        requires_release: false,
        requires_dependency_satisfied: false,
        requires_passage_ready: false,
        requires_connect_prompt: false,
        sort_order: route.sort,
        metadata: {
          action: {
            id: route.action_id,
            kind: "navigate",
            label: route.action_label,
            emphasis: route.emphasis,
          },
          source: SOURCE,
          registered_runtime: "registered_13_surface_runtime_v1",
        },
      }),
      `route insert ${route.from} → ${route.to} failed`,
    )

    console.log(`route ${route.from} → ${route.to}: ok (${route.kind})`)
    routeResults.push({ from: route.from, to: route.to, status: "inserted", kind: route.kind })
  }

  console.log(`\nroutes_seated: ${routeResults.filter((r) => r.status === "inserted").length}`)
  console.log(`routes_idempotent: ${routeResults.filter((r) => r.status === "already_exists").length}`)
  console.log(`routes_skipped: ${routeResults.filter((r) => ["from_not_found", "to_not_found"].includes(r.status)).length}`)

  await readBack()
  console.log("\nregistered_13_reconciliation: ok")
}

async function readBack() {
  console.log("\n--- validation_readback ---")

  const DEPRECATED_KEYS = DEPRECATIONS.map((d) => d.key)

  const targetRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, is_active, sequence_order, metadata")
      .in("encounter_key", TARGET_KEYS)
      .order("sequence_order", { ascending: true }),
    "target encounter readback failed",
  )

  const deprecatedRows = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, is_active, metadata")
      .in("encounter_key", DEPRECATED_KEYS)
      .order("encounter_key"),
    "deprecated encounter readback failed",
  )

  const found = new Set(targetRows.map((r) => r.encounter_key))
  const missing = TARGET_KEYS.filter((k) => !found.has(k))

  // Count route rules for target encounters
  const targetIds = targetRows.map((r) => r.id)
  let routeCount = 0
  if (targetIds.length > 0) {
    const routeRows = await assertOk(
      await supabase
        .from("measures_transition_rule")
        .select("id")
        .in("from_encounter_id", targetIds)
        .eq("rule_state", "active"),
      "route count readback failed",
    )
    routeCount = routeRows.length
  }

  const readback = {
    target_encounters_found: targetRows.length,
    target_encounters_expected: 13,
    all_13_present: targetRows.length === 13,
    missing_targets: missing,
    target_sequence: targetRows.map((r) => ({
      encounter_key: r.encounter_key,
      sequence_order: r.sequence_order,
      state_expression: r.metadata?.state_expression ?? null,
    })),
    deprecated_encounters_found: deprecatedRows.length,
    deprecated_correctly: deprecatedRows.every(
      (r) => r.metadata?.deprecated === true && r.is_active === false,
    ),
    route_rules_seated: routeCount,
    route_rules_expected: ROUTES.length,
    all_routes_seated: routeCount >= ROUTES.length,
  }

  console.log(JSON.stringify(readback, null, 2))

  if (!readback.all_13_present) {
    throw new Error(`Missing target encounters: ${missing.join(", ")}`)
  }
  if (!readback.deprecated_correctly) {
    const bad = deprecatedRows
      .filter((r) => r.metadata?.deprecated !== true || r.is_active !== false)
      .map((r) => r.encounter_key)
    throw new Error(`Deprecation incomplete for: ${bad.join(", ")}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
