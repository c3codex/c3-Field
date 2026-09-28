create or replace function public.claim_lapzuli_distribution_execution_v1(
  p_distribution_asset_id text,
  p_executor_key text,
  p_channel_key text,
  p_route_key text,
  p_operator text
)
returns table(
  execution_id uuid,
  claimed boolean,
  reason text,
  attempt_number integer
)
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_existing public.measures_distribution_execution%rowtype;
  v_attempt integer;
  v_execution_id uuid;
begin
  if p_distribution_asset_id is null
     or p_executor_key is null
     or p_channel_key is null
     or p_route_key is null
     or p_operator is null then
    return query select null::uuid,false,'claim_arguments_incomplete'::text,null::integer;
    return;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_distribution_asset_id,0));

  select *
    into v_existing
  from public.measures_distribution_execution
  where distribution_asset_id=p_distribution_asset_id
    and (
      execution_status in ('published','queued','publication_uncertain')
      or platform_url is not null
      or platform_post_id is not null
      or evidence->>'external_publication_effects'='1'
    )
  order by created_at desc
  limit 1;

  if found then
    return query
      select v_existing.execution_id,false,'prior_or_uncertain_external_effect'::text,v_existing.attempt_number;
    return;
  end if;

  select *
    into v_existing
  from public.measures_distribution_execution
  where distribution_asset_id=p_distribution_asset_id
    and execution_status='publication_attempted'
  order by created_at desc
  limit 1;

  if found then
    if v_existing.created_at < now()-interval '15 minutes' then
      update public.measures_distribution_execution
      set execution_status='publication_uncertain',
          error='dispatch_claim_expired_without_return_evidence',
          evidence=coalesce(evidence,'{}'::jsonb) || jsonb_build_object(
            'effect_state','unknown',
            'claim_expired_at',now()
          ),
          metadata=coalesce(metadata,'{}'::jsonb) || jsonb_build_object(
            'requires_operator_resolution',true,
            'automatic_retry_allowed',false
          ),
          updated_at=now()
      where measures_distribution_execution.execution_id=v_existing.execution_id;

      return query
        select v_existing.execution_id,false,'stale_claim_requires_resolution'::text,v_existing.attempt_number;
      return;
    end if;

    return query
      select v_existing.execution_id,false,'dispatch_claim_active'::text,v_existing.attempt_number;
    return;
  end if;

  select coalesce(max(mde.attempt_number),0)+1
    into v_attempt
  from public.measures_distribution_execution mde
  where mde.distribution_asset_id=p_distribution_asset_id;

  insert into public.measures_distribution_execution(
    distribution_asset_id,
    executor_key,
    channel_key,
    execution_status,
    execution_mode,
    attempt_number,
    executed_at,
    evidence,
    source_oar2,
    created_by_actor_class,
    created_by_actor_key,
    approved_by_actor_class,
    approved_by_actor_key,
    metadata,
    optics
  )
  values(
    p_distribution_asset_id,
    p_executor_key,
    p_channel_key,
    'publication_attempted',
    'lapzuli_worker',
    v_attempt,
    now(),
    jsonb_build_object(
      'route_key',p_route_key,
      'effect_state','pending_return_evidence',
      'external_publication_effects',0
    ),
    null,
    'AI',
    'Chazz',
    'Human',
    p_operator,
    jsonb_build_object(
      'worker_identity','dizzy_lapzuli_distribution_worker_v1',
      'operator_surface','/relational-operations/lapzuli',
      'dispatch_claim','atomic_v1',
      'automatic_retry_allowed',false
    ),
    jsonb_build_object(
      'observes','distribution_event',
      'models_individuals_as_primary',false
    )
  )
  returning measures_distribution_execution.execution_id into v_execution_id;

  return query select v_execution_id,true,'dispatch_claimed'::text,v_attempt;
end
$$;

revoke all on function public.claim_lapzuli_distribution_execution_v1(text,text,text,text,text)
  from public, anon, authenticated;

grant execute on function public.claim_lapzuli_distribution_execution_v1(text,text,text,text,text)
  to service_role;
