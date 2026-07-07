---
document_type: oar1
authority_level: proof
document_scope: publication_asset_registration
title: OAR1 - Register unDrifted Issue 001 Cover Story AI Isnt Broken Systems Are
closes: OAR/OAR2/publication/oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Register unDrifted Issue 001 Cover Story "AI Isn't Broken. Systems Are."

## Summary

The cover story is now a registered article asset with a bound banner and a draft Publication Dispatch record. **The cover region on `/undrifted` is not clickable and `featured_article_set` was not touched**, per this OAR2's explicit hold. The one open item is content depth — see Blocker §1.

---

## 1. Article Asset — Path and Standing

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md
```

`status: registered_draft` (not `ready_for_publication`). **Blocker, flagged rather than worked around:** the OAR2 says "use the approved draft as source body," but no separate long-form draft text was attached to the OAR2 or found anywhere in the repo (searched broadly — 77 files matched "AI Isn't Broken" but none contained an unused full article draft for this title; the two prior registered articles from earlier this session, by contrast, had their full bodies embedded verbatim in their own OAR2 documents). Rather than author substantial new marketing prose that wasn't supplied — which would risk inventing claims — this asset's body uses only:
- The already-canonical `cover_story` copy seated in `measures_publication_registry.metadata.cover_story` (`feature_headline`, `feature_deck`, `feature_positioning`), i.e. the exact text already live on `/undrifted` today.
- The two required closing sections (Connect/subscribe invitation, AI Operations Assessment pathway), both written as short functional CTAs pointing at real, already-live destinations (`https://measuresregistry.com/undrifted` and `/ai-operations-assessment`) — no invented links, no certification/conversion/funding/NSF claims.

This is real and honest, but short — a cover statement, not a full essay. If a fuller draft exists outside this repo, supplying it lets this asset be revised to `status: registered` / `ready_for_publication` without re-deriving anything else here.

## 2. Banner Binding

**Bound to an existing asset — no duplication.** Queried `measures_media_map` for `media_role = 'ai_isnt_broken_landing'` (the exact image already rendered as the `/undrifted` cover visual) and confirmed it resolves to `measures-registry/ai_isnt_broken_landing.webp` in Supabase Storage. Created a sidecar registering that existing binary under the Asset Registry convention — no new upload, no duplicate binary:

```
Assets/Banners/unDrifted/Issue01/undrifted_ai_isnt_broken_landing_banner_v1.meta.md
```

## 3. Asset Registry Update

`Assets/Registry/asset_registry.md` — two new rows added: the article (`registered_draft`) and the banner (`registered`), both bound to `issue_id: undrifted_issue01`, both carrying `issue_role: cover_story` context in the accompanying note. No existing row modified.

## 4. Publication Dispatch — Status

**Created, as a draft row — safe and additive.** Checked `measures_publication_dispatch` for constraints before writing: only `UNIQUE(dispatch_key)` and a primary key, no status enum to satisfy, and `ai_isnt_broken_systems_are_dispatch_v1` did not previously exist, so this is a pure insert with zero risk to any existing row. Applied via migration `20260707234752_register_undrifted_ai_isnt_broken_systems_are_draft_dispatch` (project `zfihrspxvennjzazxcbj`, mirrored locally):

- `status: 'draft'`, `article_url: null`, `external_url: null`, `published_at: null` — confirmed via query after insert.
- `dispatch_body` mirrors the registered article asset's body verbatim (single source, not two independently-editable copies).
- `metadata` records `issue_role: cover_story`, `cta_route`, `connect_route`, the linked file `asset_id`, and an explicit note: *"Do not mark published or set article_url/external_url until a real Paragraph URL exists."*

## 5. Cover Region — Route Status

**No valid route exists yet, and none was created.** Confirmed unchanged: `featured_article_set` in `measures_encounter_def` still contains only Agents With Keys and Fables & Myths (untouched); `encounter_profile` untouched; no `onClick`/`href` was added to the cover story region in `LapisChamberRenderer.tsx`; no CSS or renderer file was touched at all this pass. The cover remains visually present but non-interactive, exactly as instructed — wiring it up is explicitly deferred to a later OAR2 once a real route (internal or Paragraph) exists.

## 6. Publication Standing of Existing Articles (Read-Only Verification)

Queried `measures_publication_dispatch` fresh for every `dispatch_key` under `publication_key='undrifted'`:

| Article | Status | Live Paragraph URL | Notes |
|---|---|---|---|
| Agents With Keys | `published` | `paragraph.com/@undrifted/agents-with-keys` | Published 2026-06-23. Currently featured on `/undrifted`. |
| Fables & Myths | `published` | `paragraph.com/@undrifted/fables-and-myths` | Published 2026-06-23. Currently featured on `/undrifted`. |
| Agents of Chaos | `published` | `paragraph.com/@undrifted/agents-of-chaos` | Published 2026-05-06. **Not** currently featured on `/undrifted` (unchanged from the prior audit's finding). |
| Structural Drift | `published` | `paragraph.com/@undrifted/structural-drift` | Published 2026-05-06, tagged `issue_number: "ISSUE 002"` in its own row (pre-existing oddity, not something this OAR touched). **Not** currently featured. |
| Computational Systems Governance / NSF pitch | **No dispatch row exists** | none | Exists only as a registered file asset (`Assets/Articles/.../undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md`, `status: registered`) from an earlier OAR2 this session — never entered Publication Dispatch, never published anywhere. |
| Measures Registry launch article | **No dispatch row for this asset** | none | Exists only as a registered file asset (`undrifted_issue01_measures_registry_launch_article_v1.md`, `status: registered`). **Do not confuse with** the pre-existing `measures_registry_dispatch_v1` dispatch row, which is a different, bodyless stub (`dispatch_body` length 0, `published_at: null`, only an `external_url` set) that predates this session and does not correspond to this file asset's content. |

## Blockers

1. **Content depth** (primary, see §1) — this asset is a short, honest cover statement sourced entirely from already-approved copy, not the fuller article the OAR2's phrasing ("approved draft") implies exists. Needs either: the actual draft supplied for a revision pass, or explicit operator confirmation that the short form is sufficient as `ready_for_publication`.
2. **Two stub dispatch rows** (`measures_registry_dispatch_v1`, `undrifted_dispatch_v1`) were noticed during §6's verification — both `published` with no body and no `article_url`. Not touched or altered this pass (out of this OAR2's scope), flagged only for awareness.
3. No route exists for the cover story yet (§5) — expected and correctly left alone per Routed §5; the next OAR2 in this direction should wire it up once either an internal route or a real Paragraph URL exists.

## Next Recommended OAR2

Once either a fuller approved draft is supplied or the short form is confirmed sufficient, and once the piece is actually published (Paragraph or otherwise): update the dispatch row's `status`/`article_url`, then a follow-up OAR2 can wire the cover region to the real route and decide whether `featured_article_set` should include it (a content-authority decision, same category as the still-open Issue 01 decision from the earlier Publication Release OAR2 — not resolved here).
