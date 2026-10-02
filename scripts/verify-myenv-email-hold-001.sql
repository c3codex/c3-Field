-- Rollback-only verification; synthetic evidence is never persisted or a send.
begin;
grant select on public.c3_current_state to service_role;
grant update (current_state_key) on public.c3_current_state to service_role;
grant select,insert on public.c3_current_evidence_ref to service_role;
grant update (current_evidence_ref_key) on public.c3_current_evidence_ref to service_role;
set local role service_role;
do $$
declare s jsonb; req jsonb; r jsonb; meta jsonb; k text='myenv-email-oar001-receipt-rollback';
begin
  select spec into strict s from public.c3ops_nug_binding where nug_key='myenv_cancom_email_op044_v1';
  select jsonb_object_agg(f,s->f) into req from unnest(array['nug_key','origin_env_key','env_key','envpac_key','current_state_key','executor_ref','execution_instance','capability_ref','authority_oar_key','context_binding_key']) f;
  r:=public.prepare_c3ops_nug_effect_v1(req,k);
  if r->>'standing'<>'awaiting_effect_receipt' then raise exception 'prepare failed: %',r; end if;
  r:=public.prepare_c3ops_nug_effect_v1(req,k);
  if r->>'reason'<>'occurrence_already_prepared' then raise exception 'replay not held: %',r; end if;
  meta:=jsonb_build_object('occurrence_key',k,'nug_key',s->>'nug_key','effect_class',s->>'effect_class',
    'native_function_ref',s->>'native_function_ref','authority_oar_key',s->>'authority_oar_key');
  begin
    insert into public.c3ops_oar_custody_resolution_event(resolution_event_key,process_key,object_identifier,object_type,related_system,intended_function,standing,integrity_hash,custody_type,custody_reference,retrieval_access_rule,related_execution_instance,related_oar2,resolution_status,metadata)
    values(k,'c3ops_nug_effect_receipt_v1','rollback-only','provider_receipt','c3ops','cancom_external_email_receipt','observed',repeat('0',64),'registry_receipt_manifest','rollback:only','resolve_by:occurrence:'||k,s->>'execution_instance',s->>'authority_oar_key','resolved',meta);
    raise exception 'invalid original receipt object type was accepted';
  exception when check_violation then null;
  end;
  insert into public.c3ops_oar_custody_resolution_event(resolution_event_key,process_key,object_identifier,object_type,related_system,intended_function,standing,integrity_hash,custody_type,custody_reference,retrieval_access_rule,related_execution_instance,related_oar2,resolution_status,metadata)
    values(k,'oar_evidence_asset_custody_resolution_v1','rollback-only','evidence','c3ops','cancom_external_email_receipt','observed',repeat('0',64),'registry_receipt_manifest','rollback:only','resolve_by:occurrence:'||k,s->>'execution_instance',s->>'authority_oar_key','resolved',meta);
  insert into public.c3_current_evidence_ref(current_evidence_ref_key,current_state_key,evidence_key,evidence_class,content_hash,hash_algorithm,authoritative_custody_type,authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,evidence_standing,source_execution_instance_id,metadata,attested_by)
    values(k,s->>'current_state_key','rollback-only','nug_effect_receipt',repeat('0',64),'sha256','registry','supabase',k,'registry://c3ops_oar_custody_resolution_event/'||k,'observed',s->>'execution_instance',meta,s->>'executor_ref');
  r:=public.return_c3ops_nug_effect_v1(k,s->>'executor_ref',k);
  if r->>'reason'<>'effect_receipt_evidence_unresolved' then raise exception 'old receipt did not hold: %',r; end if;
  update public.c3ops_oar_custody_resolution_event set object_type='evidence',intended_function='nug_effect_receipt',metadata=meta||jsonb_build_object('executor_ref',s->>'executor_ref') where resolution_event_key=k;
  r:=public.return_c3ops_nug_effect_v1(k,s->>'executor_ref',k);
  if r->>'standing'<>'receipt_returned' then raise exception 'correct receipt failed: %',r; end if;
  r:=public.return_c3ops_nug_effect_v1(k,s->>'executor_ref',k);
  if r->>'reason'<>'effect_receipt_already_returned' then raise exception 'receipt replay not held: %',r; end if;
  r:=public.resolve_c3ops_nug_v1(req||jsonb_build_object('executor_ref','codex'));
  if r->>'standing'<>'HLD' then raise exception 'executor substitution not held: %',r; end if;
end $$;
select 'PASS: service-role prepare, preparation replay, old receipt hold, corrected receipt return, receipt replay, executor mismatch; rollback-only' as result;
rollback;
