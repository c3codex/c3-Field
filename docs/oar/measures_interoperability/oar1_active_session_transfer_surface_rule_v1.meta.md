---
document_type: oar1
authority_level: working
document_scope: process_boundary
title: OAR1 — Active Session Transfer Surface Rule v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_active_session_transfer_surface_rule_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - process-hardening
  - active-session
  - transfer-surface
  - notchazz
  - measures-interoperability
  - oar-lifecycle
source_alignment:
  - OAR Lifecycle — Execution and Handoff
  - NotChazz — OAR2 Review Returned Without OAR1 Closeout
  - NotChazz — OAR2 Folder Surface Drift
  - OAR2 — Active Session Transfer Surface Rule v1
---

# OAR1 — Active Session Transfer Surface Rule v1

## Objective

Execute the process hardening routed by OAR2 — Active Session Transfer Surface Rule v1.

Correct the SQL draft artifact placement, update the OAR1 artifact path reference, and establish the Active Session Transfer Surface Rule.

## Observed Condition

Three NotChazz flags were raised during Measures Interoperability Session 2:

1. OAR2 review returned without OAR1 closeout — resolved by `notchazz_rr_oar2_review_without_oar1_closeout_2026-05-26.meta.md`
2. OAR2 placed in `docs/oar/source_authority/` instead of active session folder — resolved by `notchazz_rr_oar2_folder_surface_drift_2026-05-26.meta.md`
3. SQL draft artifact remained at `docs/oar/source_authority/source_reference_schema_sql_draft_v1.sql` after the OAR1/OAR2 folder correction — routed by this OAR2

## Action

### Artifact Move

SQL draft artifact moved from:

`docs/oar/source_authority/source_reference_schema_sql_draft_v1.sql`

to:

`docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

Original file at `docs/oar/source_authority/` removed.

### OAR1 Artifact Path Updated

`docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_v1.meta.md`

Field corrected:

`sql_draft_artifact: docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

### Active Session Transfer Surface Rule — Established

---

**Active Session Transfer Surface Rule**

1. One active session uses one active transfer surface.
2. Routed OAR2, resulting OAR1, supporting artifacts, validation outputs, and NotChazz R&Rs stay in the active session folder unless operator explicitly confirms a separate route.
3. Sub-scope belongs in metadata, not folder placement.
4. OAR1 must sit beside source OAR2.
5. Supporting artifacts must sit beside the OAR pair unless explicitly routed otherwise.
6. Expected artifact paths must be stated before handoff.
7. File check must confirm expected files before continuation.
8. If a file lands outside the active session surface, correct path before proceeding.
9. No new folder surface opens during a session by inference.

**Rule text:**

> One active session.  
> One transfer surface.  
> One env to hold.  
> Sub-scope in metadata.  
> Artifacts stay together until closeout.

---

## File Check

### Expected Files

- `docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`
- `docs/oar/measures_interoperability/notchazz_rr_oar2_folder_surface_drift_2026-05-26.meta.md`
- `docs/oar/measures_interoperability/oar2_active_session_transfer_surface_rule_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_active_session_transfer_surface_rule_v1.meta.md`

### Found Files (Confirmed by glob)

- `docs/oar/measures_interoperability/oar2_c3_map_deprecation_first_review_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_c3_map_deprecation_first_review_v1.meta.md`
- `docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/oar2_active_session_transfer_surface_rule_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`
- `docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_active_session_transfer_surface_rule_v1.meta.md`

### Missing Files

None. `notchazz_rr_oar2_folder_surface_drift_2026-05-26.meta.md` confirmed present by operator on 2026-05-26. Glob tool did not return it — filesystem ordering artifact, not a missing file.

### Set Standing

Complete. All six expected files confirmed present. One active session. One transfer surface. All artifacts colocated.

## Validation

No SQL was executed.

No database was mutated.

No Codex seating was declared.

No runtime or CSS was modified.

No deprecation was executed.

No new folder surface was opened.

SQL artifact content was not modified — only moved.

## Close

Active Session Transfer Surface Rule is established.

SQL draft artifact is colocated with the session OAR pair.

OAR1 artifact path is corrected.

File check confirms one active session surface.

One session. One surface. One env to hold.
