-- Source candidate only; not installed. Existing owner termination serialized on its target.
CREATE OR REPLACE FUNCTION public.terminate_my_env_owner_v1(p_request jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
declare
  v_relationship_key text := nullif(btrim(p_request->>'relationship_key'),'');
  v_env_key text := nullif(btrim(p_request->>'env_key'),'');
  v_envpac_key text := nullif(btrim(p_request->>'envpac_key'),'');
  v_disposition text := nullif(btrim(p_request->>'disposition'),'');
  v_prior_receipt uuid;
  v_preview jsonb;
  v_manifest jsonb;
  v_hash text;
  v_receipt uuid;
  v_event_key text;
  v_now timestamptz := now();
begin
  if v_relationship_key is null or v_env_key is null or v_envpac_key is null then
    return jsonb_build_object('standing','held','reason','owner_environment_context_required');
  end if;
  if v_disposition not in ('retain_c3_field_custody','portable_export','custody_transferred') then
    return jsonb_build_object('standing','held','reason','pac_disposition_required');
  end if;

  -- Serialize existing owner lifecycle against the target EnvPAC before checking active state.
  -- No new authority, role grant or change to the existing owner checks.
  perform 1 from public.c3_envpac
  where envpac_key=v_envpac_key and env_key=v_env_key
    and owner_subject_type='individual' and owner_subject_key=v_relationship_key
  for update;

  if not exists (
    select 1
    from public.c3_environment e
    join public.c3_envpac ep on ep.env_key=e.env_key
    join public.crs_relationship r on r.relationship_key=v_relationship_key
    where e.env_key=v_env_key and e.environment_class='c3me_individual_environment' and e.is_active=true
      and ep.envpac_key=v_envpac_key and ep.owner_subject_type='individual' and ep.owner_subject_key=v_relationship_key
      and ep.is_effective=true and r.is_active=true
  ) then
    return jsonb_build_object('standing','held','reason','active_owner_environment_unresolved');
  end if;

  if not exists (
    select 1 from public.c3_envpac_access_grant g
    where g.envpac_key=v_envpac_key and g.subject_type='individual' and g.subject_key=v_relationship_key
      and g.relation_role='owner' and g.standing='active' and g.revoked_at is null
      and (g.expires_at is null or g.expires_at>v_now) and coalesce(g.scope,'{}'::jsonb)->'rights' ? 'revoke'
  ) then
    return jsonb_build_object('standing','held','reason','owner_termination_right_unresolved');
  end if;

  if v_disposition in ('portable_export','custody_transferred') then
    begin v_prior_receipt:=(p_request->>'portability_receipt_key')::uuid;
    exception when others then return jsonb_build_object('standing','held','reason','valid_portability_receipt_required');
    end;
    if not exists (
      select 1 from public.c3_my_env_owner_lifecycle_receipt x
      where x.receipt_key=v_prior_receipt and x.relationship_key=v_relationship_key and x.envpac_key=v_envpac_key
        and x.standing='completed'
        and ((v_disposition='portable_export' and x.action='portable_export') or (v_disposition='custody_transferred' and x.action='custody_transfer'))
    ) then
      return jsonb_build_object('standing','held','reason','matching_portability_receipt_required');
    end if;
  end if;

  v_preview:=public.resolve_my_env_owner_portability_v1(jsonb_build_object('action','preview','relationship_key',v_relationship_key,'env_key',v_env_key,'envpac_key',v_envpac_key));
  if v_preview->>'standing'<>'resolved' then
    return jsonb_build_object('standing','held','reason','termination_manifest_unresolved','portability',v_preview);
  end if;
  v_manifest:=v_preview->'manifest';
  v_hash:=v_preview->>'manifest_sha256';

  insert into public.c3_my_env_owner_lifecycle_receipt(
    relationship_key,env_key,envpac_key,action,standing,disposition,portable_manifest,manifest_sha256,metadata,completed_at
  ) values (
    v_relationship_key,v_env_key,v_envpac_key,'terminate','completed',v_disposition,v_manifest,v_hash,
    jsonb_strip_nulls(jsonb_build_object('owner_authorized',true,'prior_portability_receipt_key',v_prior_receipt,'ownership_survives_termination',true,'lineage_preserved',true,'hard_delete',false)),v_now
  ) returning receipt_key into v_receipt;

  update public.c3_env_runtime_session set standing='revoked',revoked_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where subject_type='individual' and subject_key=v_relationship_key and standing='active' and revoked_at is null;

  update public.c3_env_share_reference set share_state='revoked',revoked_at=v_now,updated_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where owner_subject_key=v_relationship_key and share_state='active' and revoked_at is null;

  update public.c3_env_invite_acceptance ia set acceptance_state='held',updated_at=v_now,
    metadata=ia.metadata||jsonb_build_object('hold_reason','source_owner_terminated_my_env','termination_receipt_key',v_receipt)
  where ia.acceptance_state='pending' and exists (
    select 1 from public.c3_env_share_reference sr where sr.share_reference=ia.share_reference and sr.owner_subject_key=v_relationship_key
  );

  update public.c3_env_native_connection set standing='revoked',revoked_at=v_now,updated_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where standing='active' and revoked_at is null and (source_relationship_key=v_relationship_key or target_relationship_key=v_relationship_key);

  update public.c3_initiative_connection_projection set standing='revoked',
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where standing='active' and (source_relationship_key=v_relationship_key or target_relationship_key=v_relationship_key);

  update public.c3_env_initiative_visibility set standing='revoked',revoked_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where relationship_key=v_relationship_key and standing='active' and revoked_at is null;

  update public.c2_mdm_participation_relation set standing='revoked',passage_standing='revoked_by_owner_termination',revoked_at=v_now,updated_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where participant_relationship_key=v_relationship_key and standing='active' and revoked_at is null;

  update public.c3_env_directory_contact set standing='inactive',updated_at=v_now,
    metadata=metadata||jsonb_build_object('inactive_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where envpac_key=v_envpac_key and standing='active';

  update public.c3_cancom_device_key set standing='revoked',revoked_at=v_now,last_seen_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where relationship_key=v_relationship_key and standing='active' and revoked_at is null;

  update public.c3_envpac_access_grant set standing='revoked',revoked_at=v_now,
    metadata=metadata||jsonb_build_object('revoked_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where subject_type='individual' and subject_key=v_relationship_key and standing='active' and revoked_at is null;

  update public.c3_envpac_capability_grant set standing='inactive',updated_at=v_now,
    scope=scope||jsonb_build_object('inactive_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where envpac_key=v_envpac_key and standing='active';

  update public.c3_envpac_environment_binding set standing='inactive',updated_at=v_now,
    metadata=metadata||jsonb_build_object('inactive_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where envpac_key=v_envpac_key and standing='active';

  update public.c3_envpac_rooted_system set standing='inactive',updated_at=v_now,
    metadata=metadata||jsonb_build_object('inactive_reason','owner_terminated_my_env','termination_receipt_key',v_receipt)
  where envpac_key=v_envpac_key and standing='active';

  update public.c3_envpac set standing='terminated_owner',is_effective=false,superseded_at=coalesce(superseded_at,v_now),
    metadata=metadata||jsonb_build_object('terminated_at',v_now,'terminated_by_owner',v_relationship_key,'termination_receipt_key',v_receipt,'pac_disposition',v_disposition,'ownership_preserved',true,'lineage_preserved',true),
    updated_at=v_now
  where envpac_key=v_envpac_key;

  update public.c3_environment set standing='terminated_owner',is_active=false,
    metadata=metadata||jsonb_build_object('terminated_at',v_now,'terminated_by_owner',v_relationship_key,'termination_receipt_key',v_receipt,'pac_disposition',v_disposition,'hard_delete',false),
    updated_at=v_now
  where env_key=v_env_key;

  update public.crs_relationship set relationship_standing='owner_terminated_my_env',is_active=false,
    metadata=metadata||jsonb_build_object('my_env_terminated_at',v_now,'termination_receipt_key',v_receipt,'terminated_env_key',v_env_key,'terminated_envpac_key',v_envpac_key,'explicit_reentry_required',true),
    updated_at=v_now
  where relationship_key=v_relationship_key;

  v_event_key:='event_'||replace(gen_random_uuid()::text,'-','');
  insert into public.crs_relationship_event(
    event_key,relationship_key,event_type,source_system,source_record_type,source_record_ref,event_standing,next_permitted_encounter,metadata,occurred_at
  ) values (
    v_event_key,v_relationship_key,'owner_terminated_my_env','c3_field','my_env_owner_lifecycle_receipt',v_receipt::text,
    'terminated_by_owner','explicit_reentry',
    jsonb_build_object('env_key',v_env_key,'envpac_key',v_envpac_key,'pac_disposition',v_disposition,'portable_manifest_sha256',v_hash,'ownership_preserved',true,'lineage_preserved',true,'hard_delete',false),v_now
  );

  return jsonb_build_object(
    'standing','terminated','relationship_key',v_relationship_key,'env_key',v_env_key,'envpac_key',v_envpac_key,
    'termination_receipt_key',v_receipt,'event_key',v_event_key,'pac_disposition',v_disposition,
    'portable_manifest_sha256',v_hash,'terminal_manifest',v_manifest,'ownership_preserved',true,'lineage_preserved',true,'explicit_reentry_required',true
  );
end;
$function$;
