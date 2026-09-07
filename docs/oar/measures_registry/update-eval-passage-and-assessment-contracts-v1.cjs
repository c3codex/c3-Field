require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const client = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  // ── PRE-FLIGHT READ ──────────────────────────────────────────────────────

  console.log("=== PRE-FLIGHT READ ===\n")

  const rows = assertOk(
    await client
      .from("measures_encounter_def")
      .select("encounter_key, display_title, metadata")
      .in("encounter_key", ["eval_passage", "measures_assessment", "structured_eval"]),
    "pre-flight read",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  for (const key of ["eval_passage", "measures_assessment", "structured_eval"]) {
    const row = byKey[key]
    console.log(`${key}: ${row ? "found" : "MISSING"}`)
    if (row) {
      console.log(`  layout_contract.layout_mode: ${row.metadata?.layout_contract?.layout_mode ?? "(none)"}`)
      console.log(`  styling_contract.material_family: ${row.metadata?.styling_contract?.material_family ?? "(none)"}`)
    }
  }

  // ── 1. UPDATE eval_passage ────────────────────────────────────────────────

  console.log("\n\n=== UPDATE eval_passage ===\n")

  const epRow = byKey["eval_passage"]
  if (!epRow) throw new Error("eval_passage row not found — aborting")

  const epMeta = epRow.metadata ?? {}

  const updatedEpMeta = {
    ...epMeta,

    // Copy fields — seed informational_paragraph, cta_primary, cta_secondary
    // eyebrow, title, subtitle already seated — preserve
    informational_paragraph:
      "AI instability often develops inside unstructured environments where oversight, connected systems, external tools, and operational decisions are not fully visible or clearly governed. This evaluation identifies whether your current structure can safely support AI acceleration.",
    cta_primary: "Continue to Evaluation",
    cta_secondary: "Audio",

    // Layout contract — update to split-screen passage
    layout_contract: {
      ...epMeta.layout_contract,
      version: "v2",
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      layout_mode: "split_screen_passage",
      viewport_fit: "single_screen",
      media_position: "left",
      information_position: "right",
      cta_placement: "information_panel_below_copy",
      audio_control_placement: "information_panel_secondary_action",
      footer_visibility: "visible",
      branding_visibility: "visible",
      mobile_layout: "media_first_then_information",
    },

    // Branding contract — seat
    branding_contract: {
      version: "v1",
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      brand_visible: true,
      brand_label: "Measures Registry",
      brand_position: "information_panel_top",
      registry_mark_visible: true,
      header_mode: "downstream_governed",
      footer_visible: true,
      inherits_from: "mrssc_v1_branding_contract",
    },

    // Footer contract — seat
    footer_contract: {
      version: "v1",
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      footer_visible: true,
      footer_note: "footer visibility begins at eval_passage",
      inherits_from: "mrssc_v1_footer_contract",
      copy_authority: "codex_governed",
      frontend_hardcode_allowed: false,
    },

    // Media behavior contract — confirm (already seated, patch to ensure completeness)
    media_behavior_contract: {
      ...epMeta.media_behavior_contract,
      autoplay: "deferred_to_renderer",
      mute_state: "muted_on_entry",
      encounter_scoped: true,
      persistence_boundary: "encounter",
      media_roles: "explainer_video",
    },
  }

  assertOk(
    await client
      .from("measures_encounter_def")
      .update({ metadata: updatedEpMeta })
      .eq("encounter_key", "eval_passage"),
    "update eval_passage",
  )
  console.log("eval_passage updated ✓")

  // ── 2. UPDATE measures_assessment ────────────────────────────────────────

  console.log("\n\n=== UPDATE measures_assessment ===\n")

  const maRow = byKey["measures_assessment"]
  if (!maRow) throw new Error("measures_assessment row not found — aborting")

  const maMeta = maRow.metadata ?? {}

  // Seat context_statement on each question
  const QUESTION_CONTEXT_STATEMENTS = {
    ai_output_review_pathway:
      "AI output becomes operational risk when it influences decisions without a documented review path.",
    active_ai_system_visibility:
      "A governable environment must be able to identify which systems, automations, and external surfaces are shaping output.",
    failure_traceability:
      "When failure occurs, accountability depends on knowing what produced the action, who approved it, and what dependencies enabled it.",
    persistent_review_standard:
      "Review cannot depend only on individual judgment or availability; it needs a standing operational standard.",
    safe_ai_acceleration_capacity:
      "AI acceleration is only stable when the surrounding environment can absorb increased speed without increasing drift.",
  }

  const existingQuestions = maMeta.assessment_mechanics?.questions ?? []
  const updatedQuestions = existingQuestions.map((q) => {
    const stmt = QUESTION_CONTEXT_STATEMENTS[q.question_key]
    if (!stmt) {
      console.log(`  WARNING: no context_statement for question_key=${q.question_key}`)
      return q
    }
    return { ...q, context_statement: stmt }
  })

  const updatedMaMeta = {
    ...maMeta,

    // Update styling_contract — merge new fields, preserve existing (scoring contract untouched)
    styling_contract: {
      ...maMeta.styling_contract,
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      surface_mode: "diagnostic_chamber",
      branding_mode: "governed_measures_registry",
      answer_option_style: "refined_operational_rows",
      question_context_visibility: true,
    },

    // Update layout_contract — merge new fields, preserve existing
    layout_contract: {
      ...maMeta.layout_contract,
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      layout_mode: "diagnostic_question_chamber",
      viewport_fit: "single_screen_initial_view",
      card_scale: "compact_governed",
      copy_density: "restrained",
      progress_visibility: true,
      header_redundancy: false,
      brand_mark_position: "chamber_header_or_background_only",
      mobile_layout: "single_column_scroll_allowed",
    },

    // Update questions with context_statement
    assessment_mechanics: {
      ...maMeta.assessment_mechanics,
      questions: updatedQuestions,
    },
  }

  assertOk(
    await client
      .from("measures_encounter_def")
      .update({ metadata: updatedMaMeta })
      .eq("encounter_key", "measures_assessment"),
    "update measures_assessment",
  )
  console.log("measures_assessment updated ✓")
  console.log(`  Questions updated: ${updatedQuestions.length}`)

  // ── 3. UPDATE structured_eval ─────────────────────────────────────────────

  console.log("\n\n=== UPDATE structured_eval ===\n")

  const seRow = byKey["structured_eval"]
  if (!seRow) throw new Error("structured_eval row not found — aborting")

  const seMeta = seRow.metadata ?? {}

  const updatedSeMeta = {
    ...seMeta,

    // Upgrade styling_contract to align with measures_assessment
    styling_contract: {
      ...seMeta.styling_contract,
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      surface_mode: "diagnostic_chamber",
      branding_mode: "governed_measures_registry",
      answer_option_style: "refined_operational_rows",
      question_context_visibility: true,
    },

    // Upgrade layout_contract to v2 parity
    layout_contract: {
      ...seMeta.layout_contract,
      version: "v2",
      source_oar2:
        "docs/oar/measures_registry/oar2_seat_eval_passage_and_assessment_chamber_visual_contracts_v1.meta.md",
      layout_mode: "diagnostic_question_chamber",
      viewport_fit: "single_screen_initial_view",
      card_scale: "compact_governed",
      copy_density: "restrained",
      progress_visibility: true,
      header_redundancy: false,
      brand_mark_position: "chamber_header_or_background_only",
      mobile_layout: "single_column_scroll_allowed",
      scroll_policy: "avoid_initial_copy_scroll_desktop",
      heading_scale: "restrained_evaluation_heading",
      src_capture_layout: "minimal_two_column_identity_grid",
    },
  }

  assertOk(
    await client
      .from("measures_encounter_def")
      .update({ metadata: updatedSeMeta })
      .eq("encounter_key", "structured_eval"),
    "update structured_eval",
  )
  console.log("structured_eval updated ✓")

  // ── POST-SEED VERIFICATION ────────────────────────────────────────────────

  console.log("\n\n=== POST-SEED VERIFICATION ===\n")

  const verifyRows = assertOk(
    await client
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["eval_passage", "measures_assessment", "structured_eval"]),
    "post-seed verification",
  )

  for (const row of verifyRows) {
    const m = row.metadata ?? {}
    console.log(`\n${row.encounter_key}:`)
    console.log(`  layout_contract.layout_mode: ${m.layout_contract?.layout_mode ?? "(none)"}`)
    console.log(`  layout_contract.viewport_fit: ${m.layout_contract?.viewport_fit ?? "(none)"}`)
    console.log(`  styling_contract.material_family: ${m.styling_contract?.material_family ?? "(none)"}`)
    console.log(`  styling_contract.surface_mode: ${m.styling_contract?.surface_mode ?? "(none)"}`)
    if (row.encounter_key === "eval_passage") {
      console.log(`  informational_paragraph: ${m.informational_paragraph ? m.informational_paragraph.slice(0, 60) + "..." : "(none)"}`)
      console.log(`  cta_primary: ${m.cta_primary ?? "(none)"}`)
      console.log(`  branding_contract.brand_visible: ${m.branding_contract?.brand_visible ?? "(none)"}`)
      console.log(`  footer_contract.footer_visible: ${m.footer_contract?.footer_visible ?? "(none)"}`)
    }
    if (row.encounter_key === "measures_assessment") {
      const questions = m.assessment_mechanics?.questions ?? []
      for (const q of questions) {
        console.log(`  Q[${q.question_key}] context_statement: ${q.context_statement ? q.context_statement.slice(0, 50) + "..." : "(MISSING)"}`)
      }
    }
  }

  console.log("\n--- UPDATE COMPLETE ---")
  console.log("Scoring contract, answer values, routing, question order: NOT modified")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
