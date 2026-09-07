create table if not exists public.mr_assessment_evaluation_v2 (
  evaluation_id text primary key,
  assessment_ref text not null,
  capture_id uuid not null references public.measures_iis_eval_gate1_capture(id) on delete cascade,
  participant_email text,
  institution_name text,
  env_key text not null,
  current_state_key text not null,
  matrix_version text not null,
  evaluation_standing text not null,
  evaluation_standing_key text not null,
  reported_conditions jsonb not null default '[]'::jsonb,
  priority_cells jsonb not null default '[]'::jsonb,
  relational_exposures jsonb not null default '[]'::jsonb,
  system_consequences jsonb not null default '[]'::jsonb,
  verification_limits jsonb not null default '[]'::jsonb,
  unknown_unresolved_held jsonb not null default '[]'::jsonb,
  continuation jsonb not null default '{}'::jsonb,
  map_scope jsonb not null default '{}'::jsonb,
  pricing_standing jsonb not null default '{}'::jsonb,
  six_touchpoint_chain jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mr_assessment_evaluation_cell_v2 (
  id uuid primary key default gen_random_uuid(),
  evaluation_id text not null references public.mr_assessment_evaluation_v2(evaluation_id) on delete cascade,
  cell_key text not null,
  row_axis text not null check (row_axis in ('system', 'environment', 'change')),
  column_axis text not null check (column_axis in ('identify', 'govern', 'verify')),
  standing text not null check (standing in ('aligned', 'drifted', 'unverified', 'held')),
  evidence_question_keys jsonb not null default '[]'::jsonb,
  evidence_tags jsonb not null default '[]'::jsonb,
  finding text not null,
  consequence text not null,
  next_action text not null,
  created_at timestamptz not null default now(),
  unique (evaluation_id, cell_key)
);

create table if not exists public.mr_assessment_evaluation_exposure_v2 (
  id uuid primary key default gen_random_uuid(),
  evaluation_id text not null references public.mr_assessment_evaluation_v2(evaluation_id) on delete cascade,
  exposure_key text not null,
  exposure_class text not null,
  standing text not null,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (evaluation_id, exposure_key)
);

create table if not exists public.mr_assessment_delivery_artifact_v2 (
  artifact_id text primary key,
  evaluation_id text not null references public.mr_assessment_evaluation_v2(evaluation_id) on delete cascade,
  capture_id uuid not null references public.measures_iis_eval_gate1_capture(id) on delete cascade,
  assessment_ref text not null,
  artifact_class text not null,
  delivery_standing text not null,
  recipient_email text,
  template_key text,
  provider text,
  provider_message_id text,
  error_message text,
  rendered_subject text,
  rendered_preview text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mr_map_continuation_state_v2 (
  continuation_id text primary key,
  evaluation_id text not null references public.mr_assessment_evaluation_v2(evaluation_id) on delete cascade,
  capture_id uuid not null references public.measures_iis_eval_gate1_capture(id) on delete cascade,
  assessment_ref text not null,
  current_state_key text not null,
  env_key text not null,
  map_pathway text not null check (map_pathway in ('foundational', 'optimization', 'remediation')),
  public_label text not null,
  amount_usd integer not null check (amount_usd in (333, 777, 999)),
  continuation_standing text not null,
  next_encounter_key text not null,
  marble_order jsonb not null default '[]'::jsonb,
  creates_identity boolean not null default false,
  creates_authority boolean not null default false,
  creates_certification boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists mr_assessment_evaluation_v2_capture_idx
  on public.mr_assessment_evaluation_v2(capture_id);

create index if not exists mr_assessment_evaluation_v2_current_idx
  on public.mr_assessment_evaluation_v2(current_state_key);

create index if not exists mr_assessment_evaluation_cell_v2_eval_idx
  on public.mr_assessment_evaluation_cell_v2(evaluation_id);

create index if not exists mr_assessment_delivery_artifact_v2_eval_idx
  on public.mr_assessment_delivery_artifact_v2(evaluation_id);

create index if not exists mr_map_continuation_state_v2_eval_idx
  on public.mr_map_continuation_state_v2(evaluation_id);

alter table public.mr_assessment_evaluation_v2 enable row level security;
alter table public.mr_assessment_evaluation_cell_v2 enable row level security;
alter table public.mr_assessment_evaluation_exposure_v2 enable row level security;
alter table public.mr_assessment_delivery_artifact_v2 enable row level security;
alter table public.mr_map_continuation_state_v2 enable row level security;

revoke all on table public.mr_assessment_evaluation_v2 from anon, authenticated;
revoke all on table public.mr_assessment_evaluation_cell_v2 from anon, authenticated;
revoke all on table public.mr_assessment_evaluation_exposure_v2 from anon, authenticated;
revoke all on table public.mr_assessment_delivery_artifact_v2 from anon, authenticated;
revoke all on table public.mr_map_continuation_state_v2 from anon, authenticated;

grant all on table public.mr_assessment_evaluation_v2 to service_role;
grant all on table public.mr_assessment_evaluation_cell_v2 to service_role;
grant all on table public.mr_assessment_evaluation_exposure_v2 to service_role;
grant all on table public.mr_assessment_delivery_artifact_v2 to service_role;
grant all on table public.mr_map_continuation_state_v2 to service_role;
