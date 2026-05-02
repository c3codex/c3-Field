-- =====================================================
-- SRC1 CONNECT REQUEST + OAR1 LOG
-- Measures Registry — Reserve Seat Intake
-- =====================================================

create extension if not exists pgcrypto;

create table if not exists public.src1_connect_request (
  id uuid primary key default gen_random_uuid(),

  source_registry_key text not null default 'measures_registry_landing',
  capture_context text not null default 'measures_registry_june_cohort',

  origin_type text not null
    check (origin_type in ('named_individual', 'institution_in_service')),

  full_name text not null,
  email text not null,

  role_or_title text,
  institution_name text,

  interest_area text,
  course_intent text,
  message text,

  intake_state text not null default 'received'
    check (intake_state in ('received','held','approved','declined','converted')),

  c3_key_state text not null default 'not_assigned'
    check (c3_key_state in ('not_assigned','temporary_email_bound','wallet_bound')),

  env_key uuid not null default gen_random_uuid(),

  oar1_status text not null default 'pending'
    check (oar1_status in ('pending','logged','failed')),

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oar1_log (
  id uuid primary key default gen_random_uuid(),

  src1_connect_request_id uuid not null
    references public.src1_connect_request(id)
    on delete cascade,

  objective text not null,
  action text not null,
  result text not null,

  source_registry_key text not null,
  capture_context text not null,
  env_key uuid not null,

  created_at timestamptz not null default now()
);

create or replace function public.submit_src1_connect_request(
  p_origin_type text,
  p_full_name text,
  p_email text,
  p_role_or_title text,
  p_institution_name text,
  p_interest_area text,
  p_course_intent text,
  p_message text
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_request_id uuid;
  v_env_key uuid;
begin
  insert into public.src1_connect_request (
    origin_type,
    full_name,
    email,
    role_or_title,
    institution_name,
    interest_area,
    course_intent,
    message,
    metadata
  )
  values (
    p_origin_type,
    p_full_name,
    lower(trim(p_email)),
    p_role_or_title,
    p_institution_name,
    p_interest_area,
    p_course_intent,
    p_message,
    jsonb_build_object(
      'source', 'landing_reserve_seat',
      'path', 'SRC1',
      'course_window', 'June'
    )
  )
  returning id, env_key into v_request_id, v_env_key;

  insert into public.oar1_log (
    src1_connect_request_id,
    objective,
    action,
    result,
    source_registry_key,
    capture_context,
    env_key
  )
  values (
    v_request_id,
    'Reserve seat for Measures Registry June cohort',
    'SRC1 Connect request received from landing page and envKey generated',
    'Connect intake standing established; awaiting operator review',
    'measures_registry_landing',
    'measures_registry_june_cohort',
    v_env_key
  );

  update public.src1_connect_request
  set oar1_status = 'logged',
      updated_at = now()
  where id = v_request_id;

  return jsonb_build_object(
    'ok', true,
    'request_id', v_request_id,
    'env_key', v_env_key,
    'intake_state', 'received',
    'message', 'Your seat request has been received.'
  );
end;
$$;

alter table public.src1_connect_request enable row level security;
alter table public.oar1_log enable row level security;

drop policy if exists "service role manages src1" on public.src1_connect_request;
drop policy if exists "service role manages oar1" on public.oar1_log;

create policy "service role manages src1"
on public.src1_connect_request
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role manages oar1"
on public.oar1_log
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

grant execute on function public.submit_src1_connect_request(
  text, text, text, text, text, text, text, text
) to anon, authenticated;
