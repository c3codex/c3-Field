# OAR1: Add Asset Registry and Sidecar Metadata Convention
**Closes:** OAR/OAR2/infrastructure/oar2_add_asset_registry_and_sidecar_metadata_convention_v1.meta.md
**Depends on:** oar1_establish_registered_asset_file_structure_v1.meta.md
**Branch:** measures
**Date:** 2026-07-07

---

## Status by Item

| # | Acceptance Criterion | Status |
|---|-----------------------|--------|
| 1 | `/Assets/Registry` exists | SEATED |
| 2 | `/Assets/Registry/asset_registry.md` exists | SEATED |
| 3 | Asset lifecycle documented | SEATED |
| 4 | Sidecar metadata convention documented | SEATED |
| 5 | Four pending launch assets listed as placeholder records | SEATED |
| 6 | OAR2 authority remains separate from registered assets | SEATED |
| 7 | No article bodies embedded in this OAR2 | CONFIRMED |

---

## Folders / Files Created

```
Assets/Registry/                     (new directory)
Assets/Registry/asset_registry.md    (new file)
```

## Asset Registry Path

`Assets/Registry/asset_registry.md`

## Asset Lifecycle Documented

`draft → registered → published → observed → revised → versioned` (not all assets pass through every state — documented with per-state definitions in the registry file).

## Sidecar Convention Confirmed

Universal pattern `asset_file.ext` + `asset_file.meta.md`, applied uniformly to articles, banners, campaigns, research assets, and media hooks. Required fields: `asset_id`, `asset_type`, `title`, `slug`, `version`, `status`, `issue_or_campaign`, `file_path`, `related_oar2`, `related_oar1`, `publication_targets`, `created_by`, `updated_by`, `notes`. Markdown-native assets (articles, campaign copy) may fold this into their own frontmatter instead of a separate sidecar; binary assets (banners, media) require a separate `.meta.md` sidecar since metadata cannot live inside the binary.

## Placeholder Records Added

| asset_id | status | file_path |
|---|---|---|
| `undrifted_issue01_measures_registry_launch_article_v1` | draft | `Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md` |
| `undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1` | draft | `Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md` |
| `undrifted_issue01_measures_registry_launch_banner_v1` | draft | `Assets/Banners/unDrifted/Issue01/undrifted_issue01_measures_registry_launch_banner_v1.webp` |
| `undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1` | draft | `Assets/Banners/unDrifted/Issue01/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp` |

Per OAR2 step 6, none of the underlying content files were created — confirmed prior to this run that neither the two article `.md` files nor the two banner `.webp` files exist yet. Only the registry rows exist.

## Naming Conflicts

None. No prior `/Assets/Registry` directory or `asset_registry.md` file existed.

## Confirmation

OAR2 authority (this OAR2 and its parent) remains separate from registered assets: the registry file contains only tracking metadata and references (`related_oar2`, `file_path`), not article/banner/campaign content. No article bodies are embedded anywhere in this OAR2 or its OAR1.

## Unresolved Blockers

None. Next step (out of scope here): author the four placeholder assets' actual content and sidecars under their own OAR2/OAR1 pair, then flip their registry `status` to `registered`.
