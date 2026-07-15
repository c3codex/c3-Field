-- OAR2: oar2_complete_launch_cycle_001_publication_operations_environment_v1
-- Scope: metadata-only registration of the Launch Cycle 001 publication operations dashboard.
-- No scheduling, publishing, media mutation, derivative creation, renderer mutation, or secret storage.

update public.measures_publication_campaign
set metadata = metadata || jsonb_build_object(
  'publication_operations_dashboard', jsonb_build_object(
    'source_oar2', 'OAR/OAR2/publication/oar2_complete_launch_cycle_001_publication_operations_environment_v1.meta.md',
    'dashboard_markdown_path', 'docs/oar/measures_registry/launch_cycle_001_publication_operations_dashboard_v1.md',
    'dashboard_json_path', 'docs/oar/measures_registry/launch_cycle_001_publication_operations_dashboard_v1.json',
    'endpoint_identity_registry_finalized', true,
    'seven_day_queue_items', 7,
    'buffer_workspaces_authorized', jsonb_build_array('BUFFER_SOCIAL_KEY', 'BUFFER_PUB2_KEY'),
    'operator_approval_required_before_schedule_or_publish', true,
    'creative_production_separated_under_claude', true,
    'publication_operations_separated_under_cody', true,
    'final_disposition', 'HELD WITH REASON',
    'unresolved_blockers', jsonb_build_array(
      'three_canonical_youtube_assets_rejected_by_buffer_invalid_post',
      'pub2_facebook_and_undrifted_x_need_endpoint_specific_operator_review_before_external_drafts',
      'creative_production_pending_for_instagram_launch_reel'
    )
  )
),
review_status = coalesce(review_status, 'oar2_authorized_draft_preparation'),
updated_at = now()
where campaign_key in (
  'undrifted_issue001_launch_campaign_v1',
  'launch_cycle_001_canonical_media_activation_v1'
);
