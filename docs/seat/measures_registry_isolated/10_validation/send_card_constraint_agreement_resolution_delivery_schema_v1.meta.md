---
document_type: send_card_schema
authority_level: system_intel
system_scope: measures_codex
title: send_card Constraint Agreement Resolution Delivery Schema v1
status: schema_seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_send_card_constraint_agreement_resolution_delivery_registry_expansion_v1.meta.md
---

standing:
  status: schema_seated
  send_card_type: constraint_agreement_resolution_delivery
  public_facing: true
  reusable_delivery_object: true
  runtime_active: false

schema:
  include:
    - send_card_id
    - source_event
    - sender
    - recipient
    - related_env_key
    - related_surface_key
    - constraint
    - agreement
    - resolution
    - status
    - OAR1_trace_required
  constraint_fields:
    - label
    - problem
    - why_it_matters
    - affected_scope
    - threshold_blocked
    - cannot_proceed_until
  agreement_fields:
    - action_needed_from_recipient
    - action_needed_from_operator
    - options
    - required_before
    - authority_boundary
  resolution_fields:
    - decision
    - decision_by
    - resolution_summary
    - next_system_action
    - return_message_to_sender
    - returned_at
  OAR1_trace_required: true

authority_boundary:
  activates_runtime: false
  authorizes_manifest_build: false
  authorizes_bucket_upload: false
  authorizes_DB_mutation: false
  authorizes_public_release: false
