create or replace function public.resolve_c1me_operator_context_internal(p_relationship_key text)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_current jsonb;
  v_notchazz_ok boolean := false;
  v_rows jsonb := '[]'::jsonb;
  v_count integer := 0;
begin
  if btrim(coalesce(p_relationship_key,''))='' then
    raise exception 'relationship_key_required' using errcode='22023';
  end if;

  v_current := public.resolve_c1me_current_internal(p_relationship_key);

  if coalesce(v_current->>'resolution','') <> 'existing_c1' then
    return jsonb_build_object(
      'resolution','operator_context_held',
      'reason_code','personal_environment_unresolved',
      'relationship_ref',p_relationship_key,
      'operators','[]'::jsonb
    );
  end if;

  select exists(
    select 1
    from public.system_process_registry p
    join public.c3_ai_action_boundary b
      on b.boundary_key='measures_registry_ai_action_boundary'
     and b.system_key='measures_registry'
     and b.is_active=true
     and b.boundary_state='ready'
     and coalesce(b.authority_allowed,false)=false
     and coalesce(b.mutation_allowed,false)=false
     and coalesce(b.execution_allowed,false)=false
     and coalesce(b.proposal_allowed,false)=true
     and coalesce(b.requires_evidence,false)=true
     and coalesce(b.requires_trace,false)=true
    where p.process_key='c1_relational_notchazz_encounter_boundary_v1'
      and p.process_status='active'
      and p.authority_state='operator_confirmed_registered'
  ) into v_notchazz_ok;

  if not v_notchazz_ok then
    return jsonb_build_object(
      'resolution','operator_context_held',
      'reason_code','notchazz_boundary_unavailable',
      'relationship_ref',p_relationship_key,
      'env_key',v_current->>'env_key',
      'envpac_ref',v_current->>'envpac_ref',
      'operators','[]'::jsonb
    );
  end if;

  with resolved as (
    select distinct
      cic.continuity_binding_key,
      cic.named_individual_key,
      niob.relation_key as carrier_binding_key,
      os.operator_standing_key,
      os.operator_identifier,
      os.scope as operator_scope,
      eob.environment_operator_binding_key,
      eob.operator_role,
      eob.scope_class,
      eob.c3me_standing_required,
      eob.minimum_c3me_standing
    from public.c3_named_individual_crs_binding cic
    join public.c3_named_individual_operator_binding niob
      on niob.named_individual_key=cic.named_individual_key
     and niob.standing='active'
    join public.c3_operator_standing os
      on os.operator_standing_key=niob.operator_standing_key
     and os.standing='active'
    join public.c3_environment_operator_binding eob
      on eob.operator_standing_key=os.operator_standing_key
     and eob.carrier_binding_key=niob.relation_key
     and eob.binding_standing='active'
     and eob.env_key=v_current->>'env_key'
     and eob.envpac_key=v_current->>'envpac_ref'
    where cic.relationship_key=p_relationship_key
      and cic.binding_standing='active'
      and cic.binding_class='governed_identity_continuity'
  )
  select
    coalesce(jsonb_agg(jsonb_build_object(
      'continuity_binding_key',continuity_binding_key,
      'named_individual_key',named_individual_key,
      'carrier_binding_key',carrier_binding_key,
      'operator_standing_key',operator_standing_key,
      'operator_identifier',operator_identifier,
      'operator_scope',operator_scope,
      'environment_operator_binding_key',environment_operator_binding_key,
      'operator_role',operator_role,
      'scope_class',scope_class,
      'c3me_standing_required',c3me_standing_required,
      'minimum_c3me_standing',minimum_c3me_standing,
      'boundary','notchazz_pass'
    ) order by operator_standing_key),'[]'::jsonb),
    count(*)
  into v_rows,v_count
  from resolved;

  return jsonb_build_object(
    'resolution',case when v_count>0 then 'operator_context_resolved' else 'operator_context_none' end,
    'reason_code',case when v_count>0 then 'governed_operator_binding_resolved' else 'no_active_environment_operator_binding' end,
    'relationship_ref',p_relationship_key,
    'env_key',v_current->>'env_key',
    'envpac_ref',v_current->>'envpac_ref',
    'current_ref',v_current->>'current_ref',
    'operator_count',v_count,
    'operators',v_rows,
    'creates_standing',false,
    'creates_current',false,
    'creates_environment',false,
    'creates_envpac',false
  );
end;
$function$;

revoke all on function public.resolve_c1me_operator_context_internal(text) from public, anon, authenticated;
grant execute on function public.resolve_c1me_operator_context_internal(text) to service_role;

insert into public.system_process_registry (
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
) values (
  'c1me_operator_context_resolver_v1',
  'c3_field',
  'c1ME Operator Context Resolver',
  'active',
  'Registry:c3_environment_operator_binding_v1+c3_named_individual_crs_continuity_binding_v1',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'standing','registered_bounded_resolver',
    'authentication_source','existing_owner_environment_session',
    'identity_resolution','named_individual_crs_continuity_binding',
    'operator_resolution','environment_operator_binding',
    'notchazz_boundary_required',true,
    'operator_context_augments_owner_session',true,
    'operator_credential_does_not_replace_identity',true,
    'creates_standing',false,
    'creates_current',false,
    'creates_environment',false,
    'creates_envpac',false,
    'creates_operator_standing',false
  ),
  'c1ME Operator Context Resolver',
  'Resolve active operator standing carried by the named individual continuously bound to an authenticated CRS owner, for the exact admitted personal environment and EnvPAC.',
  'active',
  'bounded_runtime_resolution',
  jsonb_build_object(
    'bindings',jsonb_build_array(
      'c3_named_individual_crs_continuity_binding_v1',
      'c3_environment_operator_binding_v1',
      'c1_relational_notchazz_encounter_boundary_v1'
    )
  ),
  'oar2',
  true,
  true,
  false
)
on conflict (process_key) do update
set authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_scope=excluded.process_scope,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

insert into public.system_process_registry (
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
) values (
  'c3field_pages_deployment_identity_v1',
  'deployment_control',
  'c3 Field Pages Production Deployment Identity',
  'active',
  'Drive:1Y80gvOm1lSCNXz0Gu1ChXoXEsaN8kKwM',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'deployment_identity',jsonb_build_object(
      'system_key','c3_field',
      'repository','c3codex/c3-Field',
      'production_branch','c3field',
      'deployment_project','c3-field',
      'pages_domain','c3-field-5qx.pages.dev',
      'primary_hostname','c3field.online',
      'build_command','npm run build:c3field',
      'output_directory','dist',
      'deployment_mode','cloudflare_pages',
      'deploy_command_allowed',false
    ),
    'custom_domain_expectations',jsonb_build_array(
      'c3field.online',
      'www.c3field.online',
      'c3ops.c3field.online',
      'mdm.c3field.online',
      'my.c3field.online'
    ),
    'my_environment_domain_state','operator_reported_cloudflare_activation_external_verification_pending',
    'production_evidence_drive_id','1Y80gvOm1lSCNXz0Gu1ChXoXEsaN8kKwM',
    'production_branch_correction_drive_id','16vCQ3DbB9Go7Vsxc76_6Cr-S-Q3eB2pRTGhdRk4i3_0',
    'release_authority_effect','none'
  ),
  'c3 Field Pages Production Deployment Identity',
  'Production deployment tuple for the shared c3 Field Cloudflare Pages project; project deployment does not itself release held surfaces.',
  'active',
  'registered_deployment_identity',
  jsonb_build_object(
    'production_evidence_drive_id','1Y80gvOm1lSCNXz0Gu1ChXoXEsaN8kKwM',
    'production_branch_correction_drive_id','16vCQ3DbB9Go7Vsxc76_6Cr-S-Q3eB2pRTGhdRk4i3_0'
  ),
  'both',
  true,
  true,
  true
)
on conflict (process_key) do update
set authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_scope=excluded.process_scope,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

update public.system_process_registry
set metadata = metadata || jsonb_build_object(
      'operator_context_resolver','c1me_operator_context_resolver_v1',
      'operator_context_augments_owner_session',true,
      'deployment_identity_process_key','c3field_pages_deployment_identity_v1',
      'deployment_project','c3-field',
      'production_branch','c3field',
      'build_command','npm run build:c3field',
      'output_directory','dist',
      'deployment_mode','cloudflare_pages'
    ),
    updated_at=now()
where process_key='c3field_my_environment_return_surface_v1';
