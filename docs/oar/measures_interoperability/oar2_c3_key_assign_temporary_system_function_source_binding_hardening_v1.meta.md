---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Assign Temporary System Function Source Binding Hardening v1
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
  - assign-temp-c3-key
  - source-binding
  - source-oar-binding
  - hardening
  - audit-required
  - support-safe
  - no-runtime
  - no-public-access
  - no-nft-mint
  - no-recognition
  - no-conversion
  - staging
  - folder-reconciliation-pending
source_alignment:
  - OAR1 — c3 Key Assign Temporary System Function Implementation v1
  - OAR1 — c3 Key Assign Temporary System Function Invocation Guard v1
  - OAR1 — c3 Key Permission Map Support Read Model v1
  - OAR1 — c3 Key Permission Map Storage Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Assign Temporary System Function Source Binding Hardening v1

## OBSERVED

`public.assign_temp_c3_key(...)` is seated as a protected callable system function.

Current standing:

- implementation seated
- access granted to service_role only
- audit-first behavior enforced
- support-safe output enforced
- raw temp_key not returned
- permission grant not authorized
- runtime / public API not opened
- wallet / NFT / DAO / distribution / payment held
- recognition / conversion held

The implementation validates required guard fields and creates an audit row before assignment.

Current seam:

`source_oar_binding_validation: presence_required_current_schema`

Current schema requires `source_record_id`, `source_oar_id`, and `source_oar_path`, but does not yet provide a dedicated source-record / OAR binding table for SRC, SRC1, and SRC2.

This means the function is safely seated, but real assignment should be hardened before operator use.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

Source binding must be hardened before real assignment use.

Presence is not enough long-term.

The system needs explicit source-record / OAR binding verification for:

- SRC
- SRC1
- SRC2

`future_SRC3` remains held until DAO / web3 intake is separately seated.

This hardening must not issue keys.

This hardening must not grant permissions.

This hardening must not wire runtime.

This hardening must not open public access.

## CORE RULE

No explicit source / OAR binding, no real assignment.

Presence is not enough long-term.

Source standing must be traceable.

No assignment without active binding.

Codex holds.

## ROUTED

Executor may create or prepare:

1. source / OAR binding storage contract or verification table
2. bounded source record types
3. required binding fields
4. support-safe binding metadata
5. validation RPC or helper if needed
6. update path for `assign_temp_c3_key` to verify binding
7. held behavior if binding is missing
8. OAR1 closeout

Executor may not:

- issue temporary c3 Key
- grant permission
- activate permission
- wire runtime
- open public lookup
- bind wallet
- mint NFT
- activate DAO voting
- activate distribution
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## PREFERRED STORAGE CONTRACT

Preferred table:

    create table if not exists public.c3_key_source_oar_binding (
      id uuid primary key default gen_random_uuid(),

      source_record_type text not null check (
        source_record_type in ('SRC', 'SRC1', 'SRC2')
      ),

      source_record_id text not null,
      source_oar_id text not null,
      source_oar_path text,

      binding_status text not null check (
        binding_status in ('active', 'held', 'revoked', 'rejected')
      ) default 'active',

      operator_ref text not null,

      audit_id uuid references public.c3_key_system_function_audit(id) on delete set null,

      support_safe boolean not null default true check (support_safe = true),

      metadata jsonb not null default '{}'::jsonb,

      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),

      unique (source_record_type, source_record_id, source_oar_id)
    );

## REQUIRED BINDING RULE

A valid binding requires:

- source_record_type
- source_record_id
- source_oar_id
- operator_ref
- binding_status = active
- support_safe = true

Optional but preferred:

- source_oar_path
- audit_id

## SOURCE RECORD TYPES

Allowed bound source types:

- SRC
- SRC1
- SRC2

Not allowed in this table:

- future_SRC3

Reason:

SRC3 is DAO / web3 specific and remains unseated.

`future_SRC3` must continue to hold inside `assign_temp_c3_key`.

## PROHIBITED STORAGE

Binding table must not store:

- temp_key
- contact_email_hash
- contact_email_encrypted
- provider secrets
- service-role secrets
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private payload

## FUNCTION HARDENING REQUIREMENT

After hardening, `public.assign_temp_c3_key(...)` should require:

- active source / OAR binding exists

for source types:

- SRC
- SRC1
- SRC2

If no active binding exists:

- result_status = held or rejected
- no assignment
- audit row created if possible
- metadata.source_oar_binding_validation = explicit_binding_required

`future_SRC3` remains held.

## ACCESS POSTURE

If a binding table or helper RPC is seated:

- RLS enabled
- zero public policies
- no anon access
- no authenticated broad access
- service_role / admin only
- no frontend direct read / write

## SUPPORT-SAFE OUTPUT

Any helper or updated function output may include:

- binding_id
- source_record_type
- source_record_id
- source_oar_id
- binding_status
- has_active_binding
- audit_id
- created_at

It must not expose private authority or raw metadata.

## NOT AUTHORIZED

This OAR2 does not authorize:

- new temporary c3 Key issuance
- permission grant
- permission activation
- permission status change
- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- Role NFT minting
- DAO voting activation
- distribution activation
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create SQL seating artifact if DB hardening is chosen
- create migration artifact if repo migration pattern is present
- create source / OAR binding table if chosen
- enable RLS if table seated
- keep zero public policies
- update `assign_temp_c3_key` to require explicit binding if implementation is chosen
- validate held behavior where binding is missing
- validate future_SRC3 remains held
- validate no assignment occurred
- validate no permission grant or activation occurred
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- exceed this OAR2 scope
- issue temp c3 Key
- grant permission
- activate permission
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate distributions
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. source / OAR binding hardening documented or seated
2. exact files created / modified
3. whether DB mutation occurred
4. source record types bounded to SRC / SRC1 / SRC2
5. future_SRC3 remains held
6. binding fields required
7. prohibited fields excluded
8. RLS enabled if table seated
9. no public / anon policy opened
10. `assign_temp_c3_key` hardening applied or explicitly held
11. missing-binding behavior validated if implementation updated
12. no temp c3 Key issued
13. no permission granted
14. no permission activated
15. no runtime / public API opened
16. no wallet / NFT / payment action
17. no DAO / distribution activation
18. no recognition / conversion standing created
19. folder reconciliation not performed
20. process rule not created
21. file staged in measures_interoperability intentionally
22. final folder reconciliation remains pending
23. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_assign_temporary_system_function_source_binding_hardening_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when source-record / OAR binding is explicitly documented or seated for SRC / SRC1 / SRC2 so `assign_temp_c3_key` can move beyond presence-only validation without opening runtime, granting permissions, issuing keys, or creating wallet / NFT / DAO / payment / recognition / conversion standing.

## CLOSE

Implementation is seated.

Source binding hardens now.

Real assignment waits.

Permissions wait.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
