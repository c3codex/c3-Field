---
oar_id: oar2_add_asset_registry_and_sidecar_metadata_convention_v1
oar_type: OAR2
status: proposed
system: Measures Registry
surface: OAR / Assets
owner: c3 Community Partners DAO LLC
operator: op044
priority: launch_infrastructure
created_for: Claude / Cody execution
depends_on:
  - oar1_establish_registered_asset_file_structure_v1.meta.md
purpose: add asset registry and universal metadata sidecar convention
core_rule: Registered assets are first-class registry objects. OAR2 remains authority; assets hold content; sidecar metadata holds registration data; OAR1 returns proof.
---

# OAR2 — Add Asset Registry and Sidecar Metadata Convention

## Observed

The registered asset file structure has been seated.

OAR2 authority and registered assets are now separated at the file-structure level.

The next required step is to add an asset registry and universal sidecar metadata convention so articles, banners, campaigns, media, and research files can be tracked as governed registry objects.

## Aligned

Create:

/Assets/Registry
/Assets/Registry/asset_registry.md

Establish a universal sidecar convention:

asset_file.ext
asset_file.meta.md

This applies to:

- articles
- banners
- campaign assets
- research assets
- media hooks

The sidecar metadata file must contain:

- asset_id
- asset_type
- title
- slug
- version
- status
- issue or campaign
- file_path
- related_oar2
- related_oar1
- publication_targets
- created_by
- updated_by
- notes

## Routed

1. Create /Assets/Registry if missing.
2. Create /Assets/Registry/asset_registry.md if missing.
3. Document asset lifecycle:
   - draft
   - registered
   - published
   - observed
   - revised
   - versioned
4. Document universal metadata sidecar convention.
5. Add placeholder registry records for the first four pending assets:
   - undrifted_issue01_measures_registry_launch_article_v1.md
   - undrifted_issue01_computational_systems_governance_nsf_project_pitch_article_v1.md
   - undrifted_issue01_measures_registry_launch_banner_v1.webp
   - undrifted_issue01_computational_systems_governance_nsf_pitch_banner_v1.webp
6. Do not create the article bodies or banner files in this pass unless already present.
7. Return OAR1 with created files, paths, and registry confirmation.

## Acceptance Criteria

- /Assets/Registry exists.
- /Assets/Registry/asset_registry.md exists.
- Asset lifecycle is documented.
- Sidecar metadata convention is documented.
- Four pending launch assets are listed as placeholder records.
- OAR2 authority remains separate from registered assets.
- No article bodies are embedded in this OAR2.

## Return OAR1 With

- folders created
- files created
- asset registry path
- placeholder records added
- any naming conflicts
- confirmation of sidecar convention
- unresolved blockers, if any
