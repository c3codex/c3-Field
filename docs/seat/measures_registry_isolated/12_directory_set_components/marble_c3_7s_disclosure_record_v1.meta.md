---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Marble c3 7s Disclosure Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_marble_map_payment_scope_style_profile_and_c3_7s_disclosure_v1.meta.md
---

# Marble c3 7s Disclosure Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  payment_activation_authorized_now: false

surface:
  surface_key: measures_assessment_protocol_payment_scope
  chamber_authority: marble
  disclosure_type: c3_7s_acknowledgment_before_payment

c3_7s:
  public_label: The c3 7s
  function:
    - confirm_parties
    - confirm_scope
    - confirm_access_boundary
    - confirm_review_method
    - confirm_delivered_findings
    - confirm_payment_of_scope
    - confirm_receipt_and_access_after_payment

acknowledgment_text:
  value: I acknowledge the c3 7s, MAP scope, delivered findings, and payment-of-scope terms.
  required_before_payment: true

plain_language:
  value: The c3 7s establish the visible confirmation structure before payment. They confirm what is being reviewed, who remains responsible, what is delivered, and what payment-of-scope opens.

does_not_create:
  - SEAT
  - SEAL
  - Registry_Standing_for_client
  - c3_Key
  - DAO_participation
  - Branch_standing_for_client
  - voting_rights
  - treasury_eligibility
  - certification
