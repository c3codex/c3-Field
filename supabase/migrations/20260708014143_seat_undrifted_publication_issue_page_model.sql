-- OAR2: oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1
-- Seats measures_publication_issue_page as the governed issue-page model. No suitable
-- existing table was found (confirmed via information_schema search before creating this).
-- page_key/page_role are authority; route_path is a routing surface only, never authority
-- (per this OAR2's explicit instruction not to use slug/route as authority).

create table public.measures_publication_issue_page (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  publication_key text not null,
  issue_id text not null,
  issue_number text not null,
  page_number integer not null,
  page_role text not null
    check (page_role in ('cover', 'editors_letter', 'contents', 'cover_story', 'dispatches', 'launch_encounter')),
  title text not null,
  subtitle text,
  asset_id text,
  dispatch_key text,
  banner_asset_id text,
  route_path text,
  layout_profile_key text not null,
  release_state text not null default 'held'
    check (release_state in ('released', 'held')),
  visibility_state text not null default 'not_rendered'
    check (visibility_state in ('visible', 'not_rendered', 'held')),
  source_authority text not null default 'measures_publication_registry',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  unique (publication_key, issue_id, page_number)
);

comment on table public.measures_publication_issue_page is
  'Governed issue-page model: ordered publication objects for an issue''s pages (cover, editorial front matter, articles, structural sections). Seated by oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1. page_key/page_role/page_number are authority; route_path is a routing surface only.';

alter table public.measures_publication_issue_page enable row level security;

create policy "measures_publication_issue_page_public_read"
  on public.measures_publication_issue_page
  for select
  to anon, authenticated
  using (visibility_state = 'visible');
