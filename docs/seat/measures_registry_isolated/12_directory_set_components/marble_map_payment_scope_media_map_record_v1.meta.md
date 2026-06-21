---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Marble MAP Payment Scope Media Map Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_marble_map_payment_scope_style_profile_and_c3_7s_disclosure_v1.meta.md
---

# Marble MAP Payment Scope Media Map Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  bucket_upload_authorized_now: false
  bucket_rename_authorized_now: false

media_map:
  marble_MAP_payment_scope_background:
    filename: marble_map_payment_scope_background.webp
    surface: measures_assessment_protocol_payment_scope
    role: clean_background_without_text
    bucket_status: operator_to_upload_or_confirm
    treatment:
      - full_bleed
      - warm_marble_surface
      - central_arch_or_pedestal
      - no_embedded_text
      - no_UI_text_baked_into_image

rule:
  plain_language: The Marble payment-of-scope surface uses a clean textless background. All copy, panels, c3 7s, payment amount, acknowledgement, and footer disclosures must render as UI from seated records, not as baked image text.

blocked:
  - baked_in_payment_amount
  - baked_in_copy
  - baked_in_footer
  - baked_in_c3_7s
  - baked_in_buttons
