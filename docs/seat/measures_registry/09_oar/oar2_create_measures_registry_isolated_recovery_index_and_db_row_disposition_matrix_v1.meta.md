---
document_type: oar2
authority_level: working
document_scope: measures_registry_isolated_recovery
title: OAR2 - Create Measures Registry Isolated Recovery Index and DB Row Disposition Matrix v1
status: confirmed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/seat/measures_registry/09_oar/oar1_recover_and_isolate_current_measures_registry_db_and_docs_standing_v1.meta.md
---

# OAR2 - Create Measures Registry Isolated Recovery Index and DB Row Disposition Matrix v1

## OBSERVED

The recovery audit completed without mutation.

The audit confirmed:

- recovered standing is mixed;
- no recovered surface was promoted to launch_active;
- final isolation folder was not created;
- recommended isolation path is docs/seat/measures_registry_isolated/;
- live DB access was partial read-only anonymous;
- privileged DB metadata remains unavailable;
- DB conflicts require a row disposition matrix before any mutation.

## ALIGNED

Create the isolated Measures Registry recovery surface as documentation and review containment only.

This OAR2 creates:

- isolated recovery index
- recovered active/candidate/held/deprecated/drift indexes
- docs inventory report
- DB inventory report
- DB row disposition matrix
- launch surface decision record
- assessment-to-Crystal circuit gap report
- isolation preflight checklist

This OAR2 does not authorize:

- DB mutation
- frontend mutation
- file deletion
- file rename
- route activation
- launch activation
- publishing
- posting
- scheduling
- upload
- payment activation
- MAP activation
- SEAT activation
- Crystal Seat activation
- c3 Key assignment
- Field access
- certification
- conversion
- c3 back office activation

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

Create isolated folder:

docs/seat/measures_registry_isolated/

Create required isolation docs and populate from the completed recovery OAR1.

Expected OAR1:

docs/seat/measures_registry/09_oar/oar1_create_measures_registry_isolated_recovery_index_and_db_row_disposition_matrix_v1.meta.md

## VALIDATION

Cody must return:

1. created isolation folder path
2. created file list
3. source OAR1 linked
4. DB row disposition matrix path
5. docs inventory report path
6. DB inventory report path
7. launch surface decision path
8. assessment-to-Crystal gap report path
9. confirmation launch_active remains false
10. confirmation no DB mutation occurred
11. confirmation no frontend mutation occurred
12. confirmation no file deletion/rename occurred
13. confirmation no publish/post/schedule/upload occurred
14. confirmation no held activation occurred
15. OAR1 path

## CLOSE

This OAR2 succeeds when docs/seat/measures_registry_isolated/ exists and contains the isolated recovery index, DB row disposition matrix, inventory reports, launch decision record, circuit gap report, and isolation preflight checklist.

No DB mutation, frontend mutation, file deletion, file rename, route activation, launch activation, publishing, posting, scheduling, upload, payment activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, certification, conversion, or c3 back office activation is authorized.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Cody isolates.
src remains unchanged.
