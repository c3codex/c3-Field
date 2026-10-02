-- Read-only checks against the existing Registry. No provider, binding or relation is created.
with participant as (
  select * from public.c2_mdm_participation_relation where standing='active' and revoked_at is null
), requests as (
  select jsonb_build_object('relation_class','person_initiative','relation_ref',participation_key,
    'asserted_sender',participant_relationship_key,'origin_environment',source_env_key,
    'receiving_environment',target_environment_key,'transport_adapter','registry_cancom_internal',
    'payload_custody_class','registry_custody_ref') as request from participant
)
select jsonb_build_object(
  'github',public.validate_cancom_custody_provider_v1('github','github_file:c3codex/c3-Field@e3e461080938ec14e45951ab45956cb4292f6ca1:OAR/OAR2/codex/oar2_cancom_runtime_20261001_007.md'),
  'drive',public.validate_cancom_custody_provider_v1('drive','drive_file:1sovmQrWfGkHaWveSoK8_AuKbC8jLtap8'),
  'unknown',public.validate_cancom_custody_provider_v1('unregistered_verification_provider','unregistered_verification_provider:test'),
  'mismatch',public.validate_cancom_custody_provider_v1('github','drive_file:1sovmQrWfGkHaWveSoK8_AuKbC8jLtap8'),
  'pickup_003',public.resolve_cancom_oar_pickup_v1('execution_instance','cancom_runtime_passage_codex_003','codex')->>'standing',
  'pickup_004',public.resolve_cancom_oar_pickup_v1('execution_instance','cancom_runtime_passage_codex_004','codex')->>'standing',
  'pickup_005',public.resolve_cancom_oar_pickup_v1('execution_instance','cancom_runtime_passage_codex_005','codex')->>'standing',
  'wrong_executor',public.resolve_cancom_oar_pickup_v1('execution_instance','cancom_runtime_passage_codex_007','other'),
  'folder_lookup',public.resolve_cancom_oar_pickup_v1('execution_instance','CanCom/codex','codex'),
  'legacy_plaintext',public.record_c1me_connection_message_internal('nonexistent_verification_connection','nonexistent_verification_actor','text','verification_probe'),
  'operator',public.resolve_cancom_context_v1(jsonb_build_object('relation_class','person_initiative','relation_ref','initop_47pct_op044_v1',
    'asserted_sender','op044','origin_environment',(select source_env_key from participant limit 1),
    'receiving_environment','c2ME_env','audience_role','operator','transport_adapter','registry_cancom_internal','payload_custody_class','registry_custody_ref'))->>'optics_state',
  'mdm_operator',public.resolve_cancom_context_v1(jsonb_build_object('relation_class','person_initiative','relation_ref','mdm',
    'asserted_sender','op044','origin_environment',(select source_env_key from participant limit 1),
    'receiving_environment','c2ME_env','audience_role','operator','transport_adapter','registry_cancom_internal','payload_custody_class','registry_custody_ref')),
  'participant_probes',(select jsonb_agg(jsonb_build_object(
    'participant',public.resolve_cancom_context_v1(request||'{"audience_role":"participant"}'::jsonb)->>'optics_state',
    'operator_rejected',public.resolve_cancom_context_v1(request||'{"audience_role":"operator"}'::jsonb)->>'reason')) from requests),
  'optics_privacy',(select jsonb_build_object('security_invoker',reloptions @> array['security_invoker=true'],
    'anon_select',has_table_privilege('anon',oid,'SELECT'),'authenticated_select',has_table_privilege('authenticated',oid,'SELECT'),
    'service_select',has_table_privilege('service_role',oid,'SELECT')) from pg_class where oid='public.c3ops_oar_lifecycle_optics_resolution_v1'::regclass)
) as proof;
