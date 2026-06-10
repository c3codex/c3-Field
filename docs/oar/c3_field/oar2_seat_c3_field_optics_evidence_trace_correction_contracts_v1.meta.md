---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_seat_c3_field_runtime_admission_view_v1.meta.md
tags:
  - oar2
  - c3-field
  - optics
  - evidence
  - trace
  - correction
  - ai-action-boundary
  - role-contract
  - runtime-admission
  - branch-guard
---

# OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1

## OBSERVED

OAR1 — Seat c3 Field Runtime Admission View v1 has executed.

Current standing:

- `c3_runtime_admission_contract` exists.
- `v_c3_field_runtime_admission_v1` exists.
- Measures Registry runtime admission row exists.
- Measures of Inanna runtime admission row exists.
- Both admission rows remain `not_seated`.
- Both `release_state` values remain `held`.
- Both `access_state` values remain `held`.
- `runtime_admission_resolved = false` for both systems.
- Measures Registry remains registered but not runtime-admitted.
- Measures of Inanna remains registered spine standing but not runtime-admitted.
- No runtime mutation occurred.
- No public route mutation occurred.
- No optics/evidence/trace/correction contracts are seated yet.
- No AI action boundary is seated yet.
- No pricing / Stripe / SEAT / c3 Key / wallet mutation occurred.

The runtime admission view now correctly blocks admission until required contract layers are seated.

The next required schema layer is:

- optics contract
- evidence contract
- trace contract
- correction / revocation contract
- AI action boundary
- role contract, if needed for admission gating

This OAR seats those contract tables as held/not-seated law only.

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

### Contract distinction

Runtime admission depends on contracts.

Contract existence is not the same as runtime permission.

A contract may be seated and still held.

Admission must remain false until:

- admission state is admitted
- release state is released
- access state is no longer held/blocked/revoked
- all required contracts are seated and valid
- runtime activation is explicitly allowed

### Current admission standing

Measures Registry:

- registered
- runtime admission contract exists
- admission_state = not_seated
- runtime_admission_resolved = false

Measures of Inanna:

- registered spine standing
- runtime admission contract exists
- admission_state = not_seated
- runtime_admission_resolved = false

### Boundary

This OAR creates contract schema only.

It may seat held base contract rows.

It may update runtime admission contract metadata to reference newly seated contract layers.

It may not grant admission.

It may not activate runtime.

It may not mutate public routes.

It may not activate pricing, SEAT, c3 Key, wallet, or external integrations.

## OBJECTIVE

Seat c3 Field optics, evidence, trace, correction, AI action boundary, and role contract schema as required gates for runtime admission.

This OAR must:

1. Verify c3 Field branch.
2. Confirm runtime admission contract/view exists.
3. Confirm Measures Registry and Measures of Inanna remain unresolved / not admitted.
4. Create `c3_optics_contract`.
5. Create `c3_evidence_contract`.
6. Create `c3_trace_contract`.
7. Create `c3_correction_contract`.
8. Create `c3_ai_action_boundary`.
9. Create `c3_role_contract` if required for admission gating.
10. Seat base held rows for Measures Registry and Measures of Inanna where appropriate.
11. Update runtime admission contract metadata to reference seated-but-held contract gates.
12. Preserve `runtime_admission_resolved = false`.
13. Preserve Measures Registry runtime behavior.
14. Write OAR1 with evidence.

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

Validate runtime admission table:

    select admission_key, system_key, admission_state, release_state, access_state,
           optics_contract_required, evidence_contract_required, trace_contract_required,
           correction_contract_required, ai_action_boundary_required, role_contract_required
    from c3_runtime_admission_contract
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- both rows exist
- all required gate booleans remain true unless explicitly not required
- no row is admitted

If either system is admitted, stop and report:

`RUNTIME_ADMISSION_ALREADY_GRANTED_BLOCKER`

### 3. Inspect for existing contract objects

Check for existing equivalent objects before creating:

- `c3_optics_contract`
- `c3_evidence_contract`
- `c3_trace_contract`
- `c3_correction_contract`
- `c3_ai_action_boundary`
- `c3_role_contract`

If any equivalent exists, do not duplicate. Adapt minimally and report.

### 4. Create `c3_optics_contract`

Create table:

`public.c3_optics_contract`

Purpose:

Defines what relational geometry / Field optics may be displayed, surfaced, or interpreted by runtime.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `optics_key text not null unique`
- `system_key text not null`
- `optics_scope text not null default 'system'`
- `optics_state text not null default 'held'`
- `display_allowed boolean not null default false`
- `interpretation_allowed boolean not null default false`
- `public_surface_allowed boolean not null default false`
- `requires_evidence boolean not null default true`
- `requires_trace boolean not null default true`
- `requires_correction_path boolean not null default true`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `optics_scope` constraint:

- `system`
- `passage`
- `canopy`
- `encounter`
- `field`

Required `optics_state` constraint:

- `held`
- `draft`
- `ready`
- `released`
- `blocked`
- `revoked`

Default must not allow display or interpretation.

### 5. Create `c3_evidence_contract`

Create table:

`public.c3_evidence_contract`

Purpose:

Defines evidence requirements before any system state, claim, assessment, admission, or correction may be accepted.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `evidence_key text not null unique`
- `system_key text not null`
- `evidence_scope text not null default 'system'`
- `evidence_state text not null default 'held'`
- `evidence_required boolean not null default true`
- `source_required boolean not null default true`
- `operator_attestation_required boolean not null default true`
- `execution_artifact_required boolean not null default true`
- `public_claim_allowed boolean not null default false`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `evidence_scope` constraint:

- `system`
- `passage`
- `canopy`
- `encounter`
- `runtime_admission`
- `correction`
- `public_claim`

Required `evidence_state` constraint:

- `held`
- `draft`
- `ready`
- `accepted`
- `blocked`
- `revoked`

Default must not allow public claims.

### 6. Create `c3_trace_contract`

Create table:

`public.c3_trace_contract`

Purpose:

Defines traceability requirements for meaningful actions, runtime changes, admission changes, correction events, and AI-assisted operations.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `trace_key text not null unique`
- `system_key text not null`
- `trace_scope text not null default 'system'`
- `trace_state text not null default 'held'`
- `oar_required boolean not null default true`
- `execution_log_required boolean not null default true`
- `actor_required boolean not null default true`
- `timestamp_required boolean not null default true`
- `source_diff_required boolean not null default true`
- `ai_assist_trace_required boolean not null default true`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `trace_scope` constraint:

- `system`
- `runtime_admission`
- `schema`
- `source`
- `public_route`
- `ai_action`
- `correction`

Required `trace_state` constraint:

- `held`
- `draft`
- `ready`
- `active`
- `blocked`
- `revoked`

### 7. Create `c3_correction_contract`

Create table:

`public.c3_correction_contract`

Purpose:

Defines correction, revocation, rollback, and dispute paths for governed systems.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `correction_key text not null unique`
- `system_key text not null`
- `correction_scope text not null default 'system'`
- `correction_state text not null default 'held'`
- `revocation_allowed boolean not null default true`
- `rollback_required boolean not null default true`
- `operator_review_required boolean not null default true`
- `evidence_required boolean not null default true`
- `trace_required boolean not null default true`
- `public_notice_required boolean not null default false`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `correction_scope` constraint:

- `system`
- `runtime_admission`
- `public_route`
- `assessment`
- `ai_action`
- `contract`
- `source`

Required `correction_state` constraint:

- `held`
- `draft`
- `ready`
- `active`
- `blocked`
- `revoked`

### 8. Create `c3_ai_action_boundary`

Create table:

`public.c3_ai_action_boundary`

Purpose:

Defines what AI may and may not do within c3 Field without becoming authority.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `boundary_key text not null unique`
- `system_key text not null`
- `boundary_scope text not null default 'system'`
- `boundary_state text not null default 'held'`
- `ai_role text not null default 'assistant_executor_support'`
- `authority_allowed boolean not null default false`
- `mutation_allowed boolean not null default false`
- `proposal_allowed boolean not null default true`
- `execution_allowed boolean not null default false`
- `requires_oar boolean not null default true`
- `requires_operator_confirmation boolean not null default true`
- `requires_evidence boolean not null default true`
- `requires_trace boolean not null default true`
- `public_claim_allowed boolean not null default false`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `boundary_scope` constraint:

- `system`
- `runtime_admission`
- `source`
- `public_route`
- `assessment`
- `communication`
- `correction`

Required `boundary_state` constraint:

- `held`
- `draft`
- `ready`
- `active`
- `blocked`
- `revoked`

AI must not be authority.

Default must not permit mutation or execution.

### 9. Create `c3_role_contract`

Create table:

`public.c3_role_contract`

Purpose:

Defines role standing required before runtime admission or governed operations may be assigned.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `role_key text not null unique`
- `system_key text not null`
- `role_scope text not null default 'system'`
- `role_name text not null`
- `role_state text not null default 'held'`
- `runtime_authority_allowed boolean not null default false`
- `mutation_authority_allowed boolean not null default false`
- `review_authority_allowed boolean not null default false`
- `operator_confirmation_required boolean not null default true`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `role_scope` constraint:

- `system`
- `runtime_admission`
- `source`
- `public_route`
- `assessment`
- `correction`

Required `role_state` constraint:

- `held`
- `draft`
- `ready`
- `active`
- `blocked`
- `revoked`

Default must not grant runtime authority.

### 10. Add update triggers

Use existing project trigger function if present:

`public.c3_oar_set_updated_at()`

Apply to all new contract tables.

Do not introduce inconsistent trigger framework.

If unavailable, report blocker.

### 11. Enable RLS and read policies if consistent

If c3 Field standing tables use public read RLS pattern, enable RLS and add public read policies for `SELECT` to `anon, authenticated`.

Do not add write policies.

### 12. Seat base held rows

Seat base held rows for:

- Measures Registry
- Measures of Inanna

Rows should be inserted/upserted for each contract family.

All rows must remain held.

No row may allow runtime mutation, public claim, public display, public activation, AI authority, AI mutation, or role authority.

Minimum row keys:

For Measures Registry:

- `measures_registry_optics_contract`
- `measures_registry_evidence_contract`
- `measures_registry_trace_contract`
- `measures_registry_correction_contract`
- `measures_registry_ai_action_boundary`
- `measures_registry_role_contract`

For Measures of Inanna:

- `measures_of_inanna_optics_contract`
- `measures_of_inanna_evidence_contract`
- `measures_of_inanna_trace_contract`
- `measures_of_inanna_correction_contract`
- `measures_of_inanna_ai_action_boundary`
- `measures_of_inanna_role_contract`

All source paths:

`docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md`

Expected OAR1 source path:

`docs/oar/c3_field/oar1_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md`

### 13. Create read views

Create views:

- `v_c3_contract_readiness_v1`
- `v_c3_ai_action_boundary_v1`

`v_c3_contract_readiness_v1` should surface per-system contract states:

- system_key
- optics_state
- evidence_state
- trace_state
- correction_state
- role_state
- all_contracts_ready boolean
- contract_blocked_reason

Resolution rule:

`all_contracts_ready = true` only when all required contract states are ready/active/accepted as applicable.

Current expected result:

- false for Measures Registry
- false for Measures of Inanna

`v_c3_ai_action_boundary_v1` should surface:

- boundary_key
- system_key
- boundary_scope
- boundary_state
- ai_role
- authority_allowed
- mutation_allowed
- proposal_allowed
- execution_allowed
- requires_oar
- requires_operator_confirmation
- public_claim_allowed

Expected:

- authority_allowed = false
- mutation_allowed = false
- execution_allowed = false
- proposal_allowed = true

### 14. Update runtime admission contract metadata

For each runtime admission row, merge metadata references to newly seated contract keys.

Do not change:

- `admission_state`
- `release_state`
- `access_state`
- `public_runtime_allowed`
- `runtime_activation_allowed`

Preserve:

- `admission_state = not_seated`
- `release_state = held`
- `access_state = held`
- `runtime_admission_resolved = false`

### 15. Validate runtime admission remains unresolved

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
- `runtime_admission_resolved = false`
- no runtime admission granted

### 16. Preserve boundaries

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
- role authority
- AI mutation authority
- AI execution authority

### 17. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md`

OAR1 must include:

- branch verification
- prerequisite validation
- schema objects created
- base held rows inserted/upserted
- read views created
- runtime admission metadata references merged
- validation query output
- confirmation contract readiness remains false
- confirmation runtime admission remains false
- confirmation no Measures Registry runtime mutation occurred
- confirmation no public route mutation occurred
- confirmation no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect current DB schema
- create contract tables
- create update triggers
- enable RLS/read policies if consistent
- insert held contract rows
- create read views
- update runtime admission metadata references
- validate contract readiness
- validate runtime admission remains false
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- activate runtime admission
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
3. `c3_optics_contract` created.
4. `c3_evidence_contract` created.
5. `c3_trace_contract` created.
6. `c3_correction_contract` created.
7. `c3_ai_action_boundary` created.
8. `c3_role_contract` created.
9. Update triggers applied or blocker reported.
10. RLS/read policies applied if consistent.
11. Measures Registry base held contract rows inserted/upserted.
12. Measures of Inanna base held contract rows inserted/upserted.
13. `v_c3_contract_readiness_v1` created.
14. `v_c3_ai_action_boundary_v1` created.
15. Contract readiness resolves false for both systems.
16. Runtime admission remains false for both systems.
17. No runtime admission granted.
18. No Measures Registry runtime mutation performed.
19. No public route mutation performed.
20. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
21. No AI authority/mutation/execution granted.
22. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md`

## CLOSE

Contract gates are seated as c3 Field law.

They remain held.

Runtime admission remains unresolved.

AI remains role-bound and non-authoritative.

No public runtime changes occur from this OAR.
