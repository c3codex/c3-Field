create table if not exists public.c3_env_runtime_session (
  session_key uuid primary key default gen_random_uuid(),
  token_sha256 text not null unique check (token_sha256 ~ '^[a-f0-9]{64}$'),
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete restrict,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete restrict,
  subject_type text not null,
  subject_key text not null,
  standing text not null default 'active',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  evidence_ref text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists c3_env_runtime_session_envpac_idx
  on public.c3_env_runtime_session(envpac_key);

create index if not exists c3_env_runtime_session_subject_idx
  on public.c3_env_runtime_session(subject_key);

alter table public.c3_env_runtime_session enable row level security;

comment on table public.c3_env_runtime_session is
  'Opaque, revocable browser runtime sessions for My Environment. Session admission does not grant ownership, custody, or passage authority.';
