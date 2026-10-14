# Lapzuli native admission — OAR004 source continuation of PR #91

The two admission functions are now implemented in source. They reuse the
existing My Env session, original owner grant, native Current/operator resolvers
and governed individual/operator/environment bindings. No login, participant
store, identity issuer, standing or credential is created.

**Source-only candidate. Production installation, deployment, merge and external
publication remain unauthorized.** Original OAR003 and its immutable OAR1 remain
held. OAR004 has its own source-correction grant and CanCom return.

## Implementation

- `native-admission.candidate.sql` implements
  `resolve_lapzuli_historical_admission_v1(text,text,jsonb)` and
  `revalidate_lapzuli_historical_admission_v1(jsonb)`, with two internal helpers.
  All four new functions use SECURITY INVOKER and service-only EXECUTE ACLs.
- The admission entry verifies possession of the actual existing session token
  against its stored digest. Native actor resolution then verifies the original
  owner grant, active CRS/Current and evidence, governed identity continuity,
  carrier/operator standing, personal and c3Ops environment bindings. It calls
  the existing native operator-context resolver, then checks its references
  against locked Registry rows. A session ID, operator string, shared chamber
  key or descriptive metadata cannot replace the token proof.
- Authentication is separate from publication authority. The source-side My Env
  Lapzuli capability must independently admit the exact identity passage. Four
  separate, current, time-bound Operator/NotChazz/Registrar/executor effect grants
  must bind the individual, target environment, asset/route/account, exact OAR
  and reviewed installed source. The source-only OAR004 grant satisfies none of
  those effect predicates. Completed OAR003 delivery is not operating authority.
- Source/PAC/version/rights/media, released derivative, registered route/account,
  qualified outlet constraints, current published-source status and canonical
  payload are derived from locked native rows. Legacy published-source social
  distribution does not clear the whole PubPAC publication/media hold.
- Installed function hashes, including the existing Current/operator resolvers,
  must match a separately admitted native installation manifest and actual
  NotChazz/Registrar review records. Missing/changed review or source holds.
- A fresh zero-effect source/media/provider proof must exist on the established
  native custody rail, have a verified integrity digest and exact request/account
  binding, and come from a separately qualified, scoped producer. Caller
  preflight flags or an HTTP/dry-run response alone are not that proof.
  Proof validity is at most 60 seconds and is capped by all grant/session expiries.
- Revalidation resolves the actual persisted occurrence and claim first, then
  rechecks the original session/owner/actor, all current grants and source/proof
  snapshots immediately before one-shot worker consumption. No raw token or
  token digest is placed in claim metadata, occurrence evidence or receipts.

The transactional core retains the original asset advisory lock and five-arg
claim. The new claim, exact OAR/actor/source binding and existing CanCom occurrence
share one transaction. Failed claims produce no orphan notification; event
failure rolls the claim back. Earlier attempts, unknown outcomes and replays
hold. Only new claims are bound; historical receipts are never relabeled.

The worker requires successful native claim consumption before provider I/O.
Exact target route/canonical-account aliases cannot evade the asset guard.
API evidence preserves 0/1/unknown and forbids automatic retry of the historical
occurrence. Failure to persist an accepted/uncertain provider result cannot
become a false zero.

## Bounded passage between existing hosts

`/api/my-environment-lapzuli` on My Env reuses `resolveEnvironmentSession` and
`resolveC1MeOperatorContext`, checks same-origin JSON and one host-only owner
cookie, then checks the separately scoped existing Lapzuli capability. It sends
only the allowlisted action/asset to the **existing** c3Ops Lapzuli endpoint over
fixed-host HTTPS, with redirects disabled and a private server authentication
header. Browser Cookie/Authorization/identity headers are not copied.

c3Ops accepts only the exact server passage contract/instance/source host and
rejects browser Origin/cookie substitutes. Existing c3Ops middleware controls
transport access; native SQL still requires the individual token and live
Registry authority. The existing Chazz proxy is a transport reference, never a
transferable conversation grant. Neither browser session nor My Env capability
is assumed to carry across hosts.

The proxy returns a strict receipt projection, with whitelisted reason codes and
secret filtering. It never returns upstream headers, arbitrary error text,
credentials, actor/session objects or provider payloads. Source contains no
credential logging. The token-taking native functions suppress parameter values
on database errors. Observed DB defaults log DDL, disable duration logging and
set error parameter logging to zero; RPC-specific telemetry/redaction still
requires independent installation qualification. No live settings were changed.

## Tests and limits

- 49 assertions pass on isolated PostgreSQL 17.6 using the **actual existing
  Current/operator SQL and actual new admission/revalidation/claim code**.
  The selected production schema fixture reflects 543 columns and 170 constraints;
  CHECK/unique/key constraints and internal FKs are enforced for new mutations.
- The fixture omits 16 FKs to external dependencies and three constraint triggers.
  Selected FKs are NOT VALID for pre-existing bounded source fixture rows; they
  still enforce test mutations. Full production trigger/RLS/installer effects
  are not qualified by these tests.
- Sessions/credentials, future effect/review grants and provider proofs are
  explicitly synthetic local fixtures. CanCom pickup alone is a fixture double.
  Authentication/admission are not mocked. No fixture is production proof.
- Tests cover session/owner/identity/passage/effect/proof revocation and expiry,
  source/PAC/rights/payload/outlet drift, missing installation review, secret-free
  evidence, anonymous/authenticated ACL rejection, Current key-column ACLs,
  rollback, both races with the original claim, replay and concurrent revocation.
- 9 My Env passage tests, 10 claim/API tests and 5 worker guard tests pass.
  10 existing FREE route tests and 13 worker regression tests also pass.
- No new TypeScript diagnostics against the unchanged baseline; four existing
  C1-passage signedURL/signedUrl diagnostics remain. Source integrity and
  whitespace checks pass. The earlier campaign projection failure remains
  independently reproduced on the unchanged baseline.

Run: `node --import tsx functions/api/my-environment-lapzuli.test.ts`,
`node --import tsx functions/_lib/lapzuli-historical-claim.test.ts`,
`node workers/lapzuli-distribution-worker/test/historical-claim.test.js`.
With the disposable local PostgreSQL fixture at 127.0.0.1:55432, run
`node scripts/test-lapzuli-native-admission-004.mjs`. This creates a local test
schema only; it never connects to the production Registry or any provider.

## Actual remaining predicates

- An independently qualified exact-source native installer, production schema /
  FK/constraint-trigger/RLS/ACL and telemetry review, and installation grant.
- Separate deployment/merge authority and verification of server-side credential
  scope/configuration; no credentials were inspected, replaced or broadened.
- A current exact effect execution, independently admitted My Env identity-passage
  capability and target effect grants. Current My Env Lapzuli capability is
  inactive; c3Ops operator standing is read/preflight preparation only.
- Fresh native source/media/provider proof from a qualified producer; no such
  live proof, actual user-session possession or provider readiness is claimed.

No live SQL installation/grants, occurrence, claim, deployment, provider request
or post was created. OAR004 source completion and operational OAR003 acceptance
remain distinct. The original OAR1 and `verification.json` are historical source
artifacts at commits 9b766c87dd06c2dfbad630e60d246eccc6984287 and
45312b3f123017302249b616a497ee24a4e5cc3e; `verification-004.json` records this
continuation's current source hashes and observed tests.
