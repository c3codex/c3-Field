-- OAR2: oar2_export_issue001_campaign_to_buffer_drafts_v1
-- Reexecution: .dev.vars supplied BUFFER_SOCIAL_KEY, so Buffer draft creation was performed live.
-- Scope: metadata-only standing update for the five connected Buffer channels. No scheduling,
-- publishing, queue activation, campaign release-state change, or distribution status change.

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'draft_created',
  'buffer_draft_id', '6a5002b7a9e4eacc31025340',
  'buffer_post_status', 'draft',
  'buffer_channel_service', 'instagram',
  'buffer_due_at', null,
  'exported_at', '2026-07-09T20:23:41.763Z',
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md',
  'buffer_live_reexecution_at', '2026-07-09T20:23:41.763Z',
  'buffer_platform_formatting_note', 'created_as_instagram_post_with_video_asset'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_instagram_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'draft_created',
  'buffer_draft_id', '6a5002b8321614183a1f1ff5',
  'buffer_post_status', 'draft',
  'buffer_channel_service', 'linkedin',
  'buffer_due_at', null,
  'exported_at', '2026-07-09T20:23:41.763Z',
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md',
  'buffer_live_reexecution_at', '2026-07-09T20:23:41.763Z',
  'buffer_platform_formatting_note', 'edited_after_create_to_preserve_image_asset; link appended as platform formatting'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_linkedin_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'draft_created',
  'buffer_draft_id', '6a5002b83c48e2c7b33feafa',
  'buffer_post_status', 'draft',
  'buffer_channel_service', 'twitter',
  'buffer_due_at', null,
  'exported_at', '2026-07-09T20:23:41.763Z',
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md',
  'buffer_live_reexecution_at', '2026-07-09T20:23:41.763Z',
  'buffer_platform_formatting_note', 'created_as_x_thread_draft'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_x_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'draft_created',
  'buffer_draft_id', '6a5002d83c48e2c7b33feb8c',
  'buffer_post_status', 'draft',
  'buffer_channel_service', 'instagram',
  'buffer_due_at', null,
  'exported_at', '2026-07-09T20:23:41.763Z',
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md',
  'buffer_live_reexecution_at', '2026-07-09T20:23:41.763Z',
  'buffer_platform_formatting_note', 'buffer_rejected_carousel_post_type_for_connected_channel; created_as_instagram_post_with_two_image_assets'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_instagram_v1';

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'draft_created',
  'buffer_draft_id', '6a5002d93c48e2c7b33feba4',
  'buffer_post_status', 'draft',
  'buffer_channel_service', 'linkedin',
  'buffer_due_at', null,
  'exported_at', '2026-07-09T20:23:41.763Z',
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md',
  'buffer_live_reexecution_at', '2026-07-09T20:23:41.763Z',
  'buffer_platform_formatting_note', 'edited_after_create_to_preserve_two_image_assets; link appended as platform formatting'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_linkedin_v1';
