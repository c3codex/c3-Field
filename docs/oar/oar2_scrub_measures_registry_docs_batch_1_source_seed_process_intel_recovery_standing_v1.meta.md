---
oar_id: oar2_scrub_measures_registry_docs_batch_1_source_seed_process_intel_recovery_standing_v1
oar_type: OAR2
title: Scrub Measures Registry Docs Batch 1: Source, Seed, Process, Intel, and Recovery Standing v1
system_scope: measures_registry
target_scope:
  - docs/
excluded_scope:
  - Measures of Inanna docs
  - c3 Field docs
  - runtime src mutation
  - database mutation
  - public route mutation
  - renderer mutation
status: proposed
requires_oar1: true
---

# OAR2 — Scrub Measures Registry Docs Batch 1: Source, Seed, Process, Intel, and Recovery Standing v1

## OBJECTIVE

Classify and quarantine internal authority, process, source, intelligence, and recovery documentation inside the Measures Registry `docs/` folder.

This OAR2 does not mutate runtime, routes, database records, public copy, media, SEO, or renderer behavior.

This OAR2 does not scrub Measures of Inanna or c3 Field documentation. Those systems must be saved and handled separately.

## SCOPE

Target root:

docs/

Explicit exclusions:

- Measures of Inanna docs
- c3 Field docs
- external archive folders not inside Measures Registry `docs/`
- source runtime files
- database mutation
- public route mutation
- renderer mutation

## BATCH 1 DOC CLASSES

Classify docs containing or primarily serving:

### 1. Source

- source references
- source manifests
- concordance source controls
- seeded reference controls
- authority references
- database source manifests

### 2. Seed

- seed concordance
- system concordance
- seeded process docs
- seed-preservation rules
- origin/source-preservation docs

### 3. Process

- OAR lifecycle
- OAR transfer rules
- OAR closeout rules
- validation rules
- thread-to-transfer rules
- PowerShell transfer surface rules
- doc stack constraints

### 4. Intel

- Chazz role intelligence
- Cody role intelligence
- NotChazz seam logic
- c3 7s system intelligence
- internal system operating logic
- role-bound AI behavior
- internal governance mechanics not intended as public copy

### 5. Recovery

- preflight checklists
- recovery rules
- restoration notes
- migration recovery
- system handoff docs
- execution evidence support docs

## REQUIRED CLASSIFICATION

Every matched Measures Registry doc must receive one standing:

- internal_source
- internal_seed
- internal_process
- internal_intel
- internal_recovery
- trace_deprecated
- public_current

`public_current` may be used only if the document is intentionally public, launch-current, and free of internal process leakage.

## REQUIRED METADATA

For every internal or trace document, seat or append metadata equivalent to:

standing: internal_source | internal_seed | internal_process | internal_intel | internal_recovery | trace_deprecated
public_readable: false
ai_readable_public_surface_allowed: false
current_authority: false
trace_only: true
system_scope: measures_registry
scrub_batch: docs_batch_1_source_seed_process_intel_recovery

For any `public_current` document:

standing: public_current
public_readable: true
ai_readable_public_surface_allowed: true
current_authority: true
trace_only: false
system_scope: measures_registry
scrub_batch: docs_batch_1_source_seed_process_intel_recovery

## FOLDER ORGANIZATION TARGET

Within `docs/`, classify toward this structure where safe:

docs/
  public/
    measures-registry/
      current-launch-only

  internal/
    source/
    seed/
    process/
    intel/
    recovery/

  trace/
    deprecated/
    migration/
    oar/

Do not move files if imports, references, or tooling paths would break without a mapped update.

If movement is unsafe, mark metadata first and report the required move in OAR1.

## GUARDRAILS

- Do not delete docs.
- Do not rewrite public copy in this batch.
- Do not mutate runtime.
- Do not mutate DB.
- Do not alter routes.
- Do not scrub Measures of Inanna docs in this OAR.
- Do not scrub c3 Field docs in this OAR.
- Do not expose Chazz, Cody, NotChazz, OAR lifecycle, transfer rules, system intelligence, or recovery logic as public docs.
- Deprecated docs may remain as trace only.
- Public docs must not import, link, render, or expose internal/trace docs.

## EXECUTION INSTRUCTIONS

1. Scan `docs/`.
2. Exclude Measures of Inanna and c3 Field docs from mutation.
3. Classify each Measures Registry doc by standing.
4. Add required metadata where safe.
5. Move files only where safe.
6. Do not delete.
7. Do not rewrite public copy.
8. Produce Batch 1 standing report.
9. Return OAR1 closeout.

## VALIDATION REPORT FORMAT

Executor must produce:

docs_batch_1_scrub_report:
  total_docs_scanned:
  docs_classified:
  public_current:
  internal_source:
  internal_seed:
  internal_process:
  internal_intel:
  internal_recovery:
  trace_deprecated:
  skipped_excluded_system_docs:
  unresolved_or_ambiguous:
  public_leakage_found:
  import_path_risks:
  recommended_batch_2_targets:

## PASS CONDITION

OAR1 may close only if:

- all docs in `docs/` are scanned or explicitly excluded with reason
- source docs are classified
- seed docs are classified
- process docs are classified
- intel docs are classified
- recovery docs are classified
- Measures of Inanna docs are not mutated
- c3 Field docs are not mutated
- public docs contain no internal process leakage
- public docs contain no deprecated route/surface authority
- public docs contain no unseated DAO, c3 Key, SEAT, Commons, Treasury, or MAP Portal claims
- public runtime has no import path to internal/trace docs
- Batch 1 standing report is delivered

## OAR1 REQUIRED

Executor must return OAR1 with:

- files scanned
- files moved
- files metadata-marked
- files excluded
- public leakage findings
- unresolved ambiguity
- validation output
- confirmation that Measures of Inanna and c3 Field docs were not mutated

## ACCEPTANCE STATE

Pending executor OAR1.

Operator confirmation required before Batch 2.
