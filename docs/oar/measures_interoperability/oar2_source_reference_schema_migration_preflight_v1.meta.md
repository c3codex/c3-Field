---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Schema Migration Preflight v1
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
  - migration-preflight
  - codex-source-record
  - source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Schema SQL Draft v1
  - OAR1 — Source Reference Schema SQL Draft Correction v1
  - Active Session Transfer Surface Rule
  - NotChazz — Reduced OAR2 Context Caused Artifact-Proof Drift
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Schema Migration Preflight v1

## OBSERVED

Source Reference Schema SQL Draft v1 has been drafted, corrected, reviewed, and committed.

Correction OAR1 confirms:

- standing values were normalized
- `aliases jsonb` was added
- c3 7s alias set was added
- `system_concordance` and `coherence_matrix_v1` were added as held runtime-claimed rows
- unsafe anon full-table RLS was removed
- public-safe view was added
- dead lineage trigger line was removed
- no SQL, DB, runtime, CSS, deprecation, or Codex seating occurred

Migration execution is not yet authorized.

Correction OAR1 requires operator review and live validation queries before migration execution OAR2.

## ALIGNED

This OAR2 routes preflight only.

Seeded references must be checked before database change.

OAR2 remains the route surface.

OAR1 is required for closeout.

No migration execution, DB mutation, Codex seating, runtime work, CSS work, or deprecation execution is authorized.

## ROUTED

Claude-as-Cody-compatible executor is routed to perform migration preflight only.

Claude must:

1. Review the corrected SQL artifact:

   `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

2. Verify artifact proof before any OAR1 claim.
3. Extract and return Section 1 live validation queries.
4. Confirm the SQL draft contains expected correction markers.
5. Confirm the SQL draft does not contain stale rejected markers.
6. Return operator decision checklist for migration readiness.
7. Write OAR1 beside this OAR2 after preflight completion.

Claude must not:

1. Execute SQL.
2. Modify database state.
3. Declare Codex seating.
4. Modify runtime or CSS.
5. Deprecate files.
6. Move artifacts.
7. Open a new folder surface.
8. Claim preflight complete without artifact proof.

## REQUIRED ARTIFACT-PROOF CHECKS

Before writing OAR1, verify:

1. Corrected file exists at:

   `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

2. File contains:

   - `aliases jsonb`
   - `source_21_of_coherence_v1`
   - `c3 7s`
   - `c3_7s`
   - `twenty_one_of_coherence`
   - `system_concordance`
   - `coherence_matrix_v1`
   - `codex_source_reference_public`
   - expected row count of `19` where applicable

3. File does not contain active invalid or stale markers:

   - active `hold_for_operator_review` standing values
   - anon full-table `using (true)` read policy on `codex_source_reference`
   - dead `codex_source_reference_lineage_set_updated_at` trigger drop block

4. OAR1 may not claim completion unless artifact evidence confirms these checks.

## OPERATOR READINESS DECISIONS

Return these decisions for operator confirmation:

1. `system_concordance`: held row acceptable until file path is confirmed.
2. `coherence_matrix_v1`: held row acceptable until file path is confirmed.
3. `source_21_of_coherence_v1` aliases complete:
   - `c3 7s`
   - `c3_7s`
   - `twenty_one_of_coherence`
4. Held exclusions remain held.
5. `codex_source_reference_public` view scope is acceptable as public-safe.
6. Section 1 validation queries must be run against live DB before migration execution.

## VALIDATION RETURN

Return:

1. artifact-proof results
2. extracted Section 1 validation queries
3. stale-marker search results
4. operator readiness decision checklist
5. migration readiness standing:
   - ready for migration execution OAR2
   - not ready, correction required
6. confirmation no DB/runtime/CSS/deprecation work occurred

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_source_reference_schema_migration_preflight_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_schema_migration_preflight_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_source_reference_schema_migration_preflight_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the corrected SQL artifact is proof-checked, live validation queries are extracted for operator execution, readiness decisions are returned, and no database mutation occurs.

## CLOSE

Preflight only.
Proof before claim.
Execution waits.
