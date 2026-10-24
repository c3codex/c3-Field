create or replace view public.c3ops_oar_lifecycle_optics_resolution_v1 with (security_invoker=true) as  SELECT q.oar_key,
    q.scope_key AS execution_instance,
    q.automation_permissions ->> 'executor_ref'::text AS executor_ref,
    q.queue_status AS queue_standing,
    q.preflight_status AS preflight_standing,
    q.requested_action,
    q.execution_summary,
        CASE
            WHEN p.actual_oar1_path = q.oar1_path AND p.actual_oar1_path = q.expected_oar1_path AND t.to_status = p.execution_standing AND e.artifact_path = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key) THEN c.standing
            ELSE NULL::text
        END AS return_standing,
        CASE
            WHEN (q.automation_permissions ->> 'model_resolution_evidence_required'::text) = 'true'::text THEN
            CASE
                WHEN p.actual_oar1_path = q.oar1_path AND t.to_status = p.execution_standing AND e.artifact_path = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key) AND validate_cancom_model_resolution_evidence_v1(e.validation_result -> 'model_resolution_evidence'::text) AND (e.validation_result -> 'model_resolution_evidence'::text) = ((c.metadata -> 'evidence'::text) -> 'model_resolution_evidence'::text) THEN 'returned'::text
                ELSE 'required'::text
            END
            ELSE 'not_required'::text
        END AS model_resolution_standing,
    p.validation_standing,
    COALESCE(q.deploy_standing, p.deploy_standing) AS deploy_standing,
    q.created_at,
    GREATEST(q.updated_at, p.updated_at, c.created_at, e.created_at, t."timestamp") AS updated_at
,q.automation_permissions->'computational_acceptance'->>'authorized_outcome' as authorized_outcome,
 q.automation_permissions->>'canonical_sha256' as source_sha256,
 d.validation_result->>'outcome' as computational_disposition,
 d.validation_result->'objectives' as acceptance_predicates,
 d.validation_result->'held_predicates' as held_predicates,
 (select jsonb_agg(v.validation_result) from public.system_oar_execution_evidence v where v.queue_key=q.queue_key and v.validation_result->>'kind'='independent_acceptance_receipt_v1') as effect_proof,
 d.validation_result->>'next_dependency' as next_dependency
   FROM system_oar_queue q
 LEFT JOIN public.system_oar_execution_evidence d ON d.evidence_key=q.scope_key||':computational_disposition' AND d.queue_key=q.queue_key AND d.validation_result->>'kind'='computational_disposition_v1'
     LEFT JOIN c3_oar_process_instance p ON p.process_instance_key = q.scope_key AND p.source_oar2_path = q.source_oar2_path AND p.expected_oar1_path = q.expected_oar1_path
     LEFT JOIN LATERAL ( SELECT c_1.resolution_event_key,
            c_1.process_key,
            c_1.object_identifier,
            c_1.object_type,
            c_1.related_system,
            c_1.intended_function,
            c_1.standing,
            c_1.integrity_hash,
            c_1.custody_type,
            c_1.custody_reference,
            c_1.retrieval_access_rule,
            c_1.related_execution_instance,
            c_1.related_oar1,
            c_1.related_oar2,
            c_1.resolution_status,
            c_1.hold_reason,
            c_1.transition_timestamp,
            c_1.metadata,
            c_1.created_at
           FROM c3ops_oar_custody_resolution_event c_1
          WHERE c_1.related_execution_instance = q.scope_key AND c_1.related_oar2 = q.oar_key AND c_1.object_type = 'oar1'::text AND c_1.intended_function = 'cancom_oar_return'::text AND (c_1.metadata ->> 'origin_oar2_key'::text) = q.oar_key AND ((c_1.metadata -> 'evidence'::text) ->> 'canonical_sha256'::text) = (q.automation_permissions ->> 'canonical_sha256'::text) AND ((c_1.metadata -> 'evidence'::text) ->> 'canonical_payload_ref'::text) = (q.automation_permissions ->> 'canonical_payload_ref'::text) AND (c_1.metadata ->> 'expected_return_route'::text) = q.expected_oar1_path
          ORDER BY c_1.created_at DESC, c_1.resolution_event_key DESC
         LIMIT 1) c ON true
     LEFT JOIN LATERAL ( SELECT e_1.evidence_key,
            e_1.queue_key,
            e_1.evidence_type,
            e_1.evidence_summary,
            e_1.validation_query,
            e_1.validation_result,
            e_1.artifact_path,
            e_1.commit_hash,
            e_1.created_at
           FROM system_oar_execution_evidence e_1
          WHERE e_1.queue_key = q.queue_key AND e_1.evidence_key = (q.scope_key || ':oar1_return'::text) AND e_1.evidence_type = 'runtime_validation'::text AND (e_1.validation_result ->> 'origin_oar2_key'::text) = q.oar_key AND (e_1.validation_result ->> 'canonical_sha256'::text) = (q.automation_permissions ->> 'canonical_sha256'::text)
          ORDER BY e_1.created_at DESC
         LIMIT 1) e ON true
     LEFT JOIN c3_oar_transition_event t ON t.transition_event_key = (q.scope_key || ':oar1_return'::text) AND t.process_instance_key = q.scope_key AND t.evidence_reference = ('registry://c3ops_oar_custody_resolution_event/'::text || c.resolution_event_key)
  WHERE q.operator_key = 'op044'::text AND q.oar_type = 'oar2'::text;
revoke all on public.c3ops_oar_lifecycle_optics_resolution_v1 from public,anon,authenticated;
grant select on public.c3ops_oar_lifecycle_optics_resolution_v1 to service_role;
