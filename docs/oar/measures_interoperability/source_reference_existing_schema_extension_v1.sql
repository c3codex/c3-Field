-- ============================================================
-- SOURCE REFERENCE EXISTING SCHEMA EXTENSION v1 — DRAFT
-- Scope: Extend public.codex_source_reference (live schema)
-- Authority: OAR2 — Source Reference Existing Schema Extension v1
-- Status: DRAFT ONLY — DO NOT EXECUTE
-- Standing: No DB mutation. No Codex seating. No source insertion.
-- Extension: aliases column + corrected 19-row INSERT block
--            mapped to live codex_source_reference column vocabulary
-- ============================================================


-- ============================================================
-- COLUMN MAPPING (draft vocabulary → live column)
--
--   title             → source_title
--   document_scope    → source_scope
--   file_path         → source_path
--   standing          → source_status  (see STATUS MAPPING below)
--   notes             → metadata jsonb (extended field)
--   aliases           → aliases jsonb  (new column, added by this extension)
--
-- Columns absent from live table (must not be used in INSERT):
--   standing, title, document_scope, file_path, review_status,
--   seeded_standing, codex_seating_standing, migration_group,
--   ambiguity_group, codex_candidate, oar2_key, oar1_key,
--   source_alignment
-- ============================================================


-- ============================================================
-- STATUS MAPPING (draft standing → live source_status)
--
--   candidate    → drafted
--   written      → written
--   committed    → committed
--   seeded       → written  [OPERATOR DECISION REQUIRED]
--                  live constraint: seeded requires metadata ? 'seed_oar_key'
--                  AND source_path NOT NULL AND source_hash NOT NULL
--                  AND readonly = true — values not confirmed for these rows
--   codex_seated → seeded   (only where OAR evidence verified — none in this draft)
--   held         → written  + metadata ->> 'review_status' = 'operator_required'
--   superseded   → superseded
-- ============================================================


-- ============================================================
-- SOURCE TYPE MAPPING (draft source_type → live source_type)
--
--   semantic_concordance   → concordance        [operator confirm]
--   oar_lifecycle          → oar                [operator confirm]
--   process_rule           → process_rule        [exact match]
--   role_contract          → role_contract       [exact match]
--   runtime_validation     → system_intel        [operator confirm]
--   source_set             → foundational_source [operator confirm]
--   migration_architecture → migration_candidate [operator confirm]
--   verification_checklist → verification_checklist [exact match]
-- ============================================================


-- ============================================================
-- SECTION 1: EXTENSION — ADD ALIASES COLUMN
-- Safe to execute independently. IF NOT EXISTS is idempotent.
-- Does not alter existing columns or constraints.
-- ============================================================

-- 1a. Pre-extension check — confirm aliases column does not already exist
select
  column_name,
  data_type,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'codex_source_reference'
  and column_name = 'aliases';
-- Expected result: 0 rows (column absent — safe to add)
-- If 1 row returned: column already exists — skip ALTER TABLE

-- 1b. Confirm existing table structure before alteration
select
  column_name,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'codex_source_reference'
order by ordinal_position;

-- 1c. ADD ALIASES COLUMN (DRAFT — REQUIRES EXECUTION OAR2)
-- alter table public.codex_source_reference
--   add column if not exists aliases jsonb not null default '[]'::jsonb;

-- 1d. Post-alter verification
-- select column_name, data_type, column_default
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'codex_source_reference'
--   and column_name = 'aliases';
-- Expected: 1 row, data_type = 'jsonb'


-- ============================================================
-- SECTION 2: CORRECTED INSERT BLOCK (DRAFT — DO NOT INSERT)
-- Uses live codex_source_reference column vocabulary.
-- Does NOT use: standing, title, document_scope, file_path
-- Uses instead: source_status, source_title, source_scope, source_path
-- Requires: aliases column added via Section 1 first
-- Requires: execution OAR2 authorization before insertion
--
-- SEEDED STATUS NOTE:
--   Three draft rows carry standing = 'seeded'.
--   Live constraint: seeded requires
--     metadata ? 'seed_oar_key' AND source_path NOT NULL
--     AND source_hash NOT NULL AND readonly = true
--   source_hash values are not confirmed for these rows.
--   Mapped to source_status = 'written' pending operator confirmation.
--   See SECTION 3 operator decision items 4–6.
--
-- HELD MAPPING NOTE:
--   held → source_status = 'written'
--           + metadata ->> 'review_status' = 'operator_required'
--   system_concordance and coherence_matrix_v1 have no confirmed
--   source_path. source_path set to null (NOT empty string).
-- ============================================================

/*
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
-- draft: semantic_concordance / system / semantic / held
-- live:  concordance / system / semantic / written [held in metadata]
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
-- draft: semantic_concordance / system / coherence / held
-- live:  concordance / system / coherence / written [held in metadata]
-- aliases: c3 7s, c3_7s, twenty_one_of_coherence preserved
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
-- draft: role_contract / working / db_runtime / written
-- live:  role_contract / working / db_runtime / written
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
-- draft: oar_lifecycle / working / process / seeded
-- live:  oar / working / process / written
--        [OPERATOR DECISION: seeded requires source_hash + seed_oar_key]
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

-- draft: process_rule / working / process / written
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
-- draft: runtime_validation / working / encounter / written
-- live:  system_intel [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"operator_required","migration_group":"encounter_process_guidance","ambiguity_group":"encounter_contract","type_mapping_note":"draft was runtime_validation; mapped to system_intel pending operator confirm"}'::jsonb,
 'op044'),

-- ── phase_map_distinction group ────────────────────────────────
-- draft: source_set / working / runtime / written
-- live:  foundational_source [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"operator_required","migration_group":"phase_map_distinction","ambiguity_group":"phase_map_definition","type_mapping_note":"draft was source_set; mapped to foundational_source pending operator confirm"}'::jsonb,
 'op044'),

-- draft: source_set / working / semantic / written
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
 '{"review_status":"operator_required","migration_group":"phase_map_distinction","ambiguity_group":"phase_map_definition","type_mapping_note":"draft was source_set; mapped to foundational_source pending operator confirm"}'::jsonb,
 'op044'),

-- ── release_access_distinction group ──────────────────────────
-- draft: runtime_validation / working / runtime / written
-- live:  system_intel [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"operator_required","migration_group":"release_access_distinction","ambiguity_group":"release_access","type_mapping_note":"draft was runtime_validation; mapped to system_intel pending operator confirm"}'::jsonb,
 'op044'),

-- ── renderer_lineage group ─────────────────────────────────────
-- draft: runtime_validation / working / runtime / superseded
-- live:  system_intel / superseded [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"accepted","migration_group":"renderer_lineage","ambiguity_group":"renderer_contract","superseded_by":"database_render_contract_manifest","type_mapping_note":"draft was runtime_validation; mapped to system_intel pending operator confirm"}'::jsonb,
 'op044'),

-- ── runtime_process_support group ─────────────────────────────
-- draft: runtime_validation / working / runtime / written
-- live:  system_intel [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"operator_required","migration_group":"runtime_process_support","ambiguity_group":"process_runtime","type_mapping_note":"draft was runtime_validation; mapped to system_intel pending operator confirm"}'::jsonb,
 'op044'),

-- ── operational_incorporation_lineage group ────────────────────
-- draft: process_rule / working / process / seeded
-- live:  process_rule / working / process / written
--        [OPERATOR DECISION: seeded requires source_hash + seed_oar_key]
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

-- draft: verification_checklist / working / process / seeded
-- live:  verification_checklist / working / process / written
--        [OPERATOR DECISION: seeded requires source_hash + seed_oar_key]
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

-- draft: migration_architecture / working / migration / written
-- live:  migration_candidate [OPERATOR CONFIRM TYPE MAPPING]
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
 '{"review_status":"operator_required","migration_group":"operational_incorporation_lineage","ambiguity_group":"oar_spine","type_mapping_note":"draft was migration_architecture; mapped to migration_candidate pending operator confirm"}'::jsonb,
 'op044'),

-- ── runtime-claimed held rows ──────────────────────────────────
-- Both claimed by DB_HELD_CODEX_SOURCE_RECORDS in oar2Governance.ts.
-- Both absent from migration proposal. No source file confirmed.
-- source_path set to null — not empty string.
-- Must remain operator_required until source paths are confirmed.

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
 'op044');
*/


-- ============================================================
-- SECTION 3: OPERATOR DECISION ITEMS
-- These require operator confirmation before execution OAR2.
-- ============================================================

-- Decision 1: source_type mapping — semantic_concordance → concordance
--   Affects: seed_concordance, source_21_of_coherence_v1,
--            system_concordance, coherence_matrix_v1 (4 rows)
--   Proposed: concordance (existing live CHECK value)
--   Confirm or override before execution.

-- Decision 2: source_type mapping — oar_lifecycle → oar
--   Affects: oar_lifecycle_execution_and_handoff (1 row)
--   Proposed: oar
--   Confirm or override before execution.

-- Decision 3: source_type mapping — runtime_validation → system_intel
--   Affects: encounter_behavior_resolution_rule_v1, registry_release_states_v1,
--            renderer_contract_seed_v1, registered_process_log_runtime_v1 (4 rows)
--   Proposed: system_intel
--   Confirm or override before execution.

-- Decision 4: source_type mapping — source_set → foundational_source
--   Affects: measures_seed_phase_map_registry_definition,
--            field_definition_phase_map_v2 (2 rows)
--   Proposed: foundational_source
--   Confirm or override before execution.

-- Decision 5: source_type mapping — migration_architecture → migration_candidate
--   Affects: c3_oar_spine_persistence_registry_convergence_v1 (1 row)
--   Proposed: migration_candidate
--   Confirm or override before execution.

-- Decision 6: seeded status — oar_lifecycle_execution_and_handoff
--   Live constraint: seeded requires seed_oar_key, source_path,
--                    source_hash, readonly = true
--   Mapped to: written (held intent) pending operator confirmation.
--   To advance to seeded: confirm source_hash and seed_oar_key value.

-- Decision 7: seeded status — phase_1_oar_operations_spine_v1
--   Same constraint as Decision 6.
--   To advance to seeded: confirm source_hash and seed_oar_key value.

-- Decision 8: seeded status — phase_1_operational_spine_validation_refinement_v1
--   Same constraint as Decision 6.
--   To advance to seeded: confirm source_hash and seed_oar_key value.

-- Decision 9: source_path — system_concordance
--   Currently null. File not confirmed.
--   Confirm path before any status advancement.

-- Decision 10: source_path — coherence_matrix_v1
--   Currently null. File not confirmed.
--   Confirm path before any status advancement.


-- ============================================================
-- SECTION 4: POST-INSERTION VALIDATION QUERIES (DRAFT)
-- Run after INSERT (future execution OAR2).
-- ============================================================

-- 4a. Confirm aliases column exists on live table
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public'
--   and table_name = 'codex_source_reference'
--   and column_name = 'aliases';
-- Expected: 1 row

-- 4b. Confirm row count
-- select count(*) from public.codex_source_reference;
-- Expected: 19

-- 4c. Confirm c3 7s aliases present
-- select source_key, source_title, aliases
-- from public.codex_source_reference
-- where source_key = 'source_21_of_coherence_v1';
-- Expected: aliases = '["c3 7s","c3_7s","twenty_one_of_coherence"]'

-- 4d. Confirm held rows remain operator_required
-- select source_key, source_status, metadata ->> 'review_status' as review_status
-- from public.codex_source_reference
-- where source_key in ('system_concordance', 'coherence_matrix_v1');
-- Expected: source_status = 'written', review_status = 'operator_required'

-- 4e. Confirm no invalid source_type values
-- select source_key, source_type from public.codex_source_reference
-- where source_type not in (
--   'concordance','foundational_source','process_rule','process_constraints',
--   'role_contract','implementation_manifest','verification_checklist',
--   'oar','system_intel','schema_draft','migration_candidate'
-- );
-- Expected: 0 rows

-- 4f. Confirm no invalid source_status values
-- select source_key, source_status from public.codex_source_reference
-- where source_status not in (
--   'drafted','validated','written','committed',
--   'seeded','deprecated','superseded','rejected'
-- );
-- Expected: 0 rows

-- 4g. Confirm held rows have null source_path
-- select source_key, source_path
-- from public.codex_source_reference
-- where source_key in ('system_concordance', 'coherence_matrix_v1');
-- Expected: source_path IS NULL for both

-- ============================================================
-- END OF EXTENSION DRAFT
-- Next valid move: operator decisions (10 items) → execution OAR2 →
-- aliases column ALTER → corrected INSERT → post-validation → OAR1 closeout
-- ============================================================
