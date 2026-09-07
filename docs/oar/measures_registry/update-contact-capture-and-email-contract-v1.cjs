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
  "docs/oar/measures_registry/oar2_seat_contact_capture_and_hide_internal_eval_email_contract_v1.meta.md"

async function main() {
  // ── 1. Read all target rows before mutation ──────────────────────────────

  console.log("=== PRE-FLIGHT READ ===\n")

  const rows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["connect_src", "measures_eval_email_contract", "structured_eval"]),
    "read target rows",
  )

  const byKey = Object.fromEntries(rows.map((r) => [r.encounter_key, r]))

  const connectRow = byKey["connect_src"]
  if (!connectRow) throw new Error("connect_src not found")
  console.log(`connect_src.route_after_capture (before): ${connectRow.metadata?.route_after_capture}`)
  console.log(`connect_src.public_encounter (before): ${connectRow.metadata?.public_encounter}`)
  console.log(`connect_src.layout_contract.layout_mode (before): ${connectRow.metadata?.layout_contract?.layout_mode}`)

  const emailRow = byKey["measures_eval_email_contract"]
  if (!emailRow) throw new Error("measures_eval_email_contract not found")
  console.log(`\nmeasures_eval_email_contract.public_encounter (before): ${emailRow.metadata?.public_encounter}`)
  console.log(`measures_eval_email_contract.internal_only (before): ${emailRow.metadata?.internal_only}`)
  console.log(`measures_eval_email_contract.state_expression (before): ${emailRow.metadata?.state_expression}`)
  console.log(`measures_eval_email_contract.transition_contract.route_expectation (before): ${emailRow.metadata?.transition_contract?.route_expectation}`)

  const structuredRow = byKey["structured_eval"]
  if (!structuredRow) throw new Error("structured_eval not found")
  console.log(`\nstructured_eval.transition_contract.route_expectation (before): ${structuredRow.metadata?.transition_contract?.route_expectation}`)

  // ── 2. Update connect_src ────────────────────────────────────────────────

  console.log("\n=== 1. Updating connect_src ===")

  const updatedConnectMeta = {
    ...connectRow.metadata,
    public_encounter: true,
    route_after_capture: "measures_phases_reveal",
    internal_contract_refs: {
      email_package_contract: "measures_eval_email_contract",
    },
    layout_contract: {
      ...connectRow.metadata.layout_contract,
      layout_mode: "compact_partial_src_capture",
      footer_visibility: "visible",
      branding_visibility: "visible",
      copy_position: "top",
      form_position: "contained_panel",
      cta_placement: "below_form",
      mobile_layout: "single_column_scroll_allowed",
      source_oar2: SOURCE_OAR2,
    },
    styling_contract: {
      ...connectRow.metadata.styling_contract,
      surface_mode: "partial_src_contact_capture",
      form_style: "governed_identity_capture",
      copy_density: "restrained",
      answer_option_style: "not_applicable",
      source_oar2: SOURCE_OAR2,
    },
    branding_contract: {
      ...connectRow.metadata.branding_contract,
      brand_visible: true,
      brand_label: "Measures Registry",
      header_mode: "downstream_governed",
      registry_mark_visible: true,
      source_oar2: SOURCE_OAR2,
    },
    footer_contract: {
      footer_visible: true,
      source_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedConnectMeta })
      .eq("encounter_key", "connect_src"),
    "update connect_src",
  )
  console.log("  connect_src updated")

  // ── 3. Update measures_eval_email_contract ───────────────────────────────

  console.log("\n=== 2. Updating measures_eval_email_contract ===")

  const updatedEmailMeta = {
    ...emailRow.metadata,
    public_encounter: false,
    internal_only: true,
    contract_role: "email_package_delivery_contract",
    encountered_in_public_flow: false,
    state_expression: "internal_registered_contract",
    renderer_purpose: {
      ...emailRow.metadata.renderer_purpose,
      purpose: "assessment_delivery_email_contract",
      routes_toward: "internal_only",
      public_route: false,
      note: "registered email package contract — not a public forward-flow surface",
      source_oar2: SOURCE_OAR2,
    },
    transition_contract: {
      ...emailRow.metadata.transition_contract,
      route_expectation: "internal — connect_src references as email package contract; not in public forward route",
      public_forward_route: false,
      source_oar2: SOURCE_OAR2,
    },
    // Preserve all email_delivery_contract fields unchanged
    email_delivery_contract: emailRow.metadata.email_delivery_contract,
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedEmailMeta })
      .eq("encounter_key", "measures_eval_email_contract"),
    "update measures_eval_email_contract",
  )
  console.log("  measures_eval_email_contract updated")

  // ── 4. Update structured_eval route_expectation ──────────────────────────

  console.log("\n=== 3. Updating structured_eval transition_contract ===")

  const updatedStructuredMeta = {
    ...structuredRow.metadata,
    transition_contract: {
      ...structuredRow.metadata.transition_contract,
      route_expectation: "structured_eval -> connect_src -> measures_phases_reveal",
      route_note:
        "structured_eval and measures_assessment both converge at connect_src after final question; connect_src routes directly to measures_phases_reveal; measures_eval_email_contract is internal-only",
      source_oar2: SOURCE_OAR2,
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedStructuredMeta })
      .eq("encounter_key", "structured_eval"),
    "update structured_eval",
  )
  console.log("  structured_eval updated")

  // ── 5. Verify ────────────────────────────────────────────────────────────

  console.log("\n=== VERIFICATION ===\n")

  const verifyRows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .in("encounter_key", ["connect_src", "measures_eval_email_contract", "structured_eval"]),
    "verify rows",
  )

  const verifyByKey = Object.fromEntries(verifyRows.map((r) => [r.encounter_key, r]))

  const vc = verifyByKey["connect_src"]?.metadata
  console.log("connect_src:")
  console.log(`  route_after_capture: ${vc?.route_after_capture}`)
  console.log(`  public_encounter: ${vc?.public_encounter}`)
  console.log(`  layout_contract.layout_mode: ${vc?.layout_contract?.layout_mode}`)
  console.log(`  footer_contract.footer_visible: ${vc?.footer_contract?.footer_visible}`)
  console.log(`  internal_contract_refs: ${JSON.stringify(vc?.internal_contract_refs)}`)
  console.log(`  styling_contract.surface_mode: ${vc?.styling_contract?.surface_mode}`)

  const ve = verifyByKey["measures_eval_email_contract"]?.metadata
  console.log("\nmeasures_eval_email_contract:")
  console.log(`  public_encounter: ${ve?.public_encounter}`)
  console.log(`  internal_only: ${ve?.internal_only}`)
  console.log(`  contract_role: ${ve?.contract_role}`)
  console.log(`  encountered_in_public_flow: ${ve?.encountered_in_public_flow}`)
  console.log(`  state_expression: ${ve?.state_expression}`)
  console.log(`  transition_contract.route_expectation: ${ve?.transition_contract?.route_expectation}`)
  console.log(`  email_delivery_contract.dispatch_implementation: ${ve?.email_delivery_contract?.dispatch_implementation}`)
  console.log(`  email_delivery_contract.contract_type: ${ve?.email_delivery_contract?.contract_type}`)

  const vs = verifyByKey["structured_eval"]?.metadata
  console.log("\nstructured_eval:")
  console.log(`  transition_contract.route_expectation: ${vs?.transition_contract?.route_expectation}`)

  console.log("\n=== DB UPDATE COMPLETE ===")
  console.log("Rows modified: connect_src, measures_eval_email_contract, structured_eval")
  console.log("No tables created. No rows deleted. Email contract remains registered.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
