---
document_type: validation_report
authority_level: bucket_document_audit_evidence
system_scope: measures_codex
title: Measures Registry Supabase Bucket Document Audit v1
status: completed_read_only
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md
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

# Measures Registry Supabase Bucket Document Audit v1

## Buckets Inspected

```yaml
all_buckets_seen:
  - measures-seed
  - measures-derived
  - pre-codex-exhibition
  - measures-registry
  - c3-field-media
inspected_buckets:
  - measures-seed
  - measures-derived
  - measures-registry
  - c3-field-media
inspection_errors: []
```

## Bucket Doc Objects Found

```yaml
bucket_doc_objects_found:
  total_doc_objects: 76
  by_classification:
    protected_c3_system_reference: 3
    unknown_bucket_doc: 68
    legacy_bucket_trace: 5
    current_bucket_reference: 0
    stale_bucket_candidate: 73
    duplicate_bucket_doc: 0
    protected_measures_of_inanna_reference: 0
    fresh_upload_slot_candidate: 0
```

## Representative Bucket Objects

```yaml
representative_bucket_objects:
  - bucket: measures-seed
    object_path: c3_field/schema/tree_relational_schema_direction_v1.meta.md
    classification: protected_c3_system_reference
    matches_local_file: basename_match_only
    local_match_path: docs/c3_field/schema/tree_relational_schema_direction_v1.meta.md
    upload_overwrite_risk: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: docs/_source/field/field_definition_chamber_of_epithets_v1.meta.md
    classification: unknown_bucket_doc
    matches_local_file: true
    local_match_path: docs/_source/field/field_definition_chamber_of_epithets_v1.meta.md
    stale_candidate: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: docs/_source/measures-seed/session_13_db_preflight_verification_checklist_v1.meta.md
    classification: unknown_bucket_doc
    matches_local_file: true
    local_match_path: docs/_source/measures-seed/session_13_db_preflight_verification_checklist_v1.meta.md
    stale_candidate: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: docs/_source/registry/registry_constraints_v1.meta.md
    classification: unknown_bucket_doc
    matches_local_file: true
    local_match_path: docs/_source/registry/registry_constraints_v1.meta.md
    stale_candidate: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: Measures_Registry_Full_Whitepaper.pdf
    classification: unknown_bucket_doc
    matches_local_file: false
    stale_candidate: true
    upload_overwrite_risk: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: seed/v1/seed_concordance.meta.md
    classification: unknown_bucket_doc
    matches_local_file: basename_match_only
    local_match_path: docs/_source/seed/seed_concordance.meta.md
    stale_candidate: true
    operator_review_required: true
  - bucket: measures-seed
    object_path: src/docs/measures-seed/exhibition_gate_registry_seating_spec_v1.meta.md
    classification: unknown_bucket_doc
    matches_local_file: basename_match_only
    local_match_path: docs/_source/measures-seed/exhibition_gate_registry_seating_spec_v1.meta.md
    stale_candidate: true
    operator_review_required: true
```

## Local To Bucket Comparison

```yaml
local_to_bucket_comparison:
  bucket_current_matches_local: 0
  local_current_not_in_bucket: 56
  bucket_stale_not_local_current: 73
  bucket_duplicate: 0
  bucket_unknown: 68
  local_candidate_for_future_upload: 131
  protected_do_not_upload: 3
  hold_until_operator_review: 76
  comparison_items:
    - comparison_status: local_current_not_in_bucket
      classification: future_upload_candidate
      local_path: docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
      recommended_future_action: future_upload_candidate
      reason: current isolated evidence not present as confirmed current bucket object
    - comparison_status: bucket_stale_not_local_current
      classification: operator_review
      bucket_path: measures-seed/Measures_Registry_Full_Whitepaper.pdf
      recommended_future_action: hold_bucket
      reason: bucket-only Measures Registry PDF outside confirmed current source set
    - comparison_status: protected_do_not_upload
      classification: protected_c3_system_reference
      bucket_path: measures-seed/c3_field/schema/tree_relational_schema_direction_v1.meta.md
      recommended_future_action: do_not_upload
      reason: protected c3 system reference outside Measures Registry upload authority
```

## Future Delete And Upload Standing

```yaml
future_delete_candidates:
  count: 0
  note: no delete authorized now; stale candidates require later explicit operator decision
future_upload_slots:
  count: 131
  note: all future upload slots require operator confirmation and overwrite-risk review
bucket_overwrite_risks:
  count: 76
  reason: all discovered doc-like bucket objects are held from overwrite until source-set decision
```

## Operator Decisions Required

```yaml
operator_decisions_required:
  - review 76 bucket doc-like objects before delete, overwrite, or upload
  - decide disposition for 73 stale bucket candidates
  - decide whether bucket-only PDFs belong in audit archive, current reference, or held legacy
  - decide whether measures-seed bucket should remain mixed historical source or be superseded by a clean future upload slot
  - authorize any future delete/upload/overwrite in a separate OAR
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
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
```

