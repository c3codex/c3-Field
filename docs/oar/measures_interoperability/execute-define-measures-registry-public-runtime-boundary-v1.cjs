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
  "docs/oar/measures_interoperability/oar2_define_measures_registry_public_runtime_boundary_v1.meta.md"

const TARGET_KEYS = [
  "evaluate_structure_path",
  "measures_assessment",
  "structure_passage",
  "reserve_seat",
  "phase_payment",
  "connect_src",
  "measures_phases_reveal",
  "cohort_conversion_encounter",
]

const PUBLIC_PROHIBITIONS = [
  "C1",
  "C2",
  "C3",
  "commerce circuit",
  "pricing",
  "payment",
  "wallet connect",
  "temp payment provider",
  "c3 Key assignment",
  "temp c3 Key assignment",
  "SRC binding mechanics",
  "permission standing",
  "recognition standing",
  "conversion standing",
  "certification standing",
  "DAO standing",
  "distribution standing",
  "Crystal Chamber",
  "Marble Governance Chamber",
  "Obsidian route",
  "Lapis route",
  "material-family chamber labels",
  "system chamber names",
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

const HELD_SYSTEM_ROUTES = [
  "prepare_environment_asset_chamber",
  "map_the_environment_execution_chamber",
  "guided_map_asset_creation",
  "map_findings_delivery",
  "implementation_asset_definition_runtime",
  "governed_commerce_passage_runtime",
  "payment_confirmation_sequence_runtime",
  "c3_key_or_temp_key_identity_route_runtime",
  "src_binding_runtime",
  "conversion_readiness_contract_runtime",
  "measures_conversion_verification_contract_runtime",
  "registry_certification_eligibility_contract_runtime",
]

const PUBLIC_RUNTIME_BOUNDARY = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  runtime_boundary_key: "measures_registry_public_runtime_boundary_v1",
  runtime_scope: "public_facing_only",
  public_runtime_paths: ["assess_environment", "understand_environment"],
  system_chambers_state: "held",
  commerce_runtime_state: "held",
  private_governed_runtime_state: "held",
  map_execution_state: "held",
  guided_asset_creation_state: "held",
  findings_delivery_state: "held",
  conversion_runtime_state: "held",
  certification_runtime_state: "held",
  renderer_rule: "render_seated_public_state_only",
  frontend_hardcode_allowed: false,
  runtime_final_pass_authorized: false,
  public_paths: {
    assess_environment: {
      public_label: "Assess the Environment",
      runtime_eligibility: "public_allowed",
      allowed_contract_keys: [
        "assess_environment_passage",
        "measures_assessment_contract",
        "assessment_result_contract",
        "commerce_circuit_recommendation_contract",
      ],
      allowed_functions: [
        "Assess the Environment path entry",
        "Measures AI Environment Assessment",
        "contact / institution intake where already scoped",
        "7-question scored assessment",
        "ungoverned environmental factor identification",
        "public-safe assessment result",
        "governed pathway recommendation using public pathway labels only",
      ],
      allowed_public_pathway_labels: [
        "AI Environment Review",
        "MAP the Environment",
        "Foundational Measures Registry Cohort",
      ],
      prohibited_public_rendering: PUBLIC_PROHIBITIONS.filter(
        (item) => !["Crystal Chamber", "Marble Governance Chamber", "Obsidian route", "Lapis route", "material-family chamber labels", "system chamber names"].includes(item),
      ),
    },
    understand_environment: {
      public_label: "Understand the Environment",
      runtime_eligibility: "public_allowed",
      allowed_contract_keys: [
        "understand_environment_passage",
        "about_measures_registry_encounter",
        "structural_drift_publication_contract",
        "foundational_leadership_block",
        "questions_ungoverned_systems_cannot_answer_video",
        "c3_map_education_encounter",
        "measures_conversion_education_encounter",
        "assess_environment_cta_encounter",
      ],
      allowed_functions: [
        "talking-head passage video",
        "About Measures Registry",
        "Structural Drift publication card / CTA",
        "Foundational Leadership invitation",
        "Questions Ungoverned Systems explainer video",
        "MAP the Environment education",
        "Measures Conversion education",
        "Assess the Environment CTA",
      ],
      prohibited_public_rendering: [
        "live MAP execution",
        "guided asset creation workflow",
        "findings delivery",
        "payment route",
        "c3 Key issuance",
        "SRC binding mechanics",
        "certification mechanics",
        "internal material naming",
        "C1 / C2 / C3 public language",
      ],
    },
  },
  map_the_environment_public_boundary: {
    allowed_public_modes: [
      "education surface",
      "public pathway label",
      "bounded runtime audit explanation",
    ],
    allowed_copy: [
      "MAP the Environment is a governed runtime audit for AI-accelerated systems.",
      "It identifies critical, emerging, and probable AI drift conditions in the AI-facing runtime environment.",
      "It audits runtime structure, not confidential institutional substance.",
      "It does not claim to audit the entire institution.",
    ],
    not_allowed: [
      "initiate MAP execution",
      "collect MAP assets",
      "deliver MAP findings",
      "expose pricing/payment",
      "expose internal commerce circuits",
      "expose implementation packet",
      "expose private client pathway",
      "claim full-system audit",
    ],
  },
  commerce_circuit_public_boundary: {
    internal_circuits: ["C1", "C2", "C3"],
    public_pathway_labels: [
      "AI Environment Review",
      "MAP the Environment",
      "Foundational Measures Registry Cohort",
    ],
    renderer_rule: "render_public_pathway_labels_only",
    public_copy_allowed: [
      "After assessment, Measures Registry identifies the appropriate governed pathway for continuation.",
      "That pathway may begin with an AI Environment Review, proceed into MAP the Environment, or enter the Foundational Measures Registry Cohort.",
      "MAP the Environment includes a bounded runtime audit of the AI-facing environment to identify critical, emerging, and probable AI drift conditions.",
    ],
    public_copy_may_not_expose: [
      "internal circuit keys",
      "pricing",
    ],
  },
  structural_drift_public_boundary: {
    public_runtime_allowed: true,
    role: "public education / proof-of-thinking publication surface",
    renderer_rule:
      "If publication URL is seated, render active CTA. If publication URL is missing, render held copy. Do not invent URL. Do not hide block unless release_state is explicitly held.",
  },
  foundational_leadership_public_boundary: {
    public_runtime_allowed: true,
    role: "public invitation only",
    allowed_cta: "Begin a Leadership Conversation",
    grants: {
      role: false,
      permission: false,
      governance_standing: false,
      DAO_standing: false,
      certification: false,
      conversion: false,
      payment_standing: false,
      c3_key_standing: false,
    },
  },
  measures_conversion_education_boundary: {
    public_runtime_allowed: true,
    public_mode: "boundary_education_only",
    allowed_copy: [
      "Measures Conversion is the verified completion condition reached only after governed implementation, correct sequence, verification, and system integrity that holds under review.",
      "Registry Certification can only be considered after Measures Conversion is verified.",
    ],
    not_allowed: [
      "conversion application",
      "conversion claim",
      "conversion standing",
      "certification claim",
      "certification standing",
      "recognition standing",
    ],
  },
  held_system_related_chambers_and_private_routes: Object.fromEntries(
    HELD_SYSTEM_ROUTES.map((route) => [
      route,
      {
        release_state: "held",
        visibility: "private_governed_or_unavailable",
        public_runtime_allowed: false,
        renderer_copy_source: "seated_held_state_only",
      },
    ]),
  ),
  public_material_naming_prohibition: {
    prohibited_public_terms: [
      "Crystal Chamber",
      "Marble Governance Chamber",
      "Obsidian route",
      "Lapis route",
      "material-family chamber labels",
      "system chamber names",
    ],
    internal_material_style_metadata_use: "rendering_style_only",
  },
  next_allowed_route_name: "OAR2 — Measures Registry Public Runtime Pass v1",
  disallowed_route_name: "OAR2 — Measures Registry Full Runtime Final Pass",
  activation_standing: ACTIVATION_STANDING,
  pricing_changed: false,
  pricing_published: false,
  implementation_authorized: false,
  deployment_authorized: false,
  db_term_tag_authority_created: false,
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function patchMetadata(metadata, rowKey) {
  const next = {
    ...metadata,
    measures_registry_public_runtime_boundary_v1: PUBLIC_RUNTIME_BOUNDARY,
    public_runtime_boundary_seating: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      status: "seated",
      target_row: rowKey,
      runtime_scope: "public_facing_only",
      renderer_rule: "render_seated_public_state_only",
      runtime_final_pass_authorized: false,
      implementation_authorized: false,
      deployment_authorized: false,
      activation_standing: ACTIVATION_STANDING,
    },
  }

  if (next.active_contract_key_reconciliation) {
    next.active_contract_key_reconciliation = {
      ...next.active_contract_key_reconciliation,
      public_runtime_boundary_key: "measures_registry_public_runtime_boundary_v1",
      public_runtime_scope: "public_facing_only",
      public_renderer_rule: "render_seated_public_state_only",
      runtime_final_pass_authorized: false,
      implementation_authorized: false,
      deployment_authorized: false,
    }
  }

  if (rowKey === "structure_passage" && next.crystal_chamber_content_contracts) {
    next.crystal_chamber_content_contracts = {
      ...next.crystal_chamber_content_contracts,
      public_runtime_boundary: PUBLIC_RUNTIME_BOUNDARY.public_paths.understand_environment,
      held_system_related_chambers_and_private_routes:
        PUBLIC_RUNTIME_BOUNDARY.held_system_related_chambers_and_private_routes,
    }
  }

  if (rowKey === "measures_assessment") {
    next.assess_environment_public_runtime_boundary =
      PUBLIC_RUNTIME_BOUNDARY.public_paths.assess_environment
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
    const updated = assertOk(
      await supabase
        .from("measures_encounter_def")
        .update({ metadata: patchMetadata(clone(row.metadata), row.encounter_key) })
        .eq("id", row.id)
        .select("encounter_key, metadata")
        .single(),
      `update ${row.encounter_key}`,
    )
    results.push({
      encounter_key: updated.encounter_key,
      runtime_boundary_key:
        updated.metadata?.measures_registry_public_runtime_boundary_v1?.runtime_boundary_key,
      runtime_scope:
        updated.metadata?.measures_registry_public_runtime_boundary_v1?.runtime_scope,
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
    const boundary = row.metadata?.measures_registry_public_runtime_boundary_v1
    if (boundary?.runtime_boundary_key !== "measures_registry_public_runtime_boundary_v1") {
      errors.push(`${row.encounter_key}: boundary key missing`)
    }
    if (boundary?.runtime_scope !== "public_facing_only") {
      errors.push(`${row.encounter_key}: scope invalid`)
    }
    if (!boundary?.public_runtime_paths?.includes("assess_environment") || !boundary?.public_runtime_paths?.includes("understand_environment")) {
      errors.push(`${row.encounter_key}: public paths not preserved`)
    }
    for (const heldRoute of HELD_SYSTEM_ROUTES) {
      const held = boundary?.held_system_related_chambers_and_private_routes?.[heldRoute]
      if (held?.release_state !== "held" || held?.public_runtime_allowed !== false) {
        errors.push(`${row.encounter_key}: held route invalid ${heldRoute}`)
      }
    }
    if (boundary?.commerce_runtime_state !== "held" || boundary?.map_execution_state !== "held") {
      errors.push(`${row.encounter_key}: commerce/MAP hold invalid`)
    }
    if (boundary?.commerce_circuit_public_boundary?.renderer_rule !== "render_public_pathway_labels_only") {
      errors.push(`${row.encounter_key}: pathway renderer rule invalid`)
    }
    if (boundary?.map_the_environment_public_boundary?.allowed_public_modes?.includes("education surface") !== true) {
      errors.push(`${row.encounter_key}: MAP public education boundary missing`)
    }
    if (boundary?.measures_conversion_education_boundary?.public_mode !== "boundary_education_only") {
      errors.push(`${row.encounter_key}: conversion education boundary invalid`)
    }
    if (boundary?.foundational_leadership_public_boundary?.grants?.permission !== false) {
      errors.push(`${row.encounter_key}: leadership grant boundary invalid`)
    }
    if (boundary?.structural_drift_public_boundary?.public_runtime_allowed !== true) {
      errors.push(`${row.encounter_key}: Structural Drift public boundary invalid`)
    }
    if (boundary?.public_material_naming_prohibition?.prohibited_public_terms?.includes("Crystal Chamber") !== true) {
      errors.push(`${row.encounter_key}: material naming prohibition invalid`)
    }
    if (boundary?.pricing_changed !== false || boundary?.pricing_published !== false) {
      errors.push(`${row.encounter_key}: pricing boundary invalid`)
    }
    if (boundary?.implementation_authorized !== false || boundary?.runtime_final_pass_authorized !== false) {
      errors.push(`${row.encounter_key}: implementation/runtime not blocked`)
    }
    for (const [key, value] of Object.entries(boundary?.activation_standing || {})) {
      if (value !== false) errors.push(`${row.encounter_key}: ${key} activated`)
    }
  }

  if (errors.length > 0) throw new Error(`validation failed:\n${errors.join("\n")}`)

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        runtime_boundary_key: PUBLIC_RUNTIME_BOUNDARY.runtime_boundary_key,
        runtime_scope: PUBLIC_RUNTIME_BOUNDARY.runtime_scope,
        public_runtime_paths: PUBLIC_RUNTIME_BOUNDARY.public_runtime_paths,
        held_system_routes: HELD_SYSTEM_ROUTES.length,
        commerce_runtime_state: PUBLIC_RUNTIME_BOUNDARY.commerce_runtime_state,
        map_execution_state: PUBLIC_RUNTIME_BOUNDARY.map_execution_state,
        conversion_runtime_state: PUBLIC_RUNTIME_BOUNDARY.conversion_runtime_state,
        certification_runtime_state: PUBLIC_RUNTIME_BOUNDARY.certification_runtime_state,
        pricing_changed: false,
        pricing_published: false,
        implementation_authorized: false,
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
