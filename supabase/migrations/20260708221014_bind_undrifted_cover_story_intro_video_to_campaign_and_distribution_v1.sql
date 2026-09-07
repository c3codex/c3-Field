-- New Campaign Asset for the real intro video (kept distinct from the existing hero_graphic
-- campaign asset, matching this session's established pattern of adding a new, more precise
-- Campaign Asset rather than repointing an old one in place). Website + Instagram Distribution
-- Assets repointed from the still-pending image-crop campaign asset to this real one.

insert into public.measures_publication_campaign_asset
  (campaign_asset_key, campaign_id, publication_asset_id, publication_asset_type, campaign_asset_type, title, status, derivative_asset_id, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_issue001_ca_cover_story_intro_video_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'article',
    'video_short',
    'AI Isn''t Broken. Systems Are. — Real Intro Video',
    'draft',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('note', 'Real video, superior alternative to the still-pending Cover Story Hero image crop for the same distribution slots.')
  );

update public.measures_publication_distribution_asset
set campaign_asset_id = 'undrifted_issue001_ca_cover_story_intro_video_v1',
    payload = jsonb_build_object(
      'publication_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
      'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1',
      'campaign_asset_id', 'undrifted_issue001_ca_cover_story_intro_video_v1',
      'distribution_asset_id', 'undrifted_issue001_da_cover_story_website_v1',
      'title', 'AI Isn''t Broken. Systems Are.',
      'excerpt', 'Responsible AI deployment requires governable systems.',
      'media_references', jsonb_build_array('measures-media/ai_isnt_broken_intro.mp4'),
      'cta', 'Take the AI Operations Assessment',
      'link_destination', '/ai-operations-assessment',
      'platform_notes', 'Real 25.941s intro video (already live elsewhere on the site as the intro_hook_video) — narration ends with the article''s own headline. Replaces the still-pending image-crop concept for this website feature slot.'
    )
where distribution_asset_key = 'undrifted_issue001_da_cover_story_website_v1';

update public.measures_publication_distribution_asset
set campaign_asset_id = 'undrifted_issue001_ca_cover_story_intro_video_v1',
    payload = jsonb_build_object(
      'publication_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
      'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1',
      'campaign_asset_id', 'undrifted_issue001_ca_cover_story_intro_video_v1',
      'distribution_asset_id', 'undrifted_issue001_da_cover_story_instagram_v1',
      'title', 'AI Isn''t Broken. Systems Are.',
      'body', 'This is not an intelligence problem. It is a system problem. Watch the full piece — link in bio.',
      'excerpt', 'Responsible AI deployment requires governable systems.',
      'hashtags', jsonb_build_array('#AIGovernance', '#ResponsibleAI', '#SystemsThinking', '#unDrifted'),
      'media_references', jsonb_build_array('measures-media/ai_isnt_broken_intro.mp4'),
      'character_count', char_length('This is not an intelligence problem. It is a system problem. Watch the full piece — link in bio.'),
      'cta', 'Take the AI Operations Assessment',
      'link_destination', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
      'platform_notes', 'Real video post using the existing intro_hook_video as-is. Replaces the still-pending image-crop concept for this Instagram slot.'
    )
where distribution_asset_key = 'undrifted_issue001_da_cover_story_instagram_v1';
