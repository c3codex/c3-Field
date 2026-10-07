begin;
-- This is formation under the existing confirmed OAR, not a new authority encounter.
do $formation$
declare
  v_pickup jsonb; v_q public.system_oar_queue%rowtype; v_cap public.c3_envpac_capability_grant%rowtype;
  v_process public.system_process_registry%rowtype; v_spec jsonb; v_tuple jsonb; v_owner text;
begin
  v_pickup:=public.resolve_cancom_oar_pickup_v1('execution_instance','my_stash_nug_runtime_codex_001','codex');
  if v_pickup->>'standing' is distinct from 'resolved_for_executor'
    or v_pickup->>'sha256' is distinct from '1e0e7f74c08abe08f9721830450685bed48ef1c9b714a4775765c9aa839997e8'
    or v_pickup->'deployment_authorized' is distinct from 'false'::jsonb then
    raise exception 'held_identity_or_authority_mismatch'; end if;
  select * into v_q from public.system_oar_queue where scope_key='my_stash_nug_runtime_codex_001' for update;
  select * into v_cap from public.c3_envpac_capability_grant
    where capability_key=v_pickup->>'capability_ref' for update;
  if v_q.automation_permissions->'db_mutation' is distinct from 'true'::jsonb
    or v_cap.scope->'db_mutation_authorized' is distinct from 'true'::jsonb
    or v_cap.scope->>'target_env_key' is distinct from 'env_person_eea672f5a7676dad4316755b'
    or v_cap.scope->>'target_envpac' is distinct from 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
    or v_cap.scope->>'target_current_state' is distinct from 'current_env_person_eea672f5a7676dad4316755b_v1'
    or v_cap.scope->'external_provider_effects_authorized' is distinct from 'false'::jsonb then
    raise exception 'my_stash_formation_authority_unresolved'; end if;
  select owner_subject_key into v_owner from public.c3_envpac
    where envpac_key=v_cap.scope->>'target_envpac' and env_key=v_cap.scope->>'target_env_key' and is_effective;
  if v_owner is null then raise exception 'target_owner_unresolved'; end if;
  if exists(select 1 from public.c3ops_nug_binding where nug_key='my_stash_op044_v1')
    or exists(select 1 from public.c3ops_cancom_context_binding where binding_key='cancom_ctx_my_stash_op044_v1') then
    raise exception 'my_stash_existing_formation_requires_readback'; end if;
  select * into v_process from public.system_process_registry where process_key='c3ops_nug_my_stash_v1' for update;
  if not found or v_process.authority_state is distinct from 'operator_confirmed_definition_runtime_held' then
    raise exception 'confirmed_my_stash_definition_unresolved'; end if;
  v_spec:=jsonb_build_object(
    'nug_key','my_stash_op044_v1','native_process_key','c3ops_nug_my_stash_v1',
    'native_function_ref','public.resolve_c3ops_my_stash_v1(jsonb)',
    'native_function_sha256',encode(extensions.digest(pg_get_functiondef('public.resolve_c3ops_my_stash_v1(jsonb)'::regprocedure),'sha256'),'hex'),
    'origin_env_key','env_c3_field','env_key',v_cap.scope->>'target_env_key',
    'envpac_key',v_cap.scope->>'target_envpac','current_state_key',v_cap.scope->>'target_current_state',
    'executor_ref','codex','execution_instance',v_q.scope_key,'capability_ref',v_cap.capability_key,
    'authority_oar_key',v_q.oar_key,'context_binding_key','cancom_ctx_my_stash_op044_v1',
    'adapter_class','direct_native','adapter_process_key',null,'effect_class','none',
    'native_input',jsonb_build_object('env_key',v_cap.scope->>'target_env_key',
      'envpac_key',v_cap.scope->>'target_envpac','current_state_key',v_cap.scope->>'target_current_state',
      'owner_subject_key',v_owner,'default_visibility','private','event_contract','my_stash_private_reference_v1'),
    'native_result_standing','my_stash_resolved',
    'evidence_return_relation','registry://c3_current_evidence_ref/'||(v_cap.scope->>'target_current_state'));
  v_tuple:=v_spec-array['capability_ref','authority_oar_key'];
  update public.c3_envpac_capability_grant set envpac_key=v_spec->>'envpac_key',
    scope=scope||jsonb_build_object('allowed_actions',scope->'allowed_actions'||'["call_nug","register_cancom_context_binding"]'::jsonb,
      'nug_bindings',jsonb_build_array(v_tuple),'prior_execution_envpac_key',v_cap.envpac_key,
      'runtime_scope','private_reference_events_only_current_evidence_no_external_effects',
      'relation_ref',v_q.scope_key,'relation_class','system_system','origin_environment','env_c3_field',
      'receiving_environment',v_spec->>'env_key','resolved_actor','codex',
      'source_authority_ref','registry://cancom/oar2/'||v_q.oar_key,
      'operator_confirmed',true,'operator_confirmed_at',v_q.operator_confirmed_at),
    updated_at=now() where capability_key=v_cap.capability_key;
  -- Only add the exact tuple to this already-confirmed encounter. No queue standing/timestamp changes.
  update public.system_oar_queue set automation_permissions=automation_permissions||
    jsonb_build_object('nug_bindings',jsonb_build_array(v_tuple)),updated_at=now() where queue_key=v_q.queue_key;
  insert into public.c3ops_cancom_context_binding(binding_key,relation_class,relation_ref,origin_environment,
    receiving_environment,asserted_sender,resolved_actor,audience_role,transport_adapter,payload_custody_class,
    capability_ref,standing,source_authority_ref,operator_confirmed_at)
  values('cancom_ctx_my_stash_op044_v1','system_system','my_stash_nug_runtime_codex_001',
    'env_c3_field',v_spec->>'env_key',v_q.operator_key,'codex','operator','registry_cancom_internal',
    'registry_custody_ref',v_cap.capability_key,'active','registry://cancom/oar2/'||v_q.oar_key,v_q.operator_confirmed_at);
  update public.system_process_registry set process_status='active',status='runtime_registered',
    authority_state='operator_confirmed_bounded_runtime_registered',
    metadata=metadata||jsonb_build_object(
      'runtime_formation_history',coalesce(metadata->'runtime_formation_history','[]'::jsonb)||jsonb_build_array(to_jsonb(v_process)),
      'runtime_state','registered_native_reference_runtime','native_function_ref',v_spec->>'native_function_ref',
      'native_function_sha256',v_spec->>'native_function_sha256','runtime_execution_instance',v_q.scope_key,
      'runtime_source_oar2',v_q.oar_key,'runtime_storage','c3_current_evidence_ref_append_only_nug_occurrence',
      'first_specimen_runtime_readback','HLD_REGISTERED_ARTIFACT_CUSTODY_INTEGRITY_UNRESOLVED'),
    updated_at=now() where process_key=v_process.process_key;
  if public.register_c3ops_nug_binding_v1('my_stash_op044_v1','My_Stash',v_spec)->>'standing'
    is distinct from 'registered' then
    raise exception 'my_stash_binding_preflight_failed: %',public.preflight_c3ops_nug_spec_v1('my_stash_op044_v1',v_spec);
  end if;
end;
$formation$;
select public.resolve_c3ops_nug_v1(spec || jsonb_build_object('nug_key',nug_key)) AS resolution
from public.c3ops_nug_binding where nug_key='my_stash_op044_v1';
commit;
