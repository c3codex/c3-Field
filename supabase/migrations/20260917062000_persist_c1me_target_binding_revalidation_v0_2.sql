-- c1ME.env target-binding revalidation v0.2
-- Operator: op044
-- Result: target binding clear pending formal MGS registration/current binding.

insert into public.measures_persistence_state (
  persistence_key,
  process_key,
  oar2_key,
  environment_key,
  object_key,
  object_type,
  governed_state,
  evidence,
  custody,
  lineage,
  standing,
  next_permitted_transition,
  persisted_by,
  persisted_at,
  updated_at
)
values (
  'c1me_stephanie_target_binding_revalidation_v0_2:persistence',
  'minimum_governed_standard_v1',
  'c1me_target_binding_revalidation_chazz_002',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_stephanie_target_binding_revalidation_v0_2',
  'target_bound_mgs_binding_revalidation',
  jsonb_build_object(
    'mgs_key', 'c1me_minimum_governed_standard_v0_1',
    'target_env_key', 'env_person_eea672f5a7676dad4316755b',
    'target_envpac_key', 'c3envpac_person_eea672f5a7676dad4316755b_v0_1',
    'subject_key', 'crs_93e901234ae044a396654ee80644b005',
    'environment_standing', 'c1_connected',
    'relationship_standing', 'c1_C1_persisted',
    'current_result', 'C1',
    'c2_standing', 'not_created',
    'active_capability_count', 0,
    'prior_hold_key', 'active_higher_order_capability_in_c1me',
    'prior_capability_key', 'sj_envpac_lapzuli_distribution',
    'prior_capability_current_standing', 'inactive',
    'separation_evidence', 'c1me_lapzuli_capability_separation_v0_1:persistence',
    'touchpoints', jsonb_build_object(
      'Identity','resolved',
      'Ownership','resolved',
      'Custody','resolved',
      'Verification','resolved',
      'Relationship','resolved',
      'Persistence','resolved'
    ),
    'dimension_results', jsonb_build_object(
      'Identity','pass',
      'Purpose','pass',
      'Authority','pass',
      'Boundary','pass_for_target_binding_review',
      'Environment','pass',
      'Role','pass',
      'Relation','pass_with_nonoperative_package_note',
      'Passage','pass',
      'Standing','pass',
      'Evidence','pass',
      'Custody_and_lineage','pass',
      'Holds_and_failures','prior_hold_resolved_no_current_prohibitive_target_binding_hold',
      'Return_and_review','pass',
      'Exit_condition','clear_to_seek_mgs_registration_and_current_binding'
    ),
    'pubpac_reference_rule', 'nonoperative_reference_only_no_c1_control_or_capability',
    'pubpac_reference_causes_hold', false,
    'canopy_model_conflict', false,
    'formal_mgs_satisfaction_created', false,
    'operative_mgs_registration_created', false,
    'current_mgs_binding_created', false,
    'implementation_authority_created', false,
    'runtime_effect_created', false
  ),
  jsonb_build_object(
    'operator', 'op044',
    'operator_instruction', 'proceed',
    'execution_instance_id', 'c1me_target_binding_revalidation_chazz_002',
    'mgs_profile', 'c1me_minimum_governed_standard_v0_1',
    'prior_review', 'c1me_stephanie_target_binding_review_v0_1',
    'separation_record', 'c1me_lapzuli_capability_separation_v0_1:persistence',
    'governance_artifact_path', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_stephanie_target_binding_revalidation_v0_2.meta.md',
    'governance_artifact_commit', '309b640dbcfb91dd93dbb93fedf96dac89d4fff3',
    'source_concordance_control', 'current_source_concordance_v16'
  ),
  jsonb_build_object(
    'computational_custody', 'Measures Codex Registry',
    'physical_custody', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_stephanie_target_binding_revalidation_v0_2.meta.md',
    'ownership_transfer', false,
    'custody_transfer', false,
    'public_release', false
  ),
  jsonb_build_object(
    'append_preserving', true,
    'mgs_profile', 'c1me_minimum_governed_standard_v0_1',
    'prior_review', 'c1me_stephanie_target_binding_review_v0_1:persistence',
    'capability_separation', 'c1me_lapzuli_capability_separation_v0_1:persistence',
    'canopy_boundary', 'c1me_canopy_reference_boundary_rule_v1',
    'standing_distinction', 'c1me_environment_current_standing_distinction_v1',
    'source_superseded', false
  ),
  'target_binding_clear_pending_mgs_registration',
  'register_c1me_mgs_and_create_current_binding',
  'registrar',
  now(),
  now()
)
on conflict (persistence_key) do nothing;
