---
document_type: privileged_db_evidence_preflight
system: measures_registry
status: privileged_read_available_mutation_held
source_oar2: docs/seat/measures_registry/09_oar/oar2_verify_privileged_evidence_for_measures_registry_exact_row_db_reconciliation_v1.meta.md
db_access_standing: privileged_read_available
privileged_evidence_available: true
service_role_or_equivalent_used: true
db_mutation: false
rpc_executed: false
frontend_mutation: false
---

# Privileged DB Evidence Preflight

## Required Answers

1. Privileged read access is available through direct Supabase PostgREST table reads.
2. The server-side `SUPABASE_C3_SECRET` was used as equivalent privileged read authority. Its value was not exposed or recorded.
3. No writes, RPC calls, or mutations were executed.
4. All required tables were readable.
5. No table was blocked under privileged access. Anonymous access was partial for `measures_registry`, `measures_encounter_def`, and `measures_media_map`.
6. 140 existing rows have exact keys and current standing, but none are disposition-cleared for mutation.
7. `measures_publication_subscription_capture` has zero rows and therefore no primary key to reconcile.
8. All 140 existing indexed rows require operator review.
9. Shared/Inanna signals and media rows without explicit owner metadata require ownership reconciliation.
10. Recommended next OAR: `OAR2 - Resolve Operator Disposition and Rollback Plan for Measures Registry Exact-Row DB Reconciliation v1`.

## Read Counts

| table | privileged rows | anon rows | privileged-only rows |
| --- | ---: | ---: | ---: |
| measures_registry | 120 | 111 | 9 |
| measures_encounter_def | 104 | 92 | 12 |
| measures_media_map | 59 | 30 | 29 |
| measures_design_token | 52 | 52 | 0 |
| measures_publication_registry | 2 | 2 | 0 |
| measures_publication_dispatch | 2 | 2 | 0 |
| map_commerce_contracts | 3 | 3 | 0 |
| measures_publication_subscription_capture | 0 | 0 | 0 |

## Classification

- DB access standing: `privileged_read_available`
- privileged evidence available: `true`
- service-role or equivalent used: `true`
- indexed entries: `141`
- exact existing rows: `140`
- ready without operator decision: `0`
- blocked: `1`
- operator review: `140`

## Boundaries

No DB write, RPC, frontend mutation, route activation, payment activation, scheduling activation, MAP activation, SEAT activation, Crystal Seat activation, c3 Key assignment, Field access, certification, conversion, publishing, posting, upload, deletion, rename, or c3 back-office activation occurred.
