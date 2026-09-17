insert into public.codex_source_record (
  record_key,
  title,
  record_type,
  authority_level,
  source_scope,
  version,
  status,
  content,
  metadata,
  is_active
)
values (
  'c3_relational_operations_systems_governance_webpac_v1_0',
  'c3 Relational Operations and Systems Governance',
  'c3WebPac',
  'system',
  'c3_relational_operations_systems_governance',
  'v1.0',
  'elevated_private_repo_custody',
  'github-private://c3codex/measures-of-inanna-governance@b246f06e7904fd047f19c53735d3a3d5d348b9c5/webpac/c3_governance/relational_operations_systems_governance_webpac_v1_0.meta.md',
  jsonb_build_object(
    'webpac_key', 'c3_relational_operations_systems_governance_webpac_v1_0',
    'canonical_repo', 'c3codex/measures-of-inanna-governance',
    'canonical_repo_path', 'webpac/c3_governance/relational_operations_systems_governance_webpac_v1_0.meta.md',
    'canonical_commit', 'b246f06e7904fd047f19c53735d3a3d5d348b9c5',
    'content_sha256', 'aad0ddd41d891ae0a098145121939342aa36a857eb17e901e4ebe8972f759ea6',
    'canonical_custody', 'private_repository',
    'source_authority', 'webpac_private_repo',
    'elevation_process', 'webpac_elevation_private_repo_custody_v1',
    'operator', 'op044',
    'operator_confirmed', true,
    'append_preserving', true,
    'runtime_release_authorized', false,
    'public_release_authorized', false,
    'foundational_relations', jsonb_build_array(
      'Community Potential — c3 Community Partners White Paper, Public Release 1.0',
      'The 21 of Coherence',
      'The 21 of Coherence — CI Participant Clarification',
      'Governed Environments — Measures Registry White Paper, Public Release 1.0'
    ),
    'current_participant_classes', jsonb_build_array(
      'Named Individual',
      'Institution in Service',
      'Computational Intelligence (CI)'
    ),
    'first_c3_key_is_operational_activation_boundary', true,
    'registry_does_not_originate_authority', true,
    'contribution_recognition_distinct_from_coherence_recognition', true,
    'current_is_persisted_governed_present_state_resulting_from_valid_passage', true
  ),
  true
);
