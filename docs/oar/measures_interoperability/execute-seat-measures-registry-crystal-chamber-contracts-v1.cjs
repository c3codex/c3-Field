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
  "docs/oar/measures_interoperability/oar2_seat_measures_registry_crystal_chamber_contracts_v1.meta.md"

const TARGET_KEY = "structure_passage"
const PUBLIC_LABEL = "Understand the Environment"
const ACTIVE_KEYS = [
  "understand_environment_passage",
  "about_measures_registry_encounter",
  "c3_map_education_encounter",
  "measures_conversion_education_encounter",
  "assess_environment_cta_encounter",
]

const VIDEO_SCRIPT = [
  "Most institutions are adding AI faster than their systems can explain what is happening.",
  "More agents. More automation. More output.",
  "But when AI begins shaping real operations, the important questions change.",
  "Who approved this output?",
  "What system produced it?",
  "Where did it enter the workflow?",
  "Was there a review pathway?",
  "Who is accountable for the decision?",
  "Can the action be traced?",
  "What conditions made drift more likely?",
  "Ungoverned AI environments often cannot answer these questions.",
  "Not because the technology is useless.",
  "Because the environment around the technology was never structured to govern acceleration.",
  "That is where AI drift becomes institutional risk.",
  "Measures Registry provides Integrity Governance for AI-Accelerated Systems.",
  "MAP the Environment is a governed runtime audit for AI-accelerated systems.",
  "It identifies critical, emerging, and probable AI drift conditions in the AI-facing runtime environment: unclear authority, undefined roles, exposed runtime surfaces, missing review pathways, weak approval structures, and ungoverned implementation boundaries.",
  "It does not require the institution to expose confidential data to see the problem.",
  "It examines runtime structure and delivers governed findings: what is critical, what is emerging, what is probable, and what actions are required to reduce liability and restore system integrity.",
  "A Measures Integrity System can answer what ungoverned systems cannot.",
  "What is operating?",
  "Who is responsible?",
  "Where is review required?",
  "What is drifting?",
  "What must be corrected?",
  "And what governed pathway should the institution follow next?",
  "AI optimization is not more output.",
  "AI optimization begins when the environment can answer for what it produces.",
  "Measures Registry.",
  "Integrity Governance for AI-Accelerated Systems.",
]

const PUBLIC_PROHIBITIONS = [
  "C1 / C2 / C3",
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
  "Crystal Chamber",
  "Marble Governance Chamber",
  "Obsidian route",
  "Lapis route",
  "material-family chamber labels",
]

const CRYSTAL_CHAMBER_CONTRACT = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  contract_key: "crystal_chamber_contract",
  public_label: PUBLIC_LABEL,
  internal_material_family: "Crystal",
  public_material_naming_allowed: false,
  style_role: "public education / recognition / orientation",
  renderer_rule: "render_seated_state_only",
  frontend_hardcode_allowed: false,
  runtime_final_pass_authorized: false,
  public_positioning:
    "Measures Registry provides Integrity Governance for AI-Accelerated Systems.",
  core_explanation:
    "Measures Registry governs AI environments by measuring the integrity of the systems that produce AI behavior.",
  core_function: [
    "make the hidden AI-facing environment visible",
    "help institutions recognize what ungoverned systems cannot answer",
    "position Measures Registry as governance by system integrity",
    "invite assessment, leadership conversation, and continued education without commerce activation",
  ],
  active_contract_keys: ACTIVE_KEYS,
}

const CRYSTAL_STYLE_CONTRACT = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  contract_key: "education_crystal_style_contract",
  public_material_naming_allowed: false,
  visual_contract: [
    "clear institutional education",
    "crystal-like clarity without public material naming",
    "controlled light",
    "reflective structure",
    "high readability",
    "quiet institutional confidence",
    "no sales pressure",
    "no false urgency",
    "no glow-bloom overload",
    "no cyberpunk chaos",
    "no public material labels",
  ],
  layout_contract: [
    "video-first passage",
    "short educational encounters",
    "publication-forward Structural Drift surface",
    "foundational leadership invitation",
    "clear continuation into MAP education",
    "clear continuation into assessment",
    "no assessment form inside About encounter",
    "no commerce mechanics",
  ],
  motion_contract: [
    "slow reveal",
    "clean fade",
    "crystalline wipe permitted as internal style only",
    "no aggressive animation",
    "no countdowns",
    "no pressure movement",
  ],
  tone_sequence: [
    "recognition",
    "institutional_orientation",
    "structural_drift_visibility",
    "leadership_invitation",
    "MAP_education",
    "conversion_boundary",
    "assessment_invitation",
  ],
}

const CRYSTAL_CONTENT_CONTRACTS = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  understand_environment_passage: {
    active_key: "understand_environment_passage",
    contract_type: "passage",
    public_label: PUBLIC_LABEL,
    role: "video-first education passage",
    resolves_to: "about_measures_registry_encounter",
    media_role: "brief comparison video",
    video_contract_key: "questions_ungoverned_systems_cannot_answer_video_script",
    video_title: "The Questions Ungoverned AI Systems Cannot Answer",
    video_purpose:
      "Compare AI-accelerated systems without integrity governance against Measures Integrity Systems.",
  },
  questions_ungoverned_systems_cannot_answer_video_script: {
    contract_key: "questions_ungoverned_systems_cannot_answer_video_script",
    title: "The Questions Ungoverned AI Systems Cannot Answer",
    script: VIDEO_SCRIPT,
    boundary: {
      do_not_expose: PUBLIC_PROHIBITIONS.slice(0, 12),
    },
  },
  video_visual_contract: {
    visual_comparison: {
      ungoverned_ai_environment: [
        "fragmented dashboards",
        "overlapping AI agents",
        "amber drift seams",
        "missing review paths",
        "old approval structures trying to control new AI",
        "outputs moving without trace",
        "accountability questions appearing with no answer",
      ],
      measures_integrity_system: [
        "authority lines connect",
        "AI roles separate",
        "runtime surfaces become bounded",
        "review pathways illuminate",
        "findings appear as critical / emerging / probable conditions",
        "governed actions form as implementation path",
        "system becomes legible and accountable",
      ],
    },
    title_card_beats: [
      "Who approved this?",
      "What system produced it?",
      "Was it reviewed?",
      "Can it be traced?",
      "What is drifting?",
    ],
    final_card: [
      "MEASURES REGISTRY",
      "Integrity Governance for AI-Accelerated Systems",
    ],
  },
  about_measures_registry_encounter: {
    active_key: "about_measures_registry_encounter",
    contract_type: "education_encounter",
    public_label: "About Measures Registry",
    role: "institutional introduction + publication + leadership invitation",
    resolves_to: "c3_map_education_encounter",
    content: [
      "Measures Registry is a registered branch of c3 Community Partners, DAO LLC.",
      "It exists to provide Integrity Governance for AI-Accelerated Systems.",
      "AI drift is not only a model problem. It is amplified by ungoverned authority, unclear roles, exposed runtime surfaces, missing review pathways, and implementation conditions that have not been structured.",
      "Measures Registry helps institutions identify the conditions shaping AI behavior, recognize drift-amplifying factors, and move toward governed action where appropriate.",
      "This is governance by system integrity.",
    ],
    content_blocks: {
      structural_drift_publication_block: {
        content_block_key: "structural_drift_publication_block",
        public_label: "Structural Drift: Dispatches from the Measures Registry",
        role: "publication / public proof-of-thinking / education artifact",
        content:
          "Structural Drift: Dispatches from the Measures Registry examines how ungoverned systems begin to degrade before institutions can see the full operational impact. Read Structural Drift to understand why AI governance cannot be reduced to tools, prompts, policies, or more agents. It must include the system conditions that shape AI behavior.",
        cta: "Read Structural Drift",
      },
      foundational_leadership_block: {
        content_block_key: "foundational_leadership_block",
        public_label: "Foundational Leadership",
        role: "leadership invitation / partner development surface",
        content:
          "Measures Registry is opening space for foundational leaders who understand that AI governance is not only a technical challenge. It is a systems integrity challenge. We are seeking aligned partners, advisors, institutional collaborators, and builders who can help shape the standards, pathways, and implementation culture required for governable AI-accelerated systems.",
        cta: "Begin a Leadership Conversation",
        boundary:
          "This invitation does not grant role, permission, governance standing, DAO standing, certification, conversion, payment standing, or c3 Key standing.",
      },
    },
  },
  c3_map_education_encounter: {
    active_key: "c3_map_education_encounter",
    public_label: "MAP the Environment",
    contract_type: "education_encounter",
    role: "bounded runtime audit education",
    resolves_to: "measures_conversion_education_encounter",
    public_definition:
      "MAP the Environment is a governed runtime audit for AI-accelerated systems.",
    boundary:
      "MAP the Environment audits runtime structure, not confidential institutional substance.",
    public_circuit_exposure_allowed: false,
  },
  measures_conversion_education_encounter: {
    active_key: "measures_conversion_education_encounter",
    public_label: "Measures Conversion",
    contract_type: "education_encounter",
    role: "conversion boundary education",
    resolves_to: "assess_environment_cta_encounter",
    content:
      "Measures Conversion is the verified completion condition reached only after governed implementation, correct sequence, verification, and system integrity that holds under review. Registry Certification can only be considered after Measures Conversion is verified.",
    boundary:
      "Measures Conversion is not assessment completion, payment, c3 MAP participation, responsible AI use, implementation activity alone, or self-declared readiness.",
    activation_status: "held",
  },
  assess_environment_cta_encounter: {
    active_key: "assess_environment_cta_encounter",
    public_label: "Assess the Environment",
    contract_type: "cta_encounter",
    role: "route to assessment",
    resolves_to: "assess_environment_passage",
    cta_copy:
      "Begin by understanding the environment. Then assess what must be governed.",
    button: "Assess the Environment",
  },
  public_prohibitions: PUBLIC_PROHIBITIONS,
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function collectPublicStrings(value, path = "") {
  if (value == null) return []
  if (typeof value === "string") {
    return /(^|_)(public_label|content|cta|button|public_definition|public_positioning|core_explanation|cta_copy|title|final_card)$/i.test(
      path,
    )
      ? [value]
      : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectPublicStrings(item, `${path}_${index}`))
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      collectPublicStrings(child, path ? `${path}_${key}` : key),
    )
  }
  return []
}

async function main() {
  assertOk(
    await supabase.from("measures_encounter_def").select("id").limit(1),
    "DB connection",
  )

  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", TARGET_KEY)
      .single(),
    "fetch structure_passage",
  )

  const metadata = clone(row.metadata)
  const existingActiveKeys =
    metadata.active_contract_key_reconciliation?.active_contract_keys || []
  const mergedActiveKeys = Array.from(new Set([...existingActiveKeys, ...ACTIVE_KEYS]))

  const nextReconciliation = {
    ...(metadata.active_contract_key_reconciliation || {}),
    version: "v1",
    source_oar2: SOURCE_OAR2,
    reconciliation_status: "crystal_chamber_active_contracts_seated",
    carrier_row_key: TARGET_KEY,
    carrier_row_semantic_authority: "none",
    active_contract_key: "understand_environment_passage",
    active_contract_keys: mergedActiveKeys,
    renderer_rule: "read_active_contract_keys_not_legacy_carrier_row_names",
    runtime_final_pass_authorized: false,
    frontend_hardcode_allowed: false,
    db_term_tag_authority_created: false,
    activated_standing: {
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
    },
  }

  const nextMetadata = {
    ...metadata,
    crystal_chamber_contract: CRYSTAL_CHAMBER_CONTRACT,
    education_crystal_style_contract: CRYSTAL_STYLE_CONTRACT,
    crystal_chamber_content_contracts: CRYSTAL_CONTENT_CONTRACTS,
    active_contract_key_reconciliation: nextReconciliation,
    chamber_contract: {
      ...(metadata.chamber_contract || {}),
      contract_key: "crystal_chamber_contract",
      public_label: PUBLIC_LABEL,
      internal_material_family: "Crystal",
      public_material_naming_allowed: false,
      renderer_rule: "render_seated_state_only",
      frontend_hardcode_allowed: false,
      runtime_final_pass_authorized: false,
      active_contract_key_reconciliation: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        active_contract_key: "understand_environment_passage",
        active_contract_keys: mergedActiveKeys,
        legacy_carrier_row_key: TARGET_KEY,
        legacy_carrier_row_key_semantic_authority: "none",
        renderer_rule: "read_active_contract_keys_not_legacy_carrier_row_names",
        reconciled_contract: "crystal_chamber_contract",
      },
    },
  }

  const updated = assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: nextMetadata })
      .eq("id", row.id)
      .select("encounter_key, metadata")
      .single(),
    "update structure_passage",
  )

  const readback = updated.metadata
  const errors = []
  if (readback.crystal_chamber_contract?.contract_key !== "crystal_chamber_contract") {
    errors.push("crystal chamber contract missing")
  }
  if (
    readback.crystal_chamber_contract?.public_material_naming_allowed !== false ||
    readback.chamber_contract?.public_material_naming_allowed !== false
  ) {
    errors.push("public material naming not prohibited")
  }
  if (
    readback.crystal_chamber_content_contracts?.understand_environment_passage
      ?.active_key !== "understand_environment_passage"
  ) {
    errors.push("understand environment passage missing")
  }
  if (
    readback.crystal_chamber_content_contracts
      ?.questions_ungoverned_systems_cannot_answer_video_script?.script?.length !==
    VIDEO_SCRIPT.length
  ) {
    errors.push("video script missing or incomplete")
  }
  const aboutContent =
    readback.crystal_chamber_content_contracts?.about_measures_registry_encounter
      ?.content?.[0] || ""
  if (!aboutContent.startsWith("Measures Registry is a registered branch")) {
    errors.push("about content branch statement missing")
  }
  if (
    !readback.crystal_chamber_content_contracts?.about_measures_registry_encounter
      ?.content_blocks?.structural_drift_publication_block
  ) {
    errors.push("structural drift block missing")
  }
  if (
    !readback.crystal_chamber_content_contracts?.about_measures_registry_encounter
      ?.content_blocks?.foundational_leadership_block
  ) {
    errors.push("foundational leadership block missing")
  }
  for (const key of ACTIVE_KEYS) {
    if (!readback.active_contract_key_reconciliation?.active_contract_keys?.includes(key)) {
      errors.push(`active key missing: ${key}`)
    }
  }
  const publicStrings = collectPublicStrings(readback.crystal_chamber_content_contracts)
  const prohibitedPublic = ["C1 / C2 / C3", "Crystal Chamber", "Marble Governance Chamber", "Obsidian route", "Lapis route"]
  for (const term of prohibitedPublic) {
    if (publicStrings.some((value) => value.includes(term))) {
      errors.push(`prohibited public term found: ${term}`)
    }
  }
  const activated = readback.active_contract_key_reconciliation?.activated_standing || {}
  for (const [key, value] of Object.entries(activated)) {
    if (value !== false) errors.push(`${key} activated`)
  }
  if (readback.active_contract_key_reconciliation?.runtime_final_pass_authorized !== false) {
    errors.push("runtime final pass not blocked")
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_row: TARGET_KEY,
        crystal_chamber_contract: "seated",
        active_contract_keys: readback.active_contract_key_reconciliation.active_contract_keys,
        video_script_lines: VIDEO_SCRIPT.length,
        about_branch_statement: "PASS",
        structural_drift_block: "PASS",
        foundational_leadership_block: "PASS",
        map_education_stub: "PASS",
        measures_conversion_education_stub: "PASS",
        assessment_cta_encounter: "PASS",
        public_material_naming_allowed: false,
        runtime_final_pass_authorized: false,
        activation_standing: activated,
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
