begin;

update public.system_process_registry
set metadata = coalesce(metadata,'{}'::jsonb) || jsonb_build_object(
  'runtime_evidence_standing','runtime_proven_observed_local_session_continuity',
  'local_session_continuity_principle','Canopy preserves user-directed access into already-authenticated external environments without acquiring provider authentication or operating authority.',
  'operational_shorthand','c3 opens the door; the destination retains the session.',
  'observed_provider_classes',jsonb_build_array('instagram','facebook'),
  'provider_session_custody','external_provider_and_participant_browser_device',
  'c3_provider_authentication_authority',false,
  'universal_provider_session_guarantee',false,
  'participant_active_external_identity_check_required',true,
  'runtime_proof_oar1','docs/oar/c3_field/oar1_prove_c1me_canopy_local_session_continuity_v1.meta.md',
  'runtime_principle','governance/c1me_canopy_local_session_continuity_principle_v1.meta.md'
), updated_at=now()
where process_key='c1me_canopy_reference_controls_v1';

insert into public.measures_persistence_state (
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_canopy_local_session_continuity_v1:runtime_proof:env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_reference_controls_v1',
  'implement_c1me_canopy_reference_controls_chazz_005',
  'env_person_eea672f5a7676dad4316755b',
  'c1me_canopy_local_session_continuity_v1_runtime_proof',
  'canopy_runtime_evidence_principle',
  jsonb_build_object(
    'principle_key','c1me_canopy_local_session_continuity_principle_v1',
    'result','runtime_proven_observed_local_session_continuity',
    'proof_scope','observed_provider_browser_context',
    'c3_provider_authentication_authority_created',false,
    'provider_session_transfer_created',false,
    'provider_api_authority_created',false,
    'registry_standing_created_for_reference',false,
    'universal_provider_guarantee',false,
    'ux_boundary','Opens using your current session on that service, when available.',
    'active_external_identity_responsibility','participant'
  ),
  jsonb_build_object(
    'operator','op044',
    'evidence_class',jsonb_build_array('c3_side_open_requested_event','operator_attested_external_runtime_result'),
    'instagram_open_requested_at','2026-09-17T07:28:20.386096Z',
    'facebook_open_requested_at','2026-09-17T07:38:36.594529Z',
    'instagram_reference_label','Measures Registry',
    'facebook_reference_label','Personal Profile',
    'operator_attestation','existing provider sessions were reused and external destinations were workable without c3 acquiring provider authentication authority',
    'principle_path','github-private://c3codex/measures-of-inanna-governance/main/governance/c1me_canopy_local_session_continuity_principle_v1.meta.md',
    'principle_commit','109cd58920b38231ca7f9293e2c6ec2612a5075d',
    'oar1_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar1_prove_c1me_canopy_local_session_continuity_v1.meta.md',
    'oar1_commit','4fae06d678c9c1756cc55b9a890989975036915d'
  ),
  jsonb_build_object(
    'computational_custody','Measures Codex Registry',
    'external_provider_session_custody','external provider and participant browser/device',
    'provider_credentials_in_c3_custody',false,
    'provider_tokens_in_c3_custody',false,
    'ownership_transfer',false,
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'canopy_boundary_rule','c1me_canopy_reference_boundary_rule_v1',
    'implementation_authority','c1me_canopy_reference_controls_v1:implementation_authority:env_person_eea672f5a7676dad4316755b',
    'prior_closeout','c1me_canopy_reference_controls_v1:oar1_closeout:env_person_eea672f5a7676dad4316755b',
    'source_superseded',false
  ),
  'runtime_proven_observed_local_session_continuity',
  'broader_canopy_provider_dogfood_or_owner_use',
  'registrar',now(),now()
)
on conflict (persistence_key) do nothing;

commit;
