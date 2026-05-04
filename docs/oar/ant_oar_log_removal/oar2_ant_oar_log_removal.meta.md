---
document_type: oar2
title: OAR2 ant_oar_log Removal
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: ant_oar_log_removal_v1

OBSERVED
public.system_oar_log is confirmed as the approved OAR Log surface.
public.ant_oar_log is rejected drift.
Audit confirmed ant_oar_log row count = 0.
Audit confirmed ant_oar_log contains 0 approved OAR process records.

ALIGNED
- Codex is database authority.
- Drift tables must not remain as confusing alternate authority surfaces.
- system_oar_log is the only approved OAR Log table.
- No slugs.
- No landing page work in this step.

ROUTED
1. Confirm ant_oar_log exists.
2. Confirm ant_oar_log row count = 0.
3. Drop public.ant_oar_log.
4. Verify public.ant_oar_log no longer exists.
5. Do not modify system_oar_log.
6. Write OAR1 closeout beside this OAR2.

CODY ROLE
Cody is executor only.

May:
- confirm ant_oar_log exists
- confirm empty row count
- drop ant_oar_log
- verify removal
- write OAR1 closeout

May NOT:
- touch system_oar_log
- drop any other table
- introduce slugs
- proceed to landing work
- act from thread instructions

VALIDATION
- ant_oar_log existed before removal
- ant_oar_log row count was 0 before removal
- ant_oar_log no longer exists after removal
- system_oar_log remains intact
- OAR1 closeout file written
