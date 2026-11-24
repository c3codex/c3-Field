# Native OAR2 executor candidate — #018

Source-only, based on c3-Field `0ca1e96fdc458ec497d21350e2438dfd0f520b2e`.
This module is NOT a running service and has no production adapters. It does
not use the post-OAR1 `cancom_codex_review_*` interfaces.

## Observed Registry boundary

On Registry project `zfihrspxvennjzazxcbj`, catalog inspection returned:

- `resolve_cancom_oar_pickup_v1(p_key_type text,p_key text,p_executor text)`:
  STABLE, EXECUTE postgres/service_role only. Returns manifest/passage/capability
  references and canonical custody bytes/digest. It is not an atomic lease.
- `register_cancom_oar_return_v1(p_execution_instance text,p_executor text,
  p_oar1_key text,p_integrity_sha256 text,p_custody_reference text,
  p_return_standing text,p_evidence jsonb)`: EXECUTE postgres/service_role only.
  Exact return retry is idempotent; partial/conflicting returns HOLD.
- `cancom_oar_delivery_retrieval_v1`: Registry process active, runtime status
  `registered_specification_standard_runtime_implementation_pending`.
- No native authenticated OAR2 executor discovery/claim/lease interface was
  found in the public catalog inventory. Review continuation APIs are distinct.
- Existing `cancom-oar-passage.ts` uses a server service-role RPC helper. Do
  not reuse it as a signed-user executor transport or widen its SQL grants.

An operating authorized unattended executor was NOT established. Management
SQL pickup proves only bounded manual Registry retrieval. No credential,
scheduler, running worker or deployment is installed by this candidate.

## Adapter requirements before live use

Supply independently qualified signed-user authentication and effective OAR
authorization, a native discovery/wake adapter, a custody reader, atomic lease
with current revocation/expiry and fencing, and exact native return mapping.
`authorize(instance, token?)` must verify actual platform session, Registry
authority, allowed action, OAR2 digest and route; it must not trust user metadata
or infer permissions from the string `codex`. `claim` must provide atomic
lease ownership. No service-role identity fallback is allowed.

The journal must durably and atomically implement insert-if-absent and phase
compare-and-swap, preserving immutable ready envelopes across process restarts.
The checked-in Map fixture tests mechanics only and is NOT production storage.
The action allowlist is supplied by qualified code: no payload eval, shell
command generation, unknown-action fallback, or implicit install/deploy.

The action adapter must itself fence effects and respect its lease and explicit
scope. Arbitrary adapters cannot be safely cancelled by a Promise timeout.
This candidate intentionally leaves timed-out/started work HELD for manual
reconciliation, rather than executing it again. Durable ready work can resend
the identical OAR1 while the same authority and lease remain valid. Expired
leases HOLD; no fabricated resume or success. Receipt ambiguity never advances
the journal to returned. A live authenticated return adapter must map the exact
envelope to native required evidence fields and verify the returned relation.

Local tests simulate only the adapter boundary: positive return, identity,
digest, expired/revoked authority, unknown action, duplicate dispatch, crash,
timeout/restart and ambiguous receipt. They do not qualify cross-process storage,
real JWT, a real lease service, operating worker or operational acceptance.

M3 HELD. Independent operational acceptance NOT ESTABLISHED. Operator disposition
RESERVED. No PR #23 SQL changes or runtime activation authorized here.
