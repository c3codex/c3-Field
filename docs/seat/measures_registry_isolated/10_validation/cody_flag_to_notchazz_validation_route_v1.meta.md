---
document_type: process_intel_route
authority_level: local_documentation
system_scope: measures_codex
title: Cody Flag to NotChazz Validation Route v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_cody_flag_to_notchazz_validation_route_for_chazz_prepared_oar2_drift_protection_v1.meta.md
---

# Cody Flag to NotChazz Validation Route v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

route:
  Chazz_prepares_OAR2: true
  NotChazz_validates_transfer: true
  Cody_reviews_against_Codex_state: true
  Cody_may_flag_NotChazz: true
  Cody_must_pause_if_flag_required: true

flag_conditions:
  - OAR2_conflicts_with_Codex_state
  - OAR2_exceeds_operator_approved_scope
  - OAR2_implies_activation_not_authorized
  - OAR2_contains_hidden_inference
  - required_source_evidence_is_missing
  - file_count_or_manifest_count_drift_appears
