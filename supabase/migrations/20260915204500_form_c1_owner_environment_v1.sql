-- C1 persisted relationship -> owner-addressable C3ME.env + c3EnvPac.
create or replace function public.form_c1_owner_environment(
  p_relationship_key text,
  p_env_key text default 'env_c3_community_connect'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.crs_relationship%rowtype;
  suffix text;
  owner_env_key text;
  owner_envpac_key text;
  persisted_event_key text;
begin
  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key and is_active=true and coalesce(is_test_relationship,false)=false
  for update;
  if not found then raise exception 'active_relationship_not_found'; end if;
  if r.relationship_standing <> 'c1_C1_persisted' then raise exception 'c1_relationship_not_persisted'; end if;

  select event_key into persisted_event_key
  from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='c1_relationship_persisted' and event_standing='c1_C1_persisted'
  order by occurred_at desc limit 1;
  if persisted_event_key is null then raise exception 'c1_persistence_evidence_missing'; end if;

  suffix:=substr(md5(p_relationship_key),1,24);
  owner_env_key:='env_person_'||suffix;
  owner_envpac_key:='c3envpac_person_'||suffix||'_v0_1';

  insert into public.c3_environment(env_key,system_key,environment_name,environment_class,standing,is_canonical,is_active,source_authority_ref,metadata)
  values(owner_env_key,'c3_field','My Environment','c3me_individual_environment','c1_connected',true,true,
    'crs_relationship:'||p_relationship_key,
    jsonb_build_object('owner_subject_type','individual','owner_subject_key',p_relationship_key,'parent_environment',p_env_key,
      'c1_relationship_key',p_relationship_key,'c1_persistence_event_key',persisted_event_key,'c1_standing','c1_C1_persisted',
      'current','C1','c2_standing','not_created','formation_source','form_c1_owner_environment_v1'))
  on conflict (env_key) do nothing;

  insert into public.c3_envpac(envpac_key,env_key,version,standing,owner_subject_type,owner_subject_key,
    custodian_subject_type,custodian_subject_key,custody_uri,custody_provider,architecture_version,is_effective,portable,metadata)
  values(owner_envpac_key,owner_env_key,'v0.1','effective','individual',p_relationship_key,'system','c3_field',
    'c3://envpac/'||owner_envpac_key,'c3_field','c3pac_v0.1',true,true,
    jsonb_build_object('formed_from_c1',true,'relationship_key',p_relationship_key,'persistence_event_key',persisted_event_key,
      'ownership_rule','individual_owner_c3_field_custody'))
  on conflict (envpac_key) do nothing;

  insert into public.c3_envpac_environment_binding(binding_key,envpac_key,env_key,binding_role,standing,is_primary,metadata)
  values
    ('bind_'||suffix||'_owned',owner_envpac_key,owner_env_key,'owned_environment','active',true,'{"source":"c1_owner_environment_formation"}'::jsonb),
    ('bind_'||suffix||'_c3me',owner_envpac_key,owner_env_key,'c3me_environment','active',true,'{"source":"c1_owner_environment_formation"}'::jsonb)
  on conflict (envpac_key,env_key,binding_role) do nothing;

  insert into public.c3_envpac_access_grant(grant_key,envpac_key,subject_type,subject_key,relation_role,scope,standing,
    granted_by_type,granted_by_key,evidence_ref,metadata)
  values
    ('grant_'||suffix||'_owner',owner_envpac_key,'individual',p_relationship_key,'owner',
      '{"rights":["inspect","export","transfer_custody","grant","revoke"]}'::jsonb,'active','system','c3_field',persisted_event_key,
      '{"source":"c1_owner_environment_formation"}'::jsonb),
    ('grant_'||suffix||'_custodian',owner_envpac_key,'system','c3_field','custodian',
      '{"rights":["hold","version","resolve_runtime_bindings"]}'::jsonb,'active','individual',p_relationship_key,persisted_event_key,
      '{"source":"c1_owner_environment_formation"}'::jsonb)
  on conflict (grant_key) do nothing;

  insert into public.c3_envpac_rooted_system(rooted_system_key,envpac_key,system_key,relation_role,standing,authority_scope,runtime_ref,source_ref,metadata)
  values('root_'||suffix||'_c3field',owner_envpac_key,'c3_field','operating_system','active',
    jsonb_build_object('may_operate',true,'may_take_ownership',false,'may_transfer_custody',false,
      'visibility_does_not_grant_action',true,'action_does_not_grant_passage',true,'passage_does_not_transfer_authority',true),
    'https://c3field.online/my-environment','crs_relationship:'||p_relationship_key,
    '{"source":"c1_owner_environment_formation"}'::jsonb)
  on conflict (envpac_key,system_key,relation_role) do nothing;

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'owner_email',r.primary_email,
    'owner_display_name',r.display_name,'env_key',owner_env_key,'envpac_key',owner_envpac_key,'standing','c1_connected',
    'c1_standing',r.relationship_standing,'portable',true);
end;
$$;
revoke all on function public.form_c1_owner_environment(text,text) from public, anon, authenticated;
grant execute on function public.form_c1_owner_environment(text,text) to service_role;
