require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_C3_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL and a Supabase write key are required")
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const SOURCE_OAR2 =
  "docs/oar/measures_interoperability/oar2_reconcile_measures_registry_active_contract_keys_v1.meta.md"

const LEGACY_CARRIER_KEYS = [
  "structure_passage",
  "reserve_seat",
  "evaluate_structure_path",
  "phase_payment",
  "connect_src",
  "measures_phases_reveal",
]

const TARGET_KEYS = [
  ...LEGACY_CARRIER_KEYS,
  "measures_assessment",
]

const ACTIVE_CHAIN = [
  "assess_environment_passage",
  "measures_assessment_contract",
  "assessment_result_contract",
  "commerce_circuit_recommendation_contract",
  "c3_map_continuation_contract",
  "governed_commerce_passage",
  "c3_key_or_temp_key_identity_route",
  "payment_confirmation_sequence",
  "c3_map_runtime_audit_contract",
]

const DOWNSTREAM_HELD = [
  "conversion_readiness_contract",
  "measures_conversion_verification_contract",
  "registry_certification_eligibility_contract",
]

const ACTIVE_CONTRACT_DEFINITIONS = {
  assess_environment_passage: {
    active_key: "assess_environment_passage",
    contract_type: "passage",
    public_label: "Assess the Environment",
    role: "media/orientation/entry passage",
    resolves_to: "measures_assessment_contract",
    function: [
      "introduces the assessment path",
      "carries media/copy/orientation",
      "routes into the assessment contract",
    ],
    non_authority: [
      "does not score",
      "does not bind SRC by itself",
      "does not recommend commerce circuit by itself",
    ],
  },
  measures_assessment_contract: {
    active_key: "measures_assessment_contract",
    contract_type: "assessment_contract",
    role: "SRC/eval-bound scored assessment",
    resolves_to: "assessment_result_contract",
    required_fields: [
      "contact_name",
      "institution_name",
      "email",
      "business_or_institution_type",
      "assessment_answers",
      "baseline_score",
      "recommended_circuit",
    ],
    function: [
      "binds SRC/eval standing",
      "captures institution and contact fields",
      "presents seven scored questions",
      "calculates baseline score",
      "determines recommended C1 / C2 / C3 commerce circuit",
    ],
    non_authority: ["not c3 MAP", "not payment", "not conversion", "not certification"],
  },
  assessment_result_contract: {
    active_key: "assessment_result_contract",
    contract_type: "result_contract",
    role: "baseline result + deficiency awareness",
    resolves_to: "commerce_circuit_recommendation_contract",
    public_safe_result_copy:
      "Your assessment identifies a recommended c3 MAP circuit for governed continuation.",
  },
  commerce_circuit_recommendation_contract: {
    active_key: "commerce_circuit_recommendation_contract",
    contract_type: "recommendation_contract",
    role: "C1 / C2 / C3 recommendation only",
    resolves_to: "c3_map_continuation_contract",
    rule: "Assessment recommends. c3 MAP audits. Governed Commerce handles private commerce.",
    non_authority: [
      "does not expose pricing",
      "does not activate payment",
      "does not issue c3 Key",
      "does not bind SRC continuation automatically",
    ],
  },
  c3_map_continuation_contract: {
    active_key: "c3_map_continuation_contract",
    contract_type: "governed_continuation_contract",
    role: "continuation toward c3 MAP runtime audit",
    resolves_to: "governed_commerce_passage",
    non_authority: [
      "not baseline assessment",
      "not payment confirmation",
      "not Measures Conversion",
      "not Registry Certification",
    ],
  },
  governed_commerce_passage: {
    active_key: "governed_commerce_passage",
    contract_type: "private_control_passage",
    role: "pricing/payment/key/SRC control",
    resolves_to: "c3_key_or_temp_key_identity_route",
    default_states: {
      pricing_state: "governed_hidden",
      payment_state: "held",
      wallet_connection_state: "held",
      temp_payment_provider_state: "held",
      SRC_binding_state: "held",
      permission_state: "held",
      recognition_state: "held",
      conversion_state: "held",
      certification_state: "held",
    },
  },
  c3_key_or_temp_key_identity_route: {
    active_key: "c3_key_or_temp_key_identity_route",
    contract_type: "identity_route",
    role: "governed identity/access continuity",
    resolves_to: "payment_confirmation_sequence",
    supported_routes: [
      "wallet connect -> wallet-bound c3 Key",
      "temp c3 Key -> later wallet reconciliation",
    ],
    non_authority: [
      "c3 Key is not conversion",
      "temp c3 Key is not full standing",
      "wallet connect is not recognition",
      "payment is not permission",
    ],
  },
  payment_confirmation_sequence: {
    active_key: "payment_confirmation_sequence",
    contract_type: "payment_confirmation_sequence",
    role: "governed payment confirmation before c3 MAP runtime audit",
    resolves_to: "c3_map_runtime_audit_contract",
    function: [
      "confirms governed payment route status",
      "confirms selected C1 / C2 / C3 commerce circuit",
      "confirms wallet payment or temp payment provider state",
      "confirms c3 Key or temp c3 Key continuity state",
      "routes to c3 MAP runtime audit only after valid governed conditions are satisfied",
    ],
    non_authority: [
      "not permission",
      "not recognition",
      "not Measures Conversion",
      "not Registry Certification",
      "not DAO standing",
      "not distribution standing",
    ],
  },
  c3_map_runtime_audit_contract: {
    active_key: "c3_map_runtime_audit_contract",
    contract_type: "governed_runtime_audit_contract",
    role: "c3 MAP audit and governed implementation route",
    resolves_to: "conversion_readiness_contract",
    non_authority: [
      "not assessment baseline",
      "not payment confirmation",
      "not Measures Conversion",
      "not Registry Certification",
    ],
  },
}

const ROW_ACTIVE_KEYS = {
  evaluate_structure_path: ["assess_environment_passage"],
  measures_assessment: [
    "measures_assessment_contract",
    "assessment_result_contract",
    "commerce_circuit_recommendation_contract",
  ],
  reserve_seat: [
    "c3_map_continuation_contract",
    "governed_commerce_passage",
    "c3_key_or_temp_key_identity_route",
  ],
  phase_payment: [
    "governed_commerce_passage",
    "c3_key_or_temp_key_identity_route",
    "payment_confirmation_sequence",
  ],
  connect_src: ["c3_map_runtime_audit_contract"],
  measures_phases_reveal: [
    "assessment_result_contract",
    "c3_map_runtime_audit_contract",
  ],
  structure_passage: [],
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function legacyCarrierContract(encounterKey) {
  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    legacy_db_row_key: encounterKey,
    semantic_status: "deprecated_from_active_semantic_use",
    allowed_uses: [
      "legacy_db_row_key",
      "historical_oar_reference",
      "audit_trace",
      "migration_carrier",
    ],
    prohibited_uses: [
      "active_contract_key",
      "public_label",
      "route_meaning",
      "chamber_identity",
      "passage_identity",
      "payment_surface",
      "SRC_binding_surface",
      "c3_MAP_surface",
      "conversion_certification_surface",
      "renderer_state",
    ],
    renderer_must_not_use_row_key_as_semantic_truth: true,
  }
}

function reconciliationContract(encounterKey) {
  const rowKeys = ROW_ACTIVE_KEYS[encounterKey] || []

  return {
    version: "v1",
    source_oar2: SOURCE_OAR2,
    reconciliation_status: "active_contract_keys_seated",
    carrier_row_key: encounterKey,
    carrier_row_semantic_authority: "none",
    active_contract_key: rowKeys[0] || null,
    active_contract_keys: rowKeys,
    active_contract_key_chain: ACTIVE_CHAIN,
    active_contract_definitions: Object.fromEntries(
      rowKeys.filter((key) => ACTIVE_CONTRACT_DEFINITIONS[key]).map((key) => [
        key,
        ACTIVE_CONTRACT_DEFINITIONS[key],
      ]),
    ),
    downstream_contracts_held: DOWNSTREAM_HELD,
    renderer_rule: "read_active_contract_keys_not_legacy_carrier_row_names",
    runtime_final_pass_authorized: false,
    frontend_hardcode_allowed: false,
    db_term_tag_authority_created: false,
    activated_standing: {
      payment: false,
      c3_key: false,
      temp_c3_key: false,
      SRC_binding: false,
      permission: false,
      recognition: false,
      conversion: false,
      certification: false,
      DAO: false,
      distribution: false,
    },
    sequence_assertion: {
      payment_confirmation_before_c3_map_runtime_audit: true,
      conversion_verification_later_and_held: true,
    },
  }
}

function patchNestedContract(contract, encounterKey, contractName) {
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) return contract

  const rowKeys = ROW_ACTIVE_KEYS[encounterKey] || []
  return {
    ...contract,
    active_contract_key_reconciliation: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      active_contract_key: rowKeys[0] || null,
      active_contract_keys: rowKeys,
      legacy_carrier_row_key: encounterKey,
      legacy_carrier_row_key_semantic_authority: "none",
      renderer_rule: "read_active_contract_keys_not_legacy_carrier_row_names",
      reconciled_contract: contractName,
    },
  }
}

async function fetchTargets() {
  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .in("encounter_key", TARGET_KEYS),
    "fetch target rows",
  )

  const found = rows.map((row) => row.encounter_key)
  const missing = TARGET_KEYS.filter((key) => !found.includes(key))
  if (missing.length > 0) {
    throw new Error(`missing target rows: ${missing.join(", ")}`)
  }

  return rows
}

async function applyPatch(row) {
  const metadata = clone(row.metadata)
  const encounterKey = row.encounter_key

  const nextMetadata = {
    ...metadata,
    active_contract_key_reconciliation: reconciliationContract(encounterKey),
    active_contract_chain_authority: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      active_chain: ACTIVE_CHAIN,
      definitions: ACTIVE_CONTRACT_DEFINITIONS,
      downstream_contracts_held: DOWNSTREAM_HELD,
      renderer_rule: "read_active_contract_keys_not_legacy_carrier_row_names",
      runtime_final_pass_authorized: false,
    },
  }

  if (LEGACY_CARRIER_KEYS.includes(encounterKey)) {
    nextMetadata.legacy_carrier_key_reconciliation = legacyCarrierContract(encounterKey)
  }

  if (metadata.governed_layout_contract) {
    nextMetadata.governed_layout_contract = patchNestedContract(
      metadata.governed_layout_contract,
      encounterKey,
      "governed_layout_contract",
    )
  }

  if (metadata.chamber_contract) {
    nextMetadata.chamber_contract = patchNestedContract(
      metadata.chamber_contract,
      encounterKey,
      "chamber_contract",
    )
  }

  const updated = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    `${encounterKey} update`,
  )

  return {
    encounter_key: updated.encounter_key,
    active_contract_keys:
      updated.metadata?.active_contract_key_reconciliation?.active_contract_keys || [],
    legacy_carrier_status:
      updated.metadata?.legacy_carrier_key_reconciliation?.semantic_status || null,
  }
}

async function validate() {
  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", TARGET_KEYS),
    "validation readback",
  )

  const errors = []
  const foundActiveKeys = new Set()

  for (const row of rows) {
    const reconciliation = row.metadata?.active_contract_key_reconciliation
    if (!reconciliation) errors.push(`${row.encounter_key}: missing reconciliation`)

    for (const key of reconciliation?.active_contract_key_chain || []) {
      foundActiveKeys.add(key)
    }

    for (const key of reconciliation?.active_contract_keys || []) {
      if (LEGACY_CARRIER_KEYS.includes(key)) {
        errors.push(`${row.encounter_key}: legacy key present as active key`)
      }
    }

    if (LEGACY_CARRIER_KEYS.includes(row.encounter_key)) {
      const legacy = row.metadata?.legacy_carrier_key_reconciliation
      if (legacy?.semantic_status !== "deprecated_from_active_semantic_use") {
        errors.push(`${row.encounter_key}: legacy semantic deprecation missing`)
      }
    }

    const activated = reconciliation?.activated_standing || {}
    for (const [key, value] of Object.entries(activated)) {
      if (value !== false) errors.push(`${row.encounter_key}: ${key} activated`)
    }

    if (reconciliation?.runtime_final_pass_authorized !== false) {
      errors.push(`${row.encounter_key}: runtime final pass not blocked`)
    }
  }

  for (const activeKey of ACTIVE_CHAIN) {
    if (!foundActiveKeys.has(activeKey)) {
      errors.push(`active chain key missing: ${activeKey}`)
    }
  }

  const paymentIndex = ACTIVE_CHAIN.indexOf("payment_confirmation_sequence")
  const auditIndex = ACTIVE_CHAIN.indexOf("c3_map_runtime_audit_contract")
  if (paymentIndex < 0 || auditIndex < 0 || paymentIndex > auditIndex) {
    errors.push("payment confirmation does not precede c3 MAP runtime audit")
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  return rows.map((row) => ({
    encounter_key: row.encounter_key,
    active_contract_keys:
      row.metadata?.active_contract_key_reconciliation?.active_contract_keys || [],
    legacy_carrier_status:
      row.metadata?.legacy_carrier_key_reconciliation?.semantic_status || null,
    runtime_final_pass_authorized:
      row.metadata?.active_contract_key_reconciliation?.runtime_final_pass_authorized,
  }))
}

async function main() {
  assertOk(
    await supabase.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )

  const rows = await fetchTargets()
  const results = []
  for (const row of rows) {
    results.push(await applyPatch(row))
  }

  const validationReadback = await validate()

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_rows: TARGET_KEYS.length,
        legacy_carrier_keys: LEGACY_CARRIER_KEYS,
        active_contract_key_chain: ACTIVE_CHAIN,
        downstream_contracts_held: DOWNSTREAM_HELD,
        mutation_results: results,
        validation_readback: validationReadback,
        validation: "PASS",
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
