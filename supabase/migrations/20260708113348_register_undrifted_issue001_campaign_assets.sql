-- OAR2: oar2_register_issue001_launch_campaign_and_distribution_assets_v1
-- Campaign Assets reference registered Publication Assets; they do not own media.
-- Six assets built strictly from already-registered Issue 001 content (see ROUTED §4/§6).

insert into public.measures_publication_campaign_asset
  (campaign_asset_key, campaign_key, publication_asset_id, publication_asset_type, campaign_asset_type, title, status, optics, metadata)
values
  (
    'undrifted_issue001_ca_cover_story_hero_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'banner',
    'hero_graphic',
    'AI Isn''t Broken. Systems Are. — Hero Graphic',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('bound_media_role', 'ai_isnt_broken_landing', 'storage_path', 'ai_isnt_broken_landing.webp', 'source_dispatch_key', 'ai_isnt_broken_systems_are_dispatch_v1')
  ),
  (
    'undrifted_issue001_ca_cover_story_quote_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'article',
    'quote',
    'AI Isn''t Broken. Systems Are. — Pull Quote',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('quote_source', 'feature_headline+feature_deck', 'source_dispatch_key', 'ai_isnt_broken_systems_are_dispatch_v1')
  ),
  (
    'undrifted_issue001_ca_editors_letter_thumbnail_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_editors_letter_codexstone_banner_v1',
    'banner',
    'thumbnail',
    'From the Editor — Thumbnail',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('bound_media_role', 'editorial_banner', 'storage_path', 'editors_note_banner.webp', 'source_dispatch_key', 'editors_letter_issue001_v1')
  ),
  (
    'undrifted_issue001_ca_dispatches_carousel_v1',
    'undrifted_issue001_launch_campaign_v1',
    'agents_with_keys_dispatch_v1',
    'article',
    'carousel',
    'Dispatches — Agents With Keys / Fables and Myths',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('slide_dispatch_keys', jsonb_build_array('agents_with_keys_dispatch_v1', 'fables_and_myths_dispatch_v1'), 'slide_media_roles', jsonb_build_array('agents_with_keys_cover', 'fables_and_myths_cover'))
  ),
  (
    'undrifted_issue001_ca_launch_digest_email_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01',
    'website_media',
    'email_excerpt',
    'Issue 001 Launch Digest',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('excerpt_sources', jsonb_build_array('issue_record', 'editors_letter', 'cover_story'), 'bound_media_role', 'measures_registry_logo')
  ),
  (
    'undrifted_issue001_ca_assessment_hero_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_page06_launch_encounter',
    'assessment_media',
    'hero_graphic',
    'AI Operations Assessment — Hero Graphic',
    'draft',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset'),
    jsonb_build_object('bound_media_role', 'obsidian_assessment_surface_visual', 'storage_path', 'obsidian_assessment_surface_visual_v1.webp', 'target_route', '/ai-operations-assessment')
  );
