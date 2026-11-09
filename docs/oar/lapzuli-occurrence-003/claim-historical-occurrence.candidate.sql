-- REVIEW-ONLY SOURCE: not a migration; not installed. No grants/authority seeded.
-- Native individual/PAC/media/provider admission is an explicit unresolved
-- dependency. Never implement it by trusting caller JSON or a shared key.
create or replace function public.claim_lapzuli_historical_occurrence_v1(
  p_operator_session_token text,p_execution_instance text,p_preflight jsonb
) returns table(execution_id uuid,claimed boolean,reason text,attempt_number integer,
                occurrence_key text,binding jsonb)
language plpgsql security invoker set search_path = '' set log_parameter_max_length_on_error='0'
as $$
declare
  v_instance constant text := 'registrar_lapzuli_native_occurrence_claim_binder_codex_003';
  v_oar constant text := 'oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003';
  v_hash constant text := '201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df';
  v_asset constant text := 'undrifted_hole_map_bluesky_dist_v1';
  v_route constant text := 'lapzuli_route_undrifted_hole_map_bluesky_dist_v1';
  v_role text; v_actor text; v_field text; v_cap public.c3_envpac_capability_grant%rowtype;
  v_caps jsonb := '{}'::jsonb; v_pickup jsonb; v_admission jsonb;
  v_tuple jsonb; v_key text; v_binding jsonb; v_claim record;
begin
  if current_user <> 'service_role' then
    return query select null::uuid,false,'trusted_service_required',null::integer,null::text,null::jsonb; return;
  end if;
  if p_execution_instance is distinct from v_instance or
     p_operator_session_token is null or p_operator_session_token !~ '^[0-9a-f]{64}$' then
    return query select null::uuid,false,'exact_instance_and_native_operator_session_required',null::integer,null::text,null::jsonb; return;
  end if;
  -- SAME lock as the existing five-arg claim. Nested transaction advisory locks
  -- are reentrant and held until outer transaction completion.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_asset,0));
  v_pickup := public.resolve_cancom_oar_pickup_v1('execution_instance',v_instance,'codex');
  if v_pickup->>'standing' is distinct from 'resolved_for_executor' or
     v_pickup->>'oar_key' is distinct from v_oar or v_pickup->>'sha256' is distinct from v_hash then
    return query select null::uuid,false,'exact_cancom_source_pickup_unresolved',null::integer,null::text,null::jsonb; return;
  end if;
  -- Scope expires_at is mandatory for these future effect grants. This does
  -- not reinterpret existing source-only grants as effect authority.
  foreach v_role in array array['operator','notchazz','registrar','executor'] loop
    v_actor := case v_role when 'operator' then 'op044' when 'notchazz' then 'notchazz'
                          when 'registrar' then 'chazz' else 'codex' end;
    select g.* into v_cap from public.c3_envpac_capability_grant g
      where g.standing='active' and g.scope->>'execution_instance'=v_instance
        and g.scope->>'oar_key'=v_oar and g.scope->>'source_oar2_sha256'=v_hash
        and g.scope->>'actor_ref'=v_actor and g.scope->>'role'=v_role
        and g.scope->'allowed_actions' ? 'admit_historical_distribution_effect'
        and g.scope->>'allowed_asset'=v_asset and g.scope->>'allowed_route'=v_route
        and g.scope->>'destination_account_identifier'='undrifted.bsky.social'
        and g.scope->'external_provider_effects_authorized'='true'::jsonb
        and g.scope->'max_new_external_effects'='1'::jsonb
        and nullif(g.scope->>'expires_at','')::timestamptz > pg_catalog.clock_timestamp()
      order by g.capability_key limit 1 for share;
    if not found then
      return query select null::uuid,false,'historical_effect_capability_unresolved:'||v_role,null::integer,null::text,null::jsonb; return;
    end if;
    v_caps := v_caps || pg_catalog.jsonb_build_object(v_role,v_cap.capability_key);
  end loop;
  -- Native verifier MUST resolve the secret token to an attested individual,
  -- current op044/environment relation and source/PAC/rights/media/NotChazz
  -- proofs under row locks, including reviewed installation hashes. It must
  -- bind the full server preflight to freshly checked current provider proof.
  -- This primitive is absent in production. An absent verifier is a HOLD,
  -- never permission to substitute metadata assertions.
  if pg_catalog.to_regprocedure('public.resolve_lapzuli_historical_admission_v1(text,text,jsonb)') is null then
    return query select null::uuid,false,'native_individual_source_effect_admission_uninstalled',null::integer,null::text,null::jsonb; return;
  end if;
  execute 'select public.resolve_lapzuli_historical_admission_v1($1,$2,$3)'
    into v_admission using p_operator_session_token,v_instance,p_preflight;
  if v_admission->>'standing' is distinct from 'admitted' then
    return query select null::uuid,false,coalesce(v_admission->>'reason','native_individual_source_effect_admission_unresolved'),null::integer,null::text,null::jsonb; return;
  end if;
  if v_admission->>'standing' is distinct from 'admitted' or
     v_admission->'individual_authenticated' is distinct from 'true'::jsonb or
     v_admission->>'operator_ref' is distinct from 'op044' or
     v_admission->>'execution_instance' is distinct from v_instance or
     v_admission->>'source_oar2' is distinct from v_oar or
     v_admission->'capabilities' is distinct from v_caps or
     v_admission->'external_effect_limit' is distinct from '1'::jsonb or
     nullif(v_admission->>'actor_evidence_ref','') is null or
     pg_catalog.jsonb_typeof(v_admission->'prepared_worker_request') is distinct from 'object' or
     v_admission->'prepared_worker_request' is distinct from p_preflight->'prepared_worker_request' or
     nullif(v_admission->>'valid_until','')::timestamptz is null or
     (v_admission->>'valid_until')::timestamptz <= pg_catalog.clock_timestamp() or
     nullif(v_admission->>'verified_at','')::timestamptz is null or
     (v_admission->>'verified_at')::timestamptz > pg_catalog.clock_timestamp() or
     (v_admission->>'verified_at')::timestamptz < pg_catalog.clock_timestamp()-interval '60 seconds' then
    return query select null::uuid,false,'native_individual_source_effect_admission_unresolved',null::integer,null::text,null::jsonb; return;
  end if;
  v_tuple := v_admission->'effect_tuple';
  -- Stable SAME-EFFECT tuple: excludes execution/OAR/actor capability and
  -- prose action descriptions, so rewording/reissuing cannot evade dedupe.
  foreach v_field in array array['source_class','source_id','source_version','source_sha256',
    'source_hash_basis','pubpac_key','pubpac_version','pubpac_sha256',
    'campaignpac_key','campaignpac_version','campaignpac_sha256','payload_sha256','media_sha256',
    'distribution_asset_key','route_key','destination_account_identifier',
    'release_scope_key','operator_source_confirmation_key'] loop
    if pg_catalog.jsonb_typeof(v_tuple->v_field) is distinct from 'string' or
       nullif(pg_catalog.btrim(v_tuple->>v_field),'') is null then
      return query select null::uuid,false,'native_effect_tuple_incomplete:'||v_field,null::integer,null::text,null::jsonb; return;
    end if;
  end loop;
  foreach v_field in array array['source_sha256','pubpac_sha256','campaignpac_sha256','payload_sha256','media_sha256'] loop
    if v_tuple->>v_field !~ '^[0-9a-f]{64}$' then
      return query select null::uuid,false,'native_effect_hash_invalid:'||v_field,null::integer,null::text,null::jsonb; return;
    end if;
  end loop;
  if v_tuple->>'distribution_asset_key' is distinct from v_asset or
     v_tuple->>'route_key' is distinct from v_route or
     v_tuple->>'destination_account_identifier' is distinct from 'undrifted.bsky.social' then
    return query select null::uuid,false,'native_effect_tuple_outside_allowlist',null::integer,null::text,null::jsonb; return;
  end if;
  -- Whitelist keys: a verifier's extra bookkeeping never changes identity.
  select pg_catalog.jsonb_object_agg(k,v_tuple->k) into v_tuple from
    unnest(array['source_class','source_id','source_version','source_sha256','source_hash_basis',
      'pubpac_key','pubpac_version','pubpac_sha256','campaignpac_key','campaignpac_version',
      'campaignpac_sha256','payload_sha256','media_sha256','distribution_asset_key','route_key',
      'destination_account_identifier','release_scope_key','operator_source_confirmation_key']) k;
  v_key := 'historical_manual_distribution_v1:' ||
    pg_catalog.encode(pg_catalog.sha256(pg_catalog.convert_to(v_tuple::text,'UTF8')),'hex');
  if exists(select 1 from public.c3ops_cancom_notification_event n where n.event_key=v_key) then
    return query select null::uuid,false,'historical_occurrence_already_recorded',null::integer,v_key,null::jsonb; return;
  end if;
  -- Conservative one-shot rule: ANY prior attempt (including failed/unknown)
  -- prohibits a new historical event. Delegate stale-claim resolution to the
  -- existing primitive so its expired-claim HOLD semantics remain intact.
  if exists(select 1 from public.measures_distribution_execution e where e.distribution_asset_id=v_asset) then
    if exists(select 1 from public.measures_distribution_execution e where
      e.distribution_asset_id=v_asset and e.execution_status='publication_attempted') then
      select * into v_claim from public.claim_lapzuli_distribution_execution_v1(v_asset,'bluesky_api','bluesky_undrifted',v_route,'op044');
      return query select v_claim.execution_id,false,v_claim.reason,v_claim.attempt_number,v_key,null::jsonb; return;
    end if;
    return query select null::uuid,false,'historical_prior_attempt_requires_resolution',null::integer,v_key,null::jsonb; return;
  end if;
  v_binding := pg_catalog.jsonb_build_object('occurrence_key',v_key,'execution_instance',v_instance,
    'source_oar2',v_oar,'source_oar2_sha256',v_hash,'prior_oar2',
    'oar2_registrar_lapzuli_manual_backlog_handoff_chazz_20261011_002r',
    'distribution_asset_key',v_asset,'route_key',v_route,'destination_account_identifier','undrifted.bsky.social',
    'operator_ref','op044','individual_authenticated',true,'actor_evidence_ref',v_admission->>'actor_evidence_ref',
    'actor_binding',v_admission->'actor_binding','proof_event_key',v_admission->>'proof_event_key',
    'source_passage_capability_ref',v_admission->>'source_passage_capability_ref',
    'native_source_sha256',v_admission->>'native_source_sha256',
    'proof_sha256',v_admission->>'proof_sha256','source_snapshot_sha256',v_admission->>'source_snapshot_sha256',
    'prepared_worker_request',v_admission->'prepared_worker_request','verified_at',v_admission->>'verified_at',
    'valid_until',v_admission->>'valid_until',
    'capabilities',v_caps,'effect_tuple',v_tuple,'serialization_basis','postgres_jsonb_text_utf8_sha256');
  -- Claim first: no orphan ready event on HLD. A later failure rolls back this
  -- claim and its binding/event as ONE transaction (no catch-and-continue).
  select * into v_claim from public.claim_lapzuli_distribution_execution_v1(v_asset,'bluesky_api','bluesky_undrifted',v_route,'op044');
  if v_claim.claimed is distinct from true then
    return query select v_claim.execution_id,false,v_claim.reason,v_claim.attempt_number,v_key,null::jsonb; return;
  end if;
  update public.measures_distribution_execution e set source_oar2=v_oar,
    created_by_actor_class='AI',created_by_actor_key='codex',
    approved_by_actor_class='Human',approved_by_actor_key='op044',
    metadata=coalesce(e.metadata,'{}'::jsonb)||pg_catalog.jsonb_build_object('historical_occurrence',v_binding),
    evidence=coalesce(e.evidence,'{}'::jsonb)||pg_catalog.jsonb_build_object('historical_occurrence',v_binding)
    where e.execution_id=v_claim.execution_id and e.execution_status='publication_attempted' and e.source_oar2 is null;
  if not found then raise exception 'historical_new_claim_binding_failed'; end if;
  insert into public.c3ops_cancom_notification_event(event_key,event_type,source_system,
    source_object_type,source_object_key,actor_key,standing,summary,evidence)
    values(v_key,'historical_manual_occurrence_claimed','c3ops','distribution_asset',v_asset,'op044',
      'bound_claim_no_provider_effect','Exact historical occurrence bound before provider dispatch',
      v_binding||pg_catalog.jsonb_build_object('execution_id',v_claim.execution_id,'external_publication_effects',0));
  return query select v_claim.execution_id,true,'historical_occurrence_claimed',v_claim.attempt_number,v_key,v_binding;
end;
$$;
revoke all on function public.claim_lapzuli_historical_occurrence_v1(text,text,jsonb) from public,anon,authenticated;
grant execute on function public.claim_lapzuli_historical_occurrence_v1(text,text,jsonb) to service_role;

-- Separate worker admission consumes the same bound claim exactly once before
-- any provider request. Lost/uncertain outcomes are never automatically retried.
create or replace function public.consume_lapzuli_historical_worker_claim_v1(p_request jsonb)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_asset constant text := 'undrifted_hole_map_bluesky_dist_v1';
  v_e public.measures_distribution_execution%rowtype;
  v_b jsonb; v_role text; v_cap public.c3_envpac_capability_grant%rowtype;
  v_key text; v_current jsonb;
begin
  if current_user <> 'service_role' then
    return jsonb_build_object('standing','HLD','reason','trusted_service_required','external_publication_effects',0);
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_asset,0));
  select * into v_e from public.measures_distribution_execution e
    where e.execution_id::text=p_request->>'atomic_execution_id' and e.distribution_asset_id=v_asset for update;
  v_b:=v_e.metadata->'historical_occurrence';
  if not found or v_e.execution_status is distinct from 'publication_attempted' or
    v_e.created_at < pg_catalog.clock_timestamp()-interval '15 minutes' or
    v_e.source_oar2 is distinct from 'oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003' or
    v_b->>'occurrence_key' is distinct from p_request->>'historical_occurrence_key' or
    v_b->>'occurrence_key' is null or
    (p_request-'atomic_execution_id'-'historical_occurrence_key') is distinct from v_b->'prepared_worker_request' or
    nullif(v_b->>'valid_until','')::timestamptz is null or
    (v_b->>'valid_until')::timestamptz <= pg_catalog.clock_timestamp() or
    nullif(v_b->>'verified_at','')::timestamptz is null or
    (v_b->>'verified_at')::timestamptz < pg_catalog.clock_timestamp()-interval '60 seconds' then
    return jsonb_build_object('standing','HLD','reason','historical_worker_claim_binding_unresolved','external_publication_effects',0);
  end if;
  foreach v_role in array array['operator','notchazz','registrar','executor'] loop
    select * into v_cap from public.c3_envpac_capability_grant g
      where g.capability_key=v_b->'capabilities'->>v_role for share;
    if not found or v_cap.standing is distinct from 'active' or
      v_cap.scope->>'execution_instance' is distinct from v_b->>'execution_instance' or
      v_cap.scope->>'source_oar2_sha256' is distinct from v_b->>'source_oar2_sha256' or
      v_cap.scope->>'oar_key' is distinct from v_e.source_oar2 or
      v_cap.scope->>'allowed_asset' is distinct from v_asset or
      v_cap.scope->>'allowed_route' is distinct from v_b->>'route_key' or
      v_cap.scope->>'destination_account_identifier' is distinct from 'undrifted.bsky.social' or
      v_cap.scope->>'role' is distinct from v_role or
      v_cap.scope->>'actor_ref' is distinct from (case v_role when 'operator' then 'op044'
        when 'notchazz' then 'notchazz' when 'registrar' then 'chazz' else 'codex' end) or
      not coalesce(v_cap.scope->'allowed_actions' ? 'admit_historical_distribution_effect',false) or
      v_cap.scope->'external_provider_effects_authorized' is distinct from 'true'::jsonb or
      v_cap.scope->'max_new_external_effects' is distinct from '1'::jsonb or
      nullif(v_cap.scope->>'expires_at','')::timestamptz is null or
      (v_cap.scope->>'expires_at')::timestamptz <= pg_catalog.clock_timestamp() then
      return jsonb_build_object('standing','HLD','reason','historical_worker_effect_capability_unresolved:'||v_role,'external_publication_effects',0);
    end if;
  end loop;
  -- Individual session/standing and source/PAC/rights/media can be revoked
  -- after claim, independently of capability grants. Require native current
  -- revalidation of the persisted attestation and exact payload before consume.
  if pg_catalog.to_regprocedure('public.revalidate_lapzuli_historical_admission_v1(jsonb)') is null then
    return jsonb_build_object('standing','HLD','reason','native_worker_individual_source_revalidation_uninstalled','external_publication_effects',0);
  end if;
  execute 'select public.revalidate_lapzuli_historical_admission_v1($1)' into v_current using v_b;
  if v_current->>'standing' is distinct from 'admitted' or
    v_current->>'occurrence_key' is distinct from v_b->>'occurrence_key' then
    return jsonb_build_object('standing','HLD','reason','native_worker_individual_source_revalidation_held','external_publication_effects',0);
  end if;
  v_key:=(v_b->>'occurrence_key')||':worker_dispatch';
  if exists(select 1 from public.c3ops_cancom_notification_event n where n.event_key=v_key) then
    return jsonb_build_object('standing','HLD','reason','historical_worker_claim_already_consumed','external_publication_effects',0);
  end if;
  if not exists(select 1 from public.c3ops_cancom_notification_event n where
    n.event_key=v_b->>'occurrence_key' and n.standing='bound_claim_no_provider_effect' and
    n.evidence->>'execution_id'=v_e.execution_id::text) then
    return jsonb_build_object('standing','HLD','reason','historical_occurrence_event_unresolved','external_publication_effects',0);
  end if;
  insert into public.c3ops_cancom_notification_event(event_key,event_type,source_system,
    source_object_type,source_object_key,actor_key,standing,summary,evidence)
    values(v_key,'historical_worker_claim_consumed','c3ops','distribution_asset',v_asset,'codex',
      'dispatch_admitted_effect_unverified','Bound historical claim consumed before provider request',
      jsonb_build_object('execution_id',v_e.execution_id,'occurrence_key',v_b->>'occurrence_key',
        'source_oar2',v_e.source_oar2,'external_publication_effects',null,'automatic_retry_allowed',false));
  return jsonb_build_object('standing','dispatch_admitted','execution_id',v_e.execution_id,
    'occurrence_key',v_b->>'occurrence_key','external_publication_effects',0);
end;
$$;
revoke all on function public.consume_lapzuli_historical_worker_claim_v1(jsonb) from public,anon,authenticated;
grant execute on function public.consume_lapzuli_historical_worker_claim_v1(jsonb) to service_role;
