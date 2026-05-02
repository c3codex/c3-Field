-- =====================================================
-- MEASURES REGISTRY MEDIA SEATING
-- Campaign: agents_of_chaos_integrity_governance
-- =====================================================

create table if not exists public.measures_media_map (
  id uuid primary key default gen_random_uuid(),

  registry_key text not null,
  encounter_key text,
  campaign_key text,

  media_role text not null,
  storage_bucket text not null default 'measures-registry-public',
  storage_path text not null,

  mime_type text,
  sort_order integer not null default 1,
  is_active boolean not null default true,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (registry_key, coalesce(encounter_key, ''), coalesce(campaign_key, ''), media_role, storage_path)
);

insert into public.measures_media_map (
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  sort_order,
  metadata
)
values
(
  'measures_registry_landing',
  'landing_video_hero',
  'agents_of_chaos_integrity_governance',
  'hero_video',
  'measures-registry-public',
  'measures_registry/video/integrity_governance_intro.mp4',
  'video/mp4',
  1,
  '{"surface":"landing","usage":"hero_video"}'::jsonb
),
(
  'measures_registry_landing',
  'landing_video_hero',
  'agents_of_chaos_integrity_governance',
  'hero_poster',
  'measures-registry-public',
  'measures_registry/images/integrity_governance_poster.webp',
  'image/webp',
  2,
  '{"surface":"landing","usage":"video_poster"}'::jsonb
),
(
  'measures_registry_landing',
  'landing_brand',
  'agents_of_chaos_integrity_governance',
  'registry_mark',
  'measures-registry-public',
  'measures_registry/brand/measures_registry_mark.webp',
  'image/webp',
  3,
  '{"surface":"brand","usage":"mark"}'::jsonb
),
(
  'measures_registry_landing',
  'landing_brand',
  'agents_of_chaos_integrity_governance',
  'registry_banner',
  'measures-registry-public',
  'measures_registry/brand/measures_registry_banner.webp',
  'image/webp',
  4,
  '{"surface":"brand","usage":"banner"}'::jsonb
),
(
  'measures_registry_landing',
  'landing_brand',
  'agents_of_chaos_integrity_governance',
  'social_card',
  'measures-registry-public',
  'measures_registry/brand/measures_registry_social_card.webp',
  'image/webp',
  5,
  '{"surface":"social","usage":"og_social_card"}'::jsonb
),
(
  'measures_registry_publication',
  'paragraph_agents_of_chaos',
  'agents_of_chaos_integrity_governance',
  'paragraph_cover',
  'measures-registry-public',
  'measures_registry/images/paragraph_cover_agents_of_chaos.webp',
  'image/webp',
  6,
  '{"surface":"paragraph","usage":"article_cover"}'::jsonb
)
on conflict do nothing;

select
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_path,
  is_active
from public.measures_media_map
where campaign_key = 'agents_of_chaos_integrity_governance'
order by sort_order;
