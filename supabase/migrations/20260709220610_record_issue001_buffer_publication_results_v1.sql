-- OAR2: oar2_publish_approved_issue001_buffer_drafts_v1
-- Records live Buffer publication evidence for approved Issue001 drafts.
-- Scope: metadata-only evidence. No publication assets, derivative assets,
-- campaign sequencing, distribution payloads, or row status values are changed.

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'published_at', '2026-07-09T21:58:48.216Z',
  'platform_post_id', 'DalofxJmckI',
  'platform_url', 'https://www.instagram.com/reel/DalofxJmckI/',
  'buffer_post_id', '6a5002b7a9e4eacc31025340',
  'buffer_post_status', 'sent',
  'buffer_channel_service', 'instagram',
  'executor', 'Cody',
  'execution_mode', 'buffer',
  'publication_status', 'published',
  'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_instagram_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'published_at', '2026-07-09T21:56:23.513Z',
  'platform_post_id', 'urn:li:share:7481103989191811072',
  'platform_url', 'https://www.linkedin.com/feed/update/urn:li:share:7481103989191811072',
  'buffer_post_id', '6a5002b8321614183a1f1ff5',
  'buffer_post_status', 'sent',
  'buffer_channel_service', 'linkedin',
  'executor', 'Cody',
  'execution_mode', 'buffer',
  'publication_status', 'published',
  'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_linkedin_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'published_at', '2026-07-09T21:56:12.416Z',
  'platform_post_id', '2075338250911183123',
  'platform_url', 'https://x.com/2063041676583583744/status/2075338250911183123',
  'buffer_post_id', '6a5002b83c48e2c7b33feafa',
  'buffer_post_status', 'sent',
  'buffer_channel_service', 'twitter',
  'executor', 'Cody',
  'execution_mode', 'buffer',
  'publication_status', 'published',
  'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_x_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'published_at', '2026-07-09T22:06:10.564Z',
  'platform_post_id', 'urn:li:ugcPost:7481106451558662144',
  'platform_url', 'https://www.linkedin.com/feed/update/urn:li:ugcPost:7481106451558662144',
  'buffer_post_id', '6a5002d93c48e2c7b33feba4',
  'buffer_post_status', 'sent',
  'buffer_channel_service', 'linkedin',
  'executor', 'Cody',
  'execution_mode', 'buffer',
  'publication_status', 'published',
  'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_linkedin_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'published_at', null,
  'platform_post_id', null,
  'platform_url', null,
  'buffer_post_id', '6a5002d83c48e2c7b33feb8c',
  'buffer_post_status', 'error',
  'buffer_channel_service', 'instagram',
  'executor', 'Cody',
  'execution_mode', 'buffer',
  'publication_status', 'failed',
  'publication_error', 'Instagram does not support the aspect ratio of this media. Instagram supports aspect ratios between 4:5 and 1.91:1 for feed posts, and 9:16 for Stories and Reels.',
  'publication_source_oar2', 'OAR/OAR2/publication/oar2_publish_approved_issue001_buffer_drafts_v1.meta.md'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_instagram_v1';
