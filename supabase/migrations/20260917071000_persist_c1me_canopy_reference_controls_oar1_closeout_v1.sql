insert into public.measures_persistence_state (
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_canopy_reference_controls_v1:oar1_closeout:env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1',
  'implement_c1me_canopy_reference_controls_chazz_005',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1_oar1_closeout',
  'implementation_closeout',
  jsonb_build_object(
    'implementation','source_and_registry_complete',
    'production_source_head','d829156c73d80292232c974e60ac6f6ec5af182c',
    'runtime_owner_dogfood_completed',false,
    'active_reference_count',0,
    'external_provider_access_created',false,
    'reference_registry_standing_created',false,
    'rls_private_store_verified',true,
    'public_cloudflare_readback_verified',false
  ),
  jsonb_build_object(
    'operator','op044',
    'oar1_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar1_implement_c1me_canopy_reference_controls_v1.meta.md',
    'oar1_commit','8641a127c407ed8dbe0d0a4406ad0c44e8c56fd5',
    'oar2_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_implement_c1me_canopy_reference_controls_v1.meta.md',
    'process_readback','active_operator_confirmed_bounded_control_surface',
    'registry_canopy_reference_rows',0
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'governance_custody','measures-of-inanna-governance',
    'ownership_transfer',false,
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'implementation_authority','c1me_canopy_reference_controls_v1:implementation_authority:env_person_eea672f5a7676dad4316755b',
    'mgs_evaluation','c1me_mgs_evaluation:env_person_eea672f5a7676dad4316755b:v0_1',
    'source_superseded',false
  ),
  'implemented_source_and_registry_runtime_owner_dogfood_pending',
  'owner_runtime_dogfood_c1me_canopy_reference_controls_v1',
  'registrar',now(),now()
)
on conflict (persistence_key) do nothing;
