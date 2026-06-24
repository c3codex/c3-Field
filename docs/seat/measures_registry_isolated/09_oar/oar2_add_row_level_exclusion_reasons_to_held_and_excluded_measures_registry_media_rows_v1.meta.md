---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Add Row-Level Exclusion Reasons to Held and Excluded Measures Registry Media Rows v1
status: proposed
version: v1
operator: op044
priority: complete_media_disposition_matrix_for_send_card_retry
source_blocked_send_card_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md
source_media_disposition_matrix: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md
standing:
  send_card_blocked: true
  blocker_reason: excluded_media_rows_do_not_contain_required_row_level_exclusion_reason
  media_disposition_matrix_exists: true
  media_disposition_matrix_complete_for_send_card: false
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason: 3
  excluded_rows_with_row_level_exclusion_reason: 0
  row_level_exclusion_reason_required: true
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false
  runtime_active: false
mutation_scope:
  local_docs_mutation: true
  media_disposition_matrix_completion: true
  row_level_exclusion_reason_addition: true
  validation_records: true
  send_card_creation: false
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

# OAR2 - Add Row-Level Exclusion Reasons to Held and Excluded Measures Registry Media Rows v1

## OBSERVED

The send_card OAR1 returned:

status: blocked_missing_media_disposition_matrix

The actual blocker was not absence of the matrix.

The matrix exists, but it is incomplete for send_card delivery.

The send_card OAR1 confirmed:

- media_disposition_matrix_exists: true
- media_disposition_matrix_complete_for_send_card: false
- held_media_count: 3
- excluded_media_count: 3
- held_rows_with_row_level_hold_reason: 3
- excluded_rows_with_row_level_exclusion_reason: 0
- summary_exclusion_reason_assertion_present: true
- blocker_reason: excluded_media_rows_do_not_contain_required_row_level_exclusion_reason
- send_card_created: false
- exact_manifest_build_allowed: false
- bucket_upload_allowed: false
- bucket_write_allowed: false

The required next action is:

- add explicit exclusion reason to each of the three excluded media rows
- revalidate held and excluded row counts
- rerun the saved send_card OAR2

## ALIGNED

This OAR2 completes the media disposition matrix for send_card use.

This is not a manifest build.

This is not send_card creation.

This is not bucket upload or bucket write.

This is a row-level documentation correction required before send_card can be delivered.

This OAR2 may:

- read the blocked send_card OAR1
- read the media disposition matrix
- identify the three excluded media rows
- add explicit row-level exclusion reasons to each excluded row
- preserve the three held media row hold reasons
- revalidate held and excluded row counts
- create a corrected media disposition matrix validation
- create a front-facing operator report
- create an internal process report
- create OAR1 closeout

This OAR2 may not:

- create send_card
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

## ROW-LEVEL EXCLUSION REASON RULE

row_level_exclusion_reason_rule:
  summary_exclusion_reason_is_not_sufficient: true

  each_excluded_media_row_must_include:
    - media_key
    - file_name
    - media_group
    - surface_mapping
    - runtime_scope
    - release_state
    - upload_disposition
    - exclusion_reason
    - required_next_action

  exclusion_reason_must_answer:
    - why_this_media_row_is_excluded
    - what_surface_or_runtime_scope_it_would_have_affected
    - whether_exclusion_is_temporary_or_governed_current_scope
    - what_action_would_be_needed_to_include_it_later

  send_card_dependency:
    send_card_may_not_be_created_until_all_excluded_rows_have_row_level_exclusion_reason: true

## ROUTED

1. Read blocked send_card OAR1.

Read:

docs/seat/measures_registry_isolated/09_oar/oar1_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md

Confirm:

- status: blocked_missing_media_disposition_matrix
- media_disposition_matrix_exists: true
- media_disposition_matrix_complete_for_send_card: false
- held_media_count: 3
- excluded_media_count: 3
- held_rows_with_row_level_hold_reason: 3
- excluded_rows_with_row_level_exclusion_reason: 0
- blocker_reason: excluded_media_rows_do_not_contain_required_row_level_exclusion_reason
- send_card_created: false
- exact_manifest_build_allowed: false
- bucket_upload_allowed: false
- bucket_write_allowed: false

If missing or mismatch, stop and write OAR1 blocked_missing_blocked_send_card_oar1.

2. Read media disposition matrix.

Read:

docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md

Identify:

- the 3 held media rows
- the 3 excluded media rows
- all existing hold reasons
- all existing summary exclusion assertions
- missing row-level exclusion reason fields

If missing, stop and write OAR1 blocked_missing_media_disposition_matrix_source.

3. Add row-level exclusion reasons to each excluded media row.

Update or create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_row_level_exclusion_reasons_v1.meta.md

Required content:

standing:
  status: row_level_exclusion_reasons_added
  source_matrix: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason: 3
  excluded_rows_with_row_level_exclusion_reason: 3
  send_card_ready_after_validation: true
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false

held_media_rows:
  - media_key:
    file_name:
    media_group:
    surface_mapping:
    runtime_scope:
    release_state:
    upload_disposition:
    hold_reason:
    required_next_action:

excluded_media_rows:
  - media_key:
    file_name:
    media_group:
    surface_mapping:
    runtime_scope:
    release_state:
    upload_disposition:
    exclusion_reason:
    exclusion_scope:
      allowed:
        - current_manifest_scope_only
        - held_until_source_confirmed
        - held_until_surface_confirmed
        - not_selected_for_current_package
        - duplicate_or_superseded_media
        - reference_only_not_upload_payload
    temporary_or_current_scope:
    required_next_action:

summary:
  row_level_exclusion_reason_completion: true
  send_card_can_be_retried: true
  manifest_build_still_blocked_until_send_card_resolution: true

4. Create exclusion reason validation record.

Create:

docs/seat/measures_registry_isolated/10_validation/held_excluded_media_row_level_reason_validation_v1.meta.md

Required content:

standing:
  status: completed_or_blocked
  exact_manifest_build_allowed: false
  send_card_creation_allowed_next: true_or_false

validation:
  source_send_card_blocker_oar1_read: true_or_false
  source_media_disposition_matrix_read: true_or_false
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason:
  excluded_rows_with_row_level_exclusion_reason:
  all_excluded_rows_have_exclusion_reason: true_or_false
  all_excluded_rows_have_required_next_action: true_or_false
  send_card_ready_for_retry: true_or_false

recommended_next_oar2_if_ready:
  title: OAR2 - Rerun send_card Creation for Held and Excluded Media Before Manifest Build v1

recommended_next_oar2_if_not_ready:
  title: OAR2 - Resolve Remaining Media Disposition Matrix Row-Level Reason Blockers v1

5. Create front-facing operator report.

Create:

docs/seat/measures_registry_isolated/10_validation/front_facing_operator_report_row_level_exclusion_reasons_added_v1.meta.md

Required content:

# Media Disposition Matrix Updated

Chazz reviewed the send_card blocker.

The media disposition matrix existed, but the excluded media rows were missing row-level exclusion reasons.

Those exclusion reasons are required so the operator can review exactly what is being excluded before manifest build.

The matrix has been updated for review.

No send_card was created in this step.

No manifest was built.

No upload occurred.

No bucket write occurred.

No database, runtime, route, payment, Stripe, Paragraph, social, Buffer, or email action occurred.

Do not mention NotChazz.
Do not mention Cody.
Do not expose internal process mechanics.

6. Create internal process report.

Create:

docs/seat/measures_registry_isolated/10_validation/internal_process_report_row_level_exclusion_reasons_added_v1.meta.md

Required content:

standing:
  status: internal_process_report
  row_level_exclusion_reasons_added: true
  send_card_blocker_resolved: true_or_false
  exact_manifest_build_allowed: false

internal_trace:
  blocked_send_card_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md
  media_disposition_matrix: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md
  held_media_count: 3
  excluded_media_count: 3
  prior_excluded_rows_with_row_level_exclusion_reason: 0
  corrected_excluded_rows_with_row_level_exclusion_reason: 3

7. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_add_row_level_exclusion_reasons_to_held_and_excluded_measures_registry_media_rows_v1.meta.md

OAR1 must report:

- source OAR2 path
- blocked send_card OAR1 path read
- media disposition matrix path read
- row-level exclusion reasons matrix path
- exclusion reason validation path
- front-facing operator report path
- internal process report path
- held media count
- excluded media count
- held rows with row-level hold reason
- excluded rows with row-level exclusion reason
- all excluded rows have exclusion reason true/false
- all excluded rows have required next action true/false
- send_card ready for retry true/false
- exact manifest build allowed false
- send_card created false
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

OAR2 - Rerun send_card Creation for Held and Excluded Media Before Manifest Build v1

## VALIDATION RETURN

Return:

- status
- row-level exclusion reasons matrix path
- exclusion reason validation path
- front-facing operator report path
- internal process report path
- held media count
- excluded media count
- excluded rows with row-level exclusion reason
- send_card ready for retry true/false
- exact manifest build allowed false
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 adds row-level exclusion reasons to the excluded media rows.

It prepares the media disposition matrix for send_card retry.

It does not create send_card.

It does not build manifest.

It does not upload.

It does not write to bucket.

It does not mutate DB, policies, rows, RLS, runtime, routes, renderer, public copy, payment, Stripe, social, Buffer, Paragraph, or email.

Codex holds.
Field structures.
Measures registers.
send_card requires row-level exclusion reasons.
