-- OAR2: oar2_add_campaign_derivative_assets_and_human_ai_role_attribution_v1
-- Backfills the columns added by the prior two migrations onto rows created in the earlier
-- campaign OAR2. All existing rows were, in fact, created by the AI executing that OAR2 under the
-- Human operator's authorization — attribution here is factually accurate, not retconned.
-- Also links each existing Campaign Asset to its new Derivative Asset (§3), and merges the
-- 5-step optics observation chain (§6) into every table's existing `optics` seed.

update public.measures_publication_campaign_asset
set derivative_asset_id = 'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1'
where campaign_asset_key = 'undrifted_issue001_ca_cover_story_hero_v1';

update public.measures_publication_campaign_asset
set derivative_asset_id = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_pull_quote_v1'
where campaign_asset_key = 'undrifted_issue001_ca_cover_story_quote_v1';

update public.measures_publication_campaign_asset
set derivative_asset_id = 'undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1'
where campaign_asset_key = 'undrifted_issue001_ca_editors_letter_thumbnail_v1';

update public.measures_publication_campaign_asset
set derivative_asset_id = 'agents_with_keys_dispatch_v1_carousel_copy_v1',
    metadata = metadata || jsonb_build_object('additional_derivative_asset_ids', jsonb_build_array('fables_and_myths_dispatch_v1_carousel_copy_v1'), 'multi_derivative_note', 'This Campaign Asset is a 2-slide composite; derivative_asset_id holds the primary (first slide) derivative per the exactly-one-derivative field cardinality. The second slide''s derivative is listed here, not modeled as a second FK.')
where campaign_asset_key = 'undrifted_issue001_ca_dispatches_carousel_v1';

update public.measures_publication_campaign_asset
set derivative_asset_id = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1'
where campaign_asset_key = 'undrifted_issue001_ca_launch_digest_email_v1';

update public.measures_publication_campaign_asset
set derivative_asset_id = 'undrifted_issue01_page06_launch_encounter_hero_v1'
where campaign_asset_key = 'undrifted_issue001_ca_assessment_hero_v1';

update public.measures_publication_campaign_asset
set created_by_actor_class = 'AI',
    created_by_actor_key = 'claude_sonnet_5',
    approved_by_actor_class = 'Human',
    approved_by_actor_key = 'op044',
    review_status = 'oar2_authorized',
    optics = optics || jsonb_build_object('observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence'))
where campaign_id = 'undrifted_issue001_launch_campaign_v1';

update public.measures_publication_campaign
set created_by_actor_class = 'AI',
    created_by_actor_key = 'claude_sonnet_5',
    approved_by_actor_class = 'Human',
    approved_by_actor_key = 'op044',
    review_status = 'oar2_authorized',
    optics = optics || jsonb_build_object('observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence'))
where campaign_key = 'undrifted_issue001_launch_campaign_v1';

update public.measures_publication_distribution_asset
set created_by_actor_class = 'AI',
    created_by_actor_key = 'claude_sonnet_5',
    approved_by_actor_class = 'Human',
    approved_by_actor_key = 'op044',
    review_status = 'oar2_authorized',
    optics = optics || jsonb_build_object('observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence'))
where campaign_id = 'undrifted_issue001_launch_campaign_v1';
