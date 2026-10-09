-- M2 typed CAR / 322 relational admission contract v1.
-- Authority: oar2_car_322_relational_admission_contract_chazz_20261008_016
-- Validates admission only. No encounter, relation, Current, CURRENT, NUG, or external effect mutation.

begin;

create or replace function public.validate_c3_car_322_admission_v1(p_payload jsonb)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,extensions,pg_temp
as $$
declare
  v_six constant text[] := array[
    'identity','ownership','custody','verification','relationship','persistence'
  ];
  v_allowed_states constant text[] := array[
    'missing','declared','observed','governed','conflicting'
  ];
  v_allowed_dispositions constant text[] := array[
    'observation_no_authority',
    'HLD',
    'CURRENT_accrual_same_Current',
    'successor_Current_plus_CURRENT',
    'DNR_when_supported'
  ];
  v_current public.c3_current_state%rowtype;
  v_conditions jsonb;
  v_evidence_manifest jsonb;
  v_nug_occurrences jsonb;
  v_checkpoint jsonb;
  v_condition_key text;
  v_condition jsonb;
  v_condition_state text;
  v_refs jsonb;
  v_ref text;
  v_evidence jsonb;
  v_occurrence_key text;
  v_n integer;
  v_missing text[] := array[]::text[];
  v_conflicting text[] := array[]::text[];
  v_evidence_gaps text[] := array[]::text[];
  v_requested text;
  v_normalized_conditions jsonb := '{}'::jsonb;
  v_normalized_evidence jsonb := '[]'::jsonb;
  v_normalized_nugs jsonb := '[]'::jsonb;
  v_normalized jsonb;
  v_hash text;
begin
  if jsonb_typeof(p_payload) is distinct from 'object' then
    return jsonb_build_object('standing','HLD','reason','car_payload_must_be_object');
  end if;

  if nullif(btrim(p_payload->>'car_key'),'') is null
     or nullif(btrim(p_payload->>'encounter_class'),'') is null
     or nullif(btrim(p_payload->>'env_key'),'') is null
     or nullif(btrim(p_payload->>'subject_type'),'') is null
     or nullif(btrim(p_payload->>'subject_key'),'') is null
     or nullif(btrim(p_payload->>'current_state_key'),'') is null then
    return jsonb_build_object('standing','HLD','reason','car_identity_incomplete');
  end if;

  if p_payload->>'encounter_grammar' is distinct from '3-2-2' then
    return jsonb_build_object('standing','HLD','reason','encounter_grammar_mismatch');
  end if;

  if p_payload->>'relational_condition_contract' is distinct from 'c3_six_relational_conditions_v1' then
    return jsonb_build_object('standing','HLD','reason','relational_condition_contract_mismatch');
  end if;

  if not exists(
    select 1 from public.system_process_registry
    where process_key='c3_six_relational_conditions_v1'
      and process_status='active'
      and authority_state='operator_confirmed'
  ) then
    return jsonb_build_object('standing','HLD','reason','six_relational_condition_contract_not_active');
  end if;

  select * into v_current
  from public.c3_current_state
  where current_state_key=p_payload->>'current_state_key'
    and env_key=p_payload->>'env_key'
    and is_current=true
    and superseded_at is null
    and effective_at<=now()
  limit 1;

  if not found then
    return jsonb_build_object(
      'standing','HLD',
      'reason','exact_current_not_resolved',
      'current_state_key',p_payload->>'current_state_key',
      'env_key',p_payload->>'env_key'
    );
  end if;

  v_conditions := p_payload->'conditions';
  if jsonb_typeof(v_conditions) is distinct from 'object' then
    return jsonb_build_object('standing','HLD','reason','six_conditions_must_be_object');
  end if;

  select count(*) into v_n from jsonb_object_keys(v_conditions);
  if v_n<>6 then
    return jsonb_build_object('standing','HLD','reason','six_condition_key_count_mismatch','resolved_count',v_n);
  end if;

  foreach v_condition_key in array v_six loop
    if not (v_conditions ? v_condition_key) then
      return jsonb_build_object('standing','HLD','reason','six_condition_missing','condition_key',v_condition_key);
    end if;

    v_condition := v_conditions->v_condition_key;
    if jsonb_typeof(v_condition) is distinct from 'object' then
      return jsonb_build_object('standing','HLD','reason','condition_must_be_object','condition_key',v_condition_key);
    end if;

    v_condition_state := v_condition->>'condition_state';
    if v_condition_state is null or not (v_condition_state=any(v_allowed_states)) then
      return jsonb_build_object(
        'standing','HLD','reason','condition_state_invalid',
        'condition_key',v_condition_key,'condition_state',v_condition_state
      );
    end if;

    v_refs := coalesce(v_condition->'evidence_refs','[]'::jsonb);
    if jsonb_typeof(v_refs) is distinct from 'array' then
      return jsonb_build_object('standing','HLD','reason','condition_evidence_refs_must_be_array','condition_key',v_condition_key);
    end if;

    if exists(
      select 1 from jsonb_array_elements(v_refs) x
      where jsonb_typeof(x) is distinct from 'string'
         or nullif(btrim(x#>>'{}'),'') is null
    ) then
      return jsonb_build_object('standing','HLD','reason','condition_evidence_ref_invalid','condition_key',v_condition_key);
    end if;

    if v_condition_state='missing' then
      v_missing := array_append(v_missing,v_condition_key);
    elsif v_condition_state='conflicting' then
      v_conflicting := array_append(v_conflicting,v_condition_key);
    end if;

    if v_condition_state<>'missing' and jsonb_array_length(v_refs)=0 then
      v_evidence_gaps := array_append(v_evidence_gaps,v_condition_key);
    end if;

    v_normalized_conditions := v_normalized_conditions || jsonb_build_object(
      v_condition_key,
      jsonb_build_object(
        'condition_state',v_condition_state,
        'evidence_refs',v_refs
      )
    );
  end loop;

  v_evidence_manifest := coalesce(p_payload->'evidence_manifest','[]'::jsonb);
  if jsonb_typeof(v_evidence_manifest) is distinct from 'array' then
    return jsonb_build_object('standing','HLD','reason','evidence_manifest_must_be_array');
  end if;

  for v_evidence in select value from jsonb_array_elements(v_evidence_manifest) loop
    if jsonb_typeof(v_evidence) is distinct from 'object'
       or nullif(btrim(v_evidence->>'evidence_ref'),'') is null
       or nullif(btrim(v_evidence->>'condition_key'),'') is null
       or nullif(btrim(v_evidence->>'evidence_class'),'') is null
       or nullif(btrim(v_evidence->>'evidence_state'),'') is null
       or nullif(btrim(v_evidence->>'provenance_ref'),'') is null
       or nullif(btrim(v_evidence->>'custody_ref'),'') is null then
      return jsonb_build_object('standing','HLD','reason','evidence_manifest_entry_incomplete');
    end if;

    if not ((v_evidence->>'condition_key')=any(v_six)) then
      return jsonb_build_object(
        'standing','HLD','reason','evidence_condition_invalid',
        'condition_key',v_evidence->>'condition_key'
      );
    end if;

    if not ((v_evidence->>'evidence_state')=any(v_allowed_states)) then
      return jsonb_build_object(
        'standing','HLD','reason','evidence_state_invalid',
        'evidence_ref',v_evidence->>'evidence_ref'
      );
    end if;
  end loop;

  -- Every condition-level reference must resolve to a manifest entry for that same condition.
  foreach v_condition_key in array v_six loop
    v_refs := coalesce(v_conditions->v_condition_key->'evidence_refs','[]'::jsonb);
    for v_ref in select value from jsonb_array_elements_text(v_refs) loop
      if not exists(
        select 1
        from jsonb_array_elements(v_evidence_manifest) e
        where e->>'evidence_ref'=v_ref
          and e->>'condition_key'=v_condition_key
      ) then
        return jsonb_build_object(
          'standing','HLD',
          'reason','condition_evidence_manifest_binding_missing',
          'condition_key',v_condition_key,
          'evidence_ref',v_ref
        );
      end if;
    end loop;
  end loop;

  select coalesce(
    jsonb_agg(value order by value->>'condition_key',value->>'evidence_ref'),
    '[]'::jsonb
  )
  into v_normalized_evidence
  from jsonb_array_elements(v_evidence_manifest);

  v_nug_occurrences := coalesce(p_payload->'nug_occurrences','[]'::jsonb);
  if jsonb_typeof(v_nug_occurrences) is distinct from 'array' then
    return jsonb_build_object('standing','HLD','reason','nug_occurrences_must_be_array');
  end if;

  if exists(
    select 1 from jsonb_array_elements(v_nug_occurrences) x
    where jsonb_typeof(x) is distinct from 'string'
       or nullif(btrim(x#>>'{}'),'') is null
  ) then
    return jsonb_build_object('standing','HLD','reason','nug_occurrence_key_invalid');
  end if;

  for v_occurrence_key in select value from jsonb_array_elements_text(v_nug_occurrences) loop
    if exists(
      select 1 from public.c3ops_nug_occurrence
      where occurrence_key=v_occurrence_key
        and current_state_key is distinct from v_current.current_state_key
    ) then
      return jsonb_build_object(
        'standing','HLD',
        'reason','nug_occurrence_current_mismatch',
        'occurrence_key',v_occurrence_key
      );
    end if;

    select count(*) into v_n
    from public.c3ops_nug_occurrence o
    join public.c3ops_nug_binding b on b.nug_key=o.nug_key
    where o.occurrence_key=v_occurrence_key
      and o.current_state_key=v_current.current_state_key
      and b.standing='active'
      and jsonb_array_length(coalesce(b.missing_predicates,'[]'::jsonb))=0;

    if v_n<>1 then
      return jsonb_build_object(
        'standing','HLD',
        'reason','nug_occurrence_authority_unresolved',
        'occurrence_key',v_occurrence_key
      );
    end if;
  end loop;

  select coalesce(jsonb_agg(to_jsonb(value) order by value),'[]'::jsonb)
  into v_normalized_nugs
  from jsonb_array_elements_text(v_nug_occurrences);

  v_checkpoint := p_payload->'checkpoint';
  if jsonb_typeof(v_checkpoint) is distinct from 'object'
     or nullif(btrim(v_checkpoint->>'checkpoint_key'),'') is null
     or nullif(btrim(v_checkpoint->>'replay_key'),'') is null
     or nullif(btrim(v_checkpoint->>'next_owner'),'') is null then
    return jsonb_build_object('standing','HLD','reason','checkpoint_incomplete');
  end if;

  if v_checkpoint->>'effect_replay_policy' is distinct from 'do_not_repeat_completed_effects' then
    return jsonb_build_object('standing','HLD','reason','effect_replay_policy_invalid');
  end if;

  v_requested := p_payload->>'requested_disposition';
  if v_requested is null or not (v_requested=any(v_allowed_dispositions)) then
    return jsonb_build_object(
      'standing','HLD','reason','requested_disposition_invalid',
      'requested_disposition',v_requested
    );
  end if;

  if v_requested in ('CURRENT_accrual_same_Current','successor_Current_plus_CURRENT')
     and (
       cardinality(v_missing)>0
       or cardinality(v_conflicting)>0
       or cardinality(v_evidence_gaps)>0
     ) then
    return jsonb_build_object(
      'standing','HLD',
      'reason','condition_evidence_incomplete_for_state_effect_request',
      'missing_conditions',to_jsonb(v_missing),
      'conflicting_conditions',to_jsonb(v_conflicting),
      'evidence_gaps',to_jsonb(v_evidence_gaps),
      'resolution_authority_created',false,
      'state_mutation_performed',false
    );
  end if;

  v_normalized := jsonb_build_object(
    'contract_key','c3_car_322_relational_admission_contract_v1',
    'car_key',p_payload->>'car_key',
    'encounter_grammar','3-2-2',
    'encounter_class',p_payload->>'encounter_class',
    'env_key',v_current.env_key,
    'subject_type',p_payload->>'subject_type',
    'subject_key',p_payload->>'subject_key',
    'current_state_key',v_current.current_state_key,
    'current_state_version',v_current.state_version,
    'relational_condition_contract','c3_six_relational_conditions_v1',
    'conditions',v_normalized_conditions,
    'evidence_manifest',v_normalized_evidence,
    'nug_occurrences',v_normalized_nugs,
    'requested_disposition',v_requested,
    'checkpoint',jsonb_build_object(
      'checkpoint_key',v_checkpoint->>'checkpoint_key',
      'replay_key',v_checkpoint->>'replay_key',
      'effect_replay_policy','do_not_repeat_completed_effects',
      'next_owner',v_checkpoint->>'next_owner'
    )
  );

  v_hash := encode(
    extensions.digest(convert_to(v_normalized::text,'UTF8'),'sha256'),
    'hex'
  );

  return jsonb_build_object(
    'standing','admissible_for_governed_resolution',
    'contract_key','c3_car_322_relational_admission_contract_v1',
    'car_key',p_payload->>'car_key',
    'current_state_key',v_current.current_state_key,
    'current_state_version',v_current.state_version,
    'requested_disposition',v_requested,
    'missing_conditions',to_jsonb(v_missing),
    'conflicting_conditions',to_jsonb(v_conflicting),
    'evidence_gaps',to_jsonb(v_evidence_gaps),
    'nug_occurrence_count',jsonb_array_length(v_normalized_nugs),
    'admission_sha256',v_hash,
    'normalized_admission',v_normalized,
    'resolution_authority_created',false,
    'state_mutation_performed',false,
    'external_effect_performed',false
  );
end
$$;

revoke all on function public.validate_c3_car_322_admission_v1(jsonb)
from public,anon,authenticated;
grant execute on function public.validate_c3_car_322_admission_v1(jsonb)
to service_role;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,
  created_at,updated_at
)
values (
  'c3_car_322_relational_admission_contract_v1',
  'c3_field',
  'CAR / 322 Relational Admission Contract v1',
  'active',
  'supabase/migrations/20261009010800_car_322_relational_admission_contract_v1.sql',
  'operator_confirmed_registered',
  jsonb_build_object(
    'operator','op044',
    'encounter_grammar','3-2-2',
    'car_role','bounded encounter vehicle',
    'six_contract','c3_six_relational_conditions_v1',
    'condition_keys',jsonb_build_array(
      'identity','ownership','custody','verification','relationship','persistence'
    ),
    'condition_states',jsonb_build_array(
      'missing','declared','observed','governed','conflicting'
    ),
    'requested_dispositions',jsonb_build_array(
      'observation_no_authority',
      'HLD',
      'CURRENT_accrual_same_Current',
      'successor_Current_plus_CURRENT',
      'DNR_when_supported'
    ),
    'nug_relation','existing NUG occurrence keys may be referenced only when bound to the exact operative Current and an active NUG binding',
    'checkpoint_rule','checkpoint_key + replay_key + do_not_repeat_completed_effects + next_owner required',
    'admission_effect','validation_only',
    'state_mutation_authorized',false,
    'current_mutation_authorized',false,
    'CURRENT_mutation_authorized',false,
    'relationship_mutation_authorized',false,
    'nug_execution_authorized',false,
    'external_effect_authorized',false,
    'specific_car_implementations_preserved',jsonb_build_array('evaluate_relational_car_v1'),
    'oar_ref','oar2_car_322_relational_admission_contract_chazz_20261008_016'
  ),
  'CAR / 322 Relational Admission Contract v1',
  'Typed admission grammar for bounded 3-2-2 encounters across governed c3 environments',
  'active',
  'registered_runtime_admission_contract',
  jsonb_build_array(
    'process:c3_six_relational_conditions_v1',
    'process:c3_322_six_touchpoint_current_resolution_v1',
    'function:validate_c3_car_322_admission_v1(jsonb)',
    'table:c3_current_state',
    'table:c3_current_evidence_ref',
    'table:c3ops_nug_occurrence'
  ),
  'oar2',true,true,true,now(),now()
)
on conflict (process_key) do update
set title=excluded.title,
    status=excluded.status,
    source_path=excluded.source_path,
    authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    process_title=excluded.process_title,
    process_scope=excluded.process_scope,
    process_status=excluded.process_status,
    authority_level=excluded.authority_level,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
      'runtime_admission_contract','c3_car_322_relational_admission_contract_v1',
      'runtime_admission_validator','validate_c3_car_322_admission_v1(jsonb)',
      'implementation_state','typed_admission_contract_active_persistence_and_resolution_effects_separately_gated',
      'admission_contract_oar','oar2_car_322_relational_admission_contract_chazz_20261008_016'
    ),
    updated_at=now()
where process_key='c3_322_six_touchpoint_current_resolution_v1';

commit;
