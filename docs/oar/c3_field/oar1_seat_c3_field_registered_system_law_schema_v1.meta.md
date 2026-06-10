---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Seat c3 Field Registered-System Law Schema
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - registered-system
  - schema
  - binary-standing
  - measures-registry
  - c3-tree
  - field-origin
  - branch-guard
---

# OAR1 — Seat c3 Field Registered-System Law Schema v1

## OBJECTIVE

Execute OAR2 mutations scoped to:
1. Create `c3_registered_system` table with binary standing enforcement
2. Create `v_c3_registered_system_v1` read-only view
3. Anchor c3 Field in `field_origin`
4. Seat Measures Registry as the first Registered System row
5. Preserve all runtime, payment, SEAT, wallet, c3 Key, and admission boundaries

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| git branch --show-current | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: SCHEMA INSPECTION

No equivalent table found. Checked for:

| table | result |
|---|---|
| `c3_registered_system` | does not exist |
| `registered_system` | does not exist |
| `c3_system_registration` | does not exist |
| `field_registered_system` | does not exist |
| any `standing IN ('mapped','direct','federated')` | not found in any table |

`field_origin` exists and is empty. Column schema confirmed safe for insert.

`field_origin` check constraint: `origin_type IN ('named_individual', 'institution_in_service', 'operator', 'system')`.

`c3_field` is not an allowed `origin_type`. c3 Field anchor row inserted with `origin_type = 'system'`, `origin_ref = 'c3_field_v1'`, semantic standing expressed in metadata.

Available trigger function: `public.c3_oar_set_updated_at()` — used for `updated_at` trigger.

---

## ACTION

### Fix 1 — DB: Create `c3_registered_system` table

**Migration:** `c3_field_registered_system_law_schema_v1`

```sql
CREATE TABLE IF NOT EXISTS public.c3_registered_system (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_key text NOT NULL UNIQUE,
  system_name text NOT NULL,
  standing text NOT NULL,
  registration_state text NOT NULL DEFAULT 'registered',
  implementation_pattern text NOT NULL DEFAULT 'native',
  system_scope text NOT NULL DEFAULT 'c3_field',
  is_external boolean NOT NULL DEFAULT false,
  is_private boolean NOT NULL DEFAULT false,
  is_non_native boolean NOT NULL DEFAULT false,
  registered_at timestamptz,
  unregistered_at timestamptz,
  source_oar2_path text NOT NULL,
  source_oar1_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT c3_registered_system_standing_check
    CHECK (standing IN ('registered', 'unregistered')),
  CONSTRAINT c3_registered_system_implementation_pattern_check
    CHECK (implementation_pattern IN ('native', 'external', 'private', 'non_native', 'federated', 'hybrid'))
);
```

**Result:** Table created. `standing_check` constraint enforces binary standing. `implementation_pattern_check` separates pattern from standing.

---

### Fix 2 — DB: `updated_at` trigger

```sql
CREATE TRIGGER c3_registered_system_set_updated_at
  BEFORE UPDATE ON public.c3_registered_system
  FOR EACH ROW EXECUTE FUNCTION public.c3_oar_set_updated_at();
```

**Result:** Trigger applied. Follows project pattern.

---

### Fix 3 — DB: RLS

```sql
ALTER TABLE public.c3_registered_system ENABLE ROW LEVEL SECURITY;

CREATE POLICY "c3_registered_system_public_read"
  ON public.c3_registered_system FOR SELECT
  TO anon, authenticated USING (true);
```

**Result:** RLS enabled, public read policy applied. Follows project pattern.

---

### Fix 4 — DB: Create `v_c3_registered_system_v1`

```sql
CREATE OR REPLACE VIEW public.v_c3_registered_system_v1 AS
SELECT
  system_key, system_name, standing, registration_state,
  implementation_pattern, system_scope,
  is_external, is_private, is_non_native,
  registered_at, unregistered_at, is_active,
  metadata->>'runtime_admission_state' AS runtime_admission_state,
  source_oar2_path, source_oar1_path,
  created_at, updated_at
FROM public.c3_registered_system
ORDER BY registered_at NULLS LAST, created_at;
```

**Result:** View created. Registration standing only. `runtime_admission_state` surfaces from metadata — confirms `not_seated` state is visible without a dedicated admission table.

---

### Fix 5 — DB: Insert c3 Field anchor row into `field_origin`

`origin_type = 'c3_field'` is not permitted by existing check constraint. Inserted with `origin_type = 'system'`, `origin_ref = 'c3_field_v1'`, semantic standing in metadata.

**SQL:**

```sql
INSERT INTO public.field_origin (origin_type, origin_ref, display_name, is_active, metadata)
VALUES (
  'system', 'c3_field_v1', 'c3 Field', true,
  jsonb_build_object(
    'semantic_standing', 'coherent_environment',
    'definition', 'The coherent environment.',
    'roots', 'System of immutable memory and Field connection.',
    'trunk', 'c3 Model: Connect, Contribute, Create.',
    'branches', 'Interoperability between registered systems and individuals.',
    'c3_optics', 'Displayed relational geometry of the Field, Individuals, Systems, and Operations.',
    'canopy', 'Communication and encounters.',
    'origin_type_note', 'c3 Field anchored as system origin type — the coherent environment that contains all c3 Tree operation.',
    'source_oar2', 'docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md'
  )
) ON CONFLICT DO NOTHING
RETURNING id, origin_type, origin_ref, display_name, is_active;
```

**Result:** 1 row inserted — `id = f4a08bf6-fd85-46f6-a0ab-a8a22d8b1a9d`, `origin_type = system`, `origin_ref = c3_field_v1`, `display_name = c3 Field`, `is_active = true`.

**Blocker note:** `field_origin_origin_type_check` does not permit `c3_field` as a type. A future OAR may extend this constraint to add `c3_field` as a first-class origin type. For this OAR, `system` is the correct closest type and the metadata expresses full semantic standing.

---

### Fix 6 — DB: Insert Measures Registry as first Registered System row

**SQL:**

```sql
INSERT INTO public.c3_registered_system (
  system_key, system_name, standing, registration_state,
  implementation_pattern, system_scope, is_external, is_private, is_non_native,
  registered_at, source_oar2_path, source_oar1_path, metadata, is_active
)
VALUES (
  'measures_registry', 'Measures Registry', 'registered', 'registered',
  'native', 'measures_registry', false, false, false, now(),
  'docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md',
  'docs/oar/c3_field/oar1_seat_c3_field_registered_system_law_schema_v1.meta.md',
  jsonb_build_object(
    'first_registered_system', true,
    'pressure_case', true,
    'source_audit_oar1', 'docs/oar/c3_field/oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md',
    'standing_note', 'Registered System standing only; runtime admission not yet seated.',
    'runtime_admission_state', 'not_seated',
    'mapped_standing_dissolved', true
  ),
  true
)
ON CONFLICT (system_key) DO UPDATE SET ...
RETURNING system_key, system_name, standing, implementation_pattern, system_scope, is_active,
  metadata->>'runtime_admission_state' AS runtime_admission_state;
```

**Result:** 1 row returned — `measures_registry`, `Measures Registry`, `standing = registered`, `implementation_pattern = native`, `system_scope = measures_registry`, `is_active = true`, `runtime_admission_state = not_seated`.

---

## VALIDATION QUERY OUTPUT

### All registered systems

| system_key | system_name | standing | implementation_pattern | system_scope | is_active |
|---|---|---|---|---|---|
| `measures_registry` | Measures Registry | registered | native | measures_registry | true |

### Invalid standing check

`invalid_standing_count = 0` — constraint enforced, no invalid values possible.

### Dissolved language check

`dissolved_language_count = 0` — no `mapped`, `direct`, `federated`, `external`, `native`, `private` standing values present.

### View output for `measures_registry`

| column | value |
|---|---|
| system_key | `measures_registry` |
| system_name | Measures Registry |
| standing | `registered` |
| registration_state | `registered` |
| implementation_pattern | `native` |
| system_scope | `measures_registry` |
| is_external | false |
| is_private | false |
| is_non_native | false |
| registered_at | 2026-06-10 02:15:37 UTC |
| unregistered_at | null |
| is_active | true |
| runtime_admission_state | `not_seated` |
| source_oar2_path | `docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md` |
| source_oar1_path | `docs/oar/c3_field/oar1_seat_c3_field_registered_system_law_schema_v1.meta.md` |

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **No Measures Registry deployment branch used**: YES
3. **Existing schema inspected for duplicate/equivalent table**: YES — none found
4. **`c3_registered_system` created**: YES — table created via migration `c3_field_registered_system_law_schema_v1`
5. **Binary standing constraint created**: YES — `CHECK (standing IN ('registered', 'unregistered'))`
6. **Standing permits only `registered` / `unregistered`**: YES — DB-enforced
7. **Implementation pattern separated from standing**: YES — `implementation_pattern` constraint separate from `standing` constraint
8. **Measures Registry seated as first Registered System row**: YES — `system_key = measures_registry`, `standing = registered`
9. **Measures Registry row includes `runtime_admission_state = not_seated`**: YES — confirmed in view output
10. **c3 Field anchor row inserted into `field_origin`**: YES — `origin_ref = c3_field_v1`, `origin_type = system` (blocker note: `c3_field` type not permitted by existing constraint; future OAR may extend constraint)
11. **`v_c3_registered_system_v1` created**: YES
12. **Validation queries returned**: YES — all above
13. **No runtime admission mutation performed**: YES
14. **No optics/evidence/trace/correction mutation performed**: YES
15. **No AI action boundary mutation performed**: YES
16. **No external/private system integration mutation performed**: YES
17. **No Measures Registry runtime mutation performed**: YES
18. **No pricing / Stripe / SEAT / c3 Key / wallet mutation performed**: YES
19. **OAR1 written**: this document

---

## GAPS REPORTED

**Gap 1 — `field_origin_origin_type_check` does not permit `c3_field` as origin type**

The constraint allows: `named_individual`, `institution_in_service`, `operator`, `system`. The c3 Field anchor was inserted with `origin_type = 'system'` and full semantic standing in metadata. A future OAR that extends `field_origin_origin_type_check` to include `c3_field` as a first-class type would formalize this anchor. Not blocking for registered-system standing.

---

## DB OBJECTS CREATED

| object | type | result |
|---|---|---|
| `c3_registered_system` | TABLE | created |
| `c3_registered_system_set_updated_at` | TRIGGER | created |
| `c3_registered_system_public_read` | RLS POLICY | created |
| `v_c3_registered_system_v1` | VIEW | created |
| `field_origin` (c3_field_v1 row) | ROW | inserted |
| `c3_registered_system` (measures_registry row) | ROW | inserted |

Migration name: `c3_field_registered_system_law_schema_v1`

No source code was changed. No build required.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md

## NEXT

1. **OAR2 — Seat c3 Field Runtime Admission View v1** — Creates `c3_runtime_admission_contract` table and `v_c3_field_runtime_admission_v1` view; binds MR threshold encounters to admission validation. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Creates `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; elevates TypeScript optics to DB contract law.

3. **OAR2 — Extend `field_origin_origin_type_check` to include `c3_field`** — Formalizes c3 Field as a first-class origin type; updates the anchor row.
