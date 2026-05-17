-- Seed Concordance v1 Authority Seating SQL
-- Source OAR2: docs/oar/c3_field/oar2_concordance_authority_migration_execution_package_v1.meta.md
-- REVIEW ARTIFACT ONLY. Do not execute without a separate confirmed execution OAR2.

begin;

insert into public.concordance_document (
  document_key,
  title,
  document_scope,
  authority_standing,
  visibility_standing,
  native_order,
  source_alignment,
  metadata
) values (
  'seed_concordance',
  'Seed Concordance',
  'seed',
  'active',
  'internal',
  'Codex -> Field -> Measures -> Chazz',
  '[
    "c3_Concordance_v1",
    "session_oar_concordance_final_delivery",
    "Seed Pattern Constraints - Chazz",
    "MEASURES Installation Role"
  ]'::jsonb,
  '{"source": "seed_concordance_v1_authority_seating_record"}'::jsonb
)
on conflict (document_key) do update set
  title = excluded.title,
  document_scope = excluded.document_scope,
  authority_standing = excluded.authority_standing,
  visibility_standing = excluded.visibility_standing,
  native_order = excluded.native_order,
  source_alignment = excluded.source_alignment,
  metadata = public.concordance_document.metadata || excluded.metadata;

insert into public.concordance_version (
  version_key,
  document_key,
  version_label,
  version_standing,
  visibility_standing,
  recognized_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'seed_concordance_v1',
  'seed_concordance',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md',
  'docs/oar/c3_field/oar1_seed_concordance_v1_authority_seating_record.meta.md',
  '{"recognized_at_posture": "set_on_db_seating_then_immutable"}'::jsonb
)
on conflict (version_key) do nothing;

insert into public.concordance_term (
  term_key,
  version_key,
  term_label,
  canonical_definition,
  axis,
  circuit,
  role,
  resolves_to,
  term_standing,
  visibility_standing,
  metadata
) values
(
  'seed_concordance_v1_codex',
  'seed_concordance_v1',
  'Codex',
  'The database authority surface. Codex holds what has stabilized into revealed truth. Codex holds. It does not execute.',
  'authority',
  null,
  'authority holder',
  'append-only record',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_field',
  'seed_concordance_v1',
  'Field',
  'The schema surface. Field structures relation, adjacency, dependency, and addressability. Nothing exists in isolation.',
  'structure',
  null,
  'structural organizer',
  'coherent relation',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_measures',
  'seed_concordance_v1',
  'Measures',
  'The registry surface. Measures orders, sequences, conditions, and reveals what Codex holds.',
  'registry',
  null,
  'registry architect',
  'reveal order and access condition',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_chazz',
  'seed_concordance_v1',
  'Chazz',
  'The systems surface. Chazz renders, routes, validates, and executes what is already defined. Chazz does not author truth.',
  'execution',
  null,
  'systems operator',
  'traceable system operation',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_tree',
  'seed_concordance_v1',
  'TREE',
  'Traced Rooted Encounter Environment. TREE is the coherent living environment through which rooted systems become encounterable without losing trace, relation, or authority continuity.',
  'Field',
  'c1 c2 c3',
  'traced rooted encounter environment',
  'visible coherent relation across rooted branches',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_c3_boundary',
  'seed_concordance_v1',
  'c3 Boundary',
  'The c3 Model functions as the Boundary circuit of TREE. Connect establishes relational eligibility, Contribute establishes participatory standing, and Create establishes formed operational outcome.',
  'Coherence',
  'c1 c2 c3',
  'boundary circuit',
  'valid branch relation and operational eligibility',
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_src',
  'seed_concordance_v1',
  'src',
  'The frontend render layer. Frontend renders only what is seated and may not author truth.',
  'render',
  'rooted execution spine',
  'seated-state rendering',
  null,
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_cody',
  'seed_concordance_v1',
  'Cody',
  'Cody implements src strictly from OAR2, follows manifests, wires components to validated contract surfaces, and preserves native distinctions in UI.',
  'implementation',
  'routed execution spine',
  'frontend executor',
  null,
  'active',
  'internal',
  '{}'::jsonb
),
(
  'seed_concordance_v1_oar2',
  'seed_concordance_v1',
  'OAR2',
  'The return trace cycle that records Observed, Aligned, and Routed movement after valid passage and verifies routed execution continuity.',
  'Coherence',
  'c3',
  'return trace verifier',
  'routed execution continuity',
  'active',
  'internal',
  '{}'::jsonb
)
on conflict (term_key) do nothing;

insert into public.concordance_relation (
  relation_key,
  version_key,
  source_ref,
  target_ref,
  relation_scope,
  relation_type,
  relation_label,
  relation_standing,
  visibility_standing,
  source_oar2_path,
  metadata
) values
('seed_concordance_v1_native_order_codex_field','seed_concordance_v1','seed_concordance_v1_codex','seed_concordance_v1_field','system','native_order','Codex precedes Field','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_native_order_field_measures','seed_concordance_v1','seed_concordance_v1_field','seed_concordance_v1_measures','system','native_order','Field precedes Measures','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_native_order_measures_chazz','seed_concordance_v1','seed_concordance_v1_measures','seed_concordance_v1_chazz','system','native_order','Measures precedes Chazz','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_execution_spine_oar2_chazz','seed_concordance_v1','seed_concordance_v1_oar2','seed_concordance_v1_chazz','system','native_order','OAR2 routes before Chazz execution','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_execution_spine_chazz_cody','seed_concordance_v1','seed_concordance_v1_chazz','seed_concordance_v1_cody','system','native_order','Chazz validates and routes before Cody implementation','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_execution_spine_cody_src','seed_concordance_v1','seed_concordance_v1_cody','seed_concordance_v1_src','system','native_order','Cody implements src','active','internal','docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md','{}'::jsonb),
('seed_concordance_v1_source_tree_c3_oar2','seed_concordance_v1','seed_concordance_v1','docs/oar/c3_field/oar2_incorporate_tree_c3_boundary_into_seed_concordance_v1.meta.md','document','source_alignment','TREE + c3 Boundary incorporation route','active','internal','docs/oar/c3_field/oar2_incorporate_tree_c3_boundary_into_seed_concordance_v1.meta.md','{"target": "docs/oar/c3_field/oar2_incorporate_tree_c3_boundary_into_seed_concordance_v1.meta.md"}'::jsonb),
('seed_concordance_v1_source_authority_model','seed_concordance_v1','seed_concordance_v1','docs/oar/c3_field/oar1_concordance_authority_model_definition_v1.meta.md','document','source_alignment','Concordance authority model','active','internal','docs/oar/c3_field/oar2_concordance_authority_model_definition_v1.meta.md','{"target": "docs/oar/c3_field/oar1_concordance_authority_model_definition_v1.meta.md"}'::jsonb),
('seed_concordance_v1_source_sql_hardening','seed_concordance_v1','seed_concordance_v1','docs/oar/c3_field/oar1_concordance_authority_sql_draft_hardening_v1.meta.md','document','source_alignment','SQL draft hardening record','active','internal','docs/oar/c3_field/oar2_concordance_authority_sql_draft_hardening_v1.meta.md','{"target": "docs/oar/c3_field/oar1_concordance_authority_sql_draft_hardening_v1.meta.md"}'::jsonb)
on conflict (relation_key) do nothing;

insert into public.seeded_source_snapshot (
  snapshot_key,
  version_key,
  snapshot_type,
  local_source_path,
  bucket_name,
  bucket_path,
  source_sha256,
  byte_size,
  verification_standing,
  visibility_standing,
  verified_at,
  source_oar2_path,
  closeout_oar1_path,
  metadata
) values (
  'seed_concordance_v1_local_source_9c47e162',
  'seed_concordance_v1',
  'local_source',
  'docs/_source/seed/seed_concordance.meta.md',
  'measures-seed',
  'seed/v1/seed_concordance.meta.md',
  '9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a',
  23398,
  'hash_readback_unresolved',
  'internal',
  null,
  'docs/oar/c3_field/oar2_seed_concordance_v1_authority_seating_record.meta.md',
  'docs/oar/c3_field/oar1_seed_concordance_v1_authority_seating_record.meta.md',
  '{"standing_note": "Bucket metadata indicated refreshed byte size, but final hash readback remained unresolved in prior preflight.", "authority_boundary": "snapshot != authority"}'::jsonb
)
on conflict (snapshot_key) do nothing;

commit;
