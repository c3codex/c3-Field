---
document_type: send_card_grievance_department_expansion
authority_level: system_intel
system_scope: measures_codex
title: send_card Grievance Department Expansion v1
status: expansion_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_send_card_constraint_agreement_resolution_delivery_registry_expansion_v1.meta.md
---

standing:
  status: expansion_seated
  grievance_department_supported: true
  public_facing_delivery: true
  internal_process_suppressed: true

function:
  - problem_delivery
  - operator_or_recipient_action_request
  - decision_capture
  - resolution_return_to_sender
  - OAR1_trace

outcome_rules:
  no_hidden_grievance: true
  no_silent_exclusion: true
  no_unrecorded_override: true
  no_unresolved_blocker_crossing_threshold: true
  sender_receives_resolution: true
  operator_decision_recorded: true
  OAR1_trace_required: true
