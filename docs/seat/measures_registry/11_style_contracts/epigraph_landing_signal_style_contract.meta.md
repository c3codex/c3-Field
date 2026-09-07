---
document_type: style_contract
style_contract_key: epigraph_landing_signal
system: measures_registry
status: normalized_for_seat_review
surface_scope: landing_signal_and_pre_encounter_surfaces
chamber_authority: none_until_encounter_resolution
encounter_key: pending_runtime_resolution
visual_role: minimal_signal_landing
layout_rules:
  minimal: true
  chamber_inventory_hidden: true
media_rules:
  registered_manifest_only: true
typography_rules:
  signal_copy_only: true
  internal_tokens_hidden: true
button_rules:
  routed_action_only: true
responsive_rules:
  viewport_contained: true
forbidden_patterns:
  - chamber_menu
  - hardcoded_assessment_route
  - hardcoded_chamber_sequence
  - header_or_footer_without_contract
validation_rules:
  - landing_emits_landing_signal
  - epigraph_resolves_current_valid_encounter
  - only_resolved_encounter_visible
---

# Epigraph Landing-Signal Style Contract

Epigraph is routing behavior, not encounter runtime. The landing surface remains visually minimal until Measures resolves the current valid encounter. Missing route state must remain visible as missing state rather than becoming an invented path.
