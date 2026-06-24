---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Front-Facing Operator Review Report Mode v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_actor_visibility_and_operator_review_reporting_rule_for_mr_backoffice_process_intel_v1.meta.md
---

# Front-Facing Operator Review Report Mode v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true
  report_mode: front_facing_operator

visible_actor:
  - Chazz

suppress:
  - NotChazz
  - Cody
  - internal_hard_stop_machinery
  - executor_references
  - OAR_implementation_seam

required_shape:
  - current_standing
  - reconciled_by_Chazz
  - operator_input_required
  - recommended_disposition
  - approve_or_exception_action
  - current_boundary
