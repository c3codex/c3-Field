-- Seat publication content slots for unDrifted Issue 001.
-- Activates render slots added in RegisteredStructuralDrift.tsx:
--   featured_article_set[*].feature_label → undrifted-eyebrow
--   featured_article_set[*].teaser        → undrifted-insight-teaser
--   assessment_feature.rating_display     → undrifted-assessment-rating
-- Source: docs/oar/undrifted/oar2_seat_undrifted_issue_001_publication_content_slots_v1.meta.md
-- No src mutation. No article records invented. No hardcoded frontend content.

-- =====================================================================
-- Part 1 — Seat feature_label and teaser on featured_article_set articles
-- =====================================================================
-- Uses merge pattern (article || jsonb_build_object) to preserve all
-- existing fields and add only the new slots.

UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{featured_article_set}',
  (
    SELECT jsonb_agg(
      article || CASE
        WHEN article->>'dispatch_key' = 'agents_with_keys_dispatch_v1' THEN
          jsonb_build_object(
            'feature_label', 'STRUCTURAL DRIFT',
            'teaser',        'As AI systems gain access to credentials, APIs, operational workflows, and financial authority, the question is no longer what an agent can do. The question is who governs it.'
          )
        WHEN article->>'dispatch_key' = 'fables_and_myths_dispatch_v1' THEN
          jsonb_build_object(
            'feature_label', 'SYSTEM GOVERNANCE',
            'teaser',        'Most AI failures do not begin as technical failures. They begin as stories institutions tell themselves about control, certainty, accountability, and responsibility.'
          )
        ELSE '{}'::jsonb
      END
      ORDER BY ordinal
    )
    FROM jsonb_array_elements(metadata->'featured_article_set')
      WITH ORDINALITY AS items(article, ordinal)
  ),
  true
),
updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

-- =====================================================================
-- Part 2 — Seat rating_display on assessment_feature
-- =====================================================================

UPDATE measures_registry
SET metadata = jsonb_set(
  metadata,
  '{assessment_feature,rating_display}',
  '"Issue 001 Recommended Assessment"',
  true
),
updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  -- Agents With Keys: feature_label and teaser seated
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'agents_with_keys_dispatch_v1'
      AND article->>'feature_label' = 'STRUCTURAL DRIFT'
      AND article->>'teaser' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: Agents With Keys feature_label or teaser not seated';
  END IF;

  -- Fables & Myths: feature_label and teaser seated
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'fables_and_myths_dispatch_v1'
      AND article->>'feature_label' = 'SYSTEM GOVERNANCE'
      AND article->>'teaser' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: Fables & Myths feature_label or teaser not seated';
  END IF;

  -- Assessment feature: rating_display seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'undrifted_publication_landing'
      AND metadata->'assessment_feature'->>'rating_display' = 'Issue 001 Recommended Assessment'
  ) THEN
    RAISE EXCEPTION 'Validation failed: assessment_feature rating_display not seated';
  END IF;

  -- Existing fields preserved: Agents With Keys title, description, publication_state
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'agents_with_keys_dispatch_v1'
      AND article->>'title' = 'Agents With Keys'
      AND article->>'description' = 'Capability is not authority. Structure prevents drift.'
      AND article->>'publication_state' = 'published'
  ) THEN
    RAISE EXCEPTION 'Validation failed: Agents With Keys existing fields not preserved';
  END IF;

  -- Existing fields preserved: Fables & Myths title, publication_state
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'fables_and_myths_dispatch_v1'
      AND article->>'title' = 'Fables & Myths'
      AND article->>'publication_state' = 'published'
  ) THEN
    RAISE EXCEPTION 'Validation failed: Fables & Myths existing fields not preserved';
  END IF;

  -- Assessment feature existing fields preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'undrifted_publication_landing'
      AND metadata->'assessment_feature'->>'feature_key' = 'assess_the_environment_editor_feature'
      AND metadata->'assessment_feature'->>'cta_label' = 'BEGIN ASSESSMENT →'
  ) THEN
    RAISE EXCEPTION 'Validation failed: assessment_feature existing fields not preserved';
  END IF;

END $$;
