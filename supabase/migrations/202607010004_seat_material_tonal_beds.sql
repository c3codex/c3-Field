-- OAR: Seat material tonal bed media locators for FREE ambient audio
-- R2 bucket: measures-media
-- Files: crystal_tone_rise_return_5min.wav, lapis_tone_rise_return_5min.wav,
--        obsidian_tone_rise_return_5min.wav, marble_tone_rise_return_5min.wav
-- Roles: crystal_tone, lapis_tone, obsidian_tone, marble_tone
-- Used by: MeasuresRegistryOrchestrator ambient audio controller (material-keyed)

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'crystal_tone',
  'measures-media',
  'crystal_tone_rise_return_5min.wav',
  'audio/wav',
  true,
  20,
  jsonb_build_object(
    'material', 'crystal',
    'tone_key', 'crystal_tone',
    'standing', 'ambient_tone',
    'default_volume', 0.10,
    'loop', true,
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/crystal_tone_rise_return_5min.wav',
    'r2_object_key', 'crystal_tone_rise_return_5min.wav'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'crystal_tone'
    AND campaign_key = 'measures_registry_root_authority_v1'
);

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'lapis_tone',
  'measures-media',
  'lapis_tone_rise_return_5min.wav',
  'audio/wav',
  true,
  21,
  jsonb_build_object(
    'material', 'lapis',
    'tone_key', 'lapis_tone',
    'standing', 'ambient_tone',
    'default_volume', 0.08,
    'loop', true,
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/lapis_tone_rise_return_5min.wav',
    'r2_object_key', 'lapis_tone_rise_return_5min.wav'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'lapis_tone'
    AND campaign_key = 'measures_registry_root_authority_v1'
);

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'obsidian_tone',
  'measures-media',
  'obsidian_tone_rise_return_5min.wav',
  'audio/wav',
  true,
  22,
  jsonb_build_object(
    'material', 'obsidian',
    'tone_key', 'obsidian_tone',
    'standing', 'ambient_tone',
    'default_volume', 0.08,
    'loop', true,
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/obsidian_tone_rise_return_5min.wav',
    'r2_object_key', 'obsidian_tone_rise_return_5min.wav'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'obsidian_tone'
    AND campaign_key = 'measures_registry_root_authority_v1'
);

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'marble_tone',
  'measures-media',
  'marble_tone_rise_return_5min.wav',
  'audio/wav',
  true,
  23,
  jsonb_build_object(
    'material', 'marble',
    'tone_key', 'marble_tone',
    'standing', 'ambient_tone',
    'default_volume', 0.06,
    'loop', true,
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/marble_tone_rise_return_5min.wav',
    'r2_object_key', 'marble_tone_rise_return_5min.wav'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'marble_tone'
    AND campaign_key = 'measures_registry_root_authority_v1'
);
