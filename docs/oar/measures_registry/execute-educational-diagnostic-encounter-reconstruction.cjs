require("dotenv").config({ path: ".env" })

const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, supabaseKey)
const encounterKey = "educate_eval_encounter"
const source = "educational_diagnostic_encounter_reconstruction_v1"

const metadataPatch = {
  function_layer: "education_diagnostic",
  state_expression: "public_educational_diagnostic_threshold",
  renderer: "diagnostic_explainer_resource_evaluation_entry",
  eyebrow: "Educational Diagnostic",
  title: "Evaluate the environment before the system scales further.",
  subtitle:
    "A structured recognition threshold for institutions experiencing unstable, ambiguous, or unverifiable AI behavior.",
  media_roles: ["explainer_video"],
  diagnostic_text:
    "When AI behavior cannot be explained, repeated, or governed, the failure is usually environmental. The diagnostic threshold identifies where authority, validation, implementation structure, and oversight are absent before an institution moves toward conversion or scale.",
  educational_resources: [
    {
      type: "Diagnostic explainer",
      title: "Instability is an environment signal.",
      body:
        "Unstable outputs often reveal missing validation paths, unclear authority, or systems asked to propagate beyond their governed structure.",
    },
    {
      type: "Governance primer",
      title: "Authority must precede automation.",
      body:
        "An AI system cannot be governed when no institutional role owns truth, routing, review, and deployment boundaries.",
    },
    {
      type: "Institutional writeup",
      title: "Evaluation before conversion.",
      body:
        "The evaluation intake is diagnostic and non-exhaustive. It records system context, witnessed ambiguity, implementation gaps, and governance absence indicators.",
    },
  ],
  evaluation_entry: {
    title: "Begin the institutional AI environment review.",
    body:
      "The intake records organization and contact identity, AI usage scope, deployment duration, system structure condition, witnessed instability, implementation gaps, and governance absence indicators.",
    signals: [
      "AI usage scope",
      "Deployment duration",
      "Website or system structure condition",
      "Witnessed instability or ambiguity",
      "Implementation gaps",
      "Governance absence indicators",
    ],
  },
  sections: [
    {
      title: "Purpose",
      body:
        "The evaluation is educational and diagnostic. It is not SRC, not c3 key assignment, not wallet connection, and not conversion binding.",
    },
    {
      title: "What it surfaces",
      body:
        "Structural drift, missing implementation layers, governance absence, frontend invention risk, uncontrolled AI deployment, and traceability gaps.",
    },
  ],
  actions: [
    {
      action_key: "begin_evaluation",
      label: "Begin Evaluation",
      behavior: "route_surface",
      target_encounter_key: "iis_eval_gate1",
    },
    {
      action_key: "back_landing_root",
      label: "Back",
      behavior: "route_surface",
      target_encounter_key: "landing_root",
    },
  ],
  source_educational_diagnostic_reconstruction: source,
}

async function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function main() {
  await assertOk(await supabase.from("measures_registry").select("id").limit(1), "DB connection failed")

  const [encounter] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("id, encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "educate_eval_encounter lookup failed",
  )

  if (!encounter) throw new Error("educate_eval_encounter missing")

  await assertOk(
    await supabase
      .from("measures_encounter_def")
      .update({ metadata: { ...(encounter.metadata ?? {}), ...metadataPatch } })
      .eq("id", encounter.id),
    "educate_eval_encounter update failed",
  )

  const [row] = await assertOk(
    await supabase
      .from("measures_encounter_def")
      .select("encounter_key, metadata")
      .eq("encounter_key", encounterKey)
      .limit(1),
    "educate_eval_encounter validation failed",
  )

  const mediaRows = await assertOk(
    await supabase
      .from("measures_media_map")
      .select("media_role, storage_bucket, storage_path, mime_type, is_active")
      .eq("campaign_key", "agents_of_chaos_integrity_governance")
      .eq("media_role", "explainer_video")
      .eq("is_active", true),
    "explainer_video validation failed",
  )

  console.log(JSON.stringify({
    dbConnection: "active",
    encounterKey,
    renderer: row.metadata?.renderer ?? null,
    diagnosticTextSeated: Boolean(row.metadata?.diagnostic_text),
    educationalResourceCount: row.metadata?.educational_resources?.length ?? 0,
    evaluationEntrySeated: Boolean(row.metadata?.evaluation_entry),
    beginEvaluationAction: row.metadata?.actions?.some((action) => action.action_key === "begin_evaluation") ?? false,
    explainerVideoRows: mediaRows,
  }, null, 2))
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
