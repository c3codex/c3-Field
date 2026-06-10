---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Seat c3 Field Registered-System Law Schema
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_audit_oar1: docs/oar/c3_field/oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md
tags:
  - oar2
  - c3-field
  - registered-system
  - schema
  - binary-standing
  - measures-registry
  - c3-tree
  - field-origin
  - branch-guard
---

# OAR2 — Seat c3 Field Registered-System Law Schema v1

## OBSERVED

The c3 Field schema audit has executed and returned OAR1.

Audit standing:

- Correct deployment branch verified: `initiative/c3-field-convergence-infra`
- Initial branch mismatch was detected and corrected before inspection.
- No Measures Registry deployment branch was used for audit.
- No schema mutation was performed.
- No runtime mutation was performed.
- No Measures Registry mutation was performed.
- No pricing, Stripe, SEAT, c3 Key, wallet, or external integration mutation occurred.

Critical blocker found:

There is no `c3_registered_system` table.

Therefore, Measures Registry cannot yet bind to c3 Field registered-system law.

The audit also found:

- no binary Registered / Unregistered standing surface
- no separation between registration standing and runtime admission
- no formal c3 Field anchor row in `field_origin`
- no formal registered-system support for external/private/non-native systems
- no formal branch standing tied to registered-system law

This OAR seats only the first schema layer required for registered-system standing.

It does not seat runtime admission.

It does not seat optics/evidence/trace/correction contracts.

It does not mutate Measures Registry runtime.

## ALIGNED

### Authority order

Codex holds.  
Field structures.  
Measures registers.  
Chazz validates/routes.  
Cody executes from OAR2 only.  
`src` renders seated state only.

### c3 Field standing

The c3 Field is the coherent environment.

A system is either registered in the c3 Field or it is not.

“Mapped” is dissolved as standing language.

Correct standing:

- `registered`
- `unregistered`

Implementation pattern may be native, external, private, federated, direct, or non-native, but standing remains binary.

### Scope correction

This is a c3 Field schema OAR.

Measures Registry is the first implementation pressure case, but this OAR does not mutate Measures Registry runtime behavior.

### Deployment branch

All work must occur on the c3 Field deployment branch:

`initiative/c3-field-convergence-infra`

Executor must not use the Measures Registry deployment branch.

If local checkout is not on `initiative/c3-field-convergence-infra`, stop and report branch mismatch.

## OBJECTIVE

Seat the minimum c3 Field schema required to represent registered-system standing.

This OAR must:

1. Create a c3 Field registered-system table.
2. Enforce binary standing: `registered` / `unregistered`.
3. Separate registration standing from runtime admission.
4. Support native, external, private, and non-native implementation patterns without making them standing classes.
5. Anchor c3 Field in `field_origin` if safe and compatible.
6. Seat Measures Registry as the first registered system row.
7. Preserve all runtime, payment, SEAT, wallet, c3 Key, external system, and admission boundaries.

## ROUTED

### 1. Verify repository and branch

Before mutation, verify:

- repository path
- current git branch
- git status

Required branch:

`initiative/c3-field-convergence-infra`

Return:

- `git rev-parse --show-toplevel`
- `git branch --show-current`
- `git status --short`

If branch is not `initiative/c3-field-convergence-infra`, stop and report:

`BRANCH_MISMATCH — expected c3 Field deployment branch initiative/c3-field-convergence-infra`

No mutation may proceed from the wrong branch.

### 2. Inspect existing schema before creation

Inspect for existing equivalent tables or partial standing surfaces.

Check for:

- `c3_registered_system`
- `registered_system`
- `c3_system_registration`
- `field_registered_system`
- `field_origin`
- any existing `standing` column using `mapped`, `direct`, or `federated`
- any table already representing system standing

If an equivalent table already exists, do not duplicate.

Report existing object and adapt minimally.

### 3. Create `c3_registered_system`

If no equivalent exists, create a table named:

`c3_registered_system`

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `system_key text not null unique`
- `system_name text not null`
- `standing text not null`
- `registration_state text not null default 'registered'`
- `implementation_pattern text not null default 'native'`
- `system_scope text not null default 'c3_field'`
- `is_external boolean not null default false`
- `is_private boolean not null default false`
- `is_non_native boolean not null default false`
- `registered_at timestamptz`
- `unregistered_at timestamptz`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### 4. Enforce binary standing

Add a check constraint:

`standing in ('registered', 'unregistered')`

Do not allow:

- `mapped`
- `direct`
- `federated`
- `external`
- `native`
- `private`
- `pending`
- `partial`

as standing values.

Those may exist only as implementation pattern, flags, or metadata where needed.

### 5. Enforce implementation pattern distinction

Add a check constraint for `implementation_pattern`.

Allowed implementation patterns:

- `native`
- `external`
- `private`
- `non_native`
- `federated`
- `hybrid`

These are not standing classes.

They must not replace binary standing.

### 6. Add update timestamp trigger if project pattern exists

If existing schema uses `updated_at` triggers, follow the project pattern.

If no standard trigger exists, either:

- create a small table-specific trigger, or
- report blocker and leave `updated_at` unmanaged.

Do not introduce an inconsistent trigger framework.

### 7. Anchor c3 Field in `field_origin`

Audit found `field_origin` exists but is empty.

If compatible with current schema, insert a c3 Field anchor row.

Required semantic standing:

- c3 Field = coherent environment
- roots = system of immutable memory and Field connection
- trunk = c3 Model
- branches = interoperability between systems and individuals
- c3 Optics = displayed relational geometry of the Field, Individuals, Systems, and Operations
- canopy = communication and encounters

Do not force insert if required fields are unknown.

If insert is not safe, return the blocker and required column map.

### 8. Seat Measures Registry as first Registered System row

Insert one row into `c3_registered_system`:

- `system_key`: `measures_registry`
- `system_name`: `Measures Registry`
- `standing`: `registered`
- `registration_state`: `registered`
- `implementation_pattern`: `native`
- `system_scope`: `measures_registry`
- `is_external`: `false`
- `is_private`: `false`
- `is_non_native`: `false`
- `registered_at`: `now()`
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_c3_field_registered_system_law_schema_v1.meta.md`
- `source_oar1_path`: expected OAR1 path once written
- `metadata` must include:
  - `first_registered_system`: true
  - `pressure_case`: true
  - `source_audit_oar1`: `docs/oar/c3_field/oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md`
  - `standing_note`: `Registered System standing only; runtime admission not yet seated.`
  - `runtime_admission_state`: `not_seated`
  - `mapped_standing_dissolved`: true

Use upsert semantics.

Do not create runtime admission standing in this row.

### 9. Create basic read view if appropriate

Create a read-only view only if safe and supported:

`v_c3_registered_system_v1`

Minimum columns:

- `system_key`
- `system_name`
- `standing`
- `registration_state`
- `implementation_pattern`
- `system_scope`
- `is_external`
- `is_private`
- `is_non_native`
- `registered_at`
- `unregistered_at`
- `is_active`
- `runtime_admission_state` from metadata
- `created_at`
- `updated_at`

This view is registration standing only.

It is not runtime admission.

### 10. Validation queries

Return validation output for:

    select system_key, system_name, standing, implementation_pattern, system_scope, is_active
    from c3_registered_system
    order by created_at;

    select *
    from c3_registered_system
    where standing not in ('registered', 'unregistered');

    select *
    from c3_registered_system
    where standing in ('mapped', 'direct', 'federated', 'external', 'native', 'private');

    select system_key, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    where system_key = 'measures_registry';

If `v_c3_registered_system_v1` is created, return:

    select *
    from v_c3_registered_system_v1
    where system_key = 'measures_registry';

### 11. Preserve boundaries

Do not create:

- runtime admission table
- runtime admission view
- optics contract table
- evidence contract table
- trace contract table
- correction/revocation contract table
- AI action boundary table
- external system contract table
- secure passage contract table
- role contract table

Those belong to later OARs.

### 12. Write OAR1

After execution, write OAR1 beside this OAR2.

Expected path:

`docs/oar/c3_field/oar1_seat_c3_field_registered_system_law_schema_v1.meta.md`

OAR1 must include:

- branch verification
- schema objects created or skipped
- SQL applied
- validation query output
- confirmation that standing is binary
- confirmation that Measures Registry is seated as first registered system row
- confirmation that runtime admission remains not seated
- confirmation that no Measures Registry runtime mutation occurred
- confirmation that no pricing / Stripe / SEAT / c3 Key / wallet / external integration mutation occurred

## EXECUTOR MAY

- inspect current schema
- create `c3_registered_system` if absent
- create binary standing constraint
- create implementation pattern constraint
- insert c3 Field anchor row if safe
- insert Measures Registry as first Registered System row
- create `v_c3_registered_system_v1` if safe
- return validation queries
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime
- change public copy
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- create runtime admission table/view
- create optics/evidence/trace/correction tables
- create AI action boundary table
- create role contract table
- create secure passage/external system contract tables
- treat Mapped as standing
- use direct/federated/native/external/private as standing classes
- bypass branch verification
- skip OAR1

## VALIDATION

This OAR resolves successfully when executor returns:

1. c3 Field branch verified: `initiative/c3-field-convergence-infra`.
2. No Measures Registry deployment branch used.
3. Existing schema inspected for duplicate/equivalent table.
4. `c3_registered_system` created or existing equivalent reported.
5. Binary standing constraint created or confirmed.
6. Standing permits only `registered` / `unregistered`.
7. Implementation pattern is separated from standing.
8. Measures Registry seated as first Registered System row.
9. Measures Registry row includes `runtime_admission_state = not_seated`.
10. c3 Field anchor row inserted into `field_origin` or blocker reported.
11. `v_c3_registered_system_v1` created or blocker reported.
12. Validation queries returned.
13. No runtime admission mutation performed.
14. No optics/evidence/trace/correction mutation performed.
15. No AI action boundary mutation performed.
16. No external/private system integration mutation performed.
17. No Measures Registry runtime mutation performed.
18. No pricing / Stripe / SEAT / c3 Key / wallet mutation performed.
19. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_seat_c3_field_registered_system_law_schema_v1.meta.md`

## CLOSE

This OAR seats registered-system standing only.

Registration grants standing in the Field.

Runtime admission will be seated later.

A system is either registered in the c3 Field or it is not.

Measures Registry becomes the first Registered System row, but does not receive runtime admission from this OAR.
