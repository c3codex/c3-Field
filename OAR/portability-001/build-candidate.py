from pathlib import Path
import re
root=Path(__file__).parent
baseline=(root.parents[1]/'supabase/migrations/20261004142250_my_env_portability_unknown_ownership_reference_only_v1_2.sql').read_text()
(root/'baseline.sql').write_text(baseline,encoding='utf-8',newline='\n')
helper="""-- SOURCE/TEST CANDIDATE ONLY. No production application authority.
create or replace function public.classify_my_env_pac_owner_v1(p public.c3_pac, subject text, owner_env text)
returns text language plpgsql stable security invoker set search_path='' as $classify$
declare
  m jsonb := p.metadata->'ownership_model';
  mt text := nullif(m->>'owner_subject_type','');
  mk text := nullif(m->>'owner_subject_key','');
  header_present boolean := p.owner_subject_type is not null or p.owner_subject_key is not null or p.owner_environment_key is not null;
begin
  if m is not null and m <> 'null'::jsonb and
     (jsonb_typeof(m)<>'object' or mt is null or mk is null) then return 'held'; end if;
  if header_present then
    if p.owner_subject_type is null or p.owner_subject_key is null then return 'held'; end if;
    if mt is not null and (mt is distinct from p.owner_subject_type or mk is distinct from p.owner_subject_key) then return 'held'; end if;
    if p.registration_protocol is distinct from 'registrar_v1' or p.registered_at is null or not exists (
      select 1 from public.c3_pac_registration_receipt r
      join public.c3_pac_boundary_evaluation e on e.evaluation_key=r.boundary_evaluation_key
      where r.pac_key=p.pac_key and r.standing='registered'
        and r.registration_sha256=p.registration_sha256
        and r.boundary_evaluation_key=p.boundary_evaluation_key
        and r.registrar_role_call_key=p.registrar_role_call_key
        and e.notchazz_result='PASS' and e.presented_pac_key=p.pac_key
        and e.presented_registration_sha256=p.registration_sha256
        and e.owner_subject_type=p.owner_subject_type and e.owner_subject_key=p.owner_subject_key
        and e.owner_environment_key is not distinct from p.owner_environment_key
    ) then return 'held'; end if;
    if p.owner_subject_type='individual' and p.owner_subject_key=subject then
      if p.owner_environment_key is distinct from owner_env then return 'held'; end if;
      return 'owned';
    end if;
    return 'reference';
  end if;
  -- Preserve installed legacy metadata semantics only for explicitly legacy records.
  -- A registrar record with absent header cannot fall back to metadata.
  if p.registration_protocol is distinct from 'legacy_pre_hardening' then return 'held'; end if;
  if mt='individual' and mk=subject then return 'owned'; end if;
  return 'reference';
end $classify$;
revoke all on function public.classify_my_env_pac_owner_v1(public.c3_pac,text,text) from public,anon,authenticated;
grant execute on function public.classify_my_env_pac_owner_v1(public.c3_pac,text,text) to service_role;

"""
candidate=baseline.replace('  v_transfer_blockers jsonb;', '  v_transfer_blockers jsonb;\n  v_owned_keys text[];')
needle='  select count(*) into v_owned_count'
qualification="""  if exists (
    select 1 from public.c3_pac p where p.envpac_key=v_envpac_key
      and public.classify_my_env_pac_owner_v1(p,v_relationship_key,v_env_key)='held'
  ) then
    return jsonb_build_object('standing','held','reason','pac_owner_authority_conflict_or_unresolved');
  end if;
  select coalesce(array_agg(p.pac_key order by p.pac_key),'{}'::text[]) into v_owned_keys
  from public.c3_pac p where p.envpac_key=v_envpac_key
    and public.classify_my_env_pac_owner_v1(p,v_relationship_key,v_env_key)='owned';

"""
candidate=candidate.replace(needle,qualification+needle,1)
pattern=r"coalesce\(\(\s*(p\.)?metadata->'ownership_model'->>'owner_subject_type'='individual'\s+and\s+(p\.)?metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key\s*\),false\)"
candidate,n=re.subn(pattern,lambda m: '('+('p.' if m[1] else '')+'pac_key=any(v_owned_keys))',candidate)
assert n==9,n
candidate=candidate.replace("'c3_my_env_portable_manifest_v1_1'", "'c3_my_env_portable_manifest_v1_2_owner_qualified'")
(root/'candidate.sql').write_text(helper+candidate,encoding='utf-8',newline='\n')
print('replaced ownership predicates:',n)
