-- Concordance Authority Schema Draft v1
-- Source OAR2: docs/oar/c3_field/oar2_concordance_authority_sql_migration_draft_v1.meta.md
-- DRAFT ONLY. Do not execute without a separate execution OAR2.
-- Authority rule: Codex seating = authority; bucket and markdown are evidence only.

create table if not exists public.concordance_document (
  document_key text primary key,
  title text not null,
  document_scope text not null,
  authority_standing text not null check (
    authority_standing in ('proposed', 'active', 'superseded', 'blocked')
  ),
  visibility_standing text not null default 'internal' check (
    visibility_standing in ('public', 'internal', 'protected', 'restricted')
  ),
  native_order text not null,
  source_alignment jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.concordance_version (
  version_key text primary key,
  document_key text not null references public.concordance_document(document_key),
  version_label text not null,
  version_standing text not null check (
    version_standing in ('draft', 'active', 'superseded', 'correction_required', 'blocked')
  ),
  visibility_standing text not null default 'internal' check (
    visibility_standing in ('public', 'internal', 'protected', 'restricted')
  ),
  recognized_at timestamptz,
  source_oar2_path text not null,
  closeout_oar1_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint concordance_version_document_label_unique unique (document_key, version_label)
);

create table if not exists public.concordance_term (
  term_key text primary key,
  version_key text not null references public.concordance_version(version_key),
  term_label text not null,
  canonical_definition text not null,
  axis text,
  circuit text,
  role text,
  resolves_to text,
  term_standing text not null check (
    term_standing in ('proposed', 'active', 'superseded', 'alias', 'blocked')
  ),
  visibility_standing text not null default 'internal' check (
    visibility_standing in ('public', 'internal', 'protected', 'restricted')
  ),
  source_excerpt text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint concordance_term_version_label_unique unique (version_key, term_label)
);

create table if not exists public.concordance_relation (
  relation_key text primary key,
  version_key text not null references public.concordance_version(version_key),
  source_term_key text references public.concordance_term(term_key),
  target_term_key text references public.concordance_term(term_key),
  relation_scope text not null default 'term' check (
    relation_scope in ('term', 'document', 'version', 'cross_version', 'branch', 'system')
  ),
  relation_type text not null check (
    relation_type in (
      'axis',
      'circuit',
      'role',
      'resolves_to',
      'source_alignment',
      'native_order',
      'supersedes',
      'aliases',
      'related_to'
    )
  ),
  relation_label text,
  relation_standing text not null check (
    relation_standing in ('active', 'superseded', 'blocked')
  ),
  visibility_standing text not null default 'internal' check (
    visibility_standing in ('public', 'internal', 'protected', 'restricted')
  ),
  source_oar2_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint concordance_relation_unique unique (
    version_key,
    source_term_key,
    target_term_key,
    relation_type
  )
);

create table if not exists public.seeded_source_snapshot (
  snapshot_key text primary key,
  version_key text not null references public.concordance_version(version_key),
  snapshot_type text not null check (
    snapshot_type in ('local_source', 'bucket_snapshot', 'export', 'recovery_artifact')
  ),
  local_source_path text,
  bucket_name text,
  bucket_path text,
  source_sha256 text not null,
  byte_size integer not null check (byte_size >= 0),
  verification_standing text not null check (
    verification_standing in (
      'verified',
      'metadata_verified',
      'hash_readback_unresolved',
      'failed',
      'superseded'
    )
  ),
  visibility_standing text not null default 'internal' check (
    visibility_standing in ('public', 'internal', 'protected', 'restricted')
  ),
  verified_at timestamptz,
  source_oar2_path text not null,
  closeout_oar1_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint seeded_source_snapshot_version_hash_unique unique (version_key, source_sha256)
);

create index if not exists concordance_version_document_key_idx
on public.concordance_version(document_key);

create index if not exists concordance_version_active_idx
on public.concordance_version(document_key, version_standing)
where version_standing = 'active';

create unique index if not exists concordance_version_one_active_per_document_idx
on public.concordance_version(document_key)
where version_standing = 'active';

create index if not exists concordance_term_version_key_idx
on public.concordance_term(version_key);

create index if not exists concordance_term_active_idx
on public.concordance_term(version_key, term_standing)
where term_standing = 'active';

create index if not exists concordance_relation_version_key_idx
on public.concordance_relation(version_key);

create index if not exists concordance_relation_scope_idx
on public.concordance_relation(version_key, relation_scope);

create index if not exists concordance_relation_source_term_idx
on public.concordance_relation(source_term_key);

create index if not exists concordance_relation_target_term_idx
on public.concordance_relation(target_term_key);

create index if not exists seeded_source_snapshot_version_key_idx
on public.seeded_source_snapshot(version_key);

create or replace function public.concordance_authority_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists concordance_document_updated_at on public.concordance_document;
create trigger concordance_document_updated_at
before update on public.concordance_document
for each row
execute function public.concordance_authority_set_updated_at();

drop trigger if exists concordance_version_updated_at on public.concordance_version;
create trigger concordance_version_updated_at
before update on public.concordance_version
for each row
execute function public.concordance_authority_set_updated_at();

drop trigger if exists concordance_term_updated_at on public.concordance_term;
create trigger concordance_term_updated_at
before update on public.concordance_term
for each row
execute function public.concordance_authority_set_updated_at();

create or replace function public.concordance_authority_prevent_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'concordance authority history is append-protected';
end;
$$;

create or replace function public.concordance_authority_protect_recognition_timestamps()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_table_name = 'concordance_version'
     and old.recognized_at is not null
     and new.recognized_at is distinct from old.recognized_at then
    raise exception 'concordance_version.recognized_at is immutable after recognition';
  end if;

  if tg_table_name = 'seeded_source_snapshot'
     and old.verified_at is not null
     and new.verified_at is distinct from old.verified_at then
    raise exception 'seeded_source_snapshot.verified_at is immutable after verification';
  end if;

  return new;
end;
$$;

drop trigger if exists concordance_version_no_delete on public.concordance_version;
create trigger concordance_version_no_delete
before delete on public.concordance_version
for each row
execute function public.concordance_authority_prevent_mutation();

drop trigger if exists concordance_version_recognized_at_immutable on public.concordance_version;
create trigger concordance_version_recognized_at_immutable
before update on public.concordance_version
for each row
execute function public.concordance_authority_protect_recognition_timestamps();

drop trigger if exists concordance_term_no_delete on public.concordance_term;
create trigger concordance_term_no_delete
before delete on public.concordance_term
for each row
execute function public.concordance_authority_prevent_mutation();

drop trigger if exists concordance_relation_no_update on public.concordance_relation;
create trigger concordance_relation_no_update
before update on public.concordance_relation
for each row
execute function public.concordance_authority_prevent_mutation();

drop trigger if exists concordance_relation_no_delete on public.concordance_relation;
create trigger concordance_relation_no_delete
before delete on public.concordance_relation
for each row
execute function public.concordance_authority_prevent_mutation();

drop trigger if exists seeded_source_snapshot_no_update on public.seeded_source_snapshot;
create trigger seeded_source_snapshot_no_update
before update on public.seeded_source_snapshot
for each row
execute function public.concordance_authority_prevent_mutation();

drop trigger if exists seeded_source_snapshot_verified_at_immutable on public.seeded_source_snapshot;
create trigger seeded_source_snapshot_verified_at_immutable
before update on public.seeded_source_snapshot
for each row
execute function public.concordance_authority_protect_recognition_timestamps();

drop trigger if exists seeded_source_snapshot_no_delete on public.seeded_source_snapshot;
create trigger seeded_source_snapshot_no_delete
before delete on public.seeded_source_snapshot
for each row
execute function public.concordance_authority_prevent_mutation();

alter table public.concordance_document enable row level security;
alter table public.concordance_version enable row level security;
alter table public.concordance_term enable row level security;
alter table public.concordance_relation enable row level security;
alter table public.seeded_source_snapshot enable row level security;

drop policy if exists "concordance_document_public_active_read" on public.concordance_document;
create policy "concordance_document_public_active_read"
on public.concordance_document
for select
to anon, authenticated
using (
  authority_standing = 'active'
  and visibility_standing = 'public'
);

drop policy if exists "concordance_version_public_active_read" on public.concordance_version;
create policy "concordance_version_public_active_read"
on public.concordance_version
for select
to anon, authenticated
using (
  version_standing = 'active'
  and visibility_standing = 'public'
);

drop policy if exists "concordance_term_public_active_read" on public.concordance_term;
create policy "concordance_term_public_active_read"
on public.concordance_term
for select
to anon, authenticated
using (
  term_standing = 'active'
  and visibility_standing = 'public'
  and coalesce((metadata ->> 'protected')::boolean, false) = false
);

drop policy if exists "concordance_relation_public_active_read" on public.concordance_relation;
create policy "concordance_relation_public_active_read"
on public.concordance_relation
for select
to anon, authenticated
using (
  relation_standing = 'active'
  and visibility_standing = 'public'
  and coalesce((metadata ->> 'protected')::boolean, false) = false
);

drop policy if exists "seeded_source_snapshot_public_verified_read" on public.seeded_source_snapshot;
create policy "seeded_source_snapshot_public_verified_read"
on public.seeded_source_snapshot
for select
to anon, authenticated
using (
  verification_standing in ('verified', 'metadata_verified', 'hash_readback_unresolved')
  and visibility_standing = 'public'
  and coalesce((metadata ->> 'protected')::boolean, false) = false
);
