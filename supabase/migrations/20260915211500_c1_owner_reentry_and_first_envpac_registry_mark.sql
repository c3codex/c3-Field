-- Persisted C1 owners may re-enter their existing environment without creating a second identity.
create or replace function public.resolve_c1_owner_reentry(p_primary_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.crs_relationship%rowtype;
  p public.c3_envpac%rowtype;
begin
  select * into r
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

  select * into p
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=r.relationship_key
    and is_effective=true
  order by effective_at desc nulls last, created_at desc
  limit 1;

  if not found then
    return jsonb_build_object('accepted',false);
  end if;

  return jsonb_build_object(
    'accepted',true,
    'relationship_key',r.relationship_key,
    'owner_email',r.primary_email,
    'owner_display_name',r.display_name,
    'env_key',p.env_key,
    'envpac_key',p.envpac_key,
    'standing','c1_connected',
    'c1_standing',r.relationship_standing,
    'portable',p.portable
  );
end;
$$;

revoke all on function public.resolve_c1_owner_reentry(text) from public, anon, authenticated;
grant execute on function public.resolve_c1_owner_reentry(text) to service_role;

insert into public.measures_registry(
  registry_key, display_title, registry_family, encounter_type, material_family,
  sequence_order, release_state, access_state, phase_label, is_active, metadata
)
values(
  'c3envpac_first_individual_v0_1',
  'First Individual c3EnvPac',
  'spine',
  'c3envpac_proof',
  'obsidian',
  1,
  'sealed',
  'gated',
  'first individual owner environment formed from persisted C1',
  true,
  jsonb_build_object(
    'envpac_key','c3envpac_person_eea672f5a7676dad4316755b_v0_1',
    'env_key','env_person_eea672f5a7676dad4316755b',
    'relationship_key','crs_93e901234ae044a396654ee80644b005',
    'persistence_event_key','event_da7c2d30f22843c6bc74b36c1c639554',
    'owner_subject_type','individual',
    'custodian_subject_key','c3_field',
    'portable',true,
    'standing','effective',
    'proof_role','first_person_c3field_owner_environment',
    'source','c1_live_happy_path_2026_09_15'
  )
)
on conflict (registry_key) do update
set metadata=excluded.metadata,
    phase_label=excluded.phase_label,
    release_state=excluded.release_state,
    access_state=excluded.access_state,
    is_active=true,
    updated_at=now();
