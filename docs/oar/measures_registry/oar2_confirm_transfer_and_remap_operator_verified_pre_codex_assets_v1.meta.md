---
document_type: oar2
authority_level: working
document_scope: db_media_remap
title: OAR2 — Confirm Transfer and Remap Operator Verified Pre-Codex Assets
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: oar1_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Confirm Transfer and Remap Operator Verified Pre-Codex Assets

## OBSERVED

Operator reviewed the live Supabase bucket inventory and confirmed the intended transfer/remap asset set.

Confirmed assets:

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

Operator additionally confirmed:

- all non `_original_artwork` assets were already active on the Inanna site
- `_original_artwork` assets are scoped as chamberplate assets
- target bucket remains: measures-registry
- frontend remains DB-driven

Prior OAR1 completed bucket copy verification but correctly held DB remap due to ambiguity before operator confirmation.

This OAR2 now resolves that ambiguity through explicit operator confirmation.

## ALIGNED

Codex remains authority.

Field structures relation.

Measures registers reveal and media mapping.

Chazz routes validated execution.

Cody executes only from this OAR2.

Frontend must continue rendering from DB-seated media mapping only.

No React hardcoding.
No fallback media authority.
No inferred routes outside seated records.

This OAR2 authorizes:

1. verification of the operator-confirmed asset set
2. DB remap for matching seated media rows
3. seating of `_original_artwork` assets as chamberplate-scoped assets where matching rows exist
4. OAR1 validation closeout

This OAR2 does not authorize:

- source bucket deletion
- frontend resolver changes
- inferred remap beyond operator-confirmed assets
- creation of invented DB records
- remap of unmatched rows without reporting

## ROUTED

### 1. Verify current target objects

Cody must verify the current target objects exist in:

    measures-registry/measures_registry/pre_codex_exhibition/images/

Verification required:

- object exists
- nonzero size
- retrievable URL succeeds
- filename matches operator-confirmed inventory

### 2. Remap matching DB rows

Cody may update matching DB media rows for the confirmed assets only.

Permitted remap target pattern:

    measures_registry/pre_codex_exhibition/images/<filename>

Rows must already exist.

No invented rows.
No inferred relations beyond confirmed inventory.

### 3. Chamberplate-scoped artwork assets

The following assets are confirmed as chamberplate-scoped assets:

- gemynd_corpus_original_art.webp
- percipari_original_artwork.webp
- primus_artus_original_artwork.webp

If matching DB rows already exist, Cody may remap them.

If matching rows do not exist:

- report them in OAR1
- do not invent rows

### 4. Held behavior

If any confirmed asset lacks:

- matching DB row
- retrievable target object
- deterministic relation

Cody must:

- hold the row
- report it in OAR1
- avoid inferred mutation

### 5. Frontend boundary

Frontend must continue reading only from seated DB mapping.

No frontend file edits are authorized unless strictly required for seated runtime contract resolution.

No hardcoded storage paths are authorized.

No fallback media authority is authorized.

## VALIDATION

Cody must return:

- verified object inventory
- remapped DB rows
- previous storage paths
- updated storage paths
- held rows
- unmatched confirmed assets
- verification query output
- confirmation that no frontend hardcoding was introduced

## CODY ROLE

Cody may:

- verify confirmed bucket objects
- remap matching DB media rows
- validate storage paths
- write OAR1 closeout

Cody may not:

- invent DB rows
- infer unconfirmed relations
- delete source bucket objects
- hardcode frontend paths
- bypass verification
- exceed confirmed asset scope

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1.meta.md

## CLOSE

Operator-confirmed assets only.

Verified targets only.

DB-seated mapping only.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
