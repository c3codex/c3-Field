insert into public.measures_transition_rule (
  from_registry_id,
  from_encounter_id,
  to_registry_id,
  to_encounter_id,
  transition_kind,
  rule_state,
  requires_release,
  requires_dependency_satisfied,
  requires_passage_ready,
  requires_connect_prompt,
  sort_order,
  metadata
)
select
  r_from.id,
  e_from.id,
  r_to.id,
  e_to.id,
  'progression',
  'active',
  false,
  false,
  false,
  false,
  1,
  jsonb_build_object(
    'action', jsonb_build_object(
      'id', 'auto_enter_crystal_temple_home',
      'kind', 'navigate',
      'label', 'Enter Crystal Temple Home',
      'emphasis', 'primary'
    ),
    'prompt', jsonb_build_object(
      'kind', 'none',
      'enabled', false
    ),
    'blocked', jsonb_build_object(
      'mode', 'stay_current',
      'reason_mode', 'db_reason'
    ),
    'resolution', jsonb_build_object(
      'on_allowed', 'go_target',
      'on_blocked', 'stay_current'
    )
  )
from public.measures_registry r_from
join public.measures_encounter_def e_from
  on e_from.registry_id = r_from.id
join public.measures_registry r_to
  on r_to.registry_key = 'crystal_temple_home'
join public.measures_encounter_def e_to
  on e_to.registry_id = r_to.id
where r_from.registry_key = 'inanna_encounter'
  and e_from.encounter_key = 'inanna_encounter'
  and not exists (
    select 1
    from public.measures_transition_rule t
    where t.from_registry_id = r_from.id
      and t.from_encounter_id = e_from.id
      and t.to_registry_id = r_to.id
      and t.to_encounter_id = e_to.id
  );