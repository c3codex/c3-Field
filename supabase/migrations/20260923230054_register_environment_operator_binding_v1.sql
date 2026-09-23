create table if not exists public.c3_environment_operator_binding (
  environment_operator_binding_key text primary key,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete cascade,
  envpac_key text references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  operator_standing_key text not null references public.c3_operator_standing(operator_standing_key) on update cascade,
  carrier_binding_key text not null references public.c3_named_individual_operator_binding(relation_key) on update cascade,
  operator_role text not null default 'operator' check (btrim(operator_role) <> ''),
  binding_standing text not null check (binding_standing in ('active','held','revoked')),
  scope_class text not null check (btrim(scope_class) <> ''),
  c3me_standing_required boolean not null default false,
  minimum_c3me_standing text,
  determination_process_key text not null references public.system_process_registry(process_key) on update cascade,
  evidence_ref text not null,
  effective_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (env_key, operator_standing_key, carrier_binding_key),
  check (
    (c3me_standing_required = false and minimum_c3me_standing is null)
    or
    (c3me_standing_required = true and btrim(coalesce(minimum_c3me_standing,'')) <> '')
  )
);

comment on table public.c3_environment_operator_binding is
'First-class determined binding admitting an existing operator standing, carried by a named individual, to a governed environment. Independent of participant C1/C2/C3 standing; effect-specific C3 requirements remain separately governed.';

comment on column public.c3_environment_operator_binding.c3me_standing_required is
'Whether this environment-operator binding itself requires C3ME standing. False does not waive C3-class effect requirements.';

alter table public.c3_environment_operator_binding enable row level security;
revoke all on public.c3_environment_operator_binding from public, anon, authenticated;
grant select, insert, update on public.c3_environment_operator_binding to service_role;

insert into public.system_process_registry (
  process_key, process_family, title, status, source_path, authority_state, metadata,
  process_title, process_scope, process_status, authority_level, source_reference_set,
  required_oar_type, requires_operator_confirm, requires_preflight, requires_oar1_closeout
) values (
  'c3_environment_operator_binding_v1',
  'c3_field',
  'c3 Environment Operator Binding',
  'active',
  'Drive:1N0ynGeVOvkimo5VUq-OPzbzsXqq7MbX6-Oj7pyVCRXg',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'standing','registered_determined_relation',
    'operator_is_first_class_determined_field',true,
    'operator_standing_independent_of_c3me_standing',true,
    'environment_passage_separate_from_operator_standing',true,
    'default_c3me_standing_required',false,
    'c3_class_effects_may_require_separate_standing',true,
    'creates_ownership',false,
    'creates_custody',false,
    'creates_current',false,
    'creates_participant_standing',false,
    'creates_c2_c3_standing',false,
    'creates_c3_key',false,
    'creates_wallet_authority',false,
    'bypasses_release_holds',false,
    'notchazz_boundary_required_for_passage_or_action',true,
    'source_drive_id','1N0ynGeVOvkimo5VUq-OPzbzsXqq7MbX6-Oj7pyVCRXg'
  ),
  'c3 Environment Operator Binding',
  'Determine and persist which active operator standing, carried by which named individual, is admitted to operate in which governed environment and under what standing prerequisite.',
  'active',
  'determined_environment_operator_relation',
  jsonb_build_object(
    'drive_document_id','1N0ynGeVOvkimo5VUq-OPzbzsXqq7MbX6-Oj7pyVCRXg',
    'captured_by','op044',
    'captured_at','2026-09-23'
  ),
  'oar2',
  true,
  true,
  false
)
on conflict (process_key) do update
set metadata = excluded.metadata,
    authority_state = excluded.authority_state,
    process_scope = excluded.process_scope,
    source_reference_set = excluded.source_reference_set,
    updated_at = now();

insert into public.c3_environment_operator_binding (
  environment_operator_binding_key,
  env_key,
  envpac_key,
  operator_standing_key,
  carrier_binding_key,
  operator_role,
  binding_standing,
  scope_class,
  c3me_standing_required,
  minimum_c3me_standing,
  determination_process_key,
  evidence_ref,
  metadata
) values (
  'envop_op044_env_person_eea672f5a7676dad4316755b_v1',
  'env_person_eea672f5a7676dad4316755b',
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1',
  'op044_operator_standing',
  'stephanie_joanne__op044__binding',
  'operator',
  'active',
  'project_operator_personal_environment',
  false,
  null,
  'c3_environment_operator_binding_v1',
  'Drive:1N0ynGeVOvkimo5VUq-OPzbzsXqq7MbX6-Oj7pyVCRXg',
  jsonb_build_object(
    'effect_ceiling','bounded_environment_operation_only',
    'owner_relation_unchanged',true,
    'crs_owner_relationship','crs_93e901234ae044a396654ee80644b005',
    'current_unchanged','current_env_person_eea672f5a7676dad4316755b_v1',
    'release_hold_bypass',false
  )
)
on conflict (env_key, operator_standing_key, carrier_binding_key) do update
set envpac_key = excluded.envpac_key,
    operator_role = excluded.operator_role,
    binding_standing = excluded.binding_standing,
    scope_class = excluded.scope_class,
    c3me_standing_required = excluded.c3me_standing_required,
    minimum_c3me_standing = excluded.minimum_c3me_standing,
    determination_process_key = excluded.determination_process_key,
    evidence_ref = excluded.evidence_ref,
    metadata = excluded.metadata,
    revoked_at = null,
    updated_at = now();
