---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Extend field_origin_origin_type_check to Include c3_field
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md
tags:
  - oar2
  - c3-field
  - field-origin
  - origin-type
  - schema-correction
  - registered-system
  - runtime-admission
  - branch-guard
---

# OAR2 — Extend field_origin_origin_type_check to Include c3_field v1

## OBSERVED

OAR1 — Bind Measures Registry to c3 Field Runtime Admission v1 has executed.

Current standing:

- Measures Registry is registered.
- Measures Registry is bound to c3 Field runtime admission validation.
- Runtime admission remains false.
- Contract readiness remains false.
- Binding resolution remains false.
- Measures of Inanna is registered as spine standing.
- Non-ANT passage/canopy law is seated.
- ANT is fully banished.
- c3 Field runtime admission law is seated.
- c3 Field contract gates are seated.
- No runtime mutation occurred.
- No public route mutation occurred.
- No pricing / Stripe / SEAT / c3 Key / wallet mutation occurred.

A prior registered-system seating required the c3 Field anchor row to use `origin_type = system` because `field_origin_origin_type_check` did not allow `c3_field`.

That was a safe workaround, not final law.

This OAR corrects the schema constraint so c3 Field can exist as a first-class origin type.

## ALIGNED

### Authority order

Codex holds.
Field structures.
Measures registers.
Chazz validates/routes.
Cody executes from OAR2 only.
`src` renders seated state only.

### Correction distinction

This is a schema correction OAR.

It formalizes c3 Field as first-class origin type.

It does not mutate runtime.

It does not change registered-system standing.

It does not change runtime admission.

It does not activate Measures Registry.

### Boundary

This OAR may mutate only:

- `field_origin` origin type constraint
- c3 Field anchor row origin_type

It may not mutate:

- Measures Registry runtime
- public routes
- admission states
- contract readiness states
- pricing
- Stripe
- SEAT
- c3 Key
- wallet
- external integrations

## OBJECTIVE

Extend `field_origin_origin_type_check` to allow `c3_field`, then update the c3 Field anchor row from the temporary `system` origin type to direct `c3_field` origin type.

This OAR must:

1. Verify c3 Field branch.
2. Inspect current `field_origin` constraint.
3. Confirm the c3 Field anchor row exists.
4. Extend `field_origin_origin_type_check` to include `c3_field`.
5. Update c3 Field anchor row to `origin_type = c3_field`.
6. Preserve all other origin types.
7. Preserve registered-system standing.
8. Preserve runtime admission state.
9. Preserve Measures Registry runtime behavior.
10. Write OAR1 with evidence.

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

### 2. Inspect current field_origin constraint

Return current constraint definition:

    select conname, pg_get_constraintdef(oid) as constraint_def
    from pg_constraint
    where conrelid = 'public.field_origin'::regclass
      and conname = 'field_origin_origin_type_check';

Expected:

- constraint exists
- current allowed values do not include `c3_field`

If constraint is missing, stop and report:

`FIELD_ORIGIN_CONSTRAINT_MISSING_BLOCKER`

If `c3_field` already exists in allowed values, do not recreate unnecessarily. Validate anchor row and proceed only with safe update if needed.

### 3. Inspect field_origin rows

Return:

    select id, origin_ref, origin_type, origin_title, metadata, is_active
    from public.field_origin
    order by created_at;

Identify c3 Field anchor row.

Expected possible anchor markers:

- `origin_ref = c3_field`
- or metadata containing c3 Field anchor standing
- or prior anchor row inserted during registered-system OAR

If no c3 Field anchor row exists, stop and report:

`C3_FIELD_ANCHOR_ROW_MISSING_BLOCKER`

Do not create a new anchor row in this OAR unless executor confirms there is no existing anchor and reports the exact proposed insert for review.

### 4. Extend origin type constraint

Safely replace `field_origin_origin_type_check` with an expanded constraint that preserves all existing allowed values and adds:

- `c3_field`

Do not remove any existing valid origin type.

Required operation pattern:

1. Read current allowed values.
2. Drop existing check constraint.
3. Recreate check constraint with existing values plus `c3_field`.

The recreated constraint must preserve current data.

If existing data would violate the new constraint, stop and report:

`FIELD_ORIGIN_CONSTRAINT_RECREATE_BLOCKER`

### 5. Update c3 Field anchor row

Update only the c3 Field anchor row:

- set `origin_type = c3_field`
- preserve `origin_ref`
- preserve `origin_title`
- preserve existing metadata
- merge metadata:
  - `origin_type_corrected`: true
  - `origin_type_correction_oar2`: `docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md`
  - `standing_note`: `c3 Field is now formalized as first-class origin type.`
- update `updated_at` if column exists or trigger handles it

Do not update non-c3 Field rows.

### 6. Validate registered-system standing remains unchanged

Return:

    select system_key, system_name, standing, implementation_pattern, system_scope,
           metadata->>'runtime_admission_state' as runtime_admission_state
    from public.c3_registered_system
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

- `measures_of_inanna`
- `standing = registered`
- `runtime_admission_state = not_seated`

### 7. Validate runtime admission remains false

Return:

    select system_key, admission_state, release_state, access_state,
           public_runtime_allowed, runtime_activation_allowed,
           runtime_admission_resolved
    from public.v_c3_field_runtime_admission_v1
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- both systems present
- `admission_state = not_seated`
- `release_state = held`
- `access_state = held`
- `public_runtime_allowed = false`
- `runtime_activation_allowed = false`
- `runtime_admission_resolved = false`

### 8. Validate Measures Registry binding remains held

Return:

    select binding_key, binding_state, release_state, access_state,
           runtime_effect_allowed, public_effect_allowed, binding_resolved
    from public.v_c3_measures_registry_admission_binding_v1
    order by binding_key;

Expected:

- all binding rows remain held
- `runtime_effect_allowed = false`
- `public_effect_allowed = false`
- `binding_resolved = false`

### 9. Preserve boundaries

Do not mutate:

- Measures Registry runtime
- encounter renderer
- public routes
- site copy
- pricing
- Stripe
- SEAT
- c3 Key
- wallet
- DAO
- certification
- external integrations
- admission states
- contract readiness states
- binding states

Do not grant:

- runtime admission
- binding resolution
- public access standing
- payment standing
- SEAT release standing
- certification standing
- c3 Key standing
- role authority
- AI mutation authority
- AI execution authority

### 10. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md`

OAR1 must include:

- branch verification
- before constraint definition
- after constraint definition
- c3 Field anchor row before update
- c3 Field anchor row after update
- confirmation no non-c3 Field origin rows were changed
- registered-system validation
- runtime admission validation
- Measures Registry binding validation
- confirmation no runtime mutation occurred
- confirmation no public route mutation occurred
- confirmation no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect `field_origin`
- inspect constraints
- alter `field_origin_origin_type_check`
- update c3 Field anchor row origin_type to `c3_field`
- merge metadata on c3 Field anchor row
- validate registered-system standing
- validate runtime admission remains false
- validate binding remains held
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- activate runtime admission
- activate binding resolution
- advance contract readiness
- activate public route
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- grant role authority
- grant AI authority
- grant AI mutation
- grant AI execution
- create unrelated origin rows
- reintroduce ANT
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. Existing `field_origin_origin_type_check` inspected.
3. Existing allowed origin types preserved.
4. `c3_field` added to allowed origin types.
5. c3 Field anchor row updated to `origin_type = c3_field`.
6. No non-c3 Field origin rows changed.
7. Measures Registry registered-system standing preserved.
8. Measures of Inanna registered-system standing preserved.
9. Runtime admission remains false for both systems.
10. Measures Registry binding remains held and unresolved.
11. No runtime admission granted.
12. No binding activation granted.
13. No Measures Registry runtime mutation performed.
14. No public route mutation performed.
15. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
16. No AI authority/mutation/execution granted.
17. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md`

## CLOSE

c3 Field is formalized as first-class origin type.

All registered-system, runtime admission, contract readiness, and binding states remain unchanged.

No public runtime changes occur from this OAR.
