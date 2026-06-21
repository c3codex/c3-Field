---
document_type: directory_set_requirement_record
record_key: undrifted_lapis_icon_registry_usage_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
system_scope: measures_registry_isolated
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# unDrifted Lapis Icon Registry Usage Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false

icon_registry_usage:
  source: media_map_or_icon_registry
  renderer_behavior: resolve_by_icon_key
  hardcoded_component_icons_allowed: false

icons:
  Agents_with_Keys:
    icon_key: key_or_access
    semantic_use: capability_is_not_authority

  Fables_and_Myths:
    icon_key: mask_scroll_or_fable
    semantic_use: stories_we_believe_become_systems_we_build

  Measures_Registry:
    icon_key: registry_seal_or_triangle_mark
    semantic_use: integrity_governance_for_AI_accelerated_systems

  Truth_is_Structure:
    icon_key: cube
    semantic_use: coherence_before_complexity

  Structure_Prevents_Drift:
    icon_key: shield
    semantic_use: governance_is_design_choice

  Authority_is_Registered:
    icon_key: column
    semantic_use: accountability_leaves_trace

  Accountability_is_Traceable:
    icon_key: clipboard
    semantic_use: what_is_measured_can_be_trusted

  Leadership_Callout:
    icon_key: people_or_handshake
    semantic_use: aligned_institutional_leadership

style_constraints:
  stroke_weight: single_system_weight
  color_tokens:
    allowed:
      - lapis_signal_blue
      - governance_gold
      - text_white
    not_allowed:
      - mixed_random_colors
      - icon_style_mismatch
```

## Boundary

This record requires icons to resolve through a governed media map or icon registry. It does not authorize hardcoded component icons or renderer mutation.
