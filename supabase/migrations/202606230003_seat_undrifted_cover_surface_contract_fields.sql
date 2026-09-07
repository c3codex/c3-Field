-- Seat DB-driven content fields for the unDrifted cover surface restructure.
-- Eliminates all hardcoded frontend strings introduced in the surface rebuild.
-- Adds four new fields to existing JSON contract records:
--   landing_design_contract.hero.cover_eyebrow
--   landing_design_contract.hero.assessment_body
--   landing_design_contract.edition_marker
--   landing_design_contract.cover_lines_label
--   brand_copy.principles_line (on publication registry)

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        metadata,
        '{landing_design_contract,hero,cover_eyebrow}',
        '"Structural Drift · Launch Edition"',
        true
      ),
      '{landing_design_contract,hero,assessment_body}',
      '"Begin where drift becomes visible. This assessment reveals structural gaps, operational misalignments, and governance risks across your AI environment."',
      true
    ),
    '{landing_design_contract,edition_marker}',
    '"Issue 001 · Launch Edition · Published by Measures Registry"',
    true
  ),
  '{landing_design_contract,cover_lines_label}',
  '"In This Issue"',
  true
)
WHERE registry_key = 'undrifted_publication_landing';

UPDATE measures_publication_registry
SET metadata = jsonb_set(
  metadata,
  '{brand_copy,principles_line}',
  '"Measure · Detect · Correct · Govern"',
  true
)
WHERE publication_key = 'undrifted';
