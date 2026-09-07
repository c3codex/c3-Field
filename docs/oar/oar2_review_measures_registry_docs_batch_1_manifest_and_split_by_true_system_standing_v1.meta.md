---
oar_id: oar2_review_measures_registry_docs_batch_1_manifest_and_split_by_true_system_standing_v1
oar_type: OAR2
title: Review Measures Registry Docs Batch 1 Manifest and Split by True System Standing v1
system_scope: measures_registry
source_manifest: docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md
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

# OAR2 — Review Measures Registry Docs Batch 1 Manifest and Split by True System Standing v1

## OBJECTIVE

Review the Batch 1 standing manifest and split classified docs by true system standing before any file movement.

The prior Batch 1 manifest classified 833 matched docs as non-public/internal/trace material. This OAR2 determines which of those docs truly belong to:

- Measures Registry
- c3 Field
- Measures of Inanna
- shared source authority
- deprecated trace
- operator review

No files are moved in this OAR2.

## SOURCE

Use this manifest as the only review source:

docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md

The manifest states that it seated standing metadata without moving files or rewriting public copy.

## SCOPE

Review all rows in the Batch 1 manifest.

For each listed file, assign one true system standing:

- measures_registry_current_internal
- measures_registry_trace_deprecated
- measures_registry_chamber_migration_candidate
- c3_field_protected
- measures_of_inanna_protected
- shared_source_authority
- shared_oar_process
- shared_media_governance
- shared_recovery_intel
- operator_review_required

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
- Do not treat the Batch 1 classification as final authority.
- Do not mark any doc public_current unless explicitly proven public-current and launch-safe.

## CLASSIFICATION RULES

### measures_registry_current_internal

Use only for docs that directly govern current Measures Registry launch behavior, contracts, chamber migration, active public runtime preparation, assessment flow, unDrifted standing, or current site operations.

### measures_registry_trace_deprecated

Use for outdated Measures Registry docs that preserve history but should not drive current launch standing.

### measures_registry_chamber_migration_candidate

Use for docs that should be reviewed during chamber-by-chamber migration.

Must include probable chamber key when detectable:

- crystal
- obsidian
- lapis
- marble
- unknown_chamber

### c3_field_protected

Use for docs that belong to c3 Field, c3 Field convergence, c3 Field chamber directory architecture, c3 Field operations, TREE, c3 root governance, c3 Field source authority, or c3 Field-level role/process architecture.

### measures_of_inanna_protected

Use for docs belonging to Measures of Inanna, exhibition runtime, chamberplates, epithets, phase map, gates, MEs, Inanna media migration, pre-Codex exhibition, or Inanna encounter resolution.

### shared_source_authority

Use for source authority docs that may support more than one system and should not be collapsed into Measures Registry.

### shared_oar_process

Use for OAR lifecycle, transfer, closeout, execution evidence, validation rules, or role-bound process docs that govern system operations beyond Measures Registry.

### shared_media_governance

Use for media bucket, R2, Supabase media, provider, file authority, media map, or cross-system media governance docs.

### shared_recovery_intel

Use for recovery, handoff, preflight, restoration, diagnostic, or cross-system repair intelligence not specific to Measures Registry.

### operator_review_required

Use when system standing cannot be determined safely from filename/path/content signal.

## REQUIRED OUTPUT ARTIFACT

Create a new review manifest:

docs/oar/docs_batch_1_true_system_standing_review_manifest_v1.meta.md

The review manifest must include a row per reviewed file:

- file
- batch_1_standing
- true_system_standing
- probable_chamber_key
- move_recommendation
- move_allowed_now
- reason
- operator_review_required

Allowed move_recommendation values:

- keep_current_path
- move_to_measures_registry_internal
- move_to_measures_registry_trace
- move_to_c3_field_protected
- move_to_measures_of_inanna_protected
- move_to_shared_source_authority
- move_to_shared_oar_process
- move_to_shared_media_governance
- move_to_shared_recovery_intel
- hold_for_operator_review

move_allowed_now must be false for every row in this OAR2.

## REQUIRED SUMMARY COUNTS

OAR1 must report counts for:

true_system_standing_review:
  rows_reviewed:
  measures_registry_current_internal:
  measures_registry_trace_deprecated:
  measures_registry_chamber_migration_candidate:
  c3_field_protected:
  measures_of_inanna_protected:
  shared_source_authority:
  shared_oar_process:
  shared_media_governance:
  shared_recovery_intel:
  operator_review_required:
  move_allowed_now: 0

## CHAMBER MIGRATION CANDIDATE COUNTS

For all measures_registry_chamber_migration_candidate rows, count probable chamber keys:

chamber_migration_candidates:
  crystal:
  obsidian:
  lapis:
  marble:
  unknown_chamber:

## VALIDATION REQUIREMENTS

Pass only if:

- Every Batch 1 manifest row is reviewed.
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
- Every row has true_system_standing.
- Every row has move_recommendation.
- Every row has move_allowed_now=false.
- Operator-review rows are explicitly listed.
- Chamber migration candidates are grouped by probable chamber_key.

## OAR1 REQUIRED

Return OAR1 beside this OAR2 with:

- source manifest reviewed
- review manifest created
- rows reviewed
- summary counts
- chamber candidate counts
- operator review list
- confirmation of no movement
- confirmation of no mutation
- recommended next OAR2

## EXPECTED NEXT OAR2

After this OAR1 is accepted:

OAR2 — Map Measures Registry Clean Migration by Chamber Key and Directory Components v1

That OAR2 may only use rows classified as:

- measures_registry_current_internal
- measures_registry_chamber_migration_candidate

It must not use c3 Field, Measures of Inanna, shared source authority, shared process, shared media governance, or shared recovery intel as Measures Registry launch authority.
