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

const sourceOar2 = "docs/oar/measures_registry/oar2_measures_ai_assessment_mechanics_answer_capture_v1.meta.md"
const manifestPath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "measures_ai_assessment_mechanics_answer_capture_v1.json",
)
const evidencePath = path.join(
  "docs",
  "oar",
  "measures_registry",
  "measures_ai_assessment_mechanics_answer_capture_v1_evidence.json",
)

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function clone(value) {
  return value == null ? {} : JSON.parse(JSON.stringify(value))
}

function questionKeys(mechanics) {
  return mechanics.questions.map((question) => question.question_key)
}

function validateMechanics(mechanics) {
  if (!mechanics || mechanics.version !== "v1" || !Array.isArray(mechanics.questions)) {
    throw new Error("assessment_mechanics v1 questions are required")
  }

  const seen = new Set()
  for (const question of mechanics.questions) {
    if (!question.question_key || !question.question) {
      throw new Error("Each mechanic question requires question_key and question")
    }
    if (seen.has(question.question_key)) {
      throw new Error(`Duplicate mechanic question_key: ${question.question_key}`)
    }
    seen.add(question.question_key)
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error(`Mechanic question requires structured options: ${question.question_key}`)
    }
    for (const option of question.options) {
      if (!option.value || !option.label) {
        throw new Error(`Mechanic option requires value and label: ${question.question_key}`)
      }
    }
  }
}

function patchMetadata(metadata, mechanics) {
  const next = clone(metadata)
  next.assessment_mechanics = {
    ...mechanics,
    source_oar2: sourceOar2,
    content_authority: "measures_encounter_def.metadata",
    frontend_hardcode_allowed: false,
    deterministic_mapping_prepared: true,
    interpretation_boundary: "no_scores_no_legal_claims_no_certification",
  }
  next.capture_metadata = {
    ...(next.capture_metadata && typeof next.capture_metadata === "object" ? next.capture_metadata : {}),
    answer_column: "evaluation_answers",
    answer_shape: "question_key.selected_label_context",
    source_oar2: sourceOar2,
  }
  next.source = sourceOar2
  return next
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

async function readCaptureShape(client, label) {
  const rows = assertOk(
    await client
      .from("measures_iis_eval_gate1_capture")
      .select("id, institution_name, contact_email, evaluation_answers, eligibility, capture_context, created_at")
      .eq("capture_context", "iis_eval_gate1")
      .order("created_at", { ascending: false })
      .limit(3),
    `${label} capture readback`,
  )

  return rows ?? []
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  const mechanics = manifest.assessment_mechanics
  validateMechanics(mechanics)

  const before = await readAssessment(writer, "Before")
  const metadata = patchMetadata(before.metadata, mechanics)
  const updated = assertOk(
    await writer
      .from("measures_encounter_def")
      .update({
        metadata,
        is_active: true,
      })
      .eq("id", before.id)
      .select("encounter_key, display_title, metadata")
      .single(),
    "assessment mechanics update",
  )
  const runtimeRead = await readAssessment(reader, "Runtime")
  const recentCaptures = await readCaptureShape(writer, "Writer")

  const seatedQuestions = runtimeRead.metadata?.assessment_mechanics?.questions ?? []
  const seatedKeys = questionKeys({ questions: seatedQuestions })
  const expectedKeys = questionKeys(mechanics)
  const missingKeys = expectedKeys.filter((key) => !seatedKeys.includes(key))

  if (missingKeys.length > 0) {
    throw new Error(`Runtime readback missing mechanic keys: ${missingKeys.join(", ")}`)
  }

  const evidence = {
    generatedAt: new Date().toISOString(),
    source_oar2: sourceOar2,
    mutationPerformed: true,
    encounterKey: updated.encounter_key,
    mechanicsVersion: mechanics.version,
    questionCount: seatedQuestions.length,
    questionKeys: seatedKeys,
    captureTable: manifest.capture_table,
    answerColumn: manifest.answer_column,
    sampleRedactedPayloadShape: {
      governance_validation_role: {
        selected: "partial_department_specific",
        label: "Partial or department-specific oversight",
        institutional_context: "[redacted optional institutional detail]",
      },
      post_release_traceability: {
        selected: "manual_or_informal_trace",
        label: "Manual or informal trace only",
        institutional_context: "",
      },
    },
    recentCaptureReadback: recentCaptures.map((row) => ({
      id: row.id,
      institution_name: row.institution_name ? "[redacted]" : null,
      contact_email: row.contact_email ? "[redacted]" : null,
      evaluation_answer_keys: row.evaluation_answers ? Object.keys(row.evaluation_answers) : [],
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
