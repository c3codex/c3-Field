-- Source Reference Schema SQL Draft v1 - Preflight Revised
-- Preflight standing: db_preflight_requires_revision, not executed
-- Boundary: draft only; DB mutation requires a separate confirmed OAR2
-- Seeded transition is intentionally service-side until role/grant workflow is routed.

create extension if not exists pgcrypto;

create table if not exists public.codex_source_reference (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_title text not null,
  source_type text not null check (
    source_type in (
      'semantic_source',
      'coherence_source',
      'db_runtime_governance',
      'process_lifecycle',
      'media_process_governance',
      'encounter_process_guidance',
      'phase_map_distinction',
      'release_access_distinction',
      'renderer_lineage',
      'runtime_process_support',
      'operational_incorporation_lineage'
    )
  ),
  authority_level text not null default 'working' check (
    authority_level in (
      'working',
      'review',
      'db_preflight_candidate',
      'codex_seated',
      'rejected'
    )
  ),
  source_scope text not null,
  version_label text not null default 'v1',
  source_status text not null default 'drafted' check (
    source_status in (
      'drafted',
      'validated',
      'written',
      'committed',
      'seeded',
      'deprecated',
      'superseded',
      'rejected'
    )
  ),
  readonly boolean not null default false,
  seeded_at timestamptz,
  supersedes_source_id uuid references public.codex_source_reference(id) on delete restrict,
  source_path text,
  source_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'op044',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint codex_source_reference_seeded_requires_oar check (
    source_status <> 'seeded'
    or metadata ? 'seed_oar_key'
  ),
  constraint codex_source_reference_committed_requires_path check (
    source_status not in ('committed', 'seeded')
    or source_path is not null
  ),
  constraint codex_source_reference_committed_requires_hash check (
    source_status not in ('committed', 'seeded')
    or source_hash is not null
  ),
  constraint codex_source_reference_seeded_readonly check (
    source_status <> 'seeded'
    or readonly = true
  )
);

create index if not exists idx_codex_source_reference_status
on public.codex_source_reference(source_status);

create index if not exists idx_codex_source_reference_type
on public.codex_source_reference(source_type);

create index if not exists idx_codex_source_reference_metadata
on public.codex_source_reference using gin(metadata);

create table if not exists public.codex_source_term (
  id uuid primary key default gen_random_uuid(),
  source_reference_id uuid not null
    references public.codex_source_reference(id)
    on delete restrict,
  term_key text not null unique,
  term_label text not null,
  axis text,
  circuit text,
  role text not null,
  resolves_to text,
  definition text not null,
  term_status text not null default 'active' check (
    term_status in ('active', 'held', 'deprecated', 'superseded')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_codex_source_term_reference
on public.codex_source_term(source_reference_id);

create index if not exists idx_codex_source_term_axis
on public.codex_source_term(axis);

create table if not exists public.codex_source_operative_binding (
  id uuid primary key default gen_random_uuid(),
  source_term_id uuid not null
    references public.codex_source_term(id)
    on delete restrict,
  binding_key text not null unique,
  binding_context text not null,
  system_surface text not null check (
    system_surface in (
      'codex',
      'field',
      'measures',
      'chazz',
      'src',
      'oar',
      'connect',
      'contribute',
      'create'
    )
  ),
  active_state text not null default 'proposed' check (
    active_state in (
      'proposed',
      'active',
      'held',
      'retired',
      'rejected'
    )
  ),
  registry_key text,
  encounter_key text,
  oar_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_codex_source_binding_term
on public.codex_source_operative_binding(source_term_id);

create index if not exists idx_codex_source_binding_surface
on public.codex_source_operative_binding(system_surface);

create table if not exists public.codex_source_relation (
  id uuid primary key default gen_random_uuid(),
  from_source_reference_id uuid
    references public.codex_source_reference(id)
    on delete restrict,
  from_source_term_id uuid
    references public.codex_source_term(id)
    on delete restrict,
  to_source_reference_id uuid
    references public.codex_source_reference(id)
    on delete restrict,
  to_source_term_id uuid
    references public.codex_source_term(id)
    on delete restrict,
  relation_type text not null check (
    relation_type in (
      'aligns_to',
      'depends_on',
      'supersedes',
      'binds',
      'clarifies',
      'protects',
      'routes',
      'verifies',
      'blocks'
    )
  ),
  relation_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint codex_source_relation_has_from check (
    from_source_reference_id is not null
    or from_source_term_id is not null
  ),
  constraint codex_source_relation_has_to check (
    to_source_reference_id is not null
    or to_source_term_id is not null
  )
);

create index if not exists idx_codex_source_relation_type
on public.codex_source_relation(relation_type);

create table if not exists public.codex_source_seed_log (
  id uuid primary key default gen_random_uuid(),
  source_reference_id uuid not null
    references public.codex_source_reference(id)
    on delete restrict,
  seed_event text not null check (
    seed_event in (
      'validated',
      'written',
      'committed',
      'incorporated',
      'seeded',
      'deprecated',
      'superseded',
      'rejected'
    )
  ),
  oar_key text not null,
  operator_key text not null default 'op044',
  event_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_codex_source_seed_log_reference
on public.codex_source_seed_log(source_reference_id);

create index if not exists idx_codex_source_seed_log_event
on public.codex_source_seed_log(seed_event);

create or replace function public.touch_codex_source_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_seeded_codex_source_reference_update()
returns trigger
language plpgsql
as $$
begin
  if old.source_status = 'seeded' then
    raise exception
      'Seeded codex_source_reference is append-only. Create superseding reference instead. source_key=%',
      old.source_key;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_touch_codex_source_reference_updated_at
on public.codex_source_reference;

create trigger trg_touch_codex_source_reference_updated_at
before update on public.codex_source_reference
for each row
execute function public.touch_codex_source_updated_at();

drop trigger if exists trg_touch_codex_source_term_updated_at
on public.codex_source_term;

create trigger trg_touch_codex_source_term_updated_at
before update on public.codex_source_term
for each row
execute function public.touch_codex_source_updated_at();

drop trigger if exists trg_touch_codex_source_binding_updated_at
on public.codex_source_operative_binding;

create trigger trg_touch_codex_source_binding_updated_at
before update on public.codex_source_operative_binding
for each row
execute function public.touch_codex_source_updated_at();

drop trigger if exists trg_prevent_seeded_codex_source_reference_update
on public.codex_source_reference;

create trigger trg_prevent_seeded_codex_source_reference_update
before update on public.codex_source_reference
for each row
execute function public.prevent_seeded_codex_source_reference_update();

-- Seeded transition is not exposed as a public RPC in this preflight revision.
-- Future seeded transition must be routed by a separate OAR2 and performed through
-- a controlled service-side workflow or private-schema RPC after role validation.

create or replace view public.v_seeded_codex_source_references as
select
  sr.id,
  sr.source_key,
  sr.source_title,
  sr.source_type,
  sr.authority_level,
  sr.source_scope,
  sr.version_label,
  sr.source_status,
  sr.readonly,
  sr.seeded_at,
  sr.source_path,
  sr.source_hash,
  sr.metadata,
  sr.created_at,
  sr.updated_at
from public.codex_source_reference sr
where sr.source_status = 'seeded'
  and sr.readonly = true;

alter table public.codex_source_reference enable row level security;
alter table public.codex_source_term enable row level security;
alter table public.codex_source_operative_binding enable row level security;
alter table public.codex_source_relation enable row level security;
alter table public.codex_source_seed_log enable row level security;

revoke all on table public.codex_source_reference from anon, authenticated;
revoke all on table public.codex_source_term from anon, authenticated;
revoke all on table public.codex_source_operative_binding from anon, authenticated;
revoke all on table public.codex_source_relation from anon, authenticated;
revoke all on table public.codex_source_seed_log from anon, authenticated;

-- Preflight query 1: source standing
select source_key, source_title, source_type, source_status, readonly
from public.codex_source_reference
order by created_at desc;

-- Preflight query 2: active bindings
select
  b.binding_key,
  t.term_key,
  b.binding_context,
  b.system_surface,
  b.active_state
from public.codex_source_operative_binding b
join public.codex_source_term t on t.id = b.source_term_id
order by b.created_at desc;

-- Preflight query 3: seeded standing
select source_key, source_title, source_type, seeded_at
from public.v_seeded_codex_source_references
order by seeded_at desc;
