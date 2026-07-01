UPDATE public.measures_media_map
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{public_url}',
    '"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
  ),
  '{exact_url_seated}',
  '"https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"'
)
WHERE registry_key = 'measures_registry'
AND media_role = 'before_the_pathway_obsidian_to_marble_passage_video';
