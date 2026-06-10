---
document_type: oar2
authority_level: working
document_scope: c3_field
title: OAR2 — Audit and Banish ANT Residue from c3 Field Registered-System Schema Standing
status: confirmed
version: v1
operator: op044
system: c3_field
deployment_branch: initiative/c3-field-convergence-infra
source_oar1:
  - docs/oar/c3_field/oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md
  - docs/oar/c3_field/oar1_seat_c3_field_registered_system_law_schema_v1.meta.md
tags:
  - oar2
  - c3-field
  - ant-residue
  - deprecation-audit
  - registered-system
  - passage-law
  - canopy-law
  - non-ant-replacement
  - branch-guard
---

# OAR2 — Audit and Banish ANT Residue from c3 Field Registered-System Schema Standing v1

## OBSERVED

The c3 Field registered-system schema audit and registered-system schema seating have executed.

Current standing:

- `c3_registered_system` table exists.
- Binary standing is enforced: `registered` / `unregistered`.
- Measures Registry is seated as the first Registered System row.
- `runtime_admission_state = not_seated`.
- `field_origin` contains the c3 Field anchor row using `origin_type = system`.
- No runtime admission was seated.
- No optics/evidence/trace/correction contracts were seated.
- No Measures Registry runtime mutation occurred.

A correction has now been identified.

The prior audit referenced `ant_*` tables as partial support for passage, canopy, signal, envelope, and communication standing.

However, ANT surfaces are supposed to be banished/deprecated and must not be used as proof of valid c3 Field architecture.

Invalid proof surfaces include, but are not limited to:

- `ant_passage_state`
- `ant_envelope`
- `ant_inbox`
- `ant_attachment_map`
- `ant_signal_record`
- any `ant_*` view, table, type, component, or runtime reference

Therefore, any audit claim that uses ANT as current support must be reclassified as:

- deprecated residue
- legacy contamination
- invalid support surface
- blocker requiring non-ANT c3 Field replacement

This OAR audits and classifies ANT residue before runtime admission, optics, evidence, trace, correction, Inanna spine standing, or additional registered systems are seated.

## ALIGNED

### Authority order

Codex holds.  
Field structures.  
Measures registers.  
Chazz validates/routes.  
Cody executes from OAR2 only.  
`src` renders seated state only.

### Standing correction

ANT is not valid c3 Field support.

ANT may be inspected only as residue, historical reference, or deprecation target.

ANT may not be used as proof for:

- c3 Field passage law
- c3 Tree operation
- canopy communication/encounter law
- envelope/signal support
- runtime admission
- registered-system standing
- Measures of Inanna spine standing
- secure passage standing
- optics/evidence/trace/correction law

### Branch rule

All work must occur on the c3 Field deployment branch:

`initiative/c3-field-convergence-infra`

Do not use Measures Registry deployment branch.

### Scope boundary

This is an audit and deprecation-classification OAR.

It does not seat replacement schema unless explicitly limited to classification metadata or documentation.

It does not delete tables.

It does not mutate runtime.

It does not seat Inanna as a registered spine yet.

It does not seat runtime admission.

## OBJECTIVE

Audit all ANT residue and correct any architecture standing that improperly treats ANT as valid support.

This OAR must:

1. Find all ANT tables, views, migrations, schema references, runtime references, docs, and OAR references.
2. Classify each ANT reference as deprecated, legacy residue, orphaned, still-active, or blocker.
3. Identify any current system behavior still depending on ANT.
4. Correct c3 Field schema-audit standing so ANT is not counted as valid support.
5. Produce a non-ANT replacement requirement list for passage, canopy, envelope/signal, communication, and secure movement.
6. Preserve existing registered-system schema.
7. Preserve Measures Registry runtime.
8. Write OAR1 with evidence.

## ROUTED

### 1. Verify repository and branch

Before inspection, verify:

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

No audit may proceed from the wrong branch.

### 2. Inspect DB schema for ANT objects

Search database schema, migrations, SQL files, seed files, generated types, and views for:

- `ant_`
- `ANT`
- `antechamber` only where used as ANT table prefix or deprecated subsystem
- `ant_passage_state`
- `ant_envelope`
- `ant_inbox`
- `ant_attachment_map`
- `ant_signal_record`

Return table:

| object_name | object_type | location | current_use | classification | action_required |
|---|---|---|---|---|---|

Classifications allowed:

- `deprecated_residue`
- `legacy_reference`
- `orphaned`
- `still_active_blocker`
- `safe_historical_reference`
- `requires_replacement`

### 3. Inspect runtime/source references

Search source code for ANT dependencies.

Include:

- components
- hooks
- services
- API routes
- SQL callers
- generated types
- runtime manifests
- validation scripts
- OAR tooling
- build/deploy scripts

Return:

| reference | file | usage | runtime_path | classification | blocker |
|---|---|---|---|---|---|

If any runtime path still depends on ANT, report as:

`STILL_ACTIVE_BLOCKER`

Do not remove code in this OAR unless explicitly safe and non-runtime-breaking.

### 4. Inspect documentation and OAR references

Search docs/OARs for ANT being used as valid support.

Focus on recent c3 Field audit language that treated ANT as partial support for:

- passage
- canopy
- envelope
- signal
- communication
- encounter movement

Return:

| doc_path | ANT reference | used_as_support | corrected_standing | action_required |
|---|---|---|---|---|

Corrected standing must be one of:

- `invalid_support_surface`
- `deprecated_reference_only`
- `historical_context_only`
- `requires_non_ant_replacement`

### 5. Correct audit interpretation

Produce a corrected standing table for the prior c3 Field audit.

At minimum correct these rows:

#### Canopy / communications and encounters

Previous standing:

- Partial support via `ant_envelope`, `ant_inbox`, `ant_attachment_map`, `ant_signal_record`

Corrected standing:

- Unresolved / blocker until non-ANT c3 Field support is verified or seated.

#### Passage law

Previous standing:

- Partial support via `ant_passage_state`

Corrected standing:

- Unresolved / blocker until non-ANT passage law is seated.

#### Envelope / signal support

Previous standing:

- Partial support via ANT surfaces

Corrected standing:

- Do not rely on ANT; requires valid c3 Field replacement.

Return table:

| architecture requirement | prior audit standing | corrected standing | replacement needed |
|---|---|---|---|

### 6. Identify non-ANT replacement requirements

Define what must replace ANT-derived support.

Required replacement families:

- c3 Field passage law
- same-family passage law
- secure passage law
- canopy communication/encounter law
- signal movement law
- envelope/carrying structure, if still required
- return-state law
- runtime admission dependency law
- trace/evidence law

Return:

| replaced ANT function | required c3 Field replacement | priority | future OAR |
|---|---|---|---|

### 7. Preserve registered-system schema

Confirm no change to:

- `c3_registered_system`
- `v_c3_registered_system_v1`
- Measures Registry registered-system row
- c3 Field anchor row in `field_origin`

Return validation:

    select system_key, system_name, standing, implementation_pattern, system_scope, metadata->>'runtime_admission_state' as runtime_admission_state
    from c3_registered_system
    order by created_at;

Expected:

- `measures_registry`
- `standing = registered`
- `runtime_admission_state = not_seated`

### 8. No runtime or DB mutation unless classification-only

This OAR is audit-first.

Executor may not:

- drop ANT tables
- rename ANT tables
- migrate runtime away from ANT
- create replacement passage tables
- create runtime admission
- create optics/evidence/trace/correction contracts
- seat Measures of Inanna registered spine standing
- mutate Measures Registry runtime
- mutate pricing/Stripe/SEAT/c3 Key/wallet

If a small documentation correction is needed, executor must report before mutation unless it is writing OAR1.

### 9. Produce next OAR sequence

Return a corrected next OAR sequence.

Expected shape:

1. OAR2 — Banish ANT Runtime/Schema Residue or Mark Legacy-Held v1
2. OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1
3. OAR2 — Seat Measures of Inanna Registered Spine Standing v1
4. OAR2 — Seat c3 Field Runtime Admission View v1
5. OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1
6. OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1

Executor may revise sequence based on findings.

### 10. Write OAR1

Expected path:

`docs/oar/c3_field/oar1_audit_and_banish_ant_residue_from_c3_field_registered_system_schema_standing_v1.meta.md`

OAR1 must include:

- branch verification
- ANT object inventory
- runtime reference inventory
- docs/OAR reference inventory
- corrected audit standing
- non-ANT replacement requirement list
- blockers
- validation that registered-system schema remains intact
- confirmation that no runtime mutation occurred
- confirmation that no Measures Registry mutation occurred
- confirmation that no pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation occurred

## EXECUTOR MAY

- inspect schema and migrations
- inspect source code
- inspect docs and OARs
- classify ANT residue
- return blocker tables
- recommend replacement OARs
- validate registered-system schema standing
- write OAR1

## EXECUTOR MAY NOT

- use Measures Registry deployment branch
- drop ANT tables
- mutate runtime
- mutate Measures Registry
- create replacement schemas
- seat runtime admission
- seat Inanna registered spine
- seat optics/evidence/trace/correction contracts
- change pricing
- change Stripe
- activate SEAT
- activate c3 Key
- activate wallet
- connect external systems
- treat ANT as valid current support
- use ANT as proof of c3 Field architecture standing
- skip OAR1

## VALIDATION

This OAR resolves successfully when:

1. c3 Field branch verified.
2. ANT DB/schema objects inventoried.
3. ANT runtime/source references inventoried.
4. ANT doc/OAR references inventoried.
5. Each ANT reference classified.
6. Any still-active ANT dependency identified as blocker.
7. Prior c3 Field audit support claims corrected.
8. Passage support no longer relies on ANT.
9. Canopy support no longer relies on ANT.
10. Envelope/signal support no longer relies on ANT.
11. Non-ANT replacement requirements returned.
12. Registered-system schema validated intact.
13. Measures Registry registered-system row preserved.
14. No runtime mutation performed.
15. No Measures Registry mutation performed.
16. No schema replacement mutation performed.
17. No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed.
18. Correct next OAR sequence returned.
19. OAR1 written.

## EXPECTED OAR1

`docs/oar/c3_field/oar1_audit_and_banish_ant_residue_from_c3_field_registered_system_schema_standing_v1.meta.md`

## CLOSE

ANT may not be used as valid c3 Field support.

ANT is residue until proven otherwise.

The c3 Field registered-system schema remains valid, but passage, canopy, envelope, and signal support must be re-audited through non-ANT standing.

Do not build runtime admission on banished tables.
