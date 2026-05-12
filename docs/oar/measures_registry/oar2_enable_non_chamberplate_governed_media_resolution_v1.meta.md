---
document_type: oar2
authority_level: working
document_scope: runtime_media_contract
title: OAR2 — Enable Non-Chamberplate Governed Media Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Enable Non-Chamberplate Governed Media Resolution

## OBSERVED

Governed media rows now exist for:

- epigraph
- temple_antechamber

The seated image assets resolve successfully:

- inanna_epigraph.webp
- antechamber.webp

However, runtime still depends on temp_exhibition_media for these surfaces because current resolver behavior reads measures_surface_media_map only when:

    surface_type = chamberplate

The affected surfaces are:

- epigraph = aspect
- temple_antechamber = threshold

Therefore governed media exists, but the runtime contract excludes it.

Operator clarified:

- epigraph is animated/video primary
- inanna_epigraph.webp is still fallback only

## ALIGNED

Codex remains authority.

Field structures media relation.

Measures registers governed media.

Chazz routes runtime contract correction.

Cody executes only from this OAR2.

This OAR2 authorizes a bounded runtime resolver change.

This OAR2 does not authorize:

- new media migration
- bucket copy
- DB row invention
- fallback deletion
- hardcoded media paths
- broad renderer rewrite

## ROUTED

### 1. Expand governed media eligibility

Cody must update runtime media resolution so governed media lookup is not limited to surface_type = chamberplate.

Allowed governed media surfaces:

    chamberplate
    aspect
    threshold

Equivalent registry-driven logic is acceptable if it avoids hardcoding surface-specific media paths.

### 2. Preserve existing chamberplate behavior

Existing chamberplate media resolution must continue unchanged.

Role ordering and media precedence must remain stable.

### 3. Enable governed reads for named surfaces

Cody must validate governed media lookup for:

- epigraph
- temple_antechamber

Expected governed mappings:

- epigraph -> governed animated/video media primary
- epigraph -> epigraph_still_image_support_v1 as still fallback only
- temple_antechamber -> temple_antechamber_still_image_v1

### 4. Epigraph media precedence

Epigraph render precedence must remain:

1. animated/video media
2. still fallback image

Cody must not promote inanna_epigraph.webp into primary epigraph media if animated media exists.

If governed animated epigraph media does not yet exist, Cody must report that explicitly in OAR1.

### 5. Fallback remains active

Do not delete or deactivate temp_exhibition_media rows under this OAR2.

Fallback may remain as safety behavior until governed media rendering is validated.

### 6. No media transport work

No bucket copy.

No storage remap.

No provider mutation.

No source deletion.

### 7. Validation

Cody must validate:

- epigraph can retrieve governed media row
- temple_antechamber can retrieve governed media row
- resolved media URLs return 200
- chamberplate media still resolves
- epigraph animated media precedence remains intact
- still fallback only activates when animation is unavailable
- fallback still exists but is no longer required for these image slots
- no hardcoded media path introduced

## CODY ROLE

Cody may:

- update resolver eligibility logic
- inspect renderer behavior
- validate governed media rows
- run runtime tests
- write OAR1 closeout

Cody may not:

- mutate media rows
- delete fallback rows
- hardcode storage paths
- invent missing media
- rewrite unrelated routing
- bypass DB-governed mappings

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. governed media lookup works for aspect
2. governed media lookup works for threshold
3. epigraph resolves governed animated/video media
4. epigraph still fallback behavior remains correct
5. temple_antechamber resolves governed still media
6. chamberplate media behavior remains valid
7. fallback rows remain undeleted
8. no frontend hardcoded media path was introduced
9. exact files changed are listed

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_enable_non_chamberplate_governed_media_resolution_v1.meta.md

## CLOSE

Do not move more media.

Do not invent rows.

Expand governed media resolution.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
