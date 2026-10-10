# OAR2 — c3Ops EnvPAC + Operator Operations Workroom UX PAC — 2026-10-09 — 001

## Identity and standing

- **OAR key:** `oar2_c3ops_envpac_operator_workroom_20261009_001`
- **Execution instance (proposed, not started):** `c3ops_envpac_operator_workroom_codex_001`
- **Operator:** `op044` — confirms design intent and scope in this conversation; **does not confer an executor PASS**
- **Formation:** Chazz / `c3_relational_ci_v1` — source-grounded candidate for Registrar review
- **Boundary evaluator:** NotChazz / `c3_notchazz_boundary_v1`
- **Registrar:** `c3_registrar_ci_v1` — source, custody, and formal Registry admission
- **Conditional executor:** Codex, only **after** exact Registrar resolution, NotChazz PASS, and the relevant operator-confirmed execution passage
- **Source system:** `c3_field`
- **Target environment:** `env_c3ops`
- **Parent Field EnvPAC evidence:** `c3envpac_field_v0_1` (independently existing and effective)
- **Requested output:** one independently qualified c3Ops EnvPAC + one private operator-facing Workroom `c3WebPac`, **not** three OPS PACs
- **Present standing:** `OAR2_CANDIDATE_FORMED_FOR_PREFLIGHT / SEND_SEMANTICS / HLD_EXECUTOR_DELIVERY`
- **CanCom:** conditional delivery **only after** the registered `cancom_oar_delivery_retrieval_v1` route and NotChazz exact-OAR PASS are verified; no send or execution is authorized by this file
- **Proposed return:** `registry://cancom/oar1_return/c3ops_envpac_operator_workroom_codex_001` — use only if Registrar confirms that this exact return route is admissible
- **External effects:** 0; **production mutation:** 0; **deployment:** none under formation/preflight.

This is a durable, versioned **OAR2 formation candidate**. It must not be called an approved-for-execution OAR, a registered PAC, or a Registrar/NotChazz runtime determination. A normative gap is **SEND to Registrar**, not a Codex design decision.

## 1. Exact objective

Establish the smallest separately governed **c3Ops operating experience** by reusing c3 Field's existing structures:

1. A c3Ops **EnvPAC**: govern the `env_c3ops` environment's own operating boundaries and UX/service references, without taking custody of source environments.
2. A **private Operations Workroom UX PAC**, **candidate type `c3WebPac`**: operator `op044` can see actionable state, resolve authorized work, request bounded interoperability, and inspect actual outcomes through c3Optics.

**UX determines the PAC shape.** No PAC is created merely because a screen, endpoint, NUG, worker, OPS mechanism, or operational mode was named. `OPERATE | INTEROPERATE | OBSERVE` are functions in the same governed Workroom experience.

## 2. Registered sources and current evidence (read-only inspection 2026-10-09)

- `public.c3_environment` has `env_c3ops`, `system_key=c3_field`, `environment_class=governed_operational_environment`, active and standing `governed_environment`. Its registered `canonical_parent_environment` is **`env_c3_community_connect`**; do not overwrite this registered environmental relation merely because c3 Field owns the proposed EnvPAC.
- `public.c3_current_state`: `current_env_c3ops_v1` is the initial current marker. **Its metadata still says `mgs_evaluation=held_env_c3ops_current_binding_missing` and `mgs_re_evaluation=pending_post_bind`.** The marker does **not** prove MGS post-binding PASS or a fully mature workroom.
- `public.c3_envpac`: **zero** rows for `env_c3ops` at this inspection. `c3envpac_field_v0_1`, by contrast, is effective, with owner and custodian `system:c3_field`, and `custody_provider=c3_field`. The Field root is source evidence, not a clone template conferring rights.
- `public.c3_pac`: zero rows selected by `owner_environment_key=env_c3ops`; also verify any PACs indirectly associated via alternative relations before creating a duplicate.
- Effective `pac_contract_envpac_v1` / type `EnvPAC`: requires exact key, environment, version, standing, owner/custodian type/key, custody URI/provider, architecture version, effective flag, portability.
- Effective `pac_contract_c3webpac_v1` / type `c3WebPac`: requires the registered envelope attributes and **at least one `c3_pac_member` `record` with role `presentation_manifest`**; resolver `FREE`, fail-closed, renderer-only. Its release policy recognizes `private` as an eligible presentation state, but **private** alone does not grant runtime/admission authority.
- `system_process_registry.c3ops_mgs_gate_v1` exists and is operationally available, **not** proof of this environment's resolved post-bind MGS.
- `governed_object_passage_process_v4` is active. NotChazz registered evaluator requires exact OAR key + execution instance + canonical OAR SHA-256 PASS before approved-for-execution CanCom delivery.
- Existing UX source: `src/c3ops/c3OpsRoutes.ts`, `src/c3ops/C3OpsDoor.tsx`, `functions/api/c3ops/manifest.ts`. Existing operator portals: Relational Operations (Lapzuli), Systems Access (Current, Registry; Build/Work held), c3Optics. They are currently **routes and capabilities**, not proof of Workroom PAC admission.
- The operator's own `My Env` has a **different effective individual EnvPAC**, with owner-private Operations, Chazz, CanCom, Directory and other primitives. These remain personally governed and are **not** candidates for transfer to c3Ops.
- Lapzuli maintains independent distribution/route/execution proof and draws from source-owned PubPAC/CampaignPAC via registered relations. It is the **first reference workbench module**, not an additional c3Ops-owned publication PAC.

## 3. Operator-determined ownership and custody

The operator has explicitly designated **c3 Field** as both **system-level owner and custodian** for the new c3Ops EnvPAC.

**Proposed EnvPAC tuple for Registrar qualification (not yet registered):**
- `env_key=env_c3ops`
- `owner_subject_type=system`; `owner_subject_key=c3_field`
- `custodian_subject_type=system`; `custodian_subject_key=c3_field`
- `custody_provider=c3_field` is a **candidate** from parent evidence; verify an exact admissible c3Ops object custody provider and URI at Registrar.
- `envpac_key`, `version`, `architecture_version`, `portable`, `is_effective`, `standing` and exact `custody_uri` **must be resolved against the active contract and collision preflight, not invented by Codex**.

Field system ownership does not revoke the separate registered `env_c3ops` parent-environment relation, grant broader participant or institutional visibility, or transfer ownership of any personal/institutional PAC, publication, source Current or Commons property. Legal-entity rights remain distinct from system-level Registry custody.

**Proposed Workroom PAC tuple for Registrar qualification:**
- `pac_type=c3WebPac`; `contract_key=pac_contract_c3webpac_v1`; only the qualifying **new c3Ops EnvPAC** may become its `envpac_key`.
- **Private operator** visibility and explicit `op044` admission; **no anonymous/public release**.
- Exactly one source-registered `presentation_manifest` record as required by the effective type contract, with independently verified source/custody and the renderer's authority/effect boundaries.
- `pac_key`, owner/custodian, `custody_uri`, release/execution/formation standing, integrity, version and other required fields are unresolved until Registrar registration preflight.
- The Workroom **renders** eligible source references and permitted actions. It cannot own source Current, infer consent, grant NUGs, determine OAR semantics or publish.

## 4. UX contract: one protected Operations Workroom

**ENTER:** authenticate `op044` and resolve specific environment/session/role/capability, current state and applicable source/Registry relations. A logged-in operator is not by itself proof of object admission.

**OPERATE — “What can move now?”** Surface eligible work and holds. Present context, constraints, exact target, review, confirmation and preflight before an effect. Reuse existing actions such as Lapzuli resolve/preflight/dispatch **only through their independently qualified existing gates**. No blanket enablement.

**INTEROPERATE — “What can these systems do together?”** Present admissible origin-to-service relations, ownership and custody, available native NUG bindings/FREE/CanCom/Calendar/Directory as actually authorized. User-facing requests are not service admission. Never copy participants' PACs or Measures' institutional records into c3Ops state.

**OBSERVE — “What actually happened?”** Render `c3Optics` evidence: source-authoritative Current/CURRENT, action/receipt standing, acceptance vs external platform visibility, HLD, DNR, uncertainty, stale/partial readbacks, reason codes and next eligible step. No independently manufactured ACT, service success or Current advance.

**CROSS-CUTTING:** Show the distinction between intent → proposed act → authorized act → receipt → independent acceptance → persisted Current. Preserve current Field non-scarcity/participant-data and commercial-entry boundaries. Responsive keyboard/screen-reader/reduced-motion interaction and explicit private failure states are acceptance requirements.

**LAPZULI FIXTURE:** Demonstrate all three modes with existing publication/distribution work, keeping originating PubPAC, CampaignPAC, editorial authority, public speaker and exact asset/route/evidence custody. Provider accepted ≠ platform proof; readiness ≠ dispatch. Use real eligible objects at validation; synthetic fixtures may establish negative cases without implying live external success.

## 5. Phase A — mandatory preflight (read-only; currently admitted)

The first executor-eligible activity is **not PAC insertion**. Registrar and NotChazz must return a predicate matrix:

**PF-01** Source and role: verify the `env_c3ops` authority/source record, registered environment parent, Field root EnvPAC, operator role and distinct system ownership/custody assignment.

**PF-02** MGS: independently re-evaluate `c3ops_mgs_gate_v1` against post-bind state; evidence must resolve the historical `held_env_c3ops_current_binding_missing` / `pending_post_bind` metadata, or retain HLD. Do not rewrite the historical hold as if it never existed.

**PF-03** PAC contracts: read effective EnvPAC and c3WebPac contracts and required attributes/member roles; identify exact source document(s), architecture version, private release semantics, admission controls and custody URI. Confirm `c3WebPac` is allowed as this **private operator Workroom**, not assume a public web release.

**PF-04** Collision and prior state: search all registered EnvPAC/PAC/related records and current implementation/custody paths for already formed or partially formed c3Ops objects. Exact equivalent standing -> reuse; mismatched/partial -> HLD and return key-by-key evidence; no overwrite/upsert/delete.

**PF-05** Own vs reference: preserve source publication, operator My Env, Measures Registry, c3 Field FieldPrinciplePACs, Lapzuli, NUGS and c3Optics custody; prove minimum actor visibility per origin. c3Ops may store only its own UX/presentation contract and permitted refs.

**PF-06** Execution and effects: resolve the exact existing OAR/Registrar/CanCom process, correct `oar2_boundary` role-call path, NotChazz predelivery evaluator, operator confirmation, exact effect scope, negative authorization cases and OAR1 custody route. No invented role-call class or auto-PASS.

**PF-07** UI and Optics: inspect current operator source, registered host and middleware auth, source-backed versus hardcoded state, private admission, evidence provenance and negative/held readback. Confirm no active c3Ops Worker shell needs to be recreated.

**PF-08** Return a complete PASS/HLD/SEND matrix with evidence source paths, keys, findings, decisions needed, no-effects counters, canonical OAR SHA-256 and an explicit **go/no-go**. If any normative source/custody/effect requirement is unresolved: **SEND to Registrar, do not dispatch to Codex for implementation.**

### Current pre-dispatch finding

**PASS:** operator's ownership intent; Field parent owner/custodian pattern; existing c3Ops environment and initial Current; both effective PAC type contracts; real UX/routes; active governing process framework.

**SEND:** exact c3Ops-specific EnvPAC authority/custody URI, registered eligibility for private Workroom `c3WebPac`, source/actor/effect/admission semantics and prospective PAC identities; Registrar must adjudicate. The `canonical_parent_environment` is registered as c1 and must not be silently reinterpreted.

**HLD:** post-bind MGS re-evaluation is pending by persisted metadata; effective c3Ops EnvPAC is absent; Workroom PAC absent; actual NotChazz exact-OAR PASS and eligible OAR2/CanCom execution route have **not** been obtained.

Thus: **NO PHASE B, NO CODEx EXECUTOR DELIVERY until all applicable predicates pass.**

## 6. Phase B — bounded formation, only upon an actual PASS

Upon Registrar's approved exact identity/custody/contract disposition, NotChazz PASS for the immutable canonical OAR body (hash included), and explicit operator execution confirmation:

1. Reserve/admit the one exact c3Ops EnvPAC according to registered `pac_contract_envpac_v1` and Registrar registration process, using **Registrar-resolved** tuple. No new system/environment/Current, no cloned Field EnvPAC, no inherited unrelated grants. If the existing source is equivalent, reuse and report rather than re-register.
2. Admit **one private** operator Workroom `c3WebPac` under that EnvPAC through existing PAC-registrar mechanics, with required `presentation_manifest` record and custody/source proof. No new PAC types, publication assets or personal profile ownership.
3. Connect existing `/relational-operations`, `/systems-access`, `/c3optics` and Lapzuli as **modules or views** to the admitted Workroom contract, not parallel ownership surfaces. A DesignPAC is **not** included and stays held for subsequent UX design authority review.
4. Scope the work to nonproduction implementation/fixtures and contract validation on a dedicated Codex branch. Separate explicit release authority is required for production merge, runtime deploy, migration/apply, external messaging or distribution; do not infer those from OAR2 formation.
5. Exercise positive admission and negative cases (wrong actor, missing EnvPAC/Current, absent consent/visibility, stale evidence, missing NUG/effect authority, insufficient source/custody, no platform proof, no confirmation, wrong hostname). Demonstrate bounded optics with zero false ACT/Current advances.

If later preflight finds Phase B would require previously unresolved normative decisions, STOP/SEND; do not patch semantics into execution.

## 7. Explicit exclusions

No public c3Ops entry, no unrestricted admin portal, no mass participant list, no transfer of personally owned PACs, no Measures Registry commercial-custody takeover, no Field C3 Key admission, no C3 creation release, no new standalone Lapzuli/CanCom/Directory/NUG/Optics/Worker, no inferred c3 Field standing, no retroactive changes to Current/evidence, no auto-dispatch, no prod DB migration, no deployment, no external publication or financial effects. Preserve every pre-existing OAR and provenance record.

## 8. Required OAR1 evidence return

- Exact canonical OAR2 GitHub path/ref/commit and **SHA-256** (as used by NotChazz).
- Registered source references, authority/role-call evidence, NotChazz decision **on this exact OAR SHA**, operator confirmation and preflight matrix PF-01…PF-08; all SEND/HLD reasons.
- Prior-state collision checks for `env_c3ops`, EnvPACs, PACs, effective contracts, presentation members, current, MGS and UI source.
- Exact confirmed `EnvPAC` and `c3WebPac` identities, owner/custodian, custody URI/provider, private release scope, manifests and integrity proofs, **only if actually formed**.
- Tests (positive/negative), c3Ops/Lapzuli/Optics authority and return readback, host/auth/mobile/accessibility behavior, unchanged participant/Measures/PubPAC custody.
- Schema/code changes with paths+commits and applied/held standing; new entries count; Current version changes; external effects; distribution sends; provider receipts; deployment status.
- Clear return **`PASS` / `HLD` / `SEND`** with next eligible action and retained evidence. Return through the existing Registrar-approved OAR1/CanCom route, never an invented return.

## 9. Source/custody references

- Operator-approved Registrar UX PAC determination: [Google Doc](https://docs.google.com/document/d/14yohFfjTs0Q9-XcW55To2SC_5yyjXrtsu66WycQovcA/edit)
- OPS functional refinement: [Google Doc](https://docs.google.com/document/d/1_I5t70K7vG33RAUOh5DGoy68Xq9zKSMUvbBOW7rS3S8/edit)
- c3Ops working ledger: [Google Doc](https://docs.google.com/document/d/1i6ikO-i8SYISOuUEtz7oIzXAy1uiVyPyEBrLG1pKwEE/edit)
- c3Ops source: `src/c3ops/C3OpsDoor.tsx`, `src/c3ops/c3OpsRoutes.ts`, `functions/api/c3ops/manifest.ts`.
- PAC source contract: `supabase/migrations/20260923211600_pac_base_contract_v1_registry_foundation.sql`, effective Registry rows `pac_contract_envpac_v1` and `pac_contract_c3webpac_v1`.
- NotChazz pre-dispatch contract: `docs/registry/notchazz_oar_predispatch_semantic_boundary_v1.md`.
- Lapzuli source-custody separation: `functions/_lib/lapzuli-projection-resolution.ts`.
- Existing NUG/FREE contract: `docs/c3ops/nugs-runtime-foundation.md`.

### Formation disposition

**OPERATOR OBJECTIVE: CONFIRMED.**  
**OAR2 DOCUMENT: FORMATION CANDIDATE / DURABLE SOURCE.**  
**REGISTRAR SEMANTICS: SEND.**  
**MGS + EXECUTION: HLD.**  
**NOTCHAZZ PASS: NOT EVALUATED.**  
**EXTERNAL EFFECTS = 0; PRODUCTION DB MUTATION = 0; OAR2 EXECUTOR DISPATCH = 0.**


## October 10 Registrar precedence correction — owner-resolved

**CONTROLLING LATER OPERATOR DIRECTIVES.** The original OAR2 001 has never obtained executor authority; its early PF-02 sentence requesting `c3ops_mgs_gate_v1` evaluation against post-bind c3Ops state is now **superseded**. Live Registry establishes that `c3ops_mgs_gate_v1` is MAP/SEAT-consumer-only and cannot be used for this new EnvPAC's target-specific MGS. This source correction is a governance constraint on interpreting older numbered steps; preserve old text as historical provenance, do not dispatch its now-known-invalid assertion.

**Target-bound Current MGS FOUND, not absent:** existing `public.c3_current_evidence_ref.current_evidence_env_c3ops_target_bound_mgs_v1` attests target MGS `447ea3f04a53b474535e8ec234fe7e5a8e177362aabfdb76ebf3f8adecdb1025` under Google Drive custody `1-maWl03MTkHDqUuI8fhfB3rJR2exzwZK`. September 13 `oar1_env_c3ops_mgs_satisfied_op044_20260913_001` satisfies its **initial Current prerequisite only**. The current state `pending_post_bind` remains an independent, unsatisfied later MGS requirement after EnvPAC formation.

**Candidate parent c3Ops EnvPAC formation source now explicitly identified and integrity-proven:** `c3codex/measures-of-inanna-governance` path `governance/c3ops_parent_envpac_formation_source_custody_proof_20261010.md`, immutable commit `1a42d15de0fbc35e91acae9efe227d63ef81462b`, verified SHA-256 `0d06145af037e149eaf5b837a3af9aaff0b3ba149464f808b91cad78bef7c58b` (8061 bytes). The source exists and its provenance can be verified; the eventual c3Ops EnvPAC object and logical `c3://envpac/...` custody remain **unformed**. This precise distinction replaces the earlier open-ended semantic ask about who owns the source: op044 identifies system `c3_field` as both owner and custodian, and the distinct bounded EnvPAC formation is warranted for the existing `env_c3ops`.

**No Lapzuli child:** per op044, Lapzuli is a named service, not the owner of source work and not an additional `env_c3ops_lapzuli`/EnvPAC/Current. One private c3Ops Workroom (type `c3WebPac`, conditional on independently custodied `presentation_manifest`) remains the maximum presently warranted operator UX PAC. No extra PAC for OPS mode, NUG or route.

**Binding oldest-first ordering:** first resolve **this** original 001's formation semantics/source and obtain its legitimate NotChazz/Registrar admission for the narrowly warranted parent EnvPAC; no operational effect before true binding. Later corrected 031 is the explicit source of postbind MGS/operator relation preconditions; only after its OAR1 return may 032 read-only Lapzuli status be admitted; only then M3-09/030 operational Workroom can execute. Finally Spark_PAC #033 remains second workstream, no parallel Codex dispatch. A single OAR cannot turn post-formation observations into a pre-formation proof; Gate A warrant and Gate B actual MGS are distinct evidentiary moments.

**Current effect ceiling:** no actual parent `c3envpac_c3ops_v0_1` exists, op044 has no env_c3ops operator binding, no post-EnvPAC MGS PASS, no independent Workroom private manifest PAC, no per-OAR Executor/Registrar delivery capability and no actual CanCom delivery. Those are **governed HLD**, not semantic freedom to invent them. Recompute this amended file's exact SHA-256, rerun NotChazz, and only progress through an admitted exact source and bounded return; original October 9 evaluation SHA and SEND cannot be reused.

**Current amendment = SOURCE CHANGE ONLY, no Registrar PAC/EnvPAC registration, no Current mutation, no Codex deployment.**
