---
document_type: oar2
authority_level: working
document_scope: media_runtime_cleanup
title: OAR2 — Correct Measures Registry Media Rows and Migrate Inanna Fallbacks
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_reconcile_measures_registry_and_pre_codex_media_inventory_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Correct Measures Registry Media Rows and Migrate Inanna Fallbacks

## OBSERVED

Reconciliation completed with no mutation.

Findings:

- integrity_governance_intro.mp4 is valid R2 media and should resolve as:
  - cloudflare_r2
  - measures-media
  - integrity_governance_intro.mp4

- Several measures_media_map rows are stale and return HTTP 400.

- Pre-Codex media has been copied to measures-registry, but 11 copied assets have no seated DB row.

- Inanna runtime still relies on temp_exhibition_media fallback rows.

- temp_exhibition_media contains 71 active fallback candidates.

## ALIGNED

Codex remains authority.

Field structures storage and relation.

Measures registers usable media mapping.

Chazz routes correction without invention.

Cody executes only from this OAR2.

This OAR2 authorizes bounded DB mutation.

This OAR2 does not authorize:

- source bucket deletion
- frontend hardcoding
- resolver mutation unless already required by seated contract
- deletion of fallback rows
- invented media rows without explicit runtime purpose
- broad migration of all 71 fallback rows

## ROUTED

### Phase 1 — Correct deterministic Measures Registry rows

Cody may correct:

#### hero_video

Set to:

    media_role = hero_video
    storage_provider = cloudflare_r2
    bucket = measures-media
    storage_path = integrity_governance_intro.mp4

Only if the row already exists and the R2 URL verifies 200.

### Phase 2 — Hold stale Measures Registry rows

Cody must hold, not delete, stale rows returning HTTP 400:

- hero_image
- hero_measured_image
- path_choice_background
- paragraph_cover
- registry_banner
- social_card

Cody may mark them inactive only if the table has an existing active/enabled/status field that supports non-destructive holding.

If no such field exists, report them as held and leave unchanged.

### Phase 3 — Seat already-copied Pre-Codex runtime assets

Cody may create or update governed DB rows only for copied Pre-Codex target assets with explicit runtime use.

Minimum authorized seating:

- antechamber.webp
  - runtime use: temple_antechamber still image
  - provider: supabase
  - bucket: measures-registry
  - path: measures_registry/pre_codex_exhibition/images/antechamber.webp

- inanna_epigraph.webp
  - runtime use: epigraph still/image support only
  - provider: supabase
  - bucket: measures-registry
  - path: measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp

Cody must not invent video media for epigraph.

The old fallback video:

    inanna_encounter_intro.mp4

remains held until a valid video asset exists or operator authorizes replacement.

### Phase 4 — Migrate Inanna antechamber fallback mapping

Cody may seat temple_antechamber media through governed mapping if required tables already support it:

- codex_media_asset
- measures_surface_media_map

Target result:

    temple_antechamber -> antechamber.webp

After governed mapping validates, Cody may mark the corresponding temp_exhibition_media fallback row inactive only if non-destructive status support exists.

No fallback row deletion authorized.

### Phase 5 — Epigraph fallback boundary

Cody must not migrate the epigraph video fallback unless a valid epigraph video object exists.

If inanna_epigraph.webp is seated, it is image/still support only.

Report epigraph video as held.

### Phase 6 — Copy-decision assets

No copy authorized for:

- obsidian_chamberplate_gate01 (1).jpeg
- temple_antechamber_return.webp

Report them as future copy-decision assets.

### Phase 7 — Validation

Cody must validate:

- corrected hero_video resolves to R2 URL with retrieval 200
- stale registry rows are held or reported
- seated Pre-Codex rows resolve to Supabase URL with retrieval 200
- temple_antechamber governed mapping returns media without fallback dependency
- no source objects deleted
- no frontend hardcoding introduced
- no broad fallback migration performed

## CODY ROLE

Cody may:

- update deterministic existing DB rows
- create governed media rows only for explicitly authorized runtime assets
- seat antechamber governed mapping
- mark stale/fallback rows inactive only if schema already supports non-destructive state
- write OAR1 closeout

Cody may not:

- delete fallback rows
- create broad rows for all copied assets
- migrate all 71 fallback candidates
- hardcode frontend media
- invent video replacements
- delete bucket objects
- exceed named assets and rows

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. hero_video corrected to valid R2 standing
2. stale registry rows held or reported
3. antechamber.webp seated and runtime-valid
4. temple_antechamber mapping migrated off fallback if schema permits
5. inanna_epigraph.webp seated only as still/image support if used
6. epigraph video remains held unless valid video exists
7. no broad fallback deletion occurred
8. no frontend hardcoding occurred
9. exact remaining held items listed

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_correct_measures_registry_media_rows_and_migrate_inanna_fallbacks_v1.meta.md

## CLOSE

Correct deterministic rows.
Seat only confirmed runtime assets.
Migrate fallback carefully.
Delete nothing.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
