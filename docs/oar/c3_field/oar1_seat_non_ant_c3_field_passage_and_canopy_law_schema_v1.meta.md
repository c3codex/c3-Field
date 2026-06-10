---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Seat Non-ANT c3 Field Passage and Canopy Law Schema
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - non-ant
  - passage-law
  - canopy-law
  - signal-law
  - attachment-law
  - ant-banish
  - registered-system
  - branch-guard
---

# OAR1 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1

## OBJECTIVE

Create non-ANT c3 Field passage and canopy law schema (`c3_passage_law`, `c3_canopy_law`, `c3_signal_law`, `c3_attachment_law`), seat base held rows, create read views, and drop all remaining legacy-held ANT objects. No runtime admission created. No Measures Registry mutation.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: STANDING CONFIRMATION

### Registered-system schema

| system_key | system_name | standing | implementation_pattern | system_scope | runtime_admission_state |
|---|---|---|---|---|---|
| `measures_registry` | Measures Registry | registered | native | measures_registry | not_seated |

✓

### Remaining ANT objects before mutation

| table | row_count |
|---|---|
| `ant_envelope` | 0 |
| `ant_passage_state` | 0 |
| `ant_attachment_map` | 0 |

`ensure_ant_passage_state()`: EXISTS

External dependencies on remaining ANT tables: **0** — confirmed by pg_depend check.

`ANT_DATA_PRESENT_BLOCKER`: NOT triggered.

`c3_oar_set_updated_at()`: EXISTS — trigger pattern available.

---

## ACTION

**Migration name:** `seat_non_ant_c3_field_passage_and_canopy_law_schema_v1`

**Migration file:** `supabase/migrations/202606090002_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.sql`

### Fix 1 — Create `c3_passage_law`

```sql
CREATE TABLE IF NOT EXISTS public.c3_passage_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_key text NOT NULL UNIQUE,
  passage_name text NOT NULL,
  passage_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_chamber_key text,
  target_chamber_key text,
  source_registry_key text,
  target_registry_key text,
  passage_state text NOT NULL DEFAULT 'held',
  release_state text NOT NULL DEFAULT 'held',
  access_state text NOT NULL DEFAULT 'held',
  requires_runtime_admission boolean NOT NULL DEFAULT true,
  requires_optics_contract boolean NOT NULL DEFAULT true,
  requires_evidence_contract boolean NOT NULL DEFAULT true,
  requires_trace_contract boolean NOT NULL DEFAULT true,
  requires_correction_contract boolean NOT NULL DEFAULT true,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_passage_law_passage_type_check
    CHECK (passage_type IN ('same_family', 'cross_family', 'secure_external', 'return_state', 'internal_transition')),
  CONSTRAINT c3_passage_law_passage_state_check
    CHECK (passage_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated'))
);
```

**Result:** Table created.

---

### Fix 2 — Create `c3_canopy_law`

```sql
CREATE TABLE IF NOT EXISTS public.c3_canopy_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canopy_key text NOT NULL UNIQUE,
  canopy_name text NOT NULL,
  canopy_type text NOT NULL,
  system_key text,
  carrier_state text NOT NULL DEFAULT 'held',
  communication_state text NOT NULL DEFAULT 'held',
  encounter_state text NOT NULL DEFAULT 'held',
  visibility_state text NOT NULL DEFAULT 'private_held',
  runtime_admission_state text NOT NULL DEFAULT 'not_seated',
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_canopy_law_canopy_type_check
    CHECK (canopy_type IN ('carrier', 'communication', 'encounter', 'signal_surface', 'public_surface', 'private_surface')),
  CONSTRAINT c3_canopy_law_runtime_admission_state_check
    CHECK (runtime_admission_state IN ('not_seated', 'held', 'ready', 'admitted', 'blocked'))
);
```

**Result:** Table created. `runtime_admission_state` defaults to `not_seated`; constraint enforced.

---

### Fix 3 — Create `c3_signal_law`

```sql
CREATE TABLE IF NOT EXISTS public.c3_signal_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_key text NOT NULL UNIQUE,
  signal_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_passage_key text,
  target_passage_key text,
  signal_state text NOT NULL DEFAULT 'held',
  trace_required boolean NOT NULL DEFAULT true,
  evidence_required boolean NOT NULL DEFAULT true,
  redaction_required boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_signal_law_signal_state_check
    CHECK (signal_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated'))
);
```

**Result:** Table created.

---

### Fix 4 — Create `c3_attachment_law`

```sql
CREATE TABLE IF NOT EXISTS public.c3_attachment_law (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attachment_key text NOT NULL UNIQUE,
  attachment_type text NOT NULL,
  source_system_key text,
  target_system_key text,
  source_signal_key text,
  attachment_state text NOT NULL DEFAULT 'held',
  storage_boundary text NOT NULL DEFAULT 'codex_reference_only',
  sensitive_data_allowed boolean NOT NULL DEFAULT false,
  redaction_required boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_attachment_law_attachment_state_check
    CHECK (attachment_state IN ('held', 'draft', 'ready', 'released', 'blocked', 'deprecated')),
  CONSTRAINT c3_attachment_law_storage_boundary_check
    CHECK (storage_boundary IN ('codex_reference_only', 'public_media_reference', 'private_media_reference', 'external_reference', 'redacted_reference'))
);
```

**Result:** Table created. `sensitive_data_allowed` defaults `false`; `storage_boundary` defaults `codex_reference_only`.

---

### Fix 5 — Triggers

Applied `c3_oar_set_updated_at()` to all four tables via `BEFORE UPDATE` triggers.

**Result:** 4 triggers created.

---

### Fix 6 — RLS and public read policies

RLS enabled and public read policy applied for all four tables. Pattern follows `c3_registered_system`.

**Result:** 4 RLS policies created.

---

### Fix 7 — Views

```sql
CREATE OR REPLACE VIEW public.v_c3_passage_law_v1 AS
SELECT passage_key, passage_name, passage_type,
  passage_state, release_state, access_state,
  requires_runtime_admission, is_active, created_at, updated_at
FROM public.c3_passage_law ORDER BY created_at;

CREATE OR REPLACE VIEW public.v_c3_canopy_law_v1 AS
SELECT canopy_key, canopy_name, canopy_type,
  carrier_state, communication_state, encounter_state,
  visibility_state, runtime_admission_state, is_active, created_at, updated_at
FROM public.c3_canopy_law ORDER BY created_at;
```

**Result:** 2 views created. Standing only; no runtime admission implied.

---

### Fix 8 — Base held rows

```sql
INSERT INTO public.c3_passage_law (...) VALUES (
  'c3_field_passage_law_base', 'c3 Field Passage Law Base', 'internal_transition',
  'held', 'held', 'held', ...
) ON CONFLICT DO NOTHING;

INSERT INTO public.c3_canopy_law (...) VALUES (
  'c3_field_canopy_law_base', 'c3 Field Canopy Law Base', 'carrier',
  'held', 'held', 'held', 'private_held', 'not_seated', ...
) ON CONFLICT DO NOTHING;
```

**Result:** 2 base rows inserted.

---

### Fix 9 — Drop remaining legacy-held ANT objects

Row counts confirmed 0. No external dependencies confirmed. Drop order: `ant_attachment_map` and `ant_passage_state` first (FK on `ant_envelope`), then `ant_envelope`, then `ensure_ant_passage_state()`.

```sql
DROP TABLE IF EXISTS public.ant_attachment_map;
DROP TABLE IF EXISTS public.ant_passage_state;
DROP TABLE IF EXISTS public.ant_envelope;
DROP FUNCTION IF EXISTS public.ensure_ant_passage_state();
```

Triggers dropped automatically with their tables:
- `trg_ant_attachment_map_updated_at`
- `trg_ant_passage_state_updated_at`
- `trg_ant_envelope_create_passage_state`
- `trg_ant_envelope_updated_at`

**Result:** All remaining ANT objects removed.

---

## VALIDATION QUERY OUTPUT

### New tables created

| table_name |
|---|
| `c3_attachment_law` |
| `c3_canopy_law` |
| `c3_passage_law` |
| `c3_signal_law` |

✓ All 4 tables present.

### `c3_passage_law` base row

| passage_key | passage_type | passage_state | release_state | access_state | requires_runtime_admission |
|---|---|---|---|---|---|
| `c3_field_passage_law_base` | `internal_transition` | `held` | `held` | `held` | true |

✓ Base row held. Runtime admission required but not granted.

### `c3_canopy_law` base row

| canopy_key | canopy_type | carrier_state | communication_state | encounter_state | runtime_admission_state |
|---|---|---|---|---|---|
| `c3_field_canopy_law_base` | `carrier` | `held` | `held` | `held` | `not_seated` |

✓ Base row held. `runtime_admission_state = not_seated`.

### Remaining ANT tables

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('ant_envelope', 'ant_passage_state', 'ant_attachment_map');
```
**Result:** 0 rows ✓ — all dropped.

### `ensure_ant_passage_state()` dropped

```sql
SELECT proname FROM pg_proc WHERE proname = 'ensure_ant_passage_state';
```
**Result:** 0 rows ✓

### Live views referencing `ant_`

```sql
SELECT viewname FROM pg_views WHERE schemaname = 'public' AND definition ILIKE '%ant_%';
```
**Result:** `v_measures_media_runtime` — **false positive**.

The match is the string literal `'temple_antechamber'` in a legacy alias surface key comparison. This is a Measures Registry surface key (encounter `temple_antechamber_view`), not a reference to any `ant_*` table. No ANT table dependency. No action required.

**Zero ANT table references remain in live views. ✓**

### Registered-system schema

| system_key | system_name | standing | implementation_pattern | system_scope | runtime_admission_state |
|---|---|---|---|---|---|
| `measures_registry` | Measures Registry | registered | native | measures_registry | not_seated |

✓

---

## DB OBJECTS CREATED

| object | type | result |
|---|---|---|
| `c3_passage_law` | TABLE | created |
| `c3_canopy_law` | TABLE | created |
| `c3_signal_law` | TABLE | created |
| `c3_attachment_law` | TABLE | created |
| `c3_passage_law_set_updated_at` | TRIGGER | created |
| `c3_canopy_law_set_updated_at` | TRIGGER | created |
| `c3_signal_law_set_updated_at` | TRIGGER | created |
| `c3_attachment_law_set_updated_at` | TRIGGER | created |
| `c3_passage_law_public_read` | RLS POLICY | created |
| `c3_canopy_law_public_read` | RLS POLICY | created |
| `c3_signal_law_public_read` | RLS POLICY | created |
| `c3_attachment_law_public_read` | RLS POLICY | created |
| `v_c3_passage_law_v1` | VIEW | created |
| `v_c3_canopy_law_v1` | VIEW | created |
| `c3_field_passage_law_base` | ROW | inserted into `c3_passage_law` |
| `c3_field_canopy_law_base` | ROW | inserted into `c3_canopy_law` |

## DB OBJECTS REMOVED

| object | type | result |
|---|---|---|
| `ant_attachment_map` | TABLE | dropped |
| `ant_passage_state` | TABLE | dropped |
| `ant_envelope` | TABLE | dropped |
| `ensure_ant_passage_state()` | FUNCTION | dropped |
| `trg_ant_attachment_map_updated_at` | TRIGGER | dropped (auto with table) |
| `trg_ant_passage_state_updated_at` | TRIGGER | dropped (auto with table) |
| `trg_ant_envelope_create_passage_state` | TRIGGER | dropped (auto with table) |
| `trg_ant_envelope_updated_at` | TRIGGER | dropped (auto with table) |

Migration name: `seat_non_ant_c3_field_passage_and_canopy_law_schema_v1`

**ANT is fully banished from the DB schema.** No `ant_*` table, trigger, or function remains.

No source code was changed. No runtime behavior was activated.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **Registered-system schema validated before mutation**: YES
3. **Remaining ANT objects confirmed 0-row before drop**: YES
4. **`c3_passage_law` created**: YES
5. **`c3_canopy_law` created**: YES
6. **`c3_signal_law` created**: YES
7. **`c3_attachment_law` created**: YES
8. **Standing constraints created**: YES — passage_type, passage_state, canopy_type, runtime_admission_state, signal_state, attachment_state, storage_boundary
9. **Update triggers applied**: YES — `c3_oar_set_updated_at()` on all 4 tables
10. **RLS/read policies applied**: YES — public read on all 4 tables
11. **`v_c3_passage_law_v1` created**: YES
12. **`v_c3_canopy_law_v1` created**: YES
13. **Base held passage row seated**: YES — `c3_field_passage_law_base`, `passage_state = held`
14. **Base held canopy row seated**: YES — `c3_field_canopy_law_base`, `runtime_admission_state = not_seated`
15. **No runtime admission granted**: YES
16. **Remaining ANT objects dropped**: YES — `ant_envelope`, `ant_passage_state`, `ant_attachment_map`, `ensure_ant_passage_state()` all removed
17. **Live views no longer reference ANT**: YES — only false positive (`v_measures_media_runtime` / `'temple_antechamber'` string literal)
18. **Measures Registry registered-system row preserved**: YES
19. **No runtime mutation performed**: YES
20. **No Measures Registry runtime mutation performed**: YES
21. **No Inanna registered spine standing seated**: YES
22. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
23. **OAR1 written**: this document

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md

## NEXT

1. **OAR2 — Seat Measures of Inanna Registered Spine Standing v1** — Register Measures of Inanna in `c3_registered_system`; seat Inanna passage pattern through non-ANT `c3_passage_law`. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Seat c3 Field Runtime Admission View v1** — Create `c3_runtime_admission_contract` table and `v_c3_field_runtime_admission_v1` view; bind MR threshold encounters to admission validation. Branch: `initiative/c3-field-convergence-infra`.

3. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; elevate TypeScript optics to DB contract law. Branch: `initiative/c3-field-convergence-infra`.

4. **OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1** — Bind MR threshold encounters to admission validation once runtime admission view is seated. Branch: `initiative/c3-field-convergence-infra`.
