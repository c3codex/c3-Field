---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Bind Measures Registry to c3 Field Runtime Admission
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md
tags:
  - oar2
  - c3-field
  - runtime-admission-binding
  - measures-registry
  - contract-readiness
  - admission-validation
  - branch-guard
---

# OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1

## OBSERVED

OAR1 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1 has executed.

Current standing:

- `c3_runtime_admission_contract` exists.
- `v_c3_field_runtime_admission_v1` exists.
- `c3_optics_contract` exists.
- `c3_evidence_contract` exists.
- `c3_trace_contract` exists.
- `c3_correction_contract` exists.
- `c3_ai_action_boundary` exists.
- `c3_role_contract` exists.
- `v_c3_contract_readiness_v1` exists.
- `v_c3_ai_action_boundary_v1` exists.
- Measures Registry has base held contract rows.
- Measures of Inanna has base held contract rows.
- Contract readiness resolves false for both systems.
- Runtime admission resolves false for both systems.
- AI authority, mutation, and execution remain false.
- Measures Registry remains registered but not runtime-admitted.
- Measures of Inanna remains registered spine standing but not runtime-admitted.
- No Measures Registry runtime mutation occurred.
- No public route mutation occurred.
- No pricing / Stripe / SEAT / c3 Key / wallet / external integration mutation occurred.

The next required layer is a binding contract connecting Measures Registry threshold encounters to c3 Field runtime admission validation.

This OAR does not admit runtime.

This OAR does not activate public routes.

This OAR does not mutate Measures Registry runtime behavior.

It creates the binding law and validation view only.

## ALIGNED

### Authority order

Codex holds.
Field structures.
Measures registers.
Chazz validates/routes.
Cody executes from OAR2 only.
`src` renders seated state only.

### Binding distinction

Binding is not activation.

A Measures Registry encounter can be bound to runtime admission validation while remaining held.

Admission must remain false until:

- admission state is admitted
- release state is released
- access state is no longer held/blocked/revoked
- contract readiness resolves true
- runtime activation is explicitly allowed
- public route activation is explicitly seated

### Current admission standing

Measures Registry:

- registered
- runtime admission contract exists
- contract gates exist
- contract readiness = false
- runtime admission resolved = false

Measures of Inanna:

- registered spine standing
- runtime admission contract exists
- contract gates exist
- contract readiness = false
- runtime admission resolved = false

### Boundary

This OAR creates Measures Registry admission binding schema only.

It may seat held binding rows.

It may create validation views.

It may update metadata references.

It may not grant runtime admission.

It may not activate public runtime.

It may not mutate live Measures Registry runtime behavior.

It may not advance contract states to ready / active / accepted.

## OBJECTIVE

Bind Measures Registry threshold encounters to c3 Field runtime admission validation without granting admission or changing public runtime behavior.

This OAR must:

1. Verify c3 Field branch.
2. Confirm runtime admission and contract gates exist.
3. Confirm contract readiness remains false.
4. Confirm runtime admission remains false.
5. Create `c3_runtime_admission_binding`.
6. Create `v_c3_measures_registry_admission_binding_v1`.
7. Seat held Measures Registry binding rows for threshold encounter categories.
8. Preserve all admission and contract readiness states.
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

### 2. Confirm prerequisite standing

Validate runtime admission:

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

Validate contract readiness:

    select system_key, optics_state, evidence_state, trace_state,
           correction_state, role_state, all_contracts_ready,
           contract_blocked_reason
    from v_c3_contract_readiness_v1
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- both systems present
- `all_contracts_ready = false`

Validate AI action boundary:

    select system_key, boundary_state, authority_allowed, mutation_allowed,
           proposal_allowed, execution_allowed
    from v_c3_ai_action_boundary_v1
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- `authority_allowed = false`
- `mutation_allowed = false`
- `execution_allowed = false`
- `proposal_allowed = true`

If runtime admission is already true, stop and report:

`RUNTIME_ADMISSION_ALREADY_GRANTED_BLOCKER`

If contract readiness is already true, stop and report:

`CONTRACT_READINESS_ALREADY_TRUE_REVIEW_REQUIRED`

### 3. Inspect existing binding objects

Check for existing equivalent objects before creating:

- `c3_runtime_admission_binding`
- `measures_registry_runtime_admission_binding`
- `v_c3_measures_registry_admission_binding_v1`
- any view binding Measures Registry threshold encounters to runtime admission

If equivalent exists, do not duplicate. Adapt minimally and report.

### 4. Create `c3_runtime_admission_binding`

Create table:

`public.c3_runtime_admission_binding`

Purpose:

Binds registered systems, passage law, canopy law, contracts, and runtime admission validation to specific governed encounter categories or runtime surfaces.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `binding_key text not null unique`
- `system_key text not null`
- `admission_key text not null`
- `binding_scope text not null default 'system'`
- `binding_target_type text not null`
- `binding_target_key text not null`
- `passage_key text`
- `canopy_key text`
- `contract_readiness_required boolean not null default true`
- `runtime_admission_required boolean not null default true`
- `public_route_required boolean not null default false`
- `payment_required boolean not null default false`
- `seat_required boolean not null default false`
- `c3_key_required boolean not null default false`
- `binding_state text not null default 'held'`
- `release_state text not null default 'held'`
- `access_state text not null default 'held'`
- `runtime_effect_allowed boolean not null default false`
- `public_effect_allowed boolean not null default false`
- `blocker_reason text`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `binding_scope` constraint:

- `system`
- `encounter`
- `chamber`
- `pathway`
- `assessment`
- `runtime_surface`

Required `binding_target_type` constraint:

- `encounter_key`
- `registry_key`
- `chamber_key`
- `pathway_key`
- `assessment_key`
- `surface_key`

Required `binding_state` constraint:

- `held`
- `draft`
- `ready`
- `bound`
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

Default must not allow runtime effect or public effect.

### 5. Add update trigger

Use existing project trigger function:

`public.c3_oar_set_updated_at()`

Apply to:

- `c3_runtime_admission_binding`

If unavailable, report blocker.

Do not introduce inconsistent trigger framework.

### 6. Enable RLS and public read policy if consistent

If c3 Field standing tables use public read RLS pattern, enable RLS and add public read policy for `SELECT` to `anon, authenticated`.

Do not add write policies.

### 7. Seat Measures Registry held binding rows

Seat held rows for Measures Registry threshold categories.

Rows must bind to runtime admission validation, but not activate it.

Required `system_key`:

`measures_registry`

Required `admission_key`:

`measures_registry_runtime_admission`

Required source path:

`docs/oar/c3_field/oar2_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md`

Expected OAR1 source path:

`docs/oar/c3_field/oar1_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md`

Required base binding rows:

#### Assessment binding

- `binding_key`: `measures_registry_assessment_admission_binding`
- `binding_scope`: `assessment`
- `binding_target_type`: `assessment_key`
- `binding_target_key`: `measures_assessment`
- `passage_key`: `measures_of_inanna_spine_passage_law`
- `canopy_key`: `c3_field_canopy_law_base`
- `contract_readiness_required`: true
- `runtime_admission_required`: true
- `public_route_required`: false
- `payment_required`: false
- `seat_required`: false
- `c3_key_required`: false
- `binding_state`: `held`
- `release_state`: `held`
- `access_state`: `held`
- `runtime_effect_allowed`: false
- `public_effect_allowed`: false
- `blocker_reason`: `Assessment binding is held until contract readiness and runtime admission are explicitly advanced.`

#### Governed pathway reveal binding

- `binding_key`: `measures_registry_governed_pathway_reveal_admission_binding`
- `binding_scope`: `pathway`
- `binding_target_type`: `pathway_key`
- `binding_target_key`: `governed_pathway_reveal`
- same held states and blocker rule

#### Marble / MAP continuation binding

- `binding_key`: `measures_registry_map_continuation_admission_binding`
- `binding_scope`: `pathway`
- `binding_target_type`: `pathway_key`
- `binding_target_key`: `map_continuation`
- same held states and blocker rule

Do not bind payment, SEAT, Stripe, c3 Key, wallet, DAO, certification, or public activation in this OAR.

### 8. Create `v_c3_measures_registry_admission_binding_v1`

Create view:

`public.v_c3_measures_registry_admission_binding_v1`

Purpose:

Resolve Measures Registry binding standing from:

- binding row
- runtime admission view
- contract readiness view
- passage law state
- canopy law state
- effect booleans

Minimum columns:

- `binding_key`
- `system_key`
- `binding_scope`
- `binding_target_type`
- `binding_target_key`
- `binding_state`
- `release_state`
- `access_state`
- `runtime_effect_allowed`
- `public_effect_allowed`
- `admission_state`
- `runtime_admission_resolved`
- `all_contracts_ready`
- `passage_state`
- `passage_release_state`
- `passage_access_state`
- `canopy_runtime_admission_state`
- `binding_resolved`
- `binding_blocked_reason`
- `is_active`
- `created_at`
- `updated_at`

Resolution rule:

`binding_resolved = true` only when all are true:

- binding_state = `bound`
- release_state = `released`
- access_state is not `held`, `blocked`, or `revoked`
- runtime_effect_allowed = true or public_effect_allowed = true
- runtime admission resolved = true
- contract readiness = true
- passage state is released or ready as required
- canopy runtime admission state is ready/admitted as required

Current expected result:

- `binding_resolved = false` for all Measures Registry rows

Do not fake readiness.

Do not infer public activation.

### 9. Update runtime admission metadata only if safe

For `measures_registry_runtime_admission`, merge metadata:

- `admission_binding_view`: `v_c3_measures_registry_admission_binding_v1`
- `assessment_binding_key`: `measures_registry_assessment_admission_binding`
- `governed_pathway_reveal_binding_key`: `measures_registry_governed_pathway_reveal_admission_binding`
- `map_continuation_binding_key`: `measures_registry_map_continuation_admission_binding`
- `binding_state`: `held`

Do not change:

- `admission_state`
- `release_state`
- `access_state`
- `public_runtime_allowed`
- `runtime_activation_allowed`

### 10. Validate binding view

Return:

    select binding_key, binding_target_key, binding_state, release_state, access_state,
           runtime_effect_allowed, public_effect_allowed,
           runtime_admission_resolved, all_contracts_ready,
           binding_resolved, binding_blocked_reason
    from v_c3_measures_registry_admission_binding_v1
    order by binding_key;

Expected:

- all binding rows present
- all `binding_state = held`
- all `release_state = held`
- all `access_state = held`
- all `runtime_effect_allowed = false`
- all `public_effect_allowed = false`
- all `runtime_admission_resolved = false`
- all `all_contracts_ready = false`
- all `binding_resolved = false`

### 11. Validate runtime admission remains false

Return:

    select system_key, admission_state, release_state, access_state,
           public_runtime_allowed, runtime_activation_allowed,
           runtime_admission_resolved
    from v_c3_field_runtime_admission_v1
    where system_key = 'measures_registry';

Expected:

- `admission_state = not_seated`
- `release_state = held`
- `access_state = held`
- `public_runtime_allowed = false`
- `runtime_activation_allowed = false`
- `runtime_admission_resolved = false`

### 12. Preserve boundaries

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

### 13. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md`

OAR1 must include:

- branch verification
- prerequisite validation
- schema object created
- held binding rows inserted/upserted
- binding view created
- runtime admission metadata references merged
- validation query output
- confirmation binding readiness remains false
- confirmation runtime admission remains false
- confirmation contract readiness remains false
- confirmation no Measures Registry runtime mutation occurred
- confirmation no public route mutation occurred
- confirmation no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect current DB schema
- create `c3_runtime_admission_binding`
- create update trigger
- enable RLS/read policy if consistent
- insert held Measures Registry binding rows
- create binding read view
- update runtime admission metadata references
- validate binding resolution
- validate runtime admission remains false
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
- reintroduce ANT
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. Runtime admission prerequisites validated.
3. Contract readiness prerequisites validated.
4. `c3_runtime_admission_binding` created.
5. Update trigger applied or blocker reported.
6. RLS/read policy applied if consistent.
7. Measures Registry held binding rows inserted/upserted.
8. `v_c3_measures_registry_admission_binding_v1` created.
9. Runtime admission metadata references merged.
10. Binding resolution remains false.
11. Runtime admission remains false.
12. Contract readiness remains false.
13. No runtime admission granted.
14. No binding activation granted.
15. No Measures Registry runtime mutation performed.
16. No public route mutation performed.
17. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
18. No AI authority/mutation/execution granted.
19. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_bind_measures_registry_to_c3_field_runtime_admission_v1.meta.md`

## CLOSE

Measures Registry is bound to c3 Field runtime admission validation.

Binding remains held.

Runtime admission remains unresolved.

Contract readiness remains false.

No public runtime changes occur from this OAR.
