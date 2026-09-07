---
oar_id: oar2_review_batch_1_source_seed_process_and_intel_docs_by_authority_function_v1
oar_type: OAR2
title: Review Batch 1 Source, Seed, Process, and Intel Docs by Authority Function v1
system_scope: measures_registry
source_manifest: docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md
prior_review_manifest: docs/oar/docs_batch_1_true_system_standing_review_manifest_v1.meta.md
status: proposed
requires_oar1: true
mutation_scope:
  runtime: false
  database: false
  routes: false
  renderer: false
  public_copy_rewrite: false
  docs_deleted: false
  docs_moved: false
---

# OAR2 — Review Batch 1 Source, Seed, Process, and Intel Docs by Authority Function v1

## OBJECTIVE

Review Batch 1 docs by authority function before any chamber migration or file movement.

The prior true-system-standing review protected against accidental Measures Registry overclaiming, but chamber semantics are newer than much of the documentation. This OAR2 therefore reviews source, seed, process, and intel docs by function first.

Chamber assignment is not the primary review lens in this OAR2.

## SOURCE

Use:

docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md

Use prior review only as context:

docs/oar/docs_batch_1_true_system_standing_review_manifest_v1.meta.md

Do not treat the prior true-system-standing review as final authority for this function-first review.

## SCOPE

Review only rows from the Batch 1 standing manifest with batch_1_standing equal to:

- internal_source
- internal_seed
- internal_process
- internal_intel

Exclude from this OAR2:

- internal_recovery
- trace_deprecated
- public_current
- outside-scope rows
- already excluded protected-system rows unless they appeared in the Batch 1 standing manifest with one of the four targeted standings

## HARD GUARDRAILS

- Do not move files.
- Do not delete files.
- Do not rewrite files.
- Do not mutate runtime.
- Do not mutate database.
- Do not mutate routes.
- Do not mutate renderer.
- Do not rewrite public copy.
- Do not change public metadata.
- Do not alter Measures of Inanna docs.
- Do not alter c3 Field docs.
- Do not classify by chamber first.
- Do not collapse shared source, shared process, shared media, or shared intel into Measures Registry authority.
- Do not mark any doc public_current.
- Do not use current chamber semantics to erase older source, seed, process, or intel standing.

## REVIEW LENS

For each targeted row, classify by function first:

authority_function values:

- source_authority
- seed_authority
- process_rule
- role_intelligence
- system_intelligence
- runtime_evidence
- media_governance
- commerce_boundary
- public_copy_trace
- deprecated_trace
- unknown

authority_level values:

- current_authority
- supporting_authority
- historical_trace
- deprecated
- operator_review_required

true_system_standing values:

- measures_registry
- c3_field
- measures_of_inanna
- shared_source_authority
- shared_oar_process
- shared_media_governance
- shared_recovery_intel
- unknown_operator_review

recommended_home values:

- keep_current_path
- measures_registry_internal_source
- measures_registry_internal_seed
- measures_registry_internal_process
- measures_registry_internal_intel
- c3_field_protected
- measures_of_inanna_protected
- shared_source_authority
- shared_oar_process
- shared_media_governance
- shared_recovery_intel
- trace_deprecated
- hold_for_operator_review

## REQUIRED OUTPUT ARTIFACT

Create:

docs/oar/docs_batch_1_authority_function_review_manifest_v1.meta.md

The manifest must include one row per reviewed file:

- file
- batch_1_standing
- prior_true_system_standing
- authority_function
- authority_level
- true_system_standing
- current_use
- keep_for_migration
- protect_from_public
- recommended_home
- move_allowed_now
- operator_review_required
- reason

move_allowed_now must be false for every row.

protect_from_public must be true for every row unless explicitly justified otherwise. No public_current standing may be created in this OAR2.

## CURRENT USE VALUES

current_use must be one of:

- active_launch_reference
- supporting_reference
- historical_reference
- deprecated_reference
- unknown_requires_operator_review

## KEEP FOR MIGRATION VALUES

keep_for_migration must be one of:

- yes
- no
- operator_review_required

## SUMMARY COUNTS REQUIRED

OAR1 must include:

authority_function_review:
  rows_reviewed:
  source_authority:
  seed_authority:
  process_rule:
  role_intelligence:
  system_intelligence:
  runtime_evidence:
  media_governance:
  commerce_boundary:
  public_copy_trace:
  deprecated_trace:
  unknown:
  current_authority:
  supporting_authority:
  historical_trace:
  deprecated:
  operator_review_required:
  keep_for_migration_yes:
  keep_for_migration_no:
  keep_for_migration_operator_review:
  move_allowed_now: 0

true_system_counts:
  measures_registry:
  c3_field:
  measures_of_inanna:
  shared_source_authority:
  shared_oar_process:
  shared_media_governance:
  shared_recovery_intel:
  unknown_operator_review:

recommended_home_counts:
  measures_registry_internal_source:
  measures_registry_internal_seed:
  measures_registry_internal_process:
  measures_registry_internal_intel:
  c3_field_protected:
  measures_of_inanna_protected:
  shared_source_authority:
  shared_oar_process:
  shared_media_governance:
  shared_recovery_intel:
  trace_deprecated:
  hold_for_operator_review:

## VALIDATION REQUIREMENTS

Pass only if:

- Every targeted internal_source row is reviewed.
- Every targeted internal_seed row is reviewed.
- Every targeted internal_process row is reviewed.
- Every targeted internal_intel row is reviewed.
- No internal_recovery-only row is reviewed unless it also has one of the four targeted standings.
- No trace_deprecated-only row is reviewed unless it also has one of the four targeted standings.
- No files are moved.
- No files are deleted.
- No files are rewritten.
- No runtime mutation occurs.
- No database mutation occurs.
- No route mutation occurs.
- No renderer mutation occurs.
- No public copy mutation occurs.
- No Measures of Inanna docs are altered.
- No c3 Field docs are altered.
- Every reviewed row has authority_function.
- Every reviewed row has authority_level.
- Every reviewed row has true_system_standing.
- Every reviewed row has current_use.
- Every reviewed row has keep_for_migration.
- Every reviewed row has protect_from_public.
- Every reviewed row has recommended_home.
- Every reviewed row has move_allowed_now=false.
- Operator-review rows are explicitly listed.

## OAR1 REQUIRED

Return OAR1 beside this OAR2 with:

- source manifest reviewed
- prior review manifest consulted
- authority function review manifest created
- rows reviewed
- summary counts
- true system counts
- recommended home counts
- operator review list
- keep-for-migration list
- confirmation of no movement
- confirmation of no mutation
- recommended next OAR2

## EXPECTED NEXT OAR2

After this OAR1 is accepted:

OAR2 — Build Reference-Aware Move Plan for Source Seed Process and Intel Docs v1

That OAR2 may use only the authority-function review manifest and must still avoid movement until operator accepts the move plan.
