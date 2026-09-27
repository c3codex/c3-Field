begin;

update public.c3_pac
set metadata=jsonb_set(
      metadata,
      '{footer_contract}',
      coalesce(metadata->'footer_contract','{}'::jsonb) || jsonb_build_object(
        'required_routes',jsonb_build_object(
          'Privacy','https://c3field.online/privacy',
          'Terms','https://c3field.online/terms',
          'Contact','https://c3field.online/contact'
        ),
        'authority_source','47pct_c1_connect_c3webpac_v1',
        'frontend_invention',false
      ),
      true
    ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,
  transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H06_47pct_presentation_dependency',
  'c3field_soft_launch_hardening_optics_v1','operator',
  'held_pending_validation','held_pending_validation','validation',now(),
  'operator_live_check:47pct.c3field.online',
  'Second live check: 4.7 title resolved, but landing was blocked by generic c3 public-presentation availability. This proved the initiative surface resolver and metadata projection were live while the 4.7 encounter still had an unnecessary generic presentation dependency.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H06_47pct_webpac_presentation_decouple',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','execution',now(),
  'github:branch:47pct-public-presentation-decouple-v1',
  '4.7 landing/connect now render from the initiative WebPAC public_presentation + footer_contract authority. Generic c3 public presentation remains optional enrichment and is no longer a release dependency for the 4.7 encounter.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'H06_state','47pct_webpac_presentation_decoupled_pending_live_readback',
      'H06_47pct_second_observation','title_resolved_generic_public_presentation_dependency_failed',
      'H06_47pct_presentation_rule','initiative_webpac_public_presentation_is_sufficient_for_47pct_landing',
      'H06_47pct_footer_rule','initiative_webpac_footer_contract_is_sufficient_for_47pct_footer'
    ),
    updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;
