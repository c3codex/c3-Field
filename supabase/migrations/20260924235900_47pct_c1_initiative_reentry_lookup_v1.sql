create or replace function public.resolve_c1_existing_relationship_for_initiative(
  p_primary_email text
)
returns jsonb
language plpgsql
stable
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_rel public.crs_relationship%rowtype;
  v_envpac public.c3_envpac%rowtype;
begin
  select * into v_rel
  from public.crs_relationship
  where lower(primary_email)=lower(btrim(p_primary_email))
    and is_active=true
    and coalesce(is_test_relationship,false)=false
    and relationship_standing='c1_C1_persisted'
  order by updated_at desc
  limit 1;

  if not found then
    return jsonb_build_object('accepted',false);
  end if;

  select * into v_envpac
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=v_rel.relationship_key
    and is_effective=true
  order by effective_at desc nulls last,created_at desc
  limit 1;

  return jsonb_strip_nulls(jsonb_build_object(
    'accepted',true,
    'relationship_key',v_rel.relationship_key,
    'owner_email',v_rel.primary_email,
    'owner_display_name',v_rel.display_name,
    'c1_standing',v_rel.relationship_standing,
    'environment_existing',found,
    'env_key',case when found then v_envpac.env_key else null end,
    'envpac_key',case when found then v_envpac.envpac_key else null end
  ));
end;
$function$;

revoke all on function public.resolve_c1_existing_relationship_for_initiative(text) from public,anon,authenticated;
grant execute on function public.resolve_c1_existing_relationship_for_initiative(text) to service_role;
