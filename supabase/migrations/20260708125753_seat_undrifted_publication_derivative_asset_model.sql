-- OAR2: oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1
-- Publication Assets remain canonical. Derivative Assets are canonical *expressions* of a single
-- Publication Asset (excerpt, pull quote, summary, carousel copy, reel script, video cut, narration,
-- transcript, thumbnail, hero, caption, alt text). Campaign Assets no longer own generated content —
-- they will reference a derivative_asset_id (see follow-up migration). No generation workflow is
-- implemented here; every row this OAR2 inserts is generation_status = 'pending'.
-- Includes Human/AI actor attribution fields (ROUTED §2) and a generation_source provenance field
-- (ROUTED §5) directly at creation, since this is a brand-new table.

create table public.measures_publication_derivative_asset (
  id uuid primary key default gen_random_uuid(),
  derivative_key text not null unique,
  publication_asset_id text not null,
  derivative_type text not null check (derivative_type in (
    'excerpt', 'pull_quote', 'summary', 'carousel_copy', 'reel_script', 'video_short',
    'video_long', 'audio_narration', 'transcript', 'thumbnail', 'hero', 'caption', 'alt_text'
  )),
  title text not null,
  description text,
  language text not null default 'en',
  format text,
  duration text,
  source_reference text,
  generation_status text not null default 'pending',
  generation_source text,
  approval_status text not null default 'pending',
  release_state text not null default 'held',
  created_by_actor_class text check (created_by_actor_class is null or created_by_actor_class in ('Human', 'AI')),
  created_by_actor_key text,
  approved_by_actor_class text check (approved_by_actor_class is null or approved_by_actor_class in ('Human', 'AI')),
  approved_by_actor_key text,
  review_status text,
  optics jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.measures_publication_derivative_asset enable row level security;

create policy "service_role_only_publication_derivative_asset" on public.measures_publication_derivative_asset
  for all to public using (auth.role() = 'service_role');

comment on table public.measures_publication_derivative_asset is 'Canonical expression of exactly one Publication Asset (excerpt, pull quote, summary, carousel copy, etc). Campaign Assets reference these rather than owning generated content. Seated by oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1. generation_status is pending until a real generation workflow (not implemented here) produces content.';
comment on column public.measures_publication_derivative_asset.generation_source is 'Provenance only, per ROUTED §5: human_authored | ai_assisted | ai_generated | human_edited | human_approved. No generation workflow implemented — null until content actually exists.';
