begin;

create table if not exists public.c3_envpac_runtime_primitive (
  binding_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  primitive_key text not null,
  primitive_class text not null,
  display_label text not null,
  renderer_key text not null,
  runtime_endpoint text,
  sort_order integer not null default 0,
  standing text not null default 'active',
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_envpac_runtime_primitive_key_check check (length(btrim(primitive_key)) > 0),
  constraint c3_envpac_runtime_primitive_class_check check (length(btrim(primitive_class)) > 0),
  constraint c3_envpac_runtime_primitive_label_check check (length(btrim(display_label)) > 0),
  constraint c3_envpac_runtime_primitive_renderer_check check (length(btrim(renderer_key)) > 0),
  constraint c3_envpac_runtime_primitive_sort_check check (sort_order between 0 and 9999),
  constraint c3_envpac_runtime_primitive_standing_check check (standing in ('active','held','retired')),
  unique (envpac_key, primitive_key)
);

alter table public.c3_envpac_runtime_primitive enable row level security;
revoke all on public.c3_envpac_runtime_primitive from public, anon, authenticated;
grant select,insert,update on public.c3_envpac_runtime_primitive to service_role;

create or replace function public.seed_c1me_envpac_primitives_internal(p_envpac_key text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_envpac public.c3_envpac%rowtype; v_env public.c3_environment%rowtype;
begin
  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true and standing='effective';
  if not found then return jsonb_build_object('seeded',false,'reason_code','envpac_not_effective','envpac_key',p_envpac_key); end if;

  select * into v_env from public.c3_environment where env_key=v_envpac.env_key and is_active=true;
  if not found or v_envpac.owner_subject_type<>'individual'
     or v_env.environment_class<>'c3me_individual_environment'
     or v_env.standing<>'c1_connected' then
    return jsonb_build_object('seeded',false,'reason_code','not_persisted_individual_c1me','envpac_key',p_envpac_key);
  end if;

  insert into public.c3_envpac_runtime_primitive
    (binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,runtime_endpoint,sort_order,standing,config)
  values
    (p_envpac_key||':primitive:personalize',p_envpac_key,'personalize','environment_personalization','Personalize','c1me.personalize',null,10,'active',
      jsonb_build_object('universal',true,'avatar_required',false,'environment_local',true,'presentation_store','c3_envpac_presentation','registry_object_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:profile_pac',p_envpac_key,'profile_pac','participant_formable_pac','Profile-PAC','c1me.profile_pac','/api/my-environment-profile',20,'active',
      jsonb_build_object('universal',true,'pac_type','ProfilePAC','contract_key','pac_contract_profilepac_v1','formation_optional',true,'currently_only_participant_formable_content_pac',true,'registry_admission_requires_complete_pac',true,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:ledger',p_envpac_key,'ledger','environment_ledger','Ledger','c1me.ledger','/api/my-environment-connections',30,'active',
      jsonb_build_object('universal',true,'environment_local',true,'supports_relational_entries',true,'registry_object_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:canopy',p_envpac_key,'canopy','environment_canopy','Canopy','c1me.canopy','/api/my-environment-canopy',40,'active',
      jsonb_build_object('universal',true,'environment_local',true,'external_surface_references',true,'registry_standing_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:native_connections',p_envpac_key,'native_connections','c3_native_connections','Connections','c1me.native_connections','/api/my-environment-connections',50,'active',
      jsonb_build_object('universal',true,'environment_local',true,'bilateral_relation_required',true,'ledger_message_exchange_supported',true,'registry_object_created',false,'implementation_state','bilateral_relation_projection_pending','free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:invite_connection',p_envpac_key,'invite_connection','relational_passage','Invite Connection','c1me.invite_connection','/api/my-environment-invite',60,'active',
      jsonb_build_object('universal',true,'environment_local_origin',true,'personalized_invite',true,'optional_initiative_provenance',true,'acceptance_forms_connection',true,'share_reference_is_provenance_only',true,'registry_object_created_by_invite',false,'implementation_state','passage_exists_bilateral_acceptance_projection_pending','free_resolved_from_envpac',true))
  on conflict (envpac_key,primitive_key) do update
    set primitive_class=excluded.primitive_class,display_label=excluded.display_label,
        renderer_key=excluded.renderer_key,runtime_endpoint=excluded.runtime_endpoint,
        sort_order=excluded.sort_order,standing=excluded.standing,config=excluded.config,updated_at=now();

  update public.c3_envpac set metadata=metadata||jsonb_build_object(
    'runtime_primitive_contract','c1me_env_primitives_v1',
    'runtime_primitive_count',6,
    'free_runtime_resolution_source','envpac',
    'initiative_components_resolved_from_encountered_initiative_envpac',true,
    'avatar_universal_primitive',false
  ),updated_at=now() where envpac_key=p_envpac_key;

  return jsonb_build_object('seeded',true,'envpac_key',p_envpac_key,'primitive_contract','c1me_env_primitives_v1','primitive_count',6);
end $$;
revoke all on function public.seed_c1me_envpac_primitives_internal(text) from public,anon,authenticated;
grant execute on function public.seed_c1me_envpac_primitives_internal(text) to service_role;

create or replace function public.c1me_envpac_primitive_seed_trigger()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  perform public.seed_c1me_envpac_primitives_internal(new.envpac_key);
  return new;
end $$;

drop trigger if exists c1me_envpac_primitive_seed_after_change on public.c3_envpac;
create trigger c1me_envpac_primitive_seed_after_change
after insert or update of is_effective,standing,env_key,owner_subject_type
on public.c3_envpac for each row execute function public.c1me_envpac_primitive_seed_trigger();

create or replace function public.resolve_c1me_envpac_primitives_internal(p_relationship_key text)
returns jsonb language plpgsql stable security definer set search_path=public,pg_temp as $$
declare v_current jsonb; v_envpac_key text; v_primitives jsonb;
begin
  v_current:=public.resolve_c1me_current_internal(p_relationship_key);
  if coalesce(v_current->>'resolution','')<>'existing_c1' then
    return v_current||jsonb_build_object('primitive_resolution','held','primitive_contract','c1me_env_primitives_v1','primitives','[]'::jsonb);
  end if;
  v_envpac_key:=v_current->>'envpac_ref';
  select coalesce(jsonb_agg(jsonb_build_object(
    'primitive_key',primitive_key,'primitive_class',primitive_class,'display_label',display_label,
    'renderer_key',renderer_key,'runtime_endpoint',runtime_endpoint,'sort_order',sort_order,'config',config
  ) order by sort_order,primitive_key),'[]'::jsonb)
  into v_primitives
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key and standing='active';
  return v_current||jsonb_build_object(
    'primitive_resolution','envpac_resolved','primitive_contract','c1me_env_primitives_v1',
    'free_resolution_source','envpac','primitives',v_primitives,
    'initiative_projection_rule','encountered_or_invited_initiative_envpac_only',
    'frontend_invention_allowed',false
  );
end $$;
revoke all on function public.resolve_c1me_envpac_primitives_internal(text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_envpac_primitives_internal(text) to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c1me_envpac_primitives_v1','c3_field','c1ME EnvPAC Runtime Primitives v1','active',
  'supabase/migrations/20260924114000_c1me_envpac_runtime_primitives_v1.sql','operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044','primitive_count',6,
    'primitive_keys',jsonb_build_array('personalize','profile_pac','ledger','canopy','native_connections','invite_connection'),
    'resolution_chain','relationship -> CURRENT -> exact EnvPAC -> FREE -> active primitive bindings',
    'envpac_only_native_free_source_inside_environment',true,
    'initiative_projection','FREE from encountered/invited initiative EnvPAC; not universal c1ME primitive',
    'avatar_is_universal_primitive',false,'profile_pac_current_participant_formable_pac',true,
    'environment_runtime_state_not_registry_pacs',jsonb_build_array('personalize','ledger','canopy','native_connections','invite_connection'),
    'frontend_may_invent_primitives',false,'current_change_may_change_resolved_components_without_frontend_deploy',true
  ),
  'c1ME EnvPAC Runtime Primitives v1',
  'EnvPAC-governed FREE resolution of universal persisted c1ME runtime primitives',
  'active','registered_runtime_contract',
  jsonb_build_array('envpac:c3envpac_person_*','current:resolve_c1me_current_internal','profile_contract:pac_contract_profilepac_v1','canopy:c1me_canopy_reference_controls_v1'),
  'oar2',false,true,true,now(),now()
) on conflict (process_key) do update
set process_status=excluded.process_status,status=excluded.status,authority_state=excluded.authority_state,
    metadata=excluded.metadata,updated_at=now();

select public.seed_c1me_envpac_primitives_internal(p.envpac_key)
from public.c3_envpac p join public.c3_environment e on e.env_key=p.env_key
where p.is_effective=true and p.standing='effective' and p.owner_subject_type='individual'
  and e.environment_class='c3me_individual_environment' and e.standing='c1_connected' and e.is_active=true;

update public.c3_envpac set metadata=metadata||jsonb_build_object(
  'personal_c1me_runtime_primitive_contract','c1me_env_primitives_v1',
  'personal_c1me_primitive_count',6,'avatar_universal_primitive',false,
  'initiative_projection_source','encountered_or_invited_initiative_envpac'
),updated_at=now()
where envpac_key='c3envpac_c1me_v0_1';

commit;
