---
document_type: system_intel_route_rule
authority_level: local_documentation
system_scope: measures_codex
title: c3 TREE Route Determination from Role Key Thread env_key v1
status: system_intel_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_role_key_assignment_and_callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md
---

# c3 TREE Route Determination from Role Key Thread env_key v1

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true

route_inputs:
  - role_key
  - thread
  - env_key_if_existing
  - current_surface_context
  - identity_or_contact_standing
  - release_state
  - dependency_state

route_outputs:
  - status_only
  - guided_survey_required
  - live_call_should_be_scheduled
  - report_delivery_required
  - OAR2_required
  - operator_review_required
  - blocked
