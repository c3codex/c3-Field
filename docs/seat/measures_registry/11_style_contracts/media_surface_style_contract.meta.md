---
document_type: style_contract
style_contract_key: media_surface
system: measures_registry
status: normalized_for_seat_review
surface_scope: all_registered_media_surfaces
chamber_authority: inherited_from_owning_encounter
encounter_key: resolved_from_media_manifest
visual_role: governed_media_frame
layout_rules:
  viewport_containment_required: true
media_rules:
  registered_manifest_only: true
  provider_distinction_preserved: true
  unregistered_fallback: false
typography_rules:
  text_in_media_requires_contract: true
button_rules:
  controls_subtle_and_contract_bound: true
responsive_rules:
  media_visible_without_overflow: true
forbidden_patterns:
  - component_owned_media_truth
  - raw_provider_swap
  - local_path_fallback
validation_rules:
  - media_reference_exists
  - destination_matches_manifest
  - laptop_and_mobile_containment_pass
---

# Media Surface Style Contract

Supabase image assets and Cloudflare R2 large-media assets remain distinct provider surfaces. Paragraph or social destinations require their own authorized integration contracts. No provider receives content or chamber authority.
