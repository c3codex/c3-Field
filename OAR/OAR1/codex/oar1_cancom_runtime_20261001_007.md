# OAR1 — CanCom delivery lifecycle and c3ops OAR optics correction 007

Operator: `op044`  
Registrar: `chazz`  
Executor: `codex`  
Originating OAR2: `oar2_cancom_runtime_20261001_007`  
Execution/passage: `cancom_runtime_passage_codex_007`  
Capability: `cancom_oar007_codex_bounded_execution`  
Return: `registry://cancom/oar1_return/cancom_runtime_passage_codex_007`  
Execution disposition: `bounded_objectives_completed`  
Return standing: `returned_for_registrar_review`; closure remains with the Registrar and Operator.

## Authority and canonical source

Registry pickup resolved `resolved_for_executor`, queue `queue_cancom_runtime_passage_codex_007`, preflight `passed`, operator confirmation present, active exact capability, manifest `cancom_runtime_passage_codex_007:oar2:registry_manifest_delivery`, and wake `cancom_runtime_passage_codex_007:wake:001`. The wake was notification only. Authority remained the registered passage/capability.

NotChazz evaluation `c1df618b-7d48-41e7-8e0a-b870fe187e3f` was active `PASS`, with no unresolved predicates, bound to the exact OAR/execution and canonical SHA.

Canonical custody: `github_file:c3codex/c3-Field@e3e461080938ec14e45951ab45956cb4292f6ca1:OAR/OAR2/codex/oar2_cancom_runtime_20261001_007.md`. The raw Git blob verified as 4,658 UTF-8 bytes, SHA-256 `632c7276af49e36e6b714ab90309e2afa22dc21a061f992b7df6fc8eea02c4b6`, basis `utf8_raw_bytes_sha256`. Windows checkout line endings were not used as the canonical integrity basis.

## Observed correction and required proof

1. Delivery now initializes queue, process, transition, manifest custody, and executor wake atomically. The process binds the exact OAR2, expected OAR1 route and manifest evidence URI, with `queued / pending_validation / held`. The transition is `<instance>:register_and_queue`, `not_queued -> queued`. Wake insertion follows all other delivery rails.
2. Required model policy propagates from the registered executor capability: `execution_profile_process=oar_execution_profile_model_resolution_v1`, `model_resolution_evidence_required=true`, and the registered minimum capability floor. A missing required floor holds before delivery writes.
3. The deployed return validator remained byte-for-byte unchanged. A live OAR007 return without model evidence returned `HLD_MODEL_RESOLUTION_EVIDENCE_REQUIRED`; before/after snapshots of all five lifecycle rails were identical. Missing and malformed model evidence also held in shadow verification with zero delta.
4. `public.c3ops_oar_lifecycle_optics_resolution_v1` is the named c3ops read-model interface. It alone joins the five OAR rails for these consumer surfaces. The view uses invoker rights, is scoped to `op044`, and has service-role SELECT only; `anon` and `authenticated` have no SELECT grant. It exposes exactly the 13 registered fields. Return/model standing requires a consistent return, process, transition and execution-evidence binding; incomplete evidence stays unresolved.
5. My Env Operations authenticates the owner session, verifies the exact non-universal `op044` Operations primitive, and reads/renders the resolved interface. It no longer reads or joins raw OAR rails. Its field allowlist strips payload/control extras and holds on read failure without fallback.
6. c3ops Current State consumes the same `readResolvedOarOptics` interface through its existing protected API. The OAR lifecycle component is separate from NotChazz border-health reports.
7. NotChazz telemetry remains a separate read of `c3ops_notchazz_oar_formation_evaluation`. The live exact-SHA admission trigger rejected a wrong digest in shadow verification with zero delivery delta.
8. Accepted OAR005 regressions passed: registered GitHub/Drive admission; precise unknown-provider and mismatched-prefix holds; 003/004/005 pickup compatibility; wrong executor and folder lookup holds; existing initiative operator binding; participant projection without operator promotion; unresolved MDM operator hold; and personal plaintext rejection. No provider, standing, or relation was added.
9. Implementation commit `c462bc8f258153f5704443fde9ba03632da3c486` was pushed to `refs/heads/codex/cancom-007` and verified by `git ls-remote`. Base: current `origin/c3field@e3e461080938ec14e45951ab45956cb4292f6ca1`. Only the accepted adapter and ten previously live migration source files needed from `codex/cancom-005@34588af8bf09024c197adc0c1bd4eb0de07d17e0` were restored; they were not reapplied to the DB. OAR006 was not executed.
10. Structured model-resolution evidence appears below and accompanies the Registry return.
11. Production merges, deployments, public releases, external correspondence/messages, new providers, new operator/relation standings, credential expansion, and participant visibility widening: **0**.

Delivery replay used temporary shadow tables populated from the exact registered OAR007, deployed function bodies, and the live NotChazz gate, all inside rollback. It proved five-rail creation, propagated model policy, valid return optics, and zero partial delivery/wake after a process insert failure. No successful delivery was committed as a new execution instance. An initial attempt against the real append-only transition rail was rejected and rolled back; the append-only guard was preserved.

## Verification and limits

- Projection tests: 4/4 passed. Existing c3ops host/authentication middleware regressions: 3/3 passed.
- Standalone optics/adapter typecheck and changed Operations panel typecheck passed. The locked compiler is TypeScript 5.9.3; the repository's `ignoreDeprecations=6.0` setting is invalid for it, so the comparative check used command/runtime option `5.0` without editing configuration.
- Whole frontend check has 71 existing diagnostics and the endpoint/dependency check has four existing `c1-passage.ts` diagnostics. Compiler-host comparison against the exact base revision proved both diagnostic sets identical. Whole-project type cleanliness is not claimed.
- Security advisors were checked; no advisory named the new view. Direct readback verified invoker rights and the service-only grants.
- Frontend binding is source-verified; no production deployment, browser encounter, or activation was performed. Historical lifecycle dispositions were not repaired or promoted. Registrar review remains required.

## Mutation accounting and changed-file record

Applied DB migrations:

- `20261002045940_cancom_oar007_delivery_lifecycle`: replace the existing delivery function and retain its service-only execution boundary.
- `20261002045943_c3ops_oar007_resolved_optics`: create the bounded invoker-rights read model and service-only SELECT grant.

Before OAR1 registration, persisted OAR lifecycle delta from verification was zero. Successful OAR1 registration uses the existing return function to update queue/process and insert one return transition, one execution-evidence row and one custody event: five return rails. These writes request Registrar review and do not create closure.

Source correction: 21 implementation paths, including the accepted-source reconciliation, committed in the implementation commit above. Exact paths, byte counts and SHA-256 values are in `OAR/evidence/cancom_runtime_passage_codex_007/sha256.implementation.json`, using raw Git blob bytes. Return custody adds this OAR1 and the two evidence artifacts below. Authorized external writes are two DB migrations and two non-production pushes (implementation and return custody). Unrelated working-copy `src/c3ops/C3OpsDoor.css` changes were excluded and left untouched.

No private payload, secret value or cryptographic private material was captured. No personal E2EE, account credential, deployment route, operator/relation standing or provider registration was changed.

## Evidence index

Remote review artifacts on the same non-production branch:

- `OAR/evidence/cancom_runtime_passage_codex_007/verification.json`: six shadow proofs, live model-negative proof, OAR005 regression results, NotChazz identity/SHA, privacy readback, source checks, baseline-comparison summary, and external-effect counts.
- `OAR/evidence/cancom_runtime_passage_codex_007/sha256.implementation.json`: the 21-path raw-byte implementation manifest.
- `scripts/verify-cancom-oar007.sql`: rollback-only shadow verification against deployed function bodies.
- `scripts/verify-cancom-oar007-regressions.sql`: read-only live regression probes.
- `scripts/verify-cancom-oar007-types.cjs`: reproducible compiler diagnostics comparison against the base revision.

Local detailed evidence: `C:/Users/c3DAO/OneDrive/Apps/c3Field/evidence/cancom_runtime_passage_codex_007/`, including canonical OAR2 bytes, Registry manifest/pickup receipts, live negative snapshots, regression receipts and full `typecheck-comparison.json`. The Registry return receipt/readback and OAR1 raw-byte hash are retained there after registration.

## Model resolution evidence

```json
{
  "preferred_model_or_tier": "strongest_qualified_codex_model",
  "selected_model_or_explicit_unverified_state": "unverified_opaque_runtime_model_sku",
  "fallback_used": false,
  "fallback_level": "none_observed",
  "fallback_reason": "no_runtime_fallback_observed; exact_model_sku_not_exposed",
  "capability_floor_passed": true,
  "tools_available": ["repository", "supabase", "runtime_verification", "git_remote"],
  "context_fit": "high_context_sufficient_for_exact_OAR_Registry_contract_source_and_runtime_verification",
  "execution_result": "bounded_objectives_completed; no_deployment_public_release_or_correspondence"
}
```

This OAR1 is bound to the exact OAR2, passage, execution instance, authority scope, canonical payload and Registry return route above. It does not dispose or close the work on behalf of Chazz or the Operator.
