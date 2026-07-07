# Registered Banner Assets — unDrifted Issue01

## Asset purpose
Holds the registered banner images used by unDrifted Issue01 articles and campaign materials.

## Naming convention
`undrifted_issue01_<slug>_banner_v1.webp`

Example: `undrifted_issue01_measures_registry_launch_banner_v1.webp`

## Required metadata
Banner assets are binary (`.webp`) and carry metadata in a sidecar file of the same name with a `.meta.md` suffix:
`undrifted_issue01_<slug>_banner_v1.meta.md`

That sidecar must define:
- `asset_id` — matches the image filename (without extension)
- `dimensions` — width x height in px
- `source` — origin of the image (raw export, generated, licensed, etc.)
- `registered_by_oar2` — the `oar_id` of the OAR2 that registered this asset
- `published_by_oar1` — the `oar_id` of the OAR1 that proves publication (once published)

## Relationship to OAR2 authority
OAR2 files never embed banner binaries or descriptions of their content beyond a reference. An OAR2 concerning a banner references its path here and defines routing/placement and acceptance criteria.

## Relationship to OAR1 proof
The OAR1 closing out a banner-related OAR2 must cite the exact banner path and confirm it renders/deploys as expected.
