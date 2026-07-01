-- OAR: Style Crystal Orientation and About Encounter with Codexstone and Links
-- Targets: crystal_seat_orientation, crystal_seat_encounter
-- 1. Seat governed-site copy + Codexstone captions in crystal_seat_orientation surface assignment metadata
-- 2. Add c3field_links_section to about_measures_registry approved_content_contract
-- 3. Seat official_codexstone_seal media locator (Supabase measures-registry bucket)
-- 4. Seat about_measures_registry_video media locator (R2 measures-media bucket)

-- ── STEP 1: Crystal Seat Orientation — governed site content ──────────────────

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
  'governed_site_paragraphs', jsonb_build_array(
    'Measures Registry is a registered branch of the c3 Field.',
    'The c3 Field is a structured environment where systems, relationships, and public encounters are intentionally organized rather than assembled through isolated pages, hidden application logic, or unmanaged processes.',
    'Measures Registry applies that structure to institutional environments and AI operations.',
    'Content, media, pathways, and public surfaces are registered, measurable, and intentionally arranged.',
    'What you encounter here is not generated from disconnected pages or assumed authority.',
    'The site does not invent truth.',
    'It renders registered standing.'
  ),
  'codexstone_captions', jsonb_build_array(
    'A GOVERNED SYSTEM OF RECORD.',
    'The stone remembers.'
  )
)
WHERE surface_key = 'crystal_seat_orientation';

-- ── STEP 2: About Measures Registry — c3 Field links ────────────────────────

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{approved_content_contract,c3field_links_section}',
  jsonb_build_object(
    'label', 'c3 Field',
    'description', 'Measures Registry is a registered branch of the c3 Field.',
    'links', jsonb_build_array(
      jsonb_build_object(
        'label', 'Our Story',
        'url', 'https://c3field.online',
        'description', 'The c3 Field founding structure and purpose.'
      ),
      jsonb_build_object(
        'label', 'Bigger Picture',
        'url', 'https://c3field.online',
        'description', 'The broader c3 Field scope and direction.'
      )
    ),
    'link_style', 'video_link',
    'standing', 'public'
  ),
  true
)
WHERE encounter_key = 'about_measures_registry';

-- ── STEP 3: Seat official_codexstone_seal ────────────────────────────────────
-- Supabase measures-registry bucket. Filename: official_codexstone_seal.png
-- Operator must verify filename matches object in bucket.

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'official_codexstone_seal',
  'measures-registry',
  'official_codexstone_seal.png',
  'image/png',
  true,
  30,
  jsonb_build_object(
    'standing', 'codexstone_seal',
    'storage_provider', 'supabase_storage',
    'surface_role', 'crystal_orientation_and_encounter',
    'source_oar2', 'oar2_style_crystal_orientation_and_about_encounter_with_codexstone_and_links_v1'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'official_codexstone_seal'
    AND campaign_key = 'measures_registry_root_authority_v1'
);

-- ── STEP 4: Seat about_measures_registry_video ───────────────────────────────
-- R2 measures-media bucket. Assumed filename: about_measures_registry.mp4
-- Operator must verify filename matches R2 object key.

INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role, storage_bucket, storage_path,
  mime_type, is_active, sort_order, metadata, updated_at
)
SELECT
  'measures_registry_root_authority_v1',
  'measures_registry_root',
  'about_measures_registry_video',
  'measures-media',
  'about_measures_registry.mp4',
  'video/mp4',
  true,
  12,
  jsonb_build_object(
    'standing', 'crystal_encounter_explainer',
    'surface_role', 'crystal_seat_encounter',
    'storage_provider', 'cloudflare_r2',
    'exact_url_seated', 'https://media.c3field.online/about_measures_registry.mp4',
    'r2_object_key', 'about_measures_registry.mp4',
    'source_oar2', 'oar2_style_crystal_orientation_and_about_encounter_with_codexstone_and_links_v1'
  ),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM public.measures_media_map
  WHERE media_role = 'about_measures_registry_video'
    AND campaign_key = 'measures_registry_root_authority_v1'
);
