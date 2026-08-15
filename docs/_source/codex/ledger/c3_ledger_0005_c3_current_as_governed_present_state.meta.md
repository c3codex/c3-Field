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
  Backend design established that a durable Current relation is now foundational rather than optional.
  Measures of Inanna provides the first intended real environment because its completed MAP evidence
  distinguishes historical evidence from present standing. During implementation elevation, a stopped
  Cline execution and concurrent model work produced competing candidate Current migrations and two
  different v2 OARs claiming the same execution instance. The collision was detected before a v2
  environment execution was launched and was reconciled into one consolidated model and v3 execution.
observed_relations: >
  Evidence describes what occurred; Current identifies which governed state presently applies.
  c3Ops already holds the appropriate asset/evidence primitive, including content hash, authoritative
  custody, external-anchor identity, token identity, anchor standing, and tokenization standing.
  Therefore Current must reference/snapshot governed evidence identity rather than create a second
  asset or tokenization registry. FREE/c3Ops require a safe resolver that returns either the Current
  standing or an explicit governed hold rather than deriving standing in frontend code.
discovery: >
  c3 Current is minimally necessary as the persistent governed present-state relation for an env_key.
  Its minimum implementation is expressed through Source: Spark / Bind, Weave / Attest, Field / Resolve,
  Form / Advance. This mapping is an implementation expression of Source, not a replacement for the
  original Codexstone inscription. The candidate downstream 1 + 3 + 3 + 3 expansion across Weave,
  Field, and Form remains provisional. The minimum relation is one implementation subset of the
  original CCC purpose, not a replacement definition of CCC.
implications: >
  Current must be established before MAP-to-SEAT evidence transfer is further hardened. Historical
  Current states and evidence references must remain immutable; Advance requires governed disposition;
  asset-backed Attest must derive evidence truth from c3Ops authority; Resolve must expose governed
  Current/hold standing without granting frontend mutation authority. Token economics, wallet behavior,
  additional smart contracts, distribution, voting, rewards, and other CCC expansion remain separately
  bounded future work.
current_standing: operator_confirmed_implementation_elevated_exact_execution_routed_pending_return
disposition: >
  Execute only register_minimal_c3_current_relation_cline_003 from governed CanCom/cline. Execution
  _001 is stopped. Execution _002 is superseded before execution because two competing v2 OARs claimed
  the same execution identity. Review the _003 return before any real environment binding, MAP evidence
  import/tokenization, SEAT passage, or CCC smart_contract expansion.
related_authorities:
  - c3 Ledger — Registry of Record
  - Codexstone Source inscription
  - c3 Community Partners DAO
  - c3Ops Asset Operations Protocol
  - Measures Registry
  - FREE
related_oars:
  - docs/oar/c3_field/oar2_register_minimal_c3_current_relation_v1.meta.md
  - docs/oar/c3_field/oar2_register_minimal_c3_current_relation_v2.meta.md
  - docs/oar/c3_field/oar2_apply_minimal_c3_current_relation_v2.meta.md
  - docs/oar/c3_field/oar2_apply_minimal_c3_current_relation_v3.meta.md
related_systems:
  - c3_field
  - c3ops
  - measures_registry
  - measures_of_inanna
related_initiatives:
  - c3_current
  - map_portal
  - seat_portal
  - src2
candidate_proposition: >
  c3 Current preserves which governed state presently applies to an environment, with immutable
  lineage to the evidence, disposition, and prior state from which that standing was derived.
candidate_source_pattern: >
  Source is Spark / Weave / Field / Form. Minimal implementation currently expresses Spark as Bind,
  Weave as Attest, Field as Resolve, and Form as Advance. The downstream expansion appears to follow
  one Spark plus three Weave, three Field, and three Form expressions; the exact nine cells remain
  provisional pending cross-initiative confirmation.
original_ccc_concept: >
  The c3 DAO Token (CCC) is the Current of the Codex, issued by c3 Community Partners DAO. It anchors
  recognition, access, and circulation through the Connect / Contribute / Create model. CCC is not
  speculative but regenerative: contributions, art, and initiatives flow back into community, DAO
  continuity, and the commons.
implementation_model:
  migration: supabase/migrations/20260808112500_register_minimal_c3_current_relation_v2.sql
  migration_commit: 87f76f9906ede31d5487b37b4a9c575a1a0713a2
  migration_git_blob_sha: d62a07acaf21642f7b7478f329f9ce0d0ef061c4
  execution_oar: docs/oar/c3_field/oar2_apply_minimal_c3_current_relation_v3.meta.md
  execution_instance_id: register_minimal_c3_current_relation_cline_003
  state_table: public.c3_current_state
  evidence_table: public.c3_current_evidence_ref
  bind_function: public.bind_c3_current
  attest_function: public.attest_c3_current_evidence
  resolve_function: public.resolve_c3_current
  advance_function: public.advance_c3_current
  evidence_authority: public.c3ops_asset_record_for_asset_backed_attest
  explicit_resolver_holds:
    - held_missing_env_key
    - held_no_current_state
  initial_environment_binding: deferred
  map_evidence_import: deferred
  ccc_smart_contract_mutation: not_authorized_in_minimal_registration
evidence_refs:
  - map_portal_admission_profile_v1
  - map_environment_audit02_cody_001
  - measures_of_inanna_operations_map_v1.meta.md
  - measures_of_inanna_environmental_risk_runtime_operations_report_v2.meta.md
  - c3ops_asset_operations_protocol_supplemental_evidence_cline_001.meta.md
  - CCC-token.png visual provenance supplied by operator 2026-08-08
  - supabase/migrations/20260808112500_register_minimal_c3_current_relation_v2.sql
future_review_conditions: >
  First review the _003 registration return. If Current is verified, separately establish a canonical
  Measures of Inanna env_key and register/import its MAP evidence through c3Ops asset authority before
  Attest/Bind. Then test MAP portal resolution and SEAT entrance. Continue testing the Source 1 + 3 + 3 + 3
  pattern across MAP, SEAT, SRC2, and other initiatives before proposing universal Codex standing.
confirmation_status: operator_confirmed_exact_execution_routed
---

# c3 Ledger Entry — c3_ledger_0005

## Finding

Backend design reached the point where deferring c3 Current created more architectural risk than establishing
its minimum function. Current is now an implementation dependency.

The need is not to reduce CCC to a state token. The need is to establish the first durable backend relation
required for CCC to function as the Current of the Codex while preserving immutable evidence and prior state.

## Original CCC Purpose Preserved

> The c3 DAO Token (CCC) is the Current of the Codex, issued by c3 Community Partners DAO. It anchors
> recognition, access, and circulation through the Connect · Contribute · Create model. CCC is not
> speculative but regenerative: contributions, art, and initiatives flow back into community, DAO
> continuity, and the commons.

The present-state relation is one foundational implementation of that purpose. It does not supersede or narrow
the original concept. Future smart_contracts may materially express additional recognition, access,
circulation, contribution, and regenerative-return functions through separately bounded implementation.

## Source Recognition

`Spark / Weave / Field / Form` is Source from the original Codexstone inscription.

The current minimum implementation expresses:

```text
Spark  → Bind
Weave  → Attest
Field  → Resolve
Form   → Advance
```

The emerging downstream pattern remains:

```text
SOURCE
  Spark
  Weave × 3
  Field × 3
  Form × 3
```

The exact nine downstream cells are not canonicalized by this entry.

## Evidence Relation

Current does not become a second evidence or tokenization registry.

`public.c3ops_asset_record` already carries governed asset identity, content hash, authoritative custody,
external-anchor identity, token identity, anchor standing, and tokenization standing. Asset-backed Current
Attest therefore snapshots those governed values from c3Ops authority rather than trusting caller-supplied
asset evidence identity.

Generic non-asset governed evidence may still be referenced by explicit hash/custody identity, but MAP/SEAT
asset evidence can later enter Current through its c3Ops `asset_key`.

## Consolidated Physical Model

The final pre-execution model is:

```text
public.c3_current_state
public.c3_current_evidence_ref

public.bind_c3_current(...)
public.attest_c3_current_evidence(...)
public.resolve_c3_current(env_key)
public.advance_c3_current(...)
```

The model enforces:

- one Current state per governed environment;
- immutable predecessor lineage;
- immutable evidence references;
- a governed disposition reference before Advance;
- c3Ops authority for asset-backed evidence snapshots;
- explicit resolver holds rather than frontend inference;
- no direct browser or service-role table mutation;
- safe resolver access only through the bounded Resolve function.

Exact migration:

`supabase/migrations/20260808112500_register_minimal_c3_current_relation_v2.sql`

Commit:

`87f76f9906ede31d5487b37b4a9c575a1a0713a2`

Git blob SHA:

`d62a07acaf21642f7b7478f329f9ce0d0ef061c4`

## Implementation Collision — Preserved

Execution `_001` was stopped after repeated failures before a canonical Current return reached Review.

During the model-first takeover, concurrent work produced two competing candidate migrations and two different
v2 OARs claiming `_002`. That duplicate execution authority was detected before `_002` was launched.

The collision is preserved rather than normalized away. Both v2 routes are superseded. The consolidated
execution is:

`register_minimal_c3_current_relation_cline_003`

through:

`docs/oar/c3_field/oar2_apply_minimal_c3_current_relation_v3.meta.md`

## Real Environment Boundary

No real environment is bound by Current registration itself.

Measures of Inanna remains the intended first real environment after a canonical active `env_key` is separately
established. Its existing MAP evidence will then be registered/imported through c3Ops asset authority and can be
Attested to Current without rerunning the completed audits.

## Current Standing

`operator_confirmed_implementation_elevated_exact_execution_routed_pending_return`

## Disposition

Execute and review `_003` only. Do not use `_001` or `_002`. After Current registration returns, separately
establish Inanna environment identity and MAP evidence assets before Current Bind/Attest, MAP portal resolution,
or SEAT entrance. CCC smart_contract expansion remains later bounded work.
