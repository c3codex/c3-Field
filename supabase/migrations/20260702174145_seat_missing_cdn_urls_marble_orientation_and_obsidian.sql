
-- marble_chamber_orientation background: user confirmed assessment_report_orientation.mp4
UPDATE measures_media_map
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{public_url}',
  '"https://media.c3field.online/assessment_report_orientation.mp4"'
)
WHERE media_role = 'marble_orientation_surface';

-- obsidian orientation video: seats CDN URL for obsidian_chamber_orientation.mp4
UPDATE measures_media_map
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{public_url}',
  '"https://media.c3field.online/obsidian_chamber_orientation.mp4"'
)
WHERE media_role = 'obsidian';
