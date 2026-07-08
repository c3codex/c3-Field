-- OAR2: oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1 §3
-- Five new Campaign Assets orchestrating the newly-generated derivatives — Newsletter, Quote
-- (X thread + LinkedIn summary, split by platform per ROUTED's category list), Issue Promotion
-- (reel script), and a second Assessment asset (short video). Campaign Assets own no content —
-- each references exactly one derivative_asset_id.

insert into public.measures_publication_campaign_asset
  (campaign_asset_key, campaign_id, publication_asset_id, publication_asset_type, campaign_asset_type, title, status, derivative_asset_id, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_issue001_ca_editors_letter_newsletter_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_editors_letter_article_v1',
    'article',
    'newsletter',
    'From the Editor — Newsletter Excerpt',
    'draft',
    'undrifted_issue01_editors_letter_article_v1_newsletter_excerpt_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_issue001_ca_cover_story_x_thread_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'article',
    'x_thread',
    'AI Isn''t Broken. Systems Are. — X Thread',
    'draft',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_x_thread_draft_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_issue001_ca_cover_story_linkedin_summary_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'article',
    'linkedin_summary',
    'AI Isn''t Broken. Systems Are. — LinkedIn Summary',
    'draft',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_linkedin_summary_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_issue001_ca_issue_promotion_reel_script_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'article',
    'reel_script',
    'Issue 001 — Launch Reel Script (Issue Promotion)',
    'draft',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_reel_script_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_issue001_ca_assessment_video_v1',
    'undrifted_issue001_launch_campaign_v1',
    'undrifted_issue01_page06_launch_encounter',
    'assessment_media',
    'video_short',
    'AI Operations Assessment — Short Video Narration',
    'draft',
    'undrifted_issue01_page06_launch_encounter_video_short_narration_v1',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'campaign_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  );
