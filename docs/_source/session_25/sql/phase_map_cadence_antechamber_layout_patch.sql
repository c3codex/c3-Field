do $$
declare
  cadence_sequence jsonb := jsonb_build_array(
    'gate_1_crown_removed',
    'gate_2_lapis_beads',
    'gate_3_lapis_necklace',
    'chamber_epithets_01_primus_artus',
    'chamber_epithets_02_gemynd_corpus',
    'chamber_epithets_03_percipari',
    'codexstone',
    'me_01',
    'me_02',
    'me_03',
    'me_04',
    'me_05',
    'me_06',
    'me_07',
    'me_08'
  );
begin
  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  coalesce(e.metadata, '{}'::jsonb),
                  '{phase_map,cadence,sequence}',
                  cadence_sequence,
                  true
                ),
                '{phase_map,cadence,complete_target_registry_key}',
                to_jsonb('temple_harrumuk_passage'::text),
                true
              ),
              '{phase_map,node_states,codexstone}',
              jsonb_build_object(
                'label', 'open',
                'access_state', 'visible',
                'release_state', 'released',
                'is_interactive', true
              ),
              true
            ),
            '{phase_map,routing,nodes,codexstone}',
            jsonb_build_object('target_registry_key', 'codexstone'),
            true
          ),
          '{phase_map,routing,nodes,me_01}',
          jsonb_build_object('target_registry_key', 'me_01'),
          true
        ),
        '{phase_map,next_release}',
        jsonb_build_object(
          'label', 'Next release',
          'title', 'June Solstice',
          'body', 'Held chamberplates remain sealed until the next seated release window.'
        ),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'phase_map';

  update public.measures_encounter_def e
  set
    metadata =
      jsonb_set(
        jsonb_set(
          coalesce(e.metadata, '{}'::jsonb),
          '{renderer,action_anchor}',
          to_jsonb('lower_left'::text),
          true
        ),
        '{capture,anchor}',
        to_jsonb('lower_right'::text),
        true
      ),
    updated_at = now()
  from public.measures_registry r
  where e.registry_id = r.id
    and r.registry_key = 'temple_antechamber';
end $$;
