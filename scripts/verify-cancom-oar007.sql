-- Shadow-table verification using deployed function bodies and exact registered OAR007.
-- Existing Registry authority is read live; all lifecycle writes are temporary and rolled back.
-- No new capability, relation, provider, evaluation, or execution instance is created.
begin;
create temporary table system_oar_queue (like public.system_oar_queue including all);
insert into pg_temp.system_oar_queue select * from public.system_oar_queue where scope_key='cancom_runtime_passage_codex_007';
create temporary table c3_oar_process_instance (like public.c3_oar_process_instance including all);
insert into pg_temp.c3_oar_process_instance select * from public.c3_oar_process_instance where process_instance_key='cancom_runtime_passage_codex_007';
create temporary table c3_oar_transition_event (like public.c3_oar_transition_event including all);
insert into pg_temp.c3_oar_transition_event select * from public.c3_oar_transition_event where process_instance_key='cancom_runtime_passage_codex_007';
create temporary table system_oar_execution_evidence (like public.system_oar_execution_evidence including all);
insert into pg_temp.system_oar_execution_evidence select * from public.system_oar_execution_evidence where queue_key='queue_cancom_runtime_passage_codex_007';
create temporary table c3ops_oar_custody_resolution_event (like public.c3ops_oar_custody_resolution_event including all);
insert into pg_temp.c3ops_oar_custody_resolution_event select * from public.c3ops_oar_custody_resolution_event where related_execution_instance='cancom_runtime_passage_codex_007';
create temporary table c3ops_cancom_notification_event (like public.c3ops_cancom_notification_event including all);
insert into pg_temp.c3ops_cancom_notification_event select * from public.c3ops_cancom_notification_event where source_object_key='cancom_runtime_passage_codex_007';
do $clone$
declare v_def text; v_name text; v_rel text;
begin
  foreach v_name in array array['register_cancom_oar_delivery_v1','register_cancom_oar_return_v1','resolve_cancom_oar_pickup_v1'] loop
    select pg_get_functiondef(p.oid) into strict v_def from pg_proc p
      where p.pronamespace='public'::regnamespace and p.proname=v_name;
    foreach v_rel in array array['system_oar_queue','c3_oar_process_instance','c3_oar_transition_event','system_oar_execution_evidence','c3ops_oar_custody_resolution_event','c3ops_cancom_notification_event',
      'register_cancom_oar_delivery_v1','register_cancom_oar_return_v1','resolve_cancom_oar_pickup_v1'] loop
      v_def:=replace(v_def,'public.'||v_rel,'pg_temp.'||v_rel);
    end loop;
    execute v_def;
  end loop;
  select pg_get_viewdef('public.c3ops_oar_lifecycle_optics_resolution_v1'::regclass,true) into v_def;
  -- pg_get_viewdef uses unqualified relation names; rewrite only the known six rails.
  foreach v_rel in array array['system_oar_queue','c3_oar_process_instance','c3_oar_transition_event','system_oar_execution_evidence','c3ops_oar_custody_resolution_event'] loop
    v_def:=replace(v_def,'public.'||v_rel,v_rel);
    v_def:=regexp_replace(v_def,'\m'||v_rel||'\M','pg_temp.'||v_rel,'g');
  end loop;
  v_def:=replace(v_def,'registry://pg_temp.','registry://');
  execute 'create temporary view c3ops_oar_lifecycle_optics_resolution_v1 as '||v_def;
  select pg_get_triggerdef(t.oid) into strict v_def from pg_trigger t
    where t.tgrelid='public.system_oar_queue'::regclass and t.tgname='notchazz_cancom_oar_delivery_gate';
  execute replace(v_def,'public.system_oar_queue','pg_temp.system_oar_queue');
end;
$clone$;
create temporary table oar007_proof (proof_key text, result jsonb);
create function pg_temp.oar007_snapshot() returns jsonb language sql as $$
select jsonb_build_object(
  'queue',(select coalesce(jsonb_agg(to_jsonb(q) order by q.queue_key),'[]') from pg_temp.system_oar_queue q where q.scope_key='cancom_runtime_passage_codex_007'),
  'process',(select coalesce(jsonb_agg(to_jsonb(p)),'[]') from pg_temp.c3_oar_process_instance p where p.process_instance_key='cancom_runtime_passage_codex_007'),
  'transition',(select coalesce(jsonb_agg(to_jsonb(t) order by t.transition_event_key),'[]') from pg_temp.c3_oar_transition_event t where t.process_instance_key='cancom_runtime_passage_codex_007'),
  'evidence',(select coalesce(jsonb_agg(to_jsonb(e) order by e.evidence_key),'[]') from pg_temp.system_oar_execution_evidence e where e.queue_key='queue_cancom_runtime_passage_codex_007'),
  'custody',(select coalesce(jsonb_agg(to_jsonb(c) order by c.resolution_event_key),'[]') from pg_temp.c3ops_oar_custody_resolution_event c where c.related_execution_instance='cancom_runtime_passage_codex_007'),
  'wake',(select coalesce(jsonb_agg(to_jsonb(n) order by n.event_key),'[]') from pg_temp.c3ops_cancom_notification_event n where n.source_object_key='cancom_runtime_passage_codex_007')
);
$$;
do $$
declare
  v_manifest jsonb; v_passage jsonb; v_result jsonb; v_before jsonb; v_after jsonb;
  v_replay jsonb; v_failure text; v_model jsonb; v_evidence jsonb; v_optics jsonb;
begin
  perform 1 from pg_temp.system_oar_queue where scope_key='cancom_runtime_passage_codex_007' for update;
  select metadata into strict v_manifest from pg_temp.c3ops_oar_custody_resolution_event
    where resolution_event_key='cancom_runtime_passage_codex_007:oar2:registry_manifest_delivery';
  select evidence into strict v_passage from pg_temp.c3ops_cancom_notification_event
    where event_key='cancom_runtime_passage_codex_007:wake:001';
  v_before:=pg_temp.oar007_snapshot();
  delete from pg_temp.c3ops_cancom_notification_event where source_object_key='cancom_runtime_passage_codex_007';
  delete from pg_temp.c3_oar_transition_event where process_instance_key='cancom_runtime_passage_codex_007';
  delete from pg_temp.system_oar_execution_evidence where queue_key='queue_cancom_runtime_passage_codex_007';
  delete from pg_temp.c3_oar_process_instance where process_instance_key='cancom_runtime_passage_codex_007';
  delete from pg_temp.c3ops_oar_custody_resolution_event where related_execution_instance='cancom_runtime_passage_codex_007';
  delete from pg_temp.system_oar_queue where scope_key='cancom_runtime_passage_codex_007';
  v_result:=pg_temp.register_cancom_oar_delivery_v1(v_manifest,v_passage,'chazz');
  if v_result->>'standing' is distinct from 'delivered_for_execution' then raise exception 'delivery replay failed: %',v_result; end if;
  v_after:=pg_temp.oar007_snapshot();
  if jsonb_array_length(v_after->'queue') is distinct from 1 or jsonb_array_length(v_after->'process') is distinct from 1
    or jsonb_array_length(v_after->'transition') is distinct from 1 or jsonb_array_length(v_after->'custody') is distinct from 1
    or jsonb_array_length(v_after->'wake') is distinct from 1 then raise exception 'five delivery rails missing'; end if;
  if v_after->'queue'->0->>'queue_status' is distinct from 'approved_for_execution'
    or v_after->'queue'->0->>'preflight_status' is distinct from 'passed'
    or v_after->'process'->0->>'execution_standing' is distinct from 'queued'
    or v_after->'process'->0->>'validation_standing' is distinct from 'pending_validation'
    or v_after->'process'->0->>'deploy_standing' is distinct from 'held'
    or v_after->'process'->0->>'source_oar2_path' is distinct from 'registry://cancom/oar2/oar2_cancom_runtime_20261001_007'
    or v_after->'process'->0->>'expected_oar1_path' is distinct from v_manifest->>'expected_return_route'
    or v_after->'process'->0->>'evidence_path' is distinct from 'registry://c3ops_oar_custody_resolution_event/cancom_runtime_passage_codex_007:oar2:registry_manifest_delivery'
    or v_after->'transition'->0->>'transition_event_key' is distinct from 'cancom_runtime_passage_codex_007:register_and_queue'
    or v_after->'transition'->0->>'from_status' is distinct from 'not_queued'
    or v_after->'transition'->0->>'to_status' is distinct from 'queued' then raise exception 'delivery rail binding failed'; end if;
  if v_after->'queue'->0->'automation_permissions'->>'execution_profile_process' is distinct from 'oar_execution_profile_model_resolution_v1'
    or v_after->'queue'->0->'automation_permissions'->>'model_resolution_evidence_required' is distinct from 'true'
    or v_after->'queue'->0->'automation_permissions'->>'minimum_capability_floor' is distinct from 'high_reasoning_code_system_execution_with_repository_and_database_access'
    then raise exception 'model policy propagation failed'; end if;
  insert into oar007_proof values('atomic_delivery_and_model_policy',jsonb_build_object('standing','PASS','rails',5,
    'policy',v_after->'queue'->0->'automation_permissions','rollback_only',true));

  v_replay:=pg_temp.oar007_snapshot();
  v_result:=pg_temp.register_cancom_oar_return_v1('cancom_runtime_passage_codex_007','codex',
    'oar1_rollback_only_missing_model',repeat('0',64),'rollback_only:never_committed',
    'returned_for_registrar_review','{}');
  if v_result->>'reason' is distinct from 'HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED' or pg_temp.oar007_snapshot() is distinct from v_replay
    then raise exception 'missing model evidence mutated lifecycle'; end if;
  insert into oar007_proof values('missing_model_zero_lifecycle_delta',v_result||'{"zero_lifecycle_delta":true}'::jsonb);
  v_result:=pg_temp.register_cancom_oar_return_v1('cancom_runtime_passage_codex_007','codex',
    'oar1_rollback_only_invalid_model',repeat('0',64),'rollback_only:never_committed',
    'returned_for_registrar_review','{"model_resolution_evidence":{"capability_floor_passed":false}}');
  if v_result->>'reason' is distinct from 'HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED' or pg_temp.oar007_snapshot() is distinct from v_replay
    then raise exception 'invalid model evidence mutated lifecycle'; end if;
  insert into oar007_proof values('invalid_model_zero_lifecycle_delta',v_result||'{"zero_lifecycle_delta":true}'::jsonb);

  v_model:='{"preferred_model_or_tier":"strongest_qualified_codex_model","selected_model_or_explicit_unverified_state":"unverified_opaque_runtime_model_sku","fallback_used":false,"fallback_level":"none_observed","fallback_reason":"no_runtime_fallback_observed","capability_floor_passed":true,"tools_available":["repository","supabase","runtime_verification"],"context_fit":"high_context_sufficient","execution_result":"rollback_only_contract_verification"}';
  v_evidence:=jsonb_build_object('model_resolution_evidence',v_model,'execution_summary','rollback-only contract verification',
    'validation_summary','rollback-only contract verification','origin_oar2_key',v_manifest->>'oar_key',
    'canonical_payload_ref',v_manifest->>'payload_custody_ref','canonical_sha256',v_manifest->>'integrity_value',
    'db_mutation_standing','not_applicable','src_mutation_standing','not_applicable',
    'deploy_standing','not_authorized','external_messages_sent',0);
  v_result:=pg_temp.register_cancom_oar_return_v1('cancom_runtime_passage_codex_007','codex',
    'oar1_rollback_only_valid_model',repeat('0',64),'rollback_only:never_committed',
    'returned_for_registrar_review',v_evidence);
  if v_result->>'standing' is distinct from 'returned_for_registrar_review' then raise exception 'valid return failed: %',v_result; end if;
  select to_jsonb(o) into v_optics from pg_temp.c3ops_oar_lifecycle_optics_resolution_v1 o
    where execution_instance='cancom_runtime_passage_codex_007';
  if v_optics->>'return_standing' is distinct from 'returned_for_registrar_review' or v_optics->>'model_resolution_standing' is distinct from 'returned'
    or v_optics->>'validation_standing' is distinct from 'chazz_review_required' then raise exception 'resolved return optics failed: %',v_optics; end if;
  insert into oar007_proof values('valid_return_resolves_optics',v_optics||'{"rollback_only":true}'::jsonb);

  -- A failed process insert must not leave even queue/custody or an executor wake.
  delete from pg_temp.c3ops_cancom_notification_event where source_object_key='cancom_runtime_passage_codex_007';
  delete from pg_temp.c3_oar_transition_event where process_instance_key='cancom_runtime_passage_codex_007';
  delete from pg_temp.system_oar_execution_evidence where queue_key='queue_cancom_runtime_passage_codex_007';
  delete from pg_temp.c3ops_oar_custody_resolution_event where related_execution_instance='cancom_runtime_passage_codex_007';
  delete from pg_temp.system_oar_queue where scope_key='cancom_runtime_passage_codex_007';
  v_replay:=pg_temp.oar007_snapshot();
  begin
    perform pg_temp.register_cancom_oar_delivery_v1(v_manifest,v_passage,'chazz');
    raise exception 'expected duplicate process failure';
  exception when unique_violation then v_failure:=SQLERRM;
  end;
  if pg_temp.oar007_snapshot() is distinct from v_replay then raise exception 'partial delivery survived failure'; end if;
  insert into oar007_proof values('process_failure_zero_delivery_delta',jsonb_build_object('standing','PASS','error',v_failure,'zero_lifecycle_delta',true));

  begin
    perform pg_temp.register_cancom_oar_delivery_v1(
      v_manifest||jsonb_build_object('integrity_value',repeat('1',64),'payload_revision_ref','sha256:'||repeat('1',64)),
      v_passage||jsonb_build_object('integrity_value',repeat('1',64)),'chazz');
    raise exception 'expected exact-SHA NotChazz rejection';
  exception when others then
    if SQLERRM not like '%HLD_NOTCHAZZ_OAR_FORMATION_BOUNDARY%' then raise; end if;
    v_failure:=SQLERRM;
  end;
  if pg_temp.oar007_snapshot() is distinct from v_replay then raise exception 'NotChazz rejection mutated lifecycle'; end if;
  insert into oar007_proof values('notchazz_exact_sha_gate',jsonb_build_object('standing','PASS','error',v_failure,'zero_lifecycle_delta',true));
end;
$$;
select * from oar007_proof order by proof_key;
rollback;
