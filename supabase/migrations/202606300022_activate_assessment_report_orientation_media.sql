-- Activate assessment_report_orientation media row.
-- R2 object verified at https://media.c3field.online/assessment_report_orientation.mp4 (77MB, video/mp4).
-- Sets storage_path, exact_url_seated, and is_active = true.
-- Paired source changes: PublicAssessmentSurface receives data-style-profile and data-directory-key.
-- Resolver updated to fetch metadata from measures_encounter_surface_assignment.
-- Source OAR2: docs/oar/measures_registry/oar2_seat_assessment_report_orientation_r2_media_and_public_assessment_style_profile_v1.meta.md

UPDATE public.measures_media_map
SET
  storage_path = 'assessment_report_orientation.mp4',
  is_active = true,
  metadata = $json${
    "surface_role": "marble_chamber_orientation",
    "storage_provider": "cloudflare_r2",
    "exact_url_seated": "https://media.c3field.online/assessment_report_orientation.mp4",
    "r2_object_key": "assessment_report_orientation.mp4",
    "source_oar2": "docs/oar/measures_registry/oar2_seat_assessment_report_orientation_r2_media_and_public_assessment_style_profile_v1.meta.md"
  }$json$::jsonb,
  updated_at = now()
WHERE media_role = 'assessment_report_orientation'
  AND registry_key = 'marble_chamber_orientation';
