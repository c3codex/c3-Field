-- Two repairs for public launch QA.
-- OAR2: oar2_repair_intro_passage_video_scroll_footer_and_report_copy_v1
--
-- 1. Seat exact_url_seated on passage video media row.
--    Bypasses VITE_R2_PUBLIC_BASE_URL env var dependency in production.
--    resolveRuntimeMediaUrl uses publicUrl path when exact_url_seated is present in metadata.
--
-- 2. Seat footer_contract in ai_isnt_broken_intro encounter def.
--    renderSystemFooter() reads footer_contract.copy_lines from the active surface
--    encounter def OR ai_isnt_broken_intro (fallback). Seats copyright, branch statement,
--    and governed-site explanation. Privacy/Terms/Contact links are wired in source.

-- 1. Seat exact_url_seated on passage video media row
UPDATE measures_media_map
SET
  metadata = jsonb_set(
    metadata,
    '{exact_url_seated}',
    '"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"'::jsonb,
    true
  ),
  updated_at = now()
WHERE media_role = 'before_the_pathway_obsidian_to_marble_passage_video'
  AND is_active = true;

-- 2. Seat footer_contract in ai_isnt_broken_intro encounter def
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{footer_contract}',
  '{
    "copy_lines": [
      "© 2025 C3 Community Partners DAO LLC. All rights reserved.",
      "Measures Registry is a registered branch operating under c3 Community Partners DAO LLC / c3 Field authority.",
      "Measures Registry is a governed encounter, not a conventional website. Public pathways, assessments, publications, legal notices, media, and transitions are seated through registry standing before release."
    ]
  }'::jsonb,
  true
)
WHERE encounter_key = 'ai_isnt_broken_intro';

-- Validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM measures_media_map
    WHERE media_role = 'before_the_pathway_obsidian_to_marble_passage_video'
      AND is_active = true
      AND metadata ->> 'exact_url_seated' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: exact_url_seated not seated on passage video media row';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND metadata #> '{footer_contract,copy_lines}' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: footer_contract.copy_lines not seated in ai_isnt_broken_intro';
  END IF;
END $$;
