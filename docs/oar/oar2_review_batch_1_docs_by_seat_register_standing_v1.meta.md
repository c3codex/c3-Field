---
oar_id: oar2_review_batch_1_docs_by_seat_register_standing_v1
oar_type: OAR2
title: Review Batch 1 Docs by Seat Register Standing v1
system_scope: measures_registry
source_manifest: docs/oar/docs_batch_1_authority_function_review_manifest_v1.meta.md
prior_manifests:
  - docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md
  - docs/oar/docs_batch_1_true_system_standing_review_manifest_v1.meta.md
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

# OAR2 — Review Batch 1 Docs by Seat Register Standing v1

## OBJECTIVE

Review Batch 1 authority-function rows by seat/register standing.

The prior authority-function review classified source, seed, process, and intel docs by function. This OAR2 determines whether those docs are:

- merely registered trace
- registered candidates
- seated current authority
- seated supporting authority
- held for future backoffice rescrub
- protected other-system material
- deprecated trace
- operator-review material

This pass separates current launch authority from preserved backoffice material.

No files are moved in this OAR2.

## SOURCE

Primary source:

docs/oar/docs_batch_1_authority_function_review_manifest_v1.meta.md

Context only:

docs/oar/docs_batch_1_scrub_measures_registry_standing_manifest_v1.meta.md
docs/oar/docs_batch_1_true_system_standing_review_manifest_v1.meta.md

Do not treat chamber assignment as primary authority.

Do not treat authority-function classification as final operative standing.

## DEFINITIONS

### registered_trace

The doc is known, preserved, and indexed as history or record, but does not govern current launch, runtime, process, route, renderer, copy, media, commerce, or backoffice operations.

### registered_candidate

The doc may become useful later and should remain available for review, but it does not govern current launch or backoffice yet.

### seated_current

The doc currently governs an active Measures Registry launch process, current source rule, current seed rule, current runtime/process boundary, active public launch standing, or accepted OAR process.

This category must be rare.

### seated_supporting

The doc supports current authority but does not govern alone. It may provide evidence, implementation context, validation support, or supporting metadata.

### held_for_backoffice

The doc is not current launch authority but should be preserved for future backoffice rescrub, internal operating system buildout, source registry, process registry, media registry, publishing automation, role tooling, or internal operator surface.

### protected_other_system

The doc belongs to c3 Field, Measures of Inanna, shared source authority, shared OAR process, shared media governance, or shared recovery intelligence. It must not be pulled into Measures Registry launch authority.

### deprecated_trace

The doc is explicitly deprecated, replaced, superseded, stale, or residue. Preserve as trace only.

### operator_review_required

The doc cannot be safely classified.

## SEAT / REGISTER CLASSIFICATION VALUES

Each row must receive one value:

```yaml
seat_register_standing:
  - registered_trace
  - registered_candidate
  - seated_current
  - seated_supporting
  - held_for_backoffice
  - protected_other_system
  - deprecated_trace
  - operator_review_required
