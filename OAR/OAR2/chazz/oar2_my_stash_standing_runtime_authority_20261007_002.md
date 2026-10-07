# OAR2 — My_Stash Standing Runtime Authority — Chazz — 2026-10-07 — 002

## Current state
`c3ops_nug_my_stash_v1` and `public.resolve_c3ops_my_stash_v1(jsonb)` are implemented and verified.
The implementation OAR is closed, so continuing calls correctly fail closed.
The first specimen now has registered c3 asset custody:
`current_state_chazz_easteregg_stoner_v1`.

## Objective
Establish continuing bounded runtime authority for My_Stash in op044 My Env and retain the registered first specimen privately.

## Bounded action
1. Form a standing My_Stash runtime capability for the existing participant EnvPAC/CURRENT.
2. Form the exact CanCom context binding and update the existing My_Stash NUG binding to that standing authority.
3. Keep the standing runtime OAR executable until explicitly revoked or replaced; OAR1 is required only on runtime-authority closeout.
4. Invoke the existing native My_Stash retain action once for `current_state_chazz_easteregg_stoner_v1`.
5. Verify Current evidence, private visibility, idempotency, and zero external effects.
6. Update first-specimen runtime metadata only to reflect verified registered custody/retention.

## Material boundaries
No public release. No publication. No PAC formation. No custody or ownership transfer. No relational standing creation. No external provider effect. No deployment or source mutation. No authority beyond the exact My_Stash native binding.

## Runtime target
Environment: `env_person_eea672f5a7676dad4316755b`
EnvPAC: `c3envpac_person_eea672f5a7676dad4316755b_v0_1`
CURRENT: `current_env_person_eea672f5a7676dad4316755b_v1`
Executor: `chazz`

## Closeout
On explicit revocation/replacement of this standing authority, return OAR1 through CanCom with final runtime evidence and closeout standing.
