# Registered Campaign Assets — Buffer Issue01

## Asset purpose
Holds registered (execution-ready) Buffer campaign copy for Issue01, staged for scheduling once bound to an OAR2.

## Naming convention
`buffer_issue01_<campaign_name>_v1.md`

Example: `buffer_issue01_launch_announcement_v1.md`

## Required metadata
Each campaign asset file must open with a frontmatter block containing:
- `asset_id` — matches the filename (without extension)
- `campaign_name` — human-readable campaign label
- `status` — `registered` | `scheduled` | `published`
- `channel` — target platform(s) for this campaign copy
- `registered_by_oar2` — the `oar_id` of the OAR2 that registered this asset
- `published_by_oar1` — the `oar_id` of the OAR1 that proves publication (once published)

## Relationship to OAR2 authority
OAR2 files never embed campaign copy. An OAR2 that concerns a campaign asset references its path here and defines scheduling scope and acceptance criteria.

## Relationship to OAR1 proof
The OAR1 closing out a campaign-related OAR2 must cite the exact asset path and confirm its `status` transition (registered → scheduled → published).
