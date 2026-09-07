---
document_type: directory_set_requirement_record
record_key: launch_style_profile_set_record
status: required_before_SEAT_bucket_upload
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
system_scope: measures_registry_isolated
upload_authorized_now: false
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# Launch Style Profile Set Record

```yaml
style_profile_set:
  status: required_before_SEAT_bucket_upload
  standing: requirement_record_only
  governing_principle: frontend_renders_seated_runtime_state_only
  inspected_existing_sources:
    - docs/seat/measures_registry/11_style_contracts/sitewide_visual_system_contract.meta.md
    - docs/seat/measures_registry/11_style_contracts/obsidian_assessment_style_contract.meta.md
    - docs/seat/measures_registry/11_style_contracts/undrifted_publication_style_contract.meta.md
    - docs/seat/measures_registry/11_style_contracts/lapis_encounter_style_contract.meta.md
    - docs/seat/measures_registry/11_style_contracts/no_visual_drift_validation.meta.md
  sitewide_frame:
    governs:
      - typography scale
      - spacing rhythm
      - viewport containment
      - mobile/laptop containment
      - buttons and CTA behavior
      - registry mark placement
      - media controls
      - header/footer visibility rules
      - image/card polish
  obsidian_assessment_profile:
    visual_target: blue_signal_assessment_landing
    material_semantics: threshold_correction
    applies_to:
      - AI Operations Assessment landing
      - assessment questions
      - findings preparation
      - risk factor carrythrough
    requirements:
      - cinematic dark field
      - blue signal lines
      - sharp modern layout
      - high-contrast typography
      - no generic SaaS cards
      - no scroll bloat
  lapis_undrifted_profile:
    visual_target: unDrifted_publication_surface
    material_semantics: relation_transition
    applies_to:
      - unDrifted landing
      - article cards
      - article overlay/panel
      - Paragraph integration references
      - social dispatch surfaces
    requirements:
      - editorial hierarchy
      - publication identity
      - sharp article cards
      - onsite article reading
      - Paragraph source link secondary only
  marble_protocol_profile:
    visual_target: Measures_Assessment_Protocol_surface
    material_semantics: inscription_governance
    applies_to:
      - Measures Assessment Protocol
      - c3 7s confirmation
      - payment-of-scope boundary
      - scope/delivery review
    requirements:
      - marble/light governance surface
      - polished institutional layout
      - clear boundary copy
      - no SEAT/SEAL/c3 Key/DAO/Branch claim
  blocked:
    - generic_web_layout
    - unstyled_default_cards
    - single_flat_theme
    - hardcoded_inline_style_as_authority
    - style_not_bound_to_chamber_or_surface
```

## Boundary

This record seats launch style profile requirements for later implementation. It does not mutate CSS, runtime, renderer, routes, database rows, bucket files, public copy, or launch state.
