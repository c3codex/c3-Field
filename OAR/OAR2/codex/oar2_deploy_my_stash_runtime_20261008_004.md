# OAR2 — Deploy My_Stash Runtime — Codex — 2026-10-08 — 004

## Current state
My_Stash runtime and standing authority are active in Registry.
Source-custody OAR003 is CLOSED / PASS.
Accepted implementation lineage: `161760c2f57988587a5d43587c4ee46e2eea61a0`.
Accepted remote custody commit: `703ecbf2e2acfb799177397fb75a95f5e70b7c96`.
Current `c3field`: `f7e6fa51ef091db072dd0b8ee53fb4ce7136a605`.
The custody branch is intentionally diverged from current `c3field`; do not merge it wholesale.
Native function SHA256 remains `bb797b51ccf956248b0166aed60e498bc2021092e38896919690a2f79c9e561d`.

## Objective
Deploy the accepted My_Stash application/runtime source to the c3 Field production surface without changing Registry semantics or standing runtime authority.

## Bounded action
1. Start from current `c3field` and reconcile only the accepted My_Stash implementation changes required for runtime delivery from the accepted source lineage.
2. Preserve the accepted My_Stash semantics, tests, Current evidence model, private-default behavior, and native function contract.
3. Run source/build/boundary tests and verify the reconciled migration/function source still recreates the registered native function SHA256.
4. Fast-forward `c3field` only from a clean reconciled deployment candidate; no force push.
5. Trigger the registered `c3field_pages_deployment_identity_v1` Cloudflare Pages production deployment.
6. Verify production deployment and the My_Stash application endpoint fail-closed/authorized behavior. Do not manufacture an authenticated success if credentials/context are unavailable; return exact evidence/HLD.
7. Verify the standing My_Stash NUG remains active and the retained first specimen remains private after deployment.

## Material boundaries
No new My_Stash semantics. No new Registry authority. No operational DB/schema mutation. Do not rerun historical formation SQL against CURRENT. No public release of stashed artifacts. No PAC mutation. No credential expansion. No unrelated source changes. No external correspondence. No force push.

## Return
Return OAR1 through CanCom with reconciled commit, production commit, deployment identifier/status, endpoint/runtime verification, live binding readback, actual effects, and any remaining HLD.
