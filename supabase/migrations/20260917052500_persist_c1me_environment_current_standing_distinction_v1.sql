insert into public.measures_persistence_state (
  persistence_key,
  process_key,
  oar2_key,
  environment_key,
  object_key,
  object_type,
  governed_state,
  source_sha256,
  evidence,
  custody,
  lineage,
  standing,
  next_permitted_transition,
  persisted_by
)
values (
  'c1me_environment_current_standing_distinction_v1:persistence',
  'governed_object_passage_process_v4',
  'thread_capture_persist_c1me_environment_current_standing_distinction_20260917',
  'env_c3ops',
  'c1me_environment_current_standing_distinction_v1',
  'governance_clarification',
  jsonb_build_object(
    'environment_classification', 'c1ME.env',
    'live_registry_name', 'c1ME_env',
    'canonical_environment_key', 'env_c3_community_connect',
    'circuit', 'c1',
    'current', 'C1',
    'valid_pair', 'c1/C1',
    'relationship_standing', 'c1_C1_persisted',
    'C1ME_env_created', false,
    'environment_renamed_by_current', false,
    'current_attaches_to_qualifying_persisted_relation', true,
    'environment_classified_by_lowercase_circuit', true,
    'c2_c3_authority_created', false,
    'runtime_effect_created', false,
    'implementation_authority_created', false
  ),
  null,
  jsonb_build_object(
    'operator', 'op044',
    'operator_instruction', 'capture>>persist',
    'execution_instance_id', 'capture_persist_c1me_environment_current_standing_distinction_chazz_001',
    'governance_artifact_commit', 'd8e45b34c140d4f4cf49eaa56a5c51bcca85537b',
    'governance_artifact_blob_sha1', '246a8a7fdea74c7cb9942ba1c4f1de88c7c081ff',
    'integrity_algorithm', 'git_blob_sha1',
    'source_concordance_control', 'current_source_concordance_v16',
    'source_impact', 'aligned_existing_semantics_no_source_supersession'
  ),
  jsonb_build_object(
    'physical_custody', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_environment_current_standing_distinction_v1.meta.md',
    'computational_custody', 'Measures Codex Registry',
    'custody_transfer', false,
    'ownership_transfer', false,
    'public_release', false
  ),
  jsonb_build_object(
    'source_concordance_control', 'current_source_concordance_v16',
    'environment_key', 'env_c3_community_connect',
    'environment_standing', 'governed_environment',
    'environment_persistence_standing', 'persistent_governed_environment',
    'material_environment_pair_rule', 'source_concordance_v8_material_environment_pair_exclusivity_v1',
    'material_environment_resolution_rule', 'source_concordance_v8_material_environment_resolution_mechanism_v2',
    'current_result_principle', 'source_concordance_v8_current_as_result_of_passage_founding_principle_v1',
    'append_preserving', true,
    'source_superseded', false
  ),
  'persisted_governance_clarification',
  'c1me_mgs_review_application',
  'op044_confirmed_computational_persistence'
)
on conflict (persistence_key) do update set
  governed_state = excluded.governed_state,
  evidence = excluded.evidence,
  custody = excluded.custody,
  lineage = excluded.lineage,
  standing = excluded.standing,
  next_permitted_transition = excluded.next_permitted_transition,
  persisted_by = excluded.persisted_by,
  updated_at = now();
