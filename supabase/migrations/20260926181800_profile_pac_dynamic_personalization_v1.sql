-- Profile-PAC dynamic personalization v1
-- Registry defines editable fields; optional personalization is non-authoritative metadata.

update public.c3_pac_type_contract
set intake_schema=jsonb_build_object(
  'fields',jsonb_build_array(
    jsonb_build_object('key','profile.display_label','label','Display name','input','text','required',true,'max_length',160,'placeholder','How should this profile be shown?'),
    jsonb_build_object('key','profile.visibility_scope','label','Visibility','input','select','required',true,'default','private','options',jsonb_build_array(
      jsonb_build_object('value','private','label','Private'),jsonb_build_object('value','environment','label','This environment'),
      jsonb_build_object('value','relational','label','Relational'),jsonb_build_object('value','public','label','Public'))),
    jsonb_build_object('key','profile.about','label','About me','input','textarea','required',false,'max_length',600,'placeholder','A short introduction in your own words.'),
    jsonb_build_object('key','profile.interests','label','What I’m interested in','input','textarea','required',false,'max_length',400,'placeholder','Ideas, work, places, communities, questions…'),
    jsonb_build_object('key','profile.open_to','label','What I’m open to','input','multiselect','required',false,'options',jsonb_build_array(
      jsonb_build_object('value','connect','label','Connect'),jsonb_build_object('value','collaborate','label','Collaborate'),
      jsonb_build_object('value','contribute','label','Contribute'),jsonb_build_object('value','create','label','Create'),
      jsonb_build_object('value','support','label','Support'),jsonb_build_object('value','learn','label','Learn'))),
    jsonb_build_object('key','profile.location_region','label','Location / region','input','text','required',false,'max_length',120,'placeholder','Optional')
  ),
  'resolved_fields',jsonb_build_array(
    jsonb_build_object('key','profile.profile_class','source','registered_subject_type'),
    jsonb_build_object('key','profile.subject_type','source','environment_session'),
    jsonb_build_object('key','profile.subject_key','source','environment_session'),
    jsonb_build_object('key','envpac_key','source','environment_session')
  )
),
metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
  'personalization_fields_non_authoritative',true,
  'profile_pac_dynamic_renderer',true,
  'personalization_storage','c3_profile_pac.metadata.personalization'
),
updated_at=now()
where contract_key='pac_contract_profilepac_v1' and pac_type='ProfilePAC' and standing='active' and is_effective=true;

create or replace function public.update_profile_pac_personalization_internal(
  p_envpac_key text,p_subject_type text,p_subject_key text,p_fields jsonb
) returns jsonb
language plpgsql security definer
set search_path to public, pg_temp
as $$
declare
  v_envpac public.c3_envpac%rowtype; v_truth jsonb; v_pac_key text;
  v_display text; v_visibility text; v_about text; v_interests text; v_location text;
  v_open_to jsonb; v_item text;
  v_allowed text[]:=array['connect','collaborate','contribute','create','support','learn'];
begin
  if p_envpac_key is null or p_subject_type is null or p_subject_key is null or p_fields is null or jsonb_typeof(p_fields)<>'object' then
    raise exception 'profile_personalization_input_required';
  end if;
  select * into v_envpac from public.c3_envpac where envpac_key=p_envpac_key and is_effective=true;
  if not found then raise exception 'envpac_not_effective'; end if;
  if v_envpac.owner_subject_type<>p_subject_type or v_envpac.owner_subject_key<>p_subject_key then raise exception 'profile_subject_not_envpac_owner'; end if;
  v_truth:=public.resolve_profile_pac_v1_internal(p_envpac_key,p_subject_type,p_subject_key);
  if coalesce(v_truth->>'standing','')='profile_not_formed' then raise exception 'profile_not_formed'; end if;
  v_pac_key:=v_truth->>'pac_key';
  v_display:=btrim(coalesce(p_fields->>'display_label',''));
  v_visibility:=coalesce(p_fields->>'visibility_scope','private');
  v_about:=nullif(btrim(coalesce(p_fields->>'about','')),'');
  v_interests:=nullif(btrim(coalesce(p_fields->>'interests','')),'');
  v_location:=nullif(btrim(coalesce(p_fields->>'location_region','')),'');
  v_open_to:=coalesce(p_fields->'open_to','[]'::jsonb);
  if length(v_display)<1 or length(v_display)>160 then raise exception 'display_label_invalid'; end if;
  if v_visibility not in ('private','environment','relational','public') then raise exception 'visibility_scope_invalid'; end if;
  if v_about is not null and length(v_about)>600 then raise exception 'profile_about_invalid'; end if;
  if v_interests is not null and length(v_interests)>400 then raise exception 'profile_interests_invalid'; end if;
  if v_location is not null and length(v_location)>120 then raise exception 'profile_location_invalid'; end if;
  if jsonb_typeof(v_open_to)<>'array' then raise exception 'profile_open_to_invalid'; end if;
  for v_item in select jsonb_array_elements_text(v_open_to) loop
    if not (v_item=any(v_allowed)) then raise exception 'profile_open_to_invalid'; end if;
  end loop;
  update public.c3_profile_pac
  set display_label=v_display,visibility_scope=v_visibility,
      metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
        'personalization',jsonb_build_object('about',v_about,'interests',v_interests,'open_to',v_open_to,'location_region',v_location),
        'last_update_source','my_environment_owner_update','last_update_at',now(),'authority_effect','none'),
      updated_at=now()
  where pac_key=v_pac_key and subject_type=p_subject_type and subject_key=p_subject_key;
  if not found then raise exception 'profile_row_missing'; end if;
  update public.c3_pac
  set release_state=v_visibility,
      metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
        'profile_visibility_updated_by_owner',true,'profile_personalization_updated_by_owner',true,
        'profile_personalization_updated_at',now(),'authority_effect','none'),
      updated_at=now()
  where pac_key=v_pac_key and envpac_key=p_envpac_key and pac_type='ProfilePAC' and is_effective=true;
  if not found then raise exception 'profile_pac_registry_row_missing'; end if;
  return jsonb_build_object('ok',true,'updated',true,'truth',public.c3_profile_pac_truth(v_pac_key));
end;
$$;

revoke all on function public.update_profile_pac_personalization_internal(text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.update_profile_pac_personalization_internal(text,text,text,jsonb) to service_role;

create or replace function public.c3_profile_pac_truth(p_pac_key text)
returns jsonb language plpgsql stable set search_path to public
as $$
declare
  v_pac public.c3_pac%rowtype; v_profile public.c3_profile_pac%rowtype;
  v_members jsonb; v_evaluation jsonb; v_personalization jsonb;
begin
  select * into v_pac from public.c3_pac where pac_key=p_pac_key and pac_type='ProfilePAC';
  if not found then return jsonb_build_object('standing','profile_pac_not_found','pac_key',p_pac_key); end if;
  select * into v_profile from public.c3_profile_pac where pac_key=p_pac_key;
  v_personalization:=coalesce(v_profile.metadata->'personalization','{}'::jsonb);
  select coalesce(jsonb_agg(jsonb_build_object(
    'member_key',m.member_key,'member_kind',m.member_kind,'member_role',m.member_role,'source_object_key',m.source_object_key,
    'custody_provider',m.custody_provider,'custody_identifier',m.custody_identifier,'custody_location',m.custody_location,
    'runtime_uri',m.runtime_uri,'integrity_algorithm',m.integrity_algorithm,'integrity_value',m.integrity_value,
    'version',m.version,'standing',m.standing,'release_scope',m.release_scope,'ordinal',m.ordinal
  ) order by m.ordinal nulls last,m.member_key),'[]'::jsonb)
  into v_members from public.c3_pac_member m where m.pac_key=p_pac_key and m.standing='active';
  v_evaluation:=public.c3_pac_evaluate(p_pac_key);
  return jsonb_build_object(
    'pac_key',v_pac.pac_key,'envpac_key',v_pac.envpac_key,'version',v_pac.version,'standing',v_pac.standing,
    'is_effective',v_pac.is_effective,'architecture_version',v_pac.architecture_version,'release_state',v_pac.release_state,
    'authority_effect',coalesce(v_pac.authority_effect,'none'),
    'profile',case when v_profile.pac_key is null then null else jsonb_build_object(
      'profile_key',v_profile.profile_key,'subject_type',v_profile.subject_type,'subject_key',v_profile.subject_key,
      'profile_class',v_profile.profile_class,'display_label',v_profile.display_label,'visibility_scope',v_profile.visibility_scope,
      'about',v_personalization->>'about','interests',v_personalization->>'interests',
      'open_to',coalesce(v_personalization->'open_to','[]'::jsonb),'location_region',v_personalization->>'location_region') end,
    'members',v_members,'evaluation',v_evaluation);
end;
$$;
