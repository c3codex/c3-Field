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

-- Part of the R02 source candidate. No new tables or state vocabulary.
-- The installation must separately normalize the registered process mode and
-- qualify trusted verifier identities and exact acceptance contracts in grants.
create or replace function public.resolve_cancom_oar_disposition_v1(
  p_execution_instance text,p_validator_capability text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  q public.system_oar_queue%rowtype;
  p public.c3_oar_process_instance%rowtype;
  c public.c3ops_oar_custody_resolution_event%rowtype;
  g public.c3_envpac_capability_grant%rowtype;
  x public.c3_envpac_capability_grant%rowtype;
  r public.system_oar_execution_evidence%rowtype;
  old public.system_oar_execution_evidence%rowtype;
  actor text:=public.cancom_bound_actor_v1();
  contract jsonb; objective jsonb; receipt jsonb; decisions jsonb:='[]';
  holds jsonb:='[]'; classification text; disposition jsonb;
  all_pass boolean:=true; escalated boolean:=false; effect text;
  k text; matched integer; report_hash text; final_key text;
begin
  -- Serialize against native return as well as another validator. A crash rolls
  -- back the whole SQL statement; no durable half-finalization is acknowledged.
  perform pg_advisory_xact_lock(hashtextextended('cancom_oar1_return|'||p_execution_instance,0));
  select * into q from public.system_oar_queue where scope_key=p_execution_instance for update;
  if not found then return jsonb_build_object('standing','HLD','reason','missing_exact_instance'); end if;
  select * into g from public.c3_envpac_capability_grant where capability_key=p_validator_capability for share;
  if actor is null or g.standing is distinct from 'active'
    or not coalesce(public.cancom_finite_grant_v1(g.scope),false)
    or g.scope->>'actor_ref' is distinct from actor
    or g.scope->>'execution_instance' is distinct from p_execution_instance
    or g.scope->>'oar_key' is distinct from q.oar_key
    or g.scope->>'process_key' is distinct from 'oar_lifecycle_resolution_v1'
    or not coalesce(g.scope->'allowed_actions' ? 'finalize_oar_disposition',false)
    or actor=q.automation_permissions->>'executor_ref' then
    return jsonb_build_object('standing','HLD','reason','held_identity_or_authority_mismatch');
  end if;
  if not exists(select 1 from public.system_process_registry z where
    z.process_key='oar_lifecycle_resolution_v1' and z.process_status='active'
    and z.metadata->>'postreturn_mode'='computational_original_oar2'
    and nullif(z.metadata->>'computational_policy_source_ref','') is not null) then
    return jsonb_build_object('standing','HLD','reason','registered_computational_policy_not_operative');
  end if;
  contract:=q.automation_permissions->'computational_acceptance';
  if jsonb_typeof(contract->'objectives') is distinct from 'array'
    or jsonb_array_length(contract->'objectives')=0
    or contract->>'original_oar2_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or contract->>'policy' is distinct from 'original_oar2_acceptance_v1' then
    return jsonb_build_object('standing','HLD','reason','acceptance_contract_not_qualified');
  end if;
  if (select count(*) from jsonb_array_elements(contract->'objectives')) <>
    (select count(distinct value->>'effect_key') from jsonb_array_elements(contract->'objectives')) then
    return jsonb_build_object('standing','HLD','reason','ambiguous_effect_identity');
  end if;
  select * into x from public.c3_envpac_capability_grant where capability_key=q.automation_permissions->>'capability_ref' for share;
  if x.standing is distinct from 'active' or not coalesce(public.cancom_finite_grant_v1(x.scope),false)
    or x.scope->>'execution_instance' is distinct from p_execution_instance
    or x.scope->>'oar_key' is distinct from q.oar_key
    or x.scope->>'executor_ref' is distinct from q.automation_permissions->>'executor_ref'
    or x.scope->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or x.scope->>'source_ref' is distinct from q.automation_permissions->>'canonical_payload_ref'
    or x.scope->>'source_bytes' is distinct from q.automation_permissions->>'canonical_payload_bytes'
    or x.scope->'computational_acceptance' is distinct from contract then
    return jsonb_build_object('standing','HLD','reason','original_authority_unresolved');
  end if;
  if not exists(select 1 from public.c3ops_notchazz_oar_formation_evaluation n where
    n.execution_instance=p_execution_instance and n.oar_key=q.oar_key and n.result='PASS'
    and n.standing='active' and n.evaluator='notchazz'
    and n.oar_integrity_sha256=q.automation_permissions->>'canonical_sha256'
    and n.unresolved_predicates='[]'::jsonb) then
    return jsonb_build_object('standing','HLD','reason','independent_notchazz_missing');
  end if;
  if not exists(select 1 from public.c3ops_oar_custody_resolution_event m where
    m.resolution_event_key=p_execution_instance||':oar2:registry_manifest_delivery'
    and m.object_type='oar2' and m.object_identifier=q.oar_key
    and m.related_execution_instance=p_execution_instance
    and m.custody_reference=q.automation_permissions->>'canonical_payload_ref'
    and m.integrity_hash=q.automation_permissions->>'canonical_sha256'
    and m.metadata->>'payload_bytes'=q.automation_permissions->>'canonical_payload_bytes'
    and m.standing='delivered_for_execution' and m.resolution_status='resolved')
    or not exists(select 1 from public.c3ops_cancom_notification_event n where
      n.event_key=p_execution_instance||':wake:001' and n.actor_key=q.automation_permissions->>'executor_ref'
      and n.evidence->>'oar_key'=q.oar_key and n.evidence->>'queue_key'=q.queue_key
      and n.evidence->>'return_route'=q.expected_oar1_path) then
    return jsonb_build_object('standing','HLD','reason','delivery_source_or_route_unresolved');
  end if;
  select count(*) into matched from public.c3ops_oar_custody_resolution_event where
    related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  if matched<>1 then return jsonb_build_object('standing','HLD','reason','return_missing_or_ambiguous'); end if;
  select * into c from public.c3ops_oar_custody_resolution_event where
    related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  report_hash:=encode(sha256(convert_to(c.metadata->'evidence'->>'oar1_text','UTF8')),'hex');
  if report_hash is null or c.integrity_hash is distinct from report_hash
    or octet_length(convert_to(c.metadata->'evidence'->>'oar1_text','UTF8'))::text is distinct from c.metadata->'evidence'->>'oar1_bytes'
    or c.metadata->>'executor_ref' is distinct from q.automation_permissions->>'executor_ref'
    or c.metadata->'evidence'->>'canonical_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or c.metadata->'evidence'->>'canonical_payload_ref' is distinct from q.automation_permissions->>'canonical_payload_ref'
    or c.metadata->'evidence'->>'origin_oar2_key' is distinct from q.oar_key
    or c.custody_reference is distinct from q.expected_oar1_path
    or q.oar1_path is distinct from q.expected_oar1_path
    or q.expected_oar1_path is distinct from 'registry://cancom/oar1_return/'||p_execution_instance then
    return jsonb_build_object('standing','HLD','reason','return_binding_or_digest_failed');
  end if;
  select * into p from public.c3_oar_process_instance where process_instance_key=p_execution_instance for update;
  if not found or p.actual_oar1_path is distinct from q.oar1_path or p.execution_standing<>'completed' then
    return jsonb_build_object('standing','HLD','reason','return_process_incomplete');
  end if;
  if not exists(select 1 from public.c3_oar_transition_event t where
    t.transition_event_key=p_execution_instance||':oar1_return'
    and t.process_instance_key=p_execution_instance and t.actor=q.automation_permissions->>'executor_ref'
    and t.to_status=p.execution_standing
    and t.evidence_reference='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key)
    or not exists(select 1 from public.system_oar_execution_evidence e where
      e.evidence_key=p_execution_instance||':oar1_return' and e.queue_key=q.queue_key
      and e.validation_result=c.metadata->'evidence'
      and e.artifact_path='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key) then
    return jsonb_build_object('standing','HLD','reason','immutable_return_linkage_incomplete');
  end if;
  -- Contract objectives, not a caller's desired-effects list, drive adjudication.
  for objective in select value from jsonb_array_elements(contract->'objectives') loop
    effect:=objective->>'effect_key'; classification:='HOLD_UNVERIFIED'; receipt:=null;
    if nullif(effect,'') is null or objective->>'effect_class' not in ('inspection','implementation')
      or nullif(objective->>'action','') is null or nullif(objective->>'environment','') is null
      or nullif(objective->>'source_revision','') is null or nullif(objective->>'runtime_revision','') is null
      or jsonb_typeof(objective->'required_predicates') is distinct from 'array'
      or jsonb_array_length(objective->'required_predicates')=0 then
      holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','acceptance_predicates_unqualified'));
    else
      select * into r from public.system_oar_execution_evidence where
        queue_key=q.queue_key and evidence_key=p_execution_instance||':acceptance:'||effect;
      if found then
        receipt:=r.validation_result;
        select * into g from public.c3_envpac_capability_grant where capability_key=receipt->>'verifier_capability' for share;
        if receipt->>'kind' is distinct from 'independent_acceptance_receipt_v1'
          or receipt->>'oar1_sha256' is distinct from report_hash
          or receipt->'objective' is distinct from objective
          or receipt->>'observed_effects_sha256' is distinct from encode(sha256(convert_to(objective::text,'UTF8')),'hex')
          or receipt->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
          or receipt->'observed_identity' is distinct from jsonb_build_object(
            'environment',objective->>'environment','source_revision',objective->>'source_revision',
            'runtime_revision',objective->>'runtime_revision','action',objective->>'action',
            'executor',q.automation_permissions->>'executor_ref','execution_instance',p_execution_instance)
          or receipt->>'verifier_actor' is distinct from actor
          or g.standing is distinct from 'active' or not coalesce(public.cancom_finite_grant_v1(g.scope),false)
          or g.scope->>'actor_ref' is distinct from actor
          or g.scope->>'execution_instance' is distinct from p_execution_instance
          or not coalesce(g.scope->'allowed_actions' ? 'record_oar_acceptance_receipt',false)
          or g.scope->'computational_acceptance' is distinct from contract
          or (receipt->>'valid_until')::timestamptz<=clock_timestamp() then
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','stale_or_unbound_independent_evidence'));
        elsif receipt->>'boundary_changed'='true' or receipt->>'contested_semantics'='true' then
          classification:='ESCALATE_BOUNDARY'; escalated:=true;
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','new_authority_or_contested_semantics'));
        elsif receipt->>'outcome'='PASS' and (receipt->'passed_predicates') @> (objective->'required_predicates')
          and (objective->>'effect_class'='inspection' and nullif(receipt->>'inspection_evidence_ref','') is not null
            or objective->>'effect_class'='implementation'
              and coalesce(receipt->>'before_digest','') ~ '^[0-9a-f]{64}$'
              and coalesce(receipt->>'after_digest','') ~ '^[0-9a-f]{64}$'
              and nullif(receipt->>'positive_test_ref','') is not null
              and nullif(receipt->>'negative_test_ref','') is not null
              and receipt->>'test_exit_code'='0' and nullif(receipt->>'runtime_receipt_ref','') is not null) then
          classification:=case when objective->>'discovery_required'='true' then 'DISCOVER_AND_RESOLVE' else 'RESOLVE_KNOWN' end;
        else
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','failed_or_insufficient_effect_proof'));
        end if;
      else
        holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','independent_evidence_missing'));
      end if;
    end if;
    if classification in ('HOLD_UNVERIFIED','ESCALATE_BOUNDARY') then all_pass:=false; end if;
    decisions:=decisions||jsonb_build_array(jsonb_build_object('effect_key',effect,'classification',classification,
      'authorized_objective',objective,'evidence_key',r.evidence_key));
  end loop;
  final_key:=p_execution_instance||':computational_disposition';
  disposition:=jsonb_build_object('kind','computational_disposition_v1','source_sha256',q.automation_permissions->>'canonical_sha256',
    'oar1_sha256',report_hash,'objectives',decisions,'held_predicates',holds,'outcome',case when all_pass then 'automatic_pass' else 'operator_required' end,
    'authorized_outcome',contract->>'authorized_outcome','next_dependency',case when all_pass then null else 'resolve_exact_held_predicates' end);
  select * into old from public.system_oar_execution_evidence where evidence_key=final_key;
  if found then
    if old.validation_result=disposition then
      return old.validation_result||jsonb_build_object('classification',case when all_pass then 'REUSE_RESOLVED' else 'HOLD_UNVERIFIED' end,'idempotent',true);
    end if;
    return jsonb_build_object('standing','HLD','reason','contradictory_disposition_requires_qualified_reconciliation');
  end if;
  insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,evidence_summary,validation_result,artifact_path)
    values(final_key,q.queue_key,'runtime_validation','Original OAR2 computational acceptance; no new authority',disposition,
      'registry://system_oar_execution_evidence/'||final_key);
  update public.system_oar_queue set queue_status=case when all_pass then 'closed' else 'held' end,
    blocked_reason=case when all_pass then null else 'computational_acceptance_predicates_held' end,updated_at=now() where queue_key=q.queue_key;
  update public.c3_oar_process_instance set validation_standing=case when all_pass then 'automatic_pass' else 'operator_required' end,
    held_standing=case when all_pass then null else 'held_pending_validation' end,
    validation_finding=disposition::text,updated_at=now() where process_instance_key=p_execution_instance;
  insert into public.c3_oar_transition_event(transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,"timestamp",evidence_reference,notes)
    values(final_key,p_execution_instance,'measures',p.validation_standing,case when all_pass then 'automatic_pass' else 'operator_required' end,
      'validation',now(),'registry://system_oar_execution_evidence/'||final_key,'Deterministic original-authority disposition');
  insert into public.c3ops_oar_custody_resolution_event(resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,retrieval_access_rule,related_execution_instance,related_oar1,related_oar2,resolution_status,hold_reason,metadata)
    values(final_key,'oar_lifecycle_resolution_v1',c.related_oar1,'oar1',q.system_key,'computational_disposition',
      case when all_pass then 'completed' else 'held' end,report_hash,'registry_disposition_manifest',
      'registry://system_oar_execution_evidence/'||final_key,'service_only',p_execution_instance,c.related_oar1,q.oar_key,
      case when all_pass then 'resolved' else 'held' end,case when all_pass then null else 'acceptance_predicates_held' end,disposition);
  return disposition||jsonb_build_object('idempotent',false);
end $$;

create or replace function public.record_cancom_acceptance_receipt_v1(
  p_execution_instance text,p_verifier_capability text,p_receipt jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  q public.system_oar_queue%rowtype; g public.c3_envpac_capability_grant%rowtype;
  c public.c3ops_oar_custody_resolution_event%rowtype; old public.system_oar_execution_evidence%rowtype;
  actor text:=public.cancom_bound_actor_v1(); objective jsonb; k text; bound jsonb; contract jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended('cancom_oar1_return|'||p_execution_instance,0));
  select * into q from public.system_oar_queue where scope_key=p_execution_instance;
  select * into g from public.c3_envpac_capability_grant where capability_key=p_verifier_capability for share;
  contract:=q.automation_permissions->'computational_acceptance';
  if actor is null or actor=q.automation_permissions->>'executor_ref' or g.standing is distinct from 'active'
    or not coalesce(public.cancom_finite_grant_v1(g.scope),false) or g.scope->>'actor_ref' is distinct from actor
    or g.scope->>'execution_instance' is distinct from p_execution_instance or g.scope->>'oar_key' is distinct from q.oar_key
    or g.scope->>'process_key' is distinct from 'oar_lifecycle_resolution_v1'
    or g.scope->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or g.scope->'computational_acceptance' is distinct from contract
    or not coalesce(g.scope->'allowed_actions' ?& array['record_oar_acceptance_receipt','finalize_oar_disposition'],false) then
    return jsonb_build_object('standing','HLD','reason','independent_verifier_authority_missing');
  end if;
  select value into objective from jsonb_array_elements(contract->'objectives') where value->>'effect_key'=p_receipt->>'effect_key';
  if objective is null or p_receipt->'objective' is distinct from objective then
    return jsonb_build_object('standing','HLD','reason','changed_or_unqualified_effect');
  end if;
  if p_receipt->>'observed_effects_sha256' is distinct from encode(sha256(convert_to(objective::text,'UTF8')),'hex')
    or p_receipt->'observed_identity' is distinct from jsonb_build_object(
      'environment',objective->>'environment','source_revision',objective->>'source_revision',
      'runtime_revision',objective->>'runtime_revision','action',objective->>'action',
      'executor',q.automation_permissions->>'executor_ref','execution_instance',p_execution_instance)
    or nullif(p_receipt->>'observed_at','') is null or nullif(p_receipt->>'valid_until','') is null
    or (p_receipt->>'observed_at')::timestamptz>clock_timestamp()
    or (p_receipt->>'observed_at')::timestamptz<(g.scope->>'operator_confirmed_at')::timestamptz
    or (p_receipt->>'valid_until')::timestamptz> (g.scope->>'expires_at')::timestamptz
    or (p_receipt->>'valid_until')::timestamptz<=clock_timestamp() then
    return jsonb_build_object('standing','HLD','reason','unbound_or_stale_runtime_observation');
  end if;
  select * into c from public.c3ops_oar_custody_resolution_event where related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  if not found or p_receipt->>'oar1_sha256' is distinct from c.integrity_hash then
    return jsonb_build_object('standing','HLD','reason','return_receipt_mismatch');
  end if;
  bound:=p_receipt||jsonb_build_object('kind','independent_acceptance_receipt_v1','verifier_actor',actor,
    'verifier_capability',p_verifier_capability,'source_sha256',q.automation_permissions->>'canonical_sha256');
  k:=p_execution_instance||':acceptance:'||(objective->>'effect_key');
  select * into old from public.system_oar_execution_evidence where evidence_key=k;
  if found then
    if old.validation_result is distinct from bound then return jsonb_build_object('standing','HLD','reason','contradictory_receipt_preserved'); end if;
  else
    insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,evidence_summary,validation_result,artifact_path)
      values(k,q.queue_key,'runtime_validation','Independent exact-effect runtime observation',bound,
        'registry://system_oar_execution_evidence/'||k);
  end if;
  -- Wait for all objectives before persisting a final decision; an explicitly
  -- failed receipt is still evidence and resolves to a held disposition.
  if exists(select 1 from jsonb_array_elements(contract->'objectives') o where not exists(
    select 1 from public.system_oar_execution_evidence e where e.evidence_key=p_execution_instance||':acceptance:'||(o->>'effect_key'))) then
    return jsonb_build_object('standing','pending_validation','reason','other_objective_receipts_missing');
  end if;
  return public.resolve_cancom_oar_disposition_v1(p_execution_instance,p_verifier_capability);
end $$;
revoke all on function public.resolve_cancom_oar_disposition_v1(text,text),public.record_cancom_acceptance_receipt_v1(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.resolve_cancom_oar_disposition_v1(text,text),public.record_cancom_acceptance_receipt_v1(text,text,jsonb) to service_role;

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

commit;
