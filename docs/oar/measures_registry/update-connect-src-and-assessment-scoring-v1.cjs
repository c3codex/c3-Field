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

const SCORING_THRESHOLDS = [
  {
    min: 0,
    max: 20,
    standing_key: "coherence_maintained",
    standing: "Coherence Maintained",
    assessment_result: "Coherence Maintained",
    operational_exposure_summary:
      "Current AI operational environment demonstrates coherent structure. Governance, review pathways, and system visibility appear established.",
    recommended_structured_action:
      "Maintain current governance practices. Formal registration documents and preserves operational coherence as AI use scales.",
    continuation_pathway: "Measures Registry structural documentation pathway",
  },
  {
    min: 21,
    max: 45,
    standing_key: "emerging_drift",
    standing: "Emerging Drift",
    assessment_result: "Emerging Drift",
    operational_exposure_summary:
      "Some review pathways or operational boundaries are unclear. AI use is expanding without consistent governance structure across all operational areas.",
    recommended_structured_action:
      "Formalize review pathways before expanding AI use. Coherence requires deliberate structural effort, not individual judgment.",
    continuation_pathway: "Measures Registry structured governance pathway",
  },
  {
    min: 46,
    max: 70,
    standing_key: "structural_drift_detected",
    standing: "Structural Drift Detected",
    assessment_result: "Structural Drift Detected",
    operational_exposure_summary:
      "AI use is outpacing governance, review, and traceability across multiple operational dimensions.",
    recommended_structured_action:
      "Operational coherence requires active structural correction. Measures Registry provides the environment needed to stabilize AI use before acceleration compounds the gap.",
    continuation_pathway: "Measures Registry structured governance pathway",
  },
  {
    min: 71,
    max: 100,
    standing_key: "critical_drift_exposure",
    standing: "Critical Drift Exposure",
    assessment_result: "Critical Drift Exposure",
    operational_exposure_summary:
      "Operational risk is significant. AI is operating within fragmented, ungoverned, or untraceable environments across multiple dimensions.",
    recommended_structured_action:
      "Structured response is recommended now. Continued AI acceleration without operational coherence compounds risk at every deployment cycle.",
    continuation_pathway: "Measures Registry structured governance — immediate response pathway",
  },
]

async function main() {
  // === 1. Update connect_src metadata ===
  console.log("=== 1. Updating connect_src metadata ===")

  const connectRows = assertOk(
    await writer.from("measures_encounter_def").select("encounter_key, metadata").eq("encounter_key", "connect_src"),
    "read connect_src",
  )
  const connectRow = connectRows[0]
  if (!connectRow) throw new Error("connect_src not found")

  const updatedConnectMeta = {
    ...connectRow.metadata,
    title: "Your Assessment is Being Prepared",
    eyebrow: "Assessment Package Delivery",
    subtitle:
      "Enter the contact information where the completed assessment package and recommended structural response should be sent.",
    cta_primary: "Continue",
    function_layer: "intake",
    standing: "partial_src_contact_capture",
    standing_note:
      "partial SRC contact capture — captures contact info after evaluation questions for assessment package delivery. Not a pre-assessment gate.",
    route_after_capture: "measures_eval_email_contract",
    constraints: {
      ...(connectRow.metadata?.constraints ?? {}),
      read_only: false,
    },
    source_oar2: "docs/oar/measures_registry/oar2_seat_partial_src_contact_capture_and_assessment_scoring_contract_v1.meta.md",
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedConnectMeta })
      .eq("encounter_key", "connect_src"),
    "update connect_src",
  )
  console.log("  connect_src metadata updated")

  // === 2. Add scoring_thresholds to measures_assessment.metadata.assessment_interpretation ===
  console.log("\n=== 2. Seating scoring_thresholds on measures_assessment ===")

  const assessRows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "measures_assessment"),
    "read measures_assessment",
  )
  const assessRow = assessRows[0]
  if (!assessRow) throw new Error("measures_assessment not found")

  const updatedAssessInterpretation = {
    ...(assessRow.metadata?.assessment_interpretation ?? {}),
    scoring_thresholds: SCORING_THRESHOLDS,
    scoring_method: "condition_tag_count_percentage",
    scoring_source_oar2:
      "docs/oar/measures_registry/oar2_seat_partial_src_contact_capture_and_assessment_scoring_contract_v1.meta.md",
  }

  const updatedAssessMeta = {
    ...assessRow.metadata,
    assessment_interpretation: updatedAssessInterpretation,
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedAssessMeta })
      .eq("encounter_key", "measures_assessment"),
    "update measures_assessment",
  )
  console.log("  measures_assessment scoring_thresholds seated")

  // === 3. Update structured_eval transition_contract route_expectation ===
  console.log("\n=== 3. Updating structured_eval transition_contract ===")

  const structuredRows = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "structured_eval"),
    "read structured_eval",
  )
  const structuredRow = structuredRows[0]
  if (!structuredRow) throw new Error("structured_eval not found")

  const updatedStructuredMeta = {
    ...structuredRow.metadata,
    transition_contract: {
      ...(structuredRow.metadata?.transition_contract ?? {}),
      route_expectation: "structured_eval -> connect_src -> measures_eval_email_contract -> measures_phases_reveal",
      route_note:
        "structured_eval shares contact capture and email contract with measures_assessment path — both converge at connect_src after final question",
    },
  }

  assertOk(
    await writer
      .from("measures_encounter_def")
      .update({ metadata: updatedStructuredMeta })
      .eq("encounter_key", "structured_eval"),
    "update structured_eval",
  )
  console.log("  structured_eval transition_contract updated")

  // === Verify ===
  console.log("\n=== VERIFY ===")

  const verifyConnect = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "connect_src"),
    "verify connect_src",
  )
  console.log(`connect_src title: ${verifyConnect[0]?.metadata?.title}`)
  console.log(`connect_src function_layer: ${verifyConnect[0]?.metadata?.function_layer}`)
  console.log(`connect_src route_after_capture: ${verifyConnect[0]?.metadata?.route_after_capture}`)
  console.log(`connect_src standing: ${verifyConnect[0]?.metadata?.standing}`)

  const verifyAssess = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "measures_assessment"),
    "verify measures_assessment",
  )
  const thresholds = verifyAssess[0]?.metadata?.assessment_interpretation?.scoring_thresholds
  console.log(`measures_assessment scoring_thresholds count: ${Array.isArray(thresholds) ? thresholds.length : "MISSING"}`)
  if (Array.isArray(thresholds)) {
    for (const t of thresholds) {
      console.log(`  ${t.min}–${t.max}%: ${t.assessment_result}`)
    }
  }

  const verifyStructured = assertOk(
    await writer
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", "structured_eval"),
    "verify structured_eval",
  )
  console.log(`structured_eval route_expectation: ${verifyStructured[0]?.metadata?.transition_contract?.route_expectation}`)

  console.log("\n=== DB UPDATE COMPLETE ===")
  console.log("Rows modified: connect_src, measures_assessment, structured_eval")
  console.log("No tables created. No rows deleted.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
