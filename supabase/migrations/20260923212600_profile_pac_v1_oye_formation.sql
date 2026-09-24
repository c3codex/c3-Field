-- ProfilePAC v1 OYE formation/resolution
-- OAR2: oar2_admit_pac_v1_and_wire_oye_profilepac_chazz_001_20260923
-- ProfilePAC presentation does not create authority.

create or replace function public.resolve_profile_pac_v1_internal(
  p_envpac_key text,
  p_subject_type text,
  p_subject_key text
)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  v_pac_key text;
begin
  select p.pac_key into v_pac_key
  from public.c3_pac p
  join public.c3_profile_pac pr on pr.pac_key=p.pac_key
  where p.envpac_key=p_envpac_key
    and p.pac_type='ProfilePAC'
    and p.is_effective=true
    and pr.subject_type=p_subject_type
    and pr.subject_key=p_subject_key
  order by p.effective_at desc nulls last,p.created_at desc
  limit 1;

  if v_pac_key is null then
    return jsonb_build_object(
      'standing','profile_not_formed',
      'envpac_key',p_envpac_key,
      'authority_effect','none'
    );
  end if;

  return public.c3_profile_pac_truth(v_pac_key);
end;
$$;

create or replace function public.form_profile_pac_v1_internal(
  p_envpac_key text,
  p_subject_type text,
  p_subject_key text,
  p_profile_class text,
  p_display_label text,
  p_visibility_scope text default 'private'
)
returns jsonb
language plpgsql
volatile
security definer
set search_path=public
as $$
declare
  v_envpac public.c3_envpac%rowtype;
  v_existing jsonb;
  v_pac_key text;
  v_profile_key text;
  v_eval jsonb;
begin
  if p_envpac_key is null or p_subject_type is null or p_subject_key is null then
    raise exception 'profile_identity_required';
  end if;

  select * into v_envpac
  from public.c3_envpac
  where envpac_key=p_envpac_key
    and is_effective=true;

  if not found then
    raise exception 'envpac_not_effective';
  end if;

  if v_envpac.owner_subject_type<>p_subject_type
     or v_envpac.owner_subject_key<>p_subject_key then
    raise exception 'profile_subject_not_envpac_owner';
  end if;

  if p_profile_class not in ('individual','organization','initiative','project','place') then
    raise exception 'profile_class_invalid';
  end if;

  if p_display_label is null or length(btrim(p_display_label))<1 or length(btrim(p_display_label))>160 then
    raise exception 'display_label_invalid';
  end if;

  if p_visibility_scope not in ('private','environment','relational','public') then
    raise exception 'visibility_scope_invalid';
  end if;

  if not exists (
    select 1 from public.c3_pac_type_contract
    where contract_key='pac_contract_profilepac_v1'
      and pac_type='ProfilePAC'
      and standing='active'
      and is_effective=true
  ) then
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
    'pac_base_contract_v1',true,
    jsonb_build_object(
      'formation_oar','oar2_admit_pac_v1_and_wire_oye_profilepac_chazz_001_20260923',
      'profile_does_not_create_authority',true,
      'subject_values_explicitly_submitted',true
    ),
    'pac_contract_profilepac_v1','pac_v1',
    v_envpac.custodian_subject_type,v_envpac.custodian_subject_key,v_envpac.custody_provider,
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

  return jsonb_build_object(
    'ok',true,
    'created',true,
    'truth',public.c3_profile_pac_truth(v_pac_key)
  );
end;
$$;

revoke all on function public.resolve_profile_pac_v1_internal(text,text,text) from public;
revoke all on function public.form_profile_pac_v1_internal(text,text,text,text,text,text) from public;
revoke execute on function public.resolve_profile_pac_v1_internal(text,text,text) from anon,authenticated;
revoke execute on function public.form_profile_pac_v1_internal(text,text,text,text,text,text) from anon,authenticated;
grant execute on function public.resolve_profile_pac_v1_internal(text,text,text) to service_role;
grant execute on function public.form_profile_pac_v1_internal(text,text,text,text,text,text) to service_role;
