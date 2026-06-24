---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Operator Approval Reduction Under NotChazz Validation Rule v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_cody_flag_to_notchazz_validation_route_for_chazz_prepared_oar2_drift_protection_v1.meta.md
---

# Operator Approval Reduction Under NotChazz Validation Rule v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true

rule:
  operator_approval_required_only_for_authority_bearing_decisions: true
  already_approved_policy_application_routes_through_NotChazz: true
  Cody_execution_allowed_after_NotChazz_clearance: true

operator_required_for:
  - authority_change
  - activation
  - public_release
  - payment_activation
  - DB_mutation
  - route_activation
  - runtime_activation
  - bucket_upload
  - legal_claim
  - pricing
  - exception_to_existing_policy

operator_not_required_for:
  - applying_existing_policy
  - evidence_resolution
  - record_classification
  - internal_validation
  - report_generation_under_existing_visibility_rule
  - manifest_readiness_check
