# OAR003 source candidate — installation and provider effect held

Execution: `registrar_lapzuli_native_occurrence_claim_binder_codex_003`.
Canonical OAR2: 10,857 raw UTF-8 bytes, SHA-256
`201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df`.
CanCom pickup resolved for Codex. The active executor grant authorizes inspection,
source preparation/testing and OAR1 return. It explicitly sets SQL mutation and
deployment to false and maximum new external effects to zero.

## Implemented source

- An explicit `dispatch_historical_asset` action allows only the Hole Map asset.
  The old dispatch action holds for this asset; unrelated assets keep their
  existing claim path. A shared operator chamber key is never individual proof.
- A service-only, invoker-rights SQL candidate takes the **same asset advisory
  lock**, checks source pickup and independently scoped current effect grants,
  derives a deterministic same-effect tuple from native admission, and calls the
  existing five-argument claim. Only the new claim receives its OAR/actor binding.
  Claim/event/binding share one transaction. Replays and all earlier attempts
  hold; expired active attempts preserve the existing uncertainty transition.
- The existing worker has an exact-asset guard that consumes the bound claim
  once through Registry before provider I/O. Payload drift, missing proofs,
  revocation, expiry and retry hold. Ordinary/dry-run paths keep their behavior.
- API evidence preserves the historical binding and observed effect tri-state.
  Failure to persist a provider outcome retains 1/unknown, never a false zero.

## Exact unresolved native boundary

This is **not a deployable completed E1 admission mechanism**. The transactional
core is implemented; native individual/source admission is not implemented or
established. These deliberately unresolved native dependencies are required:

`resolve_lapzuli_historical_admission_v1(text,text,jsonb)` must resolve the secret
runtime token to genuinely attested individual op044 authentication, active
operator/environment relations, effective source/versions/PAC rights, exact
current caption/media/speaker/account, original/current OAR relation,
independently reviewed installation hashes, and current non-effecting provider
proof. It must hold appropriate Registry rows against concurrent revocation.
It returns a fully derived effect tuple and **exact prepared worker request**,
actor evidence reference, capability references, verified timestamp and expiry.
Preflight freshness is capped at 60 seconds. Caller assertions are not proofs.

`revalidate_lapzuli_historical_admission_v1(jsonb)` must re-resolve that persisted
attestation and all current individual/source/PAC/rights/media/review predicates
under locks immediately before worker consumption. It cannot simply echo
`individual_authenticated` or trust descriptive metadata.

Both are absent in the observed native function catalog. The existing API
middleware authenticates shared chamber access; it does not resolve a named
individual. Neither a user-supplied operator string nor service credentials can
replace these predicates. No authentication issuer, new identity, admission
proof, external-effect grant or installer was manufactured.

The current executor grant cannot satisfy the candidate's separately scoped
operator/NotChazz/Registrar/executor **effect** grants. Worker Registry secret
configuration is also unverified. The SQL is a review-only candidate outside
`supabase/migrations`; it is not auto-installed by migration tooling.

## Verification and limits

- 10 new API/claim tests; 4 worker guard tests; 10 existing FREE route tests pass.
- Isolated PostgreSQL **17.6**: 27 assertions pass, including invoker/ACL checks,
  rollback after event failure, missing admission, expiration/revocation,
  payload mismatch, occurrence/worker replay, both race orders with the original
  claim, no orphan notification, and expired-claim uncertainty.
- SQL tests use reduced local tables and explicitly labeled **test doubles**
  for native admission. They do not prove actual individual authentication,
  production source/rights/media admission, full production FKs/constraints/RLS,
  installer qualification, worker credentials or fresh live provider readiness.
- Targeted TypeScript check passes. One pre-existing campaign-action test fails
  identically on unchanged base `729012c179d73682cac7e95c94c4d2607939dbe8`;
  its first projection assertion fails before this action runs.

Run API tests with `node --import tsx functions/_lib/lapzuli-historical-claim.test.ts`;
worker tests with `node workers/lapzuli-distribution-worker/test/historical-claim.test.js`.
Run SQL tests with `node scripts/test-lapzuli-occurrence-003.mjs` against an empty,
disposable local PostgreSQL database at 127.0.0.1:55432. Optional
`LAPZULI_TEST_PG_DATABASE` selects another empty local database. The test refuses
an existing public-schema installation and never connects to the live Registry.

## Operational result

**HLD, source candidate only.** No live SQL additions/grants, historical occurrence,
claim, worker deployment, provider dispatch or delivered post. The exact asset
still has zero native execution rows. The October 12 provider dry run in 002R
is historical evidence, not fresh readiness or delivery. No broad backlog audit,
article publication transition, prior receipt relabeling, source rewrite,
unrelated PubPAC001/4.7% hold clearance or direct social route was performed.

Native installation needs independent review of these exact source hashes,
real-schema/ACL/concurrency qualification and separately scoped installation /
deployment authority. Any future single effect additionally needs authentic
current individual admission and explicit exact effect grants. This return asks
for disposition of the concrete source; it does not form another backlog OAR2.
