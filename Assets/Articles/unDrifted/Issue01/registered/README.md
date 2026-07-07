# Registered Article Assets — unDrifted Issue01

## Asset purpose
Holds the registered (execution-ready) article bodies for unDrifted Issue01. An article body moves here once it has passed drafting and is bound to an OAR2 that governs its publication.

## Naming convention
`undrifted_issue01_<slug>_article_v1.md`

Example: `undrifted_issue01_measures_registry_launch_article_v1.md`

## Required metadata
Each article asset file must open with a frontmatter block containing:
- `asset_id` — matches the filename (without extension)
- `issue` — e.g. `unDrifted/Issue01`
- `status` — `registered` | `published`
- `registered_by_oar2` — the `oar_id` of the OAR2 that registered this asset
- `published_by_oar1` — the `oar_id` of the OAR1 that proves publication (once published)

## Relationship to OAR2 authority
OAR2 files never embed article bodies. An OAR2 that concerns this article references its path here by `asset_id` and defines execution scope, routing, and acceptance criteria against it. This directory is the single source of truth for the article's content.

## Relationship to OAR1 proof
The OAR1 that closes out an OAR2 touching this asset must cite the exact asset path and confirm its `status` transition (e.g. drafts → registered → published).
