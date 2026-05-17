---
document_type: oar1
title: OAR1 Concordance Authority Relation Reference Hardening
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_relation_reference_hardening_v1.meta.md
---

OAR1: oar1_concordance_authority_relation_reference_hardening_v1

## Objective
Harden Concordance Authority relation references so relation structure remains scope-neutral across term, document, version, cross-version, branch, and system relations, without executing SQL, mutating DB, creating a live migration, altering runtime/frontend behavior, or redefining authority.

## Operator Request
Revise draft SQL and seating artifacts to replace term-shaped relation reference naming with scope-neutral relation references:

`source_ref`

`target_ref`

## Actions
- Revised `docs/oar/c3_field/concordance_authority_schema_draft_v1.sql`.
- Revised `docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql`.
- Revised `docs/oar/c3_field/concordance_authority_execution_package_migration_v1.sql`.
- Revised `docs/oar/c3_field/concordance_authority_execution_package_seed_concordance_v1_seating.sql`.
- Revised `docs/oar/c3_field/concordance_authority_execution_package_post_validation_v1.sql`.
- Revised `docs/oar/c3_field/oar1_seed_concordance_v1_authority_seating_record.meta.md`.

## Hardening Applied
### Schema Draft
Changed `concordance_relation` reference fields from term-shaped references to scope-neutral references:

- `source_term_key` -> `source_ref`
- `target_term_key` -> `target_ref`

Updated uniqueness and index posture to use `source_ref` and `target_ref`.

### Execution Package Migration
Applied the same scope-neutral relation reference shape to the execution package migration artifact.

### Seating SQL
Updated Seed Concordance v1 relation seating inserts to use `source_ref` and `target_ref`.

Document-scoped source alignment rows now carry:
- `source_ref = seed_concordance_v1`
- `target_ref = referenced document path`

### Validation SQL
Added validation checks for:
- `source_ref` and `target_ref` column presence
- scoped relation references with non-null relation refs
- non-term relation rows that still look term-shaped

### Post-Validation SQL
Updated relation readback to return:

`relation_key, relation_scope, source_ref, target_ref, relation_type`

### Seating Record
Updated relation tables in the Seed Concordance v1 authority seating record to use `source_ref` and `target_ref` headings.

## Findings
- Relation references are now scope-neutral in active SQL draft and execution package artifacts.
- Term relations remain valid by `relation_scope = 'term'` and term-key reference values.
- Document, system, version, cross-version, and branch relations are no longer forced into a term foreign-key shape.
- Historical proposal/planning OAR1 language was not rewritten by this hardening route.

## Authority Boundary Preserved
`Field structures relation.`

`Measures registers reveal.`

`Codex holds authority.`

`Relation scope must match relation structure.`

This OAR1 records artifact hardening only. It does not seat authority, execute migration SQL, insert records, mutate DB, mutate bucket objects, or authorize runtime execution.

## Constraints Held
- No SQL executed.
- No DB mutation performed.
- No records inserted.
- No live migration created under `supabase/migrations`.
- No bucket mutation performed.
- No runtime/frontend work performed.
- No authority model redefinition performed.

## Validation
- SQL draft uses `source_ref` and `target_ref`.
- Execution package migration uses `source_ref` and `target_ref`.
- Seating SQL uses `source_ref` and `target_ref`.
- Validation SQL checks scope-neutral relation reference posture.
- Post-validation SQL reads back scope-neutral refs.
- Seed Concordance v1 seating record uses `source_ref` and `target_ref`.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_relation_reference_hardening_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_relation_reference_hardening_v1.meta.md
- docs/oar/c3_field/concordance_authority_schema_draft_v1.sql
- docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql
- docs/oar/c3_field/concordance_authority_execution_package_migration_v1.sql
- docs/oar/c3_field/concordance_authority_execution_package_seed_concordance_v1_seating.sql
- docs/oar/c3_field/concordance_authority_execution_package_post_validation_v1.sql
- docs/oar/c3_field/oar1_seed_concordance_v1_authority_seating_record.meta.md

## Close
Relation references are scope-neutral.
TREE and Concordance remain outside runtime command.
No execution performed.
