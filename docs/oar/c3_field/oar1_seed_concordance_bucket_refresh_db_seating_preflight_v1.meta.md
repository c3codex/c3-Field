---
document_type: oar1
title: OAR1 Seed Concordance Bucket Refresh + DB Seating Preflight
version: v1
status: blocked_partial
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_seed_concordance_bucket_refresh_db_seating_preflight_v1.meta.md
---

OAR1: oar1_seed_concordance_bucket_refresh_db_seating_preflight_v1

## Objective
Refresh the private `measures-seed` Seed Concordance source snapshot and perform read-only DB seating preflight without mutating DB, schema, frontend, runtime, or Seed Concordance content.

## Actions
- Confirmed local updated Seed Concordance exists.
- Attempted bucket refresh for `seed/v1/seed_concordance.meta.md`.
- Performed read-only bucket metadata inspection.
- Performed read-only DB seating inspection.
- Inspected local schema/migration routes for candidate seating targets.
- No DB mutation was performed.

## Local Source
- local path: `docs/_source/seed/seed_concordance.meta.md`
- bytes: 23398
- SHA-256: `9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a`

## Bucket Refresh Findings
Target:
- bucket: `measures-seed`
- expected path: `seed/v1/seed_concordance.meta.md`

Bucket metadata after refresh attempt showed:
- bucket object exists
- object path: `seed/v1/seed_concordance.meta.md`
- object size: 23398
- object updated_at: `2026-05-17T02:05:47.417Z`
- object content length: 23398

However, SDK download verification still returned the prior cached object:
- downloaded bytes: 18606
- downloaded SHA-256: `5b00b0607e85fdf772bc96428a4acab6f08231833a78df446b47ae062c3e2add`
- downloaded hash matched local: false

Final cache-busting / no-cache metadata update and readback was blocked by app policy for external storage mutation risk.

## Bucket Standing
Bucket object metadata indicates the routed object was refreshed to the updated local byte size.

Hash-match validation is not conclusively closed because verified download readback remained stale/cached and the cache-busted confirmation step was blocked.

Bucket refresh standing:

`metadata_updated_but_hash_readback_unresolved`

## DB Seating Preflight Findings
Read-only DB inspection found:
- `c3_oar_seeded_reference` contains no `seed_concordance` row.
- `codex_entity_artifact` contains no `seed_concordance` artifact row.
- `measures_registry.metadata` contains no row referencing `seed_concordance`.

Local schema inspection found:
- `c3_oar_seeded_reference` exists and tracks seeded OAR/infrastructure/process references.
- Its `seeded_reference_type` enum is limited to `infrastructure`, `role`, `process`, and `validation`.
- No existing table was found that clearly represents concordance document, concordance version, concordance term, concordance relation, source document, or semantic term registry.
- `measures_registry.metadata.codex_source_record` can reference `seed_concordance`, but that is not a source-document seating table.
- `codex_entity_artifact` is entity-artifact scoped and is not a clean Seed Concordance authority route without a manifest.

## DB Seating Recommendation
No valid DB seating route is confirmed under the current schema.

Recommended next OAR2 should be manifest-first and define a DB seating model before mutation.

Suggested model:
- `concordance_document`
- `concordance_version`
- `concordance_term`
- `concordance_relation`
- `seeded_source_snapshot`

Minimum manifest requirements:
- document key: `seed_concordance`
- title: `Seed Concordance`
- version: `v1`
- local source path
- bucket source path
- SHA-256
- authority standing
- readonly / append-only status
- source alignment
- native order preserved
- explicit relation to TREE + c3 Boundary update OARs

Possible interim route:
- extend or supplement `c3_oar_seeded_reference` only after a routed schema/manifest decision, because the current enum does not cleanly seat source documents.

## Validation
- Local updated Seed Concordance hash recorded.
- DB seating targets inspected.
- DB seating gap reported.
- No valid existing DB seating route confirmed.
- No DB mutation performed.
- OAR1 written.
- Bucket object existence confirmed by metadata.
- Bucket privacy was previously confirmed true for `measures-seed`.
- Bucket hash-match verification remains unresolved due stale/cached readback and blocked cache-busting confirmation.

## Constraints Held
- No DB mutation.
- No table creation.
- No record insert.
- No record update.
- No schema alteration.
- No frontend modification.
- No runtime modification.
- No Seed Concordance content revision.
- Bucket refresh was not treated as DB seating.

## Files
- docs/oar/c3_field/oar2_seed_concordance_bucket_refresh_db_seating_preflight_v1.meta.md
- docs/oar/c3_field/oar1_seed_concordance_bucket_refresh_db_seating_preflight_v1.meta.md
- docs/_source/seed/seed_concordance.meta.md

## Close
Bucket preserves source snapshot, but final hash readback remains unresolved.

Codex must hold authority.

Manifest required before database seating.
