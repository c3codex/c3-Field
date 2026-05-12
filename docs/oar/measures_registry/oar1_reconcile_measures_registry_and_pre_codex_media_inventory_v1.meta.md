---
document_type: oar1
authority_level: execution_closeout
document_scope: media_inventory_reconciliation
title: OAR1 - Reconcile Measures Registry and Pre-Codex Media Inventory
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2:
  - oar2_reconcile_measures_registry_and_pre_codex_media_inventory_v1
evidence:
  - reconcile_measures_registry_and_pre_codex_media_inventory_v1.json
executor:
  - execute-reconcile-measures-registry-and-pre-codex-media-inventory.cjs
mutation_performed: false
---

# OAR1 - Reconcile Measures Registry and Pre-Codex Media Inventory

## EXECUTION

Executed reconciliation-only OAR2.

No DB mutation was performed.

No bucket copy, bucket deletion, frontend mutation, or resolver mutation was performed.

Evidence:

`docs/oar/measures_registry/reconcile_measures_registry_and_pre_codex_media_inventory_v1.json`

Executor:

`docs/oar/measures_registry/execute-reconcile-measures-registry-and-pre-codex-media-inventory.cjs`

## INVENTORY SUMMARY

Storage inventory:

| surface | count | standing |
|---|---:|---|
| `pre-codex-exhibition` total objects | 17 | source bucket retained |
| `pre-codex-exhibition` image objects | 14 | source image inventory |
| `measures-registry` total objects | 26 | target bucket retained |
| `measures-registry` `.webp` objects | 25 | target webp inventory |
| DB-referenced R2 rows tested | 24 | verifiable by URL |

DB inventory:

| table | count |
|---|---:|
| `public.codex_media_asset` | 28 |
| `public.measures_media_map` | 20 |
| `public.temp_exhibition_media` | 73 |
| `public.measures_surface_media_map` | 12 |

Mutation count: `0`

## SOURCE BUCKET INVENTORY

Image objects found in `pre-codex-exhibition`:

| object | classification |
|---|---|
| `antechamber.webp` | copied but no seated DB row |
| `crystal_temple_home.webp` | copied but no seated DB row |
| `gemynd_corpus.webp` | copied but no seated DB row |
| `gemynd_corpus_original_art.webp` | copied but no seated DB row |
| `inanna_epigraph.webp` | copied but no seated DB row |
| `marble_chamber_codexstone.webp` | already copied; DB reference exists |
| `obsidian_chamberplate_gate01 (1).jpeg` | requires copy decision and new seating OAR |
| `obsidian_chamberplate_gate01.webp` | copied but no seated DB row |
| `obsidian_chamberplate_gate03.webp` | copied but no seated DB row |
| `og.webp` | copied but no seated DB row |
| `percipari_original_artwork.webp` | copied but no seated DB row |
| `primus_artus_epithet01_chamberplate.webp` | copied but no seated DB row |
| `primus_artus_original_artwork.webp` | copied but no seated DB row |
| `temple_antechamber_return.webp` | requires copy decision and new seating OAR |

## TARGET BUCKET INVENTORY

The target `measures-registry` bucket contains 25 `.webp` objects.

Relevant Pre-Codex target objects already present under:

`measures_registry/pre_codex_exhibition/images/`

Already present there:

- `antechamber.webp`
- `crystal_temple_home.webp`
- `gemynd_corpus.webp`
- `gemynd_corpus_original_art.webp`
- `inanna_encounter.webp`
- `inanna_epigraph.webp`
- `marble_chamber_codexstone.webp`
- `obsidian_chamberplate_gate01.webp`
- `obsidian_chamberplate_gate03.webp`
- `og.webp`
- `percipari_original_artwork.webp`
- `primus_artus_epithet01_chamberplate.webp`
- `primus_artus_original_artwork.webp`
- `temple_home.webp`
- `true_north.webp`
- `true_north_crystal.webp`

Classification:

- copied but no seated DB row: 11
- already copied with DB reference: 1
- requires copy decision: 2

## MEASURES REGISTRY CORRECTION CANDIDATES

Required OAR2 candidates:

| asset | current DB standing | verified expected standing | classification |
|---|---|---|---|
| `integrity_governance_intro.mp4` | `measures_media_map.hero_video` -> `measures-registry/integrity_governance_intro.mp4` | `cloudflare_r2 / measures-media / integrity_governance_intro.mp4`, retrieval 200 | valid R2 row misclassified as Supabase |
| `more_vs_coherence_path.webp` | `measures-registry/more_vs_coherence_path.webp`, retrieval 400 | no matching verified target object | invalid/stale |
| `hero_fracture_measure.webp` | `measures-registry/hero_fracture_measure.webp`, retrieval 400 | no matching verified target object | invalid/stale |
| `measured_hero_right.webp` | `measures-registry/measured_hero_right.webp`, retrieval 400 | no matching verified target object | invalid/stale |

No correction was executed.

## STALE DB ROW LIST

Active `measures_media_map` rows returning HTTP 400:

| media_role | bucket/path | status |
|---|---|---:|
| `hero_image` | `measures-registry/hero_fracture_measure.webp` | 400 |
| `hero_measured_image` | `measures-registry/measured_hero_right.webp` | 400 |
| `path_choice_background` | `measures-registry/more_vs_coherence_path.webp` | 400 |
| `paragraph_cover` | `measures-registry-public/measures_registry/images/paragraph_cover_agents_of_chaos.webp` | 400 |
| `registry_banner` | `measures-registry-public/measures_registry/brand/measures_registry_banner.webp` | 400 |
| `social_card` | `measures-registry-public/measures_registry/brand/measures_registry_social_card.webp` | 400 |

The final three public-bucket rows were not named in the OAR2's specific correction list, but they are active DB media references and should be included in a follow-up correction review.

## VALID R2 ROWS

DB-referenced R2 rows tested: 24.

`integrity_governance_intro.mp4` was tested at the expected R2 standing and returned:

- bucket: `measures-media`
- storage path: `integrity_governance_intro.mp4`
- retrieval: 200
- content type: `video/mp4`

This confirms the row should be corrected as an R2 media reference under a mutation-authorized OAR2.

## PRE-CODEX COPY CLASSIFICATION

Objects already copied to `measures-registry` but not seated as DB rows from the source inventory:

- `antechamber.webp`
- `crystal_temple_home.webp`
- `gemynd_corpus.webp`
- `gemynd_corpus_original_art.webp`
- `inanna_epigraph.webp`
- `obsidian_chamberplate_gate01.webp`
- `obsidian_chamberplate_gate03.webp`
- `og.webp`
- `percipari_original_artwork.webp`
- `primus_artus_epithet01_chamberplate.webp`
- `primus_artus_original_artwork.webp`

Remaining Pre-Codex source objects requiring copy decision:

- `obsidian_chamberplate_gate01 (1).jpeg`
- `temple_antechamber_return.webp`

No copy was performed.

## LEGACY FALLBACK CLASSIFICATION

Active `temp_exhibition_media` fallback candidates: 71.

Recommendation counts:

| recommendation | count |
|---|---:|
| remap to existing measures-registry/codex media row, then deprecate fallback | 17 |
| hold for new asset upload or copy under follow-up OAR | 54 |

Required named runtime rows remain in fallback standing:

| surface | media type | current path | recommendation |
|---|---|---|---|
| `epigraph` | video | `inanna_encounter_intro.mp4` | hold for new asset upload or copy under follow-up OAR |
| `temple_antechamber` | image | `antechamber.png` | remap to existing target object / codex row, then deprecate fallback |

Chamber/gate fallback rows are also present and fully listed in evidence.

## CLASSIFICATION TABLE SUMMARY

| class | count |
|---|---:|
| `codex_media_asset` valid R2 rows | 19 |
| `codex_media_asset` already copied/remapped rows | 9 |
| `measures_media_map` valid R2 rows | 5 |
| `measures_media_map` valid R2 row misclassified as Supabase | 1 |
| `measures_media_map` stale DB rows | 6 |
| `measures_media_map` already copied and mapped | 5 |
| Pre-Codex copied but no seated DB row | 11 |
| Pre-Codex requires copy decision and new seating OAR | 2 |
| legacy fallback migration candidates | 71 |

## RECOMMENDED NEXT OAR2

Recommended next OAR2:

`oar2_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1`

Required authority:

- DB mutation for `public.measures_media_map`
- DB mutation for `public.codex_media_asset` if new seating is needed
- DB mutation for `public.measures_surface_media_map` where registry media mapping is seated
- explicit copy authority only for the two source objects requiring copy decision
- no deletion of source bucket objects
- no frontend hardcoding
- no resolver mutation unless separately justified

Minimum routed actions:

1. Correct `hero_video` to `cloudflare_r2 / measures-media / integrity_governance_intro.mp4`.
2. Hold or replace stale Measures Registry rows:
   - `hero_image`
   - `hero_measured_image`
   - `path_choice_background`
3. Review public-bucket stale rows:
   - `paragraph_cover`
   - `registry_banner`
   - `social_card`
4. Seat DB rows for the 11 already-copied Pre-Codex target objects only where runtime use is explicitly confirmed.
5. Decide whether to copy:
   - `obsidian_chamberplate_gate01 (1).jpeg`
   - `temple_antechamber_return.webp`
6. Migrate `temp_exhibition_media` fallback rows into governed registry media rows, then deprecate fallback use after validation.

## VALIDATION

OAR2 validation satisfied:

- source bucket inventory returned
- target bucket inventory returned
- DB media inventory returned
- stale row list returned
- valid R2 correction list returned
- remaining Pre-Codex copy candidates returned
- legacy fallback migration candidates returned
- exact recommended next OAR2 returned
- mutation count: 0

## CLOSE

Inventory complete.

Classification complete.

Mutation deferred.
