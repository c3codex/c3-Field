---
document_type: oar2
authority_level: working
document_scope: db_media_remap
title: OAR2 — Remap Verified Pre-Codex Assets to Supabase Provider
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1
  - oar1_copy_corrected_pre_codex_media_assets_to_measures_registry_v1
  - oar1_copy_corrected_inanna_epigraph_asset_v1
  - oar1_expand_codex_media_asset_storage_provider_contract_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Remap Verified Pre-Codex Assets to Supabase Provider

## OBSERVED

The Pre-Codex media transfer layer is complete.

The storage provider contract now allows:

- cloudflare_r2
- supabase

Runtime resolver behavior was verified for both provider types.

The provider/bucket mismatch risk is resolved.

Pre-Codex media rows were intentionally not remapped during provider-contract expansion.

## ALIGNED

Codex remains authority.

Field structures storage relation.

Measures registers media mapping.

Chazz validates and routes.

Cody executes only from this OAR2.

This OAR2 authorizes DB remap for verified Pre-Codex assets only.

This OAR2 does not authorize:

- frontend hardcoding
- resolver mutation
- source bucket deletion
- unverified asset remap
- invented DB rows
- unrelated media changes

## ROUTED

### 1. Remap verified rows

Cody may update only existing codex_media_asset rows with verified target objects.

Set:

    storage_provider = supabase
    bucket = measures-registry
    storage_path = measures_registry/pre_codex_exhibition/images/<filename>

### 2. Candidate row set

Cody may remap verified matching rows for:

- antechamber.webp
- gemynd_corpus.webp
- gemynd_corpus_original_art.webp
- inanna_epigraph.webp
- marble_chamber_codexstone.webp
- obsidian_chamberplate_gate01.webp
- obsidian_chamberplate_gate03.webp
- og.webp
- percipari_original_artwork.webp
- primus_artus_epithet01_chamberplate.webp
- primus_artus_original_artwork.webp

Rows must already exist.

No invented rows.

### 3. Original artwork scope

The following _original_artwork assets are chamberplate-scoped assets:

- gemynd_corpus_original_art.webp
- percipari_original_artwork.webp
- primus_artus_original_artwork.webp

If matching rows exist, remap them to Supabase provider/path.

If matching rows do not exist, report held.

### 4. Before/after validation

Cody must record before and after for each remapped row:

- media key
- previous storage_provider
- previous bucket
- previous storage_path
- new storage_provider
- new bucket
- new storage_path
- target verification status

### 5. Runtime verification

After DB mutation, Cody must verify the resolver can generate valid runtime URLs for remapped Supabase rows.

At minimum verify:

- one chamberplate/oracle asset
- one original artwork asset
- one epigraph or passage asset

### 6. Held rows

Any missing DB row, ambiguous relation, or failed target verification must remain held.

Held rows must be reported in OAR1.

### 7. Frontend boundary

No frontend mutation is authorized.

No hardcoded media paths.

No fallback authority.

## VALIDATION

This OAR2 resolves successfully when:

1. verified Pre-Codex media rows are remapped to storage_provider = supabase
2. bucket is set to measures-registry
3. storage paths point to verified target objects
4. runtime resolver succeeds for remapped Supabase rows
5. existing unrelated media rows remain unchanged
6. held/unmatched rows are reported
7. no frontend hardcoding is introduced
8. OAR1 records before/after evidence

## CODY ROLE

Cody may:

- inspect existing DB media rows
- verify target Supabase objects
- update verified matching rows
- validate resolver output
- write OAR1 closeout

Cody may not:

- invent rows
- remap unverified assets
- alter frontend components
- mutate resolver logic unless required by already-seated provider contract
- delete source objects
- exceed this asset set

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_remap_verified_pre_codex_assets_to_supabase_provider_v1.meta.md

## CLOSE

Verified assets only.
Existing rows only.
Supabase provider only where target is proven.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
