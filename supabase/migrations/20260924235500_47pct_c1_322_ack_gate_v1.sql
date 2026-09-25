-- 47pct C1 initiative provenance + 3-2-2 acknowledgment gate
-- Operator: op044
-- Runtime release remains held until end-to-end readback.

create or replace function public.record_c1_initiative_connect_requested(
  p_relationship_key text,
  p_initiative_key text,
  p_source_host text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_process public.system_process_registry%rowtype;
  v_existing public.crs_relationship_event%rowtype;
  v_event_key text;
  v_now timestamptz := now();
begin
  select * into v_rel
  from public.crs_relationship
  where relationship_key=p_relationship_key
    and is_active=true
    and coalesce(is_test_relationship,false)=false
  for update;

  if not found then raise exception 'active_relationship_not_found'; end if;
  if v_rel.relationship_standing not in ('candidate_unverified','c1_C1_persisted') then
    raise exception 'relationship_not_eligible_for_initiative_connect';
  end if;

  select * into v_process
  from public.system_process_registry
  where process_family='c2me'
    and status='active'
    and process_status='active'
    and authority_level='governed'
    and coalesce(metadata->>'initiative',metadata->>'initiative_key')=p_initiative_key
    and metadata->>'initiative_standing'='ENCOUNTER'
  order by updated_at desc
  limit 1;

  if not found then raise exception 'initiative_encounter_not_registered'; end if;

  select e.* into v_existing
  from public.crs_relationship_event e
  where e.relationship_key=p_relationship_key
    and e.event_type='initiative_connect_requested'
    and e.event_standing='acknowledgment_pending'
    and e.metadata->>'initiative_key'=p_initiative_key
    and not exists (
      select 1
      from public.crs_relationship_event a
      where a.relationship_key=e.relationship_key
        and a.event_type='322_acknowledged'
        and a.metadata->>'request_event_key'=e.event_key
    )
  order by e.occurred_at desc,e.created_at desc,e.event_key desc
  limit 1;

  if found then
    return jsonb_build_object(
      'accepted',true,
      'relationship_key',p_relationship_key,
      'initiative_key',p_initiative_key,
      'request_event_key',v_existing.event_key,
      'standing','acknowledgment_pending',
      'next_permitted_encounter','322_acknowledge',
      'existing',true
    );
  end if;

  v_event_key:='event_'||replace(gen_random_uuid()::text,'-','');

  insert into public.crs_relationship_event(
    event_key,relationship_key,event_type,source_system,source_record_type,
    source_record_ref,event_standing,next_permitted_encounter,metadata,occurred_at
  )
  values(
    v_event_key,p_relationship_key,'initiative_connect_requested','c3_field',
    'c2me_initiative',v_process.process_key,'acknowledgment_pending','322_acknowledge',
    jsonb_strip_nulls(jsonb_build_object(
      'initiative_key',p_initiative_key,
      'initiative_process_key',v_process.process_key,
      'initiative_envpac_key',v_process.metadata->>'root_envpac',
      'target_environment_key',v_process.metadata->>'environment_key',
      'source_host',lower(btrim(p_source_host)),
      'ack_contract_key','47pct_pre_my_env_322_v1',
      'requires_322_acknowledgment',true,
      'standing_effect','none',
      'current_effect','none',
      'authority_effect','none'
    ) || coalesce(p_metadata,'{}'::jsonb)),
    v_now
  );

  return jsonb_build_object(
    'accepted',true,
    'relationship_key',p_relationship_key,
    'initiative_key',p_initiative_key,
    'request_event_key',v_event_key,
    'standing','acknowledgment_pending',
    'next_permitted_encounter','322_acknowledge',
    'existing',false
  );
end;
$function$;

create or replace function public.resolve_pending_c1_initiative_connect(
  p_relationship_key text
)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_event public.crs_relationship_event%rowtype;
begin
  select e.* into v_event
  from public.crs_relationship_event e
  where e.relationship_key=p_relationship_key
    and e.event_type='initiative_connect_requested'
    and e.event_standing='acknowledgment_pending'
    and not exists (
      select 1
      from public.crs_relationship_event a
      where a.relationship_key=e.relationship_key
        and a.event_type='322_acknowledged'
        and a.metadata->>'request_event_key'=e.event_key
    )
  order by e.occurred_at desc,e.created_at desc,e.event_key desc
  limit 1;

  if not found then
    return jsonb_build_object('pending',false,'relationship_key',p_relationship_key);
  end if;

  return jsonb_build_object(
    'pending',true,
    'relationship_key',p_relationship_key,
    'request_event_key',v_event.event_key,
    'initiative_key',v_event.metadata->>'initiative_key',
    'initiative_process_key',v_event.metadata->>'initiative_process_key',
    'initiative_envpac_key',v_event.metadata->>'initiative_envpac_key',
    'target_environment_key',v_event.metadata->>'target_environment_key',
    'source_host',v_event.metadata->>'source_host',
    'ack_contract_key',v_event.metadata->>'ack_contract_key',
    'standing',v_event.event_standing,
    'next_permitted_encounter',v_event.next_permitted_encounter
  );
end;
$function$;

create or replace function public.form_c1_owner_environment(
  p_relationship_key text,
  p_env_key text default 'env_c3_community_connect'::text
)
returns jsonb
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  r public.crs_relationship%rowtype;
  suffix text;
  owner_env_key text;
  owner_envpac_key text;
  persisted_event_key text;
  pending_initiative_event public.crs_relationship_event%rowtype;
  acknowledgment_event_key text;
begin
  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key and is_active=true and coalesce(is_test_relationship,false)=false for update;
  if not found then raise exception 'active_relationship_not_found'; end if;
  if r.relationship_standing <> 'c1_C1_persisted' then raise exception 'c1_relationship_not_persisted'; end if;

  select event_key into persisted_event_key from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='c1_relationship_persisted'
    and event_standing='c1_C1_persisted' order by occurred_at desc limit 1;
  if persisted_event_key is null then raise exception 'c1_persistence_evidence_missing'; end if;

  select e.* into pending_initiative_event
  from public.crs_relationship_event e
  where e.relationship_key=p_relationship_key
    and e.event_type='initiative_connect_requested'
    and e.event_standing='acknowledgment_pending'
    and e.next_permitted_encounter='322_acknowledge'
    and not exists (
      select 1 from public.crs_relationship_event a
      where a.relationship_key=e.relationship_key
        and a.event_type='322_acknowledged'
        and a.metadata->>'request_event_key'=e.event_key
    )
  order by e.occurred_at desc,e.created_at desc,e.event_key desc
  limit 1;

  if found then
    raise exception 'c1_322_acknowledgment_required';
  end if;

  select a.event_key into acknowledgment_event_key
  from public.crs_relationship_event a
  where a.relationship_key=p_relationship_key
    and a.event_type='322_acknowledged'
    and a.event_standing='acknowledged_receipt'
  order by a.occurred_at desc,a.created_at desc,a.event_key desc
  limit 1;

  suffix:=substr(md5(p_relationship_key),1,24);
  owner_env_key:='env_person_'||suffix;
  owner_envpac_key:='c3envpac_person_'||suffix||'_v0_1';

  insert into public.c3_environment(env_key,system_key,environment_name,environment_class,standing,is_canonical,is_active,source_authority_ref,metadata)
  values(owner_env_key,'c3_field','My Environment','c3me_individual_environment','c1_connected',true,true,
    'crs_relationship:'||p_relationship_key,
    jsonb_strip_nulls(jsonb_build_object(
      'owner_subject_type','individual','owner_subject_key',p_relationship_key,'parent_environment',p_env_key,
      'c1_relationship_key',p_relationship_key,'c1_persistence_event_key',persisted_event_key,'c1_standing','c1_C1_persisted',
      '322_acknowledgment_event_key',acknowledgment_event_key,
      'current','C1','c2_standing','not_created','formation_source','form_c1_owner_environment_v1')))
  on conflict (env_key) do nothing;

  insert into public.c3_envpac(envpac_key,env_key,version,standing,owner_subject_type,owner_subject_key,
    custodian_subject_type,custodian_subject_key,custody_uri,custody_provider,architecture_version,is_effective,portable,metadata)
  values(owner_envpac_key,owner_env_key,'v0.1','effective','individual',p_relationship_key,'system','c3_field',
    'c3://envpac/'||owner_envpac_key,'c3_field','c3pac_v0.1',true,true,
    jsonb_strip_nulls(jsonb_build_object(
      'formed_from_c1',true,'relationship_key',p_relationship_key,'persistence_event_key',persisted_event_key,
      '322_acknowledgment_event_key',acknowledgment_event_key,
      'ownership_rule','individual_owner_c3_field_custody')))
  on conflict (envpac_key) do nothing;

  insert into public.c3_envpac_environment_binding(binding_key,envpac_key,env_key,binding_role,standing,is_primary,metadata)
  values('bind_'||suffix||'_owned',owner_envpac_key,owner_env_key,'owned_environment','active',true,'{"source":"c1_owner_environment_formation"}'::jsonb),
        ('bind_'||suffix||'_c3me',owner_envpac_key,owner_env_key,'c3me_environment','active',true,'{"source":"c1_owner_environment_formation"}'::jsonb)
  on conflict (envpac_key,env_key,binding_role) do nothing;

  insert into public.c3_envpac_access_grant(grant_key,envpac_key,subject_type,subject_key,relation_role,scope,standing,
    granted_by_type,granted_by_key,evidence_ref,metadata)
  values('grant_'||suffix||'_owner',owner_envpac_key,'individual',p_relationship_key,'owner',
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

  insert into public.c3_pac(pac_key,envpac_key,pac_type,version,standing,custody_uri,content_sha256,source_authority,is_effective,metadata)
  values('c3webpac_person_'||suffix||'_v0_1',owner_envpac_key,'c3WebPac','v0.8','elevated_private_repo_custody_runtime_release_held',
    'github-private://c3codex/measures-of-inanna-governance@c480c4e33f79183cc4e5da447488376e2a9af5e1/webpac/c3_field/c3field_online_field_encounter_webpac_v0_8.meta.md',
    null,'webpac_private_repo',true,
    jsonb_build_object(
      'source_webpac_key','c3field_field_encounter_webpac_v0_8',
      'canonical_repo','c3codex/measures-of-inanna-governance',
      'canonical_repo_path','webpac/c3_field/c3field_online_field_encounter_webpac_v0_8.meta.md',
      'canonical_commit','c480c4e33f79183cc4e5da447488376e2a9af5e1',
      'working_provenance_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
      'working_surface_authority','provenance_only',
      'runtime_surface','/my-environment','relation_role','environment_presentation',
      'owner_changeable',true,'custody_transfer',false,
      'runtime_release_authorized',false,'public_release_authorized',false))
  on conflict (pac_key) do nothing;

  insert into public.c3_envpac_presentation(envpac_key,opening_visual_asset_key,opening_visual_url,source_webpac_key,
    owner_changeable,selection_standing,selected_by_type,selected_by_key,metadata)
  values(owner_envpac_key,'c3_field_c1me_live_backdrop_v1',
    '/api/free-media?asset=c3_field_c1me_live_backdrop_v1',
    'c3field_field_encounter_webpac_v0_8',true,'active','system','c3_field',
    jsonb_build_object('default_source','c3_field_webpac','custody_transfer',false,'formation_source','form_c1_owner_environment_v1'))
  on conflict (envpac_key) do nothing;

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'owner_email',r.primary_email,
    'owner_display_name',r.display_name,'env_key',owner_env_key,'envpac_key',owner_envpac_key,'standing','c1_connected',
    'c1_standing',r.relationship_standing,'portable',true,'322_acknowledgment_event_key',acknowledgment_event_key);
end;
$function$;

create or replace function public.acknowledge_c1_322_and_open_environment(
  p_relationship_key text,
  p_request_event_key text,
  p_contract_key text,
  p_acknowledged boolean,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_request public.crs_relationship_event%rowtype;
  v_process public.system_process_registry%rowtype;
  v_ack public.crs_relationship_event%rowtype;
  v_ack_key text;
  v_owner jsonb;
  v_visibility_key text;
  v_initiative_key text;
  v_now timestamptz := now();
begin
  if p_acknowledged is not true then raise exception 'explicit_322_acknowledgment_required'; end if;
  if p_contract_key is distinct from '47pct_pre_my_env_322_v1' then raise exception '322_contract_mismatch'; end if;

  select * into v_rel from public.crs_relationship
  where relationship_key=p_relationship_key
    and is_active=true
    and coalesce(is_test_relationship,false)=false
  for update;
  if not found then raise exception 'active_relationship_not_found'; end if;
  if v_rel.relationship_standing <> 'c1_C1_persisted' then raise exception 'c1_relationship_not_persisted'; end if;

  select * into v_request
  from public.crs_relationship_event
  where event_key=p_request_event_key
    and relationship_key=p_relationship_key
    and event_type='initiative_connect_requested'
    and event_standing='acknowledgment_pending'
    and next_permitted_encounter='322_acknowledge'
  limit 1;
  if not found then raise exception 'initiative_acknowledgment_request_not_found'; end if;
  if v_request.metadata->>'ack_contract_key' is distinct from p_contract_key then raise exception '322_request_contract_mismatch'; end if;

  v_initiative_key:=v_request.metadata->>'initiative_key';
  if v_initiative_key is null or v_initiative_key='' then raise exception 'initiative_key_missing'; end if;

  select * into v_process
  from public.system_process_registry
  where process_key=v_request.metadata->>'initiative_process_key'
    and process_family='c2me'
    and status='active'
    and process_status='active'
    and authority_level='governed'
    and coalesce(metadata->>'initiative',metadata->>'initiative_key')=v_initiative_key
    and metadata->>'initiative_standing'='ENCOUNTER'
  limit 1;
  if not found then raise exception 'initiative_encounter_not_current'; end if;

  select * into v_ack
  from public.crs_relationship_event
  where relationship_key=p_relationship_key
    and event_type='322_acknowledged'
    and metadata->>'request_event_key'=p_request_event_key
  order by occurred_at desc,created_at desc,event_key desc
  limit 1;

  if found then
    v_ack_key:=v_ack.event_key;
  else
    v_ack_key:='event_'||replace(gen_random_uuid()::text,'-','');
    insert into public.crs_relationship_event(
      event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,
      event_standing,next_permitted_encounter,metadata,occurred_at
    )
    values(
      v_ack_key,p_relationship_key,'322_acknowledged','c3_field','c1_322_contract',p_contract_key,
      'acknowledged_receipt','owner_environment',
      jsonb_strip_nulls(jsonb_build_object(
        'request_event_key',p_request_event_key,
        'initiative_key',v_initiative_key,
        'initiative_process_key',v_process.process_key,
        'contract_key',p_contract_key,
        'constraints',jsonb_build_array(
          'Physical presence is not required for standing or support.',
          'Physical presence demonstrates only physical presence.',
          'My Environment must not claim more than your CURRENT state supports.'
        ),
        'agreements',jsonb_build_array(
          'I may participate from my environment at the level presently available to me.',
          'I understand the peaceful gathering as a resolution path, not a participation requirement.'
        ),
        'resolutions',jsonb_build_array(
          'Support and attendance resolve separately.',
          'The record remains bounded to what actually occurred.'
        ),
        'acknowledgment_text','I acknowledge the 3 Constraints, 2 Agreements, and 2 Resolutions above. I understand that My Environment preserves my CURRENT relational state, that peaceful on-ground presence is voluntary, and that support, contribution, connection, and physical attendance are evidenced separately.',
        'event_effect','receipt_and_recognition_only',
        'authority_created',false,
        'support_created',false,
        'attendance_created',false,
        'contribution_created',false,
        'c2_created',false,
        'standing_effect','passage_prerequisite_satisfied'
      ) || coalesce(p_metadata,'{}'::jsonb)),
      v_now
    );
  end if;

  v_owner:=public.form_c1_owner_environment(p_relationship_key,'env_c3_community_connect');
  if coalesce(v_owner->>'accepted','false')<>'true' then raise exception 'owner_environment_not_formed'; end if;

  v_visibility_key:='visibility_'||substr(md5(p_relationship_key||'|'||v_initiative_key),1,32);

  insert into public.c3_env_initiative_visibility(
    visibility_key,relationship_key,env_key,envpac_key,initiative_key,initiative_envpac_key,
    target_environment_key,visibility_source,source_ref,standing,visible_at,revoked_at,metadata
  )
  values(
    v_visibility_key,p_relationship_key,v_owner->>'env_key',v_owner->>'envpac_key',v_initiative_key,
    v_process.metadata->>'root_envpac',v_process.metadata->>'environment_key',
    'encounter',v_ack_key,'active',v_now,null,
    jsonb_build_object(
      'request_event_key',p_request_event_key,
      'acknowledgment_event_key',v_ack_key,
      'ack_contract_key',p_contract_key,
      'source_host',v_request.metadata->>'source_host',
      'projection_rule','confirmed_connect_plus_322_acknowledgment',
      'authority_effect','visibility_only',
      'c2_standing_created',false
    )
  )
  on conflict (relationship_key,initiative_key) do update
    set env_key=excluded.env_key,
        envpac_key=excluded.envpac_key,
        initiative_envpac_key=excluded.initiative_envpac_key,
        target_environment_key=excluded.target_environment_key,
        visibility_source=excluded.visibility_source,
        source_ref=excluded.source_ref,
        standing='active',
        visible_at=excluded.visible_at,
        revoked_at=null,
        metadata=excluded.metadata;

  return v_owner || jsonb_build_object(
    '322_acknowledged',true,
    '322_acknowledgment_event_key',v_ack_key,
    'initiative_key',v_initiative_key,
    'visibility_key',v_visibility_key,
    'visibility_standing','active',
    'next_permitted_encounter','my_environment'
  );
end;
$function$;

revoke all on function public.record_c1_initiative_connect_requested(text,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.resolve_pending_c1_initiative_connect(text) from public,anon,authenticated;
revoke all on function public.acknowledge_c1_322_and_open_environment(text,text,text,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.record_c1_initiative_connect_requested(text,text,text,jsonb) to service_role;
grant execute on function public.resolve_pending_c1_initiative_connect(text) to service_role;
grant execute on function public.acknowledge_c1_322_and_open_environment(text,text,text,boolean,jsonb) to service_role;

update public.c3_pac
set metadata=jsonb_set(
    metadata,
    '{pre_my_env_322_acknowledgment}',
    (metadata->'pre_my_env_322_acknowledgment')
      || jsonb_build_object(
        'contract_key','47pct_pre_my_env_322_v1',
        'constraints',jsonb_build_array(
          'Physical presence is not required for standing or support.',
          'Physical presence demonstrates only physical presence.',
          'My Environment must not claim more than your CURRENT state supports.'
        ),
        'agreements',jsonb_build_array(
          'I may participate from my environment at the level presently available to me.',
          'I understand the peaceful gathering as a resolution path, not a participation requirement.'
        ),
        'resolutions',jsonb_build_array(
          'Support and attendance resolve separately.',
          'The record remains bounded to what actually occurred.'
        ),
        'implementation_state','db_enforced_runtime_deploy_pending'
      ),
    true
  ),
  updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

update public.system_process_registry
set metadata=(metadata-'webpac_process_key')
  || jsonb_build_object(
    'webpac_key','47pct_c1_connect_c3webpac_v1',
    'release_state','held',
    'held_reason','c1_connect_pac_runtime_release_held',
    'resolver_authority_source','c3_pac',
    'runtime_release_authorized',false
  ),
  authority_state='operator_routed_registry_binding_runtime_held',
  authority_level='governed_runtime_held',
  updated_at=now()
where process_key='47pct_c1me_surface_binding_v1';
