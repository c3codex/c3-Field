---
document_type: db_manifest
authority_level: proposed_schema_manifest
document_scope: measures_registry_launch_planning_db_manifest
title: Measures Registry Lapis Launch Chamber DB Manifest
status: mutation_held_schema_required
version: v1
operator: codex
system: measures_registry
source_oar2: docs/oar/measures-registry/oar2_seat_measures_registry_lapis_launch_chamber_db_manifest_v1.meta.md
initiative_key: measures_registry_assessment_first_launch_v1
chamber_key: measures_registry_lapis_launch_chamber_v1
runtime_visibility: excluded
public_visibility: false
search_visibility: false
material: lapis
---

# Measures Registry Lapis Launch Chamber DB Manifest v1

## Standing

This manifest records the DB seating decision for the internal Measures Registry Lapis launch chamber.

DB mutation is held.

Reason:

    Existing Measures public registry tables do not provide a DB-side internal-only protection boundary suitable for internal launch planning records.

The current public runtime does not route the Lapis launch chamber, but the candidate tables are readable through the public anon client. Runtime key filtering alone is not enough authority for internal planning contracts.

## Existing Table Audit

### `measures_registry`

Current role:

    stable registry identity and public/runtime registry standing

Audit finding:

    readable by anon client

Suitability:

    not suitable for internal planning records without additional DB-side access/filtering

Reason:

    Internal initiative/chamber metadata would be queryable outside the public runtime even if no route renders it.

### `measures_encounter_def`

Current role:

    encounter-side structural behavior and public runtime copy/render contracts

Audit finding:

    readable by anon client

Public runtime behavior:

    current registered runtime reads a fixed allowlist of public encounter keys

Suitability:

    not suitable for internal planning records without additional DB-side access/filtering

Reason:

    Runtime allowlisting prevents rendering, but does not prevent public API read of inserted internal encounter contracts.

### `measures_release_state`

Current role:

    release/access standing companion for registry rows

Audit finding:

    anon client returned no rows in the sampled read, but table is not an independently sufficient holder because it depends on public registry rows

Suitability:

    not suitable as the primary internal launch chamber holder

Reason:

    Release/access rows cannot safely define the initiative/chamber without companion registry records.

### `measures_transition_rule`

Current role:

    transition and navigation rule table

Audit finding:

    readable by anon client

Suitability:

    not suitable for internal planning transitions in this OAR

Reason:

    No public transition rules are allowed for the Lapis launch chamber, and internal planning transitions need a separate internal-only boundary.

## Required Internal Schema Family

Future DB seating should use a dedicated internal schema family or tables with DB-side public exclusion guarantees.

Proposed table family:

- `internal_initiative_registry`
- `internal_initiative_encounter_contract`
- `internal_initiative_release_state`

No table creation is authorized by this manifest.

## Proposed Table: `internal_initiative_registry`

Minimum columns:

- `id uuid primary key`
- `initiative_key text not null unique`
- `parent_key text null`
- `title text not null`
- `material text not null`
- `standing text not null`
- `runtime_visibility text not null`
- `public_visibility boolean not null default false`
- `search_visibility boolean not null default false`
- `release_state text not null`
- `primary_public_action text null`
- `marble_dependency text null`
- `contract_json jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by text not null`
- `source_oar2 text not null`

Required constraints:

- `public_visibility = false`
- `search_visibility = false`
- `runtime_visibility in ('excluded', 'internal_only')`
- `release_state in ('held_internal', 'excluded')`

Required records:

1. `measures_registry_assessment_first_launch_v1`
2. `measures_registry_lapis_launch_chamber_v1`

## Proposed Table: `internal_initiative_encounter_contract`

Minimum columns:

- `id uuid primary key`
- `initiative_key text not null`
- `parent_key text not null`
- `contract_key text not null unique`
- `title text not null`
- `material text not null`
- `standing text not null`
- `runtime_visibility text not null`
- `public_visibility boolean not null default false`
- `search_visibility boolean not null default false`
- `release_state text not null`
- `contract_json jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by text not null`
- `source_oar2 text not null`

Required constraints:

- `public_visibility = false`
- `search_visibility = false`
- `runtime_visibility in ('excluded', 'internal_only')`
- `release_state in ('held_internal', 'excluded')`
- `standing = 'internal_planning'`

Required contracts:

- `seo_identity_contract_v1`
- `structural_drift_publication_series_v1`
- `assessment_first_social_campaign_v1`
- `ai_operations_assessment_launch_routing_v1`
- `foundational_leadership_conversation_v1`
- `launch_signal_review_v1`

## Proposed Table: `internal_initiative_release_state`

Minimum columns:

- `id uuid primary key`
- `initiative_key text not null`
- `contract_key text null`
- `release_state text not null`
- `access_state text not null`
- `runtime_visible boolean not null default false`
- `public_visible boolean not null default false`
- `search_visible boolean not null default false`
- `marble_state text not null`
- `metadata jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `created_by text not null`
- `source_oar2 text not null`

Required constraints:

- `runtime_visible = false`
- `public_visible = false`
- `search_visible = false`
- `release_state in ('held_internal', 'excluded')`
- `access_state = 'internal_only'`
- `marble_state = 'held'`

## Access Boundary

Required DB-side posture:

- RLS enabled.
- No anon select policy.
- No public REST exposure for internal planning rows.
- Service/authorized internal role read only.
- No public runtime table dependency unless a future OAR explicitly defines an internal admin surface.

## Runtime Boundary

No public runtime change is required.

The existing public registered runtime must continue to exclude:

- `measures_registry_lapis_launch_chamber_v1`
- `seo_identity_contract_v1`
- `structural_drift_publication_series_v1`
- `assessment_first_social_campaign_v1`
- `ai_operations_assessment_launch_routing_v1`
- `foundational_leadership_conversation_v1`
- `launch_signal_review_v1`

## Marble Boundary

The manifest must not create:

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

## Close

Existing public Measures tables are not the right holder for internal launch planning.

Mutation remains held.

Next step is a separate schema/migration OAR for an internal-only initiative table family.
