require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const writer = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

const SOURCE_OAR2 =
  "docs/oar/measures_registry/oar2_correct_eval_passage_and_assessment_chamber_contract_expression_gaps_v1.meta.md"

async function main() {
  console.log("=== PRE-FLIGHT READ ===\n")

  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["eval_passage", "measures_assessment", "structured_eval"]),
    "read target rows",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  const epRow = byKey["eval_passage"]
  if (!epRow) throw new Error("eval_passage not found")
  const maRow = byKey["measures_assessment"]
  if (!maRow) throw new Error("measures_assessment not found")
  const seRow = byKey["structured_eval"]
  if (!seRow) throw new Error("structured_eval not found")

  console.log("eval_passage.layout_contract.progression_mode (before):", epRow.metadata?.layout_contract?.progression_mode)
  console.log("eval_passage.media_behavior_contract.auto_advance_on_end (before):", epRow.metadata?.media_behavior_contract?.auto_advance_on_end)
  console.log("eval_passage.branding_contract.brand_position (before):", epRow.metadata?.branding_contract?.brand_position)
  console.log("eval_passage.styling_contract.background_mode (before):", epRow.metadata?.styling_contract?.background_mode)
  console.log("\nmeasures_assessment.title (before):", maRow.metadata?.title)
  console.log("measures_assessment.eyebrow (before):", maRow.metadata?.eyebrow)
  console.log("measures_assessment.subtitle (before):", maRow.metadata?.subtitle?.slice(0, 60))
  console.log("measures_assessment.branding_contract.question_card_mark_visible (before):", maRow.metadata?.branding_contract?.question_card_mark_visible)
  console.log("measures_assessment.layout_contract.question_card_alignment (before):", maRow.metadata?.layout_contract?.question_card_alignment)
  console.log("measures_assessment.styling_contract.background_mode (before):", maRow.metadata?.styling_contract?.background_mode)
  console.log("\nstructured_eval.title (before):", seRow.metadata?.title)
  console.log("structured_eval.eyebrow (before):", seRow.metadata?.eyebrow)

  // ── 1. Update eval_passage ───────────────────────────────────────────────
  console.log("\n=== 1. Updating eval_passage ===")

  const updatedEpMeta = {
    ...epRow.metadata,
    layout_contract: {
      ...epRow.metadata.layout_contract,
      progression_mode: "user_controlled",
      source_oar2: SOURCE_OAR2,
    },
    media_behavior_contract: {
      ...epRow.metadata.media_behavior_contract,
      auto_advance_on_end: false,
      progression_contract: "user_controlled_continue",
      source_oar2: SOURCE_OAR2,
    },
    branding_contract: {
      ...epRow.metadata.branding_contract,
      brand_position: "upper_left_governed_frame",
      mark_position: "upper_left",
      mark_treatment: "restrained",
      floating_mark_allowed: false,
      source_oar2: SOURCE_OAR2,
    },
    styling_contract: {
      ...epRow.metadata.styling_contract,
      background_mode: "obsidian_material_field",
      material_texture_visibility: true,
      source_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedEpMeta })
      .eq("encounter_key", "eval_passage"),
    "update eval_passage",
  )
  console.log("  eval_passage updated")

  // ── 2. Update measures_assessment ───────────────────────────────────────
  console.log("\n=== 2. Updating measures_assessment ===")

  const updatedMaMeta = {
    ...maRow.metadata,
    eyebrow: "MEASURES REGISTRY",
    title: "AI Operational Evaluation",
    subtitle: "Answer each prompt to assess whether your current environment can safely support AI acceleration.",
    branding_contract: {
      ...maRow.metadata.branding_contract,
      brand_visible: true,
      registry_mark_visible: true,
      brand_position: "upper_left_governed_frame",
      mark_position: "upper_left",
      mark_treatment: "restrained",
      question_card_mark_visible: false,
      source_oar2: SOURCE_OAR2,
    },
    layout_contract: {
      ...maRow.metadata.layout_contract,
      question_card_alignment: "centered",
      question_card_max_width: "governed",
      question_card_position: "centered_below_header",
      source_oar2: SOURCE_OAR2,
    },
    styling_contract: {
      ...maRow.metadata.styling_contract,
      background_mode: "obsidian_material_field",
      material_texture_visibility: true,
      source_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedMaMeta })
      .eq("encounter_key", "measures_assessment"),
    "update measures_assessment",
  )
  console.log("  measures_assessment updated")

  // ── 3. Update structured_eval ────────────────────────────────────────────
  console.log("\n=== 3. Updating structured_eval ===")

  const updatedSeMeta = {
    ...seRow.metadata,
    eyebrow: "MEASURES REGISTRY",
    title: "AI Operational Evaluation",
    subtitle: "Answer each prompt to assess whether your current environment can safely support AI acceleration.",
    branding_contract: {
      ...seRow.metadata.branding_contract,
      brand_visible: true,
      registry_mark_visible: true,
      brand_position: "upper_left_governed_frame",
      mark_position: "upper_left",
      mark_treatment: "restrained",
      question_card_mark_visible: false,
      source_oar2: SOURCE_OAR2,
    },
    layout_contract: {
      ...seRow.metadata.layout_contract,
      question_card_alignment: "centered",
      question_card_max_width: "governed",
      question_card_position: "centered_below_header",
      source_oar2: SOURCE_OAR2,
    },
    styling_contract: {
      ...seRow.metadata.styling_contract,
      background_mode: "obsidian_material_field",
      material_texture_visibility: true,
      source_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedSeMeta })
      .eq("encounter_key", "structured_eval"),
    "update structured_eval",
  )
  console.log("  structured_eval updated")

  // ── Verify ────────────────────────────────────────────────────────────────
  console.log("\n=== VERIFICATION ===\n")

  const verifyRows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["eval_passage", "measures_assessment", "structured_eval"]),
    "verify rows",
  )

  const vByKey = Object.fromEntries(verifyRows.map((r) => [r.encounter_key, r]))

  const vep = vByKey["eval_passage"]?.metadata
  console.log("eval_passage:")
  console.log("  layout_contract.progression_mode:", vep?.layout_contract?.progression_mode)
  console.log("  media_behavior_contract.auto_advance_on_end:", vep?.media_behavior_contract?.auto_advance_on_end)
  console.log("  branding_contract.brand_position:", vep?.branding_contract?.brand_position)
  console.log("  branding_contract.floating_mark_allowed:", vep?.branding_contract?.floating_mark_allowed)
  console.log("  styling_contract.background_mode:", vep?.styling_contract?.background_mode)
  console.log("  styling_contract.material_texture_visibility:", vep?.styling_contract?.material_texture_visibility)

  const vma = vByKey["measures_assessment"]?.metadata
  console.log("\nmeasures_assessment:")
  console.log("  eyebrow:", vma?.eyebrow)
  console.log("  title:", vma?.title)
  console.log("  subtitle:", vma?.subtitle?.slice(0, 70))
  console.log("  branding_contract.question_card_mark_visible:", vma?.branding_contract?.question_card_mark_visible)
  console.log("  branding_contract.brand_position:", vma?.branding_contract?.brand_position)
  console.log("  layout_contract.question_card_alignment:", vma?.layout_contract?.question_card_alignment)
  console.log("  layout_contract.question_card_position:", vma?.layout_contract?.question_card_position)
  console.log("  styling_contract.background_mode:", vma?.styling_contract?.background_mode)

  const vse = vByKey["structured_eval"]?.metadata
  console.log("\nstructured_eval:")
  console.log("  eyebrow:", vse?.eyebrow)
  console.log("  title:", vse?.title)
  console.log("  branding_contract.question_card_mark_visible:", vse?.branding_contract?.question_card_mark_visible)
  console.log("  layout_contract.question_card_alignment:", vse?.layout_contract?.question_card_alignment)
  console.log("  styling_contract.background_mode:", vse?.styling_contract?.background_mode)

  console.log("\n=== DB UPDATE COMPLETE ===")
  console.log("Rows modified: eval_passage, measures_assessment, structured_eval")
  console.log("Scoring, answer values, questions, routing: NOT modified")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
