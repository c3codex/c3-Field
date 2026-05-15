---
document_type: oar1
authority_level: working
document_scope: phase_2_1_production_persistence_seating
title: OAR1 — Phase 2.1 Production Persistence Seating
status: seeded
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

Record Cody execution evidence for production persistence seating.

This OAR1 records that held persistence standing resolved through actual registry-backed persistence.

No public completeness claim is made.

---

## ACTION

Cody seated production persistence for:

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

Supabase CLI dry-run succeeded through the session pooler and reported pending migrations:

```txt
202605120001_expand_codex_media_asset_storage_provider.sql
202605140001_c3_field_oar_spine_persistence.sql
```

Both migrations were applied successfully.

---

## VERIFICATION

Runtime table verification was completed through Supabase service-role and anon clients.

Required tables are visible through PostgREST:

- `public.c3_oar_process_instance`
- `public.c3_oar_transition_event`
- `public.c3_oar_seeded_reference`

Verified row standing:

```txt
c3_oar_process_instance: 6 rows
c3_oar_transition_event: 6 rows
c3_oar_seeded_reference: 4 rows
```

Anon runtime read access was verified for all three tables.

Anon runtime write attempt was rejected by RLS.

---

## APPEND-ONLY VERIFICATION

Append-only transition protection was verified.

Service-role update attempt against `c3_oar_transition_event` was rejected:

```txt
c3_oar_transition_event is append-only
```

Service-role delete attempt against `c3_oar_transition_event` was rejected:

```txt
c3_oar_transition_event is append-only
```

Transition records remain append-only.

---

## RUNTIME RESOLUTION

Live runtime verification was completed at:

```txt
https://c3field.online/
```

Observed live standing:

```txt
registry backed
Rendering persistent Supabase registry standing.
```

The live console no longer reports:

```txt
Registry Standing Held
```

Held persistence resolved only after registry standing existed.

---

## COMPLETED STANDING

Current standing:

```txt
registry_backed
```

Completed OAR2 validation items:

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

## CLOSE

Production persistence seating is complete.

The prior hold was coherent and resolved through actual persistence.

Registry standing now exists before runtime recognition.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes.
NotChazz protects.
