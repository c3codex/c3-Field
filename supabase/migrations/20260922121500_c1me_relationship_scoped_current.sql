-- OAR2: relationship-scoped c1ME CURRENT formation and resolution.
-- Cross-email Named Individual reconciliation is deliberately NOT a prerequisite
-- for ordinary owner entry. One verified C1 relationship resolves only its own
-- effective EnvPac and environment.

create or replace function public.ensure_c1me_current_internal(p_relationship_key text)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  r public.crs_relationship%rowtype;
  v_envpac_count integer;
  v_envpac text;
  v_env text;
  v_grant_count integer;
  v_evidence_ref text;
  v_current_count integer;
  v_current text;
  v_hash text;
begin
  if p_relationship_key is null or btrim(p_relationship_key)='' then
    return jsonb_build_object('resolution','auth_required','reason_code','missing_verified_subject');
  end if;

  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key
    and is_active=true
    and coalesce(is_test_relationship,false)=false;

  if not found or r.relationship_standing<>'c1_C1_persisted' then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','c1_not_persisted',
      'may_create_personal_environment',false);
  end if;

  select count(*),min(envpac_key),min(env_key)
    into v_envpac_count,v_envpac,v_env
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=p_relationship_key
    and is_effective=true
    and standing='effective';

  if v_envpac_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold',
      'reason_code',case when v_envpac_count=0 then 'canonical_env_missing' else 'canonical_env_ambiguous' end,
      'may_create_personal_environment',false);
  end if;

  select count(*),min(evidence_ref)
    into v_grant_count,v_evidence_ref
  from public.c3_envpac_access_grant
  where envpac_key=v_envpac
    and subject_type='individual'
    and subject_key=p_relationship_key
    and relation_role='owner'
    and standing='active'
    and revoked_at is null
    and (expires_at is null or expires_at>now());

  if v_grant_count<>1 or v_evidence_ref is null then
    return jsonb_build_object('resolution','reconciliation_hold',
      'reason_code','owner_grant_missing_or_ambiguous','may_create_personal_environment',false);
  end if;

  select count(*),min(current_state_key)
    into v_current_count,v_current
  from public.c3_current_state
  where env_key=v_env and is_current=true and superseded_at is null;

  if v_current_count>1 then
    return jsonb_build_object('resolution','reconciliation_hold',
      'reason_code','personal_current_ambiguous','may_create_personal_environment',false);
  end if;

  if v_current_count=0 then
    v_current:='current_'||v_env||'_v1';

    insert into public.c3_current_state(
      current_state_key,env_key,state_version,standing,effective_at,
      formation_authority_ref,advance_disposition_ref,predecessor_current_state_key,
      is_current,source_grammar_key,metadata,created_by
    ) values (
      v_current,v_env,1,'c1_personal_environment',now(),
      'crs_relationship_event:'||v_evidence_ref,null,null,
      true,'c1me_owner_current_v1',
      jsonb_build_object(
        'current','C1',
        'relationship_key',p_relationship_key,
        'envpac_key',v_envpac,
        'formation_source','ensure_c1me_current_internal',
        'source_oar2','oar2_codex_c3field_c1me_end_to_end_media_css_20260922_001',
        'public_release_created',false,
        'cross_email_identity_reconciliation',false
      ),
      'op044'
    );

    v_hash:=encode(digest(
      v_env||'|'||v_envpac||'|'||p_relationship_key||'|'||v_evidence_ref,
      'sha256'
    ),'hex');

    insert into public.c3_current_evidence_ref(
      current_evidence_ref_key,current_state_key,evidence_key,evidence_class,
      asset_key,content_hash,hash_algorithm,authoritative_custody_type,
      authoritative_custody_provider,authoritative_custody_identifier,
      authoritative_custody_location,evidence_standing,metadata,attested_by
    ) values (
      'evidence_'||md5(v_current||'|'||v_evidence_ref),
      v_current,v_evidence_ref,'c1_relationship_persistence',null,
      v_hash,'sha256','registry_record','supabase',
      'public.crs_relationship_event',v_evidence_ref,'registered',
      jsonb_build_object(
        'relationship_key',p_relationship_key,
        'envpac_key',v_envpac,
        'current_formed_from_existing_owner_evidence',true,
        'no_new_identity_created',true
      ),
      'op044'
    ) on conflict (current_state_key,evidence_key,content_hash) do nothing;
  end if;

  return jsonb_build_object(
    'resolution','existing_c1',
    'next_encounter','enter_existing_environment',
    'relationship_ref',p_relationship_key,
    'envpac_ref',v_envpac,
    'env_key',v_env,
    'current_ref',v_current,
    'may_create_personal_environment',false,
    'reason_code','resolved_from_registered_current'
  );
end;
$$;

revoke all on function public.ensure_c1me_current_internal(text) from public,anon,authenticated;
grant execute on function public.ensure_c1me_current_internal(text) to service_role;

create or replace function public.resolve_c1me_current_internal(p_relationship_key text)
returns jsonb
language plpgsql
security invoker
set search_path=public,pg_temp
as $$
declare
  r public.crs_relationship%rowtype;
  v_envpac_count integer;
  v_envpac text;
  v_env text;
  v_grant_count integer;
  v_current_count integer;
  v_current text;
  v_evidence_count integer;
begin
  if p_relationship_key is null or btrim(p_relationship_key)='' then
    return jsonb_build_object('resolution','auth_required','reason_code','missing_verified_subject');
  end if;

  select * into r from public.crs_relationship
  where relationship_key=p_relationship_key
    and is_active=true
    and coalesce(is_test_relationship,false)=false;

  if not found or r.relationship_standing<>'c1_C1_persisted' then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','c1_not_persisted',
      'may_create_personal_environment',false);
  end if;

  select count(*),min(envpac_key),min(env_key)
    into v_envpac_count,v_envpac,v_env
  from public.c3_envpac
  where owner_subject_type='individual'
    and owner_subject_key=p_relationship_key
    and is_effective=true
    and standing='effective';

  if v_envpac_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold',
      'reason_code',case when v_envpac_count=0 then 'canonical_env_missing' else 'canonical_env_ambiguous' end,
      'may_create_personal_environment',false);
  end if;

  select count(*) into v_grant_count
  from public.c3_envpac_access_grant
  where envpac_key=v_envpac
    and subject_type='individual'
    and subject_key=p_relationship_key
    and relation_role='owner'
    and standing='active'
    and revoked_at is null
    and (expires_at is null or expires_at>now());

  if v_grant_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','owner_grant_missing_or_ambiguous',
      'may_create_personal_environment',false);
  end if;

  select count(*),min(current_state_key)
    into v_current_count,v_current
  from public.c3_current_state
  where env_key=v_env and is_current=true and effective_at<=now() and superseded_at is null;

  if v_current_count<>1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','personal_current_missing_or_ambiguous',
      'may_create_personal_environment',false);
  end if;

  select count(*) into v_evidence_count
  from public.c3_current_evidence_ref
  where current_state_key=v_current
    and evidence_standing in ('effective','attested','accepted','registered');

  if v_evidence_count<1 then
    return jsonb_build_object('resolution','reconciliation_hold','reason_code','current_evidence_missing',
      'may_create_personal_environment',false);
  end if;

  return jsonb_build_object(
    'resolution','existing_c1',
    'next_encounter','enter_existing_environment',
    'relationship_ref',p_relationship_key,
    'envpac_ref',v_envpac,
    'env_key',v_env,
    'current_ref',v_current,
    'may_create_personal_environment',false,
    'reason_code','resolved_from_registered_current'
  );
end;
$$;

revoke all on function public.resolve_c1me_current_internal(text) from public,anon,authenticated;
grant execute on function public.resolve_c1me_current_internal(text) to service_role;
