begin;

update public.c3_envpac_runtime_component
set config=config || jsonb_build_object(
      'ground_renderer_state','source_merged_registry_resolved_pending_live_readback',
      'source_merge_commit','fdf82f7c1aaa036e65ccce0c989fc70234b9f642',
      'H01_disposition','ACT_SOURCE_AND_REGISTRY',
      'live_runtime_readback_owner','H06'
    ),
    updated_at=now()
where envpac_key='c3envpac_c2me_v0_1'
  and context_class='initiative'
  and context_key='47pct'
  and component_key='ground_map';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,
  transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H01_resolved',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','validation',now(),
  'github:c3codex/c3-Field@fdf82f7c1aaa036e65ccce0c989fc70234b9f642',
  'H01 ACT: 4.7 Ground source merged. Registry resolver returns 3 governed sectors and 7 map-qualified property records with separately governed coordinates and evidence-card assertions. Live browser/deployment readback remains H06.'
)
on conflict (transition_event_key) do nothing;

update public.c3_oar_process_instance
set validation_finding='H01, H05, H07 and H08 resolved with recorded evidence. H02, H03, H04 and H06 remain explicit holds.',
    execution_result='Hardening remains held overall. H01 Ground sectors/property cards are source + Registry resolved; remaining holds are H02 CURRENT producers, H03 invite lifecycle enforcement, H04 live OG readback, and H06 runtime proof.',
    updated_at=now()
where process_instance_key='c3field_soft_launch_hardening_optics_v1';

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'resolved',jsonb_build_array('H01','H05','H07','H08'),
      'held',jsonb_build_array('H02','H03','H04','H06'),
      'H01_state','ACT_SOURCE_AND_REGISTRY_RUNTIME_READBACK_H06',
      'H01_source_merge_commit','fdf82f7c1aaa036e65ccce0c989fc70234b9f642',
      'H01_evidence_path','docs/oar/c3_field/evidence_47pct_ground_sector_map_v1.meta.md',
      'H01_sector_count',(select jsonb_array_length((public.resolve_47pct_property_map_internal(false))->'sectors')),
      'H01_property_count',(select jsonb_array_length((public.resolve_47pct_property_map_internal(false))->'map_points'))
    ),
    updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;
