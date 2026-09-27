begin;

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,
  transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H06_47pct_live_surface_seam',
  'c3field_soft_launch_hardening_optics_v1','operator',
  'held_pending_validation','held_pending_validation','validation',now(),
  'operator_live_check:47pct.c3field.online',
  'Live check reported 4.7% resolving to the held page and retaining Measures Registry metadata. Root cause traced to a stale initiative resolver that collapsed WebPAC custody into canonical c1ME execution, plus no 4.7 server-side social-head projection.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H06_47pct_source_fix',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','execution',now(),
  'github:c3codex/c3-Field@06c799a10fad81a5f479c9ca1cb7bacc2cf48134',
  'Source fix merged: 4.7 initiative resolution now validates persisted custody through held_in + effective custody EnvPAC and canonical runtime through owned_by_envpac -> c3envpac_c1me_v0_1; browser/social metadata now resolves from the 4.7 WebPAC. Live readback remains required.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'H06_state','47pct_live_surface_source_fix_merged_pending_live_readback',
      'H06_47pct_operator_observation','held_page_plus_measures_registry_metadata',
      'H06_47pct_root_cause','stale_custody_equals_runtime_assumption_plus_missing_47pct_social_head_projection',
      'H06_47pct_fix_commit','06c799a10fad81a5f479c9ca1cb7bacc2cf48134',
      'H06_47pct_expected_live_state','initiative_surface_resolved_and_4.7_metadata_projected'
    ),
    updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'runtime_resolver_fix_commit','06c799a10fad81a5f479c9ca1cb7bacc2cf48134',
      'runtime_resolver_state','source_merged_pending_live_readback',
      'runtime_custody_rule','held_in_relation_plus_effective_custody_envpac',
      'runtime_environment_rule','owned_by_envpac_relation_to_c3envpac_c1me_v0_1'
    ),
    updated_at=now()
where process_key='47pct_c1me_surface_binding_v1';

update public.c3_pac
set metadata=metadata || jsonb_build_object(
      'live_surface_fix_commit','06c799a10fad81a5f479c9ca1cb7bacc2cf48134',
      'live_surface_state','source_merged_pending_live_readback',
      'social_head_projection','47pct_webpac_server_projected_pending_live_readback'
    ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

commit;
