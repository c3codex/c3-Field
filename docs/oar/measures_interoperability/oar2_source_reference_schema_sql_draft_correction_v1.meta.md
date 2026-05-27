---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Schema SQL Draft Correction v1
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
  - sql-draft-correction
  - codex-source-record
  - c3-7s
  - measures-interoperability
source_alignment:
  - OAR1 — Source Reference Schema SQL Draft v1
  - Seed Concordance
  - c3 7s / The 21 of Coherence
  - Active Session Transfer Surface Rule
---

# OAR2 — Source Reference Schema SQL Draft Correction v1

## OBSERVED

Source Reference Schema SQL Draft v1 is complete but not migration-ready.

OAR1 requires operator review before migration execution, including confirmation of proposed seed rows, held exclusions, FK approach, `system_concordance`, and live validation queries.

Review found correction items:

1. Proposed seed row standings conflict with allowed `standing` values.
2. `twenty_one_of_coherence` and `source_21_of_coherence_v1` are not normalized.
3. Runtime-claimed sources include `system_concordance` and `coherence_matrix_v1`, but draft rows do not fully account for them.
4. Public RLS may expose more than should be public.
5. Dead trigger/drop line exists for lineage `updated_at`.

## ALIGNED

Correction only.

No SQL execution.
No DB mutation.
No Codex seating.
No runtime/CSS work.
No deprecation execution.

The formal source remains **The 21 of Coherence**.

Native shorthand is:

**c3 7s**

Alias pattern must preserve continuity, not rename old files.

## ROUTED

Claude-as-Cody-compatible executor is routed to correct the SQL draft only.

Claude must:

1. Normalize standing values:
   - `hold_for_operator_review` → `standing = 'held'`
   - `review_status = 'operator_required'`

2. Normalize c3 7s source identity:
   - canonical source key: `source_21_of_coherence_v1`
   - canonical title: `The 21 of Coherence`
   - aliases:
     - `c3 7s`
     - `c3_7s`
     - `twenty_one_of_coherence`

3. Resolve runtime-claimed sources:
   - include or explicitly hold:
     - `system_concordance`
     - `coherence_matrix_v1`

4. Adjust access posture:
   - do not expose full authority table by broad public RLS
   - propose public-safe view if needed
   - preserve protected systems intelligence boundary

5. Remove or correct dead lineage trigger/drop line.

6. Return corrected SQL draft only.

7. Write OAR1 beside this OAR2 after completion.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_correction_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_correction_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## VALIDATION RETURN

Return:

1. corrected SQL summary
2. standing normalization confirmation
3. c3 7s alias confirmation
4. `system_concordance` / `coherence_matrix_v1` treatment
5. RLS/access correction summary
6. trigger correction summary
7. confirmation no DB/runtime/CSS/deprecation work occurred
8. readiness standing for migration execution OAR2

## SUCCESS CONDITION

The SQL draft is corrected and ready for operator review before migration execution OAR2.

## CLOSE

Correct the draft.
Preserve aliases.
Execution still waits.
