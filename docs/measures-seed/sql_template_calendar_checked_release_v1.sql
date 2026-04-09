begin;

with eligible_calendar as (
  select
    mpc.phase_key
  from public.measures_phase_calendar mpc
  where mpc.phase_key = 'REPLACE_PHASE_SCHEDULE_KEY'
    and mpc.is_active = true
    and mpc.anchor_date <= current_date
),
target_rows as (
  select
    mr.id,
    mr.registry_key
  from public.measures_registry mr
  join eligible_calendar ec
    on ec.phase_key = coalesce(mr.metadata, '{}'::jsonb) ->> 'phase_schedule_key'
  where coalesce(mr.metadata, '{}'::jsonb) ->> 'phase_schedule_key' = 'REPLACE_PHASE_SCHEDULE_KEY'
),
registry_update as (
  update public.measures_registry mr
  set
    release_state = 'released',
    access_state = 'visible',
    updated_at = now(),
    metadata = coalesce(mr.metadata, '{}'::jsonb)
      || jsonb_build_object(
           'calendar_checked_release_applied', true,
           'calendar_checked_release_key', 'REPLACE_PHASE_SCHEDULE_KEY',
           'calendar_checked_release_pass', 'pass5d2_reusable_release'
         )
  where mr.id in (select id from target_rows)
  returning mr.id, mr.registry_key, mr.display_title, mr.phase_label
),
release_update as (
  update public.measures_release_state mrs
  set
    release_state = 'released',
    access_state = 'visible',
    release_reason = 'calendar-checked scheduled release',
    access_reason = 'visible scheduled seating after active calendar standing',
    release_at = coalesce(mrs.release_at, now()),
    sealed_at = null,
    effective_at = now(),
    updated_at = now(),
    metadata = coalesce(mrs.metadata, '{}'::jsonb)
      || jsonb_build_object(
           'calendar_checked_release_applied', true,
           'calendar_checked_release_key', 'REPLACE_PHASE_SCHEDULE_KEY',
           'calendar_checked_release_pass', 'pass5d2_reusable_release'
         )
  where mrs.registry_id in (select id from target_rows)
  returning mrs.registry_id
)
select
  (select count(*) from eligible_calendar) as eligible_calendar_rows,
  (select count(*) from target_rows) as target_rows_found,
  (select count(*) from registry_update) as registry_rows_updated,
  (select count(*) from release_update) as release_rows_updated;

commit;

-- verification
select
  v.registry_key,
  v.display_title,
  v.release_state,
  v.access_state,
  v.is_renderable,
  v.surface_state_reason
from public.v_measures_release_surface_v1 v
join public.measures_registry mr
  on mr.id = v.registry_id
where coalesce(mr.metadata, '{}'::jsonb) ->> 'phase_schedule_key' = 'REPLACE_PHASE_SCHEDULE_KEY'
order by v.sequence_order;
