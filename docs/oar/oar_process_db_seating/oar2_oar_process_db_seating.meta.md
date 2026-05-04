---
document_type: oar2
title: OAR2 oar_process_db_seating
version: v1
status: ready_for_cody
system: measures_registry
---

OAR2: oar_process_db_seating_v1

OBSERVED
OAR process docs and templates have been created in repo.

Required process docs:
- docs/process/oar/oar2_generation_and_handoff_process.meta.md
- docs/process/oar/db_role_contract_supabase.meta.md
- docs/process/oar/templates/oar1_template.meta.md
- docs/process/oar/templates/oar2_template.meta.md
- docs/process/oar/new-oar.ps1

Landing page work should remain held until the OAR process is seated as a DB-referenced process.

ALIGNED
- Codex is database authority
- Repo docs are source references, not DB authority by themselves
- DB seating must reference source_path, process_key, process_family, status
- No slugs
- No frontend dependency
- No process is considered DB-seated until verified by query

ROUTED
1. Create process registry table if absent: system_process_registry

2. Required fields:
- id
- process_key
- process_family
- title
- status
- source_path
- authority_state
- metadata
- created_at
- updated_at

3. Seat process records:
- oar2_generation_handoff_process_v1
- db_role_contract_supabase_v1
- oar1_template_v1
- oar2_template_v1
- oar_generator_v1

4. Metadata required:
- system: measures_registry
- operator: op044
- future_ops_identity: system@c3field.com
- no_slug_policy: true

5. After DB execution, create OAR1:
- oar1_seed_oar_process_registry_v1

CODY ROLE
Cody is executor only.

May:
- execute approved SQL contract
- create system_process_registry if absent
- insert defined process records
- verify query results
- report missing state

May NOT:
- invent schema beyond this contract
- introduce slugs
- rename process keys
- add extra process records
- make landing page changes in this step
- bypass verification

VALIDATION
- system_process_registry exists
- 5 process records are present
- process_family = oar
- no slug fields exist
- source_path values match repo paths
- authority_state = file_seeded_db_referenced
