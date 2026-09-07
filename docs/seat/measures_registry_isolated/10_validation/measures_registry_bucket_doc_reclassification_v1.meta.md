---
document_type: validation_report
authority_level: bucket_document_reclassification_evidence
system_scope: measures_codex
title: Measures Registry Bucket Doc Reclassification v1
status: completed_read_only
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_reclassify_measures_registry_documentation_archive_into_seat_upload_intel_process_and_held_backoffice_sets_v1.meta.md
source_report: docs/seat/measures_registry_isolated/10_validation/measures_registry_supabase_bucket_document_audit_v1.meta.md
mutation_scope:
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  database: false
  policies: false
  rows: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
---

# Measures Registry Bucket Doc Reclassification v1

## Prior Bucket Counts

```yaml
prior_bucket_counts:
  bucket_docs_classified_count: 76
  protected_c3_system_reference: 3
  unknown_bucket_doc: 68
  legacy_bucket_trace: 5
  current_bucket_reference: 0
  stale_bucket_candidate: 73
  duplicate_bucket_doc: 0
  protected_measures_of_inanna_reference: 0
```

## Read-Only Refresh

```yaml
read_only_refresh:
  buckets_inspected:
    - measures-seed
    - measures-derived
    - measures-registry
    - c3-field-media
  doc_like_bucket_objects_seen: 76
  delete_authorized_now: false
  upload_authorized_now: false
  overwrite_authorized_now: false
  bucket_objects_deleted: 0
  bucket_objects_uploaded: 0
  bucket_objects_overwritten: 0
  bucket_objects_moved: 0
```

## Corrected Bucket Counts

```yaml
corrected_bucket_classification_counts:
  current_bucket_keep_candidate: 0
  stale_bucket_hold_candidate: 0
  legacy_bucket_archive_candidate: 1
  intel_bucket_reference: 27
  process_bucket_reference: 44
  backoffice_bucket_held: 3
  unknown_bucket_review: 1
prior_stale_bucket_candidates_reclassified:
  prior_stale_bucket_candidate_count: 73
  corrected_disposition: preserve_and_hold_by_corrected_class
  note: stale-risk no longer means delete candidate; process, intel, archive, and backoffice docs are preserved unless a later deletion OAR says otherwise
```

## Representative Bucket Rows

```yaml
bucket_reclassification_rows:
  process_bucket_reference:
    - bucket: measures-seed
      object_path: c3_field/schema/tree_relational_schema_direction_v1.meta.md
      prior_classification: protected_c3_system_reference
      corrected_classification: process_bucket_reference
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: c3 Field schema/tree/process reference preserved from current upload decisions
      operator_review_required: true
    - bucket: measures-seed
      object_path: process/oar_lifecycle.meta.md
      prior_classification: unknown_bucket_doc
      corrected_classification: process_bucket_reference
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: OAR lifecycle process reference
      operator_review_required: true
    - bucket: measures-seed
      object_path: seed/v1/seed_concordance.meta.md
      prior_classification: unknown_bucket_doc
      corrected_classification: process_bucket_reference
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: seed/concordance reference
      operator_review_required: true
  intel_bucket_reference:
    - bucket: measures-seed
      object_path: docs/_source/field/field_definition_chamber_of_epithets_v1.meta.md
      prior_classification: unknown_bucket_doc
      corrected_classification: intel_bucket_reference
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: docs/_source capture reference
      operator_review_required: true
    - bucket: measures-seed
      object_path: docs/_source/registry/registry_constraints_v1.meta.md
      prior_classification: unknown_bucket_doc
      corrected_classification: intel_bucket_reference
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: registry source capture reference
      operator_review_required: true
  backoffice_bucket_held:
    - bucket: measures-seed
      object_path: HA0748.pdf
      prior_classification: unknown_bucket_doc
      corrected_classification: backoffice_bucket_held
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: administrative/legal/backoffice setup signal
      operator_review_required: true
    - bucket: measures-seed
      object_path: tn_law_dao.pdf
      prior_classification: unknown_bucket_doc
      corrected_classification: backoffice_bucket_held
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: administrative/legal/backoffice setup signal
      operator_review_required: true
    - bucket: measures-seed
      object_path: tn_license2026.pdf
      prior_classification: unknown_bucket_doc
      corrected_classification: backoffice_bucket_held
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: administrative/legal/backoffice setup signal
      operator_review_required: true
  legacy_bucket_archive_candidate:
    - bucket: measures-seed
      object_path: working/archive_working_docs/registry_rows_chamber_directories_v1.meta.md
      prior_classification: legacy_bucket_trace
      corrected_classification: legacy_bucket_archive_candidate
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: legacy/archive bucket signal
      operator_review_required: true
  unknown_bucket_review:
    - bucket: measures-seed
      object_path: Measures_Registry_Full_Whitepaper.pdf
      prior_classification: unknown_bucket_doc
      corrected_classification: unknown_bucket_review
      delete_authorized_now: false
      overwrite_authorized_now: false
      upload_collision_risk: true
      reason: bucket-only PDF requires operator review before current/held/archive standing can be assigned
      operator_review_required: true
```

## Bucket Standing

```yaml
bucket_standing:
  stale_bucket_hold_candidates: []
  legacy_bucket_archive_candidates:
    count: 1
    delete_authorized_now: false
  intel_bucket_reference_objects:
    count: 27
    delete_authorized_now: false
  process_bucket_reference_objects:
    count: 44
    delete_authorized_now: false
  backoffice_bucket_held_objects:
    count: 3
    delete_authorized_now: false
  unknown_bucket_review_objects:
    count: 1
    delete_authorized_now: false
  upload_authorized_now: false
  overwrite_authorized_now: false
```

## Operator Decisions Required

```yaml
operator_decisions_required:
  - decide whether process_bucket_reference objects remain in measures-seed or later move to a dedicated process/reference bucket path
  - decide whether intel_bucket_reference objects are preserved as source capture or copied into an offline archive
  - review three backoffice/legal objects before any future backoffice package action
  - classify Measures_Registry_Full_Whitepaper.pdf before any upload, overwrite, archive, or public reference decision
  - authorize any future bucket delete/upload/overwrite in a separate OAR
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  bucket_delete_performed: false
  bucket_upload_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false
  database_mutation: false
  policy_mutation: false
  row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
```
