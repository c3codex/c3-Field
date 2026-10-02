-- Evidence-only continuation of the NUG foundation. Never dispatches a provider.
create table public.c3ops_nug_effect_passage (
  occurrence_key text primary key check (length(btrim(occurrence_key)) > 0),
  nug_key text not null references public.c3ops_nug_binding(nug_key),
  execution_instance text not null,
  executor_ref text not null,
  current_state_key text not null references public.c3_current_state(current_state_key),
  effect_class text not null check (effect_class <> 'none' and length(btrim(effect_class)) > 0),
  resolution jsonb not null check (resolution->>'standing' = 'resolved_for_nug'),
  standing text not null check (standing in ('awaiting_effect_receipt','receipt_returned')),
  receipt_evidence_ref_key text unique references public.c3_current_evidence_ref(current_evidence_ref_key),
  created_at timestamptz not null default now(),
  returned_at timestamptz,
  check ((standing='awaiting_effect_receipt' and receipt_evidence_ref_key is null and returned_at is null)
    or (standing='receipt_returned' and receipt_evidence_ref_key is not null and returned_at is not null))
);
alter table public.c3ops_nug_effect_passage enable row level security;
alter table public.c3ops_nug_effect_passage force row level security;
revoke all on public.c3ops_nug_effect_passage from public,anon,authenticated;
grant select,insert,update on public.c3ops_nug_effect_passage to service_role;

create function public.prepare_c3ops_nug_effect_v1(p_request jsonb,p_occurrence_key text)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare v_resolution jsonb; v_binding jsonb;
begin
  if nullif(btrim(p_occurrence_key),'') is null then
    return jsonb_build_object('standing','HLD','reason','occurrence_key_missing'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_occurrence_key,0));
  if exists(select 1 from public.c3ops_nug_effect_passage where occurrence_key=p_occurrence_key)
    or exists(select 1 from public.c3ops_nug_occurrence where occurrence_key=p_occurrence_key) then
    return jsonb_build_object('standing','HLD','reason','occurrence_already_prepared'); end if;
  perform 1 from public.c3ops_nug_binding where nug_key=p_request->>'nug_key' for share;
  perform 1 from public.c3_current_state where current_state_key=p_request->>'current_state_key' for share;
  perform 1 from public.c3_envpac_capability_grant where capability_key=p_request->>'capability_ref' for share;
  perform 1 from public.system_oar_queue where oar_key=p_request->>'authority_oar_key'
    and scope_key=p_request->>'execution_instance' for share;
  perform 1 from public.c3ops_cancom_context_binding where binding_key=p_request->>'context_binding_key' for share;
  v_resolution := public.resolve_c3ops_nug_v1(p_request);
  if v_resolution->>'standing' is distinct from 'resolved_for_nug' then return v_resolution; end if;
  v_binding := v_resolution->'binding';
  if v_binding->>'adapter_class' is distinct from 'registered_adapter'
    or v_binding->>'effect_class' is not distinct from 'none' then
    return jsonb_build_object('standing','HLD','reason','registered_effect_adapter_required'); end if;
  insert into public.c3ops_nug_effect_passage(occurrence_key,nug_key,execution_instance,executor_ref,
    current_state_key,effect_class,resolution,standing)
    values(p_occurrence_key,p_request->>'nug_key',p_request->>'execution_instance',p_request->>'executor_ref',
      p_request->>'current_state_key',v_binding->>'effect_class',v_resolution,'awaiting_effect_receipt');
  return jsonb_build_object('standing','awaiting_effect_receipt','occurrence_key',p_occurrence_key,
    'resolution',v_resolution,'provider_called',false,'external_effects',0,
    'next_boundary','separately_authorized_adapter_must_repreflight_before_effect');
end;
$$;

-- Receipt authority is an independently attested Current evidence row bound to
-- the exact prepared occurrence. A supplied receipt string/boolean is not proof.
-- Linking observed evidence never advances Current, changes ownership, or sends.
create function public.return_c3ops_nug_effect_v1(p_occurrence_key text,p_executor text,p_receipt_evidence_ref_key text)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare v_passage public.c3ops_nug_effect_passage%rowtype; v_receipt public.c3_current_evidence_ref%rowtype;
begin
  select * into v_passage from public.c3ops_nug_effect_passage where occurrence_key=p_occurrence_key for update;
  if not found or v_passage.executor_ref is distinct from p_executor then
    return jsonb_build_object('standing','HLD','reason','effect_passage_unresolved'); end if;
  if v_passage.standing<>'awaiting_effect_receipt' then
    return jsonb_build_object('standing','HLD','reason','effect_receipt_already_returned'); end if;
  select * into v_receipt from public.c3_current_evidence_ref
    where current_evidence_ref_key=p_receipt_evidence_ref_key for share;
  if v_receipt.current_state_key is distinct from v_passage.current_state_key
    or v_receipt.source_execution_instance_id is distinct from v_passage.execution_instance
    or v_receipt.evidence_class is distinct from 'nug_effect_receipt'
    or v_receipt.evidence_standing is distinct from 'observed'
    or v_receipt.hash_algorithm is distinct from 'sha256'
    or coalesce(v_receipt.content_hash,'') !~ '^[0-9a-f]{64}$'
    or v_receipt.attested_by is distinct from p_executor
    or v_receipt.metadata->>'occurrence_key' is distinct from p_occurrence_key
    or v_receipt.metadata->>'nug_key' is distinct from v_passage.nug_key
    or v_receipt.metadata->>'effect_class' is distinct from v_passage.effect_class
    or v_receipt.metadata->>'native_function_ref' is distinct from v_passage.resolution->'binding'->>'native_function_ref'
    or v_receipt.metadata->>'authority_oar_key' is distinct from v_passage.resolution->>'authority_oar_key'
    or v_receipt.authoritative_custody_type is distinct from 'registry'
    or v_receipt.authoritative_custody_provider is distinct from 'supabase'
    or nullif(btrim(v_receipt.authoritative_custody_identifier),'') is null
    or v_receipt.authoritative_custody_location is distinct from
      'registry://c3ops_oar_custody_resolution_event/'||v_receipt.authoritative_custody_identifier
    or not exists(select 1 from public.c3ops_oar_custody_resolution_event c
      where c.resolution_event_key=v_receipt.authoritative_custody_identifier
        and c.related_execution_instance=v_passage.execution_instance
        and c.related_oar2=v_passage.resolution->>'authority_oar_key'
        and c.integrity_hash=v_receipt.content_hash and c.resolution_status='resolved'
        and c.metadata->>'occurrence_key'=p_occurrence_key
        and c.metadata->>'nug_key'=v_passage.nug_key
        and c.metadata->>'effect_class'=v_passage.effect_class) then
    return jsonb_build_object('standing','HLD','reason','effect_receipt_evidence_unresolved');
  end if;
  update public.c3ops_nug_effect_passage set standing='receipt_returned',
    receipt_evidence_ref_key=p_receipt_evidence_ref_key,returned_at=now() where occurrence_key=p_occurrence_key;
  return jsonb_build_object('standing','receipt_returned','occurrence_key',p_occurrence_key,
    'receipt_evidence_ref_key',p_receipt_evidence_ref_key,'current_state_key',v_passage.current_state_key,
    'evidence_return_relation','registry://c3_current_evidence_ref/'||v_passage.current_state_key,
    'current_reresolution_required',true,'provider_called',false,'new_external_effects',0,
    'custody_transferred',false,'ownership_transferred',false);
end;
$$;
revoke all on function public.prepare_c3ops_nug_effect_v1(jsonb,text),
  public.return_c3ops_nug_effect_v1(text,text,text) from public,anon,authenticated;
grant execute on function public.prepare_c3ops_nug_effect_v1(jsonb,text),
  public.return_c3ops_nug_effect_v1(text,text,text) to service_role;
