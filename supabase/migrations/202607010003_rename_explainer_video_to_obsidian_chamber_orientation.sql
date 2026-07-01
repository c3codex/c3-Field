-- OAR: R2 object for obsidian_chamber_orientation explainer was renamed
-- Prior: structural_coherence_explainer_45s.mp4
-- After: obsidian_chamber_orientation.mp4
-- Update DB row to match R2 object key

UPDATE public.measures_media_map
SET
  storage_path = 'obsidian_chamber_orientation.mp4',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{r2_object_key}',
    '"obsidian_chamber_orientation.mp4"'::jsonb,
    true
  ),
  updated_at = now()
WHERE media_role = 'explainer_video'
  AND storage_bucket = 'measures-media';
