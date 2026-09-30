-- Separate personal PAC custody approval from encounter projection authorization.
-- Approval means the owner accepts the PAC in personal custody.
-- C2ME_env projection requires a second explicit owner decision.

update public.c3_pac
set metadata =
  jsonb_set(
    jsonb_set(
      coalesce(metadata,'{}'::jsonb),
      '{custody_approval,c2_projection_eligible}',
      'false'::jsonb,
      true
    ),
    '{encounter_projection}',
    jsonb_build_object(
      'standing','PENDING',
      'encounter_key','c3envpac_c2me_v0_1',
      'owner_authorization_required',true,
      'authorized_by_owner',false,
      'projection_surface','c2ME_env',
      'reason','separate_owner_encounter_decision_required'
    ),
    true
  ),
  updated_at=now()
where metadata#>>'{custody_model,custody_class}'='personal_pac_custody'
  and metadata#>>'{custody_approval,standing}'='APPROVED'
  and coalesce(metadata#>>'{encounter_projection,standing}','')='';

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

  v_state:=case when p_disposition='APPROVED' then 'ACT' else 'HLD' end;

  update public.c3_pac
  set metadata =
      coalesce(metadata,'{}'::jsonb)
      || jsonb_build_object(
        'custody_approval',jsonb_build_object(
          'standing',p_disposition,
          'subject_key',p_subject_key,
          'context_class','personal_custody',
          'approval_surface','my_pacs',
          'note',nullif(btrim(coalesce(p_note,'')),''),
          'resolved_at',v_now
        ),
        'encounter_projection',
          case when p_disposition='APPROVED'
            then jsonb_build_object(
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
          end
      ),
      updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',v_state,
    'pac_key',p_pac_key,
    'disposition',p_disposition,
    'approval_surface','my_pacs',
    'encounter_projection_standing',case when p_disposition='APPROVED' then 'PENDING' else 'HLD' end,
    'owner_encounter_decision_required',true,
    'resolved_at',v_now
  );
end;
$$;

create or replace function public.c3_pac_set_personal_encounter_projection_v1(
  p_pac_key text,
  p_subject_key text,
  p_action text,
  p_encounter_key text default 'c3envpac_c2me_v0_1'
)
returns jsonb
language plpgsql
security invoker
set search_path=public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_now timestamptz:=now();
  v_authorized boolean;
  v_standing text;
begin
  if p_action not in ('AUTHORIZE','REVOKE') then
    return jsonb_build_object('standing','DNR','reason','unsupported_projection_action');
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

  if p_action='AUTHORIZE'
     and coalesce(v_pac.metadata#>>'{custody_approval,standing}','')<>'APPROVED' then
    return jsonb_build_object('standing','DNR','reason','custody_approval_required');
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
          'resolved_at',v_now
        ),
        true
      ),
      updated_at=v_now
  where pac_key=p_pac_key;

  return jsonb_build_object(
    'standing',case when v_authorized then 'ACT' else 'HLD' end,
    'pac_key',p_pac_key,
    'encounter_projection_standing',v_standing,
    'encounter_key',p_encounter_key,
    'authorized_by_owner',v_authorized,
    'resolved_at',v_now
  );
end;
$$;

revoke all on function public.c3_pac_set_personal_disposition_v1(text,text,text,text)
from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_disposition_v1(text,text,text,text)
to service_role;

revoke all on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text)
from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text)
to service_role;

update public.c3_envpac_runtime_primitive
set config=coalesce(config,'{}'::jsonb)
  || jsonb_build_object(
    'c2me_projection_rule','approved_plus_separate_owner_encounter_authorization',
    'approval_implies_projection',false
  ),
  updated_at=now()
where primitive_key='my_pacs'
  and standing='active';

update public.c3_envpac
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'c2me_projection_rule','approved_plus_separate_owner_encounter_authorization',
    'approval_implies_projection',false
  ),
  updated_at=now()
where owner_subject_type='individual'
  and is_effective=true
  and standing='effective';

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'c2me_projection_rule','approved_plus_separate_owner_encounter_authorization',
    'approval_implies_projection',false,
    'owner_encounter_decision_surface','my_pacs'
  ),
  updated_at=now()
where process_key='c1me_envpac_primitives_v1';


-- Surface scope is a separate owner choice within encounter authorization.
-- c3 Field is the runtime encounter surface; Canopy is optional owner-selected projection.
update public.c3_envpac_canopy_reference
set reference_state='removed',
    removed_at=now(),
    metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'correction_reason','canopy_projection_requires_explicit_owner_surface_scope',
      'prior_auto_projection_superseded',true
    ),
    updated_at=now()
where display_label='Run Aground'
  and metadata->>'source_pac_key'='run_aground_public_c3webpac_v1'
  and reference_state='active';

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

  if p_action='AUTHORIZE'
     and coalesce(v_pac.metadata#>>'{custody_approval,standing}','')<>'APPROVED' then
    return jsonb_build_object('standing','DNR','reason','custody_approval_required');
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
            when p_surface_scope='c3field_plus_canopy'
              then jsonb_build_array('c3field','canopy')
            else jsonb_build_array('c3field')
          end,
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
  if v_host is not null then
    v_url:='https://'||v_host||'/';
  end if;

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
      when p_surface_scope='c3field_plus_canopy'
        then jsonb_build_array('c3field','canopy')
      else jsonb_build_array('c3field')
    end,
    'resolved_at',v_now
  );
end;
$$;

revoke all on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text)
from public,anon,authenticated;
grant execute on function public.c3_pac_set_personal_encounter_projection_v1(text,text,text,text,text)
to service_role;
