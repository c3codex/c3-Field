---
document_type: system_intel_validation_rule
authority_level: local_documentation
system_scope: measures_codex
title: NotChazz Role Key Validation for Chazz Role Calls v1
status: system_intel_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_role_key_assignment_and_callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md
---

# NotChazz Role Key Validation for Chazz Role Calls v1

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true

validates:
  - role_key_exists
  - role_key_state
  - Chazz_role_allowed_for_role_key
  - thread_scope_matches
  - env_key_present_when_required
  - requested_route_within_allowed_actions
  - no_direct_Cody_call
  - no_held_scope_activation

classification:
  - clear_to_Chazz_role
  - clear_to_Cody_transfer
  - return_to_Chazz_for_reframe
  - return_to_operator
  - block
