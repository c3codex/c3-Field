-- Fix footer copyright year: 2025 → 2026
UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{footer_contract,copy_lines}',
  (
    SELECT jsonb_agg(
      CASE
        WHEN val::text LIKE '%2025%' THEN to_jsonb(replace(val::text, '2025', '2026'))
        ELSE val
      END
    )
    FROM jsonb_array_elements(metadata->'footer_contract'->'copy_lines') AS val
  ),
  false
),
updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro'
  AND metadata->'footer_contract'->'copy_lines' IS NOT NULL;

-- Seat CDN public_url on motion media rows (R2 bucket, no Supabase storage URL)
UPDATE public.measures_media_map
SET
  metadata = metadata || '{"public_url": "https://media.c3field.online/left_hero_fracture_motion.mp4"}'::jsonb,
  updated_at = now()
WHERE media_role = 'left_hero_fracture_motion'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

UPDATE public.measures_media_map
SET
  metadata = metadata || '{"public_url": "https://media.c3field.online/right_measured_hero_motion_graphic.mp4"}'::jsonb,
  updated_at = now()
WHERE media_role = 'measured_hero_motion_graphic'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

-- Validation
DO $$
DECLARE
  year_check text;
BEGIN
  SELECT metadata->'footer_contract'->'copy_lines'->>0
  INTO year_check
  FROM public.measures_encounter_def
  WHERE encounter_key = 'ai_isnt_broken_intro';

  IF year_check ILIKE '%2025%' THEN
    RAISE EXCEPTION 'Validation failed: year still 2025 in footer_contract';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_media_map
    WHERE media_role = 'left_hero_fracture_motion'
      AND metadata->>'public_url' ILIKE '%left_hero_fracture_motion%'
  ) THEN
    RAISE EXCEPTION 'Validation failed: left_hero_fracture_motion CDN URL not seated';
  END IF;
END $$;