# c1 hard-wall hardening — OAR2 006

Authority: oar2_harden_c1_authority_hard_wall_codex_006 (Drive 1y4snc7K37cm-X-TXyif3IX9bz9_VXkZK9j87l2eY6HA).
Source review: review_c1_authority_hard_wall_gap_20260906_001 (Drive 1VFHtbdAvvOr_DYUoUDRXXgZ4EZxKy7LI1_LpJsQJpEg).
Base: 65a0e88322562c3f7ace1bafe34326f61a6dbabb. No real email, push, merge, deployment or public release authorized.

Database migration: local CLI-created 20260907045829_harden_c1_authority_wall_codex_006.sql; live migration version 20260907050352.
The migration checks all three original function definitions before replacing them. No table, index, grant or RLS change.
- capture_relational_candidate locks an existing matching contact row and refuses reuse unless its environment matches, it is active, and it remains candidate_unverified. The existing normalized-contact unique index is preserved. Cross-environment contact reuse holds; it never reassigns an environment or creates a second identity.
- evaluate_relational_car selects the latest applicable c1 consent before checking active/unwithdrawn/uninvalidated/unsuperseded state.
- register_and_persist_c1_relationship independently repeats that consent check, requires the CAR to cite that consent, selects latest determinations without filtering for passing outcomes, checks same environment, checks current relationship evidence pointers, and binds Boundary -> NotChazz -> CAR. Invalidated/superseded evidence cannot pass.
- Consent and relationship-event tables are locked in SHARE ROW EXCLUSIVE mode during CAR/final registration. This prevents concurrent writers replacing evidence after the final check but before persistence. These are conservative, short transaction locks; they serialize these evaluations and may cause contention or aborted conflicting transactions under load. No automatic retry or weaker fallback is introduced.
- Existing verification, NotChazz evaluation, Boundary disposition, RRT and Persistence primitives are not redesigned. Failed verification never reaches CAR. No participant c3_current_state record.

Public surface:
- Only verification_required, invalid_or_expired_verification, unable_to_process and connection_recorded are projected by the passage handlers.
- Valid capture input receives the same conditional verification response after downstream success, pre-existing-record refusal, issuance limit, or provider/RPC failure. It does not claim an email was sent or a relationship exists.
- Callback failures share one response regardless of the failing internal gate. No candidate_saved flag, RPC/table/config names, exception text or mechanics are exposed.
- Payloads remain bounded to 16 KiB capture and 4 KiB verification.
- GET verification is inert, strips the link fragment, uses explicit POST confirmation, and now has the request abuse gate.

Abuse binding contract (not provisioned/deployed by this OAR):
C1_REQUEST_LIMITER: Cloudflare RateLimit binding, proposed 30 calls per 60 seconds per route + platform-provided source-IP hash.
C1_ATTEMPT_LIMITER: independent RateLimit binding, proposed 5 calls per 60 seconds per route + normalized-contact hash or signed-receipt hash.
Use distinct account-approved namespaces. Never substitute an in-memory counter or a client-supplied success value.
Capture and callback check the request binding before body processing; attempt binding is checked before privileged RPCs. Missing binding, missing platform cf request metadata, limiter error or denial fails closed. GET confirmation has a request gate too.
No namespace/resource was created, no existing Cloudflare configuration was altered, and no runtime support for these bindings on the exact Pages deployment was claimed. Provisioning/compatibility and deployed enforcement remain explicit release gates; do not assume a Worker binding configuration automatically works on a Pages project.
These Cloudflare limits are local to a location and eventually consistent; they are abuse controls, not exact global counters. IP-based throttling for this anonymous encounter can affect shared networks. Existing global database challenge cooldown/hourly/attempt limits remain in force.

Input/secret boundaries:
Open-response text is passed only as evidence data, never parsed as a command. RPC targets are a fixed allowlist and the sequence is fixed in server code. Client authority fields are rejected. Tests exercise imperative text in participant input and forged external RPC output; neither changes the callable sequence.
This is bounded runtime evidence, not a claim that every possible human/agent workflow is proven safe.
Secrets stay in .dev.vars / Cloudflare bindings. A scanner consumes designated local secret bindings internally, emits only present/redacted status and a leak boolean, and scans source/build/return artifacts. Runtime exceptions are never reflected into public output. No secret store or executable dependency was added.

Tests:
46 Node checks, scoped tsc, build:c3field and 3 mocked local browser checks.
17 database transaction checks before and after migration: cross-environment rejection; CAR withdrawal; post-Boundary withdrawal/new withdrawal; newer CAR/Boundary holds; other-environment CAR/Boundary events; invalidated/superseded passes; expired/superseded/failed-locked/consumed challenges; state skipping; synthetic happy persistence; unchanged environment Current.
All synthetic rows are rolled back. Token values remain inside the test transaction. This does not constitute real inbox evidence.
Security advisor INFO notices for RLS with no policies on the five protected relational tables are consistent with the existing server-only wall. No public policies were added:
https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

Final recommendation remains held until the exact edge rate-limit bindings and runtime behavior are verified. Real email testing still needs its separately authorized route. Public release, c2 elevation and original live-passage closure remain held.

References:
https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
https://www.postgresql.org/docs/current/explicit-locking.html
