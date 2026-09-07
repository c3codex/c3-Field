-- OAR2: oar2_establish_native_distribution_execution_registry_v1
-- Establishes a native Distribution Execution Registry so Buffer is one executor among many,
-- not campaign/distribution authority. Registry/schema architecture only — no platform API calls,
-- no scheduling, no publishing, no changes to existing Buffer draft/publication state.
--
-- §1 inspection (existing structures) found no schema changes needed to
-- measures_publication_distribution_asset / _campaign / _campaign_asset / _derivative_asset;
-- this migration only adds new tables.

create table if not exists public.measures_distribution_executor (
  executor_key          text primary key,
  executor_name         text not null,
  executor_type         text not null
    check (executor_type in ('human', 'ai', 'buffer', 'platform_api', 'email_service', 'manual', 'system')),
  platform              text,
  role_class            text not null
    check (role_class in ('Human', 'AI', 'System')),
  execution_mode        text not null,
  credential_reference  text,
  status                text not null default 'held',
  supports_media        boolean not null default false,
  supports_video        boolean not null default false,
  supports_threads      boolean not null default false,
  supports_carousel     boolean not null default false,
  supports_scheduling   boolean not null default false,
  supports_draft        boolean not null default false,
  supports_publish      boolean not null default false,
  metadata              jsonb not null default '{}'::jsonb,
  optics                jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table if not exists public.measures_distribution_channel (
  channel_key           text primary key,
  executor_key           text not null references public.measures_distribution_executor(executor_key),
  platform               text not null,
  account_name           text,
  channel_identifier     text,
  channel_url            text,
  status                 text not null default 'held',
  role_owner             text,
  credential_reference   text,
  metadata               jsonb not null default '{}'::jsonb,
  optics                 jsonb not null default '{}'::jsonb,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists measures_distribution_channel_executor_idx
  on public.measures_distribution_channel(executor_key);

create table if not exists public.measures_distribution_execution (
  execution_id            uuid primary key default gen_random_uuid(),
  distribution_asset_id   text not null references public.measures_publication_distribution_asset(distribution_asset_key),
  executor_key            text not null references public.measures_distribution_executor(executor_key),
  channel_key             text references public.measures_distribution_channel(channel_key),
  execution_status        text not null default 'draft'
    check (execution_status in ('draft', 'prepared', 'queued', 'scheduled', 'published', 'failed', 'held', 'canceled')),
  execution_mode          text not null,
  attempt_number          integer not null default 1,
  scheduled_for           timestamptz,
  executed_at             timestamptz,
  published_at            timestamptz,
  platform_post_id        text,
  platform_url            text,
  evidence                jsonb not null default '{}'::jsonb,
  error                   text,
  source_oar2             text,
  created_by_actor_class  text,
  created_by_actor_key    text,
  approved_by_actor_class text,
  approved_by_actor_key   text,
  metadata                jsonb not null default '{}'::jsonb,
  optics                  jsonb not null default '{}'::jsonb,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists measures_distribution_execution_asset_idx
  on public.measures_distribution_execution(distribution_asset_id);
create index if not exists measures_distribution_execution_status_idx
  on public.measures_distribution_execution(execution_status);

alter table public.measures_distribution_executor enable row level security;
alter table public.measures_distribution_channel enable row level security;
alter table public.measures_distribution_execution enable row level security;

drop policy if exists "measures_distribution_executor_service_role" on public.measures_distribution_executor;
create policy "measures_distribution_executor_service_role"
on public.measures_distribution_executor for all to service_role using (true) with check (true);

drop policy if exists "measures_distribution_channel_service_role" on public.measures_distribution_channel;
create policy "measures_distribution_channel_service_role"
on public.measures_distribution_channel for all to service_role using (true) with check (true);

drop policy if exists "measures_distribution_execution_service_role" on public.measures_distribution_execution;
create policy "measures_distribution_execution_service_role"
on public.measures_distribution_execution for all to service_role using (true) with check (true);

revoke all on table public.measures_distribution_executor from anon, authenticated;
revoke all on table public.measures_distribution_channel from anon, authenticated;
revoke all on table public.measures_distribution_execution from anon, authenticated;
grant select, insert, update on table public.measures_distribution_executor to service_role;
grant select, insert, update on table public.measures_distribution_channel to service_role;
grant select, insert, update on table public.measures_distribution_execution to service_role;

drop trigger if exists measures_distribution_executor_updated_at on public.measures_distribution_executor;
create trigger measures_distribution_executor_updated_at
before update on public.measures_distribution_executor
for each row execute function public.set_updated_at();

drop trigger if exists measures_distribution_channel_updated_at on public.measures_distribution_channel;
create trigger measures_distribution_channel_updated_at
before update on public.measures_distribution_channel
for each row execute function public.set_updated_at();

drop trigger if exists measures_distribution_execution_updated_at on public.measures_distribution_execution;
create trigger measures_distribution_execution_updated_at
before update on public.measures_distribution_execution
for each row execute function public.set_updated_at();

-- §5: Register Buffer as executor. Status bound to system_process_registry's
-- buffer_social_distribution_integration standing (is_active=false, automation_status=held) —
-- note this reflects governance standing, not operational capability: Buffer has been proven to
-- work end-to-end under a different executor context (Cody), evidenced in §8 below.
insert into public.measures_distribution_executor (
  executor_key, executor_name, executor_type, platform, role_class, execution_mode,
  credential_reference, status, supports_media, supports_video, supports_threads,
  supports_carousel, supports_scheduling, supports_draft, supports_publish, metadata, optics
) values (
  'buffer', 'Buffer', 'buffer', 'multi_platform', 'System', 'buffer',
  'BUFFER_SOCIAL_KEY (.dev.vars)', 'held', true, true, true,
  true, true, true, true,
  jsonb_build_object(
    'bound_process_key', 'buffer_social_distribution_integration',
    'bound_process_status_note', 'is_active=false, automation_status=held per system_process_registry',
    'proven_functional_context', 'Cody executor session (BUFFER_SOCIAL_KEY from .dev.vars); not available in this repo/session directly',
    'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'
  ),
  jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
)
on conflict (executor_key) do nothing;

-- §6: Register Human Manual Distribution executor.
insert into public.measures_distribution_executor (
  executor_key, executor_name, executor_type, platform, role_class, execution_mode,
  credential_reference, status, supports_media, supports_video, supports_threads,
  supports_carousel, supports_scheduling, supports_draft, supports_publish, metadata, optics
) values (
  'human_manual_distribution', 'Human Manual Distribution', 'manual', 'multi_platform', 'Human', 'manual',
  null, 'available', true, true, false,
  false, false, false, true,
  jsonb_build_object(
    'purpose', jsonb_build_array(
      'Facebook Groups', 'live community discussions', 'conferences',
      'manually posted content', 'relationship-based outreach'
    ),
    'not_automation', true,
    'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'
  ),
  jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)
)
on conflict (executor_key) do nothing;

-- §7: Register future platform API executors as held. No API calls implemented or made.
insert into public.measures_distribution_executor (
  executor_key, executor_name, executor_type, platform, role_class, execution_mode,
  credential_reference, status, supports_media, supports_video, supports_threads,
  supports_carousel, supports_scheduling, supports_draft, supports_publish, metadata, optics
) values
  ('linkedin_api', 'LinkedIn API', 'platform_api', 'linkedin', 'System', 'platform_api',
   null, 'held', true, true, false, false, true, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('x_api', 'X API', 'platform_api', 'x', 'System', 'platform_api',
   null, 'held', true, true, true, false, true, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('instagram_graph_api', 'Instagram Graph API', 'platform_api', 'instagram', 'System', 'platform_api',
   null, 'held', true, true, false, true, true, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('youtube_api', 'YouTube API', 'platform_api', 'youtube', 'System', 'platform_api',
   null, 'held', true, true, false, false, true, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated; no YouTube channel confirmed connected anywhere in this system',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('paragraph_api', 'Paragraph API', 'platform_api', 'paragraph', 'System', 'platform_api',
   null, 'held', false, true, false, false, false, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated',
     'bound_process_key', 'paragraph_publication_integration',
     'bound_process_status_note', 'is_active=false, automation_status=held per system_process_registry',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('email_newsletter_service', 'Email / Newsletter Service', 'email_service', 'email', 'System', 'email_service',
   null, 'held', false, false, false, false, true, true, true,
   jsonb_build_object('hold_reason', 'API keys / scopes / platform review not yet seated; no system_process_registry row exists for this integration yet',
     'source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false))
on conflict (executor_key) do nothing;

-- §3: Seed known channels with live evidence (Buffer API channel inspection, 2026-07-09).
-- YouTube deliberately not seeded — Buffer's own API confirmed no connected YouTube channel exists;
-- nothing to seed, not invented.
insert into public.measures_distribution_channel (
  channel_key, executor_key, platform, account_name, channel_identifier, channel_url,
  status, role_owner, credential_reference, metadata, optics
) values
  ('instagram_measures_registry', 'buffer', 'instagram', 'measures_registry', '6a23bfc4c687a22dd467a045',
   'https://instagram.com/measures_registry', 'active', 'Human', 'BUFFER_SOCIAL_KEY (.dev.vars)',
   jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
     'confirmed_via', 'Buffer API channel inspection, 2026-07-09 reexecution'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('linkedin_measures_registry', 'buffer', 'linkedin', 'measures-registry / Stephanie Gaffney', '6a23c027c687a22dd467a132',
   'https://www.linkedin.com/in/measures-registry', 'active', 'Human', 'BUFFER_SOCIAL_KEY (.dev.vars)',
   jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
     'confirmed_via', 'Buffer API channel inspection, 2026-07-09 reexecution', 'channel_kind', 'personal_profile_not_company_page'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('x_measures_c3', 'buffer', 'x', 'measures_c3', '6a23bff1c687a22dd467a0b3',
   'https://twitter.com/measures_c3', 'active', 'Human', 'BUFFER_SOCIAL_KEY (.dev.vars)',
   jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
     'confirmed_via', 'Buffer API channel inspection, 2026-07-09 reexecution'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false))
on conflict (channel_key) do nothing;

-- §8: Link the 5 real Buffer drafts from Issue001 to execution records, using the true current
-- status found live in measures_publication_distribution_asset.metadata at seeding time rather than
-- the OAR2's literal "execution_status: draft" instruction — that instruction was written before a
-- separate, later-authorized OAR2 (oar2_publish_approved_issue001_buffer_drafts_v1) actually published
-- 4 of the 5 drafts and 1 failed at Buffer/Instagram validation. Recording all 5 as "draft" here would
-- misstate registry evidence that this project has been explicit about never fabricating. No new
-- Buffer/platform API calls were made to produce this section — every field below is copied from
-- metadata already written live to measures_publication_distribution_asset by that prior OAR1
-- (OAR/OAR1/publication/oar1_publish_approved_issue001_buffer_drafts_v1.meta.md).
insert into public.measures_distribution_execution (
  distribution_asset_id, executor_key, channel_key, execution_status, execution_mode,
  attempt_number, published_at, platform_post_id, platform_url, evidence, error, source_oar2,
  created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key,
  metadata, optics
) values
  ('undrifted_issue001_da_cover_story_instagram_v1', 'buffer', 'instagram_measures_registry', 'published', 'buffer',
   1, '2026-07-09T21:58:48.216Z'::timestamptz, 'DalofxJmckI', 'https://www.instagram.com/reel/DalofxJmckI/',
   jsonb_build_object('buffer_draft_id', '6a5002b7a9e4eacc31025340', 'buffer_post_status', 'sent',
     'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'),
   null, 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
   'AI', 'Cody', 'Human', 'op044',
   jsonb_build_object('registry_backfilled_by', 'Claude', 'registry_backfill_note', 'execution row created retroactively to evidence a real, already-completed Buffer publish'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('undrifted_issue001_da_cover_story_quote_linkedin_v1', 'buffer', 'linkedin_measures_registry', 'published', 'buffer',
   1, '2026-07-09T21:56:23.513Z'::timestamptz, 'urn:li:share:7481103989191811072', 'https://www.linkedin.com/feed/update/urn:li:share:7481103989191811072',
   jsonb_build_object('buffer_draft_id', '6a5002b8321614183a1f1ff5', 'buffer_post_status', 'sent',
     'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'),
   null, 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
   'AI', 'Cody', 'Human', 'op044',
   jsonb_build_object('registry_backfilled_by', 'Claude', 'registry_backfill_note', 'execution row created retroactively to evidence a real, already-completed Buffer publish'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('undrifted_issue001_da_cover_story_quote_x_v1', 'buffer', 'x_measures_c3', 'published', 'buffer',
   1, '2026-07-09T21:56:12.416Z'::timestamptz, '2075338250911183123', 'https://x.com/2063041676583583744/status/2075338250911183123',
   jsonb_build_object('buffer_draft_id', '6a5002b83c48e2c7b33feafa', 'buffer_post_status', 'sent',
     'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'),
   null, 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
   'AI', 'Cody', 'Human', 'op044',
   jsonb_build_object('registry_backfilled_by', 'Claude', 'registry_backfill_note', 'execution row created retroactively to evidence a real, already-completed Buffer publish'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('undrifted_issue001_da_dispatches_linkedin_v1', 'buffer', 'linkedin_measures_registry', 'published', 'buffer',
   1, '2026-07-09T22:06:10.564Z'::timestamptz, 'urn:li:ugcPost:7481106451558662144', 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7481106451558662144',
   jsonb_build_object('buffer_draft_id', '6a5002d93c48e2c7b33feba4', 'buffer_post_status', 'sent',
     'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'),
   null, 'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
   'AI', 'Cody', 'Human', 'op044',
   jsonb_build_object('registry_backfilled_by', 'Claude', 'registry_backfill_note', 'execution row created retroactively to evidence a real, already-completed Buffer publish'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false)),
  ('undrifted_issue001_da_dispatches_instagram_v1', 'buffer', 'instagram_measures_registry', 'failed', 'buffer',
   1, null, null, null,
   jsonb_build_object('buffer_draft_id', '6a5002d83c48e2c7b33feb8c', 'buffer_post_status', 'error',
     'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'),
   'Instagram does not support the aspect ratio of this media. Instagram supports aspect ratios between 4:5 and 1.91:1 for feed posts, and 9:16 for Stories and Reels.',
   'OAR/OAR2/publication/oar2_establish_native_distribution_execution_registry_v1.meta.md',
   'AI', 'Cody', 'Human', 'op044',
   jsonb_build_object('registry_backfilled_by', 'Claude', 'registry_backfill_note', 'execution row created retroactively to evidence a real, already-failed Buffer publish attempt; follow-up OAR2 required per prior OAR1 warning'),
   jsonb_build_object('observes', 'distribution_event', 'models_individuals_as_primary', false));

-- Post 006 (YouTube) intentionally has no execution row — it never reached Buffer at all
-- (manifest_prepared only, per the export OAR1), so there is no real execution to evidence yet.
