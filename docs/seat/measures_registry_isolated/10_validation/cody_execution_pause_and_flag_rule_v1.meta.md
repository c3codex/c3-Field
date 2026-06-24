---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Cody Execution Pause and Flag Rule v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_cody_flag_to_notchazz_validation_route_for_chazz_prepared_oar2_drift_protection_v1.meta.md
---

# Cody Execution Pause and Flag Rule v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true

Cody:
  type: Codex_role_called_ai
  visibility: internal_execution_actor
  executes_only_from_OAR2: true
  may_flag_NotChazz: true
  must_pause_when_flag_condition_detected: true
  writes_OAR1_evidence: true

blocked:
  - execute_from_chat_intent
  - execute_conflicting_OAR2
  - execute_when_NotChazz_flag_unresolved
  - execute_authority_change_without_operator_disposition
