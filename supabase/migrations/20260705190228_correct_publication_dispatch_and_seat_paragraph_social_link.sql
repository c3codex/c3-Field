-- Correction: publication_dispatch has no style_profile key seeded yet (confirmed via
-- direct query), so per OAR2 "Seat Encounter Style Authority in Field Measures DB" §3
-- ("Use existing profile_key / style_profile values as the binding key"), it was not a
-- valid seating target. Remove the style-authority fields mistakenly added to it in the
-- prior migration — it stays an honest gap until style_profile itself is seated there.
update measures_encounter_surface_assignment
set metadata = metadata
  - 'material_family' - 'frame_profile' - 'space_profile' - 'content_anchor'
  - 'typography_profile' - 'motion_profile' - 'surface_density' - 'visual_tension'
  - 'media_ratio' - 'content_width' - 'button_position' - 'overlay_treatment'
  - 'watermark_treatment' - 'audio_control_treatment' - 'mobile_behavior' - 'release_state_behavior'
where surface_key = 'publication_dispatch';

-- Seat the Paragraph/unDrifted social link as active, closing the gap documented in
-- oar1_seat_institutional_metadata_authority_v1.meta.md.
update measures_registry
set metadata = jsonb_set(
  metadata,
  '{social_links}',
  (metadata->'social_links') || '[{"platform": "Paragraph", "name": "unDrifted", "url": "https://paragraph.com/@undrifted", "standing": "active"}]'::jsonb
),
updated_at = now()
where registry_key = 'undrifted_publication_landing'
  and not exists (
    select 1 from jsonb_array_elements(metadata->'social_links') l
    where l->>'platform' = 'Paragraph'
  );
