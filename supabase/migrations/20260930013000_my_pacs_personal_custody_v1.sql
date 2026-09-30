-- My PACs personal custody surface v1
-- Canonical rule:
--   personal owner PAC -> My PACs approval -> approved PAC eligible for C2ME_env projection
--   branch/system/initiative PAC -> governed system custody rail -> My Env projection only
-- ProfilePAC is nested inside My PACs and is no longer a top-level primitive.

update public.c3_pac p
set custodian_subject_type='individual',
    custodian_subject_key=pp.subject_key,
    custody_provider='c3_field',
    metadata=coalesce(p.metadata,'{}'::jsonb)
      || jsonb_build_object(
        'ownership_model',jsonb_build_object(
          'owner_subject_type','individual',
          'owner_subject_key',pp.subject_key,
          'ownership_class','personal_subject_pac'
        ),
        'custody_model',jsonb_build_object(
          'custody_class','personal_pac_custody',
          'custody_surface','my_pacs',
          'custodian_subject_type','individual',
          'custodian_subject_key',pp.subject_key,
          'envpac_role','resolution_only',
          'approval_surface','my_pacs',
          'c2me_role','approved_pac_projection_only'
        )
      ),
    updated_at=now()
from public.c3_profile_pac pp
where p.pac_key=pp.pac_key
  and p.pac_type='ProfilePAC'
  and pp.subject_type='individual';

update public.c3_pac
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'ownership_model',jsonb_build_object(
      'owner_subject_type','individual',
      'owner_subject_key','crs_93e901234ae044a396654ee80644b005',
      'ownership_class','personal_authored_asset_pac'
    ),
    'custody_model',coalesce(metadata->'custody_model','{}'::jsonb)||jsonb_build_object(
      'custody_class','personal_pac_custody',
      'custody_surface','my_pacs',
      'approval_surface','my_pacs',
      'c2me_role','approved_pac_projection_only'
    )
  ),
  updated_at=now()
where pac_key='run_aground_public_c3webpac_v1';

update public.c3_pac
set metadata=(coalesce(metadata,'{}'::jsonb)-'custody_rule'-'custody_state')
  || jsonb_build_object(
    'ownership_model',jsonb_build_object(
      'owner_subject_type','entity',
      'owner_subject_key','c3_community_partners_dao_llc',
      'owner_class','c3_community_partners_initiative'
    ),
    'custody_model',jsonb_build_object(
      'custody_class','governed_initiative_custody',
      'custodian_subject_type','individual',
      'custodian_subject_key','crs_93e901234ae044a396654ee80644b005',
      'operator_identifier','op044',
      'custody_control_surface','c3ops',
      'my_env_relation','registered_state_projection_only',
      'my_pacs_eligible',false,
      'c2me_role','approved_registered_state_projection'
    ),
    'my_env_projection_rule','registered_c3_community_partners_initiative_state_only'
  ),
  updated_at=now()
where pac_key in (
  '47pct_c1_connect_c3webpac_v1',
  'c3field_million_dollar_mission_landing_webpac_v1_3'
);

update public.c3_envpac_runtime_primitive
set standing='retired',
    config=coalesce(config,'{}'::jsonb)||jsonb_build_object(
      'folded_into','my_pacs',
      'boundary_correction','profile_pac_is_personal_pac_not_top_level_surface'
    ),
    updated_at=now()
where primitive_key='profile_pac' and standing='active';

insert into public.c3_envpac_runtime_primitive(
  binding_key,envpac_key,primitive_key,primitive_class,display_label,
  renderer_key,runtime_endpoint,sort_order,standing,config
)
select
  e.envpac_key||':primitive:my_pacs',
  e.envpac_key,
  'my_pacs',
  'personal_pac_custody_surface',
  'My PACs',
  'c1me.my_pacs',
  '/api/my-environment-pacs',
  10,
  'active',
  jsonb_build_object(
    'universal',true,
    'environment_local',true,
    'custody_class','personal_pac_custody',
    'approval_surface','my_pacs',
    'includes_profile_pac',true,
    'branch_system_pacs_excluded',true,
    'c2me_projection_rule','approved_pacs_only',
    'envpac_is_resolution_only',true
  )
from public.c3_envpac e
join public.c3_environment env on env.env_key=e.env_key
where e.owner_subject_type='individual'
  and e.is_effective=true
  and e.standing='effective'
  and env.environment_class='c3me_individual_environment'
  and env.is_active=true
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
      'runtime_primitive_contract','c1me_env_primitives_v4',
      'my_pacs_surface',true,
      'profile_pac_folded_into_my_pacs',true,
      'personal_pac_approval_surface','my_pacs',
      'c2me_projection_rule','approved_pacs_only'
    ),
    updated_at=now()
where owner_subject_type='individual'
  and is_effective=true
  and standing='effective';

create or replace function public.c3_pac_set_personal_disposition_v1(
  p_pac_key text,
  p_subject_key text,
  p_disposition text,
  p_note text default null
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_state text;
begin
  if p_disposition not in ('APPROVED','HLD') then
    return jsonb_build_object('standing','DNR','reason','unsupported_personal_disposition');
  end if;

  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key and is_effective=true
  for update;

  if not found then
    return jsonb_build_object('standing','DNR','reason','pac_unavailable');
  end if;

  if v_pac.custodian_subject_type is distinct from 'individual'
     or v_pac.custodian_subject_key is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody'
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_state:=case when p_disposition='APPROVED' then 'ACT' else 'HLD' end;

  update public.c3_pac
  set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'custody_approval',jsonb_build_object(
        'standing',p_disposition,
        'subject_key',p_subject_key,
        'context_class','personal_custody',
        'approval_surface','my_pacs',
        'note',nullif(btrim(coalesce(p_note,'')),''),
        'resolved_at',v_now,
        'c2_projection_eligible',p_disposition='APPROVED'
      )
    ),
    updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',v_state,
    'pac_key',p_pac_key,
    'disposition',p_disposition,
    'approval_surface','my_pacs',
    'c2_projection_eligible',p_disposition='APPROVED',
    'resolved_at',v_now
  );
end;
$$;

revoke all on function public.c3_pac_set_personal_disposition_v1(text,text,text,text)
from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_disposition_v1(text,text,text,text)
to service_role;

create or replace function public.seed_c1me_envpac_primitives_internal(p_envpac_key text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_envpac public.c3_envpac%rowtype; v_env public.c3_environment%rowtype;
begin
  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true and standing='effective';
  if not found then
    return jsonb_build_object('seeded',false,'reason_code','envpac_not_effective','envpac_key',p_envpac_key);
  end if;

  select * into v_env from public.c3_environment
  where env_key=v_envpac.env_key and is_active=true;

  if not found
     or v_envpac.owner_subject_type<>'individual'
     or v_env.environment_class<>'c3me_individual_environment'
     or v_env.standing<>'c1_connected' then
    return jsonb_build_object('seeded',false,'reason_code','not_persisted_individual_c1me','envpac_key',p_envpac_key);
  end if;

  update public.c3_envpac_runtime_primitive
  set standing='retired',
      config=coalesce(config,'{}'::jsonb)||case
        when primitive_key='profile_pac' then jsonb_build_object('folded_into','my_pacs')
        else '{}'::jsonb end,
      updated_at=now()
  where envpac_key=p_envpac_key
    and primitive_key in ('personalize','ledger','profile_pac')
    and standing<>'retired';

  insert into public.c3_envpac_runtime_primitive
    (binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,runtime_endpoint,sort_order,standing,config)
  values
    (p_envpac_key||':primitive:my_pacs',p_envpac_key,'my_pacs','personal_pac_custody_surface','My PACs','c1me.my_pacs','/api/my-environment-pacs',10,'active',
      jsonb_build_object('universal',true,'environment_local',true,'custody_class','personal_pac_custody','approval_surface','my_pacs','includes_profile_pac',true,'branch_system_pacs_excluded',true,'c2me_projection_rule','approved_pacs_only','envpac_is_resolution_only',true)),
    (p_envpac_key||':primitive:canopy',p_envpac_key,'canopy','environment_canopy','Canopy','c1me.canopy','/api/my-environment-canopy',20,'active',
      jsonb_build_object('universal',true,'environment_local',true,'external_surface_references',true,'registry_standing_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:native_connections',p_envpac_key,'native_connections','c3_native_connections','Connections','c1me.native_connections','/api/my-environment-connections',30,'active',
      jsonb_build_object('universal',true,'environment_local',true,'bilateral_relation_required',true,'thread_message_exchange_supported',true,'registry_object_created',false,'implementation_state','bilateral_relation_projection_live','free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:invite_connection',p_envpac_key,'invite_connection','relational_passage','Invite Connection','c1me.invite_connection','/api/my-environment-invite',40,'active',
      jsonb_build_object('universal',true,'environment_local_origin',true,'personalized_invite',true,'optional_initiative_provenance',true,'acceptance_forms_connection',true,'share_reference_is_provenance_only',true,'registry_object_created_by_invite',false,'implementation_state','bilateral_invite_connection_live','free_resolved_from_envpac',true))
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
    'runtime_primitive_contract','c1me_env_primitives_v4',
    'runtime_primitive_count',4,
    'my_pacs_surface',true,
    'profile_pac_folded_into_my_pacs',true,
    'personal_pac_approval_surface','my_pacs',
    'c2me_projection_rule','approved_pacs_only',
    'ledger_boundary','c2_only',
    'thread_boundary','c1_relational_communication',
    'personalization_composed_into_profile_pac',true,
    'free_runtime_resolution_source','envpac'
  ),updated_at=now()
  where envpac_key=p_envpac_key;

  return jsonb_build_object('seeded',true,'envpac_key',p_envpac_key,'primitive_contract','c1me_env_primitives_v4','primitive_count',4);
end $$;

revoke all on function public.seed_c1me_envpac_primitives_internal(text) from public,anon,authenticated;
grant execute on function public.seed_c1me_envpac_primitives_internal(text) to service_role;

-- Future ProfilePAC formation must create personal custody directly.
create or replace function public.form_profile_pac_v1_internal(
  p_envpac_key text,
  p_subject_type text,
  p_subject_key text,
  p_profile_class text,
  p_display_label text,
  p_visibility_scope text default 'private'::text
)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  v_envpac public.c3_envpac%rowtype;
  v_existing jsonb;
  v_pac_key text;
  v_profile_key text;
  v_eval jsonb;
  v_source_authority text;
begin
  if p_envpac_key is null or p_subject_type is null or p_subject_key is null then
    raise exception 'profile_identity_required';
  end if;

  select * into v_envpac
  from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true;
  if not found then raise exception 'envpac_not_effective'; end if;

  if v_envpac.owner_subject_type<>p_subject_type or v_envpac.owner_subject_key<>p_subject_key then
    raise exception 'profile_subject_not_envpac_owner';
  end if;

  if p_profile_class not in ('individual','organization','initiative','project','place') then
    raise exception 'profile_class_invalid';
  end if;
  if p_subject_type='individual' and p_profile_class<>'individual' then
    raise exception 'profile_class_subject_mismatch';
  end if;
  if p_subject_type<>'individual' and p_profile_class='individual' then
    raise exception 'profile_class_subject_mismatch';
  end if;

  if p_display_label is null or length(btrim(p_display_label))<1 or length(btrim(p_display_label))>160 then
    raise exception 'display_label_invalid';
  end if;
  if p_visibility_scope not in ('private','environment','relational','public') then
    raise exception 'visibility_scope_invalid';
  end if;

  select source_authority into v_source_authority
  from public.c3_pac_type_contract
  where contract_key='pac_contract_profilepac_v1'
    and pac_type='ProfilePAC'
    and standing='active'
    and is_effective=true;

  if v_source_authority is null then raise exception 'profile_contract_unavailable'; end if;

  v_existing:=public.resolve_profile_pac_v1_internal(p_envpac_key,p_subject_type,p_subject_key);
  if coalesce(v_existing->>'standing','')<>'profile_not_formed' then
    return jsonb_build_object('ok',true,'created',false,'truth',v_existing);
  end if;

  v_profile_key:='profile_'||substr(md5(p_envpac_key||':'||p_subject_type||':'||p_subject_key),1,24);
  v_pac_key:='profile_pac_'||substr(md5(p_envpac_key||':'||p_subject_type||':'||p_subject_key),1,24)||'_v1';

  insert into public.c3_pac (
    pac_key,envpac_key,pac_type,version,standing,custody_uri,source_authority,is_effective,metadata,
    contract_key,architecture_version,custodian_subject_type,custodian_subject_key,custody_provider,
    authority_effect,release_state,execution_authority_state,formation_state,effective_at,return_evidence_required
  ) values (
    v_pac_key,p_envpac_key,'ProfilePAC','v1','registered_complete_profile_ready',
    'c3://profile-pac/'||v_profile_key||'/v1',
    v_source_authority,true,
    jsonb_build_object(
      'formation_route','oye_profilepac_v1',
      'profile_does_not_create_authority',true,
      'subject_values_explicitly_submitted',true,
      'ownership_model',jsonb_build_object(
        'owner_subject_type',p_subject_type,
        'owner_subject_key',p_subject_key,
        'ownership_class','personal_subject_pac'
      ),
      'custody_model',jsonb_build_object(
        'custody_class','personal_pac_custody',
        'custody_surface','my_pacs',
        'custodian_subject_type',p_subject_type,
        'custodian_subject_key',p_subject_key,
        'envpac_role','resolution_only',
        'approval_surface','my_pacs',
        'c2me_role','approved_pac_projection_only'
      )
    ),
    'pac_contract_profilepac_v1','pac_v1',
    p_subject_type,p_subject_key,'c3_field',
    'none',p_visibility_scope,'none','formed',now(),false
  );

  insert into public.c3_profile_pac (
    pac_key,profile_key,subject_type,subject_key,profile_class,display_label,visibility_scope,metadata
  ) values (
    v_pac_key,v_profile_key,p_subject_type,p_subject_key,p_profile_class,btrim(p_display_label),p_visibility_scope,
    '{"authority_effect":"none","source":"oye_explicit_intake"}'::jsonb
  );

  v_eval:=public.c3_pac_evaluate(v_pac_key);
  if coalesce(v_eval->>'completeness_state','held')<>'pass' then
    raise exception 'profile_pac_incomplete';
  end if;

  return jsonb_build_object('ok',true,'created',true,'truth',public.c3_profile_pac_truth(v_pac_key));
end;
$$;

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'primitive_contract','c1me_env_primitives_v4',
      'primitive_count',4,
      'primitive_keys',jsonb_build_array('my_pacs','canopy','native_connections','invite_connection'),
      'profile_pac_surface','nested_in_my_pacs',
      'personal_pac_approval_surface','my_pacs',
      'c2me_projection_rule','approved_pacs_only',
      'branch_system_pacs_excluded_from_my_pacs',true
    ),
    updated_at=now()
where process_key='c1me_envpac_primitives_v1';
