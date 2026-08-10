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
}

type AssessmentEmailArtifact = {
  subject: string
  preview: string
  body: string[]
  source: string
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
    const payload = (await request.json()) as Record<string, any>

    const captureId = crypto.randomUUID()
    const website = payload.allFields?.website || ""
    const trimmedRoleTitle = payload.allFields?.role_title?.trim() ?? ""
    const assessmentRef = `assessment_${captureId}`
    const envKey = "env_measures_of_inanna"
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

    const assessmentRecord = {
      assessment_ref: assessmentRef,
      env_key: envKey,
      current_state_key: "held_current_state_key_pending_registry_relation",
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
      env_key: envKey,
      source_standing_key: resolved.report.standing_key,
      active_profile_key: "map_portal_admission_profile_v1",
      governed_map_encounter: "map_portal",
      pathway_standing: "pending_map_portal_admission",
      frontend_authority: "renderer_only",
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
        metadata: {
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
            destination_surface: "map_portal",
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
            environmental_standing_report: resolved.report,
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
          environmental_standing_report: resolved.report,
          structured_email_artifact: resolved.emailArtifact,
          condition_traces: serverConditionTraces,
          contact_gated_result_delivery: true,
          ccc_token_reference: "held_missing_canonical_ccc_token_reference",
        },
      }),
    })

    // Server-side internal/api participant dispatch call
    const origin = new URL(request.url).origin
    const dispatchResponse = await fetch(`${origin}/api/dispatch-assessment-notification`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-operator-dispatch-key": env.OPERATOR_DISPATCH_KEY || "",
      },
      body: JSON.stringify({ capture_id: captureId }),
    })

    const dispatchResult = (await dispatchResponse.json().catch(() => ({}))) as Record<string, unknown>

    return jsonResponse({
      success: true,
      capture_id: captureId,
      assessment_ref: assessmentRef,
      report: resolved.report,
      emailArtifact: resolved.emailArtifact,
      c2Resolution,
      dispatch: dispatchResult,
    })
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Submission failed" },
      500,
    )
  }
}
