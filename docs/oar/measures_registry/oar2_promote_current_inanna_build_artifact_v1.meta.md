---
document_type: oar2
authority_level: working
document_scope: deployment_runtime_binding
title: OAR2 — Promote Current Inanna Build Artifact
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_diagnose_inanna_deployed_runtime_binding_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Promote Current Inanna Build Artifact

## OBSERVED

Deployed Measures of Inanna runtime is serving a stale JS bundle.

Current deployed bundle:

    assets/index-qPbY_Yxd.js

Current local Inanna build bundle:

    assets/index-DNR-DxGl.js

The deployed bundle still contains chamberplate-only governed media lookup:

    if (t.surface_type==="chamberplate")

The current local build contains governed media resolution for:

    chamberplate
    aspect
    threshold

The active failure is deployment artifact drift, not DB media authority, storage provider, bucket path, or runtime environment markers.

## ALIGNED

Codex remains authority.

Field structures runtime relation.

Measures registers governed media.

Chazz routes deployment correction.

Cody executes only from this OAR2.

This OAR2 authorizes deployment/runtime binding correction only.

This OAR2 does not authorize:

- DB mutation
- media mutation
- bucket mutation
- resolver rewrite
- fallback deletion
- hardcoded media paths
- unrelated frontend changes

## ROUTED

### 1. Confirm current local build

Cody must confirm the current local Inanna build artifact contains governed media eligibility for:

    chamberplate
    aspect
    threshold

Expected local asset:

    dist-inanna/assets/index-DNR-DxGl.js

If a new build generates a different hash, Cody must report the new hash and verify the same governed resolver contract is present.

### 2. Deploy current Inanna build

Cody may promote the current dist-inanna build to the correct Cloudflare Pages project/output binding for Measures of Inanna.

Cody must verify the deployment target is the Inanna project/domain, not Measures Registry.

### 3. Verify deployed bundle replacement

After deploy, Cody must verify:

- deployed JS asset hash changed from index-qPbY_Yxd.js
- deployed bundle contains governed surface expansion for:
  - chamberplate
  - aspect
  - threshold
- deployed bundle no longer uses chamberplate-only governed media eligibility

### 4. Verify deployed route media behavior

Cody must test deployed routes:

#### Epigraph

Route:

    https://www.measuresofinanna.com/?registry_key=epigraph

Expected:

- registry key resolves: epigraph
- encounter key resolves: epigraph_view
- surface type: aspect
- governed media read: true
- primary media: epigraph_governed_animated_media_v1
- runtime URL: https://media.c3field.online/inanna_epigraph.MP4
- retrieval: 200

#### Temple Antechamber

Route:

    https://www.measuresofinanna.com/?registry_key=temple_antechamber

Expected:

- registry key resolves: temple_antechamber
- encounter key resolves: temple_antechamber_view
- surface type: threshold
- governed media read: true
- selected media: temple_antechamber_still_image_v1
- retrieval: 200

### 5. Preserve boundaries

No DB changes.

No media row changes.

No bucket changes.

No fallback deletion.

No resolver rewrite unless build output requires no-op regeneration.

### 6. Validation

Cody must return:

- deployed bundle before hash
- deployed bundle after hash
- deploy target/project used
- governed resolver marker in deployed bundle
- epigraph live route validation
- antechamber live route validation
- mutation count for DB/media/bucket: 0
- files changed, if any

## CODY ROLE

Cody may:

- build Inanna frontend
- deploy current dist-inanna artifact
- verify deployed bundle
- test live routes
- write OAR1 closeout

Cody may not:

- mutate DB rows
- change media mappings
- delete fallback rows
- alter storage buckets
- hardcode media paths
- deploy to the wrong project

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. stale deployed bundle replaced
2. deployed resolver supports chamberplate, aspect, and threshold
3. epigraph selects governed animated media
4. epigraph media retrieval returns 200
5. temple_antechamber selects governed still media
6. temple_antechamber media retrieval returns 200
7. no DB/media/bucket mutation occurred
8. deployment target is confirmed as Measures of Inanna

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_promote_current_inanna_build_artifact_v1.meta.md

## CLOSE

Promote the current build.

Verify governed media live.

Do not mutate media authority.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
