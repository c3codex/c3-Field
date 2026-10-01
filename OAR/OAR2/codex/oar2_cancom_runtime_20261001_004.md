# OAR2 — Complete CanCom Consumer Relation Runtime + Lifecycle Reconciliation — Codex — 2026-10-01 — 004

## Route
Operator: op044  
Registrar: Chazz  
Executor for this instance: Codex  
System: c3ops / CanCom  
Execution instance: cancom_runtime_passage_codex_004  
OAR key: oar2_cancom_runtime_20261001_004  
Standing: EXECUTE_BOUNDED

## Source authority and custody
Registry manifest + CanCom passage establish delivery, identity, authority, standing, and return relation.

This payload is held in immutable GitHub source custody for this execution instance. GitHub is payload custody only; it does not create authority or standing. Existing Google Drive CanCom folders remain readable legacy/projection surfaces and are not operational mailboxes.

## Execution Profile
Task class: authority_sensitive  
Required tools: repository source access; Supabase schema/query/mutation; Cloudflare Pages source; bounded runtime verification  
Required context capacity: high  
Required reasoning level: high  
Authority sensitivity: high  
Minimum capability floor: high-reasoning code/system execution with repository + database access  
Executor binding: Codex for this execution instance only

## Model Resolution Policy
Preferred model/tier: strongest qualified Codex execution model currently available  
Fallback permitted only for registered availability triggers: usage_exhausted, quota_exhausted, rate_limited, temporarily_unavailable  
Fallback rule: candidate must satisfy the minimum capability floor above  
Below-floor disposition: HLD_MODEL_CAPABILITY_UNAVAILABLE  
Model version does not create authority.  
OAR1 must report Model Resolution Evidence:
- preferred model/tier
- selected model
- fallback used
- fallback level
- fallback reason
- capability floor passed
- tools available
- context fit
- execution result

## Objective A — Reconcile OAR lifecycle and remove bootstrap-specific delivery assumptions
The 003 implementation proved Registry-bound CanCom pickup/return, but Registrar review found incomplete lifecycle consumption and bootstrap-specific assumptions.

Implement and prove:

1. `register_cancom_oar_return_v1` must reconcile all required lifecycle rails for the exact execution instance:
   - `system_oar_queue`
   - `c3_oar_process_instance`
   - `c3_oar_transition_event`
   - `system_oar_execution_evidence`
   - Registry-bound custody/return event

2. On execution return, preserve:
   - execution_started_at
   - execution_completed_at
   - actual mutation standings
   - execution evidence
   - validation/held standing
   - OAR1 path and exact originating OAR2 relation

3. Queue mutation-standing columns are execution/result state, not authority source. Authority remains the capability grant.

4. Remove 003-specific pickup assumptions from the generic resolver:
   - generic pickup may not require an action literally named `implement_oar_pickup_return_runtime`
   - validate the current execution's registered allowed action/capability instead

5. Make OAR payload custody provider-neutral.
   - Registry/CanCom may bind an immutable custody provider such as GitHub, Drive, Registry-native payload custody, or another explicitly registered provider.
   - Do not require `drive_file:` as the universal custody prefix.
   - Drive may remain a custody/projection provider but is not operational authority.

6. Preserve invariant:
   Registry makes it identifiable.
   CanCom makes it passable.
   Custody makes the payload retrievable.
   Projection makes it human-readable.

## Objective B — Implement generalized CanCom consumer relation + actor/context resolution
Implement the held Objective B from 003 without overloading person-to-person connection semantics.

### B1. Relation classes
Support bounded CanCom relation resolution for:
- person ↔ person
- person ↔ initiative
- person ↔ institution/system
- system ↔ system
- AI/executor passage where separately authorized

Do not treat one table as universal relation authority.

### B2. Existing relation rails must be reused where valid
- `c3_env_native_connection` remains person↔person native relation authority.
- EnvPAC/environment bindings remain environment resolution evidence.
- initiative/operator bindings remain initiative/operator context evidence.
- OAR capability grants remain bounded execution authority.
- Do not manufacture a relation merely because a transport coordinate exists.

Create only the minimum additional generalized CanCom relation/context binding required where existing rails cannot express the relation.

### B3. Actor/context resolver
Implement a resolver that can answer, for a proposed passage:
- asserted sender
- resolved actor
- origin environment
- target/receiving environment
- relation reference and relation class
- audience role
- authorized transport adapter
- payload custody class
- optics/visibility standing
- return route where applicable

Unresolved or conflicting actor/relation/context => HLD.

### B4. Transport boundary
Transport carries payload/provider evidence only.

Cloudflare Email Routing / Workers may be used as transport precedent or adapter where appropriate, but:
- transport does not create relationship
- transport does not create authority
- transport does not create standing
- no real external correspondence is authorized by this OAR

### B5. Personal My Env CanCom boundary
Do not regress the personal My Env privacy correction.

Person↔person My Env communication:
- uses existing active `c3_env_native_connection`
- new message plaintext must never reach Registry or CanCom server custody
- new messages are device-encrypted before leaving the originating My Env
- ciphertext-only passage/custody remains required
- recipient without secure device => HOLD, never plaintext fallback
- Chazz-in-My-Env remains DNR / held pending its separate runtime proof

### B6. Notification
CanCom Notification remains a non-authoritative wake signal.
Notification may wake a resolved actor/executor but cannot carry execution authority.

## Objective C — Operator My Env OAR optics
Preserve the new operator-bound My Env Operations/OAR projection as optics only.

The surface may show:
- OAR key
- execution instance
- executor
- queue standing
- preflight standing
- requested action
- bounded execution summary
- OAR1/return standing
- model-resolution evidence standing

It must not expose:
- private communication payloads
- credentials
- private cryptographic material
- authority not already established in Registry

My Env optics do not create or alter OAR authority.

## Required proof
OAR1 must include:

1. Schema/source changes with exact migration/source references.
2. Generalized CanCom relation/context resolver proof for at least:
   - one existing person↔person relation
   - one bounded non-person relation (initiative/system or system↔system)
3. Proof that no relation is inferred from transport coordinates alone.
4. Proof that payload custody is no longer universally Drive-specific.
5. Proof that OAR return updates queue + process instance + transition + execution evidence consistently.
6. Proof that personal My Env plaintext remains blocked and E2EE boundary unchanged.
7. My Env operator OAR projection proof.
8. Model Resolution Evidence required by `oar_execution_profile_model_resolution_v1`.
9. External effects count.

## External effects boundary
Authorized:
- bounded Registry/DB mutations required for objectives
- bounded repository source mutations required for objectives
- internal runtime tests using non-external test fixtures
- My Env operator-only optics

Not authorized:
- real outbound email or correspondence
- public release/publication
- participant visibility widening
- credential scope expansion
- autonomous AI communication authority
- creation of relationships unsupported by Registry evidence
- deployment outside the existing c3 Field Git-connected deployment path unless separately authorized

## Return
Return OAR1 through:
`registry://cancom/oar1_return/cancom_runtime_passage_codex_004`

OAR1 must bind to:
- `oar2_cancom_runtime_20261001_004`
- `cancom_runtime_passage_codex_004`
- the exact immutable payload custody reference and SHA-256
- the actual selected model/fallback evidence
- actual execution/mutation/deployment/external-effect standings

## Governing invariants
- Communication may carry an instruction. Passage may deliver it. Neither creates authority to act.
- Executor identity is not model identity.
- Model version is runtime resolution state, not authority.
- Availability may change model selection but may not lower the capability floor.
- The relation is never governed; the environment is governed.
- Personal participant communication content is not Registry state.
