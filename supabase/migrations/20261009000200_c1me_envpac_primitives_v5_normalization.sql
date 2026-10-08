-- M2 G04 — normalize My Env primitive contract and separate contextual components.
-- Authority: oar2_normalize_my_env_contract_m2_chazz_20261008_013
-- Canonical contract: c1me_env_primitives_v5
--
-- Five universal runtime primitives:
--   current, my_pacs, canopy, native_connections, invite_connection
-- Other active EnvPAC runtime rows remain preserved as contextual_components.

begin;

create or replace function public.seed_c1me_envpac_primitives_internal(p_envpac_key text)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  v_envpac public.c3_envpac%rowtype;
  v_env public.c3_environment%rowtype;
  v_current_seeded boolean;
begin
  select * into v_envpac
  from public.c3_envpac
  where envpac_key=p_envpac_key
    and is_effective=true
    and standing='effective';

  if not found then
    return jsonb_build_object(
      'seeded',false,
      'reason_code','envpac_not_effective',
      'envpac_key',p_envpac_key,
      'primitive_contract','c1me_env_primitives_v5'
    );
  end if;

  select * into v_env
  from public.c3_environment
  where env_key=v_envpac.env_key
    and is_active=true;

  if not found
     or v_envpac.owner_subject_type<>'individual'
     or v_env.environment_class<>'c3me_individual_environment'
     or v_env.standing<>'c1_connected' then
    return jsonb_build_object(
      'seeded',false,
      'reason_code','not_persisted_individual_c1me',
      'envpac_key',p_envpac_key,
      'primitive_contract','c1me_env_primitives_v5'
    );
  end if;

  update public.c3_envpac_runtime_primitive
  set standing='retired',
      config=coalesce(config,'{}'::jsonb)||case
        when primitive_key='profile_pac' then jsonb_build_object('folded_into','my_pacs')
        else '{}'::jsonb
      end,
      updated_at=now()
  where envpac_key=p_envpac_key
    and primitive_key in ('personalize','ledger','profile_pac')
    and standing<>'retired';

  v_current_seeded := public.seed_current_runtime_primitive_internal(p_envpac_key);
  if not coalesce(v_current_seeded,false) then
    return jsonb_build_object(
      'seeded',false,
      'reason_code','current_primitive_unresolved',
      'envpac_key',p_envpac_key,
      'primitive_contract','c1me_env_primitives_v5'
    );
  end if;

  insert into public.c3_envpac_runtime_primitive(
    binding_key,envpac_key,primitive_key,primitive_class,display_label,
    renderer_key,runtime_endpoint,sort_order,standing,config
  )
  values
    (
      p_envpac_key||':primitive:my_pacs',p_envpac_key,'my_pacs',
      'personal_pac_custody_surface','My PACs','c1me.my_pacs',
      '/api/my-environment-pacs',10,'active',
      jsonb_build_object(
        'universal',true,
        'environment_local',true,
        'custody_class','personal_pac_custody',
        'approval_surface','my_pacs',
        'includes_profile_pac',true,
        'branch_system_pacs_excluded',true,
        'c2me_projection_rule','approved_plus_separate_owner_encounter_authorization',
        'envpac_is_resolution_only',true,
        'approval_implies_projection',false,
        'review_gate','personal_pac_review_gate_v1',
        'review_surface','my_pacs_preview',
        'approval_requires_current_review',true,
        'encounter_resolution_schema_ref','encounter_resolution_schema_v1',
        'encounter_resolution_profile_required_for_projection',true
      )
    ),
    (
      p_envpac_key||':primitive:canopy',p_envpac_key,'canopy',
      'environment_canopy','Canopy','c1me.canopy',
      '/api/my-environment-canopy',20,'active',
      jsonb_build_object(
        'universal',true,
        'environment_local',true,
        'external_surface_references',true,
        'registry_standing_created',false,
        'free_resolved_from_envpac',true
      )
    ),
    (
      p_envpac_key||':primitive:native_connections',p_envpac_key,'native_connections',
      'c3_native_connections','Connections','c1me.native_connections',
      '/api/my-environment-connections',30,'active',
      jsonb_build_object(
        'universal',true,
        'environment_local',true,
        'bilateral_relation_required',true,
        'thread_message_exchange_supported',true,
        'registry_object_created',false,
        'implementation_state','bilateral_relation_projection_live',
        'free_resolved_from_envpac',true
      )
    ),
    (
      p_envpac_key||':primitive:invite_connection',p_envpac_key,'invite_connection',
      'relational_passage','Invite Connection','c1me.invite_connection',
      '/api/my-environment-invite',40,'active',
      jsonb_build_object(
        'universal',true,
        'environment_local_origin',true,
        'personalized_invite',true,
        'optional_initiative_provenance',true,
        'acceptance_forms_connection',true,
        'share_reference_is_provenance_only',true,
        'registry_object_created_by_invite',false,
        'implementation_state','bilateral_invite_connection_live',
        'free_resolved_from_envpac',true
      )
    )
  on conflict (envpac_key,primitive_key) do update
    set primitive_class=excluded.primitive_class,
        display_label=excluded.display_label,
        renderer_key=excluded.renderer_key,
        runtime_endpoint=excluded.runtime_endpoint,
        sort_order=excluded.sort_order,
        standing=excluded.standing,
        config=excluded.config,
        updated_at=now();

  update public.c3_envpac
  set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
        'runtime_primitive_contract','c1me_env_primitives_v5',
        'runtime_primitive_count',5,
        'runtime_universal_primitive_count',5,
        'runtime_universal_primitive_keys',jsonb_build_array(
          'current','my_pacs','canopy','native_connections','invite_connection'
        ),
        'runtime_contextual_component_rule','active_nonuniversal_envpac_runtime_rows',
        'CURRENT_primitive','retained_relational_environment_token',
        'current_state_distinct_from_CURRENT',true,
        'my_pacs_surface',true,
        'profile_pac_folded_into_my_pacs',true,
        'personal_pac_approval_surface','my_pacs',
        'c2me_projection_rule','approved_plus_separate_owner_encounter_authorization',
        'ledger_boundary','c2_only',
        'thread_boundary','c1_relational_communication',
        'personalization_composed_into_profile_pac',true,
        'free_runtime_resolution_source','envpac'
      ),
      updated_at=now()
  where envpac_key=p_envpac_key;

  return jsonb_build_object(
    'seeded',true,
    'envpac_key',p_envpac_key,
    'primitive_contract','c1me_env_primitives_v5',
    'primitive_count',5,
    'primitive_keys',jsonb_build_array(
      'current','my_pacs','canopy','native_connections','invite_connection'
    )
  );
end
$$;

revoke all on function public.seed_c1me_envpac_primitives_internal(text)
from public,anon,authenticated;
grant execute on function public.seed_c1me_envpac_primitives_internal(text)
to service_role;

-- Normalize every effective personal EnvPAC through the canonical seed path.
select public.seed_c1me_envpac_primitives_internal(ep.envpac_key)
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
  v_universal_count integer;
  v_universal_keys text[];
  v_universal jsonb;
  v_contextual jsonb;
begin
  v_current := public.resolve_c1me_current_internal(p_relationship_key);

  if coalesce(v_current->>'resolution','') <> 'existing_c1' then
    return v_current || jsonb_build_object(
      'primitive_resolution','held',
      'primitive_contract','c1me_env_primitives_v5',
      'primitive_count',5,
      'contextual_component_count',0,
      'primitives','[]'::jsonb,
      'contextual_components','[]'::jsonb
    );
  end if;

  v_envpac_key := v_current->>'envpac_ref';

  select
    metadata->>'runtime_primitive_contract',
    nullif(metadata->>'runtime_primitive_count','')::integer
  into v_declared_contract,v_declared_count
  from public.c3_envpac
  where envpac_key=v_envpac_key
    and is_effective=true
    and standing='effective';

  select
    count(*) filter (where coalesce(config->>'universal','false')='true'),
    array_agg(primitive_key order by primitive_key)
      filter (where coalesce(config->>'universal','false')='true')
  into v_universal_count,v_universal_keys
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active';

  if v_declared_contract is distinct from 'c1me_env_primitives_v5'
     or v_declared_count is distinct from 5
     or v_universal_count is distinct from 5
     or v_universal_keys is distinct from
        array['canopy','current','invite_connection','my_pacs','native_connections']::text[] then
    return v_current || jsonb_build_object(
      'primitive_resolution','held',
      'reason_code','universal_primitive_contract_drift',
      'primitive_contract','c1me_env_primitives_v5',
      'declared_contract',v_declared_contract,
      'declared_primitive_count',v_declared_count,
      'resolved_universal_count',coalesce(v_universal_count,0),
      'resolved_universal_keys',to_jsonb(coalesce(v_universal_keys,array[]::text[])),
      'expected_universal_keys',jsonb_build_array(
        'canopy','current','invite_connection','my_pacs','native_connections'
      ),
      'primitives','[]'::jsonb,
      'contextual_components','[]'::jsonb,
      'frontend_invention_allowed',false
    );
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'primitive_key',primitive_key,
        'primitive_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_universal
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal','false')='true';

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'primitive_key',primitive_key,
        'primitive_class',primitive_class,
        'display_label',display_label,
        'renderer_key',renderer_key,
        'runtime_endpoint',runtime_endpoint,
        'sort_order',sort_order,
        'config',config
      ) order by sort_order,primitive_key
    ),
    '[]'::jsonb
  )
  into v_contextual
  from public.c3_envpac_runtime_primitive
  where envpac_key=v_envpac_key
    and standing='active'
    and coalesce(config->>'universal','false')<>'true';

  return v_current || jsonb_build_object(
    'primitive_resolution','envpac_resolved',
    'primitive_contract','c1me_env_primitives_v5',
    'primitive_count',jsonb_array_length(v_universal),
    'contextual_component_count',jsonb_array_length(v_contextual),
    'free_resolution_source','envpac',
    'primitives',v_universal,
    'contextual_components',v_contextual,
    'contextual_component_rule','active_nonuniversal_envpac_runtime_rows',
    'initiative_projection_rule','encountered_or_invited_initiative_envpac_only',
    'frontend_invention_allowed',false
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
values (
  'c1me_envpac_primitives_v5',
  'c3_field',
  'c1ME EnvPAC Runtime Primitives v5',
  'active',
  'supabase/migrations/20261009000200_c1me_envpac_primitives_v5_normalization.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'primitive_contract','c1me_env_primitives_v5',
    'primitive_count',5,
    'primitive_keys',jsonb_build_array(
      'current','my_pacs','canopy','native_connections','invite_connection'
    ),
    'contextual_component_rule','active_nonuniversal_envpac_runtime_rows',
    'universal_and_contextual_separated',true,
    'CURRENT_semantics','retained_relational_environment_token',
    'current_state_distinct_from_CURRENT',true,
    'frontend_may_invent_primitives',false,
    'initiative_projection','FREE from encountered/invited initiative EnvPAC; not universal personal My Env primitive',
    'supersedes_process','c1me_envpac_primitives_v1',
    'normalization_oar','oar2_normalize_my_env_contract_m2_chazz_20261008_013'
  ),
  'c1ME EnvPAC Runtime Primitives v5',
  'Canonical universal primitive contract and contextual runtime-component separation for personal My Env',
  'active',
  'registered_runtime_contract',
  jsonb_build_array(
    'resolver:resolve_c1me_envpac_primitives_internal',
    'seed:seed_c1me_envpac_primitives_internal',
    'process:c3_CURRENT_retained_relational_environment_token_v1'
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
      'superseded_by','c1me_envpac_primitives_v5',
      'superseded_reason','M2_contract_normalization',
      'superseded_under','oar2_normalize_my_env_contract_m2_chazz_20261008_013',
      'historical_lineage_preserved',true
    ),
    updated_at=now()
where process_key='c1me_envpac_primitives_v1';

update public.system_process_registry
set metadata=jsonb_set(
      coalesce(metadata,'{}'::jsonb),
      '{review_findings,contract_drift_normalization}',
      jsonb_build_object(
        'standing','normalized_m2_g04',
        'canonical_contract','c1me_env_primitives_v5',
        'universal_primitive_count',5,
        'universal_primitive_keys',jsonb_build_array(
          'current','my_pacs','canopy','native_connections','invite_connection'
        ),
        'contextual_components_separated',true,
        'historical_drift_finding_preserved',true,
        'normalized_under','oar2_normalize_my_env_contract_m2_chazz_20261008_013'
      ),
      true
    ),
    updated_at=now()
where process_key='c3_field_my_env_composition_maturity_v1';

commit;
