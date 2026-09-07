-- OAR2: oar2_establish_undrifted_publication_release_pipeline_v1
-- Seats Publication Release as the missing governance object between an
-- Issue and DB-rendered publication state. Additive only — does not touch
-- measures_encounter_def or any existing table/content.

create table public.measures_publication_release (
  id uuid primary key default gen_random_uuid(),
  release_id text not null unique,
  issue_id text not null,
  active_issue boolean not null default false,
  approved_article_asset_ids text[] not null default '{}',
  approved_banner_asset_ids text[] not null default '{}',
  publication_state text not null default 'pending_content_authority_decision'
    check (publication_state in (
      'pending_content_authority_decision',
      'approved',
      'synced',
      'superseded'
    )),
  archive_state text not null default 'not_archived'
    check (archive_state in ('not_archived', 'archived')),
  renderer_eligibility boolean not null default false,
  db_sync_status text not null default 'not_synced'
    check (db_sync_status in ('not_synced', 'synced', 'out_of_sync')),
  db_sync_path text,
  related_oar2 text,
  related_oar1 text,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.measures_publication_release is
  'Publication Release governance object: Issue -> Publication Release -> Registered Assets -> Publication State -> FREE. Seated by oar2_establish_undrifted_publication_release_pipeline_v1. No row here authorizes a DB content sync until publication_state = approved by explicit operator decision.';

alter table public.measures_publication_release enable row level security;

create policy "public read active measures_publication_release"
  on public.measures_publication_release
  for select
  to anon, authenticated
  using (is_active = true);

create policy "service_role_only_publication_release"
  on public.measures_publication_release
  for all
  to public
  using (auth.role() = 'service_role'::text)
  with check (auth.role() = 'service_role'::text);

insert into public.measures_publication_release (
  release_id,
  issue_id,
  active_issue,
  approved_article_asset_ids,
  approved_banner_asset_ids,
  publication_state,
  archive_state,
  renderer_eligibility,
  db_sync_status,
  db_sync_path,
  related_oar2,
  related_oar1,
  metadata
) values (
  'undrifted_issue01_release01',
  'undrifted_issue01',
  true,
  '{}',
  '{}',
  'pending_content_authority_decision',
  'not_archived',
  false,
  'not_synced',
  'scripts/sync-undrifted-publication-release.cjs',
  'OAR/OAR2/publication/oar2_establish_undrifted_publication_release_pipeline_v1.meta.md',
  null,
  jsonb_build_object(
    'notes', 'Shell release for Issue 01. Two candidate article/banner asset sets exist (live DB set vs newly file-registered launch set). Neither approved. See Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md.'
  )
);
