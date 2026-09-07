---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Schema SQL Draft v1
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
  - sql-draft
  - codex-source-record
  - source-reference
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
  - OAR1 — c3 MAP / Deprecation-First Review v1
---

# OAR2 — Source Reference Schema SQL Draft v1

## OBSERVED

c3 MAP / Deprecation-First Review v1 identified an open source-authority seam:

**DRIFT-01 — Source Authority SQL Draft OAR2 Not Created**

The missing next surface is:

**OAR2 — Source Reference Schema SQL Draft v1**

The system is not ready for deprecation execution until this source-reference SQL draft path is resolved.

## ALIGNED

This OAR2 routes SQL draft formation only.

Seeded references must be checked before database change. OAR2 remains the routing surface. OAR1 is required for closeout.

No DB mutation, Codex seating, runtime work, CSS work, or deprecation execution is authorized.

## ROUTED

Claude-as-Cody-compatible executor is routed to draft the SQL plan only.

Claude must:

1. Inspect existing source-authority docs and migrations.
2. Identify existing source authority tables, if any.
3. Draft the proposed SQL schema or migration needed for source reference seating.
4. Include non-mutating query checks for:
   - `twenty_one_of_coherence`
   - `seed_concordance`
   - `coherence_matrix_v1`
5. Preserve standing distinctions:
   - candidate
   - written
   - committed
   - seeded
   - codex_seated
6. Return the SQL draft without executing it.
7. Write OAR1 beside this OAR2 after completion.

Claude must not:

1. Execute SQL.
2. Modify database state.
3. Declare Codex seating.
4. Modify runtime or CSS.
5. Deprecate files.
6. Treat held references as seated.

## SQL DRAFT REQUIREMENTS

The draft must preserve:

- source key
- title
- source type
- authority level
- document scope
- current standing
- file path
- source alignment
- seeded standing
- Codex seating standing
- review status
- OAR linkage
- timestamps

## REQUIRED VALIDATION QUERIES

Include non-mutating SQL queries to check:

1. Whether source reference tables already exist.
2. Whether the three named governance/source records exist.
3. Whether duplicate source keys exist.
4. Whether any records claim `codex_seated` without OAR evidence.
5. Whether candidate or held sources are being treated as seated.

## BOUNDARY

Draft only.

No migration execution.  
No source insertion.  
No deprecation execution.  
No runtime or CSS alignment.

## EXPECTED OAR1

`docs/oar/source_authority/oar1_source_reference_schema_sql_draft_v1.meta.md`

OAR1 must document objective, action, result, files inspected, SQL draft summary, validation queries, and readiness standing for later migration OAR2.

## SUCCESS CONDITION

A bounded SQL draft and validation query set exist for source reference seating, with no database mutation or Codex seating claim.

## CLOSE

Draft first.  
Validate next.  
Execute only by later OAR2.
