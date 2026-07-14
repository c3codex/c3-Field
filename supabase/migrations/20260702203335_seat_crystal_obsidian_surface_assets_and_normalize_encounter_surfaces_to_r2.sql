
-- OAR2: seat_crystal_obsidian_surface_assets_and_final_encounter_style_normalization_v1
-- Reseat all surface backgrounds to R2. Insert new crystal + obsidian surface rows. Update threshold copy.

-- 1. Fix marble_orientation_surface: was incorrectly pointing to assessment MP4; seat correct webp
UPDATE measures_media_map
SET storage_bucket = 'measures-media',
    storage_path   = 'marble_orientation_surface.webp',
    mime_type      = 'image/webp',
    metadata       = (COALESCE(metadata, '{}'::jsonb) - 'public_url')
WHERE media_role   = 'marble_orientation_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

-- 2. Reseat marble_results_surface in R2
UPDATE measures_media_map
SET storage_bucket = 'measures-media',
    storage_path   = 'marble_results_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'marble_results_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

-- 3. Reseat marble_map_surface in R2
UPDATE measures_media_map
SET storage_bucket = 'measures-media',
    storage_path   = 'map_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'marble_map_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

-- 4. Reseat obsidian assessment surface with approved R2 asset name
UPDATE measures_media_map
SET storage_bucket = 'measures-media',
    storage_path   = 'obsidian_assessment_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'obsidian_assessment_surface_visual'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

-- 5. Reseat obsidian contact capture surface with approved R2 asset name
UPDATE measures_media_map
SET storage_bucket = 'measures-media',
    storage_path   = 'obsidian_contact_capture_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'obsidian_contact_surface_visual'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

-- 6. Insert crystal_orientation_surface
INSERT INTO measures_media_map (registry_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, sort_order, metadata)
VALUES (
  'measures_registry_root',
  'measures_registry_root_authority_v1',
  'crystal_orientation_surface',
  'measures-media',
  'crystal_orientation_surface.webp',
  'image/webp',
  true,
  200,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 7. Insert crystal_longform_surface
INSERT INTO measures_media_map (registry_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, sort_order, metadata)
VALUES (
  'measures_registry_root',
  'measures_registry_root_authority_v1',
  'crystal_longform_surface',
  'measures-media',
  'crystal_longform_surface.webp',
  'image/webp',
  true,
  201,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 8. Insert obsidian_orientation_surface
INSERT INTO measures_media_map (registry_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, sort_order, metadata)
VALUES (
  'measures_registry_landing',
  'agents_of_chaos_integrity_governance',
  'obsidian_orientation_surface',
  'measures-media',
  'obsidian_orientation_surface.webp',
  'image/webp',
  true,
  200,
  '{}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 9. Update threshold copy with final approved copy
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{threshold_copy}',
  '{
    "title": "Measures Registry",
    "plaques": [
      {
        "body": "Assess the Environment",
        "side": "left",
        "label": "Assess",
        "context": "Evaluate your AI operating environment and identify conditions that may lead to operational fragmentation, instability, or structural drift."
      },
      {
        "body": "Understand the Environment",
        "side": "right",
        "label": "Understand",
        "context": "Explore Integrity Governance for AI-Accelerated Systems and the structures required to keep AI environments visible, accountable, and governable."
      }
    ]
  }'::jsonb
)
WHERE encounter_key = 'ai_isnt_broken_intro';
