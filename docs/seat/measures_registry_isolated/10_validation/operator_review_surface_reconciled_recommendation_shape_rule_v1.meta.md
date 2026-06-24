---
document_type: process_requirement
authority_level: local_documentation
system_scope: measures_codex
title: Operator Review Surface Reconciled Recommendation Shape Rule v1
status: active_process_requirement
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_actor_visibility_and_operator_review_reporting_rule_for_mr_backoffice_process_intel_v1.meta.md
---

# Operator Review Surface Reconciled Recommendation Shape Rule v1

standing:
  status: active_process_requirement
  held_for_mr_backoffice: true
  review_surface_shape_rule: true

rule:
  operator_review_surfaces_must_not_be_test_like: true
  Chazz_must_reconcile_safe_standing_first: true
  operator_must_only_approve_or_name_exception: true
  front_facing_surface_must_expose_only_Chazz: true
  internal_surface_may_preserve_process_actor_trace: true

operator_action_pattern:
  - Approved.
  - Approved except change [specific item] to [operator disposition].
