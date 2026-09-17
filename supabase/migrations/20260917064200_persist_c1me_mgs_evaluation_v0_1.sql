-- Formal c1ME.env MGS evaluation v0.1
-- Operator: op044
-- Requested transition: c1me_mgs_evaluation

begin;

do $$
begin
  if not exists (
    select 1 from public.system_process_registry
    where process_key = 'minimum_governed_standard_v1'
      and process_status = 'active'
      and authority_state = 'operator_confirmed_registered'
  ) then
    raise exception 'c1ME MGS evaluation held: generic MGS process is not active/registered';
  end if;

  if not exists (
    select 1 from public.measures_registry
    where registry_key = 'c1me_minimum_governed_standard_v0_1'
      and is_active = true
      and release_state = 'released'
      and access_state = 'callable'
      and metadata->>'record_class' = 'target_bound_mgs'
      and metadata->>'target_class' = 'c1ME.env'
      and metadata->>'standing' = 'operative'
      and metadata->>'registration_standing' = 'registered'
  ) then
    raise exception 'c1ME MGS evaluation held: operative registered c1ME MGS is not recoverable';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1'
      and object_type = 'minimum_governed_standard_binding'
      and standing = 'current'
      and governed_state->>'mgs_key' = 'c1me_minimum_governed_standard_v0_1'
      and governed_state->>'mgs_version' = 'v0.1'
      and governed_state->>'target_env_key' = 'env_person_eea672f5a7676dad4316755b'
      and governed_state->>'target_envpac_key' = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and governed_state->>'intended_progression' = 'bounded_c1_implementation'
      and coalesce((governed_state->>'scope_match')::boolean,false) = true
      and jsonb_array_length(coalesce(governed_state->'unresolved_holds','[]'::jsonb)) = 0
  ) then
    raise exception 'c1ME MGS evaluation held: current scope-matched target binding is missing or stale';
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
    raise exception 'c1ME MGS evaluation held: live environment standing/scope changed';
  end if;

  if not exists (
    select 1 from public.c3_envpac
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and env_key = 'env_person_eea672f5a7676dad4316755b'
      and standing = 'effective'
      and is_effective = true
      and owner_subject_type = 'individual'
      and owner_subject_key = 'crs_93e901234ae044a396654ee80644b005'
      and custodian_subject_type = 'system'
      and custodian_subject_key = 'c3_field'
  ) then
    raise exception 'c1ME MGS evaluation held: effective EnvPac ownership/custody relation changed';
  end if;

  if not exists (
    select 1 from public.crs_relationship
    where relationship_key = 'crs_93e901234ae044a396654ee80644b005'
      and relationship_standing = 'c1_C1_persisted'
      and is_active = true
  ) then
    raise exception 'c1ME MGS evaluation held: qualifying c1 relationship is not active/persisted';
  end if;

  if not exists (
    select 1 from public.crs_consent
    where relationship_key = 'crs_93e901234ae044a396654ee80644b005'
      and consent_scope = 'c1_connect_relationship'
      and consent_state = 'granted'
      and withdrawn_at is null
  ) then
    raise exception 'c1ME MGS evaluation held: active c1 consent is missing/withdrawn';
  end if;

  if not exists (
    select 1 from public.measures_persistence_state
    where persistence_key = 'env_c3_community_connect:crs_93e901234ae044a396654ee80644b005'
      and object_type = 'c1_relational_relationship'
      and standing = 'c1_C1_persisted'
  ) then
    raise exception 'c1ME MGS evaluation held: C1 relationship persistence is missing';
  end if;

  if exists (
    select 1 from public.c3_envpac_capability_grant
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and standing = 'active'
  ) then
    raise exception 'c1ME MGS evaluation held: active capability exceeds current c1 target baseline';
  end if;

  if not exists (
    select 1 from public.c3_envpac_capability_grant
    where capability_key = 'sj_envpac_lapzuli_distribution'
      and envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and standing = 'inactive'
  ) then
    raise exception 'c1ME MGS evaluation held: prior higher-order capability separation is not recoverable';
  end if;

  if not exists (
    select 1 from public.c3_envpac_access_grant
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and relation_role = 'owner'
      and standing = 'active'
      and revoked_at is null
      and subject_key = 'crs_93e901234ae044a396654ee80644b005'
  ) then
    raise exception 'c1ME MGS evaluation held: active owner grant missing';
  end if;

  if not exists (
    select 1 from public.c3_envpac_access_grant
    where envpac_key = 'c3envpac_person_eea672f5a7676dad4316755b_v0_1'
      and relation_role = 'custodian'
      and standing = 'active'
      and revoked_at is null
      and subject_key = 'c3_field'
  ) then
    raise exception 'c1ME MGS evaluation held: active custodian grant missing';
  end if;
end $$;

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
  'c1me_mgs_evaluation:env_person_eea672f5a7676dad4316755b:v0_1',
  'minimum_governed_standard_v1',
  'c1me_mgs_evaluation_chazz_004',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_stephanie_mgs_evaluation_v0_1',
  'minimum_governed_standard_evaluation',
  jsonb_build_object(
    'evaluation_key','c1me_stephanie_mgs_evaluation_v0_1',
    'result','minimum_governed_standard_satisfied',
    'mgs_key','c1me_minimum_governed_standard_v0_1',
    'mgs_version','v0.1',
    'binding_key','c1me_mgs_binding_env_person_eea672f5a7676dad4316755b_v0_1',
    'target_env_key','env_person_eea672f5a7676dad4316755b',
    'target_envpac_key','c3envpac_person_eea672f5a7676dad4316755b_v0_1',
    'target_registry_environment_class','c3me_individual_environment',
    'mgs_target_class','c1ME.env',
    'subject_key','crs_93e901234ae044a396654ee80644b005',
    'requested_progression','bounded_c1_implementation',
    'applicable_role','owner',
    'circuit','c1',
    'current_result','C1',
    'environment_standing','c1_connected',
    'relationship_standing','c1_C1_persisted',
    'c2_standing','not_created',
    'touchpoints',jsonb_build_object(
      'Identity','resolved',
      'Ownership','resolved',
      'Custody','resolved',
      'Verification','resolved',
      'Relationship','resolved',
      'Persistence','resolved'
    ),
    'dimension_results',jsonb_build_object(
      'Identity','pass',
      'Purpose','pass',
      'Authority','pass',
      'Boundary','pass',
      'Environment','pass',
      'Role','pass',
      'Relation','pass_with_nonoperative_package_note',
      'Passage','pass',
      'Standing','pass',
      'Evidence','pass',
      'Custody_and_lineage','pass',
      'Holds_and_failures','pass_no_prohibitive_hold',
      'Return_and_review','pass',
      'Exit_condition','minimum_governed_standard_satisfied'
    ),
    'active_capability_count',0,
    'owner_grant_resolved',true,
    'custodian_grant_resolved',true,
    'consent_resolved',true,
    'canopy_model_conflict',false,
    'canopy_reference_registry_standing_created',false,
    'canopy_external_provider_access_created',false,
    'canopy_open_scope','owner-directed navigation to owner-supplied external URL only',
    'formal_mgs_satisfaction_created',true,
    'implementation_authority_created',false,
    'runtime_effect_created',false,
    'validity_rule','current until material change to bound target, MGS version, binding, standing, authority, consent, Boundary conditions, capability set, or relevant evidence; no fixed timestamp expiry'
  ),
  jsonb_build_object(
    'operator','op044',
    'operator_instruction','c1me_mgs_evaluation',
    'execution_instance_id','c1me_mgs_evaluation_chazz_004',
    'mgs_registration','c1me_minimum_governed_standard_v0_1:registration',
    'current_binding','c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1',
    'target_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'capability_separation','c1me_lapzuli_capability_separation_v0_1:persistence',
    'c1_relationship_persistence','env_c3_community_connect:crs_93e901234ae044a396654ee80644b005',
    'governance_artifact_path','github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_stephanie_mgs_evaluation_v0_1.meta.md',
    'governance_artifact_commit','604abd1be5a3ddabded007885d54f60288a16019',
    'governance_artifact_blob_sha1','d690bc50ee561bf8f362ac21671157d05bafd53d',
    'source_concordance_control','current_source_concordance_v16'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'physical_custody','github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_stephanie_mgs_evaluation_v0_1.meta.md',
    'target_envpac_custody','c3_field',
    'owner_authority','individual',
    'ownership_transfer',false,
    'custody_transfer',false,
    'public_release',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'mgs_candidate','c1me_minimum_governed_standard_v0_1:persistence',
    'mgs_registration','c1me_minimum_governed_standard_v0_1:registration',
    'current_binding','c1me_mgs_binding:env_person_eea672f5a7676dad4316755b:v0_1',
    'prior_hold_review','c1me_stephanie_target_binding_review_v0_1:persistence',
    'clear_revalidation','c1me_stephanie_target_binding_revalidation_v0_2:persistence',
    'capability_separation','c1me_lapzuli_capability_separation_v0_1:persistence',
    'historical_evaluations_overwritten',false,
    'environment_class_rewritten',false,
    'source_superseded',false
  ),
  'minimum_governed_standard_satisfied',
  'ordinary_bounded_c1_implementation_authority_route',
  'registrar',
  now(),
  now()
)
on conflict (persistence_key) do nothing;

commit;
