-- Correct Lapzuli launchability projection to resolve executors through route metadata
-- and ready assets through their registered channel key.
create or replace view public.lapzuli_channel_qualification_status_v1
with (security_invoker = true)
as
with route_state as (
  select
    r.outlet_key,
    r.desk_key,
    count(*) as route_count,
    count(*) filter (where r.route_status in ('authorized','attempted','accepted')) as active_route_count,
    count(*) filter (where r.operator_confirmed is true) as operator_confirmed_route_count,
    bool_or(coalesce(ex.status='available' and ex.supports_publish is true,false)) as callable_publish_executor,
    coalesce(
      jsonb_agg(
        distinct jsonb_build_object(
          'executor_key',ex.executor_key,
          'status',ex.status,
          'execution_mode',ex.execution_mode,
          'supports_publish',ex.supports_publish,
          'supports_scheduling',ex.supports_scheduling,
          'credential_reference_present',ex.credential_reference is not null
        )
      ) filter (where ex.executor_key is not null),
      '[]'::jsonb
    ) as executors
  from public.lapzuli_route r
  left join public.measures_distribution_executor ex
    on ex.executor_key = r.metadata->>'executor_key'
  group by r.outlet_key,r.desk_key
),
asset_state as (
  select
    coalesce(metadata->>'channel_key',platform) as channel_key,
    count(*) as distribution_asset_count,
    count(*) filter (where status='ready_for_operator_execution') as ready_asset_count
  from public.measures_publication_distribution_asset
  group by coalesce(metadata->>'channel_key',platform)
)
select
  o.outlet_key,
  o.outlet_name,
  o.outlet_class,
  o.qualification_state as outlet_qualification_state,
  o.account_standing,
  o.submission_mode,
  o.access_route,
  o.base_url,
  q.desk_key,
  q.distribution_mode,
  q.standing as qualification_standing,
  q.fit_score,
  q.operator_disposition_required,
  q.requires_canonical,
  q.requires_ai_disclosure,
  q.requires_original_contribution,
  coalesce(q.posting_cost_usd,0::numeric) as posting_cost_usd,
  coalesce(q.submission_cost_usd,0::numeric) as submission_cost_usd,
  coalesce(q.automation_cost_usd,0::numeric) as automation_cost_usd,
  coalesce(r.callable_publish_executor,false) as callable_publish_executor,
  coalesce(r.executors,'[]'::jsonb) as executors,
  coalesce(r.route_count,0::bigint) as route_count,
  coalesce(r.active_route_count,0::bigint) as active_route_count,
  coalesce(r.operator_confirmed_route_count,0::bigint) as operator_confirmed_route_count,
  coalesce(a.distribution_asset_count,0::bigint) as distribution_asset_count,
  coalesce(a.ready_asset_count,0::bigint) as ready_asset_count,
  case
    when q.outlet_key is null then 'unqualified'
    when q.standing not in ('qualified','qualified_with_constraints') then q.standing
    when o.account_standing not in ('verified','not_required') then 'held_account'
    when not coalesce(r.callable_publish_executor,false) then 'qualified_no_callable_executor'
    when coalesce(r.active_route_count,0)=0 then 'qualified_no_active_route'
    when q.operator_disposition_required is true and coalesce(r.operator_confirmed_route_count,0)=0 then 'qualified_operator_confirmation_required'
    when coalesce(a.ready_asset_count,0)=0 then 'qualified_no_ready_asset'
    else 'launchable'
  end as launchability_standing
from public.lapzuli_outlet o
left join public.lapzuli_outlet_qualification q
  on q.outlet_key=o.outlet_key
left join route_state r
  on r.outlet_key=o.outlet_key
 and r.desk_key is not distinct from q.desk_key
left join asset_state a
  on a.channel_key=o.outlet_key;
