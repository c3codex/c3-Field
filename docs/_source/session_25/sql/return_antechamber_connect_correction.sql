do $$
declare
  return_registry uuid;
  return_encounter uuid;
  src1_registry uuid;
  src1_encounter uuid;
begin
  select r.id, e.id
  into return_registry, return_encounter
  from public.measures_registry r
  join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'return_antechamber'
  order by e.created_at desc
  limit 1;

  select r.id, e.id
  into src1_registry, src1_encounter
  from public.measures_registry r
  left join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'src1_connect'
  order by e.created_at desc
  limit 1;

  if return_encounter is not null then
    update public.measures_encounter_def
    set
      metadata =
        jsonb_set(
          jsonb_set(
            metadata,
            '{actions}',
            jsonb_build_array(
              jsonb_build_object(
                'id', 'connect_pre_encounter_registry',
                'kind', 'navigate',
                'label', 'Connect',
                'emphasis', 'primary',
                'target_registry_key', 'temple_antechamber',
                'sort_order', 10
              ),
              jsonb_build_object(
                'id', 'return_phase_map',
                'kind', 'navigate',
                'label', 'Phase Map',
                'emphasis', 'secondary',
                'target_registry_key', 'phase_map',
                'sort_order', 20
              ),
              jsonb_build_object(
                'id', 'return_temple',
                'kind', 'navigate',
                'label', 'Temple',
                'emphasis', 'secondary',
                'target_registry_key', 'crystal_temple_home',
                'sort_order', 30
              )
            ),
            true
          ),
          '{chamberplate,route_targets}',
          jsonb_build_array('temple_antechamber', 'phase_map', 'crystal_temple_home'),
          true
        ),
      updated_at = now()
    where id = return_encounter;
  end if;

  if src1_registry is not null then
    update public.measures_registry
    set
      release_state = 'held',
      access_state = 'gated',
      metadata = coalesce(metadata, '{}'::jsonb)
        || jsonb_build_object(
          'source', 'return_antechamber_connect_correction',
          'standing', 'not_codex_connect_capture',
          'note', 'SRC1 is not the Temple Antechamber pre-encounter registry capture.'
        ),
      updated_at = now()
    where id = src1_registry;
  end if;

  if src1_encounter is not null then
    update public.measures_encounter_def
    set
      metadata =
        (
          coalesce(metadata, '{}'::jsonb)
          - 'capture'
        )
        || jsonb_build_object(
          'source', 'return_antechamber_connect_correction',
          'renderer', jsonb_build_object(
            'kind', 'generic_acknowledgment_encounter',
            'layout', 'src1_connect',
            'show_action_rail', true
          ),
          'chamberplate', jsonb_build_object(
            'mode', 'plaque_overlay',
            'media_role', 'background',
            'panel_mode', 'none',
            'text_bodies', jsonb_build_array('plaque'),
            'render_order', jsonb_build_array('image', 'audio'),
            'route_targets', jsonb_build_array('return_antechamber', 'phase_map'),
            'capture_enabled', false,
            'return_behavior', 'phase_map',
            'interaction_mode', 'guided',
            'material_binding', 'registry'
          ),
          'actions', jsonb_build_array(
            jsonb_build_object(
              'id', 'return_antechamber',
              'kind', 'navigate',
              'label', 'Return Antechamber',
              'emphasis', 'secondary',
              'target_registry_key', 'return_antechamber',
              'sort_order', 20
            ),
            jsonb_build_object(
              'id', 'return_phase_map',
              'kind', 'navigate',
              'label', 'Phase Map',
              'emphasis', 'secondary',
              'target_registry_key', 'phase_map',
              'sort_order', 30
            )
          )
        ),
      updated_at = now()
    where id = src1_encounter;
  end if;
end $$;
