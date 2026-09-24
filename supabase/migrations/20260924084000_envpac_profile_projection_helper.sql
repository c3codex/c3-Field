-- Internal EnvPAC profile projection helper; runtime may assemble the same projection server-side.
create or replace function public.resolve_envpac_profile_projection_v1_internal(
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
  v_envpac public.c3_envpac%rowtype;
  v_profile_key text;
  v_truth jsonb;
begin
  select * into v_envpac from public.c3_envpac where envpac_key=p_envpac_key and is_effective=true;
  if not found then
    return jsonb_build_object('standing','envpac_not_effective','envpac_key',p_envpac_key,'profile_pac',null,'authority_effect','none');
  end if;
  if v_envpac.owner_subject_type<>p_subject_type or v_envpac.owner_subject_key<>p_subject_key then
    return jsonb_build_object('standing','envpac_subject_mismatch','envpac_key',p_envpac_key,'profile_pac',null,'authority_effect','none');
  end if;

  select p.pac_key into v_profile_key
  from public.c3_pac p join public.c3_profile_pac pr on pr.pac_key=p.pac_key
  where p.envpac_key=p_envpac_key and p.pac_type='ProfilePAC' and p.is_effective=true
    and pr.subject_type=p_subject_type and pr.subject_key=p_subject_key
  order by p.effective_at desc nulls last,p.created_at desc limit 1;

  if v_profile_key is null then
    return jsonb_build_object('standing','envpac_profile_unformed','envpac_key',p_envpac_key,'profile_pac',null,'authority_effect','none');
  end if;

  v_truth:=public.c3_profile_pac_truth(v_profile_key);
  if coalesce(v_truth->'evaluation'->>'resolution_state','held')<>'pass' then
    return jsonb_build_object('standing','envpac_profile_held','envpac_key',p_envpac_key,'profile_pac',v_truth,'authority_effect','none');
  end if;
  return jsonb_build_object('standing','envpac_profile_resolved','envpac_key',p_envpac_key,'profile_pac',v_truth,'authority_effect','none');
end;
$$;

revoke all on function public.resolve_envpac_profile_projection_v1_internal(text,text,text) from public;
revoke execute on function public.resolve_envpac_profile_projection_v1_internal(text,text,text) from anon,authenticated;
grant execute on function public.resolve_envpac_profile_projection_v1_internal(text,text,text) to service_role;
