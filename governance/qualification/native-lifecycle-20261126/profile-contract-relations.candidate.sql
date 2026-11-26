-- UNINSTALLED exact contract adapter in existing evaluator; no synthetic Registry relation.
CREATE OR REPLACE FUNCTION public.c3_pac_evaluate(p_pac_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO 'public'
AS $function$
declare
  v_pac public.c3_pac%rowtype;
  v_profile public.c3_profile_pac%rowtype;
  v_contract public.c3_pac_type_contract%rowtype;
  v_document jsonb;
  v_field text;
  v_req jsonb;
  v_role text;
  v_kind text;
  v_relation_type text;
  v_target_kind text;
  v_min integer;
  v_count integer;
  v_missing_fields jsonb := '[]'::jsonb;
  v_missing_member_roles jsonb := '[]'::jsonb;
  v_missing_relations jsonb := '[]'::jsonb;
  v_custody_integrity_conflicts jsonb := '[]'::jsonb;
  v_supersession_conflicts jsonb := '[]'::jsonb;
  v_release_blockers jsonb := '[]'::jsonb;
  v_allowed_release_states jsonb;
  v_completeness text;
  v_resolution text;
begin
  select * into v_pac
  from public.c3_pac
  where pac_key = p_pac_key;

  if not found then
    return jsonb_build_object(
      'pac_key',p_pac_key,
      'completeness_state','held',
      'resolution_state','held',
      'reason','pac_not_found'
    );
  end if;

  if v_pac.contract_key is null then
    return jsonb_build_object(
      'pac_key',v_pac.pac_key,
      'pac_type',v_pac.pac_type,
      'completeness_state','held',
      'resolution_state','held',
      'reason','contract_unbound_legacy',
      'legacy_unreconciled',true
    );
  end if;

  select * into v_contract
  from public.c3_pac_type_contract
  where contract_key=v_pac.contract_key
    and pac_type=v_pac.pac_type;

  if not found then
    return jsonb_build_object(
      'pac_key',v_pac.pac_key,
      'pac_type',v_pac.pac_type,
      'contract_key',v_pac.contract_key,
      'completeness_state','held',
      'resolution_state','held',
      'reason','contract_type_mismatch_or_missing'
    );
  end if;

  select * into v_profile
  from public.c3_profile_pac
  where pac_key=v_pac.pac_key;

  v_document := to_jsonb(v_pac)
    || jsonb_build_object(
      'profile',
      case
        when v_profile.pac_key is null then 'null'::jsonb
        else to_jsonb(v_profile)
      end
    );

  for v_field in
    select value
    from jsonb_array_elements_text(v_contract.required_fields)
  loop
    if not public.c3_jsonb_path_satisfied(v_document,v_field) then
      v_missing_fields := v_missing_fields || jsonb_build_array(v_field);
    end if;
  end loop;

  for v_req in
    select value
    from jsonb_array_elements(v_contract.required_member_roles)
  loop
    v_role := nullif(v_req->>'role','');
    v_kind := nullif(v_req->>'kind','');
    v_min := greatest(coalesce((v_req->>'min')::integer,1),1);

    select count(*)::integer into v_count
    from public.c3_pac_member m
    where m.pac_key=v_pac.pac_key
      and m.standing='active'
      and (v_role is null or m.member_role=v_role)
      and (v_kind is null or m.member_kind=v_kind);

    if v_count < v_min then
      v_missing_member_roles := v_missing_member_roles
        || jsonb_build_array(
          jsonb_build_object(
            'role',v_role,
            'kind',v_kind,
            'required',v_min,
            'observed',v_count
          )
        );
    else
      if coalesce((v_req->>'custody_required')::boolean,false) then
        if exists (
          select 1
          from public.c3_pac_member m
          where m.pac_key=v_pac.pac_key
            and m.standing='active'
            and (v_role is null or m.member_role=v_role)
            and (v_kind is null or m.member_kind=v_kind)
            and (
              m.custody_provider is null
              or (m.custody_identifier is null and m.custody_location is null)
            )
        ) then
          v_custody_integrity_conflicts := v_custody_integrity_conflicts
            || jsonb_build_array(
              jsonb_build_object('role',v_role,'kind',v_kind,'conflict','custody_required')
            );
        end if;
      end if;

      if coalesce((v_req->>'integrity_required')::boolean,false) then
        if exists (
          select 1
          from public.c3_pac_member m
          where m.pac_key=v_pac.pac_key
            and m.standing='active'
            and (v_role is null or m.member_role=v_role)
            and (v_kind is null or m.member_kind=v_kind)
            and (m.integrity_algorithm is null or m.integrity_value is null)
        ) then
          v_custody_integrity_conflicts := v_custody_integrity_conflicts
            || jsonb_build_array(
              jsonb_build_object('role',v_role,'kind',v_kind,'conflict','integrity_required')
            );
        end if;
      end if;
    end if;
  end loop;

  for v_req in
    select value
    from jsonb_array_elements(v_contract.required_relations)
  loop
    v_relation_type := nullif(v_req->>'relation_type','');
    v_target_kind := nullif(v_req->>'target_kind','');
    v_min := greatest(coalesce((v_req->>'min')::integer,1),1);

    -- The admitted ProfilePAC contract expresses EnvPAC chain predicates, not
    -- c3_pac_relation rows. Qualify those exact predicates; unknown rules refuse.
    if v_contract.contract_key='pac_contract_profilepac_v1'
      and v_req->>'relation' in ('Connect EnvPAC -> c1My_Env','c1My_Env -> ProfilePAC') then
      select count(*)::integer into v_count
      from public.c3_envpac ep join public.c3_environment ce on ce.env_key=ep.env_key
      where ep.envpac_key=v_pac.envpac_key and ep.is_effective and ep.superseded_at is null
        and ce.is_active and ep.metadata->>'formed_from_c1'='true'
        and (v_req->>'relation'<>'c1My_Env -> ProfilePAC' or (
          v_profile.subject_type=ep.owner_subject_type and v_profile.subject_key=ep.owner_subject_key
          and exists(select 1 from public.c3_envpac_runtime_primitive rp
            where rp.envpac_key=ep.envpac_key and rp.primitive_key='profile_pac'
              and rp.primitive_class='participant_formable_pac' and rp.standing='active'
              and rp.config->>'contract_key'='pac_contract_profilepac_v1')));
    elsif v_contract.contract_key='pac_contract_profilepac_v1' and v_req ? 'relation'
      and not (v_req ? 'relation_type') then
      v_count:=0;
    else
    select count(*)::integer into v_count
    from public.c3_pac_relation r
    where r.source_pac_key=v_pac.pac_key
      and r.standing='active'
      and (v_relation_type is null or r.relation_type=v_relation_type)
      and (v_target_kind is null or r.target_kind=v_target_kind);
    end if;

    if v_count < v_min then
      v_missing_relations := v_missing_relations
        || jsonb_build_array(
          jsonb_build_object(
            'relation_type',v_relation_type,
            'target_kind',v_target_kind,
            'required',v_min,
            'observed',v_count
          )
        );
    end if;
  end loop;

  if v_pac.superseded_at is not null and v_pac.is_effective then
    v_supersession_conflicts := v_supersession_conflicts
      || jsonb_build_array('superseded_pac_marked_effective');
  end if;

  if v_pac.supersedes_pac_key = v_pac.pac_key then
    v_supersession_conflicts := v_supersession_conflicts
      || jsonb_build_array('self_supersession');
  end if;

  if coalesce((v_contract.release_policy->>'requires_effective')::boolean,false)
     and not v_pac.is_effective then
    v_release_blockers := v_release_blockers || jsonb_build_array('pac_not_effective');
  end if;

  v_allowed_release_states := v_contract.release_policy->'allowed_release_states_for_resolution';

  if v_allowed_release_states is not null
     and jsonb_typeof(v_allowed_release_states)='array'
     and jsonb_array_length(v_allowed_release_states)>0
     and not exists (
       select 1
       from jsonb_array_elements_text(v_allowed_release_states) s(value)
       where s.value = coalesce(v_pac.release_state,'')
     ) then
    v_release_blockers := v_release_blockers
      || jsonb_build_array(
        jsonb_build_object(
          'release_state',v_pac.release_state,
          'allowed',v_allowed_release_states
        )
      );
  end if;

  v_completeness := case
    when jsonb_array_length(v_missing_fields)=0
      and jsonb_array_length(v_missing_member_roles)=0
      and jsonb_array_length(v_missing_relations)=0
      and jsonb_array_length(v_custody_integrity_conflicts)=0
      and jsonb_array_length(v_supersession_conflicts)=0
    then 'pass'
    else 'held'
  end;

  v_resolution := case
    when v_completeness='pass'
      and jsonb_array_length(v_release_blockers)=0
    then 'pass'
    else 'held'
  end;

  return jsonb_build_object(
    'pac_key',v_pac.pac_key,
    'pac_type',v_pac.pac_type,
    'contract_key',v_contract.contract_key,
    'contract_version',v_contract.contract_version,
    'completeness_state',v_completeness,
    'resolution_state',v_resolution,
    'missing_required_fields',v_missing_fields,
    'missing_member_roles',v_missing_member_roles,
    'missing_relations',v_missing_relations,
    'custody_integrity_conflicts',v_custody_integrity_conflicts,
    'supersession_conflicts',v_supersession_conflicts,
    'release_blockers',v_release_blockers,
    'authority_effect',coalesce(v_pac.authority_effect,v_contract.authority_effect,'none')
  );
end;
$function$
