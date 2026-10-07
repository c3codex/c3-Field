# OAR2 — My_Stash NUG Runtime — Codex — 2026-10-07 — 001

## Current state
`c3ops_nug_my_stash_v1` is operator-confirmed and persisted as `HLD_MATURITY_GATE`.
Canonical definition: My_Stash makes “keep this in my environment” a native function.
Target My Env: `env_person_eea672f5a7676dad4316755b`
Target EnvPAC: `c3envpac_person_eea672f5a7676dad4316755b_v0_1`
Target CURRENT: `current_env_person_eea672f5a7676dad4316755b_v1`

## Objective
Implement the smallest native My_Stash NUG runtime that lets the participant privately retain, retrieve, organize, and selectively surface participant-chosen artifact references inside My Env through the existing NUGS passage model.

## Bounded action
1. Reuse the existing NUGS runtime, preflight, capability, context, occurrence/effect evidence, FREE, and Current State rails. Do not create a parallel stash subsystem.
2. Implement/register the native c3Ops My_Stash function and process required for `preflight_c3ops_nug_spec_v1`.
3. Form the exact My_Stash capability, authority/context binding, and active NUG binding for the target My Env/CURRENT.
4. Preserve underlying artifact custody, ownership, provenance, and standing. Stashing creates only a private My Env/Current State reference.
5. Support retain, list/retrieve, organize, remove-from-stash, and explicit selective-surface intent. Selective surfacing must stop at the next governed passage boundary; it must not itself publish, form a PAC, transfer custody/ownership, or create standing/authority.
6. Use the persisted first specimen metadata for `Current State, Chazz — shhh she’s a stoner`. Do not invent or relocate the image asset if its actual custody bytes are not resolvable from registered c3 custody; return that asset-placement condition explicitly if still held.
7. Verify fail-closed behavior, participant/My Env scoping, idempotent retention, no public visibility by default, and Current State evidence return.

## Material prohibitions
No public release by default. No automatic PAC formation/elevation. No authority or relational standing created by stash membership. No custody/ownership transfer. No unrelated My Env redesign. No new external provider or credential scope.

## Return
Return OAR1 through CanCom with exact source/database changes, registered binding/capability/context identifiers, verification evidence, first-specimen standing, and any remaining HLD.
