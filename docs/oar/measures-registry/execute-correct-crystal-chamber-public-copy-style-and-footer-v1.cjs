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
  "docs/oar/measures-registry/oar2_correct_crystal_chamber_public_copy_style_and_footer_v1.meta.md"

const STRUCTURE_PASSAGE = "structure_passage"
const CRYSTAL_CHAMBER = "crystal_chamber"

const POSITION_PARAGRAPH = [
  "Measures Registry differs from the dominant AI-market assumption.",
  "Dominant assumption:",
  "AI optimization is achieved primarily through more compute, better models, more agents, and more automation.",
  "Measures Registry position:",
  "AI optimization cannot be achieved through tools alone.",
  "AI systems interact with workflows, roles, approvals, data, outputs, and decisions.",
  "Without Governed System Integrity, those interactions can amplify instability across the systems they touch.",
  "Governed System Integrity provides the necessary environment for Optimized AI Deployment.",
].join("\n\n")

const FOOTER_LINES = [
  "\u00a9 2026 Measures Registry. All rights reserved.",
  "Measures Registry is a registered c3 Field system.",
  "Operated by c3 Community Partners DAO, LLC.",
]

const FOOTER_VISIBLE_KEYS = [
  "eval_passage",
  "measures_assessment",
  "obsidian_to_marble_passage_video",
  "marble_pathway_reveal",
  STRUCTURE_PASSAGE,
  CRYSTAL_CHAMBER,
  "structural_drift_publication",
]

const FOOTER_HIDDEN_KEYS = [
  "ai_isnt_broken_intro",
  "evaluate_structure_path",
]

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function footerContract(visible) {
  return {
    version: "v2",
    source_oar2: SOURCE_OAR2,
    inherits_from: "mrssc_v1_footer_contract",
    footer_visible: visible,
    footer_visibility: visible ? "visible" : "hidden",
    copy_authority: "measures_encounter_def.metadata.footer_contract",
    frontend_hardcode_allowed: false,
    copy_lines: visible ? FOOTER_LINES : [],
    copyright: visible ? FOOTER_LINES[0] : null,
    system_statement: visible ? FOOTER_LINES[1] : null,
    operator_statement: visible ? FOOTER_LINES[2] : null,
  }
}

function collectStrings(value) {
  if (value == null) return []
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (typeof value === "object") return Object.values(value).flatMap(collectStrings)
  return []
}

async function fetchEncounterMap(keys) {
  const rows = assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, display_title, metadata")
      .in("encounter_key", keys),
    "fetch encounter rows",
  )
  return new Map(rows.map((row) => [row.encounter_key, row]))
}

async function updateEncounter(row, metadata, label) {
  assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata })
      .eq("id", row.id),
    label,
  )
}

async function main() {
  assertOk(await supabase.from("measures_encounter_def").select("id").limit(1), "DB connection")

  const keys = [...new Set([...FOOTER_VISIBLE_KEYS, ...FOOTER_HIDDEN_KEYS])]
  const rowMap = await fetchEncounterMap(keys)

  const structureRow = rowMap.get(STRUCTURE_PASSAGE)
  if (!structureRow) throw new Error("structure_passage row not found")

  const structureMetadata = clone(structureRow.metadata)
  const structureContracts = clone(structureMetadata.crystal_chamber_content_contracts)
  const structurePassageContract = clone(structureContracts.structure_passage_contract_v1)
  const understandPassage = clone(structureContracts.understand_environment_passage)

  const nextStructureMetadata = {
    ...structureMetadata,
    eyebrow: "OUR APPROACH",
    title: "About Measures Registry",
    informational_paragraph: POSITION_PARAGRAPH,
    footer_contract: footerContract(true),
    layout_contract: {
      ...clone(structureMetadata.layout_contract),
      version: "v2",
      source_oar2: SOURCE_OAR2,
      layout_mode: "right_path_talking_head_passage",
      viewport_fit: "fit_to_page_desktop",
      footer_visibility: "visible",
      questions_explainer_allowed: false,
      card_grid_hub_allowed: false,
    },
    crystal_chamber_content_contracts: {
      ...structureContracts,
      structure_passage_contract_v1: {
        ...structurePassageContract,
        source_oar2_public_copy_footer: SOURCE_OAR2,
        public_eyebrow: "OUR APPROACH",
        public_title: "About Measures Registry",
        position_paragraph: POSITION_PARAGRAPH,
        questions_explainer_allowed: false,
        auto_advance_target_surface: CRYSTAL_CHAMBER,
      },
      understand_environment_passage: {
        ...understandPassage,
        public_label: "OUR APPROACH",
        title: "About Measures Registry",
        position_paragraph: POSITION_PARAGRAPH,
      },
    },
  }

  await updateEncounter(structureRow, nextStructureMetadata, "update structure_passage public copy")

  const crystalRow = rowMap.get(CRYSTAL_CHAMBER)
  if (!crystalRow) throw new Error("crystal_chamber row not found")

  const crystalMetadata = clone(crystalRow.metadata)
  const crystalContracts = clone(crystalMetadata.crystal_chamber_content_contracts)
  const aboutEncounter = clone(crystalContracts.about_measures_registry_encounter)
  const aboutContentBlocks = clone(aboutEncounter.content_blocks)
  const structuralDriftBlock = clone(aboutContentBlocks.structural_drift_publication_block)
  const sparseContract = clone(
    crystalContracts.crystal_chamber_sparse_orientation_contract_v1 ??
      crystalMetadata.content_contract,
  )

  const nextSparseContract = {
    ...sparseContract,
    source_oar2_public_copy_footer: SOURCE_OAR2,
    public_eyebrow: "UNDERSTAND THE ENVIRONMENT",
    public_title: "Questions Ungoverned Systems Cannot Answer",
    public_context: "",
    questions_explainer_media_role: "questions_ungoverned_systems_cannot_answer_video",
    dense_content_hub_allowed: false,
  }

  const nextCrystalMetadata = {
    ...crystalMetadata,
    eyebrow: "UNDERSTAND THE ENVIRONMENT",
    title: "Questions Ungoverned Systems Cannot Answer",
    subtitle: "",
    footer_contract: footerContract(true),
    styling_contract: {
      ...clone(crystalMetadata.styling_contract),
      version: "v2",
      source_oar2: SOURCE_OAR2,
      material_family: "crystal",
      visual_contract: "sparse_luminous_chamber",
      excessive_glow_allowed: false,
      card_grid_density_allowed: false,
      raw_metadata_styling_allowed: false,
    },
    layout_contract: {
      ...clone(crystalMetadata.layout_contract),
      version: "v2",
      source_oar2: SOURCE_OAR2,
      layout_mode: "crystal_sparse_fit_to_page",
      viewport_fit: "fit_to_page_desktop",
      media_max: "contained",
      footer_visibility: "visible",
      primary_sections: [
        "questions_explainer_video",
        "structural_drift_section",
        "foundational_leadership_cta",
        "assess_environment_cta",
      ],
    },
    content_contract: nextSparseContract,
    crystal_chamber_content_contracts: {
      ...crystalContracts,
      about_measures_registry_encounter: {
        ...aboutEncounter,
        content_blocks: {
          ...aboutContentBlocks,
          structural_drift_publication_block: {
            ...structuralDriftBlock,
            public_label: "Structural Drift",
          },
        },
      },
      crystal_chamber_sparse_orientation_contract_v1: nextSparseContract,
    },
  }

  await updateEncounter(crystalRow, nextCrystalMetadata, "update crystal_chamber public copy")

  for (const key of FOOTER_VISIBLE_KEYS) {
    if (key === STRUCTURE_PASSAGE || key === CRYSTAL_CHAMBER) continue
    const row = rowMap.get(key)
    if (!row) continue
    const metadata = clone(row.metadata)
    await updateEncounter(row, { ...metadata, footer_contract: footerContract(true) }, `update ${key} footer`)
  }

  for (const key of FOOTER_HIDDEN_KEYS) {
    const row = rowMap.get(key)
    if (!row) continue
    const metadata = clone(row.metadata)
    await updateEncounter(row, { ...metadata, footer_contract: footerContract(false) }, `update ${key} footer hidden`)
  }

  const readback = await fetchEncounterMap(keys)
  const structureReadback = readback.get(STRUCTURE_PASSAGE)?.metadata ?? {}
  const crystalReadback = readback.get(CRYSTAL_CHAMBER)?.metadata ?? {}

  const errors = []
  if (structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.public_eyebrow !== "OUR APPROACH") {
    errors.push("structure_passage public eyebrow not seated")
  }
  if (structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.public_title !== "About Measures Registry") {
    errors.push("structure_passage public title not seated")
  }
  if (crystalReadback.content_contract?.public_eyebrow !== "UNDERSTAND THE ENVIRONMENT") {
    errors.push("crystal_chamber public eyebrow not seated")
  }
  if (crystalReadback.content_contract?.public_title !== "Questions Ungoverned Systems Cannot Answer") {
    errors.push("crystal_chamber public title not seated")
  }
  if (crystalReadback.crystal_chamber_content_contracts?.about_measures_registry_encounter?.content_blocks?.structural_drift_publication_block?.public_label !== "Structural Drift") {
    errors.push("crystal_chamber Structural Drift sparse label not seated")
  }

  for (const key of FOOTER_VISIBLE_KEYS) {
    const metadata = readback.get(key)?.metadata
    if (!metadata) continue
    if (metadata.footer_contract?.footer_visible !== true) errors.push(`${key} footer not visible`)
    if (JSON.stringify(metadata.footer_contract?.copy_lines) !== JSON.stringify(FOOTER_LINES)) {
      errors.push(`${key} footer copy not seated`)
    }
  }

  for (const key of FOOTER_HIDDEN_KEYS) {
    const metadata = readback.get(key)?.metadata
    if (!metadata) continue
    if (metadata.footer_contract?.footer_visible !== false) errors.push(`${key} footer not hidden`)
  }

  const forbiddenPublicLabels = [
    "right-path passage",
    "sparse orientation",
    "chamber contract",
    "route contract",
    "runtime surface",
    "system key",
    "registry contract",
  ]
  const visibleStrings = collectStrings([
    structureReadback.eyebrow,
    structureReadback.title,
    structureReadback.informational_paragraph,
    structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.public_eyebrow,
    structureReadback.crystal_chamber_content_contracts?.structure_passage_contract_v1?.public_title,
    crystalReadback.eyebrow,
    crystalReadback.title,
    crystalReadback.subtitle,
    crystalReadback.content_contract?.public_eyebrow,
    crystalReadback.content_contract?.public_title,
    crystalReadback.content_contract?.public_context,
  ])
  for (const term of forbiddenPublicLabels) {
    if (visibleStrings.some((value) => value.toLowerCase().includes(term))) {
      errors.push(`internal public label still seated: ${term}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`validation failed:\n${errors.join("\n")}`)
  }

  console.log(
    JSON.stringify(
      {
        source_oar2: SOURCE_OAR2,
        structure_passage: {
          eyebrow: "OUR APPROACH",
          title: "About Measures Registry",
          auto_advance_target: CRYSTAL_CHAMBER,
        },
        crystal_chamber: {
          eyebrow: "UNDERSTAND THE ENVIRONMENT",
          title: "Questions Ungoverned Systems Cannot Answer",
          style_contract: "sparse_luminous_chamber",
        },
        footer_visible: FOOTER_VISIBLE_KEYS,
        footer_hidden: FOOTER_HIDDEN_KEYS,
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
