---
document_type: style_contract
style_contract_key: responsive_containment
system: measures_registry
status: normalized_for_seat_review
surface_scope: all_public_runtime_surfaces
chamber_authority: inherited_from_active_encounter
encounter_key: all_registered_encounters
visual_role: viewport_containment
layout_rules:
  viewport_fit: true
  critical_content_contained: true
media_rules:
  media_containment_required: true
typography_rules:
  readable_without_token_bleed: true
button_rules:
  critical_cta_visible: true
responsive_rules:
  desktop: required
  laptop: required
  mobile: required
forbidden_patterns:
  - horizontal_overflow
  - critical_vertical_overflow
  - metadata_bleed
  - title_token_bleed
validation_rules:
  - text_readable
  - media_visible
  - cta_visible
  - contract_suppressed_header_footer_preserved
---

# Responsive Containment Style Contract

Every public runtime surface must preserve usable containment across desktop, laptop, and mobile. A contract may permit scrolling, but critical actions and required context cannot escape the usable frame.
