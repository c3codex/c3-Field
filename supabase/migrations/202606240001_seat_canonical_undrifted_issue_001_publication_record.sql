-- Seat canonical unDrifted Issue 001 publication record.
-- Source: docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md
--
-- Routes 1–11. Route 9 held — no leadership route seated in DB.
-- Route 7 contradiction noted: agents_with_keys_dispatch_v1 is already
--   status=published (not ready_to_publish). Operator notified in OAR1.
--   Publication state preserved; feature standing updated only.
-- No frontend mutation. No src mutation. No rendering mutation.

-- =====================================================================
-- ROUTE 1 — Publication Record: update type + seat Issue 001 record
-- =====================================================================

UPDATE measures_publication_registry
SET publication_type = 'digital magazine',
    metadata = jsonb_set(
      metadata,
      '{issue_record}',
      jsonb_build_object(
        'issue_key',         'undrifted_issue_001_launch_edition',
        'issue_number',      '001',
        'issue_date',        'June 2026',
        'edition',           'Launch Edition',
        'release_state',     'released',
        'access_state',      'visible',
        'publication_key',   'undrifted',
        'publication_title', 'unDrifted',
        'publication_type',  'digital magazine',
        'surface_route',     '/undrifted',
        'source_oar2',       'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 2 — Style Profile: seat Issue 001 magazine cover style profile
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      metadata,
      '{style_profile}',
      jsonb_build_object(
        'style_profile_key', 'undrifted_issue_001_magazine_cover_profile',
        'surface_type',      'digital magazine front page',
        'energy',            'hot-off-the-press editorial',
        'background',        'black / obsidian',
        'accents',           jsonb_build_array('electric blue', 'codex gold'),
        'headline_treatment', 'large editorial masthead, serif cover headlines',
        'grid',              'tight magazine grid with thin rule lines',
        'modules',           jsonb_build_array('cover-story modules', 'article art visible'),
        'tone',              'premium AI systems publication',
        'avoid',             jsonb_build_array(
          'website layout', 'landing page structure', 'SaaS homepage style',
          'Measures Registry header branding', 'generic card grid', 'video hero',
          'bland footer panels', 'button-heavy CTA stack'
        ),
        'source_oar2', 'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 4 — Media Profile: seat static editorial media profile
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      metadata,
      '{media_profile}',
      jsonb_build_object(
        'media_profile_key',      'undrifted_issue_001_static_cover_media_profile',
        'hero_standing',          'static image primary',
        'video_hero',             false,
        'autoplay_hero',          false,
        'embedded_video_hero',    false,
        'hero_media_role',        'ai_isnt_broken_landing',
        'article_art_roles',      jsonb_build_array('agents_with_keys_cover', 'fables_and_myths_cover'),
        'hardcoded_bucket_urls',  false,
        'source_authority',       'measures_media_map',
        'source_oar2',            'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 5 — Measures Registry Cover Story Standing
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      metadata,
      '{cover_story}',
      jsonb_build_object(
        'feature_key',        'measures_registry_launch_cover_story',
        'feature_type',       'cover_story',
        'feature_title',      'Measures Registry',
        'feature_headline',   'AI ISN''T BROKEN. SYSTEMS ARE.',
        'feature_deck',       'Measures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.',
        'feature_positioning','THE STANDARD FOR AI SYSTEMS GOVERNANCE.',
        'brand_relationship', 'featured_story_not_publication_owner',
        'source_oar2',        'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 10 — Next Issue Teaser
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      metadata,
      '{next_issue_teaser}',
      jsonb_build_object(
        'feature_key',    'next_issue_from_assessment_to_action',
        'feature_label',  'NEXT ISSUE',
        'feature_title',  'FROM ASSESSMENT TO ACTION',
        'feature_body',   'What happens after drift is detected? Implementation pathways. Operational alignment. Governed correction.',
        'release_hint',   'COMING JULY 2026',
        'source_oar2',    'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 11 — Footer Record
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      metadata,
      '{footer_record}',
      jsonb_build_object(
        'footer_key',    'undrifted_issue_001_minimal_footer',
        'footer_line_1', 'MEASURE. DETECT. CORRECT. GOVERN.',
        'footer_line_2', 'COHERENCE IS NOT ASSUMED. IT IS MAINTAINED.',
        'source_oar2',   'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- ROUTE 3 — Content Profile + correct stale edition_marker
-- =====================================================================

UPDATE measures_registry
SET metadata = jsonb_set(
      jsonb_set(
        jsonb_set(
          metadata,
          '{content_profile}',
          jsonb_build_object(
            'content_profile_key', 'undrifted_issue_001_launch_content_profile',
            'masthead',            'unDrifted',
            'tagline',             'THE PUBLICATION FOR GOVERNED SYSTEM ENVIRONMENTS',
            'edition_line',        'ISSUE 001 • JUNE 2026 • LAUNCH EDITION',
            'rhythm_line',         'MEASURE • DETECT • CORRECT • GOVERN',
            'primary_headline',    'AI ISN''T BROKEN. SYSTEMS ARE.',
            'cover_story_deck',    'Measures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.',
            'positioning_line',    'THE STANDARD FOR AI SYSTEMS GOVERNANCE.',
            'core_distinction',    'We do not govern AI. We govern the systems that produce AI outcomes.',
            'source_oar2',         'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
          ),
          true
        ),
        '{landing_design_contract,edition_marker}',
        '"ISSUE 001 • JUNE 2026 • LAUNCH EDITION"',
        true
      ),
      '{landing_design_contract,hero,cover_eyebrow}',
      '"ISSUE 001 • JUNE 2026 • LAUNCH EDITION"',
      true
    ),
    updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

-- =====================================================================
-- ROUTE 6 — Assessment Feature Standing (editor's feature)
-- =====================================================================

UPDATE measures_registry
SET metadata = jsonb_set(
      metadata,
      '{assessment_feature}',
      jsonb_build_object(
        'feature_key',   'assess_the_environment_editor_feature',
        'feature_label', 'EDITOR''S FEATURE',
        'feature_title', 'ASSESS THE ENVIRONMENT',
        'feature_body',  'A public evaluation revealing structural drift, operational misalignment, authority gaps, and governance risk.',
        'cta_label',     'BEGIN ASSESSMENT →',
        'route_path',    '/ai-operations-assessment',
        'source_oar2',   'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
      ),
      true
    ),
    updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

-- =====================================================================
-- ROUTE 7 — Agents With Keys: update feature teaser only
-- NOTE: publication_state is already 'published' — preserving.
--       OAR2 planned 'ready_to_publish'. Contradiction reported in OAR1.
-- =====================================================================

UPDATE measures_registry
SET metadata = jsonb_set(
      metadata,
      '{featured_article_set}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN article->>'dispatch_key' = 'agents_with_keys_dispatch_v1'
              OR article->>'title' = 'Agents With Keys' THEN
              article
              - 'article_route'
              || jsonb_build_object(
                   'title',             'Agents With Keys',
                   'subtitle',          'Systems Without Governance',
                   'media_role',        'agents_with_keys_cover',
                   'article_url',       'https://paragraph.com/@undrifted/agents-with-keys',
                   'description',       'Capability is not authority. Structure prevents drift.',
                   'dispatch_key',      'agents_with_keys_dispatch_v1',
                   'publication_state', 'published'
                 )
            ELSE article
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

-- Seat feature standing on the dispatch record
UPDATE measures_publication_dispatch
SET metadata = metadata || jsonb_build_object(
      'feature_teaser',   'Capability is not authority. Structure prevents drift.',
      'issue_standing',   'Issue 001 feature',
      'feature_label',    'FEATURE ARTICLE',
      'cover_media_role', 'agents_with_keys_cover',
      'source_oar2',      'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md'
    ),
    updated_at = now()
WHERE dispatch_key = 'agents_with_keys_dispatch_v1';

-- =====================================================================
-- ROUTE 8 — Fables & Myths: seat dispatch record + update landing
-- =====================================================================

INSERT INTO measures_publication_dispatch (
  publication_key,
  dispatch_key,
  title,
  dispatch_body,
  excerpt,
  seo_description,
  tags,
  primary_cta,
  secondary_cta,
  "references",
  media_manifest,
  internal_route,
  external_platform,
  external_slug,
  external_url,
  status,
  published_at,
  metadata,
  issue_number,
  article_url,
  updated_at
)
VALUES (
  'undrifted',
  'fables_and_myths_dispatch_v1',
  'Fables & Myths',
  $article$
# Fables & Myths

Anthropic, Fables 5, Mythos 5, and the U.S. government.

When institutions narrate capability as control, systems drift becomes policy risk.

The story begins before the model ships.

It begins in the language institutions use to describe what AI can do, what it understands, what it controls, and what remains under human authority. When that language is imprecise — when narrative fills the gap where governance should be — the institution has already drifted.

Fables and myths are not failures of intelligence.

They are failures of system design that capability language makes hard to see.

An institution that narrates AI as inherently safe, inherently aligned, or inherently bounded does not produce safety, alignment, or bounded behavior. It produces a story in which those properties are assumed rather than governed.

The risk does not begin with a model failure.

It begins with the institutional story that prevented the failure from being visible.

That is the pattern this dispatch documents.

Not the collapse.

The narrative architecture that made drift invisible until it became public.

Structural drift is detectable.

Collapse is not the default.

[Read the full dispatch on Paragraph](https://paragraph.com/@undrifted/fables-and-myths)
  $article$,
  'When institutions narrate capability as control, systems drift becomes policy risk.',
  'Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.',
  '[]'::jsonb,
  'Read the Dispatch',
  'Begin where drift becomes visible.',
  '[]'::jsonb,
  jsonb_build_object(
    'cover_media_role',  'fables_and_myths_cover',
    'storage_bucket',    'measures-registry',
    'storage_path',      'fables_and_myths.webp'
  ),
  NULL,
  'paragraph',
  'fables-and-myths',
  'https://paragraph.com/@undrifted/fables-and-myths',
  'published',
  '2026-06-23T00:00:00.000Z'::timestamptz,
  jsonb_build_object(
    'source_oar2',            'docs/oar/measures_registry/oar2_seat_canonical_undrifted_issue_001_publication_record_v1.meta.md',
    'feature_teaser',         'Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.',
    'issue_standing',         'Issue 001 feature',
    'feature_label',          'FEATURE ARTICLE',
    'subtitle',               'Institutional Narrative and Policy Risk',
    'cover_media_role',       'fables_and_myths_cover',
    'publish_state',          'published',
    'approval_state',         'operator_authorized_by_oar2',
    'paragraph_api_managed',  true,
    'paragraph_publication_id', 'leouxPnZrCGqMYqnboYx',
    'paragraph_publication_slug', 'undrifted',
    'paragraph_url',          'https://paragraph.com/@undrifted/fables-and-myths',
    'sync_direction',         'DB_to_Paragraph'
  ),
  '001',
  'https://paragraph.com/@undrifted/fables-and-myths',
  now()
)
ON CONFLICT (dispatch_key) DO UPDATE SET
  publication_key   = EXCLUDED.publication_key,
  title             = EXCLUDED.title,
  dispatch_body     = EXCLUDED.dispatch_body,
  excerpt           = EXCLUDED.excerpt,
  seo_description   = EXCLUDED.seo_description,
  tags              = EXCLUDED.tags,
  primary_cta       = EXCLUDED.primary_cta,
  secondary_cta     = EXCLUDED.secondary_cta,
  "references"      = EXCLUDED."references",
  media_manifest    = EXCLUDED.media_manifest,
  external_platform = EXCLUDED.external_platform,
  external_slug     = EXCLUDED.external_slug,
  external_url      = EXCLUDED.external_url,
  status            = EXCLUDED.status,
  published_at      = EXCLUDED.published_at,
  metadata          = EXCLUDED.metadata,
  issue_number      = EXCLUDED.issue_number,
  article_url       = EXCLUDED.article_url,
  updated_at        = now();

-- Update Fables & Myths entry in featured_article_set
UPDATE measures_registry
SET metadata = jsonb_set(
      metadata,
      '{featured_article_set}',
      (
        SELECT jsonb_agg(
          CASE
            WHEN article->>'title' IN ('Fables and Myths', 'Fables & Myths') THEN
              jsonb_build_object(
                'title',             'Fables & Myths',
                'subtitle',          'Institutional Narrative and Policy Risk',
                'media_role',        'fables_and_myths_cover',
                'article_url',       'https://paragraph.com/@undrifted/fables-and-myths',
                'description',       'Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.',
                'dispatch_key',      'fables_and_myths_dispatch_v1',
                'publication_state', 'published'
              )
            ELSE article
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
-- ROUTE 9 — Leadership Feature Standing: HELD
-- No leadership route seated in DB. Operator must seat route before
-- this route can be executed. No mutation applied.
-- =====================================================================

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  -- Route 1: publication type updated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND publication_type = 'digital magazine'
      AND metadata ? 'issue_record'
      AND metadata->'issue_record'->>'issue_key' = 'undrifted_issue_001_launch_edition'
      AND metadata->'issue_record'->>'release_state' = 'released'
  ) THEN
    RAISE EXCEPTION 'Route 1 validation failed: issue_record not seated';
  END IF;

  -- Route 2: style profile seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'style_profile'->>'style_profile_key' = 'undrifted_issue_001_magazine_cover_profile'
  ) THEN
    RAISE EXCEPTION 'Route 2 validation failed: style_profile not seated';
  END IF;

  -- Route 4: media profile seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'media_profile'->>'media_profile_key' = 'undrifted_issue_001_static_cover_media_profile'
      AND metadata->'media_profile'->>'hero_media_role' = 'ai_isnt_broken_landing'
  ) THEN
    RAISE EXCEPTION 'Route 4 validation failed: media_profile not seated';
  END IF;

  -- Route 5: cover story seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'cover_story'->>'feature_key' = 'measures_registry_launch_cover_story'
      AND metadata->'cover_story'->>'brand_relationship' = 'featured_story_not_publication_owner'
  ) THEN
    RAISE EXCEPTION 'Route 5 validation failed: cover_story not seated';
  END IF;

  -- Route 3: content profile seated, edition_marker corrected
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'undrifted_publication_landing'
      AND metadata ? 'content_profile'
      AND metadata->'content_profile'->>'content_profile_key' = 'undrifted_issue_001_launch_content_profile'
      AND metadata->'landing_design_contract'->>'edition_marker' = 'ISSUE 001 • JUNE 2026 • LAUNCH EDITION'
  ) THEN
    RAISE EXCEPTION 'Route 3 validation failed: content_profile or edition_marker not seated';
  END IF;

  -- Route 6: assessment feature seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'undrifted_publication_landing'
      AND metadata->'assessment_feature'->>'feature_key' = 'assess_the_environment_editor_feature'
  ) THEN
    RAISE EXCEPTION 'Route 6 validation failed: assessment_feature not seated';
  END IF;

  -- Route 7: Agents With Keys teaser updated, distinct from Agents of Chaos
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'agents_with_keys_dispatch_v1'
      AND article->>'description' = 'Capability is not authority. Structure prevents drift.'
      AND article->>'publication_state' = 'published'
  ) THEN
    RAISE EXCEPTION 'Route 7 validation failed: Agents With Keys teaser not updated';
  END IF;

  -- Route 8: Fables & Myths dispatch record seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_dispatch
    WHERE dispatch_key = 'fables_and_myths_dispatch_v1'
      AND publication_key = 'undrifted'
      AND title = 'Fables & Myths'
      AND status = 'published'
      AND metadata->>'cover_media_role' = 'fables_and_myths_cover'
      AND metadata->>'issue_standing' = 'Issue 001 feature'
  ) THEN
    RAISE EXCEPTION 'Route 8 validation failed: fables_and_myths_dispatch_v1 not seated';
  END IF;

  -- Route 8: Fables & Myths landing entry updated with named-subject teaser
  IF NOT EXISTS (
    SELECT 1
    FROM measures_registry,
         jsonb_array_elements(metadata->'featured_article_set') AS article
    WHERE registry_key = 'undrifted_publication_landing'
      AND article->>'dispatch_key' = 'fables_and_myths_dispatch_v1'
      AND article->>'title' = 'Fables & Myths'
      AND article->>'publication_state' = 'published'
  ) THEN
    RAISE EXCEPTION 'Route 8 validation failed: Fables & Myths landing entry not updated';
  END IF;

  -- Route 10: next issue teaser seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'next_issue_teaser'->>'feature_key' = 'next_issue_from_assessment_to_action'
  ) THEN
    RAISE EXCEPTION 'Route 10 validation failed: next_issue_teaser not seated';
  END IF;

  -- Route 11: footer record seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'footer_record'->>'footer_key' = 'undrifted_issue_001_minimal_footer'
  ) THEN
    RAISE EXCEPTION 'Route 11 validation failed: footer_record not seated';
  END IF;

END $$;
