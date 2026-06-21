---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Recover Exact Measures Registry Baseline Upload Manifest Paths v1
status: proposed
version: v1
operator: op044
priority: recover_exact_56_baseline_paths_before_89_file_bucket_manifest
source_blocked_exact_manifest_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_seat_exact_measures_registry_seat_89_file_bucket_upload_manifest_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  bucket_move: false
  bucket_access: false
  local_docs_mutation: true
  email_send: false
  resend_mutation: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  paragraph_publish: false
  payment_activation: false
---

# OAR2 - Recover Exact Measures Registry Baseline Upload Manifest Paths v1

## OBSERVED

The exact 89-file bucket upload manifest could not be seated.

The blocker OAR1 reported:

- expected upload count: 89
- baseline required rows count: 56
- baseline exact rows count: 0
- added exact rows count: 33
- total exact rows count: 33
- ready for bucket upload OAR2: false
- blocker: blocked_missing_exact_baseline_manifest

Cody checked available baseline source documents and found count and representative rows only.

The baseline 56 cannot be used for bucket upload until exact row-level local paths and bucket paths are recovered and seated.

This OAR2 recovers or seats the exact 56-file baseline upload manifest.

This OAR2 does not upload.

## ALIGNED

The no-inference rule remains active.

Count-only standing is not upload authority.

Directory globbing may be used only as recovery evidence, not final upload authority by itself.

This OAR2 must produce one of two outcomes:

1. recovered_exact_baseline_manifest_ready_for_operator_confirmation

or

2. blocked_missing_recoverable_baseline_rows

If exact prior baseline rows are found in confirmed docs, Cody may seat them directly.

If exact prior baseline rows are not found in confirmed docs, Cody may create a recovery candidate from local filesystem evidence only if:

- it is clearly marked as recovery_candidate
- each row has exact local_path and proposed bucket_path
- each row passes held/execution exclusion checks
- total rows equal 56
- operator confirmation is required before bucket upload authority can use it

This OAR2 does not authorize bucket upload from recovery candidate alone unless the recovery record explicitly confirms operator-reviewed baseline standing. If operator review is still pending, next OAR2 must confirm it before the 89-file manifest is rebuilt.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

## 1. Read blocker evidence

Read:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_exact_measures_registry_seat_89_file_bucket_upload_manifest_v1.meta.md

Confirm:

status: blocked_missing_exact_baseline_manifest
baseline_required_rows_count: 56
baseline_exact_rows_count: 0
added_exact_rows_count: 33
ready_for_bucket_upload_oar2: false

If blocker evidence does not match, stop and write OAR1 blocked_unexpected_manifest_state.

## 2. Search for exact baseline row source

Search under:

docs/seat/measures_registry_isolated/

Search filenames and contents for:

- exact 56
- baseline_exact
- row_number
- local_path
- bucket_path
- measures_registry_confirmed_reduced_seat_upload_manifest
- measures_registry_seat_bucket_placement_plan
- reduced_seat_upload_candidate_manifest
- confirmed_reduced_seat_upload_manifest
- seat/current/01_source
- seat/current/02_evidence
- seat/current/03_policy_security
- seat/current/04_directory_set

Candidate source files to inspect first:

docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md
docs/seat/measures_registry_isolated/09_oar/oar1_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md

If a confirmed exact 56-row source exists, use it.

If no confirmed exact 56-row source exists, proceed to recovery candidate mode.

## 3. Recovery candidate mode

If exact baseline rows are not found in confirmed docs, Cody may inspect local filesystem under:

docs/seat/measures_registry_isolated/

Allowed baseline source folders:

docs/seat/measures_registry_isolated/00_index/
docs/seat/measures_registry_isolated/01_contracts/
docs/seat/measures_registry_isolated/02_encounters/
docs/seat/measures_registry_isolated/03_chamber_directories/
docs/seat/measures_registry_isolated/04_integrations/
docs/seat/measures_registry_isolated/05_automation/
docs/seat/measures_registry_isolated/06_runtime_surfaces/
docs/seat/measures_registry_isolated/07_media_assets/
docs/seat/measures_registry_isolated/08_mrm_contact_memory/
docs/seat/measures_registry_isolated/09_oar/
docs/seat/measures_registry_isolated/10_validation/
docs/seat/measures_registry_isolated/11_style_contracts/
docs/seat/measures_registry_isolated/12_directory_set_components/

But Cody must exclude:

- held_appendix
- held_backoffice
- archive_only
- payment_activation
- runtime_mutation
- DB_mutation
- database_mutation
- policy_mutation
- RLS_mutation
- route_mutation
- renderer_mutation
- public_copy_mutation
- Paragraph_publish_execution
- social_post_execution
- social_schedule_execution
- email_send_execution
- Buffer_execution
- c3_key_activation
- SEAT_activation
- SEAL_activation
- certification_activation
- DAO_participation_activation

Recovery candidate rules:

- Do not infer meaning from filename alone.
- Do not include generated addendum records already counted in the 33 additions.
- Do not include validation artifacts created after the original reduced 56 unless they were part of the original confirmed reduced manifest.
- Do not include OAR2 files unless original manifest evidence indicates they were included in the baseline.
- Do not include OAR1 files unless original manifest evidence indicates they were included in the baseline.
- Prefer records named or placed as source, evidence, policy/security, or directory-set baseline records.
- If more than 56 possible baseline files are found, stop and report ambiguity.
- If fewer than 56 possible baseline files are found, stop and report missing rows.
- If exactly 56 baseline candidates are found and all pass exclusions, seat them as recovery_candidate_pending_operator_confirmation.

## 4. Build exact baseline row manifest

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_exact_56_baseline_bucket_upload_manifest_v1.meta.md

Required content:

standing:
  status: exact_baseline_manifest_recovered_or_candidate_or_blocked
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  policy_mutation_authorized: false
  public_copy_mutation_authorized: false
  payment_activation_authorized: false
  paragraph_publish_authorized: false
  social_posting_authorized: false
  social_scheduling_authorized: false
  buffer_activation_authorized: false
  email_send_authorized: false

source_evidence:
  blocked_exact_manifest_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_seat_exact_measures_registry_seat_89_file_bucket_upload_manifest_v1.meta.md
  baseline_sources_checked:
    - list_sources_checked
  exact_prior_manifest_found: true_or_false
  recovery_candidate_mode_used: true_or_false

count_summary:
  required_baseline_count: 56
  recovered_baseline_rows_count: integer
  count_valid: true_or_false

manifest_rows:
  - row_number: 1
    local_path: exact_local_path
    bucket_path: exact_bucket_path
    placement_group: exact_placement_group
    source_set: baseline_confirmed_reduced_manifest_or_recovery_candidate
    file_exists: true_or_false
    upload_allowed: true_or_false
    held_exclusion_check: pass_or_fail
    evidence_basis: confirmed_manifest_or_filesystem_recovery_candidate
    notes: optional

validation:
  all_56_rows_present: true_or_false
  all_local_files_exist: true_or_false
  all_bucket_paths_present: true_or_false
  all_placement_groups_present: true_or_false
  held_exclusion_checks_passed: true_or_false
  no_count_only_rows_used: true_or_false
  no_thread_memory_used: true_or_false
  operator_confirmation_required: true_or_false
  ready_for_89_file_manifest_rebuild: true_or_false

blockers:
  rows:
    - list_or_empty

## 5. Build baseline recovery validation record

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_exact_56_baseline_bucket_upload_manifest_validation_v1.meta.md

Required content:

standing:
  status: exact_baseline_validated_or_candidate_pending_operator_confirmation_or_blocked
  bucket_upload_authorized_now: false

validation_result:
  exact_baseline_manifest_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_exact_56_baseline_bucket_upload_manifest_v1.meta.md
  required_baseline_count: 56
  recovered_baseline_rows_count: integer
  exact_prior_manifest_found: true_or_false
  recovery_candidate_mode_used: true_or_false
  all_local_files_exist: true_or_false
  all_bucket_paths_present: true_or_false
  held_exclusion_checks_passed: true_or_false
  no_count_only_rows_used: true_or_false
  no_thread_memory_used: true_or_false
  operator_confirmation_required: true_or_false
  ready_for_89_file_manifest_rebuild: true_or_false

missing_baseline_rows:
  - list_or_empty

ambiguous_baseline_candidates:
  - list_or_empty

excluded_or_held_rows:
  - list_or_empty

blocking_findings:
  rows:
    - list_or_empty

recommended_next_oar2_if_valid:
  title: OAR2 - Rebuild Exact Measures Registry SEAT 89 File Bucket Upload Manifest From Recovered Baseline v1

recommended_next_oar2_if_operator_confirmation_required:
  title: OAR2 - Confirm Recovered Measures Registry Baseline Upload Manifest Before 89 File Rebuild v1

recommended_next_oar2_if_blocked:
  title: OAR2 - Operator Supply Measures Registry Baseline 56 File Manifest v1

## 6. Create OAR1 closeout

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_recover_exact_measures_registry_baseline_upload_manifest_paths_v1.meta.md

OAR1 must report:

- source OAR2 path
- blocked exact manifest OAR1 path
- exact baseline manifest path
- exact baseline validation path
- baseline sources checked
- exact prior manifest found true/false
- recovery candidate mode used true/false
- required baseline count
- recovered baseline rows count
- all local files exist true/false
- all bucket paths present true/false
- all placement groups present true/false
- held exclusion checks passed true/false
- no count-only rows used true/false
- no thread memory used true/false
- operator confirmation required true/false
- ready for 89-file manifest rebuild true/false
- missing baseline rows
- ambiguous baseline candidates
- excluded or held rows
- blockers if any
- no bucket upload confirmation
- no bucket access confirmation
- no bucket delete confirmation
- no bucket overwrite confirmation
- no bucket move confirmation
- no bucket policy mutation confirmation
- no DB mutation confirmation
- no RLS mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no payment activation confirmation
- no social posting confirmation
- no social scheduling confirmation
- no Buffer activation confirmation
- no Paragraph publishing confirmation
- no email send confirmation
- recommended next OAR2 title

Recommended next OAR2 title if exact baseline is valid:

OAR2 - Rebuild Exact Measures Registry SEAT 89 File Bucket Upload Manifest From Recovered Baseline v1

Recommended next OAR2 title if operator confirmation is required:

OAR2 - Confirm Recovered Measures Registry Baseline Upload Manifest Before 89 File Rebuild v1

Recommended next OAR2 title if blocked:

OAR2 - Operator Supply Measures Registry Baseline 56 File Manifest v1

## VALIDATION RETURN

Return:

- recovery status
- exact baseline manifest path
- exact baseline validation path
- baseline sources checked
- exact prior manifest found true/false
- recovery candidate mode used true/false
- required baseline count
- recovered baseline rows count
- all local files exist true/false
- all bucket paths present true/false
- held exclusion checks passed true/false
- no count-only rows used true/false
- no thread memory used true/false
- operator confirmation required true/false
- ready for 89-file manifest rebuild true/false
- blockers
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 recovers the exact 56 baseline upload manifest paths required before the 89-file bucket upload manifest can be rebuilt.

It does not upload.

It does not inspect bucket state.

It does not mutate bucket, DB, policies, runtime, routes, renderer, public copy, payment, social, Buffer, Paragraph, or email.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody recovers baseline manifest evidence.
