-- OAR2: oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1
-- Syncs the real, API-returned Paragraph publication result for the Editor's Letter.
-- Publish was performed via scripts/publish-undrifted-dispatch-to-paragraph.cjs after
-- explicit operator confirmation; this migration only records what the API actually
-- returned (post id sDE8Tey2cLZ30wOP5BXb, live at paragraph.com/@undrifted/from-the-editor,
-- confirmed reachable) — no URL invented.

update measures_publication_dispatch
set
  status = 'published',
  article_url = 'https://paragraph.com/@undrifted/from-the-editor',
  external_url = 'https://paragraph.com/@undrifted/from-the-editor',
  external_platform = 'paragraph',
  published_at = to_timestamp(1783470759591 / 1000.0),
  metadata = metadata || jsonb_build_object(
    'paragraph_post_id', 'sDE8Tey2cLZ30wOP5BXb',
    'paragraph_publication_slug', 'undrifted',
    'paragraph_api_managed', true,
    'newsletter_sent', false
  )
where dispatch_key = 'editors_letter_issue001_v1';

update measures_publication_registry
set metadata = metadata || jsonb_build_object(
  'editors_letter', jsonb_build_object(
    'published', true,
    'dispatch_key', 'editors_letter_issue001_v1',
    'article_url', 'https://paragraph.com/@undrifted/from-the-editor',
    'published_at', '2026-07-08T00:52:39.591Z',
    'asset_id', 'undrifted_issue01_editors_letter_article_v1',
    'source_oar2', 'OAR/OAR2/publication/oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1.meta.md'
  )
)
where publication_key = 'undrifted';
