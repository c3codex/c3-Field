-- c1ME.env Lapzuli capability separation v0.1
-- Operator: op044
-- Purpose: resolve the bounded c1ME MGS hold without deleting capability history.

begin;

insert into public.measures_persistence_state (
  persistence_key,
  process_key,
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
select
  'c1me_lapzuli_capability_separation_v0_1:persistence',
  'minimum_governed_standard_v1',
  'env_person_eea672f5a7676dad4316755b',
  g.capability_key,
  'capability_separation_evidence',
  jsonb_build_object(
    'target_envpac_key', g.envpac_key,
    'capability_key', g.capability_key,
    'system_key', g.system_key,
    'capability', g.capability,
    'previous_standing', g.standing,
    'resulting_standing', 'inactive',
    'preserved_scope', g.scope,
    'reason', 'active_higher_order_capability_in_c1me',
    'c1_standing_changed', false,
    'c2_standing_created', false,
    'c3_standing_created', false,
    'pubpac_changed', false,
    'runtime_feature_authority_created', false
  ),
  jsonb_build_object(
    'operator', 'op044',
    'operator_instruction', 'proceed',
    'source_mgs_review', 'c1me_stephanie_target_binding_review_v0_1',
    'governance_artifact', 'c1me_lapzuli_capability_separation_v0_1.meta.md',
    'governance_artifact_commit', 'a335d4a8530acb150e1b494bc46eb0a07c1071e4',
    'original_evidence_ref', g.evidence_ref,
    'source_concordance_control', 'current_source_concordance_v16'
  ),
  jsonb_build_object(
    'computational_custody', 'Measures Codex Registry',
    'physical_custody', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_lapzuli_capability_separation_v0_1.meta.md',
    'ownership_transfer', false,
    'custody_transfer', false,
    'public_release', false
  ),
  jsonb_build_object(
    'append_preserving', true,
    'prior_target_review', 'c1me_stephanie_target_binding_review_v0_1',
    'mgs_profile', 'c1me_minimum_governed_standard_v0_1',
    'original_capability_evidence_ref', g.evidence_ref,
    'source_superseded', false
  ),
  'persisted_capability_separation',
  'c1me_mgs_revalidation',
  'registrar',
  now(),
  now()
from public.c3_envpac_capability_grant g
where g.capability_key = 'sj_envpac_lapzuli_distribution'
  and g.envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
on conflict (persistence_key) do nothing;

update public.c3_envpac_capability_grant
set standing = 'inactive',
    updated_at = now()
where capability_key = 'sj_envpac_lapzuli_distribution'
  and envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
  and standing = 'active';

commit;
