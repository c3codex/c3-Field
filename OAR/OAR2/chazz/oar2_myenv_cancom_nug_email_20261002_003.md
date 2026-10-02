# OAR2 — My Env CanCom NUG Email Activation — Chazz Executor — 2026-10-02 — 003

## Route
Operator: op044
Registrar / bounded executor: Chazz
System: c3ops / NUGS / My Env / CanCom
OAR key: oar2_myenv_cancom_nug_email_20261002_003
Execution instance: myenv_cancom_nug_email_chazz_003
Standing: EXECUTE_BOUNDED_AFTER_NOTCHAZZ_PASS

## Operator authority
Operator instruction: proceed; Thread Role call Chazz execute.

## Objective
Make NUGS materially usable inside the Operator's My Env by wiring the existing My Env work-card surface to a governed CanCom email effect path.

The user-facing surface remains the work item. NUGS is infrastructure, not a new top-level My Env button.

## Organization/work context
Canonical organizational framing:
- c3 Community Partners DAO, LLC — originating organization
- Measures Registry — operational/commercial proof point
- Million Dollar Mission / Plateau Commons — initiative-formation capability proof
- Humanity AI — funding/application workstream attached to Plateau Commons
- CFMT — prospective fiscal sponsor / eligible charitable lead conversation

Plateau Commons remains the initiative/proposal object; Humanity AI remains a funding/application rail, not a second initiative.

## Implementation scope
1. Add a server-side My Env CanCom email endpoint using:
   - existing My Env environment-session validation
   - existing FREE NUG server runtime
   - Registry-resolved active NUG binding
   - Resend as provider adapter using existing server-only c3 Field credentials
   - one recipient only
   - no CC/BCC
   - no attachments
   - bounded subject/body limits
   - replay/idempotency protection
   - provider receipt returned to Registry/Current State through c3ops_nug_effect_passage.
2. Add a work-card email composer/action to the existing c1me.pipeline renderer.
3. Seat a Plateau Commons / Humanity AI / CFMT work-card projection in the Operator's My Env.
4. Register the c3 Field Resend adapter as infrastructure servicing CanCom NUG effects. Provider/adapter is not the NUG.
5. Preserve the existing cloudflare_email CanCom hold. The NUG enters My Env via registry_cancom_internal; external email occurs only at the separately preflighted effect boundary.
6. Build and verify on this non-production branch.

## Runtime authority split
This implementation OAR does not itself become the long-lived CanCom NUG authority.

After successful source deployment, form a separate standing runtime-authority OAR whose queue remains approved_for_execution/executing while the My Env email NUG is active. That standing OAR must independently enumerate:
- exact NUG binding tuple
- exact EnvPAC
- exact CURRENT state
- exact context binding
- external_email effect preflight
- active capability
- operator confirmation
- registered Resend adapter

Revocation/closure of the standing authority must make NUG resolution fail closed.

## Source/release authorization
Authorized:
- source mutation on chazz/myenv-cancom-nug-003
- Registry process registration for the Resend adapter
- Registry My Env work projection
- test/build verification
- fast-forward production release only after NotChazz PASS, successful local/source verification, anti-race comparison, and registered c3-field deployment identity resolution
- Cloudflare Pages auto-deploy triggered by c3field fast-forward

Not authorized under this implementation OAR:
- sending a real external email
- admitting a persistent NUG under this OAR
- bulk email
- attachments
- CC/BCC
- credential changes
- new provider credentials
- new relationship/participant standing
- PAC semantic mutation
- force push
- direct Wrangler deploy

## Required verification
- My Env session boundary rejects unauthenticated request
- endpoint cannot accept caller-supplied authority tuple
- one-recipient validation
- FREE prepareEffect path resolves only against Registry binding
- provider is not called when NUG resolution/preflight holds
- receipt evidence shape matches return_c3ops_nug_effect_v1 contract
- c1me.pipeline work card exposes email action only when configured
- existing Calendar action remains intact
- production branch fast-forward only
- production-triggered Cloudflare Pages c3-field check succeeds

## Return
Return OAR1 to:
registry://cancom/oar1_return/myenv_cancom_nug_email_chazz_003

## Invariants
Capability does not imply authority.
NUG does not transfer custody or ownership.
Provider is infrastructure, not the NUG.
My Env consumes resolved runtime authority; it does not manufacture it.
The relation is never governed; the environment is governed.
