---
document_type: oar1
authority_level: execution_record
document_scope: measures_registry_launch_planning_db_manifest
title: Seat Measures Registry Lapis Launch Chamber DB Manifest
status: completed_mutation_held
version: v1
operator: codex
system: measures_registry
source_oar2: docs/oar/measures-registry/oar2_seat_measures_registry_lapis_launch_chamber_db_manifest_v1.meta.md
completed_at: 2026-06-04
tags:
  - measures-registry
  - db-manifest
  - lapis-chamber
  - launch-initiative
  - internal-only
  - runtime-excluded
  - oar1
---

# OAR1 — Seat Measures Registry Lapis Launch Chamber DB Manifest v1

## Scope

Executed the OAR2 DB target audit and manifest decision for the Measures Registry Assessment-First Launch and Lapis launch chamber.

This pass did not mutate the database.

Reason:

    Existing candidate Measures tables do not provide a DB-side internal-only protection boundary suitable for internal launch planning records.

## Files Changed

- `docs/initiatives/measures_registry_assessment_first_launch/measures_registry_lapis_launch_chamber_db_manifest_v1.meta.md`
- `docs/oar/measures-registry/oar1_seat_measures_registry_lapis_launch_chamber_db_manifest_v1.meta.md`

## Table Targets Audited

Audited candidate tables named in OAR2:

- `measures_registry`
- `measures_encounter_def`
- `measures_release_state`
- `measures_transition_rule`

Also checked the current public registered runtime query path in:

- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

## Suitability Decision

### `measures_registry`

Decision:

    not suitable for internal launch planning records in current posture

Finding:

    anon client can read rows from this table

Service count observed:

    114 rows

Anon count observed:

    105 rows

Reason:

    Internal initiative/chamber metadata would be queryable outside the public runtime if inserted here.

### `measures_encounter_def`

Decision:

    not suitable for internal launch planning records in current posture

Finding:

    anon client can read rows from this table

Service count observed:

    103 rows

Anon count observed:

    93 rows

Runtime finding:

    public registered runtime reads a fixed allowlist of encounter keys and does not include the Lapis launch chamber or its internal contracts

Reason:

    Runtime allowlisting prevents rendering, but does not provide DB-side internal-only access protection.

### `measures_release_state`

Decision:

    not suitable as the primary internal launch holder

Finding:

    anon sampled read returned zero rows, but the table depends on companion `measures_registry` rows

Reason:

    Release/access rows cannot define the initiative/chamber safely without registry rows, and registry rows are publicly readable.

### `measures_transition_rule`

Decision:

    not suitable for this OAR

Finding:

    anon client can read transition rules

Reason:

    OAR2 default is no public transition rules. Internal transitions require an internal-only table boundary.

## Existing Launch Row Audit

Exact keys checked:

- `measures_registry_assessment_first_launch_v1`
- `measures_registry_lapis_launch_chamber_v1`
- `seo_identity_contract_v1`
- `structural_drift_publication_series_v1`
- `assessment_first_social_campaign_v1`
- `ai_operations_assessment_launch_routing_v1`
- `foundational_leadership_conversation_v1`
- `launch_signal_review_v1`

Result:

- no existing `measures_registry` rows for the initiative/chamber keys
- no existing `measures_encounter_def` rows for the internal encounter keys
- no release state rows for the launch initiative/chamber
- no transition rows from the launch initiative/chamber

## DB Mutation Standing

DB mutation held.

No insert, update, delete, schema change, release state row, or transition rule was executed.

Reason held:

    Candidate public Measures tables are not safe internal holders because runtime exclusion is currently enforced in src allowlists, not as a DB-side internal-only policy boundary.

## DB Manifest Seated

Created:

    docs/initiatives/measures_registry_assessment_first_launch/measures_registry_lapis_launch_chamber_db_manifest_v1.meta.md

Manifest status:

    mutation_held_schema_required

The manifest proposes a future internal-only schema family:

- `internal_initiative_registry`
- `internal_initiative_encounter_contract`
- `internal_initiative_release_state`

Required future posture:

- RLS enabled.
- No anon select policy.
- No public REST exposure for internal planning rows.
- Service or authorized internal role read only.
- Runtime visibility excluded.
- Public visibility false.
- Search visibility false.

## Runtime Exclusion Validation

Current public registered runtime uses fixed public allowlists:

- `REGISTERED_ENCOUNTER_KEYS`
- `SURFACE_QUERY`
- `SURFACE_QUERY_ALIASES`

The Lapis launch chamber and internal contract keys are not included in those public runtime allowlists.

No `src` files were edited in this OAR1.

No public route, public nav, public phase map, public chamber path, search-visible page, CTA destination, or public runtime bundle exposure was created.

## Public Visibility Validation

Because no DB rows were inserted:

- initiative DB record: mutation held
- chamber DB record: mutation held
- encounter contract DB records: mutation held
- release state DB records: absent
- transition rules: absent

Public visibility remains false by non-seating.

## Marble Held Boundary

Marble remains held.

No DB row created:

- Marble release.
- pricing route.
- payment route.
- wallet connect requirement.
- c3 Key issuance.
- DAO standing.
- conversion standing.
- certification standing.
- recognition standing.
- permission standing.
- distribution standing.

## Validation Commands

Audited with read-only Supabase client checks and runtime source inspection.

Key evidence:

- `measures_registry` readable by anon client.
- `measures_encounter_def` readable by anon client.
- `measures_transition_rule` readable by anon client.
- public registered runtime allowlists exclude the internal Lapis launch keys.
- exact launch keys do not exist in public candidate tables.

## Unresolved Dependencies

- A separate schema/migration OAR is required before DB seating can proceed.
- Internal-only initiative table family remains uncreated.
- Internal encounter contract rows remain unseated in DB.
- Internal release/access standing remains manifest-only.
- Internal transition rules remain absent.

## Close

Docs seated the chamber.

This OAR checked whether Codex can safely hold it in current DB tables.

Current public Measures tables are not safe internal holders.

DB mutation remains held.

Next step is a dedicated internal-only schema OAR.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.
