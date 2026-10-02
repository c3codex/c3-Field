-- OAR2 oar2_nugs_runtime_20261001_001 / nugs_runtime_primitive_codex_001.
-- New internal rails only. No PAC, CanCom, Calendar, Directory or EnvPAC mutation.
-- A binding records a proven relation; it cannot grant capability or authority.
create table public.c3ops_nug_binding (
  nug_key text primary key check (length(btrim(nug_key)) > 0),
  service_name text not null,
  standing text not null check (standing in ('candidate','active','held','revoked')),
  spec jsonb not null check (jsonb_typeof(spec) = 'object'),
  missing_predicates jsonb not null default '[]' check (jsonb_typeof(missing_predicates) = 'array'),
  source_oar_key text not null,
  created_at timestamptz not null default now()
);
create table public.c3ops_nug_occurrence (
  occurrence_key text primary key,
  nug_key text not null references public.c3ops_nug_binding(nug_key),
  execution_instance text not null,
  current_state_key text not null references public.c3_current_state(current_state_key),
  resolution jsonb not null,
  result_sha256 text not null check (result_sha256 ~ '^[0-9a-f]{64}$'),
  result_standing text not null,
  effect_class text not null,
  created_at timestamptz not null default now()
);
alter table public.c3ops_nug_binding enable row level security;
alter table public.c3ops_nug_binding force row level security;
alter table public.c3ops_nug_occurrence enable row level security;
alter table public.c3ops_nug_occurrence force row level security;
revoke all on public.c3ops_nug_binding, public.c3ops_nug_occurrence from public, anon, authenticated;
grant select, insert on public.c3ops_nug_binding, public.c3ops_nug_occurrence to service_role;

-- The identical tuple must be enumerated independently in the EnvPAC capability
-- and in the operator-confirmed OAR's automation permissions. Strings and caller
-- supplied booleans are never accepted as authority/effect evidence.
create function public.preflight_c3ops_nug_spec_v1(p_nug_key text, p_spec jsonb)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare
  v_missing text[] := '{}';
  v_cap public.c3_envpac_capability_grant%rowtype;
  v_q public.system_oar_queue%rowtype;
  v_context public.c3ops_cancom_context_binding%rowtype;
  v_fn oid; v_tuple jsonb; v_effect jsonb;
begin
  if jsonb_typeof(p_spec) is distinct from 'object' or nullif(btrim(p_nug_key),'') is null then
    return jsonb_build_object('standing','HLD','missing_predicates',jsonb_build_array('binding_shape'));
  end if;
  if not exists(select 1 from public.system_process_registry where
    process_key='c3ops_nugs_native_universal_general_services_v1' and process_status='active') then
    v_missing := array_append(v_missing,'service');
  end if;
  if not exists(select 1 from public.system_process_registry where
    process_key=p_spec->>'native_process_key' and process_status='active') then
    v_missing := array_append(v_missing,'native_process');
  end if;
  -- Minimum adapter ABI: existing native public function(jsonb) -> jsonb.
  -- Pin the catalog definition so a changed body requires renewed admission.
  if coalesce(p_spec->>'native_function_ref','') ~ '^public\.[a-z][a-z0-9_]*\(jsonb\)$' then
    v_fn := to_regprocedure(p_spec->>'native_function_ref');
  end if;
  if v_fn is null or not exists(select 1 from pg_catalog.pg_proc where oid=v_fn
    and prorettype='jsonb'::regtype and not prosecdef and not proretset
    and encode(extensions.digest(pg_catalog.pg_get_functiondef(oid),'sha256'),'hex')=p_spec->>'native_function_sha256') then
    v_missing := array_append(v_missing,'native_function');
  end if;
  if not exists(select 1 from public.c3_environment where env_key=p_spec->>'origin_env_key' and is_active)
    or not exists(select 1 from public.c3_environment where env_key=p_spec->>'env_key' and is_active)
    or p_spec->>'origin_env_key' is not distinct from p_spec->>'env_key'
    or not exists(select 1 from public.c3_envpac where envpac_key=p_spec->>'envpac_key'
      and env_key=p_spec->>'env_key' and is_effective)
    or not exists(select 1 from public.c3_current_state where current_state_key=p_spec->>'current_state_key'
      and env_key=p_spec->>'env_key' and is_current and superseded_at is null) then
    v_missing := array_append(v_missing,'environment_current');
  end if;
  v_tuple := jsonb_build_object('nug_key',p_nug_key,'native_process_key',p_spec->>'native_process_key',
    'native_function_ref',p_spec->>'native_function_ref','native_function_sha256',p_spec->>'native_function_sha256',
    'origin_env_key',p_spec->>'origin_env_key','env_key',p_spec->>'env_key',
    'envpac_key',p_spec->>'envpac_key','current_state_key',p_spec->>'current_state_key',
    'executor_ref',p_spec->>'executor_ref','execution_instance',p_spec->>'execution_instance',
    'context_binding_key',p_spec->>'context_binding_key','adapter_class',p_spec->>'adapter_class',
    'adapter_process_key',p_spec->>'adapter_process_key','effect_class',p_spec->>'effect_class',
    'native_input',p_spec->'native_input','native_result_standing',p_spec->>'native_result_standing',
    'evidence_return_relation',p_spec->>'evidence_return_relation');
  select * into v_cap from public.c3_envpac_capability_grant where capability_key=p_spec->>'capability_ref';
  if v_cap.standing is distinct from 'active' or v_cap.envpac_key is distinct from p_spec->>'envpac_key'
    or not coalesce(v_cap.scope->'allowed_actions' ? 'call_nug',false)
    or not coalesce(v_cap.scope->'nug_bindings' @> jsonb_build_array(v_tuple),false) then
    v_missing := array_append(v_missing,'capability');
  end if;
  select * into v_q from public.system_oar_queue where oar_key=p_spec->>'authority_oar_key'
    and scope_key=p_spec->>'execution_instance';
  if (select count(*) from public.system_oar_queue where oar_key=p_spec->>'authority_oar_key'
      and scope_key=p_spec->>'execution_instance') <> 1
    or v_q.queue_status is null or v_q.queue_status not in ('approved_for_execution','executing')
    or v_q.operator_confirmed_at is null or v_q.preflight_status is distinct from 'passed'
    or v_q.automation_permissions->>'executor_ref' is distinct from p_spec->>'executor_ref'
    or v_q.automation_permissions->>'capability_ref' is distinct from v_cap.capability_key
    or not coalesce(v_q.automation_permissions->'nug_bindings' @> jsonb_build_array(v_tuple),false) then
    v_missing := array_append(v_missing,'authority');
  end if;
  select * into v_context from public.c3ops_cancom_context_binding
    where binding_key=p_spec->>'context_binding_key';
  if v_context.standing is distinct from 'active' or v_context.operator_confirmed_at is null
    or v_context.origin_environment is distinct from p_spec->>'origin_env_key'
    or v_context.receiving_environment is distinct from p_spec->>'env_key'
    or v_context.resolved_actor is distinct from p_spec->>'executor_ref'
    or v_context.capability_ref is distinct from v_cap.capability_key
    or v_context.source_authority_ref is distinct from 'registry://cancom/oar2/'||(p_spec->>'authority_oar_key')
    or v_context.transport_adapter is distinct from 'registry_cancom_internal'
    or v_context.payload_custody_class not in ('registry_custody_ref','none')
    or jsonb_typeof(p_spec->'native_input') is distinct from 'object'
    or nullif(p_spec->>'native_result_standing','') is null
    or p_spec->>'native_result_standing' in ('HLD','held','DNR') then
    v_missing := array_append(v_missing,'context');
  end if;
  if p_spec->>'adapter_class' = 'direct_native' then
    if p_spec->>'effect_class' is distinct from 'none'
      or not exists(select 1 from pg_catalog.pg_proc where oid=v_fn and provolatile in ('s','i'))
      or nullif(p_spec->>'adapter_process_key','') is not null then
      v_missing := array_append(v_missing,'adapter_boundary');
    end if;
  elsif p_spec->>'adapter_class' = 'registered_adapter' then
    if not exists(select 1 from public.system_process_registry where
      process_key=p_spec->>'adapter_process_key' and process_status='active'
      and metadata->>'infrastructure_class' in ('worker','provider_adapter','runtime_adapter')
      and metadata->'native_function_refs' ? (p_spec->>'native_function_ref')) then
      v_missing := array_append(v_missing,'registered_adapter');
    end if;
  else
    v_missing := array_append(v_missing,'adapter_class');
  end if;
  if nullif(p_spec->>'effect_class','') is null then
    v_missing := array_append(v_missing,'effect_preflight');
  elsif p_spec->>'effect_class' <> 'none' then
    v_effect := jsonb_build_object('binding',v_tuple,'effect_class',p_spec->>'effect_class',
      'current_state_key',p_spec->>'current_state_key','context_binding_key',p_spec->>'context_binding_key');
    if not coalesce(v_cap.scope->'effect_preflights' @> jsonb_build_array(v_effect),false)
      or not coalesce(v_q.automation_permissions->'effect_preflights' @> jsonb_build_array(v_effect),false) then
      v_missing := array_append(v_missing,'effect_preflight');
    end if;
  end if;
  if p_spec->>'evidence_return_relation' is distinct from
    'registry://c3_current_evidence_ref/'||(p_spec->>'current_state_key') then
    v_missing := array_append(v_missing,'evidence_return');
  end if;
  if not exists(select 1 from public.system_process_registry where process_key='aop_006_free_binding'
    and process_status='active') then v_missing := array_append(v_missing,'free_resolver'); end if;
  return jsonb_build_object('standing',case when cardinality(v_missing)=0 then 'resolved_for_nug' else 'HLD' end,
    'missing_predicates',to_jsonb(v_missing),'nug_key',p_nug_key,'binding',v_tuple,
    'authority_oar_key',p_spec->>'authority_oar_key','capability_ref',p_spec->>'capability_ref',
    'authority_created',false,'custody_transferred',false,'ownership_transferred',false);
end;
$$;

create function public.register_c3ops_nug_binding_v1(p_nug_key text,p_service_name text,p_spec jsonb)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare v_result jsonb;
begin
  if nullif(btrim(p_service_name),'') is null then return jsonb_build_object('standing','HLD','reason','service_name_missing'); end if;
  v_result := public.preflight_c3ops_nug_spec_v1(p_nug_key,p_spec);
  if v_result->>'standing' is distinct from 'resolved_for_nug' then return v_result; end if;
  if exists(select 1 from public.c3ops_nug_binding where nug_key=p_nug_key) then
    return jsonb_build_object('standing','HLD','reason','binding_already_registered');
  end if;
  insert into public.c3ops_nug_binding(nug_key,service_name,standing,spec,source_oar_key)
    values(p_nug_key,p_service_name,'active',p_spec,p_spec->>'authority_oar_key');
  return v_result || jsonb_build_object('standing','registered');
end;
$$;

create function public.resolve_c3ops_nug_v1(p_request jsonb)
returns jsonb language plpgsql stable security invoker set search_path = '' as $$
declare v_b public.c3ops_nug_binding%rowtype; v_field text;
begin
  if jsonb_typeof(p_request) is distinct from 'object' then
    return jsonb_build_object('standing','HLD','missing_predicates',jsonb_build_array('request_shape')); end if;
  select * into v_b from public.c3ops_nug_binding where nug_key=p_request->>'nug_key';
  if not found or v_b.standing<>'active' then
    return jsonb_build_object('standing','HLD','missing_predicates',jsonb_build_array('service_binding'),
      'candidate_missing_predicates',coalesce(v_b.missing_predicates,'[]'::jsonb)); end if;
  foreach v_field in array array['origin_env_key','env_key','envpac_key','current_state_key',
    'executor_ref','execution_instance','capability_ref','authority_oar_key','context_binding_key'] loop
    if nullif(p_request->>v_field,'') is null or p_request->>v_field is distinct from v_b.spec->>v_field then
      return jsonb_build_object('standing','HLD','missing_predicates',jsonb_build_array(v_field)); end if;
  end loop;
  return public.preflight_c3ops_nug_spec_v1(v_b.nug_key,v_b.spec);
end;
$$;

-- FREE dispatch is server-only. Fixed admitted input; no arbitrary RPC name or
-- caller argument passthrough. Native read + occurrence + Current evidence are
-- one transaction. External adapters are described/preflighted, never executed
-- by this OAR's caller. A later bounded effect passage must supply that caller.
create function public.call_c3ops_nug_native_v1(p_request jsonb,p_occurrence_key text)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare v_resolution jsonb; v_b public.c3ops_nug_binding%rowtype; v_result jsonb; v_hash text; v_fn text; v_occurrence jsonb;
begin
  if nullif(btrim(p_occurrence_key),'') is null then
    return jsonb_build_object('standing','HLD','reason','occurrence_key_missing'); end if;
  -- Serialize replay for the exact occurrence before invoking the native function.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_occurrence_key,0));
  if exists(select 1 from public.c3ops_nug_occurrence where occurrence_key=p_occurrence_key) then
    return jsonb_build_object('standing','HLD','reason','occurrence_already_returned'); end if;
  select * into v_b from public.c3ops_nug_binding where nug_key=p_request->>'nug_key' for share;
  v_resolution := public.resolve_c3ops_nug_v1(p_request);
  if v_resolution->>'standing' is distinct from 'resolved_for_nug' then return v_resolution; end if;
  if v_b.spec->>'adapter_class' is distinct from 'direct_native' or v_b.spec->>'effect_class' is distinct from 'none' then
    return jsonb_build_object('standing','HLD','reason','bounded_effect_caller_required'); end if;
  perform 1 from public.c3_current_state where current_state_key=v_b.spec->>'current_state_key' for share;
  perform 1 from public.c3_envpac_capability_grant where capability_key=v_b.spec->>'capability_ref' for share;
  perform 1 from public.system_oar_queue where oar_key=v_b.spec->>'authority_oar_key'
    and scope_key=v_b.spec->>'execution_instance' for share;
  perform 1 from public.c3ops_cancom_context_binding where binding_key=v_b.spec->>'context_binding_key' for share;
  v_resolution := public.resolve_c3ops_nug_v1(p_request);
  if v_resolution->>'standing' is distinct from 'resolved_for_nug' then return v_resolution; end if;
  v_fn := split_part(split_part(v_b.spec->>'native_function_ref','(',1),'.',2);
  execute format('select public.%I($1)',v_fn) into v_result using v_b.spec->'native_input';
  if jsonb_typeof(v_result) is distinct from 'object'
    or v_result->>'standing' is distinct from v_b.spec->>'native_result_standing' then
    return jsonb_build_object('standing','HLD','reason','native_function_held'); end if;
  v_hash := encode(extensions.digest(v_result::text,'sha256'),'hex');
  insert into public.c3ops_nug_occurrence(occurrence_key,nug_key,execution_instance,current_state_key,
    resolution,result_sha256,result_standing,effect_class)
    values(p_occurrence_key,v_b.nug_key,p_request->>'execution_instance',p_request->>'current_state_key',
      v_resolution,v_hash,v_result->>'standing','none')
    returning to_jsonb(c3ops_nug_occurrence.*) into v_occurrence;
  insert into public.c3_current_evidence_ref(current_evidence_ref_key,current_state_key,evidence_key,evidence_class,
    content_hash,hash_algorithm,authoritative_custody_type,authoritative_custody_provider,
    authoritative_custody_identifier,authoritative_custody_location,evidence_standing,source_execution_instance_id,metadata,attested_by)
    values('nug:'||p_occurrence_key,p_request->>'current_state_key',p_occurrence_key,'nug_occurrence',
      encode(extensions.digest(v_occurrence::text,'sha256'),'hex'),'sha256','registry','supabase',p_occurrence_key,'registry://c3ops_nug_occurrence/'||p_occurrence_key,
      'observed',p_request->>'execution_instance',jsonb_build_object('nug_key',v_b.nug_key,
        'effect_class','none','serialization_basis','postgres_jsonb_text_utf8_sha256',
        'current_reresolution_required',true,'custody_transferred',false),p_request->>'executor_ref');
  return jsonb_build_object('standing','occurrence_returned','occurrence_key',p_occurrence_key,
    'current_state_key',p_request->>'current_state_key','evidence_return_relation',v_b.spec->>'evidence_return_relation',
    'current_reresolution_required',true,'external_effects',0,'custody_transferred',false,'result',v_result);
end;
$$;
revoke all on function public.preflight_c3ops_nug_spec_v1(text,jsonb),
  public.register_c3ops_nug_binding_v1(text,text,jsonb),public.resolve_c3ops_nug_v1(jsonb),
  public.call_c3ops_nug_native_v1(jsonb,text) from public,anon,authenticated;
grant execute on function public.preflight_c3ops_nug_spec_v1(text,jsonb),
  public.register_c3ops_nug_binding_v1(text,text,jsonb),public.resolve_c3ops_nug_v1(jsonb),
  public.call_c3ops_nug_native_v1(jsonb,text) to service_role;

-- Documentary candidates only; no production capability/context/authority is
-- fabricated and none of the existing services is automatically reclassified.
insert into public.c3ops_nug_binding(nug_key,service_name,standing,spec,missing_predicates,source_oar_key) values
 ('candidate_cancom','CanCom','candidate','{}','["native_function_binding","environment_current","capability","authority","context","effect_preflight"]','oar2_nugs_runtime_20261001_001'),
 ('candidate_calendar','Calendar','candidate','{}','["native_function_binding","environment_current","capability","authority","context","effect_preflight"]','oar2_nugs_runtime_20261001_001'),
 ('candidate_directory','Directory','candidate','{}','["native_function_binding","environment_current","capability","authority","context","effect_preflight"]','oar2_nugs_runtime_20261001_001');
