# unDrifted Publication Release Registry

## Purpose

Seats the **Publication Release** object — the missing governance seam between an Issue and DB-rendered publication state, per `oar2_establish_undrifted_publication_release_pipeline_v1`.

Prior to this OAR2, the chain was:

```
Registered Assets -> manual or absent sync -> DB metadata -> FREE renderer
```

Registered assets (`Assets/Registry/asset_registry.md`) and the file-based Issue object (`Assets/Issues/unDrifted/Issue01/issue01.meta.md`) had no governed relationship to the live-rendered `measures_encounter_def.metadata` that `/undrifted` actually reads. A Release closes that gap as an explicit, inspectable object:

```
Issue -> Publication Release -> Registered Assets -> Publication State -> FREE
```

unDrifted is a governed publication registry surface, not a frontend blog. The Release object is what makes an Issue's registered assets *eligible* to be synced into DB-rendered state — it is the single place that records whether that has happened, and under what authority.

## Structure

```
Assets/Releases/unDrifted/README.md                        this file
Assets/Releases/unDrifted/release_registry.md               index of all releases and their state
Assets/Releases/unDrifted/Issue01/release01.meta.md         Issue 01's release object
Assets/Releases/unDrifted/Issue01/issue01_content_authority_decision.meta.md   decision surface for operator review
```

## Release Object Fields

```yaml
release_id:                  # e.g. undrifted_issue01_release01
issue_id:                    # the Issue this release belongs to
active_issue:                # true | false — mirrors the bound issue's is_active at time of resolution
approved_article_asset_ids:  # [] — asset_ids approved for DB sync; null/empty until content authority resolved
approved_banner_asset_ids:   # [] — same, for banners
publication_state:           # pending_content_authority_decision | approved | synced | superseded
archive_state:                # not_archived | archived
renderer_eligibility:        # true | false — whether FREE is authorized to render this release's content as /undrifted's live state
db_sync_status:               # not_synced | synced | out_of_sync
db_sync_path:                 # reference to the governed sync mechanism used (script/migration path)
related_oar2:
related_oar1:
notes:
```

## Lifecycle

1. A release is created shell-first, bound to its issue, with `publication_state: pending_content_authority_decision` and `renderer_eligibility: false`. It does not yet name approved assets.
2. An explicit operator decision (recorded in the issue's `*_content_authority_decision.meta.md`) resolves which registered assets are approved. The release row is updated: `approved_article_asset_ids`, `approved_banner_asset_ids`, `publication_state: approved`.
3. The governed sync path (`scripts/sync-undrifted-publication-release.cjs`) reads an `approved` release and writes the corresponding `measures_encounter_def.metadata` (via traceable upsert, never hand-edited). `db_sync_status` flips to `synced`, `renderer_eligibility: true`.
4. When a release is superseded by a new one for the same issue (e.g. issue content revised) or the issue is archived, `publication_state: superseded` / `archive_state: archived`.

## Rules (from OAR2)

- The renderer (FREE) is never the authority. It only renders what a `synced` release has written to DB metadata.
- No live article link is ever replaced without an explicit operator decision recorded against the release.
- DB content is never hand-edited outside the governed sync path — every DB write must trace back to a registered asset and a release row.
- Future registry expansion (contributor, social, feed) is recorded as future scope only — see `release_registry.md` — and is not implemented against this release model.

## Relationship to OAR Authority

OAR2 files reference release objects and asset ids only — they do not embed article bodies, decide content authority, or duplicate DB content. This registry and the governed sync script are the only path from registered assets to rendered publication state.
