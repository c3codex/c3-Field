---
document_type: c3ops_operational_projection
title: OAR Lifecycle and Custody Resolution Operational Projection
status: operationally_available_pending_chazz_review
version: v1
timestamp: 2026-08-10
operator: op044
author: codex
system: c3ops
scope: oar_lifecycle_custody_resolution
execution_instance_id: register_oar_lifecycle_custody_process_codex_002
implemented_by_oar2: oar2_implement_c3ops_oar_lifecycle_and_custody_mechanics_v1.meta.md
implementation_execution_instance_id: implement_oar_lifecycle_custody_mechanics_codex_001
derives_from: docs/_source/process/oar_lifecycle_custody_resolution_process_v1.meta.md
operational_concordance: c3_operational_concordance_v2.meta.md
operational_concordance_sha256: ED322A118B1B4EEA2F8AC3DD88CCBB9CA8199CFE77AB86673A38DBF4500878FD
scref_specification: scref_specification_v1.meta.md
scref_specification_sha256: 89644BE57FC7DCF40C0AF41EE085B8373A62D16BE9C750C3A16AC2EDEBB24471
---

# OAR Lifecycle and Custody Resolution Operational Projection v1

## Operational Standing

This is the c3Ops-facing operational projection of the protected OAR lifecycle and custody-resolution Source process.

It is registered for c3Ops process discovery and routing. Execution instance `implement_oar_lifecycle_custody_mechanics_codex_001` added the Registrar-callable resolver, custody adapters, post-disposition transition executor, and recoverability-event persistence required for bounded operational availability.

Standing: `operationally_available_pending_chazz_review`.

## Process Identities

- `oar_lifecycle_resolution_v1`
- `oar_custody_resolution_v1`
- `oar_evidence_asset_custody_resolution_v1`

## Lifecycle Transition Map

| State | Required input | Next governed state |
| --- | --- | --- |
| `thread_formation` | proposed Objective, Action, Result | `oar2_confirmed` only after Operator confirmation |
| `oar2_confirmed` | exact OAR2 identity/version/hash | `oar2_transferred` |
| `oar2_transferred` | registered executor destination | `execution` after executor preflight |
| `execution` | bounded executor action and evidence | `oar1_returned` |
| `oar1_returned` | OAR1 evidence object and recoverability references | `chazz_reviewed` |
| `chazz_reviewed` | Chazz review bound to OAR1 | `operator_disposed` |
| `operator_disposed` | Operator confirmation, dispute, hold, reroute, or closure | closed or next routed standing |

## Custody Resolution Map

| Object class | Custody result |
| --- | --- |
| OAR1 returned for review | `CanCom/review` |
| completed originating OAR2 | Optics OAR custody |
| disposed OAR1 | Optics OAR custody |
| execution evidence | registered evidence/document custody |
| Chambered FREE Call asset | governed bucket assignment |
| non-FREE registered asset | registered System document storage |
| protected Source | protected Source custody |

## Registry Relationship Model

The live Registry row binds each process key to:

- protected Source process object filename/version/hash
- operational projection filename/version/hash
- SCREF binding
- registered System `c3_ops`
- standing `registered_not_operational_pending_chazz_review`
- readability/access boundary
- required OAR type `both`
- required preflight, Operator confirmation, and OAR1 closeout

## System Intelligence Classification

Deterministic lifecycle-state eligibility, required dependency checks, and custody classification by registered object function qualify as c3Ops function candidates.

Discretionary review, semantic conflict resolution, Operator disposition, MAP terminology resolution, Source mutation, and public authorization do not qualify as System Intelligence under this projection.

The term `System Intelligence` remains held for this process if broader definition is required beyond deterministic c3Ops function behavior.

## Operational Mechanics

Existing runtime helper `scripts/lib/process-registry-runtime.ts` validates generic OAR queue transitions and evidence requirements.

Implemented c3Ops capability:

- Registrar-callable custody resolver: `scripts/lib/oar-lifecycle-custody-mechanics.ts`
- Optics OAR custody adapter: resolver branch `optics_oar_custody`
- evidence/document custody adapter: resolver branch `evidence_document_custody`
- governed bucket assignment adapter: resolver branch `governed_free_call_bucket`
- post-disposition OAR1/OAR2 transition executor: `executePostDispositionTransition`
- recoverability metadata persistence: `public.c3ops_oar_custody_resolution_event`

Validation script `scripts/validate-oar-lifecycle-custody-mechanics.ts` covers the 16 required positive and held cases.
