-- Correct c1ME Invite Connection environment share reference v1
-- Operator: op044
-- OAR2: correct_c1me_invite_connection_share_reference_chazz_006

begin;

do $$
begin
  if not exists (
    select 1 from public.system_process_registry
    where process_key='c1me_canopy_reference_controls_v1'
      and process_status='active'
      and authority_state='operator_confirmed_bounded_control_surface'
  ) then
    raise exception 'Invite Connection held: bounded Canopy control process is not active';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key='c1me_canopy_reference_controls_v1:implementation_authority:env_person_eea672f5a7676dad4316755b'
      and standing='authorized_for_bounded_implementation'
      and coalesce((governed_state->>'runtime_release_authorized')::boolean,false)=true
  ) then
    raise exception 'Invite Connection held: bounded implementation authority is not recoverable';
  end if;
end $$;

create table if not exists public.c3_env_share_reference (
  share_reference uuid primary key default gen_random_uuid(),
  source_env_key text not null references public.c3_environment(env_key),
  source_envpac_key text not null references public.c3_envpac(envpac_key),
  owner_subject_key text not null,
  share_state text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  constraint c3_env_share_reference_state_check check (share_state in ('active','revoked'))
);

create unique index if not exists c3_env_share_reference_one_active_envpac_uq
  on public.c3_env_share_reference(source_envpac_key)
  where share_state='active';

create index if not exists c3_env_share_reference_source_env_idx
  on public.c3_env_share_reference(source_env_key, share_state, created_at);

alter table public.c3_env_share_reference enable row level security;

alter table public.c3_envpac_canopy_event
  drop constraint if exists c3_envpac_canopy_event_type_check;

alter table public.c3_envpac_canopy_event
  add constraint c3_envpac_canopy_event_type_check
  check (event_type in ('reference_added','reference_edited','reference_removed','open_requested','c3_link_copied','connection_invite_prepared'));

update public.system_process_registry
set metadata = metadata || jsonb_build_object(
      'authorized_controls',jsonb_build_array('add','edit','remove','open','invite_connection'),
      'invite_connection_label','Invite Connection',
      'environment_share_reference_class','opaque_encounter_provenance',
      'environment_share_reference_unique_to_source_env',true,
      'environment_share_reference_creates_relationship',false,
      'environment_share_reference_creates_standing',false,
      'environment_share_reference_public_profile',false,
      'generic_copy_c3_link_superseded',true,
      'correction_oar2','correct_c1me_invite_connection_share_reference_chazz_006'
    ),
    updated_at=now()
where process_key='c1me_canopy_reference_controls_v1';

update public.measures_persistence_state
set governed_state = governed_state || jsonb_build_object(
      'authorized_controls',jsonb_build_array('add','edit','remove','open','invite_connection'),
      'invite_connection_label','Invite Connection',
      'environment_share_reference_unique_to_source_env',true,
      'environment_share_reference_creates_relationship',false,
      'environment_share_reference_creates_standing',false,
      'generic_copy_c3_link_superseded',true
    ),
    evidence = evidence || jsonb_build_object(
      'correction_oar2','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_correct_c1me_invite_connection_environment_share_reference_v1.meta.md',
      'correction_oar2_commit','2210e8ccb675749a932cc0d5a446aca83d674a0c'
    ),
    updated_at=now()
where persistence_key='c1me_canopy_reference_controls_v1:implementation_authority:env_person_eea672f5a7676dad4316755b';

insert into public.measures_persistence_state (
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_invite_connection_environment_share_reference_v1:correction:env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1',
  'correct_c1me_invite_connection_share_reference_chazz_006',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_invite_connection_environment_share_reference_v1',
  'bounded_control_correction',
  jsonb_build_object(
    'control_label','Invite Connection',
    'runtime_action','invite_connection',
    'share_reference_class','opaque_encounter_provenance',
    'share_reference_unique_to_source_env',true,
    'public_link_exposes_env_key',false,
    'public_link_exposes_envpac_key',false,
    'public_link_exposes_relationship_key',false,
    'public_link_exposes_session_or_claim',false,
    'relationship_created_by_share_reference',false,
    'standing_created_by_share_reference',false,
    'normal_c1_passage_required',true,
    'referral_or_reward_created',false,
    'public_profile_created',false,
    'copy_c3_link_superseded',true
  ),
  jsonb_build_object(
    'operator','op044',
    'operator_correction','invite connection',
    'oar2_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_correct_c1me_invite_connection_environment_share_reference_v1.meta.md',
    'oar2_commit','2210e8ccb675749a932cc0d5a446aca83d674a0c'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'share_reference_store','c3_field private operational store',
    'ownership_transfer',false,
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'supersedes_only','copy_c3_link control semantics within c1me_canopy_reference_controls_v1',
    'source_superseded',false
  ),
  'authorized_bounded_correction',
  'implement_c1me_invite_connection_environment_share_reference_v1',
  'registrar',now(),now()
)
on conflict (persistence_key) do nothing;

commit;
