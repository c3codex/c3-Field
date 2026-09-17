-- WebPac elevation -> private repository custody v1
-- Operator: op044
-- Governance rule commit: aec3eb154ffac2ef15a2fecafe19fea03c3e477a
-- c1ME WebPac canonical commit: c480c4e33f79183cc4e5da447488376e2a9af5e1

begin;

-- Register the reusable lifecycle rule.
insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'webpac_elevation_private_repo_custody_v1','shared_services',
  'WebPac Elevation to Private Repository Custody v1','active',
  'governance/webpac/webpac_elevation_private_repo_custody_v1.meta.md',
  'elevated_process_rule',
  jsonb_build_object(
    'operator','op044',
    'canonical_custody_after_elevation','private_repository',
    'working_authoring_surface_after_elevation','provenance_only',
    'media_custody_transfer',false,
    'registry_absorbs_custody',false,
    'free_absorbs_custody',false,
    'envpac_absorbs_webpac_custody',false,
    'governance_commit','aec3eb154ffac2ef15a2fecafe19fea03c3e477a'
  ),
  'WebPac Elevation to Private Repository Custody v1',
  'Working WebPac -> review -> elevation -> private repository custody -> Registry persistence -> bounded runtime projection',
  'active','elevated_process_rule',
  jsonb_build_array(
    'github-private://c3codex/measures-of-inanna-governance/main/governance/webpac/webpac_elevation_private_repo_custody_v1.meta.md',
    'commit:aec3eb154ffac2ef15a2fecafe19fea03c3e477a'
  ),
  'oar2',false,false,false,now(),now()
) on conflict (process_key) do update set
  authority_state=excluded.authority_state,
  metadata=excluded.metadata,
  updated_at=now();

-- Apply the lifecycle to the currently elevated c1ME WebPac package.
update public.c3_pac
set custody_uri='github-private://c3codex/measures-of-inanna-governance@c480c4e33f79183cc4e5da447488376e2a9af5e1/webpac/c3_field/c3field_online_field_encounter_webpac_v0_8.meta.md',
    version='v0.8',
    standing='elevated_private_repo_custody_runtime_release_held',
    source_authority='webpac_private_repo',
    metadata=(metadata - 'source_webpac_drive_id') || jsonb_build_object(
      'source_webpac_key','c3field_field_encounter_webpac_v0_8',
      'canonical_repo','c3codex/measures-of-inanna-governance',
      'canonical_repo_path','webpac/c3_field/c3field_online_field_encounter_webpac_v0_8.meta.md',
      'canonical_commit','c480c4e33f79183cc4e5da447488376e2a9af5e1',
      'working_provenance_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
      'working_provenance_revision','ANLCKQlX4mW6Z7-RGQ8G2uuO_c4OT2_Ge8DPjizfuXu1ZKu634mIKnaUgy9c35BvTUOwNrFePhxGaMppB1TCf0adhhmLOm8hsNAS7U6_Ww',
      'working_surface_authority','provenance_only',
      'elevation_process','webpac_elevation_private_repo_custody_v1',
      'custody_transfer_media',false,
      'runtime_release_authorized',false,
      'public_release_authorized',false
    ),
    updated_at=now()
where pac_key='c3webpac_person_eea672f5a7676dad4316755b_v0_1';

insert into public.measures_persistence_state(
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,
  governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c3field_field_encounter_webpac_v0_8:private_repo_custody',
  'webpac_elevation_private_repo_custody_v1',
  'webpac_elevation_private_repo_custody_v1',
  'env_c3_community_connect',
  'c3field_field_encounter_webpac_v0_8',
  'elevated_webpac_custody',
  jsonb_build_object(
    'canonical_custody','private_repository',
    'canonical_repo','c3codex/measures-of-inanna-governance',
    'canonical_path','webpac/c3_field/c3field_online_field_encounter_webpac_v0_8.meta.md',
    'canonical_commit','c480c4e33f79183cc4e5da447488376e2a9af5e1',
    'runtime_release_authorized',false,
    'public_release_authorized',false
  ),
  jsonb_build_object(
    'operator','op044',
    'process_rule_commit','aec3eb154ffac2ef15a2fecafe19fea03c3e477a',
    'webpac_commit','c480c4e33f79183cc4e5da447488376e2a9af5e1',
    'prior_working_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs'
  ),
  jsonb_build_object(
    'webpac_package_custody','private repository',
    'arrival_video_custody','Cloudflare R2 / c1ME.env_ready',
    'backdrop_custody','Supabase Storage / c3-field-media',
    'media_custody_transferred',false,
    'registry_absorbs_custody',false,
    'free_absorbs_custody',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'prior_authoring_surface','Google Drive',
    'prior_authoring_surface_standing','provenance_only_after_elevation',
    'prior_webpac_deleted',false,
    'source_superseded_by','c3field_field_encounter_webpac_v0_8'
  ),
  'elevated_private_repo_custody_runtime_release_held',
  'bounded_implementation_then_oar1_runtime_proof','registrar',now(),now()
) on conflict (persistence_key) do update set
  governed_state=excluded.governed_state,
  evidence=excluded.evidence,
  custody=excluded.custody,
  lineage=excluded.lineage,
  standing=excluded.standing,
  next_permitted_transition=excluded.next_permitted_transition,
  updated_at=now();

-- Future personal environments receive the elevated WebPac reference directly.
create or replace function public.form_c1_owner_environment(
  p_relationship_key text,
  p_env_key text default 'env_c3_community_connect'::text
) returns jsonb
language plpgsql security definer set search_path to 'public'
as $function$
declare
  r public.crs_relationship%rowtype;
  suffix text;
  owner_env_key text;
  owner_envpac_key text;
  persisted_event_key text;
begin
  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key and is_active=true and coalesce(is_test_relationship,false)=false for update;
  if not found then raise exception 'active_relationship_not_found'; end if;
  if r.relationship_standing <> 'c1_C1_persisted' then raise exception 'c1_relationship_not_persisted'; end if;

  select event_key into persisted_event_key from public.crs_relationship_event
  where relationship_key=p_relationship_key and event_type='c1_relationship_persisted'
    and event_standing='c1_C1_persisted' order by occurred_at desc limit 1;
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
  values(owner_envpac_key,'c3_field_environment_opening_visual_v1',
    'https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3_tree_env.webp',
    'c3field_field_encounter_webpac_v0_8',true,'active','system','c3_field',
    jsonb_build_object('default_source','c3_field_webpac','custody_transfer',false,'formation_source','form_c1_owner_environment_v1'))
  on conflict (envpac_key) do nothing;

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'owner_email',r.primary_email,
    'owner_display_name',r.display_name,'env_key',owner_env_key,'envpac_key',owner_envpac_key,'standing','c1_connected',
    'c1_standing',r.relationship_standing,'portable',true);
end;
$function$;

commit;
