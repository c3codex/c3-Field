# OAR1 supplement — Cloudflare FREE transport correction

Execution: `resolve_my_env_cancom_email_hold_codex_001`.
Operator `op044`; executor `codex`; 2026-10-02.
Origin OAR2: `oar2_resolve_my_env_cancom_email_hold_codex_20261002_001`.
Canonical OAR2 SHA-256: `2d4a7cc3140a4916edbc4858f54fc871ed21e7fbb44ce3b812fa6dbec64bff46`, 3,012 bytes.
Return relation: `registry://cancom/oar1_return/resolve_my_env_cancom_email_hold_codex_001`.

This supplements the immutable OAR1 at commit `645c9ff1c37beb3218acb0ae0d87f1f486bd7560`; it does not replace its custody or advance Registrar/Operator review. Current pickup was freshly read as `resolved_for_executor`, queue `oar1_submitted`, capability still active, with source correction/deployment scope intact. The user supplied new exact live decision evidence after the earlier return.

## Exact failure and correction

Declared/observed operator evidence: request `bbf7b808-fa33-4f3e-8b80-cfaebb617534`, occurrence `myenv-email-bbf7b808-fa33-4f3e-8b80-cfaebb617534`, HLD `effect_preparation_unverified`, provider configured, dispatch_attempted false, external_effects 0.

Registry readback: exact occurrence and effect passage absent. Rollback-only service-role preparation still returns `awaiting_effect_receipt` after the earlier grants. Live Supabase logs showed the successful NUG binding read at 2026-10-02T21:16:17.188Z and no NUG RPC request in the inspected 20:40–21:20 UTC window. This isolated the remaining failure to transport before the database call.

Direct workerd 2026-10-02 probe reproduced the defect: constructing a Request with `redirect: "error"` throws `Invalid redirect value, must be one of "follow" or "manual"`. Request construction with manual mode succeeds. The previous Node-only transport test accepted error mode and therefore missed this edge-runtime incompatibility. The earlier SQL permission defect was real and repaired, but it was not the only blocker.

`functions/_lib/free-nugs.ts` now uses manual mode and explicitly rejects HTTP 3xx before reading a response. It never follows a redirect or retries, and a redirect returns HLD `nug_registry_redirect_refused`. Registry and CanCom authority predicates, existing NUG tuple, provider adapter, credential scope and receipt contract are unchanged.

Implementation commit: `6cc9752fc4b456e604881525af66cbb911146d99`.
Changed files: FREE runtime and its regression test; three local-only workerd fixture files under `scripts/verify-free-nugs-workerd/`. No additional DB privilege/data repair was performed.

## Validation

- 13 Node adapter/FREE tests passed, including explicit manual redirect refusal with one call and no retry.
- Actual corrected FREE implementation bundled and tested in workerd using an entirely local synthetic outbound service: preparation returned `awaiting_effect_receipt`; redirect returned HLD `nug_registry_redirect_refused`; fixture result PASS; external_effects 0. No live Registry/provider connection or credential was present in that fixture.
- TypeScript comparison to registered source base: no new diagnostics; existing baseline errors remain.
- Runtime probe and fixture used only localhost. Reproduce: bundle `scripts/verify-free-nugs-workerd/worker.ts` with esbuild to `probe.bundle.js` beside `config.capnp`; run `workerd serve scripts/verify-free-nugs-workerd/config.capnp`; GET `http://127.0.0.1:4182`.
- Production fast-forward release pushed to registered `c3field` branch. Deployment verification is recorded in the associated supplement return receipt after Cloudflare completes.

## Standing and mutation accounting

Source repair completed and locally validated; authenticated production preparation/send remains unverified by this executor. The operator's exact attempt had no provider dispatch, and this executor initiated no real email. No outbound Registry message exists for that request. The live external test remains under the existing operator-controlled recipient/session boundary.

No new external providers/Workers, credentials, browser permissions, authority rewrites, PAC changes, or messages. Local workerd instances are test fixtures only. Five correction/test files committed and released; this supplemental evidence artifact is additionally returned to CanCom/cancom. Append-only supplementary execution/custody evidence will record release and artifact integrity; the previous OAR1 and lifecycle standing remain preserved.
