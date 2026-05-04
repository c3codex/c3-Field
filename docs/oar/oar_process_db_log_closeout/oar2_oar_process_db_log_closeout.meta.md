---
document_type: oar2
title: OAR2 OAR Process DB Log Closeout
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: oar_process_db_log_closeout_v1

OBSERVED
OAR lifecycle is now seeded as process.

Current lifecycle requires:
- Cody executes from OAR2 only
- Cody writes OAR1 beside authorizing OAR2
- No OAR1 file means process is not complete

Current gap:
OAR1 file logging is defined, but DB registration of the executed OAR1 log must also be seated.

ALIGNED
- Codex is database authority
- OAR1/OAR2 native meanings are not redefined globally
- This is process-state usage:
  - OAR2 = execution contract
  - OAR1 = executed result log
- No thread instructions to Cody
- No slugs
- No DB write without OAR1
- No completion without OAR1 file and DB record

ROUTED
1. Update OAR closeout process so completed execution requires:
   - OAR1 file written beside OAR2
   - OAR1 DB log inserted or registered
   - validation query returned
   - operator review
   - git commit

2. For the current OAR process DB seating, ensure OAR1 is registered in DB.

3. Use existing DB structure if available.
   If no OAR log table exists, report missing table and do not invent schema without a new OAR2.

4. Return:
   - OAR1 file path
   - DB record key/id
   - validation query output

CODY ROLE
Cody is executor only.

May:
- inspect existing OAR/process DB tables
- register executed OAR1 if the approved DB surface exists
- return validation output
- report missing DB structure exactly

May NOT:
- invent OAR schema
- introduce slugs
- rename OAR process keys
- bypass validation
- proceed to landing page work
- act from thread instructions

VALIDATION
- OAR1 file exists beside authorizing OAR2
- OAR1 DB record exists
- DB record references correct process/OAR key
- no slug fields introduced
- validation query output returned
