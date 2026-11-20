---
document_class: OAR1
oar_key: oar1_registrar_lapzuli_native_occurrence_claim_binder_codex_003
execution_instance: registrar_lapzuli_native_occurrence_claim_binder_codex_003
origin_oar2: oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003
operator: op044
executor: codex
standing: held_for_registrar_review
source_standing: tested_candidate_prepared
installation: NOT_AUTHORIZED_NOT_ATTEMPTED
deployment: NOT_AUTHORIZED_NOT_ATTEMPTED
external_effects: 0
return_route: registry://cancom/oar1_return/registrar_lapzuli_native_occurrence_claim_binder_codex_003
---

# OAR1 — historical occurrence/claim source candidate, exact installation HOLD

Prepared actual API, SQL transactional-core and existing-worker source in draft
[PR #91](https://github.com/c3codex/c3-Field/pull/91), source commit
`45312b3f123017302249b616a497ee24a4e5cc3e`. All ten remote source files were
read back at this immutable commit and matched the tested workspace bytes.
**E1 native admission remains incomplete; E2 was not attempted.** No live
historical occurrence, claim, SQL installation, worker deployment, provider
dispatch or delivered publication occurred. This is a concrete source return,
not a new backlog audit or another requirements-only OAR2.

## Exact retrieval and authority

- Native CanCom pickup: resolved_for_executor for this instance, Codex,
  `queue_registrar_lapzuli_native_occurrence_claim_binder_codex_003`, passage
  matching the execution instance and its registered return route.
- Immutable OAR2 custody: `github_file:c3codex/measures-of-inanna-governance@af2b1421eaa25d4366d568f75d231f9fcb2e4593:governance/maturity/c3_field_m3_20261008/OAR/OAR2/chazz/oar2_registrar_lapzuli_native_occurrence_claim_binder_chazz_20261012_003.md`.
  Independently retrieved raw bytes: 10,857; SHA-256
  `201e7fb50c3af165a4499c01c443053ddeb6241079f2725c6ce238462772e5df`.
- Active formation NotChazz PASS:
  `249bb739-3e0c-4c33-abf0-972870e5d6b7`; authority_created=false. Formation
  PASS does not admit installation or provider effects.
- Active executor capability `lapzuli_occurrence_003_codex_executor` authorizes
  exact inspection, source changes/testing and OAR1 return. Its current scope
  explicitly has db_mutation_authorized=false, deployment_authorized=false,
  external_provider_effects_authorized=false, max_new_external_effects=0.
  The source-only scope has no explicit expiry; no effect-grant expiry was
  invented. The candidate requires future separately scoped effect grants with
  mandatory live expires_at checks and active standing.
- Active Registrar capability `lapzuli_occurrence_003_registrar_delivery`
  authorizes delivery/passage/wake, external_effect_authority=false. No new
  Operator, NotChazz, Registrar, executor, installer or participant authority
  was created. No actual authenticated op044 individual session was supplied
  or established.
- Full preceding native OAR1 Markdown was retrieved and read: 22,359 UTF-8
  bytes; SHA-256 exactly matches
  `662f4cd9403c215eb48940be375cb7e3a5c60101605bacb107889d41977e76bb`.
  Its reviewed_reconciliation_source_only_hld disposition and missing native
  historical connection were preserved. The 87-asset inventory was not repeated.

## Source implemented and tested

Exact diffs and per-file SHA-256/lengths are at immutable source
`docs/oar/lapzuli-occurrence-003/verification.json` in the source commit above.

1. `functions/_lib/lapzuli-historical-claim.ts` and the existing API add one
   allowlisted historical operator action, native-session proof presentation,
   exact bound-claim validation and occurrence correlation before worker I/O.
   No fallback to the unbound five-argument claim is allowed for this asset.
   The existing shared chamber key and descriptive operator metadata do not
   authenticate an individual.
2. The review-only SQL candidate reuses the original five-argument claim and
   its asset advisory lock. Native admission supplies the canonical source /
   PAC versions and digests, payload/media hash, release and source-confirmation
   boundaries, exact asset/route/account. Execution/OAR and prose scope labels
   are excluded from the same-effect hash to prevent reissue/rewording replay.
   Exact OAR, actor and capability references remain bound as claim evidence.
3. The occurrence/event, new claim and source/actor binding form one transaction.
   Event failure rolls the new claim back; a failed claim creates no orphan
   ready event. All earlier attempts and uncertain effects remain held; the
   original expired-claim uncertainty transition is retained. Only a newly
   acquired claim can receive its source_oar2 and Codex/op044 evidence.
4. The existing worker adds exact-asset Registry consumption of the successful
   bound claim before provider I/O. Consumption is one-shot under the same lock,
   validates exact payload and fresh proof, checks current capabilities, and
   requires native current individual/source revalidation. No SQL provider call,
   new queue table, duplicate article, artificial publication transition or
   invented provider receipt was introduced.
5. Outcome evidence retains occurrence binding and the actual 0/1/unknown
   tri-state. Transport or evidence-persistence failure cannot falsely return
   zero after an accepted/uncertain provider outcome; automatic retry is off.

## Verification actually observed

- 10 new API/native-claim tests PASS; four new worker guard tests PASS.
- Isolated PostgreSQL 17.6: 27 assertions PASS, including invoker/ACL restrictions,
  no proof/capability admission, expiry/revocation, payload mismatch, rollback,
  occurrence and worker replay, both race orders against the original claim,
  no orphan notification and expired-claim uncertainty.
- The SQL fixture uses reduced local tables and explicit test doubles for
  native actor/source admission. It is not production actor proof, a production
  source/rights/media qualification, or full real-schema/FK/RLS installer review.
- Ten existing FREE route tests and 13 worker regression tests PASS; targeted
  TypeScript, source-integrity and whitespace checks PASS.
- One existing campaign action test fails its initial projection assertion,
  identically on unchanged base `729012c179d73682cac7e95c94c4d2607939dbe8`.
  It fails before this candidate's action or claim path runs.
- Fresh live provider preflight: NOT_ATTEMPTED. The previous 002R HTTP200 /
  ACT_PREFLIGHT at 2026-10-12T07:35:28.422511Z is historical evidence only,
  not current readiness or delivery. Current source/PAC/rights/media freshness
  for an external effect is UNVERIFIED; the effect gate was not reached.
- Current native target execution rows: zero. Candidate admission/claim/worker
  primitives remain absent from production. Production SQL additions/grants,
  deployments, new historical events, claims, provider requests and effects: zero.
  Only the explicitly authorized CanCom OAR1 return bookkeeping is requested.

## Exact HOLD and acceptance gap

The active Codex source grant forbids SQL installation, deployment and provider
effects. No separately admitted native installer with exact reviewed SQL/source
hashes and production-schema/concurrency/ACL effect qualification was resolved.

Native `resolve_lapzuli_historical_admission_v1(text,text,jsonb)` and
`revalidate_lapzuli_historical_admission_v1(jsonb)` are deliberately unimplemented
dependencies, not fake proofs. They must authenticate the actual individual,
resolve current source/PAC/rights/media and effective op044 relations, original /
current OAR relation, independent exact-source installation review and provider
proof under revocation-safe locks. Caller JSON, service credentials, shared
middleware access or an echoed actor-evidence field cannot replace this.
Until these predicates are genuinely native and reviewed, the source candidate
cannot complete operational E1 admission or E2 distribution. Worker Registry
credentials and their reviewed exact scope are also unverified.

Source/core tests passing are not installation acceptance. No production proof,
installation/deployment success, post ID/URL, source rights refresh or delivered
publication is claimed. No prior receipt/history, article publication timestamp,
source text or unrelated PubPAC001/4.7% hold was changed.

Return this exact source and HOLD to Registrar review through the registered
CanCom route. Disposition must distinguish source readiness from native admission,
installation and the separately scoped single effect. No replacement generalized
backlog OAR2 or manufactured actor authority was formed.

## Model resolution evidence

Platform-assigned Codex model/backend tier is opaque and explicitly unverified;
no exact serving SKU or highest-tier claim is invented. No selected-model fallback
or sub-agent was used. Tools used: connected Supabase Registry inspection/return,
immutable GitHub custody/source/PR tools, local TypeScript/Node tests and isolated
PostgreSQL 17.6. The bounded source/testing floor is evidenced by the code and
negative/concurrency tests above; native installation/effect admission remains
held independently of model selection.
