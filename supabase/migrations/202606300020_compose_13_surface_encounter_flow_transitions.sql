-- Compose 13-surface encounter flow transitions.
-- Source OAR2: docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md
--
-- Updates measures_registry_root.metadata.encounter_structure to wire the full
-- 13-surface sequence. Key changes from prior state:
--   obsidian_chamber_encounter_surface.next_surface: obsidian_to_marble_passage_video -> obsidian_chamber_C1_compact
--   New nodes: crystal_seat_intro, obsidian_chamber_C1_compact, marble_chamber_orientation,
--              marble_chamber_encounter, marble_chamber_C2_compact, marble_chamber_C2_agreement,
--              marble_chamber_C2_resolution
--
-- obsidian_to_marble_passage_video node retained with standing=bypassed_in_13_surface_flow.
-- All passage and held nodes preserved. No payment logic changed. No scoring changed.
-- No public routes changed. Lapis remains optional/non-sequence.

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
    "crystal_seat_intro": {
      "next_surface": "crystal_seat_threshold",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "crystal_seat_threshold": {
      "left": {
        "source_oar2": "docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md",
        "next_surface": "obsidian_chamber_orientation",
        "threshold_label": "Assess the Environment"
      },
      "right": {
        "source_oar2": "docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md",
        "next_surface": "crystal_seat_orientation",
        "threshold_label": "Understand the Environment"
      },
      "controls": ["audio", "continue"],
      "media_role": "intro_hook_video",
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
      "content_encounter_key": "evaluate_structure_path",
      "standing": "legacy_alias"
    },
    "obsidian_chamber_orientation": {
      "media_role": "explainer_video",
      "next_surface": "obsidian_chamber_encounter_surface",
      "content_encounter_key": "eval_passage"
    },
    "obsidian_chamber_encounter_surface": {
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md",
      "next_surface": "obsidian_chamber_C1_compact"
    },
    "obsidian_chamber_C1_compact": {
      "next_surface": "marble_chamber_orientation",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "marble_chamber_orientation": {
      "next_surface": "marble_chamber_encounter",
      "media_role": "assessment_report_orientation",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "marble_chamber_encounter": {
      "next_surface": "marble_chamber_C2_compact",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "marble_chamber_C2_compact": {
      "next_surface": "marble_chamber_C2_agreement",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "marble_chamber_C2_agreement": {
      "next_surface": "marble_chamber_C2_resolution",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "marble_chamber_C2_resolution": {
      "standing": "terminal",
      "source_oar2": "docs/oar/measures_registry/oar2_compose_existing_resolved_surfaces_into_13_surface_encounter_flow_v1.meta.md"
    },
    "obsidian_to_marble_passage_video": {
      "source_oar2": "docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md",
      "next_surface": "marble_chamber_C2_compact",
      "standing": "bypassed_in_13_surface_flow"
    },
    "crystal_seat_encounter": {
      "seal_media_role": "official_codexstone_seal",
      "video_media_role": "about_measures_registry_video",
      "content_encounter_key": "about_measures_registry"
    },
    "crystal_seat_orientation": {
      "next_surface": "crystal_seat_encounter",
      "source_oar2": "docs/oar/measures_registry/oar2_collapse_crystal_split_path_into_threshold_v1.meta.md"
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
