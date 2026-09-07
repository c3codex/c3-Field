-- OAR2: oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1
-- Seven Derivative Assets, each referencing exactly one canonical Publication Asset. All
-- generation_status = 'pending' — no derivative content has actually been produced yet; this
-- registers the intended expression, not a finished artifact. created_by/approved_by reflect how
-- this row itself came to exist: the AI executed the OAR2, the Human operator authored/authorized
-- the OAR2 that instructs it.

insert into public.measures_publication_derivative_asset
  (derivative_key, publication_asset_id, derivative_type, title, description, format, source_reference, generation_status, approval_status, release_state, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'hero',
    'AI Isn''t Broken. Systems Are. — Hero Crop',
    'Campaign-scale hero crop of the cover story banner. Not yet produced — pending derivative generation.',
    'image/webp',
    'Supabase Storage: measures-registry/ai_isnt_broken_landing.webp (source Publication Asset, not the derivative itself)',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md')
  ),
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_pull_quote_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'pull_quote',
    'AI Isn''t Broken. Systems Are. — Pull Quote',
    'AI ISN''T BROKEN. SYSTEMS ARE. — Measures Registry launches with Integrity Governance, an inside-out answer to AI systems optimization.',
    'text/plain',
    'Sourced verbatim from measures_publication_registry.metadata.cover_story (feature_headline + feature_deck) — already-registered copy, no new authoring performed.',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md')
  ),
  (
    'undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1',
    'undrifted_issue01_editors_letter_codexstone_banner_v1',
    'thumbnail',
    'From the Editor — Thumbnail',
    'Campaign-scale thumbnail crop of the editor''s letter banner. Not yet produced — pending derivative generation.',
    'image/webp',
    'Supabase Storage: measures-registry/editors_note_banner.webp (source Publication Asset, not the derivative itself)',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md')
  ),
  (
    'agents_with_keys_dispatch_v1_carousel_copy_v1',
    'agents_with_keys_dispatch_v1',
    'carousel_copy',
    'Agents With Keys — Carousel Copy',
    'Carousel slide copy derived from the "Agents With Keys" dispatch teaser. Not yet written — pending derivative generation.',
    'text/plain',
    'measures_publication_dispatch.metadata.feature_teaser (agents_with_keys_dispatch_v1)',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md', 'carousel_group', 'undrifted_issue001_dispatches_carousel', 'slide_order', 1)
  ),
  (
    'fables_and_myths_dispatch_v1_carousel_copy_v1',
    'fables_and_myths_dispatch_v1',
    'carousel_copy',
    'Fables and Myths — Carousel Copy',
    'Carousel slide copy derived from the "Fables and Myths" dispatch teaser. Not yet written — pending derivative generation.',
    'text/plain',
    'measures_publication_dispatch.metadata.feature_teaser (fables_and_myths_dispatch_v1)',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md', 'carousel_group', 'undrifted_issue001_dispatches_carousel', 'slide_order', 2)
  ),
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'summary',
    'Issue 001 Launch Digest — Summary',
    'Email-length summary anchored on the cover story. Not yet written — pending derivative generation.',
    'text/plain',
    'Anchor Publication Asset: undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md', 'note', 'Digest also excerpts editors_letter and issue_record; cover story chosen as the single canonical anchor since a derivative must reference exactly one Publication Asset — additional sources recorded here, not modeled as second derivatives.', 'additional_excerpted_sources', jsonb_build_array('undrifted_issue01_editors_letter_article_v1', 'undrifted_issue01'))
  ),
  (
    'undrifted_issue01_page06_launch_encounter_hero_v1',
    'undrifted_issue01_page06_launch_encounter',
    'hero',
    'AI Operations Assessment — Hero Crop',
    'Campaign-scale hero crop of the assessment surface visual. Not yet produced — pending derivative generation.',
    'image/webp',
    'Supabase Storage: measures-registry/obsidian_assessment_surface_visual_v1.webp (source Publication Asset, not the derivative itself)',
    'pending', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset'),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1.meta.md')
  );
