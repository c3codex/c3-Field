begin;

-- c1ME runtime composition v2:
-- Personalize is no longer a top-level primitive. Its persisted presentation
-- state remains in c3_envpac_presentation and is composed into Profile-PAC.

create or replace function public.seed_c1me_envpac_primitives_internal(p_envpac_key text)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare v_envpac public.c3_envpac%rowtype; v_env public.c3_environment%rowtype;
begin
  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true and standing='effective';
  if not found then return jsonb_build_object('seeded',false,'reason_code','envpac_not_effective','envpac_key',p_envpac_key); end if;

  select * into v_env from public.c3_environment where env_key=v_envpac.env_key and is_active=true;
  if not found or v_envpac.owner_subject_type<>'individual'
     or v_env.environment_class<>'c3me_individual_environment'
     or v_env.standing<>'c1_connected' then
    return jsonb_build_object('seeded',false,'reason_code','not_persisted_individual_c1me','envpac_key',p_envpac_key);
  end if;

  update public.c3_envpac_runtime_primitive
  set standing='retired',updated_at=now()
  where envpac_key=p_envpac_key and primitive_key='personalize' and standing<>'retired';

  insert into public.c3_envpac_runtime_primitive
    (binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,runtime_endpoint,sort_order,standing,config)
  values
    (p_envpac_key||':primitive:profile_pac',p_envpac_key,'profile_pac','participant_formable_pac','Profile-PAC','c1me.profile_pac','/api/my-environment-profile',10,'active',
      jsonb_build_object('universal',true,'pac_type','ProfilePAC','contract_key','pac_contract_profilepac_v1','formation_optional',true,'currently_only_participant_formable_content_pac',true,'registry_admission_requires_complete_pac',true,'free_resolved_from_envpac',true,'includes_environment_personalization',true,'presentation_store','c3_envpac_presentation','avatar_required',false)),
    (p_envpac_key||':primitive:ledger',p_envpac_key,'ledger','environment_ledger','Ledger','c1me.ledger','/api/my-environment-connections',20,'active',
      jsonb_build_object('universal',true,'environment_local',true,'supports_relational_entries',true,'registry_object_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:canopy',p_envpac_key,'canopy','environment_canopy','Canopy','c1me.canopy','/api/my-environment-canopy',30,'active',
      jsonb_build_object('universal',true,'environment_local',true,'external_surface_references',true,'registry_standing_created',false,'free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:native_connections',p_envpac_key,'native_connections','c3_native_connections','Connections','c1me.native_connections','/api/my-environment-connections',40,'active',
      jsonb_build_object('universal',true,'environment_local',true,'bilateral_relation_required',true,'ledger_message_exchange_supported',true,'registry_object_created',false,'implementation_state','bilateral_relation_projection_pending','free_resolved_from_envpac',true)),
    (p_envpac_key||':primitive:invite_connection',p_envpac_key,'invite_connection','relational_passage','Invite Connection','c1me.invite_connection','/api/my-environment-invite',50,'active',
      jsonb_build_object('universal',true,'environment_local_origin',true,'personalized_invite',true,'optional_initiative_provenance',true,'acceptance_forms_connection',true,'share_reference_is_provenance_only',true,'registry_object_created_by_invite',false,'implementation_state','passage_exists_bilateral_acceptance_projection_pending','free_resolved_from_envpac',true))
  on conflict (envpac_key,primitive_key) do update
    set primitive_class=excluded.primitive_class,display_label=excluded.display_label,
        renderer_key=excluded.renderer_key,runtime_endpoint=excluded.runtime_endpoint,
        sort_order=excluded.sort_order,standing=excluded.standing,config=excluded.config,updated_at=now();

  update public.c3_envpac set metadata=metadata||jsonb_build_object(
    'runtime_primitive_contract','c1me_env_primitives_v2',
    'runtime_primitive_count',5,
    'personalization_composed_into_profile_pac',true,
    'free_runtime_resolution_source','envpac'
  ),updated_at=now() where envpac_key=p_envpac_key;

  return jsonb_build_object('seeded',true,'envpac_key',p_envpac_key,'primitive_contract','c1me_env_primitives_v2','primitive_count',5);
end $$;

update public.c3_envpac_runtime_primitive
set standing='retired',updated_at=now()
where primitive_key='personalize' and standing='active';

update public.c3_envpac_runtime_primitive
set sort_order=case primitive_key
      when 'profile_pac' then 10 when 'ledger' then 20 when 'canopy' then 30
      when 'native_connections' then 40 when 'invite_connection' then 50 else sort_order end,
    config=case when primitive_key='profile_pac'
      then config||jsonb_build_object('includes_environment_personalization',true,'presentation_store','c3_envpac_presentation','avatar_required',false)
      else config end,
    updated_at=now()
where primitive_key in ('profile_pac','ledger','canopy','native_connections','invite_connection') and standing='active';

update public.c3_envpac
set metadata=metadata||jsonb_build_object(
  'runtime_primitive_contract','c1me_env_primitives_v2',
  'runtime_primitive_count',5,
  'personalization_composed_into_profile_pac',true
),updated_at=now()
where envpac_key in (
  select distinct envpac_key from public.c3_envpac_runtime_primitive
  where primitive_key='profile_pac' and standing='active'
);

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
  'primitive_count',5,
  'primitive_keys',jsonb_build_array('profile_pac','ledger','canopy','native_connections','invite_connection'),
  'personalization_composed_into_profile_pac',true
),updated_at=now()
where process_key='c1me_envpac_primitives_v1';

commit;
