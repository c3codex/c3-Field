-- Session 25 Phase Map concentric cadence contract patch.
-- Seats the recovered Phase Map cadence table as DB metadata:
-- - nodes come from the recovered registry-state table
-- - positions are computed once here and stored in metadata.phase_map.positions
-- - renderer receives a concentric class/mode, center node, active key, routing, and node states
-- - frontend must render this contract, not derive nodes or cadence

with source_nodes (
  registry_key,
  label,
  family,
  material,
  sequence_order,
  release_state,
  access_state,
  phase_label,
  phase_key,
  anchor_name,
  anchor_date,
  phase_sequence_order,
  standing_type,
  is_interactive,
  node_state
) as (
  values
    ('me_01','Memory','me','marble',1,'released','encounterable',null,null,null,null,null,null,true,'open'),
    ('gate_1_crown_removed','Inanna''s Crown Removed','gate','obsidian',1,'released','encounterable',null,null,null,null,null,null,true,'open'),
    ('chamber_epithets_01_primus_artus','Primus Artus','epithet','obsidian',1,'released','encounterable','Spring Equinox',null,null,null,null,null,true,'open'),
    ('chamber_epithets_02_gemynd_corpus','Gemynd Corpus','epithet','lapis',2,'released','encounterable','Spring Equinox',null,null,null,null,null,true,'open'),
    ('me_02','The Measuring Cord','me','marble',2,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('gate_2_lapis_beads','Lapis Beads of Beauty','gate','obsidian',2,'released','encounterable',null,null,null,null,null,null,true,'open'),
    ('me_03','Truth','me','marble',3,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_03_percipari','Percipari','epithet','crystal',3,'released','encounterable','Spring Equinox',null,null,null,null,null,true,'open'),
    ('chamber_epithets_04_lady_of_the_largest_heart','Lady of the Largest Heart','epithet','crystal',4,'held','gated','June Solstice',null,null,null,null,null,false,'sealed'),
    ('me_04','Expression','me','marble',4,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('gate_4_breastplate','Breastplate of Divine Protection','gate','obsidian',4,'released','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_05','Divine Ordinance','me','marble',5,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_05_spiritus_stellaris','Spiritus Stellaris','epithet','crystal',5,'held','gated','June Solstice',null,null,null,null,null,false,'sealed'),
    ('gate_5_measuring_rod','Measuring Rod of Divine Order','gate','obsidian',5,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_06','Temple','me','marble',6,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_06_concursus_cubicali','Concursus Cubicali','epithet','marble',6,'held','gated','June Solstice',null,null,null,null,null,false,'sealed'),
    ('gate_6_golden_bracelet','Golden Bracelet of Reverence','gate','obsidian',6,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('gate_7_robe','Robe of Divine Purpose','gate','obsidian',7,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_07_aphrodite','Aphrodite','epithet','lapis',7,'held','gated','Lions Gate',null,null,null,null,null,false,'sealed'),
    ('me_07','Exaltation','me','marble',7,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_08_the_last_oracle','The Last Oracle','epithet','marble',8,'held','gated','Lions Gate',null,null,null,null,null,false,'sealed'),
    ('me_08','Descent','me','marble',8,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_09','Counsel','me','marble',9,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('chamber_epithets_09_she_who_rises_with_the_dog_star','She Who Rises with the Dog Star','epithet','obsidian',9,'held','gated','Lions Gate',null,null,null,null,null,false,'sealed'),
    ('me_10','Assembly','me','marble',10,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_11','Judgment','me','marble',11,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_12','Kingship','me','marble',12,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('me_13','Craft','me','marble',13,'held','gated',null,null,null,null,null,null,false,'sealed'),
    ('gate_3_lapis_necklace','Lapis Necklace of Wealth','gate','obsidian',3,'released','encounterable','gate_3_anchor','gate_3_anchor','new_moon','2026-04-17',110,'scheduled',true,'open')
),
ranked as (
  select
    source_nodes.*,
    row_number() over (partition by family order by sequence_order, registry_key) as family_index,
    count(*) over (partition by family) as family_count,
    case family
      when 'gate' then 24.0
      when 'epithet' then 36.0
      when 'me' then 48.0
      else 40.0
    end as radius,
    case family
      when 'gate' then 1
      when 'epithet' then 2
      when 'me' then 3
      else 9
    end as family_sort
  from source_nodes
),
positioned as (
  select
    *,
    round((50 + cos((-pi() / 2) + ((family_index - 1)::numeric / family_count::numeric) * (2 * pi())) * radius)::numeric, 2) as x,
    round((50 + sin((-pi() / 2) + ((family_index - 1)::numeric / family_count::numeric) * (2 * pi())) * radius)::numeric, 2) as y
  from ranked
),
assembled as (
  select
    jsonb_agg(
      jsonb_strip_nulls(
        jsonb_build_object(
          'registry_key', registry_key,
          'label', label,
          'family', family,
          'material', material,
          'sequence_order', sequence_order,
          'release_state', release_state,
          'access_state', access_state,
          'phase_label', phase_label,
          'phase_key', phase_key,
          'anchor_name', anchor_name,
          'anchor_date', anchor_date,
          'phase_sequence_order', phase_sequence_order,
          'standing_type', standing_type,
          'is_interactive', is_interactive,
          'node_state', node_state,
          'position', jsonb_build_object('x', x, 'y', y)
        )
      )
      order by family_sort, sequence_order, registry_key
    ) as nodes,
    jsonb_object_agg(registry_key, jsonb_build_object('x', x, 'y', y)) as positions,
    jsonb_object_agg(
      registry_key,
      jsonb_build_object(
        'release_state', release_state,
        'access_state', access_state,
        'is_interactive', is_interactive,
        'label', node_state
      )
    ) as node_states,
    jsonb_object_agg(
      registry_key,
      jsonb_build_object('target_registry_key', registry_key)
    ) filter (where is_interactive) as routing_nodes,
    (
      select registry_key
      from positioned
      where is_interactive
      order by (anchor_date is null), anchor_date desc nulls last, family_sort, sequence_order
      limit 1
    ) as active_registry_key
  from positioned
),
target as (
  select e.id, e.metadata
  from public.measures_encounter_def e
  join public.measures_registry r
    on r.id = e.registry_id
  where r.registry_key = 'phase_map'
    and e.encounter_key = 'phase_map'
),
patched as (
  select
    target.id,
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                jsonb_set(
                  jsonb_set(
                    target.metadata,
                    '{renderer}',
                    coalesce(target.metadata -> 'renderer', '{}'::jsonb)
                      || jsonb_build_object('layout', 'phase_map', 'show_action_rail', false),
                    true
                  ),
                  '{phase_map,nodes}',
                  assembled.nodes,
                  true
                ),
                '{phase_map,positions}',
                assembled.positions,
                true
              ),
              '{phase_map,node_states}',
              assembled.node_states,
              true
            ),
            '{phase_map,routing}',
            coalesce(target.metadata #> '{phase_map,routing}', '{}'::jsonb)
              || jsonb_build_object(
                'on_open_node', 'navigate',
                'return_target', 'temple_antechamber',
                'nodes', coalesce(assembled.routing_nodes, '{}'::jsonb)
              ),
            true
          ),
          '{phase_map,layout}',
          jsonb_build_object(
            'mode', 'concentric',
            'class_name', 'phase-map-concentric-field',
            'rings', jsonb_build_array(
              jsonb_build_object('family', 'gate', 'radius', 24, 'label', 'Gates'),
              jsonb_build_object('family', 'epithet', 'radius', 36, 'label', 'Epithets'),
              jsonb_build_object('family', 'me', 'radius', 48, 'label', 'ME')
            )
          ),
          true
        ),
        '{phase_map,center_node}',
        jsonb_build_object(
          'registry_key', 'gate_1_crown_removed',
          'label', 'Universal First Encounter'
        ),
        true
      ),
      '{phase_map,active_registry_key}',
      to_jsonb(assembled.active_registry_key),
      true
    ) as metadata
  from target
  cross join assembled
)
update public.measures_encounter_def e
set metadata = patched.metadata
from patched
where e.id = patched.id
returning
  e.encounter_key,
  e.metadata -> 'phase_map' -> 'layout' as layout,
  e.metadata -> 'phase_map' -> 'active_registry_key' as active_registry_key,
  jsonb_array_length(e.metadata -> 'phase_map' -> 'nodes') as node_count;
