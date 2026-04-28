-- Measures Registry OAR2 integrity governance patch.
-- Product runtime seating for www.measuresregistry.com.

with registry_runtime as (
  insert into public.measures_registry (
    id,
    registry_key,
    display_title,
    registry_family,
    encounter_type,
    material_family,
    sequence_order,
    release_state,
    access_state,
    is_active,
    metadata
  )
  values (
    gen_random_uuid(),
    'measures_registry_runtime',
    'Measures Registry Runtime',
    'spine',
    'runtime',
    'lapis',
    1000,
    'released',
    'callable',
    true,
    jsonb_build_object(
      'role', 'measures_registry_product_runtime',
      'host', 'www.measuresregistry.com'
    )
  )
  on conflict (registry_key) do update
  set
    is_active = true,
    metadata = coalesce(public.measures_registry.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now()
  returning id
),
registry_runtime_id as (
  select id from registry_runtime
  union all
  select id
  from public.measures_registry
  where registry_key = 'measures_registry_runtime'
  limit 1
),
runtime_encounter_insert as (
  insert into public.measures_encounter_def (
    id,
    registry_id,
    encounter_key,
    display_title,
    encounter_type,
    material_family,
    surface_type,
    sequence_order,
    pause_allowed,
    is_entry_surface,
    is_active,
    metadata
  )
  select
    gen_random_uuid(),
    registry_runtime_id.id,
    'measures_registry_runtime',
    'Measures Registry Runtime',
    'runtime',
    'lapis',
    'threshold',
    1000,
    false,
    true,
    true,
    '{}'::jsonb
  from registry_runtime_id
  where not exists (
    select 1
    from public.measures_encounter_def existing
    where existing.registry_id = registry_runtime_id.id
      and existing.encounter_key = 'measures_registry_runtime'
  )
  returning id
),
target as (
  select
    e.id,
    e.metadata,
    r.registry_key
  from public.measures_encounter_def e
  join public.measures_registry r
    on r.id = e.registry_id
  where r.registry_key in ('measures_registry_runtime', 'phase_map')
),
base_patched as (
  select
    id,
    registry_key,
    jsonb_set(
      jsonb_set(
        coalesce(metadata, '{}'::jsonb),
        '{codex_source_record}',
        '["seed_concordance","system_concordance","twenty_one_of_coherence","coherence_matrix_v1"]'::jsonb,
        true
      ),
      '{integrity_governance}',
      jsonb_build_object(
        'matrix_ref', 'codex_source_record.coherence_matrix_v1',
        'constraints', '[]'::jsonb,
        'agreements', '[]'::jsonb,
        'expected_resolutions', '[]'::jsonb,
        'actor_scope', '["IIS","Contributor","c3 Field"]'::jsonb,
        'alignment_status', coalesce(metadata #>> '{integrity_governance,alignment_status}', 'pending')
      ),
      true
    ) as metadata
  from target
),
patched as (
  select
    id,
    case
      when registry_key = 'phase_map'
        then jsonb_set(metadata, '{phase_map_state}', to_jsonb('incomplete'::text), true)
      when registry_key = 'measures_registry_runtime'
        then jsonb_set(metadata, '{antechamber_state}', to_jsonb('held'::text), true)
      else metadata
    end as metadata
  from base_patched
)
update public.measures_encounter_def e
set metadata = patched.metadata
from patched
where e.id = patched.id
returning
  e.id,
  e.encounter_key,
  e.metadata -> 'codex_source_record' as codex_source_record,
  e.metadata -> 'integrity_governance' as integrity_governance,
  e.metadata ->> 'antechamber_state' as antechamber_state,
  e.metadata ->> 'phase_map_state' as phase_map_state;

update public.measures_encounter_def e
set metadata = coalesce(e.metadata, '{}'::jsonb)
  || jsonb_build_object(
    'codex_source_record',
    '["seed_concordance","system_concordance","twenty_one_of_coherence","coherence_matrix_v1"]'::jsonb,
    'integrity_governance',
    jsonb_build_object(
      'matrix_ref', 'codex_source_record.coherence_matrix_v1',
      'constraints', '[]'::jsonb,
      'agreements', '[]'::jsonb,
      'expected_resolutions', '[]'::jsonb,
      'actor_scope', '["IIS","Contributor","c3 Field"]'::jsonb,
      'alignment_status', 'pending'
    ),
    'antechamber_state',
    'held'
  ),
  updated_at = now()
from public.measures_registry r
where r.registry_key = 'measures_registry_runtime'
  and e.registry_id = r.id
  and e.encounter_key = 'measures_registry_runtime';
