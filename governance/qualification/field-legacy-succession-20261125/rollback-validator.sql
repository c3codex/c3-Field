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
    return jsonb_build_object(
      'standing','HLD',
      'reason','superseded_pac_not_hardened',
      'prior_pac_key',v_supersedes
    );
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

  if v_prior.owner_subject_type is distinct from p_presented_pac->>'owner_subject_type'
     or v_prior.owner_subject_key is distinct from p_presented_pac->>'owner_subject_key' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','supersession_owner_mismatch',
      'prior_pac_key',v_prior.pac_key
    );
  end if;

  if v_prior.owner_environment_key is distinct from nullif(p_presented_pac->>'owner_environment_key','') then
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
    'owner_subject_type',v_prior.owner_subject_type,
    'owner_subject_key',v_prior.owner_subject_key
  );
end $function$;
