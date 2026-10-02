-- Registrar-resolved active provider object and reference-class admission.
create or replace function public.validate_cancom_custody_provider_v1(p_provider text,p_ref text)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare v_count integer; v_prefix_count integer;
begin
  if not exists(select 1 from public.system_process_registry r
    where r.process_key='cancom_custody_provider_registry_v1' and r.process_status='active') then
    return jsonb_build_object('standing','HLD','reason','HLD_CUSTODY_PROVIDER_UNREGISTERED');
  end if;
  select count(*) into v_count from public.system_process_registry r
    where r.process_status='active' and r.metadata->>'standing'='active'
      and r.metadata->>'provider_key'=p_provider
      and r.process_key in ('cancom_custody_provider_github_v1','cancom_custody_provider_drive_v1');
  if v_count<>1 then
    return jsonb_build_object('standing','HLD','reason','HLD_CUSTODY_PROVIDER_UNREGISTERED');
  end if;
  select count(*) into v_prefix_count from public.system_process_registry r
    cross join lateral jsonb_array_elements_text(r.metadata->'accepted_ref_prefixes') prefix
    where r.process_status='active' and r.metadata->>'standing'='active'
      and r.metadata->>'provider_key'=p_provider
      and r.process_key in ('cancom_custody_provider_github_v1','cancom_custody_provider_drive_v1')
      and left(p_ref,length(prefix.value))=prefix.value
      and length(p_ref)>length(prefix.value);
  if v_prefix_count<>1 then
    return jsonb_build_object('standing','HLD','reason','HLD_CUSTODY_REFERENCE_CLASS_MISMATCH');
  end if;
  return jsonb_build_object('standing','admitted','provider_key',p_provider);
end; $$;
revoke all on function public.validate_cancom_custody_provider_v1(text,text) from public,anon,authenticated;
grant execute on function public.validate_cancom_custody_provider_v1(text,text) to service_role;

-- Structured model-resolution evidence is validated before any OAR1 lifecycle write.
create or replace function public.validate_cancom_model_resolution_evidence_v1(p_model jsonb)
returns boolean language plpgsql immutable security invoker set search_path = '' as $$
declare v_field text;
begin
  if jsonb_typeof(p_model) is distinct from 'object' then return false; end if;
  foreach v_field in array array['preferred_model_or_tier','selected_model_or_explicit_unverified_state',
    'fallback_level','fallback_reason','context_fit','execution_result'] loop
    if jsonb_typeof(p_model->v_field) is distinct from 'string'
      or nullif(btrim(p_model->>v_field),'') is null then return false; end if;
  end loop;
  if jsonb_typeof(p_model->'fallback_used') is distinct from 'boolean'
    or p_model->'capability_floor_passed' is distinct from 'true'::jsonb
    or jsonb_typeof(p_model->'tools_available') is distinct from 'array'
    or jsonb_array_length(p_model->'tools_available')=0
    or exists(select 1 from jsonb_array_elements(p_model->'tools_available') item
      where jsonb_typeof(item) is distinct from 'string' or nullif(btrim(item #>> '{}'),'') is null)
  then return false; end if;
  return true;
end; $$;
revoke all on function public.validate_cancom_model_resolution_evidence_v1(jsonb) from public,anon,authenticated;
grant execute on function public.validate_cancom_model_resolution_evidence_v1(jsonb) to service_role;

create or replace function public.resolve_cancom_context_v1(p_request jsonb)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  v_class text := p_request->>'relation_class';
  v_ref text := p_request->>'relation_ref';
  v_asserted text := p_request->>'asserted_sender';
  v_origin text := p_request->>'origin_environment';
  v_target text := p_request->>'receiving_environment';
  v_audience text := p_request->>'audience_role';
  v_transport text := p_request->>'transport_adapter';
  v_payload_class text := p_request->>'payload_custody_class';
  v_actor text;
  v_optics text;
  v_count int;
  v_connection public.c3_env_native_connection%rowtype;
  v_participation public.c2_mdm_participation_relation%rowtype;
  v_binding public.c3ops_cancom_context_binding%rowtype;
  v_pickup jsonb;
begin
  if jsonb_typeof(p_request) is distinct from 'object'
    or nullif(v_class,'') is null or nullif(v_ref,'') is null
    or nullif(v_asserted,'') is null or nullif(v_origin,'') is null
    or nullif(v_target,'') is null or nullif(v_audience,'') is null
    or nullif(v_transport,'') is null or nullif(v_payload_class,'') is null then
    return jsonb_build_object('standing','HLD','reason','context_fields_missing');
  end if;
  if v_transport not in ('personal_e2ee','registry_cancom_internal','cloudflare_email') then
    return jsonb_build_object('standing','HLD','reason','transport_unregistered');
  end if;
  if v_transport='cloudflare_email' then
    return jsonb_build_object('standing','HLD','reason','external_transport_authority_unresolved');
  end if;
  if v_class='person_person' then
    select count(*) into v_count from public.c3_env_native_connection c
      where c.connection_key=v_ref and c.standing='active' and c.revoked_at is null
      and ((c.source_env_key=v_origin and c.target_env_key=v_target and c.source_relationship_key=v_asserted)
        or (c.target_env_key=v_origin and c.source_env_key=v_target and c.target_relationship_key=v_asserted));
    if v_count<>1 then
      return jsonb_build_object('standing','HLD','reason','personal_relation_or_actor_unresolved');
    end if;
    select * into v_connection from public.c3_env_native_connection where connection_key=v_ref;
    if v_transport<>'personal_e2ee' or v_payload_class<>'e2ee_ciphertext'
      or v_audience<>'participant' then
      return jsonb_build_object('standing','HLD','reason','personal_e2ee_or_optics_boundary');
    end if;
    v_actor:=v_asserted; v_optics:='participants_only';
  elsif v_class='person_initiative' then
    if v_transport<>'registry_cancom_internal' or v_payload_class not in ('registry_custody_ref','none') then
      return jsonb_build_object('standing','HLD','reason','initiative_transport_or_optics_boundary');
    end if;
    if v_audience='operator' then
      -- The relation reference is an exact initiative key or first-class binding key.
      -- A participant relation cannot enter this branch as operator evidence.
      select count(*) into v_count from public.c3_initiative_operator_binding b
        join public.c3_operator_standing s on s.operator_standing_key=b.operator_standing_key
        join public.c3_named_individual_operator_binding n on n.relation_key=b.carrier_binding_key
      where (b.initiative_key=v_ref or b.initiative_operator_binding_key=v_ref)
        and (nullif(p_request->>'initiative_key','') is null or b.initiative_key=p_request->>'initiative_key')
        and b.binding_standing='active' and b.revoked_at is null
        and b.operator_role='operator' and b.operator_class='initiative_operator'
        and b.scope_class='initiative_scoped'
        and b.effect_ceiling in ('bounded_initiative_operation_only','private_operator_projection_only')
        and b.metadata->>'my_env_projection_allowed'='true'
        and b.metadata->>'my_env_projection_class'='operator'
        and b.metadata->>'target_environment_label'=v_target
        and s.standing='active' and s.standing_class='operator'
        and n.standing='active' and n.operator_standing_key=s.operator_standing_key
        and n.relation_class='carries_operator_standing'
        and v_asserted in (s.operator_identifier,n.named_individual_key);
      if v_count<>1 then
        return jsonb_build_object('standing','HLD','reason','HLD_OPERATOR_CONTEXT_UNRESOLVED');
      end if;
      select s.operator_identifier into v_actor
      from public.c3_initiative_operator_binding b
        join public.c3_operator_standing s on s.operator_standing_key=b.operator_standing_key
      where (b.initiative_key=v_ref or b.initiative_operator_binding_key=v_ref)
        and (nullif(p_request->>'initiative_key','') is null or b.initiative_key=p_request->>'initiative_key')
        and b.binding_standing='active' and b.revoked_at is null
        and s.standing='active' and v_asserted in (s.operator_identifier,
          (select n.named_individual_key from public.c3_named_individual_operator_binding n
           where n.relation_key=b.carrier_binding_key and n.standing='active'));
      v_optics:='operator_context';
    elsif v_audience='participant' then
      if v_ref !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        return jsonb_build_object('standing','HLD','reason','initiative_relation_ref_invalid');
      end if;
      select count(*) into v_count from public.c2_mdm_participation_relation p
        where p.participation_key=v_ref::uuid and p.standing='active' and p.revoked_at is null
        and p.passage_standing='c2_participation_granted'
        and p.source_env_key=v_origin and p.target_environment_key=v_target
        and p.participant_relationship_key=v_asserted
        and (nullif(p_request->>'initiative_key','') is null or p.initiative_key=p_request->>'initiative_key');
      if v_count<>1 then
        return jsonb_build_object('standing','HLD','reason','initiative_participation_or_actor_unresolved');
      end if;
      v_actor:=v_asserted; v_optics:='participant_relation_only';
    else
      return jsonb_build_object('standing','HLD','reason','initiative_transport_or_optics_boundary');
    end if;
  elsif v_class='ai_executor_passage' then
    if v_audience<>'direct_executor' or v_target<>'executor:'||v_asserted
      or v_transport<>'registry_cancom_internal' or v_payload_class<>'immutable_oar_payload'
      or p_request->>'return_route'<>'registry://cancom/oar1_return/'||v_ref then
      return jsonb_build_object('standing','HLD','reason','executor_passage_boundary');
    end if;
    v_pickup:=public.resolve_cancom_oar_pickup_v1('execution_instance',v_ref,v_asserted);
    if v_pickup->>'standing'<>'resolved_for_executor' then
      return jsonb_build_object('standing','HLD','reason','executor_authority_unresolved');
    end if;
    if v_origin<>'c3_field' then
      return jsonb_build_object('standing','HLD','reason','executor_origin_conflict');
    end if;
    v_actor:=v_asserted; v_optics:='executor_bounded';
  elsif v_class in ('person_institution','system_system') then
    select count(*) into v_count from public.c3ops_cancom_context_binding b
      join public.c3_envpac_capability_grant g on g.capability_key=b.capability_ref
      where b.relation_class=v_class and b.relation_ref=v_ref and b.standing='active'
        and b.origin_environment=v_origin and b.receiving_environment=v_target
        and b.asserted_sender=v_asserted and b.audience_role=v_audience
        and b.transport_adapter=v_transport and b.payload_custody_class=v_payload_class
        and g.standing='active';
    if v_count<>1 then
      return jsonb_build_object('standing','HLD','reason','explicit_non_person_relation_binding_required');
    end if;
    select * into v_binding from public.c3ops_cancom_context_binding b
      where b.relation_class=v_class and b.relation_ref=v_ref and b.standing='active';
    v_actor:=v_binding.resolved_actor; v_optics:=v_binding.audience_role;
  else
    return jsonb_build_object('standing','HLD','reason','relation_class_unsupported');
  end if;
  if v_class<>'ai_executor_passage' and (
    not exists(select 1 from public.c3_environment e where e.env_key=v_origin and e.is_active)
    or (v_class='person_person' and not exists(select 1 from public.c3_environment e where e.env_key=v_target and e.is_active))) then
    return jsonb_build_object('standing','HLD','reason','environment_inactive_or_unresolved');
  end if;
  return jsonb_build_object('standing','resolved_for_passage','relation_class',v_class,
    'relation_ref',v_ref,'asserted_sender',v_asserted,'resolved_actor',v_actor,
    'origin_environment',v_origin,'receiving_environment',v_target,
    'audience_role',v_audience,'transport_adapter',v_transport,
    'payload_custody_class',v_payload_class,'optics_state',v_optics,
    'return_route',p_request->>'return_route','authority_created',false,
    'relationship_created',false);
end; $$;
revoke all on function public.resolve_cancom_context_v1(jsonb) from public,anon,authenticated;
grant execute on function public.resolve_cancom_context_v1(jsonb) to service_role;


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
  v_provider_check jsonb;
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
 then
    return jsonb_build_object('standing','HLD','reason','queue_or_manifest_boundary');
  end if;

  v_provider_check := public.validate_cancom_custody_provider_v1(v_provider,v_a->>'canonical_payload_ref');
  if v_provider_check->>'standing'<>'admitted' then return v_provider_check; end if;

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

-- OAR 004 provider-neutral registrar delivery.
create or replace function public.register_cancom_oar_delivery_v1(
  p_manifest jsonb, p_passage jsonb, p_registrar text
) returns jsonb
language plpgsql volatile security invoker set search_path = ''
as $$
declare
  v_instance text := p_manifest->>'execution_instance';
  v_oar text := p_manifest->>'oar_key';
  v_executor text := p_manifest->>'executor_ref';
  v_operator text := p_manifest->>'operator_ref';
  v_cap public.c3_envpac_capability_grant%rowtype;
  v_executor_cap public.c3_envpac_capability_grant%rowtype;
  v_permissions jsonb;
  v_manifest_event text;
  v_wake_event text;
  v_queue text;
  v_required text;
  v_provider text := p_manifest->>'payload_custody_provider';
  v_provider_check jsonb;
begin
  if jsonb_typeof(p_manifest) <> 'object' or jsonb_typeof(p_passage) <> 'object' then
    return jsonb_build_object('standing','HLD','reason','invalid_manifest_or_passage');
  end if;
  foreach v_required in array array['oar_key','oar_type','execution_instance',
    'operator_ref','registrar_ref','executor_ref','objective_ref','authority_scope_ref',
    'passage_key','payload_custody_ref','payload_custody_provider','payload_revision_ref','serialization_basis',
    'integrity_value','expected_return_route','lifecycle_standing','registrar_capability_ref',
    'executor_capability_ref','operator_confirmed_at'] loop
    if nullif(btrim(p_manifest->>v_required),'') is null then
      return jsonb_build_object('standing','HLD','reason','missing_manifest_field','field',v_required);
    end if;
  end loop;
  if p_manifest->>'oar_type' <> 'oar2'
     or p_manifest->>'registrar_ref' <> p_registrar
     or p_manifest->>'passage_key' <> v_instance
     or p_manifest->>'lifecycle_standing' <> 'delivered_for_execution'
     or p_manifest->>'serialization_basis' <> 'utf8_raw_bytes_sha256'
     or p_manifest->>'integrity_value' !~ '^[0-9a-f]{64}$'
     or p_manifest->>'payload_revision_ref' <> 'sha256:'||(p_manifest->>'integrity_value')
     or v_provider !~ '^[a-z][a-z0-9_]*$'

     or p_manifest->>'expected_return_route' <> 'registry://cancom/oar1_return/'||v_instance
     or p_manifest->>'authority_scope_ref' <> 'capability:'||(p_manifest->>'executor_capability_ref')
     or coalesce(p_manifest->>'payload_bytes','') !~ '^[1-9][0-9]*$' then
    return jsonb_build_object('standing','HLD','reason','manifest_boundary_conflict');
  end if;

  v_provider_check := public.validate_cancom_custody_provider_v1(v_provider,p_manifest->>'payload_custody_ref');
  if v_provider_check->>'standing'<>'admitted' then return v_provider_check; end if;

  select * into v_cap from public.c3_envpac_capability_grant g
   where g.capability_key=p_manifest->>'registrar_capability_ref'
     and g.standing='active' and g.system_key='c3ops'
     and g.scope->>'actor_ref'=p_registrar
     and g.scope->>'execution_instance'=v_instance
     and g.scope->>'oar_key'=v_oar
     and g.scope->>'operator_ref'=v_operator;
  if not found or not (v_cap.scope->'allowed_actions' ? 'register_oar_delivery')
     or coalesce((v_cap.scope->>'operator_confirmed')::boolean,false) is not true
     or v_cap.scope->>'operator_confirmed_at' <> p_manifest->>'operator_confirmed_at' then
    return jsonb_build_object('standing','HLD','reason','registrar_capability_unresolved');
  end if;
  select * into v_executor_cap from public.c3_envpac_capability_grant g
   where g.capability_key=p_manifest->>'executor_capability_ref'
     and g.standing='active' and g.system_key='c3ops'
     and g.scope->>'executor_ref'=v_executor
     and g.scope->>'execution_instance'=v_instance
     and g.scope->>'oar_key'=v_oar
     and g.scope->>'process_key'='cancom_oar_delivery_retrieval_v1';
  if not found or not (v_executor_cap.scope->'allowed_actions' ? 'resolve_registry_manifest') then
    return jsonb_build_object('standing','HLD','reason','executor_capability_unresolved');
  end if;
  if not exists(select 1 from public.system_process_registry p
      where p.process_key='cancom_oar_delivery_retrieval_v1' and p.process_status='active') then
    return jsonb_build_object('standing','HLD','reason','process_not_active');
  end if;
  if exists(select 1 from public.system_oar_queue q
      where q.oar_key=v_oar or q.scope_key=v_instance) then
    return jsonb_build_object('standing','HLD','reason','oar_or_instance_already_registered');
  end if;
  foreach v_required in array array['passage_key','communication_type','origin_environment',
    'asserted_sender','resolved_actor','relation_ref','thread_ref','payload_ref',
    'payload_custody_ref','transport_adapter','receiving_environment','audience_role',
    'authority_scope_ref','integrity_basis','integrity_value','return_route',
    'evidence_state','optics_state','standing'] loop
    if nullif(btrim(p_passage->>v_required),'') is null then
      return jsonb_build_object('standing','HLD','reason','missing_passage_field','field',v_required);
    end if;
  end loop;
  if p_passage->>'passage_key' <> v_instance
     or p_passage->>'execution_instance' <> v_instance
     or p_passage->>'relation_ref' <> v_oar
     or p_passage->>'thread_ref' <> v_instance
     or p_passage->>'payload_ref' <> p_manifest->>'payload_custody_ref'
     or p_passage->>'payload_custody_ref' <> p_manifest->>'payload_custody_ref'
     or p_passage->>'integrity_basis' <> p_manifest->>'serialization_basis'
     or p_passage->>'integrity_value' <> p_manifest->>'integrity_value'
     or p_passage->>'authority_scope_ref' <> p_manifest->>'authority_scope_ref'
     or p_passage->>'return_route' <> p_manifest->>'expected_return_route'
     or p_passage->>'receiving_environment' <> 'executor:'||v_executor
     or p_passage->>'resolved_actor' <> p_registrar
     or p_passage->>'communication_type' <> 'oar2_execution_passage'
     or p_passage->>'optics_state' <> 'executor_bounded'
     or p_passage->>'standing' <> 'ready_for_executor_pickup'
     or p_passage->>'audience_role' <> 'direct_executor'
     or p_passage->>'evidence_state' <> 'ready_for_preflight' then
    return jsonb_build_object('standing','HLD','reason','passage_boundary_conflict');
  end if;

  v_queue := 'queue_'||v_instance;
  v_manifest_event := v_instance||':oar2:registry_manifest_delivery';
  v_wake_event := v_instance||':wake:001';
  v_permissions := jsonb_build_object(
    'executor_binding_mode','specific_executor','executor_ref',v_executor,
    'passage_key',v_instance,'capability_ref',v_executor_cap.capability_key,
    'required_capability',v_executor_cap.capability,
    'canonical_payload_ref',p_manifest->>'payload_custody_ref',
    'payload_custody_provider',v_provider,
    'canonical_sha256',p_manifest->>'integrity_value',
    'canonical_payload_bytes',(p_manifest->>'payload_bytes')::bigint,
    'serialization_basis','utf8_raw_bytes_sha256',
    'db_mutation',coalesce((v_executor_cap.scope->>'db_mutation_authorized')::boolean,false),
    'src_mutation',coalesce((v_executor_cap.scope->>'source_mutation_authorized')::boolean,false),
    'deploy',coalesce((v_executor_cap.scope->>'deployment_authorized')::boolean,false),
    'external_correspondence',coalesce((v_executor_cap.scope->>'external_correspondence_authorized')::boolean,false),
    'requires_oar1_return',true);

  insert into public.system_oar_queue(queue_key,process_key,oar_key,oar_type,queue_status,
    operator_key,system_key,scope_key,requested_action,execution_boundary,preflight_status,
    operator_confirmed_at,source_oar2_path,expected_oar1_path,automation_permissions)
  values(v_queue,'cancom_oar_delivery_retrieval_v1',v_oar,'oar2','approved_for_execution',
    v_operator,'c3ops',v_instance,p_manifest->>'objective_ref',
    coalesce(p_manifest->>'execution_boundary','bounded_oar_execution'),
    'passed',(p_manifest->>'operator_confirmed_at')::timestamptz,
    'registry://cancom/oar2/'||v_oar,
    p_manifest->>'expected_return_route',v_permissions);
  insert into public.c3ops_oar_custody_resolution_event(
    resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,
    retrieval_access_rule,related_execution_instance,related_oar2,resolution_status,metadata)
  values(v_manifest_event,'oar_custody_resolution_v1',v_oar,'oar2','c3ops',
    'registry_manifest_delivery','delivered_for_execution',p_manifest->>'integrity_value',
    'registry_manifest_with_immutable_source_payload',p_manifest->>'payload_custody_ref',
    'resolve_by:oar_key|'||v_oar||';passage|'||v_instance||';execution|'||v_instance,
    v_instance,v_oar,'resolved',
    p_manifest || jsonb_build_object('manifest_key',v_oar,
      'payload_custody_provider',v_provider));
  insert into public.c3ops_cancom_notification_event(
    event_key,event_type,source_system,source_object_type,source_object_key,
    actor_key,standing,requires_operator_attention,summary,evidence)
  values(v_wake_event,'executor_wake_ready','cancom','oar2_execution_instance',
    v_instance,v_executor,'ready_for_executor_pickup',false,
    'Registry-resolved CanCom OAR passage ready for executor pickup.',
    p_passage || jsonb_build_object('oar_key',v_oar,'queue_key',v_queue));
  return jsonb_build_object('standing','delivered_for_execution','queue_key',v_queue,
    'manifest_event_key',v_manifest_event,'wake_event_key',v_wake_event,
    'execution_instance',v_instance,'oar_key',v_oar);
end;
$$;

revoke all on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text) from public, anon, authenticated;
grant execute on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text) to service_role;

-- Return manifest fields fail closed before any lifecycle write.
create or replace function public.register_cancom_oar_return_v1(
  p_execution_instance text, p_executor text, p_oar1_key text,
  p_integrity_sha256 text, p_custody_reference text,
  p_return_standing text, p_evidence jsonb
) returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_pickup jsonb;
  v_q public.system_oar_queue%rowtype;
  v_p public.c3_oar_process_instance%rowtype;
  v_key text;
  v_db text;
  v_src text;
  v_deploy text;
  v_started timestamptz;
  v_finished timestamptz := now();
  v_held boolean;
begin
  v_pickup := public.resolve_cancom_oar_pickup_v1('execution_instance',p_execution_instance,p_executor);
  if v_pickup->>'standing' <> 'resolved_for_executor' then
    return jsonb_build_object('standing','HLD','reason','pickup_preflight_failed','pickup',v_pickup);
  end if;
  if exists(select 1 from public.system_oar_queue q
    where q.queue_key=v_pickup->>'queue_key'
      and q.automation_permissions->>'model_resolution_evidence_required'='true')
    and (not exists(select 1 from public.system_process_registry r
      where r.process_key='oar1_model_resolution_return_contract_v1' and r.process_status='active')
      or not public.validate_cancom_model_resolution_evidence_v1(
        p_evidence->'model_resolution_evidence')) then
    return jsonb_build_object('standing','HLD','reason','HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED');
  end if;
  if nullif(btrim(p_oar1_key),'') is null or nullif(btrim(p_custody_reference),'') is null
    or p_integrity_sha256 !~ '^[0-9a-f]{64}$'
    or p_return_standing not in ('returned_for_registrar_review','held_for_registrar_review')
    or jsonb_typeof(p_evidence) is distinct from 'object'
    or nullif(p_evidence->>'execution_summary','') is null
    or nullif(p_evidence->>'validation_summary','') is null
    or p_evidence->>'origin_oar2_key' is distinct from v_pickup->>'oar_key'
    or p_evidence->>'canonical_payload_ref' is distinct from v_pickup->>'payload_custody_ref'
    or p_evidence->>'canonical_sha256' is distinct from v_pickup->>'sha256' then
    return jsonb_build_object('standing','HLD','reason','invalid_return_manifest');
  end if;
  v_db := p_evidence->>'db_mutation_standing';
  v_src := p_evidence->>'src_mutation_standing';
  v_deploy := p_evidence->>'deploy_standing';
  if v_db is null or v_src is null or v_deploy is null
    or v_db not in ('not_applicable','mutated','held','failed')
    or v_src not in ('not_applicable','mutated','held','failed')
    or v_deploy not in ('not_authorized','not_applicable','configured','deployed','held','failed')
    or (v_deploy='deployed' and v_pickup->>'deployment_authorized' <> 'true')
    or coalesce(p_evidence->>'external_messages_sent','') !~ '^[0-9]+$' then
    return jsonb_build_object('standing','HLD','reason','mutation_standing_invalid');
  end if;
  if v_pickup->>'external_correspondence_authorized' <> 'true'
    and (p_evidence->>'external_messages_sent')::integer <> 0 then
    return jsonb_build_object('standing','HLD','reason','external_effect_boundary');
  end if;
  v_held := p_return_standing='held_for_registrar_review';
  if v_held and nullif(p_evidence->>'hold_reason','') is null then
    return jsonb_build_object('standing','HLD','reason','missing_hold_reason');
  end if;
  select * into v_q from public.system_oar_queue where queue_key=v_pickup->>'queue_key' for update;
  select * into v_p from public.c3_oar_process_instance where process_instance_key=p_execution_instance for update;
  if not found or v_p.source_oar2_path <> v_q.source_oar2_path
    or v_p.expected_oar1_path <> v_q.expected_oar1_path
    or v_q.queue_status not in ('approved_for_execution','executing')
    or v_p.execution_standing not in ('queued','executing') then
    return jsonb_build_object('standing','HLD','reason','lifecycle_boundary_conflict');
  end if;
  v_key := p_execution_instance||':oar1:'||p_oar1_key;
  if exists(select 1 from public.c3ops_oar_custody_resolution_event where resolution_event_key=v_key)
    or exists(select 1 from public.c3_oar_transition_event where transition_event_key=p_execution_instance||':oar1_return')
    or exists(select 1 from public.system_oar_execution_evidence where evidence_key=p_execution_instance||':oar1_return') then
    return jsonb_build_object('standing','HLD','reason','return_already_registered');
  end if;
  v_started := coalesce(v_q.execution_started_at, v_finished);
  insert into public.c3ops_oar_custody_resolution_event(
    resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,
    retrieval_access_rule,related_execution_instance,related_oar1,related_oar2,
    resolution_status,hold_reason,metadata)
  values(v_key,'oar_custody_resolution_v1',p_oar1_key,'oar1',v_q.system_key,
    'cancom_oar_return',p_return_standing,p_integrity_sha256,'registry_return_manifest',
    p_custody_reference,'resolve_by:execution:'||p_execution_instance,
    p_execution_instance,p_oar1_key,v_q.oar_key,
    case when v_held then 'held' else 'resolved' end,
    case when v_held then p_evidence->>'hold_reason' else null end,
    jsonb_build_object('oar_key',p_oar1_key,'oar_type','oar1','execution_instance',p_execution_instance,
      'passage_key',p_execution_instance,'origin_oar2_key',v_q.oar_key,
      'origin_manifest_event_key',v_pickup->>'manifest_event_key',
      'origin_wake_event_key',v_pickup->>'wake_event_key',
      'executor_ref',p_executor,'authority_scope_ref',v_pickup->>'authority_scope_ref',
      'payload_custody_ref',p_custody_reference,'serialization_basis','utf8_raw_bytes_sha256',
      'integrity_value',p_integrity_sha256,'expected_return_route',v_pickup->>'return_route',
      'lifecycle_standing',p_return_standing,'evidence',p_evidence));
  update public.system_oar_queue set queue_status='oar1_submitted',
    execution_started_at=v_started,execution_completed_at=v_finished,
    db_mutation_standing=v_db,src_mutation_standing=v_src,deploy_standing=v_deploy,
    oar1_path=v_pickup->>'return_route',
    execution_summary=p_evidence->>'execution_summary',updated_at=v_finished
    where queue_key=v_q.queue_key;
  update public.c3_oar_process_instance set actual_oar1_path=v_pickup->>'return_route',
    evidence_path='registry://c3ops_oar_custody_resolution_event/'||v_key,
    execution_standing=case when v_held then 'held' else 'completed' end,
    validation_standing='chazz_review_required',
    held_standing=case when v_held then 'held_pending_validation' else null end,
    validation_finding=p_evidence->>'validation_summary',
    execution_result=p_evidence->>'execution_summary',updated_at=v_finished
    where process_instance_key=p_execution_instance;
  insert into public.c3_oar_transition_event(transition_event_key,process_instance_key,actor,
    from_status,to_status,transition_type,"timestamp",evidence_reference,notes)
  values(p_execution_instance||':oar1_return',p_execution_instance,p_executor,
    v_p.execution_standing,case when v_held then 'held' else 'completed' end,
    case when v_held then 'held' else 'execution' end,v_finished,
    'registry://c3ops_oar_custody_resolution_event/'||v_key,
    'Registry-bound OAR1 return; Registrar review required.');
  insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,
    evidence_summary,validation_result,artifact_path)
  values(p_execution_instance||':oar1_return',v_q.queue_key,'runtime_validation',
    p_evidence->>'validation_summary',p_evidence,
    'registry://c3ops_oar_custody_resolution_event/'||v_key);
  return jsonb_build_object('standing',p_return_standing,'return_event_key',v_key,
    'origin_oar2_key',v_q.oar_key,'execution_instance',p_execution_instance,
    'passage_key',p_execution_instance,'return_route',v_pickup->>'return_route',
    'lifecycle_rails',jsonb_build_array('system_oar_queue','c3_oar_process_instance',
      'c3_oar_transition_event','system_oar_execution_evidence','c3ops_oar_custody_resolution_event'));
end; $$;

revoke all on function public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb) from public,anon,authenticated;
grant execute on function public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb) to service_role;
