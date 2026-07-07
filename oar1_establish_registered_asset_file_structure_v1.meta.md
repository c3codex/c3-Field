# OAR1: Establish Registered Asset File Structure
**Closes:** oar2_establish_registered_asset_file_structure_v1.meta.md
**Branch:** measures
**Date:** 2026-07-07

---

## Status by Item

| # | Acceptance Criterion | Status |
|---|-----------------------|--------|
| 1 | Folder structure exists | SEATED |
| 2 | README placeholder files exist | SEATED |
| 3 | Naming convention is documented | SEATED |
| 4 | Asset/OAR separation rule is documented | SEATED |
| 5 | No article bodies embedded in OAR2 authority files (going forward) | ACKNOWLEDGED — ENFORCED BY CONVENTION |
| 6 | OAR2 files reference asset paths only (going forward) | ACKNOWLEDGED — ENFORCED BY CONVENTION |
| 7 | OAR1 proof of created folders/files | SEATED (this document) |

---

## Folders Created (repo-root relative)

```
OAR/OAR2/launch
OAR/OAR2/publication
OAR/OAR2/research
OAR/OAR2/infrastructure
OAR/OAR1/launch
OAR/OAR1/publication
OAR/OAR1/research
OAR/OAR1/infrastructure
Assets/Articles/unDrifted/Issue01/drafts
Assets/Articles/unDrifted/Issue01/registered
Assets/Articles/unDrifted/Issue01/published
Assets/Banners/unDrifted/Issue01
Assets/Campaigns/Buffer/Issue01/drafts
Assets/Campaigns/Buffer/Issue01/registered
Assets/Campaigns/Buffer/Issue01/scheduled
Assets/Campaigns/Buffer/Issue01/published
Assets/Research/NSF/ProjectPitch/submitted
Assets/Research/NSF/ProjectPitch/profiles
Assets/Research/NSF/ProjectPitch/supporting
Assets/Media/Hooks/raw
Assets/Media/Hooks/selected
Assets/Media/Hooks/exported
```

All 20 directories created new at repo root (verified: no prior `/OAR` or `/Assets` top-level directories existed anywhere in the repo before this run).

## README Placeholder Files Created

```
Assets/Articles/unDrifted/Issue01/registered/README.md
Assets/Banners/unDrifted/Issue01/README.md
Assets/Campaigns/Buffer/Issue01/registered/README.md
Assets/Research/NSF/ProjectPitch/submitted/README.md
```

Each README documents: asset purpose, naming convention, required metadata, relationship to OAR2 authority, relationship to OAR1 proof — per the OAR2 spec.

## Naming Convention (documented in OAR2 + each README)

- Article assets: `undrifted_issue01_<slug>_article_v1.md`
- Banner assets: `undrifted_issue01_<slug>_banner_v1.webp` (+ sidecar `undrifted_issue01_<slug>_banner_v1.meta.md`)
- Campaign assets: `buffer_issue01_<campaign_name>_v1.md`
- OAR2 files: `oar2_<scope>_v1.meta.md`
- OAR1 files: `oar1_<scope>_v1.meta.md`

## Asset/OAR Separation Rule (documented)

OAR2 remains the authority layer: it defines execution scope, routing, acceptance criteria, and required OAR1 proof. It references asset paths by `asset_id` — it does not embed article bodies, banner content, or campaign copy. Registered content lives exclusively under `/Assets/...`, versioned and staged through `drafts → registered → published` (or `submitted` / `scheduled` variants per asset type).

## Naming Conflicts / Ambiguity

None found. No prior `/OAR` or `/Assets` directories existed at repo root, so no collisions with existing structure.

**Note on repo layout:** the existing OAR corpus (`oar1_*` / `oar2_*` files) lives at repo root and under `docs/oar/**` (legacy/archival, pre-dating this convention). This OAR2 establishes a new, separate top-level `/OAR` and `/Assets` tree per its explicit path spec; it does not migrate or touch the existing root-level or `docs/oar/**` files. Future OAR2/OAR1 pairs should adopt the new `/OAR/OAR2/<scope>` and `/OAR/OAR1/<scope>` paths going forward; migration of legacy files was out of scope for this OAR2.

## Not Created (Out of Scope for This OAR2)

The OAR2's "Initial Registered Assets To Prepare" section lists four future assets (2 articles, 2 banners). These were not created — the OAR2's acceptance criteria only requires the folder structure and README placeholders, not the content itself. These remain pending, to be authored under their own OAR2/OAR1 pairs referencing the paths now established here:

```
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md
Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md
Assets/Banners/unDrifted/Issue01/undrifted_issue01_measures_registry_launch_banner_v1.webp
Assets/Banners/unDrifted/Issue01/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp
```

---

## Confirmation

OAR2 authority and registered assets are now separated at the file-structure level. The governed asset tree exists and is documented; no content migration or new article/banner/campaign authoring occurred in this pass.
