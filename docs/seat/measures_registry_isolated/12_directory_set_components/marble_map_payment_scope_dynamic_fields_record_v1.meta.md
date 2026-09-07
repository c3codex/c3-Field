---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Marble MAP Payment Scope Dynamic Fields Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_marble_map_payment_scope_style_profile_and_c3_7s_disclosure_v1.meta.md
---

# Marble MAP Payment Scope Dynamic Fields Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  payment_activation_authorized_now: false

DB_driven_fields:
  required:
    - MAP_review_type
    - delivered_findings_name
    - review_scope_summary
    - method_summary
    - payment_amount
    - payment_currency
    - payment_interval
    - payment_status
    - survey_access_status
    - acknowledgement_status
    - receipt_state

must_not_hardcode:
  - payment_amount
  - payment_status
  - survey_access_status
  - receipt_state
  - checkout_url
  - payment_provider_state

payment_boundary:
  payment_of_scope_creates:
    - MAP_review_payment_confirmation
    - receipt
    - survey_access

  payment_of_scope_does_not_create:
    - SEAT
    - SEAL
    - Registry_Standing_for_client
    - c3_Key
    - DAO_participation
    - Branch_standing_for_client
    - certification

future_activation_requires:
  - payment_provider_path_confirmed
  - DB_payment_row_or_source_confirmed
  - receipt_delivery_rule_confirmed
  - survey_access_rule_confirmed
  - OAR2_authorizing_payment_activation
  - OAR1_returning_payment_evidence
