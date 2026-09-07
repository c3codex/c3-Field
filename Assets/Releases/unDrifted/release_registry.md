# unDrifted Publication Release Registry — Index

Index of all unDrifted publication releases. Full metadata for each release lives in its own `releaseNN.meta.md` file under `Assets/Releases/unDrifted/IssueNN/`.

| release_id | issue_id | publication_state | renderer_eligibility | db_sync_status | meta_path |
|---|---|---|---|---|---|
| `undrifted_issue01_release01` | `undrifted_issue01` | pending_content_authority_decision | false | not_synced | Assets/Releases/unDrifted/Issue01/release01.meta.md |

## Rule

A release only advances past `pending_content_authority_decision` when an explicit operator decision is recorded against its issue's `*_content_authority_decision.meta.md`. No automated process resolves this state.

## Future Registry Expansion (Recorded, Not Implemented)

Per `oar2_establish_undrifted_publication_release_pipeline_v1`, these are future registry objects recognized as the eventual shape of unDrifted beyond the launch Publication Release seam. They are not built, seeded, or wired in this or any prior OAR2 — recorded here only so future OAR2s have a stable reference point rather than re-deriving scope from scratch.

### Contributor Registry
- contributor profile
- role
- byline
- approved assets
- publication permissions

### Social Registry
- platform accounts
- post assets
- campaign records
- scheduled status
- published status
- engagement snapshots

### Feed Registry
- feed items
- source issue
- source article
- source social post
- visibility state
- pinned state
- featured state

Full future shape: `unDrifted -> Issues -> Articles -> Contributors -> Social Registry -> Feed -> Library`. Contributor onboarding, public contributor profiles, social registry UI, an independent feed runtime, and comment/social-network features are explicitly out of scope until a later OAR2 seats them.
