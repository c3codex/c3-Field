-- Seed Concordance Governance and Change Control Seating v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md
-- Bounded governance posture seating only. No semantic ontology expansion.

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
  'seed_concordance_governance_usage_change_control',
  'Seed Concordance Governance, Usage, and Change Control',
  'semantic_governance',
  'active',
  'internal',
  'Codex -> Field -> Measures -> Chazz',
  '[
    "docs/concordance/seed_concordance_governance_usage_and_change_control_v1.meta.md",
    "docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md"
  ]'::jsonb,
  '{
    "document_type": "concordance_governance",
    "authority_level": "system",
    "document_scope": "semantic_governance",
    "status": "readonly_candidate",
    "governs_document": "seed_concordance",
    "governance_surface": "Seed Concordance Governance, Usage, and Change Control v1"
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
  'seed_concordance_governance_usage_change_control_v1',
  'seed_concordance_governance_usage_change_control',
  'v1',
  'active',
  'internal',
  now(),
  'docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md',
  'docs/oar/c3_field/oar1_seed_concordance_governance_and_change_control_seating_v1.meta.md',
  '{
    "document_type": "concordance_governance",
    "authority_level": "system",
    "document_scope": "semantic_governance",
    "status": "readonly_candidate",
    "seating_type": "governance_posture",
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
('seed_concordance_governance_v1_governs_seed_concordance','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','seed_concordance_v1','version','related_to','Governance v1 governs Seed Concordance v1 lifecycle control','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture", "relation_semantic": "governs_lifecycle"}'::jsonb),
('seed_concordance_governance_v1_append_governed','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','append-governed semantic authority','version','related_to','Governance preserves append-governed semantic authority','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_verification_before_mutation','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','verification before mutation','version','related_to','Governance requires verification before mutation','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_audit_before_expansion','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','audit before expansion','version','related_to','Governance requires audit before expansion','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_scope_neutral_relations','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','scope-neutral relations','version','related_to','Governance preserves scope-neutral relations','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_non_collapsing_distinction','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','non-collapsing semantic distinction','version','related_to','Governance preserves non-collapsing semantic distinction','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_localized_correction','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','localized correction posture','version','related_to','Governance preserves localized correction posture','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb),
('seed_concordance_governance_v1_frontend_non_authority','seed_concordance_governance_usage_change_control_v1','seed_concordance_governance_usage_change_control_v1','frontend non-authority','version','related_to','Governance preserves frontend non-authority','active','internal','docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md','{"seating": "governance_posture"}'::jsonb)
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
  'seed_concordance_governance_usage_change_control_v1_local_source_f0d0e2e0',
  'seed_concordance_governance_usage_change_control_v1',
  'local_source',
  'docs/concordance/seed_concordance_governance_usage_and_change_control_v1.meta.md',
  'local',
  'docs/concordance/seed_concordance_governance_usage_and_change_control_v1.meta.md',
  'f0d0e2e003220d297abe281e5c82be42c9c10877e1d6278000662b3b119e0a61',
  4986,
  'verified',
  'internal',
  now(),
  'docs/oar/c3_field/oar2_seed_concordance_governance_and_change_control_seating_v1.meta.md',
  'docs/oar/c3_field/oar1_seed_concordance_governance_and_change_control_seating_v1.meta.md',
  '{"snapshot_boundary": "local evidence; Codex seating remains authority"}'::jsonb
)
on conflict (snapshot_key) do nothing;
