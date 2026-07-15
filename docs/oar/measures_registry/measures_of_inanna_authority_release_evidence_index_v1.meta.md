---
document_type: evidence_index
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Authority and Release Evidence Index
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Authority and Release Evidence Index

Executor throughout: **Claude**, single session, 2026-07-15. All rows against Supabase project `zfihrspxvennjzazxcbj` unless marked repository-only. No evidence below was inferred from thread memory.

| # | Evidence type | Method | Evidence location | Verification standing | Limitation |
|---|---|---|---|---|---|
| 1 | file_check | `git merge-base --is-ancestor 382a83c HEAD` | baseline audit §1 | verified live | none |
| 2 | db_query | `information_schema.columns` for `release_state`/`access_state` on `measures_registry`/`measures_release_state` | baseline audit §3 | verified live | none |
| 3 | db_query | `information_schema.routines` filtered for release/resolve/encounter/access/phase | baseline audit §2 | verified live | none |
| 4 | db_query | `pg_get_functiondef` for `ensure_measures_release_state`, `reconcile_due_releases`, `resolve_measures_next_step`, `resolve_measures_progression`, `resolve_phase_map_outbound`, `define_measures_encounter` | precedence map, cadence audit | verified live, full function bodies read | none |
| 5 | db_query | `pg_views` definitions for 11 named views | baseline audit §2, precedence map | verified live, full definitions read | 23 other views in `public` were listed but not read in full |
| 6 | db_query | `pg_constraint` check-constraint definitions for 5 tables | baseline audit §3 | verified live | none |
| 7 | db_query | `information_schema.triggers` for 7 tables | baseline audit §2 | verified live | none |
| 8 | db_query | `cron.job` | baseline audit §2, cadence audit | verified live | none |
| 9 | db_query | `pg_policies` for 5 tables | baseline audit §2, discrepancy audit | verified live | only the 5 tables named in the OAR2's minimum list were checked; other tables' RLS was not re-audited |
| 10 | db_query | `information_schema.role_table_grants` for 11 views, filtered to `anon`/`authenticated` | precedence map | verified live | grants prove permission to query; behavior against RLS was independently confirmed via live readback (row 12) |
| 11 | db_query | `pg_class.reloptions` for 4 views (`security_invoker` check) | precedence map | verified live | only 4 of the 11 relevant views were checked for this flag |
| 12 | anonymous_readback | transaction-scoped `set local role anon` reads against `measures_registry`, `measures_release_state`, `v_measures_release_surface_v1`, `measures_encounter_def`, all rolled back | discrepancy audit | verified live, database_confirmed, anonymous_readback_confirmed | limited to the 6 rows named in the source OAR2 plus the direct-table sanity checks |
| 13 | db_query | live comparison of `measures_release_state.phase_label` vs. `measures_phase_calendar.phase_key` for all held Gate/Epithet/ME rows | cadence audit | verified live | none |
| 14 | file_check | `resolve_encounter.ts`, `registryResolver.ts` full source read | precedence map | verified live | other resolver/renderer files in the required inspection list (`MeasuresRegistryOrchestrator.tsx`, `encounterComposition.ts`) were not read in full text in this pass — recorded as a limitation |
| 15 | file_check | repository-wide grep for `registered_runtime`/`RegisteredRuntime`/`registeredRuntimeUtils` across `src/**/*.ts(x)`; `App.tsx` import inspection | precedence map | verified live, zero matches confirmed | grep-based; a dynamic or string-constructed import would not be caught |
| 16 | file_check | repository-wide grep for `gate_4_breastplate`/`gate_4` across `supabase/migrations/` and `scripts/`/`docs/` | discrepancy audit | verified live, zero matches in migrations confirmed | grep-based, exact-string only |
| 17 | file_check | read of `docs/oar/measures_registry/execute-normalize-phase-map-release-surface-and-copy.cjs` (excerpt) and `diagnose_inanna_full_encounter_matrix_v1.json` (excerpt) | discrepancy audit | verified live | excerpts only, not full-file review |
| 18 | web_fetch | `https://www.measuresregistry.com` (domain sourced from in-repo SEO/launch documentation, not guessed) | precedence map | attempted, HTTP 403 returned | classified `runtime_unverified` — could not distinguish bot-blocking from application failure |
| 19 | db_query | full `measures_release_state` phase_label listing (9 distinct values) and full `measures_phase_calendar` listing (17 rows) | cadence audit | verified live | none |

No database row, migration, RLS policy, or source file was modified in the course of gathering this evidence.
