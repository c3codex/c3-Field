-- OAR2: oar2_register_issue001_launch_campaign_and_distribution_assets_v1
-- Relationship: Issue -> Publication Assets -> Campaign. Issue 001 is canonical campaign authority.

insert into public.measures_publication_campaign
  (campaign_key, publication_key, issue_id, campaign_name, campaign_objective, status, release_state, start_date, optics, metadata)
values
  (
    'undrifted_issue001_launch_campaign_v1',
    'undrifted',
    'undrifted_issue01',
    'Issue 001 Launch',
    'Distribute Issue 001''s registered assets (cover story, editor''s letter, dispatches, assessment) across governed channels while preserving Issue 001 as the sole canonical content authority.',
    'draft',
    'held',
    '2026-06-01',
    jsonb_build_object(
      'prepared', true,
      'tracks_individuals', false,
      'attaches_to', jsonb_build_array('publication_asset', 'campaign_asset', 'distribution_asset', 'campaign'),
      'metrics_pending', jsonb_build_array('impressions', 'engagement', 'click_through', 'conversion_attribution'),
      'analytics_implemented', false
    ),
    jsonb_build_object(
      'source_oar2', 'OAR/OAR2/publication/oar2_register_issue001_launch_campaign_and_distribution_assets_v1.meta.md',
      'relationship', 'issue -> publication_assets -> campaign',
      'buffer_process_key', 'buffer_social_distribution_integration',
      'buffer_automation_status', 'held',
      'paragraph_process_key', 'paragraph_publication_integration'
    )
  );
