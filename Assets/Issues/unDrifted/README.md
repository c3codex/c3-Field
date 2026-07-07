# unDrifted Issue Registry

## Purpose

Groups unDrifted articles, banners, and campaign assets into monthly editorial issue objects. An issue is the unit /undrifted renders: exactly one issue is `active` at a time; closed issues move to the library.

## Structure

```
Assets/Issues/unDrifted/README.md              this file
Assets/Issues/unDrifted/issue_registry.md       index of all issues and their status
Assets/Issues/unDrifted/Issue01/issue01.meta.md Issue 01 metadata object
Assets/Issues/unDrifted/Issue02/issue02.meta.md (future)
```

## Issue Object Fields

```yaml
issue_id:              # e.g. undrifted_issue01
issue_number:          # e.g. 01
title:                 # editorial issue title
month:
year:
status:                # active | archived
is_active:             # true | false — exactly one issue should be true at a time
issue_slug:            # e.g. issue-01
article_asset_ids:     # [] — asset_ids from Assets/Registry/asset_registry.md
banner_asset_ids:      # [] — asset_ids from Assets/Registry/asset_registry.md
campaign_asset_ids:    # []
publication_targets:   # e.g. unDrifted, Paragraph, Buffer
open_date:
close_date:            # pending until superseded by the next issue
current_route:         # route active issue renders at, typically /undrifted
archive_route:         # permanent route once archived, e.g. /undrifted/issue-01
library_route:         # /undrifted/library
related_oar2:
related_oar1:
notes:
```

## Lifecycle

1. An issue is created `active: true` with `close_date: pending`.
2. Articles/banners/campaign assets are bound to it as they're registered (see `Assets/Registry/asset_registry.md` for the underlying assets — this registry only references `asset_id`s, it does not duplicate asset content or metadata).
3. When the next issue opens, the prior issue's `status` flips to `archived`, `is_active: false`, and `close_date` is set. It keeps its `archive_route` permanently.
4. `/undrifted` always renders whichever issue has `is_active: true`. `/undrifted/library` lists all `archived` issues. `/undrifted/issue-NN` renders that issue directly regardless of active state.

## Relationship to OAR Authority

OAR2 files reference issue objects and asset ids only — they do not embed article bodies or issue content. This registry and its per-issue `.meta.md` files are the source of truth for issue structure; `Assets/Registry/asset_registry.md` remains the source of truth for individual asset state.
