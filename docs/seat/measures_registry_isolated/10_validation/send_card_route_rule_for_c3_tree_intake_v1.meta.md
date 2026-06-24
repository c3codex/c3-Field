---
document_type: send_card_route_rule
authority_level: system_intel
system_scope: measures_codex
title: send_card Route Rule for c3 TREE Intake v1
status: route_rule_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_send_card_constraint_agreement_resolution_delivery_registry_expansion_v1.meta.md
---

standing:
  status: route_rule_seated
  runtime_active: false

route_rule:
  Chazz_creates_send_card: true
  send_card_may_trigger_OAR2_when_execution_required: true
  NotChazz_validates_transfer_when_required: true
  Cody_executes_only_validated_OAR2: true
  OAR1_required_for_delivered_or_resolved_send_card: true

OAR2_trigger_conditions:
  - send_card_decision_changes_threshold
  - operator_acceptance_needed_before_manifest
  - system_action_required_after_decision
  - DB_or_runtime_or_manifest_action_requested
  - public_release_or_delivery_requested

non_execution_conditions:
  - status_only
  - non_authority_explanatory_card
  - thread_only_review
  - draft_awaiting_operator_validation
