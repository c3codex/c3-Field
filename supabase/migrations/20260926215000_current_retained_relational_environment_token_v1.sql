begin;

comment on table public.c3_current_state is
'Operative current state for an environment: what governs now. This is distinct from CURRENT, the retained relational environment token.';

create table if not exists public.c3_current_token (
  current_token_key text primary key,
  owner_relationship_key text not null references public.crs_relationship(relationship_key) on update cascade on delete restrict,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete restrict,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete restrict,
  token_class text not null,
  source_relation_type text not null,
  source_relation_key text not null,
  source_pac_key text references public.c3_pac(pac_key) on update cascade on delete set null,
  retention_standing text not null default 'retained',
  relation_standing text not null default 'active',
  retained_at timestamptz not null default now(),
  last_relation_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_current_token_class_check check (token_class in (
    'connection','initiative','webpac','event_access','invitation','contribution','resource','other'
  )),
  constraint c3_current_token_retention_check check (retention_standing in ('retained','held','retired')),
  constraint c3_current_token_relation_check check (length(btrim(source_relation_type))>0 and length(btrim(source_relation_key))>0),
  unique (owner_relationship_key, envpac_key, source_relation_type, source_relation_key)
);

comment on table public.c3_current_token is
'CURRENT: retained relational environment tokens. Persists qualifying relationship value without replacing operative current state, asset custody, ownership, Registry standing, or authority.';

alter table public.c3_current_token enable row level security;
revoke all on public.c3_current_token from public, anon, authenticated;
grant select,insert,update on public.c3_current_token to service_role;

create index if not exists c3_current_token_envpac_idx
  on public.c3_current_token(envpac_key, retention_standing, retained_at desc);
create index if not exists c3_current_token_owner_idx
  on public.c3_current_token(owner_relationship_key, retained_at desc);

create or replace function public.retain_current_token_internal(
  p_current_token_key text,
  p_owner_relationship_key text,
  p_env_key text,
  p_envpac_key text,
  p_token_class text,
  p_source_relation_type text,
  p_source_relation_key text,
  p_source_pac_key text default null,
  p_relation_standing text default 'active',
  p_metadata jsonb default '{}'::jsonb
) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare v_token public.c3_current_token%rowtype;
begin
  if p_token_class not in ('connection','initiative','webpac','event_access','invitation','contribution','resource','other') then
    return jsonb_build_object('retained',false,'reason','unsupported_token_class');
  end if;
  insert into public.c3_current_token(
    current_token_key,owner_relationship_key,env_key,envpac_key,token_class,
    source_relation_type,source_relation_key,source_pac_key,retention_standing,
    relation_standing,metadata
  ) values (
    p_current_token_key,p_owner_relationship_key,p_env_key,p_envpac_key,p_token_class,
    p_source_relation_type,p_source_relation_key,p_source_pac_key,'retained',
    coalesce(nullif(btrim(p_relation_standing),''),'active'),
    coalesce(p_metadata,'{}'::jsonb) || jsonb_build_object(
      'authority_effect','none','financial_value_created',false,
      'transferability','none','current_state_distinct',true
    )
  )
  on conflict (owner_relationship_key,envpac_key,source_relation_type,source_relation_key)
  do update set
    relation_standing=excluded.relation_standing,
    last_relation_at=now(),
    metadata=public.c3_current_token.metadata || excluded.metadata,
    updated_at=now()
  returning * into v_token;
  return jsonb_build_object(
    'retained',true,'current_token_key',v_token.current_token_key,
    'token_class',v_token.token_class,'retention_standing',v_token.retention_standing,
    'relation_standing',v_token.relation_standing,'retained_at',v_token.retained_at
  );
end $$;

revoke all on function public.retain_current_token_internal(text,text,text,text,text,text,text,text,text,jsonb)
  from public,anon,authenticated;
grant execute on function public.retain_current_token_internal(text,text,text,text,text,text,text,text,text,jsonb)
  to service_role;

create or replace function public.retain_native_connection_current_trigger()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_relation_standing text;
begin
  v_relation_standing:=case when new.revoked_at is not null then 'revoked' else coalesce(new.standing,'active') end;
  perform public.retain_current_token_internal(
    'CURRENT:'||new.source_envpac_key||':connection:'||new.connection_key,
    new.source_relationship_key,new.source_env_key,new.source_envpac_key,
    'connection','native_connection',new.connection_key,null,v_relation_standing,
    jsonb_build_object('counterpart_relationship_key',new.target_relationship_key,'counterpart_env_key',new.target_env_key,'counterpart_envpac_key',new.target_envpac_key,'formed_at',new.formed_at,'source','c3_env_native_connection')
  );
  perform public.retain_current_token_internal(
    'CURRENT:'||new.target_envpac_key||':connection:'||new.connection_key,
    new.target_relationship_key,new.target_env_key,new.target_envpac_key,
    'connection','native_connection',new.connection_key,null,v_relation_standing,
    jsonb_build_object('counterpart_relationship_key',new.source_relationship_key,'counterpart_env_key',new.source_env_key,'counterpart_envpac_key',new.source_envpac_key,'formed_at',new.formed_at,'source','c3_env_native_connection')
  );
  return new;
end $$;

drop trigger if exists retain_native_connection_current_after_change on public.c3_env_native_connection;
create trigger retain_native_connection_current_after_change
after insert or update of standing,revoked_at
on public.c3_env_native_connection
for each row execute function public.retain_native_connection_current_trigger();

create or replace function public.retain_initiative_visibility_current_trigger()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_relation_standing text;
begin
  v_relation_standing:=case when new.revoked_at is not null then 'revoked' else coalesce(new.standing,'active') end;
  perform public.retain_current_token_internal(
    'CURRENT:'||new.envpac_key||':initiative:'||new.visibility_key,
    new.relationship_key,new.env_key,new.envpac_key,'initiative',
    'initiative_visibility',new.visibility_key,null,v_relation_standing,
    jsonb_build_object('initiative_key',new.initiative_key,'initiative_envpac_key',new.initiative_envpac_key,'target_environment_key',new.target_environment_key,'visibility_source',new.visibility_source,'source_ref',new.source_ref,'visible_at',new.visible_at,'source','c3_env_initiative_visibility')
  );
  return new;
end $$;

drop trigger if exists retain_initiative_visibility_current_after_change on public.c3_env_initiative_visibility;
create trigger retain_initiative_visibility_current_after_change
after insert or update of standing,revoked_at
on public.c3_env_initiative_visibility
for each row execute function public.retain_initiative_visibility_current_trigger();

create or replace function public.seed_current_runtime_primitive_internal(p_envpac_key text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_envpac public.c3_envpac%rowtype; v_env public.c3_environment%rowtype;
begin
  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true and standing='effective';
  if not found or v_envpac.owner_subject_type<>'individual' then return false; end if;
  select * into v_env from public.c3_environment where env_key=v_envpac.env_key and is_active=true;
  if not found or v_env.environment_class<>'c3me_individual_environment' then return false; end if;
  insert into public.c3_envpac_runtime_primitive(
    binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,
    runtime_endpoint,sort_order,standing,config
  ) values (
    p_envpac_key||':primitive:current',p_envpac_key,'current',
    'retained_relational_environment_token','CURRENT','c1me.current',
    '/api/my-environment-current',8,'active',
    jsonb_build_object(
      'universal',true,'current_semantics','retained_relational_environment_token',
      'current_state_distinct',true,'environment_local',true,'authority_created',false,
      'financial_value_created',false,'transferability','none',
      'c1_projection','dark_field_relation_lights_tree_emerges_from_retained_relations',
      'c2_projection','map_reveal_only_for_location_consented_or_registered_ground',
      'location_inference_allowed',false,'free_resolved_from_envpac',true
    )
  )
  on conflict (envpac_key,primitive_key) do update
    set primitive_class=excluded.primitive_class,display_label=excluded.display_label,
        renderer_key=excluded.renderer_key,runtime_endpoint=excluded.runtime_endpoint,
        sort_order=excluded.sort_order,standing=excluded.standing,config=excluded.config,updated_at=now();
  update public.c3_envpac set metadata=metadata || jsonb_build_object(
    'CURRENT_primitive','retained_relational_environment_token',
    'current_state_distinct_from_CURRENT',true,
    'c1_visual_origin','dark_field_no_tree_until_relations_are_retained',
    'c2_map_rule','reveal_from_retained_relations_without_location_inference'
  ),updated_at=now() where envpac_key=p_envpac_key;
  return true;
end $$;

revoke all on function public.seed_current_runtime_primitive_internal(text) from public,anon,authenticated;
grant execute on function public.seed_current_runtime_primitive_internal(text) to service_role;

create or replace function public.current_runtime_primitive_seed_trigger()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin perform public.seed_current_runtime_primitive_internal(new.envpac_key); return new; end $$;

drop trigger if exists current_runtime_primitive_seed_after_change on public.c3_envpac;
create trigger current_runtime_primitive_seed_after_change
after insert or update of is_effective,standing,env_key,owner_subject_type
on public.c3_envpac for each row execute function public.current_runtime_primitive_seed_trigger();

create or replace function public.resolve_c1me_current_tokens_internal(p_relationship_key text)
returns jsonb language plpgsql stable security definer set search_path=public,pg_temp as $$
declare v_state jsonb; v_env_key text; v_envpac_key text; v_tokens jsonb;
begin
  v_state:=public.resolve_c1me_current_internal(p_relationship_key);
  if coalesce(v_state->>'resolution','')<>'existing_c1' then
    return v_state || jsonb_build_object('CURRENT_resolution','held','CURRENT_semantics','retained_relational_environment_token','tokens','[]'::jsonb);
  end if;
  v_env_key:=v_state->>'env_key'; v_envpac_key:=v_state->>'envpac_ref';
  select coalesce(jsonb_agg(jsonb_build_object(
    'current_token_key',current_token_key,'token_class',token_class,
    'source_relation_type',source_relation_type,'source_relation_key',source_relation_key,
    'source_pac_key',source_pac_key,'retention_standing',retention_standing,
    'relation_standing',relation_standing,'retained_at',retained_at,
    'last_relation_at',last_relation_at,'metadata',metadata
  ) order by retained_at,current_token_key),'[]'::jsonb)
  into v_tokens from public.c3_current_token
  where owner_relationship_key=p_relationship_key and env_key=v_env_key and envpac_key=v_envpac_key and retention_standing='retained';
  return v_state || jsonb_build_object(
    'CURRENT_resolution','resolved','CURRENT_semantics','retained_relational_environment_token',
    'current_state_ref',v_state->>'current_ref','tokens',v_tokens,'token_count',jsonb_array_length(v_tokens),
    'c1_projection','relation_lights','c2_projection','map_when_location_qualified','location_inference_allowed',false
  );
end $$;

revoke all on function public.resolve_c1me_current_tokens_internal(text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_current_tokens_internal(text) to service_role;

insert into public.c3_current_token(
  current_token_key,owner_relationship_key,env_key,envpac_key,token_class,
  source_relation_type,source_relation_key,retention_standing,relation_standing,retained_at,last_relation_at,metadata
)
select 'CURRENT:'||c.source_envpac_key||':connection:'||c.connection_key,
  c.source_relationship_key,c.source_env_key,c.source_envpac_key,'connection','native_connection',c.connection_key,'retained',
  case when c.revoked_at is not null then 'revoked' else c.standing end,c.formed_at,c.updated_at,
  jsonb_build_object('counterpart_relationship_key',c.target_relationship_key,'counterpart_env_key',c.target_env_key,'counterpart_envpac_key',c.target_envpac_key,'formed_at',c.formed_at,'source','c3_env_native_connection','authority_effect','none','financial_value_created',false,'transferability','none','current_state_distinct',true)
from public.c3_env_native_connection c
on conflict (owner_relationship_key,envpac_key,source_relation_type,source_relation_key) do nothing;

insert into public.c3_current_token(
  current_token_key,owner_relationship_key,env_key,envpac_key,token_class,
  source_relation_type,source_relation_key,retention_standing,relation_standing,retained_at,last_relation_at,metadata
)
select 'CURRENT:'||c.target_envpac_key||':connection:'||c.connection_key,
  c.target_relationship_key,c.target_env_key,c.target_envpac_key,'connection','native_connection',c.connection_key,'retained',
  case when c.revoked_at is not null then 'revoked' else c.standing end,c.formed_at,c.updated_at,
  jsonb_build_object('counterpart_relationship_key',c.source_relationship_key,'counterpart_env_key',c.source_env_key,'counterpart_envpac_key',c.source_envpac_key,'formed_at',c.formed_at,'source','c3_env_native_connection','authority_effect','none','financial_value_created',false,'transferability','none','current_state_distinct',true)
from public.c3_env_native_connection c
on conflict (owner_relationship_key,envpac_key,source_relation_type,source_relation_key) do nothing;

insert into public.c3_current_token(
  current_token_key,owner_relationship_key,env_key,envpac_key,token_class,
  source_relation_type,source_relation_key,retention_standing,relation_standing,retained_at,last_relation_at,metadata
)
select 'CURRENT:'||v.envpac_key||':initiative:'||v.visibility_key,
  v.relationship_key,v.env_key,v.envpac_key,'initiative','initiative_visibility',v.visibility_key,'retained',
  case when v.revoked_at is not null then 'revoked' else v.standing end,v.visible_at,coalesce(v.revoked_at,v.visible_at),
  jsonb_build_object('initiative_key',v.initiative_key,'initiative_envpac_key',v.initiative_envpac_key,'target_environment_key',v.target_environment_key,'visibility_source',v.visibility_source,'source_ref',v.source_ref,'visible_at',v.visible_at,'source','c3_env_initiative_visibility','authority_effect','none','financial_value_created',false,'transferability','none','current_state_distinct',true)
from public.c3_env_initiative_visibility v
on conflict (owner_relationship_key,envpac_key,source_relation_type,source_relation_key) do nothing;

select public.seed_current_runtime_primitive_internal(p.envpac_key)
from public.c3_envpac p join public.c3_environment e on e.env_key=p.env_key
where p.is_effective=true and p.standing='effective' and p.owner_subject_type='individual'
  and e.environment_class='c3me_individual_environment' and e.is_active=true;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c3_CURRENT_retained_relational_environment_token_v1','c3_field',
  'CURRENT Retained Relational Environment Token v1','active',
  'supabase/migrations/20260926215000_current_retained_relational_environment_token_v1.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044','CURRENT_semantics','retained_relational_environment_token',
    'current_state_semantics','what_is_operative_now','current_state_distinct_from_CURRENT',true,
    'initial_retention_sources',jsonb_build_array('native_connection','initiative_visibility'),
    'future_token_classes',jsonb_build_array('webpac','event_access','invitation','contribution','resource'),
    'c1_visual','dark_field_points_of_light_tree_emerges_from_retained_relations',
    'c2_visual','map_reveal_only_for_location_consented_or_registered_ground',
    'location_inference_allowed',false,'authority_created',false,'financial_value_created',false
  ),
  'CURRENT Retained Relational Environment Token v1',
  'Retained relational continuity within governed c3 individual environments and runtime projection',
  'active','registered_runtime_contract',
  jsonb_build_array('table:c3_current_token','resolver:resolve_c1me_current_tokens_internal','primitive:c1me.current'),
  'oar2',false,true,true,now(),now()
) on conflict (process_key) do update
set status=excluded.status,process_status=excluded.process_status,authority_state=excluded.authority_state,
    metadata=excluded.metadata,updated_at=now();

commit;
