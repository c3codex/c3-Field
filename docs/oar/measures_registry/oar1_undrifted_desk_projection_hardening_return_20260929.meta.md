---
oar: OAR1
title: unDrifted Desk Projection Hardening Return
date: 2026-09-29
operator: op044
responds_to: docs/oar/measures_registry/oar2_undrifted_desk_projection_hardening_20260929.meta.md
status: returned_for_chazz_review_and_operator_disposition
---

# OAR1 — unDrifted Desk Projection Hardening Return — 2026-09-29

## Execution return

PR #72 was merged to the Measures production branch.

- PR: https://github.com/c3codex/c3-Field/pull/72
- merge commit: `36b9424e2fff46ce7b0c43948a490055b1983c17`
- OAR2 branch commit: `3c9f17a73f7735966d2e3048b046986049154c0f`
- renderer implementation commit: `b017646736df56578d1e981e72e9649aa1589279`

## Mutations

1. Feature resolution now prefers the active release's explicit `featured_article_object_key`; feature designation is independent from desk recency.
2. Desk resolution now considers all eligible released/visible publication pages, not only the active issue.
3. Renderer canonicalizes `current` and `current_state` to `current_state`.
4. Renderer canonicalizes `structural_standings` and `structural_standing` to `structural_standing`.
5. Desk recency uses published dispatch timestamp where present.
6. Current State objects lacking dispatch timestamps use the active release's explicit `current_desk_object_key` as the governed fallback rather than inventing time/order authority.
7. Current Issue remains active-issue scoped and suppresses Feature/current Desk occupants from duplicate display.
8. Banner projection remains article-bound and continues to resolve from dispatch media or the page's seated media URL, preserving split runtime buckets.

## No mutation

No article text, issue membership, PubPAC custody, durable media custody, bucket location, canonical host/DNS, C2ME/EnvPAC primitive, resolver, economic rule, or publication standing changed.

## Hold

Canonical desk identity was NOT rewritten into existing page metadata. Desk identity is operational; under the operative metadata rule it must not be promoted into metadata authority. First-class persistence of canonical desk identity therefore remains a schema-review hold rather than being silently written.

## Verification

GitHub reported PR #72 mergeable before merge and merged successfully. No GitHub Actions/status checks were registered for the implementation commit. External production readback was not established by the available web reader, so live Cloudflare/runtime verification remains pending Operator/readback evidence.

## Standing

EXECUTED → MERGED TO MEASURES → RETURNED → LIVE READBACK PENDING → OPERATOR DISPOSITION PENDING
