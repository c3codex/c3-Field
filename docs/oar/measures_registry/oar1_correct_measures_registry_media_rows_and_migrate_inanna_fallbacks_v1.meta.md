---
document_type: oar1
authority_level: execution_closeout
document_scope: media_runtime_cleanup
title: OAR1 - Correct Measures Registry Media Rows and Migrate Inanna Fallbacks
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2:
  - oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1
evidence:
  - correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1.json
executor:
  - execute-correct-measures-registry-media-rows-and-migrate-inanna-fallbacks.cjs
mutation_performed: true
---

# OAR1 - Correct Measures Registry Media Rows and Migrate Inanna Fallbacks

## EXECUTION

Executed bounded mutation OAR2.

Evidence:

`docs/oar/measures_registry/correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1.json`

Executor:

`docs/oar/measures_registry/execute-correct-measures-registry-media-rows-and-migrate-inanna-fallbacks.cjs`

Mutation summary:

| action | count |
|---|---:|
| `measures_media_map` row corrected | 1 |
| stale `measures_media_map` rows held inactive | 6 |
| `codex_media_asset` rows upserted | 2 |
| `measures_surface_media_map` rows upserted | 2 |
| `temp_exhibition_media` rows deleted | 0 |
| `temp_exhibition_media` rows deactivated | 0 |
| bucket objects copied | 0 |
| bucket objects deleted | 0 |
| frontend files changed | 0 |
| resolver files changed | 0 |

## HERO VIDEO CORRECTION

Corrected:

`measures_media_map.media_role = hero_video`

Previous standing:

- bucket: `measures-registry`
- path: `integrity_governance_intro.mp4`

Current standing:

- bucket: `measures-media`
- path: `integrity_governance_intro.mp4`
- active: true

Validation:

- runtime URL: `https://media.c3field.online/integrity_governance_intro.mp4`
- retrieval: 200
- content type: `video/mp4`

Schema note:

`public.measures_media_map` does not expose a `storage_provider` column. R2 standing is represented by `storage_bucket = measures-media`, which the current runtime resolver routes through `VITE_R2_PUBLIC_BASE_URL`.

## STALE REGISTRY ROWS HELD

The table supports non-destructive holding through `is_active`.

The following rows were marked `is_active = false`:

| media_role | bucket/path | validation before hold |
|---|---|---:|
| `hero_image` | `measures-registry/hero_fracture_measure.webp` | 400 |
| `hero_measured_image` | `measures-registry/measured_hero_right.webp` | 400 |
| `path_choice_background` | `measures-registry/more_vs_coherence_path.webp` | 400 |
| `paragraph_cover` | `measures-registry-public/measures_registry/images/paragraph_cover_agents_of_chaos.webp` | 400 |
| `registry_banner` | `measures-registry-public/measures_registry/brand/measures_registry_banner.webp` | 400 |
| `social_card` | `measures-registry-public/measures_registry/brand/measures_registry_social_card.webp` | 400 |

No rows were deleted.

## PRE-CODEX RUNTIME ASSETS SEATED

Seated authorized Supabase image assets only.

| media_key | runtime use | provider | bucket/path | retrieval |
|---|---|---|---|---:|
| `temple_antechamber_still_image_v1` | temple_antechamber still image | `supabase` | `measures-registry/measures_registry/pre_codex_exhibition/images/antechamber.webp` | 200 |
| `epigraph_still_image_support_v1` | epigraph still/image support only | `supabase` | `measures-registry/measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp` | 200 |

Created/updated governed mappings:

| surface_key | media_key | role | status |
|---|---|---|---|
| `temple_antechamber` | `temple_antechamber_still_image_v1` | `image` | active |
| `epigraph` | `epigraph_still_image_support_v1` | `image` | active |

No video media was invented for epigraph.

## FALLBACK STANDING

Fallback rows were not deleted or deactivated.

Reason:

Current `resolve_encounter.ts` reads `measures_surface_media_map` only for `surface_type = chamberplate`. The relevant surfaces are:

- `epigraph`: `aspect`
- `temple_antechamber`: `threshold`

Disabling their `temp_exhibition_media` rows before a resolver/runtime OAR would remove current runtime media dependency without an active non-chamberplate governed read path.

Current fallback standing:

| surface_key | media_type | path | active | standing |
|---|---|---|---|---|
| `epigraph` | video | `inanna_encounter_intro.mp4` | true | held; no valid video replacement authorized |
| `temple_antechamber` | image | `antechamber.png` | true | left active until resolver supports governed non-chamberplate mappings |

## EPIGRAPH BOUNDARY

`inanna_epigraph.webp` was seated as image/still support only.

The old fallback video:

`inanna_encounter_intro.mp4`

remains held because no valid epigraph video object was authorized by this OAR2.

## COPY DECISION ASSETS

No copy was authorized or performed for:

- `obsidian_chamberplate_gate01 (1).jpeg`
- `temple_antechamber_return.webp`

Both remain future copy-decision assets.

## VALIDATION

Validation results:

- `hero_video` corrected to R2 standing: yes
- corrected `hero_video` retrieval: 200
- stale registry rows held: 6
- `antechamber.webp` seated: yes
- `antechamber.webp` retrieval: 200
- `inanna_epigraph.webp` seated as still support: yes
- `inanna_epigraph.webp` retrieval: 200
- epigraph video held: yes
- broad fallback migration performed: no
- fallback deletion performed: no
- source objects deleted: no
- frontend hardcoding introduced: no
- resolver mutation performed: no

## REMAINING HELD ITEMS

Held registry media rows:

- `hero_image`
- `hero_measured_image`
- `path_choice_background`
- `paragraph_cover`
- `registry_banner`
- `social_card`

Held fallback/runtime items:

- epigraph video fallback remains active but unresolved as a governed replacement
- temple antechamber fallback remains active until non-chamberplate governed media resolution is routed

Held copy-decision assets:

- `obsidian_chamberplate_gate01 (1).jpeg`
- `temple_antechamber_return.webp`

## RECOMMENDED NEXT OAR2

Recommended next OAR2:

`oar2_enable_non_chamberplate_governed_media_resolution_v1`

Purpose:

- extend runtime media resolution for governed non-chamberplate surfaces only if Chazz routes that as the intended contract
- validate `epigraph` and `temple_antechamber` can read governed image rows without fallback dependency
- only then deactivate corresponding fallback rows

No further migration should proceed from thread instruction alone.

## CLOSE

Deterministic registry correction complete.

Confirmed image assets seated.

Fallbacks preserved where runtime still depends on them.

Delete nothing.
