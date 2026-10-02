# OAR2 — Establish NUGS c3Ops Runtime Primitive + Codex Implementation — 2026-10-01 — 001

## Route
Operator: op044
Registrar: Chazz
Executor for this instance: Codex
System: c3ops / NUGS
Execution instance: nugs_runtime_primitive_codex_001
OAR key: oar2_nugs_runtime_20261001_001
Standing: FORMED_PENDING_NOTCHAZZ_PASS

## Registered authority
Process: c3ops_nugs_native_universal_general_services_v1
Standing: active / operator_confirmed_registered
Preflight: PASS

Definition:
A NUG is a Native Universal General Service attached to a native c3Ops interoperable function, callable across an environment boundary under resolved capability and authority, enabling an environment to make Current State workable without transferring custody or ownership of that state.

## Objective
Implement the minimum c3Ops runtime foundation required to register, resolve, preflight, and call individual NUG functions into authorized environments without redefining PAC semantics or treating providers/workers as the NUG.

## Required implementation
1. Add a Registry-backed NUG service/function binding representation sufficient to resolve:
   - NUG key and standing;
   - native c3Ops interoperable function;
   - permitted environment/capability relation;
   - required preflight/effect boundary;
   - runtime adapter class;
   - evidence-return relation.
2. Add a c3Ops resolver/preflight function that fails closed when service, native function, environment, capability, authority, context, or required effect evidence is unresolved.
3. Integrate FREE only as the permitted runtime resolver/caller into an environment; FREE does not own NUG state or create authority.
4. Return authorized occurrence/effect evidence so Current State can resolve again.
5. Preserve existing CanCom, Calendar, Directory, EnvPAC capability-grant, PAC, and FREE semantics. Do not rename/reclassify them merely to satisfy tests.
6. Initial candidate NUGS (CanCom, Calendar, Directory) may be admitted only where existing native interoperable functions and authority are proven. Otherwise return HLD with missing predicate evidence.

## Runtime adapter rule
NUGS do not require a Worker as a class.
- native synchronous/database/runtime function: direct c3Ops callable adapter is sufficient;
- external provider, asynchronous job, scheduled execution, retry/delivery queue, or transport isolation: use an already registered adapter/Worker where required;
- Worker/provider is infrastructure servicing a NUG, never the NUG itself;
- no new Worker may be created merely because a function is classified as a NUG.

Existing example: Lapzuli uses an external distribution Worker because its transport requires it. Existing c3Ops resolver/runtime helpers demonstrate workerless native execution.

## Canonical invariants
- A NUG always attaches to a native c3Ops interoperable function callable into an environment.
- Capability does not imply authority.
- Provider/API adapter/connector/UI projection is not itself a NUG.
- NUG functional passage does not transfer custody or ownership of environment state.
- PAC semantics remain authoritative and are not redefined.
- Consequential effects remain subject to applicable effect-level preflight.
- Evidence returns to Registry/Current State.

## Codex execution boundary
Authorized after NotChazz PASS:
- inspect current c3Ops/FREE/EnvPAC/CanCom source and Registry schema;
- implement minimum NUG registry/runtime/preflight foundation;
- bounded schema/source mutations required by the registered semantics;
- tests/fixtures with no external effects;
- durable source on a non-production Codex branch;
- OAR1 return with exact source/schema/test evidence.

Not authorized:
- production merge/deploy;
- public release;
- real external messages/calendar events/provider effects;
- creation of new external credentials/providers;
- automatic reclassification of existing services as NUGS without evidence;
- PAC semantic mutation.

## Required OAR1 evidence
- exact changed schema/source paths;
- NUG registration/resolution positive proof;
- missing native-function negative proof;
- missing capability/authority/context negative proof;
- effect-preflight negative proof;
- FREE runtime resolution proof;
- workerless native-function proof;
- adapter/Worker classification proof;
- evidence-return/Current State proof;
- regression proof that PAC semantics and existing CanCom boundaries remain intact;
- external effects count;
- model-resolution evidence where required.

## Passage
Registrar forms this OAR from Registry-resolved semantics. NotChazz pre-dispatch evaluation is required before Codex execution.