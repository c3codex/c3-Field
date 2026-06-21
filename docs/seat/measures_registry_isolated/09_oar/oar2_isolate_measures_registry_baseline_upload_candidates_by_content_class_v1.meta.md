---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Isolate Measures Registry Baseline Upload Candidates by Content Class v1
status: proposed
version: v1
operator: op044
priority: classify_contaminated_baseline_candidate_pool_before_operator_selection
source_operator_review_table: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
source_operator_template: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_supplied_baseline_56_manifest_template_v1.meta.md
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

# OAR2 - Isolate Measures Registry Baseline Upload Candidates by Content Class v1

## OBSERVED

The operator baseline 56 candidate review table was generated, but the candidate set appears contaminated.

The table contains many files from:

- docs/seat/measures_registry_isolated/09_oar/
- docs/seat/measures_registry_isolated/10_validation/
- recent recovery artifacts
- policy/security evidence
- OAR instruction files
- OAR closeout files
- validation records

The operator observed that the candidates appear to be either OARs or recently created files.

This means the current 67-row candidate review table must not be used for direct baseline selection.

Selecting the first 56 rows would preserve hidden inference and could wrongly treat process/evidence records as baseline content.

## ALIGNED

This OAR2 classifies the current candidate pool by content class before any baseline selection.

This OAR2 does not select the baseline 56.

This OAR2 does not rebuild the 89-file manifest.

This OAR2 does not upload.

This OAR2 does not inspect bucket state.

This OAR2 does not mutate DB, runtime, routes, renderer, public copy, policies, payment, social, Buffer, Paragraph, or email.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

1. Read current candidate review table.

Path:

docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md

Confirm:

- status is operator_review_required
- required_baseline_rows is 56
- candidate rows are present
- include_in_baseline_56 is not operator-confirmed
- bucket_upload_authorized_now is false

If this file is missing or malformed, stop and write OAR1 blocked_missing_candidate_review_table.

2. Read operator-supplied baseline template.

Path:

docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_supplied_baseline_56_manifest_template_v1.meta.md

Confirm:

- status is awaiting_operator_selection_or_direct_supply
- exact_required_rows is 56
- upload_authorized_now is false
- operator_confirmation_required is true

If this file is missing or malformed, continue classification but record missing_template_warning.

3. Classify all candidate rows.

Create a classification table for every candidate row from the 67-row candidate review table.

Allowed content classes:

- original_content_record
- directory_set_component
- source_manifest
- validation_evidence
- OAR_instruction
- OAR_closeout
- policy_security_evidence
- recent_recovery_artifact
- held_or_backoffice
- excluded_from_baseline

Classification signals:

- path segment
- filename prefix
- document_type if readable
- title if readable
- status if readable
- creation or recovery relationship if inferable from current OAR chain
- placement_group proposed by candidate table
- whether it appears to be process evidence rather than package content
- whether already counted in 33 additions
- whether held or execution exclusion risk exists

4. Apply baseline eligibility rule.

For each candidate row, assign:

baseline_eligibility:
  eligible_for_operator_selection: true_or_false
  eligibility_reason: string

Exclude rows from baseline selection if classified as:

- OAR_instruction
- OAR_closeout
- validation_evidence
- policy_security_evidence unless specifically required as baseline policy/security package content
- recent_recovery_artifact
- held_or_backoffice
- excluded_from_baseline
- any row already counted in 33 additions

Rows may remain eligible only if they are true baseline package content, source manifest, or directory-set components from the original reduced upload set and not created by the current recovery/upload blocker chain.

Do not auto-select 56.

Do not fill include_in_baseline_56.

Only mark eligibility.

5. Create content-class isolation record.

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_v1.meta.md

Required content:

standing:
  status: baseline_candidate_pool_classified
  bucket_upload_authorized_now: false
  operator_selection_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  public_copy_mutation_authorized: false

source_evidence:
  candidate_review_table: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
  operator_template: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_supplied_baseline_56_manifest_template_v1.meta.md

classification_summary:
  total_candidate_rows: integer
  original_content_record_count: integer
  directory_set_component_count: integer
  source_manifest_count: integer
  validation_evidence_count: integer
  OAR_instruction_count: integer
  OAR_closeout_count: integer
  policy_security_evidence_count: integer
  recent_recovery_artifact_count: integer
  held_or_backoffice_count: integer
  excluded_from_baseline_count: integer
  eligible_for_operator_selection_count: integer
  ineligible_for_operator_selection_count: integer

candidate_classification_rows:
  - candidate_number: integer
    local_path: exact_local_path
    proposed_bucket_path: proposed_bucket_path
    placement_group: proposed_group
    document_type: if_available
    title: if_available
    status: if_available
    content_class: selected_class
    baseline_eligibility:
      eligible_for_operator_selection: true_or_false
      eligibility_reason: reason
    exclusion_reason: reason_or_null
    already_counted_in_33_additions: true_or_false
    operator_selection_left_blank: true

6. Create narrowed operator review table.

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_56_narrowed_operator_review_table_v1.meta.md

Required content:

standing:
  status: narrowed_operator_review_required_or_blocked_no_clean_56_candidate_set
  bucket_upload_authorized_now: false
  operator_selection_required: true
  cody_auto_selection_authorized: false

source:
  content_class_isolation_record: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_v1.meta.md

candidate_pool:
  original_candidate_count: integer
  eligible_candidate_count: integer
  required_selection_count: 56
  selection_possible_without_ineligible_rows: true_or_false

eligible_candidate_rows:
  - narrowed_candidate_number: integer
    original_candidate_number: integer
    local_path: exact_local_path
    proposed_bucket_path: proposed_bucket_path
    placement_group: proposed_group
    content_class: selected_class
    eligibility_reason: reason
    include_in_baseline_56:
    notes: operator must select or reject

excluded_candidate_rows:
  - original_candidate_number: integer
    local_path: exact_local_path
    content_class: selected_class
    exclusion_reason: reason

selection_rule:
  operator_must_select_exactly_56: true
  selection_from_eligible_rows_only: true
  cody_may_not_auto_select: true
  ineligible_rows_must_not_be_selected: true

If eligible_candidate_count is less than 56, status must be blocked_no_clean_56_candidate_set.

If eligible_candidate_count equals 56, Cody must still not auto-select; mark operator confirmation required.

If eligible_candidate_count is greater than 56, operator selection remains required.

7. Create classification validation record.

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_validation_v1.meta.md

Required content:

standing:
  status: classification_complete_or_blocked
  bucket_upload_authorized_now: false

validation_result:
  source_candidate_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
  content_class_isolation_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_v1.meta.md
  narrowed_operator_review_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_56_narrowed_operator_review_table_v1.meta.md
  total_candidate_rows: integer
  eligible_candidate_count: integer
  required_selection_count: 56
  selection_possible_without_ineligible_rows: true_or_false
  operator_selection_required: true
  cody_auto_selection_authorized: false
  ready_for_operator_selection_oar2: true_or_false

blocking_findings:
  rows:
    - list_or_empty

recommended_next_oar2_if_ready:
  title: OAR2 - Confirm Operator Selected Measures Registry Baseline 56 File Manifest From Narrowed Candidate Table v1

recommended_next_oar2_if_blocked:
  title: OAR2 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1

8. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md

OAR1 must report:

- source OAR2 path
- source candidate review table path
- operator template path
- content class isolation record path
- narrowed operator review table path
- classification validation path
- total candidate rows
- eligible candidate count
- ineligible candidate count
- counts by class
- whether selection_possible_without_ineligible_rows
- whether operator selection required
- whether Cody auto-selection remains blocked
- ready_for_operator_selection_oar2 true/false
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

Recommended next OAR2 title if ready:

OAR2 - Confirm Operator Selected Measures Registry Baseline 56 File Manifest From Narrowed Candidate Table v1

Recommended next OAR2 title if blocked:

OAR2 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1

## VALIDATION RETURN

Return:

- classification status
- content class isolation record path
- narrowed operator review table path
- validation record path
- total candidate rows
- eligible candidate count
- ineligible candidate count
- counts by class
- selection possible without ineligible rows true/false
- operator selection required true/false
- Cody auto-selection authorized false
- ready for operator selection OAR2 true/false
- blockers
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 classifies the contaminated baseline candidate pool before selection.

It does not select 56.

It does not upload.

It does not inspect bucket state.

It does not mutate bucket, DB, policies, runtime, routes, renderer, public copy, payment, social, Buffer, Paragraph, or email.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody isolates candidate class before operator selection.
