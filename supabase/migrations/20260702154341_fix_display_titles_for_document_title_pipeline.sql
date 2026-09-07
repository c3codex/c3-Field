-- Seat correct display_title values so document.title resolves from DB only

UPDATE public.measures_encounter_def
SET display_title = 'AI Isn''t Broken... Systems Are', updated_at = now()
WHERE encounter_key IN ('ai_isnt_broken_intro', 'crystal_seat_intro');

-- Seat human-readable titles on marble internal surfaces
UPDATE public.measures_encounter_def
SET display_title = 'MAP Integrity Governance — Measures Registry', updated_at = now()
WHERE encounter_key = 'map_integrity_governance';

UPDATE public.measures_encounter_def
SET display_title = 'Assessment Findings — Measures Registry', updated_at = now()
WHERE encounter_key = 'marble_chamber_results';

UPDATE public.measures_encounter_def
SET display_title = 'AI Operations Assessment — Measures Registry', updated_at = now()
WHERE encounter_key = 'measures_assessment';

UPDATE public.measures_encounter_def
SET display_title = 'About Measures Registry', updated_at = now()
WHERE encounter_key = 'about_measures_registry';

UPDATE public.measures_encounter_def
SET display_title = 'unDrifted — Measures Registry', updated_at = now()
WHERE encounter_key = 'undrifted';

-- Validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND display_title = 'AI Isn''t Broken... Systems Are'
  ) THEN
    RAISE EXCEPTION 'Validation failed: ai_isnt_broken_intro display_title not updated';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'crystal_seat_intro'
      AND display_title = 'AI Isn''t Broken... Systems Are'
  ) THEN
    RAISE EXCEPTION 'Validation failed: crystal_seat_intro display_title not updated';
  END IF;
END $$;