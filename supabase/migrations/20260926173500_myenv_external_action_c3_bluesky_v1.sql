begin;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values
(
  'c3ops_myenv_external_action_v1','c3ops','My Env External Action v1','active',
  'functions/api/c3ops/external-action.ts','source_merged_runtime_bindings_held',
  jsonb_build_object(
    'operator','op044',
    'contract','c3ops_myenv_external_action_v1',
    'runtime_surface','my_env',
    'current_required',true,
    'operator_context_required',true,
    'provider_credentials_exposed_to_browser',false,
    'first_executor','c3_bluesky_worker_v1',
    'external_effect_authority_created_by_runtime',false
  ),
  'My Env External Action v1','CURRENT-bound governed external action dispatch','active','governed_runtime',
  jsonb_build_array('envpac:c3envpac_person_eea672f5a7676dad4316755b_v0_1','worker:c3_bluesky_worker_v1'),
  'oar2',true,true,true,now(),now()
),
(
  'c3_bluesky_worker_v1','lapzuli_distribution','c3 Bluesky Worker v1','active',
  'workers/lapzuli-distribution-worker/src/c3-bluesky-adapter.js','source_merged_runtime_bindings_held',
  jsonb_build_object(
    'operator','op044',
    'targets',jsonb_build_array('bluesky_c3field','bluesky_c3partners'),
    'handles',jsonb_build_array('c3field.bsky.social','c3partners.bsky.social'),
    'unDrifted_identity_used',false,
    'worker_control_required',true,
    'provider_credentials_worker_only',true,
    'external_execution_requires_upstream_authority',true
  ),
  'c3 Bluesky Worker v1','ATProto execution for registered c3 Bluesky identities','active','bounded_executor',
  jsonb_build_array('executor:bluesky_api','target:c3field.bsky.social','target:c3partners.bsky.social'),
  'oar2',true,true,true,now(),now()
)
on conflict (process_key) do update set
  status=excluded.status,source_path=excluded.source_path,authority_state=excluded.authority_state,
  metadata=excluded.metadata,process_status=excluded.process_status,source_reference_set=excluded.source_reference_set,updated_at=now();

insert into public.c3_envpac_capability_grant(
  capability_key,envpac_key,system_key,capability,scope,evidence_ref,standing,created_at,updated_at
) values (
  'op044_myenv_external_action_v1',
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1',
  'c3ops',
  'external_action',
  jsonb_build_object(
    'process_key','c3ops_myenv_external_action_v1',
    'allowed_actions',jsonb_build_array('list_released_actions','confirm_and_execute','return_evidence'),
    'allowed_executors',jsonb_build_array('bluesky_api'),
    'allowed_targets',jsonb_build_array('bluesky_c3field','bluesky_c3partners'),
    'current_required',true,
    'operator_context_required',true,
    'provider_credentials_visible',false,
    'registry_write_authority',false,
    'autonomous_external_effect_authority',false,
    'operator_confirmation_required',true
  ),
  'system_process_registry:c3ops_myenv_external_action_v1',
  'active',now(),now()
)
on conflict (capability_key) do update set
  scope=excluded.scope,evidence_ref=excluded.evidence_ref,standing=excluded.standing,updated_at=now();

insert into public.c3_envpac_runtime_primitive(
  binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,runtime_endpoint,sort_order,standing,config
) values (
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1:primitive:external_actions',
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1',
  'external_actions','governed_external_action','Actions','c1me.external_actions',
  '/api/my-environment-chazz?runtime=external_action',70,'held',
  jsonb_build_object(
    'current_required',true,
    'operator_confirmation_required',true,
    'provider_credentials_visible',false,
    'implementation_state','source_merged_runtime_bindings_held',
    'activation_requires_deployed_runtime',true
  )
)
on conflict (envpac_key,primitive_key) do update set
  primitive_class=excluded.primitive_class,display_label=excluded.display_label,renderer_key=excluded.renderer_key,
  runtime_endpoint=excluded.runtime_endpoint,sort_order=excluded.sort_order,standing=excluded.standing,
  config=excluded.config,updated_at=now();

update public.measures_distribution_executor
set metadata=metadata||jsonb_build_object(
  'c3_worker_process_key','c3_bluesky_worker_v1',
  'c3_targets',jsonb_build_array('bluesky_c3field','bluesky_c3partners'),
  'runtime_binding_state','held_pending_worker_identity_bindings'
),updated_at=now()
where executor_key='bluesky_api';

commit;
