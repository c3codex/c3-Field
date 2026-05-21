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

if (!supabaseUrl || !writeKey) throw new Error("Supabase credentials missing")

const supabase = createClient(supabaseUrl, writeKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const sourceOar2 = "docs/oar/measures_registry/oar2_assessment_branding_evaluation_surface_identity_refinement_v1.meta.md"
const mechanicsManifest = JSON.parse(
  fs.readFileSync(path.join("docs", "oar", "measures_registry", "measures_ai_assessment_mechanics_answer_capture_v1.json"), "utf8"),
)
const interpretationManifest = JSON.parse(
  fs.readFileSync(path.join("docs", "oar", "measures_registry", "deterministic_environmental_standing_report_routing_v1.json"), "utf8"),
)

function assertOk(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function selectedAnswers() {
  return Object.fromEntries(
    mechanicsManifest.assessment_mechanics.questions.map((question, index) => {
      const option = question.options[index % 2 === 0 ? 0 : 3]
      return [
        question.question_key,
        {
          selected: option.value,
          label: option.label,
          institutional_context: `[redacted validation context ${index + 1}]`,
        },
      ]
    }),
  )
}

function conditionTraces(answers) {
  return mechanicsManifest.assessment_mechanics.questions.map((question) => {
    const answer = answers[question.question_key]
    const option = question.options.find((candidate) => candidate.value === answer.selected)
    return {
      question_key: question.question_key,
      selected: answer.selected,
      label: answer.label,
      condition_tags: option?.condition_tags ?? [],
    }
  })
}

function resolveReport(traces) {
  const interpretation = interpretationManifest.assessment_interpretation
  const tagSet = new Set(traces.flatMap((trace) => trace.condition_tags))
  const rules = interpretation.standing_rules
    .map((rule, index) => {
      const allTags = rule.all_tags ?? []
      const anyTags = rule.any_tags ?? []
      const allSatisfied = allTags.every((tag) => tagSet.has(tag))
      const matched = [...allTags, ...anyTags].filter((tag) => tagSet.has(tag))
      return {
        ...rule,
        index,
        eligible: allSatisfied && matched.length > 0,
        score: (allSatisfied ? allTags.length * 3 : 0) + matched.length,
      }
    })
    .filter((rule) => rule.eligible)
    .sort((a, b) => b.score - a.score || b.priority - a.priority || a.index - b.index)

  const selected = rules[0] ?? interpretation.standing_rules.find((rule) => rule.standing_key === "structured_governance_candidate")
  const template = interpretation.report_templates[selected.standing_key]
  const conditionTags = [...tagSet]
  const findings = [
    ...new Set(
      conditionTags.flatMap((tag) => {
        const finding = interpretation.finding_map?.[tag]
        return finding ? [finding] : []
      }),
    ),
  ]
  const detectedConditions = conditionTags
    .map((tag) => interpretation.condition_labels[tag] ?? tag.replaceAll("_", " "))
    .slice(0, 8)
  const report = {
    environmental_standing: selected.standing,
    standing_key: selected.standing_key,
    assessment_title: interpretation.report_labels.assessment_title,
    assessment_result: template.assessment_result ?? interpretation.report_labels.assessment_result,
    detected_conditions: detectedConditions,
    findings,
    operational_exposure_summary: template.operational_exposure_summary,
    recommended_structured_action: template.recommended_structured_action,
    recommended_response_label: interpretation.report_labels.recommended_response_label,
    continuation_pathway: template.continuation_pathway,
    explainability: {
      question_keys: traces.map((trace) => trace.question_key),
      condition_tags: conditionTags,
      standing_rule: selected.rule_key,
    },
  }
  const replacements = {
    assessment_title: report.assessment_title,
    assessment_result: report.assessment_result,
    environmental_standing: report.environmental_standing,
    detected_conditions: report.detected_conditions.join(", "),
    findings: report.findings.join(", "),
    operational_exposure_summary: report.operational_exposure_summary,
    recommended_structured_action: report.recommended_structured_action,
    recommended_response_label: report.recommended_response_label,
    continuation_pathway: report.continuation_pathway,
  }
  const replaceTokens = (value) =>
    Object.entries(replacements).reduce(
      (current, [key, replacement]) => current.replaceAll(`{${key}}`, replacement),
      value,
    )
  const emailArtifact = {
    subject: replaceTokens(interpretation.email_artifact_template.subject),
    preview: replaceTokens(interpretation.email_artifact_template.preview),
    body: interpretation.email_artifact_template.body.map(replaceTokens),
    source: "assessment_interpretation_metadata",
  }

  return { report, emailArtifact }
}

async function main() {
  const answers = selectedAnswers()
  const traces = conditionTraces(answers)
  const { report, emailArtifact } = resolveReport(traces)

  const inserted = assertOk(
    await supabase
      .from("measures_iis_eval_gate1_capture")
      .insert({
        institution_name: "OAR validation probe",
        institution_address: "",
        institution_phone: "",
        contact_name: "OAR validation",
        contact_position: "deterministic report validation",
        contact_email: "validation@example.com",
        evaluation_answers: answers,
        capture_context: "iis_eval_gate1",
        intent: "system_evaluation_request",
        eligibility: {
          foundational_courses: true,
          conversion_assessment: "pending_review",
        },
        campaign_tag: "iis_eval_gate1",
        notification_state: "queued",
        confirmation_email_state: "queued",
        metadata: {
          source_oar2: sourceOar2,
          validation_probe: true,
          environmental_standing_report: report,
          structured_email_artifact: emailArtifact,
          condition_traces: traces,
        },
      })
      .select("id, evaluation_answers, eligibility, metadata, capture_context, created_at")
      .single(),
    "validation capture insert",
  )

  console.log(JSON.stringify({
    insertedCaptureId: inserted.id,
    environmentalStanding: inserted.metadata.environmental_standing_report.environmental_standing,
    assessmentResult: inserted.metadata.environmental_standing_report.assessment_result,
    findings: inserted.metadata.environmental_standing_report.findings,
    standingRule: inserted.metadata.environmental_standing_report.explainability.standing_rule,
    emailArtifactSubject: inserted.metadata.structured_email_artifact.subject,
    evaluationAnswerKeys: Object.keys(inserted.evaluation_answers),
    captureContext: inserted.capture_context,
    eligibility: inserted.eligibility,
  }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
