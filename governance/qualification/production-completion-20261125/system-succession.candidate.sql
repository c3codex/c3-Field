-- Candidate for independent Registrar review; not installed.
-- Existing persistence stores qualification; no new authority primitive/table.
CREATE OR REPLACE FUNCTION public.c3field_legacy_predecessor_snapshot_v1()
RETURNS jsonb LANGUAGE sql STABLE SET search_path TO '' AS $$
 select jsonb_build_object(
 'pac',(select to_jsonb(p) from public.c3_pac p where pac_key='c3field_root_orientation_c3webpac_v1'),
 'members',(select coalesce(jsonb_agg(to_jsonb(m) order by member_key),'[]'::jsonb) from public.c3_pac_member m where pac_key='c3field_root_orientation_c3webpac_v1'),
 'relations',(select coalesce(jsonb_agg(to_jsonb(r) order by relation_key),'[]'::jsonb) from public.c3_pac_relation r where source_pac_key='c3field_root_orientation_c3webpac_v1'),
 'model_bindings',(select coalesce(jsonb_agg(to_jsonb(b) order by binding_key),'[]'::jsonb) from public.c3_pac_model_binding b where pac_key='c3field_root_orientation_c3webpac_v1')
 );
$$;
REVOKE ALL ON FUNCTION public.c3field_legacy_predecessor_snapshot_v1() FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.c3_validate_pac_supersession_v1(p_presented_pac jsonb, p_lock_prior boolean DEFAULT false)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_supersedes text := nullif(p_presented_pac->>'supersedes_pac_key','');
  v_new_pac_key text := nullif(p_presented_pac->>'pac_key','');
  v_prior public.c3_pac%rowtype;
  v_prior_env_key text;
  v_new_env_key text;
  v_new_effective boolean;
  v_successor_count integer;
  v_exact_legacy boolean := false;
  v_qualification public.measures_persistence_state%rowtype;
  v_legacy_snapshot jsonb;
begin
  if v_supersedes is null then
    return jsonb_build_object(
      'standing','PASS',
      'supersession_requested',false
    );
  end if;

  if v_new_pac_key is not null and v_new_pac_key=v_supersedes then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_self_reference',
      'prior_pac_key',v_supersedes
    );
  end if;

  if p_presented_pac ? 'is_effective'
     and jsonb_typeof(p_presented_pac->'is_effective') is distinct from 'boolean' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_new_pac_must_be_effective',
      'prior_pac_key',v_supersedes
    );
  end if;

  v_new_effective:=coalesce((p_presented_pac->>'is_effective')::boolean,true);
  if not v_new_effective then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_new_pac_must_be_effective',
      'prior_pac_key',v_supersedes
    );
  end if;

  if p_lock_prior then
    select * into v_prior
    from public.c3_pac
    where pac_key=v_supersedes
    for update;
  else
    select * into v_prior
    from public.c3_pac
    where pac_key=v_supersedes;
  end if;

  if not found then
    return jsonb_build_object(
      'standing','HLD',
      'reason','superseded_pac_unresolved',
      'prior_pac_key',v_supersedes
    );
  end if;

  if v_prior.registration_protocol is distinct from 'registrar_v1' then
    if v_prior.registration_protocol is distinct from 'legacy_pre_hardening'
       or v_supersedes is distinct from 'c3field_root_orientation_c3webpac_v1'
       or v_new_pac_key is distinct from 'c3field_field_of_possibility_c3webpac_v1'
       or v_prior.source_authority is distinct from 'c3field_public_presentation_authority_v1_2'
       or v_prior.envpac_key is distinct from 'c3envpac_field_v0_1'
       or v_prior.metadata#>>'{ownership_model,owner_subject_type}' is distinct from 'entity'
       or v_prior.metadata#>>'{ownership_model,owner_subject_key}' is distinct from 'c3_community_partners_dao_llc'
    then
      return jsonb_build_object('standing','HLD','reason','superseded_pac_not_hardened','prior_pac_key',v_supersedes);
    end if;
    if p_lock_prior then
      lock table public.c3_pac_member, public.c3_pac_relation, public.c3_pac_model_binding in share mode;
    end if;
    select * into v_qualification from public.measures_persistence_state
    where persistence_key=p_presented_pac#>>'{metadata,legacy_succession_qualification_key}'
      and process_key='governed_object_passage_process_v4'
      and oar2_key='oar2_c3field_field_of_possibility_production_20261124_001'
      and environment_key='env_c3_field'
      and object_type='legacy_pac_succession_qualification'
      and standing='qualified_for_exact_succession';
    if not found then
      return jsonb_build_object('standing','HLD','reason','exact_legacy_succession_qualification_required');
    end if;
    v_legacy_snapshot:=public.c3field_legacy_predecessor_snapshot_v1();
    if v_qualification.governed_state->'predecessor_snapshot' is distinct from v_legacy_snapshot
       or v_qualification.source_sha256 is distinct from encode(extensions.digest(convert_to(v_legacy_snapshot::text,'UTF8'),'sha256'),'hex')
       or v_qualification.governed_state->>'successor_sha256' is distinct from encode(extensions.digest(convert_to(p_presented_pac::text,'UTF8'),'sha256'),'hex')
       or v_qualification.lineage->>'predecessor_pac_key' is distinct from v_supersedes
       or v_qualification.lineage->>'successor_pac_key' is distinct from v_new_pac_key
       or nullif(v_qualification.custody->>'immutable_snapshot_reference','') is null
       or nullif(v_qualification.evidence->>'registrar_qualification_receipt','') is null
       or v_qualification.governed_state#>>'{owner_resolution,source_owner_type}' is distinct from 'entity'
       or v_qualification.governed_state#>>'{owner_resolution,source_owner_key}' is distinct from 'c3_community_partners_dao_llc'
       or v_qualification.governed_state#>>'{owner_resolution,owner_subject_type}' is distinct from 'system'
       or v_qualification.governed_state#>>'{owner_resolution,owner_subject_key}' is distinct from 'c3_field'
       or p_presented_pac->>'owner_subject_type' is distinct from 'system'
       or p_presented_pac->>'owner_subject_key' is distinct from 'c3_field'
       or nullif(p_presented_pac->>'owner_environment_key','') is null
       or v_qualification.governed_state#>>'{owner_resolution,owner_environment_key}' is distinct from p_presented_pac->>'owner_environment_key'
    then
      return jsonb_build_object('standing','HLD','reason','exact_legacy_succession_binding_mismatch');
    end if;
    if not exists (
      select 1 from public.c3_ci_role_call rc
      where rc.role_call_key=v_qualification.evidence->>'registrar_qualification_receipt'
        and rc.call_class='oar1_return'
        and rc.caller_role_key='c3_generative_ci_v1'
        and rc.callee_role_key='c3_registrar_ci_v1'
        and rc.standing='RETURNED'
        and rc.source_oar2_ref=v_qualification.oar2_key
        and rc.presented_sha256=v_qualification.source_sha256
        and rc.result_ref=v_qualification.persistence_key
        and rc.evidence->>'successor_sha256'=v_qualification.governed_state->>'successor_sha256'
    ) then
      return jsonb_build_object('standing','HLD','reason','legacy_succession_registrar_receipt_unresolved');
    end if;
    if p_presented_pac->>'owner_environment_key' is distinct from 'env_c3_field'
       or not exists(select 1 from public.c3_envpac ep
         where ep.envpac_key='c3envpac_field_v0_1' and ep.env_key='env_c3_field'
           and ep.owner_subject_type='system' and ep.owner_subject_key='c3_field' and ep.is_effective=true)
       or not exists(select 1 from public.codex_source_reference s
         where s.source_key='c3field_public_identity_authority_v1_0' and s.source_status='committed'
           and s.source_hash='819102c92167a77895671bd2b31bd29abeb571696274b1072de33e1ccccf61cf'
           and s.metadata->>'legal_entity'='c3 Community Partners DAO, LLC') then
      return jsonb_build_object('standing','HLD','reason','system_parent_formation_evidence_required');
    end if;
    v_exact_legacy:=true;
  end if;

  select count(*) into v_successor_count
  from public.c3_pac p
  where p.supersedes_pac_key=v_prior.pac_key
    and p.registration_protocol='registrar_v1'
    and p.is_effective=true
    and p.superseded_at is null
    and p.pac_key is distinct from v_new_pac_key;

  if v_successor_count>0 then
    return jsonb_build_object(
      'standing','HLD',
      'reason','superseded_pac_already_replaced',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if not v_prior.is_effective or v_prior.superseded_at is not null then
    return jsonb_build_object(
      'standing','HLD',
      'reason','superseded_pac_not_effective',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if v_prior.pac_type is distinct from p_presented_pac->>'pac_type' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_pac_type_mismatch',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if not v_exact_legacy and (v_prior.owner_subject_type is distinct from p_presented_pac->>'owner_subject_type'
     or v_prior.owner_subject_key is distinct from p_presented_pac->>'owner_subject_key') then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_owner_mismatch',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if not v_exact_legacy and v_prior.owner_environment_key is distinct from nullif(p_presented_pac->>'owner_environment_key','') then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_owner_environment_mismatch',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  select env_key into v_prior_env_key
  from public.c3_envpac
  where envpac_key=v_prior.envpac_key;

  select env_key into v_new_env_key
  from public.c3_envpac
  where envpac_key=p_presented_pac->>'envpac_key'
    and is_effective=true;

  if v_prior_env_key is null or v_new_env_key is null then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_environment_unresolved',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if v_prior_env_key is distinct from v_new_env_key then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_environment_mismatch',
      'prior_pac_key',v_prior.pac_key,
      'prior_env_key',v_prior_env_key,
      'new_env_key',v_new_env_key
    );
  end if;

  return jsonb_build_object(
    'standing','PASS',
    'supersession_requested',true,
    'prior_pac_key',v_prior.pac_key,
    'env_key',v_prior_env_key,
    'owner_subject_type',case when v_exact_legacy then p_presented_pac->>'owner_subject_type' else v_prior.owner_subject_type end,
    'owner_subject_key',case when v_exact_legacy then p_presented_pac->>'owner_subject_key' else v_prior.owner_subject_key end
  );
end $function$
