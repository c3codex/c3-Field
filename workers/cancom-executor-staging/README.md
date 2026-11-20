# OAR022 inert CanCom dispatcher staging

This build cannot execute. `src/index.ts` has static health only; it imports no
gateway, credentials, storage or Codex runtime. Every execution/wake/poll/return
request is refused. No scheduled/queue handler exists. Even a true execution
flag HOLDs. `dispatch-boundary.ts` is typed but intentionally uncallable for
execution under OAR022; future authorized activation would reuse the existing
`createDurableExecutor` from `scripts/lib/cancom-durable-executor.mjs`, not the
post-OAR1 review client. No dynamic code, shell runner or eval is present.

Pins: Wrangler4.50.0, TypeScript5.5.4 and package-lock.json. Sources descend from
app cd2b45e568d65148b58804f3da48a142be3fc555; governance reference
3bb1e6a526b4062bca6a08321f0e37c1e343bb0c unchanged.

Candidate target: `c3ops-cancom-executor-staging`, isolated environment of the
requested c3ops-cancom-executor. NO account or unique target has been verified.
Do not deploy the root environment or overwrite any existing script. Both
environments set workers_dev=false, preview_urls=false, routes=[], crons=[] and
EXECUTION_ENABLED=false; no queue/secret/KV/Durable Object binding exists.

## Actual access and checks

No Cloudflare connector was available. No Cloudflare credential variable names
were configured in this execution workspace. Pinned Wrangler `whoami` completed
and reported `You are not authenticated. Please run wrangler login.` Thus account,
script ownership/collision, staging permission, deployment ID and live metadata
readback are UNVERIFIED. No remote staging deployment was attempted or claimed.

Cloudflare documentation HTTP request returned403. Wrangler's own installed
schema/bundler accepted this environment configuration. Existing repo Worker
examples were inspected as context, not copied with their routes/secrets/crons.

Actual local checks: TypeScript noEmit exit0,18 targeted Node tests PASS,
Wrangler deploy --env staging --dry-run exit0; bundle0.79KiB, only binding
EXECUTION_ENABLED=false. Local Wrangler/Workerd GET /health returned inert JSON
and POST /execute returned403/HLD. Local runtime attempted its own Request.cf
metadata retrieval and fell back to placeholder; this is CLI metadata behavior,
not a Registry/Codex request from the Worker. Worker has no outbound call path.
Tests explicitly instrument fetch and runner/qualification adapters and assert
zero calls. Missing/revoked identity, invalid bytes, duplicate/timeout/crash,
gateway failure and invalid/replayed receipt cases remain blocked before adapter
invocation, not falsely reported as live security acceptance.

## Missing Cloudflare access — minimum scoped request

Prefer the existing delegated Wrangler login for the authorized staging account.
If op044 supplies a management token through a secure runtime secret mechanism:

- Account -> Workers Scripts -> Edit, restricted to the one authorized staging
  Cloudflare account. This account permission is not a Registry worker identity.
- Account -> Account Settings -> Read for account identity verification/discovery.

No Zone/DNS/Workers Routes, Pages, Queues, KV, Durable Objects, account-token
administration or broad all-account permissions are needed for this inert script.
Workers Scripts permission is account-wide; constrain it to the staging account,
use short expiry and do not grant it across production accounts. Never paste the
token in chat, OAR1, source or logs. No token was created, read or assumed present.
After access is supplied, check existing base/staging script ownership first,
then independently verify no routes/schedules/consumers/secrets and read back
the exact deployed version. Inert deployment is not activation.

## Later acceptance (not authorized by this build)

Dedicated nonoperator Codex principal + documented sign-in/rotation/revocation,
real auth.sessions evidence, exact OAR2 action authority, an approved isolated
native gateway, durable checkpoint storage, atomically fenced effect sink and
authorized external Codex execution adapter are still required. Registry journal
is the intended durable phase source; no Cloudflare storage is provisioned. Any
unqualified component HOLDs. No hosted schedule or execution endpoint may be
enabled without separate activation authority and independent review.

SOURCE local inert checks PASS. INERT_STAGING HLD/cloudflare_access_unavailable.
REAL_JWT HLD/no_qualified_worker_identity. LIVE_EXECUTOR HLD/not_running.
M3 HELD; independent operational acceptance NOT_ESTABLISHED; Operator RESERVED.
