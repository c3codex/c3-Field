-- OAR2: oar2_register_issue001_launch_campaign_and_distribution_assets_v1
-- Campaigns do not own content. Issues own content; Campaigns orchestrate registered assets;
-- Distribution platforms are projections. This migration seats three governed tables:
--   measures_publication_campaign          — the campaign itself (references publication_key/issue_id)
--   measures_publication_campaign_asset    — references a registered publication asset, never owns media
--   measures_publication_distribution_asset — a platform-specific projection of a campaign asset
-- Each carries an `optics` jsonb column: fields prepared only, no analytics implementation (ROUTED §8).
-- No public/anon read policy is added — campaigns are internal orchestration objects, not
-- FREE-rendered content; only service_role has access, matching the split pattern already used
-- by measures_publication_release.

create table public.measures_publication_campaign (
  id uuid primary key default gen_random_uuid(),
  campaign_key text not null unique,
  publication_key text not null,
  issue_id text not null,
  campaign_name text not null,
  campaign_objective text,
  status text not null default 'draft',
  release_state text not null default 'held',
  start_date date,
  end_date date,
  optics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.measures_publication_campaign_asset (
  id uuid primary key default gen_random_uuid(),
  campaign_asset_key text not null unique,
  campaign_key text not null references public.measures_publication_campaign(campaign_key),
  publication_asset_id text not null,
  publication_asset_type text not null,
  campaign_asset_type text not null,
  title text not null,
  status text not null default 'draft',
  optics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.measures_publication_distribution_asset (
  id uuid primary key default gen_random_uuid(),
  distribution_asset_key text not null unique,
  campaign_asset_id text not null references public.measures_publication_campaign_asset(campaign_asset_key),
  publication_asset_id text not null,
  campaign_id text not null references public.measures_publication_campaign(campaign_key),
  platform text not null,
  distribution_type text not null,
  status text not null default 'draft',
  buffer_export_ready boolean not null default false,
  optics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.measures_publication_campaign enable row level security;
alter table public.measures_publication_campaign_asset enable row level security;
alter table public.measures_publication_distribution_asset enable row level security;

create policy "service_role_only_publication_campaign" on public.measures_publication_campaign
  for all to public using (auth.role() = 'service_role');

create policy "service_role_only_publication_campaign_asset" on public.measures_publication_campaign_asset
  for all to public using (auth.role() = 'service_role');

create policy "service_role_only_publication_distribution_asset" on public.measures_publication_distribution_asset
  for all to public using (auth.role() = 'service_role');

comment on table public.measures_publication_campaign is 'Governed campaign registry object: organizes movement of registered Issue assets through distribution channels. Campaigns do not own content — Issues do. Seated by oar2_register_issue001_launch_campaign_and_distribution_assets_v1.';
comment on table public.measures_publication_campaign_asset is 'References a registered publication asset (article/banner/image/video/assessment media) for campaign use. Does not own media — publication_asset_id is a pointer, not a copy.';
comment on table public.measures_publication_distribution_asset is 'Platform-specific projection of a Campaign Asset. Distribution platforms remain downstream of Publication authority. status is draft-only for this OAR2 — no scheduling or publishing performed.';
