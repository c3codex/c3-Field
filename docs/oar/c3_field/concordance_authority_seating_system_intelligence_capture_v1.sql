-- Concordance Authority Seating System Intelligence Capture v1
-- Source OAR2: docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md
-- Process/system intelligence seating only. No Concordance ontology expansion.

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
  'concordance_authority_seating_system_intelligence',
  'Concordance Authority Seating — Large Semantic DB Insertion Pattern',
  'semantic_infrastructure',
  'active',
  'internal',
  'Codex -> Field -> Measures -> Chazz',
  '[
    "docs/_source/intel/concordance_authority_seating_system_intelligence_capture_v1.meta.md",
    "docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md"
  ]'::jsonb,
  '{
    "document_type": "system_intelligence",
    "authority_level": "system",
    "document_scope": "semantic_infrastructure",
    "status": "seeded_candidate",
    "capture_subject": "Concordance Authority Seating",
    "capture_pattern": "Large Semantic DB Insertion Pattern"
  }'::jsonb
)
on conflict (document_key) do nothing;

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
  'concordance_authority_seating_system_intelligence_v1',
  'concordance_authority_seating_system_intelligence',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  'docs/oar/c3_field/oar1_concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  '{
    "document_type": "system_intelligence",
    "authority_level": "system",
    "document_scope": "semantic_infrastructure",
    "status": "seeded_candidate",
    "seating_type": "system_intelligence_capture",
    "no_semantic_ontology_expansion": true
  }'::jsonb
)
on conflict (version_key) do nothing;

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
('concordance_system_intel_v1_reuses_seed_pattern','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','seat -> validate -> close -> expand -> audit -> disposition -> govern','version','related_to','System intelligence preserves reusable execution pattern','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "relation_semantic": "preserves_pattern"}'::jsonb),
('concordance_system_intel_v1_bounded_batch_seating','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','bounded batch seating','version','related_to','System intelligence preserves bounded batch seating','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_append_only_posture','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','append-only posture','version','related_to','System intelligence preserves append-only posture','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_scope_neutral_relations','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','scope-neutral relations','version','related_to','System intelligence preserves scope-neutral relations','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_metadata_specialization','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','metadata-carried specialization','version','related_to','System intelligence preserves metadata-carried specialization','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_oar2_only_execution','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','OAR2-only execution','version','related_to','System intelligence preserves OAR2-only execution','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_oar1_closeout','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','OAR1 closeout per batch','version','related_to','System intelligence preserves OAR1 closeout per batch','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_audit_before_expansion','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','audit before expansion','version','related_to','System intelligence preserves audit before expansion','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_disposition_before_correction','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','disposition before correction','version','related_to','System intelligence preserves disposition before correction','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_no_silent_repair','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','no silent repair','version','related_to','System intelligence preserves no silent repair posture','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture"}'::jsonb),
('concordance_system_intel_v1_large_insertion_coherent','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','large semantic authority insertion remained coherent','version','related_to','System intelligence records coherent large semantic insertion','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb),
('concordance_system_intel_v1_ontology_sprawl_avoided','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','semantic expansion avoided ontology sprawl','version','related_to','System intelligence records ontology sprawl avoidance','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb),
('concordance_system_intel_v1_protected_boundaries_intact','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','protected boundaries remained intact','version','related_to','System intelligence records protected boundary preservation','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb),
('concordance_system_intel_v1_frontend_not_authority','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','frontend did not become authority','version','related_to','System intelligence records frontend non-authority','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb),
('concordance_system_intel_v1_verification_before_mutation','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','verification preceded mutation','version','related_to','System intelligence records verification before mutation','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb),
('concordance_system_intel_v1_localized_correction','concordance_authority_seating_system_intelligence_v1','concordance_authority_seating_system_intelligence_v1','localized correction posture preserved coherence','version','related_to','System intelligence records localized correction posture','active','internal','docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md','{"seating": "system_intelligence_capture", "result_capture": true}'::jsonb)
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
  'concordance_authority_system_intelligence_v1_local_source_20560e6a',
  'concordance_authority_seating_system_intelligence_v1',
  'local_source',
  'docs/_source/intel/concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  'local',
  'docs/_source/intel/concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  '20560e6ade019def30585732f76d1af4a20b3951df878ae3a61b7c3aafe21efb',
  2647,
  'verified',
  'internal',
  now(),
  'docs/oar/c3_field/oar2_concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  'docs/oar/c3_field/oar1_concordance_authority_seating_system_intelligence_capture_v1.meta.md',
  '{"snapshot_boundary": "local evidence; Codex seating remains authority"}'::jsonb
)
on conflict (snapshot_key) do nothing;
