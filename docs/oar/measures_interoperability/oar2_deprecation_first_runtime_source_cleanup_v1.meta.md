---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Deprecation-First Runtime Source Cleanup v1
status: proposed
version: v1
operator: op044
system: measures_interoperability
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
  - measures-interoperability
  - deprecation-first
  - runtime-source-cleanup
  - css-boundary
  - source-reference
  - c3-map
  - artifact-proof
source_alignment:
  - Session Role — Measures Interoperability Session 2
  - OAR1 — Source Reference Extension UPSERT Correction v1
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
  - Chazz x Cody Development Role Contract
---

# OAR2 — Deprecation-First Runtime Source Cleanup v1

## OBSERVED

Measures Interoperability Session 2 required source-reference resolution before deprecation execution.

That seam is now closed:

- source-reference existing schema extension completed
- UPSERT guard correction completed
- all 19 source keys present
- c3 7s aliases confirmed
- seeded rows preserved
- unresolved rows remain written/operator-required
- DB proof returned and committed

The session role requires deprecation before runtime/CSS alignment.

OAR Lifecycle requires OAR2 as the instruction surface and OAR1 beside OAR2 for completion.

## ALIGNED

This OAR2 routes deprecation-first cleanup review and execution plan.

The purpose is to identify and prepare removal or quarantine of deprecated source/runtime/CSS surfaces before governed Measures Registry architecture contracts and runtime/CSS alignment proceed.

This OAR2 does not authorize broad runtime redesign.

This OAR2 does not authorize CSS redesign.

This OAR2 does not authorize deleting seeded references.

Seeded and unseeded docs must remain distinct before downstream database or implementation change.

## ROUTED

Cody or Claude-as-Cody-compatible executor is routed to perform deprecation-first cleanup.

Executor must:

1. Inspect Measures Registry runtime/source files for deprecated or conflicting source authority surfaces.
2. Identify files, imports, constants, CSS, or runtime claims that conflict with the seated source-reference state.
3. Classify each candidate as:
   - retain
   - deprecate
   - quarantine
   - replace_after_contract
   - hold_for_operator_review
4. Confirm whether each candidate is:
   - runtime source
   - CSS/design surface
   - documentation/source record
   - registry contract
   - deprecated duplicate
   - seeded reference
5. Do not delete anything that is seeded, source-authority, or unresolved without explicit operator confirmation.
6. Prepare a cleanup action map before modifying files.
7. Execute only bounded cleanup after the action map is confirmed.
8. Write OAR1 beside this OAR2 after execution.

## DEPRECATION RULE

Deprecation means removal from active authority or runtime use.

Deprecation does not mean erasure.

Deprecated surfaces must remain traceable unless explicitly removed by operator-confirmed route.

## CANDIDATE REVIEW TARGETS

Executor must review for:

1. Runtime-held source claims now superseded by `codex_source_reference`.
2. Hardcoded governance/source arrays that should now resolve through DB source-reference.
3. Any `DB_HELD_CODEX_SOURCE_RECORDS` style runtime list.
4. CSS or runtime files carrying old Measures Registry assumptions.
5. Duplicated source-reference SQL drafts not used by the final executed route.
6. Old executable SQL artifacts that should be marked superseded, retained as evidence, or quarantined.
7. Any source-authority folder/file created outside active session surface.
8. Any file that implies source seating without OAR1 proof.

## NON-NEGOTIABLES

Executor must not:

1. Delete seeded references.
2. Delete OAR1/OAR2 evidence.
3. Delete SQL execution artifacts tied to proof.
4. Modify DB state.
5. Modify runtime behavior beyond approved cleanup.
6. Modify CSS beyond approved deprecation boundary.
7. Promote unresolved records.
8. Collapse `SRC`, `SRC1`, `SRC2`, and `src`.
9. Treat frontend as authority.
10. Treat committed docs as seeded unless incorporation standing is confirmed.

## REQUIRED OUTPUT BEFORE ANY FILE MODIFICATION

Return a deprecation action map:

file_path
surface_type
current_role
reason_for_review
recommended_action
risk_level
requires_operator_confirmation
replacement_or_successor

## EXECUTION VALIDATION

After approved cleanup, return:

1. Files changed.
2. Files retained.
3. Files quarantined/deprecated.
4. Files held for operator review.
5. Evidence that seeded/OAR proof files were not removed.
6. Evidence that runtime still builds or typechecks if source files were modified.
7. Confirmation no DB mutation occurred.
8. Confirmation no CSS alignment work occurred beyond deprecation boundary.
9. OAR1 closeout path.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_deprecation_first_runtime_source_cleanup_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_deprecation_first_runtime_source_cleanup_v1.meta.md`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_deprecation_first_runtime_source_cleanup_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when deprecated runtime/source/CSS conflict surfaces are identified, mapped, and either safely deprecated or held without disturbing seeded evidence, source-reference proof, DB state, or runtime/CSS alignment sequence.

## CLOSE

Deprecate first.
Preserve proof.
Hold unresolved.
Runtime and CSS wait.
