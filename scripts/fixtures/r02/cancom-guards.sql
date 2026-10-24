-- SOURCE CANDIDATE ONLY. Installation requires a separately qualified OAR2.
begin;
create or replace function public.cancom_bound_actor_v1() returns text
language plpgsql stable security invoker set search_path='' as $$
begin
  if current_user <> 'service_role' then return null; end if;
  return nullif(current_setting('request.jwt.claims',true)::jsonb #>> '{app_metadata,c3_actor_ref}','');
exception when others then return null;
end $$;
create or replace function public.cancom_finite_grant_v1(p_scope jsonb) returns boolean
language plpgsql volatile security invoker set search_path='' as $$
begin
  return coalesce(coalesce(p_scope->>'revoked_at','')='' and
    coalesce((p_scope->>'operator_confirmed')::boolean,false) and
    (p_scope->>'expires_at')::timestamptz > clock_timestamp() and
    (p_scope->>'operator_confirmed_at')::timestamptz <= clock_timestamp(),false);
exception when others then return false;
end $$;
CREATE OR REPLACE FUNCTION public.resolve_cancom_oar_pickup_v1(p_key_type text, p_key text, p_executor text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
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
  if public.cancom_bound_actor_v1() is null or public.cancom_bound_actor_v1() is distinct from p_executor then return jsonb_build_object('standing','HLD','reason','held_identity_or_authority_mismatch'); end if;

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
  if not found or v_cap.scope->>'source_ref' is distinct from v_a->>'canonical_payload_ref' or v_cap.scope->>'source_sha256' is distinct from v_a->>'canonical_sha256' or v_cap.scope->>'source_bytes' is distinct from v_a->>'canonical_payload_bytes' or not public.cancom_finite_grant_v1(v_cap.scope) or not (v_cap.scope->'allowed_actions' ?& array['resolve_registry_manifest',
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
$function$
;
CREATE OR REPLACE FUNCTION public.register_cancom_oar_delivery_v1(p_manifest jsonb, p_passage jsonb, p_registrar text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_oar text;
  v_instance text;
  v_n integer;
  v_q public.system_oar_queue%rowtype;
  v_manifest_event public.c3ops_oar_custody_resolution_event%rowtype;
  v_wake public.c3ops_cancom_notification_event%rowtype;
  v_process public.c3_oar_process_instance%rowtype;
  v_transition public.c3_oar_transition_event%rowtype;
  v_manifest_expected jsonb;
  v_passage_expected jsonb;
begin
  if public.cancom_bound_actor_v1() is null or public.cancom_bound_actor_v1() is distinct from p_registrar then return jsonb_build_object('standing','HLD','reason','held_identity_or_authority_mismatch'); end if;

  if jsonb_typeof(p_manifest) is distinct from 'object'
     or jsonb_typeof(p_passage) is distinct from 'object' then
    return jsonb_build_object('standing','HLD','reason','invalid_delivery_manifest');
  end if;

  v_oar:=nullif(p_manifest->>'oar_key','');
  v_instance:=nullif(p_manifest->>'execution_instance','');

  if v_oar is null or v_instance is null then
    return jsonb_build_object('standing','HLD','reason','invalid_delivery_manifest');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_delivery_oar|'||v_oar,0)
  );
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_delivery_instance|'||v_instance,0)
  );

  select count(*) into v_n
  from public.system_oar_queue q
  where q.oar_key=v_oar or q.scope_key=v_instance;

  if v_n=0 then
    if exists(
         select 1 from public.c3ops_oar_custody_resolution_event
         where resolution_event_key=v_instance||':oar2:registry_manifest_delivery'
       )
       or exists(
         select 1 from public.c3ops_cancom_notification_event
         where event_key=v_instance||':wake:001'
       )
       or exists(
         select 1 from public.c3_oar_process_instance
         where process_instance_key=v_instance
       )
       or exists(
         select 1 from public.c3_oar_transition_event
         where transition_event_key=v_instance||':register_and_queue'
       ) then
      return jsonb_build_object(
        'standing','HLD',
        'reason','delivery_retry_partial_state',
        'execution_instance',v_instance,
        'oar_key',v_oar
      );
    end if;

    
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
     and g.scope->>'operator_ref'=v_operator for share;
  if not found or not public.cancom_finite_grant_v1(v_cap.scope) or not (v_cap.scope->'allowed_actions' ? 'register_oar_delivery')
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
     and g.scope->>'process_key'='cancom_oar_delivery_retrieval_v1' for share;
  if not found or not public.cancom_finite_grant_v1(v_executor_cap.scope) or not (v_executor_cap.scope->'allowed_actions' ? 'resolve_registry_manifest') then
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
    'requires_oar1_return',true,'computational_acceptance',v_executor_cap.scope->'computational_acceptance');
  if v_executor_cap.scope->'model_resolution_policy'->>'oar1_model_resolution_evidence_required'='true' then
    if nullif(btrim(v_executor_cap.scope->'execution_profile'->>'minimum_capability_floor'),'') is null then
      return jsonb_build_object('standing','HLD','reason','model_execution_profile_unresolved');
    end if;
    v_permissions := v_permissions || jsonb_build_object(
      'execution_profile_process','oar_execution_profile_model_resolution_v1',
      'model_resolution_evidence_required',true,
      'minimum_capability_floor',v_executor_cap.scope->'execution_profile'->>'minimum_capability_floor');
  end if;

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
  insert into public.c3_oar_process_instance(
    process_instance_key,source_oar2_path,source_oar2_standing,expected_oar1_path,
    evidence_path,lifecycle_type,execution_standing,validation_standing,deploy_standing,
    seeded_reference_standing,validation_finding)
  values(v_instance,'registry://cancom/oar2/'||v_oar,'confirmed',
    p_manifest->>'expected_return_route',
    'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event,
    'valid','queued','pending_validation','held','seeded',
    'Registrar delivery registered; executor preflight pending.');
  insert into public.c3_oar_transition_event(
    transition_event_key,process_instance_key,actor,from_status,to_status,
    transition_type,"timestamp",evidence_reference,notes)
  values(v_instance||':register_and_queue',v_instance,p_registrar,'not_queued','queued',
    'queue',now(),'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event,
    'Registry manifest, CanCom passage, and process instance registered together.');
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

  end if;

  if v_n<>1 then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  select * into v_q
  from public.system_oar_queue q
  where q.oar_key=v_oar or q.scope_key=v_instance;

  if v_q.oar_key is distinct from v_oar
     or v_q.scope_key is distinct from v_instance then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  select * into v_manifest_event
  from public.c3ops_oar_custody_resolution_event
  where resolution_event_key=v_instance||':oar2:registry_manifest_delivery';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_wake
  from public.c3ops_cancom_notification_event
  where event_key=v_instance||':wake:001';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_process
  from public.c3_oar_process_instance
  where process_instance_key=v_instance;

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  select * into v_transition
  from public.c3_oar_transition_event
  where transition_event_key=v_instance||':register_and_queue';

  if not found then
    return jsonb_build_object('standing','HLD','reason','delivery_retry_partial_state',
      'execution_instance',v_instance,'oar_key',v_oar);
  end if;

  v_manifest_expected:=p_manifest||jsonb_build_object(
    'manifest_key',v_oar,
    'payload_custody_provider',p_manifest->>'payload_custody_provider'
  );
  v_passage_expected:=p_passage||jsonb_build_object(
    'oar_key',v_oar,
    'queue_key',v_q.queue_key
  );

  if p_registrar is distinct from p_manifest->>'registrar_ref'
     or v_q.queue_key is distinct from 'queue_'||v_instance
     or v_q.source_oar2_path is distinct from 'registry://cancom/oar2/'||v_oar
     or v_q.expected_oar1_path is distinct from p_manifest->>'expected_return_route'
     or v_manifest_event.object_identifier is distinct from v_oar
     or v_manifest_event.object_type is distinct from 'oar2'
     or v_manifest_event.related_execution_instance is distinct from v_instance
     or v_manifest_event.related_oar2 is distinct from v_oar
     or v_manifest_event.standing is distinct from 'delivered_for_execution'
     or v_manifest_event.integrity_hash is distinct from p_manifest->>'integrity_value'
     or v_manifest_event.custody_reference is distinct from p_manifest->>'payload_custody_ref'
     or v_manifest_event.metadata is distinct from v_manifest_expected
     or v_wake.source_object_key is distinct from v_instance
     or v_wake.actor_key is distinct from p_manifest->>'executor_ref'
     or v_wake.event_type is distinct from 'executor_wake_ready'
     or v_wake.evidence is distinct from v_passage_expected
     or v_process.source_oar2_path is distinct from v_q.source_oar2_path
     or v_process.expected_oar1_path is distinct from v_q.expected_oar1_path
     or v_transition.process_instance_key is distinct from v_instance
     or v_transition.evidence_reference is distinct from
          'registry://c3ops_oar_custody_resolution_event/'||v_manifest_event.resolution_event_key then
    return jsonb_build_object(
      'standing','HLD','reason','delivery_retry_conflict',
      'execution_instance',v_instance,'oar_key',v_oar
    );
  end if;

  return jsonb_build_object(
    'standing','delivered_for_execution',
    'queue_key',v_q.queue_key,
    'manifest_event_key',v_manifest_event.resolution_event_key,
    'wake_event_key',v_wake.event_key,
    'execution_instance',v_instance,
    'oar_key',v_oar,
    'current_queue_status',v_q.queue_status,
    'idempotent',true
  );
end $function$
;
CREATE OR REPLACE FUNCTION public.register_cancom_oar_return_v1(p_execution_instance text, p_executor text, p_oar1_key text, p_integrity_sha256 text, p_custody_reference text, p_return_standing text, p_evidence jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_q public.system_oar_queue%rowtype;
  v_process public.c3_oar_process_instance%rowtype;
  v_event public.c3ops_oar_custody_resolution_event%rowtype;
  v_transition public.c3_oar_transition_event%rowtype;
  v_exec_evidence public.system_oar_execution_evidence%rowtype;
  v_q_count integer;
  v_event_count integer;
  v_has_return_state boolean:=false;
  v_event_key text;
  v_event_ref text;
  v_expected_execution_standing text;
begin
  if public.cancom_bound_actor_v1() is null or public.cancom_bound_actor_v1() is distinct from p_executor then return jsonb_build_object('standing','HLD','reason','held_identity_or_authority_mismatch'); end if;

  if nullif(btrim(coalesce(p_execution_instance,'')),'') is null then
    return jsonb_build_object('standing','HLD','reason','invalid_return_manifest');
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('cancom_oar1_return|'||p_execution_instance,0)
  );

  select count(*) into v_q_count
  from public.system_oar_queue
  where scope_key=p_execution_instance;

  if v_q_count=1 then
    select * into v_q
    from public.system_oar_queue
    where scope_key=p_execution_instance;

    select * into v_process
    from public.c3_oar_process_instance
    where process_instance_key=p_execution_instance;

    v_has_return_state :=
      v_q.queue_status in ('oar1_submitted','completed','closed')
      or v_q.oar1_path is not null
      or (found and v_process.actual_oar1_path is not null);
  elsif v_q_count>1 then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_conflict',
      'execution_instance',p_execution_instance
    );
  end if;

  select count(*) into v_event_count
  from public.c3ops_oar_custody_resolution_event
  where object_type='oar1'
    and intended_function='cancom_oar_return'
    and related_execution_instance=p_execution_instance;

  if v_event_count>0
     or exists(
       select 1 from public.c3_oar_transition_event
       where transition_event_key=p_execution_instance||':oar1_return'
     )
     or exists(
       select 1 from public.system_oar_execution_evidence
       where evidence_key=p_execution_instance||':oar1_return'
     ) then
    v_has_return_state:=true;
  end if;

  if not v_has_return_state then
    
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
  if nullif(p_evidence->>'oar1_text','') is null or
    encode(sha256(convert_to(p_evidence->>'oar1_text','UTF8')),'hex') is distinct from p_integrity_sha256
    or octet_length(convert_to(p_evidence->>'oar1_text','UTF8'))::text is distinct from p_evidence->>'oar1_bytes' then
    return jsonb_build_object('standing','HLD','reason','independent_report_integrity_failed');
  end if;

  v_pickup := public.resolve_cancom_oar_pickup_v1('execution_instance',p_execution_instance,p_executor);
  if v_pickup->>'standing' <> 'resolved_for_executor' then
    return jsonb_build_object('standing','HLD','reason','pickup_preflight_failed','pickup',v_pickup);
  end if;
  perform 1 from public.c3_envpac_capability_grant g
    where g.capability_key=v_pickup->>'capability_ref' for share;
  if p_custody_reference is distinct from v_pickup->>'return_route'
    or not exists(select 1 from public.c3_envpac_capability_grant g
      where g.capability_key=v_pickup->>'capability_ref' and g.standing='active'
      and public.cancom_finite_grant_v1(g.scope)
      and g.scope->'allowed_actions' ? 'return_oar1_evidence') then
    return jsonb_build_object('standing','HLD','reason','return_route_or_action_mismatch');
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
end;

  end if;

  if v_q_count<>1 or v_event_count<>1 then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance
    );
  end if;

  select * into v_process
  from public.c3_oar_process_instance
  where process_instance_key=p_execution_instance;
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  select * into v_event
  from public.c3ops_oar_custody_resolution_event
  where object_type='oar1'
    and intended_function='cancom_oar_return'
    and related_execution_instance=p_execution_instance;

  select * into v_transition
  from public.c3_oar_transition_event
  where transition_event_key=p_execution_instance||':oar1_return';
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  select * into v_exec_evidence
  from public.system_oar_execution_evidence
  where evidence_key=p_execution_instance||':oar1_return';
  if not found then
    return jsonb_build_object('standing','HLD','reason','return_retry_partial_state',
      'execution_instance',p_execution_instance);
  end if;

  v_event_key:=p_execution_instance||':oar1:'||p_oar1_key;
  v_event_ref:='registry://c3ops_oar_custody_resolution_event/'||v_event.resolution_event_key;
  v_expected_execution_standing:=
    case when p_return_standing='held_for_registrar_review' then 'held' else 'completed' end;

  if v_event.resolution_event_key is distinct from v_event_key
     or v_event.object_identifier is distinct from p_oar1_key
     or v_event.related_oar1 is distinct from p_oar1_key
     or v_event.related_oar2 is distinct from v_q.oar_key
     or v_event.integrity_hash is distinct from p_integrity_sha256
     or v_event.custody_reference is distinct from p_custody_reference
     or v_event.standing is distinct from p_return_standing
     or v_event.metadata->>'executor_ref' is distinct from p_executor
     or v_event.metadata->>'origin_oar2_key' is distinct from v_q.oar_key
     or v_event.metadata->>'expected_return_route' is distinct from v_q.expected_oar1_path
     or v_event.metadata->'evidence' is distinct from p_evidence
     or v_q.oar1_path is distinct from v_q.expected_oar1_path
     or v_q.queue_status not in ('oar1_submitted','completed','closed')
     or v_process.actual_oar1_path is distinct from v_q.expected_oar1_path
     or v_process.evidence_path is distinct from v_event_ref
     or v_process.execution_standing is distinct from v_expected_execution_standing
     or v_transition.process_instance_key is distinct from p_execution_instance
     or v_transition.evidence_reference is distinct from v_event_ref
     or v_exec_evidence.queue_key is distinct from v_q.queue_key
     or v_exec_evidence.validation_result is distinct from p_evidence
     or v_exec_evidence.artifact_path is distinct from v_event_ref then
    return jsonb_build_object(
      'standing','HLD','reason','return_retry_conflict',
      'execution_instance',p_execution_instance,
      'existing_return_event_key',v_event.resolution_event_key
    );
  end if;

  return jsonb_build_object(
    'standing',v_event.standing,
    'return_event_key',v_event.resolution_event_key,
    'origin_oar2_key',v_q.oar_key,
    'execution_instance',p_execution_instance,
    'passage_key',p_execution_instance,
    'return_route',v_q.expected_oar1_path,
    'current_queue_status',v_q.queue_status,
    'current_execution_standing',v_process.execution_standing,
    'idempotent',true,
    'lifecycle_rails',jsonb_build_array(
      'system_oar_queue','c3_oar_process_instance','c3_oar_transition_event',
      'system_oar_execution_evidence','c3ops_oar_custody_resolution_event'
    )
  );
end $function$
;

revoke all on function public.cancom_bound_actor_v1(), public.cancom_finite_grant_v1(jsonb) from public,anon,authenticated;
grant execute on function public.cancom_bound_actor_v1(), public.cancom_finite_grant_v1(jsonb) to service_role;
revoke all on function public.register_cancom_oar_delivery_v1_core(jsonb,jsonb,text),public.register_cancom_oar_return_v1_core(text,text,text,text,text,text,jsonb) from public,anon,authenticated,service_role;
revoke all on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) from public,anon,authenticated;
grant execute on function public.register_cancom_oar_delivery_v1(jsonb,jsonb,text),public.register_cancom_oar_return_v1(text,text,text,text,text,text,jsonb),public.resolve_cancom_oar_pickup_v1(text,text,text) to service_role;
