-- chamber row presence
select
  mr.registry_key,
  mr.display_title,
  mr.registry_family,
  mr.release_state,
  mr.access_state,
  mr.phase_label,
  mr.is_active
from public.measures_registry mr
where mr.registry_key like 'chamber_epithets_%'
order by mr.sequence_order;

-- release-state companion presence
select
  mr.registry_key,
  mrs.release_state,
  mrs.access_state,
  mrs.phase_label,
  mrs.effective_at
from public.measures_registry mr
left join public.measures_release_state mrs
  on mrs.registry_id = mr.id
where mr.registry_key like 'chamber_epithets_%'
order by mr.sequence_order;

-- encounter definition presence
select
  mr.registry_key,
  mr.display_title,
  med.id as encounter_def_id,
  med.encounter_key,
  med.encounter_type,
  med.surface_type,
  med.sequence_order,
  med.is_active
from public.measures_registry mr
left join public.measures_encounter_def med
  on med.registry_id = mr.id
where mr.registry_key like 'chamber_epithets_%'
order by mr.sequence_order, med.sequence_order nulls last, med.id;

-- dependency edges
select
  mr.registry_key as dependent_registry_key,
  fde.dependency_state,
  fde.required_node_type,
  fde.required_node_id,
  req.registry_key as required_registry_key
from public.measures_registry mr
left join public.field_dependency_edge fde
  on fde.dependent_node_type = 'registry'
 and fde.dependent_node_id = mr.id
left join public.measures_registry req
  on fde.required_node_type = 'registry'
 and fde.required_node_id = req.id
where mr.registry_key like 'chamber_epithets_%'
order by mr.sequence_order, req.registry_key nulls last;

-- transition rules
select
  mr.registry_key,
  mtr.transition_kind,
  mtr.rule_state,
  mtr.to_registry_id,
  dest.registry_key as to_registry_key
from public.measures_registry mr
left join public.measures_transition_rule mtr
  on mtr.from_registry_id = mr.id
left join public.measures_registry dest
  on mtr.to_registry_id = dest.id
where mr.registry_key like 'chamber_epithets_%'
order by mr.sequence_order, mtr.transition_kind nulls last, dest.registry_key nulls last;

-- release surface verification
select
  v.registry_key,
  v.display_title,
  v.release_state,
  v.access_state,
  v.is_renderable,
  v.surface_state_reason
from public.v_measures_release_surface_v1 v
join public.measures_registry mr
  on mr.id = v.registry_id
where mr.registry_key like 'chamber_epithets_%'
order by v.sequence_order;
