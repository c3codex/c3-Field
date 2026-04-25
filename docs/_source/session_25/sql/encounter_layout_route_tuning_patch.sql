do $$
begin
  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              coalesce(e.metadata, '{}'::jsonb),
              '{renderer,media_fit}',
              to_jsonb('contain'::text),
              true
            ),
            '{renderer,media_max_width}',
            to_jsonb('90vw'::text),
            true
          ),
          '{renderer,media_max_height}',
          to_jsonb('78svh'::text),
          true
        ),
        '{chamberplate,route_targets}',
        (
          select jsonb_agg(distinct value)
          from jsonb_array_elements_text(
            coalesce(e.metadata #> '{chamberplate,route_targets}', '[]'::jsonb)
            || jsonb_build_array('phase_map')
          ) as t(value)
        ),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and e.surface_type = 'chamberplate'
    and r.registry_key not in ('crystal_temple_home', 'temple_antechamber');

  update public.measures_encounter_def e
  set
    metadata = jsonb_set(
      coalesce(e.metadata, '{}'::jsonb),
      '{actions}',
      (
        select jsonb_agg(action order by sort_order)
        from (
          select
            value as action,
            coalesce((value ->> 'sort_order')::int, 100) as sort_order
          from jsonb_array_elements(coalesce(e.metadata -> 'actions', '[]'::jsonb)) as existing(value)
          where value ->> 'id' <> 'return_phase_map'
          union all
          select
            jsonb_build_object(
              'id', 'return_phase_map',
              'kind', 'return',
              'label', 'Return to Phase Map',
              'emphasis', 'secondary',
              'target_registry_key', 'phase_map',
              'sort_order', 900
            ) as action,
            900 as sort_order
        ) actions
      ),
      true
    ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and e.surface_type = 'chamberplate'
    and coalesce(e.metadata #>> '{chamberplate,return_behavior}', '') = 'phase_map';

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            coalesce(e.metadata, '{}'::jsonb),
            '{renderer,media_fit}',
            to_jsonb('contain'::text),
            true
          ),
          '{renderer,media_max_width}',
          to_jsonb('82vw'::text),
          true
        ),
        '{renderer,media_max_height}',
        to_jsonb('72svh'::text),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'epigraph';

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          coalesce(e.metadata, '{}'::jsonb),
          '{renderer,media_max_width}',
          to_jsonb('96vw'::text),
          true
        ),
        '{renderer,media_max_height}',
        to_jsonb('84svh'::text),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'crystal_temple_home';

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            coalesce(e.metadata, '{}'::jsonb),
            '{renderer,show_action_rail}',
            'true'::jsonb,
            true
          ),
          '{actions}',
          jsonb_build_array(
            jsonb_build_object(
              'id', 'return_to_temple_via_harrumuk',
              'kind', 'return',
              'label', 'Return to Temple',
              'emphasis', 'secondary',
              'target_registry_key', 'temple_harrumuk_passage',
              'target_after_passage', 'crystal_temple_home',
              'sort_order', 90
            )
          ),
          true
        ),
        '{phase_map,routing,return_target}',
        to_jsonb('temple_harrumuk_passage'::text),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'phase_map';
end $$;
