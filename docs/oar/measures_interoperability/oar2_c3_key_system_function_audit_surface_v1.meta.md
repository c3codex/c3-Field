---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key System Function Audit Surface v1
status: proposed
version: v1
operator: op044
system: c3_field_systems
staging_location: measures_interoperability
final_location_pending: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - c3-field-systems
  - c3-key
  - system-function
  - audit-surface
  - temporary-c3-key
  - operator-guard
  - support-safe
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key System Function Authority Contract v1
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Communication Trace Runtime Read Model v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key System Function Audit Surface v1

## OBSERVED

The c3 Key system-function authority contract is seated.

Current standing:

- c3 Key functions belong to c3 Field systems
- implementation surfaces may request or record c3 Key standing
- no surface may invent independent c3 Key logic
- temporary c3 Key assignment remains allowed
- wallet-held c3 Key migration remains future-held

The prior OAR1 confirms the function categories, temporary assignment guard, cross-surface resolution guard, operator / admin invocation requirements, audit / OAR trace requirements, and wallet migration prerequisites were documented without implementing runtime functions.

Current gap:

A callable-function authority contract exists.

A governed audit surface for future c3 Key system-function invocations is not yet defined.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

Before any protected c3 Key system function is implemented, the audit surface must be defined.

This OAR2 defines the audit surface for future c3 Key system-function invocation.

This is not runtime execution.

This is not a public API.

This is not wallet binding.

This is not NFT minting.

This is not payment activation.

## CORE RULE

No protected c3 Key function executes without audit trace.

Audit records invocation standing.

Audit does not expose private authority.

Audit does not create recognition, conversion, wallet, NFT, or payment standing.

Codex holds.

## ROUTED

Executor may create / document:

1. c3 Key system-function audit surface
2. function invocation event shape
3. bounded action types
4. bounded result statuses
5. support-safe input / output reference rules
6. operator / admin reference requirement
7. source OAR requirement
8. future implementation guard
9. OAR1 closeout

Executor may not:

- implement callable c3 Key functions
- wire runtime
- open public API
- open public lookup
- mutate existing temp c3 Key records
- bind wallet
- mint NFT
- deploy contract
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## AUDIT SURFACE PURPOSE

The audit surface exists to record future protected c3 Key system-function invocations, including but not limited to:

- `assign_temp_c3_key`
- `resolve_c3_key_standing`
- `read_c3_key_support_trace`
- `record_c3_key_agreement_ack`
- `record_c3_key_communication_trace`
- `prepare_wallet_migration`
- `complete_wallet_migration`
- `hold_c3_key_standing`
- `expire_c3_key_standing`
- `revoke_c3_key_standing`

This OAR2 may define or seat the audit structure.

It does not authorize execution of those functions.

## FIELD CONTRACT

Preferred table:

    create table if not exists public.c3_key_system_function_audit (
      id uuid primary key default gen_random_uuid(),

      function_name text not null,
      action_type text not null,
      result_status text not null check (
        result_status in (
          'prepared',
          'executed',
          'held',
          'failed',
          'rejected',
          'cancelled'
        )
      ),

      operator_ref text not null,
      source_oar_id text not null,

      temp_key_id uuid references public.c3_key_temp(id) on delete set null,
      public_ref text,

      input_ref jsonb not null default '{}'::jsonb,
      output_ref jsonb not null default '{}'::jsonb,

      support_safe boolean not null default true,

      metadata jsonb not null default '{}'::jsonb,

      created_at timestamptz not null default now()
    );

## BOUNDED FUNCTION NAMES

Allowed `function_name` values should be bounded to:

- `assign_temp_c3_key`
- `resolve_c3_key_standing`
- `read_c3_key_support_trace`
- `record_c3_key_agreement_ack`
- `record_c3_key_communication_trace`
- `prepare_wallet_migration`
- `complete_wallet_migration`
- `hold_c3_key_standing`
- `expire_c3_key_standing`
- `revoke_c3_key_standing`

If executor seats this as SQL, use a check constraint.

## SUPPORT-SAFE RULE

Allowed in audit:

- function_name
- action_type
- result_status
- operator_ref
- source_oar_id
- temp_key_id
- public_ref
- support-safe input reference
- support-safe output reference
- timestamp
- non-sensitive metadata

Not allowed in audit:

- `temp_key`
- private wallet key
- seed phrase
- provider API key
- service-role key
- contact_email_hash
- contact_email_encrypted
- raw email body
- raw agreement metadata
- private payment data
- unbounded private payloads

## ACCESS POSTURE

If seated as DB table:

- RLS enabled
- zero public policies
- no anon access
- no authenticated broad access
- service-role / admin only unless separately routed

No frontend direct read or write may be opened.

## FUTURE FUNCTION GUARD

Future c3 Key callable-function OAR2s must confirm either:

1. audit row is created during invocation

or:

2. function is held because audit surface is unavailable

No future protected c3 Key system function should execute without audit standing.

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- DAO voting activation
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this audit-surface document in the measures_interoperability staging folder
- create SQL seating artifact if required
- create migration artifact if repo migration pattern is present
- seat the audit table if implementation is chosen
- enable RLS if table seated
- keep zero public policies
- document future function guard
- preserve Measures Registry implementation standing
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- implement callable c3 Key functions
- alter temp c3 Key records
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. c3 Key system-function audit surface documented or seated
2. exact files created / modified
3. whether DB mutation occurred
4. function names bounded if table seated
5. result statuses bounded if table seated
6. operator / admin reference required
7. source OAR reference required
8. support-safe input / output references documented
9. prohibited fields excluded
10. RLS enabled if table seated
11. no public / anon policy opened
12. future function guard documented
13. no callable c3 Key function implemented
14. no existing temp implementation invalidated
15. no runtime execution occurred
16. no public access opened
17. no wallet / NFT action occurred
18. no payment activation occurred
19. no recognition / conversion standing created
20. folder reconciliation not performed
21. process rule not created
22. file staged in measures_interoperability intentionally
23. final folder reconciliation remains pending
24. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_system_function_audit_surface_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the c3 Key system-function audit surface is documented or seated so future protected c3 Key functions cannot execute without trace, while preserving support-safe boundaries and keeping runtime, wallet, NFT, payment, recognition, conversion, folder reconciliation, and process-rule creation held.

## CLOSE

System function contract is seated.

Audit surface forms.

Callable functions wait.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
