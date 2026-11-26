# OAR1 — bounded native passage implementation

2026-11-26 · op044 / Chazz / Codex · env_c3ops · existing OAR2 #33 / PR #114.
Execution instance: codex_src_native_lifecycle_20261126_001. Implementation base: 4d681ef387215a4867c6acc7427c41128b44391c.

## Objective

Execute the four-stage native PAC/NUG package toward governed Field and participant production. Exact instruction acknowledged: governance commit a09ea967e54fab247fa8e9cfa182b8b47b68c156, package blob 51f128a7780ee5b0acc57537b95e615d987d868f. All six pinned inputs are retained byte-for-byte and verified in custody-index.json. SRC v1.4 and Model v1.1 control; earlier proposed third-protocol approaches are not implemented. GitHub delivery in PR #114 comment 7200173724 was directly verified. This return does not claim native CanCom dispatch.

## Action and observed result

| Effect | Actual implementation / evidence | Standing |
|---|---|---|
| Integrity foundation | Exact delivered SQL, isolated PostgreSQL: 16 checks, cross-protocol uniqueness, direct/inherited TRUNCATE, replay, history preservation, concurrent contender and lock contention refusal/rollback. No live execution. | ACT isolated qualification only |
| Owner authorization | Existing three ProfilePAC write functions now have candidate session/owner/EnvPAC/grant/environment checks at the native effect boundary. Server forwards its resolved cookie session, ignoring submitted identity/header. SHARE locks on session/grant tables cover concurrent INSERT and withdrawal as well as updates; EnvPAC row lock serializes owner writes. Existing function identities retained. Public/anon/authenticated EXECUTE removed in candidate; service-role access only. | ACT candidate and scoped tests |
| Exact contract adapter | Reproduced actual formation failure `profile_pac_incomplete`: admitted ProfilePAC contract contains two named EnvPAC chain requirements; generic evaluator treats both as untyped PAC relation counts. Candidate existing evaluator qualifies those exact chain predicates; unknown named rules refuse. No fake relation/Registrar receipt added. Existing ProfilePAC chain trigger retained and exercised. | ACT isolated repair |
| Post-write check | Personalization candidate evaluates persisted contract state before returning; mismatch raises and rolls back. This is completeness confirmation, not a claim of full SRC/NotChazz qualification. | ACT scoped check |
| CURRENT → FREE | Existing owner presentation FREE candidate derives My Stash descriptors from exact registered binding, matching owner/environment/CURRENT and existing NUG resolver. Only nug key, service label, effect none and CURRENT key projected. No invocation or accrual. Renderer requires FREE availability before displaying My Stash; design alone cannot grant it. | ACT candidate; full native acceptance DNR |
| Native readback | Existing DesignPAC remains registrar_v1/effective, digest 580261dfb4eacf5b5599d68b84b64c48f20655a64485625f383244a1c0a1b004. Both active NUGs still return resolved_for_nug through read-only native resolution. Public-root FREE returns DNR / registered_snapshot_not_resolved. | ACT bounded reads; root DNR |
| Hosted readback | Anonymous GET of public root, public presentation API and my.c3field.online returns 200, with hashes in hosted-readback.json. No candidate deployed and no authenticated owner/enrollment acceptance asserted. | ACT reachability only; production acceptance DNR |

52 passing scoped checks: integrity 16; owner session/contract/chain 18; owner FREE 13; API/presentation/withdrawal-notice tests 5. These are executor-run tests, not independent Registrar/security acceptance. PostgreSQL fixtures use synthetic owners, sessions and registrations. FREE test uses the actual existing NUG resolver but explicitly doubles its service preflight: this does not qualify the full native NUG chain. Profile tests use actual native evaluator, contract, truth/read functions and ProfilePAC chain trigger; other production triggers/constraints and the complete protected writer chain are not reproduced.

Commands: `node governance/qualification/native-lifecycle-20261126/qualify-integrity.mjs`; `qualify-profile-session.mjs`; `qualify-current-free.mjs` in that directory; `node --import tsx --test functions/api/my-environment-profile.test.ts functions/_lib/current-state-presentation.test.ts functions/api/my-environment-pacs.test.ts`. Test results and executable fixtures are retained.

Targeted TypeScript for changed production modules is checked separately. Full application typecheck is not clean: installed TypeScript 5.9.3 rejects existing ignoreDeprecations=6.0; overriding to 5.0 exposes existing presentation type mismatches and Node test type/library errors. No full-build PASS is claimed.

## Thirteen functions and production boundaries

All thirteen pinned pg_get_functiondef MD5 drift identifiers matched fresh native readback before edits; see native-functions.json and custody-index.json. These identify source drift, not governed admission. Only `free_resolve_my_env_current_state_v1` among that set has a new candidate here. Other twelve bodies are preserved; their complete acceptance obligations remain open. Additional changes reuse existing owner writer functions and c3_pac_evaluate; no new function, protocol, ledger or service is introduced.

**DNR — full PAC passage remains unresolved.** Session checks and contract completeness do not bind exact proposed content/operation and both SRC responsibilities to the NotChazz boundary, protected Registry writer and post-write SRC/FREE state. Caller-set context protection in existing guards has not been replaced. General native immutable succession, atomic retirement, forged-evidence refusal and full trigger/caller compatibility are not qualified. The delivered global successor index is necessary containment, not proof of this complete passage. Existing hardened PAC guards continue to refuse unauthorized content rewriting. This candidate does not bypass them or claim that legacy owner formation is newly hardened registration.

**DNR — full NUG acceptance remains unresolved.** Need actual native preflight with authenticated owner FREE, exact CURRENT evidence/replay and independent receiving SRC/reciprocal acceptance for a synthetic bilateral NUG. Current preflight reads original operational OAR/capability/context records; this candidate creates no OAR invocation or new admission. Whether continuing availability must survive closure of operational queue standing needs exact contract qualification; no authority is inferred from historical occurrences. CanCom email is not invoked.

**DNR — source-governed installation remains unresolved.** Exact old Index/Concordance bytes are not recovered. Pinned successor manifest is preparation evidence, not native successor admission; no registered historical hash is rewritten. SRC3 research qualification is not promoted to operative standing. Legacy public-root ownership succession, qualified successor WebPAC, media/receiving rights and effective public snapshot remain distinct release predicates. Existing DesignPAC receipt and prior exceptional succession/withdrawal/rollback evidence remain untouched.

**DNR — production installation / hosted acceptance.** No independent acceptance for these exact new SQL/application bytes is present. No live Operator disposition for installing them is inferred from implementation authorization. Do not execute this directory as one installation script: candidates are separately bounded and the complete native passage is unfinished. The integrity foundation alone is ready for independent review within its stated scope; production remains subject to source/effect predicates and live disposition. HLD applies only to an otherwise qualified effect awaiting live disposition, not to these unresolved computational tests. SEAT-08 retains its separate Operator HLD.

## Independent acceptance requirements and installation custody

Reviewer must independently rerun exact-byte fixtures, qualify native ACLs/RLS/all applicable triggers and existing callers, and assess session transport and table-lock workload/deadlock behavior. Session/grant locks deliberately serialize all writes on those tables; isolated contention tests establish refusal safety, not production capacity. PostgreSQL table owner remains unchanged; a session check is not a protected-writer solution. No broad privilege change or new writer role has been made.

Before any separately authorized installation: compare exact native preimages again, establish applicable qualified source and effect authority, independently accept its digest, and obtain required live disposition. Apply only the accepted effect in an atomic transaction; on failure roll back. Preserve uniqueness/containment after installation; do not restore unsafe TRUNCATE grants as rollback. Source/application changes must be released compatibly with SQL; the renderer now fails closed when availability evidence is missing. Do not merge/deploy this partial package as production complete.

## Mutation accounting / ONE

Local source and isolated PostgreSQL fixtures changed; npm ci restored the existing locked disposable PostgreSQL test tools. Production access was SELECT/STABLE resolution only. No production SQL, permissions, registration, CURRENT history, deployment, email, credential issuance, new OAR2 or Registrar role call changed. Original workspace and node_modules.original-link remain untouched. Existing worktree branch is the sole implementation continuation.

**Open:** exact source successor admission; complete protected PAC effect contract and native succession; full native owner NUG/reciprocal acceptance; full typecheck; independent acceptance, live disposition and hosted authenticated acceptance.

**Next:** continue these exact missing computational tests/implementation under #33; independently review qualified foundation separately. Production disposition is requested only for a fully qualified exact effect, not for this unfinished combined passage.

**Evidence:** exact package/inputs, native-functions.json, profile-dependencies.json, three executable PostgreSQL qualifiers and results, API tests, native-readback.json, hosted-readback.json, custody-index.json and SHA256SUMS.json. Implementation source and results ACT within their stated scopes; full native passage and production DNR. DNR does not resolve.
