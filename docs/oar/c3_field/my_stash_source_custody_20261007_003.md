# My_Stash source custody reconciliation

Execution: `my_stash_source_custody_codex_003`.
Authority: `oar2_resolve_my_stash_source_custody_20261007_003`, source commit
`f7e6fa51ef091db072dd0b8ee53fb4ce7136a605`.
Implementation preserved: `161760c2f57988587a5d43587c4ee46e2eea61a0`.
Registry inspection and isolated reconstruction date: 2026-10-08.

## CURRENT reconciliation

The registered `my_stash_op044_v1` binding is active and resolves
`resolved_for_nug`, with no missing predicates. Its standing authority is
`oar2_my_stash_standing_runtime_authority_20261007_002`, execution
`my_stash_standing_runtime_chazz_002`, executor `chazz`, capability
`my_stash_runtime_authority_v1`, and context
`cancom_ctx_my_stash_op044_runtime_v1`.

The server source reads this binding from Registry on each request. It derives
the executor, execution, capability, OAR and context from the registered spec;
it does not pin the historical Codex formation encounter. Existing session
ownership, private visibility, Current, exact native function, input allowlist,
Registry resolution and replay guards remain intact.

The migration is unchanged. Recreating it in an isolated, network-disabled
PostgreSQL 17.6 container produced catalog definitions exactly equal to the
CURRENT live definitions, including every UTF-8 byte:

| Function | Catalog bytes | SHA-256 |
| --- | ---: | --- |
| `public.resolve_c3ops_my_stash_v1(jsonb)` | 8,269 | `bb797b51ccf956248b0166aed60e498bc2021092e38896919690a2f79c9e561d` |
| `public.call_c3ops_nug_native_v1(jsonb,text)` | 5,971 | `da3d7694b04aa3e51807abc2720c6fd4bebf3cfee0fda71831349f350379e4ab` |

The migration's Git-blob UTF-8 SHA-256 is
`7f28f0dceb4de42736df54917b1e2f5be303a6f53b6cbf834e0aaabd8771001c`.
The isolated fixture used empty placeholder tables solely to satisfy the two
PL/pgSQL rowtype declarations. This demonstrates exact catalog reconstruction;
it does not demonstrate a newly formed Registry or grant runtime authority.
The read-only `scripts/my-stash-source-custody-verify.sql` checks these hashes.

Fresh transport and participant-boundary verification passed all 13 tests:

```text
node --import tsx --test functions/_lib/free-nugs.test.ts functions/_lib/my-stash.test.ts
```

## Historical evidence and runtime boundary

`scripts/my-stash-runtime-formation.sql` remains the original one-shot Codex
001 formation record. Its original executor, queue, capability, context and
preconditions are historical. Do not run it against the CURRENT standing runtime
or substitute those historical values for the active Chazz 002 binding.

`scripts/my-stash-runtime-rollback-tests.sql` remains the original formation-time
rollback test fixture. Its initial empty-stash assumptions describe that test;
they do not describe CURRENT retained evidence. The original held OAR1 is
preserved. CURRENT authority and registered specimen retention now resolve the
historical causes; this source-custody execution does not rewrite that return.

This reconciliation changes documentation and adds a read-only verification
query. It changes no implementation semantics, Registry runtime rows, authority,
assets, receipts or historical records. The standing Chazz runtime OAR remains
open and operative. No production merge, deployment or provider effect is
authorized. The non-production custody commit uses `[CF-Pages-Skip]` to omit
automatic Pages deployments, as documented by Cloudflare's GitHub integration.

Exact execution evidence, remote custody readback and the execution-qualified
OAR1 are returned through the registered CanCom route. This document creates no
parallel return mechanism.
