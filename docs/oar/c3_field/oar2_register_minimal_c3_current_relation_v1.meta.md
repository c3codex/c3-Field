---
document_type: oar2
title: Register Minimal c3 Current Governed Present-State Relation
status: confirmed_for_execution
version: v1
date: 2026-08-08
operator: op044
author: chazz
system: c3_field
initiative: c3_current
registrar: cline
execution_instance_id: register_minimal_c3_current_relation_cline_001
source_ledger_entry: c3_ledger_0005_c3_current_as_governed_present_state.meta.md
return_destination: G:\My Drive\CanCom\review
---

# OAR2 — Register Minimal c3 Current Governed Present-State Relation

## 1. Purpose

Register the minimum backend relation required for c3 Current to preserve which governed state presently
applies to an environment, with immutable lineage to the evidence, disposition, and predecessor state from
which that standing is derived.

This execution exists because c3 Current has been elevated from relational discovery to an implementation
dependency under `c3_ledger_0005`.

This is a minimal registration. It does not expand token utility or mutate the existing Base token contract.

## 2. Source Recognition

`Spark / Weave / Field / Form` is Source from the original Codexstone inscription.

It is not a new implementation vocabulary created for Current.

The emerging implementation pattern is recorded as:

```text
SOURCE
  Spark
  Weave × 3
  Field × 3
  Form × 3
```

The exact nine downstream cells remain provisional. This execution may use the candidate Current matrix only
as an implementation test. It must not register those nine cell labels as universal Codex principles.

## 3. Minimal Current Meaning

c3 Current is the persistent reference to the presently governing state of a governed environment.

Current is not the evidence artifact.
Current does not rewrite historical evidence.
Current does not create authority merely by token possession or existence.

The minimum relation must support the following implementation behavior:

1. **Bind** — associate a Current relation with a governed environment key.
2. **Attest** — associate hash-bound evidence references with a Current state.
3. **Resolve** — determine which Current state presently applies to the environment.
4. **Advance** — establish a successor Current state only after a governed disposition authorizes the change.

These four implementation behaviors are subordinate to Source and must not be registered as a replacement
four-part Source vocabulary.

## 4. Candidate Current Source Matrix — Test Only

```text
SPARK
  Current relation initiated for a governed environment.

WEAVE
  W1 environment / identity relation
  W2 evidence / lineage relation
  W3 predecessor / disposition relation

FIELD
  F1 environment standing
  F2 authority standing
  F3 progression standing

FORM
  M1 current-state record
  M2 successor-state lineage
  M3 resolver-facing current manifestation
```

W1-W3, F1-F3, and M1-M3 are placeholders for testing. Do not canonize them as permanent names if existing
registry structures provide more appropriate governed terminology.

## 5. Required Registration Shape

Use existing canonical registry/database structures where they can represent the relation without semantic
collision. Prefer a small extension of current authority rather than a parallel subsystem.

The resulting governed relation must be able to represent at minimum:

```yaml
current_state_key:
current_relation: c3_current
env_key:
standing:
effective_at:
evidence_refs:
source_disposition:
predecessor_current_state:
is_current:
```

Evidence references must support hash-bound identity and governed custody references without copying
sensitive evidence into the Current state record.

If existing schema can represent the same semantics under different canonical field names, use the existing
schema and document the mapping. Do not create duplicate concepts merely to match this illustrative shape.

## 6. First Environment

Measures of Inanna is the first intended environment for exercising this relation because existing MAP work
already distinguishes historical evidence from present governed standing.

Do not fabricate an `env_key` for Measures of Inanna.

If a canonical active `env_key` is not machine-resolvable, complete the Current relation registration and
return:

`held_missing_env_key_for_initial_current_binding`

for the environment-specific binding.

A held first binding does not invalidate the Current relation registration itself.

## 7. Evidence Compatibility

The relation must be capable of referencing, without rewriting, existing Inanna evidence including:

- Measure predecessor evidence;
- Audit 01 evidence;
- `map_environment_audit02_cody_001`;
- closed Audit 03 evidence;
- `measures_of_inanna_operations_map_v1.meta.md`;
- `measures_of_inanna_environmental_risk_runtime_operations_report_v2.meta.md`;
- later MAP / SEAT evidence packages.

Do not re-run, normalize, or rewrite any prior audit under this execution.

Do not mark held audit findings satisfied merely because they are referenced by Current.

## 8. Advance Rule

A Current state may not become successor/current merely because new evidence exists.

Advance requires a governed disposition reference.

The implementation must preserve predecessor lineage so that:

```text
Current N → governed evidence + disposition → Current N+1
```

leaves Current N historically traceable.

No destructive overwrite of prior Current states is permitted.

## 9. Resolver Boundary

Provide the smallest governed read path needed for c3Ops/FREE to resolve:

```text
env_key → current Current-state relation → standing + evidence references
```

FREE may consume this returned Current standing.

FREE must not determine, invent, or advance Current.

Do not create a Current-specific frontend state machine.

## 10. Token Boundary

The operator has identified an existing c3 Current (CCC) token on Base.

This execution does not authorize:

- contract deployment;
- contract upgrade;
- minting;
- burning;
- transfer changes;
- wallet activation;
- wallet gating;
- token distribution;
- supply changes;
- voting behavior;
- governance weight;
- fees;
- rewards;
- financialization;
- bridge operations;
- or any transaction on Base.

If the existing token contract address / chain identity is already present in a governed source and can be
verified without inference, the Current relation may record a non-operative reference to that canonical
identity.

If it is not already governed and machine-resolvable, return:

`held_missing_canonical_ccc_chain_identity`

Do not infer a contract address from repository text, wallet history, browser search, or token naming.

## 11. Token Geometry Provenance

The operator supplied the c3 Current token image on 2026-08-08. It visibly carries `C3 DAO` and
`CONNECT CONTRIBUTE CREATE` around a recursive geometric center.

The image is visual provenance only.

Do not infer contract behavior, tokenomics, voting, transferability, standing, supply, wallet policy, or chain
identity from the image.

## 12. Required Actions

### RA-001 — Bind Execution Source

Verify this exact OAR2 and execution instance before mutation.

### RA-002 — Inspect Existing Authority

Inspect only the minimum existing registry/database structures needed to determine whether Current can be
represented without creating a parallel state subsystem.

Relevant areas may include environment identity, registry standing, evidence/profile relations, progression,
and existing token references.

### RA-003 — Register Minimal Current Relation

Register the smallest canonical backend structure that supports Bind / Attest / Resolve / Advance semantics.

Do not implement deferred expansion.

### RA-004 — Preserve Source Grammar

Record `Spark / Weave / Field / Form` as Source linkage/provenance where appropriate, while keeping the exact
3x3 candidate cells provisional unless separately established by existing Codex authority.

### RA-005 — Evidence Reference Shape

Provide hash-bound, custody-aware evidence references that do not duplicate evidence content into Current.

### RA-006 — Immutable Predecessor Lineage

Verify a successor state can reference a predecessor and that prior states are not overwritten.

### RA-007 — Governed Advance Gate

Ensure a state cannot be advanced to current without a governed disposition reference.

### RA-008 — Resolve Interface

Provide/read back the minimum resolver-facing relation required for c3Ops/FREE to ask what Current state
presently applies to a governed environment.

### RA-009 — Inanna Initial Binding Attempt

Attempt the first environment binding only if a canonical active Measures of Inanna `env_key` is already
machine-resolvable.

Otherwise return `held_missing_env_key_for_initial_current_binding` without invention.

### RA-010 — CCC Chain Reference

Record a non-operative CCC chain identity reference only if it already exists in governed authority and can be
machine-verified. Otherwise return `held_missing_canonical_ccc_chain_identity`.

### RA-011 — Verification

Verify:

- Current state identity is environment-bound;
- evidence references remain references rather than copied evidence;
- predecessor lineage is preserved;
- a governed disposition is required to advance;
- only one state resolves as current for a governed environment within the tested relation;
- FREE/c3Ops can consume returned standing without owning it;
- no chain transaction occurred;
- no token utility expansion occurred;
- no historical audit was rewritten;
- no invented env_key or chain identity was created.

### RA-012 — Changed-Object Accounting

Return exact changed database objects, files, migrations, registry records, and readbacks attributable to this
execution only.

### RA-013 — Return Package

Return to `G:\My Drive\CanCom\review`:

1. `oar1_register_minimal_c3_current_relation_cline_001.meta.md`
2. `c3_current_registry_readback_cline_001.meta.md`
3. `c3_current_source_mapping_readback_cline_001.meta.md`
4. `c3_current_evidence_lineage_verification_cline_001.meta.md`
5. `c3_current_advance_gate_verification_cline_001.meta.md`
6. `c3_current_resolver_readback_cline_001.meta.md`
7. `c3_current_initial_inanna_binding_cline_001.meta.md`
8. `c3_current_ccc_chain_reference_readback_cline_001.meta.md`
9. `changed_files_register_minimal_c3_current_relation_cline_001.txt`
10. `hashes_register_minimal_c3_current_relation_cline_001.sha256`

## 13. Explicit Non-Authority

This OAR2 does not authorize:

- token economics;
- wallet UX;
- wallet gating;
- chain transaction;
- contract deployment or modification;
- mint/burn/transfer behavior;
- voting or governance weight;
- CCC distribution;
- SEAT completion;
- MAP audit re-execution;
- SRC2 expansion;
- Prism work;
- broad c3Ops refactor;
- FREE redesign;
- CanCom topology changes;
- Optics filing;
- or canonization of the candidate 3x3 Source matrix cells.

## 14. Successful Result

Successful registration is:

```text
Source provenance
      ↓
c3 Current relation
      ↓
environment-bound Current state
      ↓
hash/custody evidence references
      ↓
governed disposition gate
      ↓
immutable successor lineage
      ↓
resolver-facing current standing
```

A legitimate hold on the first Inanna binding or CCC chain identity is an acceptable successful result when
those dependencies are not yet governed and machine-resolvable.

OAR1 is execution evidence only and cannot review, close, route, or dispose itself.
