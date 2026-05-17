---
document_type: oar1
title: OAR1 Concordance Authority Migration Plan
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_migration_plan_v1.meta.md
---

OAR1: oar1_concordance_authority_migration_plan_v1

## Objective
Define a safe migration sequence for Concordance Authority without creating migrations, altering schema, mutating DB, mutating bucket objects, or implementing runtime/frontend behavior.

## Migration Dependency Order
Safe dependency order:
1. Create core tables without data:
   - `concordance_document`
   - `concordance_version`
   - `concordance_term`
   - `concordance_relation`
   - `seeded_source_snapshot`
2. Add check constraints for standing/type columns.
3. Add uniqueness constraints.
4. Add foreign keys after parent tables exist.
5. Add indexes for active lookups and FK paths.
6. Enable RLS on all tables.
7. Add read policies.
8. Withhold all client write policies.
9. Add append protections.
10. Run validation queries before manifest seating.
11. Seat Seed Concordance v1 from manifest only after schema validation passes.
12. Run post-seating validation before OAR1 execution closeout.

Dependency rules:
- parent bodies must exist before child bodies.
- `concordance_document` precedes `concordance_version`.
- `concordance_version` precedes terms, relations, and snapshots.
- term rows precede term-to-term relation rows.
- snapshot rows do not authorize document/version/term standing.

## Initial Migration Cadence
### Phase 1: Core Authority Tables
Create the five authority bodies with primary keys, timestamps, metadata columns, and no data.

Phase exit criteria:
- all tables exist
- no rows inserted
- no public writes possible

### Phase 2: Constraints and Indexes
Add:
- standing/type check constraints
- unique `(document_key, version_label)`
- unique `(version_key, term_label)`
- unique `(version_key, source_term_key, target_term_key, relation_type)`
- unique `(version_key, source_sha256)`
- FK indexes for version, term, relation, and snapshot lookups

Phase exit criteria:
- invalid standing values cannot be inserted
- duplicate term labels within one version are blocked
- duplicate snapshot hashes within one version are blocked

### Phase 3: RLS and Access Posture
Enable RLS and add read-only policies.

Recommended posture:
- anon/authenticated read only active, non-protected rows
- service-role write only
- no client insert/update/delete policies

Phase exit criteria:
- public read can only see active allowed rows
- draft, blocked, and protected rows are not exposed by public policy

### Phase 4: Append Protections
Add trigger protections:
- prevent delete on version, term, relation, and snapshot tables
- prevent update on `seeded_source_snapshot`
- prefer supersession rows over in-place term/relation meaning changes

Phase exit criteria:
- delete attempts fail on append-protected bodies
- snapshot mutation fails
- standing transitions remain service-role/OAR-routed only

### Phase 5: Manifest Seating Path
Seat Seed Concordance v1 from a manifest.

Required manifest order:
1. document
2. version
3. terms
4. relations
5. snapshots
6. validation evidence

Phase exit criteria:
- document and version seated
- term count matches manifest
- relation count matches manifest
- snapshot hash standing recorded

### Phase 6: Validation Cadence
Run pre-seat and post-seat validation.

Phase exit criteria:
- schema exists
- FK integrity passes
- uniqueness checks pass
- no duplicate active terms
- one active Seed Concordance v1 version exists
- snapshot standing is recorded
- OAR1 closeout records counts and validation results

## Append Protection Strategy
Immutable bodies:
- `seeded_source_snapshot` content once recorded
- historical version records after recognition

Append-only bodies:
- `concordance_relation`
- snapshot records
- correction/supersession evidence

Restricted mutation bodies:
- `concordance_document` may update metadata or active standing only by OAR route.
- `concordance_version` may update standing only by OAR route.
- `concordance_term` should not mutate canonical meaning after recognition; changes require new version or explicit supersession.

Supersession strategy:
- never overwrite prior authority silently.
- seat a new version for broad semantic changes.
- seat relation-level supersession for bounded relation corrections.
- retain old rows with superseded standing.

Correction strategy:
- failed term/relation seating becomes `blocked` or `correction_required`.
- corrected meaning seats as new row/version rather than mutating recognized authority.
- OAR1 must record source OAR2 and correction standing.

## Validation Cadence
Pre-migration validation:
- confirm no existing authority tables conflict.
- confirm current schema does not already contain a seated `seed_concordance`.
- confirm migration is routed and not being inferred from proposal state.

Post-schema validation:
- table existence via `to_regclass`
- constraint existence
- FK existence
- RLS enabled
- no public write policies
- append-protection triggers present

Pre-seating validation:
- manifest exists
- local source hash recorded
- bucket snapshot standing recorded or marked unresolved
- no existing active `seed_concordance_v1`
- no duplicate terms in manifest

Post-seating validation:
- one `seed_concordance` document
- one active `seed_concordance_v1` version
- expected terms seated
- expected relations seated
- no duplicate active term labels
- snapshot row seated with verification standing
- protected/draft/blocked rows hidden from public read

## Seed Concordance v1 Manifest Seating Sequence
1. Seat `concordance_document`.
2. Validate document row by `document_key = 'seed_concordance'`.
3. Seat `concordance_version`.
4. Validate version row by `version_key = 'seed_concordance_v1'`.
5. Seat initial term rows from manifest.
6. Validate term uniqueness by `(version_key, term_label)`.
7. Seat relation rows only after referenced term rows exist.
8. Validate relation FK integrity.
9. Seat `seeded_source_snapshot`.
10. Validate snapshot hash and verification standing.
11. Validate active authority surface.
12. Write execution OAR1 with row counts, keys, hashes, and unresolved snapshot notes.

Checkpoint sequence:
- checkpoint 1: document/version authority exists
- checkpoint 2: terms are non-duplicated
- checkpoint 3: relations resolve
- checkpoint 4: snapshot evidence records source standing
- checkpoint 5: no public write exposure

## Rollback and Recovery Posture
Safe rollback boundaries:
- before data seating: schema rollback can drop proposed empty tables if no authority rows exist.
- after document/version seating: do not drop rows; mark standing as `blocked` or `correction_required`.
- after term seating: use supersession/correction, not deletion.
- after snapshot seating: append a corrected snapshot row; do not mutate prior snapshot.

Failed migration handling:
- if table creation fails, stop before data seating.
- if constraints fail, stop before RLS/policies.
- if RLS fails, stop before manifest seating.
- if manifest seating partially fails, mark seated rows with correction standing and halt further seating.

Partial seating handling:
- no child rows should be treated as authority without parent document/version.
- orphaned child rows must be blocked by FK.
- incomplete relation rows must remain blocked until referenced terms exist.

Snapshot recovery posture:
- bucket/local snapshots support recovery only.
- snapshot rows may help reconstruct authority state, but do not become authority without document/version/term/relation seating.

## Measures Exposure Boundary
Measures may later expose:
- active concordance documents
- active versions
- active terms
- active relations
- verified or clearly marked snapshot references

Measures must not expose as authority:
- draft versions
- blocked terms
- protected system intelligence
- raw source excerpts that reconstruct protected logic
- unresolved snapshot state as verified
- frontend-authored labels or inferred semantic meanings

Frontend boundary:
- frontend may retrieve and render seated authority.
- frontend may not author terms, infer standing, or convert draft/proposal rows into active semantics.

## Validation
- Migration sequence defined.
- Dependency order defined.
- Initial migration cadence defined.
- Append protections defined.
- Validation cadence defined.
- Seed Concordance v1 seating cadence defined.
- Rollback and recovery posture defined.
- Measures exposure boundary defined.
- Native order preserved.
- No DB mutation performed.
- No migration file created.
- No schema alteration performed.
- No bucket mutation performed.
- No concordance content modification performed.
- No frontend/runtime implementation performed.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_migration_plan_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_migration_plan_v1.meta.md

## Close
Define migration before execution.
Seat authority deliberately.
Preserve semantic continuity.
