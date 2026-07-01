-- OAR2: Repair obsidian_chamber_orientation public display title
-- Prior state: display_title = 'Obsidian Chamber Orientation' (internal term, visible as H1)
-- Fix: update to public-facing title, add content_profile.title authority

UPDATE public.measures_encounter_def
SET
  display_title = 'Structural Coherence',
  metadata = jsonb_set(
    jsonb_set(
      COALESCE(metadata, '{}'::jsonb),
      '{content_profile,title}',
      '"Structural Coherence"'::jsonb,
      true
    ),
    '{content_profile,subtitle}',
    '"Recognize the environment before evaluation."'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'obsidian_chamber_orientation';
