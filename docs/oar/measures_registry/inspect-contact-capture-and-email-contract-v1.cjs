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
  console.log(`\n${"=".repeat(64)}`)
  console.log(title)
  console.log("=".repeat(64))
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

const TARGET_KEYS = ["connect_src", "measures_eval_email_contract", "measures_phases_reveal", "structured_eval"]

async function main() {
  printSection("1. ENCOUNTER ROWS — measures_encounter_def")

  const rows = assertOk(
    await reader
      .from("measures_encounter_def")
      .select("encounter_key, display_title, is_active, metadata")
      .in("encounter_key", TARGET_KEYS),
    "read target encounters",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  for (const key of TARGET_KEYS) {
    const row = byKey[key]
    console.log(`\n--- [${key}] ---`)
    if (!row) {
      console.log("MISSING: not found in measures_encounter_def")
      continue
    }
    printField("display_title", row.display_title)
    printField("is_active", row.is_active)
    const meta = row.metadata ?? {}
    printField("function_layer", meta.function_layer)
    printField("renderer", meta.renderer)
    printField("title", meta.title)
    printField("eyebrow", meta.eyebrow)
    printField("subtitle", meta.subtitle)
    printField("cta_primary", meta.cta_primary)
    printField("standing", meta.standing)
    printField("public_encounter", meta.public_encounter)
    printField("internal_only", meta.internal_only)
    printField("contract_role", meta.contract_role)
    printField("encountered_in_public_flow", meta.encountered_in_public_flow)
    printField("route_after_capture", meta.route_after_capture)
    printField("internal_contract_refs", meta.internal_contract_refs)
    printField("email_contract", meta.email_contract)
    printField("soft_src_fields", meta.soft_src_fields)
    printField("layout_contract", meta.layout_contract)
    printField("styling_contract", meta.styling_contract)
    printField("branding_contract", meta.branding_contract)
    printField("footer_contract", meta.footer_contract)
    printField("encounter_isolation_contract", meta.encounter_isolation_contract)
    printField("source_sitewide_contract", meta.source_sitewide_contract)
    if (meta.transition_contract) printField("transition_contract", meta.transition_contract)
    if (meta.email_delivery_contract) printField("email_delivery_contract", meta.email_delivery_contract)
  }

  printSection("2. measures_eval_email_contract — FULL METADATA DUMP")

  const emailRow = byKey["measures_eval_email_contract"]
  if (!emailRow) {
    console.log("MISSING: measures_eval_email_contract not found")
  } else {
    console.log(JSON.stringify(emailRow.metadata, null, 2))
  }

  printSection("3. connect_src — FULL METADATA DUMP")

  const connectRow = byKey["connect_src"]
  if (!connectRow) {
    console.log("MISSING: connect_src not found")
  } else {
    console.log(JSON.stringify(connectRow.metadata, null, 2))
  }

  console.log("\n--- INSPECTION COMPLETE (read-only) ---")
  console.log("No rows modified.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
