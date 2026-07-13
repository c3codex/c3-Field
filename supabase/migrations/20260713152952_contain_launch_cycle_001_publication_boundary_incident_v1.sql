update public.measures_publication_dispatch
set
  media_manifest = coalesce(media_manifest, '{}'::jsonb)
    || jsonb_build_object(
      'canonical_asset_path', 'Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md',
      'internal_research_record', 'Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md',
      'internal_research_record_sha256', 'FF491C9478AE3D2B6FA9FD59FED7608ED29B1C37BF2CC2D53234195AD1D95806'
    ),
  metadata = coalesce(metadata, '{}'::jsonb)
    || jsonb_build_object(
      'publication_boundary_incident', 'launch_cycle_001_publication_boundary_incident',
      'boundary_containment_oar2', 'docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md',
      'public_derivative_asset_path', 'Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md',
      'internal_research_record_path', 'Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md',
      'internal_research_record_sha256', 'FF491C9478AE3D2B6FA9FD59FED7608ED29B1C37BF2CC2D53234195AD1D95806',
      'paragraph_post_update_status', 'updated_in_place_with_public_derivative',
      'paragraph_update_method', 'PUT /api/v1/posts/8UdwP2yt8pw9FacBWIbw',
      'buffer_prior_drafts_deleted', jsonb_build_array('6a54ede947830b281a71e8cd', '6a54edead6677965d318facb'),
      'containment_timestamp', '2026-07-13T15:29:52Z',
      'executor', 'Cody'
    ),
  updated_at = now()
where dispatch_key = 'launch_cycle_001__paragraph__publication_001';

update public.measures_publication_dispatch
set
  metadata = coalesce(metadata, '{}'::jsonb)
    || jsonb_build_object(
      'publication_boundary_audit', 'audited_no_incident_markers_detected',
      'boundary_containment_oar2', 'docs/oar/measures_registry/oar2_immediately_contain_codex_governance_leak_and_restore_publication_boundary_v1.meta.md',
      'release_hold_dependency_review', 'passed_for_named_incident_markers',
      'buffer_prior_draft_deleted', '6a54edead6677965d318facb',
      'containment_timestamp', '2026-07-13T15:29:52Z',
      'executor', 'Cody'
    ),
  updated_at = now()
where dispatch_key = 'launch_cycle_001__paragraph__publication_002';
