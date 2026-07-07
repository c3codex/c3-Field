---
oar_id: oar2_establish_registered_asset_file_structure_v1
oar_type: OAR2
status: proposed
system: Measures Registry
surface: OAR / unDrifted / Assets
owner: c3 Community Partners DAO LLC
operator: op044
priority: launch_infrastructure
created_for: Claude / Cody execution
purpose: establish registered asset file structure and separate OAR authority from registered content assets
core_rule: OAR2 remains authority. Article bodies, banners, campaign copy, media, and research materials are registered assets referenced by OAR2, not trapped inside OAR2.
---

# OAR2 — Establish Registered Asset File Structure

## Observed

OAR2 artifacts have been carrying too much embedded content.

This creates transfer friction, response truncation, duplication, and difficulty revising article bodies independently from execution authority.

Measures Registry now requires a governed asset structure where OAR2 remains the authority layer and content, media, campaign materials, and research materials are registered as assets.

## Aligned

Create a registered asset file structure that supports:

- unDrifted articles
- article banners
- Paragraph publication metadata
- Buffer campaign assets
- research proposition materials
- OAR2 authority files
- OAR1 execution proof

Asset bodies must be stored separately from OAR2 files.

OAR2 files must reference asset paths and define execution scope, routing, acceptance criteria, and required OAR1 proof.

## Routed

Create or confirm this structure:

/OAR/OAR2/launch
/OAR/OAR2/publication
/OAR/OAR2/research
/OAR/OAR2/infrastructure
/OAR/OAR1/launch
/OAR/OAR1/publication
/OAR/OAR1/research
/OAR/OAR1/infrastructure
/Assets/Articles/unDrifted/Issue01/drafts
/Assets/Articles/unDrifted/Issue01/registered
/Assets/Articles/unDrifted/Issue01/published
/Assets/Banners/unDrifted/Issue01
/Assets/Campaigns/Buffer/Issue01/drafts
/Assets/Campaigns/Buffer/Issue01/registered
/Assets/Campaigns/Buffer/Issue01/scheduled
/Assets/Campaigns/Buffer/Issue01/published
/Assets/Research/NSF/ProjectPitch/submitted
/Assets/Research/NSF/ProjectPitch/profiles
/Assets/Research/NSF/ProjectPitch/supporting
/Assets/Media/Hooks/raw
/Assets/Media/Hooks/selected
/Assets/Media/Hooks/exported

Create placeholder registry files:

/Assets/Articles/unDrifted/Issue01/registered/README.md
/Assets/Banners/unDrifted/Issue01/README.md
/Assets/Campaigns/Buffer/Issue01/registered/README.md
/Assets/Research/NSF/ProjectPitch/submitted/README.md

Each README must define:

- asset purpose
- naming convention
- required metadata
- relationship to OAR2 authority
- relationship to OAR1 proof

## Naming Convention

Article assets:
undrifted_issue01_<slug>_article_v1.md

Banner assets:
undrifted_issue01_<slug>_banner_v1.webp

Campaign assets:
buffer_issue01_<campaign_name>_v1.md

OAR2 files:
oar2_<scope>_v1.meta.md

OAR1 files:
oar1_<scope>_v1.meta.md

## Initial Registered Assets To Prepare

Article asset 1:
/Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_measures_registry_launch_article_v1.md

Article asset 2:
/Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md

Banner asset 1:
/Assets/Banners/unDrifted/Issue01/undrifted_issue01_measures_registry_launch_banner_v1.webp

Banner asset 2:
/Assets/Banners/unDrifted/Issue01/undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp

## Acceptance Criteria

- Folder structure exists.
- README placeholder files exist.
- Naming convention is documented.
- Asset/OAR separation rule is documented.
- No article bodies are embedded in OAR2 authority files.
- OAR2 files reference asset paths only.
- OAR1 returns proof of created folders and files.

## Return OAR1 With

- folders created
- README files created
- exact paths
- any naming conflicts
- any repo/path ambiguity
- confirmation that OAR2 authority and registered assets are now separated
