---
document_type: oar2
title: OAR2 OAR Process Log Table Creation
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: oar_process_log_table_creation_v1

OBSERVED
system_process_registry exists and is seated correctly.
The OAR1 closeout file exists.
No approved DB table currently exists for registering OAR1 process closeout logs.

A table named ant_oar_log exists, but it is not an approved OAR process log table.
ant_oar_log is drift and must not be used.

ALIGNED
- Codex is database authority.
- OAR logs require approved DB structure.
- No drift tables may be reused because they look similar.
- No slugs.
- No destructive drop until audit confirms safe removal.
- Cody executes from OAR2 only.
- OAR1 file + DB log are required for closeout.

ROUTED
1. Inspect ant_oar_log.
2. Confirm row count.
3. Confirm no Measures Registry OAR process records were inserted into ant_oar_log.
4. Do not insert into ant_oar_log.
5. Create approved table if absent:

table: public.system_oar_log

Required fields:
- id uuid primary key
- oar_key text not null
- oar_type text not null
- process_key text
- source_oar2_path text
- oar1_file_path text
- objective text
- action text
- result text
- validation_summary text
- status text not null
- metadata jsonb
- created_at timestamptz
- updated_at timestamptz

6. Add constraints:
- oar_type in ('oar1','oar2')
- status in ('draft','executed','validated','closed','failed')
- unique(oar_key)

7. Register current executed OAR1:

oar_key:
oar1_seed_oar_process_registry_v1

oar_type:
oar1

process_key:
oar_process_db_seating_v1

source_oar2_path:
docs/oar/oar_process_db_seating/oar2_oar_process_db_seating.meta.md

oar1_file_path:
docs/oar/oar_process_db_seating/oar1_seed_oar_process_registry.meta.md

status:
closed

8. Return validation output:
- system_oar_log exists
- one OAR1 row registered
- ant_oar_log has zero matching OAR process rows
- no slug fields introduced

9. Do not drop ant_oar_log yet.
Mark it as rejected drift in report.
Drop/deletion requires separate OAR2 after audit.

CODY ROLE
Cody is executor only.

May:
- inspect ant_oar_log
- create system_oar_log from this contract
- insert the current OAR1 process log
- return validation query output
- report drift exactly

May NOT:
- use ant_oar_log
- drop ant_oar_log in this step
- invent schema beyond this OAR2
- introduce slugs
- proceed to landing page work
- act from thread instructions

VALIDATION
- public.system_oar_log exists
- oar1_seed_oar_process_registry_v1 is registered
- status = closed
- ant_oar_log not used
- no slug fields exist
- validation query output returned
