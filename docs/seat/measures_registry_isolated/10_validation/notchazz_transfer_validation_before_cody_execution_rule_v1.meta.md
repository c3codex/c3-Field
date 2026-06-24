---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: NotChazz Transfer Validation Before Cody Execution Rule v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_cody_flag_to_notchazz_validation_route_for_chazz_prepared_oar2_drift_protection_v1.meta.md
---

# NotChazz Transfer Validation Before Cody Execution Rule v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true

NotChazz:
  type: rooted_system_process
  visibility: internal_only
  validates:
    - Chazz_prepared_OAR2
    - transfer_to_Cody
    - whether_operator_authority_is_already_seated
    - whether_Cody_flag_requires_block_or_return

classification:
  clear_to_execute: Cody_executes
  return_to_Chazz_for_revision: Chazz_revises_OAR2
  return_to_operator: operator_decision_required
  block_execution: Cody_does_not_execute
