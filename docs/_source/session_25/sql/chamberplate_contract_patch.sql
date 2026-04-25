-- Session 25 Chamberplate contract seating.
-- Seats metadata.chamberplate for existing chamberplate encounter rows and
-- ensures the companion renderer/playback bodies are present.
--
-- This patch does not create frontend truth. It records render contract bodies
-- in DB so src can render without deriving chamberplate behavior.

with chamberplates as (
  select
    e.id as encounter_id,
    e.metadata,
    e.surface_type,
    r.id as registry_id,
    r.registry_key,
    r.registry_family,
    r.material_family
  from public.measures_encounter_def e
  join public.measures_registry r
    on r.id = e.registry_id
  where e.surface_type = 'chamberplate'
),
route_targets as (
  select
    c.encounter_id,
    jsonb_agg(distinct to_registry.registry_key order by to_registry.registry_key) as targets
  from chamberplates c
  join public.measures_transition_rule t
    on t.from_registry_id = c.registry_id
   and t.from_encounter_id = c.encounter_id
   and t.rule_state = 'active'
  join public.measures_registry to_registry
    on to_registry.id = t.to_registry_id
  group by c.encounter_id
),
contract as (
  select
    c.encounter_id,
    c.metadata,
    case
      when c.registry_key = 'crystal_temple_home' then jsonb_build_object(
        'mode', 'choice_surface',
        'media_role', 'background_or_still',
        'render_order', jsonb_build_array('image', 'video', 'audio'),
        'audio_role', 'tonal_companion',
        'text_bodies', jsonb_build_array(),
        'interaction_mode', 'choice',
        'route_targets', coalesce(rt.targets, jsonb_build_array('inanna_seat', 'temple_antechamber')),
        'return_behavior', 'none',
        'material_binding', 'registry',
        'capture_enabled', false,
        'panel_mode', 'none'
      )
      when coalesce(c.metadata -> 'presentation', '{}'::jsonb) ? 'plaque' then jsonb_build_object(
        'mode', 'plaque_overlay',
        'media_role', 'background',
        'render_order', jsonb_build_array('video', 'image', 'audio'),
        'audio_role', 'tonal_companion',
        'text_bodies', jsonb_build_array('plaque'),
        'interaction_mode', 'guided',
        'route_targets', coalesce(rt.targets, '[]'::jsonb),
        'return_behavior', 'phase_map',
        'material_binding', 'registry',
        'capture_enabled', false,
        'panel_mode', 'none'
      )
      else jsonb_build_object(
        'mode', 'media_primary',
        'media_role', 'primary',
        'render_order', jsonb_build_array('video', 'image', 'audio'),
        'audio_role', 'tonal_companion',
        'text_bodies', jsonb_build_array('inscription', 'description'),
        'interaction_mode', 'guided',
        'route_targets', coalesce(rt.targets, '[]'::jsonb),
        'return_behavior', 'phase_map',
        'material_binding', 'registry',
        'capture_enabled', false,
        'panel_mode', 'none'
      )
    end as chamberplate_contract,
    case
      when c.registry_key = 'crystal_temple_home' then jsonb_build_object(
        'layout', 'choice_surface',
        'choice_surface_mode', 'still_first',
        'media_fit', 'contain',
        'media_max_width', '92vw',
        'media_max_height', '78vh',
        'show_header', false,
        'show_action_rail', true
      )
      when coalesce(c.metadata -> 'presentation', '{}'::jsonb) ? 'plaque' then jsonb_build_object(
        'layout', 'plaque_overlay',
        'show_header', false,
        'show_action_rail', true
      )
      else jsonb_build_object(
        'layout', 'encounter_focus',
        'show_header', false,
        'show_action_rail', true
      )
    end as renderer_contract,
    case
      when c.registry_key = 'crystal_temple_home' then jsonb_build_object(
        'mode', 'still_first',
        'fade_ms', 900,
        'settle_ms', 1800,
        'advance_delay_ms', null,
        'auto_advance_on_video_end', false
      )
      else jsonb_build_object(
        'mode', 'encounter_media',
        'fade_ms', 900,
        'settle_ms', 0,
        'advance_delay_ms', null,
        'auto_advance_on_video_end', false
      )
    end as playback_contract
  from chamberplates c
  left join route_targets rt
    on rt.encounter_id = c.encounter_id
),
patched as (
  select
    encounter_id,
    jsonb_set(
      jsonb_set(
        jsonb_set(
          coalesce(metadata, '{}'::jsonb),
          '{chamberplate}',
          chamberplate_contract,
          true
        ),
        '{renderer}',
        coalesce(metadata -> 'renderer', renderer_contract),
        true
      ),
      '{playback}',
      coalesce(metadata -> 'playback', playback_contract),
      true
    ) as metadata
  from contract
)
update public.measures_encounter_def e
set metadata = patched.metadata
from patched
where e.id = patched.encounter_id
returning
  e.id,
  e.encounter_key,
  e.surface_type,
  e.metadata -> 'chamberplate' as chamberplate,
  e.metadata -> 'renderer' as renderer,
  e.metadata -> 'playback' as playback;
