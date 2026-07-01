-- OAR: Seat measures_position media for crystal_seat_orientation surface
-- R2 object: measures-media / crystal_seat_orientation.mp4 (renamed by operator)
-- Role: measures_position — consumed by IntroHookSeat when surface = crystal_seat_orientation

INSERT INTO public.measures_media_map (
  campaign_key,
  registry_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  is_active,
  sort_order,
  metadata,
  updated_at
) VALUES (
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'measures_position',
  'measures-media',
  'crystal_seat_orientation.mp4',
  'video/mp4',
  true,
  11,
  jsonb_build_object(
    'surface_role', 'crystal_seat_orientation',
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/crystal_seat_orientation.mp4',
    'r2_object_key', 'crystal_seat_orientation.mp4'
  ),
  now()
);
