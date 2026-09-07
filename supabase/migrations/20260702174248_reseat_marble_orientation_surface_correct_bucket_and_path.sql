
-- Correct marble_orientation_surface: was pointing to stale Supabase webp.
-- Reseat to R2 bucket + correct path. Remove hardcoded public_url so VITE_R2_PUBLIC_BASE_URL constructs it.
UPDATE measures_media_map
SET
  storage_bucket = 'measures-media',
  storage_path   = 'assessment_report_orientation.mp4',
  metadata       = (COALESCE(metadata, '{}'::jsonb) - 'public_url')
WHERE media_role = 'marble_orientation_surface';

-- Remove hardcoded public_url from obsidian row too — bucket+path is correct, env var should construct it.
UPDATE measures_media_map
SET metadata = (COALESCE(metadata, '{}'::jsonb) - 'public_url')
WHERE media_role = 'obsidian';
