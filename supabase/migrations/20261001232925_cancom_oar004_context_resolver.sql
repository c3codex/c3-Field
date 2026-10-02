-- Generalized CanCom context resolution.  Existing relation rails stay distinct.
-- This function reads Registry evidence; it creates no relation or passage.
create table if not exists public.c3ops_cancom_context_binding (
  binding_key text primary key,
  relation_class text not null check (relation_class in ('person_institution','system_system')),
  relation_ref text not null,
  origin_environment text not null references public.c3_environment(env_key),
  receiving_environment text not null references public.c3_environment(env_key),
  asserted_sender text not null,
  resolved_actor text not null,
  audience_role text not null,
  transport_adapter text not null,
  payload_custody_class text not null,
  source_authority_ref text not null,
  capability_ref text not null references public.c3_envpac_capability_grant(capability_key),
  operator_confirmed_at timestamptz not null,
  standing text not null check (standing in ('active','held','revoked')),
  created_at timestamptz not null default now(),
  unique (relation_class,relation_ref,origin_environment,receiving_environment,asserted_sender)
);
alter table public.c3ops_cancom_context_binding enable row level security;
revoke all on public.c3ops_cancom_context_binding from public,anon,authenticated;
grant select,insert,update on public.c3ops_cancom_context_binding to service_role;

create or replace function public.cancom_context_binding_guard_v1() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare v_cap public.c3_envpac_capability_grant%rowtype;
begin
  if tg_op='UPDATE' and new.standing='revoked' and old.standing<>'revoked'
    and new.binding_key=old.binding_key and new.relation_ref=old.relation_ref
    and new.capability_ref=old.capability_ref then
    return new;
  end if;
  select * into v_cap from public.c3_envpac_capability_grant
    where capability_key=new.capability_ref and standing='active';
  if not found or not (v_cap.scope->'allowed_actions' ? 'register_cancom_context_binding')
    or v_cap.scope->>'relation_ref'<>new.relation_ref
    or v_cap.scope->>'relation_class'<>new.relation_class
    or v_cap.scope->>'origin_environment'<>new.origin_environment
    or v_cap.scope->>'receiving_environment'<>new.receiving_environment
    or v_cap.scope->>'resolved_actor'<>new.resolved_actor
    or v_cap.scope->>'source_authority_ref'<>new.source_authority_ref
    or coalesce((v_cap.scope->>'operator_confirmed')::boolean,false) is not true
    or coalesce((v_cap.scope->>'operator_confirmed_at')::timestamptz,'epoch'::timestamptz)<>new.operator_confirmed_at then
    raise exception 'HLD: explicit CanCom context binding authority unresolved';
  end if;
  if not exists(select 1 from public.c3_environment e where e.env_key=new.origin_environment and e.is_active)
    or not exists(select 1 from public.c3_environment e where e.env_key=new.receiving_environment and e.is_active) then
    raise exception 'HLD: CanCom binding environment inactive';
  end if;
  return new;
end; $$;
create trigger cancom_context_binding_guard before insert or update on public.c3ops_cancom_context_binding
for each row execute function public.cancom_context_binding_guard_v1();

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
    if v_ref !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      return jsonb_build_object('standing','HLD','reason','initiative_relation_ref_invalid');
    end if;
    select count(*) into v_count from public.c2_mdm_participation_relation p
      where p.participation_key=v_ref::uuid and p.standing='active' and p.revoked_at is null
      and p.passage_standing='c2_participation_granted'
      and p.source_env_key=v_origin and p.target_environment_key=v_target
      and p.participant_relationship_key=v_asserted;
    if v_count<>1 then
      return jsonb_build_object('standing','HLD','reason','initiative_participation_or_actor_unresolved');
    end if;
    select * into v_participation from public.c2_mdm_participation_relation where participation_key=v_ref::uuid;
    if v_transport<>'registry_cancom_internal' or v_audience not in ('operator','participant')
      or v_payload_class not in ('registry_custody_ref','none') then
      return jsonb_build_object('standing','HLD','reason','initiative_transport_or_optics_boundary');
    end if;
    v_actor:=v_participation.participant_relationship_key;
    v_optics:=case when v_audience='participant' then 'participant_relation_only' else 'operator_context' end;
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
