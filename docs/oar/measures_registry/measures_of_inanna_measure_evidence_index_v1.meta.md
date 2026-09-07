---
document_type: evidence_index
authority_level: working
document_scope: map_environment_measure
title: Measures of Inanna — Measure Evidence Index
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_measure_measures_of_inanna_operational_environment_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Measure Evidence Index

Governed discovery evidence for OAR2 ROUTED section 17. Every finding across the six companion files traces to one of the observation methods below. Executor throughout: **Claude**, single session, 2026-07-15. Target environment for all rows: `measures_of_inanna` (Supabase project `zfihrspxvennjzazxcbj`, linked branch `main`, mapped to git branch `measures`) unless noted as repository-only.

| # | Evidence type | Method | Target | Observation time | Evidence location | OAR association | Verification standing | Limitation |
|---|---|---|---|---|---|---|---|---|
| 1 | db_query | `mcp__supabase__get_project_url`, `list_tables`, `list_branches` | Supabase project `zfihrspxvennjzazxcbj` | 2026-07-15 | this session's tool transcript | this OAR2 | verified live | none |
| 2 | file_check | `git rev-parse`, `git status --porcelain=v1 -uall`, `git worktree list` | repo `c3Field` | 2026-07-15 | baseline file §2 | this OAR2 | verified live | none |
| 3 | file_check | `git diff -- .mcp.json` | repo `c3Field` | 2026-07-15 | baseline file §2 | this OAR2 | verified live, no secret values read | none |
| 4 | db_query | `c3_oar_seeded_reference`, `concordance_document`, `concordance_version`, `concordance_term`, `system_process_registry` | Supabase | 2026-07-15 | baseline file §1 | this OAR2 | verified live (full-table reads) | title-matching against this OAR2's own source_alignment list is a keyword match, not semantic reconciliation |
| 5 | file_check | repo grep for source_alignment titles under `docs/` | repo `c3Field` | 2026-07-15 | baseline file §1.3 | this OAR2 | verified live | keyword grep only; a differently-named file could exist unfound |
| 6 | db_query | `measures_registry` (full table, 138 rows) | Supabase | 2026-07-15 | operational_map §4–6 | this OAR2 | verified live | none |
| 7 | db_query | `measures_encounter_def` (full table, 116 rows, joined to registry_key) | Supabase | 2026-07-15 | operational_map §4, §6 | this OAR2 | verified live | none |
| 8 | db_query | `measures_release_state` (full table, 68 rows, joined to registry_key) | Supabase | 2026-07-15 | operational_map §6; risk report §7 | this OAR2 | verified live | one row (`temple_antechamber_return`) expected but not returned — recorded as a finding, not silently dropped |
| 9 | db_query | `measures_transition_rule` (full table, 125 rows, joined to registry_key both sides) | Supabase | 2026-07-15 | operational_map §5, §8 | this OAR2 | verified live | none |
| 10 | db_query | `measures_surface_media_map` (full table, 67 rows), `codex_media_asset` (full table, 74 rows), `information_schema.columns` for `measures_media_map`/`media_storage_registry`/`temp_exhibition_media` | Supabase | 2026-07-15 | operational_map §9 | this OAR2 | verified live for the two full-table reads; `measures_media_map` (88 rows) schema-only, not row-read, in this pass | `measures_media_map` rows were not individually cross-checked against `measures_surface_media_map` — recorded as a limitation, not an assumption |
| 11 | db_query | `c3_registered_system` (full table, 2 rows) | Supabase | 2026-07-15 | operational_map §13 | this OAR2 | verified live | none |
| 12 | db_query | `c3_public_semantic_pairing` (full table, 8 rows) | Supabase | 2026-07-15 | operational_map §14; risk report §7 | this OAR2 | verified live | none |
| 13 | db_query | `c3_role_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` (full tables) | Supabase | 2026-07-15 | AI deployment inventory §10 | this OAR2 | verified live | none |
| 14 | db_query | `system_oar_log`, `system_oar_queue`, `system_oar_execution_evidence` (full tables) | Supabase | 2026-07-15 | AI deployment inventory §10 | this OAR2 | verified live | none |
| 15 | db_query | `c3_runtime_admission_contract`, `c3_runtime_admission_binding`, `c3_chamber_directory_binding`, `c3_orphaned_surface_registry` (full tables) | Supabase | 2026-07-15 | AI deployment inventory §12; missing/held register | this OAR2 | verified live | none |
| 16 | file_check | repo `src/` directory listing, `grep -ril` for resolver/renderer/FREE references | repo `c3Field` | 2026-07-15 | AI deployment inventory §11 | this OAR2 | verified live | grep by filename/content keyword only; did not read every matched file in full |
| 17 | file_check | `package.json` scripts (read via `node -e`, no execution) | repo `c3Field` | 2026-07-15 | baseline §2; AI deployment inventory §11 | this OAR2 | verified live | none |
| 18 | file_check | search for `.github/workflows`, `vercel.json`, `netlify.toml`, `wrangler.toml`, `dist-inanna/` | repo `c3Field` | 2026-07-15 | AI deployment inventory §11; risk report | this OAR2 | verified absent in this checkout | absence in-repo does not prove absence of an external/manual deploy process |
| 19 | db_query | `measures_registry_policy_scope_isolation` (10 of 32 rows, `measures_*` filter) | Supabase | 2026-07-15 | AI deployment inventory §15 | this OAR2 | verified live, partial (filtered subset) | the other 22 non-`measures_*` rows were not read in this pass |
| 20 | db_query | `measures_phase_calendar` (full table, 17 rows) | Supabase | 2026-07-15 | operational_map §5 | this OAR2 | verified live | none |

**Cross-role evidence:** row 14 (`system_oar_execution_evidence`) carries forward one prior finding (`c3_oar_transition_event.actor` constraint gap) originally recorded by a different OAR2's own execution evidence, not re-derived here — attribution preserved exactly (see risk report row `claude_actor_constraint_gap_carried_forward`, sourced to migration `20260714214628_...sql`).

**No finding in any of the six companion files was inferred from thread memory.** Every row above was read live in this session on 2026-07-15.
