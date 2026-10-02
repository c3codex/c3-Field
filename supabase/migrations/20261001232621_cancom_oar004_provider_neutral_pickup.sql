-- OAR 004 provider-neutral exact Registry pickup.
create or replace function public.resolve_cancom_oar_pickup_v1(
  p_key_type text, p_key text, p_executor text
) returns jsonb
language plpgsql stable security invoker set search_path = ''
as $$
declare
  v_q public.system_oar_queue%rowtype;
  v_manifest public.c3ops_oar_custody_resolution_event%rowtype;
  v_wake public.c3ops_cancom_notification_event%rowtype;
  v_cap public.c3_envpac_capability_grant%rowtype;
  v_n integer;
  v_a jsonb;
  v_e jsonb;
  v_provider text;
begin
  if p_key_type not in ('oar_key','passage_key','execution_instance')
    or nullif(btrim(p_key),'') is null or nullif(btrim(p_executor),'') is null then
    return jsonb_build_object('standing','HLD','reason','invalid_lookup');
  end if;

  select count(*) into v_n from public.system_oar_queue q
   where (p_key_type = 'oar_key' and q.oar_key = p_key)
      or (p_key_type in ('passage_key','execution_instance') and q.scope_key = p_key);
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','manifest_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_q from public.system_oar_queue q
   where (p_key_type = 'oar_key' and q.oar_key = p_key)
      or (p_key_type in ('passage_key','execution_instance') and q.scope_key = p_key);
  v_a := v_q.automation_permissions;
  v_provider := coalesce(nullif(v_a->>'payload_custody_provider',''),
    case when v_a->>'canonical_payload_ref' like 'drive_file:%' then 'drive' end);
  if v_q.process_key <> 'cancom_oar_delivery_retrieval_v1'
     or v_q.oar_type <> 'oar2'
     or v_q.queue_status not in ('approved_for_execution','executing','oar1_submitted','completed')
     or v_q.preflight_status <> 'passed' or v_q.operator_confirmed_at is null
     or coalesce(v_a->>'executor_binding_mode','') <> 'specific_executor'
     or coalesce(v_a->>'executor_ref','') <> p_executor
     or coalesce(v_a->>'passage_key','') <> v_q.scope_key
     or coalesce(v_a->>'capability_ref','') = ''
     or coalesce(v_a->>'canonical_payload_ref','') = ''
     or coalesce(v_a->>'canonical_sha256','') !~ '^[0-9a-f]{64}$'
     or coalesce(v_a->>'serialization_basis','') <> 'utf8_raw_bytes_sha256'
     or coalesce(v_a->>'canonical_payload_bytes','') !~ '^[1-9][0-9]*$'
     or coalesce(v_provider,'') !~ '^[a-z][a-z0-9_]*$'
     or split_part(v_a->>'canonical_payload_ref',':',1) not in (v_provider,v_provider||'_file') then
    return jsonb_build_object('standing','HLD','reason','queue_or_manifest_boundary');
  end if;

  select count(*) into v_n from public.c3ops_oar_custody_resolution_event c
   where c.object_type='oar2' and c.object_identifier=v_q.oar_key
     and c.related_execution_instance=v_q.scope_key
     and c.custody_reference=v_a->>'canonical_payload_ref'
     and lower(c.integrity_hash)=v_a->>'canonical_sha256'
     and c.metadata->>'serialization_basis'=v_a->>'serialization_basis'
     and (c.metadata->>'payload_revision_ref'='sha256:'||(v_a->>'canonical_sha256')
       or (v_provider='drive' and c.metadata->>'payload_revision_ref' is null))
     and c.standing='delivered_for_execution' and c.resolution_status='resolved';
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','canonical_payload_binding_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_manifest from public.c3ops_oar_custody_resolution_event c
   where c.object_type='oar2' and c.object_identifier=v_q.oar_key
     and c.related_execution_instance=v_q.scope_key
     and c.custody_reference=v_a->>'canonical_payload_ref'
     and lower(c.integrity_hash)=v_a->>'canonical_sha256'
     and c.metadata->>'serialization_basis'=v_a->>'serialization_basis'
     and (c.metadata->>'payload_revision_ref'='sha256:'||(v_a->>'canonical_sha256')
       or (v_provider='drive' and c.metadata->>'payload_revision_ref' is null))
     and c.standing='delivered_for_execution' and c.resolution_status='resolved';

  select count(*) into v_n from public.c3ops_cancom_notification_event n
   where n.source_object_key=v_q.scope_key and n.event_type='executor_wake_ready'
     and n.actor_key=p_executor and n.standing='ready_for_executor_pickup'
     and n.evidence->>'oar_key'=v_q.oar_key
     and n.evidence->>'queue_key'=v_q.queue_key;
  if v_n <> 1 then
    return jsonb_build_object('standing','HLD','reason','passage_missing_or_ambiguous','count',v_n);
  end if;
  select * into v_wake from public.c3ops_cancom_notification_event n
   where n.source_object_key=v_q.scope_key and n.event_type='executor_wake_ready'
     and n.actor_key=p_executor and n.standing='ready_for_executor_pickup'
     and n.evidence->>'oar_key'=v_q.oar_key
     and n.evidence->>'queue_key'=v_q.queue_key;
  v_e := v_wake.evidence;
  if coalesce(v_e->>'execution_instance','') <> v_q.scope_key
     or coalesce(v_e->>'passage_key','') <> v_q.scope_key
     or coalesce(v_e->>'relation_ref','') <> v_q.oar_key
     or coalesce(v_e->>'thread_ref','') <> v_q.scope_key
     or coalesce(v_e->>'payload_custody_ref','') <> v_a->>'canonical_payload_ref'
     or coalesce(v_e->>'integrity_value','') <> v_a->>'canonical_sha256'
     or coalesce(v_e->>'integrity_basis','') <> v_a->>'serialization_basis'
     or coalesce(v_e->>'authority_scope_ref','') <> 'capability:'||(v_a->>'capability_ref')
     or coalesce(v_e->>'receiving_environment','') <> 'executor:'||p_executor
     or coalesce(v_e->>'return_route','') <> v_q.expected_oar1_path
     or coalesce(v_e->>'optics_state','') <> 'executor_bounded'
     or coalesce(v_e->>'audience_role','') <> 'direct_executor'
     or coalesce(v_e->>'asserted_sender','') = ''
     or coalesce(v_e->>'resolved_actor','') = ''
     or coalesce(v_e->>'origin_environment','') = ''
     or coalesce(v_e->>'transport_adapter','') = ''
     or coalesce(v_e->>'communication_type','') <> 'oar2_execution_passage'
     or coalesce(v_e->>'evidence_state','') <> 'ready_for_preflight' then
    return jsonb_build_object('standing','HLD','reason','passage_field_conflict');
  end if;

  select * into v_cap from public.c3_envpac_capability_grant g
   where g.capability_key=v_a->>'capability_ref' and g.standing='active'
     and g.capability=v_a->>'required_capability'
     and g.scope->>'executor_ref'=p_executor
     and g.scope->>'execution_instance'=v_q.scope_key
     and g.scope->>'oar_key'=v_q.oar_key
     and g.scope->>'process_key'=v_q.process_key;
  if not found or not (v_cap.scope->'allowed_actions' ?& array['resolve_registry_manifest',
      'resolve_cancom_passage','retrieve_canonical_payload']) then
    return jsonb_build_object('standing','HLD','reason','executor_capability_unresolved');
  end if;
  return jsonb_build_object(
    'standing','resolved_for_executor','queue_key',v_q.queue_key,
    'queue_status',v_q.queue_status,'oar_key',v_q.oar_key,
    'execution_instance',v_q.scope_key,'passage_key',v_q.scope_key,
    'wake_event_key',v_wake.event_key,'manifest_event_key',v_manifest.resolution_event_key,
    'executor_ref',p_executor,'capability_ref',v_cap.capability_key,
    'authority_scope_ref',v_e->>'authority_scope_ref',
    'payload_custody_ref',v_a->>'canonical_payload_ref',
    'payload_custody_provider',v_provider,
    'payload_bytes',(v_a->>'canonical_payload_bytes')::bigint,
    'serialization_basis',v_a->>'serialization_basis',
    'sha256',v_a->>'canonical_sha256',
    'return_route',v_q.expected_oar1_path,
    'external_correspondence_authorized',v_cap.scope->'external_correspondence_authorized',
    'deployment_authorized',v_cap.scope->'deployment_authorized');
end;
$$;

revoke all on function public.resolve_cancom_oar_pickup_v1(text,text,text) from public,anon,authenticated;
grant execute on function public.resolve_cancom_oar_pickup_v1(text,text,text) to service_role;
