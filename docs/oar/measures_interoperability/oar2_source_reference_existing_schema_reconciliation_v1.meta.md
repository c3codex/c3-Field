---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Existing Schema Reconciliation v1
status: proposed
version: v1
operator: op044
system: source_authority
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - source-authority
  - schema-reconciliation
  - migration-preflight
  - codex-source-reference
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Schema Migration Preflight v1
  - Source Reference Schema SQL Draft v1
  - Active Session Transfer Surface Rule
  - OAR Lifecycle — Execution and Handoff
  - Seeded Reference Control
---

# OAR2 — Source Reference Existing Schema Reconciliation v1

## OBSERVED

Source Reference Schema Migration Preflight returned live DB evidence showing source-reference-adjacent structures already exist:

- `codex_source_relation.from_source_reference_id`
- `codex_source_relation.to_source_reference_id`
- `codex_source_seed_log.source_reference_id`
- `codex_source_term.source_reference_id`
- `v_codex_source_resolution_path.source_reference_id`
- `v_codex_source_seeded_precedence.source_reference_id`
- `system_process_registry.source_reference_set`

This blocks direct migration execution.

The corrected SQL draft cannot be treated as first-time schema creation until existing source-reference structures are reconciled.

## ALIGNED

This OAR2 routes reconciliation only.

No SQL execution.
No DB mutation.
No migration execution.
No Codex seating.
No runtime/CSS work.
No deprecation execution.

OAR2 remains the executable route surface, and OAR1 is required for closeout.

## ROUTED

Claude-as-Cody-compatible executor is routed to reconcile the corrected SQL draft against live DB structure.

Claude must:

1. Inspect the corrected SQL draft:

   `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

2. Inspect live schema evidence provided by operator.

3. Determine whether the live DB already contains:
   - `codex_source_reference`
   - alternate root source-reference table
   - source-reference relation/term/seed-log tables without root table
   - views depending on `source_reference_id`

4. Produce a reconciliation map identifying:
   - existing structures
   - draft-created structures
   - overlaps
   - conflicts
   - missing root table, if any
   - required correction before migration

5. Return one of these standings:
   - `draft_safe_to_execute_after_validation`
   - `draft_requires_extension_only`
   - `draft_requires_rewrite_against_existing_schema`
   - `existing_schema_missing_root_table`
   - `not_ready_for_migration`

6. Write OAR1 beside this OAR2 after reconciliation.

Claude must not:

1. Execute SQL.
2. Modify the SQL draft.
3. Modify DB state.
4. Move files.
5. Open a new folder surface.
6. Claim migration readiness without schema reconciliation evidence.

## REQUIRED RECONCILIATION OUTPUT

Return:

1. Existing live structures found.
2. Draft structures proposed.
3. Conflict table.
4. Missing-table assessment.
5. Recommended next route:
   - migration execution OAR2
   - SQL correction OAR2
   - existing schema extension OAR2
   - live DB inspection query route
6. Confirmation no DB/runtime/CSS/deprecation work occurred.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_source_reference_existing_schema_reconciliation_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_existing_schema_reconciliation_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_source_reference_existing_schema_reconciliation_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when existing source-reference structures are reconciled against the corrected SQL draft and migration execution remains blocked or routed based on evidence.

## CLOSE

Reconcile first.
Migration waits.
Proof before claim.
