-- Reseat crystal_seat_intro: ai_isnt_broken_intro.mp4, headline copy
-- Retire stale intro_hook.mp4 row. Point intro_hook_video to correct L2 URL.

UPDATE public.measures_media_map
SET
  storage_path = 'ai_isnt_broken_intro.mp4',
  metadata = metadata || '{"public_url": "https://media.c3field.online/ai_isnt_broken_intro.mp4", "storage_tier": "L2"}'::jsonb,
  updated_at = now()
WHERE media_role = 'intro_hook_video';

-- Seat headline into ai_isnt_broken_intro encounter_def
UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{intro_copy}',
  COALESCE(metadata->'intro_copy', '{}'::jsonb) || '{"headline": "AI Isn''t Broken... Systems Are"}'::jsonb,
  true
),
updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro';

-- Validation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_media_map
    WHERE media_role = 'intro_hook_video'
      AND metadata->>'public_url' = 'https://media.c3field.online/ai_isnt_broken_intro.mp4'
  ) THEN
    RAISE EXCEPTION 'Validation failed: intro_hook_video public_url not updated';
  END IF;
END $$;