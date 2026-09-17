create table if not exists public.c3_envpac_presentation (
  envpac_key text primary key references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  opening_visual_asset_key text not null references public.c3ops_asset_record(asset_key) on update cascade on delete restrict,
  opening_visual_url text not null,
  source_webpac_key text not null,
  owner_changeable boolean not null default true,
  selection_standing text not null default 'active',
  selected_by_type text not null,
  selected_by_key text not null,
  selected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.c3_envpac_presentation enable row level security;

insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,src_key,
  standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,custody_controller,
  free_eligibility,current_free_binding,public_retrieval_standing,supersedes_asset_key,retention_rule,
  external_anchor_type,network_identifier,contract_identifier,token_identifier,anchor_standing,tokenization_standing,
  created_by
) values (
  'c3_field_tree_source_v1','environment_media','source_artwork','c3 Tree — Original Environment Source',
  'Original c3 tree artwork used as the visual source lineage for the default My Environment opening visual.',
  'c3_field','op044','human_authored',null,null,'v1','15805e262675cbbc08d807da366f62ef-1','storage-etag','image/webp',255026,
  'Institutionally Scoped','c3field_field_encounter_webpac_v0_7','operator_approved_source',null,
  'operator_authorized_c3_environment_presentation','derivatives_permitted_for_c3_environment_presentation',
  'Supabase Storage','supabase','c3-field-media','c3tree.webp','c3_field',true,null,'public_runtime_source',null,
  'preserve_exact_source',null,null,null,null,null,null,'op044'
) on conflict (asset_key) do nothing;

insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,src_key,
  standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,custody_controller,
  free_eligibility,current_free_binding,public_retrieval_standing,supersedes_asset_key,retention_rule,
  external_anchor_type,network_identifier,contract_identifier,token_identifier,anchor_standing,tokenization_standing,
  created_by
) values (
  'c3_field_environment_opening_visual_v1','environment_media','default_opening_visual','c3 Field — Default My Environment Opening Visual',
  'Stylized c3 tree opening visual used as the default for newly formed personal My Environment surfaces; owner-changeable presentation selection.',
  'c3_field','op044','ai_assisted','c3_field_tree_source_v1','c3_field_tree_source_v1','v1',
  '51ad626a0ae60d358c29012a6fac4202-1','storage-etag','image/webp',465638,'Institutionally Scoped',
  'c3field_field_encounter_webpac_v0_7','operator_approved_default_environment_visual',null,
  'operator_authorized_c3_environment_presentation','presentation_selection_replaceable_by_owner','Supabase Storage','supabase',
  'c3-field-media','c3_tree_env.webp','c3_field',true,'/my-environment','public_runtime_default',null,
  'preserve_exact_source_and_lineage',null,null,null,null,null,null,'op044'
) on conflict (asset_key) do nothing;

insert into public.c3ops_asset_lineage_record(
  lineage_key,asset_key,parent_asset_key,root_asset_key,successor_asset_key,lineage_type,effective_date,
  termination_date,replacement_reason,legacy_standing
) values (
  'lineage_c3_field_environment_opening_visual_v1',
  'c3_field_environment_opening_visual_v1','c3_field_tree_source_v1','c3_field_tree_source_v1',null,
  'stylized_derivative',now(),null,'default My Environment opening visual derived from original c3 tree source','current'
) on conflict (lineage_key) do nothing;

insert into public.c3_pac(
  pac_key,envpac_key,pac_type,version,standing,custody_uri,content_sha256,source_authority,is_effective,metadata
) values (
  'c3webpac_person_eea672f5a7676dad4316755b_v0_1',
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1','c3WebPac','v0.1','active',
  'https://docs.google.com/document/d/1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',null,'webpac',true,
  jsonb_build_object(
    'source_webpac_key','c3field_field_encounter_webpac_v0_7',
    'source_webpac_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
    'runtime_surface','/my-environment','relation_role','environment_presentation',
    'opening_visual_asset_key','c3_field_environment_opening_visual_v1','owner_changeable',true,'custody_transfer',false)
) on conflict (pac_key) do update set standing=excluded.standing,custody_uri=excluded.custody_uri,
  source_authority=excluded.source_authority,is_effective=excluded.is_effective,metadata=excluded.metadata,updated_at=now();

insert into public.c3_envpac_presentation(
  envpac_key,opening_visual_asset_key,opening_visual_url,source_webpac_key,owner_changeable,
  selection_standing,selected_by_type,selected_by_key,metadata
) values (
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1','c3_field_environment_opening_visual_v1',
  'https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3_tree_env.webp',
  'c3field_field_encounter_webpac_v0_7',true,'active','system','c3_field',
  jsonb_build_object('default_source','c3_field_webpac','custody_transfer',false,'formation_backfill',true)
) on conflict (envpac_key) do update set opening_visual_asset_key=excluded.opening_visual_asset_key,
  opening_visual_url=excluded.opening_visual_url,source_webpac_key=excluded.source_webpac_key,
  owner_changeable=excluded.owner_changeable,selection_standing=excluded.selection_standing,updated_at=now(),
  metadata=public.c3_envpac_presentation.metadata || excluded.metadata;

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
  values('c3webpac_person_'||suffix||'_v0_1',owner_envpac_key,'c3WebPac','v0.1','active',
    'https://docs.google.com/document/d/1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',null,'webpac',true,
    jsonb_build_object('source_webpac_key','c3field_field_encounter_webpac_v0_7','source_webpac_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
      'runtime_surface','/my-environment','relation_role','environment_presentation','opening_visual_asset_key','c3_field_environment_opening_visual_v1',
      'owner_changeable',true,'custody_transfer',false))
  on conflict (pac_key) do nothing;

  insert into public.c3_envpac_presentation(envpac_key,opening_visual_asset_key,opening_visual_url,source_webpac_key,
    owner_changeable,selection_standing,selected_by_type,selected_by_key,metadata)
  values(owner_envpac_key,'c3_field_environment_opening_visual_v1',
    'https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/c3_tree_env.webp',
    'c3field_field_encounter_webpac_v0_7',true,'active','system','c3_field',
    jsonb_build_object('default_source','c3_field_webpac','custody_transfer',false,'formation_source','form_c1_owner_environment_v1'))
  on conflict (envpac_key) do nothing;

  return jsonb_build_object('accepted',true,'relationship_key',p_relationship_key,'owner_email',r.primary_email,
    'owner_display_name',r.display_name,'env_key',owner_env_key,'envpac_key',owner_envpac_key,'standing','c1_connected',
    'c1_standing',r.relationship_standing,'portable',true);
end;
$function$;
