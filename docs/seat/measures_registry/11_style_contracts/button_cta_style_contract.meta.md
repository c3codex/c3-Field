---
document_type: style_contract
style_contract_key: button_cta
system: measures_registry
status: normalized_for_seat_review
surface_scope: all_runtime_actions
chamber_authority: inherited_from_active_encounter
encounter_key: resolved_from_action_contract
visual_role: restrained_governed_transition
layout_rules:
  placement: right_aligned_or_lower_right
  critical_action_inside_viewport: true
media_rules:
  decorative_media_not_required: true
typography_rules:
  seated_label_required: true
button_rules:
  restrained_size: true
  minimal_weight: true
  subtle_motion: true
responsive_rules:
  action_visible_at_required_viewports: true
forbidden_patterns:
  - oversized_buttons
  - generic_button_stacks
  - invented_labels_or_routes
  - held_state_activation_cta
validation_rules:
  - action_contract_resolves
  - route_is_seated
  - payment_cta_requires_active_payment_contract
---

# Button and CTA Style Contract

Buttons express seated transitions only. Their labels, destination, availability, and material semantics come from active encounter/action contracts, never component inference.
