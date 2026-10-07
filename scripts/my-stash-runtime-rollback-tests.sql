begin;
-- Synthetic custody fixture exists only in this rollback transaction. It is not the first specimen.
insert into public.c3ops_asset_record(asset_key,asset_type,asset_class,title,owning_system_key,
 contributor_key,authorship_method,content_hash,mime_type,byte_size,seat_scope,src_key,standing,
 authoritative_custody_type,authoritative_custody_provider,authoritative_custody_identifier,
 authoritative_custody_location,custody_controller,created_by)
values('my_stash_rollback_fixture_20261007','test','test','Rollback fixture','c3ops','codex','unknown_held',
 repeat('a',64),'application/octet-stream',16,'Held or Excluded','rollback_test','test_fixture',
 'test','rollback_only','test_fixture','test://rollback-only','crs_93e901234ae044a396654ee80644b005','codex');
set local role service_role;
do $tests$
declare v_spec jsonb; v_req jsonb; r jsonb; v_before bigint; v_asset jsonb; v_input jsonb;
begin
 select spec into v_spec from public.c3ops_nug_binding where nug_key='my_stash_op044_v1';
 v_req:=v_spec||jsonb_build_object('nug_key','my_stash_op044_v1');
 select count(*) into v_before from public.c3ops_nug_occurrence where nug_key='my_stash_op044_v1';
 select to_jsonb(a) into v_asset from public.c3ops_asset_record a where asset_key='my_stash_rollback_fixture_20261007';
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','retain','asset_key','my_stash_rollback_fixture_20261007')),'stash_test_20261007_retain');
 assert r->>'standing'='occurrence_returned',r::text;
 assert r->'result'->'item'->>'visibility'='private';
 assert r->'result'->'item'->'artifact_snapshot'=v_asset;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','retain','asset_key','my_stash_rollback_fixture_20261007')),'stash_test_20261007_retain2');
 assert r->'result'->>'idempotent_retention'='true',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','list')),'stash_test_20261007_list1');
 assert jsonb_array_length(r->'result'->'items')=1,r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','retrieve','reference_key','my_stash_rollback_fixture_20261007')),'stash_test_20261007_retrieve');
 assert r->'result'->'item'->>'asset_key'='my_stash_rollback_fixture_20261007',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','organize','reference_key','my_stash_rollback_fixture_20261007',
      'folder','Private test','tags',jsonb_build_array('test'))),'stash_test_20261007_organize');
 assert r->'result'->'item'->>'folder'='Private test',r::text;
 assert r->'result'->'item'->'artifact_snapshot'=v_asset;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','surface_intent','reference_key','my_stash_rollback_fixture_20261007',
      'target_surface','test governed boundary')),'stash_test_20261007_surface');
 assert r->'result'->>'next_boundary'='separate_governed_surface_authority_required',r::text;
 assert r->'result'->'item'->>'visibility'='private';
 assert r->'result'->'item'->'selective_surface_intent'->>'publication_authorized'='false';
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','remove','reference_key','my_stash_rollback_fixture_20261007')),'stash_test_20261007_remove');
 assert r->>'standing'='occurrence_returned',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','list')),'stash_test_20261007_list2');
 assert jsonb_array_length(r->'result'->'items')=0,r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','list')),'stash_test_20261007_list2');
 assert r->>'reason'='occurrence_already_returned',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('env_key','wrong_environment',
    'participant_input',jsonb_build_object('action','list')),'stash_test_20261007_wrongenv');
 assert r->>'standing'='HLD' and r->'missing_predicates' ? 'env_key',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','retain','asset_key','nonexistent_stash_asset')),'stash_test_20261007_missingcustody');
 assert r->>'reason'='registered_artifact_custody_integrity_unresolved',r::text;
 r:=public.call_c3ops_nug_native_v1(v_req||jsonb_build_object('participant_input',
    jsonb_build_object('action','list','env_key','invented')),'stash_test_20261007_override');
 assert r->>'reason'='participant_request_boundary',r::text;
 v_input:=v_spec->'native_input'||jsonb_build_object('owner_subject_key','wrong_owner','request',jsonb_build_object('action','list'));
 r:=public.resolve_c3ops_my_stash_v1(v_input);
 assert r->>'reason'='private_environment_owner_current_unresolved',r::text;
 assert (select count(*) from public.c3ops_nug_occurrence where nug_key='my_stash_op044_v1')=v_before+8;
 assert (select count(*) from public.c3_current_evidence_ref where evidence_key like 'stash_test_20261007_%')=8;
 assert not exists(select 1 from public.c3_current_evidence_ref e join public.c3ops_nug_occurrence o
   on o.occurrence_key=e.evidence_key where e.evidence_key like 'stash_test_20261007_%'
   and (e.metadata->>'default_visibility'<>'private' or e.metadata->>'native_result_sha256'<>o.result_sha256
     or encode(extensions.digest((e.metadata->'native_result')::text,'sha256'),'hex')<>o.result_sha256
     or e.content_hash<>encode(extensions.digest(to_jsonb(o)::text,'sha256'),'hex')));
 assert (select to_jsonb(a) from public.c3ops_asset_record a where asset_key='my_stash_rollback_fixture_20261007')=v_asset;
end;
$tests$;
reset role;
select jsonb_build_object('standing','PASS','operations_verified',jsonb_build_array(
  'retain','idempotent_retain','list','retrieve','organize','surface_intent_stops_boundary','remove',
  'replay_hold','cross_environment_hold','missing_custody_hold','override_hold','wrong_owner_hold',
  'private_current_receipt_integrity','artifact_unchanged'),
  'rollback',true,'durable_fixture_rows',0,'external_effects',0) AS validation;
rollback;
