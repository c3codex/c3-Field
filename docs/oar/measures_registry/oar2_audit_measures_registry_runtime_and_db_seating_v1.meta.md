---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_db_audit
title: OAR2 — Audit Measures Registry Runtime and DB Seating
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Audit Measures Registry Runtime and DB Seating

## OBSERVED

Measures Registry runtime is showing repeated seam failures:

- Paths now advance correctly
- next surfaces do not reliably advance
- assessment media/container behavior is inconsistent
- assessment seating recently failed from stale runtime field
- duplicate assessment question drift was found and repaired
- About Measures Registry encounter is incomplete
- Codexstone Seal standing is unclear
- unDrifted runtime has been partially repaired
- public route sequence remains uncertain

This indicates the system needs a full runtime and DB seating audit before more design or content work proceeds.

## ALIGNED

Measures Registry must remain DB-first.

Frontend renders seated state only.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
Claude executes.
src renders.

Audit must distinguish:

- DB seating issue
- route/transition issue
- media mapping issue
- release/access state issue
- renderer issue
- stale/deprecated implementation issue
- design-only issue

Do not patch symptoms without identifying ownership.

## ROUTED

Claude shall audit the full Measures Registry runtime and DB seating.

### 1. Runtime Surface Inventory

Produce a complete inventory of all Measures Registry public/runtime surfaces currently reachable from:

- root
- path_choice
- Assess the Environment
- Understand the Environment
- assessment flow
- marble passage
- MAP/findings surface
- About Measures Registry
- unDrifted
- Connect

For each surface report:

- surface key
- route/path if public
- renderer/component
- DB registry source
- encounter definition source
- media roles used
- release/access state
- next surface / transition target
- whether advance behavior works

### 2. DB Seating Audit

Audit relevant DB seating for:

- measures_registry
- measures_encounter_def
- measures_release_state
- measures_media_map
- measures_publication_registry
- measures_publication_dispatch
- measures_iis_eval_gate1_capture
- any assessment/runtime tables used by Measures Registry

For each required public surface, identify:

- seated
- missing
- stale
- duplicated
- deprecated
- malformed
- component-owned

### 3. Transition Audit

Audit all active navigation and advance behavior:

- intro hook to path_choice
- path_choice left to eval_passage
- path_choice right to structure_passage
- eval_passage continue/video-end to assessment
- assessment submit to contact capture
- contact capture to marble passage
- marble passage to findings/MAP
- structure_passage continue/video-end to next Understand surface
- About to unDrifted
- unDrifted to Connect where seated

Return exact broken transition points.

### 4. Media Audit

Audit every media role used in Measures Registry runtime.

For each media role report:

- role name
- DB mapping
- bucket/storage URL
- renderer use
- load status if verifiable
- fallback behavior
- missing asset/mapping if any

Do not replace media without evidence.

### 5. Deprecated / Stale Logic Audit

Search runtime and migrations for stale terms or deprecated behavior, including but not limited to:

- evaluate_structure_path as authority
- old 5-question assessment
- stale evaluation handlers
- stale result generation
- confirmation_email_state
- duplicated ai_deployment_status
- connect_src
- hardcoded next surfaces
- hardcoded public truth
- SaaS/product framing
- chamber/internal terminology leaking publicly

Return exact file and line references where found.

### 6. Public Flow Verification

Verify intended public flows:

Assess flow:

Root
→ intro
→ Paths
→ Assess the Environment
→ eval_passage
→ assessment
→ contact capture
→ marble passage
→ findings / MAP recommendation

Understand flow:

Root
→ intro
→ Paths
→ Understand the Environment
→ Codexstone Seal / registry explainer if seated or in active scope
→ About Measures Registry
→ unDrifted
→ Connect role call

If current DB standing does not match these flows, report mismatch.

### 7. Repair Boundary

This OAR2 is primarily audit.

Claude may perform small safe repairs only when all are true:

- ownership is clear
- fix is directly necessary to complete audit verification
- fix does not create new public authority
- fix does not change content meaning
- fix does not introduce commerce, certification, conversion, SEAT, DAO, or c3 Key standing
- fix is documented in OAR1

Examples of allowed safe repairs:

- remove stale deprecated runtime field
- correct broken next_surface where destination is already seated
- fix typo in media role lookup
- restore broken renderer binding to existing DB field
- repair transition handler that already has seated target

Anything larger must be returned as recommended OAR2 follow-up.

## CLAUDE ROLE

Claude acts as Measures Registry implementation executor.

Claude may:

- query DB
- inspect migrations
- inspect runtime
- inspect media mappings
- inspect route graph
- validate build
- perform safe in-scope repairs
- return evidence
- raise NotChazz flags

Claude may not:

- redesign public surfaces during audit
- invent authority
- hardcode truth
- create new public claims
- publish commerce standing
- publish certification standing
- publish conversion standing
- publish SEAT standing
- publish DAO standing
- publish c3 Key standing

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- frontend owns truth
- route sequence is hardcoded against DB standing
- media mapping is missing but renderer hides failure
- release/access state conflicts with visible runtime
- deprecated routes are still active
- public flow depends on unseated records
- assessment contract drifts again
- Understand path lacks seated sequence
- About/Codexstone/unDrifted/Connect are conflated
- runtime cannot be audited from DB state

## VALIDATION

Success is achieved when OAR1 returns:

- full runtime surface inventory
- full DB seating audit
- full transition map
- full media role audit
- stale/deprecated logic list
- public flow verification
- exact broken points
- safe repairs performed, if any
- required follow-up OAR2 list
- build result

Expected OAR1:

docs/oar/measures_registry/oar1_audit_measures_registry_runtime_and_db_seating_v1.meta.md
