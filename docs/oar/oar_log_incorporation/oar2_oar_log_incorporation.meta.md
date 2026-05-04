---
document_type: oar2
title: OAR2 OAR Log Incorporation
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: oar_log_incorporation_v1

OBSERVED
system_oar_log exists as the approved DB surface for OAR registration.
ant_oar_log exists as drift and must not be used.
OAR Log is the native recorded trace surface for meaningful operation.
OAR Log may register OAR1 and OAR2 records.

ALIGNED
- Codex is database authority.
- OAR1 remains Objective / Action / Result.
- OAR2 remains Observed / Aligned / Routed.
- OAR Log is the DB trace surface for registered OAR records.
- system_oar_log is the approved OAR Log table.
- ant_oar_log is rejected drift.
- No slugs.
- No thread instructions to Cody.

ROUTED
1. Treat public.system_oar_log as the approved OAR Log surface.
2. Confirm system_oar_log supports:
   - oar_key
   - oar_type
   - process_key
   - source_oar2_path
   - oar1_file_path
   - objective
   - action
   - result
   - validation_summary
   - status
   - metadata
3. Confirm oar_type allows:
   - oar1
   - oar2
4. Register current standing:
   - OAR1 closeout remains registered in system_oar_log.
5. Audit ant_oar_log:
   - confirm row count
   - confirm no approved OAR process records exist there
   - mark as rejected drift in validation report
6. Do not drop ant_oar_log in this OAR2 unless it is empty and explicitly safe.
7. If non-empty, report rows and hold for separate removal OAR2.

CODY ROLE
Cody is executor only.

May:
- inspect system_oar_log
- validate system_oar_log as approved OAR Log surface
- audit ant_oar_log
- return validation output
- write OAR1 closeout file for this OAR2

May NOT:
- use ant_oar_log
- invent schema
- introduce slugs
- drop tables unless explicitly safe and empty
- proceed to landing work
- act from thread instructions

VALIDATION
- system_oar_log confirmed as approved OAR Log surface
- oar_type supports oar1 and oar2
- existing OAR1 closeout remains registered
- ant_oar_log not used
- ant_oar_log audit returned
- no slug fields introduced
- OAR1 closeout file written beside this OAR2
