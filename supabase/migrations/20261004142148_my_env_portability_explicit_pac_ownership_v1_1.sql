
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
  v_owned_count integer;
  v_reference_count integer;
  v_transfer_blockers jsonb;
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

  select count(*) into v_owned_count
  from public.c3_pac p
  where p.envpac_key=v_envpac_key
    and p.metadata->'ownership_model'->>'owner_subject_type'='individual'
    and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key;

  select count(*) into v_reference_count
  from public.c3_pac p
  where p.envpac_key=v_envpac_key
    and not (
      p.metadata->'ownership_model'->>'owner_subject_type'='individual'
      and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
    );

  select coalesce(jsonb_agg(jsonb_build_object(
    'pac_key',p.pac_key,
    'pac_type',p.pac_type,
    'owner_subject_type',p.metadata->'ownership_model'->>'owner_subject_type',
    'owner_subject_key',p.metadata->'ownership_model'->>'owner_subject_key',
    'ownership_resolution',case
      when p.metadata->'ownership_model'->>'owner_subject_type' is null then 'ownership_unresolved_reference_only'
      else 'owned_by_other_reference_only'
    end
  ) order by p.pac_key),'[]'::jsonb)
  into v_transfer_blockers
  from public.c3_pac p
  where p.envpac_key=v_envpac_key
    and not (
      p.metadata->'ownership_model'->>'owner_subject_type'='individual'
      and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
    );

  v_manifest:=jsonb_build_object(
    'manifest_version','c3_my_env_portable_manifest_v1_1',
    'generated_at',now(),
    'relationship_key',v_relationship_key,
    'ownership_survives_environment_termination',true,
    'lineage_preserved',true,
    'package_scope','owned_pac_registry_manifests_plus_non_owned_reference_index',
    'binary_assets_embedded',false,
    'ownership_rule','custody_or_envpac_membership_does_not_create_pac_ownership',
    'environment',(select to_jsonb(e) from public.c3_environment e where e.env_key=v_env_key),
    'envpac',(select to_jsonb(ep) from public.c3_envpac ep where ep.envpac_key=v_envpac_key),
    'owned_pacs',coalesce((
      select jsonb_agg(to_jsonb(p) order by p.pac_key)
      from public.c3_pac p
      where p.envpac_key=v_envpac_key
        and p.metadata->'ownership_model'->>'owner_subject_type'='individual'
        and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
    ),'[]'::jsonb),
    'owned_pac_relations',coalesce((
      select jsonb_agg(to_jsonb(pr) order by pr.relation_key)
      from public.c3_pac_relation pr
      where pr.source_pac_key in (
        select p.pac_key from public.c3_pac p
        where p.envpac_key=v_envpac_key
          and p.metadata->'ownership_model'->>'owner_subject_type'='individual'
          and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
      )
    ),'[]'::jsonb),
    'non_owned_pac_references',coalesce((
      select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
        'pac_key',p.pac_key,
        'pac_type',p.pac_type,
        'version',p.version,
        'standing',p.standing,
        'source_authority',p.source_authority,
        'custody_provider',p.custody_provider,
        'custody_uri',p.custody_uri,
        'ownership_model',p.metadata->'ownership_model',
        'custody_model',p.metadata->'custody_model',
        'reference_only',true,
        'ownership_resolution',case
          when p.metadata->'ownership_model'->>'owner_subject_type' is null then 'unresolved'
          else 'owned_by_other'
        end
      )) order by p.pac_key)
      from public.c3_pac p
      where p.envpac_key=v_envpac_key
        and not (
          p.metadata->'ownership_model'->>'owner_subject_type'='individual'
          and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
        )
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
      'standing','resolved',
      'portable',true,
      'manifest_sha256',v_hash,
      'manifest',v_manifest,
      'owned_pac_count',v_owned_count,
      'non_owned_reference_count',v_reference_count,
      'transfer_blockers',v_transfer_blockers,
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
      jsonb_build_object(
        'owner_authorized',true,
        'custody_transferred',false,
        'binary_assets_embedded',false,
        'owned_pac_count',v_owned_count,
        'non_owned_reference_count',v_reference_count
      ),
      now()
    ) returning receipt_key into v_receipt;

    return jsonb_build_object(
      'standing','export_ready',
      'receipt_key',v_receipt,
      'manifest_sha256',v_hash,
      'manifest',v_manifest,
      'owned_pac_count',v_owned_count,
      'non_owned_reference_count',v_reference_count,
      'custody_transferred',false
    );
  elsif v_action='transfer_custody' then
    if v_reference_count>0 then
      return jsonb_build_object(
        'standing','held',
        'reason','non_owned_pac_custody_release_required',
        'transfer_blockers',v_transfer_blockers,
        'rule','non_owned_or_ownership_unresolved_pacs_cannot_transfer_with_personal_envpac'
      );
    end if;
    if coalesce((p_request->>'confirmed_custody_received')::boolean,false) is not true then
      return jsonb_build_object('standing','held','reason','target_custody_receipt_confirmation_required');
    end if;
    if v_target_type not in ('individual','entity','system','environment','service')
       or v_target_key is null or v_target_provider is null or v_target_uri is null then
      return jsonb_build_object('standing','held','reason','complete_target_custody_required');
    end if;
    if jsonb_typeof(v_pac_map) is distinct from 'object' then
      return jsonb_build_object('standing','held','reason','per_owned_pac_custody_map_required');
    end if;
    if exists (
      select 1 from public.c3_pac p
      where p.envpac_key=v_envpac_key
        and p.metadata->'ownership_model'->>'owner_subject_type'='individual'
        and p.metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
        and not (v_pac_map ? p.pac_key)
    ) then
      return jsonb_build_object('standing','held','reason','complete_per_owned_pac_custody_map_required');
    end if;

    for v_pac in
      select pac_key from public.c3_pac
      where envpac_key=v_envpac_key
        and metadata->'ownership_model'->>'owner_subject_type'='individual'
        and metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
      order by pac_key
    loop
      v_entry:=v_pac_map->v_pac.pac_key;
      if nullif(btrim(v_entry->>'custody_provider'),'') is null
         or nullif(btrim(v_entry->>'custody_uri'),'') is null then
        return jsonb_build_object('standing','held','reason','per_owned_pac_custody_target_incomplete','pac_key',v_pac.pac_key);
      end if;
    end loop;

    for v_pac in
      select pac_key from public.c3_pac
      where envpac_key=v_envpac_key
        and metadata->'ownership_model'->>'owner_subject_type'='individual'
        and metadata->'ownership_model'->>'owner_subject_key'=v_relationship_key
      order by pac_key
    loop
      v_entry:=v_pac_map->v_pac.pac_key;
      update public.c3_pac
      set custodian_subject_type=v_target_type,
          custodian_subject_key=v_target_key,
          custody_provider=v_entry->>'custody_provider',
          custody_uri=v_entry->>'custody_uri',
          metadata=metadata||jsonb_build_object(
            'custody_transferred_at',now(),
            'custody_transferred_by_owner',v_relationship_key,
            'prior_manifest_sha256',v_hash,
            'lineage_preserved',true
          ),
          updated_at=now()
      where pac_key=v_pac.pac_key and envpac_key=v_envpac_key;
    end loop;

    update public.c3_envpac
    set custodian_subject_type=v_target_type,
        custodian_subject_key=v_target_key,
        custody_provider=v_target_provider,
        custody_uri=v_target_uri,
        metadata=metadata||jsonb_build_object(
          'custody_transferred_at',now(),
          'custody_transferred_by_owner',v_relationship_key,
          'prior_manifest_sha256',v_hash,
          'lineage_preserved',true
        ),
        updated_at=now()
    where envpac_key=v_envpac_key;

    insert into public.c3_my_env_owner_lifecycle_receipt(
      relationship_key,env_key,envpac_key,action,standing,disposition,
      portable_manifest,manifest_sha256,target_custodian_type,target_custodian_key,
      target_custody_provider,target_custody_uri,metadata,completed_at
    ) values (
      v_relationship_key,v_env_key,v_envpac_key,'custody_transfer','completed','custody_transferred',
      v_manifest,v_hash,v_target_type,v_target_key,v_target_provider,v_target_uri,
      jsonb_build_object('owner_authorized',true,'confirmed_custody_received',true,'lineage_preserved',true,'owned_pac_count',v_owned_count),
      now()
    ) returning receipt_key into v_receipt;

    return jsonb_build_object(
      'standing','custody_transferred',
      'receipt_key',v_receipt,
      'manifest_sha256',v_hash,
      'target_custodian_type',v_target_type,
      'target_custodian_key',v_target_key,
      'target_custody_provider',v_target_provider,
      'target_custody_uri',v_target_uri,
      'lineage_preserved',true
    );
  else
    return jsonb_build_object('standing','held','reason','unsupported_portability_action');
  end if;
end;
$$;

update public.system_process_registry
set metadata=metadata||jsonb_build_object(
  'ownership_rule','custody_or_envpac_membership_does_not_create_pac_ownership',
  'owned_pac_export_rule','only PACs with explicit individual ownership matching the My Env owner export as owned PACs',
  'non_owned_pac_rule','other PACs export as reference index only and block whole-EnvPAC custody transfer until their custody is separately resolved',
  'portable_manifest_version','c3_my_env_portable_manifest_v1_1'
),
updated_at=now()
where process_key='my_env_owner_portability_v1';
