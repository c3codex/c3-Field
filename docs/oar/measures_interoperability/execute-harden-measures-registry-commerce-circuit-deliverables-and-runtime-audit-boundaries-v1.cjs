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
  "docs/oar/measures_interoperability/oar2_harden_measures_registry_commerce_circuit_deliverables_and_runtime_audit_boundaries_v1.meta.md"

const TARGET_KEYS = [
  "measures_assessment",
  "reserve_seat",
  "phase_payment",
  "connect_src",
  "measures_phases_reveal",
  "structure_passage",
]

const PUBLIC_PATHS = ["Assess the Environment", "Understand the Environment"]

const PUBLIC_ALLOWED_COPY = [
  "After assessment, Measures Registry identifies the appropriate governed pathway for continuation.",
  "That pathway may begin with an AI Environment Review, proceed into MAP the Environment, or enter the Foundational Measures Registry Cohort.",
  "MAP the Environment includes a bounded runtime audit of the AI-facing environment to identify critical, emerging, and probable AI drift conditions.",
]

const PUBLIC_PROHIBITED_COPY = [
  "C1",
  "C2",
  "C3",
  "commerce circuit",
  "full system audit",
  "enterprise audit",
  "total operational audit",
  "pricing",
  "payment",
  "wallet connect",
  "c3 Key",
  "SRC binding mechanics",
  "permission standing",
  "recognition standing",
  "conversion standing",
  "certification standing",
]

const ACTIVATION_STANDING = {
  payment: false,
  c3_key: false,
  temp_c3_key: false,
  wallet_connect: false,
  temp_payment_provider: false,
  SRC_binding: false,
  permission: false,
  recognition: false,
  conversion: false,
  certification: false,
  DAO: false,
  distribution: false,
}

const RUNTIME_AUDIT_CONTRACT = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  contract_key: "c3_map_runtime_audit_contract",
  public_label: "MAP the Environment",
  definition:
    "MAP the Environment is a governed runtime audit for AI-accelerated systems.",
  function:
    "It identifies critical, emerging, and probable AI drift conditions in the AI-facing runtime environment.",
  runtime_audit_scope: "AI-facing runtime environment only",
  audits_runtime_structure_not_confidential_institutional_substance: true,
  full_system_audit_claim: false,
  confidential_data_required: false,
  may_examine_structural_indicators: [
    "AI usage areas",
    "AI tool categories",
    "agent/workflow presence",
    "approval pathway status",
    "human review status",
    "role definition status",
    "runtime surface status",
    "output influence level",
    "traceability status",
    "implementation boundary status",
  ],
  must_not_require_storage_of: [
    "customer records",
    "raw prompts",
    "private institutional documents",
    "AI-generated confidential outputs",
    "financial records",
    "employee records",
    "proprietary datasets",
    "contracts",
    "emails",
  ],
  drift_condition_classes: {
    critical_ai_drift_condition:
      "already affecting or visibly threatening accountability, review, approval, runtime behavior, or operational reliability",
    emerging_ai_drift_condition:
      "visible structural weakness likely to worsen under AI acceleration",
    probable_ai_drift_condition:
      "likely drift condition inferred from missing governance conditions, unclear roles, unregistered runtime surfaces, or absent review pathways",
  },
  safe_results_only_rule: [
    "MAP stores findings, not raw evidence.",
    "MAP classifies conditions, not confidential content.",
    "MAP delivers results, not institutional data.",
  ],
  activation_standing: ACTIVATION_STANDING,
}

const CIRCUIT_DELIVERABLES = [
  {
    internal_circuit_key: "C1",
    public_pathway_label: "AI Environment Review",
    delivery_depth: "entry_findings_product",
    includes_runtime_audit: false,
    function:
      "The institution completes the Measures AI Environment Assessment / environment survey. Measures Registry reviews the submitted assessment/survey responses and delivers findings and recommended actions.",
    deliverables: [
      "AI Environment Findings Report",
      "critical / emerging / probable AI drift condition classification from survey/review",
      "ungoverned environmental factor summary",
      "recommended governed actions",
      "recommended next pathway",
    ],
    runtime_audit_boundary: [
      "C1 is review from assessment/survey inputs.",
      "C1 is not MAP the Environment.",
      "C1 is not c3 MAP runtime audit.",
    ],
    boundaries: [
      "does not include full MAP runtime audit",
      "does not include guided implementation asset creation",
      "does not grant payment standing",
      "does not grant permission standing",
      "does not complete Measures Conversion",
      "does not grant Registry Certification",
      "does not grant DAO standing",
      "does not grant distribution standing",
    ],
    public_visibility: "public_pathway_label_only",
    pricing_state: "pricing_remains_as_previously_seated",
    activation_state: "deliverable_definition_only",
    renderer_rule: "render_public_pathway_labels_only",
  },
  {
    internal_circuit_key: "C2",
    public_pathway_label: "MAP the Environment",
    delivery_depth: "main_MAP_commerce_asset",
    includes_runtime_audit: true,
    function:
      "Includes the Measures AI Environment Assessment / survey and a bounded c3 MAP runtime audit of the AI-facing runtime environment.",
    deliverables: [
      "c3 MAP Runtime Audit",
      "c3 MAP Findings Packet",
      "AI-facing runtime structure review",
      "critical / emerging / probable AI drift condition classification",
      "authority findings",
      "role findings",
      "runtime surface findings",
      "review pathway findings",
      "implementation boundary findings",
      "implementation asset definitions",
      "governed action requirements",
      "conversion-readiness direction",
    ],
    runtime_audit_scope: "AI-facing runtime environment only",
    full_system_audit_claim: false,
    confidential_data_required: false,
    boundaries: [
      "defines required implementation assets",
      "does not automatically create or complete implementation assets",
      "does not equal payment confirmation",
      "does not equal permission standing",
      "does not equal Measures Conversion",
      "does not equal Registry Certification",
      "does not equal DAO standing",
      "does not equal distribution standing",
    ],
    public_visibility: "public_pathway_label_only",
    pricing_state: "pricing_remains_as_previously_seated",
    activation_state: "deliverable_definition_only",
    renderer_rule: "render_public_pathway_labels_only",
  },
  {
    internal_circuit_key: "C3",
    public_pathway_label: "Foundational Measures Registry Cohort",
    delivery_depth: "high_touch_guided_implementation_pathway",
    includes_runtime_audit: true,
    function:
      "Includes assessment, MAP runtime audit, guided MAP asset creation, structured implementation support, and leadership / institutional alignment.",
    deliverables: [
      "assessment findings",
      "c3 MAP Runtime Audit",
      "MAP findings",
      "guided MAP asset creation",
      "structured implementation support",
      "governed action plan",
      "conversion-readiness preparation",
      "leadership / institutional alignment sessions",
      "next-route recommendation",
    ],
    runtime_audit_scope: "AI-facing runtime environment within guided cohort context",
    full_system_audit_claim: false,
    confidential_data_required: false,
    boundaries: [
      "does not automatically declare Measures Conversion",
      "does not grant Registry Certification",
      "does not grant role standing",
      "does not grant DAO standing",
      "does not grant distribution standing",
      "does not grant c3 Key standing",
      "does not grant permission standing",
      "does not grant recognition standing",
    ],
    public_visibility: "public_pathway_label_only",
    pricing_state: "pricing_remains_as_previously_seated",
    activation_state: "deliverable_definition_only",
    renderer_rule: "render_public_pathway_labels_only",
  },
]

const DELIVERABLES_CONTRACT = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  contract_key: "commerce_circuit_deliverables_contract_v1",
  required_fields: [
    "internal_circuit_key",
    "public_pathway_label",
    "delivery_depth",
    "includes_runtime_audit",
    "deliverables",
    "boundaries",
    "public_visibility",
    "pricing_state",
    "activation_state",
    "source_oar2",
    "renderer_rule",
  ],
  renderer_rule: "render_public_pathway_labels_only",
  pricing_rule: "pricing_remains_as_previously_seated; do_not_reopen_pricing_in_this_oar2",
  activation_rule:
    "deliverable_definition_only; no_payment_activation; no_permission_activation; no_conversion_activation; no_certification_activation",
  circuits: CIRCUIT_DELIVERABLES,
  public_copy_contract: {
    allowed_public_copy: PUBLIC_ALLOWED_COPY,
    prohibited_public_copy: PUBLIC_PROHIBITED_COPY,
    public_paths_preserved: PUBLIC_PATHS,
  },
  runtime_audit_contract: RUNTIME_AUDIT_CONTRACT,
  activation_standing: ACTIVATION_STANDING,
  runtime_final_pass_authorized: false,
  frontend_hardcode_allowed: false,
  db_term_tag_authority_created: false,
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function attachForRow(metadata, rowKey) {
  const next = {
    ...metadata,
    commerce_circuit_deliverables_contract_v1: DELIVERABLES_CONTRACT,
    c3_map_runtime_audit_contract: RUNTIME_AUDIT_CONTRACT,
    commerce_circuit_deliverables_runtime_audit_boundary_hardening: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      status: "seated",
      target_row: rowKey,
      pricing_changed: false,
      pricing_published: false,
      renderer_rule: "render_public_pathway_labels_only",
      public_paths_preserved: PUBLIC_PATHS,
      runtime_final_pass_authorized: false,
      activation_standing: ACTIVATION_STANDING,
    },
  }

  if (next.active_contract_key_reconciliation) {
    next.active_contract_key_reconciliation = {
      ...next.active_contract_key_reconciliation,
      commerce_circuit_deliverables_contract_key:
        "commerce_circuit_deliverables_contract_v1",
      c3_map_runtime_audit_contract_key: "c3_map_runtime_audit_contract",
      public_renderer_rule: "render_public_pathway_labels_only",
      pricing_changed: false,
      pricing_published: false,
      runtime_final_pass_authorized: false,
    }
  }

  if (rowKey === "structure_passage" && next.crystal_chamber_content_contracts) {
    next.crystal_chamber_content_contracts = {
      ...next.crystal_chamber_content_contracts,
      c3_map_runtime_audit_boundary_contract: RUNTIME_AUDIT_CONTRACT,
      commerce_pathway_public_copy_contract:
        DELIVERABLES_CONTRACT.public_copy_contract,
    }
  }

  return next
}

async function main() {
  assertOk(
    await supabase.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )

  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .in("encounter_key", TARGET_KEYS),
    "fetch target rows",
  )

  const found = rows.map((row) => row.encounter_key)
  const missing = TARGET_KEYS.filter((key) => !found.includes(key))
  if (missing.length > 0) throw new Error(`missing target rows: ${missing.join(", ")}`)

  const results = []
  for (const row of rows) {
    const metadata = clone(row.metadata)
    const updated = assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ metadata: attachForRow(metadata, row.encounter_key) })
        .eq("id", row.id)
        .select("encounter_key, metadata")
        .single(),
      `update ${row.encounter_key}`,
    )
    results.push({
      encounter_key: updated.encounter_key,
      has_deliverables_contract:
        updated.metadata?.commerce_circuit_deliverables_contract_v1?.contract_key ===
        "commerce_circuit_deliverables_contract_v1",
      has_runtime_audit_contract:
        updated.metadata?.c3_map_runtime_audit_contract?.contract_key ===
        "c3_map_runtime_audit_contract",
    })
  }

  const readback = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", TARGET_KEYS),
    "validation readback",
  )

  const errors = []
  for (const row of readback) {
    const contract = row.metadata?.commerce_circuit_deliverables_contract_v1
    const audit = row.metadata?.c3_map_runtime_audit_contract
    if (contract?.circuits?.length !== 3) errors.push(`${row.encounter_key}: circuit count`)
    const c1 = contract?.circuits?.find((c) => c.internal_circuit_key === "C1")
    const c2 = contract?.circuits?.find((c) => c.internal_circuit_key === "C2")
    const c3 = contract?.circuits?.find((c) => c.internal_circuit_key === "C3")
    if (!c1 || c1.public_pathway_label !== "AI Environment Review" || c1.includes_runtime_audit !== false) {
      errors.push(`${row.encounter_key}: C1 invalid`)
    }
    if (!c2 || c2.public_pathway_label !== "MAP the Environment" || c2.includes_runtime_audit !== true || c2.full_system_audit_claim !== false) {
      errors.push(`${row.encounter_key}: C2 invalid`)
    }
    if (!c3 || c3.public_pathway_label !== "Foundational Measures Registry Cohort" || c3.includes_runtime_audit !== true || c3.full_system_audit_claim !== false) {
      errors.push(`${row.encounter_key}: C3 invalid`)
    }
    if (audit?.runtime_audit_scope !== "AI-facing runtime environment only") {
      errors.push(`${row.encounter_key}: audit scope invalid`)
    }
    if (audit?.full_system_audit_claim !== false || audit?.confidential_data_required !== false) {
      errors.push(`${row.encounter_key}: audit boundary invalid`)
    }
    for (const cls of [
      "critical_ai_drift_condition",
      "emerging_ai_drift_condition",
      "probable_ai_drift_condition",
    ]) {
      if (!audit?.drift_condition_classes?.[cls]) errors.push(`${row.encounter_key}: missing ${cls}`)
    }
    if (audit?.safe_results_only_rule?.length !== 3) {
      errors.push(`${row.encounter_key}: safe results rule invalid`)
    }
    if (contract?.pricing_rule?.includes("do_not_reopen_pricing") !== true) {
      errors.push(`${row.encounter_key}: pricing rule invalid`)
    }
    if (!PUBLIC_PATHS.every((path) => contract?.public_copy_contract?.public_paths_preserved?.includes(path))) {
      errors.push(`${row.encounter_key}: public paths not preserved`)
    }
    for (const [key, value] of Object.entries(contract?.activation_standing || {})) {
      if (value !== false) errors.push(`${row.encounter_key}: ${key} activated`)
    }
    if (contract?.runtime_final_pass_authorized !== false) {
      errors.push(`${row.encounter_key}: runtime not blocked`)
    }
  }

  if (errors.length > 0) throw new Error(`validation failed:\n${errors.join("\n")}`)

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_rows: TARGET_KEYS,
        circuits: CIRCUIT_DELIVERABLES.map((c) => ({
          internal_circuit_key: c.internal_circuit_key,
          public_pathway_label: c.public_pathway_label,
          includes_runtime_audit: c.includes_runtime_audit,
        })),
        runtime_audit_scope: RUNTIME_AUDIT_CONTRACT.runtime_audit_scope,
        full_system_audit_claim: RUNTIME_AUDIT_CONTRACT.full_system_audit_claim,
        confidential_data_required: RUNTIME_AUDIT_CONTRACT.confidential_data_required,
        pricing_changed: false,
        pricing_published: false,
        runtime_final_pass_authorized: false,
        activation_standing: ACTIVATION_STANDING,
        mutation_results: results,
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
