require("dotenv").config({ path: ".env", quiet: true })
require("dotenv").config({ path: ".env.inanna", override: false, quiet: true })
require("dotenv").config({ path: ".env.local", override: false, quiet: true })

const fs = require("node:fs")
const path = require("node:path")
const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const writeKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || writeKey

if (!supabaseUrl || !writeKey) {
  throw new Error("Supabase credentials missing")
}

const writer = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const reader = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const sourceOar2 = "docs/oar/measures_registry/oar2_assessment_branding_evaluation_surface_identity_refinement_v1.meta.md"
const manifestPath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "deterministic_environmental_standing_report_routing_v1.json",
)
const evidencePath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "deterministic_environmental_standing_report_routing_v1_evidence.json",
)

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function validateInterpretation(interpretation) {
  if (!interpretation || interpretation.version !== "v1") {
    throw new Error("assessment_interpretation v1 is required")
  }
  if (!Array.isArray(interpretation.standing_rules) || interpretation.standing_rules.length === 0) {
    throw new Error("standing_rules are required")
  }
  if (!interpretation.report_templates || typeof interpretation.report_templates !== "object") {
    throw new Error("report_templates are required")
  }
  if (!interpretation.email_artifact_template || typeof interpretation.email_artifact_template !== "object") {
    throw new Error("email_artifact_template is required")
  }

  for (const rule of interpretation.standing_rules) {
    if (!rule.rule_key || !rule.standing_key || !rule.standing) {
      throw new Error("Each standing rule requires rule_key, standing_key, and standing")
    }
    if (!interpretation.report_templates[rule.standing_key]) {
      throw new Error(`Missing report template for ${rule.standing_key}`)
    }
  }
}

async function readAssessment(client, label) {
  const row = assertOk(
    await client
      .from("measures_encounter_def")
      .select("id, encounter_key, display_title, metadata")
      .eq("encounter_key", "iis_eval_gate1")
      .maybeSingle(),
    `${label} assessment lookup`,
  )

  if (!row) throw new Error("measures_encounter_def row missing for iis_eval_gate1")
  return row
}

async function readRecentCaptures(client, label) {
  const rows = assertOk(
    await client
      .from("measures_iis_eval_gate1_capture")
      .select("id, evaluation_answers, eligibility, metadata, capture_context, created_at")
      .eq("capture_context", "iis_eval_gate1")
      .order("created_at", { ascending: false })
      .limit(3),
    `${label} capture readback`,
  )

  return rows ?? []
}

function patchMetadata(metadata, interpretation) {
  const next = clone(metadata)
  const labels = interpretation.report_labels ?? {}
  const processTitle = labels.process_title ?? "MEASURES AI OPERATIONAL EVALUATION"
  const assessmentTitle = labels.assessment_title ?? "MEASURES AI ENVIRONMENT ASSESSMENT"
  const processSubtitle =
    "AI reflects the structure of the environment it operates within. Structure enables acceleration. Ambiguity creates drift."

  next.title = processTitle
  next.subtitle = processSubtitle
  next.assessment_chamber = {
    ...(next.assessment_chamber && typeof next.assessment_chamber === "object" ? next.assessment_chamber : {}),
    title: processTitle,
    body: processSubtitle,
    source_oar2: sourceOar2,
  }
  next.assessment_completion = {
    ...(next.assessment_completion && typeof next.assessment_completion === "object" ? next.assessment_completion : {}),
    title: assessmentTitle,
    assessment_result: labels.assessment_result ?? "Structural Drift Detected",
    source_oar2: sourceOar2,
  }
  next.assessment_interpretation = {
    ...interpretation,
    source_oar2: sourceOar2,
    content_authority: "measures_encounter_def.metadata",
    frontend_hardcode_allowed: false,
    deterministic: true,
    no_legal_or_certification_claims: true,
  }
  next.source = sourceOar2
  return next
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  const interpretation = manifest.assessment_interpretation
  validateInterpretation(interpretation)

  const before = await readAssessment(writer, "Before")
  const metadata = patchMetadata(before.metadata, interpretation)
  const updated = assertOk(
    await writer
      .from("measures_encounter_def")
      .update({
        display_title: interpretation.report_labels?.process_title ?? "MEASURES AI OPERATIONAL EVALUATION",
        metadata,
        is_active: true,
      })
      .eq("id", before.id)
      .select("encounter_key, display_title, metadata")
      .single(),
    "assessment interpretation update",
  )
  const runtimeRead = await readAssessment(reader, "Runtime")
  const recentCaptures = await readRecentCaptures(writer, "Writer")

  const runtimeInterpretation = runtimeRead.metadata?.assessment_interpretation ?? {}
  const standingRules = runtimeInterpretation.standing_rules ?? []
  const reportTemplates = runtimeInterpretation.report_templates ?? {}
  const standingKeys = standingRules.map((rule) => rule.standing_key)
  const missingTemplates = standingKeys.filter((key) => !reportTemplates[key])

  if (standingRules.length !== interpretation.standing_rules.length || missingTemplates.length > 0) {
    throw new Error(`Runtime interpretation readback incomplete: missing templates ${missingTemplates.join(", ")}`)
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    mutationPerformed: true,
    encounterKey: updated.encounter_key,
    interpretationVersion: runtimeInterpretation.version,
    standingRuleCount: standingRules.length,
    standingKeys,
    emailArtifactTemplatePresent: Boolean(runtimeInterpretation.email_artifact_template),
    recentCaptureReadback: recentCaptures.map((row) => ({
      id: row.id,
      evaluation_answer_keys: row.evaluation_answers ? Object.keys(row.evaluation_answers) : [],
      environmental_standing:
        row.metadata?.environmental_standing_report?.environmental_standing ?? null,
      assessment_result:
        row.metadata?.environmental_standing_report?.assessment_result ?? null,
      findings:
        row.metadata?.environmental_standing_report?.findings ?? [],
      standing_rule:
        row.metadata?.environmental_standing_report?.explainability?.standing_rule ?? null,
      email_artifact_subject:
        row.metadata?.structured_email_artifact?.subject ?? null,
      eligibility: row.eligibility,
      capture_context: row.capture_context,
      created_at: row.created_at,
    })),
  }

  fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
