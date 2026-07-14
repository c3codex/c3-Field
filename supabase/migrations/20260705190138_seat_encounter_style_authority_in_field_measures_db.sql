-- OAR2 "Seat Encounter Style Authority in Field Measures DB"
-- docs/oar/measures_registry/oar2_seat_encounter_style_authority_in_field_measures_db_v1.meta.md
--
-- Seating method (per OAR2 ROUTED #2, "preferred" method): the 16 non-profile_key style
-- authority fields are seated as sibling metadata keys on the SAME
-- measures_encounter_surface_assignment row where style_profile already lives — no new
-- table, no duplicate authority surface.
--
-- Per-surface values for the 7 concordance fields (material_family, frame_profile,
-- space_profile, content_anchor, typography_profile, motion_profile, surface_density,
-- visual_tension) were derived by reading each surface's actual renderer JSX/CSS this
-- session, deviating from the OAR2 "material baseline" wherever the surface's real
-- structure clearly warranted it (documented per-surface in the companion OAR1).
--
-- The 8 remaining fields (media_ratio, content_width, button_position, overlay_treatment,
-- watermark_treatment, audio_control_treatment, mobile_behavior, release_state_behavior)
-- are seated ONLY where direct, unambiguous evidence exists in code (specific CSS
-- aspect-ratio rules scoped to a surface's own media selector; JSX-confirmed
-- always-rendered audio-toggle buttons). Everywhere else they are explicit JSON null —
-- a documented gap, not a guess, per OAR2's "do not guess" instruction.
--
-- Idempotent: uses `metadata || jsonb_build_object(...)`, safe to re-run.

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'crystal', 'frame_profile', 'cinematic_frame', 'space_profile', 'immersive_space',
  'content_anchor', 'anchor_bottom', 'typography_profile', 'signal_type', 'motion_profile', 'cinematic_motion',
  'surface_density', 'minimal_density', 'visual_tension', 'calm_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', 'always_visible_audio', 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'crystal_seat_intro';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'crystal', 'frame_profile', 'split_frame', 'space_profile', 'immersive_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'whisper_type', 'motion_profile', 'passage_motion',
  'surface_density', 'minimal_density', 'visual_tension', 'threshold_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'crystal_seat_threshold';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'crystal', 'frame_profile', 'gallery_frame', 'space_profile', 'ceremonial_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'institutional_type', 'motion_profile', 'breathing_motion',
  'surface_density', 'minimal_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', 'portrait_9_16', 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', 'always_visible_audio', 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'crystal_seat_orientation';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'crystal', 'frame_profile', 'document_frame', 'space_profile', 'institutional_space',
  'content_anchor', 'anchor_left', 'typography_profile', 'institutional_type', 'motion_profile', 'still_motion',
  'surface_density', 'narrative_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'crystal_seat_encounter';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'obsidian', 'frame_profile', 'threshold_frame', 'space_profile', 'immersive_space',
  'content_anchor', 'anchor_right', 'typography_profile', 'institutional_type', 'motion_profile', 'passage_motion',
  'surface_density', 'operational_density', 'visual_tension', 'diagnostic_tension',
  'media_ratio', 'landscape_16_9', 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', 'always_visible_audio', 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'obsidian_chamber_orientation';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'obsidian', 'frame_profile', 'threshold_frame', 'space_profile', 'immersive_space',
  'content_anchor', 'anchor_right', 'typography_profile', 'institutional_type', 'motion_profile', 'passage_motion',
  'surface_density', 'operational_density', 'visual_tension', 'diagnostic_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'obsidian_chamber_encounter_surface';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'obsidian', 'frame_profile', 'document_frame', 'space_profile', 'intimate_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'institutional_type', 'motion_profile', 'still_motion',
  'surface_density', 'operational_density', 'visual_tension', 'threshold_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'obsidian_chamber_C1_compact';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'marble', 'frame_profile', 'threshold_frame', 'space_profile', 'ceremonial_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'institutional_type', 'motion_profile', 'breathing_motion',
  'surface_density', 'minimal_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', 'landscape_16_9', 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', 'always_visible_audio', 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'marble_chamber_orientation';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'marble', 'frame_profile', 'document_frame', 'space_profile', 'institutional_space',
  'content_anchor', 'anchor_left', 'typography_profile', 'editorial_type', 'motion_profile', 'still_motion',
  'surface_density', 'narrative_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key in ('marble_chamber_results', 'marble_chamber_encounter');

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'marble', 'frame_profile', 'split_frame', 'space_profile', 'compressed_space',
  'content_anchor', 'anchor_right', 'typography_profile', 'institutional_type', 'motion_profile', 'still_motion',
  'surface_density', 'operational_density', 'visual_tension', 'threshold_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'marble_chamber_C2_compact';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'marble', 'frame_profile', 'threshold_frame', 'space_profile', 'ceremonial_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'institutional_type', 'motion_profile', 'still_motion',
  'surface_density', 'operational_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'marble_chamber_C2_agreement';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'marble', 'frame_profile', 'threshold_frame', 'space_profile', 'ceremonial_space',
  'content_anchor', 'anchor_center', 'typography_profile', 'institutional_type', 'motion_profile', 'still_motion',
  'surface_density', 'minimal_density', 'visual_tension', 'ceremonial_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'marble_chamber_C2_resolution';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'lapis', 'frame_profile', 'gallery_frame', 'space_profile', 'institutional_space',
  'content_anchor', 'anchor_left', 'typography_profile', 'editorial_type', 'motion_profile', 'still_motion',
  'surface_density', 'narrative_density', 'visual_tension', 'transformative_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'lapis_chamber_encounter';

update measures_encounter_surface_assignment set metadata = metadata || jsonb_build_object(
  'material_family', 'lapis', 'frame_profile', 'split_frame', 'space_profile', 'intimate_space',
  'content_anchor', 'anchor_floating', 'typography_profile', 'whisper_type', 'motion_profile', 'ritual_motion',
  'surface_density', 'narrative_density', 'visual_tension', 'transformative_tension',
  'media_ratio', NULL::text, 'content_width', NULL::text, 'button_position', NULL::text,
  'overlay_treatment', NULL::text, 'watermark_treatment', NULL::text,
  'audio_control_treatment', NULL::text, 'mobile_behavior', NULL::text, 'release_state_behavior', NULL::text
) where surface_key = 'publication_dispatch';
