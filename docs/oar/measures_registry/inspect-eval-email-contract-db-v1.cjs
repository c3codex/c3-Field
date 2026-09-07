require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) throw new Error("Supabase credentials missing")

const reader = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

const TARGET_ENCOUNTERS = [
  "measures_eval_email_contract",
  "measures_assessment",
  "structured_eval",
  "measures_phases_reveal",
  "evaluate_structure_path",
  "eval_passage",
  "structure_passage",
]

const PASSAGE_MEDIA_ROLES = [
  "explainer_video",
  "epigraph_video",
  "left_hero_fracture",
  "right_measured_hero",
  "path_choice_background",
  "structure_passage_video",
  "eval_passage_video",
  "passage_video",
  "structural_passage_video",
  "orientation_video",
  "structured_environment_video",
]

function printSection(title) {
  console.log(`\n${"=".repeat(60)}`)
  console.log(title)
  console.log("=".repeat(60))
}

function printField(label, value) {
  const display = value === null || value === undefined
    ? "(null)"
    : typeof value === "object"
    ? JSON.stringify(value, null, 2)
    : String(value)
  console.log(`${label}: ${display}`)
}

async function main() {
  // --- 1. Read all target encounters ---
  printSection("1. TARGET ENCOUNTERS — measures_encounter_def")

  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, is_active, metadata")
      .in("encounter_key", TARGET_ENCOUNTERS),
    "read target encounters",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  for (const key of TARGET_ENCOUNTERS) {
    const row = byKey[key]
    console.log(`\n--- [${key}] ---`)
    if (!row) {
      console.log("MISSING: row not found in measures_encounter_def")
      continue
    }

    printField("display_title", row.display_title)
    printField("is_active", row.is_active)
    printField("function_layer", row.metadata?.function_layer)
    printField("state_expression", row.metadata?.state_expression)

    const meta = row.metadata ?? {}
    printField("metadata.renderer", meta.renderer)
    printField("metadata.title", meta.title)
    printField("metadata.eyebrow", meta.eyebrow)
    printField("metadata.subtitle", meta.subtitle)
    printField("metadata keys (all)", Object.keys(meta).join(", "))

    // Fields / form fields
    if (meta.fields) printField("metadata.fields", meta.fields)
    if (meta.form_fields) printField("metadata.form_fields", meta.form_fields)
    if (meta.soft_src_fields) printField("metadata.soft_src_fields", meta.soft_src_fields)
    if (meta.delivery_fields) printField("metadata.delivery_fields", meta.delivery_fields)
    if (meta.capture) printField("metadata.capture", meta.capture)

    // Route / actions
    if (meta.route_after_capture) printField("metadata.route_after_capture", meta.route_after_capture)
    if (meta.actions && Array.isArray(meta.actions) && meta.actions.length > 0) {
      console.log("metadata.actions:")
      for (const action of meta.actions) {
        console.log(`  action_key=${action.action_key} behavior=${action.behavior} target=${action.target_encounter_key ?? "(none)"}`)
      }
    } else {
      printField("metadata.actions", "(none)")
    }

    // Email / assessment contract
    if (meta.email_contract) printField("metadata.email_contract", meta.email_contract)
    if (meta.assessment_package) printField("metadata.assessment_package", meta.assessment_package)
    if (meta.result_display) printField("metadata.result_display", meta.result_display)
    if (meta.report_display) printField("metadata.report_display", meta.report_display)
    if (meta.assessment_chamber) printField("metadata.assessment_chamber", meta.assessment_chamber)
    if (meta.assessment_completion) printField("metadata.assessment_completion", meta.assessment_completion)
    if (meta.assessment_mechanics) {
      const mech = meta.assessment_mechanics
      const qCount = Array.isArray(mech?.questions) ? mech.questions.length : "(not array)"
      printField("metadata.assessment_mechanics.questions.length", qCount)
    }
    if (meta.assessment_interpretation) printField("metadata.assessment_interpretation present", true)

    // Media
    if (meta.media_roles) printField("metadata.media_roles", meta.media_roles)
    if (meta.media_contract) printField("metadata.media_contract", meta.media_contract)
    if (meta.media_render_mode) printField("metadata.media_render_mode", meta.media_render_mode)

    // Transition / encounter contract
    if (meta.encounter_contract) printField("metadata.encounter_contract", meta.encounter_contract)
    if (meta.allowed_transitions) printField("metadata.allowed_transitions", meta.allowed_transitions)
    if (meta.transition_contract) printField("metadata.transition_contract", meta.transition_contract)

    // Source / access contract
    if (meta.source_sitewide_contract) printField("metadata.source_sitewide_contract", meta.source_sitewide_contract)
    if (meta.encounter_isolation_contract) printField("metadata.encounter_isolation_contract", meta.encounter_isolation_contract)
    if (meta.access) printField("metadata.access", meta.access)
    if (meta.release) printField("metadata.release", meta.release)

    // Copy
    if (meta.cta_primary) printField("metadata.cta_primary", meta.cta_primary)
    if (meta.cta_secondary) printField("metadata.cta_secondary", meta.cta_secondary)
    if (meta.paragraphs) printField("metadata.paragraphs", meta.paragraphs)
    if (meta.sections) printField("metadata.sections", meta.sections)
  }

  // --- 2. measures_eval_email_contract — deep read ---
  printSection("2. measures_eval_email_contract — FULL METADATA DUMP")

  const emailRow = byKey["measures_eval_email_contract"]
  if (!emailRow) {
    console.log("MISSING: measures_eval_email_contract not in result set")
  } else {
    console.log(JSON.stringify(emailRow.metadata, null, 2))
  }

  // --- 3. measures_assessment — deep read ---
  printSection("3. measures_assessment — FULL METADATA DUMP")

  const assessmentRow = byKey["measures_assessment"]
  if (!assessmentRow) {
    console.log("MISSING: measures_assessment not in result set")
  } else {
    const meta = assessmentRow.metadata ?? {}
    // Print everything except the large assessment_mechanics/interpretation objects
    const summary = { ...meta }
    if (summary.assessment_mechanics) {
      const q = summary.assessment_mechanics
      summary.assessment_mechanics = `[${Array.isArray(q?.questions) ? q.questions.length : "?"} questions — omitted for brevity]`
    }
    if (summary.assessment_interpretation) {
      summary.assessment_interpretation = "[present — omitted for brevity]"
    }
    console.log(JSON.stringify(summary, null, 2))
  }

  // --- 4. structured_eval — deep read ---
  printSection("4. structured_eval — FULL METADATA DUMP")

  const structuredEvalRow = byKey["structured_eval"]
  if (!structuredEvalRow) {
    console.log("MISSING: structured_eval not in result set")
  } else {
    const meta = structuredEvalRow.metadata ?? {}
    const summary = { ...meta }
    if (summary.assessment_mechanics) {
      const q = summary.assessment_mechanics
      summary.assessment_mechanics = `[${Array.isArray(q?.questions) ? q.questions.length : "?"} questions — omitted]`
    }
    if (summary.assessment_interpretation) {
      summary.assessment_interpretation = "[present — omitted]"
    }
    console.log(JSON.stringify(summary, null, 2))
  }

  // --- 5. Transition rules (metadata.actions across all target encounters) ---
  printSection("5. TRANSITION RULES — metadata.actions for all target encounters")

  for (const key of TARGET_ENCOUNTERS) {
    const row = byKey[key]
    if (!row) continue
    const actions = row.metadata?.actions
    if (!Array.isArray(actions) || actions.length === 0) {
      console.log(`\n[${key}]: no actions`)
      continue
    }
    console.log(`\n[${key}]:`)
    for (const action of actions) {
      console.log(`  action_key=${action.action_key ?? "(none)"} | behavior=${action.behavior ?? "(none)"} | target=${action.target_encounter_key ?? "(none)"} | label=${action.label ?? "(none)"}`)
    }
  }

  // --- 6. Media roles — all active roles for campaign ---
  printSection("6. MEDIA ROLES — measures_media_map (all active)")

  const allMedia = assertOk(
    await reader
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .order("media_role"),
    "read all media roles",
  )

  console.log("\n--- All media roles (active first) ---")
  const active = allMedia.filter((m) => m.is_active)
  const held = allMedia.filter((m) => !m.is_active)

  for (const row of active) {
    console.log(`  [active] ${row.media_role} | ${row.mime_type ?? "?"} | ${row.storage_bucket}/${row.storage_path}`)
  }
  for (const row of held) {
    console.log(`  [held]   ${row.media_role} | ${row.mime_type ?? "?"} | ${row.storage_bucket}/${row.storage_path}`)
  }

  // --- 7. Passage-specific media roles ---
  printSection("7. PASSAGE MEDIA ROLES — candidate roles inspected")

  const passageMedia = assertOk(
    await reader
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .in("media_role", PASSAGE_MEDIA_ROLES),
    "read passage media roles",
  )

  if (passageMedia.length === 0) {
    console.log("None of the candidate passage media roles found in DB")
  } else {
    for (const row of passageMedia) {
      const status = row.is_active ? "[active]" : "[held] "
      console.log(`  ${status} ${row.media_role} | ${row.mime_type ?? "?"} | ${row.storage_path}`)
    }
  }

  console.log("\n--- INSPECTION COMPLETE ---")
  console.log("No DB rows modified. No source files modified. Read-only.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
