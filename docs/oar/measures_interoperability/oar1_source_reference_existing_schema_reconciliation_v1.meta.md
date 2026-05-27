---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Existing Schema Reconciliation v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_existing_schema_reconciliation_v1.meta.md
sql_draft_artifact: docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql
existing_schema_artifact: docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql
existing_migration_oar1: docs/oar/source_reference/oar1_source_reference_schema_migration_execution_v1.meta.md
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
  - source-authority
  - schema-reconciliation
  - migration-preflight
  - codex-source-reference
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Schema Migration Preflight v1
  - Source Reference Schema SQL Draft v1
  - Active Session Transfer Surface Rule
  - OAR2 — Source Reference Existing Schema Reconciliation v1
---

# OAR1 — Source Reference Existing Schema Reconciliation v1

## Objective

Reconcile the corrected measures_interoperability SQL draft against the live DB schema evidence.

Produce a reconciliation map. Return migration standing. Do not execute SQL or modify any file.

## Files Inspected

- `docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql` — measures_interoperability draft
- `docs/oar/source_reference/oar1_source_reference_schema_migration_execution_v1.meta.md` — confirms execution and object list
- `docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql` — the executed schema

## 1 — Existing Live Structures

Confirmed by `oar1_source_reference_schema_migration_execution_v1.meta.md` (status: `completed_execution`).

**Tables:**
- `public.codex_source_reference` — ROOT TABLE EXISTS, UUID PK
- `public.codex_source_term`
- `public.codex_source_operative_binding`
- `public.codex_source_relation`
- `public.codex_source_seed_log`

**Views:**
- `public.v_seeded_codex_source_references`
- `public.v_codex_source_resolution_path` (created by subsequent traversal views OAR)
- `public.v_codex_source_seeded_precedence` (created by subsequent traversal views OAR)

**Functions:**
- `public.touch_codex_source_updated_at()`
- `public.prevent_seeded_codex_source_reference_update()`

**Triggers:**
- `trg_touch_codex_source_reference_updated_at`
- `trg_touch_codex_source_term_updated_at`
- `trg_touch_codex_source_binding_updated_at`
- `trg_prevent_seeded_codex_source_reference_update`

**Pre-existing (not created by migration):**
- `public.codex_source_record`

**Access posture:**
- RLS enabled on all tables
- `REVOKE ALL ... FROM anon, authenticated` — service-side only
- No public or anon policies

**Row counts at migration execution:** All tables empty (0 rows).

### Existing `codex_source_reference` Column Structure

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | `gen_random_uuid()` |
| `source_key` | text UNIQUE NOT NULL | non-PK unique identifier |
| `source_title` | text NOT NULL | |
| `source_type` | text CHECK | concordance, foundational_source, process_rule, process_constraints, role_contract, implementation_manifest, verification_checklist, oar, system_intel, schema_draft, migration_candidate |
| `authority_level` | text CHECK | system, working, operator, readonly, readonly_candidate |
| `source_scope` | text NOT NULL | |
| `version_label` | text | default 'v1' |
| `source_status` | text CHECK | drafted, validated, written, committed, seeded, deprecated, superseded, rejected |
| `readonly` | boolean | |
| `seeded_at` | timestamptz | |
| `supersedes_source_id` | uuid → self FK | lineage via self-reference |
| `source_path` | text | |
| `source_hash` | text | |
| `metadata` | jsonb | OAR reference stored as `metadata ? 'seed_oar_key'` |
| `created_by` | text | |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

## 2 — Draft Structures Proposed

From `source_reference_schema_sql_draft_v1.sql`:

**New tables proposed:**
- `public.codex_source_reference` — CREATE TABLE IF NOT EXISTS, `source_key TEXT PRIMARY KEY`
- `public.codex_source_reference_lineage` — separate lineage table

**New view proposed:**
- `public.codex_source_reference_public` — anon-accessible public-safe view

**New function proposed:**
- `public.codex_source_reference_require_oar1_for_seating()` — seating guard

**New trigger proposed:**
- `codex_source_reference_seating_guard`

**Seed rows proposed:** 19 rows using draft column names

## 3 — Conflict Table

| Area | Existing | Draft | Conflict Type |
|---|---|---|---|
| Root table existence | EXISTS | `CREATE TABLE IF NOT EXISTS` | **SILENT NO-OP** — IF NOT EXISTS passes silently, existing table unchanged, draft columns never created |
| Primary key | `id uuid` | `source_key text` | **STRUCTURAL CONFLICT** — different PK type and field |
| Title column | `source_title text` | `title text` | **COLUMN MISMATCH** |
| Status field | `source_status` (drafted/validated/written/committed/seeded/deprecated/superseded/rejected) | `standing` (candidate/written/committed/seeded/codex_seated/held/superseded) | **DIFFERENT FIELD — different name, different CHECK values** |
| Scope column | `source_scope text` | `document_scope text` | **COLUMN MISMATCH** |
| Path column | `source_path text` | `file_path text` | **COLUMN MISMATCH** |
| Source type CHECK | concordance, foundational_source, process_rule, etc. | semantic_concordance, oar_lifecycle, etc. | **CHECK VALUE MISMATCH** |
| Authority level CHECK | system, working, operator, readonly, readonly_candidate | system, working, proposal, review, draft | **CHECK VALUE MISMATCH** |
| Lineage | `supersedes_source_id uuid` self-ref on root | separate `codex_source_reference_lineage` table | **STRUCTURAL CONFLICT** |
| OAR reference | `metadata ? 'seed_oar_key'` | `oar1_key`, `oar2_key` FK columns | **APPROACH CONFLICT** |
| Seating guard | `prevent_seeded_codex_source_reference_update` blocks seeded rows from update | `codex_source_reference_require_oar1_for_seating` blocks codex_seated without oar1_key | **OVERLAPPING MECHANISMS — different standing vocabulary** |
| Aliases column | absent | `aliases jsonb` | **DRAFT COLUMN ABSENT FROM EXISTING TABLE** |
| Access posture | `REVOKE ALL FROM anon, authenticated` — service-side only | `codex_source_reference_public` view for anon | **ACCESS POSTURE CONFLICT** |
| Child tables | codex_source_term, codex_source_operative_binding, codex_source_relation, codex_source_seed_log | not in draft | **DRAFT DOES NOT ACCOUNT FOR EXISTING CHILD TABLES** |
| INSERT columns | n/a | draft uses title, standing, file_path, document_scope | **INSERT WOULD FAIL** — columns don't exist on live table |

## 4 — Missing-Table Assessment

**Root table:** `public.codex_source_reference` EXISTS. The draft's `CREATE TABLE IF NOT EXISTS` would silently do nothing. No draft columns would be created. The existing table structure is intact and incompatible with the draft INSERT block.

**Draft-only tables:** `codex_source_reference_lineage` does not exist in the live DB. This table could be created, but its FK references `codex_source_reference(source_key)` — which is not the PK of the live table. Creation would fail.

**Draft-only view:** `codex_source_reference_public` does not exist and would reference columns (`standing`, `aliases`, `codex_seating_standing`) that do not exist on the live table.

## 5 — Migration Standing

**`draft_requires_rewrite_against_existing_schema`**

The measures_interoperability SQL draft was authored without knowledge of the prior executed schema in `docs/oar/source_reference/`. The draft cannot be executed in any form against the live DB:

- `CREATE TABLE IF NOT EXISTS` silently passes, no new columns created
- INSERT block column names do not match live table (title, standing, file_path, document_scope all absent)
- View creation would fail — references non-existent columns
- Lineage table creation would fail — FK targets non-PK column

## 6 — Recommended Next Route

**Existing Schema Extension OAR2**

The correct path is not a rewrite from scratch. It is a targeted extension of the existing live schema.

The extension OAR2 should route:

1. `ALTER TABLE public.codex_source_reference ADD COLUMN IF NOT EXISTS aliases jsonb not null default '[]'::jsonb` — add aliases to the live table
2. A corrected INSERT block using existing column names: `source_key`, `source_title`, `source_type`, `authority_level`, `source_scope`, `source_status`, `source_path`, `metadata`
3. Mapping of the 19 proposed rows to the existing `source_type` CHECK values and `source_status` CHECK values
4. An access policy OAR routing any public-safe view through the existing service-side-only posture (not via the draft's `codex_source_reference_public`)
5. Operator confirmation on `system_concordance` and `coherence_matrix_v1` source_path values before any INSERT

The measures_interoperability draft's standing vocabulary (`standing`, `codex_seated`, `held`) maps to the existing `source_status` vocabulary (`seeded`, `deprecated`, `written`) and the `metadata` field for OAR evidence. This mapping must be resolved before a corrected INSERT block can be written.

## 7 — Validation

No SQL was executed.

No database was mutated.

No files were modified or moved.

No Codex seating was declared.

No runtime or CSS was modified.

No deprecation was executed.

No new folder surface was opened.

OAR1 was not written until artifact evidence from the migration execution OAR1 and executed schema file were inspected.

## Close

Reconciliation complete.

Existing schema confirmed live. Draft confirmed incompatible.

Migration execution remains blocked.

Next valid move: existing schema extension OAR2 routed by operator.

Codex holds. Measures registers. OAR2 routes. OAR1 proves.
