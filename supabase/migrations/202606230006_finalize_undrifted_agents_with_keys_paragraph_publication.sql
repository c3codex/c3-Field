-- Finalize DB truth from the successful Paragraph publication response.
-- Paragraph post: 1iTDNlKWqWFOm0zkMgtS
-- URL: https://paragraph.com/@undrifted/agents-with-keys

UPDATE public.measures_publication_dispatch
SET external_url = 'https://paragraph.com/@undrifted/agents-with-keys',
    article_url = 'https://paragraph.com/@undrifted/agents-with-keys',
    status = 'published',
    published_at = '2026-06-23T15:36:26.413Z'::timestamptz,
    metadata = metadata || jsonb_build_object(
      'publish_state', 'published_to_paragraph',
      'paragraph_publish_state', 'published_via_cli',
      'paragraph_url', 'https://paragraph.com/@undrifted/agents-with-keys',
      'paragraph_post_id', '1iTDNlKWqWFOm0zkMgtS',
      'paragraph_draft_id', '1iTDNlKWqWFOm0zkMgtS',
      'paragraph_published_at', '2026-06-23T15:36:26.413Z',
      'approval_state', 'operator_authorized_by_oar2',
      'newsletter_sent', false
    ),
    updated_at = now()
WHERE dispatch_key = 'agents_with_keys_dispatch_v1';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{featured_article_set}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN article ->> 'title' = 'Agents With Keys' THEN
          (article - 'article_route' - 'external_url') ||
          jsonb_build_object(
            'article_url', 'https://paragraph.com/@undrifted/agents-with-keys',
            'publication_state', 'published',
            'dispatch_key', 'agents_with_keys_dispatch_v1'
          )
        ELSE article
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(metadata -> 'featured_article_set') WITH ORDINALITY AS items(article, ordinal)
  ),
  false
), updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{undrifted_contract,featured_articles}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN article ->> 'title' = 'Agents With Keys' THEN
          article || jsonb_build_object(
            'publication_state', 'published',
            'dispatch_key', 'agents_with_keys_dispatch_v1',
            'article_url', 'https://paragraph.com/@undrifted/agents-with-keys'
          )
        ELSE article
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(metadata #> '{undrifted_contract,featured_articles}') WITH ORDINALITY AS items(article, ordinal)
  ),
  false
), updated_at = now()
WHERE registry_key = 'measures_registry_root';

UPDATE public.measures_media_map
SET metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'publication_state', 'published',
  'dispatch_key', 'agents_with_keys_dispatch_v1',
  'article_url', 'https://paragraph.com/@undrifted/agents-with-keys',
  'paragraph_post_id', '1iTDNlKWqWFOm0zkMgtS'
), updated_at = now()
WHERE media_role = 'agents_with_keys_cover'
  AND is_active = true;

UPDATE public.measures_publication_registry
SET metadata = jsonb_set(
  metadata,
  '{paragraph_api_publishing_contract,api_execution_result}',
  jsonb_build_object(
    'source_oar2', 'docs/oar/measures_registry/oar2_register_and_publish_undrifted_agents_with_keys_article_v1.meta.md',
    'dispatch_key', 'agents_with_keys_dispatch_v1',
    'draft_attempted', true,
    'publish_attempted', true,
    'publish_succeeded', true,
    'newsletter_sent', false,
    'paragraph_post_id', '1iTDNlKWqWFOm0zkMgtS',
    'paragraph_draft_id', '1iTDNlKWqWFOm0zkMgtS',
    'paragraph_url', 'https://paragraph.com/@undrifted/agents-with-keys',
    'published_at', '2026-06-23T15:36:26.413Z'
  ),
  true
), updated_at = now()
WHERE publication_key = 'undrifted';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_publication_dispatch
    WHERE dispatch_key = 'agents_with_keys_dispatch_v1'
      AND publication_key = 'undrifted'
      AND title = 'Agents With Keys'
      AND status = 'published'
      AND external_slug = 'agents-with-keys'
      AND external_url = 'https://paragraph.com/@undrifted/agents-with-keys'
      AND article_url = 'https://paragraph.com/@undrifted/agents-with-keys'
      AND internal_route IS NULL
      AND metadata ->> 'paragraph_post_id' = '1iTDNlKWqWFOm0zkMgtS'
      AND metadata ->> 'cover_media_role' = 'agents_with_keys_cover'
      AND metadata ->> 'cta_route' = '/ai-operations-assessment'
  ) THEN
    RAISE EXCEPTION 'Agents With Keys publication finalization failed';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.measures_registry,
         jsonb_array_elements(metadata -> 'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article ->> 'title' = 'Agents With Keys'
      AND article ->> 'publication_state' = 'published'
      AND article ->> 'article_url' = 'https://paragraph.com/@undrifted/agents-with-keys'
      AND article ->> 'dispatch_key' = 'agents_with_keys_dispatch_v1'
  ) THEN
    RAISE EXCEPTION 'Agents With Keys landing publication finalization failed';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_media_map
    WHERE media_role = 'agents_with_keys_cover'
      AND storage_bucket = 'measures-registry'
      AND storage_path = 'agents_with_keys.webp'
      AND is_active = true
      AND metadata ->> 'publication_state' = 'published'
      AND metadata ->> 'paragraph_post_id' = '1iTDNlKWqWFOm0zkMgtS'
  ) THEN
    RAISE EXCEPTION 'Agents With Keys published cover binding validation failed';
  END IF;
END $$;
