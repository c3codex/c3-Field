begin;

drop index if exists public.c3_env_share_reference_one_active_envpac_uq;
create index if not exists c3_env_share_reference_source_active_idx
  on public.c3_env_share_reference(source_envpac_key,share_state,created_at desc);

create table if not exists public.c3_env_invite_acceptance (
  acceptance_key uuid primary key default gen_random_uuid(),
  share_reference uuid not null references public.c3_env_share_reference(share_reference) on update cascade,
  target_relationship_key text not null,
  acceptance_state text not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_env_invite_acceptance_state_check check (acceptance_state in ('pending','accepted','held','revoked')),
  unique(share_reference,target_relationship_key)
);

create table if not exists public.c3_env_native_connection (
  connection_key text primary key,
  pair_key text not null unique,
  source_relationship_key text not null,
  source_env_key text not null references public.c3_environment(env_key) on update cascade,
  source_envpac_key text not null references public.c3_envpac(envpac_key) on update cascade,
  target_relationship_key text not null,
  target_env_key text not null references public.c3_environment(env_key) on update cascade,
  target_envpac_key text not null references public.c3_envpac(envpac_key) on update cascade,
  standing text not null default 'active',
  formed_from_share_reference uuid references public.c3_env_share_reference(share_reference) on update cascade,
  formed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_env_native_connection_standing_check check (standing in ('active','revoked')),
  constraint c3_env_native_connection_distinct_relations_check check (source_relationship_key<>target_relationship_key)
);
create index if not exists c3_env_native_connection_source_idx on public.c3_env_native_connection(source_relationship_key,standing,formed_at desc);
create index if not exists c3_env_native_connection_target_idx on public.c3_env_native_connection(target_relationship_key,standing,formed_at desc);

create table if not exists public.c3_env_native_connection_event (
  event_key uuid primary key default gen_random_uuid(),
  connection_key text not null references public.c3_env_native_connection(connection_key) on update cascade on delete cascade,
  event_type text not null,
  actor_relationship_key text,
  share_reference uuid references public.c3_env_share_reference(share_reference) on update cascade,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint c3_env_native_connection_event_type_check check (event_type in ('invite_accepted','message_sent','connection_revoked')),
  unique(connection_key,event_type,share_reference)
);

create table if not exists public.c3_env_connection_message (
  message_key uuid primary key default gen_random_uuid(),
  connection_key text not null references public.c3_env_native_connection(connection_key) on update cascade on delete cascade,
  sender_relationship_key text not null,
  message_type text not null default 'note',
  body text not null,
  standing text not null default 'active',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_env_connection_message_type_check check (message_type in ('note','introduction','opportunity','follow_up')),
  constraint c3_env_connection_message_body_check check (length(btrim(body)) between 1 and 5000),
  constraint c3_env_connection_message_standing_check check (standing in ('active','removed'))
);
create index if not exists c3_env_connection_message_connection_idx on public.c3_env_connection_message(connection_key,standing,created_at);

create table if not exists public.c3_env_initiative_visibility (
  visibility_key text primary key,
  relationship_key text not null,
  env_key text not null references public.c3_environment(env_key) on update cascade,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade,
  initiative_key text not null,
  initiative_envpac_key text not null references public.c3_envpac(envpac_key) on update cascade,
  target_environment_key text,
  visibility_source text not null,
  source_ref text,
  standing text not null default 'active',
  visible_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_env_initiative_visibility_source_check check (visibility_source in ('encounter','invite')),
  constraint c3_env_initiative_visibility_standing_check check (standing in ('active','revoked')),
  unique(relationship_key,initiative_key)
);

create table if not exists public.c3_initiative_connection_projection (
  projection_key text primary key,
  initiative_key text not null,
  initiative_envpac_key text not null references public.c3_envpac(envpac_key) on update cascade,
  connection_key text not null references public.c3_env_native_connection(connection_key) on update cascade on delete cascade,
  source_relationship_key text not null,
  target_relationship_key text not null,
  source_share_reference uuid references public.c3_env_share_reference(share_reference) on update cascade,
  standing text not null default 'active',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  constraint c3_initiative_connection_projection_standing_check check (standing in ('active','revoked')),
  unique(initiative_key,connection_key)
);

create table if not exists public.c3_envpac_runtime_component (
  binding_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  context_class text not null,
  context_key text not null,
  component_key text not null,
  renderer_key text not null,
  sort_order integer not null default 0,
  standing text not null default 'active',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_envpac_runtime_component_standing_check check (standing in ('active','held','retired')),
  constraint c3_envpac_runtime_component_sort_check check (sort_order between 0 and 9999),
  unique(envpac_key,context_class,context_key,component_key)
);

alter table public.c3_env_invite_acceptance enable row level security;
alter table public.c3_env_native_connection enable row level security;
alter table public.c3_env_native_connection_event enable row level security;
alter table public.c3_env_connection_message enable row level security;
alter table public.c3_env_initiative_visibility enable row level security;
alter table public.c3_initiative_connection_projection enable row level security;
alter table public.c3_envpac_runtime_component enable row level security;

revoke all on public.c3_env_invite_acceptance from public,anon,authenticated;
revoke all on public.c3_env_native_connection from public,anon,authenticated;
revoke all on public.c3_env_native_connection_event from public,anon,authenticated;
revoke all on public.c3_env_connection_message from public,anon,authenticated;
revoke all on public.c3_env_initiative_visibility from public,anon,authenticated;
revoke all on public.c3_initiative_connection_projection from public,anon,authenticated;
revoke all on public.c3_envpac_runtime_component from public,anon,authenticated;

grant select,insert,update on public.c3_env_invite_acceptance to service_role;
grant select,insert,update on public.c3_env_native_connection to service_role;
grant select,insert on public.c3_env_native_connection_event to service_role;
grant select,insert,update on public.c3_env_connection_message to service_role;
grant select,insert,update on public.c3_env_initiative_visibility to service_role;
grant select,insert,update on public.c3_initiative_connection_projection to service_role;
grant select,insert,update on public.c3_envpac_runtime_component to service_role;

create or replace function public.record_c1me_invite_acceptance_pending(p_share_reference uuid,p_target_relationship_key text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  v_share public.c3_env_share_reference%rowtype;
  v_target public.crs_relationship%rowtype;
  v_acceptance uuid;
begin
  select * into v_share from public.c3_env_share_reference
  where share_reference=p_share_reference and share_state='active' and revoked_at is null;
  if not found then return jsonb_build_object('accepted',false,'reason_code','invite_reference_unavailable'); end if;

  select * into v_target from public.crs_relationship
  where relationship_key=p_target_relationship_key and is_active=true;
  if not found then return jsonb_build_object('accepted',false,'reason_code','target_relationship_unavailable'); end if;
  if v_share.owner_subject_key=p_target_relationship_key then
    return jsonb_build_object('accepted',false,'reason_code','self_invite_not_allowed');
  end if;

  insert into public.c3_env_invite_acceptance(share_reference,target_relationship_key,acceptance_state,metadata)
  values (p_share_reference,p_target_relationship_key,'pending',jsonb_build_object(
    'source_env_key',v_share.source_env_key,'source_envpac_key',v_share.source_envpac_key,
    'source_relationship_key',v_share.owner_subject_key,'connection_created',false,'registry_standing_created',false))
  on conflict (share_reference,target_relationship_key) do update
    set acceptance_state=case when public.c3_env_invite_acceptance.acceptance_state='accepted' then 'accepted' else 'pending' end,
        updated_at=now()
  returning acceptance_key into v_acceptance;

  return jsonb_build_object('accepted',true,'acceptance_key',v_acceptance,'acceptance_state','pending',
    'connection_created',false,'registry_standing_created',false);
end $$;
revoke all on function public.record_c1me_invite_acceptance_pending(uuid,text) from public,anon,authenticated;
grant execute on function public.record_c1me_invite_acceptance_pending(uuid,text) to service_role;

create or replace function public.finalize_c1me_invite_connections_internal(
  p_target_relationship_key text,p_target_env_key text,p_target_envpac_key text
)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare
  v_target_pac public.c3_envpac%rowtype;
  v_pending record;
  v_share public.c3_env_share_reference%rowtype;
  v_source_pac public.c3_envpac%rowtype;
  v_low text; v_high text; v_pair text; v_connection_key text;
  v_initiative_key text; v_initiative_envpac_key text; v_target_initiative_env text; v_invite_message text;
  v_count integer:=0; v_connections jsonb:='[]'::jsonb;
begin
  select * into v_target_pac from public.c3_envpac
  where envpac_key=p_target_envpac_key and env_key=p_target_env_key
    and owner_subject_type='individual' and owner_subject_key=p_target_relationship_key
    and standing='effective' and is_effective=true;
  if not found then return jsonb_build_object('finalized',false,'reason_code','target_envpac_mismatch','connections','[]'::jsonb); end if;

  if not exists (select 1 from public.c3_envpac_access_grant
    where envpac_key=p_target_envpac_key and subject_type='individual' and subject_key=p_target_relationship_key
      and relation_role='owner' and standing='active' and revoked_at is null
      and (expires_at is null or expires_at>now()))
  then return jsonb_build_object('finalized',false,'reason_code','target_owner_grant_unavailable','connections','[]'::jsonb); end if;

  for v_pending in
    select * from public.c3_env_invite_acceptance
    where target_relationship_key=p_target_relationship_key and acceptance_state='pending'
    order by created_at for update
  loop
    select * into v_share from public.c3_env_share_reference
    where share_reference=v_pending.share_reference and share_state='active' and revoked_at is null;
    if not found then
      update public.c3_env_invite_acceptance set acceptance_state='held',
        metadata=metadata||jsonb_build_object('hold_reason','share_reference_unavailable'),updated_at=now()
      where acceptance_key=v_pending.acceptance_key;
      continue;
    end if;
    if v_share.owner_subject_key=p_target_relationship_key then
      update public.c3_env_invite_acceptance set acceptance_state='held',
        metadata=metadata||jsonb_build_object('hold_reason','self_invite_not_allowed'),updated_at=now()
      where acceptance_key=v_pending.acceptance_key;
      continue;
    end if;

    select * into v_source_pac from public.c3_envpac
    where envpac_key=v_share.source_envpac_key and env_key=v_share.source_env_key
      and owner_subject_type='individual' and owner_subject_key=v_share.owner_subject_key
      and standing='effective' and is_effective=true;
    if not found then
      update public.c3_env_invite_acceptance set acceptance_state='held',
        metadata=metadata||jsonb_build_object('hold_reason','source_envpac_unavailable'),updated_at=now()
      where acceptance_key=v_pending.acceptance_key;
      continue;
    end if;

    v_low:=least(v_share.owner_subject_key,p_target_relationship_key);
    v_high:=greatest(v_share.owner_subject_key,p_target_relationship_key);
    v_pair:=md5(v_low||':'||v_high);
    v_connection_key:='connection_'||v_pair;

    insert into public.c3_env_native_connection(
      connection_key,pair_key,source_relationship_key,source_env_key,source_envpac_key,
      target_relationship_key,target_env_key,target_envpac_key,standing,formed_from_share_reference,metadata
    ) values (
      v_connection_key,v_pair,v_share.owner_subject_key,v_share.source_env_key,v_share.source_envpac_key,
      p_target_relationship_key,p_target_env_key,p_target_envpac_key,'active',v_share.share_reference,
      jsonb_build_object('source','invite_acceptance','one_relation_multiple_environment_projections',true,
        'registry_standing_created',false,'authority_created',false))
    on conflict (pair_key) do update set standing='active',revoked_at=null,updated_at=now();

    insert into public.c3_env_native_connection_event(connection_key,event_type,actor_relationship_key,share_reference,event_data)
    values (v_connection_key,'invite_accepted',p_target_relationship_key,v_share.share_reference,
      jsonb_build_object('source_env_key',v_share.source_env_key,'target_env_key',p_target_env_key,'invite_metadata',v_share.metadata))
    on conflict (connection_key,event_type,share_reference) do nothing;

    insert into public.c1_environment_connection_thread(thread_key,env_key,envpac_key,owner_relationship_key,title,standing,visibility,metadata)
    values
      ('connections:'||v_share.source_env_key,v_share.source_env_key,v_share.source_envpac_key,v_share.owner_subject_key,
       'Connections','active','owner_private',jsonb_build_object('source','native_connection_projection','thread_is_authority',false,'thread_is_relationship_registry',false)),
      ('connections:'||p_target_env_key,p_target_env_key,p_target_envpac_key,p_target_relationship_key,
       'Connections','active','owner_private',jsonb_build_object('source','native_connection_projection','thread_is_authority',false,'thread_is_relationship_registry',false))
    on conflict (thread_key) do nothing;

    v_initiative_key:=nullif(v_share.metadata->>'source_initiative_key','');
    v_initiative_envpac_key:=nullif(v_share.metadata->>'initiative_envpac_key','');
    v_target_initiative_env:=nullif(v_share.metadata->>'target_environment_key','');
    v_invite_message:=nullif(v_share.metadata->>'invite_message','');

    if v_initiative_key is not null and v_initiative_envpac_key is not null and exists (
      select 1 from public.c3_envpac where envpac_key=v_initiative_envpac_key and is_effective=true
    ) then
      insert into public.c3_env_initiative_visibility(
        visibility_key,relationship_key,env_key,envpac_key,initiative_key,initiative_envpac_key,
        target_environment_key,visibility_source,source_ref,standing,metadata
      ) values (
        'initiative_visibility_'||md5(p_target_relationship_key||':'||v_initiative_key),
        p_target_relationship_key,p_target_env_key,p_target_envpac_key,v_initiative_key,v_initiative_envpac_key,
        v_target_initiative_env,'invite','share_reference:'||v_share.share_reference::text,'active',
        jsonb_build_object('source_connection_key',v_connection_key,'visibility_only',true,
          'participation_standing_created',false,'registry_standing_created',false))
      on conflict (relationship_key,initiative_key) do update
        set standing='active',revoked_at=null,initiative_envpac_key=excluded.initiative_envpac_key,
            target_environment_key=excluded.target_environment_key,visibility_source='invite',
            source_ref=excluded.source_ref,metadata=public.c3_env_initiative_visibility.metadata||excluded.metadata;

      insert into public.c3_initiative_connection_projection(
        projection_key,initiative_key,initiative_envpac_key,connection_key,source_relationship_key,
        target_relationship_key,source_share_reference,standing,metadata
      ) values (
        'initiative_connection_'||md5(v_initiative_key||':'||v_connection_key),v_initiative_key,
        v_initiative_envpac_key,v_connection_key,v_share.owner_subject_key,p_target_relationship_key,
        v_share.share_reference,'active',jsonb_build_object('invite_message',v_invite_message,
          'connection_projection_only',true,'participation_standing_created',false))
      on conflict (initiative_key,connection_key) do update
        set standing='active',metadata=public.c3_initiative_connection_projection.metadata||excluded.metadata;
    end if;

    update public.c3_env_invite_acceptance
    set acceptance_state='accepted',accepted_at=coalesce(accepted_at,now()),updated_at=now(),
        metadata=metadata||jsonb_build_object('connection_key',v_connection_key,'connection_created',true)
    where acceptance_key=v_pending.acceptance_key;

    v_count:=v_count+1;
    v_connections:=v_connections||jsonb_build_array(jsonb_build_object(
      'connection_key',v_connection_key,'source_relationship_key',v_share.owner_subject_key,
      'target_relationship_key',p_target_relationship_key,'initiative_key',v_initiative_key));
  end loop;

  return jsonb_build_object('finalized',true,'connection_count',v_count,'connections',v_connections,'registry_standing_created',false);
end $$;
revoke all on function public.finalize_c1me_invite_connections_internal(text,text,text) from public,anon,authenticated;
grant execute on function public.finalize_c1me_invite_connections_internal(text,text,text) to service_role;

create or replace function public.resolve_c1me_visible_initiatives_internal(p_relationship_key text)
returns jsonb language plpgsql stable security definer set search_path=public,pg_temp as $$
declare v_current jsonb; v_env_key text; v_envpac_key text; v_items jsonb;
begin
  v_current:=public.resolve_c1me_current_internal(p_relationship_key);
  if coalesce(v_current->>'resolution','')<>'existing_c1' then
    return v_current||jsonb_build_object('initiative_resolution','held','initiatives','[]'::jsonb);
  end if;
  v_env_key:=v_current->>'env_key'; v_envpac_key:=v_current->>'envpac_ref';

  select coalesce(jsonb_agg(item order by initiative_key),'[]'::jsonb) into v_items
  from (
    select v.initiative_key,jsonb_build_object(
      'initiative_key',v.initiative_key,'initiative_envpac_key',v.initiative_envpac_key,
      'target_environment_key',v.target_environment_key,'visibility_source',v.visibility_source,
      'components',coalesce((select jsonb_agg(jsonb_build_object(
        'component_key',c.component_key,'renderer_key',c.renderer_key,'sort_order',c.sort_order,'config',c.config
      ) order by c.sort_order,c.component_key)
      from public.c3_envpac_runtime_component c
      where c.envpac_key=v.initiative_envpac_key and c.context_class='initiative'
        and c.context_key=v.initiative_key and c.standing='active'),'[]'::jsonb)
    ) as item
    from public.c3_env_initiative_visibility v
    where v.relationship_key=p_relationship_key and v.env_key=v_env_key and v.envpac_key=v_envpac_key
      and v.standing='active' and v.revoked_at is null
  ) q;

  return v_current||jsonb_build_object('initiative_resolution','envpac_resolved',
    'free_resolution_source','initiative_envpac','initiatives',v_items);
end $$;
revoke all on function public.resolve_c1me_visible_initiatives_internal(text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_visible_initiatives_internal(text) to service_role;

insert into public.c3_env_initiative_visibility(
  visibility_key,relationship_key,env_key,envpac_key,initiative_key,initiative_envpac_key,
  target_environment_key,visibility_source,source_ref,standing,metadata
)
select 'initiative_visibility_'||md5(r.participant_relationship_key||':'||r.initiative_key),
  r.participant_relationship_key,r.source_env_key,r.source_envpac_key,r.initiative_key,'c3envpac_c2me_v0_1',
  r.target_environment_key,'encounter',coalesce(r.evidence_ref,'participation_relation:'||r.participation_key::text),'active',
  jsonb_build_object('source_participation_key',r.participation_key,'existing_participation_relation',true,'visibility_is_not_new_participation',true)
from public.c2_mdm_participation_relation r
where r.initiative_key='million_dollar_mission' and r.standing='active'
  and r.passage_standing='c2_participation_granted' and r.revoked_at is null
on conflict (relationship_key,initiative_key) do nothing;

insert into public.c3_envpac_runtime_component(
  binding_key,envpac_key,context_class,context_key,component_key,renderer_key,sort_order,standing,config
) values (
  'c3envpac_c2me_v0_1:initiative:million_dollar_mission:entry','c3envpac_c2me_v0_1','initiative',
  'million_dollar_mission','mission_entry','initiative.entry_card',10,'active',
  jsonb_build_object('title','The Million Dollar Mission',
    'summary','One small town. One million dollars. Ninety days. See the prospect places, contribute what you know or can bring, and support the town you think the Mission should pursue.',
    'target_environment_label','c2ME_env','route','/c2','canonical_host','mdm.c3field.online',
    'source_process_key','million_dollar_mission_c2me_initiative_v1','frontend_invention_allowed',false)
)
on conflict (envpac_key,context_class,context_key,component_key) do update
set renderer_key=excluded.renderer_key,sort_order=excluded.sort_order,standing=excluded.standing,config=excluded.config,updated_at=now();

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c1me_relational_runtime_v1','c3_field','c1ME Relational Runtime v1','active',
  'supabase/migrations/20260924115322_c1me_relational_runtime_v1.sql','operator_confirmed_registered',
  jsonb_build_object('operator','op044','invite_reference_per_invitation',true,
    'invite_submission_creates_connection',false,'authenticated_target_environment_finalizes_connection',true,
    'native_connection_one_relation_multiple_env_projections',true,'connection_messages_environment_operational_state',true,
    'initiative_visibility_sources',jsonb_build_array('encounter','invite'),
    'initiative_visibility_does_not_create_participation',true,'initiative_components_free_resolved_from_envpac',true,
    'registry_standing_created_by_runtime_relations',false,'profile_pac_boundary_unchanged',true),
  'c1ME Relational Runtime v1',
  'EnvPAC-held invite, bilateral native connection, relational ledger messaging, and evidenced initiative visibility',
  'active','registered_runtime_contract',
  jsonb_build_array('process:c1me_envpac_primitives_v1','envpac:c3envpac_person_*','initiative_envpac:c3envpac_c2me_v0_1'),
  'oar2',false,true,true,now(),now()
)
on conflict (process_key) do update
set process_status=excluded.process_status,status=excluded.status,authority_state=excluded.authority_state,
    metadata=excluded.metadata,updated_at=now();

commit;
