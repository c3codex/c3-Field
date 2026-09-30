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
