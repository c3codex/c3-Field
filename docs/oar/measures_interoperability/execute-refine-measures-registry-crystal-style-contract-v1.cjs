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
  "docs/oar/measures_interoperability/oar2_refine_measures_registry_crystal_style_contract_v1.meta.md"
const TARGET_KEY = "structure_passage"

const PROHIBITED_PUBLIC_COPY = [
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

const ALLOWED_PUBLIC_TERMS = [
  "Understand the Environment",
  "Measures Registry",
  "Integrity Governance for AI-Accelerated Systems",
  "The Questions Ungoverned AI Systems Cannot Answer",
  "About Measures Registry",
  "Structural Drift",
  "Foundational Leadership",
  "MAP the Environment",
  "Measures Conversion",
  "Assess the Environment",
]

const REFINED_STYLE_CONTRACT = {
  version: "v1",
  source_oar2: SOURCE_OAR2,
  style_contract_key: "education_crystal_style_contract",
  public_label: "Understand the Environment",
  internal_material_family: "Crystal",
  public_material_naming_allowed: false,
  style_role: "public education / recognition / orientation",
  renderer_rule: "render_seated_state_only",
  frontend_hardcode_allowed: false,
  runtime_final_pass_authorized: false,
  visual_intent:
    "Crystal makes the hidden environment visible, reveals what ungoverned AI-accelerated systems cannot answer, and routes the institution toward governed understanding.",
  core_visual_identity: {
    environment: "dark institutional crystal environment",
    contrast: "high",
    readability: "high",
    light_language: "blue-white crystalline clarity",
    drift_warning: "restrained amber only on the ungoverned side",
    lighting: "restrained architectural lighting",
    disallowed: [
      "fantasy glow",
      "cyberpunk chaos",
      "sales-page brightness",
      "public material labels",
    ],
  },
  layout_hierarchy: [
    "Hero / comparison surface",
    "Video passage: The Questions Ungoverned AI Systems Cannot Answer",
    "About Measures Registry encounter",
    "Structural Drift publication block",
    "Foundational Leadership block",
    "Education pathway cards",
    "CTA to Assess the Environment",
  ],
  hero_contract: {
    type: "comparison_hero",
    left_state: "ungoverned_ai_environment",
    right_state: "measures_integrity_system",
    center_anchor: "crystal_clarity_threshold",
    purpose: "make hidden AI-facing environment visible",
    top_region: "Measures Registry brand + navigation",
    primary_cta: "Watch the Video",
    secondary_cta: "Assess the Environment",
    comparison_idea: "The ungoverned side cannot answer. The Measures Integrity side can.",
    left_visual_language: [
      "fragmented dashboards",
      "overlapping agents",
      "amber question markers",
      "unanswered accountability questions",
      "broken review pathways",
      "outputs moving without trace",
      "old approval systems trying to govern new AI acceleration",
    ],
    right_visual_language: [
      "clear authority",
      "defined roles",
      "review pathways",
      "traceable actions",
      "governed outcomes",
      "bounded runtime surfaces",
      "environment able to answer for what it produces",
    ],
  },
  copy_contract: {
    allowed_public_positioning: [
      "Measures Registry provides Integrity Governance for AI-Accelerated Systems.",
      "Measures Registry makes the environment visible, identifies what is driving AI behavior, and helps institutions move toward governed action.",
      "Measures Registry governs AI environments by measuring the integrity of the systems that produce AI behavior.",
    ],
    allowed_public_terms: ALLOWED_PUBLIC_TERMS,
    prohibited_public_copy: PROHIBITED_PUBLIC_COPY,
  },
  component_style_rules: {
    typography: {
      heading: "large serif or institutional display",
      body: "clean readable sans-serif",
      labels: "uppercase small caps allowed",
      density: "moderate, not crowded",
      hero_copy_priority: "recognition over explanation",
    },
    color: {
      background: "dark graphite / deep navy",
      primary_light: "cool crystal blue-white",
      drift_warning: "restrained amber only",
      text: "white / soft silver",
      accent: "controlled blue",
    },
    cards: {
      surface: "translucent dark glass",
      border: "fine crystal line",
      radius: "subtle",
      shadow: "minimal",
      glow: "restrained",
    },
    buttons: {
      primary: "blue institutional CTA",
      secondary: "text/link style",
      disallowed: ["aggressive gradients", "sales urgency", "pressure language"],
    },
    motion: {
      allowed: [
        "slow reveal",
        "clean fade",
        "crystal wipe permitted internally",
        "question markers resolve into mapped nodes",
      ],
      disallowed: ["countdowns", "bouncing CTA", "aggressive animation"],
    },
  },
  encounter_specific_style_contract: {
    understand_environment_passage: {
      media: "comparison_video",
      title: "The Questions Ungoverned AI Systems Cannot Answer",
      style: "split_state_video_panel",
      resolves_to: "about_measures_registry_encounter",
    },
    about_measures_registry_encounter: {
      includes: [
        "institutional standing",
        "governance by system integrity",
        "structural_drift_publication_block",
        "foundational_leadership_block",
      ],
      resolves_to: "c3_map_education_encounter",
    },
    c3_map_education_encounter: {
      public_label: "MAP the Environment",
      role: "bounded runtime audit education",
      boundary: "no full-system-audit claim",
    },
    measures_conversion_education_encounter: {
      role: "conversion boundary education",
      style: "inscription-like, sober, concise",
    },
    assess_environment_cta_encounter: {
      role: "route to assessment",
      cta: "Assess the Environment",
    },
  },
  density_correction: {
    hero_must_not_carry_all_education_content: true,
    hero_priorities: [
      "recognition",
      "problem visibility",
      "video entry",
      "clean comparison",
      "primary action",
    ],
    detailed_education_location:
      "below the video passage and inside encounter surfaces, not inside the hero",
  },
  public_boundary_rule: {
    internal_visual_behavior_allowed: true,
    public_material_terminology_allowed: false,
    do_not_render: [
      "Crystal Chamber",
      "Crystal path",
      "crystal governance",
      "material-family navigation labels",
    ],
    allowed_public_terms: ALLOWED_PUBLIC_TERMS,
  },
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function publicCopyStrings(value, path = "") {
  if (value == null) return []
  if (typeof value === "string") {
    return /public_label|primary_cta|secondary_cta|allowed_public_positioning|allowed_public_terms|title|cta$/i.test(
      path,
    )
      ? [value]
      : []
  }
  if (Array.isArray(value)) {
    return value.flatMap((child, index) => publicCopyStrings(child, `${path}_${index}`))
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      publicCopyStrings(child, path ? `${path}_${key}` : key),
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
  const nextMetadata = {
    ...metadata,
    education_crystal_style_contract: {
      ...(metadata.education_crystal_style_contract || {}),
      ...REFINED_STYLE_CONTRACT,
      refinement_status: "refined",
      refined_from_oar2:
        "docs/oar/measures_interoperability/oar2_seat_measures_registry_crystal_chamber_contracts_v1.meta.md",
    },
    crystal_style_contract_refinement: {
      version: "v1",
      source_oar2: SOURCE_OAR2,
      status: "seated",
      target_contract: "education_crystal_style_contract",
      renderer_rule: "render_seated_state_only",
      runtime_final_pass_authorized: false,
      frontend_hardcode_allowed: false,
      public_material_naming_allowed: false,
      db_term_tag_authority_created: false,
      activation_standing: {
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
  const style = readback.education_crystal_style_contract
  const errors = []

  if (style?.style_contract_key !== "education_crystal_style_contract") {
    errors.push("style contract key missing")
  }
  if (style?.public_material_naming_allowed !== false) {
    errors.push("public material naming not prohibited")
  }
  if (style?.runtime_final_pass_authorized !== false) {
    errors.push("runtime final pass not blocked")
  }
  if (style?.hero_contract?.type !== "comparison_hero") {
    errors.push("hero comparison contract missing")
  }
  if (!Array.isArray(style?.layout_hierarchy) || style.layout_hierarchy.length !== 7) {
    errors.push("layout hierarchy incomplete")
  }
  if (!style?.component_style_rules?.typography || !style?.component_style_rules?.motion) {
    errors.push("component style rules incomplete")
  }
  if (!style?.encounter_specific_style_contract?.understand_environment_passage) {
    errors.push("encounter-specific style rules missing")
  }
  if (style?.density_correction?.hero_must_not_carry_all_education_content !== true) {
    errors.push("hero density correction missing")
  }

  const publicStrings = publicCopyStrings(style)
  for (const prohibited of [
    "C1 / C2 / C3",
    "Crystal Chamber",
    "Marble Governance Chamber",
    "Obsidian route",
    "Lapis route",
  ]) {
    if (publicStrings.some((value) => value.includes(prohibited))) {
      errors.push(`prohibited public copy found: ${prohibited}`)
    }
  }

  const activation = readback.crystal_style_contract_refinement?.activation_standing || {}
  for (const [key, value] of Object.entries(activation)) {
    if (value !== false) errors.push(`${key} activated`)
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        target_row: TARGET_KEY,
        style_contract: "education_crystal_style_contract",
        refinement_status: style.refinement_status,
        hero_contract: style.hero_contract.type,
        layout_hierarchy_items: style.layout_hierarchy.length,
        component_style_rules: Object.keys(style.component_style_rules),
        encounter_specific_rules: Object.keys(style.encounter_specific_style_contract),
        public_material_naming_allowed: style.public_material_naming_allowed,
        runtime_final_pass_authorized: style.runtime_final_pass_authorized,
        activation_standing: activation,
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
