# OAR2 — Resolve c3Ops OAR Lifecycle Optics Projection Boundary — Codex — 2026-10-01 — 006

Operator: op044
Registrar: Chazz — Registrar
Executor: Codex
System: c3ops / CanCom / My Env projection
Execution instance: cancom_runtime_passage_codex_006
OAR key: oar2_cancom_runtime_20261001_006
Standing: EXECUTE_BOUNDED_AFTER_NOTCHAZZ_PASS

## Correction lineage
This is the bounded implementation correction for OAR005.
Preserve accepted OAR005 A/B/C/D:
- initiative operator-context enforcement
- registered custody-provider enforcement
- required model-resolution return enforcement
- durable non-production source custody

Only the c3ops Optics / My Env projection seam remains open.

## Resolved Registry contract
Implement:
- process:c3ops_oar_lifecycle_optics_resolution_v1
- process:c1me_operator_oar_optics_v1
- process:c3ops_notchazz_boundary_optics_projection_v1
- process:cancom_oar_delivery_retrieval_v1
- process:registrar_semantic_closure_v1

Boundary:
c3ops resolves OAR lifecycle meaning once. My Env/FREE consume the resolved projection only. They do not join raw OAR rails or independently derive lifecycle, return, model, validation, or deployment standing.

## Objective A — c3ops resolved OAR optics interface
Implement one named c3ops-owned read-model interface.

Only this resolver may interpret:
- system_oar_queue
- c3_oar_process_instance
- c3_oar_transition_event
- system_oar_execution_evidence
- c3ops_oar_custody_resolution_event

Output exactly:
- oar_key
- execution_instance
- executor_ref
- queue_standing
- preflight_standing
- requested_action
- execution_summary
- return_standing
- model_resolution_standing
- validation_standing
- deploy_standing
- created_at
- updated_at

Return standing comes from the Registry-bound OAR1 return/lifecycle.
Model standing comes from registered model-return requirements plus runtime evidence.
Validation standing comes from the process instance.
Deploy standing comes from registered execution/process state.
No downstream consumer may reinterpret these fields.

Do not widen public/API access.

## Objective B — My Env Operations projection only
Correct functions/api/my-environment-operations.ts.

It must not directly read/join the five raw OAR lifecycle rails above for lifecycle interpretation.

It may:
- authenticate the environment/session
- verify the active operator-bound Operations primitive for op044
- read the single c3ops resolved OAR optics interface
- return only the registered projection fields

It may not create authority, mutate lifecycle, expose payload/private/control material, return arbitrary automation_permissions, or independently infer lifecycle standings.

## Objective C — c3ops Current State
Make c3ops Current State consume the same resolved OAR optics interface.

Keep NotChazz border-health telemetry separate:
c3ops_notchazz_oar_formation_evaluation

PASS/HOLD/SEND telemetry is border health, not OAR lifecycle optics.

## Objective D — restore delivery propagation for required model-return evidence
The live OAR005 replacement of `register_cancom_oar_delivery_v1` currently omits both:
- `execution_profile_process`
- `model_resolution_evidence_required`

from newly created queue `automation_permissions`.

Repair that propagation from the already-registered executor capability/model-resolution policy. For authority-sensitive OARs that require model evidence, the queue must carry `model_resolution_evidence_required=true` before executor pickup.

This is implementation repair only; do not redefine the model policy.

## Objective E — preserve OAR005 accepted behavior
Do not regress:
- participant cannot promote to initiative operator
- active first-class initiative-operator binding required
- GitHub/Drive provider admission is Registry-backed
- arbitrary provider and prefix mismatch fail closed
- required model evidence validates before lifecycle mutation
- missing required model evidence causes zero lifecycle mutation
- 003/004/005 pickup compatibility
- personal E2EE/no plaintext fallback
- no deploy/public release/external correspondence

## Objective F — Source custody
Start from current origin/c3field.
Use codex/cancom-005 only for accepted implementation that remains required.
Push final correction to remote non-production branch:
codex/cancom-006

Do not merge c3field.
Do not deploy.

## Required proof
OAR1 must include:
1. resolved c3ops OAR optics interface name and exact source/migration path
2. proof only c3ops resolver interprets the five raw rails
3. proof My Env no longer reads those raw rails directly
4. proof c3ops Current State consumes the same resolved interface
5. proof NotChazz telemetry remains separate
6. operator-bound My Env Operations test
7. projection allowlist/no-private-material test
8. OAR005 A/B/C/D regressions, including queue propagation of the required model-evidence flag
9. available type/runtime tests
10. remote branch codex/cancom-006 and resolvable commit
11. required model-resolution evidence
12. external effects count

## Effects
Authorized: bounded DB/source correction, internal tests, non-production push to codex/cancom-006.
Not authorized: production merge, deploy, public release, external correspondence, provider registration, operator/relation standing creation, credential scope expansion, participant visibility widening, semantic reinterpretation.

## Return
registry://cancom/oar1_return/cancom_runtime_passage_codex_006

Bind OAR1 to exact OAR2 payload/SHA, NotChazz evaluation, implementation branch/commit, mutation/deploy/effect standings, and model-resolution evidence.

## Invariants
Registry holds evidence/state.
c3ops resolves operational OAR optics.
NotChazz evaluates the border; Optics observes border telemetry.
My Env/FREE render resolved projection only.
Registrar resolves semantics; executor implements the resolved contract.
The relation is never governed; the environment is governed.
