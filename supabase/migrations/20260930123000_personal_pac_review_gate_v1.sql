-- Personal PAC review gate v1
-- Exact review snapshot -> reviewed hash -> approval hash -> encounter/distribution.
-- Existing Run Aground c3 Field-only encounter is preserved, but wider
-- distribution remains held until the exact candidate is reviewed and approved.

create or replace function public.c3_pac_review_payload_v1(p_pac_key text)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select case
    when p.pac_type='c3WebPac' then public.c3_pac_public_payload_v1(p.pac_key)
    when p.pac_type='ProfilePAC' then jsonb_build_object(
      'pac_key',p.pac_key,
      'version',p.version,
      'pac_type',p.pac_type,
      'custody_uri',p.custody_uri,
      'profile',coalesce((
        select jsonb_build_object(
          'profile_key',pp.profile_key,
          'profile_class',pp.profile_class,
          'display_label',pp.display_label,
          'visibility_scope',pp.visibility_scope,
          'metadata',pp.metadata
        )
        from public.c3_profile_pac pp
        where pp.pac_key=p.pac_key
        limit 1
      ),'{}'::jsonb)
    )
    else jsonb_build_object(
      'pac_key',p.pac_key,
      'version',p.version,
      'pac_type',p.pac_type,
      'custody_uri',p.custody_uri,
      'source_authority',p.source_authority
    )
  end
  from public.c3_pac p
  where p.pac_key=p_pac_key and p.is_effective=true;
$$;

create or replace function public.c3_pac_review_sha256_v1(p_pac_key text)
returns text
language sql
stable
security invoker
set search_path=public,extensions
as $$
  select encode(
    extensions.digest(
      convert_to(public.c3_pac_review_payload_v1(p_pac_key)::text,'UTF8'),
      'sha256'
    ),
    'hex'
  );
$$;

create or replace function public.c3_pac_review_candidate_v1(p_pac_key text)
returns jsonb
language sql
stable
security invoker
set search_path=public
as $$
  select jsonb_build_object(
    'pac_key',p_pac_key,
    'snapshot_hash',public.c3_pac_review_sha256_v1(p_pac_key),
    'payload',public.c3_pac_review_payload_v1(p_pac_key)
  );
$$;

create or replace function public.c3_pac_set_personal_review_v1(
  p_pac_key text,
  p_subject_key text,
  p_disposition text,
  p_candidate_hash text
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_current_hash text;
  v_approval_hash text;
begin
  if p_disposition not in ('REVIEWED','HLD') then
    return jsonb_build_object('standing','DNR','reason','unsupported_review_disposition');
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
  v_approval_hash:=v_pac.metadata#>>'{custody_approval,approval_snapshot_hash}';

  if p_candidate_hash is null or p_candidate_hash is distinct from v_current_hash then
    return jsonb_build_object(
      'standing','DNR',
      'reason','review_candidate_changed',
      'current_snapshot_hash',v_current_hash
    );
  end if;

  update public.c3_pac
  set metadata=coalesce(metadata,'{}'::jsonb)
    || jsonb_build_object(
      'review_resolution',jsonb_build_object(
        'standing',p_disposition,
        'review_snapshot_hash',v_current_hash,
        'review_surface','my_pacs_preview',
        'reviewed_by',p_subject_key,
        'reviewed_at',v_now
      ),
      'distribution_resolution',case
        when p_disposition='HLD' then jsonb_build_object(
          'standing','HLD_REVIEW',
          'review_snapshot_hash',v_current_hash,
          'reason','owner_held_after_review'
        )
        when v_approval_hash is distinct from v_current_hash then jsonb_build_object(
          'standing','HLD_APPROVAL_REFRESH_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'reason','review_complete_exact_approval_required'
        )
        else jsonb_build_object(
          'standing','HLD_OWNER_DISTRIBUTION_DECISION_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'approval_snapshot_hash',v_approval_hash,
          'reason','review_and_approval_complete_distribution_not_authorized'
        )
      end
    ),
    updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',case when p_disposition='REVIEWED' then 'ACT' else 'HLD' end,
    'pac_key',p_pac_key,
    'review_standing',p_disposition,
    'review_snapshot_hash',v_current_hash,
    'reviewed_at',v_now
  );
end;
$$;

create or replace function public.c3_pac_set_personal_disposition_v1(
  p_pac_key text,
  p_subject_key text,
  p_disposition text,
  p_note text default null
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_state text;
  v_current_hash text;
  v_review_hash text;
  v_existing_projection jsonb;
begin
  if p_disposition not in ('APPROVED','HLD') then
    return jsonb_build_object('standing','DNR','reason','unsupported_personal_disposition');
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
     or coalesce(v_pac.metadata#>>'{custody_model,custody_class}','')<>'personal_pac_custody'
     or coalesce(v_pac.metadata#>>'{ownership_model,owner_subject_type}','')<>'individual'
     or v_pac.metadata#>>'{ownership_model,owner_subject_key}' is distinct from p_subject_key then
    return jsonb_build_object('standing','DNR','reason','personal_owner_custody_required');
  end if;

  v_current_hash:=public.c3_pac_review_sha256_v1(p_pac_key);
  v_review_hash:=v_pac.metadata#>>'{review_resolution,review_snapshot_hash}';
  v_existing_projection:=coalesce(v_pac.metadata->'encounter_projection','{}'::jsonb);

  if p_disposition='APPROVED' and (
      coalesce(v_pac.metadata#>>'{review_resolution,standing}','')<>'REVIEWED'
      or v_review_hash is distinct from v_current_hash
  ) then
    return jsonb_build_object(
      'standing','DNR',
      'reason','current_review_required',
      'current_snapshot_hash',v_current_hash,
      'review_snapshot_hash',v_review_hash
    );
  end if;

  v_state:=case when p_disposition='APPROVED' then 'ACT' else 'HLD' end;

  update public.c3_pac
  set metadata=coalesce(metadata,'{}'::jsonb)
    || jsonb_build_object(
      'custody_approval',jsonb_build_object(
        'standing',p_disposition,
        'subject_key',p_subject_key,
        'context_class','personal_custody',
        'approval_surface','my_pacs',
        'approval_snapshot_hash',case when p_disposition='APPROVED' then v_current_hash else null end,
        'note',nullif(btrim(coalesce(p_note,'')),''),
        'resolved_at',v_now
      ),
      'encounter_projection',case
        when p_disposition='APPROVED'
             and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'
          then v_existing_projection || jsonb_build_object(
            'authorization_snapshot_hash',v_current_hash,
            'reviewed_approval_bound_at',v_now
          )
        when p_disposition='APPROVED' then jsonb_build_object(
          'standing','PENDING',
          'encounter_key','c3envpac_c2me_v0_1',
          'owner_authorization_required',true,
          'authorized_by_owner',false,
          'projection_surface','c2ME_env',
          'reason','separate_owner_encounter_decision_required'
        )
        else jsonb_build_object(
          'standing','HLD',
          'encounter_key','c3envpac_c2me_v0_1',
          'owner_authorization_required',true,
          'authorized_by_owner',false,
          'projection_surface','c2ME_env',
          'reason','pac_not_approved_in_custody'
        )
      end,
      'distribution_resolution',case
        when p_disposition='APPROVED' then jsonb_build_object(
          'standing','HLD_OWNER_DISTRIBUTION_DECISION_REQUIRED',
          'review_snapshot_hash',v_current_hash,
          'approval_snapshot_hash',v_current_hash,
          'reason','approval_does_not_authorize_distribution'
        )
        else jsonb_build_object(
          'standing','HLD_PAC',
          'reason','pac_not_approved_in_custody'
        )
      end
    ),
    updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',v_state,
    'pac_key',p_pac_key,
    'disposition',p_disposition,
    'approval_surface','my_pacs',
    'approval_snapshot_hash',case when p_disposition='APPROVED' then v_current_hash else null end,
    'encounter_projection_standing',case
      when p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'
        then coalesce(v_existing_projection->>'standing','AUTHORIZED')
      when p_disposition='APPROVED' then 'PENDING'
      else 'HLD'
    end,
    'encounter_authorization_preserved',
      p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true',
    'owner_encounter_decision_required',
      not (p_disposition='APPROVED' and coalesce(v_existing_projection->>'authorized_by_owner','false')='true'),
    'resolved_at',v_now
  );
end;
$$;

create or replace function public.c3_pac_set_personal_encounter_projection_v1(
  p_pac_key text,
  p_subject_key text,
  p_action text,
  p_encounter_key text default 'c3envpac_c2me_v0_1',
  p_surface_scope text default 'c3field_only'
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
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
            when p_surface_scope='c3field_plus_canopy' then jsonb_build_array('c3field','canopy')
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
  if v_host is null then v_host:=nullif(v_pac.metadata#>>'{public_presentation,canonical_host}',''); end if;
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
$$;

update public.c3_pac
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'review_resolution',jsonb_build_object(
      'standing','REQUIRED',
      'review_surface','my_pacs_preview',
      'current_snapshot_hash',public.c3_pac_review_sha256_v1(pac_key),
      'reason','legacy_sight_unseen_approval_requires_review_before_distribution'
    ),
    'distribution_resolution',jsonb_build_object(
      'standing','HLD_PENDING_REVIEW',
      'reason','exact_rendered_candidate_not_yet_reviewed',
      'native_encounter_preserved',true
    )
  ),
  updated_at=now()
where pac_key='run_aground_public_c3webpac_v1'
  and coalesce(metadata#>>'{review_resolution,standing}','')<>'REVIEWED';

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,
  created_at,updated_at
)
values (
  'personal_pac_review_gate_v1',
  'c3_field',
  'Personal PAC Review Gate v1',
  'active',
  'supabase/migrations/20260930123000_personal_pac_review_gate_v1.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'review_surface','my_pacs_preview',
    'review_hash_source','c3_pac_review_sha256_v1',
    'approval_requires_current_review',true,
    'approval_binds_exact_review_snapshot',true,
    'snapshot_change_invalidates_review',true,
    'encounter_authorization_requires_current_reviewed_approval',true,
    'distribution_authorized_by_approval',false,
    'legacy_native_encounter_preservation','run_aground_c3field_only_preserved_distribution_held'
  ),
  'Personal PAC Review Gate v1',
  'Private exact-candidate review before owner approval, encounter authorization changes, or wider distribution',
  'active',
  'registered_runtime_rule',
  jsonb_build_array(
    'my_pacs',
    'c3_pac_review_candidate_v1',
    'c3_pac_set_personal_review_v1'
  ),
  'oar2',true,true,true,now(),now()
)
on conflict (process_key) do update
set status=excluded.status,
    source_path=excluded.source_path,
    authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_status=excluded.process_status,
    authority_level=excluded.authority_level,
    updated_at=now();

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'personal_pac_review_gate_ref','personal_pac_review_gate_v1',
    'approval_requires_current_review',true,
    'distribution_requires_separate_owner_decision',true
  ),
  updated_at=now()
where process_key='c1me_envpac_primitives_v1';

update public.c3_envpac_runtime_primitive
set config=coalesce(config,'{}'::jsonb)
  || jsonb_build_object(
    'review_gate','personal_pac_review_gate_v1',
    'approval_requires_current_review',true,
    'review_surface','my_pacs_preview'
  ),
  updated_at=now()
where primitive_key='my_pacs' and standing='active';

revoke all on function public.c3_pac_review_payload_v1(text) from public,anon,authenticated;
grant execute on function public.c3_pac_review_payload_v1(text) to service_role;
revoke all on function public.c3_pac_review_sha256_v1(text) from public,anon,authenticated;
grant execute on function public.c3_pac_review_sha256_v1(text) to service_role;
revoke all on function public.c3_pac_review_candidate_v1(text) from public,anon,authenticated;
grant execute on function public.c3_pac_review_candidate_v1(text) to service_role;
revoke all on function public.c3_pac_set_personal_review_v1(text,text,text,text) from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_review_v1(text,text,text,text) to service_role;
revoke all on function public.c3_pac_set_personal_disposition_v1(text,text,text,text) from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_disposition_v1(text,text,text,text) to service_role;
revoke all on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text) to service_role;
