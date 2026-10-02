# OAR2 — Standing My Env CanCom Email NUG Authority — 2026-10-02 — 004

## Route
Operator: op044
Registrar / bounded runtime executor: Chazz
System: c3ops / NUGS / My Env / CanCom
OAR key: oar2_myenv_cancom_email_runtime_20261002_004
Execution instance: myenv_cancom_email_runtime_chazz_004
Standing: STANDING_RUNTIME_AUTHORITY_AFTER_NOTCHAZZ_PASS

## Purpose
Authorize one persistent, revocable CanCom NUG inside the Operator's My Env so existing work cards can perform bounded single-recipient external email effects through the registered Resend adapter.

This OAR remains approved_for_execution / executing while the NUG is active. Closing or revoking this OAR must make NUG resolution fail closed.

## Exact environment
origin_env_key: env_c3_field
env_key: env_person_eea672f5a7676dad4316755b
envpac_key: c3envpac_person_eea672f5a7676dad4316755b_v0_1
current_state_key: current_env_person_eea672f5a7676dad4316755b_v1

## Exact NUG
nug_key: myenv_cancom_email_op044_v1
service_name: CanCom
native_process_key: c3ops_cancom_context_resolution_v1
native_function_ref: public.resolve_cancom_context_v1(jsonb)
native_function_sha256: dd4c54472c8398248075625f21840af878e522c1a936abaffa6c738a3e853e6f

executor_ref: chazz
capability_ref: myenv_cancom_email_runtime_capability_v1
authority_oar_key: oar2_myenv_cancom_email_runtime_20261002_004
context_binding_key: cancom_ctx_myenv_email_op044_v1

adapter_class: registered_adapter
adapter_process_key: c3ops_cancom_resend_email_adapter_v1
effect_class: external_email
native_result_standing: resolved_for_passage
evidence_return_relation: registry://c3_current_evidence_ref/current_env_person_eea672f5a7676dad4316755b_v1

## Native CanCom input
relation_class: system_system
relation_ref: myenv_cancom_email_op044_v1
asserted_sender: op044
origin_environment: env_c3_field
receiving_environment: env_person_eea672f5a7676dad4316755b
audience_role: operator
transport_adapter: registry_cancom_internal
payload_custody_class: none

The NUG enters My Env internally through CanCom. Resend is used only at the separately preflighted external_email effect boundary.

## Effect boundary
Allowed:
- one recipient per effect
- subject <= 240 characters
- body <= 12,000 characters
- Resend provider dispatch through c3ops_cancom_resend_email_adapter_v1
- idempotency key tied to the prepared occurrence
- provider receipt custody in Registry
- nug_effect_receipt evidence return to CURRENT

Not allowed:
- CC
- BCC
- attachments
- bulk recipients
- hidden authority fields from browser
- caller-selected OAR/capability/context/NUG keys
- credential disclosure/change
- relationship/participant standing creation
- automatic CURRENT advancement
- PAC semantic mutation

## My Env surface
The active work projection is:
c1me_plateau_humanity_ai_work_v1

Current first use case:
c3 Community Partners DAO, LLC
→ Measures Registry operational/commercial proof
→ MDM / Plateau Commons initiative-formation proof
→ Humanity AI funding/application rail
→ CFMT fiscal-sponsorship conversation

The work card may initiate an email effect only after explicit user confirmation.

## Revocation rule
Any of the following must fail closed:
- capability not active
- standing OAR queue not approved_for_execution or executing
- context binding inactive/missing
- EnvPAC/current mismatch
- native function hash drift
- adapter process inactive
- effect_preflight mismatch
- NUG binding revoked/held
- provider receipt cannot be returned to Registry

## External authority
This standing OAR authorizes operator-confirmed single-recipient external email effects initiated from the authenticated Operator My Env under the exact NUG binding above.

It does not authorize any specific email until the user initiates that effect from My Env.

## Invariants
Capability does not imply authority.
Provider is infrastructure, not the NUG.
NUG functional passage does not transfer custody or ownership of environment state.
Effect receipts return to Registry/CURRENT.
The relation is never governed; the environment is governed.
