---
document_type: oar2
authority_level: working
document_scope: process_boundary
title: OAR2 — Active Session Transfer Surface Rule v1
status: proposed
version: v1
operator: op044
system: process
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
  - process-hardening
  - active-session
  - transfer-surface
  - notchazz
  - measures-interoperability
  - oar-lifecycle
source_alignment:
  - OAR Lifecycle — Execution and Handoff
  - Thread-to-Transfer Validation Rule
  - Doc-Set Closeout Rule
  - Seeded Reference Control
  - NotChazz — OAR2 Review Returned Without OAR1 Closeout
  - NotChazz — OAR2 Folder Surface Drift
  - OAR1 — Source Reference Schema SQL Draft v1
---

# OAR2 — Active Session Transfer Surface Rule v1

## OBSERVED

Measures Interoperability Session 2 produced three NotChazz flags:

1. Routed OAR2 review returned without OAR1 closeout.
2. Source Reference Schema SQL Draft OAR2 was initially routed into a new `source_authority` folder instead of the active session folder.
3. SQL draft artifact remained linked to `docs/oar/source_authority/` after the OAR1/OAR2 session folder correction.

The latest OAR1 confirms the SQL draft artifact is still recorded at:

`docs/oar/source_authority/source_reference_schema_sql_draft_v1.sql`

This reveals a recurring process seam:

**active session work is not yet fully governed as one transfer surface.**

## ALIGNED

OAR Lifecycle requires OAR1 beside OAR2 before completion.

Doc-set closeout requires file check, expected filenames, found filenames, missing filenames, and set standing before forward motion.

This OAR2 hardens placement and closeout only.

No DB mutation, runtime change, CSS change, Codex seating, migration execution, or deprecation execution is authorized.

## ROUTED

Create a process rule named:

**Active Session Transfer Surface Rule**

The rule must state:

1. One active session uses one active transfer surface.
2. Routed OAR2, resulting OAR1, supporting artifacts, validation outputs, and NotChazz R&Rs stay in the active session folder unless operator explicitly confirms a separate route.
3. Sub-scope belongs in metadata, not folder placement.
4. OAR1 must sit beside source OAR2.
5. Supporting artifacts must sit beside the OAR pair unless explicitly routed otherwise.
6. Expected artifact paths must be stated before handoff.
7. File check must confirm expected files before continuation.
8. If a file lands outside the active session surface, correct path before proceeding.
9. No new folder surface opens during a session by inference.

## ACTIVE SESSION RULE TEXT

One active session.
One transfer surface.
One env to hold.
Sub-scope in metadata.
Artifacts stay together until closeout.

## IMMEDIATE CORRECTION

Move SQL draft artifact from:

`docs/oar/source_authority/source_reference_schema_sql_draft_v1.sql`

to:

`docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

Update OAR1 field:

`sql_draft_artifact: docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## EXPECTED FILES AFTER CORRECTION

- `docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`
- `docs/oar/measures_interoperability/notchazz_rr_oar2_folder_surface_drift_2026-05-26.meta.md`
- `docs/oar/measures_interoperability/oar2_active_session_transfer_surface_rule_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_active_session_transfer_surface_rule_v1.meta.md`

## CODY ROLE

Cody or Claude-as-Cody may:

- write the process rule
- move the SQL draft artifact into the active session folder
- update the OAR1 artifact path
- write OAR1 closeout for this process hardening
- return file check output

Cody or Claude-as-Cody may not:

- modify SQL contents unless explicitly routed
- execute SQL
- modify DB state
- perform runtime/CSS work
- deprecate files
- open a new folder surface

## VALIDATION

Return:

1. expected files list
2. found files list
3. missing files list
4. confirmation that SQL artifact path was corrected
5. confirmation that OAR1 now points to the session artifact path
6. confirmation that no DB/runtime/CSS changes occurred

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_active_session_transfer_surface_rule_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the active session transfer surface rule is written, the SQL draft artifact is colocated with the session OAR pair, OAR1 path is corrected, and file check confirms one active session surface.

## CLOSE

One session.
One surface.
One env to hold.
