---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Marble MAP Payment Scope Style Profile Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_marble_map_payment_scope_style_profile_and_c3_7s_disclosure_v1.meta.md
---

# Marble MAP Payment Scope Style Profile Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  payment_activation_authorized_now: false

profile:
  profile_key: marble_MAP_payment_scope_profile
  chamber_authority: marble
  surface_key: measures_assessment_protocol_payment_scope
  surface_type: MAP_confirmation_and_payment_of_scope
  public_name: Measures Assessment Protocol
  background_media_key: marble_MAP_payment_scope_background
  suggested_background_filename: marble_map_payment_scope_background.webp

purpose:
  - disclose_c3_7s_before_payment
  - confirm_involved_parties
  - confirm_MAP_review_scope
  - confirm_access_boundary
  - confirm_review_method
  - confirm_delivered_findings
  - confirm_payment_of_scope
  - issue_receipt_and_survey_access_after_payment

visual_language:
  material: marble
  mood:
    - institutional
    - calm
    - governed
    - premium
    - ceremonial_but_clear
  palette:
    base: warm_marble_white
    text: deep_navy_black
    accent_primary: governance_gold
    accent_secondary: soft_green_confirmation
    footer: dark_obsidian_navy
  geometry:
    - large_arch_center
    - soft_gold_boundary_lines
    - marble_veining
    - circular_c3_seal
    - side_panel_symmetry
  density: medium_high
  header: minimal
  footer: governed_disclosure_band

style_rule:
  background:
    use_clean_background_without_text: true
    filename: marble_map_payment_scope_background.webp
  UI_overlay:
    panels: translucent_warm_marble
    borders: soft_gold
    confirmation_icons: green_check_small
    main_CTA: deep_navy_button
    secondary_CTA: none
  typography:
    title: elegant_serif
    labels: letterspaced_small_caps
    body: clean_readable_sans

avoid:
  - heavy_blue_obsidian_treatment
  - excessive_glow
  - social_landing_style
  - generic_checkout_page_feel
  - legal_contract_language
