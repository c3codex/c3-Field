-- ============================================================
-- SOURCE REFERENCE SCHEMA SQL DRAFT v1 — CORRECTED
-- Scope: codex_source_reference table family
-- Authority: OAR2 — Source Reference Schema SQL Draft Correction v1
-- Status: DRAFT ONLY — DO NOT EXECUTE
-- Standing: No DB mutation. No Codex seating. No source insertion.
-- Correction: standing normalization, c3 7s alias, runtime-claimed
--             held rows, RLS access posture, dead trigger removal
-- ============================================================


-- ============================================================
-- SECTION 1: VALIDATION QUERIES (NON-MUTATING)
-- Run these first to establish current DB state before
-- any migration is authorized.
-- ============================================================

-- 1a. Check whether source reference tables already exist
select
  table_name,
  table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'codex_source_reference',
    'codex_source_reference_version',
    'codex_source_reference_scope',
    'codex_source_reference_state',
    'codex_source_reference_lineage',
    'codex_source_reference_relation'
  )
order by table_name;

-- 1b. Check whether any related source reference columns exist
-- on other tables (runtime drift detection)
select
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and column_name ilike '%source_reference%'
order by table_name, column_name;

-- 1c. Check whether the three named governance records exist
-- in any existing source-adjacent tables
select
  'c3_oar_seeded_reference' as table_checked,
  seeded_reference_key,
  seeded_reference_type,
  seeded_status
from public.c3_oar_seeded_reference
where seeded_reference_key in (
  'twenty_one_of_coherence',
  'seed_concordance',
  'coherence_matrix_v1'
)
union all
select
  'system_process_registry' as table_checked,
  process_key,
  process_family,
  process_status
from public.system_process_registry
where process_key in (
  'twenty_one_of_coherence',
  'seed_concordance',
  'coherence_matrix_v1'
);

-- 1d. Check for any existing codex_source_record references
-- in the oar2Governance runtime type (DB_HELD_CODEX_SOURCE_RECORDS)
-- These keys must resolve to real rows before runtime asserts is_db_held = true
select
  seeded_reference_key,
  seeded_reference_type,
  seeded_status,
  created_at
from public.c3_oar_seeded_reference
where seeded_reference_key in (
  'seed_concordance',
  'system_concordance',
  'twenty_one_of_coherence',
  'coherence_matrix_v1'
)
order by seeded_reference_key;

-- 1e. Check for duplicate source keys across any candidate tables
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'codex_source_reference'
  ) then
    raise notice 'codex_source_reference exists — check for duplicate keys required';
  else
    raise notice 'codex_source_reference does not yet exist — no duplicate check needed';
  end if;
end;
$$;

-- 1f. Check system_process_registry for any source references
-- that claim execution without OAR evidence
select
  process_key,
  process_status,
  authority_level,
  source_reference_set,
  requires_oar1_closeout
from public.system_process_registry
where process_status = 'active'
  and requires_oar1_closeout = false
order by process_key;


-- ============================================================
-- SECTION 2: SCHEMA DRAFT
-- This section defines the proposed schema only.
-- DO NOT EXECUTE until authorized by execution OAR2.
-- ============================================================

-- Standing values preserved per migration proposal:
--   candidate   — identified, not yet reviewed
--   written     — document exists, not yet committed as authority
--   committed   — in git, not yet seeded
--   seeded      — formally seeded as process/registry reference
--   codex_seated — verified and seated as Codex authority
--   held        — review deferred, not eligible for seating
--   superseded  — replaced by a canonical reference; retained for lineage

-- CORRECTION: aliases column added for canonical source identity normalization.
-- The 21 of Coherence (source_21_of_coherence_v1) carries aliases:
--   ["c3 7s", "c3_7s", "twenty_one_of_coherence"]
-- Alias pattern preserves continuity — old file references remain valid.

create table if not exists public.codex_source_reference (
  source_key              text primary key,
  title                   text not null,
  source_type             text not null,
  authority_level         text not null,
  document_scope          text not null,
  standing                text not null default 'candidate',
  file_path               text not null,
  source_alignment        jsonb not null default '[]'::jsonb,
  aliases                 jsonb not null default '[]'::jsonb,
  seeded_standing         boolean not null default false,
  codex_seating_standing  text not null default 'not_seated',
  review_status           text not null default 'pending',
  migration_group         text,
  ambiguity_group         text,
  codex_candidate         boolean not null default false,
  oar2_key                text references public.c3_oar_process_instance(process_instance_key),
  oar1_key                text references public.c3_oar_process_instance(process_instance_key),
  notes                   text not null default '',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint codex_source_reference_standing_check
    check (standing in (
      'candidate',
      'written',
      'committed',
      'seeded',
      'codex_seated',
      'held',
      'superseded'
    )),
  constraint codex_source_reference_authority_level_check
    check (authority_level in (
      'system',
      'working',
      'proposal',
      'review',
      'draft'
    )),
  constraint codex_source_reference_codex_seating_standing_check
    check (codex_seating_standing in (
      'not_seated',
      'pending_verification',
      'verified',
      'codex_seated',
      'held',
      'rejected'
    )),
  constraint codex_source_reference_review_status_check
    check (review_status in (
      'pending',
      'in_review',
      'accepted',
      'held',
      'rejected',
      'operator_required'
    ))
);

-- Prevent codex_seated standing without OAR evidence
create or replace function public.codex_source_reference_require_oar1_for_seating()
returns trigger
language plpgsql
as $$
begin
  if new.standing = 'codex_seated' and new.oar1_key is null then
    raise exception
      'codex_source_reference: standing cannot be codex_seated without oar1_key — source_key: %',
      new.source_key;
  end if;
  if new.codex_seating_standing = 'codex_seated' and new.oar1_key is null then
    raise exception
      'codex_source_reference: codex_seating_standing cannot be codex_seated without oar1_key — source_key: %',
      new.source_key;
  end if;
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists codex_source_reference_seating_guard
  on public.codex_source_reference;
create trigger codex_source_reference_seating_guard
before insert or update on public.codex_source_reference
for each row execute function public.codex_source_reference_require_oar1_for_seating();

-- Lineage table: preserves supersession chains
create table if not exists public.codex_source_reference_lineage (
  lineage_key             text primary key,
  source_key              text not null references public.codex_source_reference(source_key),
  superseded_by           text references public.codex_source_reference(source_key),
  lineage_note            text not null default '',
  created_at              timestamptz not null default now()
);

-- RLS — CORRECTED
-- Previous draft exposed full authority table to anon via broad public read.
-- Correction: authenticated users retain full read access.
-- Anon access is restricted to a public-safe view (see below).
-- The full codex_source_reference table does not grant anon select.

alter table public.codex_source_reference enable row level security;
alter table public.codex_source_reference_lineage enable row level security;

-- Authenticated read: full table access for authenticated users only
drop policy if exists "codex_source_reference_authenticated_read"
  on public.codex_source_reference;
create policy "codex_source_reference_authenticated_read"
on public.codex_source_reference
for select
to authenticated
using (true);

drop policy if exists "codex_source_reference_lineage_authenticated_read"
  on public.codex_source_reference_lineage;
create policy "codex_source_reference_lineage_authenticated_read"
on public.codex_source_reference_lineage
for select
to authenticated
using (true);

-- Public-safe view: exposes only seated and committed sources to anon.
-- Held, candidate, and operator_required rows are not surfaced publicly.
-- Sensitive authority metadata (oar1_key, oar2_key, migration_group,
-- ambiguity_group) is excluded from the public projection.
create or replace view public.codex_source_reference_public as
select
  source_key,
  title,
  source_type,
  document_scope,
  standing,
  file_path,
  aliases,
  seeded_standing,
  codex_seating_standing
from public.codex_source_reference
where standing in ('written', 'committed', 'seeded', 'codex_seated', 'superseded')
  and review_status not in ('held', 'operator_required');


-- ============================================================
-- SECTION 3: PROPOSED SEED ROWS (DRAFT — DO NOT INSERT)
-- These rows represent the migration payload groups from the
-- source_reference_schema_migration_proposal, plus two
-- runtime-claimed held rows added by this correction.
-- Total proposed rows: 19 (17 migration payload + 2 runtime-claimed held)
-- Insertion requires a separate execution OAR2.
--
-- CORRECTION: standing values normalized.
--   hold_for_operator_review is not a valid standing value.
--   Those rows now carry standing = 'held', review_status = 'operator_required'.
--
-- CORRECTION: source_21_of_coherence_v1 carries aliases jsonb.
--   Formal source: The 21 of Coherence
--   Aliases: ["c3 7s", "c3_7s", "twenty_one_of_coherence"]
--
-- CORRECTION: system_concordance and coherence_matrix_v1 added as held rows.
--   Both are claimed by DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts.
--   Neither appears in the migration proposal.
--   Both are held pending operator confirmation of required seat.
-- ============================================================

/*
insert into public.codex_source_reference (
  source_key, title, source_type, authority_level, document_scope,
  standing, file_path, source_alignment, aliases,
  seeded_standing, codex_seating_standing, review_status,
  migration_group, ambiguity_group, codex_candidate,
  oar2_key, oar1_key, notes
) values

-- semantic_source group
-- CORRECTED: standing held (was hold_for_operator_review)
('seed_concordance',
 'Seed Concordance',
 'semantic_concordance', 'system', 'semantic',
 'held',
 'docs/_source/seed/seed_concordance.meta.md',
 '["Seed Pattern Constraints"]',
 '[]',
 false, 'not_seated', 'operator_required',
 'semantic_source', 'semantic_foundation', true,
 null, null,
 'Core semantic source; authority state unresolved. Held pending operator confirmation.'),

-- coherence_source group
-- CORRECTED: standing held (was hold_for_operator_review)
-- CORRECTED: aliases populated for c3 7s / twenty_one_of_coherence
('source_21_of_coherence_v1',
 'The 21 of Coherence',
 'semantic_concordance', 'system', 'coherence',
 'held',
 'docs/_source/seed/source_21_of_coherence_v1.meta.md',
 '["Seed Concordance","MEASURES Installation Role"]',
 '["c3 7s","c3_7s","twenty_one_of_coherence"]',
 false, 'not_seated', 'operator_required',
 'coherence_source', 'semantic_foundation', true,
 null, null,
 'Coherence source. Formal title: The 21 of Coherence. Aliases: c3 7s, c3_7s, twenty_one_of_coherence. Lineage and version confirmation required.'),

-- db_runtime_governance group
('db_role_contract_supabase',
 'DB Role Contract — Supabase',
 'role_contract', 'working', 'db_runtime',
 'written',
 'docs/process/oar/db_role_contract_supabase.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'db_runtime_governance', 'role_boundary', true,
 null, null,
 'DB role boundary; operator verify live operational scope.'),

-- process_lifecycle group
('oar_lifecycle_execution_and_handoff',
 'OAR Lifecycle — Execution and Handoff',
 'oar_lifecycle', 'working', 'process',
 'seeded',
 'docs/process/oar_lifecycle.meta.md',
 '[]', '[]',
 true, 'not_seated', 'accepted',
 'process_lifecycle', 'oar_lifecycle', true,
 null, null,
 'Primary OAR lifecycle candidate.'),

('oar2_generation_and_handoff_process',
 'OAR2 Generation and Handoff Process',
 'process_rule', 'working', 'process',
 'written',
 'docs/process/oar/oar2_generation_and_handoff_process.meta.md',
 '[]', '[]',
 false, 'not_seated', 'accepted',
 'process_lifecycle', 'oar_lifecycle', true,
 null, null,
 'Supports OAR2 generation detail; parallel to lifecycle.'),

-- media_process_governance group
('media_authority_governance_process_seed',
 'Media Authority Governance Process Seed',
 'process_rule', 'working', 'media',
 'written',
 'docs/process/media/media_authority_governance_process_seed.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'media_process_governance', 'media_authority', true,
 null, null,
 'Media authority repair process governance.'),

('institutional_media_bucket_governance_process',
 'Institutional Media Bucket Governance',
 'process_rule', 'working', 'media',
 'written',
 'docs/process/media/institutional_media_bucket_governance_process.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'media_process_governance', 'media_authority', true,
 null, null,
 'Bucket/provider boundary governance.'),

('conversion_engine_media_authority_seed',
 'Conversion Engine Media Authority Seed',
 'process_rule', 'working', 'media',
 'written',
 'docs/process/media/conversion_engine_media_authority_seed.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'media_process_governance', 'media_authority', true,
 null, null,
 'Conversion workflow governance.'),

-- encounter_process_guidance group
('encounter_behavior_resolution_rule_v1',
 'Encounter Behavior Resolution Rule v1',
 'runtime_validation', 'working', 'encounter',
 'written',
 'docs/_source/working/intel_recovery/encounter_behavior_resolution_rule_v1.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'encounter_process_guidance', 'encounter_contract', true,
 null, null,
 'Process rule for encounter behavior extraction.'),

-- phase_map_distinction group
('measures_seed_phase_map_registry_definition',
 'Measures Seed Phase Map Registry Definition',
 'source_set', 'working', 'runtime',
 'written',
 'docs/_source/seed/measures_seed_phase_map_registry_definition.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'phase_map_distinction', 'phase_map_definition', true,
 null, null,
 'Measures-side phase map registry and reveal/access definition.'),

('field_definition_phase_map_v2',
 'Field Definition Phase Map v2',
 'source_set', 'working', 'semantic',
 'written',
 'docs/_source/field/field_definition_phase_map_v2.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'phase_map_distinction', 'phase_map_definition', true,
 null, null,
 'Field-side relational positioning; distinct from Measures definition.'),

-- release_access_distinction group
('registry_release_states_v1',
 'Registry Release States v1',
 'runtime_validation', 'working', 'runtime',
 'written',
 'docs/_source/registry/registry_release_states_v1.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'release_access_distinction', 'release_access', true,
 null, null,
 'Runtime release/access standing reference.'),

-- renderer_lineage group
('renderer_contract_seed_v1',
 'Renderer Contract Seed v1',
 'runtime_validation', 'working', 'runtime',
 'superseded',
 'docs/_source/working/intel_recovery/renderer_contract_seed_v1.meta.md',
 '[]', '[]',
 false, 'not_seated', 'accepted',
 'renderer_lineage', 'renderer_contract', true,
 null, null,
 'Lineage reference; superseded by database_render_contract_manifest.'),

-- runtime_process_support group
('registered_process_log_runtime_v1',
 'Registered Process Log Runtime v1',
 'runtime_validation', 'working', 'runtime',
 'written',
 'docs/oar/measures_registry/registered_process_log_runtime_v1.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'runtime_process_support', 'process_runtime', true,
 null, null,
 'Runtime process-log surface; authority state unresolved.'),

-- operational_incorporation_lineage group
('phase_1_oar_operations_spine_v1',
 'Phase 1 OAR Operations Spine v1',
 'process_rule', 'working', 'process',
 'seeded',
 'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
 '[]', '[]',
 true, 'not_seated', 'operator_required',
 'operational_incorporation_lineage', 'oar_spine', true,
 null, null,
 'Operational lineage; runtime/DB active but not Codex-seated.'),

('phase_1_operational_spine_validation_refinement_v1',
 'Phase 1 Operational Spine Validation Refinement v1',
 'verification_checklist', 'working', 'process',
 'seeded',
 'docs/oar/c3_field_convergence/oar1_phase_1_operational_spine_validation_refinement_v1.meta.md',
 '[]', '[]',
 true, 'not_seated', 'operator_required',
 'operational_incorporation_lineage', 'oar_spine', true,
 null, null,
 'Seeded validation reference; operational lineage.'),

('c3_oar_spine_persistence_registry_convergence_v1',
 'c3 OAR Spine Persistence Registry Convergence v1',
 'migration_architecture', 'working', 'migration',
 'written',
 'docs/oar/c3_field_convergence/oar2_phase_2_oar_spine_persistence_registry_convergence_v1.meta.md',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 'operational_incorporation_lineage', 'oar_spine', true,
 null, null,
 'Persistence architecture; live-adjacent, not Codex-seated.'),

-- ADDED: runtime-claimed held rows (DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts)
-- Neither row appears in the migration proposal.
-- Both are held pending operator confirmation of required seat.

('system_concordance',
 'System Concordance',
 'semantic_concordance', 'system', 'semantic',
 'held',
 '',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 null, null, false,
 null, null,
 'Runtime-claimed via DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts. Absent from migration proposal. No source file confirmed. Held pending operator confirmation. file_path must be resolved before seating.'),

('coherence_matrix_v1',
 'Coherence Matrix v1',
 'semantic_concordance', 'system', 'coherence',
 'held',
 '',
 '[]', '[]',
 false, 'not_seated', 'operator_required',
 null, null, false,
 null, null,
 'Runtime-claimed via DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts. Absent from migration proposal. No source file confirmed. Held pending operator confirmation. file_path must be resolved before seating.');
*/

-- ============================================================
-- SECTION 4: POST-EXECUTION VALIDATION QUERIES
-- Run after migration (in a future execution OAR2) to confirm
-- no standing violations exist.
-- ============================================================

-- 4a. Confirm no codex_seated rows lack oar1_key (guard verification)
-- select source_key, standing, codex_seating_standing, oar1_key
-- from public.codex_source_reference
-- where standing = 'codex_seated' and oar1_key is null;

-- 4b. Confirm no held or candidate rows are treated as seated
-- select source_key, standing, codex_seating_standing
-- from public.codex_source_reference
-- where standing in ('candidate', 'held')
--   and codex_seating_standing != 'not_seated';

-- 4c. Confirm the three governance records exist after insertion
-- select source_key, title, standing, seeded_standing, codex_seating_standing
-- from public.codex_source_reference
-- where source_key in (
--   'source_21_of_coherence_v1',
--   'seed_concordance',
--   'coherence_matrix_v1'
-- );

-- 4d. Confirm no duplicate source keys
-- select source_key, count(*)
-- from public.codex_source_reference
-- group by source_key
-- having count(*) > 1;

-- 4e. Confirm row count matches expected migration payload
-- select count(*) as total_rows from public.codex_source_reference;
-- Expected after full payload insertion: 19 rows
-- (17 migration payload + system_concordance + coherence_matrix_v1)

-- 4f. Confirm runtime-claimed held rows are present and held
-- select source_key, standing, review_status, notes
-- from public.codex_source_reference
-- where source_key in ('system_concordance', 'coherence_matrix_v1');

-- ============================================================
-- END OF CORRECTED DRAFT
-- Next valid move: operator review → execution OAR2 →
-- migration execution → post-validation → OAR1 closeout
-- ============================================================
