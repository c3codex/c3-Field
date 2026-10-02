# NotChazz OAR Pre-Dispatch Semantic Boundary v1

**Registry key:** `notchazz_oar_predispatch_semantic_boundary_v1`  
**Governed process:** `governed_object_passage_process_v4`  
**First enforced call site:** `cancom_oar_delivery_retrieval_v1`  
**Evaluator:** NotChazz  
**Consumer:** Registrar  
**Results:** PASS / HOLD / SEND  
**Standing:** active

## Purpose

This boundary sits between Registrar-resolved Registry semantics and executor delivery.

An executor may implement an already-resolved contract. An executor may not define missing normative semantics, infer authority, promote role/standing, determine an unregistered custody-admissibility rule, invent evidence-return requirements, or decide final disposition.

If an executor would need to decide **what a rule means** rather than **how to implement a registered rule**, the passage does not cross the executor boundary.

## Results

### PASS

Every semantic, authority, standing, effect-scope, custody-admissibility, evidence-return, optics-authority, and source-custody predicate required by the executor is already resolved in Registry and has explicit evidence.

PASS is a candidate passage result only. It creates no authority or standing.

### HOLD

Required registered evidence exists in principle but cannot be verified, or an active governed hold condition applies.

### SEND

Applicable authority, semantic meaning, role/standing distinction, custody admissibility, effect scope, optics ownership, or another normative predicate is unresolved or ambiguous.

SEND returns the matter to Registrar / the applicable authority resolver before OAR formation or executor delivery.

## NotChazz authority limits

NotChazz does not:
- create standing;
- create authority;
- create relationships;
- create or mutate governing process;
- mutate semantics;
- authorize external effects;
- make final disposition.

It evaluates boundary coherence only.

## Required predicate classes

- semantic authority
- actor / role / standing
- effect scope
- custody admissibility
- evidence-return requirement
- optics authority ownership
- source custody requirement

## Runtime enforcement

Registry table:

`public.c3ops_notchazz_oar_formation_evaluation`

Evaluation function:

`public.register_notchazz_oar_formation_evaluation_v1(...)`

CanCom delivery trigger:

`notchazz_cancom_oar_delivery_gate`

For a new `system_oar_queue` row under `cancom_oar_delivery_retrieval_v1` with `queue_status = approved_for_execution`, the trigger requires exactly one active NotChazz PASS evaluation bound to:

- the exact OAR key;
- the exact execution instance;
- the exact canonical OAR SHA-256.

Without that PASS, delivery fails closed with:

`HLD_NOTCHAZZ_OAR_FORMATION_BOUNDARY`

## OAR2 004 retrospective finding

OAR2 004 is recorded as **SEND** because the following normative predicates were unresolved before dispatch:

1. `initiative_operator_context_authority`
2. `payload_custody_provider_admissibility`
3. `model_resolution_return_enforcement`
4. `oar_optics_authority_ownership`

The OAR lifecycle authority and personal E2EE boundary were already resolved and were not SEND causes.

The 004 executor implementation and OAR1 remain historical evidence. The retrospective SEND does not erase or rewrite execution history; it identifies the pre-dispatch boundary disposition that should have occurred.

## Canonical invariant

**Registrar / Registry resolves what is true, allowed, required, and authoritative.  
NotChazz prevents unresolved semantics from crossing the boundary.  
Executor implements the resolved contract.  
OAR1 returns implementation evidence.**
