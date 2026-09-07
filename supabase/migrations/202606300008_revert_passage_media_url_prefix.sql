-- Revert passage video URL to verified 200 OK path.
-- Migration 202606300007 set 1before_the_pathway... which returns 404.
-- Verified: https://media.c3field.online/before_the_pathway_obsidian_to_marble_passage_v1.mp4 → 200 OK
--           https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4 → 404 Not Found
UPDATE public.measures_media_map
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{public_url}',
    '"https://media.c3field.online/before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
  ),
  '{exact_url_seated}',
  '"https://media.c3field.online/before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
)
WHERE media_role = 'before_the_pathway_obsidian_to_marble_passage_video';
