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
  "docs/oar/measures-registry/oar2_correct_ai_operations_assessment_title_obsidian_references_and_fit_v1.meta.md"

const ASSESSMENT_KEY = "measures_assessment"
const ASSESSMENT_TITLE = "AI Operations Assessment"

const REFERENCE_STATEMENTS = [
  "AI output becomes operational risk when review pathways are unclear.",
  "Authority must be defined before AI-generated actions can be trusted.",
  "Runtime surfaces shape what AI can touch, expose, or alter.",
  "Role clarity determines who may approve, act, review, or correct.",
  "Acceleration without structure can amplify instability across the environment.",
  "Traceability determines whether AI-supported decisions can be reviewed after impact.",
  "Governed implementation requires conditions that hold under pressure.",
]

const FOOTER_LINES = [
  "\u00a9 2026 Measures Registry. All rights reserved.",
  "Measures Registry is a registered c3 Field system.",
  "Operated by c3 Community Partners DAO, LLC.",
]

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function collectStrings(value) {
  if (value == null) return []
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (typeof value === "object") return Object.values(value).flatMap(collectStrings)
  return []
}

function footerContract() {
  return {
    version: "v2",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_footer_contract",
    footer_visible: true,
    footer_visibility: "visible",
    copy_authority: "measures_encounter_def.metadata.footer_contract",
    frontend_hardcode_allowed: false,
    copy_lines: FOOTER_LINES,
    copyright: FOOTER_LINES[0],
    system_statement: FOOTER_LINES[1],
    operator_statement: FOOTER_LINES[2],
  }
}

async function main() {
  assertOk(await supabase.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const row = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, display_title, material_family, metadata")
      .eq("encounter_key", ASSESSMENT_KEY)
      .single(),
    "fetch measures_assessment",
  )

  const metadata = clone(row.metadata)
  const mechanics = clone(metadata.assessment_mechanics)
  const questions = Array.isArray(mechanics.questions) ? mechanics.questions : []

  if (questions.length !== 7) {
    throw new Error(`Expected 7 assessment questions; found ${questions.length}`)
  }

  const updatedQuestions = questions.map((question, index) => {
    const options = Array.isArray(question.options) ? question.options : []
    if (options.length !== 3) {
      throw new Error(`Question ${index + 1} expected 3 answer choices; found ${options.length}`)
    }
    return {
      ...question,
      context_statement: REFERENCE_STATEMENTS[index],
      reference_statement: REFERENCE_STATEMENTS[index],
    }
  })

  const updatedMetadata = {
    ...metadata,
    title: ASSESSMENT_TITLE,
    eyebrow: "Measures Registry",
    assessment_chamber: {
      ...clone(metadata.assessment_chamber),
      title: ASSESSMENT_TITLE,
      material_family: "obsidian",
      source_oar2_title_obsidian_fit: SOURCE_OAR2,
    },
    assessment_mechanics: {
      ...mechanics,
      questions: updatedQuestions,
      reference_statement_contract: {
        version: "v1",
        source_oar2: SOURCE_OAR2,
        reference_statements_visible: true,
        scoring_logic_exposed: false,
        question_order_preserved: true,
      },
    },
    styling_contract: {
      ...clone(metadata.styling_contract),
      version: "v3",
      source_oar2: SOURCE_OAR2,
      material_family: "obsidian",
      foundation_material: "obsidian",
      surface_mode: "obsidian_assessment_threshold",
      bright_lapis_chamber_allowed: false,
      over_glow_allowed: false,
      metadata_bleed_allowed: false,
      watermark_text_allowed: false,
      answer_option_style: "compact_operational_rows",
      question_context_visibility: true,
    },
    layout_contract: {
      ...clone(metadata.layout_contract),
      version: "v3",
      source_oar2: SOURCE_OAR2,
      layout_mode: "single_question_obsidian_assessment",
      viewport_fit: "fit_to_page_desktop",
      control_accessibility_required: true,
      question_5_controls_accessible: true,
      header_redundancy: false,
      duplicate_branding_allowed: false,
      watermark_visible: false,
      mobile_layout: "single_column_scroll_allowed",
    },
    branding_contract: {
      ...clone(metadata.branding_contract),
      version: "v2",
      source_oar2: SOURCE_OAR2,
      brand_visible: true,
      brand_label: "Measures Registry",
      single_brand_treatment_required: true,
      duplicate_brand_text_allowed: false,
      assessment_brand_layer_text_allowed: false,
    },
    footer_contract: footerContract(),
  }

  assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({
        display_title: ASSESSMENT_TITLE,
        material_family: "obsidian",
        metadata: updatedMetadata,
      })
      .eq("id", row.id),
    "update measures_assessment",
  )

  const readback = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, display_title, material_family, metadata")
      .eq("encounter_key", ASSESSMENT_KEY)
      .single(),
    "readback measures_assessment",
  )

  const rb = readback.metadata ?? {}
  const rbQuestions = rb.assessment_mechanics?.questions ?? []
  const errors = []

  if (readback.display_title !== ASSESSMENT_TITLE) errors.push("display_title not corrected")
  if (rb.assessment_chamber?.title !== ASSESSMENT_TITLE) errors.push("assessment_chamber.title not corrected")
  if (rb.styling_contract?.material_family !== "obsidian") errors.push("obsidian material not seated")
  if (rb.layout_contract?.duplicate_branding_allowed !== false) errors.push("duplicate brand boundary not seated")
  if (rb.layout_contract?.watermark_visible !== false) errors.push("watermark boundary not seated")
  if (rb.footer_contract?.copy_lines?.length !== 3) errors.push("footer copy not seated")
  if (rbQuestions.length !== 7) errors.push(`readback question count ${rbQuestions.length}`)

  rbQuestions.forEach((question, index) => {
    if (question.context_statement !== REFERENCE_STATEMENTS[index]) {
      errors.push(`question ${index + 1} reference statement mismatch`)
    }
    if (!Array.isArray(question.options) || question.options.length !== 3) {
      errors.push(`question ${index + 1} option count mismatch`)
    }
  })

  const forbidden = [
    "EMBLEM ONLY",
    "metadata label",
    "renderer/debug",
    "contract label",
  ]
  const visibleContractStrings = collectStrings([
    rb.title,
    rb.eyebrow,
    rb.assessment_chamber?.title,
    rb.assessment_mechanics?.questions,
  ])
  for (const term of forbidden) {
    if (visibleContractStrings.some((value) => value.toLowerCase().includes(term.toLowerCase()))) {
      errors.push(`forbidden visible term seated: ${term}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        assessment: {
          encounter_key: ASSESSMENT_KEY,
          title: ASSESSMENT_TITLE,
          material_family: "obsidian",
          question_count: rbQuestions.length,
          option_counts: rbQuestions.map((question) => question.options?.length ?? 0),
          reference_statements: rbQuestions.map((question) => question.context_statement),
        },
        layout_contract: {
          viewport_fit: rb.layout_contract?.viewport_fit,
          duplicate_branding_allowed: rb.layout_contract?.duplicate_branding_allowed,
          watermark_visible: rb.layout_contract?.watermark_visible,
          question_5_controls_accessible: rb.layout_contract?.question_5_controls_accessible,
        },
        footer_copy: rb.footer_contract?.copy_lines,
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
