---
document_type: oar1
authority_level: execution_closeout
document_scope: runtime_media_diagnostic
title: OAR1 - Diagnose Measures Media Runtime Resolution
status: complete
version: v1
operator: op044
system: measures_registry
source_oar2:
  - oar2_diagnose_measures_media_runtime_resolution_v1
evidence:
  - diagnose_measures_media_runtime_resolution_v1.json
executor:
  - execute-diagnose-measures-media-runtime-resolution.cjs
mutation_performed: false
---

# OAR1 - Diagnose Measures Media Runtime Resolution

## EXECUTION

Executed diagnostic-only OAR2.

No DB rows were inserted, updated, or deleted.

No frontend, resolver, bucket, or deployment mutation was performed.

Read-only evidence was written to:

`docs/oar/measures_registry/diagnose_measures_media_runtime_resolution_v1.json`

Executor:

`docs/oar/measures_registry/execute-diagnose-measures-media-runtime-resolution.cjs`

## ACTIVE RUNTIME SURFACES

Two runtime media surfaces were inspected.

1. Measures Registry runtime
   - component: `src/measures_registry/MeasuresRegistryRuntime.tsx`
   - media table: `public.measures_media_map`
   - campaign key: `agents_of_chaos_integrity_governance`
   - runtime resolver: `src/shared/media/runtimeMediaUrl.ts`

2. Measures of Inanna runtime
   - component path: `src/measures_of_inanna/Temple.tsx` -> `GenericEncounter.tsx` -> `EncounterStageMedia.tsx`
   - entry registry key: `epigraph`
   - encounter resolver: `src/measures_of_inanna/resolve_encounter.ts`
   - runtime resolver: `src/shared/media/runtimeMediaUrl.ts`

## RESOLVER CONTRACT

Runtime resolver behavior is DB-field driven.

Supabase:

- if `storage_provider` is not `cloudflare_r2`
- and bucket is not `measures-media`
- runtime resolves with Supabase Storage public URL using bucket and storage path

Cloudflare/R2:

- if `storage_provider = cloudflare_r2`
- or bucket is `measures-media`
- runtime resolves with `VITE_R2_PUBLIC_BASE_URL` plus encoded object key

No inspected renderer constructs media paths independently.

## MEASURES REGISTRY QUERY PATH

`MeasuresRegistryRuntime.tsx` queries:

`public.measures_media_map`

Filters:

- `campaign_key = agents_of_chaos_integrity_governance`
- `media_role in required and optional runtime roles`
- ordered by `sort_order`

Returned rows:

- 14 media rows
- missing roles: `foundation_intro_video`, `systems_intro_video`

Build artifacts:

- `dist-inanna` contains publishable-key marker, Supabase URL marker, and R2 public base marker
- `dist-registry` contains publishable-key marker, Supabase URL marker, and R2 public base marker

No full key values are recorded in evidence.

## MEASURES REGISTRY MEDIA RESULTS

R2 / `measures-media` rows tested renderable:

| media_role | bucket/path | retrieval | decision |
|---|---|---:|---|
| `c3_field_video` | `measures-media/c3_field.mp4` | 200 | renderable |
| `epigraph_video` | `measures-media/registry_epigraph_fracture_to_alignment_15s.mp4` | 200 | renderable |
| `explainer_video` | `measures-media/structural_coherence_explainer_45s.mp4` | 200 | renderable |
| `left_hero_fracture_motion` | `measures-media/left_hero_fracture_motion.mp4` | 200 | renderable |
| `measured_hero_motion_graphic` | `measures-media/right_measured_hero_motion_graphic.mp4` | 200 | renderable |

Supabase `measures-registry` rows tested renderable:

| media_role | bucket/path | retrieval | decision |
|---|---|---:|---|
| `hero_poster` | `measures-registry/measures_registry_poster.webp` | 200 | renderable |
| `registry_mark` | `measures-registry/measures_registry_mark.webp` | 200 | renderable |
| `left_hero_fracture` | `measures-registry/left_hero_fracture.webp` | 200 | renderable |
| `right_measured_hero` | `measures-registry/right_measured_hero.webp` | 200 | renderable |
| `paragraph_agents_of_chaos` | `measures-registry/paragraph_agents_of_chaos.png` | 200 | renderable |

Supabase `measures-registry` rows failing retrieval:

| media_role | bucket/path | retrieval | decision |
|---|---|---:|---|
| `hero_video` | `measures-registry/integrity_governance_intro.mp4` | 400 | not rendered |
| `path_choice_background` | `measures-registry/more_vs_coherence_path.webp` | 400 | not rendered |
| `hero_image` | `measures-registry/hero_fracture_measure.webp` | 400 | not rendered |
| `hero_measured_image` | `measures-registry/measured_hero_right.webp` | 400 | not rendered |

Failure seam:

The registry runtime resolver is functioning for valid R2 URLs and for some Supabase Storage rows. The observed Measures Registry failures are not a universal resolver failure. They are specific DB bucket/path records that resolve to Supabase public URLs returning HTTP 400.

## INANNA QUERY PATH

Entry route:

- `Temple.tsx` starts from `epigraph`
- `epigraph` resolves to encounter `epigraph_view`
- `epigraph_view` has `surface_type = aspect`

Runtime branch:

- registry media lookup only runs when `surface_type = chamberplate`
- because `epigraph_view` is `aspect`, it bypasses `public.measures_surface_media_map`
- it falls back to `public.temp_exhibition_media`

Fallback query:

- table: `public.temp_exhibition_media`
- filter: `surface_key in ['epigraph', 'epigraph_view']`
- ordered by `render_order`
- client filters inactive rows out

Returned row:

| surface | encounter | media_type | bucket/path | retrieval | decision |
|---|---|---|---|---:|---|
| `epigraph` | `epigraph_view` | video | `pre-codex-exhibition/inanna_encounter_intro.mp4` | 400 | not rendered |

Antechamber diagnostic:

| surface | encounter | media_type | bucket/path | retrieval | decision |
|---|---|---|---|---:|---|
| `temple_antechamber` | `temple_antechamber_view` | image | `pre-codex-exhibition/antechamber.png` | 400 | not rendered |

Failure seam:

The Inanna entry and antechamber are still reading legacy `temp_exhibition_media` rows. Those rows do not carry `storage_provider`; runtime treats `pre-codex-exhibition` as Supabase Storage and receives HTTP 400 from the generated public URLs.

## ENCOUNTER RESOLUTION STANDING

The diagnostic runner also tested the following registry keys:

- `chamber_epithets_01_primus_artus`
- `chamber_epithets_02_gemynd_corpus`
- `chamber_epithets_03_percipari`
- `gate_1_crown_removed`
- `gate_3_lapis_necklace`

Current read result:

- encounter could not be resolved for those keys through the runtime registry-key path

This is a routing/registry resolution finding, not a media retrieval finding. Because no encounter resolved, no renderer slot could be reached for those keys in this diagnostic run.

## RENDERER SLOT LOGIC

Measures of Inanna:

- `GenericEncounter.tsx` sorts media by role/order
- primary video is selected from `featured_video` or first video
- primary still is selected from `oracle_card`, `image`, or first image
- tonal audio is selected from `full_song`, `lapis_tone`, `material_tone`, `audio`, or first audio
- aspect media is selected from governed chamberplate roles or unrecognized registry media roles
- `EncounterStageMedia.tsx` renders by `mediaType`
- null resolver output renders `media unavailable`
- failed browser retrieval after a non-null URL is not surfaced as an explicit runtime diagnostic

Measures Registry:

- media roles are read from `measures_media_map`
- `mediaUrl(row)` passes only bucket/path to `resolveRuntimeMediaUrl`
- bucket `measures-media` correctly routes to R2
- bucket `measures-registry` routes to Supabase public object URL

## DIAGNOSTIC TABLE

| surface | requested media | DB row | provider | bucket/path | retrieval | rendered | failure reason |
|---|---|---|---|---|---:|---|---|
| Measures Registry | `hero_video` | yes | inferred Supabase | `measures-registry/integrity_governance_intro.mp4` | 400 | no | Supabase public URL retrieval failed |
| Measures Registry | `path_choice_background` | yes | inferred Supabase | `measures-registry/more_vs_coherence_path.webp` | 400 | no | Supabase public URL retrieval failed |
| Measures Registry | `hero_image` | yes | inferred Supabase | `measures-registry/hero_fracture_measure.webp` | 400 | no | Supabase public URL retrieval failed |
| Measures Registry | `hero_measured_image` | yes | inferred Supabase | `measures-registry/measured_hero_right.webp` | 400 | no | Supabase public URL retrieval failed |
| Inanna | entry video | yes | inferred Supabase | `pre-codex-exhibition/inanna_encounter_intro.mp4` | 400 | no | legacy fallback public URL retrieval failed |
| Inanna | antechamber still | yes | inferred Supabase | `pre-codex-exhibition/antechamber.png` | 400 | no | legacy fallback public URL retrieval failed |
| Inanna | chamber/gate keys tested | no resolved encounter | n/a | n/a | n/a | no | runtime registry-key encounter resolution failed |

## EXACT FAILURE SEAM

The active failure is not a single global media resolver break.

The exact seams are:

1. Measures Registry has specific `measures_media_map` records whose bucket/path resolves to Supabase public URLs returning HTTP 400.
2. Measures Registry R2 media delivery through `measures-media` and `VITE_R2_PUBLIC_BASE_URL` works for tested rows.
3. Inanna `epigraph` and `temple_antechamber` still render from legacy `temp_exhibition_media` fallback rows pointing at `pre-codex-exhibition`; those generated Supabase public URLs return HTTP 400.
4. Several Inanna chamber/gate registry keys did not resolve to runtime encounters in the current read path, so those surfaces cannot reach media slot rendering from those keys.

## VALIDATION

Validation criteria satisfied:

- active failing surfaces identified
- DB query paths documented
- returned rows documented
- Supabase resolver behavior documented
- Cloudflare/R2 resolver behavior documented
- L2 animated media status documented
- still image status documented
- exact failure seams identified
- no mutation performed

## CLOSE

Diagnostic complete.

Follow-up fix OAR2 should choose between:

- correcting/remapping the failing `measures_media_map` Supabase paths
- migrating Inanna entry/antechamber away from legacy fallback rows
- repairing unresolved Inanna registry-key encounter routing for chamber/gate keys

No fix was executed under this OAR.
