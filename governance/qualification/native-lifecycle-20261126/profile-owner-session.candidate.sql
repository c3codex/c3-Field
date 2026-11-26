-- UNINSTALLED bounded owner-authentication repair. Not the complete native PAC passage.
BEGIN;
CREATE OR REPLACE FUNCTION public.form_profile_pac_v1_internal(p_envpac_key text, p_subject_type text, p_subject_key text, p_profile_class text, p_display_label text, p_visibility_scope text DEFAULT 'private'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_envpac public.c3_envpac%rowtype;
  v_existing jsonb;
  v_pac_key text;
  v_profile_key text;
  v_eval jsonb;
  v_source_authority text;
begin

  -- Existing server session is the credential; owner identifiers are not credentials.
  -- Table SHARE locks also serialize appended revocations, not only an old grant row.
  lock table public.c3_env_runtime_session, public.c3_envpac_access_grant in share mode;
  perform 1 from public.c3_envpac e where e.envpac_key=p_envpac_key for update;
  if not exists (
    select 1 from public.c3_env_runtime_session s
    join public.c3_envpac e on e.envpac_key=s.envpac_key and e.env_key=s.env_key
    join public.c3_environment n on n.env_key=e.env_key and n.is_active
    where s.token_sha256=encode(extensions.digest(convert_to(
      coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-c3-owner-session',''),'UTF8'),'sha256'),'hex')
      and s.envpac_key=p_envpac_key and s.subject_type=p_subject_type and s.subject_key=p_subject_key
      and s.standing='active' and s.revoked_at is null and s.expires_at>clock_timestamp()
      and e.owner_subject_type=s.subject_type and e.owner_subject_key=s.subject_key
      and e.is_effective and e.superseded_at is null and e.effective_at<=clock_timestamp()
      and exists(select 1 from public.c3_envpac_access_grant g where g.envpac_key=e.envpac_key
        and g.subject_type=s.subject_type and g.subject_key=s.subject_key
        and g.relation_role='owner' and g.standing='active' and g.revoked_at is null
        and (g.expires_at is null or g.expires_at>clock_timestamp()))
  ) then raise exception 'DNR owner_session_authorization_unresolved' using errcode='42501'; end if;
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

  if v_source_authority is null then
    raise exception 'profile_contract_unavailable';
  end if;

  v_existing:=public.resolve_profile_pac_v1_internal(p_envpac_key,p_subject_type,p_subject_key);
  if coalesce(v_existing->>'standing','')<>'profile_not_formed' then
    return jsonb_build_object('ok',true,'created',false,'truth',v_existing);
  end if;

  v_profile_key:='profile_'||substr(md5(p_envpac_key||':'||p_subject_type||':'||p_subject_key),1,24);
  v_pac_key:='profile_pac_'||substr(md5(p_envpac_key||':'||p_subject_type||':'||p_subject_key),1,24)||'_v1';

  insert into public.c3_pac (
    pac_key,envpac_key,pac_type,version,standing,custody_uri,source_authority,is_effective,metadata,
    contract_key,architecture_version,custodian_subject_type,custodian_subject_key,custody_provider,
    authority_effect,release_state,execution_authority_state,formation_state,effective_at,
    return_evidence_required
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
$function$
;
CREATE OR REPLACE FUNCTION public.update_profile_pac_personalization_internal(p_envpac_key text, p_subject_type text, p_subject_key text, p_fields jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_envpac public.c3_envpac%rowtype;
  v_truth jsonb;
  v_pac_key text;
  v_display text;
  v_visibility text;
  v_about text;
  v_interests text;
  v_location text;
  v_open_to jsonb;
  v_item text;
  v_allowed text[]:=array['connect','collaborate','contribute','create','support','learn'];
begin

  -- Existing server session is the credential; owner identifiers are not credentials.
  -- Table SHARE locks also serialize appended revocations, not only an old grant row.
  lock table public.c3_env_runtime_session, public.c3_envpac_access_grant in share mode;
  perform 1 from public.c3_envpac e where e.envpac_key=p_envpac_key for update;
  if not exists (
    select 1 from public.c3_env_runtime_session s
    join public.c3_envpac e on e.envpac_key=s.envpac_key and e.env_key=s.env_key
    join public.c3_environment n on n.env_key=e.env_key and n.is_active
    where s.token_sha256=encode(extensions.digest(convert_to(
      coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-c3-owner-session',''),'UTF8'),'sha256'),'hex')
      and s.envpac_key=p_envpac_key and s.subject_type=p_subject_type and s.subject_key=p_subject_key
      and s.standing='active' and s.revoked_at is null and s.expires_at>clock_timestamp()
      and e.owner_subject_type=s.subject_type and e.owner_subject_key=s.subject_key
      and e.is_effective and e.superseded_at is null and e.effective_at<=clock_timestamp()
      and exists(select 1 from public.c3_envpac_access_grant g where g.envpac_key=e.envpac_key
        and g.subject_type=s.subject_type and g.subject_key=s.subject_key
        and g.relation_role='owner' and g.standing='active' and g.revoked_at is null
        and (g.expires_at is null or g.expires_at>clock_timestamp()))
  ) then raise exception 'DNR owner_session_authorization_unresolved' using errcode='42501'; end if;
  if p_envpac_key is null or p_subject_type is null or p_subject_key is null or p_fields is null or jsonb_typeof(p_fields)<>'object' then
    raise exception 'profile_personalization_input_required';
  end if;

  select * into v_envpac from public.c3_envpac
  where envpac_key=p_envpac_key and is_effective=true;
  if not found then raise exception 'envpac_not_effective'; end if;
  if v_envpac.owner_subject_type<>p_subject_type or v_envpac.owner_subject_key<>p_subject_key then
    raise exception 'profile_subject_not_envpac_owner';
  end if;

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

  for v_item in select jsonb_array_elements_text(v_open_to)
  loop
    if not (v_item=any(v_allowed)) then raise exception 'profile_open_to_invalid'; end if;
  end loop;

  update public.c3_profile_pac
  set display_label=v_display,
      visibility_scope=v_visibility,
      metadata=coalesce(metadata,'{}'::jsonb)
        || jsonb_build_object(
          'personalization',jsonb_build_object(
            'about',v_about,
            'interests',v_interests,
            'open_to',v_open_to,
            'location_region',v_location
          ),
          'last_update_source','my_environment_owner_update',
          'last_update_at',now(),
          'authority_effect','none'
        ),
      updated_at=now()
  where pac_key=v_pac_key and subject_type=p_subject_type and subject_key=p_subject_key;
  if not found then raise exception 'profile_row_missing'; end if;

  update public.c3_pac
  set release_state=v_visibility,
      metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
        'profile_visibility_updated_by_owner',true,
        'profile_personalization_updated_by_owner',true,
        'profile_personalization_updated_at',now(),
        'authority_effect','none'
      ),
      updated_at=now()
  where pac_key=v_pac_key and envpac_key=p_envpac_key and pac_type='ProfilePAC' and is_effective=true;
  if not found then raise exception 'profile_pac_registry_row_missing'; end if;

  if public.c3_pac_evaluate(v_pac_key)->>'resolution_state' is distinct from 'pass' then
    raise exception 'DNR profile_post_persistence_confirmation_failed';
  end if;
  return jsonb_build_object('ok',true,'updated',true,'truth',public.c3_profile_pac_truth(v_pac_key));
end;
$function$
;
CREATE OR REPLACE FUNCTION public.update_profile_pac_v1_internal(p_envpac_key text, p_subject_type text, p_subject_key text, p_display_label text, p_visibility_scope text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_envpac public.c3_envpac%rowtype;
  v_truth jsonb;
  v_pac_key text;
  v_eval jsonb;
begin

  -- Existing server session is the credential; owner identifiers are not credentials.
  -- Table SHARE locks also serialize appended revocations, not only an old grant row.
  lock table public.c3_env_runtime_session, public.c3_envpac_access_grant in share mode;
  perform 1 from public.c3_envpac e where e.envpac_key=p_envpac_key for update;
  if not exists (
    select 1 from public.c3_env_runtime_session s
    join public.c3_envpac e on e.envpac_key=s.envpac_key and e.env_key=s.env_key
    join public.c3_environment n on n.env_key=e.env_key and n.is_active
    where s.token_sha256=encode(extensions.digest(convert_to(
      coalesce(nullif(current_setting('request.headers',true),'')::jsonb->>'x-c3-owner-session',''),'UTF8'),'sha256'),'hex')
      and s.envpac_key=p_envpac_key and s.subject_type=p_subject_type and s.subject_key=p_subject_key
      and s.standing='active' and s.revoked_at is null and s.expires_at>clock_timestamp()
      and e.owner_subject_type=s.subject_type and e.owner_subject_key=s.subject_key
      and e.is_effective and e.superseded_at is null and e.effective_at<=clock_timestamp()
      and exists(select 1 from public.c3_envpac_access_grant g where g.envpac_key=e.envpac_key
        and g.subject_type=s.subject_type and g.subject_key=s.subject_key
        and g.relation_role='owner' and g.standing='active' and g.revoked_at is null
        and (g.expires_at is null or g.expires_at>clock_timestamp()))
  ) then raise exception 'DNR owner_session_authorization_unresolved' using errcode='42501'; end if;
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

  if p_display_label is null or length(btrim(p_display_label))<1 or length(btrim(p_display_label))>160 then
    raise exception 'display_label_invalid';
  end if;

  if p_visibility_scope not in ('private','environment','relational','public') then
    raise exception 'visibility_scope_invalid';
  end if;

  v_truth:=public.resolve_profile_pac_v1_internal(p_envpac_key,p_subject_type,p_subject_key);
  if coalesce(v_truth->>'standing','')='profile_not_formed' then
    raise exception 'profile_not_formed';
  end if;

  v_pac_key:=v_truth->>'pac_key';
  if v_pac_key is null or v_pac_key='' then
    raise exception 'profile_pac_key_missing';
  end if;

  update public.c3_profile_pac
  set display_label=btrim(p_display_label),
      visibility_scope=p_visibility_scope,
      metadata=metadata||jsonb_build_object(
        'last_update_source','my_environment_owner_update',
        'last_update_at',now()
      ),
      updated_at=now()
  where pac_key=v_pac_key
    and subject_type=p_subject_type
    and subject_key=p_subject_key;

  if not found then
    raise exception 'profile_row_missing';
  end if;

  update public.c3_pac
  set release_state=p_visibility_scope,
      metadata=metadata||jsonb_build_object(
        'profile_visibility_updated_by_owner',true,
        'profile_visibility_updated_at',now()
      ),
      updated_at=now()
  where pac_key=v_pac_key
    and envpac_key=p_envpac_key
    and pac_type='ProfilePAC'
    and is_effective=true;

  if not found then
    raise exception 'profile_pac_registry_row_missing';
  end if;

  v_eval:=public.c3_pac_evaluate(v_pac_key);
  if coalesce(v_eval->>'completeness_state','held')<>'pass' then
    raise exception 'profile_pac_incomplete_after_update';
  end if;

  return jsonb_build_object(
    'ok',true,
    'updated',true,
    'truth',public.c3_profile_pac_truth(v_pac_key)
  );
end;
$function$
;
REVOKE ALL ON FUNCTION public.form_profile_pac_v1_internal(text,text,text,text,text,text), public.update_profile_pac_v1_internal(text,text,text,text,text), public.update_profile_pac_personalization_internal(text,text,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.form_profile_pac_v1_internal(text,text,text,text,text,text), public.update_profile_pac_v1_internal(text,text,text,text,text), public.update_profile_pac_personalization_internal(text,text,text,jsonb) TO service_role;
COMMIT;
