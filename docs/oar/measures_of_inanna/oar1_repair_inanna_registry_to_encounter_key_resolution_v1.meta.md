---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_of_inanna_registry_to_encounter_resolution
title: OAR1 - Repair Inanna Registry-to-Encounter Key Resolution
status: completed
version: v1
source_oar2: oar2_repair_inanna_registry_to_encounter_key_resolution_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Repair Inanna Registry-to-Encounter Key Resolution

## Result

Measures of Inanna registry-to-encounter resolution was repaired at runtime.

Root cause:

- The resolver accepted registry keys through the `measures_registry.registry_key` inner join.
- It did not implement the bounded compatibility sequence required by this OAR2.
- Legacy `_view` encounter keys in URLs, such as `epigraph_view`, could not resolve because they were treated as registry keys.

No DB migration was performed.

No duplicate `measures_encounter_def` rows were created.

No media rows were changed.

No media resolver changes were made.

## Files Changed

- `src/measures_of_inanna/resolve_encounter.ts`
- `vite.config.ts`
- `dist-inanna/`
- `dist-registry/`

## Resolver Behavior

Before:

- Runtime queried `measures_encounter_def` through an inner join to `measures_registry`.
- Input was accepted only when it matched `measures_registry.registry_key`.
- `_view` encounter keys did not resolve as URL inputs.

After:

Runtime resolves in a bounded order:

1. find a registry row by `registry_key`
2. resolve encounter defs for that registry row in this order:
   - exact `encounter_key = registry_key`
   - metadata-declared encounter key
   - legacy-compatible `encounter_key = registry_key + "_view"`
3. if no registry row exists, allow exact encounter-key compatibility for legacy URLs

No arbitrary encounter scan was introduced.

No individual route exception was hardcoded.

## Starting Traversal Validation

Public-key Supabase validation confirmed:

- `epigraph` resolves to `epigraph_view`
- `crystal_temple_home` resolves to `crystal_temple_home_view`
- `inanna_seat` resolves to `inanna_seat_view`
- `temple_antechamber` resolves to `temple_antechamber_view`

Legacy exact encounter-key compatibility confirmed:

- `epigraph_view` resolves to `epigraph_view` with registry key `epigraph`
- `crystal_temple_home_view` resolves to `crystal_temple_home_view` with registry key `crystal_temple_home`
- `inanna_seat_view` resolves to `inanna_seat_view` with registry key `inanna_seat`
- `temple_antechamber_view` resolves to `temple_antechamber_view` with registry key `temple_antechamber`

Unresolved encounter keys: none in the routed starting traversal.

## Build Validation

`npm.cmd run build:inanna` passed.

Generated Inanna bundle:

`dist-inanna/assets/index-DvTRgzoP.js`

Because `vite.config.ts` is shared, Registry build validation was also run.

`npm.cmd run build:registry` passed.

Generated Registry bundle:

`dist-registry/assets/index-qPbY_Yxd.js`

Bundle key validation:

- Inanna generated bundle contains `sb_publishable_`
- Inanna generated bundle does not contain legacy JWT anon key
- Registry generated bundle contains `sb_publishable_`
- Registry generated bundle does not contain legacy JWT anon key

## Config Note

During validation, the local build initially embedded the stale root `.env` legacy JWT key.

`vite.config.ts` was updated so `.env.cloudflare` public browser values take precedence for:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_R2_PUBLIC_BASE_URL`

This preserves dashboard/Cloudflare public key alignment for local committed build artifacts without exposing secret values.

## Boundary

No DB migration was performed.

No media rows were changed.

No bucket mutation was performed.

No route-specific shortcut was introduced.

Measures Registry runtime behavior was not changed.
