-- Phase 1 + 2: Seat article_url and description (teaser) in featured_article_set.
-- Prior state: Agents With Keys had no article_url and publication_state=unpublished.
--              Fables and Myths had article_route only; renderer reads article_url.
-- Result: both cards link to their Paragraph articles and display seated teasers.
UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{featured_article_set}',
  '[
    {
      "title": "Agents With Keys",
      "media_role": "agents_with_keys_cover",
      "article_route": "/publication/structural_drift/agents_of_chaos_dispatch_v1",
      "article_url": "https://paragraph.com/@undrifted/agents-of-chaos",
      "description": "As AI systems gain access to credentials, APIs, operational workflows, and financial authority, the question is no longer what an agent can do. The question is who governs it.",
      "publication_state": "published"
    },
    {
      "title": "Fables and Myths",
      "media_role": "fables_and_myths_cover",
      "article_route": "/publication/structural_drift/fables_and_myths_dispatch_v1",
      "article_url": "https://paragraph.com/@undrifted/fables-and-myths",
      "description": "Most AI failures do not begin as technical failures. They begin as stories institutions tell themselves about control, certainty, accountability, and responsibility.",
      "publication_state": "published"
    }
  ]'::jsonb,
  true
)
WHERE registry_key = 'undrifted_publication_landing';
