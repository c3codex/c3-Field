---
document_type: system_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Role Key Assignment Rule for c3 TREE Intake v1
status: system_intel_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_role_key_assignment_and_callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md
---

# Role Key Assignment Rule for c3 TREE Intake v1

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

role_key_function:
  - authorize_callable_Chazz_roles
  - bind_identity_context
  - bind_thread_context
  - prevent_generic_chat_authority
  - prevent_direct_Cody_execution

assignment_states:
  - candidate
  - active
  - held
  - expired
  - revoked
  - requires_operator_review
