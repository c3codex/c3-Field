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

function printSection(title) {
  console.log(`\n${"=".repeat(70)}`)
  console.log(title)
  console.log("=".repeat(70))
}

function printField(label, value) {
  const display =
    value === null || value === undefined
      ? "(null)"
      : typeof value === "object"
        ? JSON.stringify(value, null, 2)
        : String(value)
  console.log(`${label}: ${display}`)
}

const TARGET_ENCOUNTERS = [
  "eval_passage",
  "structure_passage",
  "measures_assessment",
  "structured_eval",
  "connect_src",
  "measures_eval_email_contract",
  "measures_phases_reveal",
  "about_measures_registry",
  "structural_drift_publication",
  "reserve_seat",
  "phase_payment",
]

const CONTRACT_FIELDS = [
  "renderer",
  "layout_contract",
  "styling_contract",
  "media_behavior_contract",
  "branding_contract",
  "source_sitewide_contract",
  "encounter_isolation_contract",
  "material_family",
  "material_tone",
  "viewport_fit",
  "surface_mode",
  "cta_placement",
  "media_roles",
  "contract_status",
  "transition_contract",
]

async function main() {
  // ── 1. Sitewide style contract — concordance_document ─────────────────────
  printSection("1. SITEWIDE STYLE CONTRACT — concordance_document")

  const docRows = assertOk(
    await reader
      .from("concordance_document")
      .select("document_key, title, document_scope, authority_standing, visibility_standing, metadata")
      .eq("document_key", "measures_registry_sitewide_style_contract"),
    "concordance_document sitewide",
  )

  if (!docRows.length) {
    console.log("MISSING: measures_registry_sitewide_style_contract not in concordance_document")
  } else {
    const doc = docRows[0]
    printField("document_key", doc.document_key)
    printField("title", doc.title)
    printField("document_scope", doc.document_scope)
    printField("authority_standing", doc.authority_standing)
    printField("visibility_standing", doc.visibility_standing)
    printField("metadata.document_type", doc.metadata?.document_type)
    printField("metadata.authority_level", doc.metadata?.authority_level)
    printField("metadata.status", doc.metadata?.status)
    printField("metadata.implementation_order", doc.metadata?.implementation_order)
  }

  // ── 2. Sitewide style contract — concordance_version ──────────────────────
  printSection("2. SITEWIDE STYLE CONTRACT — concordance_version")

  const versionRows = assertOk(
    await reader
      .from("concordance_version")
      .select("version_key, document_key, version_label, version_standing, visibility_standing, metadata")
      .eq("version_key", "measures_registry_sitewide_style_contract_v1"),
    "concordance_version sitewide",
  )

  if (!versionRows.length) {
    console.log("MISSING: measures_registry_sitewide_style_contract_v1 not in concordance_version")
  } else {
    const ver = versionRows[0]
    printField("version_key", ver.version_key)
    printField("version_standing", ver.version_standing)
    printField("visibility_standing", ver.visibility_standing)
    printField("metadata.status", ver.metadata?.status)
  }

  // ── 3. Sitewide style contract — all concordance_relation rows ─────────────
  printSection("3. SITEWIDE STYLE CONTRACT — concordance_relation (all 11)")

  const relRows = assertOk(
    await reader
      .from("concordance_relation")
      .select("relation_key, relation_label, relation_standing, metadata")
      .eq("version_key", "measures_registry_sitewide_style_contract_v1")
      .order("relation_key"),
    "concordance_relation sitewide",
  )

  console.log(`\nTotal relations found: ${relRows.length} (expected 11)\n`)
  for (const rel of relRows) {
    console.log(`--- [${rel.relation_key}] ---`)
    printField("  relation_label", rel.relation_label)
    printField("  relation_standing", rel.relation_standing)
    printField("  contract_domain", rel.metadata?.contract_domain)
    const governs = rel.metadata?.governs
    if (Array.isArray(governs)) {
      console.log(`  governs: [${governs.join(", ")}]`)
    }
    const auditFinding = rel.metadata?.audit_finding
    if (auditFinding) {
      console.log(`  audit_finding: ${auditFinding}`)
    }
    console.log("")
  }

  // ── 4. Target encounters — measures_encounter_def ─────────────────────────
  printSection("4. TARGET ENCOUNTERS — measures_encounter_def")

  const encounterRows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, is_active, metadata")
      .in("encounter_key", TARGET_ENCOUNTERS),
    "read target encounters",
  )

  const byKey = Object.fromEntries(encounterRows.map((r) => [r.encounter_key, r]))

  for (const key of TARGET_ENCOUNTERS) {
    const row = byKey[key]
    console.log(`\n${"─".repeat(60)}`)
    console.log(`[${key}]`)
    if (!row) {
      console.log("MISSING: row not found in measures_encounter_def")
      continue
    }

    printField("display_title", row.display_title)
    printField("is_active", row.is_active)
    printField("function_layer", row.metadata?.function_layer)
    printField("state_expression", row.metadata?.state_expression)

    const meta = row.metadata ?? {}
    console.log(`\nmetadata keys: ${Object.keys(meta).join(", ")}`)

    for (const field of CONTRACT_FIELDS) {
      const val = meta[field]
      if (val !== undefined && val !== null) {
        printField(`metadata.${field}`, val)
      } else {
        console.log(`metadata.${field}: (absent)`)
      }
    }
  }

  // ── 5. eval_passage — full metadata dump ──────────────────────────────────
  printSection("5. eval_passage — FULL METADATA DUMP")
  const evalPassageRow = byKey["eval_passage"]
  if (!evalPassageRow) {
    console.log("MISSING")
  } else {
    console.log(JSON.stringify(evalPassageRow.metadata, null, 2))
  }

  // ── 6. connect_src — full metadata dump ───────────────────────────────────
  printSection("6. connect_src — FULL METADATA DUMP")
  const connectSrcRow = byKey["connect_src"]
  if (!connectSrcRow) {
    console.log("MISSING")
  } else {
    console.log(JSON.stringify(connectSrcRow.metadata, null, 2))
  }

  // ── 7. measures_eval_email_contract — full metadata dump ──────────────────
  printSection("7. measures_eval_email_contract — FULL METADATA DUMP")
  const emailRow = byKey["measures_eval_email_contract"]
  if (!emailRow) {
    console.log("MISSING")
  } else {
    console.log(JSON.stringify(emailRow.metadata, null, 2))
  }

  // ── 8. measures_phases_reveal — full metadata dump ────────────────────────
  printSection("8. measures_phases_reveal — FULL METADATA DUMP")
  const phaseRevealRow = byKey["measures_phases_reveal"]
  if (!phaseRevealRow) {
    console.log("MISSING")
  } else {
    console.log(JSON.stringify(phaseRevealRow.metadata, null, 2))
  }

  // ── 9. measures_assessment — contract fields only (no question dump) ───────
  printSection("9. measures_assessment — CONTRACT FIELDS ONLY")
  const assessmentRow = byKey["measures_assessment"]
  if (!assessmentRow) {
    console.log("MISSING")
  } else {
    const meta = assessmentRow.metadata ?? {}
    for (const field of CONTRACT_FIELDS) {
      const val = meta[field]
      if (val !== undefined && val !== null) {
        printField(`metadata.${field}`, val)
      } else {
        console.log(`metadata.${field}: (absent)`)
      }
    }
  }

  // ── 10. structured_eval — contract fields only ────────────────────────────
  printSection("10. structured_eval — CONTRACT FIELDS ONLY")
  const structuredEvalRow = byKey["structured_eval"]
  if (!structuredEvalRow) {
    console.log("MISSING")
  } else {
    const meta = structuredEvalRow.metadata ?? {}
    for (const field of CONTRACT_FIELDS) {
      const val = meta[field]
      if (val !== undefined && val !== null) {
        printField(`metadata.${field}`, val)
      } else {
        console.log(`metadata.${field}: (absent)`)
      }
    }
  }

  console.log("\n\n--- INSPECTION COMPLETE ---")
  console.log("No DB rows modified. No source files modified. Read-only.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
