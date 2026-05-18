-- Source Reference Schema SQL Draft v1
-- Codex → Field → Measures → Chazz

create extension if not exists pgcrypto;

create table if not exists public.source_reference (
  id uuid primary key default gen_random_uuid(),
  source_key text not null unique,
  source_title text not null,
  source_type text not null check (
    source_type in (
      'concordance',
      'foundational_source',
      'process_rule',
      'role_contract',
      'implementation_manifest',
      'verification_checklist',
      'oar',
      'system_intel'
    )
  ),
  authority_level text not null check (
    authority_level in (
      'system',
      'working',
      'operator',
      'readonly',
      'readonly_candidate'
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
  supersedes_source_id uuid references public.source_reference(id),
  source_path text,
  source_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null default 'op044',
  created_at timestamptz not null default now()
);

create index if not exists idx_source_reference_status
on public.source_reference(source_status);

create index if not exists idx_source_reference_type
on public.source_reference(source_type);

create index if not exists idx_source_reference_metadata
on public.source_reference using gin(metadata);

create table if not exists public.source_term (
  id uuid primary key default gen_random_uuid(),
  source_reference_id uuid not null
    references public.source_reference(id)
    on delete restrict,
  term_key text not null,
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
  constraint uq_source_term_key unique(term_key)
);

create index if not exists idx_source_term_reference
on public.source_term(source_reference_id);

create index if not exists idx_source_term_axis
on public.source_term(axis);

create table if not exists public.source_operative_binding (
  id uuid primary key default gen_random_uuid(),
  source_term_id uuid not null
    references public.source_term(id)
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
  created_at timestamptz not null default now()
);

create index if not exists idx_source_binding_term
on public.source_operative_binding(source_term_id);

create index if not exists idx_source_binding_surface
on public.source_operative_binding(system_surface);

create table if not exists public.source_relation (
  id uuid primary key default gen_random_uuid(),
  from_source_reference_id uuid
    references public.source_reference(id)
    on delete restrict,
  from_source_term_id uuid
    references public.source_term(id)
    on delete restrict,
  to_source_reference_id uuid
    references public.source_reference(id)
    on delete restrict,
  to_source_term_id uuid
    references public.source_term(id)
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
  constraint source_relation_has_from check (
    from_source_reference_id is not null
    or from_source_term_id is not null
  ),
  constraint source_relation_has_to check (
    to_source_reference_id is not null
    or to_source_term_id is not null
  )
);

create index if not exists idx_source_relation_type
on public.source_relation(relation_type);

create table if not exists public.source_seed_log (
  id uuid primary key default gen_random_uuid(),
  source_reference_id uuid not null
    references public.source_reference(id)
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
  oar_key text,
  operator_key text not null default 'op044',
  event_note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_source_seed_log_reference
on public.source_seed_log(source_reference_id);

create index if not exists idx_source_seed_log_event
on public.source_seed_log(seed_event);

create or replace function public.prevent_seeded_source_reference_update()
returns trigger
language plpgsql
as $$
begin
  if old.source_status = 'seeded' then
    raise exception
      'Seeded source_reference is append-only. Create superseding reference instead. source_key=%',
      old.source_key;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_prevent_seeded_source_reference_update
on public.source_reference;

create trigger trg_prevent_seeded_source_reference_update
before update on public.source_reference
for each row
execute function public.prevent_seeded_source_reference_update();

create or replace function public.mark_source_reference_seeded(
  p_source_key text,
  p_oar_key text default null,
  p_operator_key text default 'op044',
  p_event_note text default null
)
returns uuid
language plpgsql
as $$
declare
  v_source_id uuid;
begin
  select id
  into v_source_id
  from public.source_reference
  where source_key = p_source_key;

  if v_source_id is null then
    raise exception 'source_reference not found: %', p_source_key;
  end if;

  update public.source_reference
  set
    source_status = 'seeded',
    readonly = true,
    seeded_at = coalesce(seeded_at, now())
  where id = v_source_id
    and source_status <> 'seeded';

  insert into public.source_seed_log (
    source_reference_id,
    seed_event,
    oar_key,
    operator_key,
    event_note
  )
  values (
    v_source_id,
    'seeded',
    p_oar_key,
    p_operator_key,
    p_event_note
  );

  return v_source_id;
end;
$$;

create or replace view public.v_seeded_source_references as
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
  sr.created_at
from public.source_reference sr
where sr.source_status = 'seeded'
  and sr.readonly = true;

-- Validation query 1: source standing
select source_key, source_title, source_type, source_status, readonly
from public.source_reference
order by created_at desc;

-- Validation query 2: active bindings
select
  b.binding_key,
  t.term_key,
  b.binding_context,
  b.system_surface,
  b.active_state
from public.source_operative_binding b
join public.source_term t on t.id = b.source_term_id
order by b.created_at desc;

-- Validation query 3: seeded preflight
select source_key, source_title, source_type, seeded_at
from public.v_seeded_source_references
order by seeded_at desc;
