-- c1 email lifecycle: bounded verification reminders + scheduled sweep.
create or replace function public.list_due_c1_verification_reminders(p_limit integer default 25)
returns table(
  relationship_key text,
  primary_email text,
  display_name text,
  reminder_number integer
)
language sql
security definer
set search_path to public, pg_temp
as $$
  with eligible as (
    select
      r.relationship_key,
      r.primary_email,
      r.display_name,
      (
        select count(*)::integer
        from public.crs_relationship_event e
        where e.relationship_key=r.relationship_key
          and e.event_type='verification_reminder_sent'
      ) as reminders_sent,
      (
        select max(c.expires_at)
        from public.crs_verification_challenge c
        where c.relationship_key=r.relationship_key
          and c.verification_type='email_control'
      ) as last_expiry
    from public.crs_relationship r
    where r.is_active=true
      and coalesce(r.is_test_relationship,false)=false
      and r.relationship_standing='candidate_unverified'
      and r.primary_email is not null
      and not exists (
        select 1
        from public.crs_verification_challenge c
        where c.relationship_key=r.relationship_key
          and c.verification_type='email_control'
          and c.challenge_state='active'
          and c.expires_at>now()
      )
  )
  select relationship_key,primary_email,display_name,reminders_sent+1
  from eligible
  where last_expiry is not null
    and last_expiry<=now()
    and reminders_sent<2
  order by last_expiry asc
  limit greatest(1,least(coalesce(p_limit,25),100));
$$;

revoke all on function public.list_due_c1_verification_reminders(integer) from public,anon,authenticated;
grant execute on function public.list_due_c1_verification_reminders(integer) to service_role;

-- Scheduled Pages sweep. The endpoint is due-only and idempotent by standing,
-- reminder event count, verification cooldown, and Resend idempotency keys.
do $$
declare j bigint;
begin
  select jobid into j from cron.job where jobname='c1-email-lifecycle-sweep' limit 1;
  if j is not null then perform cron.unschedule(j); end if;
  perform cron.schedule(
    'c1-email-lifecycle-sweep',
    '*/15 * * * *',
    $cron$
      select net.http_post(
        url:='https://c3field.online/api/c1-email-lifecycle-sweep',
        headers:='{"Content-Type":"application/json","User-Agent":"c3field-pg-cron"}'::jsonb,
        body:='{}'::jsonb
      );
    $cron$
  );
end $$;
