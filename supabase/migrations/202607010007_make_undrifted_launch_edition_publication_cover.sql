-- OAR2: Make unDrifted Launch Edition Publication Cover
-- Source: docs/oar/measures_registry/oar2_make_undrifted_launch_edition_publication_cover_v1.meta.md
--
-- STEP 1: Insert undrifted_publication_masthead media row
--   Bucket: measures-registry / file: undrifted_publication_masthead.webp
--   Role consumed by LapisChamberRenderer masthead (priority over undrifted_fill / ai_isnt_broken_landing)
--
-- STEP 2: Update measures_encounter_def for encounter_key = 'undrifted'
--   - brand_copy: principles_line → DETECT • MEASURE • CORRECT • GOVERN; add descriptor_line
--   - issue_record: issue_date → JULY 2026; add publisher + branch_standing
--   - assessment_feature: stronger callout copy per OAR2
--   - role_call_feature: seat preferred copy (Systems are built by people. / What role will you play?)
--
-- STEP 3: Add persistent_mark to surface assignment metadata
--   Surfaces: crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter
--   Mark routes to /undrifted (publication return, not browser back)
--
-- No scoring, payment, passage, antechamber, or social automation changes.

-- ─── STEP 1: undrifted_publication_masthead media row ────────────────────────

INSERT INTO public.measures_media_map (
  campaign_key,
  registry_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  is_active,
  sort_order,
  metadata,
  updated_at
) VALUES (
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'undrifted_publication_masthead',
  'measures-registry',
  'undrifted_publication_masthead.webp',
  'image/webp',
  true,
  30,
  jsonb_build_object(
    'surface_role', 'lapis_chamber_encounter',
    'storage_provider', 'supabase_storage',
    'note', 'Primary masthead for unDrifted Issue 001 launch edition cover'
  ),
  now()
)
ON CONFLICT DO NOTHING;

-- ─── STEP 2a: brand_copy — principles line + descriptor ──────────────────────

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{brand_copy,principles_line}',
      '"DETECT • MEASURE • CORRECT • GOVERN"'::jsonb,
      true
    ),
    '{brand_copy,descriptor_line}',
    '"Integrity Governance for AI-Accelerated Systems"'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'undrifted';

-- ─── STEP 2b: issue_record — date, publisher, branch standing ────────────────

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    jsonb_set(
      jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{issue_record,issue_date}',
        '"JULY 2026"'::jsonb,
        true
      ),
      '{issue_record,publisher}',
      '"Published by Measures Registry"'::jsonb,
      true
    ),
    '{issue_record,branch_standing}',
    '"A Registered Branch of the c3 Field"'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'undrifted';

-- ─── STEP 2c: assessment_feature — full OAR2 callout ────────────────────────

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{assessment_feature}',
    jsonb_build_object(
      'feature_label',    'AI OPERATIONS ASSESSMENT',
      'feature_title',    'AI OPERATIONS ASSESSMENT',
      'feature_body',     'Structural drift is detectable.',
      'rating_display',   '7 Questions · 2 Minutes · Governed Findings',
      'cta_label',        'ASSESS THE ENVIRONMENT',
      'route_path',       '/ai-operations-assessment',
      'source_oar2',      'docs/oar/measures_registry/oar2_make_undrifted_launch_edition_publication_cover_v1.meta.md'
    ),
    true
  ),
  updated_at = now()
WHERE encounter_key = 'undrifted';

-- ─── STEP 2d: role_call_feature — preferred copy ─────────────────────────────

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{role_call_feature,feature_title}',
      '"Systems are built by people."'::jsonb,
      true
    ),
    '{role_call_feature,feature_tagline}',
    '"What role will you play?"'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'undrifted';

-- ─── STEP 3: persistent_mark on selected Crystal surface assignments ──────────

UPDATE public.measures_encounter_surface_assignment
SET
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{persistent_mark}',
    jsonb_build_object(
      'label',       'unDrifted',
      'issue_label', 'Issue 001 · July 2026',
      'route_path',  '/undrifted',
      'source_oar2', 'docs/oar/measures_registry/oar2_make_undrifted_launch_edition_publication_cover_v1.meta.md'
    ),
    true
  ),
  updated_at = now()
WHERE surface_key IN (
  'crystal_seat_threshold',
  'crystal_seat_orientation',
  'crystal_seat_encounter'
);

-- ─── VALIDATION ──────────────────────────────────────────────────────────────

DO $$
BEGIN
  -- Step 1: media row present
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_media_map
    WHERE media_role = 'undrifted_publication_masthead'
      AND storage_bucket = 'measures-registry'
      AND storage_path = 'undrifted_publication_masthead.webp'
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Step 1 failed: undrifted_publication_masthead media row not seated';
  END IF;

  -- Step 2a: brand_copy updated
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'undrifted'
      AND metadata->'brand_copy'->>'principles_line' = 'DETECT • MEASURE • CORRECT • GOVERN'
      AND metadata->'brand_copy'->>'descriptor_line' = 'Integrity Governance for AI-Accelerated Systems'
  ) THEN
    RAISE EXCEPTION 'Step 2a failed: brand_copy not updated on undrifted encounter def';
  END IF;

  -- Step 2b: issue_record updated
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'undrifted'
      AND metadata->'issue_record'->>'issue_date' = 'JULY 2026'
      AND metadata->'issue_record'->>'publisher' = 'Published by Measures Registry'
      AND metadata->'issue_record'->>'branch_standing' = 'A Registered Branch of the c3 Field'
  ) THEN
    RAISE EXCEPTION 'Step 2b failed: issue_record not updated on undrifted encounter def';
  END IF;

  -- Step 2c: assessment_feature updated
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'undrifted'
      AND metadata->'assessment_feature'->>'feature_label' = 'AI OPERATIONS ASSESSMENT'
      AND metadata->'assessment_feature'->>'cta_label' = 'ASSESS THE ENVIRONMENT'
      AND metadata->'assessment_feature'->>'rating_display' = '7 Questions · 2 Minutes · Governed Findings'
  ) THEN
    RAISE EXCEPTION 'Step 2c failed: assessment_feature not updated on undrifted encounter def';
  END IF;

  -- Step 2d: role_call_feature updated
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'undrifted'
      AND metadata->'role_call_feature'->>'feature_title' = 'Systems are built by people.'
      AND metadata->'role_call_feature'->>'feature_tagline' = 'What role will you play?'
  ) THEN
    RAISE EXCEPTION 'Step 2d failed: role_call_feature not updated on undrifted encounter def';
  END IF;

  -- Step 3: persistent_mark on all 3 crystal surfaces
  IF (
    SELECT COUNT(*) FROM public.measures_encounter_surface_assignment
    WHERE surface_key IN ('crystal_seat_threshold', 'crystal_seat_orientation', 'crystal_seat_encounter')
      AND metadata->'persistent_mark'->>'label' = 'unDrifted'
      AND metadata->'persistent_mark'->>'route_path' = '/undrifted'
  ) < 3 THEN
    RAISE EXCEPTION 'Step 3 failed: persistent_mark not seated on all 3 crystal surfaces';
  END IF;

END $$;
