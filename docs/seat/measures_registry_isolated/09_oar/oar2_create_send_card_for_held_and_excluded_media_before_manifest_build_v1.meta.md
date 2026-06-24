---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Create send_card for Held and Excluded Media Before Manifest Build v1
status: proposed
version: v1
operator: op044
priority: send_card_required_before_manifest_threshold
source_media_resolution_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
standing:
  send_card_required: true
  send_card_type: constraint_agreement_resolution_delivery
  media_resolution_completed_with_governed_holds: true
  held_media_count: 3
  excluded_media_count: 3
  unresolved_media_remaining_after_review: 0
  prior_ready_for_exact_manifest_build_oar2: true
  corrected_ready_for_exact_manifest_build_oar2: conditional_pending_send_card_resolution
  operator_action_required_before_manifest_build: true
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false
  runtime_active: false
mutation_scope:
  local_docs_mutation: true
  send_card_creation: true
  constraint_agreement_resolution_delivery: true
  readiness_gate_correction: true
  exact_manifest_build: false
  bucket_upload: false
  bucket_write: false
  bucket_delete: false
  bucket_overwrite: false
  bucket_move: false
  database: false
  policies: false
  rows: false
  rls: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  payment_activation: false
  stripe_activation: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
---

# OAR2 - Create send_card for Held and Excluded Media Before Manifest Build v1

## OBSERVED

The media resolution OAR1 returned:

status: completed_media_resolution_with_governed_holds

It reported:

- total_media_rows_reviewed: 12
- upload_ready_media_count: 9
- already_present_media_count: 9
- held_media_count: 3
- excluded_media_count: 3
- unresolved_media_remaining_after_review: 0
- all_media_upload_ready_or_held_with_reason: true
- ready_for_exact_manifest_build_oar2: true

Held or excluded media affects what crosses the exact manifest threshold.

A governed hold or exclusion cannot silently pass into manifest build.

Therefore the manifest-readiness standing must be corrected from:

ready_for_exact_manifest_build_oar2: true

to:

ready_for_exact_manifest_build_oar2: conditional_pending_send_card_resolution

## ALIGNED

This OAR2 creates a send_card for held and excluded media before exact manifest build.

send_card means:

constraint_agreement_resolution_delivery

The send_card is public-facing and operator-readable.

The send_card must tell the operator:

1. what the problem is
2. what action is needed from operator
3. what resolution will be sent back to the sender

This OAR2 may:

- read the media resolution OAR1
- read the 12-row media disposition matrix
- identify held media rows
- identify excluded media rows
- create a send_card
- create corrected manifest readiness gate
- create front-facing operator report
- create internal process report
- create OAR1 closeout

This OAR2 may not:

- build exact manifest
- upload to bucket
- write to bucket
- delete bucket objects
- overwrite bucket objects
- move bucket objects
- mutate DB
- mutate policies
- mutate rows
- mutate RLS
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate payment
- activate Stripe
- publish Paragraph
- post or schedule social
- activate Buffer
- send email

## SEND_CARD RULE

send_card:
  function: constraint_agreement_resolution_delivery
  visibility: public_facing
  actor: Chazz
  purpose:
    - explain_the_problem
    - state_action_needed_from_operator
    - record_operator_decision
    - return_resolution_to_sender

  does_not_expose:
    - NotChazz
    - Cody
    - internal_OAR_mechanics
    - raw_validation_seams

  required_sections:
    constraint:
      purpose: explain_what_problem_blocks_threshold
    agreement:
      purpose: show_operator_decision_options
    resolution:
      purpose: define_what_is_returned_after_operator_decision

## CURRENT SEND_CARD

send_card_held_excluded_media:
  send_card_id: send_card_held_excluded_media_before_manifest_build_v1
  source_event: media_resolution_before_manifest_build
  recipient: operator
  sender: Measures_Registry_system_process
  status: awaiting_operator_action

  constraint:
    label: Held / Excluded Media Before Manifest Build
    problem: Three media rows are held and three media rows are excluded.
    why_it_matters: Held or excluded media changes what crosses the exact manifest threshold.
    affected_scope:
      - exact_manifest_build
      - SEAT_upload_package
      - media_manifest_readiness
    threshold_blocked: exact_manifest_build

  agreement:
    action_needed_from_operator: Review and accept, revise, or block the held/excluded media disposition before manifest build.
    options:
      - accept_held_excluded_media_disposition
      - request_media_resolution_rework
      - reclassify_media_rows
      - block_manifest_build
    required_before:
      - exact_manifest_build
      - manifest_threshold_crossing
    authority_boundary: operator_decision_required_because_manifest_contents_are_affected

  resolution:
    if_accept:
      operator_decision: accept_held_excluded_media_disposition
      next_system_action: manifest_build_may_be_requested_by_next_OAR2
      return_message_to_sender: Operator accepted the held/excluded media disposition. Manifest build may proceed under a separate OAR2.

    if_rework:
      operator_decision: request_media_resolution_rework
      next_system_action: reroute_media_resolution
      return_message_to_sender: Operator requested media rework before manifest build.

    if_reclassify:
      operator_decision: reclassify_media_rows
      next_system_action: update_media_disposition_and_revalidate
      return_message_to_sender: Operator reclassified one or more held/excluded media rows. Media readiness must be revalidated.

    if_block:
      operator_decision: block_manifest_build
      next_system_action: hold_manifest_build
      return_message_to_sender: Operator blocked manifest build pending further review.

## ROUTED

1. Read media resolution OAR1.

Read:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md

Confirm:

- status: completed_media_resolution_with_governed_holds
- held_media_count: 3
- excluded_media_count: 3
- unresolved_media_remaining_after_review: 0
- all_media_upload_ready_or_held_with_reason: true
- ready_for_exact_manifest_build_oar2: true
- exact_manifest_build_confirmation: false
- bucket_upload_confirmation: false
- bucket_write_confirmation: false

If missing or mismatch, stop and write OAR1 blocked_missing_media_resolution_oar1.

2. Read media disposition matrix.

Read:

docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md

Extract:

- all held media rows
- all excluded media rows
- media_key
- file_name
- media_group
- surface_mapping
- runtime_scope
- release_state
- upload_disposition
- hold_reason
- exclusion_reason
- required_next_action

If missing or incomplete, stop and write OAR1 blocked_missing_media_disposition_matrix.

3. Create send_card.

Create:

docs/seat/measures_registry_isolated/10_validation/send_card_held_excluded_media_before_manifest_build_v1.meta.md

Required content:

standing:
  status: awaiting_operator_action
  send_card_type: constraint_agreement_resolution_delivery
  public_facing: true
  exact_manifest_build_allowed: false
  operator_action_required: true

constraint:
  label: Held / Excluded Media Before Manifest Build
  problem: Three media rows are held and three media rows are excluded.
  why_it_matters: Held or excluded media changes what crosses the exact manifest threshold.
  affected_scope:
    - exact_manifest_build
    - SEAT_upload_package
    - media_manifest_readiness
  threshold_blocked: exact_manifest_build

agreement:
  action_needed_from_operator: Review and accept, revise, or block the held/excluded media disposition before manifest build.
  options:
    - accept_held_excluded_media_disposition
    - request_media_resolution_rework
    - reclassify_media_rows
    - block_manifest_build

resolution:
  return_to_sender_required: true
  return_message_depends_on_operator_decision: true

held_media_rows:
  - media_key:
    file_name:
    media_group:
    surface_mapping:
    release_state:
    upload_disposition:
    hold_reason:
    required_next_action:

excluded_media_rows:
  - media_key:
    file_name:
    media_group:
    surface_mapping:
    release_state:
    upload_disposition:
    exclusion_reason:
    required_next_action:

4. Create corrected manifest readiness gate.

Create:

docs/seat/measures_registry_isolated/10_validation/manifest_readiness_gate_conditional_pending_send_card_resolution_v1.meta.md

Required content:

standing:
  status: conditional_pending_send_card_resolution
  prior_ready_for_exact_manifest_build_oar2: true
  corrected_ready_for_exact_manifest_build_oar2: false
  reason: held_and_excluded_media_require_send_card_operator_resolution
  exact_manifest_build_allowed: false

readiness_rule:
  manifest_build_allowed_only_after:
    - media_disposition_matrix_exists
    - held_media_rows_have_hold_reason
    - excluded_media_rows_have_exclusion_reason
    - send_card_exists
    - operator_resolution_record_exists
    - resolution_returned_to_sender

5. Create front-facing operator report.

Create:

docs/seat/measures_registry_isolated/10_validation/front_facing_operator_report_send_card_created_for_held_excluded_media_v1.meta.md

Required content:

# send_card Created - Held / Excluded Media Before Manifest Build

Chazz created a send_card for held and excluded media.

The media blocker is technically resolved, but three media rows remain held and three are excluded.

Because held or excluded media affects what crosses the manifest threshold, operator action is required before exact manifest build.

Action needed:

- accept the held/excluded media disposition
- request media resolution rework
- reclassify media rows
- block manifest build

After operator action, the resolution will be returned to the sender and the next system step will be determined.

No manifest was built.

No upload occurred.

No bucket write occurred.

No database, runtime, route, payment, Stripe, Paragraph, social, Buffer, or email action occurred.

Do not mention NotChazz.
Do not mention Cody.
Do not expose internal process mechanics.

6. Create internal process report.

Create:

docs/seat/measures_registry_isolated/10_validation/internal_process_report_send_card_held_excluded_media_v1.meta.md

Required content:

standing:
  status: internal_process_report
  send_card_created: true
  held_or_excluded_media_requires_operator_resolution: true
  exact_manifest_build_allowed: false
  Cody_should_block_manifest_build_until_send_card_resolution: true

internal_trace:
  source_media_resolution_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
  held_media_count: 3
  excluded_media_count: 3
  send_card_type: constraint_agreement_resolution_delivery
  send_card_path: docs/seat/measures_registry_isolated/10_validation/send_card_held_excluded_media_before_manifest_build_v1.meta.md

7. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md

OAR1 must report:

- source OAR2 path
- source media resolution OAR1 path read
- media disposition matrix path read
- send_card path
- corrected manifest readiness gate path
- front-facing operator report path
- internal process report path
- held media count
- excluded media count
- prior ready_for_exact_manifest_build_oar2 value
- corrected ready_for_exact_manifest_build_oar2 value
- operator action required true
- resolution return to sender required true
- exact manifest build allowed false
- bucket upload allowed false
- bucket write allowed false
- DB mutation confirmation false
- RLS mutation confirmation false
- runtime mutation confirmation false
- route mutation confirmation false
- renderer mutation confirmation false
- public copy mutation confirmation false
- payment activation confirmation false
- Stripe activation confirmation false
- social posting confirmation false
- social scheduling confirmation false
- Buffer activation confirmation false
- Paragraph publishing confirmation false
- email send confirmation false
- recommended next OAR2 title

Recommended next OAR2 title:

OAR2 - Record Operator send_card Resolution for Held and Excluded Media Before Manifest Build v1

## VALIDATION RETURN

Return:

- status
- send_card path
- corrected manifest readiness gate path
- front-facing operator report path
- internal process report path
- held media count
- excluded media count
- operator action required true/false
- resolution return to sender required true/false
- exact manifest build allowed false
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 creates a send_card for held and excluded media before exact manifest build.

send_card is the public-facing constraint / agreement / resolution delivery object.

No manifest build is authorized.

No upload is authorized.

No bucket write is authorized.

Codex holds.
Field structures.
Measures registers.
Held or excluded media cannot silently cross threshold.
send_card carries the problem, operator action, and resolution return.
