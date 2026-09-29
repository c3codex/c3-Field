-- c3-native My Environment calendar v1
-- Primary operational calendar in c3; Google is downstream projection only.

begin;

create table if not exists public.c3_env_calendar_event (
  event_key uuid primary key default gen_random_uuid(),
  envpac_key text not null references public.c3_envpac(envpac_key),
  owner_subject_key text not null,
  title text not null,
  event_type text not null default 'meeting',
  start_at timestamptz not null,
  end_at timestamptz not null,
  timezone text not null default 'America/Chicago',
  event_state text not null default 'scheduled',
  related_relationship_key text references public.crs_relationship(relationship_key),
  related_context_type text,
  related_context_key text,
  location_text text,
  notes text,
  external_projection_state text not null default 'none',
  google_event_id text,
  google_event_url text,
  meet_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_env_calendar_event_title_check check (char_length(trim(title)) between 1 and 240),
  constraint c3_env_calendar_event_type_check check (event_type in ('meeting','encounter','follow_up','deadline','task','other')),
  constraint c3_env_calendar_event_state_check check (event_state in ('scheduled','completed','cancelled')),
  constraint c3_env_calendar_event_time_check check (end_at > start_at),
  constraint c3_env_calendar_event_projection_check check (external_projection_state in ('none','prepared','projected','held')),
  constraint c3_env_calendar_event_context_check check (related_context_type is null or related_context_type in ('pipeline','initiative','pac','project','relationship','other'))
);

create index if not exists c3_env_calendar_event_env_time_idx
  on public.c3_env_calendar_event (envpac_key, event_state, start_at);

create index if not exists c3_env_calendar_event_relationship_idx
  on public.c3_env_calendar_event (related_relationship_key, start_at)
  where related_relationship_key is not null;

alter table public.c3_env_calendar_event enable row level security;

create table if not exists public.c3_env_calendar_event_trace (
  trace_key uuid primary key default gen_random_uuid(),
  event_key uuid not null references public.c3_env_calendar_event(event_key),
  envpac_key text not null references public.c3_envpac(envpac_key),
  owner_subject_key text not null,
  trace_type text not null,
  trace_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint c3_env_calendar_trace_type_check check (trace_type in (
    'event_created','event_edited','event_completed','event_cancelled',
    'google_projection_prepared','google_projection_returned'
  ))
);

create index if not exists c3_env_calendar_event_trace_event_idx
  on public.c3_env_calendar_event_trace (event_key, created_at desc);

alter table public.c3_env_calendar_event_trace enable row level security;

insert into public.system_process_registry (
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout
)
values (
  'c1me_native_calendar_v1','c3_field','c1ME Native Calendar v1','active',
  'supabase/migrations/20260929184500_c1me_native_calendar_v1.sql',
  'operator_authorized',
  jsonb_build_object(
    'operator','op044',
    'calendar_authority','c3_env_calendar_event',
    'external_projection_rule','explicit_event_only',
    'google_role','downstream_projection_surface',
    'full_google_sync',false,
    'external_write_authority_created',false,
    'google_meet_creation','held_until_provider_executor'
  ),
  'c1ME Native Calendar v1',
  'owner-operated c3 calendar with explicit downstream event projection',
  'active','bounded_runtime_control',
  jsonb_build_object('envpac','c3envpac_person_eea672f5a7676dad4316755b_v0_1'),
  'both',true,true,true
)
on conflict (process_key) do update set updated_at=now(),status='active',process_status='active';

insert into public.c3_envpac_runtime_primitive (
  binding_key,envpac_key,primitive_key,primitive_class,display_label,renderer_key,
  runtime_endpoint,sort_order,standing,config
)
values (
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1:primitive:calendar',
  'c3envpac_person_eea672f5a7676dad4316755b_v0_1',
  'calendar',
  'environment_calendar',
  'Calendar',
  'c1me.calendar',
  '/api/my-environment-calendar',
  24,
  'active',
  jsonb_build_object(
    'universal',false,
    'operator_bound',true,
    'primary_calendar','c3',
    'external_projection','explicit_event_only',
    'google_calendar_role','downstream_projection_surface',
    'google_meet_creation_state','held_until_provider_executor',
    'full_google_import',false,
    'authority_created',false,
    'free_resolved_from_envpac',true
  )
)
on conflict (binding_key) do update
set renderer_key=excluded.renderer_key,
    runtime_endpoint=excluded.runtime_endpoint,
    sort_order=excluded.sort_order,
    standing='active',
    config=excluded.config,
    updated_at=now();

commit;
