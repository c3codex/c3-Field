---
document_type: process
title: Database Role Contract — Supabase
version: v1
status: seeded
system: measures_registry
---

# Database Role Contract — Supabase

Codex is database authority.

Cody may:
- execute approved SQL contracts
- create tables, functions, and policies from OAR2
- insert records defined in DB contracts
- report execution results

Cody may not:
- invent schema
- modify schema without OAR2
- insert arbitrary records
- bypass RPC for user-facing flows

OAR1 is required for:
- table creation
- schema updates
- data seeding
- media seating
- policy changes

OAR1 records:

OBJECTIVE
What DB change is being made.

ACTION
Exact SQL execution.

RESULT
What was created or modified.

Supabase process:
1. Define through OAR2
2. Execute through Cody
3. Log through OAR1
4. Verify by query

Constraints:
- RPC required for user flows
- media must be DB-seated
- registry identifiers only
- no slug usage
