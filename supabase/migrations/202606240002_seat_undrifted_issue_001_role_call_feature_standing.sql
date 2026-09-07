-- Seat Role Call feature standing for unDrifted Issue 001.
-- Resolves Route 9 held from oar2_seat_canonical_undrifted_issue_001_publication_record_v1.
-- Source authority: SEND.CARD — Role Call Standing Seated (2026-06-23)
--
-- Leadership Briefing: deprecated
-- Leadership Call: superseded
-- Role Call: canonical publication feature, Issue 001 sequence position 5
--
-- No frontend mutation. No src mutation. No rendering mutation.

-- =====================================================================
-- Seat Role Call feature standing in publication registry
-- =====================================================================

UPDATE measures_publication_registry
SET metadata = jsonb_set(
      jsonb_set(
        metadata,
        '{role_call_feature}',
        jsonb_build_object(
          'feature_key',        'role_call_issue_001',
          'feature_label',      'ROLE CALL',
          'feature_title',      'ALL POSITIONS AVAILABLE',
          'feature_tagline',    'WHAT IS YOURS?',
          'positions',          jsonb_build_array('Connect', 'Contribute', 'Create'),
          'cta_label',          'Connect · Contribute · Create →',
          'destination_key',    'c3_field_our_story',
          'destination_label',  'Our Story',
          'function',           'live invitation',
          'implies_employment',        false,
          'implies_membership',        false,
          'implies_consultation',      false,
          'implies_certification',     false,
          'implies_partnership',       false,
          'implies_assessment',        false,
          'implies_map',               false,
          'implies_seat',              false,
          'implies_conversion',        false,
          'participation_standing',    'undetermined_until_encountered',
          'supersedes',         jsonb_build_array('leadership_briefing', 'leadership_call'),
          'source_authority',   'SEND.CARD — Role Call Standing Seated — Issue 001 Launch Edition'
        ),
        true
      ),
      '{issue_record,section_sequence}',
      jsonb_build_array(
        'cover_story',
        'assessment_feature',
        'agents_with_keys',
        'fables_and_myths',
        'role_call',
        'next_issue'
      ),
      true
    ),
    updated_at = now()
WHERE publication_key = 'undrifted';

-- =====================================================================
-- Seat Role Call feature in landing record
-- =====================================================================

UPDATE measures_registry
SET metadata = jsonb_set(
      metadata,
      '{role_call_feature}',
      jsonb_build_object(
        'feature_key',       'role_call_issue_001',
        'feature_label',     'ROLE CALL',
        'feature_title',     'ALL POSITIONS AVAILABLE',
        'feature_tagline',   'WHAT IS YOURS?',
        'positions',         jsonb_build_array('Connect', 'Contribute', 'Create'),
        'cta_label',         'Connect · Contribute · Create →',
        'destination_key',   'c3_field_our_story',
        'destination_label', 'Our Story',
        'function',          'live invitation',
        'source_authority',  'SEND.CARD — Role Call Standing Seated — Issue 001 Launch Edition'
      ),
      true
    ),
    updated_at = now()
WHERE registry_key = 'undrifted_publication_landing';

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM measures_publication_registry
    WHERE publication_key = 'undrifted'
      AND metadata->'role_call_feature'->>'feature_key' = 'role_call_issue_001'
      AND metadata->'role_call_feature'->>'cta_label' = 'Connect · Contribute · Create →'
      AND metadata->'role_call_feature'->>'destination_key' = 'c3_field_our_story'
      AND (metadata->'role_call_feature'->>'implies_conversion')::boolean = false
      AND metadata->'issue_record'->'section_sequence' @> '["role_call"]'::jsonb
  ) THEN
    RAISE EXCEPTION 'Role Call validation failed: feature not seated in publication registry';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'undrifted_publication_landing'
      AND metadata->'role_call_feature'->>'feature_key' = 'role_call_issue_001'
      AND metadata->'role_call_feature'->>'destination_key' = 'c3_field_our_story'
  ) THEN
    RAISE EXCEPTION 'Role Call validation failed: feature not seated in landing record';
  END IF;
END $$;
