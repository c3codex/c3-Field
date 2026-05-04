---
document_type: oar1
title: OAR1 Seed OAR Process Registry
version: v1
status: executed
system: measures_registry
operator: op044
---

OAR1: oar1_seed_oar_process_registry_v1

OBJECTIVE
Seat the OAR process documents as DB-referenced process records for Measures Registry.

ACTION
Create `public.system_process_registry` if absent and upsert exactly five process records:
- oar2_generation_handoff_process_v1
- db_role_contract_supabase_v1
- oar1_template_v1
- oar2_template_v1
- oar_generator_v1

RESULT
Verified by query:
- system_process_registry exists
- 5 process records are present
- process_family = oar
- no slug fields exist
- source_path values match repo paths
- authority_state = file_seeded_db_referenced

SOURCE
docs/oar/oar_process_db_seating/oar2_oar_process_db_seating.meta.md
