-- Owner-editable ProfilePAC visibility/display update.
-- Runtime admission remains owner-bound through the My Environment server session.
create or replace function public.update_profile_pac_v1_internal(
  p_envpac_key text,
  p_subject_type text,
  p_subject_key text,
  p_display_label text,
  p_visibility_scope text
)
returns jsonb
language plpgsql
volatile
security definer
set search_path=public,pg_temp
as $$
declare
  v_envpac public.c3_envpac%rowtype;
  v_truth jsonb;
  v_pac_key text;
  v_eval jsonb;
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

  if not found then raise exception 'profile_row_missing'; end if;

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

  if not found then raise exception 'profile_pac_registry_row_missing'; end if;

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
$$;

revoke all on function public.update_profile_pac_v1_internal(text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.update_profile_pac_v1_internal(text,text,text,text,text) to service_role;
