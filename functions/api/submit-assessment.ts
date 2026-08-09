type Env = {
  RESEND_API_KEY?: string
  OPERATOR_DISPATCH_KEY?: string
  SUPABASE_URL?: string
  VITE_SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
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

export const onRequestPost = async ({ request, env }: { request: Request, env: Env }) => {
  try {
    const payload = (await request.json()) as Record<string, any>

    const captureId = crypto.randomUUID()
    const website = payload.allFields?.website || ""
    const trimmedRoleTitle = payload.allFields?.role_title?.trim() ?? ""

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
          encounter_key: "measures_ai_operational_evaluation",
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
            destination_surface: "map_integrity_governance",
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
            environmental_standing_report: payload.report,
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
          environmental_standing_report: payload.report,
          structured_email_artifact: payload.emailArtifact,
          condition_traces: payload.conditionTraces,
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
      dispatch: dispatchResult,
    })
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Submission failed" },
      500,
    )
  }
}
