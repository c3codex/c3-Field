-- ============================================================
-- SOURCE REFERENCE EXISTING SCHEMA EXTENSION v1 — UPSERT GUARD CORRECTION
-- Operator: op044
-- Date: 2026-05-27
-- Authority: OAR2 Amendment — Source Reference Extension UPSERT Guard Correction v1
-- Status: EXECUTABLE — operator-mediated DB execution
-- Standing: Upsert 19 rows while skipping seeded rows entirely.
--           Seeded rows are not touched — not preserved-through-update.
-- Instructions: Execute this SQL in Supabase SQL Editor or via psql
-- ============================================================

-- SEED-PRESERVATION RULE:
-- Seeded rows are skipped entirely via WHERE predicate on ON CONFLICT.
-- The append-only trigger blocks any UPDATE to seeded rows.
-- CASE-based preservation is insufficient — the trigger fires before CASE evaluates.
-- Do not overwrite verified source_path on non-seeded rows.
-- Extend only what is missing.

-- SECTION 1: ALTER TABLE — Add aliases column (idempotent)
alter table public.codex_source_reference
  add column if not exists aliases jsonb not null default '[]'::jsonb;

-- SECTION 2: UPSERT 19 rows with seed preservation
insert into public.codex_source_reference (
  source_key,
  source_title,
  source_type,
  authority_level,
  source_scope,
  version_label,
  source_status,
  readonly,
  source_path,
  aliases,
  metadata,
  created_by
) values

-- ── semantic_source group ──────────────────────────────────────
('seed_concordance',
 'Seed Concordance',
 'concordance',
 'system',
 'semantic',
 'v1',
 'written',
 false,
 'docs/_source/seed/seed_concordance.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"semantic_source","ambiguity_group":"semantic_foundation","held_reason":"Core semantic source; authority state unresolved. Held pending operator confirmation."}'::jsonb,
 'op044'),

-- ── coherence_source group ─────────────────────────────────────
('source_21_of_coherence_v1',
 'The 21 of Coherence',
 'concordance',
 'system',
 'coherence',
 'v1',
 'written',
 false,
 'docs/_source/seed/source_21_of_coherence_v1.meta.md',
 '["c3 7s","c3_7s","twenty_one_of_coherence"]'::jsonb,
 '{"review_status":"operator_required","migration_group":"coherence_source","ambiguity_group":"semantic_foundation","held_reason":"Lineage and version confirmation required."}'::jsonb,
 'op044'),

-- ── db_runtime_governance group ────────────────────────────────
('db_role_contract_supabase',
 'DB Role Contract — Supabase',
 'role_contract',
 'working',
 'db_runtime',
 'v1',
 'written',
 false,
 'docs/process/oar/db_role_contract_supabase.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"db_runtime_governance","ambiguity_group":"role_boundary"}'::jsonb,
 'op044'),

-- ── process_lifecycle group ────────────────────────────────────
('oar_lifecycle_execution_and_handoff',
 'OAR Lifecycle — Execution and Handoff',
 'oar',
 'working',
 'process',
 'v1',
 'written',
 false,
 'docs/process/oar_lifecycle.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"process_lifecycle","ambiguity_group":"oar_lifecycle","seeded_intent":"true","seeded_blocked":"source_hash and seed_oar_key required before seeded status"}'::jsonb,
 'op044'),

('oar2_generation_and_handoff_process',
 'OAR2 Generation and Handoff Process',
 'process_rule',
 'working',
 'process',
 'v1',
 'written',
 false,
 'docs/process/oar/oar2_generation_and_handoff_process.meta.md',
 '[]'::jsonb,
 '{"review_status":"accepted","migration_group":"process_lifecycle","ambiguity_group":"oar_lifecycle"}'::jsonb,
 'op044'),

-- ── media_process_governance group ────────────────────────────
('media_authority_governance_process_seed',
 'Media Authority Governance Process Seed',
 'process_rule',
 'working',
 'media',
 'v1',
 'written',
 false,
 'docs/process/media/media_authority_governance_process_seed.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"media_process_governance","ambiguity_group":"media_authority"}'::jsonb,
 'op044'),

('institutional_media_bucket_governance_process',
 'Institutional Media Bucket Governance',
 'process_rule',
 'working',
 'media',
 'v1',
 'written',
 false,
 'docs/process/media/institutional_media_bucket_governance_process.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"media_process_governance","ambiguity_group":"media_authority"}'::jsonb,
 'op044'),

('conversion_engine_media_authority_seed',
 'Conversion Engine Media Authority Seed',
 'process_rule',
 'working',
 'media',
 'v1',
 'written',
 false,
 'docs/process/media/conversion_engine_media_authority_seed.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"media_process_governance","ambiguity_group":"media_authority"}'::jsonb,
 'op044'),

-- ── encounter_process_guidance group ──────────────────────────
('encounter_behavior_resolution_rule_v1',
 'Encounter Behavior Resolution Rule v1',
 'system_intel',
 'working',
 'encounter',
 'v1',
 'written',
 false,
 'docs/_source/working/intel_recovery/encounter_behavior_resolution_rule_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"encounter_process_guidance","ambiguity_group":"encounter_contract"}'::jsonb,
 'op044'),

-- ── phase_map_distinction group ────────────────────────────────
('measures_seed_phase_map_registry_definition',
 'Measures Seed Phase Map Registry Definition',
 'foundational_source',
 'working',
 'runtime',
 'v1',
 'written',
 false,
 'docs/_source/seed/measures_seed_phase_map_registry_definition.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"phase_map_distinction","ambiguity_group":"phase_map_definition"}'::jsonb,
 'op044'),

('field_definition_phase_map_v2',
 'Field Definition Phase Map v2',
 'foundational_source',
 'working',
 'semantic',
 'v1',
 'written',
 false,
 'docs/_source/field/field_definition_phase_map_v2.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"phase_map_distinction","ambiguity_group":"phase_map_definition"}'::jsonb,
 'op044'),

-- ── release_access_distinction group ──────────────────────────
('registry_release_states_v1',
 'Registry Release States v1',
 'system_intel',
 'working',
 'runtime',
 'v1',
 'written',
 false,
 'docs/_source/registry/registry_release_states_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"release_access_distinction","ambiguity_group":"release_access"}'::jsonb,
 'op044'),

-- ── renderer_lineage group ─────────────────────────────────────
('renderer_contract_seed_v1',
 'Renderer Contract Seed v1',
 'system_intel',
 'working',
 'runtime',
 'v1',
 'superseded',
 false,
 'docs/_source/working/intel_recovery/renderer_contract_seed_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"accepted","migration_group":"renderer_lineage","ambiguity_group":"renderer_contract","superseded_by":"database_render_contract_manifest"}'::jsonb,
 'op044'),

-- ── runtime_process_support group ─────────────────────────────
('registered_process_log_runtime_v1',
 'Registered Process Log Runtime v1',
 'system_intel',
 'working',
 'runtime',
 'v1',
 'written',
 false,
 'docs/oar/measures_registry/registered_process_log_runtime_v1.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"runtime_process_support","ambiguity_group":"process_runtime"}'::jsonb,
 'op044'),

-- ── operational_incorporation_lineage group ────────────────────
('phase_1_oar_operations_spine_v1',
 'Phase 1 OAR Operations Spine v1',
 'process_rule',
 'working',
 'process',
 'v1',
 'written',
 false,
 'docs/oar/c3_field_convergence/oar1_phase_1_oar_operations_spine_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"operational_incorporation_lineage","ambiguity_group":"oar_spine","seeded_intent":"true","seeded_blocked":"source_hash and seed_oar_key required before seeded status"}'::jsonb,
 'op044'),

('phase_1_operational_spine_validation_refinement_v1',
 'Phase 1 Operational Spine Validation Refinement v1',
 'verification_checklist',
 'working',
 'process',
 'v1',
 'written',
 false,
 'docs/oar/c3_field_convergence/oar1_phase_1_operational_spine_validation_refinement_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"operational_incorporation_lineage","ambiguity_group":"oar_spine","seeded_intent":"true","seeded_blocked":"source_hash and seed_oar_key required before seeded status"}'::jsonb,
 'op044'),

('c3_oar_spine_persistence_registry_convergence_v1',
 'c3 OAR Spine Persistence Registry Convergence v1',
 'migration_candidate',
 'working',
 'migration',
 'v1',
 'written',
 false,
 'docs/oar/c3_field_convergence/oar2_phase_2_oar_spine_persistence_registry_convergence_v1.meta.md',
 '[]'::jsonb,
 '{"review_status":"operator_required","migration_group":"operational_incorporation_lineage","ambiguity_group":"oar_spine"}'::jsonb,
 'op044'),

-- ── runtime-claimed held rows ──────────────────────────────────
('system_concordance',
 'System Concordance',
 'concordance',
 'system',
 'semantic',
 'v1',
 'written',
 false,
 null,
 '[]'::jsonb,
 '{"review_status":"operator_required","held_reason":"Runtime-claimed via DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts. No source file confirmed. source_path must be resolved before any status advancement."}'::jsonb,
 'op044'),

('coherence_matrix_v1',
 'Coherence Matrix v1',
 'concordance',
 'system',
 'coherence',
 'v1',
 'written',
 false,
 null,
 '[]'::jsonb,
 '{"review_status":"operator_required","held_reason":"Runtime-claimed via DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts. No source file confirmed. source_path must be resolved before any status advancement."}'::jsonb,
 'op044')

-- ============================================================
-- ON CONFLICT LOGIC — SEEDED ROWS SKIPPED ENTIRELY
-- WHERE predicate prevents any UPDATE to seeded rows.
-- Append-only trigger on seeded rows blocks UPDATE before CASE evaluates.
-- Non-seeded conflicts: preserve verified source_path, merge metadata.
-- ============================================================

on conflict (source_key) do update set
  source_type = excluded.source_type,
  authority_level = excluded.authority_level,
  source_scope = excluded.source_scope,
  version_label = excluded.version_label,
  source_status = excluded.source_status,
  source_path =
    coalesce(public.codex_source_reference.source_path, excluded.source_path),
  aliases =
    case
      when excluded.aliases != '[]'::jsonb
        then excluded.aliases
      else public.codex_source_reference.aliases
    end,
  metadata =
    public.codex_source_reference.metadata || excluded.metadata,
  updated_at = now()
where public.codex_source_reference.source_status <> 'seeded';


-- ============================================================
-- SECTION 3: VALIDATION QUERIES (run after UPSERT completes)
-- ============================================================

-- 1. Confirm aliases column exists
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'codex_source_reference'
  and column_name = 'aliases';

-- 2. Confirm all 19 source keys exist or were already present
select count(*) as total_source_keys
from public.codex_source_reference
where source_key in (
  'seed_concordance', 'source_21_of_coherence_v1', 'db_role_contract_supabase',
  'oar_lifecycle_execution_and_handoff', 'oar2_generation_and_handoff_process',
  'media_authority_governance_process_seed', 'institutional_media_bucket_governance_process',
  'conversion_engine_media_authority_seed', 'encounter_behavior_resolution_rule_v1',
  'measures_seed_phase_map_registry_definition', 'field_definition_phase_map_v2',
  'registry_release_states_v1', 'renderer_contract_seed_v1', 'registered_process_log_runtime_v1',
  'phase_1_oar_operations_spine_v1', 'phase_1_operational_spine_validation_refinement_v1',
  'c3_oar_spine_persistence_registry_convergence_v1',
  'system_concordance', 'coherence_matrix_v1'
);

-- 3. Confirm source_21_of_coherence_v1 has c3 7s aliases
select source_key, source_title, aliases
from public.codex_source_reference
where source_key = 'source_21_of_coherence_v1';

-- 4. Confirm seed_concordance remains seeded (seed-preservation)
select source_key, source_status, metadata ->> 'review_status' as review_status
from public.codex_source_reference
where source_key = 'seed_concordance';

-- 5. Confirm system_concordance remains seeded (seed-preservation)
select source_key, source_status, metadata ->> 'review_status' as review_status
from public.codex_source_reference
where source_key = 'system_concordance';

-- 6. Confirm D6–D8 rows remain written (not demoted to seeded)
select source_key, source_status
from public.codex_source_reference
where source_key in (
  'oar_lifecycle_execution_and_handoff',
  'phase_1_oar_operations_spine_v1',
  'phase_1_operational_spine_validation_refinement_v1'
);

-- 7. Confirm no duplicate source_key values
select source_key, count(*) as occurrences
from public.codex_source_reference
where source_key in (
  'seed_concordance', 'source_21_of_coherence_v1', 'db_role_contract_supabase',
  'oar_lifecycle_execution_and_handoff', 'oar2_generation_and_handoff_process',
  'media_authority_governance_process_seed', 'institutional_media_bucket_governance_process',
  'conversion_engine_media_authority_seed', 'encounter_behavior_resolution_rule_v1',
  'measures_seed_phase_map_registry_definition', 'field_definition_phase_map_v2',
  'registry_release_states_v1', 'renderer_contract_seed_v1', 'registered_process_log_runtime_v1',
  'phase_1_oar_operations_spine_v1', 'phase_1_operational_spine_validation_refinement_v1',
  'c3_oar_spine_persistence_registry_convergence_v1',
  'system_concordance', 'coherence_matrix_v1'
)
group by source_key
having count(*) > 1;

-- 8. Confirm coherence_matrix_v1 exists with operator_required
select source_key, source_status, metadata ->> 'review_status' as review_status
from public.codex_source_reference
where source_key = 'coherence_matrix_v1';

-- 9. Confirm no new seeded rows were created (seed preservation)
-- Only verify that seed_concordance and system_concordance remain seeded
select source_key, source_status
from public.codex_source_reference
where source_status = 'seeded'
  and source_key in (
    'oar_lifecycle_execution_and_handoff',
    'phase_1_oar_operations_spine_v1',
    'phase_1_operational_spine_validation_refinement_v1',
    'coherence_matrix_v1'
  );

-- ============================================================
-- END OF UPSERT CORRECTION
-- Operator executes exact contents only. No edits.
-- ============================================================
