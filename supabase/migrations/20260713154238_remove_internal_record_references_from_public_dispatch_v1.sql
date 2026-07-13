update public.measures_publication_dispatch
set
  media_manifest =
    (coalesce(media_manifest, '{}'::jsonb)
      - 'internal_research_record'
      - 'internal_research_record_sha256'
    ) || jsonb_build_object(
      'canonical_asset_path', 'Assets/Articles/unDrifted/LaunchCycle001/registered/field_findings_2026_w28_public_article_v2.md'
    ),
  metadata =
    coalesce(metadata, '{}'::jsonb)
      - 'internal_research_record_path'
      - 'internal_research_record_sha256',
  updated_at = now()
where dispatch_key = 'launch_cycle_001__paragraph__publication_001';
