---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Seat c3 Field Runtime Admission View
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_seat_measures_of_inanna_registered_spine_standing_v1.meta.md
tags:
  - oar2
  - c3-field
  - runtime-admission
  - registered-system
  - measures-registry
  - measures-of-inanna
  - non-ant
  - branch-guard
---

# OAR2 — Seat c3 Field Runtime Admission View v1

## OBSERVED

OAR1 — Seat Measures of Inanna Registered Spine Standing v1 has executed.

Current standing:

- `c3_registered_system` exists.
- Measures Registry is registered as the first registered operational system.
- Measures of Inanna is registered as spine standing.
- Measures of Inanna metadata identifies:
  - `registered_role = spine`
  - `spine_role = immutable_passage_pattern`
  - `pattern_role = inherited_incoherency_gate`
  - `codexstone_role = integrity_governance`
- Measures Registry metadata now references:
  - `depends_on_spine = measures_of_inanna`
  - `spine_dependency_state = registered_held`
  - `first_registered_operational_system = true`
- `c3_passage_law` exists.
- `c3_canopy_law` exists.
- Inanna spine passage law is seated and held.
- `measures_of_inanna_spine_passage_law` requires runtime admission.
- Both Measures Registry and Measures of Inanna remain `runtime_admission_state = not_seated`.
- ANT is banished.
- No runtime mutation occurred.
- No Measures Registry runtime mutation occurred.
- No public route mutation occurred.
- No optics/evidence/trace/correction contracts are seated yet.
- No AI action boundary is seated yet.

The next required schema layer is runtime admission.

This OAR seats the c3 Field runtime admission contract table and view.

It does not grant runtime admission.

It does not activate public runtime.

It does not mutate Measures Registry runtime behavior.

## ALIGNED

### Authority order

Codex holds.
Field structures.
Measures registers.
Chazz validates/routes.
Cody executes from OAR2 only.
`src` renders seated state only.

### Runtime admission distinction

Registration grants standing in the Field.

Runtime admission permits participation through runtime.

A registered system may remain not admitted.

Runtime admission must resolve from contract state, not from frontend logic.

### Current standing

Measures Registry:

- registered
- operational system
- depends on Measures of Inanna spine
- runtime admission not seated

Measures of Inanna:

- registered
- spine standing
- immutable passage pattern
- runtime admission not seated

### Boundary

This OAR creates runtime admission schema and a read view.

It may create held/not-seated admission contract rows.

It may not grant admission.

It may not activate runtime.

It may not mutate public site behavior.

It may not create optics/evidence/trace/correction contracts.

It may not create AI action boundary.

## OBJECTIVE

Seat c3 Field runtime admission schema and view without granting admission.

This OAR must:

1. Verify c3 Field branch.
2. Confirm registered-system prerequisites.
3. Confirm non-ANT passage/canopy law exists.
4. Confirm Measures of Inanna spine standing exists.
5. Create `c3_runtime_admission_contract`.
6. Create `v_c3_field_runtime_admission_v1`.
7. Seat held/not-seated admission contract rows for Measures Registry and Measures of Inanna, if safe.
8. Resolve admission status from registered standing, passage/canopy state, and admission contract state.
9. Preserve runtime boundary.
10. Preserve Measures Registry runtime behavior.
11. Write OAR1 with evidence.

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

### 2. Confirm prerequisite standing

Validate registered systems:

    select system_key, system_name, standing, implementation_pattern, system_scope,
           metadata->>'runtime_admission_state' as runtime_admission_state,
           metadata->>'registered_role' as registered_role,
           metadata->>'depends_on_spine' as depends_on_spine
    from c3_registered_system
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`
- `depends_on_spine = measures_of_inanna`

- `measures_of_inanna`
- `standing = registered`
- `runtime_admission_state = not_seated`
- `registered_role = spine`

Validate Inanna passage law:

    select passage_key, passage_type, source_system_key, target_system_key,
           passage_state, release_state, access_state, requires_runtime_admission
    from c3_passage_law
    where passage_key = 'measures_of_inanna_spine_passage_law';

Expected:

- `passage_state = held`
- `release_state = held`
- `access_state = held`
- `requires_runtime_admission = true`

Validate base canopy law:

    select canopy_key, canopy_type, carrier_state, communication_state, encounter_state, runtime_admission_state
    from c3_canopy_law
    where canopy_key = 'c3_field_canopy_law_base';

Expected:

- `runtime_admission_state = not_seated`

Validate ANT remains banished:

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name like 'ant_%';

Expected:

- 0 rows

If prerequisites fail, stop and report blocker.

### 3. Inspect existing runtime admission objects

Check for existing equivalent objects:

- `c3_runtime_admission_contract`
- `runtime_admission_contract`
- `field_runtime_admission`
- `v_c3_field_runtime_admission_v1`
- any table or view already resolving runtime admission

If an equivalent exists, do not duplicate. Report and adapt minimally.

### 4. Create `c3_runtime_admission_contract`

Create table:

`public.c3_runtime_admission_contract`

Purpose:

Represents c3 Field runtime admission standing for registered systems and governed passages without admitting runtime by default.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `admission_key text not null unique`
- `system_key text not null`
- `admission_scope text not null default 'system'`
- `admission_state text not null default 'not_seated'`
- `registered_system_required boolean not null default true`
- `passage_law_required boolean not null default true`
- `canopy_law_required boolean not null default true`
- `optics_contract_required boolean not null default true`
- `evidence_contract_required boolean not null default true`
- `trace_contract_required boolean not null default true`
- `correction_contract_required boolean not null default true`
- `ai_action_boundary_required boolean not null default true`
- `role_contract_required boolean not null default true`
- `external_contract_required boolean not null default false`
- `payment_contract_required boolean not null default false`
- `public_runtime_allowed boolean not null default false`
- `runtime_activation_allowed boolean not null default false`
- `release_state text not null default 'held'`
- `access_state text not null default 'held'`
- `blocker_reason text`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `admission_scope` constraint:

- `system`
- `passage`
- `canopy`
- `encounter`
- `external_boundary`

Required `admission_state` constraint:

- `not_seated`
- `held`
- `ready`
- `admitted`
- `blocked`
- `revoked`

Required `release_state` constraint:

- `held`
- `ready`
- `released`
- `blocked`
- `revoked`

Required `access_state` constraint:

- `held`
- `private`
- `public`
- `restricted`
- `blocked`
- `revoked`

Default must not admit runtime.

### 5. Add update trigger

Use existing project trigger function if present:

`public.c3_oar_set_updated_at()`

Apply to:

- `c3_runtime_admission_contract`

Do not introduce inconsistent trigger framework.

If unavailable, report blocker.

### 6. Enable RLS and read policy if consistent

If c3 Field standing tables use RLS public read, enable RLS and add public read policy for `SELECT` to `anon, authenticated`.

Do not add write policies.

### 7. Seat held/not-seated runtime admission rows

Insert or upsert rows only as held/not-seated.

#### Measures Registry runtime admission contract

- `admission_key`: `measures_registry_runtime_admission`
- `system_key`: `measures_registry`
- `admission_scope`: `system`
- `admission_state`: `not_seated`
- `release_state`: `held`
- `access_state`: `held`
- `registered_system_required`: true
- `passage_law_required`: true
- `canopy_law_required`: true
- `optics_contract_required`: true
- `evidence_contract_required`: true
- `trace_contract_required`: true
- `correction_contract_required`: true
- `ai_action_boundary_required`: true
- `role_contract_required`: true
- `external_contract_required`: false
- `payment_contract_required`: false
- `public_runtime_allowed`: false
- `runtime_activation_allowed`: false
- `blocker_reason`: `Runtime admission cannot be granted until optics, evidence, trace, correction, AI action boundary, and role contracts are seated.`
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md`
- metadata:
  - `depends_on_spine`: `measures_of_inanna`
  - `spine_passage_key`: `measures_of_inanna_spine_passage_law`
  - `runtime_admission_state`: `not_seated`
  - `standing_note`: `Measures Registry is registered but not runtime-admitted.`

#### Measures of Inanna runtime admission contract

- `admission_key`: `measures_of_inanna_runtime_admission`
- `system_key`: `measures_of_inanna`
- `admission_scope`: `system`
- `admission_state`: `not_seated`
- `release_state`: `held`
- `access_state`: `held`
- same required contract booleans as above
- `public_runtime_allowed`: false
- `runtime_activation_allowed`: false
- `blocker_reason`: `Spine standing is registered and held; runtime admission requires optics, evidence, trace, correction, AI action boundary, and role contracts.`
- metadata:
  - `registered_role`: `spine`
  - `spine_role`: `immutable_passage_pattern`
  - `runtime_admission_state`: `not_seated`
  - `standing_note`: `Measures of Inanna is registered spine standing but not runtime-admitted.`

### 8. Create `v_c3_field_runtime_admission_v1`

Create view:

`public.v_c3_field_runtime_admission_v1`

Purpose:

Resolve runtime admission standing from:

- registered-system standing
- runtime admission contract
- passage/canopy law standing
- required contract booleans
- held blockers

Minimum columns:

- `system_key`
- `system_name`
- `registration_standing`
- `registration_state`
- `implementation_pattern`
- `system_scope`
- `admission_key`
- `admission_scope`
- `admission_state`
- `release_state`
- `access_state`
- `public_runtime_allowed`
- `runtime_activation_allowed`
- `registered_system_valid`
- `passage_law_required`
- `canopy_law_required`
- `optics_contract_required`
- `evidence_contract_required`
- `trace_contract_required`
- `correction_contract_required`
- `ai_action_boundary_required`
- `role_contract_required`
- `external_contract_required`
- `payment_contract_required`
- `runtime_admission_resolved`
- `runtime_blocked_reason`
- `is_active`
- `created_at`
- `updated_at`

Resolution rule:

`runtime_admission_resolved` must be true only when all are true:

- registered system standing = `registered`
- admission_state = `admitted`
- release_state = `released`
- access_state is not `held`, `blocked`, or `revoked`
- public_runtime_allowed = true or runtime_activation_allowed = true
- required contracts are either seated or not required

Since required contract tables are not yet seated, current expected result must be:

- `runtime_admission_resolved = false`

for both Measures Registry and Measures of Inanna.

Do not fake required contract readiness.

### 9. Update registered-system metadata only if safe

For both `measures_registry` and `measures_of_inanna`, preserve:

- `runtime_admission_state = not_seated`

Optionally add:

- `runtime_admission_contract_key`
- `runtime_admission_contract_state = not_seated`
- `runtime_admission_view = v_c3_field_runtime_admission_v1`

Do not change standing.

Do not set runtime admission to ready/admitted.

### 10. Validate runtime admission view

Return:

    select system_key, system_name, registration_standing, admission_state,
           release_state, access_state, public_runtime_allowed,
           runtime_activation_allowed, runtime_admission_resolved,
           runtime_blocked_reason
    from v_c3_field_runtime_admission_v1
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
- blocker reason present

### 11. Preserve boundaries

Do not create:

- optics contract table
- evidence contract table
- trace contract table
- correction/revocation contract table
- AI action boundary table
- role contract table
- external system contract table
- secure passage contract table

Do not mutate:

- Measures Registry runtime
- public routes
- site copy
- pricing
- Stripe
- SEAT
- c3 Key
- wallet
- external integrations

Do not grant:

- runtime admission
- public access standing
- payment standing
- SEAT release standing
- certification standing
- c3 Key standing

### 12. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_seat_c3_field_runtime_admission_view_v1.meta.md`

OAR1 must include:

- branch verification
- prerequisite validation
- schema objects created
- runtime admission contract rows inserted/upserted
- runtime admission view created
- validation query output
- confirmation runtime admission remains unresolved / false
- confirmation no Measures Registry runtime mutation occurred
- confirmation no public route mutation occurred
- confirmation no optics/evidence/trace/correction mutation occurred
- confirmation no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect current DB schema
- create `c3_runtime_admission_contract`
- create update trigger
- enable RLS/read policy if consistent
- insert held/not-seated admission rows
- create `v_c3_field_runtime_admission_v1`
- update registered-system metadata to reference admission contracts
- validate admission resolution
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- create optics/evidence/trace/correction contracts
- create AI action boundary table
- create role contract table
- create external/secure passage contracts
- activate public route
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- grant runtime admission
- mark runtime admission ready/admitted
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. Registered-system prerequisites validated.
3. Non-ANT passage/canopy prerequisites validated.
4. Inanna spine standing validated.
5. `c3_runtime_admission_contract` created.
6. Runtime admission constraints created.
7. Update trigger applied or blocker reported.
8. RLS/read policy applied if consistent.
9. Measures Registry admission row inserted/upserted as `not_seated`.
10. Measures of Inanna admission row inserted/upserted as `not_seated`.
11. `v_c3_field_runtime_admission_v1` created.
12. Both systems appear in runtime admission view.
13. Runtime admission resolves false for both systems.
14. No runtime admission granted.
15. No Measures Registry runtime mutation performed.
16. No public route mutation performed.
17. No optics/evidence/trace/correction mutation performed.
18. No AI action boundary mutation performed.
19. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
20. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_seat_c3_field_runtime_admission_view_v1.meta.md`

## CLOSE

Runtime admission is now represented as c3 Field law.

No system is admitted from this OAR.

Measures Registry remains registered but not runtime-admitted.

Measures of Inanna remains registered spine standing but not runtime-admitted.

Optics, evidence, trace, correction, AI action boundary, and role contracts remain next required gates.
