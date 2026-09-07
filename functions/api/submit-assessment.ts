import { deliverAssessmentReceipt, deliverAssessmentResultEmail } from "./assessment-delivery-service"
import { evaluateAssessmentV2, type AssessmentEvaluationV2 } from "./assessment-evaluation-v2"
import { validateSystemEnvironmentCurrent } from "./notchazz-system-environment-guard"

type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

type AssessmentMechanicOption = {
  value: string
  label: string
  conditionTags: string[]
}

type AssessmentMechanicQuestion = {
  questionKey: string
  question: string
  options: AssessmentMechanicOption[]
}

type AssessmentConditionTrace = {
  question_key: string
  selected: string
  label: string
  condition_tags: string[]
}

type EnvironmentalStandingReport = {
  environmental_standing: string
  standing_key: string
  assessment_title: string
  assessment_result: string
  detected_conditions: string[]
  findings: string[]
  operational_exposure_summary: string
  recommended_structured_action: string
  recommended_response_label: string
  continuation_pathway: string
  explainability: {
    question_keys: string[]
    condition_tags: string[]
    standing_rule: string
  }
  evaluation_v2?: AssessmentEvaluationV2
}

type AssessmentEmailArtifact = {
  subject: string
  preview: string
  body: string[]
  source: string
}

type V2PersistenceContext = {
  evaluation: AssessmentEvaluationV2
  payload: SubmitAssessmentPayload
  emailArtifact: AssessmentEmailArtifact
}

type CurrentResolutionRow = {
  resolution_standing?: string
  current_state_key?: string | null
  env_key?: string | null
}

type EnvironmentRow = {
  env_key: string
  system_key: string
}

type SubmitAssessmentPayload = {
  institutionName?: string
  contactName?: string
  contactEmail?: string
  evaluationAnswers?: Record<string, unknown>
  report?: {
    standing_key?: string
    environmental_standing?: string
    continuation_pathway?: string
  }
  allFields?: {
    website?: string
    role_title?: string
    organization_type?: string
    ai_deployment_status?: string
    next_support_question?: string
    assessment_result_email_consent?: string
    assessment_boundary_acknowledgment?: string
    measures_registry_updates_opt_in?: string
  }
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  })
}

function publicSafeSubmissionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error("assessment submission internal failure", {
    message,
    source: "submit_assessment_public_boundary",
  })
  return jsonResponse({
    error: "Assessment submission reached an internal evidence boundary. No database details are exposed publicly.",
    public_error_boundary: "internal_evidence_persistence",
  }, 500)
}

async function supabaseFetch<T>(
  env: Env,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase server credentials are not configured")
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed: ${response.status}`)
  }

  const text = await response.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null
}

function asRecordArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(asRecord(item)))
    : []
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function replaceTemplateTokens(value: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (current, [key, replacement]) => current.replaceAll(`{${key}}`, replacement),
    value,
  )
}

async function persistAssessmentEvaluationV2(env: Env, context: V2PersistenceContext) {
  const { evaluation, payload, emailArtifact } = context
  await supabaseFetch(env, "mr_assessment_evaluation_v2", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      evaluation_id: evaluation.evaluation_id,
      assessment_ref: evaluation.assessment_ref,
      capture_id: evaluation.capture_id,
      participant_email: payload.contactEmail ?? null,
      institution_name: payload.institutionName ?? null,
      env_key: evaluation.env_key,
      current_state_key: evaluation.current_state_key,
      matrix_version: evaluation.matrix_version,
      evaluation_standing: evaluation.evaluation_standing,
      evaluation_standing_key: evaluation.evaluation_standing_key,
      reported_conditions: evaluation.reported_conditions,
      priority_cells: evaluation.priority_cells,
      relational_exposures: evaluation.relational_exposures,
      system_consequences: evaluation.system_consequences,
      verification_limits: evaluation.verification_limits,
      unknown_unresolved_held: evaluation.unknown_unresolved_held,
      continuation: evaluation.continuation,
      map_scope: evaluation.map_scope,
      pricing_standing: evaluation.pricing_standing,
      six_touchpoint_chain: evaluation.six_touchpoint_chain,
      metadata: {
        source_runtime: "submit_assessment_server_v2",
        source_oar2: "oar2_implement_mr_assessment_evaluation_v2_end_to_end_codex_v1",
      },
    }),
  })

  await supabaseFetch(env, "mr_assessment_evaluation_cell_v2", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(evaluation.matrix_cells.map((cell) => ({
      evaluation_id: evaluation.evaluation_id,
      cell_key: cell.cell_key,
      row_axis: cell.row_axis,
      column_axis: cell.column_axis,
      standing: cell.standing,
      evidence_question_keys: cell.evidence_question_keys,
      evidence_tags: cell.evidence_tags,
      finding: cell.finding,
      consequence: cell.consequence,
      next_action: cell.next_action,
    }))),
  })

  await supabaseFetch(env, "mr_assessment_evaluation_exposure_v2", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(evaluation.relational_exposures.map((exposure) => ({
      evaluation_id: evaluation.evaluation_id,
      exposure_key: exposure,
      exposure_class: "relational_assessment_exposure",
      standing: evaluation.evaluation_standing_key,
      evidence: {
        assessment_ref: evaluation.assessment_ref,
        current_state_key: evaluation.current_state_key,
      },
    }))),
  })

  await supabaseFetch(env, "mr_assessment_delivery_artifact_v2", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      artifact_id: `delivery_${evaluation.capture_id}`,
      evaluation_id: evaluation.evaluation_id,
      capture_id: evaluation.capture_id,
      assessment_ref: evaluation.assessment_ref,
      artifact_class: "assessment_result_email",
      delivery_standing: "artifact_rendered",
      recipient_email: payload.contactEmail ?? null,
      template_key: "assessment_completed_participant_v1",
      rendered_subject: emailArtifact.subject,
      rendered_preview: emailArtifact.preview,
      metadata: {
        source: emailArtifact.source,
        verification_limits: evaluation.verification_limits,
      },
    }),
  })

  await supabaseFetch(env, "mr_map_continuation_state_v2", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      continuation_id: `map_continuation_${evaluation.capture_id}`,
      evaluation_id: evaluation.evaluation_id,
      capture_id: evaluation.capture_id,
      assessment_ref: evaluation.assessment_ref,
      current_state_key: evaluation.current_state_key,
      env_key: evaluation.env_key,
      map_pathway: evaluation.map_scope.map_pathway,
      public_label: evaluation.map_scope.public_label,
      amount_usd: evaluation.map_scope.amount_usd,
      continuation_standing: evaluation.map_scope.standing,
      next_encounter_key: evaluation.continuation.next_encounter_key,
      marble_order: evaluation.continuation.marble_order,
      creates_identity: false,
      creates_authority: false,
      creates_certification: false,
      metadata: {
        pricing_standing: evaluation.pricing_standing,
        six_touchpoint_chain: evaluation.six_touchpoint_chain,
      },
    }),
  })
}

function allAssessmentMechanics(metadataValue: unknown): AssessmentMechanicQuestion[] {
  const metadata = asRecord(metadataValue)
  const questions = asRecordArray(metadata?.questions)

  return questions
    .map((question) => {
      const questionKey = asString(question.question_key)
      const questionText = asString(question.question)
      const options = asRecordArray(question.options)
        .map((option) => {
          const value = asString(option.value)
          const label = asString(option.label)
          if (!value || !label) return null
          return {
            value,
            label,
            conditionTags: asStringArray(option.condition_tags),
          }
        })
        .filter((option): option is AssessmentMechanicOption => Boolean(option))

      if (!questionKey || !questionText || options.length === 0) return null

      return {
        questionKey,
        question: questionText,
        options,
      }
    })
    .filter((question): question is AssessmentMechanicQuestion => Boolean(question))
}

function selectedConditionTraces(
  mechanics: AssessmentMechanicQuestion[],
  answers: Record<string, unknown>,
): AssessmentConditionTrace[] {
  return mechanics.flatMap((question) => {
    const answerRecord = asRecord(answers[question.questionKey])
    const selected = asString(answerRecord?.selected)
    const submittedLabel = asString(answerRecord?.label)
    if (!selected) return []
    const option = question.options.find((candidate) => candidate.value === selected)
    if (!option) return []
    return [{
      question_key: question.questionKey,
      selected,
      label: submittedLabel ?? option.label,
      condition_tags: option.conditionTags,
    }]
  })
}

function resolveEnvironmentalReportByScore(
  mechanics: AssessmentMechanicQuestion[],
  traces: AssessmentConditionTrace[],
  interpretationValue: unknown,
): { report: EnvironmentalStandingReport; emailArtifact: AssessmentEmailArtifact; score: number } | null {
  const interpretation = asRecord(interpretationValue)
  const scoringThresholds = asRecordArray(interpretation?.scoring_thresholds)
  const standingRules = asRecordArray(interpretation?.standing_rules)
  const emailTemplate = asRecord(interpretation?.email_artifact_template)
  const reportLabels = asRecord(interpretation?.report_labels)
  const findingMap = asRecord(interpretation?.finding_map)

  if (scoringThresholds.length === 0 || !emailTemplate) return null

  const submittedTags = [...new Set(traces.flatMap((trace) => trace.condition_tags))]
  const criticalCount = submittedTags.filter((tag) => tag === "critical_ai_drift_condition").length
  const emergingCount = submittedTags.filter((tag) => tag === "emerging_ai_drift_condition").length
  const probableCount = submittedTags.filter((tag) => tag === "probable_ai_drift_condition").length
  const governedReviewCount = submittedTags.filter((tag) => tag === "governed_review_condition").length
  const totalDriftScore = criticalCount * 3 + emergingCount * 2 + probableCount

  const matchingRule =
    standingRules
      .map((rule, index) => {
        const match = asRecord(rule.match)
        const requiredTags = asStringArray(match?.required_tags)
        const anyTags = asStringArray(match?.any_tags)
        const minGovernedReviewCount =
          typeof match?.min_governed_review_count === "number" ? match.min_governed_review_count : null
        const maxTotalDriftScore =
          typeof match?.max_total_drift_score === "number" ? match.max_total_drift_score : null
        const minCriticalCount = typeof match?.min_critical_count === "number" ? match.min_critical_count : null
        const minEmergingCount = typeof match?.min_emerging_count === "number" ? match.min_emerging_count : null
        const minTotalDriftScore =
          typeof match?.min_total_drift_score === "number" ? match.min_total_drift_score : null

        const eligible =
          Boolean(asString(rule.standing_key)) &&
          requiredTags.every((tag) => submittedTags.includes(tag)) &&
          (anyTags.length === 0 || anyTags.some((tag) => submittedTags.includes(tag))) &&
          (minGovernedReviewCount === null || governedReviewCount >= minGovernedReviewCount) &&
          (maxTotalDriftScore === null || totalDriftScore <= maxTotalDriftScore) &&
          (minCriticalCount === null || criticalCount >= minCriticalCount) &&
          (minEmergingCount === null || emergingCount >= minEmergingCount) &&
          (minTotalDriftScore === null || totalDriftScore >= minTotalDriftScore)

        return {
          index,
          eligible,
          priority: typeof rule.priority === "number" ? rule.priority : 0,
          standingKey: asString(rule.standing_key),
        }
      })
      .filter((rule) => rule.eligible)
      .sort((a, b) => b.priority - a.priority || a.index - b.index)[0] ?? null

  let totalScore = 0
  let maxScore = 0
  for (const question of mechanics) {
    const trace = traces.find((candidate) => candidate.question_key === question.questionKey)
    const optionScores = question.options.map((option) =>
      option.conditionTags.reduce((score, tag) => {
        if (tag === "critical_ai_drift_condition") return score + 3
        if (tag === "emerging_ai_drift_condition") return score + 2
        if (tag === "probable_ai_drift_condition") return score + 1
        return score
      }, 0),
    )
    maxScore += Math.max(...optionScores)
    if (trace) {
      totalScore += trace.condition_tags.reduce((score, tag) => {
        if (tag === "critical_ai_drift_condition") return score + 3
        if (tag === "emerging_ai_drift_condition") return score + 2
        if (tag === "probable_ai_drift_condition") return score + 1
        return score
      }, 0)
    }
  }
  const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  const threshold =
    (matchingRule?.standingKey
      ? scoringThresholds.find((candidate) => asString(candidate.standing_key) === matchingRule.standingKey)
      : null) ??
    scoringThresholds.find((candidate) => {
      const min = typeof candidate.min === "number" ? candidate.min : 0
      const max = typeof candidate.max === "number" ? candidate.max : 100
      return scorePercent >= min && scorePercent <= max
    }) ??
    scoringThresholds.find((candidate) => asString(candidate.standing_key) === asString(interpretation?.fallback_standing_key)) ??
    scoringThresholds[scoringThresholds.length - 1]

  if (!threshold) return null

  const standingKey = asString(threshold.standing_key) ?? "structural_drift_detected"
  const standing =
    asString(threshold.standing) ??
    asString(threshold.environmental_standing) ??
    "Structural Drift Detected"

  const findings = [
    ...new Set(
      submittedTags.flatMap((tag) => {
        const mapped = findingMap?.[tag]
        return typeof mapped === "string" ? [mapped] : []
      }),
    ),
  ]
  const detectedConditions = submittedTags
    .map((tag) => asString(asRecord(interpretation?.condition_labels)?.[tag]) ?? tag.replaceAll("_", " "))
    .slice(0, 8)

  const report: EnvironmentalStandingReport = {
    environmental_standing: standing,
    standing_key: standingKey,
    assessment_title: asString(reportLabels?.assessment_title) ?? "MEASURES AI ENVIRONMENT ASSESSMENT",
    assessment_result: asString(threshold.assessment_result) ?? standing,
    detected_conditions: detectedConditions,
    findings,
    operational_exposure_summary:
      asString(threshold.operational_exposure_summary) ??
      "Assessment resolved through seated scoring contract.",
    recommended_structured_action:
      asString(threshold.recommended_structured_action) ??
      "Continue through the Measures structured pathway.",
    recommended_response_label:
      asString(reportLabels?.recommended_response_label) ?? "Recommended Operational Response",
    continuation_pathway:
      asString(threshold.continuation_pathway) ?? "Structured Environment continuation",
    explainability: {
      question_keys: traces.map((trace) => trace.question_key),
      condition_tags: submittedTags,
      standing_rule: matchingRule?.standingKey
        ? `standing_rule_${matchingRule.standingKey}`
        : `scoring_threshold_${standingKey}`,
    },
  }

  const replacements = {
    assessment_title: report.assessment_title,
    assessment_result: report.assessment_result,
    environmental_standing: report.environmental_standing,
    operational_exposure_summary: report.operational_exposure_summary,
    recommended_structured_action: report.recommended_structured_action,
    recommended_response_label: report.recommended_response_label,
    continuation_pathway: report.continuation_pathway,
    findings: report.findings.join(", "),
    detected_conditions: report.detected_conditions.join(", "),
  }

  return {
    score: scorePercent,
    report,
    emailArtifact: {
      subject: replaceTemplateTokens(
        asString(emailTemplate.subject) ?? "Measures AI Environment Assessment",
        replacements,
      ),
      preview: replaceTemplateTokens(
        asString(emailTemplate.preview) ?? report.operational_exposure_summary,
        replacements,
      ),
      body: asStringArray(emailTemplate.body).map((line) => replaceTemplateTokens(line, replacements)),
      source: "server_scoring_threshold_contract",
    },
  }
}

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  try {
    const payload = (await request.json()) as SubmitAssessmentPayload

    const captureId = crypto.randomUUID()
    const website = payload.allFields?.website || ""
    const trimmedRoleTitle = payload.allFields?.role_title?.trim() ?? ""
    const assessmentRef = `assessment_${captureId}`
    const activeSystemKey = "measures_registry"
    const envKey = "env_measures_registry"
    const registryKey = "measures_assessment"
    const encounterKey = "measures_assessment"

    const [assessmentDef] = await supabaseFetch<Array<{ metadata: Record<string, unknown> | null }>>(
      env,
      `measures_encounter_def?encounter_key=eq.${encounterKey}&select=metadata&limit=1`,
    )
    const assessmentMetadata = assessmentDef?.metadata
    const assessmentMechanics = allAssessmentMechanics(asRecord(assessmentMetadata)?.assessment_mechanics)
    if (assessmentMechanics.length === 0) {
      return jsonResponse({ error: "assessment mechanics are not seated" }, 409)
    }

    const evaluationAnswers = (payload.evaluationAnswers ?? {}) as Record<string, unknown>
    const serverConditionTraces = selectedConditionTraces(assessmentMechanics, evaluationAnswers)
    if (serverConditionTraces.length !== assessmentMechanics.length) {
      return jsonResponse({
        error: "assessment answers are incomplete or do not match seated mechanics",
        expected_question_count: assessmentMechanics.length,
        resolved_answer_count: serverConditionTraces.length,
      }, 400)
    }

    const resolved = resolveEnvironmentalReportByScore(
      assessmentMechanics,
      serverConditionTraces,
      asRecord(assessmentMetadata)?.assessment_interpretation,
    )
    if (!resolved) {
      return jsonResponse({ error: "assessment interpretation is not seated" }, 409)
    }

    const [currentResolution] = await supabaseFetch<CurrentResolutionRow[]>(env, "rpc/resolve_c3_current", {
      method: "POST",
      body: JSON.stringify({ p_env_key: envKey }),
    })
    const [environmentRow] = await supabaseFetch<EnvironmentRow[]>(
      env,
      `c3_environment?env_key=eq.${envKey}&select=env_key,system_key&limit=1`,
    )
    const currentStateKey =
      currentResolution?.resolution_standing === "resolved_current_state" && currentResolution.current_state_key
        ? currentResolution.current_state_key
        : "held_current_state_key_pending_registry_relation"
    const currentGuard = validateSystemEnvironmentCurrent({
      active_system_key: activeSystemKey,
      target_env_key: envKey,
      environment_system_key: environmentRow?.system_key ?? null,
      resolved_current_state_key: currentStateKey,
      resolved_current_env_key: currentResolution?.env_key ?? null,
      target_registry_system_key: activeSystemKey,
      evidence_system_key: activeSystemKey,
      mutation_system_key: activeSystemKey,
      source_execution_instance_id: "correct_measures_current_and_notchazz_env_guard_codex_001",
    })
    if (currentGuard.standing === "hold") {
      return jsonResponse({
        error: "system/environment/current mismatch",
        notchazz: currentGuard,
      }, 409)
    }

    const assessmentRecord = {
      assessment_ref: assessmentRef,
      env_key: envKey,
      current_state_key: currentStateKey,
      registry_key: registryKey,
      encounter_key: encounterKey,
      profile_version: "measures_assessment_server_resolution_v1",
      raw_answers: evaluationAnswers,
      resolved_standing: resolved.report.environmental_standing,
      standing_key: resolved.report.standing_key,
      findings: resolved.report.findings,
      conditions: resolved.report.detected_conditions,
      recommended_action: resolved.report.recommended_structured_action,
      continuation_pathway: resolved.report.continuation_pathway,
      source_explainability_reference: resolved.report.explainability,
      score_percent: resolved.score,
      authority: "server_side_registry_resolution",
    }

    const c2Resolution = {
      assessment_ref: assessmentRef,
      evaluation_id: `evaluation_${captureId}`,
      env_key: envKey,
      source_standing_key: resolved.report.standing_key,
      current_state_key: assessmentRecord.current_state_key,
      active_commerce_scope: "map_the_environment",
      public_continuation_label: "MAP the Environment",
      governed_map_encounter: "MAP the Environment",
      map_pathway: "pending_v2_evaluation",
      pathway_standing: "pending_map_the_environment_c2_checkout",
      creates_identity: false,
      creates_authority: false,
      creates_permission: false,
      creates_portal_admission: false,
      frontend_authority: "renderer_only",
    }

    const evaluationV2 = evaluateAssessmentV2({
      assessment_ref: assessmentRef,
      capture_id: captureId,
      current_state_key: assessmentRecord.current_state_key,
      env_key: envKey,
      traces: serverConditionTraces,
    })
    c2Resolution.map_pathway = evaluationV2.map_scope.map_pathway
    const reportWithEvaluationV2: EnvironmentalStandingReport = {
      ...resolved.report,
      evaluation_v2: evaluationV2,
    }

    const captureMetadata = {
      assessment_ref: assessmentRef,
      env_key: envKey,
      registry_key: registryKey,
      encounter_key: encounterKey,
      legacy_encounter_key: "measures_ai_operational_evaluation",
      organization_type: payload.allFields?.organization_type?.trim() ?? "",
      ai_deployment_status: payload.allFields?.ai_deployment_status?.trim() ?? "",
      next_support_question: payload.allFields?.next_support_question?.trim() || null,
      assessment_result_email_consent: payload.allFields?.assessment_result_email_consent === "true",
      assessment_boundary_acknowledgment: payload.allFields?.assessment_boundary_acknowledgment === "true",
      measures_registry_updates_opt_in: payload.allFields?.measures_registry_updates_opt_in === "true",
      source_runtime: "free_encounter_renderer_v1",
      carry_forward: {
        source_surface: "measures_assessment",
        passage_surface: "obsidian_to_marble_passage_video",
        destination_surface: "map_the_environment",
        destination_label: "MAP the Environment",
        current_state_key: assessmentRecord.current_state_key,
        organization_name: payload.institutionName,
        contact_name: payload.contactName,
        contact_email: payload.contactEmail,
        current_ai_usage: payload.allFields?.ai_deployment_status?.trim() ?? "",
        circuit_identification: payload.report?.standing_key ?? "",
        continuation_pathway: payload.report?.continuation_pathway ?? "",
        state: "carried_forward",
        ccc_token_reference: "held_missing_canonical_ccc_token_reference",
      },
      assessment_result_binding: {
        assessment_ref: assessmentRef,
        current_state_key: assessmentRecord.current_state_key,
        environmental_standing_report: reportWithEvaluationV2,
        institution_name: payload.institutionName,
        contact_name: payload.contactName,
        contact_email: payload.contactEmail,
        role_title: trimmedRoleTitle,
        website: website || null,
        ai_deployment_status: payload.allFields?.ai_deployment_status?.trim() ?? "",
        assessment_result_email_consent: payload.allFields?.assessment_result_email_consent === "true",
        assessment_boundary_acknowledgment: payload.allFields?.assessment_boundary_acknowledgment === "true",
        measures_registry_updates_opt_in: payload.allFields?.measures_registry_updates_opt_in === "true",
        public_internal_boundary_preserved: true,
      },
      institutional_identity_relation: {
        standing: "institutional_identity_represented_by_institutional_representative",
        institution_name: payload.institutionName,
        representative_name: payload.contactName,
        representative_email: payload.contactEmail,
        role_title: trimmedRoleTitle,
        c3_7s_acknowledged: payload.allFields?.assessment_boundary_acknowledgment === "true",
        named_individual_registration_inferred: false,
        operator_standing_inferred: false,
      },
      governed_assessment_instance: assessmentRecord,
      c2_resolution: c2Resolution,
      evaluation_id: evaluationV2.evaluation_id,
      matrix_version: evaluationV2.matrix_version,
      evaluation_v2: evaluationV2,
      matrix_cells: evaluationV2.matrix_cells,
      priority_cells: evaluationV2.priority_cells,
      verification_limits: evaluationV2.verification_limits,
      relational_exposures: evaluationV2.relational_exposures,
      system_consequences: evaluationV2.system_consequences,
      map_scope: evaluationV2.map_scope,
      pricing_standing: evaluationV2.pricing_standing,
      next_encounter_key: evaluationV2.continuation.next_encounter_key,
      six_touchpoint_chain: evaluationV2.six_touchpoint_chain,
      marble_order: evaluationV2.continuation.marble_order,
      current_state_key: assessmentRecord.current_state_key,
      notchazz_system_environment_guard: currentGuard,
      environmental_standing_report: reportWithEvaluationV2,
      structured_email_artifact: resolved.emailArtifact,
      condition_traces: serverConditionTraces,
      contact_gated_result_delivery: true,
      ccc_token_reference: "held_missing_canonical_ccc_token_reference",
    }

    // Insert capture into Supabase Rest API using server-side service-role key
    await supabaseFetch(env, "measures_iis_eval_gate1_capture", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: captureId,
        institution_name: payload.institutionName,
        institution_address: website,
        institution_phone: "",
        contact_name: payload.contactName,
        contact_position: trimmedRoleTitle,
        contact_email: payload.contactEmail,
        evaluation_answers: payload.evaluationAnswers,
        capture_context: "measures_assessment_contact_gated_delivery",
        intent: "assessment_result_delivery_request",
        eligibility: {
          gate_1: "complete",
          assessment_returned: true,
          contact_capture_submitted: true,
          consent_confirmed: true,
          minimum_identity_captured: true,
          src_requirements_satisfied: true,
          implementation_src_requirements_satisfied: false,
          deferred_src_fields_held: true,
        },
        campaign_tag: "measures_assessment_contact_gated_delivery",
        notification_state: "queued",
        metadata: captureMetadata,
      }),
    })

    await persistAssessmentEvaluationV2(env, {
      evaluation: evaluationV2,
      payload,
      emailArtifact: resolved.emailArtifact,
    })

    const receiptResult = await deliverAssessmentReceipt(env, captureId)
    const resultEmail = await deliverAssessmentResultEmail(env, captureId)

    return jsonResponse({
      success: true,
      capture_id: captureId,
      assessment_ref: assessmentRef,
      report: reportWithEvaluationV2,
      emailArtifact: resolved.emailArtifact,
      evaluationV2,
      c2Resolution,
      receiptDispatch: receiptResult.body,
      dispatch: resultEmail.body,
    })
  } catch (error) {
    return publicSafeSubmissionError(error)
  }
}
