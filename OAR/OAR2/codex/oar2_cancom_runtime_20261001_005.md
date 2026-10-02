# OAR2 — Correct CanCom Authority Resolution + Custody Admission + Return Evidence Enforcement — Codex — 2026-10-01 — 005

## Route
Operator: op044  
Registrar: Chazz — Registrar  
Executor for this instance: Codex  
System: c3ops / CanCom  
Execution instance: cancom_runtime_passage_codex_005  
OAR key: oar2_cancom_runtime_20261001_005  
Standing: EXECUTE_BOUNDED_AFTER_NOTCHAZZ_PASS

## Formation authority
This correction OAR is formed only after Registrar semantic closure of the three omissions found in OAR2/OAR1 004.

The executor MUST implement the already-resolved Registry contract and MUST NOT redefine, infer, widen, or substitute the governing semantics.

Resolved Registry predicates:
- initiative operator context authority → `process:cancom_initiative_operator_context_authority_v1`
- custody provider admissibility → `process:cancom_custody_provider_registry_v1`
- required model-resolution return evidence → `process:oar1_model_resolution_return_contract_v1`
- Registrar semantic closure → `process:registrar_semantic_closure_v1`
- pre-dispatch semantic boundary → `process:notchazz_oar_predispatch_semantic_boundary_v1`

NotChazz PASS for this exact OAR key, execution instance, and SHA-256 is required before delivery.

## Source authority and custody
Registry manifest + CanCom passage establish delivery, identity, authority, standing, and return relation.

Canonical OAR payload custody is GitHub using the registered provider object:
`process:cancom_custody_provider_github_v1`

GitHub custody does not create authority or standing.

Implementation source MUST be placed into durable remote GitHub custody on a non-production branch. No production merge or deploy is authorized by this OAR.

## Execution Profile
Task class: authority_sensitive correction / closeout  
Required tools: repository source access; Supabase schema/query/mutation; bounded runtime verification  
Required context capacity: high  
Required reasoning level: high  
Authority sensitivity: high  
Minimum capability floor: high-reasoning code/system execution with repository + database access  
Executor binding: Codex for this execution instance only

## Model Resolution Policy
Source process: `oar_execution_profile_model_resolution_v1`  
Return contract: `oar1_model_resolution_return_contract_v1`

Preferred model/tier: strongest qualified Codex execution model currently available  
Fallback permitted only for registered availability triggers: usage_exhausted, quota_exhausted, rate_limited, temporarily_unavailable  
Fallback candidate must still satisfy the minimum capability floor.  
Below-floor disposition: HLD_MODEL_CAPABILITY_UNAVAILABLE.  
Model identity does not create authority.

OAR1 model-resolution evidence is mandatory and must comply with the Registry return contract. If an exact runtime SKU is not exposed, report an explicit unverified/opaque model state rather than inventing an exact SKU.

## Objective A — Enforce initiative operator-context authority
Implement `cancom_initiative_operator_context_authority_v1` in the CanCom context resolver.

For person↔initiative resolution:

1. A participant relation may resolve participant audience/context only.
2. A requested `audience_role=operator` may resolve only from an active first-class row in `c3_initiative_operator_binding` that satisfies the registered binding requirements.
3. Initiative formation metadata, participant standing, participation relations, requested optics, or transport coordinates are NOT sufficient operator authority.
4. Missing/conflicting initiative-operator binding => `HLD_OPERATOR_CONTEXT_UNRESOLVED`.
5. Do not create an operator binding or operator standing merely to make a resolver probe pass.

Required regression proof:
- an existing valid initiative operator binding resolves operator context;
- a participant relation does not resolve operator context;
- Million Dollar Mission currently has no initiative-operator binding row, so an operator request there must fail closed rather than infer authority.

## Objective B — Enforce registered custody-provider admissibility
Implement `cancom_custody_provider_registry_v1` in CanCom OAR delivery and pickup.

Initial admitted provider objects:
- `cancom_custody_provider_github_v1` → provider_key `github`, accepted prefix `github_file:`
- `cancom_custody_provider_drive_v1` → provider_key `drive`, accepted prefix `drive_file:`

Required behavior:

1. Provider syntax alone is never sufficient.
2. Delivery and pickup require an exact active registered provider object.
3. Custody reference must match a registered prefix/class for that provider.
4. Provider registration creates neither authority nor standing.
5. An arbitrary syntactically valid provider MUST fail closed with `HLD_CUSTODY_PROVIDER_UNREGISTERED`.
6. Registered provider with mismatched reference class/prefix MUST fail closed with `HLD_CUSTODY_REFERENCE_CLASS_MISMATCH`.
7. Preserve legacy 003 Drive pickup compatibility and 004 GitHub pickup compatibility under the new registered-provider rule.
8. Do not add additional providers without separate Registry admission.

## Objective C — Enforce model-resolution evidence before OAR1 lifecycle mutation
Implement `oar1_model_resolution_return_contract_v1` in `register_cancom_oar_return_v1`.

When the originating queue has:
`automation_permissions.model_resolution_evidence_required=true`

the return path MUST validate a structured `model_resolution_evidence` object before any lifecycle mutation.

Required fields:
- preferred_model_or_tier
- selected_model_or_explicit_unverified_state
- fallback_used
- fallback_level
- fallback_reason
- capability_floor_passed
- tools_available
- context_fit
- execution_result

Rules:
1. `capability_floor_passed` must be true.
2. Missing or malformed required evidence => `HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED`.
3. Validation failure must produce zero lifecycle mutation across queue/process/transition/execution-evidence/custody-return rails.
4. Do not require an exact model SKU when runtime does not expose one.
5. Preserve exact originating OAR2/execution-instance/return relation.

Required negative proof:
- attempt a return with required model evidence absent or malformed;
- prove HLD;
- prove no lifecycle mutation occurred.

## Objective D — Reconcile durable remote source custody for 004 + 005
The OAR004 OAR1 cited local source commit:
`9d257dfbb60db73c7b74b1ac0250ebe3b38dc4f9`
on local branch:
`codex/cancom-004`

That commit was not pushed and is not durable remote source custody.

For this correction:

1. Fetch current `origin/c3field` and preserve all newer canonical source changes.
2. Preserve/port only the relevant unpushed 004 implementation changes that remain valid under the corrected Registry semantics.
3. Apply the 005 corrections.
4. Do not overwrite or revert newer `c3field` source changes.
5. Push the reconciled implementation to remote non-production branch:
   `codex/cancom-005`
6. Do NOT merge that branch into `c3field`.
7. Do NOT deploy.
8. OAR1 must return the resolvable remote commit SHA, branch, and exact changed source/migration paths.

If the original local 004 branch is unavailable, reconstruct only the implementation required by this OAR from current canonical source + live Registry semantics/evidence; do not invent historical source custody.

## Objective E — Preserve established boundaries
No redesign of CanCom is authorized.

Preserve:
- person↔person native relation authority;
- personal My Env ciphertext-only / no-plaintext-fallback boundary;
- NotChazz pre-dispatch PASS/HOLD/SEND boundary;
- direct NotChazz report consumption by Optics as border-health telemetry;
- c3ops as operational/optics authority source;
- My Env as downstream projection only;
- operator-only Operations/OAR optics without private payload exposure;
- transport does not create relation, authority, or standing;
- capability does not imply authority.

## Required proof
OAR1 must include:

1. Exact schema/source/migration changes.
2. Operator-context positive and negative regression proof.
3. Provider-admission positive proof for GitHub and Drive.
4. Unregistered-provider negative proof.
5. Provider-prefix mismatch negative proof.
6. Model-evidence-required negative proof with zero lifecycle mutation.
7. Successful return proof with valid model evidence.
8. 003 and 004 pickup compatibility proof.
9. Personal E2EE/no-plaintext regression proof.
10. Durable remote source custody proof for branch `codex/cancom-005`.
11. Model Resolution Evidence satisfying `oar1_model_resolution_return_contract_v1`.
12. External effects count.

## External effects boundary
Authorized:
- bounded Registry/DB mutations required to implement these already-resolved contracts;
- bounded repository source mutations;
- push to remote non-production branch `codex/cancom-005`;
- internal tests using non-external fixtures.

Not authorized:
- production branch merge;
- Cloudflare or other deployment;
- public release/publication;
- real outbound correspondence;
- participant visibility widening;
- credential scope expansion;
- creation of operator standing or relationships unsupported by Registry evidence;
- addition of custody providers not already registered;
- semantic reinterpretation of the Registrar-resolved predicates.

## Return
Return OAR1 through:
`registry://cancom/oar1_return/cancom_runtime_passage_codex_005`

OAR1 must bind to:
- `oar2_cancom_runtime_20261001_005`
- `cancom_runtime_passage_codex_005`
- exact immutable payload custody reference and SHA-256
- exact NotChazz pre-dispatch evaluation
- actual selected model/fallback evidence
- actual execution/mutation/deployment/external-effect standings
- remote branch `codex/cancom-005` and resolvable remote commit SHA

## Governing invariants
- Registrar resolves semantics; executor implements the resolved contract.
- A predicate marked resolved without a Registry evidence reference is not resolved.
- NotChazz evaluates before delivery; only exact-SHA PASS admits executor passage.
- Optics observes NotChazz reports; Optics does not create passage authority.
- Communication may carry an instruction. Passage may deliver it. Neither creates authority to act.
- Executor identity is not model identity.
- Model version is runtime resolution state, not authority.
- The relation is never governed; the environment is governed.
- Personal participant communication content is not Registry state.
