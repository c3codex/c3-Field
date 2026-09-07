---
document_type: style_contract_validation
style_contract_key: no_visual_drift_validation
system: measures_registry
status: normalized_for_seat_review
surface_scope: style_contract_layer
chamber_authority: none_validation_only
encounter_key: all_registered_encounters
visual_role: contract_conformance_validation
layout_rules:
  compare_to_registered_contract: true
media_rules:
  correct_manifest_required: true
typography_rules:
  metadata_and_title_token_bleed_forbidden: true
button_rules:
  correct_cta_contract_required: true
responsive_rules:
  desktop_laptop_mobile_checks_required: true
forbidden_patterns:
  - component_owned_chamber_style
  - hardcoded_per_page_exception
  - generic_missing_contract_fallback
  - active_render_of_held_state
validation_rules:
  - every_surface_resolves_style_contract_key
  - no_overflow
  - correct_media
  - correct_cta
  - held_or_missing_style_renders_honestly
---

# No Visual Drift Validation

This is a review contract, not proof that every deployed surface currently passes visual inspection. Implementation validation remains required when CSS/runtime work is authorized.

Failure behavior: render a held or missing-style state. Do not guess and do not substitute generic UI.
