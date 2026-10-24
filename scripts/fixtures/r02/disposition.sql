-- Part of the R02 source candidate. No new tables or state vocabulary.
-- The installation must separately normalize the registered process mode and
-- qualify trusted verifier identities and exact acceptance contracts in grants.
create or replace function public.resolve_cancom_oar_disposition_v1(
  p_execution_instance text,p_validator_capability text
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  q public.system_oar_queue%rowtype;
  p public.c3_oar_process_instance%rowtype;
  c public.c3ops_oar_custody_resolution_event%rowtype;
  g public.c3_envpac_capability_grant%rowtype;
  x public.c3_envpac_capability_grant%rowtype;
  r public.system_oar_execution_evidence%rowtype;
  old public.system_oar_execution_evidence%rowtype;
  actor text:=public.cancom_bound_actor_v1();
  contract jsonb; objective jsonb; receipt jsonb; decisions jsonb:='[]';
  holds jsonb:='[]'; classification text; disposition jsonb;
  all_pass boolean:=true; escalated boolean:=false; effect text;
  k text; matched integer; report_hash text; final_key text;
begin
  -- Serialize against native return as well as another validator. A crash rolls
  -- back the whole SQL statement; no durable half-finalization is acknowledged.
  perform pg_advisory_xact_lock(hashtextextended('cancom_oar1_return|'||p_execution_instance,0));
  select * into q from public.system_oar_queue where scope_key=p_execution_instance for update;
  if not found then return jsonb_build_object('standing','HLD','reason','missing_exact_instance'); end if;
  select * into g from public.c3_envpac_capability_grant where capability_key=p_validator_capability for share;
  if actor is null or g.standing is distinct from 'active'
    or not coalesce(public.cancom_finite_grant_v1(g.scope),false)
    or g.scope->>'actor_ref' is distinct from actor
    or g.scope->>'execution_instance' is distinct from p_execution_instance
    or g.scope->>'oar_key' is distinct from q.oar_key
    or g.scope->>'process_key' is distinct from 'oar_lifecycle_resolution_v1'
    or not coalesce(g.scope->'allowed_actions' ? 'finalize_oar_disposition',false)
    or actor=q.automation_permissions->>'executor_ref' then
    return jsonb_build_object('standing','HLD','reason','held_identity_or_authority_mismatch');
  end if;
  if not exists(select 1 from public.system_process_registry z where
    z.process_key='oar_lifecycle_resolution_v1' and z.process_status='active'
    and z.metadata->>'postreturn_mode'='computational_original_oar2'
    and nullif(z.metadata->>'computational_policy_source_ref','') is not null) then
    return jsonb_build_object('standing','HLD','reason','registered_computational_policy_not_operative');
  end if;
  contract:=q.automation_permissions->'computational_acceptance';
  if jsonb_typeof(contract->'objectives') is distinct from 'array'
    or jsonb_array_length(contract->'objectives')=0
    or contract->>'original_oar2_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or contract->>'policy' is distinct from 'original_oar2_acceptance_v1' then
    return jsonb_build_object('standing','HLD','reason','acceptance_contract_not_qualified');
  end if;
  if (select count(*) from jsonb_array_elements(contract->'objectives')) <>
    (select count(distinct value->>'effect_key') from jsonb_array_elements(contract->'objectives')) then
    return jsonb_build_object('standing','HLD','reason','ambiguous_effect_identity');
  end if;
  select * into x from public.c3_envpac_capability_grant where capability_key=q.automation_permissions->>'capability_ref' for share;
  if x.standing is distinct from 'active' or not coalesce(public.cancom_finite_grant_v1(x.scope),false)
    or x.scope->>'execution_instance' is distinct from p_execution_instance
    or x.scope->>'oar_key' is distinct from q.oar_key
    or x.scope->>'executor_ref' is distinct from q.automation_permissions->>'executor_ref'
    or x.scope->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or x.scope->>'source_ref' is distinct from q.automation_permissions->>'canonical_payload_ref'
    or x.scope->>'source_bytes' is distinct from q.automation_permissions->>'canonical_payload_bytes'
    or x.scope->'computational_acceptance' is distinct from contract then
    return jsonb_build_object('standing','HLD','reason','original_authority_unresolved');
  end if;
  if not exists(select 1 from public.c3ops_notchazz_oar_formation_evaluation n where
    n.execution_instance=p_execution_instance and n.oar_key=q.oar_key and n.result='PASS'
    and n.standing='active' and n.evaluator='notchazz'
    and n.oar_integrity_sha256=q.automation_permissions->>'canonical_sha256'
    and n.unresolved_predicates='[]'::jsonb) then
    return jsonb_build_object('standing','HLD','reason','independent_notchazz_missing');
  end if;
  if not exists(select 1 from public.c3ops_oar_custody_resolution_event m where
    m.resolution_event_key=p_execution_instance||':oar2:registry_manifest_delivery'
    and m.object_type='oar2' and m.object_identifier=q.oar_key
    and m.related_execution_instance=p_execution_instance
    and m.custody_reference=q.automation_permissions->>'canonical_payload_ref'
    and m.integrity_hash=q.automation_permissions->>'canonical_sha256'
    and m.metadata->>'payload_bytes'=q.automation_permissions->>'canonical_payload_bytes'
    and m.standing='delivered_for_execution' and m.resolution_status='resolved')
    or not exists(select 1 from public.c3ops_cancom_notification_event n where
      n.event_key=p_execution_instance||':wake:001' and n.actor_key=q.automation_permissions->>'executor_ref'
      and n.evidence->>'oar_key'=q.oar_key and n.evidence->>'queue_key'=q.queue_key
      and n.evidence->>'return_route'=q.expected_oar1_path) then
    return jsonb_build_object('standing','HLD','reason','delivery_source_or_route_unresolved');
  end if;
  select count(*) into matched from public.c3ops_oar_custody_resolution_event where
    related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  if matched<>1 then return jsonb_build_object('standing','HLD','reason','return_missing_or_ambiguous'); end if;
  select * into c from public.c3ops_oar_custody_resolution_event where
    related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  report_hash:=encode(sha256(convert_to(c.metadata->'evidence'->>'oar1_text','UTF8')),'hex');
  if report_hash is null or c.integrity_hash is distinct from report_hash
    or octet_length(convert_to(c.metadata->'evidence'->>'oar1_text','UTF8'))::text is distinct from c.metadata->'evidence'->>'oar1_bytes'
    or c.metadata->>'executor_ref' is distinct from q.automation_permissions->>'executor_ref'
    or c.metadata->'evidence'->>'canonical_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or c.metadata->'evidence'->>'canonical_payload_ref' is distinct from q.automation_permissions->>'canonical_payload_ref'
    or c.metadata->'evidence'->>'origin_oar2_key' is distinct from q.oar_key
    or c.custody_reference is distinct from q.expected_oar1_path
    or q.oar1_path is distinct from q.expected_oar1_path
    or q.expected_oar1_path is distinct from 'registry://cancom/oar1_return/'||p_execution_instance then
    return jsonb_build_object('standing','HLD','reason','return_binding_or_digest_failed');
  end if;
  select * into p from public.c3_oar_process_instance where process_instance_key=p_execution_instance for update;
  if not found or p.actual_oar1_path is distinct from q.oar1_path or p.execution_standing<>'completed' then
    return jsonb_build_object('standing','HLD','reason','return_process_incomplete');
  end if;
  if not exists(select 1 from public.c3_oar_transition_event t where
    t.transition_event_key=p_execution_instance||':oar1_return'
    and t.process_instance_key=p_execution_instance and t.actor=q.automation_permissions->>'executor_ref'
    and t.to_status=p.execution_standing
    and t.evidence_reference='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key)
    or not exists(select 1 from public.system_oar_execution_evidence e where
      e.evidence_key=p_execution_instance||':oar1_return' and e.queue_key=q.queue_key
      and e.validation_result=c.metadata->'evidence'
      and e.artifact_path='registry://c3ops_oar_custody_resolution_event/'||c.resolution_event_key) then
    return jsonb_build_object('standing','HLD','reason','immutable_return_linkage_incomplete');
  end if;
  -- Contract objectives, not a caller's desired-effects list, drive adjudication.
  for objective in select value from jsonb_array_elements(contract->'objectives') loop
    effect:=objective->>'effect_key'; classification:='HOLD_UNVERIFIED'; receipt:=null;
    if nullif(effect,'') is null or objective->>'effect_class' not in ('inspection','implementation')
      or nullif(objective->>'action','') is null or nullif(objective->>'environment','') is null
      or nullif(objective->>'source_revision','') is null or nullif(objective->>'runtime_revision','') is null
      or jsonb_typeof(objective->'required_predicates') is distinct from 'array'
      or jsonb_array_length(objective->'required_predicates')=0 then
      holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','acceptance_predicates_unqualified'));
    else
      select * into r from public.system_oar_execution_evidence where
        queue_key=q.queue_key and evidence_key=p_execution_instance||':acceptance:'||effect;
      if found then
        receipt:=r.validation_result;
        select * into g from public.c3_envpac_capability_grant where capability_key=receipt->>'verifier_capability' for share;
        if receipt->>'kind' is distinct from 'independent_acceptance_receipt_v1'
          or receipt->>'oar1_sha256' is distinct from report_hash
          or receipt->'objective' is distinct from objective
          or receipt->>'observed_effects_sha256' is distinct from encode(sha256(convert_to(objective::text,'UTF8')),'hex')
          or receipt->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
          or receipt->'observed_identity' is distinct from jsonb_build_object(
            'environment',objective->>'environment','source_revision',objective->>'source_revision',
            'runtime_revision',objective->>'runtime_revision','action',objective->>'action',
            'executor',q.automation_permissions->>'executor_ref','execution_instance',p_execution_instance)
          or receipt->>'verifier_actor' is distinct from actor
          or g.standing is distinct from 'active' or not coalesce(public.cancom_finite_grant_v1(g.scope),false)
          or g.scope->>'actor_ref' is distinct from actor
          or g.scope->>'execution_instance' is distinct from p_execution_instance
          or not coalesce(g.scope->'allowed_actions' ? 'record_oar_acceptance_receipt',false)
          or g.scope->'computational_acceptance' is distinct from contract
          or (receipt->>'valid_until')::timestamptz<=clock_timestamp() then
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','stale_or_unbound_independent_evidence'));
        elsif receipt->>'boundary_changed'='true' or receipt->>'contested_semantics'='true' then
          classification:='ESCALATE_BOUNDARY'; escalated:=true;
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','new_authority_or_contested_semantics'));
        elsif receipt->>'outcome'='PASS' and (receipt->'passed_predicates') @> (objective->'required_predicates')
          and (objective->>'effect_class'='inspection' and nullif(receipt->>'inspection_evidence_ref','') is not null
            or objective->>'effect_class'='implementation'
              and coalesce(receipt->>'before_digest','') ~ '^[0-9a-f]{64}$'
              and coalesce(receipt->>'after_digest','') ~ '^[0-9a-f]{64}$'
              and nullif(receipt->>'positive_test_ref','') is not null
              and nullif(receipt->>'negative_test_ref','') is not null
              and receipt->>'test_exit_code'='0' and nullif(receipt->>'runtime_receipt_ref','') is not null) then
          classification:=case when objective->>'discovery_required'='true' then 'DISCOVER_AND_RESOLVE' else 'RESOLVE_KNOWN' end;
        else
          holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','failed_or_insufficient_effect_proof'));
        end if;
      else
        holds:=holds||jsonb_build_array(jsonb_build_object('effect_key',effect,'reason','independent_evidence_missing'));
      end if;
    end if;
    if classification in ('HOLD_UNVERIFIED','ESCALATE_BOUNDARY') then all_pass:=false; end if;
    decisions:=decisions||jsonb_build_array(jsonb_build_object('effect_key',effect,'classification',classification,
      'authorized_objective',objective,'evidence_key',r.evidence_key));
  end loop;
  final_key:=p_execution_instance||':computational_disposition';
  disposition:=jsonb_build_object('kind','computational_disposition_v1','source_sha256',q.automation_permissions->>'canonical_sha256',
    'oar1_sha256',report_hash,'objectives',decisions,'held_predicates',holds,'outcome',case when all_pass then 'automatic_pass' else 'operator_required' end,
    'authorized_outcome',contract->>'authorized_outcome','next_dependency',case when all_pass then null else 'resolve_exact_held_predicates' end);
  select * into old from public.system_oar_execution_evidence where evidence_key=final_key;
  if found then
    if old.validation_result=disposition then
      return old.validation_result||jsonb_build_object('classification',case when all_pass then 'REUSE_RESOLVED' else 'HOLD_UNVERIFIED' end,'idempotent',true);
    end if;
    return jsonb_build_object('standing','HLD','reason','contradictory_disposition_requires_qualified_reconciliation');
  end if;
  insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,evidence_summary,validation_result,artifact_path)
    values(final_key,q.queue_key,'runtime_validation','Original OAR2 computational acceptance; no new authority',disposition,
      'registry://system_oar_execution_evidence/'||final_key);
  update public.system_oar_queue set queue_status=case when all_pass then 'closed' else 'held' end,
    blocked_reason=case when all_pass then null else 'computational_acceptance_predicates_held' end,updated_at=now() where queue_key=q.queue_key;
  update public.c3_oar_process_instance set validation_standing=case when all_pass then 'automatic_pass' else 'operator_required' end,
    held_standing=case when all_pass then null else 'held_pending_validation' end,
    validation_finding=disposition::text,updated_at=now() where process_instance_key=p_execution_instance;
  insert into public.c3_oar_transition_event(transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,"timestamp",evidence_reference,notes)
    values(final_key,p_execution_instance,'measures',p.validation_standing,case when all_pass then 'automatic_pass' else 'operator_required' end,
      'validation',now(),'registry://system_oar_execution_evidence/'||final_key,'Deterministic original-authority disposition');
  insert into public.c3ops_oar_custody_resolution_event(resolution_event_key,process_key,object_identifier,object_type,related_system,
    intended_function,standing,integrity_hash,custody_type,custody_reference,retrieval_access_rule,related_execution_instance,related_oar1,related_oar2,resolution_status,hold_reason,metadata)
    values(final_key,'oar_lifecycle_resolution_v1',c.related_oar1,'oar1',q.system_key,'computational_disposition',
      case when all_pass then 'completed' else 'held' end,report_hash,'registry_disposition_manifest',
      'registry://system_oar_execution_evidence/'||final_key,'service_only',p_execution_instance,c.related_oar1,q.oar_key,
      case when all_pass then 'resolved' else 'held' end,case when all_pass then null else 'acceptance_predicates_held' end,disposition);
  return disposition||jsonb_build_object('idempotent',false);
end $$;

create or replace function public.record_cancom_acceptance_receipt_v1(
  p_execution_instance text,p_verifier_capability text,p_receipt jsonb
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare
  q public.system_oar_queue%rowtype; g public.c3_envpac_capability_grant%rowtype;
  c public.c3ops_oar_custody_resolution_event%rowtype; old public.system_oar_execution_evidence%rowtype;
  actor text:=public.cancom_bound_actor_v1(); objective jsonb; k text; bound jsonb; contract jsonb;
begin
  perform pg_advisory_xact_lock(hashtextextended('cancom_oar1_return|'||p_execution_instance,0));
  select * into q from public.system_oar_queue where scope_key=p_execution_instance;
  select * into g from public.c3_envpac_capability_grant where capability_key=p_verifier_capability for share;
  contract:=q.automation_permissions->'computational_acceptance';
  if actor is null or actor=q.automation_permissions->>'executor_ref' or g.standing is distinct from 'active'
    or not coalesce(public.cancom_finite_grant_v1(g.scope),false) or g.scope->>'actor_ref' is distinct from actor
    or g.scope->>'execution_instance' is distinct from p_execution_instance or g.scope->>'oar_key' is distinct from q.oar_key
    or g.scope->>'process_key' is distinct from 'oar_lifecycle_resolution_v1'
    or g.scope->>'source_sha256' is distinct from q.automation_permissions->>'canonical_sha256'
    or g.scope->'computational_acceptance' is distinct from contract
    or not coalesce(g.scope->'allowed_actions' ?& array['record_oar_acceptance_receipt','finalize_oar_disposition'],false) then
    return jsonb_build_object('standing','HLD','reason','independent_verifier_authority_missing');
  end if;
  select value into objective from jsonb_array_elements(contract->'objectives') where value->>'effect_key'=p_receipt->>'effect_key';
  if objective is null or p_receipt->'objective' is distinct from objective then
    return jsonb_build_object('standing','HLD','reason','changed_or_unqualified_effect');
  end if;
  if p_receipt->>'observed_effects_sha256' is distinct from encode(sha256(convert_to(objective::text,'UTF8')),'hex')
    or p_receipt->'observed_identity' is distinct from jsonb_build_object(
      'environment',objective->>'environment','source_revision',objective->>'source_revision',
      'runtime_revision',objective->>'runtime_revision','action',objective->>'action',
      'executor',q.automation_permissions->>'executor_ref','execution_instance',p_execution_instance)
    or nullif(p_receipt->>'observed_at','') is null or nullif(p_receipt->>'valid_until','') is null
    or (p_receipt->>'observed_at')::timestamptz>clock_timestamp()
    or (p_receipt->>'observed_at')::timestamptz<(g.scope->>'operator_confirmed_at')::timestamptz
    or (p_receipt->>'valid_until')::timestamptz> (g.scope->>'expires_at')::timestamptz
    or (p_receipt->>'valid_until')::timestamptz<=clock_timestamp() then
    return jsonb_build_object('standing','HLD','reason','unbound_or_stale_runtime_observation');
  end if;
  select * into c from public.c3ops_oar_custody_resolution_event where related_execution_instance=p_execution_instance and intended_function='cancom_oar_return';
  if not found or p_receipt->>'oar1_sha256' is distinct from c.integrity_hash then
    return jsonb_build_object('standing','HLD','reason','return_receipt_mismatch');
  end if;
  bound:=p_receipt||jsonb_build_object('kind','independent_acceptance_receipt_v1','verifier_actor',actor,
    'verifier_capability',p_verifier_capability,'source_sha256',q.automation_permissions->>'canonical_sha256');
  k:=p_execution_instance||':acceptance:'||(objective->>'effect_key');
  select * into old from public.system_oar_execution_evidence where evidence_key=k;
  if found then
    if old.validation_result is distinct from bound then return jsonb_build_object('standing','HLD','reason','contradictory_receipt_preserved'); end if;
  else
    insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,evidence_summary,validation_result,artifact_path)
      values(k,q.queue_key,'runtime_validation','Independent exact-effect runtime observation',bound,
        'registry://system_oar_execution_evidence/'||k);
  end if;
  -- Wait for all objectives before persisting a final decision; an explicitly
  -- failed receipt is still evidence and resolves to a held disposition.
  if exists(select 1 from jsonb_array_elements(contract->'objectives') o where not exists(
    select 1 from public.system_oar_execution_evidence e where e.evidence_key=p_execution_instance||':acceptance:'||(o->>'effect_key'))) then
    return jsonb_build_object('standing','pending_validation','reason','other_objective_receipts_missing');
  end if;
  return public.resolve_cancom_oar_disposition_v1(p_execution_instance,p_verifier_capability);
end $$;
revoke all on function public.resolve_cancom_oar_disposition_v1(text,text),public.record_cancom_acceptance_receipt_v1(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.resolve_cancom_oar_disposition_v1(text,text),public.record_cancom_acceptance_receipt_v1(text,text,jsonb) to service_role;
