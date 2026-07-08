# Asset Registry — Measures Registry

## Purpose

Central index of every registered asset (article, banner, campaign, research, media hook) tracked as a governed registry object. This file is the registry of *record* — it lists every asset by `asset_id`, its current lifecycle status, and the OAR2/OAR1 pair that governs/proves it. It does not hold asset content.

Established by `oar2_add_asset_registry_and_sidecar_metadata_convention_v1`, following the asset/OAR separation seated by `oar1_establish_registered_asset_file_structure_v1`.

## Asset Lifecycle

Each asset moves through the following states, in order (not every asset passes through every state — e.g. media hooks stop at `revised`/`versioned` without a `published` step if never shipped):

| State | Meaning |
|---|---|
| `draft` | Content exists under a `drafts/` (or equivalent) path; not yet execution-ready. |
| `registered` | Content has moved to a `registered/` (or equivalent) path and is bound to an OAR2 that governs its publication. |
| `published` | Content has shipped to its publication target; an OAR1 proves this. |
| `observed` | A previously published asset has been reviewed/audited post-publication (e.g. QA, drift check). |
| `revised` | Content has been edited after registration or publication; version increments. |
| `versioned` | A new `_v{N}` asset file has been created superseding a prior version; prior version remains for history. |

## Universal Sidecar Metadata Convention

Every registered asset file, regardless of type, is paired with a sidecar metadata file of the same base name plus `.meta.md`:

```
asset_file.ext
asset_file.meta.md
```

Example:
```
undrifted_issue01_measures_registry_launch_article_v1.md
undrifted_issue01_measures_registry_launch_article_v1.meta.md
```

For asset types where the content file itself is already Markdown (articles, campaign copy), the sidecar may instead be a frontmatter block at the top of the same file rather than a separate `.meta.md` — but binary assets (banners, media) always require a separate sidecar file, since metadata cannot be embedded in the binary.

### Required Sidecar Fields

```yaml
asset_id:            # matches the asset filename (without extension)
asset_type:          # article | banner | campaign | research | media_hook
title:               # human-readable title
slug:                # url/file-safe slug
version:             # v1, v2, ...
status:              # draft | registered | published | observed | revised | versioned
issue_or_campaign:   # e.g. unDrifted/Issue01, Buffer/Issue01
file_path:           # path to the asset content file this sidecar describes
related_oar2:        # oar_id of the governing OAR2
related_oar1:        # oar_id of the OAR1 proof (once available)
publication_targets: # where this asset ships (site route, Buffer channel, NSF portal, etc.)
created_by:          # author/operator
updated_by:          # last editor/operator
notes:               # free-text context
```

This convention applies uniformly to: articles, banners, campaign assets, research assets, and media hooks.

## Registry Records

| asset_id | asset_type | status | issue_id | issue_or_campaign | related_oar2 | file_path |
|---|---|---|---|---|---|---|
| `undrifted_issue01_measures_registry_launch_article_v1` | article | registered | undrifted_issue01 | unDrifted/Issue01 | oar2_register_undrifted_issue01_launch_assets_v1 | Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md |
| `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1` | article | registered | undrifted_issue01 | unDrifted/Issue01 | oar2_register_undrifted_issue01_launch_assets_v1 | Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md |
| `undrifted_issue01_measures_registry_launch_banner_v1` | banner | registered | undrifted_issue01 | unDrifted/Issue01 | oar2_register_undrifted_issue01_launch_assets_v1 | Supabase Storage: `measures-registry/undrifted_issue01_measures_registry_launch_banner_v1.webp` |
| `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1` | banner | registered | undrifted_issue01 | unDrifted/Issue01 | oar2_register_undrifted_issue01_launch_assets_v1 | Supabase Storage: `measures-registry/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp` |
| `undrifted_issue01_ai_isnt_broken_systems_are_article_v1` | article | published | undrifted_issue01 | unDrifted/Issue01 (cover_story) | oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1 | Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md |
| `undrifted_ai_isnt_broken_landing_banner_v1` | banner | registered | undrifted_issue01 | unDrifted/Issue01 (cover_story) | oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1 | Supabase Storage: `measures-registry/ai_isnt_broken_landing.webp` (existing asset, not newly uploaded — see sidecar notes) |
| `undrifted_issue01_editors_letter_article_v1` | article | published | undrifted_issue01 | unDrifted/Issue01 (editors_letter) | oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1 | Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md |
| `undrifted_issue01_editors_letter_codexstone_banner_v1` | banner | registered | undrifted_issue01 | unDrifted/Issue01 (editors_letter) | oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1 | Supabase Storage: `measures-registry/editors_note_banner.webp` (see sidecar notes — corrected mid-execution from an initial codexstone-seal guess) |

The two article assets are fully authored and registered (frontmatter + body complete) at their local repo paths. The two banner assets are registered as well — their `.webp` binaries live in the Supabase Storage bucket `measures-registry` (not in the local repo tree); each sidecar's `storage_bucket`/`storage_object_path` fields point to the canonical binary location, confirmed present via `storage.objects` query on 2026-07-07.

All four assets above are bound to issue `undrifted_issue01` (see `Assets/Issues/unDrifted/Issue01/issue01.meta.md`), added by `oar2_register_undrifted_issue_model_and_current_issue_renderer_v1`. The `issue_id` column is the new issue-binding field this OAR2 added to the registry schema — future asset rows should populate it once bound to an issue (leave blank/omit for unbound assets, e.g. research or campaign assets not part of an unDrifted issue).

The cover story article (`undrifted_issue01_ai_isnt_broken_systems_are_article_v1`) was revised from `registered_draft` (short-form) to `ready_for_publication` (full approved draft supplied by operator) and is now `published` — live at `paragraph.com/@undrifted/ai-isnt-broken-systems-are` after three rate-limited attempts and a successful retry. **Still not bound into the live `/undrifted` feature selection** — that remains a separate, explicit decision. Its banner (`undrifted_ai_isnt_broken_landing_banner_v1`) binds to the pre-existing `ai_isnt_broken_landing.webp` media asset already live as the `/undrifted` cover image — no binary was duplicated or newly uploaded.

The Editor's Letter (`undrifted_issue01_editors_letter_article_v1`) is `published` — registered verbatim from a fully-supplied operator document, then published live to Paragraph (`paragraph.com/@undrifted/from-the-editor`) after explicit operator confirmation. Its banner binds to `editors_note_banner.webp` (uploaded 2026-07-08, registered under a new `measures_media_map` row, `media_role: editorial_banner` — a first-time registration, not a duplicate alias).

## Campaign Layer

`oar2_register_issue001_launch_campaign_and_distribution_assets_v1` seated the first governed Publication Campaign, built on top of this registry rather than replacing it. Campaigns do not own content — Issues own content; Campaigns orchestrate registered assets; Distribution platforms are projections downstream of Publication authority.

Three new tables (`measures_publication_campaign`, `measures_publication_campaign_asset`, `measures_publication_distribution_asset`) carry this orchestration. `campaign_asset.publication_asset_id` and `distribution_asset.publication_asset_id` are pointers back into this registry (or into `measures_publication_dispatch`/`measures_publication_issue_page` for assets that predate the sidecar convention, e.g. `agents_with_keys_dispatch_v1`) — no media is duplicated or re-uploaded anywhere in the campaign layer.

Campaign: `undrifted_issue001_launch_campaign_v1` — status `draft`, `release_state: held`. 6 Campaign Assets (hero graphic, quote, thumbnail, carousel, email excerpt ×2) and 10 Distribution Assets (website, instagram, x, linkedin, email, paragraph) registered, all `status: draft`, unscheduled and unpublished per explicit OAR2 constraint. `optics` fields prepared on all three tables (field scaffolding only — no analytics implementation, no individual tracking). RLS: service_role only, no public read — this is an internal orchestration layer, not FREE-rendered content.

**Missing assets** (not registered, so not referenced by any Campaign Asset): no audio/podcast source exists anywhere in the registry, so no Podcast Clip campaign asset was created; no cut promotional video/Reel/Short exists distinct from the long-form orientation videos (`assessment_report_orientation.mp4`, `questions_ungoverned_systems_cannot_answer.mp4`), so no Reel/Short/Video campaign asset was created for those platforms. Both are genuine content gaps, not something this OAR2 was authorized to fabricate.

## Relationship to OAR Authority

OAR2 files never appear as rows' content — only as `related_oar2` references. This registry is additive: new rows are appended as assets are registered; existing rows are updated in place as `status` advances, with `related_oar1` filled in once an OAR1 proves the transition.
