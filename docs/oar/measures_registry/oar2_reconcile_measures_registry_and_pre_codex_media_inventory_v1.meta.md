---
document_type: oar2
authority_level: working
document_scope: media_inventory_reconciliation
title: OAR2 — Reconcile Measures Registry and Pre-Codex Media Inventory
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_remap_verified_pre_codex_assets_to_supabase_provider_v1
  - oar1_diagnose_measures_media_runtime_resolution_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Reconcile Measures Registry and Pre-Codex Media Inventory

## OBSERVED

Operator clarified:

- integrity_governance_intro.mp4 is a valid R2 object, not a Supabase measures-registry object.
- The other three failing Measures Registry media rows are not valid files:
  - more_vs_coherence_path.webp
  - hero_fracture_measure.webp
  - measured_hero_right.webp
- Supabase measures-registry bucket now intentionally contains only .webp files.
- Image files still remain in the pre-codex-exhibition bucket.
- Operator understood the intended action as moving all relevant Pre-Codex images to measures-registry.

Prior execution copied/remapped only the verified operator-confirmed subset, not the full bucket inventory.

The diagnostic confirmed legacy Inanna fallback rows still point to pre-codex-exhibition and return HTTP 400.

## ALIGNED

Codex remains authority.

Field structures storage relation.

Measures registers usable media mapping.

Chazz reconciles inventory without inventing truth.

This OAR2 authorizes reconciliation and classification only unless a correction is explicitly deterministic and non-destructive.

No broad mutation is authorized.

## ROUTED

### 1. Inventory storage

Cody must inventory:

- all image objects in pre-codex-exhibition
- all .webp objects in measures-registry
- all R2 measures-media objects referenced by DB rows where verifiable

### 2. Inventory DB references

Cody must inspect:

- codex_media_asset
- measures_media_map
- temp_exhibition_media
- any active encounter media mapping table used by Inanna runtime

### 3. Classification table

For every relevant media asset, classify:

- already copied and remapped
- copied but no seated DB row
- still in pre-codex-exhibition
- missing from target bucket
- stale DB row
- valid R2 row misclassified as Supabase
- legacy fallback row requiring migration
- requires new seating OAR
- invalid / remove-or-hold candidate

### 4. Measures Registry correction candidates

Cody must specifically report correction candidates for:

- integrity_governance_intro.mp4
  - expected standing: cloudflare_r2 / measures-media / integrity_governance_intro.mp4

- more_vs_coherence_path.webp
- hero_fracture_measure.webp
- measured_hero_right.webp
  - expected standing: invalid/stale unless matching target objects exist

No deletion authorized.

### 5. Pre-Codex image migration classification

Cody must identify remaining image assets in pre-codex-exhibition that should be copied into:

    measures-registry/measures_registry/pre_codex_exhibition/images/

Cody must not copy yet unless exact operator-confirmed list already exists in prior OARs.

### 6. Legacy fallback classification

Cody must identify all temp_exhibition_media rows still used by runtime, including:

- epigraph
- antechamber
- any chamber/gate fallback rows

Report whether each should be:

- migrated to codex_media_asset
- remapped to existing measures-registry object
- held for new asset upload
- deprecated after registry media mapping is seated

### 7. No mutation boundary

No DB mutation.

No bucket deletion.

No frontend mutation.

No resolver mutation.

This OAR2 produces the reconciliation table needed for the next execution OAR.

## VALIDATION

OAR1 must return:

- source bucket inventory
- target bucket inventory
- DB media inventory
- stale row list
- valid R2 correction list
- remaining Pre-Codex copy candidates
- legacy fallback migration candidates
- exact recommended next OAR2
- mutation count 0

## CODY ROLE

Cody may:

- inspect buckets
- inspect DB rows
- test URLs
- classify media state
- write OAR1 closeout

Cody may not:

- mutate DB rows
- copy additional media
- delete source objects
- hardcode frontend paths
- invent missing DB rows
- bypass registry mapping

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_reconcile_measures_registry_and_pre_codex_media_inventory_v1.meta.md

## CLOSE

Inventory first.
Classify second.
Mutate later.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
