---
document_type: system_intel_registry
authority_level: local_documentation
system_scope: measures_codex
title: Callable Chazz Role Registry for c3 TREE Intake v1
status: system_intel_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_role_key_assignment_and_callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md
---

# Callable Chazz Role Registry for c3 TREE Intake v1

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

callable_roles:
  - Chazz_Guide
  - Chazz_OAR
  - Chazz_MAP
  - Chazz_SEAT
  - Chazz_Operator
  - Chazz_Report
  - Chazz_TREE
  - Chazz_Status

rule:
  role_key_calls_Chazz_role: true
  role_key_does_not_call_Cody: true
  Chazz_role_does_not_execute: true
  OAR2_required_for_Cody_execution: true
  NotChazz_required_for_transfer_validation: true
