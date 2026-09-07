
-- Temporary: re-seat public_url on R2 rows until VITE_R2_PUBLIC_BASE_URL is in the production build.
-- Once env var is live, these can be cleared and resolveRuntimeMediaUrl will use bucket+path.
UPDATE measures_media_map
SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{public_url}', '"https://media.c3field.online/assessment_report_orientation.mp4"')
WHERE media_role = 'marble_orientation_surface';

UPDATE measures_media_map
SET metadata = jsonb_set(COALESCE(metadata, '{}'::jsonb), '{public_url}', '"https://media.c3field.online/obsidian_chamber_orientation.mp4"')
WHERE media_role = 'obsidian';
