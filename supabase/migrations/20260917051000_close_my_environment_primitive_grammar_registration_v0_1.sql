-- Close My Environment Primitive Grammar v0.1 registration.
-- Adds the source-graph alignment edge and Registry persistence-state binding.
-- Does not create implementation authority, runtime activation, custody transfer, ownership transfer, or Current.

begin;

insert into public.codex_source_relation(
  from_source_reference_id,
  to_source_reference_id,
  relation_type,
  relation_note,
  metadata
)
select
  grammar.id,
  source.id,
  'aligns_to',
  'My Environment Primitive Grammar v0.1 is a protected Registry grammar aligned to Current Source Concordance v16. Source Concordance controls collisions and qualifications; this relation does not supersede or mutate v16.',
  jsonb_build_object(
    'operator','op044',
    'execution_instance_id','register_my_environment_primitive_grammar_chazz_001',
    'source_controls_collisions',true,
    'source_superseded',false,
    'continuous_project_source',false,
    'implementation_authority_created',false
  )
from public.codex_source_reference grammar
join public.codex_source_reference source on source.source_key='current_source_concordance_v16'
where grammar.source_key='my_environment_primitive_grammar_v0_1'
  and not exists (
    select 1
    from public.codex_source_relation r
    where r.from_source_reference_id=grammar.id
      and r.to_source_reference_id=source.id
      and r.relation_type='aligns_to'
  );

insert into public.measures_persistence_state(
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
values(
  'my_environment_primitive_grammar_v0_1:persistence',
  'governed_object_passage_process_v4',
  'register_my_environment_primitive_grammar_chazz_001',
  'env_c3ops',
  'my_environment_primitive_grammar_v0_1',
  'governance_primitive_grammar',
  jsonb_build_object(
    'version','v0.1',
    'primitive_count',13,
    'visibility','protected',
    'concordance_version','my_environment_primitive_grammar_v0_1',
    'source_reference_key','my_environment_primitive_grammar_v0_1',
    'source_concordance_control','current_source_concordance_v16',
    'composition_rule','features_are_projections_of_primitives_primitives_are_not_created_to_satisfy_features',
    'boundary_proposition','nothing_crosses_merely_because_it_can_see_the_other_side',
    'implementation_authority_created',false,
    'runtime_activation_created',false,
    'current_created',false
  ),
  null,
  jsonb_build_object(
    'operator','op044',
    'operator_confirmation','proceed',
    'registry_migration','20260917050500_register_my_environment_primitive_grammar_v0_1.sql',
    'closeout_migration','20260917051000_close_my_environment_primitive_grammar_registration_v0_1.sql',
    'source_reference_key','my_environment_primitive_grammar_v0_1',
    'source_integrity_algorithm','git_blob_sha1',
    'source_integrity_hash','47d613bce201a963b9a4732cf708f122b3a7371e',
    'concordance_version','my_environment_primitive_grammar_v0_1',
    'active_primitive_count',13,
    'active_source_alignment_count',14
  ),
  jsonb_build_object(
    'physical_custody','github-private://c3codex/measures-of-inanna-governance/main/governance/my_environment_primitive_grammar_v0_1_physical_persistence.meta.md',
    'computational_custody','Measures Codex Registry',
    'source_reference_custody','codex_source_reference:my_environment_primitive_grammar_v0_1',
    'public_release',false,
    'custody_transfer',false,
    'ownership_transfer',false
  ),
  jsonb_build_object(
    'elevated_component','governance/my_environment_primitive_grammar_v0_1_elevated.meta.md',
    'elevation_commit','e6f99e1330a6b74ff3d940d5a4443bce769e0b73',
    'physical_persistence','governance/my_environment_primitive_grammar_v0_1_physical_persistence.meta.md',
    'source_concordance_alignment','current_source_concordance_v16',
    'source_concordance_superseded',false,
    'append_preserving',true
  ),
  'registered_protected_primitive_grammar',
  'close_or_separate_implementation_profile_evaluation',
  'op044_confirmed_computational_persistence'
)
on conflict(persistence_key) do update set
  process_key=excluded.process_key,
  oar2_key=excluded.oar2_key,
  environment_key=excluded.environment_key,
  object_key=excluded.object_key,
  object_type=excluded.object_type,
  governed_state=excluded.governed_state,
  source_sha256=excluded.source_sha256,
  evidence=excluded.evidence,
  custody=excluded.custody,
  lineage=excluded.lineage,
  standing=excluded.standing,
  next_permitted_transition=excluded.next_permitted_transition,
  persisted_by=excluded.persisted_by,
  updated_at=now();

commit;
