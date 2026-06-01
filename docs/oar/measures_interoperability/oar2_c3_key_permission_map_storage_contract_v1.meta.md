---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key Permission Map Storage Contract v1
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
  - permission-map
  - storage-contract
  - access-boundary
  - c3-map
  - branch-access
  - role-nft
  - dao-voting-held
  - support-safe
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key Permission Map and Access Boundary v1
  - OAR1 — c3 Key Assign Temporary System Function Contract v1
  - OAR1 — c3 Key System Function Audit Surface v1
  - OAR1 — c3 Key System Function Authority Contract v1
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Permission Map Storage Contract v1

## OBSERVED

The c3 Key permission map and access boundary contract is seated.

Current standing:

- c3 Key = identity / continuity standing
- Permission map = access authority
- c3 MAP = Measures commerce circuit access layer
- Role NFT = future role-bearing credential
- Branch access = scoped permission record
- Audit = required for permission change

The prior OAR1 confirms:

- no permission table was created
- no permission was granted
- no c3 Key or temporary c3 Key record was mutated
- no runtime / public API was opened
- no DAO voting / distribution was activated
- no wallet / NFT / payment / recognition / conversion occurred

Current gap:

The permission map is defined.

The permission storage contract is not yet defined.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

This OAR2 defines the storage contract for future c3 Key permission records.

This is storage design only.

It does not grant permission.

It does not activate runtime.

It does not activate DAO voting, distributions, commons access, branches, role NFTs, wallet binding, recognition, or conversion.

## CORE RULE

Permission records store access standing.

Permission records do not create access unless active, source-bound, OAR-bound, unexpired, and audit-traced.

No permission grant in this OAR.

Codex holds.

## ROUTED

Executor may document or prepare:

1. permission storage table contract
2. bounded permission classes
3. bounded permission statuses
4. source record relation fields
5. branch scope fields
6. role NFT compatibility fields
7. key form fields
8. prohibited storage boundary
9. audit linkage requirement
10. validation requirements
11. OAR1 closeout

Executor may not:

- create permissions
- grant permissions
- activate permissions
- wire runtime
- open public read / write
- activate DAO voting
- activate distributions
- mint Role NFT
- bind wallet
- create recognition
- create conversion
- move folders
- create process rule

## FIELD CONTRACT

Preferred table:

    create table if not exists public.c3_key_permission_map (
      id uuid primary key default gen_random_uuid(),

      temp_key_id uuid references public.c3_key_temp(id) on delete set null,

      public_ref text,

      key_form text not null check (
        key_form in (
          'temporary',
          'wallet_held'
        )
      ),

      origin_type text not null check (
        origin_type in (
          'named_individual',
          'institution_in_service'
        )
      ),

      source_record_type text not null check (
        source_record_type in (
          'SRC',
          'SRC1',
          'SRC2',
          'future_SRC3'
        )
      ),

      source_record_id text not null,
      source_oar_id text not null,
      source_oar_path text,

      permission_class text not null check (
        permission_class in (
          'measures_registry_participation',
          'c3_map_access',
          'c3_map_c1_access',
          'c3_map_c2_access',
          'c3_map_c3_access',
          'assessment_access',
          'conversion_intake_access',
          'agreement_acknowledgment_access',
          'communication_trace_support',
          'course_access',
          'cohort_access',
          'operator_support_read',
          'event_access',
          'commons_access',
          'branch_access',
          'role_based_access',
          'contribution_submission',
          'distribution_eligibility',
          'dao_voting',
          'wallet_migration'
        )
      ),

      permission_status text not null check (
        permission_status in (
          'pending',
          'active',
          'held',
          'expired',
          'revoked',
          'rejected',
          'migrated'
        )
      ),

      branch_key text,
      branch_scope text,

      role_nft_contract text,
      role_nft_token_id text,
      role_key text,

      audit_id uuid references public.c3_key_system_function_audit(id) on delete set null,

      expires_at timestamptz,
      revoked_at timestamptz,

      support_safe boolean not null default true check (support_safe = true),

      metadata jsonb not null default '{}'::jsonb,

      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

## STORAGE RULES

Required:

- `public_ref` or `temp_key_id`
- `key_form`
- `origin_type`
- `source_record_type`
- `source_record_id`
- `source_oar_id`
- `permission_class`
- `permission_status`
- `support_safe = true`

Required when `permission_class = branch_access`:

- `branch_key`
- `branch_scope`

Required when role NFT standing is active or referenced:

- `role_key`
- `role_nft_contract` where applicable
- `role_nft_token_id` where applicable

Required when `permission_status = active`:

- `audit_id`
- `source_oar_id`
- `source_record_id`

## ACCESS RULE

Access may only resolve when:

- `permission_status = active`
- permission has not expired
- source standing remains valid
- `audit_id` is present
- prohibited boundary is not violated

A valid c3 Key without an active permission record grants no Measures access expansion.

DAO voting remains future-baseline standing but execution is held until c3 DAO / SRC3 route is seated.

## PROHIBITED STORAGE BOUNDARY

This table must not store:

- `temp_key`
- contact_email_hash
- contact_email_encrypted
- provider API key
- service-role key
- raw email body
- raw agreement metadata
- private payment data
- wallet private key
- seed phrase
- unbounded private payloads

## ACCESS POSTURE

If seated:

- RLS enabled
- zero public policies
- no anon access
- no authenticated broad access
- service-role / admin only unless separately routed
- no frontend direct read / write

## AUDIT REQUIREMENT

Every permission row with `permission_status = active`, `revoked`, `rejected`, `expired`, `held`, or `migrated` must be traceable through audit standing.

Minimum:

- `audit_id` references `public.c3_key_system_function_audit(id)`
- `source_oar_id` present
- `source_record_id` present
- `support_safe = true`

If audit cannot be attached:

- `permission_status` must remain `pending` or `held`
- no access expansion

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 remains staged in:

`docs/oar/measures_interoperability`

System standing remains:

`system: c3_field_systems`

Final folder reconciliation remains pending and must be separately routed after current workstream closeout.

## NOT AUTHORIZED

This OAR2 does not authorize:

- permission grant
- permission activation
- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- DAO voting activation
- distribution activation
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- Role NFT minting
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this storage-contract document in the measures_interoperability staging folder
- create SQL seating artifact if implementation is chosen
- create migration artifact if repo migration pattern is present
- seat the permission map table if implementation is chosen
- enable RLS if table seated
- keep zero public policies
- preserve c3 Field systems as parent authority
- preserve Measures Registry implementation standing
- preserve no-permission-grant boundary
- recommend next route
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- grant permission
- activate permission
- alter temp c3 Key records
- move existing tables
- rename existing Measures Registry implementation surfaces
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

1. permission storage contract documented or seated
2. exact files created / modified
3. whether DB mutation occurred
4. bounded permission classes documented / enforced
5. bounded permission statuses documented / enforced
6. source record fields required
7. source OAR field required
8. branch fields documented
9. role NFT fields documented
10. audit linkage documented
11. support_safe required true if table seated
12. prohibited fields excluded
13. RLS enabled if table seated
14. no public / anon policy opened
15. no permission granted
16. no permission activated
17. no runtime / public API opened
18. no DAO / distribution activation
19. no wallet / NFT / payment action
20. no recognition / conversion standing created
21. folder reconciliation not performed
22. process rule not created
23. file staged in measures_interoperability intentionally
24. final folder reconciliation remains pending
25. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_permission_map_storage_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the c3 Key permission map storage contract is documented or seated as a support-safe, audit-linked access-standing surface, without granting permissions, activating runtime, opening public access, activating DAO / distributions, binding wallet, minting NFTs, or creating recognition / conversion standing.

## CLOSE

Permission map contract is seated.

Storage contract forms.

No permission granted.

Runtime waits.

Wallet waits.

NFT waits.

DAO activation waits.

Distribution waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.
