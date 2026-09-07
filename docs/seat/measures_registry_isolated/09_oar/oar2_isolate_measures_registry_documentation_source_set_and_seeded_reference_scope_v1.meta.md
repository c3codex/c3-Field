---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1
status: proposed
version: v1
operator: op044
priority: critical_source_set_preflight
source_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
source_rules:
  - seed_concordance
  - seeded_reference_control
  - doc_set_closeout_rule
  - oar_lifecycle
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
  local_docs_mutation: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1

## OBSERVED

Supabase public policy disposition has completed for the current Measures Registry database scope.

The prior OAR1 confirmed:

- current Measures Registry public policy dispositions were handled
- protected c3 system policies were not mutated
- protected Measures of Inanna policies were not mutated
- no application rows were mutated
- no runtime, route, renderer, public copy, launch, payment, SEAT, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification was activated

Remaining policy blockers are documented and do not block documentation source-set isolation.

Current need:

Before submitting the SEAT folder or uploading fresh documentation to Supabase bucket storage, the local documentation source set and existing bucket documentation objects must be isolated.

Reason:

- stale bucket docs may contain old terminology, old SEAT language, old OARs, duplicate packages, legacy Measures Registry routing, or protected c3/Inanna files
- local docs may include mixed seeded, unseeded, candidate, legacy, working, and protected references
- fresh SEAT folder upload must not occur into a mixed bucket authority surface
- downstream DB and launch decisions must not proceed from unclear seeded standing

This follows seeded reference discipline:

Committed is not the same as seeded.

Database or downstream review must not proceed from mixed source sets where seeded standing is unclear.

## ALIGNED

This OAR2 performs documentation and bucket source-set isolation only.

It is read-only for Supabase bucket.

It is report-only for local docs.

It may create local evidence reports and manifests.

It may not:

- delete bucket files
- upload bucket files
- overwrite bucket files
- move bucket files
- mutate DB rows
- mutate policies
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- change local documentation contents
- submit SEAT folder
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- assign c3 Key
- activate DAO participation

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Cody executes from OAR2 only.

## ROUTED

## 1. Confirm policy closeout source

Confirm this OAR1 exists:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md

Confirm it reports:

- status: completed_with_remaining_review_blockers
- protected_c3_system_policies_untouched: true
- protected_measures_of_inanna_policies_untouched: true
- no application row mutation
- recommended next OAR2: OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1

If source OAR1 is missing, stop and write blocker OAR1.

## 2. Audit local Measures Registry documentation source set

Read-only inspect local documentation folders:

- docs/seat/measures_registry_isolated/
- docs/seat/measures_registry/
- docs/oar/measures_registry/
- docs/oar/measures-registry/
- docs/oar/measures_interoperability/
- docs/oar/process/
- docs/_source/
- docs/seed/
- docs/system/
- docs/concordance/
- docs/validation/
- docs/

Do not mutate local docs.

Classify local docs into:

- current_SEAT_source
- seeded_reference
- current_runtime_evidence
- current_policy_evidence
- current_launch_candidate
- upload_candidate_after_review
- working_candidate_not_seeded
- legacy_trace
- stale_superseded
- protected_c3_system_reference
- protected_measures_of_inanna_reference
- process_rule_reference
- unknown_requires_operator_review

For each found doc, report:

file_path:
file_name:
classification:
reason:
source_set:
seeded_status:
upload_candidate: true_or_false
bucket_required: true_or_false
operator_review_required: true_or_false
supersedes:
superseded_by:
notes:

## 3. Required local source-set anchors

Confirm current local source anchors exist or report missing:

- docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_populated_v1.meta.md
- docs/seat/measures_registry_isolated/12_directory_set_components/
- docs/seat/measures_registry_isolated/10_validation/measures_registry_current_runtime_policy_scope_isolation_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/measures_registry_database_policy_scope_isolation_readback_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md
- docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md

## 4. Detect stale or superseded local docs

Search for drift/superseded terms in local docs:

- Structural Drift as governing route
- c3 MAP as current public label
- SEAT as active standing
- SEAL as active standing
- Registry Standing active
- Branch active
- c3 Key active
- DAO participation active
- wallet activation active
- certification active
- Crystal Chamber as current Measures Registry encounter
- Epigraph as public Measures Registry launch surface
- MRM active
- ERROR public
- contracts as internal Measures Registry requirements where content_records, media_mappings, or style_profile should be used
- old five-question assessment
- old connect_src route
- structure_passage as active route authority
- reserve_seat active
- cohort_conversion active
- phase_payment active
- measures_phases_reveal active

For each match, classify as:

- valid_internal_or_protected_reference
- historical_legacy_trace
- stale_superseded
- active_drift_risk
- operator_review_required

Do not edit docs.

## 5. Audit Supabase bucket documentation objects

Read-only list Supabase storage buckets and objects that may contain docs, markdown, JSON, PDFs, SEAT packages, OARs, or source references.

Candidate bucket names to inspect if present:

- measures-registry
- measures_registry
- measures-codex
- c3field
- c3-field
- public
- media
- documents
- docs
- seat
- registry
- measures
- measures-of-inanna
- inanna

File extensions to flag:

- .md
- .meta.md
- .txt
- .json
- .csv
- .pdf
- .docx
- .zip
- .yaml
- .yml

For each bucket object found, report:

bucket:
object_path:
file_name:
extension:
last_modified:
size:
classification:
reason:
matches_local_file: true_or_false
local_match_path:
stale_candidate: true_or_false
delete_candidate_future: true_or_false
upload_overwrite_risk: true_or_false
operator_review_required: true_or_false
notes:

Classify bucket docs into:

- current_bucket_reference
- stale_bucket_candidate
- legacy_bucket_trace
- duplicate_bucket_doc
- protected_c3_system_reference
- protected_measures_of_inanna_reference
- unknown_bucket_doc
- fresh_upload_slot_candidate

Do not delete, upload, overwrite, or move bucket objects.

## 6. Compare local docs to bucket docs

Create a local-vs-bucket comparison.

Classify:

- local_current_not_in_bucket
- bucket_current_matches_local
- bucket_stale_not_local_current
- bucket_duplicate
- bucket_unknown
- local_candidate_for_future_upload
- protected_do_not_upload
- hold_until_operator_review

For each comparison item:

local_path:
bucket_path:
comparison_status:
classification:
recommended_future_action:
  - keep_bucket
  - hold_bucket
  - future_delete_candidate
  - future_upload_candidate
  - do_not_upload
  - operator_review
reason:

## 7. Define fresh SEAT upload candidate set

Create a proposed upload candidate manifest only.

Do not upload.

The manifest must include only docs classified as current_SEAT_source, current_runtime_evidence, current_policy_evidence, current_launch_candidate, or upload_candidate_after_review.

Exclude:

- stale_superseded
- legacy_trace unless explicitly required for audit bundle
- protected_c3_system_reference unless specific review authorizes it
- protected_measures_of_inanna_reference unless specific review authorizes it
- working_candidate_not_seeded
- unknown_requires_operator_review
- process_rule_reference unless required as source bundle
- any doc containing active drift risk

For each proposed upload candidate:

local_path:
proposed_bucket_path:
classification:
seeded_status:
requires_operator_confirmation: true
upload_authorized_now: false
reason:

## 8. Create required reports

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_local_documentation_source_set_isolation_v1.meta.md

Must include:

- inspected local folders
- local docs classified
- seeded references
- unseeded working docs
- current SEAT source docs
- current evidence docs
- stale/superseded docs
- protected docs
- unknown docs
- drift term findings
- upload candidate list
- operator decisions required

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_supabase_bucket_document_audit_v1.meta.md

Must include:

- buckets inspected
- bucket doc objects found
- stale bucket candidates
- duplicate bucket docs
- unknown bucket docs
- protected bucket docs
- local-to-bucket matches
- future delete candidates
- future upload slots
- operator decisions required

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md

Must include:

- upload_authorized_now: false
- proposed upload candidates
- excluded files
- bucket overwrite risks
- prerequisite before upload
- operator confirmation required

## 9. No upload / delete boundary

Do not:

- delete bucket objects
- upload bucket objects
- overwrite bucket objects
- move bucket objects
- mutate DB rows
- mutate policies
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- submit SEAT folder
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- activate launch
- activate payment

## VALIDATION RETURN

Return:

- OAR2 path
- local documentation isolation report path
- bucket audit report path
- future upload candidate manifest path
- inspected local folders
- inspected buckets
- local docs classified count
- bucket docs classified count
- stale bucket candidates count
- upload candidates count
- unknown review count
- protected docs count
- no bucket delete confirmation
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- operator decisions required
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_documentation_source_set_and_seeded_reference_scope_v1.meta.md

OAR1 must report:

- OAR2 path
- local documentation isolation report path
- bucket audit report path
- future upload candidate manifest path
- source OAR1 verified
- inspected local folders
- inspected buckets
- local docs classified count
- bucket docs classified count
- seeded reference count
- unseeded working doc count
- current SEAT source count
- current evidence doc count
- stale/superseded local doc count
- stale bucket candidate count
- duplicate bucket doc count
- upload candidate count
- unknown review count
- protected doc count
- drift term findings summary
- operator decisions required
- no bucket delete confirmation
- no bucket upload confirmation
- no bucket overwrite confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- recommended next OAR2 title

Recommended next OAR2:

OAR2 - Resolve Measures Registry Documentation Source Set Decisions Before SEAT Folder Upload v1

## CLOSE

This OAR2 isolates the Measures Registry documentation source set and audits Supabase bucket documentation objects.

It does not upload fresh docs.

It does not delete stale bucket docs.

It does not submit the SEAT folder.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody audits and writes evidence.
