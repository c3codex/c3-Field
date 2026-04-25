do $$
declare
  harrumuk_registry uuid;
  harrumuk_encounter uuid;
  return_registry uuid;
begin
  select r.id, e.id
  into harrumuk_registry, harrumuk_encounter
  from public.measures_registry r
  join public.measures_encounter_def e on e.registry_id = r.id
  where r.registry_key = 'temple_harrumuk_passage'
  order by e.created_at desc
  limit 1;

  select id into return_registry
  from public.measures_registry
  where registry_key = 'return_antechamber';

  if harrumuk_encounter is not null then
    update public.measures_encounter_def
    set
      metadata = jsonb_set(
        coalesce(metadata, '{}'::jsonb),
        '{auto_advance_to}',
        to_jsonb('phase_map'::text),
        true
      ),
      updated_at = now()
    where id = harrumuk_encounter;
  end if;

  if harrumuk_registry is not null and harrumuk_encounter is not null and return_registry is not null then
    update public.measures_transition_rule
    set
      rule_state = 'inactive',
      metadata = coalesce(metadata, '{}'::jsonb)
        || jsonb_build_object(
          'inactive_reason', 'return_antechamber_requires_explicit_target_after_passage',
          'corrected_by', 'harrumuk_return_antechamber_gate_patch'
        ),
      updated_at = now()
    where from_registry_id = harrumuk_registry
      and from_encounter_id = harrumuk_encounter
      and to_registry_id = return_registry;
  end if;
end $$;
