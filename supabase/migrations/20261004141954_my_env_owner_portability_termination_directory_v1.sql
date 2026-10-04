
create table if not exists public.c3_my_env_owner_lifecycle_receipt (
  receipt_key uuid primary key default gen_random_uuid(),
  relationship_key text not null references public.crs_relationship(relationship_key) on update cascade on delete restrict,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete restrict,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete restrict,
  action text not null check (action in ('portable_export','custody_transfer','terminate')),
  standing text not null check (standing in ('prepared','completed','held','cancelled')),
  disposition text,
  portable_manifest jsonb not null default '{}'::jsonb,
  manifest_sha256 text,
  target_custodian_type text,
  target_custodian_key text,
  target_custody_provider text,
  target_custody_uri text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists c3_my_env_owner_lifecycle_receipt_owner_idx
  on public.c3_my_env_owner_lifecycle_receipt(relationship_key,envpac_key,created_at desc);

alter table public.c3_my_env_owner_lifecycle_receipt enable row level security;
revoke all on table public.c3_my_env_owner_lifecycle_receipt from public, anon, authenticated;
grant select,insert,update on table public.c3_my_env_owner_lifecycle_receipt to service_role;

create or replace function public.resolve_c3_env_directory_v2(p_request jsonb)
returns jsonb
language plpgsql
set search_path to 'public','pg_temp'
as $$
declare
  v_env_key text := nullif(btrim(p_request->>'env_key'),'');
  v_envpac_key text := nullif(btrim(p_request->>'envpac_key'),'');
  v_action text := coalesce(nullif(btrim(p_request->>'action'),''),'list');
begin
  if v_env_key is null or v_envpac_key is null then
    return jsonb_build_object('standing','held','reason','environment_context_required');
  end if;

  if not exists (
    select 1
    from public.c3_envpac ep
    join public.c3_environment e on e.env_key=ep.env_key
    where ep.envpac_key=v_envpac_key
      and ep.env_key=v_env_key
      and ep.standing='effective'
      and ep.is_effective=true
      and e.is_active=true
  ) then
    return jsonb_build_object('standing','held','reason','envpac_unresolved');
  end if;

  if v_action <> 'list' then
    return public.resolve_c3_env_directory_v1(p_request);
  end if;

  return jsonb_build_object(
    'standing','resolved',
    'contacts',coalesce((
      with contact_rows as (
        select
          c.contact_key::text as contact_key,
          c.normalized_email as email,
          c.display_name,
          c.organization,
          c.phone,
          c.preferred_channel,
          c.source_class,
          c.standing,
          c.metadata,
          c.updated_at,
          0 as source_priority
        from public.c3_env_directory_contact c
        where c.envpac_key=v_envpac_key
          and c.env_key=v_env_key
          and c.standing='active'

        union all

        select
          'initiative:'||v.visibility_key as contact_key,
          lower(btrim(r.primary_email)) as email,
          r.display_name,
          r.organization,
          null::text as phone,
          'email'::text as preferred_channel,
          'initiative_participant_projection'::text as source_class,
          'active'::text as standing,
          jsonb_build_object(
            'relationship_key',r.relationship_key,
            'initiative_key',v.initiative_key,
            'initiative_envpac_key',v.initiative_envpac_key,
            'visibility_key',v.visibility_key,
            'visibility_source',v.visibility_source,
            'initiative_context_label',iob.metadata->>'initiative_context_label',
            'registry_authority','c3_env_initiative_visibility',
            'projection_only',true,
            'authority_created',false,
            'relationship_created',false
          ) as metadata,
          v.visible_at as updated_at,
          1 as source_priority
        from public.c3_environment_operator_binding eob
        join public.c3_initiative_operator_binding iob
          on iob.operator_standing_key=eob.operator_standing_key
         and iob.carrier_binding_key=eob.carrier_binding_key
         and iob.binding_standing='active'
         and iob.revoked_at is null
         and iob.metadata->>'my_env_projection_allowed'='true'
         and iob.metadata->>'my_env_projection_class'='operator'
        join public.c3_env_initiative_visibility v
          on v.initiative_key=iob.initiative_key
         and v.standing='active'
         and v.revoked_at is null
        join public.crs_relationship r
          on r.relationship_key=v.relationship_key
         and r.is_active=true
         and r.relationship_standing='c1_C1_persisted'
        where eob.env_key=v_env_key
          and eob.envpac_key=v_envpac_key
          and eob.binding_standing='active'
          and eob.revoked_at is null
          and lower(btrim(coalesce(r.primary_email,''))) <> ''
          and r.relationship_key <> coalesce(eob.metadata->>'crs_owner_relationship','')
      ),
      deduped as (
        select *,row_number() over(partition by email order by source_priority,updated_at desc nulls last,contact_key) as rn
        from contact_rows
      )
      select jsonb_agg(
        jsonb_build_object(
          'contact_key',contact_key,
          'email',email,
          'display_name',display_name,
          'organization',organization,
          'phone',phone,
          'preferred_channel',preferred_channel,
          'source_class',source_class,
          'standing',standing,
          'metadata',metadata,
          'updated_at',updated_at
        )
        order by coalesce(display_name,organization,email)
      )
      from deduped
      where rn=1
    ),'[]'::jsonb)
  );
end;
$$;

revoke all on function public.resolve_c3_env_directory_v2(jsonb) from public, anon, authenticated;
grant execute on function public.resolve_c3_env_directory_v2(jsonb) to service_role;

create or replace function public.resolve_my_env_owner_portability_v1(p_request jsonb)
returns jsonb
language plpgsql
set search_path to 'public','extensions','pg_temp'
as $$
declare
  v_action text := coalesce(nullif(btrim(p_request->>'action'),''),'preview');
  v_relationship_key text := nullif(btrim(p_request->>'relationship_key'),'');
  v_env_key text := nullif(btrim(p_request->>'env_key'),'');
  v_envpac_key text := nullif(btrim(p_request->>'envpac_key'),'');
  v_target_type text := nullif(btrim(p_request->>'target_custodian_type'),'');
  v_target_key text := nullif(btrim(p_request->>'target_custodian_key'),'');
  v_target_provider text := nullif(btrim(p_request->>'target_custody_provider'),'');
  v_target_uri text := nullif(btrim(p_request->>'target_custody_uri'),'');
  v_pac_map jsonb := p_request->'pac_custody';
  v_manifest jsonb;
  v_hash text;
  v_receipt uuid;
  v_pac record;
  v_entry jsonb;
begin
  if v_relationship_key is null or v_env_key is null or v_envpac_key is null then
    return jsonb_build_object('standing','held','reason','owner_environment_context_required');
  end if;

  if not exists (
    select 1
    from public.c3_environment e
    join public.c3_envpac ep on ep.env_key=e.env_key
    where e.env_key=v_env_key
      and ep.envpac_key=v_envpac_key
      and e.environment_class='c3me_individual_environment'
      and ep.owner_subject_type='individual'
      and ep.owner_subject_key=v_relationship_key
      and ep.portable=true
  ) then
    return jsonb_build_object('standing','held','reason','portable_owner_envpac_unresolved');
  end if;

  if not exists (
    select 1 from public.c3_envpac_access_grant g
    where g.envpac_key=v_envpac_key
      and g.subject_type='individual'
      and g.subject_key=v_relationship_key
      and g.relation_role='owner'
      and g.standing='active'
      and g.revoked_at is null
      and (g.expires_at is null or g.expires_at>now())
      and coalesce(g.scope,'{}'::jsonb)->'rights' ? 'export'
  ) then
    return jsonb_build_object('standing','held','reason','owner_export_right_unresolved');
  end if;

  v_manifest:=jsonb_build_object(
    'manifest_version','c3_my_env_portable_manifest_v1',
    'generated_at',now(),
    'relationship_key',v_relationship_key,
    'ownership_survives_environment_termination',true,
    'lineage_preserved',true,
    'package_scope','registry_manifest_and_custody_references',
    'binary_assets_embedded',false,
    'environment',(select to_jsonb(e) from public.c3_environment e where e.env_key=v_env_key),
    'envpac',(select to_jsonb(ep) from public.c3_envpac ep where ep.envpac_key=v_envpac_key),
    'pacs',coalesce((select jsonb_agg(to_jsonb(p) order by p.pac_key) from public.c3_pac p where p.envpac_key=v_envpac_key),'[]'::jsonb),
    'pac_relations',coalesce((
      select jsonb_agg(to_jsonb(pr) order by pr.relation_key)
      from public.c3_pac_relation pr
      where pr.source_pac_key in (select p.pac_key from public.c3_pac p where p.envpac_key=v_envpac_key)
    ),'[]'::jsonb),
    'canopy_references',coalesce((
      select jsonb_agg(to_jsonb(cr) order by cr.sort_order,cr.created_at)
      from public.c3_envpac_canopy_reference cr where cr.envpac_key=v_envpac_key
    ),'[]'::jsonb),
    'owner_grants',coalesce((
      select jsonb_agg(to_jsonb(g) order by g.granted_at)
      from public.c3_envpac_access_grant g
      where g.envpac_key=v_envpac_key
        and g.subject_type='individual'
        and g.subject_key=v_relationship_key
        and g.relation_role='owner'
    ),'[]'::jsonb)
  );

  v_hash:=encode(extensions.digest(convert_to(v_manifest::text,'UTF8'),'sha256'),'hex');

  if v_action='preview' then
    return jsonb_build_object(
      'standing','resolved','portable',true,'manifest_sha256',v_hash,'manifest',v_manifest,
      'pac_count',(select count(*) from public.c3_pac p where p.envpac_key=v_envpac_key),
      'active_initiative_count',(select count(*) from public.c3_env_initiative_visibility v where v.relationship_key=v_relationship_key and v.standing='active' and v.revoked_at is null),
      'active_connection_count',(select count(*) from public.c3_env_native_connection c where c.standing='active' and c.revoked_at is null and (c.source_relationship_key=v_relationship_key or c.target_relationship_key=v_relationship_key)),
      'disposition_options',jsonb_build_array('retain_c3_field_custody','portable_export','custody_transferred')
    );
  elsif v_action='export' then
    insert into public.c3_my_env_owner_lifecycle_receipt(
      relationship_key,env_key,envpac_key,action,standing,disposition,
      portable_manifest,manifest_sha256,metadata,completed_at
    ) values (
      v_relationship_key,v_env_key,v_envpac_key,'portable_export','completed','portable_export',
      v_manifest,v_hash,
      jsonb_build_object('owner_authorized',true,'custody_transferred',false,'binary_assets_embedded',false),
      now()
    ) returning receipt_key into v_receipt;
    return jsonb_build_object('standing','export_ready','receipt_key',v_receipt,'manifest_sha256',v_hash,'manifest',v_manifest,'custody_transferred',false);
  elsif v_action='transfer_custody' then
    if coalesce((p_request->>'confirmed_custody_received')::boolean,false) is not true then
      return jsonb_build_object('standing','held','reason','target_custody_receipt_confirmation_required');
    end if;
    if v_target_type not in ('individual','entity','system','environment','service')
       or v_target_key is null or v_target_provider is null or v_target_uri is null then
      return jsonb_build_object('standing','held','reason','complete_target_custody_required');
    end if;
    if jsonb_typeof(v_pac_map) is distinct from 'object' then
      return jsonb_build_object('standing','held','reason','per_pac_custody_map_required');
    end if;
    if exists (select 1 from public.c3_pac p where p.envpac_key=v_envpac_key and not (v_pac_map ? p.pac_key)) then
      return jsonb_build_object('standing','held','reason','complete_per_pac_custody_map_required');
    end if;

    for v_pac in select pac_key from public.c3_pac where envpac_key=v_envpac_key order by pac_key loop
      v_entry:=v_pac_map->v_pac.pac_key;
      if nullif(btrim(v_entry->>'custody_provider'),'') is null or nullif(btrim(v_entry->>'custody_uri'),'') is null then
        return jsonb_build_object('standing','held','reason','per_pac_custody_target_incomplete','pac_key',v_pac.pac_key);
      end if;
    end loop;

    for v_pac in select pac_key from public.c3_pac where envpac_key=v_envpac_key order by pac_key loop
      v_entry:=v_pac_map->v_pac.pac_key;
      update public.c3_pac
      set custodian_subject_type=v_target_type,custodian_subject_key=v_target_key,
          custody_provider=v_entry->>'custody_provider',custody_uri=v_entry->>'custody_uri',
          metadata=metadata||jsonb_build_object('custody_transferred_at',now(),'custody_transferred_by_owner',v_relationship_key,'prior_manifest_sha256',v_hash,'lineage_preserved',true),
          updated_at=now()
      where pac_key=v_pac.pac_key and envpac_key=v_envpac_key;
    end loop;

    update public.c3_envpac
    set custodian_subject_type=v_target_type,custodian_subject_key=v_target_key,
        custody_provider=v_target_provider,custody_uri=v_target_uri,
        metadata=metadata||jsonb_build_object('custody_transferred_at',now(),'custody_transferred_by_owner',v_relationship_key,'prior_manifest_sha256',v_hash,'lineage_preserved',true),
        updated_at=now()
    where envpac_key=v_envpac_key;

    insert into public.c3_my_env_owner_lifecycle_receipt(
      relationship_key,env_key,envpac_key,action,standing,disposition,portable_manifest,manifest_sha256,
      target_custodian_type,target_custodian_key,target_custody_provider,target_custody_uri,metadata,completed_at
    ) values (
      v_relationship_key,v_env_key,v_envpac_key,'custody_transfer','completed','custody_transferred',
      v_manifest,v_hash,v_target_type,v_target_key,v_target_provider,v_target_uri,
      jsonb_build_object('owner_authorized',true,'confirmed_custody_received',true,'lineage_preserved',true),now()
    ) returning receipt_key into v_receipt;

    return jsonb_build_object(
      'standing','custody_transferred','receipt_key',v_receipt,'manifest_sha256',v_hash,
      'target_custodian_type',v_target_type,'target_custodian_key',v_target_key,
      'target_custody_provider',v_target_provider,'target_custody_uri',v_target_uri,'lineage_preserved',true
    );
  else
    return jsonb_build_object('standing','held','reason','unsupported_portability_action');
  end if;
end;
$$;

revoke all on function public.resolve_my_env_owner_portability_v1(jsonb) from public, anon, authenticated;
grant execute on function public.resolve_my_env_owner_portability_v1(jsonb) to service_role;

create or replace function public.terminate_my_env_owner_v1(p_request jsonb)
returns jsonb
language plpgsql
set search_path to 'public','pg_temp'
as $$
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
$$;

revoke all on function public.terminate_my_env_owner_v1(jsonb) from public, anon, authenticated;
grant execute on function public.terminate_my_env_owner_v1(jsonb) to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,process_title,process_scope,process_status,authority_level,
  source_reference_set,required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
) values
('my_env_owner_portability_v1','c3_field','My Env Owner Portability v1','active','registry://my_env/owner_portability/v1','operator_confirmed_registry_held',
 jsonb_build_object('owner_authority',true,'portable_manifest_function','public.resolve_my_env_owner_portability_v1(jsonb)','ownership_survives_termination',true,'lineage_preserved',true,'binary_asset_rule','portable manifest carries custody references; custody transfer requires explicit per-PAC target receipt'),
 'My Env Owner Portability v1','Owner-authorized inspect/export/custody-transfer lifecycle for portable My Env PACs without ownership loss or lineage break.','active','bounded_pac_owner_passage','[]'::jsonb,null,false,false,false),
('my_env_owner_termination_v1','c3_field','My Env Owner Termination v1','active','registry://my_env/owner_termination/v1','operator_confirmed_registry_held',
 jsonb_build_object('owner_authority',true,'termination_function','public.terminate_my_env_owner_v1(jsonb)','hard_delete',false,'explicit_reentry_required',true,'pac_disposition_required',true,'ownership_survives_termination',true,'cancom_effect','revoked relations cease to resolve new passage'),
 'My Env Owner Termination v1','Owner-authorized termination of an active personal My Env with revocation of active passage while preserving evidence, PAC ownership, and lineage.','active','bounded_pac_owner_passage','[]'::jsonb,null,false,false,false),
('my_env_directory_participant_projection_v1','c3_field','My Env Directory Participant Projection v1','active','registry://my_env/directory/participant_projection/v1','operator_confirmed_registry_held',
 jsonb_build_object('resolver','public.resolve_c3_env_directory_v2(jsonb)','source_authority','c3_env_initiative_visibility','projection_only',true,'manual_contacts_preserved',true,'revocation_disappears_automatically',true),
 'My Env Directory Participant Projection v1','Shared My Env Directory resolver that projects active initiative participants for authorized initiative operators while preserving Registry standing as authority.','active','owner_private_projection','[]'::jsonb,null,false,false,false)
on conflict (process_key) do update set
  status=excluded.status,authority_state=excluded.authority_state,
  metadata=public.system_process_registry.metadata||excluded.metadata,
  process_title=excluded.process_title,process_scope=excluded.process_scope,
  process_status=excluded.process_status,authority_level=excluded.authority_level,updated_at=now();
