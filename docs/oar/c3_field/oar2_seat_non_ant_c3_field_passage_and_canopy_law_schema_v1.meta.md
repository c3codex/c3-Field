---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_banish_ant_runtime_schema_residue_v1.meta.md
tags:
  - oar2
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

# OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1

## OBSERVED

OAR1 — Banish ANT Runtime/Schema Residue v1 has executed.

Standing after execution:

- `v_envelope_access_by_c3key_v1` dropped.
- `measures_registry_envelope_id_fkey` dropped.
- `v_measures_registry_state_v1` rewritten with no ANT reference.
- `v_field_relation_graph_v1` rewritten with no ANT reference.
- `refresh_ant_passage_state(text)` dropped.
- `prevent_ant_oar_log_mutation()` dropped.
- `ant_signal_record` dropped.
- `ant_inbox` dropped.
- Registered-system schema remains intact.
- Measures Registry remains registered.
- `runtime_admission_state = not_seated`.
- No runtime mutation occurred.
- No Measures Registry runtime mutation occurred.
- No replacement schema was created.
- No runtime admission was seated.
- No Measures of Inanna registered spine standing was seated.

Remaining ANT objects are legacy-held:

- `ant_envelope`
- `ant_passage_state`
- `ant_attachment_map`
- `ensure_ant_passage_state()`
- related triggers

They are confirmed 0-row and have no external live view/FK dependencies, but were intentionally held until non-ANT passage/canopy law is seated.

This OAR seats the non-ANT c3 Field passage and canopy law schema required to replace the false ANT support layer, then removes remaining legacy-held ANT objects if safe.

## ALIGNED

### Authority order

Codex holds.
Field structures.
Measures registers.
Chazz validates/routes.
Cody executes from OAR2 only.
`src` renders seated state only.

### Standing correction

ANT is banished residue.

ANT must not be used as support for:

- passage law
- canopy law
- envelope/carrier law
- signal movement
- attachment movement
- runtime admission
- Measures of Inanna spine standing
- registered-system standing

### c3 Field law

The c3 Field requires non-ANT schema for:

- passage state
- same-family passage
- cross-family passage
- secure passage
- canopy / communication / encounter movement
- carrier structure
- signal movement
- attachment relation
- return-state tracking
- trace/evidence readiness

This OAR seats schema law only.

It does not admit runtime.

It does not activate public behavior.

It does not register Measures of Inanna yet.

## OBJECTIVE

Seat non-ANT c3 Field passage and canopy law schema and remove the remaining legacy-held ANT objects.

This OAR must:

1. Verify c3 Field branch.
2. Confirm registered-system schema remains intact.
3. Create non-ANT c3 Field passage law table.
4. Create non-ANT c3 Field canopy/carrier law table.
5. Create non-ANT c3 Field signal law table.
6. Create non-ANT c3 Field attachment law table.
7. Create safe read views for c3 passage/canopy standing if appropriate.
8. Preserve runtime admission boundary.
9. Preserve Measures Registry runtime boundary.
10. Drop remaining legacy-held ANT tables/functions/triggers only after non-ANT schema exists and no dependency remains.
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

### 2. Confirm current standing before mutation

Validate:

    select system_key, system_name, standing, implementation_pattern, system_scope, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    order by created_at;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

Confirm remaining ANT objects before mutation:

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('ant_envelope', 'ant_passage_state', 'ant_attachment_map');

    select proname
    from pg_proc
    where proname = 'ensure_ant_passage_state';

Expected:

- remaining ANT objects exist before cleanup
- row counts are 0
- no external live FK/view dependencies

If any remaining ANT table has rows, stop and report:

`ANT_DATA_PRESENT_BLOCKER`

### 3. Create `c3_passage_law`

Create table:

`public.c3_passage_law`

Purpose:

Represents c3 Field passage standing without ANT.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `passage_key text not null unique`
- `passage_name text not null`
- `passage_type text not null`
- `source_system_key text`
- `target_system_key text`
- `source_chamber_key text`
- `target_chamber_key text`
- `source_registry_key text`
- `target_registry_key text`
- `passage_state text not null default 'held'`
- `release_state text not null default 'held'`
- `access_state text not null default 'held'`
- `requires_runtime_admission boolean not null default true`
- `requires_optics_contract boolean not null default true`
- `requires_evidence_contract boolean not null default true`
- `requires_trace_contract boolean not null default true`
- `requires_correction_contract boolean not null default true`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `passage_type` constraint:

- `same_family`
- `cross_family`
- `secure_external`
- `return_state`
- `internal_transition`

Required `passage_state` constraint:

- `held`
- `draft`
- `ready`
- `released`
- `blocked`
- `deprecated`

This table must not activate runtime admission.

### 4. Create `c3_canopy_law`

Create table:

`public.c3_canopy_law`

Purpose:

Represents communication, encounter, and carrier standing without ANT.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `canopy_key text not null unique`
- `canopy_name text not null`
- `canopy_type text not null`
- `system_key text`
- `carrier_state text not null default 'held'`
- `communication_state text not null default 'held'`
- `encounter_state text not null default 'held'`
- `visibility_state text not null default 'private_held'`
- `runtime_admission_state text not null default 'not_seated'`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `canopy_type` constraint:

- `carrier`
- `communication`
- `encounter`
- `signal_surface`
- `public_surface`
- `private_surface`

Required `runtime_admission_state` constraint:

- `not_seated`
- `held`
- `ready`
- `admitted`
- `blocked`

Default must be `not_seated`.

### 5. Create `c3_signal_law`

Create table:

`public.c3_signal_law`

Purpose:

Represents non-ANT signal movement law.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `signal_key text not null unique`
- `signal_type text not null`
- `source_system_key text`
- `target_system_key text`
- `source_passage_key text`
- `target_passage_key text`
- `signal_state text not null default 'held'`
- `trace_required boolean not null default true`
- `evidence_required boolean not null default true`
- `redaction_required boolean not null default true`
- `metadata jsonb not null default '{}'::jsonb`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `signal_state` constraint:

- `held`
- `draft`
- `ready`
- `released`
- `blocked`
- `deprecated`

### 6. Create `c3_attachment_law`

Create table:

`public.c3_attachment_law`

Purpose:

Represents non-ANT attachment/reference movement law.

Required columns:

- `id uuid primary key default gen_random_uuid()`
- `attachment_key text not null unique`
- `attachment_type text not null`
- `source_system_key text`
- `target_system_key text`
- `source_signal_key text`
- `attachment_state text not null default 'held'`
- `storage_boundary text not null default 'codex_reference_only'`
- `sensitive_data_allowed boolean not null default false`
- `redaction_required boolean not null default true`
- `metadata jsonb not null default '{}'::jsonb`
- `source_oar2_path text not null`
- `source_oar1_path text`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Required `attachment_state` constraint:

- `held`
- `draft`
- `ready`
- `released`
- `blocked`
- `deprecated`

Required `storage_boundary` constraint:

- `codex_reference_only`
- `public_media_reference`
- `private_media_reference`
- `external_reference`
- `redacted_reference`

No raw sensitive payload should be stored in this table.

### 7. Add update triggers using project pattern

Use existing project trigger function if present:

`public.c3_oar_set_updated_at()`

Apply to:

- `c3_passage_law`
- `c3_canopy_law`
- `c3_signal_law`
- `c3_attachment_law`

Do not introduce inconsistent trigger framework.

If trigger function is unavailable, report blocker and do not invent unrelated pattern.

### 8. Enable RLS and read policy if consistent

If c3 Field schema patterns use RLS public read for registry standing tables, enable RLS and add public read policy for these law tables.

Policy may allow `SELECT` to `anon, authenticated`.

Do not add write policies.

Write access remains service-role / migration controlled.

### 9. Create read views if safe

Create views:

- `v_c3_passage_law_v1`
- `v_c3_canopy_law_v1`

Views should expose standing only.

They must not imply runtime admission.

Minimum `v_c3_passage_law_v1` columns:

- `passage_key`
- `passage_name`
- `passage_type`
- `passage_state`
- `release_state`
- `access_state`
- `requires_runtime_admission`
- `is_active`
- `created_at`
- `updated_at`

Minimum `v_c3_canopy_law_v1` columns:

- `canopy_key`
- `canopy_name`
- `canopy_type`
- `carrier_state`
- `communication_state`
- `encounter_state`
- `visibility_state`
- `runtime_admission_state`
- `is_active`
- `created_at`
- `updated_at`

### 10. Seat minimal held rows

Seat minimal held rows only if safe.

Required rows:

#### `c3_passage_law`

- `passage_key`: `c3_field_passage_law_base`
- `passage_name`: `c3 Field Passage Law Base`
- `passage_type`: `internal_transition`
- `passage_state`: `held`
- `release_state`: `held`
- `access_state`: `held`
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md`
- metadata:
  - `ant_replacement`: true
  - `runtime_admission_state`: `not_seated`
  - `standing_note`: `Base passage law seated; runtime admission not seated.`

#### `c3_canopy_law`

- `canopy_key`: `c3_field_canopy_law_base`
- `canopy_name`: `c3 Field Canopy Law Base`
- `canopy_type`: `carrier`
- `carrier_state`: `held`
- `communication_state`: `held`
- `encounter_state`: `held`
- `visibility_state`: `private_held`
- `runtime_admission_state`: `not_seated`
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md`
- metadata:
  - `ant_replacement`: true
  - `standing_note`: `Base canopy law seated; no runtime admission.`

Do not create Measures Registry-specific passage rows in this OAR unless needed to preserve existing schema references.

Do not create public-facing rows.

### 11. Drop remaining legacy-held ANT objects if safe

After non-ANT schema is created and validated, drop remaining legacy-held ANT objects if:

- all row counts are 0
- dependency count is safe
- no live views/FKs depend on them
- no runtime source references exist

Objects:

- `ant_envelope`
- `ant_passage_state`
- `ant_attachment_map`
- `ensure_ant_passage_state()`
- related triggers

Expected:

- triggers drop automatically with tables
- function `ensure_ant_passage_state()` may be dropped after trigger/table dependency removed

Return validation:

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in ('ant_envelope', 'ant_passage_state', 'ant_attachment_map');

Expected: 0 rows, unless blocker reported.

    select proname
    from pg_proc
    where proname = 'ensure_ant_passage_state';

Expected: 0 rows, unless blocker reported.

### 12. Validate no ANT references remain in live views

Return:

    select viewname
    from pg_views
    where schemaname = 'public'
      and definition ilike '%ant_%';

Expected:

- 0 rows, or
- historical/deprecated views explicitly listed as blocker

### 13. Validate non-ANT schema standing

Return:

    select passage_key, passage_type, passage_state, release_state, access_state, requires_runtime_admission
    from c3_passage_law
    order by created_at;

    select canopy_key, canopy_type, carrier_state, communication_state, encounter_state, runtime_admission_state
    from c3_canopy_law
    order by created_at;

Expected:

- base held rows exist
- no runtime admission granted

### 14. Preserve registered-system schema

Validate:

    select system_key, system_name, standing, implementation_pattern, system_scope, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    order by created_at;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

### 15. Preserve boundaries

Do not create:

- runtime admission table
- runtime admission view
- optics contract table
- evidence contract table
- trace contract table
- correction/revocation contract table
- AI action boundary table
- role contract table
- external system contract table
- secure passage contract table

Do not seat:

- Measures of Inanna registered spine standing
- c3 Key standing
- SEAT release standing
- payment standing
- certification standing
- public route activation

Do not mutate:

- Measures Registry runtime
- pricing
- Stripe
- wallet
- c3 Key
- external integrations

### 16. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md`

OAR1 must include:

- branch verification
- schema objects created
- SQL applied
- validation output
- confirmation that base passage/canopy rows are held
- confirmation that runtime admission remains not seated
- remaining ANT drop evidence or blocker
- registered-system validation
- confirmation that no runtime mutation occurred
- confirmation that no Measures Registry runtime mutation occurred
- confirmation that no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect schema dependencies
- create `c3_passage_law`
- create `c3_canopy_law`
- create `c3_signal_law`
- create `c3_attachment_law`
- create read views
- insert base held rows
- drop remaining legacy-held ANT objects if safe
- validate registered-system schema
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- create runtime admission
- seat Measures of Inanna registered spine
- create optics/evidence/trace/correction contracts
- create AI action boundary table
- create role contract table
- create external/secure passage contracts
- activate any public route
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- store raw sensitive payloads
- treat ANT as valid current support
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. Registered-system schema validated before mutation.
3. Remaining ANT objects confirmed 0-row before drop.
4. `c3_passage_law` created.
5. `c3_canopy_law` created.
6. `c3_signal_law` created.
7. `c3_attachment_law` created.
8. Standing constraints created.
9. Update triggers applied or blocker reported.
10. RLS/read policies applied if consistent.
11. `v_c3_passage_law_v1` created or blocker reported.
12. `v_c3_canopy_law_v1` created or blocker reported.
13. Base held passage row seated.
14. Base held canopy row seated.
15. No runtime admission granted.
16. Remaining ANT objects dropped or blocker reported.
17. Live views no longer reference ANT.
18. Measures Registry registered-system row preserved.
19. No runtime mutation performed.
20. No Measures Registry runtime mutation performed.
21. No Inanna registered spine standing seated.
22. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
23. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md`

## CLOSE

Seat non-ANT c3 Field passage and canopy law before runtime admission.

Remove remaining ANT only after replacement law exists and dependency checks pass.

Do not seat Measures of Inanna spine standing until the non-ANT passage/canopy base is in place.

Do not admit runtime from this OAR.
