-- OAR2: oar2_register_issue001_launch_campaign_and_distribution_assets_v1
-- Distribution Assets are platform-specific projections. Do NOT schedule. Do NOT publish.
-- Every row references campaign_asset_id + publication_asset_id + campaign_id (ROUTED §5).
-- Status is draft for every row (ROUTED §7); buffer_export_ready marks Buffer-export readiness
-- without performing any export (buffer_social_distribution_integration remains automation_status: held).

insert into public.measures_publication_distribution_asset
  (distribution_asset_key, campaign_asset_id, publication_asset_id, campaign_id, platform, distribution_type, status, buffer_export_ready, optics, metadata)
values
  (
    'undrifted_issue001_da_cover_story_website_v1',
    'undrifted_issue001_ca_cover_story_hero_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'undrifted_issue001_launch_campaign_v1',
    'website',
    'Website Feature',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    jsonb_build_object('target_route', '/undrifted')
  ),
  (
    'undrifted_issue001_da_cover_story_instagram_v1',
    'undrifted_issue001_ca_cover_story_hero_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'undrifted_issue001_launch_campaign_v1',
    'instagram',
    'Instagram Post',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_cover_story_quote_x_v1',
    'undrifted_issue001_ca_cover_story_quote_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'undrifted_issue001_launch_campaign_v1',
    'x',
    'X Thread',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_cover_story_quote_linkedin_v1',
    'undrifted_issue001_ca_cover_story_quote_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'undrifted_issue001_launch_campaign_v1',
    'linkedin',
    'LinkedIn Article',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_editors_letter_paragraph_v1',
    'undrifted_issue001_ca_editors_letter_thumbnail_v1',
    'undrifted_issue01_editors_letter_article_v1',
    'undrifted_issue001_launch_campaign_v1',
    'paragraph',
    'Paragraph Publication',
    'draft',
    false,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    jsonb_build_object('note', 'underlying dispatch already published independently at https://paragraph.com/@undrifted/from-the-editor; this row is a fresh campaign-layer record, status intentionally draft per ROUTED §7 and does not alter dispatch standing')
  ),
  (
    'undrifted_issue001_da_editors_letter_email_v1',
    'undrifted_issue001_ca_editors_letter_thumbnail_v1',
    'undrifted_issue01_editors_letter_article_v1',
    'undrifted_issue001_launch_campaign_v1',
    'email',
    'Newsletter',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_dispatches_instagram_v1',
    'undrifted_issue001_ca_dispatches_carousel_v1',
    'agents_with_keys_dispatch_v1',
    'undrifted_issue001_launch_campaign_v1',
    'instagram',
    'Instagram Carousel',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_dispatches_linkedin_v1',
    'undrifted_issue001_ca_dispatches_carousel_v1',
    'agents_with_keys_dispatch_v1',
    'undrifted_issue001_launch_campaign_v1',
    'linkedin',
    'LinkedIn Article',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_launch_digest_email_v1',
    'undrifted_issue001_ca_launch_digest_email_v1',
    'undrifted_issue01',
    'undrifted_issue001_launch_campaign_v1',
    'email',
    'Newsletter',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    '{}'::jsonb
  ),
  (
    'undrifted_issue001_da_assessment_website_v1',
    'undrifted_issue001_ca_assessment_hero_v1',
    'undrifted_issue01_page06_launch_encounter',
    'undrifted_issue001_launch_campaign_v1',
    'website',
    'Website Feature',
    'draft',
    true,
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset'),
    jsonb_build_object('target_route', '/ai-operations-assessment')
  );
