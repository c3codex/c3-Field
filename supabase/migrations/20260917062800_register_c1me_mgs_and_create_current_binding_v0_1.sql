-- Register c1ME.env MGS v0.1 and create current target binding.
-- Operator: op044
-- Requested transition: register_c1me_mgs_and_create_current_binding

begin;

do $$
begin
  if not exists (
    select 1 from public.system_process_registry
    where process_key = 'minimum_governed_standard_v1'
      and process_status = 'active'
      and authority_state = 'operator_confirmed_registered'
  ) then
    raise exception 'MGS registration held: generic minimum_governed_standard_v1 is not active/registered';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'c1me_minimum_governed_standard_v0_1:persistence'
      and standing = 'proposed_pending_mgs_review'
  ) then
    raise exception 'MGS registration held: c1ME MGS candidate persistence is missing or standing differs';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'c1me_stephanie_target_binding_revalidation_v0_2:persistence'
      and standing = 'target_binding_clear_pending_mgs_registration'
  ) then
    raise exception 'MGS registration held: clear target-binding revalidation is missing';
  end if;

  if not exists (
    select 1 from public.c3_environment
    where env_key = 'env_person_eea672f5a7676dad4316755b'
      and environment_class = 'c3me_individual_environment'
      and standing = 'c1_connected'
      and is_active = true
      and metadata->>'c1_standing' = 'c1_C1_persisted'
      and metadata->>'current' = 'C1'
      and metadata->>'c2_standing' = 'not_created'
      and metadata->>'parent_environment' = 'env_c3_community_connect'
  ) then
    raise exception 'MGS registration held: target environment c1 standing/scope does not match';
  end if;

  if not exists (
    select 1 from public.crs_relationship
    where relationship_key = 'crs_93e901234ae044a396654ee80644b005'
      and relationship_standing = 'c1_C1_persisted'
      and is_active = true
  ) then
    raise exception 'MGS registration held: qualifying c1 relationship standing is missing';
  end if;

  if not exists (
    select 1 from public.c3_envpac
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and env_key = 'env_person_eea672f5a7676dad4316755b'
      and standing = 'effective'
      and is_effective = true
      and owner_subject_key = 'crs_93e901234ae044a396654ee80644b005'
  ) then
    raise exception 'MGS registration held: target EnvPac is not effective/bound to owner';
  end if;

  if exists (
    select 1 from public.c3_envpac_capability_grant
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and standing = 'active'
  ) then
    raise exception 'MGS registration held: active capability remains on c1 EnvPac';
  end if;

  if not exists (
    select 1 from public.c3_envpac_capability_grant
    where capability_key = 'sj_envpac_lapzuli_distribution'
      and envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and standing = 'inactive'
  ) then
    raise exception 'MGS registration held: prior Lapzuli capability separation is not recoverable';
  end if;

  if exists (
    select 1 from public.measures_registry
    where registry_key = 'c1me_minimum_governed_standard_v0_1'
      and coalesce(metadata->>'record_class','') <> 'target_bound_mgs'
  ) then
    raise exception 'MGS registration held: registry key collision with incompatible record';
  end if;
end $$;

insert into public.measures_registry (
  registry_key,
  display_title,
  registry_family,
  encounter_type,
  material_family,
  release_state,
  access_state,
  is_active,
  metadata,
  created_at,
  updated_at
)
values (
  'c1me_minimum_governed_standard_v0_1',
  'c1ME.env Minimum Governed Standard v0.1',
  'spine',
  'governance_standing',
  null,
  'released',
  'callable',
  true,
  jsonb_build_object(
    'version', 'v0.1',
    'operator', 'op044',
    'record_class', 'target_bound_mgs',
    'target_class', 'c1ME.env',
    'governing_system', 'c3_field',
    'circuit', 'c1',
    'current_result', 'C1',
    'standing', 'operative',
    'registration_standing', 'registered',
    'generic_mgs_process', 'minimum_governed_standard_v1',
    'canonical_environment_key', 'env_c3_community_connect',
    'source_concordance_control', 'current_source_concordance_v16',
    'surface_car', jsonb_build_object('constraint','Identity','agreement','Verification','resolution','Relationship'),
    'registry_car', jsonb_build_object('constraint','Ownership','agreement','Custody','resolution','Persistence disposition'),
    'terminal_constraint', 'Boundary elevation preflight',
    'touchpoints', jsonb_build_array('Identity','Ownership','Custody','Verification','Relationship','Persistence'),
    'canopy_rule', 'owner-controlled external references; no Registry standing; no c3 external-account access or operation',
    'canopy_open_scope', 'owner-directed navigation to owner-supplied external URL only',
    'held_until_c2', jsonb_build_array('pubpac_capability','contribution_package_ingestion','governed_contribution_controls','canopy_content_import_by_reference','contribution_asset_or_custody_transfer','c2_execution'),
    'held_until_c3', jsonb_build_array('publication_execution','distribution_execution','autonomous_or_delegated_canopy_posting','external_provider_message_or_write_activity','c3_creation_output_functions'),
    'mgs_satisfaction_is_execution_authority', false,
    'implementation_authority_created', false,
    'runtime_effect_created', false,
    'governance_artifact', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_minimum_governed_standard_v0_1.meta.md',
    'registration_closeout', 'github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_mgs_registration_and_current_binding_v0_1.meta.md'
  ),
  now(),
  now()
)
on conflict (registry_key) do nothing;

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
  'c1me_minimum_governed_standard_v0_1:registration',
  'minimum_governed_standard_v1',
  'register_c1me_mgs_and_create_current_binding_chazz_003',
  'env_c3_community_connect',
  'c1me_minimum_governed_standard_v0_1',
  'minimum_governed_standard_registration',
  jsonb_build_object(
    'version','v0.1',
    'registry_key','c1me_minimum_governed_standard_v0_1',
    'target_class','c1ME.env',
    'standing','operative',
    'registration_standing','registered',
    'release_state','released',
    'access_state','callable',
    'candidate_persistence_preserved',true,
    'formal_mgs_satisfaction_created',false,
    'implementation_authority_created',false,
    'runtime_effect_created',false
  ),
  jsonb_build_object(
    'operator','op044',
    'operator_instruction','register_c1me_mgs_and_create_current_binding',
    'execution_instance_id','register_c1me_mgs_and_create_current_binding_chazz_003',
    'candidate_persistence','c1me_minimum_governed_standard_v0_1:persistence',
    'clear_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'registration_closeout_commit','0d93dcb010f8a6cc15e59ca510cb05077b54bc3b',
    'source_concordance_control','current_source_concordance_v16'
  ),
  jsonb_build_object(
    'computational_custody','Measures Registry / Measures Codex Registry',
    'physical_custody','github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_minimum_governed_standard_v0_1.meta.md',
    'ownership_transfer',false,
    'custody_transfer',false,
    'public_release',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'candidate_persistence','c1me_minimum_governed_standard_v0_1:persistence',
    'target_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'generic_mgs_process','minimum_governed_standard_v1',
    'source_superseded',false
  ),
  'operative_registered',
  'create_current_target_binding',
  'registrar',
  now(),
  now()
)
on conflict (persistence_key) do nothing;

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
  'c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1',
  'minimum_governed_standard_v1',
  'register_c1me_mgs_and_create_current_binding_chazz_003',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_mgs_binding_env_person_eea672f5a7676dad4316755b_v0_1',
  'minimum_governed_standard_binding',
  jsonb_build_object(
    'binding_key','c1me_mgs_binding_env_person_eea672f5a7676dad4316755b_v0_1',
    'mgs_key','c1me_minimum_governed_standard_v0_1',
    'mgs_version','v0.1',
    'mgs_target_class','c1ME.env',
    'target_env_key','env_person_eea672f5a7676dad4316755b',
    'target_envpac_key','c3envpac_person_eea672f5a7676dad4316755b_v0_1',
    'target_registry_environment_class','c3me_individual_environment',
    'subject_key','crs_93e901234ae044a396654ee80644b005',
    'parent_environment','env_c3_community_connect',
    'applicable_role','owner',
    'intended_progression','bounded_c1_implementation',
    'circuit','c1',
    'current_result','C1',
    'relationship_standing','c1_C1_persisted',
    'environment_standing','c1_connected',
    'c2_standing','not_created',
    'scope_match',true,
    'effective_standing','current',
    'unresolved_holds',jsonb_build_array(),
    'active_capability_count',0,
    'canopy_model_conflict',false,
    'formal_mgs_satisfaction_created',false,
    'implementation_authority_created',false,
    'runtime_effect_created',false
  ),
  jsonb_build_object(
    'operator','op044',
    'operator_instruction','register_c1me_mgs_and_create_current_binding',
    'execution_instance_id','register_c1me_mgs_and_create_current_binding_chazz_003',
    'mgs_registration_persistence','c1me_minimum_governed_standard_v0_1:registration',
    'target_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'capability_separation','c1me_lapzuli_capability_separation_v0_1:persistence',
    'source_concordance_control','current_source_concordance_v16',
    'registration_closeout_commit','0d93dcb010f8a6cc15e59ca510cb05077b54bc3b'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'target_envpac_custody','c3_field',
    'owner_authority','individual',
    'ownership_transfer',false,
    'custody_transfer',false,
    'public_release',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'mgs_registration','c1me_minimum_governed_standard_v0_1:registration',
    'candidate_mgs','c1me_minimum_governed_standard_v0_1:persistence',
    'prior_held_review','c1me_stephanie_target_binding_review_v0_1:persistence',
    'clear_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'source_superseded',false,
    'environment_class_rewritten',false
  ),
  'current',
  'c1me_mgs_evaluation',
  'registrar',
  now(),
  now()
)
on conflict (persistence_key) do nothing;

commit;
