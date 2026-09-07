# c1 server adapter — OAR2 005

Base 3b8c9f88c0a6cb7108c098723eb6bcbb5d905c31 (prior renderer); original base 0e0c08e38b58212b328ecae3dc47bc3ef9851229.
Authority: Drive 1UL6k1GYarxy7hEmJYpqjsX83NOJ1LOYTsQ7Qz1hEeck, text export SHA256 274a37fbe810d90ceafe41b50f31d7d7821b39ed2b019c43c62aa3adfad7c2d5.
No push, deployment, public release or c2 elevation is authorized here.

Routes:
- POST /api/c3-community-connect-capture: existing form validation, capture_relational_candidate -> issue_relational_verification -> Resend email. Returns 202 verification_required, never completed standing.
- GET /api/c3-community-connect-verify: inert confirmation page. Challenge and signed environment-bound receipt arrive in the URL fragment, are removed from history immediately, and are sent only on explicit confirmation.
- POST /api/c3-community-connect-verify: signed receipt and contact proof -> verify_relational_contact -> evaluate_relational_car -> evaluate_c1_relational_boundary -> register_and_persist_c1_relationship. Every stage must return its exact expected state. No retry or alternative effect path.
- Hosted package remains held. No change to renderer composition or approved copy beyond accurate submission status.

Server configuration (no values checked in):
SUPABASE_URL must match the routed project https://zfihrspxvennjzazxcbj.supabase.co.
SUPABASE_SERVICE_ROLE_KEY stays server-only.
RESEND_API_KEY supplies the existing email provider.
C1_VERIFICATION_FROM must be an authorized sender for this encounter.
C1_PUBLIC_ORIGIN must be the exact HTTPS origin for this handler, without a trailing slash.
C1_VERIFICATION_SIGNING_KEY must be a separate random secret of at least 32 characters. Rotating it invalidates pending links.
C1_PASSAGE_ENABLED=true is required server-side. No environment/config value was enabled by this work.
None of the C1-specific configuration was present at local inspection. No sender or deployment origin was inferred from another encounter; no live email was sent. Missing configuration holds before capture.
Production public release is a separate disposition even when server configuration exists.

The signed receipt binds the challenge callback to the server-selected environment and relationship, expires with the challenge, and cannot be replaced with a browser-invented relationship key. Contact verification is still decided by the registered RPC; a receipt alone has no standing authority.
Callback GET has no effects, to avoid email-link scanners consuming the challenge. It uses no external resources and applies CSP/no-referrer/no-store.
No service-role value, raw RPC response, token, CAR/Boundary mechanics or persistence provenance is returned in participant JSON. Backend provenance remains in registered relationship events and measures_persistence_state.

Failure recovery:
RPCs are separate transactions. A network timeout may follow a committed write: capture candidate_saved=null and persistence_unconfirmed persistence_created/current_created=null express that uncertainty. Never retry the sequence automatically or claim rollback of a network request.
A callback failure after contact verification may leave a verified/CAR/Boundary candidate. A consumed challenge cannot replay the chain; operator-governed recovery is needed. This adapter does not invent recovery authority.
Existing capture reuses records by email; broader participant continuity/rebinding semantics remain in the registered primitives and were not redesigned.

Validation:
node --import tsx --test functions/_lib/c1-passage.test.ts functions/api/c3-community-connect-capture.test.ts src/c3_field_connect/c1EnvironmentPackage.test.ts
The inherited package test needs ../evidence/registry-rows.json from the prior renderer evidence (a historical test fixture, not current live authority).
Scoped tsc and build:c3field are recorded in the return evidence.
Mocked transport/orchestration tests are separate from the live-database rollback test; neither proves real inbox receipt. Synthetic SQL explicitly marks the new relationship test-only, executes all governed calls, and rolls back every row. No participant Current row is written.

API references used:
https://supabase.com/docs/guides/database/functions
https://resend.com/docs/api-reference/emails/send-email
