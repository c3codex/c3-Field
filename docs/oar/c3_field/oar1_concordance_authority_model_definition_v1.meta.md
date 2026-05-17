---
document_type: oar1
title: OAR1 Concordance Authority Model Definition
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_model_definition_v1.meta.md
---

OAR1: oar1_concordance_authority_model_definition_v1

## Objective
Define a manifest-first Concordance Authority Model that allows Seed Concordance v1 to resolve through Codex/database authority without treating markdown files or bucket snapshots as authority.

## Current Standing
Seed Concordance currently functions as semantic authority, native systems reference, and process-governing source surface, but is not seated as Codex/database authority.

Preflight confirmed:
- local concordance updated
- bucket snapshot partially refreshed
- DB authority seating absent
- no concordance document table
- no concordance version table
- no concordance term registry
- no concordance relation registry
- no semantic authority route

## Required Authority Bodies
### concordance_document
Purpose: identify the governed concordance as a Codex-held semantic authority body.

Authority standing: Codex authority root for the document identity.

Append/mutation standing: mutable only by OAR-routed version seating; document identity should remain stable.

Relations:
- Codex: holds document authority.
- Field: identifies which semantic field the document governs.
- Measures: may expose valid retrieval/reveal of the seated document.
- Seeded snapshots: snapshots reference the document; snapshots do not define it.

### concordance_version
Purpose: preserve each recognized version of a concordance document.

Authority standing: Codex-held version authority for a bounded semantic state.

Append/mutation standing: append-only after recognition. Correction requires a new version or routed correction record.

Relations:
- Codex: holds recognized version standing.
- Field: applies versioned semantic structure.
- Measures: reveals/retrieves the active or requested version.
- Seeded snapshots: source exports attach to versions as evidence.

### concordance_term
Purpose: seat each native term as a bounded semantic authority entry within a concordance version.

Authority standing: Codex-held term authority within a specific version.

Append/mutation standing: append-aware. Terms may be added by version; existing term meaning should not mutate silently.

Relations:
- Codex: holds term identity and canonical meaning.
- Field: structures relation among terms.
- Measures: exposes valid term retrieval/reveal.
- Seeded snapshots: provide source text evidence for term seating.

### concordance_relation
Purpose: record governed links between terms, bodies, axes, circuits, roles, source alignments, and resolves-to relationships.

Authority standing: Codex-held semantic relation authority.

Append/mutation standing: append-only relation trace within a version; supersession must be explicit.

Relations:
- Codex: holds relation validity.
- Field: structures semantic relation map.
- Measures: exposes valid relationship/retrieval surfaces.
- Seeded snapshots: preserve evidence of relation source.

### seeded_source_snapshot
Purpose: bind a source export or bucket object to a concordance document/version as evidence and recovery material.

Authority standing: evidence and recovery standing only.

Append/mutation standing: append-only snapshot records; refreshes create new snapshot records or explicit supersession.

Relations:
- Codex: records snapshot standing and verification.
- Field: uses snapshot as continuity evidence, not source authority.
- Measures: may retrieve snapshot for review.
- Seeded snapshots: preserve source continuity and recovery artifacts.

## Native Relation Flow
Codex resolves concordance authority by holding document identity, version standing, terms, relations, and snapshot evidence.

Field structures semantic relation by applying term and relation bodies without becoming the authority source.

Measures exposes valid reveal, registry lookup, and retrieval for recognized concordance authority and snapshots.

Chazz routes and validates systems behavior against seated Codex authority without authoring semantic truth.

Native order remains:

`Codex -> Field -> Measures -> Chazz`

## Term Seating Logic
Each term must satisfy the seven Concordance constraints before recognition:
- defined
- bound
- linked
- singular
- non-redundant
- non-drifting
- system-valid

Term seating must prevent duplicate semantic authority. A term may have aliases, historical labels, or source excerpts, but only one canonical term authority may be active for a document version.

Term update discipline:
- new term: OAR-routed append into a concordance version
- changed meaning: new version or explicit correction/supersession
- relation change: append relation record with source OAR and validation standing
- rejected duplicate: record as non-authoritative alias, superseded source, or blocked term

## Version and Snapshot Discipline
Live Codex authority:
- database-held document/version/term/relation standing
- governs system interpretation

Seeded snapshot export:
- immutable or append-recorded export of a recognized state
- supports recovery and verification

Bucket recovery artifact:
- storage copy of source/export material
- never becomes authority by presence alone

Working draft state:
- proposal, markdown, thread output, or local file before Codex seating
- not authority until routed, validated, and seated

Standing rule:

`bucket snapshot != authority`

`markdown file != authority`

`Codex seating = authority`

## Mutation Discipline
Future concordance mutation must be:
- manifest-first
- OAR-routed
- append-aware
- verification-before-recognition
- seeded-reference disciplined

Required mutation flow:
1. OAR2 defines intent, scope, source material, and authority impact.
2. Manifest defines document, version, term, relation, and snapshot records.
3. Cody performs preflight against existing Codex authority.
4. Chazz/operator validation confirms non-collapse and route standing.
5. Cody executes only the routed DB seating.
6. OAR1 records inserted/updated records, hashes, source paths, and validation.

No frontend, runtime, bucket object, or markdown state may imply concordance authority without Codex seating.

## Initial Seating Recommendation
Minimum viable seating path for Seed Concordance v1:
- create a manifest for `seed_concordance`
- seat one `concordance_document`
- seat one active `concordance_version` for `v1`
- seat a minimal required term set first, including existing Seed Concordance current scope and TREE/c3 Boundary additions
- seat term relations for axis, circuit, role, resolves-to, source alignment, and native order
- seat one `seeded_source_snapshot` tied to the verified local hash and bucket path
- record snapshot hash verification standing, including unresolved bucket readback if not closed before seating

Minimum manifest fields:
- document key
- document title
- document scope
- version
- authority standing
- readonly / append-only standing
- local source path
- bucket source path
- source hash
- source OAR2
- closeout OAR1
- native order preserved
- source alignment
- term list
- relation list
- validation standing

## Current Schema Fit
Current `c3_oar_seeded_reference` is not sufficient as the primary authority model because it tracks seeded OAR/infrastructure/process references and restricts reference type to `infrastructure`, `role`, `process`, and `validation`.

`measures_registry.metadata.codex_source_record` can reference `seed_concordance`, but it is retrieval/governance metadata, not a source-document authority table.

`codex_entity_artifact` is entity-artifact scoped and should not become the concordance authority route without a manifest and explicit authority model.

## Validation
- Concordance authority model defined.
- Required authority bodies defined.
- Native order preserved.
- Authority/snapshot distinction clarified.
- Term seating logic clarified.
- Version and snapshot discipline clarified.
- Mutation discipline clarified.
- Initial seating recommendation defined.
- No DB mutation performed.
- No schema alteration performed.
- No bucket modification performed.
- No concordance content modification performed.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_model_definition_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_model_definition_v1.meta.md

## Close
Codex must hold semantic authority.
Field must structure semantic relation.
Measures must expose valid reveal.
Seeded snapshots preserve continuity.
Authority must not drift into storage.
