# OAR2 — Restore CanCom Delivery Lifecycle + Resolve c3Ops OAR Optics — Codex — 2026-10-01 — 007

Operator: op044
Registrar: Chazz — Registrar
Executor: Codex
Execution instance: cancom_runtime_passage_codex_007
OAR key: oar2_cancom_runtime_20261001_007
Standing: EXECUTE_BOUNDED_AFTER_NOTCHAZZ_PASS

## Lineage
Preserve accepted OAR005 work. OAR006 was held before execution after Registrar detected that the live OAR005 delivery replacement omitted process/transition initialization and model-return policy propagation.

Resolved contracts:
- process:cancom_oar_delivery_retrieval_v1
- process:oar1_model_resolution_return_contract_v1
- process:c3ops_oar_lifecycle_optics_resolution_v1
- process:c1me_operator_oar_optics_v1
- process:c3ops_notchazz_boundary_optics_projection_v1
- process:registrar_semantic_closure_v1

## A — Restore atomic delivery lifecycle
Correct register_cancom_oar_delivery_v1 while preserving registered custody-provider validation.

Successful delivery must atomically create:
- system_oar_queue: approved_for_execution / preflight passed
- c3_oar_process_instance: queued / pending_validation / deploy held
- c3_oar_transition_event: <instance>:register_and_queue, not_queued -> queued
- manifest custody event
- executor wake event

Process instance must bind exact OAR2, expected OAR1, and manifest evidence paths.
Wake must not commit without queue/process/transition rails.

## B — Restore model-return propagation
If executor capability requires model evidence, queue automation_permissions must include:
- execution_profile_process=oar_execution_profile_model_resolution_v1
- model_resolution_evidence_required=true
- minimum_capability_floor from registered execution profile

register_cancom_oar_return_v1 must keep validating required model evidence before lifecycle writes.
Negative proof: missing required evidence => HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED and zero lifecycle delta.

## C — c3ops resolved OAR optics
Implement process:c3ops_oar_lifecycle_optics_resolution_v1 as one named c3ops read-model interface.

Only this resolver may interpret:
system_oar_queue, c3_oar_process_instance, c3_oar_transition_event,
system_oar_execution_evidence, c3ops_oar_custody_resolution_event.

Output only:
oar_key, execution_instance, executor_ref, queue_standing, preflight_standing,
requested_action, execution_summary, return_standing, model_resolution_standing,
validation_standing, deploy_standing, created_at, updated_at.

## D — Downstream projection only
My Env Operations must not directly interpret the five raw OAR rails.
It may authenticate, verify the op044 operator-bound Operations primitive, and render the resolved c3ops OAR optics interface only.

c3ops Current State must consume the same resolved interface.

Keep NotChazz border-health telemetry separate:
c3ops_notchazz_oar_formation_evaluation

## E — Preserve accepted behavior
Do not regress initiative operator binding enforcement, registered GitHub/Drive custody admission, provider fail-closed behavior, 003/004/005 pickup compatibility, model-evidence fail-closed behavior, personal E2EE, NotChazz exact-SHA gate, or no-deploy/no-public-release/no-correspondence boundaries.

## Source custody
Start from current origin/c3field.
Use accepted codex/cancom-005 source only where still required.
OAR006 is held evidence only.
Push to non-production branch codex/cancom-007.
Do not merge or deploy.

## Required proof
Return exact changed paths and prove:
1. atomic queue/process/transition/manifest/wake delivery
2. queue carries required model policy
3. missing model evidence causes zero lifecycle delta
4. named c3ops OAR optics interface
5. My Env no longer interprets raw OAR rails
6. c3ops Current State uses same interface
7. NotChazz telemetry remains separate
8. accepted OAR005 regressions pass
9. remote codex/cancom-007 commit resolves
10. structured model-resolution evidence
11. external effects count

## Effects
Authorized: bounded DB/source correction, internal tests, non-production push to codex/cancom-007.
Not authorized: production merge, deploy, public release, external correspondence, new provider, new operator/relation standing, credential expansion, participant visibility widening, semantic reinterpretation.

## Return
registry://cancom/oar1_return/cancom_runtime_passage_codex_007

## Invariants
Registrar resolves semantics; executor implements.
NotChazz evaluates before delivery.
Registry holds evidence/state.
c3ops resolves OAR lifecycle optics.
My Env/FREE render resolved projection only.
A wake is notification, not authority.
The relation is never governed; the environment is governed.
