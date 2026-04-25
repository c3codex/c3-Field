-- Session 25 Phase Map render contract patch.
-- Minimal live-DB correction for the already-seated Phase Map contract:
-- - preserve existing nodes, positions, edges, labels, legend, explanation, and node-state bodies
-- - correct stale me_codexstone references to codexstone
-- - expose a top-level positions map copied from DB-seated node.position values
-- - expose per-node routing targets under phase_map.routing.nodes

with target as (
  select
    e.id,
    e.metadata,
    e.metadata -> 'phase_map' as phase_map
  from public.measures_encounter_def e
  join public.measures_registry r
    on r.id = e.registry_id
  where r.registry_key = 'phase_map'
    and e.encounter_key = 'phase_map'
),
nodes as (
  select
    t.id,
    n.ordinality,
    case
      when n.node ->> 'registry_key' = 'me_codexstone'
        then jsonb_set(n.node, '{registry_key}', to_jsonb('codexstone'::text), true)
      else n.node
    end as node
  from target t
  cross join lateral jsonb_array_elements(t.phase_map -> 'nodes') with ordinality as n(node, ordinality)
),
edges as (
  select
    t.id,
    e.ordinality,
    jsonb_set(
      jsonb_set(
        e.edge,
        '{from}',
        to_jsonb(case when e.edge ->> 'from' = 'me_codexstone' then 'codexstone' else e.edge ->> 'from' end),
        true
      ),
      '{to}',
      to_jsonb(case when e.edge ->> 'to' = 'me_codexstone' then 'codexstone' else e.edge ->> 'to' end),
      true
    ) as edge
  from target t
  cross join lateral jsonb_array_elements(t.phase_map -> 'edges') with ordinality as e(edge, ordinality)
),
assembled as (
  select
    t.id,
    jsonb_agg(n.node order by n.ordinality) as nodes,
    (
      select jsonb_agg(edge order by ordinality)
      from edges
      where edges.id = t.id
    ) as edges,
    jsonb_object_agg(n.node ->> 'registry_key', n.node -> 'position') filter (where n.node ? 'position') as positions,
    jsonb_object_agg(
      n.node ->> 'registry_key',
      jsonb_build_object('target_registry_key', n.node ->> 'registry_key')
    ) as routing_nodes,
    case
      when (t.phase_map -> 'node_state_overrides') ? 'me_codexstone'
        then ((t.phase_map -> 'node_state_overrides') - 'me_codexstone')
          || jsonb_build_object('codexstone', t.phase_map -> 'node_state_overrides' -> 'me_codexstone')
      else coalesce(t.phase_map -> 'node_state_overrides', '{}'::jsonb)
    end as node_state_overrides
  from target t
  join nodes n
    on n.id = t.id
  group by t.id, t.phase_map
),
patched as (
  select
    t.id,
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              t.metadata,
              '{phase_map,nodes}',
              a.nodes,
              true
            ),
            '{phase_map,edges}',
            coalesce(a.edges, '[]'::jsonb),
            true
          ),
          '{phase_map,positions}',
          coalesce(a.positions, '{}'::jsonb),
          true
        ),
        '{phase_map,routing,nodes}',
        coalesce(a.routing_nodes, '{}'::jsonb),
        true
      ),
      '{phase_map,node_state_overrides}',
      a.node_state_overrides,
      true
    ) as metadata
  from target t
  join assembled a
    on a.id = t.id
)
update public.measures_encounter_def e
set metadata = patched.metadata
from patched
where e.id = patched.id
returning
  e.id,
  e.encounter_key,
  e.metadata -> 'phase_map' -> 'positions' as positions,
  e.metadata -> 'phase_map' -> 'routing' -> 'nodes' as routing_nodes;
