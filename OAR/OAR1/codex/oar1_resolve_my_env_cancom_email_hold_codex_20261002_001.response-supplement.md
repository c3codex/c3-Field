# OAR1 response and Directory supplement

Execution: `resolve_my_env_cancom_email_hold_codex_001`; executor `codex`; Operator `op044`; 2026-10-02.
Origin OAR2: `oar2_resolve_my_env_cancom_email_hold_codex_20261002_001`.
OAR2 raw-byte SHA-256: `2d4a7cc3140a4916edbc4858f54fc871ed21e7fbb44ce3b812fa6dbec64bff46`; 3012 bytes.
Return: `registry://cancom/oar1_return/resolve_my_env_cancom_email_hold_codex_001`.

Fresh pickup resolves for Codex with source/DB/deployment correction scope. Queue remains `oar1_submitted`; this append-only supplement preserves the earlier held return and review lifecycle.

## Evidence classes

Declared: Operator reported `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.

Observed: Supabase logs at 2026-10-02T22:43:06.898Z show successful NUG effect preparation, followed at 22:43:07.334Z by Directory RPC HTTP 200. Occurrence `myenv-email-4e4e0bd3-0856-4df6-b61d-8df5ca963b40` exists with standing `awaiting_effect_receipt`, returned_at null. No corresponding receipt custody or recent CanCom message reference was found. HTTP 200 is transport standing only: the Directory resolver returned business standing `held`, reason `envpac_unresolved` in a direct read-only reproduction.

Governed: exact personal EnvPAC is registered with standing `effective` and is_effective true. Existing personal runtime source `20260924113507_c1me_envpac_runtime_primitives_v1.sql` requires that same predicate. The Directory function incorrectly required `active`. No PAC standing was normalized or changed.

The deployed adapter calls Directory only after provider acceptance. This control-flow evidence indicates an accepted provider effect before the hold; delivery, provider identifier, and receipt return remain unverified because no receipt was persisted. Codex performed no real send and no retry. Zero executor-initiated messages must not be substituted for the Operator attempt's unknown delivery outcome.

## Bounded corrections

Implementation commit `e19716efbda5735bfdcccad2663fc8eb37634f08`:

- Directory predicate corrected from active to effective, retaining exact environment/EnvPAC matching and is_effective true. Existing invoker security, grants, upsert/contact semantics remain intact. Local migration `20261002224950_myenv_directory_effective_envpac.sql`; applied migration version `20261002225142`.
- Directory business hold returns HTTP 409 with the existing accepted-effect decision evidence, rather than HTTP 502. This is a business hold, not a verified gateway failure.
- CanCom frontend parses unexpected non-JSON responses into HLD `cancom_api_response_unverified`, preserving request/occurrence identity and HTTP status/content type, with external_effects unverified. HTML content is not reflected. Draft remains available; no automatic retry or success claim.

The exact source of the HTML response is unresolved without the original response status/body or edge error evidence. The Directory mismatch is directly proven; it must not be represented as proof of a particular Cloudflare error page.

## Validation and mutation accounting

16 focused tests pass: FREE authority/redirect behavior, adapter hold/acceptance/receipt contract, Directory held-after-acceptance JSON evidence, and non-JSON frontend handling. A clean committed-source `build:c3field` passes with existing chunk warnings. Unrelated working C3OpsDoor.css changes were excluded from the commit.

Rollback-only service-role test resolves the effective personal EnvPAC and continues to hold a mismatched environment. Post-migration service-role Directory list resolves with no contacts. Function remains SECURITY INVOKER; anon/authenticated EXECUTE remain false. No privileges, owner/session records, PACs, contacts, messages, existing occurrence, or receipt standing were changed by the correction.

Six implementation/test/migration files committed. One DB function predicate replaced. Deployment uses the registered Git-integrated c3field production branch by fast-forward; no new provider/Worker or credential scope. Deployment identity and return custody readback are recorded in the accompanying evidence receipt after completion.

Standing: demonstrated Directory defect and JSON-response handling corrected; prior Operator occurrence remains held pending provider receipt reconciliation. No resend, fabricated receipt, or lifecycle closure. Next bounded decision is to reconcile the existing accepted-effect attempt using authorized provider evidence before considering another SEND.
