create table if not exists public.c3_named_individual_crs_binding (
  continuity_binding_key text primary key,
  named_individual_key text not null references public.c3_named_individual(named_individual_key) on update cascade,
  relationship_key text not null references public.crs_relationship(relationship_key) on update cascade,
  binding_class text not null check (btrim(binding_class) <> ''),
  binding_standing text not null check (binding_standing in ('active','held','revoked')),
  continuity_role text not null check (btrim(continuity_role) <> ''),
  governing_constraint_key text not null references public.system_process_registry(process_key) on update cascade,
  determination_process_key text not null references public.system_process_registry(process_key) on update cascade,
  evidence_ref text not null,
  effective_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (named_individual_key, relationship_key),
  check ((binding_standing='revoked' and revoked_at is not null) or binding_standing<>'revoked')
);

comment on table public.c3_named_individual_crs_binding is
'Governed identity-continuity relation between a registered named individual and a CRS relationship. Does not collapse the individual into email, session, relationship row, operator identifier, wallet, or database custody.';

alter table public.c3_named_individual_crs_binding enable row level security;
revoke all on public.c3_named_individual_crs_binding from public, anon, authenticated;
grant select, insert, update on public.c3_named_individual_crs_binding to service_role;

create index if not exists c3_named_individual_crs_binding_individual_idx
  on public.c3_named_individual_crs_binding(named_individual_key, binding_standing);

create index if not exists c3_named_individual_crs_binding_relationship_idx
  on public.c3_named_individual_crs_binding(relationship_key, binding_standing);

insert into public.system_process_registry (
  process_key, process_family, title, status, source_path, authority_state, metadata,
  process_title, process_scope, process_status, authority_level, source_reference_set,
  required_oar_type, requires_operator_confirm, requires_preflight, requires_oar1_closeout
) values (
  'c3_named_individual_crs_continuity_binding_v1',
  'governance',
  'Named Individual to CRS Identity Continuity Binding',
  'active',
  'Drive:1b-ETCSqUdEi-TT9JYe3nCeawLNji5iOB7KdWZmu1ErU',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'standing','registered_identity_continuity_relation',
    'governing_constraint','individual_authority_custody_continuity_seam_weld_v1',
    'founding_principle','individual_ownership_custody_founding_principle_v1',
    'notchazz_boundary','c1_relational_notchazz_encounter_boundary_v1',
    'email_identity_authority',false,
    'session_identity_authority',false,
    'database_row_is_person',false,
    'operator_identifier_is_person',false,
    'creates_ownership',false,
    'creates_custody',false,
    'creates_standing',false,
    'creates_current',false,
    'creates_environment',false,
    'creates_envpac',false,
    'creates_operator_standing',false,
    'creates_c3_key',false,
    'creates_wallet_authority',false,
    'bypasses_release_holds',false,
    'lineage_preservation_required',true,
    'source_drive_id','1b-ETCSqUdEi-TT9JYe3nCeawLNji5iOB7KdWZmu1ErU'
  ),
  'Named Individual to CRS Identity Continuity Binding',
  'Persist explicit continuity between a registered named individual and a CRS relationship while preserving individual authority and preventing identity collapse into email or technical primitives.',
  'active',
  'identity_continuity_binding',
  jsonb_build_object(
    'drive_document_id','1b-ETCSqUdEi-TT9JYe3nCeawLNji5iOB7KdWZmu1ErU',
    'governing_process','individual_authority_custody_continuity_seam_weld_v1',
    'captured_by','op044',
    'captured_at','2026-09-23'
  ),
  'oar2',
  true,
  true,
  false
)
on conflict (process_key) do update
set authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_scope=excluded.process_scope,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

insert into public.c3_named_individual_crs_binding (
  continuity_binding_key,
  named_individual_key,
  relationship_key,
  binding_class,
  binding_standing,
  continuity_role,
  governing_constraint_key,
  determination_process_key,
  evidence_ref,
  metadata
) values (
  'identity_continuity_stephanie_joanne_crs_93e901_v1',
  'stephanie_joanne_gaffney',
  'crs_93e901234ae044a396654ee80644b005',
  'governed_identity_continuity',
  'active',
  'primary_current',
  'individual_authority_custody_continuity_seam_weld_v1',
  'c3_named_individual_crs_continuity_binding_v1',
  'Drive:1b-ETCSqUdEi-TT9JYe3nCeawLNji5iOB7KdWZmu1ErU',
  jsonb_build_object(
    'identity_merge',false,
    'email_match_required',false,
    'email_match_sufficient',false,
    'participant_authority','individual',
    'relationship_record_custody','registry',
    'operator_binding_preserved',true,
    'owner_binding_preserved',true,
    'current_effect','none',
    'standing_effect','none'
  )
)
on conflict (named_individual_key, relationship_key) do update
set binding_class=excluded.binding_class,
    binding_standing=excluded.binding_standing,
    continuity_role=excluded.continuity_role,
    governing_constraint_key=excluded.governing_constraint_key,
    determination_process_key=excluded.determination_process_key,
    evidence_ref=excluded.evidence_ref,
    metadata=excluded.metadata,
    revoked_at=null,
    updated_at=now();
