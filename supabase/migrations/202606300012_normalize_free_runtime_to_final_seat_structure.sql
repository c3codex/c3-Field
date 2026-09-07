-- Normalize FREE runtime to the final 13-part Measures Registry SEAT structure.
-- Source OAR2: docs/oar/measures_registry/oar2_normalize_free_runtime_to_final_seat_structure_v1.meta.md
--
-- Atomic DB half of a paired code+DB rename. Surface_key column is UNIQUE (not PK)
-- and has no FK dependents — safe to UPDATE. Encounter_structure JSONB keys are also
-- updated in the same statement so transitionNodes lookups remain valid. Profile
-- metadata values that were seeded with intermediate terms by 202606300011 are
-- corrected here to the final canonical names.
--
-- Public routes are NOT changed (/about-measures-registry, /undrifted,
-- /ai-operations-assessment, /map-integrity-governance remain stable).
-- The source code half (EncounterSurface union, ROUTE_SURFACE_MAP, renderer dispatch)
-- is updated atomically in the same commit.

-- ─── 1. surface_key renames ────────────────────────────────────────────────

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'crystal_seat_threshold'
WHERE surface_key = 'intro_hook';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'crystal_seat_split_path'
WHERE surface_key = 'path_choice';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'crystal_seat_orientation'
WHERE surface_key = 'intro';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'crystal_seat_encounter'
WHERE surface_key = 'about_measures_registry';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'lapis_chamber_encounter'
WHERE surface_key = 'structural_drift_dispatches';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'obsidian_chamber_orientation'
WHERE surface_key = 'structural_coherence_explainer';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'obsidian_chamber_encounter_surface'
WHERE surface_key = 'measures_assessment';

UPDATE public.measures_encounter_surface_assignment
SET surface_key = 'marble_chamber_C2_compact'
WHERE surface_key = 'map_integrity_governance';

-- ─── 2. Correct profile metadata values set by prior intermediate migrations ──
-- 202606300011 used slightly different profile strings for some surfaces.
-- Overwrite with the final canonical SEAT terms from this OAR2.

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_seat_orientation"}'::jsonb
WHERE surface_key = 'crystal_seat_orientation';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_chamber_encounter_surface"}'::jsonb
WHERE surface_key = 'obsidian_chamber_encounter_surface';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"marble_chamber_C2_compact"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_compact';

-- ─── 3. Replace encounter_structure JSONB in measures_registry_root ───────────
-- All surface_key references inside the JSONB are updated to the canonical SEAT
-- terms. next_surface values are updated throughout. Held/legacy entries retain
-- their keys and receive a standing tag. obsidian_to_marble_passage_video is an
-- active passage transition (not in the 13 SEAT terms) — its next_surface now
-- points to marble_chamber_C2_compact.

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure}',
  $enc${
    "assessment": {
      "ordered_stages": ["assessment", "contact_capture", "result", "map_continuation", "payment"],
      "map_payment_logic": "preserve_existing_live_logic",
      "content_encounter_key": "measures_assessment",
      "confirmation_email_notice": "Login details will arrive in a separate email.",
      "assessment_before_contact_capture": true
    },
    "crystal_seat_threshold": {
      "left": {
        "source_oar2": "docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md",
        "next_surface": "obsidian_chamber_orientation",
        "threshold_label": "Assess the Environment"
      },
      "right": {
        "source_oar2": "docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md",
        "next_surface": "crystal_seat_orientation_passage",
        "threshold_label": "Understand the Environment"
      },
      "controls": ["audio", "continue"],
      "media_role": "intro_hook_video",
      "next_surface": "crystal_seat_split_path",
      "content_encounter_key": "ai_isnt_broken_intro"
    },
    "crystal_seat_split_path": {
      "left": {
        "source_oar2": "docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md",
        "next_surface": "obsidian_chamber_orientation",
        "threshold_label": "Assess the Environment"
      },
      "right": {
        "source_oar2": "docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md",
        "next_surface": "crystal_seat_orientation_passage",
        "threshold_label": "Understand the Environment"
      },
      "content_encounter_key": "evaluate_structure_path"
    },
    "obsidian_chamber_orientation": {
      "media_role": "explainer_video",
      "next_surface": "obsidian_chamber_encounter_surface",
      "content_encounter_key": "eval_passage"
    },
    "obsidian_chamber_encounter_surface": {
      "source_oar2": "docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md",
      "next_surface": "obsidian_to_marble_passage_video"
    },
    "obsidian_to_marble_passage_video": {
      "source_oar2": "docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md",
      "next_surface": "marble_chamber_C2_compact"
    },
    "crystal_seat_encounter": {
      "seal_media_role": "official_codexstone_seal",
      "video_media_role": "about_measures_registry_video",
      "content_encounter_key": "about_measures_registry"
    },
    "eval_passage": {
      "source_oar2": "docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md",
      "next_surface": "obsidian_chamber_encounter_surface",
      "standing": "legacy_alias"
    },
    "structure_passage": {
      "source_oar2": "docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md",
      "next_surface": "crystal_seat_encounter",
      "standing": "held"
    },
    "crystal_seat_orientation_passage": {
      "source_oar2": "docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md",
      "next_surface": "crystal_seat_encounter",
      "standing": "held"
    },
    "measures_structured_environments": {
      "media_role": "measures_structured_enviroments",
      "next_surface": "crystal_seat_encounter",
      "final_passage_line": "The goal is governable environments.",
      "content_encounter_key": "structure_passage",
      "standing": "held"
    }
  }$enc$::jsonb
)
WHERE registry_key = 'measures_registry_root';
