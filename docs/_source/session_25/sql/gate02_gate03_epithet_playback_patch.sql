do $$
declare
  gate2_registry uuid;
  gate2_encounter uuid;
  gate3_registry uuid;
  gate3_encounter uuid;
  passage2_registry uuid;
  passage2_encounter uuid;
begin
  select r.id, e.id
  into gate2_registry, gate2_encounter
  from public.measures_registry r
  join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'gate_2_lapis_beads'
  order by e.created_at desc
  limit 1;

  select r.id, e.id
  into gate3_registry, gate3_encounter
  from public.measures_registry r
  join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'gate_3_lapis_necklace'
  order by e.created_at desc
  limit 1;

  select r.id, e.id
  into passage2_registry, passage2_encounter
  from public.measures_registry r
  join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'gates_passage_02'
  order by e.created_at desc
  limit 1;

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                coalesce(e.metadata, '{}'::jsonb),
                '{playback}',
                coalesce(e.metadata -> 'playback', '{}'::jsonb)
                  || jsonb_build_object(
                    'mode', 'motion_then_still',
                    'video_mode', 'motion_then_still',
                    'settle_to_still', true,
                    'settle_ms', 700,
                    'auto_advance_on_video_end', false
                  ),
                true
              ),
              '{renderer,media_max_width}',
              to_jsonb('86vw'::text),
              true
            ),
            '{renderer,media_max_height}',
            to_jsonb('74svh'::text),
            true
          ),
          '{actions}',
          jsonb_build_array(
            jsonb_build_object(
              'id', 'continue_descent_to_gate_03',
              'kind', 'progression',
              'label', 'Continue Descent',
              'emphasis', 'primary',
              'target_registry_key', 'gates_passage_02',
              'sort_order', 10
            ),
            jsonb_build_object(
              'id', 'return_phase_map',
              'kind', 'return',
              'label', 'Return to Phase Map',
              'emphasis', 'secondary',
              'target_registry_key', 'phase_map',
              'sort_order', 900
            )
          ),
          true
        ),
        '{chamberplate,route_targets}',
        jsonb_build_array('gates_passage_02', 'phase_map'),
        true
      ),
    updated_at = now()
  where e.id = gate2_encounter;

  update public.measures_registry
  set
    release_state = 'released',
    access_state = 'encounterable',
    is_active = true,
    metadata = coalesce(metadata, '{}'::jsonb)
      || jsonb_build_object(
        'source', 'gate02_gate03_epithet_playback_patch',
        'visibility', 'released_gate_03'
      ),
    updated_at = now()
  where id = gate3_registry;

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            coalesce(e.metadata, '{}'::jsonb),
            '{playback}',
            coalesce(e.metadata -> 'playback', '{}'::jsonb)
              || jsonb_build_object(
                'mode', 'motion_then_still',
                'video_mode', 'motion_then_still',
                'settle_to_still', true,
                'settle_ms', 700,
                'auto_advance_on_video_end', false
              ),
            true
          ),
          '{renderer,media_max_width}',
          to_jsonb('86vw'::text),
          true
        ),
        '{renderer,media_max_height}',
        to_jsonb('74svh'::text),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key in (
      'gate_3_lapis_necklace',
      'chamber_epithets_01_primus_artus',
      'chamber_epithets_02_gemynd_corpus',
      'chamber_epithets_03_percipari'
    );

  if passage2_encounter is not null then
    update public.measures_encounter_def
    set
      metadata =
        jsonb_set(
          jsonb_set(
            jsonb_set(
              coalesce(metadata, '{}'::jsonb),
              '{auto_advance_to}',
              to_jsonb('gate_3_lapis_necklace'::text),
              true
            ),
            '{renderer,media_max_width}',
            to_jsonb('82vw'::text),
            true
          ),
          '{renderer,media_max_height}',
          to_jsonb('68svh'::text),
          true
        ),
      updated_at = now()
    where id = passage2_encounter;

    update public.temp_exhibition_media
    set is_active = false, updated_at = now()
    where surface_key = 'gates_passage_02';

    insert into public.temp_exhibition_media (
      display_context,
      surface_type,
      surface_key,
      label,
      media_type,
      bucket_name,
      storage_path,
      render_order,
      is_active,
      notes
    )
    values (
      'measures_of_inanna',
      'passage',
      'gates_passage_02',
      'Gates Passage 02',
      'video',
      'pre-codex-exhibition',
      'gates_passage_01.mp4',
      10,
      true,
      'temporary _01 family passage media reuse'
    );
  end if;

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              coalesce(e.metadata, '{}'::jsonb),
              '{phase_map,node_states,gate_3_lapis_necklace}',
              jsonb_build_object(
                'label', 'open',
                'access_state', 'encounterable',
                'release_state', 'released',
                'is_interactive', true
              ),
              true
            ),
            '{phase_map,node_state_overrides}',
            coalesce(e.metadata #> '{phase_map,node_state_overrides}', '{}'::jsonb) - 'gate_3_lapis_necklace',
            true
          ),
          '{phase_map,routing,nodes,gate_3_lapis_necklace}',
          jsonb_build_object('target_registry_key', 'gate_3_lapis_necklace'),
          true
        ),
        '{phase_map,nodes}',
        (
          select jsonb_agg(
            case
              when node ->> 'registry_key' = 'gate_3_lapis_necklace'
                then node
                  || jsonb_build_object(
                    'node_state', 'open',
                    'access_state', 'encounterable',
                    'release_state', 'released',
                    'is_interactive', true
                  )
              else node
            end
          )
          from jsonb_array_elements(e.metadata #> '{phase_map,nodes}') as n(node)
        ),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'phase_map';
end $$;
