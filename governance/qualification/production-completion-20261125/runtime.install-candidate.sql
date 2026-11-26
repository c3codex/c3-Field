-- Source candidate only; not installed or independently accepted. ACLs are unchanged.
BEGIN;
DO $guard$ BEGIN IF encode(extensions.digest(convert_to(pg_get_functiondef('c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text)'::regprocedure),'UTF8'),'sha256'),'hex') <> '29fb0b821f7337a0b5e41dc871c4ee63ecbeb94205f6e66c031f75d5525f02f5' THEN RAISE EXCEPTION 'held_source_preimage_mismatch: c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text)'; END IF; END $guard$;
DO $guard$ BEGIN IF encode(extensions.digest(convert_to(pg_get_functiondef('free_resolve_pac_encounter_v1(text,text,text)'::regprocedure),'UTF8'),'sha256'),'hex') <> '6e960f5b9dec20f533f85a18be55c5e9e070881b4fc65fe65aef08448611802c' THEN RAISE EXCEPTION 'held_source_preimage_mismatch: free_resolve_pac_encounter_v1(text,text,text)'; END IF; END $guard$;
DO $guard$ BEGIN IF encode(extensions.digest(convert_to(pg_get_functiondef('terminate_my_env_owner_v1(jsonb)'::regprocedure),'UTF8'),'sha256'),'hex') <> '95b81d207113027b368536235bdaf33a4c0758aa12957d3bfa97c437444de844' THEN RAISE EXCEPTION 'held_source_preimage_mismatch: terminate_my_env_owner_v1(jsonb)'; END IF; END $guard$;
CREATE OR REPLACE FUNCTION public.c3_pac_set_personal_encounter_projection_v1(p_pac_key text, p_subject_key text, p_action text, p_encounter_key text DEFAULT 'c3envpac_c2me_v0_1'::text, p_surface_scope text DEFAULT 'c3field_only'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_pac public.c3_pac%rowtype;
  v_envpac public.c3_envpac%rowtype;
  v_now timestamptz:=now();
  v_authorized boolean;
  v_standing text;
  v_host text;
  v_url text;
  v_existing_reference uuid;
  v_current_hash text;
  v_review_hash text;
  v_approval_hash text;
begin
  if p_action not in ('AUTHORIZE','REVOKE') then
    return jsonb_build_object('standing','DNR','reason','unsupported_projection_action');
  end if;

  if p_surface_scope not in ('c3field_only','c3field_plus_canopy') then
    return jsonb_build_object('standing','DNR','reason','unsupported_surface_scope');
  end if;

  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key and is_effective=true
  for update;

  if not found then
    return jsonb_build_object('standing','DNR','reason','pac_unavailable');
  end if;

  if v_pac.custodian_subject_type is distinct from 'individual'
     or v_pac.custodian_subject_key is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody' then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_current_hash:=public.c3_pac_review_sha256_v1(p_pac_key);
  v_review_hash:=v_pac.metadata#>>'{review_resolution,review_snapshot_hash}';
  v_approval_hash:=v_pac.metadata#>>'{custody_approval,approval_snapshot_hash}';

  if p_action='AUTHORIZE' then
    if coalesce(v_pac.metadata#>>'{custody_approval,standing}','')<>'APPROVED' then
      return jsonb_build_object('standing','DNR','reason','custody_approval_required');
    end if;

    if coalesce(v_pac.metadata#>>'{review_resolution,standing}','')<>'REVIEWED'
       or v_review_hash is distinct from v_current_hash
       or v_approval_hash is distinct from v_current_hash then
      return jsonb_build_object(
        'standing','DNR',
        'reason','current_reviewed_approval_required',
        'current_snapshot_hash',v_current_hash,
        'review_snapshot_hash',v_review_hash,
        'approval_snapshot_hash',v_approval_hash
      );
    end if;
  end if;

  select * into v_envpac
  from public.c3_envpac
  where envpac_key=v_pac.envpac_key
    and owner_subject_type='individual'
    and owner_subject_key=p_subject_key
    and is_effective=true;

  if not found then
    return jsonb_build_object('standing','DNR','reason','owner_envpac_required');
  end if;

  -- Owner withdrawal is mutable authorization, never an immutable PAC edit.
  if v_pac.registration_protocol='registrar_v1' and p_action='REVOKE' then
    update public.c3_envpac_access_grant
    set scope=coalesce(scope,'{}'::jsonb)||jsonb_build_object(
      'withdrawn_pac_projections',case
        when coalesce(scope->'withdrawn_pac_projections','[]'::jsonb) ? p_pac_key
          then scope->'withdrawn_pac_projections'
        else coalesce(scope->'withdrawn_pac_projections','[]'::jsonb)||jsonb_build_array(p_pac_key)
      end),
      metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('projection_withdrawals',
        coalesce(metadata->'projection_withdrawals','{}'::jsonb)||jsonb_build_object(p_pac_key,
          coalesce(metadata->'projection_withdrawals'->p_pac_key,jsonb_build_object(
            'pac_key',p_pac_key,'owner_subject_key',p_subject_key,'encounter_key',p_encounter_key,
            'standing','REVOKED','withdrawn_at',v_now,'authority','individual_owner'))))
    where envpac_key=v_pac.envpac_key and subject_type='individual'
      and subject_key=p_subject_key and relation_role='owner'
      and standing='active' and revoked_at is null
      and (expires_at is null or expires_at>v_now)
      and coalesce(scope,'{}'::jsonb)->'rights' ? 'revoke';
    if not found then
      return jsonb_build_object('standing','DNR','reason','owner_projection_revoke_right_required');
    end if;
    update public.c3_envpac_canopy_reference
    set reference_state='removed',removed_at=coalesce(removed_at,v_now),updated_at=v_now
    where envpac_key=v_pac.envpac_key and owner_subject_key=p_subject_key
      and metadata->>'source_pac_key'=p_pac_key and reference_state<>'removed';
    return jsonb_build_object('standing','HLD','pac_key',p_pac_key,
      'encounter_projection_standing','REVOKED','authorized_by_owner',false,
      'presentation_scope','none','surface_projections','[]'::jsonb,
      'authorization_state_source','owner_access_grant','resolved_at',v_now);
  end if;
  if v_pac.registration_protocol='registrar_v1' and p_action='AUTHORIZE'
     and exists(select 1 from public.c3_envpac_access_grant g
       where g.envpac_key=v_pac.envpac_key and g.subject_type='individual'
         and g.subject_key=p_subject_key and g.relation_role='owner'
         and coalesce(g.scope->'withdrawn_pac_projections','[]'::jsonb) ? p_pac_key) then
    return jsonb_build_object('standing','HLD','reason','withdrawn_projection_requires_qualified_owner_reauthorization');
  end if;

  v_authorized:=p_action='AUTHORIZE';
  v_standing:=case when v_authorized then 'AUTHORIZED' else 'REVOKED' end;

  update public.c3_pac
  set metadata=jsonb_set(
        coalesce(metadata,'{}'::jsonb),
        '{encounter_projection}',
        jsonb_build_object(
          'standing',v_standing,
          'encounter_key',p_encounter_key,
          'projection_surface','c2ME_env',
          'owner_authorization_required',true,
          'authorized_by_owner',v_authorized,
          'owner_subject_key',p_subject_key,
          'authorization_surface','my_pacs',
          'presentation_scope',case when v_authorized then p_surface_scope else 'none' end,
          'surface_projections',case
            when not v_authorized then '[]'::jsonb
            when p_surface_scope='c3field_plus_canopy'
              then jsonb_build_array('c3field','canopy')
            else jsonb_build_array('c3field')
          end,
          'authorization_snapshot_hash',case when v_authorized then v_current_hash else null end,
          'resolved_at',v_now
        ),
        true
      ),
      updated_at=v_now
  where pac_key=p_pac_key;

  v_host:=nullif(v_pac.metadata->>'canonical_host','');
  if v_host is null then
    v_host:=nullif(v_pac.metadata#>>'{public_presentation,canonical_host}','');
  end if;
  if v_host is not null then v_url:='https://'||v_host||'/'; end if;

  select reference_key into v_existing_reference
  from public.c3_envpac_canopy_reference
  where envpac_key=v_pac.envpac_key
    and owner_subject_key=p_subject_key
    and metadata->>'source_pac_key'=p_pac_key
  order by created_at desc
  limit 1;

  if v_authorized and p_surface_scope='c3field_plus_canopy' and v_url is not null then
    if v_existing_reference is null then
      insert into public.c3_envpac_canopy_reference(
        reference_key,envpac_key,owner_subject_key,surface_label,display_label,
        external_url,handle,sort_order,reference_state,metadata,created_at,updated_at
      ) values (
        gen_random_uuid(),v_pac.envpac_key,p_subject_key,'c3 Field',
        coalesce(v_pac.metadata#>>'{public_presentation,title}',p_pac_key),
        v_url,
        coalesce(v_pac.metadata#>>'{public_presentation,title}',p_pac_key),
        10,'active',
        jsonb_build_object(
          'source_process','personal_pac_encounter_projection_v1',
          'selection_class','canopy_reference',
          'source_pac_key',p_pac_key,
          'encounter_key',p_encounter_key,
          'projection_class','owner_selected_encounter_surface',
          'projection_snapshot_hash',v_current_hash,
          'custody_transfer',false,
          'owner_surface_scope','c3field_plus_canopy'
        ),
        v_now,v_now
      );
    else
      update public.c3_envpac_canopy_reference
      set reference_state='active',
          removed_at=null,
          external_url=v_url,
          metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
            'projection_class','owner_selected_encounter_surface',
            'projection_snapshot_hash',v_current_hash,
            'owner_surface_scope','c3field_plus_canopy',
            'custody_transfer',false
          ),
          updated_at=v_now
      where reference_key=v_existing_reference;
    end if;
  elsif v_existing_reference is not null then
    update public.c3_envpac_canopy_reference
    set reference_state='removed',
        removed_at=v_now,
        metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
          'removed_by_owner_surface_scope',true,
          'owner_surface_scope',case when v_authorized then 'c3field_only' else 'none' end
        ),
        updated_at=v_now
    where reference_key=v_existing_reference
      and reference_state<>'removed';
  end if;

  return jsonb_build_object(
    'standing',case when v_authorized then 'ACT' else 'HLD' end,
    'pac_key',p_pac_key,
    'encounter_projection_standing',v_standing,
    'encounter_key',p_encounter_key,
    'authorized_by_owner',v_authorized,
    'presentation_scope',case when v_authorized then p_surface_scope else 'none' end,
    'surface_projections',case
      when not v_authorized then '[]'::jsonb
      when p_surface_scope='c3field_plus_canopy' then jsonb_build_array('c3field','canopy')
      else jsonb_build_array('c3field')
    end,
    'authorization_snapshot_hash',case when v_authorized then v_current_hash else null end,
    'resolved_at',v_now
  );
end;
$function$
;

CREATE OR REPLACE FUNCTION public.free_resolve_pac_encounter_v1(p_free_call_key text, p_selector_type text, p_selector_value text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions', 'pg_temp'
AS $function$
declare
  v_call public.c3_free_call%rowtype;
  v_snapshot public.c3_free_pac_snapshot%rowtype;
  v_pac public.c3_pac%rowtype;
  v_count integer;
  v_projection_sha text;
  v_trace jsonb;
  v_binding_count integer;
  v_current_count integer;
  v_envpac_gap_count integer;
  v_accrual_gap_count integer;
begin
  select * into v_call
  from public.c3_free_call
  where free_call_key=p_free_call_key
    and standing='active'
    and requires_pac_snapshot=true
    and surface_class<>'my_env';

  if not found then
    return jsonb_build_object('standing','DNR','reason','free_call_not_registered','free_call_key',p_free_call_key);
  end if;

  if p_selector_type not in ('host','route','encounter','none') then
    return jsonb_build_object('standing','DNR','reason','free_selector_invalid','free_call_key',p_free_call_key);
  end if;

  select count(*),min(free_snapshot_key) into v_count,v_projection_sha
  from public.c3_free_pac_snapshot
  where free_call_key=p_free_call_key
    and selector_type=p_selector_type
    and (
      (p_selector_type='none' and selector_value is null)
      or selector_value=p_selector_value
    )
    and standing='active';

  if v_count<>1 then
    return jsonb_build_object(
      'standing','DNR',
      'reason',case when v_count=0 then 'registered_snapshot_not_resolved' else 'registered_snapshot_collision' end,
      'free_call_key',p_free_call_key
    );
  end if;

  select * into v_snapshot
  from public.c3_free_pac_snapshot
  where free_snapshot_key=v_projection_sha;

  select * into v_pac
  from public.c3_pac
  where pac_key=v_snapshot.pac_key
    and is_effective=true
    and registration_protocol='registrar_v1';

  if not found then
    return jsonb_build_object('standing','DNR','reason','registered_pac_not_effective','free_call_key',p_free_call_key);
  end if;

  if v_pac.owner_subject_type='individual' then
    if not exists(select 1 from public.c3_envpac ep where ep.envpac_key=v_pac.envpac_key
      and ep.owner_subject_type='individual' and ep.owner_subject_key=v_pac.owner_subject_key
      and ep.is_effective=true) then
      return jsonb_build_object('standing','DNR','reason','individual_owner_environment_not_effective');
    end if;
    if exists(select 1 from public.c3_envpac_access_grant g
      where g.envpac_key=v_pac.envpac_key and g.subject_type='individual'
        and g.subject_key=v_pac.owner_subject_key and g.relation_role='owner'
        and coalesce(g.scope->'withdrawn_pac_projections','[]'::jsonb) ? v_pac.pac_key) then
      return jsonb_build_object('standing','DNR','reason','projection_authorization_withdrawn');
    end if;
  end if;

  if v_pac.schema_key is distinct from v_snapshot.schema_key
     or v_pac.registration_sha256 is distinct from v_snapshot.registration_sha256 then
    return jsonb_build_object('standing','DNR','reason','registered_pac_identity_mismatch','pac_key',v_pac.pac_key);
  end if;

  if not exists(
    select 1 from public.c3_pac_schema
    where schema_key=v_pac.schema_key and pac_type=v_pac.pac_type and standing='active' and is_active=true
  ) then
    return jsonb_build_object('standing','DNR','reason','pac_schema_not_resolved','pac_key',v_pac.pac_key);
  end if;

  if not exists(
    select 1 from public.c3_pac_encounter_scope s
    where s.pac_key=v_pac.pac_key
      and s.free_call_key=p_free_call_key
      and s.encounter_key=v_snapshot.encounter_key
      and s.surface_type=v_snapshot.surface_type
      and s.selector_type=v_snapshot.selector_type
      and s.selector_value is not distinct from v_snapshot.selector_value
      and s.standing='active'
  ) then
    return jsonb_build_object('standing','DNR','reason','encounter_scope_not_resolved','pac_key',v_pac.pac_key);
  end if;

  v_projection_sha:=encode(
    extensions.digest(convert_to(v_snapshot.projection::text,'UTF8'),'sha256'),
    'hex'
  );
  if v_projection_sha<>v_snapshot.projection_sha256 then
    return jsonb_build_object('standing','DNR','reason','registered_projection_integrity_mismatch','pac_key',v_pac.pac_key);
  end if;

  select count(*) into v_binding_count
  from public.c3_pac_model_binding b
  where b.pac_key=v_pac.pac_key and b.standing='active';

  if coalesce((select requires_c3_model_binding from public.c3_pac_schema where schema_key=v_pac.schema_key),true)
     and v_binding_count=0 then
    return jsonb_build_object('standing','DNR','reason','c3_model_binding_not_resolved','pac_key',v_pac.pac_key);
  end if;

  select count(*) into v_current_count
  from public.c3_pac_model_binding b
  where b.pac_key=v_pac.pac_key
    and b.standing='active'
    and (
      select count(*) from public.c3_current_state cs
      where cs.env_key=b.env_key
        and cs.is_current=true
        and cs.superseded_at is null
        and cs.effective_at<=now()
    )<>1;

  if v_current_count>0 then
    return jsonb_build_object('standing','DNR','reason','ACT_current_trace_not_resolved','pac_key',v_pac.pac_key);
  end if;

  select count(*) into v_envpac_gap_count
  from public.c3_pac_model_binding b
  where b.pac_key=v_pac.pac_key
    and b.standing='active'
    and (
      select count(*) from public.c3_envpac ep
      where ep.env_key=b.env_key and ep.is_effective=true
    )<>1;

  if v_envpac_gap_count>0 then
    return jsonb_build_object('standing','DNR','reason','ACT_envpac_trace_not_resolved','pac_key',v_pac.pac_key);
  end if;

  select count(*) into v_accrual_gap_count
  from public.c3_pac_model_binding b
  join public.c3_current_state cs
    on cs.env_key=b.env_key
   and cs.is_current=true
   and cs.superseded_at is null
   and cs.effective_at<=now()
  where b.pac_key=v_pac.pac_key
    and b.standing='active'
    and not exists(
      select 1
      from public.c3_current_accrual ca
      join public.c3_pac_registration_receipt rr
        on rr.pac_key=v_pac.pac_key
       and rr.standing='registered'
       and rr.registration_sha256=v_pac.registration_sha256
      join public.c3_envpac ep
        on ep.envpac_key=ca.envpac_key
       and ep.env_key=b.env_key
       and ep.is_effective=true
      where ca.env_key=b.env_key
        and ca.current_state_key=cs.current_state_key
        and ca.source_class='pac'
        and ca.source_pac_key=v_pac.pac_key
        and ca.source_key='pac_registration:'||v_pac.pac_key||':'||b.circuit_key
        and ca.subject_type=v_pac.owner_subject_type
        and ca.subject_key=v_pac.owner_subject_key
        and ca.relation_standing='registered'
        and ca.evidence_ref='pac_registration:'||rr.registration_key
    );

  if v_accrual_gap_count>0 then
    return jsonb_build_object(
      'standing','DNR','reason','ACT_CURRENT_accrual_not_resolved','pac_key',v_pac.pac_key
    );
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'circuit_key',b.circuit_key,
    'relation_role',b.relation_role,
    'env_key',b.env_key,
    'bound_envpac_key',(
      select min(ep.envpac_key) from public.c3_envpac ep
      where ep.env_key=b.env_key and ep.is_effective=true
    ),
    'current_state_key',cs.current_state_key,
    'state_version',cs.state_version,
    'standing',cs.standing,
    'effective_at',cs.effective_at,
    'CURRENT_accrual_count',(
      select count(*)
      from public.c3_current_accrual ca
      join public.c3_pac_registration_receipt rr
        on rr.pac_key=v_pac.pac_key
       and rr.standing='registered'
       and rr.registration_sha256=v_pac.registration_sha256
      join public.c3_envpac ep
        on ep.envpac_key=ca.envpac_key
       and ep.env_key=b.env_key
       and ep.is_effective=true
      where ca.env_key=b.env_key
        and ca.current_state_key=cs.current_state_key
        and ca.source_class='pac'
        and ca.source_pac_key=v_pac.pac_key
        and ca.source_key='pac_registration:'||v_pac.pac_key||':'||b.circuit_key
        and ca.subject_type=v_pac.owner_subject_type
        and ca.subject_key=v_pac.owner_subject_key
        and ca.relation_standing='registered'
        and ca.evidence_ref='pac_registration:'||rr.registration_key
    )
  ) order by b.circuit_key,b.env_key),'[]'::jsonb)
  into v_trace
  from public.c3_pac_model_binding b
  join public.c3_current_state cs
    on cs.env_key=b.env_key
   and cs.is_current=true
   and cs.superseded_at is null
   and cs.effective_at<=now()
  where b.pac_key=v_pac.pac_key and b.standing='active';

  return jsonb_build_object(
    'standing','ACT',
    'free_call_key',p_free_call_key,
    'pac_key',v_pac.pac_key,
    'schema_key',v_pac.schema_key,
    'registration_sha256',v_pac.registration_sha256,
    'projection_sha256',v_snapshot.projection_sha256,
    'registered_at',v_snapshot.registered_at,
    'encounter_key',v_snapshot.encounter_key,
    'surface_type',v_snapshot.surface_type,
    'ACT',v_trace,
    'snapshot',v_snapshot.projection
  );
end $function$
;

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

COMMIT;
