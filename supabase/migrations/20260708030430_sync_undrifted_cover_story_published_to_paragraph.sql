-- Syncs the real, API-returned Paragraph publication result for the cover story "AI Isn't
-- Broken. Systems Are." Publish performed via
-- scripts/publish-undrifted-dispatch-to-paragraph.cjs after explicit operator confirmation
-- (this pass succeeded after three prior 429 rate-limit rejections). Live at
-- paragraph.com/@undrifted/ai-isnt-broken-systems-are, confirmed reachable — no URL invented.

update measures_publication_dispatch
set
  status = 'published',
  article_url = 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  external_url = 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  external_platform = 'paragraph',
  external_slug = 'ai-isnt-broken-systems-are',
  published_at = to_timestamp(1783479795714 / 1000.0),
  metadata = metadata || jsonb_build_object(
    'paragraph_post_id', 'BPiFclLZstWOxVtNTeSm',
    'paragraph_publication_slug', 'undrifted',
    'paragraph_api_managed', true,
    'newsletter_sent', false
  )
where dispatch_key = 'ai_isnt_broken_systems_are_dispatch_v1';

update measures_publication_registry
set metadata = metadata || jsonb_build_object(
  'cover_story_publication', jsonb_build_object(
    'published', true,
    'dispatch_key', 'ai_isnt_broken_systems_are_dispatch_v1',
    'article_url', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
    'published_at', '2026-07-08T03:23:15.714Z',
    'asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'source_oar2', 'OAR/OAR2/publication/oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1.meta.md'
  )
)
where publication_key = 'undrifted';

update measures_publication_issue_page
set
  release_state = 'released',
  metadata = metadata || jsonb_build_object(
    'external_url', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
    'hold_reason', null
  )
where page_key = 'undrifted_issue01_page04_cover_story';
