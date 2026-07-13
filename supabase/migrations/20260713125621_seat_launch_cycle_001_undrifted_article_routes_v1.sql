-- OAR2: Publish Launch Cycle 001 Articles and Project the unDrifted Release v1
-- Seats stable Measures Registry /undrifted route authority for the two approved
-- Launch Cycle 001 canonical article assets. The article bodies remain in the
-- registered Markdown assets; these rows only authorize route projection.

insert into public.measures_publication_issue_page (
  page_key,
  publication_key,
  issue_id,
  issue_number,
  page_number,
  page_role,
  title,
  subtitle,
  asset_id,
  dispatch_key,
  banner_asset_id,
  route_path,
  layout_profile_key,
  release_state,
  visibility_state,
  source_authority,
  metadata
) values
(
  'undrifted_launch_cycle_001_publication_001_field_findings',
  'undrifted',
  'undrifted_issue01',
  '001',
  7,
  'dispatches',
  'Field Findings 2026-W28',
  'Weekly observations from the Field, July 4-10, 2026.',
  'undrifted_field_findings_2026_w28',
  'launch_cycle_001__paragraph__publication_001',
  'field_findings_section_banner_2026_w28_v1',
  '/undrifted/field-findings-2026-w28',
  'undrifted_launch_cycle_001_article_projection_v1',
  'released',
  'visible',
  'measures_publication_registry',
  jsonb_build_object(
    'route_state', 'live',
    'source_oar2', 'docs/oar/measures_registry/oar2_publish_launch_cycle_001_articles_and_project_undrifted_release_v1.meta.md',
    'canonical_content', 'Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_field_findings_2026_w28_article_v1.md',
    'publication_record', 'docs/_source/codex/publications/publication_record_001_field_findings_2026_w28.meta.md',
    'paragraph_slug', 'field-findings-2026-w28',
    'publication_sequence', 1,
    'frontend_role', 'renderer',
    'authority_preserved', true
  )
),
(
  'undrifted_launch_cycle_001_publication_002_response_001',
  'undrifted',
  'undrifted_issue01',
  '001',
  8,
  'dispatches',
  'AI Agents Are Not Entering Empty Systems',
  'unDrifted Response 001.',
  'undrifted_response_001',
  'launch_cycle_001__paragraph__publication_002',
  'undrifted_response_section_banner_2026_w28_v1',
  '/undrifted/ai-agents-are-not-entering-empty-systems',
  'undrifted_launch_cycle_001_article_projection_v1',
  'released',
  'visible',
  'measures_publication_registry',
  jsonb_build_object(
    'route_state', 'live',
    'source_oar2', 'docs/oar/measures_registry/oar2_publish_launch_cycle_001_articles_and_project_undrifted_release_v1.meta.md',
    'canonical_content', 'Assets/Articles/unDrifted/LaunchCycle001/registered/undrifted_response_001_ai_agents_are_not_entering_empty_systems_article_v1.md',
    'publication_record', 'docs/_source/codex/publications/publication_record_002_undrifted_response_001.meta.md',
    'paragraph_slug', 'ai-agents-are-not-entering-empty-systems',
    'publication_sequence', 2,
    'depends_on_publication', 'publication_001',
    'depends_on_route_path', '/undrifted/field-findings-2026-w28',
    'frontend_role', 'renderer',
    'authority_preserved', true
  )
)
on conflict (page_key) do update
set
  title = excluded.title,
  subtitle = excluded.subtitle,
  asset_id = excluded.asset_id,
  dispatch_key = excluded.dispatch_key,
  banner_asset_id = excluded.banner_asset_id,
  route_path = excluded.route_path,
  layout_profile_key = excluded.layout_profile_key,
  release_state = excluded.release_state,
  visibility_state = excluded.visibility_state,
  source_authority = excluded.source_authority,
  metadata = public.measures_publication_issue_page.metadata || excluded.metadata,
  updated_at = now();
