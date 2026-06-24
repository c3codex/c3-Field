---
document_type: send_card_status_registry
authority_level: system_intel
system_scope: measures_codex
title: send_card Status Registry v1
status: registry_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_send_card_constraint_agreement_resolution_delivery_registry_expansion_v1.meta.md
---

standing:
  status: registry_seated
  runtime_active: false

allowed_statuses:
  - draft
  - awaiting_operator_action
  - awaiting_recipient_action
  - accepted
  - revised
  - held
  - rejected
  - resolved
  - returned_to_sender
  - blocked

status_meanings:
  draft: modeled_but_not_delivered
  awaiting_operator_action: operator_decision_required_before_next_system_action
  awaiting_recipient_action: non_operator_recipient_response_required
  accepted: disposition_or_resolution_accepted
  revised: revision_requested
  held: matter_validly_held_and_unresolved
  rejected: proposed_action_rejected
  resolved: decision_made_and_system_action_determined
  returned_to_sender: resolution_sent_back_to_origin
  blocked: process_cannot_proceed_under_current_authority
