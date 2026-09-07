---
document_type: directory_set_requirement_record
record_key: undrifted_lapis_9x16_style_profile_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# unDrifted Lapis 9x16 Style Profile Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false
  upload_authorized_now: false

style_profile:
  profile_key: undrifted_lapis_9x16_social_profile
  chamber_authority: lapis
  material_semantics: relation_transition
  surface_key: undrifted_lapis_encounter
  aspect_ratio: "9:16"
  header: none
  primary_public_headline: "AI Isn't Broken. Systems Are."
  issue_marker:
    position: top_right
    text: "June 2026 · Issue 001"

initial_state:
  media_key: undrifted_hero
  hero_slot: video
  headline_visibility: suppressed_or_minimal
  headline_blocks_viewport: false
  CTA_visible: true
  CTA_label: "Assess Your AI Environment"
  remove:
    - Watch 15-sec hook
    - top_navigation_header

post_video_state:
  trigger: video_complete
  hero_slot: headline_panel_or_video_still
  headline: "AI Isn't Broken. Systems Are."
  subline: "Questions ungoverned systems cannot answer."
  CTA_label: "Assess Your AI Environment"
  reveal:
    - article_cards
    - icon_signal_strip
    - leadership_callout

article_cards:
  display_order:
    - Agents with Keys
    - Fables and Myths
    - Measures Registry
  card_behavior:
    opens: onsite_overlay_or_panel
    paragraph_redirect_primary: false

leadership_callout:
  required: true
  placement: lower_surface_or_panel
  allowed_CTA_labels:
    - Start Leadership Conversation
    - Request Foundational Leadership Review
    - Connect with Measures Registry
  must_not_create:
    - payment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - Branch standing

visual_constraints:
  must_be:
    - sharp
    - high_fidelity
    - dark_lapis_signal_surface
    - social_share_ready
    - mobile_first
  must_not_be:
    - generic_SaaS_layout
    - unstyled_cards
    - header_dependent
    - cluttered_over_video
    - structural_drift_showcase
```

## Boundary

This record seats a style profile requirement. It does not mutate CSS, runtime, routes, renderer, public copy, storage, or launch state.
