---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Schema Migration Preflight v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_schema_migration_preflight_v1.meta.md
sql_draft_artifact: docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql
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
  - migration-preflight
  - codex-source-record
  - source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Schema SQL Draft v1
  - OAR1 — Source Reference Schema SQL Draft Correction v1
  - Active Session Transfer Surface Rule
  - NotChazz — Reduced OAR2 Context Caused Artifact-Proof Drift
  - OAR2 — Source Reference Schema Migration Preflight v1
---

# OAR1 — Source Reference Schema Migration Preflight v1

## Objective

Perform migration preflight on the corrected SQL artifact as routed by OAR2 — Source Reference Schema Migration Preflight v1.

Verify artifact proof, extract Section 1 live validation queries, return operator readiness decision checklist.

## Artifact Reviewed

`docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## 1 — Artifact-Proof Results

All checks performed against the actual file. No assumptions made.

| Check | Expected | Found | Result |
|---|---|---|---|
| File exists at expected path | yes | yes | PASS |
| `aliases jsonb` in table definition | yes | line 147 | PASS |
| `source_21_of_coherence_v1` present | yes | line 328 | PASS |
| `c3 7s` in aliases array | yes | line 334 | PASS |
| `c3_7s` in aliases array | yes | line 334 | PASS |
| `twenty_one_of_coherence` in aliases array | yes | line 334 | PASS |
| `system_concordance` held row present | yes | line 518 | PASS |
| `coherence_matrix_v1` held row present | yes | line 529 | PASS |
| `codex_source_reference_public` view present | yes | line 264 | PASS |
| Expected row count 19 stated | yes | line 575 | PASS |

## 2 — Stale Marker Search Results

| Stale Marker | Should Be Absent | Found | Result |
|---|---|---|---|
| `hold_for_operator_review` as active standing value | absent | appears in comments only (lines 289, 312, 326) — not as active standing value | CLEAN |
| Anon full-table `using (true)` policy on `codex_source_reference` | absent | not found | CLEAN |
| Dead `codex_source_reference_lineage_set_updated_at` trigger drop | absent | not found | CLEAN |

All stale markers absent from active SQL. Comment references are documentation of the correction — not active values.

## 3 — Section 1 Validation Queries (Extracted for Live Execution)

These are non-mutating. Operator must run against live Supabase DB before migration execution OAR2 is authorized.

---

**1a — Check whether source reference tables already exist**

```sql
select
  table_name,
  table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'codex_source_reference',
    'codex_source_reference_version',
    'codex_source_reference_scope',
    'codex_source_reference_state',
    'codex_source_reference_lineage',
    'codex_source_reference_relation'
  )
order by table_name;
```

**1b — Check for source-adjacent column drift on existing tables**

```sql
select
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and column_name ilike '%source_reference%'
order by table_name, column_name;
```

**1c — Check whether governance records exist in existing tables**

```sql
select
  'c3_oar_seeded_reference' as table_checked,
  seeded_reference_key,
  seeded_reference_type,
  seeded_status
from public.c3_oar_seeded_reference
where seeded_reference_key in (
  'twenty_one_of_coherence',
  'seed_concordance',
  'coherence_matrix_v1'
)
union all
select
  'system_process_registry' as table_checked,
  process_key,
  process_family,
  process_status
from public.system_process_registry
where process_key in (
  'twenty_one_of_coherence',
  'seed_concordance',
  'coherence_matrix_v1'
);
```

**1d — Check DB_HELD_CODEX_SOURCE_RECORDS runtime claims against actual DB rows**

```sql
select
  seeded_reference_key,
  seeded_reference_type,
  seeded_status,
  created_at
from public.c3_oar_seeded_reference
where seeded_reference_key in (
  'seed_concordance',
  'system_concordance',
  'twenty_one_of_coherence',
  'coherence_matrix_v1'
)
order by seeded_reference_key;
```

**1e — Check whether codex_source_reference already exists**

```sql
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'codex_source_reference'
  ) then
    raise notice 'codex_source_reference exists — check for duplicate keys required';
  else
    raise notice 'codex_source_reference does not yet exist — no duplicate check needed';
  end if;
end;
$$;
```

**1f — Check for active processes without OAR closeout**

```sql
select
  process_key,
  process_status,
  authority_level,
  source_reference_set,
  requires_oar1_closeout
from public.system_process_registry
where process_status = 'active'
  and requires_oar1_closeout = false
order by process_key;
```

---

## 4 — Operator Readiness Decision Checklist

| # | Decision Required | Standing |
|---|---|---|
| 1 | `system_concordance` held row is acceptable until file path is confirmed | awaiting operator confirmation |
| 2 | `coherence_matrix_v1` held row is acceptable until file path is confirmed | awaiting operator confirmation |
| 3 | `source_21_of_coherence_v1` alias set complete: `c3 7s`, `c3_7s`, `twenty_one_of_coherence` | awaiting operator confirmation |
| 4 | All 12 held exclusions from seam closeout remain held | awaiting operator confirmation |
| 5 | `codex_source_reference_public` view scope is acceptable as public-safe | awaiting operator confirmation |
| 6 | Section 1 queries run against live DB; results reviewed before execution OAR2 | not yet executed |

## 5 — Migration Readiness Standing

**NOT READY for migration execution OAR2.**

Blockers:

- Section 1 validation queries have not been run against live DB
- Operator readiness decisions (items 1–5 above) have not been confirmed

**READY for operator review and decision confirmation.**

Once all six checklist items are confirmed and Section 1 queries are executed, migration execution OAR2 may be authorized.

## 6 — Validation

No SQL was executed.

No database was mutated.

No Codex seating was declared.

No runtime or CSS was modified.

No deprecation was executed.

No files were moved or opened in a new folder surface.

OAR1 was not written until artifact-proof checks confirmed all expected markers present and all stale markers absent.

## Close

Preflight complete.

Artifact proof confirmed.

Execution still waits for operator decisions and live validation query results.

Codex holds. Measures registers. OAR2 routes. OAR1 proves.
