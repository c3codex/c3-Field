---
document_type: ledger_entry
authority_level: governance
document_scope: c3_ledger
ledger_entry_id: c3_ledger_0005
title: c3 Current as the Governed Present-State Relation
entry_type: implementation_elevated_relational_discovery
date: 2026-08-08
operator: op044
executor: chazz
originating_inquiry: >
  As MAP, SEAT, SRC2, evidence custody, portal resolution, and environment standing became
  increasingly dependent on a persistent representation of present governed state, the inquiry
  became whether c3 Current could remain deferred without creating expensive backend rework.
context: >
  Measures Registry and c3Ops backend design now require a stable relationship among governed
  environment identity, evidence, current standing, progression, and later SEAT/SRC activity.
  Historical MAP evidence for Measures of Inanna also demonstrates the need to preserve immutable
  evidence while separately resolving which governed state presently applies.
observed_relations: >
  Evidence records describe what occurred and what was observed; portal and progression systems
  require a separate current-state relation to determine what presently governs without rewriting
  historical evidence. FREE must be able to resolve current standing from governed sources rather
  than reconstructing present truth from frontend state or repeatedly interpreting historical files.
discovery: >
  c3 Current is minimally necessary as the persistent reference to the presently governing state
  of a governed environment. It does not replace evidence. It binds the evidence and disposition
  from which the current standing is derived, preserves predecessor lineage, and provides a stable
  resolve target for c3Ops/FREE. Deferring this binding further increases the risk of retrofitting
  token/state identity across MAP, SEAT, SRC2, evidence, and portal structures after those systems
  are already implemented.
implications: >
  The minimal Current function should be bound before further backend expansion. Expansion of token
  economics, distribution, wallet behavior, voting, rewards, transfer behavior, public visibility,
  and other future uses remains intentionally undecided. Implementation must preserve historical
  evidence and prior Current states rather than overwrite them.
current_standing: operator_confirmed_implementation_elevated_pending_bounded_registration
disposition: >
  Preserve this minimal function as the implementation target. Route a bounded OAR2 for backend
  registration of the Current relation before further MAP-to-SEAT evidence-transfer architecture
  depends on an alternate state model. No token expansion is authorized by this ledger entry.
related_authorities:
  - c3 Ledger — Registry of Record
  - Measures Registry
  - c3Ops
  - FREE
related_oars: []
related_systems:
  - c3_field
  - c3ops
  - measures_registry
  - measures_of_inanna
related_initiatives:
  - map_portal
  - seat_portal
  - src2
candidate_proposition: >
  c3 Current preserves which governed state presently applies to an environment, with immutable
  lineage to the evidence, disposition, and prior state from which that standing was derived.
evidence_refs:
  - map_portal_admission_profile_v1
  - map_environment_audit02_cody_001
  - measures_of_inanna_operations_map_v1.meta.md
  - measures_of_inanna_environmental_risk_runtime_operations_report_v2.meta.md
future_review_conditions: >
  Review expansion only after the minimal Bind, Attest, Advance, and Resolve functions are registered
  and exercised against a real governed environment. Future token functions must be separately
  proposed and must not be inferred from this entry.
confirmation_status: operator_confirmed
---

# c3 Ledger Entry — c3_ledger_0005

## Working Title

c3 Current as the Governed Present-State Relation

## Finding

Backend design has reached the point where deferring c3 Current creates more architectural risk than
binding its minimal function now.

The need is not to expand token utility. The need is to establish a durable relation between a governed
environment and the state that presently governs it while preserving the immutable evidence and prior state
that produced that standing.

## Minimal Function

c3 Current shall initially support only four functions:

1. **Bind** — associate Current with a governed `env_key`.
2. **Attest** — associate hash-bound evidence references with the Current state.
3. **Advance** — establish a successor Current state only after the required governed disposition.
4. **Resolve** — allow c3Ops/FREE to determine which governed state presently applies to the environment.

Conceptually:

```text
environment
    ↓
Current
    ↓
current standing
    ↓
supporting evidence references
```

When standing changes:

```text
Current state N
    ↓
new governed evidence + disposition
    ↓
Current state N+1

N remains historical.
N+1 becomes current.
```

## Minimal Boundaries

- Current is not the evidence artifact.
- Current does not rewrite historical evidence.
- New evidence alone cannot advance Current.
- A governed disposition is required to advance Current.
- Possession or existence of a token does not by itself grant standing or authority.
- Sensitive evidence remains in governed custody rather than being placed into the Current relation itself.
- FREE may resolve Current but may not determine or advance Current.
- Prior Current states remain traceable when a successor becomes current.

## Deferred Expansion

This entry does not determine or authorize:

- token economics;
- distribution;
- wallet UX or wallet requirements;
- voting or governance weight;
- rewards;
- fees;
- supply behavior;
- transferability;
- public visibility;
- cross-environment utility;
- financialization;
- or additional token classes/functions.

Those questions remain available for later expansion after the minimal function is implemented and observed.

## Implementation Elevation

The discovery is no longer ledger-only. Operator `op044` has confirmed that the minimal function is now an
implementation dependency.

Standing:

`operator_confirmed_implementation_elevated_pending_bounded_registration`

This standing does not itself authorize repository, database, chain, wallet, or deployment mutation.
Implementation authority must move through a separately bounded OAR2.

## Initial Application

Measures of Inanna should be the first governed environment used to exercise the minimal relation because its
existing MAP evidence demonstrates the required distinction between immutable historical evidence and current
governed standing.

Expected relation:

```text
Measures of Inanna
    → env_key
    → c3 Current
    → current MAP standing
    → evidence references
    → /map-portal
    → SEAT entrance determination
```

## Current Standing

`operator_confirmed_implementation_elevated_pending_bounded_registration`

## Disposition

Route bounded implementation registration before additional MAP → SEAT backend structure depends on an
alternate present-state model. Expansion remains deferred.
