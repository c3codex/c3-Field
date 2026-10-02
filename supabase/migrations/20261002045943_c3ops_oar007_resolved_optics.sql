-- One c3ops-owned read model; downstream surfaces never interpret raw OAR rails.
-- Invoker rights and service-only access retain existing operator API boundaries.
create or replace view public.c3ops_oar_lifecycle_optics_resolution_v1
with (security_invoker = true) as
select q.oar_key,
  q.scope_key as execution_instance,
  q.automation_permissions->>'executor_ref' as executor_ref,
  q.queue_status as queue_standing,
  q.preflight_status as preflight_standing,
  q.requested_action,
  q.execution_summary,
  case when p.actual_oar1_path=q.oar1_path
    and p.actual_oar1_path=q.expected_oar1_path
    and t.to_status=p.execution_standing
    and e.artifact_path='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key
    then c.standing else null end as return_standing,
  case when q.automation_permissions->>'model_resolution_evidence_required'='true' then
    case when p.actual_oar1_path=q.oar1_path and t.to_status=p.execution_standing
      and e.artifact_path='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key
      and public.validate_cancom_model_resolution_evidence_v1(e.validation_result->'model_resolution_evidence')
      and e.validation_result->'model_resolution_evidence'=c.metadata->'evidence'->'model_resolution_evidence'
      then 'returned' else 'required' end
    else 'not_required' end as model_resolution_standing,
  p.validation_standing,
  coalesce(q.deploy_standing,p.deploy_standing) as deploy_standing,
  q.created_at,
  greatest(q.updated_at,p.updated_at,c.created_at,e.created_at,t."timestamp") as updated_at
from public.system_oar_queue q
left join public.c3_oar_process_instance p on p.process_instance_key=q.scope_key
  and p.source_oar2_path=q.source_oar2_path and p.expected_oar1_path=q.expected_oar1_path
left join lateral (
  select c.* from public.c3ops_oar_custody_resolution_event c
  where c.related_execution_instance=q.scope_key and c.related_oar2=q.oar_key
    and c.object_type='oar1' and c.intended_function='cancom_oar_return'
    and c.metadata->>'origin_oar2_key'=q.oar_key
    and c.metadata->'evidence'->>'canonical_sha256'=q.automation_permissions->>'canonical_sha256'
    and c.metadata->'evidence'->>'canonical_payload_ref'=q.automation_permissions->>'canonical_payload_ref'
    and c.metadata->>'expected_return_route'=q.expected_oar1_path
  order by c.created_at desc,c.resolution_event_key desc limit 1
) c on true
left join lateral (
  select e.* from public.system_oar_execution_evidence e
  where e.queue_key=q.queue_key and e.evidence_key=q.scope_key||':oar1_return'
    and e.evidence_type='runtime_validation'
    and e.validation_result->>'origin_oar2_key'=q.oar_key
    and e.validation_result->>'canonical_sha256'=q.automation_permissions->>'canonical_sha256'
  order by e.created_at desc limit 1
) e on true
left join public.c3_oar_transition_event t
  on t.transition_event_key=q.scope_key||':oar1_return' and t.process_instance_key=q.scope_key
  and t.evidence_reference='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key
where q.operator_key='op044' and q.oar_type='oar2';

revoke all on public.c3ops_oar_lifecycle_optics_resolution_v1 from public,anon,authenticated;
grant select on public.c3ops_oar_lifecycle_optics_resolution_v1 to service_role;
comment on view public.c3ops_oar_lifecycle_optics_resolution_v1 is
  'process:c3ops_oar_lifecycle_optics_resolution_v1; op044 optics only; no authority or payload projection';
notify pgrst, 'reload schema';
