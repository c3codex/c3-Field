# OAR1 — NUGS Registry and FREE runtime foundation — 2026-10-02 — 001

## Identity and standing

- OAR2: `oar2_nugs_runtime_20261001_001`
- Execution: `nugs_runtime_primitive_codex_001`
- Executor: `codex`; Operator: `op044`; Registrar: Chazz
- Wake: `nugs_runtime_primitive_codex_001:wake:001`, notification only
- Capability: `nugs_oar001_codex_bounded_execution`
- Queue: `queue_nugs_runtime_primitive_codex_001`
- Return: `registry://cancom/oar1_return/nugs_runtime_primitive_codex_001`
- Disposition: implementation verified; submitted for Registrar review through the registered return. Review/closure and production release remain separate dispositions.

Registry pickup resolved `resolved_for_executor` with queue standing
`approved_for_execution`. NotChazz evaluation
`9cc75483-175b-472c-b4f2-e341327d95c8` is active, `PASS`, with no unresolved
predicates and `authority_created=false`. Its exact OAR, execution and hash match.
The source document's historical `FORMED_PENDING_NOTCHAZZ_PASS` text was not
edited or treated as the current Registry standing.

Canonical source:
`github_file:c3codex/c3-Field@135a9f0d17a896d94ccebb86c646a9b431381faa:OAR/OAR2/codex/oar2_nugs_runtime_20261001_001.md`

Raw Git blob verification: **4,631 bytes**, SHA-256
`5aa35c268f99f6937431123900492bb29af571264979be77b2d1dd11c018f72b`.
Windows checkout CRLF bytes differ; only the canonical Git blob was used for this
integrity check. The wake and chat summary did not replace Registry authority.

## Durable source and changed-file record

Non-production source branch: `codex/nugs-runtime-001`.
Implementation commit: `aff56e573ee424dacaf463b493fe80a9213c73b0`.
Base: `135a9f0d17a896d94ccebb86c646a9b431381faa`.

Changed implementation paths:

- `functions/_lib/free-nugs.ts`
- `functions/_lib/free-nugs.test.ts`
- `scripts/verify-nugs-runtime.sql`
- `docs/c3ops/nugs-runtime-foundation.md`
- `supabase/migrations/20261002125733_nugs_runtime_foundation.sql`
- `supabase/migrations/20261002130805_nugs_effect_evidence_return.sql`
- `supabase/migrations/20261002131028_nugs_runtime_boundary_hardening.sql`
- `supabase/migrations/20261002131236_nugs_receipt_custody_boundary.sql`
- Execution evidence under `OAR/evidence/nugs_runtime_primitive_codex_001/`.

The implementation SHA-256 manifest is
`OAR/evidence/nugs_runtime_primitive_codex_001/sha256.implementation.json`, hash
`4723bc986de4f7eb42d35b8deb5a7fb7adf19e72fe003a652c106fe1b7ea1863`.
Every listed artifact was verified against committed Git blob bytes with zero
mismatches. This OAR1 and its return readback are additional closeout artifacts.

An unrelated modification to `src/c3ops/C3OpsDoor.css` appeared in the isolated
worktree. This executor did not edit, stage or commit it. No existing PAC, CanCom,
Calendar, Directory, EnvPAC, FREE asset-binding or frontend semantic source was
changed by this implementation.

## Implementation and dependency map

Three new Registry tables:

- `c3ops_nug_binding`: service/function binding, standing, adapter/effect boundary and missing predicate evidence.
- `c3ops_nug_occurrence`: non-effectful native occurrence, native result hash/standing, exact execution and Current relation.
- `c3ops_nug_effect_passage`: independently preflighted effect passage and verified receipt relation; no provider dispatch.

Six new invoker-rights, service-only functions:

- `preflight_c3ops_nug_spec_v1`
- `register_c3ops_nug_binding_v1`
- `resolve_c3ops_nug_v1`
- `call_c3ops_nug_native_v1`
- `prepare_c3ops_nug_effect_v1`
- `return_c3ops_nug_effect_v1`

Dependency passage:

`active NUG semantics + native process/catalog definition -> active environment/effective EnvPAC/exact Current -> independently enumerated EnvPAC capability and confirmed OAR authority -> existing confirmed context -> direct native or existing registered infrastructure -> applicable effect preflight -> occurrence/receipt evidence -> existing Current evidence resolution`.

FREE's server runtime resolves and calls only those bounded Registry operations.
Native calls use fixed admitted input, a pinned native function definition hash,
and an expected result standing. Workerless calls are restricted to existing
stable/immutable invoker-rights native functions with no consequential effect.
External effects require separately registered infrastructure, independently
matched effect evidence and explicit provider/correspondence authority.

Preparation records `awaiting_effect_receipt` and calls no provider. A later
separately authorized adapter must re-preflight at its actual effect boundary.
Receipt return verifies independently attested Current evidence and a resolved
Registry custody evidence object, including exact execution, actor, native
function, OAR, occurrence, effect class and SHA-256 relations. It records receipt
return without claiming provider success or causing a new effect.

Occurrence and effect return preserve custody/ownership and request Current
re-resolution through the existing evidence relation. They do not advance Current
version or manufacture an advancement disposition. FREE refuses malformed
responses and does not retry an ambiguous call. Replays are refused.

## Evidence index and verification

All evidence paths below are relative to
`OAR/evidence/nugs_runtime_primitive_codex_001/`.

| Evidence | Class | Result and limit |
| --- | --- | --- |
| `authority-preflight.json` | Governed/live readback | Exact pickup, capability, execution boundary and NotChazz PASS |
| `registry-fixture-proof.json` | Observed/rollback-only fixture | 33 proofs passed using deployed function bodies and the existing native CanCom context resolver |
| `cancom-regression-readback.json` | Observed/live read-only | Custody-provider boundaries, executor identity, operator/participant separation, E2EE rejection and optics privacy remain enforced |
| `registry-posture.json` | Observed/live readback | Three held candidates; zero live NUG occurrences/effect passages; internal privilege and function-hash evidence; remote migration versions |
| `security-advisor-scope.json` | Observed/live advisor | Only new-table INFO findings for intentionally absent RLS policies; deny-by-default internal rails |
| `verification.json` | Observed execution record | Seven FREE tests, focused TypeScript, local build, mutation accounting and model-resolution evidence |
| `sha256.implementation.json` | Observed integrity | Exact raw file SHA-256 manifest, verified against committed blobs |

The 33 SQL proofs include registration/resolution positive proof, missing/drifted
native-function proof, revoked capability, capability without authority, missing
context, stale Current, missing FREE, every required request boundary, missing
effect preflight, provider/classification refusal, unregistered infrastructure,
workerless native invocation, Current evidence hash relation and replay refusal.
They also prove explicit external prohibition overrides a tuple, existing-adapter
classification is infrastructure only, no external dispatch, effect preparation,
claimed/wrong-occurrence/wrong-executor/nonreceipt refusal, receipt return and
receipt replay refusal.

Positive authorization tuples, context and provider receipt are explicitly
synthetic in temporary shadow tables. They are not live standing or a real
provider receipt. All shadow writes roll back. No production candidate was
admitted merely to obtain a positive test.

Two fixture attempts stopped on existing constraints: unsupported `process_status=held`
and a missing custody `related_system`. The fixtures were corrected without
changing the existing constraints, then the complete proof passed. No failed
fixture state persisted.

Seven FREE server-runtime tests passed; focused TypeScript check exited 0.
`npm run build:c3field` exited 0. Build warnings concern an existing runtime media
URL, import overlap and bundle size. Production environment credentials were not
loaded into this isolated build. This is local compilation evidence, not hosted
runtime, browser encounter, deployment or production activation proof.

The security advisor reports INFO `rls_enabled_no_policy` for the three new tables.
RLS and force-RLS are enabled; anon/authenticated SELECT and function EXECUTE are
denied; service-role access is verified. No public policy was introduced.
[Advisor description](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## Inventory, findings and missing evidence

| Surface | Finding | Bounded consequence/next action |
| --- | --- | --- |
| Registered NUGS semantics and exact execution passage | aligned | Foundation implemented within the registered capability |
| CanCom native `resolve_cancom_context_v1(jsonb)` | observed; NUG admission held | Function exists and workerless fixture succeeds; no live exact NUG capability/authority/context tuple was proven |
| Calendar | held | Existing environment Calendar is preserved; exact interoperable NUG binding and invocation predicates remain unproven |
| Directory | held | Existing environment Directory is preserved; exact interoperable NUG binding and invocation predicates remain unproven |
| FREE | aligned implementation; hosted activation unverified | Server Registry resolver/caller is implemented and tested; no public endpoint or deployment introduced |
| EnvPAC capability and OAR authority | aligned separation | Both independently required; implementation grant cannot authorize a subsequent external email |
| Native/Worker/provider distinction | aligned | Workerless native proof; registered infrastructure classification proof; zero new Workers/providers |
| Current evidence return | aligned fixture proof | Exact occurrence hash and receipt relations resolve; no live NUG Current advancement or effect occurred |
| Waiting My Env → Plateau Commons → Humanity AI → CanCom → email use case | declared future use case; held | Requires its own exact function, context, environment/Current, capability, effect authority, adapter and receipt passage |

Live Registry holds `candidate_cancom`, `candidate_calendar` and
`candidate_directory` as `candidate`; each resolves `HLD` with missing native
binding, environment/Current, capability, authority, context and effect predicates.
Active bindings admitted: **0**. Live occurrences: **0**. Effect passages: **0**.
There is no Chazz reconciliation or Operator closure claim in this OAR1.

## Mutation accounting and source custody

- Additive Registry schema: 3 tables, 6 functions and 4 migration-history entries.
- Candidate rows: 3 documentary held candidates; no active NUG classification.
- Existing capability/context/operator/provider/Worker/PAC semantic mutations: 0.
- New capability/context/operator/provider/Worker/credential: 0.
- Live NUG occurrence, effect passage and receipt rows: 0.
- Real external messages/calendar events/provider effects: 0.
- Production merge, public release and deployment commands: 0.
- Non-production source/evidence commits and branch push: authorized.
- Registry OAR1 return: existing atomic return function updates queue/process and appends one transition, custody manifest and execution-evidence row; verify in the separate return readback.

Applied remote migration versions (the API assigns application-time versions;
local source filenames retain CLI generation-time versions):

| Migration | Remote version |
| --- | --- |
| `nugs_runtime_foundation` | `20261002130415` |
| `nugs_effect_evidence_return` | `20261002130933` |
| `nugs_runtime_boundary_hardening` | `20261002131058` |
| `nugs_receipt_custody_boundary` | `20261002131301` |

Every source push uses a `[skip ci]` commit prefix. Cloudflare Pages documents this
prefix as omitting the deployment; no configuration was changed.
[Pages skip documentation](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message).
Initial implementation-commit readback showed zero GitHub statuses and zero
Actions runs on this branch. Cloudflare account-level topology was not assessed;
no hosted deployment or encounter proof is asserted.

## Model-resolution return evidence

Preferred tier: `strongest_qualified_codex_model`.
Selected state: GPT-6-based Codex; exact runtime model SKU explicitly unverified.
Fallback used: false; no runtime fallback observed.
Capability floor passed through demonstrated repository, Supabase and runtime
verification access and successful bounded code/schema tests. Context fit:
`high_context_sufficient_for_registered_foundation`.
Execution result: foundation implemented and verified without external effects.
The existing Registry model-return validator accepted these fields.

## Next bounded decision

Chazz reviews this execution's evidence and recommends disposition; the Operator
confirms, routes or disputes. A subsequent bounded effect OAR must separately
resolve the exact candidate admission and email adapter/receipt predicates. This
execution neither implements nor sends that external email and grants no future
effect authority.
