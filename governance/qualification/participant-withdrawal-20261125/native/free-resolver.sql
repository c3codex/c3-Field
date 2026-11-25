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
