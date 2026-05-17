-- Seed Concordance Audit Findings Disposition Seating v1
-- Source OAR2: docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md
-- Additive seating only for Conversion Engine Distinction.
-- Do not alter schema. Do not mutate unrelated seated terms.

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
  source_excerpt,
  metadata
) values (
  'seed_concordance_v1_conversion_engine_distinction',
  'seed_concordance_v1',
  'Conversion Engine Distinction',
  'The conversion engine is a rooted operational system within c3 Field. It is not c3 Field itself. Not every branch requires Measures Conversion, but every valid branch must remain in c3 relation.',
  'boundary',
  'Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src',
  'operational distinction between conversion engine routing and c3 Field authority',
  'bounded conversion-engine relation without replacing c3 Field or native order',
  'active',
  'internal',
  'Seed Concordance / TREE / Conversion Engine Distinction',
  '{
    "expansion": "seed_concordance_audit_findings_disposition_v1",
    "disposition_source": "audit_findings",
    "seated_from_finding": true,
    "finding_disposition": "seat",
    "not_equivalent_to": "c3 Field",
    "tree_boundary": "TREE conditions the environment; TREE does not replace the spine"
  }'::jsonb
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
('seed_concordance_v1_axis_conversion_engine_boundary','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','boundary','term','axis','Conversion Engine Distinction resolves to boundary axis','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1"}'::jsonb),
('seed_concordance_v1_circuit_conversion_engine_spine','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src','term','circuit','Conversion Engine Distinction recognizes the rooted operational spine where conversion-engine routing applies','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1"}'::jsonb),
('seed_concordance_v1_role_conversion_engine_distinction','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','operational distinction between conversion engine routing and c3 Field authority','term','role','Conversion Engine Distinction preserves operational distinction','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1"}'::jsonb),
('seed_concordance_v1_resolves_conversion_engine_boundary','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','bounded conversion-engine relation without replacing c3 Field or native order','term','resolves_to','Conversion Engine Distinction resolves to bounded relation without authority replacement','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1"}'::jsonb),
('seed_concordance_v1_conversion_engine_within_field','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','seed_concordance_v1_field','term','related_to','Conversion engine is rooted within c3 Field','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1", "relation_semantic": "rooted_within"}'::jsonb),
('seed_concordance_v1_conversion_engine_not_field','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','c3 Field itself','term','related_to','Conversion engine is not c3 Field itself','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1", "relation_semantic": "not_equivalent_to"}'::jsonb),
('seed_concordance_v1_conversion_engine_routes_src','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','seed_concordance_v1_src_record','term','related_to','Conversion Engine Distinction affects SRC routing and intake boundary','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1", "relation_semantic": "affects_routing"}'::jsonb),
('seed_concordance_v1_conversion_engine_measures_boundary','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','seed_concordance_v1_measures','term','related_to','Conversion Engine Distinction preserves Measures Registry distinction','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1", "relation_semantic": "preserves_registry_distinction"}'::jsonb),
('seed_concordance_v1_conversion_engine_tree_not_spine','seed_concordance_v1','seed_concordance_v1_conversion_engine_distinction','seed_concordance_v1_tree','term','related_to','TREE conditions the environment and does not replace the spine','active','internal','docs/oar/c3_field/oar2_seed_concordance_audit_findings_disposition_v1.meta.md','{"expansion": "seed_concordance_audit_findings_disposition_v1", "relation_semantic": "does_not_replace_spine"}'::jsonb)
on conflict (relation_key) do nothing;
