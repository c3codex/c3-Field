insert into public.measures_persistence_state (
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_invite_connection_environment_share_reference_v1:oar1_closeout:env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1',
  'correct_c1me_invite_connection_share_reference_chazz_006',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_invite_connection_environment_share_reference_v1_oar1_closeout',
  'implementation_closeout',
  jsonb_build_object(
    'implementation','source_and_registry_complete',
    'production_source_head','87f96a1464c4dfa70302b56ee30b712490cd327e',
    'control_label','Invite Connection',
    'runtime_action','invite_connection',
    'environment_unique_share_reference',true,
    'active_share_reference_count_at_closeout',0,
    'runtime_owner_dogfood_completed',false,
    'relationship_created_by_invitation',false,
    'standing_created_by_invitation',false,
    'public_profile_created',false
  ),
  jsonb_build_object(
    'operator','op044',
    'oar1_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar1_correct_c1me_invite_connection_environment_share_reference_v1.meta.md',
    'oar1_commit','07d39020f3e2445479d9de0fbafc084e4258376a',
    'oar2_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_correct_c1me_invite_connection_environment_share_reference_v1.meta.md',
    'oar2_commit','2210e8ccb675749a932cc0d5a446aca83d674a0c'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'governance_custody','measures-of-inanna-governance',
    'share_reference_store','c3_field private operational store',
    'ownership_transfer',false,
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'corrects','copy_c3_link semantics within c1me_canopy_reference_controls_v1',
    'source_superseded',false
  ),
  'implemented_source_and_registry_runtime_owner_dogfood_pending',
  'owner_runtime_dogfood_c1me_invite_connection_v1',
  'registrar',now(),now()
)
on conflict (persistence_key) do nothing;
