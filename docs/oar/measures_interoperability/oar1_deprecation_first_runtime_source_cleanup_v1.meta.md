---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — Deprecation-First Runtime Source Cleanup v1
status: completed
version: v1
operator: op044
date: 2026-05-27
source_oar2: docs/oar/measures_interoperability/oar2_deprecation_first_runtime_source_cleanup_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - measures-interoperability
  - deprecation-first
  - runtime-source-cleanup
  - action-map
  - completed
source_alignment:
  - OAR2 — Deprecation-First Runtime Source Cleanup v1
  - OAR1 — Source Reference Extension UPSERT Correction v1
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Deprecation-First Runtime Source Cleanup v1

## Status

**Completed.**

Inspection complete. Action map confirmed by operator. `execute-extension.js` removed.
Credential rotation confirmed by operator through authorized Supabase/Cloudflare/local
secret surfaces. All validation queries passed. Carried-forward items documented.

## 1 — Inspection Scope

Surfaces reviewed per OAR2 candidate review targets:

| Target | Found |
|---|---|
| `DB_HELD_CODEX_SOURCE_RECORDS` style runtime list | YES — `src/shared/c3/oar2Governance.ts` line 45 |
| Hardcoded governance/source arrays | YES — `CodexSourceRecordKey` type + constant |
| Old executable SQL artifacts | YES — `execute-extension.js` at project root |
| Duplicated source-reference SQL drafts | `source_reference_schema_sql_draft_v1.sql` — DO NOT EXECUTE, evidence only |
| CSS or runtime files carrying old assumptions | Not found in this inspection |
| Source-authority file outside active session surface | Not found in this inspection |
| File implying source seating without OAR1 proof | Not found in this inspection |
| Runtime-held source claims superseded by DB | `DB_HELD_CODEX_SOURCE_RECORDS` — partially superseded, held for future OAR2 |
| Legacy scripts with old env var name | YES — `docs/_source/session_25/sql/*.cjs`, `docs/oar/*/execute-*.cjs`, `scripts/*.cjs`, `functions/api/*.ts` — carried forward |

## 2 — Deprecation Action Map

### Surface 1 — `execute-extension.js` (project root)

| Field | Value |
|---|---|
| surface_type | runtime execution script |
| current_role | failed DB execution attempt artifact — superseded |
| reason_for_review | Created during execution attempts before operator-mediated Supabase SQL Editor route was confirmed. REST API cannot execute arbitrary SQL — script never functioned. Hardcoded service_role JWT committed directly into file content. Not referenced by any import, script, or package.json entry. No source-authority standing. No OAR1 proof dependency. |
| recommended_action | **deprecate — remove** |
| risk_level | HIGH — service_role key committed to git history. Rotation required to close exposure. |
| requires_operator_confirmation | YES — confirmed |
| replacement_or_successor | operator-mediated SQL execution via Supabase SQL Editor (confirmed route) |

**Standing: EXECUTED — removed. Credential rotated by operator.**

---

### Surface 2 — `src/shared/c3/oar2Governance.ts` — `DB_HELD_CODEX_SOURCE_RECORDS`

| Field | Value |
|---|---|
| surface_type | runtime source claim (TypeScript constant + union type) |
| current_role | hardcoded list of source keys treated as DB-held by governance resolver |
| reason_for_review | (a) Uses alias `"twenty_one_of_coherence"` as `CodexSourceRecordKey` but canonical DB `source_key` is `"source_21_of_coherence_v1"`. The alias is stored in the `aliases` jsonb column, not `source_key`. Runtime resolution against `source_key` will not match `"twenty_one_of_coherence"` in the live table. (b) `coherence_matrix_v1` is now in DB as `written/operator_required`. (c) List is a pre-extension snapshot; DB resolution is the correct direction. |
| recommended_action | **hold_for_operator_review** — not modified in this route |
| risk_level | MEDIUM — alias vs canonical key mismatch |
| requires_operator_confirmation | YES — confirmed hold |
| replacement_or_successor | Future runtime OAR2 to align `CodexSourceRecordKey` and `DB_HELD_CODEX_SOURCE_RECORDS` against seated `source_key` values |

**Standing: HELD — carried forward to future runtime OAR2.**

---

### Surface 3 — Legacy scripts using `SUPABASE_SERVICE_ROLE_KEY` env name

| Field | Value |
|---|---|
| surface_type | script env var name references |
| affected files | `docs/_source/session_25/sql/*.cjs`, `docs/oar/*/execute-*.cjs`, `docs/db/reconstruction/*.cjs`, `scripts/*.cjs`, `functions/api/*.ts` |
| current_role | dev and execution scripts reading service credentials from environment |
| reason_for_review | Use old env var name `SUPABASE_SERVICE_ROLE_KEY`. Active server-side secret is `SUPABASE_C3_SECRET`. No hardcoded credential values — all read from environment. Not VITE_* variables. Not frontend code. |
| recommended_action | **hold_for_operator_review** — not modified in this route |
| risk_level | LOW — env var name mismatch only; no committed credential values |
| requires_operator_confirmation | YES — confirmed hold |
| replacement_or_successor | Future script-hardening OAR2 to align env var names to `SUPABASE_C3_SECRET` |

**Standing: HELD — carried forward to future script-hardening OAR2.**

---

### Surface 4 — SQL proof artifacts (measures_interoperability)

| File | Action |
|---|---|
| `source_reference_schema_sql_draft_v1.sql` | retain — DO NOT EXECUTE, evidence |
| `source_reference_existing_schema_extension_v1.sql` | retain — OAR1 proof dependency |
| `source_reference_existing_schema_extension_EXECUTABLE.sql` | retain — executed artifact |

**Standing: ALL RETAINED — confirmed.**

---

## 3 — Summary Table

| Surface | Action | Risk | Standing |
|---|---|---|---|
| `execute-extension.js` | removed | HIGH (resolved) | EXECUTED |
| `oar2Governance.ts` `DB_HELD_CODEX_SOURCE_RECORDS` | hold | MEDIUM | CARRIED FORWARD |
| Legacy scripts — env var name | hold | LOW | CARRIED FORWARD |
| SQL proof artifacts (3 files) | retain | NONE | CONFIRMED |

## 4 — Operator Confirmation (2026-05-27)

| # | Decision | Confirmed |
|---|---|---|
| 1 | Remove `execute-extension.js` | YES |
| 2 | Credential rotation completed through authorized Supabase/Cloudflare/local secret surfaces | YES |
| 3 | `SUPABASE_C3_SECRET` is the active server-side secret name | YES |
| 4 | No service role key may be committed, placed in frontend code, or placed in any `VITE_*` variable | YES |
| 5 | Do not modify `src/shared/c3/oar2Governance.ts` in this route | YES |
| 6 | Carry `DB_HELD_CODEX_SOURCE_RECORDS` alias/canonical correction forward to future runtime OAR2 | YES |
| 7 | Do not modify `docs/_source/session_25/sql/*.cjs` in this route | YES |
| 8 | Carry legacy script env-name hardening forward to future script-hardening OAR2 | YES |
| 9 | Retain all OAR1/OAR2, SQL draft, planning, and executable proof artifacts | YES |
| 10 | Update OAR1 to completed only if validation passes | YES — validation passed |

## 5 — Validation Results

Command: `git grep -n "service_role|SERVICE_ROLE|SERVICE_ROLL|SUPABASE_SERVICE|VITE_SUPABASE_SERVICE|eyJ" .`

| Check | Result | Notes |
|---|---|---|
| `execute-extension.js` removed from project root | PASS | file not present |
| No hardcoded JWT values in tracked files | PASS | zero results for literal JWT token pattern |
| `auth.role() = 'service_role'` in SQL RLS policies | EXPECTED — not a credential | correct PostgreSQL RLS syntax |
| `SUPABASE_SERVICE_ROLE_KEY` env name in legacy scripts | NOTED — env name references only, no hardcoded values | carried forward per decisions 7/8 |
| No `VITE_SUPABASE_SERVICE_ROLE_KEY` in active runtime src | PASS | no hits in `src/` outside legacy read-only scripts |
| No DB mutation occurred | PASS | |
| No runtime behavior change occurred | PASS | |
| No CSS change occurred | PASS | |
| No seeded/OAR proof files removed | PASS | |

## 6 — Execution

`execute-extension.js` removed from project root.

Verified: file no longer present.

No other files modified.

## 7 — Boundary Confirmation

`execute-extension.js` removed — confirmed.

No DB mutation occurred.

No CSS work occurred.

No seeded references removed.

No OAR1/OAR2 evidence removed.

No source seating declared.

No runtime behavior modified.

`DB_HELD_CODEX_SOURCE_RECORDS` not touched.

All SQL draft, planning, and executable artifacts retained.

This OAR1 records bounded cleanup completion, not runtime alignment.

## 8 — Carried Forward

| Item | Route |
|---|---|
| `DB_HELD_CODEX_SOURCE_RECORDS` — alias `"twenty_one_of_coherence"` vs canonical `"source_21_of_coherence_v1"` | Future runtime OAR2 |
| Legacy scripts using `SUPABASE_SERVICE_ROLE_KEY` env name — align to `SUPABASE_C3_SECRET` | Future script-hardening OAR2 |

## Close

Deprecation-first cleanup executed within route boundary.

`execute-extension.js` removed. Credential rotated by operator. Proof artifacts retained.
Runtime not modified. No DB mutation. No CSS change.

Two items carried forward. OAR2 closes on the file cleanup surface.
