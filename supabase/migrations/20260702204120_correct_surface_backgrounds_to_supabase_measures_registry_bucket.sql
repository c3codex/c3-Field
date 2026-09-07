
-- Correction: surface background webps are in Supabase measures-registry bucket, not R2.
-- Revert all surface background rows to measures-registry with actual filenames in that bucket.

-- Marble surfaces
UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'marble_orientation_surface.webp',
    mime_type      = 'image/webp',
    metadata       = (COALESCE(metadata, '{}'::jsonb) - 'public_url')
WHERE media_role   = 'marble_orientation_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'marble_results_surface (1).webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'marble_results_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'map_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'marble_map_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

-- Obsidian assessment and contact: revert to existing _v1 filenames in Supabase
UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'obsidian_assessment_surface_visual_v1.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'obsidian_assessment_surface_visual'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'obsidian_contact_surface_visual_v1.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'obsidian_contact_surface_visual'
  AND campaign_key = 'agents_of_chaos_integrity_governance';

-- New crystal surfaces: use actual files in Supabase
UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'crystal_orientation_surface.png',
    mime_type      = 'image/png'
WHERE media_role   = 'crystal_orientation_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'crystal_about_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'crystal_longform_surface'
  AND campaign_key = 'measures_registry_root_authority_v1';

-- New obsidian orientation surface: clean name exists in Supabase
UPDATE measures_media_map
SET storage_bucket = 'measures-registry',
    storage_path   = 'obsidian_orientation_surface.webp',
    mime_type      = 'image/webp'
WHERE media_role   = 'obsidian_orientation_surface'
  AND campaign_key = 'agents_of_chaos_integrity_governance';
