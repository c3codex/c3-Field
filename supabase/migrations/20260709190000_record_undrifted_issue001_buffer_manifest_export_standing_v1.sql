-- OAR2: oar2_export_issue001_campaign_to_buffer_drafts_v1
-- No BUFFER_SOCIAL_KEY exists in this environment and no Buffer API integration code exists in the
-- repo (system_process_registry.buffer_social_distribution_integration is is_active=false,
-- automation_status=held) — per ROUTED §4's explicit instruction, real Buffer drafts were NOT
-- fabricated. A payload manifest was prepared instead:
--   docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md
--
-- Of the campaign's 12 Distribution Assets, 6 are Buffer-supported-platform + real-media-backed and
-- are recorded below as manifest_prepared. The other 6 are intentionally left untouched:
--   - website (2), email/newsletter (2): not Buffer-postable platforms
--   - paragraph (1): buffer_export_ready=false, already published independently
--   - instagram reel (1): script only, no video file exists yet (platform_notes says so explicitly)
--
-- This migration only records metadata (no dedicated buffer_export_state column exists on
-- measures_publication_distribution_asset). Row `status` stays 'draft'. Buffer automation_status,
-- campaign release_state, publication_state, and Stripe state are all untouched.

update public.measures_publication_distribution_asset
set metadata = metadata || jsonb_build_object(
  'buffer_export_state', 'manifest_prepared',
  'buffer_draft_id', null,
  'exported_at', now(),
  'exported_by_actor_class', 'AI',
  'approved_by_actor_class', 'Human',
  'source_oar2', 'OAR/OAR2/publication/oar2_export_issue001_campaign_to_buffer_drafts_v1.meta.md',
  'buffer_manifest_path', 'docs/oar/measures_registry/buffer_batch_002_undrifted_issue001_campaign_export_v1.md'
)
where distribution_asset_key in (
  'undrifted_issue001_da_assessment_youtube_v1',
  'undrifted_issue001_da_cover_story_instagram_v1',
  'undrifted_issue001_da_cover_story_quote_linkedin_v1',
  'undrifted_issue001_da_cover_story_quote_x_v1',
  'undrifted_issue001_da_dispatches_instagram_v1',
  'undrifted_issue001_da_dispatches_linkedin_v1'
);
