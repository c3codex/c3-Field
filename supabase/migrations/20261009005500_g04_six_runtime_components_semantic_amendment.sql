-- M2 G04 semantic amendment: distinguish universal relational conditions from My Env runtime components.
-- Authority: oar2_amend_g04_six_runtime_components_chazz_20261008_015
-- Canonical My Env component contract: c1me_env_runtime_components_v6
-- Canonical universal relational condition contract: c3_six_relational_conditions_v1

begin;

create or replace function public.seed_c1me_env_runtime_components_internal(p_envpac_key text)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  v_legacy jsonb;
begin
  v_legacy := public.seed_c1me_envpac_primitives_internal(p_envpac_key);

  if coalesce((v_legacy->>'seeded')::boolean,false) is not true then
    return v_legacy || jsonb_build_object(
      'runtime_component_contract','c1me_env_runtime_components_v6',
      'runtime_component_count',5,
      'relational_condition_contract','c3_six_relational_conditions_v1',
      'legacy_primitive_contract_deprecated',true
    );
  end if;

  update public.c3_envpac_runtime_primitive
  set config=coalesce(config,'{}'::jsonb)||jsonb_build_object(
        'universal_runtime_component',
          primitive_key in ('current','my_pacs','canopy','native_connections','invite_connection'),
        'runtime_component_contract','c1me_env_runtime_components_v6',
        'relational_condition_contract','c3_six_relational_conditions_v1',
        'legacy_universal_primitive_flag',coalesce(config->>'universal','false')='true'
      ),
      updated_at=now()
  where envpac_key=p_envpac_key
    and standing='active';

  update public.c3_envpac
  set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
        'runtime_component_contract','c1me_env_runtime_components_v6',
        'runtime_component_count',5,
        'runtime_universal_component_count',5,
        'runtime_universal_component_keys',jsonb_build_array(
          'current','my_pacs','canopy','native_connections','invite_connection'
        ),
        'runtime_relational_condition_contract','c3_six_relational_conditions_v1',
        'runtime_relational_condition_count',6,
        'runtime_relational_condition_keys',jsonb_build_array(
          'identity','ownership','custody','verification','relationship','persistence'
        ),
        'runtime_primitive_contract_legacy_alias','c1me_env_primitives_v5',
        'runtime_primitive_contract_deprecated',true,
        'runtime_component_semantic_correction_under',
          'oar2_amend_g04_six_runtime_components_chazz_20261008_015'
      ),
      updated_at=now()
  where envpac_key=p_envpac_key;

  return jsonb_build_object(
    'seeded',true,
    'envpac_key',p_envpac_key,
    'runtime_component_contract','c1me_env_runtime_components_v6',
    'runtime_component_count',5,
    'runtime_component_keys',jsonb_build_array(
      'current','my_pacs','canopy','native_connections','invite_connection'
    ),
    'relational_condition_contract','c3_six_relational_conditions_v1',
    'relational_condition_count',6,
    'legacy_primitive_contract','c1me_env_primitives_v5',
    'legacy_primitive_contract_deprecated',true
  );
end
$$;

revoke all on function public.seed_c1me_env_runtime_components_internal(text)
from public,anon,authenticated;
grant execute on function public.seed_c1me_env_runtime_components_internal(text)
to service_role;

create or replace function public.c1me_envpac_primitive_seed_trigger()
returns trigger
language plpgsql
security definer
set search_path=public,pg_temp
as $
begin
  perform public.seed_c1me_env_runtime_components_internal(new.envpac_key);
  return new;
end
$;

revoke all on function public.c1me_envpac_primitive_seed_trigger()
from public,anon,authenticated;

-- Normalize all effective personal My Env EnvPACs through the corrected component contract.
select public.seed_c1me_env_runtime_components_internal(ep.envpac_key)
from public.c3_envpac ep
join public.c3_environment e on e.env_key=ep.env_key
where ep.owner_subject_type='individual'
  and ep.is_effective=true
  and ep.standing='effective'
  and e.environment_class='c3me_individual_environment'
  and e.is_active=true;

create or replace function public.resolve_c1me_envpac_primitives_internal(p_relationship_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,pg_temp
as $$
declare
  v_current jsonb;
  v_envpac_key text;
  v_declared_contract text;
  v_declared_count integer;
  v_component_count integer;
  v_component_keys text[];
  v_components jsonb;
  v_contextual jsonb;
begin
  v_current := public.resolve_c1me_current_internal(p_relationship_key);

  if coalesce(v_current->>'resolution','') <> 'existing_c1' then
    return v_current || jsonb_build_object(
      'component_resolution','held',
      'runtime_component_contract','c1me_env_runtime_components_v6',
      'runtime_component_count',5,
      'relational_condition_contract','c3_six_relational_conditions_v1',
      'relational_condition_count',6,
      'contextual_component_count',0,
      'components','[]'::jsonb,
      'contextual_components','[]'::jsonb,
      'primitive_resolution','held',
      'primitive_contract','c1me_env_primitives_v5',
      'primitive_count',5,
      'primitives','[]'::jsonb,
      'primitive_compatibility_deprecated',true
    );
  end if;

  v_envpac_key := v_current->>'envpac_ref';

  select
    metadata->>'runtime_component_contract',
    nullif(metadata->>'runtime_component_count','')::integer
  into v_declared_contract,v_declared_count
  from public.c3_envpac
  where envpac_key=v_envpac_key
    and is_effective=true
    and standing='effective';

  select
    count(*) filter (
      where coalesce(config->>'universal_runtime_component','false')='true'
    ),
    array_agg(primitive_key order by primitive_key)
      filter (
        where coalesce(config->>'universal_runtime_component','false')='true'
      )
  into v_component_count,v_component_keys
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active';

  if v_declared_contract is distinct from 'c1me_env_runtime_components_v6'
     or v_declared_count is distinct from 5
     or v_component_count is distinct from 5
     or v_component_keys is distinct from
        array['canopy','current','invite_connection','my_pacs','native_connections']::text[] then
    return v_current || jsonb_build_object(
      'component_resolution','held',
      'reason_code','universal_runtime_component_contract_drift',
      'runtime_component_contract','c1me_env_runtime_components_v6',
      'declared_component_contract',v_declared_contract,
      'declared_component_count',v_declared_count,
      'resolved_universal_component_count',coalesce(v_component_count,0),
      'resolved_universal_component_keys',to_jsonb(coalesce(v_component_keys,array[]::text[])),
      'expected_universal_component_keys',jsonb_build_array(
        'canopy','current','invite_connection','my_pacs','native_connections'
      ),
      'relational_condition_contract','c3_six_relational_conditions_v1',
      'components','[]'::jsonb,
      'contextual_components','[]'::jsonb,
      'primitive_resolution','held',
      'primitive_contract','c1me_env_primitives_v5',
      'primitives','[]'::jsonb,
      'primitive_compatibility_deprecated',true,
      'frontend_invention_allowed',false
    );
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'component_key',primitive_key,
        'component_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config,
        'primitive_key',primitive_key,
        'primitive_class',primitive_class
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_components
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal_runtime_component','false')='true';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'component_key',primitive_key,
        'component_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config,
        'primitive_key',primitive_key,
        'primitive_class',primitive_class
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_contextual
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal_runtime_component','false')<>'true';

  return v_current || jsonb_build_object(
    'component_resolution','envpac_resolved',
    'runtime_component_contract','c1me_env_runtime_components_v6',
    'runtime_component_count',jsonb_array_length(v_components),
    'components',v_components,
    'contextual_component_count',jsonb_array_length(v_contextual),
    'contextual_components',v_contextual,
    'contextual_component_rule','active_nonuniversal_runtime_component_rows',
    'relational_condition_contract','c3_six_relational_conditions_v1',
    'relational_condition_count',6,
    'relational_condition_keys',jsonb_build_array(
      'identity','ownership','custody','verification','relationship','persistence'
    ),
    'free_resolution_source','envpac',
    'initiative_projection_rule','encountered_or_invited_initiative_envpac_only',
    'frontend_invention_allowed',false,

    -- Backward-compatible aliases only. Do not treat as semantic authority.
    'primitive_resolution','envpac_resolved',
    'primitive_contract','c1me_env_primitives_v5',
    'primitive_count',jsonb_array_length(v_components),
    'primitives',v_components,
    'primitive_compatibility_deprecated',true
  );
end
$$;

revoke all on function public.resolve_c1me_envpac_primitives_internal(text)
from public,anon,authenticated;
grant execute on function public.resolve_c1me_envpac_primitives_internal(text)
to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,
  created_at,updated_at
)
values
(
  'c3_six_relational_conditions_v1',
  'c3_field',
  'c3 Six Universal Relational Conditions v1',
  'active',
  'supabase/migrations/20261009005500_g04_six_runtime_components_semantic_amendment.sql',
  'operator_confirmed',
  jsonb_build_object(
    'operator','op044',
    'canonical_name','Six universal relational conditions',
    'condition_count',6,
    'condition_keys',jsonb_build_array(
      'identity','ownership','custody','verification','relationship','persistence'
    ),
    'condition_labels',jsonb_build_array(
      'Identity','Ownership','Custody','Verification','Relationship','Persistence'
    ),
    'universal_scope','governed relational condition grammar',
    'car_relation','CAR is the bounded 3-2-2 encounter in which relevant conditions are evidenced and resolved',
    'nug_relation','NUGs are bounded services composed from relevant condition combinations',
    'authority_rule','conditions describe and qualify relational evidence; they do not create standing by themselves',
    'current_rule','governed resolution determines whether evidence accrues against CURRENT, remains held, or supports a successor Current',
    'semantic_amendment_oar','oar2_amend_g04_six_runtime_components_chazz_20261008_015'
  ),
  'c3 Six Universal Relational Conditions v1',
  'Canonical universal relational conditions for governed relational operation',
  'active',
  'operator_confirmed_canonical_relational_condition_contract',
  jsonb_build_array(
    'process:c3_322_six_touchpoint_current_resolution_v1',
    'ledger:c3_ledger_0010',
    'encounter:c3_field_living_circuit_public_encounter_v1'
  ),
  'oar2',true,true,true,now(),now()
),
(
  'c1me_env_runtime_components_v6',
  'c3_field',
  'c1ME Universal Runtime Components v6',
  'active',
  'supabase/migrations/20261009005500_g04_six_runtime_components_semantic_amendment.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'runtime_component_contract','c1me_env_runtime_components_v6',
    'runtime_component_count',5,
    'runtime_component_keys',jsonb_build_array(
      'current','my_pacs','canopy','native_connections','invite_connection'
    ),
    'component_scope','universal personal My Env runtime surfaces/capabilities',
    'relational_condition_contract','c3_six_relational_conditions_v1',
    'contextual_component_rule','active nonuniversal runtime rows resolve separately',
    'legacy_primitive_contract','c1me_env_primitives_v5',
    'legacy_primitive_contract_deprecated',true,
    'semantic_amendment_oar','oar2_amend_g04_six_runtime_components_chazz_20261008_015'
  ),
  'c1ME Universal Runtime Components v6',
  'Canonical five universal personal My Env runtime components; distinct from the Six universal relational conditions',
  'active',
  'registered_runtime_component_contract',
  jsonb_build_array(
    'resolver:resolve_c1me_envpac_primitives_internal',
    'seed:seed_c1me_env_runtime_components_internal',
    'process:c3_six_relational_conditions_v1'
  ),
  'oar2',false,true,true,now(),now()
)
on conflict (process_key) do update
set title=excluded.title,
    status=excluded.status,
    source_path=excluded.source_path,
    authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_title=excluded.process_title,
    process_scope=excluded.process_scope,
    process_status=excluded.process_status,
    authority_level=excluded.authority_level,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

update public.system_process_registry
set status='superseded',
    process_status='retired',
    metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'superseded_by','c1me_env_runtime_components_v6',
      'semantic_correction','five items are universal My Env runtime components, not fundamental universal primitives',
      'legacy_contract_preserved_for_compatibility',true,
      'corrected_under','oar2_amend_g04_six_runtime_components_chazz_20261008_015'
    ),
    updated_at=now()
where process_key='c1me_envpac_primitives_v5';

update public.system_process_registry
set metadata=jsonb_set(
      coalesce(metadata,'{}'::jsonb),
      '{review_findings,contract_drift_normalization}',
      jsonb_build_object(
        'standing','amended_m2_g04',
        'canonical_runtime_component_contract','c1me_env_runtime_components_v6',
        'universal_runtime_component_count',5,
        'universal_runtime_component_keys',jsonb_build_array(
          'current','my_pacs','canopy','native_connections','invite_connection'
        ),
        'canonical_relational_condition_contract','c3_six_relational_conditions_v1',
        'universal_relational_condition_count',6,
        'universal_relational_condition_keys',jsonb_build_array(
          'identity','ownership','custody','verification','relationship','persistence'
        ),
        'contextual_components_separated',true,
        'historical_primitive_wording_preserved_as_corrected_lineage',true,
        'amended_under','oar2_amend_g04_six_runtime_components_chazz_20261008_015'
      ),
      true
    ),
    updated_at=now()
where process_key='c3_field_my_env_composition_maturity_v1';

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'canonical_rule',
        'CAR / 3-2-2 structures the bounded encounter; the Six are the universal relational conditions through which evidence is qualified; NUGs may provide bounded services; governed resolution determines what may accrue, remain held, or support a successor Current.',
      'car_role','bounded 3-2-2 encounter vehicle',
      'six_touchpoint_role','universal relational conditions and encounter evidence grammar',
      'six_relational_condition_contract','c3_six_relational_conditions_v1',
      'nug_role','bounded service composed from relevant relational-condition combinations; service capability creates no authority',
      'computational_loop',
        'Current_n + CAR/322 + Six-qualified evidence + bounded NUG services -> governed resolution -> no effect/HLD OR CURRENT accrual on Current_n OR successor Current_n+1 with corresponding CURRENT',
      'resolution_outputs',jsonb_build_array(
        'observation_no_authority',
        'HLD',
        'CURRENT_accrual_same_Current',
        'successor_Current_plus_CURRENT',
        'DNR_when_supported'
      ),
      'semantic_amendment_under','oar2_amend_g04_six_runtime_components_chazz_20261008_015',
      'implementation_state','semantic_contract_amended_runtime_admission_not_yet_implemented'
    ),
    updated_at=now()
where process_key='c3_322_six_touchpoint_current_resolution_v1';

commit;
