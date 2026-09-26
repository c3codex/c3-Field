begin;

create table if not exists public.c3_initiative_operator_binding (
  initiative_operator_binding_key text primary key,
  initiative_key text not null check (btrim(initiative_key) <> ''),
  initiative_process_key text not null references public.system_process_registry(process_key) on update cascade,
  initiative_envpac_key text references public.c3_envpac(envpac_key) on update cascade,
  operator_standing_key text not null references public.c3_operator_standing(operator_standing_key) on update cascade,
  carrier_binding_key text not null references public.c3_named_individual_operator_binding(relation_key) on update cascade,
  operator_class text not null check (btrim(operator_class) <> ''),
  operator_role text not null check (btrim(operator_role) <> ''),
  scope_class text not null check (btrim(scope_class) <> ''),
  authority_source_key text not null check (btrim(authority_source_key) <> ''),
  binding_standing text not null check (binding_standing in ('active','held','revoked')),
  effect_ceiling text not null check (btrim(effect_ceiling) <> ''),
  participant_standing_created boolean not null default false check (participant_standing_created=false),
  participant_visibility_created boolean not null default false check (participant_visibility_created=false),
  release_hold_bypass boolean not null default false check (release_hold_bypass=false),
  determination_process_key text not null references public.system_process_registry(process_key) on update cascade,
  evidence_ref text,
  effective_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(initiative_key,operator_standing_key,carrier_binding_key),
  check ((binding_standing='revoked' and revoked_at is not null) or (binding_standing<>'revoked' and revoked_at is null))
);

comment on table public.c3_initiative_operator_binding is
'First-class initiative-scoped operator relation. Grants bounded operational context without manufacturing participant standing or visibility, CURRENT, custody, ownership, C2 passage, or release authority.';

alter table public.c3_initiative_operator_binding enable row level security;
revoke all on public.c3_initiative_operator_binding from public,anon,authenticated;
grant select,insert,update,delete,references,trigger on public.c3_initiative_operator_binding to service_role;

create index if not exists c3_initiative_operator_binding_operator_idx
  on public.c3_initiative_operator_binding(operator_standing_key,binding_standing);
create index if not exists c3_initiative_operator_binding_initiative_idx
  on public.c3_initiative_operator_binding(initiative_key,binding_standing);
create index if not exists c3_initiative_operator_binding_process_idx
  on public.c3_initiative_operator_binding(initiative_process_key);

drop trigger if exists trg_c3_initiative_operator_binding_updated_at on public.c3_initiative_operator_binding;
create trigger trg_c3_initiative_operator_binding_updated_at
before update on public.c3_initiative_operator_binding
for each row execute function public.set_updated_at();

insert into public.system_process_registry(
  process_key,process_family,process_scope,process_title,process_status,authority_level,authority_state,
  required_oar_type,requires_oar1_closeout,requires_operator_confirm,requires_preflight,source_path,
  source_reference_set,status,title,metadata
) values (
  'c3_initiative_operator_binding_v1','c3_field',
  'Determine and persist which active operator standing, carried by which named individual, is admitted to operate which governed initiative and under what bounded initiative-scoped authority.',
  'c3 Initiative Operator Binding','active','determined_initiative_operator_relation','operator_confirmed_registered',
  'oar2',true,true,true,'thread:2026-09-25/initiative_operator_class',
  jsonb_build_object('captured_at','2026-09-25','captured_by','op044','authority','operator_confirmed_thread'),
  'active','c3 Initiative Operator Binding',
  jsonb_build_object(
    'operator','op044',
    'standing','registered_determined_relation',
    'creates_c3_key',false,
    'creates_current',false,
    'creates_custody',false,
    'creates_ownership',false,
    'creates_c2_c3_standing',false,
    'creates_participant_standing',false,
    'creates_participant_visibility',false,
    'bypasses_release_holds',false,
    'initiative_operator_is_first_class_relation',true,
    'operator_context_may_project_into_owner_my_env',true,
    'operator_context_is_distinct_from_participant_context',true,
    'initiative_invite_context_may_be_carried_by_operator',true,
    'invite_acceptance_still_creates_no_standing',true
  )
)
on conflict (process_key) do update set
  process_scope=excluded.process_scope,
  process_title=excluded.process_title,
  process_status=excluded.process_status,
  authority_level=excluded.authority_level,
  authority_state=excluded.authority_state,
  required_oar_type=excluded.required_oar_type,
  requires_oar1_closeout=excluded.requires_oar1_closeout,
  requires_operator_confirm=excluded.requires_operator_confirm,
  requires_preflight=excluded.requires_preflight,
  source_reference_set=excluded.source_reference_set,
  status=excluded.status,
  title=excluded.title,
  metadata=excluded.metadata,
  updated_at=now();

insert into public.c3_initiative_operator_binding(
  initiative_operator_binding_key,initiative_key,initiative_process_key,initiative_envpac_key,
  operator_standing_key,carrier_binding_key,operator_class,operator_role,scope_class,authority_source_key,
  binding_standing,effect_ceiling,determination_process_key,evidence_ref,metadata
) values (
  'initop_47pct_op044_v1','47pct','47pct_c2me_initiative_v1','c3envpac_c2me_v0_1',
  'op044_operator_standing','stephanie_joanne__op044__binding','initiative_operator','operator',
  'initiative_scoped','47pct_c2me_initiative_v1','active','bounded_initiative_operation_only',
  'c3_initiative_operator_binding_v1','thread:2026-09-25/initiative_operator_class',
  jsonb_build_object(
    'my_env_projection_class','operator',
    'my_env_projection_allowed',true,
    'initiative_context_label','4.7%',
    'invite_context_allowed',true,
    'invite_runtime_process','c1me_relational_runtime_v1',
    'target_environment_key','c2ME_env',
    'source_context_class','operator',
    'creates_participation',false,
    'creates_initiative_visibility',false,
    'creates_current',false,
    'creates_c2_passage',false,
    'distribution_authority_created',false,
    'release_hold_bypass',false,
    'participant_context_separate',true
  )
)
on conflict (initiative_operator_binding_key) do update set
  binding_standing='active',
  revoked_at=null,
  operator_class=excluded.operator_class,
  operator_role=excluded.operator_role,
  scope_class=excluded.scope_class,
  effect_ceiling=excluded.effect_ceiling,
  metadata=excluded.metadata,
  updated_at=now();

create or replace function public.resolve_c1me_visible_initiatives_internal(p_relationship_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,pg_temp
as $$
declare
  v_current jsonb;
  v_env_key text;
  v_envpac_key text;
  v_items jsonb;
begin
  v_current:=public.resolve_c1me_current_internal(p_relationship_key);
  if coalesce(v_current->>'resolution','')<>'existing_c1' then
    return v_current||jsonb_build_object('initiative_resolution','held','initiatives','[]'::jsonb);
  end if;

  v_env_key:=v_current->>'env_key';
  v_envpac_key:=v_current->>'envpac_ref';

  with contexts as (
    select
      v.initiative_key,
      v.initiative_envpac_key,
      v.target_environment_key,
      'participant'::text as context_class,
      v.visibility_source::text as context_source,
      null::text as initiative_operator_binding_key,
      null::text as operator_class,
      null::text as operator_role,
      true as invite_context_allowed,
      20 as precedence
    from public.c3_env_initiative_visibility v
    where v.relationship_key=p_relationship_key
      and v.env_key=v_env_key
      and v.envpac_key=v_envpac_key
      and v.standing='active'
      and v.revoked_at is null

    union all

    select
      iob.initiative_key,
      iob.initiative_envpac_key,
      coalesce(nullif(iob.metadata->>'target_environment_key',''),nullif(ip.metadata->>'environment','')),
      'operator'::text,
      'operator'::text,
      iob.initiative_operator_binding_key,
      iob.operator_class,
      iob.operator_role,
      coalesce((iob.metadata->>'invite_context_allowed')::boolean,false),
      10
    from public.c3_named_individual_crs_binding cic
    join public.c3_named_individual_operator_binding niob
      on niob.named_individual_key=cic.named_individual_key
     and niob.standing='active'
    join public.c3_operator_standing os
      on os.operator_standing_key=niob.operator_standing_key
     and os.standing='active'
    join public.c3_environment_operator_binding eob
      on eob.operator_standing_key=os.operator_standing_key
     and eob.carrier_binding_key=niob.relation_key
     and eob.binding_standing='active'
     and eob.env_key=v_env_key
     and eob.envpac_key=v_envpac_key
    join public.c3_initiative_operator_binding iob
      on iob.operator_standing_key=os.operator_standing_key
     and iob.carrier_binding_key=niob.relation_key
     and iob.binding_standing='active'
     and iob.revoked_at is null
     and iob.participant_standing_created=false
     and iob.participant_visibility_created=false
     and iob.release_hold_bypass=false
     and coalesce((iob.metadata->>'my_env_projection_allowed')::boolean,false)=true
    join public.system_process_registry ip
      on ip.process_key=iob.initiative_process_key
     and ip.process_status='active'
     and ip.status='active'
    where cic.relationship_key=p_relationship_key
      and cic.binding_standing='active'
      and cic.binding_class='governed_identity_continuity'
      and cic.revoked_at is null
  ),
  ranked as (
    select c.*,row_number() over(partition by c.initiative_key order by c.precedence,c.context_class) rn
    from contexts c
  ),
  selected as (
    select * from ranked where rn=1
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'initiative_key',s.initiative_key,
      'initiative_envpac_key',s.initiative_envpac_key,
      'target_environment_key',s.target_environment_key,
      'context_class',s.context_class,
      'context_classes',coalesce((
        select jsonb_agg(distinct c2.context_class)
        from contexts c2
        where c2.initiative_key=s.initiative_key
      ),'[]'::jsonb),
      'visibility_source',s.context_source,
      'initiative_operator_binding_key',s.initiative_operator_binding_key,
      'operator_class',s.operator_class,
      'operator_role',s.operator_role,
      'invite_context_allowed',s.invite_context_allowed,
      'components',coalesce((
        select jsonb_agg(jsonb_build_object(
          'component_key',c.component_key,
          'renderer_key',c.renderer_key,
          'sort_order',c.sort_order,
          'config',c.config
        ) order by c.sort_order,c.component_key)
        from public.c3_envpac_runtime_component c
        where c.envpac_key=s.initiative_envpac_key
          and c.context_class='initiative'
          and c.context_key=s.initiative_key
          and c.standing='active'
      ),'[]'::jsonb)
    )
    order by s.initiative_key
  ),'[]'::jsonb)
  into v_items
  from selected s;

  return v_current||jsonb_build_object(
    'initiative_resolution','envpac_resolved',
    'free_resolution_source','initiative_envpac_plus_operator_binding',
    'initiatives',v_items,
    'operator_context_creates_participation',false,
    'operator_context_creates_visibility',false
  );
end
$$;

revoke all on function public.resolve_c1me_visible_initiatives_internal(text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_visible_initiatives_internal(text) to service_role;

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
      'initiative_operator_context_source','c3_initiative_operator_binding_v1',
      'initiative_context_classes',jsonb_build_array('participant','operator'),
      'operator_context_creates_participation',false,
      'operator_context_creates_visibility',false,
      'operator_invite_context_allowed_when_binding_authorizes',true
    ),
    updated_at=now()
where process_key='c1me_relational_runtime_v1';

commit;
