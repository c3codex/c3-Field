---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Seat Measures of Inanna Registered Spine Standing
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1: docs/oar/c3_field/oar1_seat_non_ant_c3_field_passage_and_canopy_law_schema_v1.meta.md
tags:
  - oar2
  - c3-field
  - measures-of-inanna
  - registered-spine
  - registered-system
  - passage-law
  - non-ant
  - branch-guard
---

# OAR2 — Seat Measures of Inanna Registered Spine Standing v1

## OBSERVED

OAR1 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 has executed.

Current standing:

- `c3_passage_law` exists.
- `c3_canopy_law` exists.
- `c3_signal_law` exists.
- `c3_attachment_law` exists.
- `v_c3_passage_law_v1` exists.
- `v_c3_canopy_law_v1` exists.
- Base c3 Field passage law row is seated and held.
- Base c3 Field canopy law row is seated and held.
- ANT is fully banished from DB schema.
- No `ant_*` table, trigger, or function remains.
- Measures Registry remains registered in `c3_registered_system`.
- Measures Registry remains `runtime_admission_state = not_seated`.
- No runtime admission was seated.
- No Measures Registry runtime mutation occurred.
- No Measures of Inanna registered spine standing was seated yet.

The next required architectural correction is to formally register Measures of Inanna as the foundational spine standing that Measures Registry structurally inherits from.

Measures Registry is the first registered operational system.

Measures of Inanna is not merely another branch.

Measures of Inanna is the registered spine / immutable passage pattern through which inherited incoherency is gated, bodies are restored to right relation, and Codexstone integrity governance is preserved without accepting collapse as inevitable.

This OAR seats Measures of Inanna as registered spine standing only.

It does not grant runtime admission.

It does not mutate public runtime.

It does not bind Measures Registry runtime admission.

## ALIGNED

### Authority order

Codex holds.
Field structures.
Measures registers.
Chazz validates/routes.
Cody executes from OAR2 only.
`src` renders seated state only.

### Standing correction

A system is either registered in the c3 Field or it is not.

Correct standing values remain:

- `registered`
- `unregistered`

Measures of Inanna must not be seated as:

- mapped
- direct
- federated
- external
- private
- runtime-admitted
- payment-active
- public-route-active

Those are not standing values.

### Spine distinction

Measures of Inanna is seated as:

- registered spine
- immutable passage pattern
- c3 Field inherited coherence pattern
- non-ANT passage foundation
- architecture-level support for Measures Registry

Measures Registry remains:

- registered operational system
- pressure case
- not runtime-admitted through c3 Field yet

### Boundary

This OAR registers spine standing.

It may create or update non-runtime DB rows only.

It may not:

- create runtime admission
- activate public routes
- mutate Measures Registry runtime
- create optics/evidence/trace/correction contracts
- activate payment
- activate SEAT
- activate c3 Key
- connect external systems

## OBJECTIVE

Seat Measures of Inanna as a registered c3 Field spine system and bind its spine role to non-ANT c3 passage law.

This OAR must:

1. Verify c3 Field branch.
2. Confirm non-ANT passage/canopy law exists.
3. Confirm ANT is banished.
4. Confirm Measures Registry remains registered and not runtime-admitted.
5. Insert or upsert `measures_of_inanna` into `c3_registered_system`.
6. Classify Measures of Inanna as registered spine / immutable passage pattern in metadata.
7. Seat or upsert a held non-ANT passage law row for Inanna spine standing.
8. Update Measures Registry metadata to reference Inanna spine, if safe.
9. Preserve runtime admission boundary.
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

Validate non-ANT passage/canopy law:

    select passage_key, passage_type, passage_state, release_state, access_state, requires_runtime_admission
    from c3_passage_law
    order by created_at;

    select canopy_key, canopy_type, carrier_state, communication_state, encounter_state, runtime_admission_state
    from c3_canopy_law
    order by created_at;

Expected:

- `c3_field_passage_law_base`
- `passage_state = held`
- `requires_runtime_admission = true`
- `c3_field_canopy_law_base`
- `runtime_admission_state = not_seated`

Validate registered-system standing:

    select system_key, system_name, standing, implementation_pattern, system_scope, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    order by created_at;

Expected at minimum:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

Validate ANT banishment:

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name like 'ant_%';

    select proname
    from pg_proc
    where proname like '%ant_%';

Expected:

- 0 active ANT tables
- 0 ANT functions

If ANT tables or functions remain, stop and report:

`ANT_RESIDUE_BLOCKER`

### 3. Insert or upsert Measures of Inanna registered-system row

Insert or upsert into:

`public.c3_registered_system`

Required row:

- `system_key`: `measures_of_inanna`
- `system_name`: `Measures of Inanna`
- `standing`: `registered`
- `registration_state`: `registered`
- `implementation_pattern`: `native`
- `system_scope`: `measures_of_inanna`
- `is_external`: `false`
- `is_private`: `false`
- `is_non_native`: `false`
- `registered_at`: `now()` if newly inserted
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_measures_of_inanna_registered_spine_standing_v1.meta.md`
- `source_oar1_path`: expected OAR1 path once written
- `is_active`: `true`

Required metadata:

- `registered_role`: `spine`
- `spine_role`: `immutable_passage_pattern`
- `pattern_role`: `inherited_incoherency_gate`
- `codexstone_role`: `integrity_governance`
- `supports_registered_systems`: true
- `supports_measures_registry`: true
- `not_branch_only`: true
- `runtime_admission_state`: `not_seated`
- `ant_dependency`: `banished`
- `non_ant_passage_law_required`: true
- `standing_note`: `Measures of Inanna is registered as c3 Field spine standing; runtime admission is not seated.`
- `distinction_note`: `The immutable pattern is c3 Field law; operational implementation is Registered System standing.`

Use upsert semantics.

Do not overwrite existing metadata destructively if a row already exists. Merge metadata safely.

### 4. Seat Inanna spine passage law row

Insert or upsert into:

`public.c3_passage_law`

Required row:

- `passage_key`: `measures_of_inanna_spine_passage_law`
- `passage_name`: `Measures of Inanna Spine Passage Law`
- `passage_type`: `internal_transition`
- `source_system_key`: `measures_of_inanna`
- `target_system_key`: `measures_registry`
- `passage_state`: `held`
- `release_state`: `held`
- `access_state`: `held`
- `requires_runtime_admission`: true
- `requires_optics_contract`: true
- `requires_evidence_contract`: true
- `requires_trace_contract`: true
- `requires_correction_contract`: true
- `source_oar2_path`: `docs/oar/c3_field/oar2_seat_measures_of_inanna_registered_spine_standing_v1.meta.md`
- `source_oar1_path`: expected OAR1 path once written
- `is_active`: true

Required metadata:

- `spine_system_key`: `measures_of_inanna`
- `supported_system_key`: `measures_registry`
- `ant_replacement`: true
- `runtime_admission_state`: `not_seated`
- `standing_note`: `Inanna spine passage law is seated as held; runtime admission is not granted.`
- `pattern_definition`: `Immutable passage pattern that permits inherited incoherency to be gated and restored to right relation.`
- `codexstone_note`: `Integrity governance preserved through non-ANT c3 Field passage law.`

This row must remain held.

It must not activate Measures Registry runtime admission.

### 5. Update Measures Registry metadata to reference Inanna spine

Update `c3_registered_system` row for `measures_registry` only if safe.

Add or merge metadata:

- `first_registered_operational_system`: true
- `depends_on_spine`: `measures_of_inanna`
- `spine_dependency_state`: `registered_held`
- `runtime_admission_state`: preserve existing `not_seated`
- `standing_note`: preserve or append that Measures Registry remains registered operational system; runtime admission not seated.

Do not remove:

- `first_registered_system` unless explicitly replacing with both:
  - `first_registered_system`: true
  - `first_registered_operational_system`: true

Do not imply Measures Registry has runtime admission.

### 6. Optional view validation

If `v_c3_registered_system_v1` exists, confirm it surfaces both systems:

    select system_key, system_name, standing, implementation_pattern, system_scope, runtime_admission_state
    from v_c3_registered_system_v1
    where system_key in ('measures_registry', 'measures_of_inanna')
    order by system_key;

Expected:

- `measures_of_inanna`
- `standing = registered`
- `runtime_admission_state = not_seated`
- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

### 7. Validate Inanna passage law standing

Return:

    select passage_key, passage_name, passage_type, source_system_key, target_system_key,
           passage_state, release_state, access_state, requires_runtime_admission
    from c3_passage_law
    where passage_key = 'measures_of_inanna_spine_passage_law';

Expected:

- `passage_state = held`
- `release_state = held`
- `access_state = held`
- `requires_runtime_admission = true`

### 8. Preserve boundaries

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
- payment standing
- SEAT release standing
- certification standing
- public access standing
- c3 Key standing

### 9. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_seat_measures_of_inanna_registered_spine_standing_v1.meta.md`

OAR1 must include:

- branch verification
- prerequisite validation
- confirmation ANT is banished
- registered-system row inserted/upserted
- Inanna spine metadata
- Inanna passage law row inserted/upserted
- Measures Registry metadata update, if performed
- validation query output
- confirmation runtime admission remains not seated
- confirmation no Measures Registry runtime mutation occurred
- confirmation no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred
- corrected next OAR sequence

## EXECUTOR MAY

- inspect current DB schema
- insert or upsert `measures_of_inanna` in `c3_registered_system`
- insert or upsert Inanna spine passage law row in `c3_passage_law`
- merge Measures Registry metadata to reference Inanna spine
- validate views
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- mutate Measures Registry runtime behavior
- create runtime admission
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
- reintroduce ANT
- treat Inanna as merely a normal branch
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. Non-ANT passage/canopy law prerequisites validated.
3. ANT banishment confirmed.
4. Measures Registry registered-system row preserved.
5. `measures_of_inanna` registered-system row inserted/upserted.
6. `measures_of_inanna` standing is `registered`.
7. `measures_of_inanna` metadata identifies spine / immutable passage pattern standing.
8. `runtime_admission_state = not_seated` for Measures of Inanna.
9. Inanna spine passage law row inserted/upserted.
10. Inanna spine passage law row remains held.
11. Measures Registry metadata references Inanna spine, if safe.
12. No runtime admission granted.
13. No Measures Registry runtime mutation performed.
14. No public route mutation performed.
15. No optics/evidence/trace/correction mutation performed.
16. No AI action boundary mutation performed.
17. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
18. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_seat_measures_of_inanna_registered_spine_standing_v1.meta.md`

## CLOSE

Measures of Inanna is registered as spine standing, not as a normal branch.

Measures Registry remains the first registered operational system.

Inanna spine passage law is held.

Runtime admission remains not seated.

No public runtime changes occur from this OAR.
