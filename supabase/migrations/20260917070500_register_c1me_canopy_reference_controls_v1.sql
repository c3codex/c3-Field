-- Register bounded c1ME Canopy Reference controls v1
-- Operator: op044
-- OAR2: implement_c1me_canopy_reference_controls_chazz_005

begin;

do $$
begin
  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'c1me_mgs_evaluation:env_person_eea672f5a7676dad4316755b:v0_1'
      and object_type = 'minimum_governed_standard_evaluation'
      and standing = 'minimum_governed_standard_satisfied'
      and governed_state->>'requested_progression' = 'bounded_c1_implementation'
      and coalesce((governed_state->>'implementation_authority_created')::boolean,false) = false
  ) then
    raise exception 'Canopy controls held: satisfied c1ME MGS evaluation is not recoverable';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1'
      and object_type = 'minimum_governed_standard_binding'
      and standing = 'current'
      and coalesce((governed_state->>'scope_match')::boolean,false) = true
  ) then
    raise exception 'Canopy controls held: current c1ME MGS binding is not recoverable';
  end if;

  if not exists (
    select 1 from public.c3_canopy_law
    where canopy_key = 'c3_field_canopy_law_base'
      and is_active = true
  ) then
    raise exception 'Canopy controls held: existing c3 Canopy Law is not recoverable';
  end if;

  if exists (
    select 1 from public.system_process_registry
    where process_key = 'c1me_canopy_reference_controls_v1'
      and source_path <> 'docs/oar/c3_field/oar2_implement_c1me_canopy_reference_controls_v1.meta.md'
  ) then
    raise exception 'Canopy controls held: process-key collision with incompatible source';
  end if;
end $$;

create table if not exists public.c3_envpac_canopy_reference (
  reference_key uuid primary key default gen_random_uuid(),
  envpac_key text not null references public.c3_envpac(envpac_key),
  owner_subject_key text not null,
  surface_label text not null,
  display_label text,
  external_url text not null,
  handle text,
  sort_order integer not null default 0,
  reference_state text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  removed_at timestamptz,
  constraint c3_envpac_canopy_reference_surface_label_check check (char_length(trim(surface_label)) between 1 and 80),
  constraint c3_envpac_canopy_reference_display_label_check check (display_label is null or char_length(display_label) <= 120),
  constraint c3_envpac_canopy_reference_handle_check check (handle is null or char_length(handle) <= 160),
  constraint c3_envpac_canopy_reference_url_check check (char_length(external_url) between 1 and 2048 and external_url ~* '^(https?://|mailto:)'),
  constraint c3_envpac_canopy_reference_sort_check check (sort_order between 0 and 9999),
  constraint c3_envpac_canopy_reference_state_check check (reference_state in ('active','removed'))
);

create unique index if not exists c3_envpac_canopy_reference_active_url_uq
  on public.c3_envpac_canopy_reference (envpac_key, lower(external_url))
  where reference_state = 'active';

create index if not exists c3_envpac_canopy_reference_owner_idx
  on public.c3_envpac_canopy_reference (envpac_key, owner_subject_key, reference_state, sort_order, created_at);

alter table public.c3_envpac_canopy_reference enable row level security;

create table if not exists public.c3_envpac_canopy_event (
  event_key uuid primary key default gen_random_uuid(),
  envpac_key text not null references public.c3_envpac(envpac_key),
  reference_key uuid references public.c3_envpac_canopy_reference(reference_key),
  owner_subject_key text not null,
  event_type text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint c3_envpac_canopy_event_type_check check (event_type in ('reference_added','reference_edited','reference_removed','open_requested','c3_link_copied'))
);

create index if not exists c3_envpac_canopy_event_envpac_idx
  on public.c3_envpac_canopy_event (envpac_key, created_at desc);

alter table public.c3_envpac_canopy_event enable row level security;

insert into public.system_process_registry (
  process_key,
  process_family,
  title,
  status,
  source_path,
  authority_state,
  metadata,
  process_title,
  process_scope,
  process_status,
  authority_level,
  source_reference_set,
  required_oar_type,
  requires_operator_confirm,
  requires_preflight,
  requires_oar1_closeout,
  created_at,
  updated_at
) values (
  'c1me_canopy_reference_controls_v1',
  'c3_field',
  'c1ME Canopy Reference Controls v1',
  'active',
  'docs/oar/c3_field/oar2_implement_c1me_canopy_reference_controls_v1.meta.md',
  'operator_confirmed_bounded_control_surface',
  jsonb_build_object(
    'operator','op044',
    'standing','authorized_for_bounded_implementation',
    'execution_instance_id','implement_c1me_canopy_reference_controls_chazz_005',
    'mgs_key','c1me_minimum_governed_standard_v0_1',
    'mgs_evaluation','c1me_stephanie_mgs_evaluation_v0_1',
    'target_class','c1ME.env',
    'authorized_controls',jsonb_build_array('add','edit','remove','open','copy_c3_link'),
    'canopy_reference_rule','owner-controlled EnvPac reference/Selection; no Registry standing',
    'canopy_semantic_seam','Canopy Reference is not Canopy carrier authority',
    'existing_canopy_law','c3_field_canopy_law_base',
    'open_rule','owner browser/device navigates to stored owner-supplied URL; c3 server does not fetch external destination',
    'allowed_url_schemes',jsonb_build_array('https','http','mailto'),
    'external_provider_access','none',
    'oauth_authority',false,
    'registry_standing_created_for_reference',false,
    'c2_c3_authority_created',false,
    'runtime_preflight_required',true,
    'owner_authority_source','active EnvPac owner grant + current session + satisfied current c1ME MGS binding/evaluation',
    'active_hold_conditions',jsonb_build_array(
      jsonb_build_object('condition_key','owner_session_or_grant_invalid','result','HOLD'),
      jsonb_build_object('condition_key','mgs_binding_or_evaluation_not_current','result','HOLD'),
      jsonb_build_object('condition_key','c1_scope_changed','result','HOLD'),
      jsonb_build_object('condition_key','higher_order_capability_active','result','HOLD'),
      jsonb_build_object('condition_key','external_provider_access_attempted','result','HOLD')
    ),
    'next_permitted_transition','implement_then_oar1_closeout'
  ),
  'c1ME Canopy Reference Controls v1',
  'owner-controlled Canopy Reference Add/Edit/Remove/Open and public c3-link copy within satisfied c1ME scope',
  'active',
  'bounded_runtime_control',
  jsonb_build_array(
    'governance:c1me_canopy_reference_boundary_rule_v1',
    'mgs:c1me_minimum_governed_standard_v0_1',
    'evaluation:c1me_stephanie_mgs_evaluation_v0_1',
    'canopy_law:c3_field_canopy_law_base',
    'oar2:implement_c1me_canopy_reference_controls_chazz_005'
  ),
  'oar2',
  false,
  true,
  true,
  now(),
  now()
)
on conflict (process_key) do nothing;

insert into public.measures_persistence_state (
  persistence_key,
  process_key,
  oar2_key,
  environment_key,
  object_key,
  object_type,
  governed_state,
  evidence,
  custody,
  lineage,
  standing,
  next_permitted_transition,
  persisted_by,
  persisted_at,
  updated_at
) values (
  'c1me_canopy_reference_controls_v1:implementation_authority:env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1',
  'implement_c1me_canopy_reference_controls_chazz_005',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1_env_person_eea672f5a7676dad4316755b',
  'bounded_implementation_authority',
  jsonb_build_object(
    'process_key','c1me_canopy_reference_controls_v1',
    'target_env_key','env_person_eea672f5a7676dad4316755b',
    'target_envpac_key','c3envpac_person_eea672f5a7676dad4316755b_v0_1',
    'subject_key','crs_93e901234ae044a396654ee80644b005',
    'mgs_evaluation','c1me_stephanie_mgs_evaluation_v0_1',
    'mgs_result','minimum_governed_standard_satisfied',
    'authorized_controls',jsonb_build_array('add','edit','remove','open','copy_c3_link'),
    'reference_storage_class','envpac_operational_selection',
    'reference_registry_standing_created',false,
    'canopy_carrier_authority_created',false,
    'external_provider_access_created',false,
    'oauth_authority_created',false,
    'external_write_authority_created',false,
    'c2_standing_created',false,
    'c3_standing_created',false,
    'runtime_release_authorized',true,
    'source_superseded',false
  ),
  jsonb_build_object(
    'operator','op044',
    'operator_instruction','proceed',
    'execution_instance_id','implement_c1me_canopy_reference_controls_chazz_005',
    'oar2_governance_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_implement_c1me_canopy_reference_controls_v1.meta.md',
    'oar2_governance_commit','8426c27d041b4665037273328c17d310fe3ec654',
    'oar2_governance_blob_sha1','abcb20aa8a05dfe34c0cbb15a10cd9c1ad2b10b7',
    'mgs_evaluation_persistence','c1me_mgs_evaluation:env_person_eea672f5a7676dad4316755b:v0_1',
    'canopy_boundary_rule','c1me_canopy_reference_boundary_rule_v1',
    'source_concordance_control','current_source_concordance_v16'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'reference_data_custody','c3_field EnvPac operational store under owner control',
    'external_destination_custody','external provider / owner; not c3',
    'ownership_transfer',false,
    'custody_transfer',false,
    'public_release',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'mgs_evaluation','c1me_mgs_evaluation:env_person_eea672f5a7676dad4316755b:v0_1',
    'mgs_binding','c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1',
    'boundary_rule','c1me_canopy_reference_boundary_rule_v1',
    'existing_canopy_law','c3_field_canopy_law_base',
    'source_superseded',false
  ),
  'authorized_for_bounded_implementation',
  'implement_c1me_canopy_reference_controls_v1',
  'registrar',
  now(),
  now()
)
on conflict (persistence_key) do nothing;

commit;
