---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Measures Registry Function-Layer Distinction Pass
status: proposed
version: v1
operator: op044
date: 2026-05-17
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - source-authority
  - measures-registry
  - function-layer
  - release-state
  - conversion-state
  - native-distinction
source_alignment:
  - Seed Concordance
  - Runtime Evidence Manifest
  - Source Reference Seating Qualification Manifest
---

# OAR2 — Measures Registry Function-Layer Distinction Pass

## OBSERVED

The term `measures_registry` is currently at risk of functional overlap between:

- Measures of Inanna encounter / release / phase / render behavior
- Measures Registry institutional evaluation / conversion / process / notification behavior

Runtime and DB evidence confirm that `release_state` is supported in Measures-side tables and views, including:

- measures_registry
- measures_release_state
- v_measures_registry_state
- v_measures_release_surface
- v_measures_encounter_runtime
- v_measures_phase_map_nodes
- v_measures_transition_runtime

This confirms release-state support, but also exposes the need to prevent release/access language from governing institutional conversion outcomes.

## ALIGNED

Native distinction must be preserved.

The Seed Concordance defines Measures as registry: it orders, sequences, conditions, and reveals what Codex holds.

The same registry spine may support multiple function layers, but those function layers may not collapse into one another.

Therefore:

- release_state belongs to encounter / reveal / access standing
- conversion_state belongs to institutional conversion / verification / outcome standing

This pass does not rename existing tables.

This pass clarifies function-layer meaning before future schema or runtime changes.

## ROUTED

### 1. Shared registry spine

`measures_registry` may remain the shared registry spine.

It must not be treated as a single-function surface.

Allowed function-layer distinction:

- encounter_registry
- release_access
- phase_map
- conversion_registry
- intake
- process_runtime
- notification_runtime

### 2. Encounter / Inanna usage

For Measures of Inanna:

- release_state = encounter reveal/access standing
- phase_map = relational encounter positioning
- transition_rule = navigation / return logic
- encounter_def = encounter-side structural behavior

This usage is valid for rendered encounter state.

### 3. Institutional conversion usage

For institutional Measures Registry:

Do not use release_state as the canonical conversion outcome.

Institutional conversion should use separate state language such as:

- intake_state
- evaluation_state
- conversion_state
- verification_state
- seat_lifecycle_state
- notification_state
- closeout_state

### 4. Resolution for registry_release_states_v1

Set review resolution:

- evidence_status: confirmed
- scope_boundary: encounter_release_access
- conversion_scope: excluded
- notes: DB-supported for Measures encounter/reveal/access. Not canonical for institutional conversion outcome.

### 5. Future schema implication

If institutional conversion state requires stronger modeling, define:

- institutional_conversion_state_v1

as a separate source reference or schema pass.

Do not overload release_state.

### 6. Boundary

This pass does not:

- mutate DB
- rename tables
- alter runtime code
- seat authority
- create conversion-state schema
- delete release-state references

## CODY ROLE

Cody may later:

- inspect runtime usage of release_state
- confirm release_state remains encounter/reveal scoped
- flag institutional conversion use of release_state as drift
- propose separate conversion_state handling if needed

Cody may not:

- rename tables from this OAR2
- mutate DB
- rewrite runtime state logic
- treat release_state as conversion_state
- declare authority seating

## VALIDATION

This OAR2 resolves successfully when:

- measures_registry function-layer distinction is explicit
- release_state is bounded to encounter/reveal/access
- institutional conversion state remains distinct
- registry overlap does not collapse native meaning
- no DB mutation occurs

## EXPECTED NEXT OAR

OAR2 — Operator Review Queue Resolution Pass v1

## CLOSE

Shared registry spine is allowed.

Function-layer collapse is not.

Release reveals.

Conversion verifies.
