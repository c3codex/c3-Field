-- Explicit synthetic authorization in temporary shadows only. Uses the deployed
-- NUG bodies and the existing native CanCom context resolver. No live grants,
-- context relations, Current state, service classifications or effects change.
begin;
create temporary table system_process_registry (like public.system_process_registry including all);
insert into pg_temp.system_process_registry select * from public.system_process_registry
 where process_key in ('cancom_oar_delivery_retrieval_v1','aop_006_free_binding','c3ops_nugs_native_universal_general_services_v1');
create temporary table c3_environment (like public.c3_environment including all);
insert into pg_temp.c3_environment select * from public.c3_environment where env_key in ('env_c3ops','env_c3_field');
create temporary table c3_envpac (like public.c3_envpac including all);
insert into pg_temp.c3_envpac select * from public.c3_envpac where envpac_key='c3envpac_field_v0_1';
update pg_temp.c3_envpac set env_key='env_c3ops',is_effective=true;
create temporary table c3_current_state (like public.c3_current_state including all);
insert into pg_temp.c3_current_state select * from public.c3_current_state where current_state_key='current_env_c3ops_v1';
create temporary table c3_current_evidence_ref (like public.c3_current_evidence_ref including all);
create temporary table c3_envpac_capability_grant (like public.c3_envpac_capability_grant including all);
insert into pg_temp.c3_envpac_capability_grant select * from public.c3_envpac_capability_grant where capability_key='nugs_oar001_codex_bounded_execution';
create temporary table system_oar_queue (like public.system_oar_queue including all);
insert into pg_temp.system_oar_queue select * from public.system_oar_queue where queue_key='queue_nugs_runtime_primitive_codex_001';
create temporary table c3ops_cancom_context_binding (like public.c3ops_cancom_context_binding including all);
create temporary table c3ops_nug_binding (like public.c3ops_nug_binding including all);
create temporary table c3ops_nug_occurrence (like public.c3ops_nug_occurrence including all);
create temporary table c3ops_nug_effect_passage (like public.c3ops_nug_effect_passage including all);
create temporary table c3ops_oar_custody_resolution_event (like public.c3ops_oar_custody_resolution_event including all);
create temporary table nug_proof (proof_key text primary key, result jsonb);
do $clone$
declare v_def text; v_name text; v_ref text;
begin
  foreach v_name in array array['preflight_c3ops_nug_spec_v1','register_c3ops_nug_binding_v1',
    'resolve_c3ops_nug_v1','call_c3ops_nug_native_v1','prepare_c3ops_nug_effect_v1','return_c3ops_nug_effect_v1'] loop
    select pg_get_functiondef(p.oid) into strict v_def from pg_proc p
      where p.pronamespace='public'::regnamespace and p.proname=v_name;
    foreach v_ref in array array['system_process_registry','c3_environment','c3_envpac','c3_current_state',
      'c3_current_evidence_ref','c3_envpac_capability_grant','system_oar_queue','c3ops_cancom_context_binding',
      'c3ops_nug_binding','c3ops_nug_occurrence','c3ops_nug_effect_passage','c3ops_oar_custody_resolution_event',
      'preflight_c3ops_nug_spec_v1','register_c3ops_nug_binding_v1',
      'resolve_c3ops_nug_v1','call_c3ops_nug_native_v1','prepare_c3ops_nug_effect_v1','return_c3ops_nug_effect_v1'] loop
      v_def:=replace(v_def,'public.'||v_ref,'pg_temp.'||v_ref);
    end loop;
    execute v_def;
  end loop;
end;
$clone$;
create function pg_temp.assert_nug_hold(p_key text,p_result jsonb,p_predicate text) returns void
language plpgsql as $$
begin
  if p_result->>'standing' is distinct from 'HLD'
    or not coalesce(p_result->'missing_predicates' ? p_predicate,false) then
    raise exception 'negative % failed: %',p_key,p_result;
  end if;
  insert into pg_temp.nug_proof values(p_key,p_result||'{"fixture_only":true}'::jsonb);
end;
$$;
do $test$
declare v_spec jsonb; v_request jsonb; v_tuple jsonb; v_result jsonb; v_cap jsonb; v_auth jsonb;
  v_field text; v_count int; v_effect jsonb; v_original_spec jsonb;
begin
  v_spec:=jsonb_build_object('native_process_key','cancom_oar_delivery_retrieval_v1',
    'native_function_ref','public.resolve_cancom_context_v1(jsonb)',
    'native_function_sha256',encode(extensions.digest(pg_get_functiondef('public.resolve_cancom_context_v1(jsonb)'::regprocedure),'sha256'),'hex'),
    'origin_env_key','env_c3_field','env_key','env_c3ops','envpac_key','c3envpac_field_v0_1',
    'current_state_key','current_env_c3ops_v1','executor_ref','codex',
    'execution_instance','nugs_runtime_primitive_codex_001','context_binding_key','fixture_nug_context',
    'capability_ref','nugs_oar001_codex_bounded_execution','authority_oar_key','oar2_nugs_runtime_20261001_001',
    'adapter_class','direct_native','adapter_process_key',null,'effect_class','none',
    'native_result_standing','resolved_for_passage',
    'evidence_return_relation','registry://c3_current_evidence_ref/current_env_c3ops_v1',
    'native_input',jsonb_build_object('relation_class','ai_executor_passage',
      'relation_ref','nugs_runtime_primitive_codex_001','asserted_sender','codex',
      'origin_environment','c3_field','receiving_environment','executor:codex','audience_role','direct_executor',
      'transport_adapter','registry_cancom_internal','payload_custody_class','immutable_oar_payload',
      'return_route','registry://cancom/oar1_return/nugs_runtime_primitive_codex_001'));
  v_tuple:=pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',v_spec)->'binding';
  update pg_temp.c3_envpac_capability_grant set scope=scope||jsonb_build_object(
    'allowed_actions',jsonb_build_array('call_nug'),'nug_bindings',jsonb_build_array(v_tuple));
  update pg_temp.system_oar_queue set automation_permissions=automation_permissions||jsonb_build_object('nug_bindings',jsonb_build_array(v_tuple));
  insert into pg_temp.c3ops_cancom_context_binding(binding_key,relation_class,relation_ref,
    origin_environment,receiving_environment,asserted_sender,resolved_actor,audience_role,transport_adapter,
    payload_custody_class,source_authority_ref,capability_ref,operator_confirmed_at,standing)
    values('fixture_nug_context','system_system','fixture_only','env_c3_field','env_c3ops','codex','codex',
      'direct_executor','registry_cancom_internal','none','registry://cancom/oar2/oar2_nugs_runtime_20261001_001',
      'nugs_oar001_codex_bounded_execution',now(),'active');
  select scope into v_cap from pg_temp.c3_envpac_capability_grant;
  select automation_permissions into v_auth from pg_temp.system_oar_queue;
  v_result:=pg_temp.register_c3ops_nug_binding_v1('fixture_cancom','CanCom',v_spec);
  if v_result->>'standing' is distinct from 'registered' then raise exception 'registration failed: %',v_result; end if;
  insert into pg_temp.nug_proof values('registration_positive',v_result||'{"fixture_only":true}'::jsonb);
  v_request:=v_spec||'{"nug_key":"fixture_cancom"}'::jsonb;
  v_result:=pg_temp.resolve_c3ops_nug_v1(v_request);
  if v_result->>'standing' is distinct from 'resolved_for_nug' then raise exception 'resolution failed: %',v_result; end if;
  insert into pg_temp.nug_proof values('resolution_positive',v_result||'{"fixture_only":true}'::jsonb);

  perform pg_temp.assert_nug_hold('native_function_missing',pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',
    v_spec||'{"native_function_ref":"public.nonexistent_nug_fixture(jsonb)"}'::jsonb),'native_function');
  perform pg_temp.assert_nug_hold('native_function_drift',pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',
    v_spec||jsonb_build_object('native_function_sha256',repeat('0',64))),'native_function');
  update pg_temp.c3_envpac_capability_grant set standing='revoked';
  perform pg_temp.assert_nug_hold('capability_revoked',pg_temp.resolve_c3ops_nug_v1(v_request),'capability');
  update pg_temp.c3_envpac_capability_grant set standing='active';
  update pg_temp.system_oar_queue set automation_permissions=automation_permissions-'nug_bindings';
  perform pg_temp.assert_nug_hold('capability_is_not_authority',pg_temp.resolve_c3ops_nug_v1(v_request),'authority');
  update pg_temp.system_oar_queue set automation_permissions=v_auth;
  update pg_temp.c3ops_cancom_context_binding set standing='held';
  perform pg_temp.assert_nug_hold('context_held',pg_temp.resolve_c3ops_nug_v1(v_request),'context');
  update pg_temp.c3ops_cancom_context_binding set standing='active';
  update pg_temp.c3_current_state set is_current=false,superseded_at=now();
  perform pg_temp.assert_nug_hold('stale_current',pg_temp.resolve_c3ops_nug_v1(v_request),'environment_current');
  update pg_temp.c3_current_state set is_current=true,superseded_at=null;
  delete from pg_temp.system_process_registry where process_key='aop_006_free_binding';
  perform pg_temp.assert_nug_hold('free_unresolved',pg_temp.resolve_c3ops_nug_v1(v_request),'free_resolver');
  insert into pg_temp.system_process_registry select * from public.system_process_registry where process_key='aop_006_free_binding';
  foreach v_field in array array['origin_env_key','env_key','envpac_key','current_state_key',
    'executor_ref','execution_instance','capability_ref','authority_oar_key','context_binding_key'] loop
    perform pg_temp.assert_nug_hold('request_missing_'||v_field,pg_temp.resolve_c3ops_nug_v1(v_request-v_field),v_field);
  end loop;
  -- A claimed effect boolean, absent Registry evidence, is never sufficient.
  perform pg_temp.assert_nug_hold('effect_preflight_missing',pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',
    v_spec||'{"effect_class":"external_email","effect_authorized":true}'::jsonb),'effect_preflight');
  perform pg_temp.assert_nug_hold('provider_is_not_nug',pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',
    v_spec||'{"adapter_class":"provider"}'::jsonb),'adapter_class');
  perform pg_temp.assert_nug_hold('adapter_unregistered',pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',
    v_spec||'{"adapter_class":"registered_adapter","adapter_process_key":"nonexistent_fixture_worker"}'::jsonb),'registered_adapter');
  if (select count(*) from pg_temp.c3ops_nug_occurrence)<>0 then raise exception 'negative probes wrote occurrence'; end if;

  v_result:=pg_temp.call_c3ops_nug_native_v1(v_request,'fixture_occurrence_001');
  if v_result->>'standing' is distinct from 'occurrence_returned' then raise exception 'native call failed: %',v_result; end if;
  if v_result->>'external_effects' is distinct from '0' or v_result->>'custody_transferred' is distinct from 'false'
    or not exists(select 1 from pg_temp.c3_current_evidence_ref where current_state_key='current_env_c3ops_v1'
      and evidence_key='fixture_occurrence_001' and evidence_class='nug_occurrence'
      and content_hash=(select encode(extensions.digest(to_jsonb(o)::text,'sha256'),'hex')
        from pg_temp.c3ops_nug_occurrence o where occurrence_key='fixture_occurrence_001')) then
    raise exception 'Current evidence hash/relation failed'; end if;
  insert into pg_temp.nug_proof values('workerless_native_occurrence_current_return',v_result||'{"fixture_only":true}'::jsonb);
  v_result:=pg_temp.call_c3ops_nug_native_v1(v_request,'fixture_occurrence_001');
  if v_result->>'reason' is distinct from 'occurrence_already_returned'
    or (select count(*) from pg_temp.c3ops_nug_occurrence)<>1 then raise exception 'replay not refused'; end if;
  insert into pg_temp.nug_proof values('replay_refused',v_result);

  -- Fixture-only registered infrastructure + distinct effect preflight. It can
  -- resolve, but this OAR's workerless caller must still refuse an external effect.
  v_original_spec:=v_spec;
  v_spec:=v_spec||'{"adapter_class":"registered_adapter","adapter_process_key":"cancom_oar_delivery_retrieval_v1","effect_class":"external_email"}'::jsonb;
  update pg_temp.system_process_registry set metadata=metadata||jsonb_build_object('infrastructure_class','runtime_adapter',
    'native_function_refs',jsonb_build_array(v_spec->>'native_function_ref')) where process_key='cancom_oar_delivery_retrieval_v1';
  v_tuple:=pg_temp.preflight_c3ops_nug_spec_v1('fixture_cancom',v_spec)->'binding';
  v_effect:=jsonb_build_object('binding',v_tuple,'effect_class','external_email','current_state_key','current_env_c3ops_v1',
    'context_binding_key','fixture_nug_context');
  update pg_temp.c3_envpac_capability_grant set scope=v_cap||jsonb_build_object('nug_bindings',jsonb_build_array(v_tuple),
    'effect_preflights',jsonb_build_array(v_effect));
  update pg_temp.system_oar_queue set automation_permissions=v_auth||jsonb_build_object('nug_bindings',jsonb_build_array(v_tuple),
    'effect_preflights',jsonb_build_array(v_effect));
  update pg_temp.c3ops_nug_binding set spec=v_spec;
  perform pg_temp.assert_nug_hold('explicit_external_prohibition',pg_temp.resolve_c3ops_nug_v1(v_request),'effect_preflight');
  update pg_temp.c3_envpac_capability_grant set scope=scope||'{"external_provider_effects_authorized":true,"external_correspondence_authorized":true}'::jsonb;
  update pg_temp.system_oar_queue set automation_permissions=automation_permissions||'{"external_provider_effects_authorized":true,"external_correspondence":true}'::jsonb;
  v_result:=pg_temp.resolve_c3ops_nug_v1(v_request);
  if v_result->>'standing' is distinct from 'resolved_for_nug' then raise exception 'adapter fixture failed: %',v_result; end if;
  insert into pg_temp.nug_proof values('registered_adapter_is_infrastructure',v_result||'{"fixture_only":true,"adapter_executed":false}'::jsonb);
  v_result:=pg_temp.call_c3ops_nug_native_v1(v_request,'fixture_external_never_called');
  if v_result->>'reason' is distinct from 'bounded_effect_caller_required'
    or (select count(*) from pg_temp.c3ops_nug_occurrence)<>1 then raise exception 'effect caller bypass'; end if;
  insert into pg_temp.nug_proof values('external_effect_not_called',v_result||'{"external_effects":0}'::jsonb);
  v_result:=pg_temp.prepare_c3ops_nug_effect_v1(v_request,'fixture_effect_occurrence');
  if v_result->>'standing' is distinct from 'awaiting_effect_receipt' or v_result->>'provider_called' is distinct from 'false'
    then raise exception 'effect preparation failed: %',v_result; end if;
  insert into pg_temp.nug_proof values('effect_preparation_no_dispatch',v_result||'{"fixture_only":true}'::jsonb);
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','codex','claimed_receipt');
  if v_result->>'reason' is distinct from 'effect_receipt_evidence_unresolved' then raise exception 'unproven receipt accepted'; end if;
  insert into pg_temp.nug_proof values('claimed_receipt_refused',v_result);
  -- Synthetic receipt in shadow evidence/custody only, never a real provider receipt.
  insert into pg_temp.c3ops_oar_custody_resolution_event(resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,related_execution_instance,related_oar2,
    resolution_status,metadata)
    values('fixture_receipt_custody','oar_evidence_asset_custody_resolution_v1','fixture_receipt','evidence','c3ops',
      'nug_effect_receipt','observed',repeat('1',64),'fixture_only','fixture_only:never_external',
      'nugs_runtime_primitive_codex_001','oar2_nugs_runtime_20261001_001','resolved',
      jsonb_build_object('occurrence_key','fixture_effect_occurrence','nug_key','fixture_cancom',
        'effect_class','external_email','native_function_ref',v_spec->>'native_function_ref','executor_ref','codex'));
  insert into pg_temp.c3_current_evidence_ref(current_evidence_ref_key,current_state_key,evidence_key,evidence_class,
    content_hash,hash_algorithm,authoritative_custody_type,authoritative_custody_provider,
    authoritative_custody_identifier,authoritative_custody_location,evidence_standing,source_execution_instance_id,metadata,attested_by)
    values('fixture_receipt_ref','current_env_c3ops_v1','fixture_receipt','nug_effect_receipt',repeat('1',64),'sha256',
      'registry','supabase','fixture_receipt_custody','registry://c3ops_oar_custody_resolution_event/fixture_receipt_custody',
      'observed','nugs_runtime_primitive_codex_001',jsonb_build_object('occurrence_key','fixture_effect_occurrence',
        'nug_key','fixture_cancom','effect_class','external_email','native_function_ref',v_spec->>'native_function_ref',
        'authority_oar_key','oar2_nugs_runtime_20261001_001'),'codex');
  update pg_temp.c3_current_evidence_ref set metadata=metadata||'{"occurrence_key":"wrong"}'::jsonb where current_evidence_ref_key='fixture_receipt_ref';
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','codex','fixture_receipt_ref');
  if v_result->>'standing' is distinct from 'HLD' then raise exception 'wrong occurrence receipt accepted'; end if;
  insert into pg_temp.nug_proof values('wrong_occurrence_receipt_refused',v_result);
  update pg_temp.c3_current_evidence_ref set metadata=metadata||'{"occurrence_key":"fixture_effect_occurrence"}'::jsonb where current_evidence_ref_key='fixture_receipt_ref';
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','other','fixture_receipt_ref');
  if v_result->>'standing' is distinct from 'HLD' then raise exception 'wrong executor receipt accepted'; end if;
  insert into pg_temp.nug_proof values('wrong_executor_receipt_refused',v_result);
  update pg_temp.c3ops_oar_custody_resolution_event set object_type='oar2';
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','codex','fixture_receipt_ref');
  if v_result->>'standing' is distinct from 'HLD' then raise exception 'OAR mistaken for receipt'; end if;
  insert into pg_temp.nug_proof values('nonreceipt_custody_refused',v_result);
  update pg_temp.c3ops_oar_custody_resolution_event set object_type='evidence';
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','codex','fixture_receipt_ref');
  if v_result->>'standing' is distinct from 'receipt_returned' or v_result->>'new_external_effects' is distinct from '0'
    then raise exception 'effect receipt return failed: %',v_result; end if;
  insert into pg_temp.nug_proof values('effect_receipt_current_return',v_result||'{"fixture_only":true,"real_provider_receipt":false}'::jsonb);
  v_result:=pg_temp.return_c3ops_nug_effect_v1('fixture_effect_occurrence','codex','fixture_receipt_ref');
  if v_result->>'reason' is distinct from 'effect_receipt_already_returned' then raise exception 'receipt replay accepted'; end if;
  insert into pg_temp.nug_proof values('effect_receipt_replay_refused',v_result);
end;
$test$;
select jsonb_build_object('proofs',jsonb_object_agg(proof_key,result),'proof_count',count(*),
  'fixture_only',true,'persistent_authority_mutations',0,'external_effects',0) as proof from pg_temp.nug_proof;
rollback;
