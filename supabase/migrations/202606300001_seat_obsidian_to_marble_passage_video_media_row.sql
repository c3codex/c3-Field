-- Seat measures_media_map row for obsidian_to_marble_passage_video passage.
-- OAR2: oar2_seat_obsidian_to_marble_passage_video_media_row_v1
-- Asset: R2 bucket measures-media / 1before_the_pathway_obsidian_to_marble_passage_v1.mp4
-- media_role must match renderer lookup: before_the_pathway_obsidian_to_marble_passage_video

insert into public.measures_media_map (
  id,
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  sort_order,
  is_active,
  metadata,
  created_at,
  updated_at
) values (
  gen_random_uuid(),
  'obsidian_to_marble_passage_video',
  'obsidian_to_marble_passage_video',
  'agents_of_chaos_integrity_governance',
  'before_the_pathway_obsidian_to_marble_passage_video',
  'measures-media',
  '1before_the_pathway_obsidian_to_marble_passage_v1.mp4',
  'video/mp4',
  20,
  true,
  '{"surface_role":"obsidian_to_marble_passage_video","media_boundary":"no_copy_no_cta_no_routing"}'::jsonb,
  now(),
  now()
);

-- Validation: confirm row is seated and active
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.measures_media_map
    WHERE media_role = 'before_the_pathway_obsidian_to_marble_passage_video'
      AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Validation failed: before_the_pathway_obsidian_to_marble_passage_video not seated or not active';
  END IF;
END $$;
