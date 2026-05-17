---
document_type: oar1
title: OAR1 Concordance Authority Schema Proposal
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_schema_proposal_v1.meta.md
---

OAR1: oar1_concordance_authority_schema_proposal_v1

## Objective
Propose a minimal Concordance Authority schema that can seat Seed Concordance v1 through Codex/database authority while preserving the authority/snapshot distinction.

## Authority Rule
`Codex seating = authority`

`Field structures semantic relation`

`Measures exposes valid reveal/retrieval`

`Bucket stores evidence/recovery snapshots`

## Proposed Tables
### concordance_document
Purpose: Codex-held identity for a governed concordance body.

Required columns:
- `document_key text primary key`
- `title text not null`
- `document_scope text not null`
- `authority_standing text not null`
- `native_order text not null`
- `source_alignment jsonb not null default '[]'::jsonb`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- `authority_standing` should allow `proposed`, `active`, `superseded`, `blocked`.
- `document_key` should be stable and unique.

Mutation standing:
- Document identity is update-limited.
- Authority changes require OAR route and validation.

### concordance_version
Purpose: Codex-held recognized version state for a concordance document.

Required columns:
- `version_key text primary key`
- `document_key text not null references public.concordance_document(document_key)`
- `version_label text not null`
- `version_standing text not null`
- `recognized_at timestamptz`
- `source_oar2_path text not null`
- `closeout_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- unique `(document_key, version_label)`
- `version_standing` should allow `draft`, `active`, `superseded`, `correction_required`, `blocked`.

Mutation standing:
- Append-aware.
- Active version changes require explicit OAR route.
- Supersession must be recorded rather than silently replacing meaning.

### concordance_term
Purpose: Codex-held canonical term authority within a concordance version.

Required columns:
- `term_key text primary key`
- `version_key text not null references public.concordance_version(version_key)`
- `term_label text not null`
- `canonical_definition text not null`
- `axis text`
- `circuit text`
- `role text`
- `resolves_to text`
- `term_standing text not null`
- `source_excerpt text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- unique `(version_key, term_label)`
- `term_standing` should allow `proposed`, `active`, `superseded`, `alias`, `blocked`.

Mutation standing:
- Active term meaning must not mutate silently.
- Changed meaning requires new version or explicit supersession/correction record.

### concordance_relation
Purpose: Codex-held semantic relation map between terms and authority bodies.

Required columns:
- `relation_key text primary key`
- `version_key text not null references public.concordance_version(version_key)`
- `source_term_key text references public.concordance_term(term_key)`
- `target_term_key text references public.concordance_term(term_key)`
- `relation_type text not null`
- `relation_label text`
- `relation_standing text not null`
- `source_oar2_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Constraints:
- unique `(version_key, source_term_key, target_term_key, relation_type)`
- `relation_type` should support `axis`, `circuit`, `role`, `resolves_to`, `source_alignment`, `native_order`, `supersedes`, `aliases`, `related_to`.
- `relation_standing` should allow `active`, `superseded`, `blocked`.

Mutation standing:
- Append-only relation trace.
- Corrections require new relation record or explicit supersession.

### seeded_source_snapshot
Purpose: Evidence/recovery link from Codex authority to source exports and bucket snapshots.

Required columns:
- `snapshot_key text primary key`
- `version_key text not null references public.concordance_version(version_key)`
- `snapshot_type text not null`
- `local_source_path text`
- `bucket_name text`
- `bucket_path text`
- `source_sha256 text not null`
- `byte_size integer not null`
- `verification_standing text not null`
- `verified_at timestamptz`
- `source_oar2_path text not null`
- `closeout_oar1_path text`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`

Constraints:
- unique `(version_key, source_sha256)`
- `snapshot_type` should allow `local_source`, `bucket_snapshot`, `export`, `recovery_artifact`.
- `verification_standing` should allow `verified`, `metadata_verified`, `hash_readback_unresolved`, `failed`, `superseded`.

Mutation standing:
- Append-only.
- Refreshes create new snapshot records or explicit supersession.
- Snapshot presence never becomes authority.

## Relationships
- `concordance_document` has many `concordance_version`.
- `concordance_version` has many `concordance_term`.
- `concordance_version` has many `concordance_relation`.
- `concordance_version` has many `seeded_source_snapshot`.
- `concordance_relation` links terms within a version and may record source alignment or supersession.

## RLS and Access Posture
Recommended posture:
- enable RLS on all proposed tables.
- public/anon read may be allowed only for active, non-protected, non-reconstructive rows.
- authenticated read may be allowed for active governance review surfaces.
- writes should be service-role only through OAR-routed Cody/Chazz execution.
- no client-side insert, update, or delete policies.

Recommended append-only protections:
- prevent delete on `concordance_version`, `concordance_term`, `concordance_relation`, and `seeded_source_snapshot`.
- prevent update on `seeded_source_snapshot`.
- allow term/relation standing updates only through service-role OAR route, or prefer supersession rows.

## Seed Concordance v1 Initial Seating Path
1. Create manifest for `seed_concordance`.
2. Seat `concordance_document`:
   - `document_key: seed_concordance`
   - `title: Seed Concordance`
   - `document_scope: seed`
   - `authority_standing: active`
   - `native_order: Codex -> Field -> Measures -> Chazz`
3. Seat `concordance_version`:
   - `version_key: seed_concordance_v1`
   - `version_label: v1`
   - `version_standing: active`
4. Seat initial terms from current Seed Concordance scope, including TREE and c3 Boundary additions.
5. Seat relations for axis, circuit, role, resolves-to, source alignment, native order, aliases, and supersession where needed.
6. Seat `seeded_source_snapshot` for local source hash:
   - local path: `docs/_source/seed/seed_concordance.meta.md`
   - SHA-256: `9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a`
   - byte size: 23398
7. Seat bucket snapshot standing only if hash verification is resolved, or record `hash_readback_unresolved`.
8. Write OAR1 with record counts, term keys, relation keys, snapshot hashes, and validation queries.

## Migration Risks
- Treating bucket or markdown as authority instead of evidence.
- Over-normalizing terms before Seed Concordance v1 is safely seated.
- Creating duplicate semantic authority for existing terms.
- Exposing protected systems intelligence through term/source excerpts.
- Letting frontend/runtime read draft or blocked terms as active authority.
- Using `measures_registry.metadata.codex_source_record` as authority instead of retrieval metadata.
- Extending `c3_oar_seeded_reference` beyond its current OAR/process purpose without manifest decision.
- Failing to record unresolved bucket hash readback as a separate snapshot standing.

## Required Validation Queries Before Future Execution
```sql
select to_regclass('public.concordance_document') as concordance_document;
select to_regclass('public.concordance_version') as concordance_version;
select to_regclass('public.concordance_term') as concordance_term;
select to_regclass('public.concordance_relation') as concordance_relation;
select to_regclass('public.seeded_source_snapshot') as seeded_source_snapshot;
```

```sql
select *
from public.concordance_document
where document_key = 'seed_concordance';
```

```sql
select *
from public.concordance_version
where version_key = 'seed_concordance_v1'
   or (document_key = 'seed_concordance' and version_label = 'v1');
```

```sql
select term_label, count(*)
from public.concordance_term
where version_key = 'seed_concordance_v1'
group by term_label
having count(*) > 1;
```

```sql
select *
from public.seeded_source_snapshot
where version_key = 'seed_concordance_v1'
  and source_sha256 = '9c47e162a7b72eb32b09c78f3838a0198f996178cd49b5e20ae9c0685d42fc3a';
```

```sql
select term_key, term_label, term_standing
from public.concordance_term
where version_key = 'seed_concordance_v1'
  and term_label in ('TREE', 'c3 Boundary');
```

## Validation
- Minimal schema proposal completed.
- Required columns proposed.
- Primary keys and uniqueness constraints proposed.
- Append-only and mutation standing proposed.
- Table relationships proposed.
- RLS/access posture proposed.
- Seed Concordance v1 initial seating path proposed.
- Migration risks identified.
- Future validation queries proposed.
- Authority/snapshot distinction preserved.
- No DB mutation performed.
- No migration file created.
- No bucket mutation performed.
- No concordance content modification performed.
- No frontend/runtime implementation performed.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_schema_proposal_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_schema_proposal_v1.meta.md

## Close
Define before migration.
Manifest before database.
Codex holds authority.
