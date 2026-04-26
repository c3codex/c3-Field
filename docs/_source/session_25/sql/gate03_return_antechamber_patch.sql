update public.measures_encounter_def e
set
  metadata =
    jsonb_set(
      jsonb_set(
        coalesce(e.metadata, '{}'::jsonb),
        '{actions}',
        jsonb_build_array(
          jsonb_build_object(
            'id', 'return_via_harrumuk',
            'kind', 'progression',
            'label', 'Return Through Harrumuk',
            'emphasis', 'primary',
            'target_registry_key', 'temple_harrumuk_passage',
            'target_after_passage', 'return_antechamber',
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
      jsonb_build_array('temple_harrumuk_passage', 'phase_map'),
      true
    ),
  updated_at = now()
from public.measures_registry r
where e.registry_id = r.id
  and r.registry_key = 'gate_3_lapis_necklace';
