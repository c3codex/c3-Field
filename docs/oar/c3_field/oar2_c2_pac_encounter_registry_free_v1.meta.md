---
document_type: oar2
authority_level: architecture
document_scope: c2_pac_encounter_registry_free
title: OAR2 - C2 PAC Encounter, Registry Snapshot, and FREE DNR Gate
status: approved_for_execution
version: v1
operator: op044
system: c3_field
execution_branch: oar2/c2-pac-encounter-registry-free-v1
---

# OAR2 - C2 PAC Encounter, Registry Snapshot, and FREE DNR Gate

## Canonical flow

Connect EnvPAC -> c1My_Env -> ProfilePAC

c1My_Env -> persisted CURRENT -> C2ME_env relational encounter

PAC custody remains separate in My Env. EnvPAC is an environment-resolution primitive only. C2ME_env governs the encounter; it does not take asset or PAC custody.

For a public PAC encounter:

1. My Env resolves from the participant EnvPAC.
2. Persisted CURRENT and C2 standing permit passage to C2ME_env.
3. C2ME_env presents the separately custodied PAC to its custodian for review.
4. Natural intelligence (the PAC custodian) explicitly approves the public encounter.
5. Registry evaluates the PAC against its effective PAC contract.
6. Registry records the approved PAC state: identity, approved contents, custody location, content hash and encounter standing.
7. FREE resolves only the Registry-registered PAC state.
8. FREE recomputes the current PAC content hash from Registry-visible PAC content and members.
9. Exact match returns ACT and the registered public projection.
10. Any mismatch returns DNR. Runtime must not infer, repair, merge or substitute content.

## Invariants

- EnvPAC is a resolution primitive, not PAC or asset custody.
- C1 My Env exposes no WebPAC approval controls.
- C2ME_env is protected source / computational systems governance / relational encounter.
- PAC custody does not transfer into C2ME_env.
- Frontend cannot approve, register or alter Registry truth by rendering.
- Public encounter approval requires the authenticated custodian.
- Registry admission requires c3_pac_evaluate(...).completeness_state = pass.
- A registered PAC snapshot is immutable as public authority until explicitly re-registered.
- FREE returns only fields registered in the PAC public projection.
- Registered hash != current hash => DNR.
- DNR is fail-closed and produces no public projection.

## Initial proof object

PAC: run_aground_public_c3webpac_v1
Canonical host: runaground.c3field.online
Custodian subject: crs_93e901234ae044a396654ee80644b005
Current release: HELD / private

This OAR2 does not itself approve the Run Aground public encounter. The NI approval action must occur through the C2 encounter after deployment.
