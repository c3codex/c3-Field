---
document_type: oar1
authority_level: working
document_scope: phase_2_1_production_persistence_seating
title: OAR1 — Phase 2.1 Production Persistence Seating
status: held
version: v1
operator: op044
initiative: c3_field_convergence
source_oar2: docs/oar/c3_field_convergence/oar2_phase_2_1_production_persistence_seating_v1.meta.md
operation_key: phase_2_1_production_persistence_seating
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar1
  - production-persistence
  - supabase
  - registry
  - append-only
  - held-state
  - c3-field-convergence
source_alignment:
  - OAR2 — Phase 2.1 Production Persistence Seating
  - OAR1 — Phase 2 OAR Spine Persistence + Registry Convergence
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Phase 2.1 Production Persistence Seating

## OBJECTIVE

Record Cody execution evidence for the production persistence seating attempt.

This OAR1 records held standing because the production Supabase database password was not accepted by the remote database.

Held standing is valid operational standing.

---

## ACTION

Cody attempted to seat production persistence for:

```txt
supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql
```

The local Supabase project link was found stale.

Initial linked project:

```txt
xttrboiohqzusyaneuaw
```

Actual app Supabase project identified from the app environment and Supabase project listing:

```txt
zfihrspxvennjzazxcbj
```

Cody relinked the local Supabase project context to:

```txt
zfihrspxvennjzazxcbj
```

Correct pooler standing after relink:

```txt
aws-1-us-east-1.pooler.supabase.com
```

---

## VERIFICATION ATTEMPT

Runtime table verification was attempted through Supabase service-role client.

Required tables were not visible to PostgREST schema cache:

- `public.c3_oar_process_instance`
- `public.c3_oar_transition_event`
- `public.c3_oar_seeded_reference`

Observed runtime retrieval error:

```txt
Could not find the table in the schema cache
```

This confirms the live console's `HELD PENDING PERSISTENCE` standing is coherent.

The frontend did not invent registry state.

---

## MIGRATION APPLY ATTEMPT

Cody attempted Supabase CLI dry-run before applying migration.

Dry-run failed because the provided database password did not authenticate against the remote Postgres role.

Observed standing:

```txt
password authentication failed for user "postgres"
```

Because authentication failed, Cody did not apply the migration.

No production persistence mutation was completed.

---

## HELD STANDING

Current standing:

```txt
held_pending_operator
```

Held reason:

The production Supabase database password is required before Cody can apply:

```txt
supabase db push --password <database-password>
```

or the operator may manually run the SQL migration in the Supabase SQL editor.

Required SQL file:

```txt
supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql
```

---

## NOT COMPLETED

The following OAR2 validation items remain held:

- migration applied
- required tables exist
- append-only protection verified
- read policies verified
- console retrieves persistent registry state
- held pending persistence resolved through actual persistence

---

## PRESERVED BOUNDARY

Cody did not:

- create client write authority
- claim production completeness
- bypass OAR1
- mutate unrelated domains
- mutate non-c3 Field systems
- silently substitute runtime-modeled standing

---

## NEXT UNLOCK

To complete this OAR2, provide the actual Supabase database password or manually apply the migration SQL in the Supabase dashboard.

After migration application, Cody must verify:

- table existence
- seeded process rows
- seeded transition rows
- seeded reference rows
- append-only update/delete rejection
- anon/runtime read access
- anon/runtime write rejection
- c3field.online resolves from persistent registry state

---

## CLOSE

Production persistence seating remains held.

The hold is coherent.

Registry standing must exist before held persistence resolves.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
NotChazz protects.
