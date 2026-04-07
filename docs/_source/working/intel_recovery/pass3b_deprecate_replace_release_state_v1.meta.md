---
document_type: recovery_working
authority_level: working
document_scope: chamber_transition_rule
title: Pass 3B — Deprecate vs Replace Rule + release_state Standing
status: draft
version: v1
operator: op044
date: 2026-04-06
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - recovery
  - pass3b
  - chamber
  - transition
  - release-state
  - registry
---

# Pass 3B — Deprecate vs Replace Rule + release_state Standing

## Purpose

Lock the replacement method and release standing for Chamber of Epithets seating so later SQL patching does not improvise mutation strategy or visibility logic.

## Replacement rule

### Confirmed method
- existing grouped placeholder chamber rows should be deprecated
- explicit 9 named chamber seating rows should be inserted

### Why deprecate instead of mutate in place

Deprecation preserves traceability.

It avoids:

- silent rewriting of earlier abstraction
- loss of historical registry logic
- ambiguity about whether grouped shorthand ever existed
- confusing view behavior during transition

This follows append-first system standing:
continuity is preserved through extension and explicit standing, not quiet overwrite.

## Standing for deprecated grouped rows

Grouped placeholder rows should remain:

- non-authoritative for current chamber truth
- readable as prior abstraction if historical trace is needed
- excluded from current live chamber seating views once explicit rows exist

They should not continue to function as the active chamber structure.

## Standing for explicit rows

The 9 inserted chamber seating rows become:

- authoritative for current Chamber of Epithets seating
- readable from above by:
  - phase family
  - chamber order
  - triad order
  - material
  - release standing
- eligible for current-state / release views as live chamber truth

## release_state standing

release_state must be explicit on the inserted rows.

### Why

Because:

- chamber structure may be seated before public reveal
- visibility cannot be inferred from existence
- explicit rows need standing without forcing immediate exposure
- Measures must control reveal, not the mere fact of insertion

## Proposed release_state logic level

Each explicit chamber seat row must carry a readable release standing such as:

- held
- sealed
- released
- dependent

The exact enum or field format can be decided in SQL pass, but the logic standing is fixed now:

### Rule
Insertion does not equal release.
Existence does not equal visibility.
release_state governs reveal.

## View rule

Later live chamber views should:

- include only explicit named rows as current chamber truth
- respect release_state
- exclude deprecated grouped rows from active live seating reads

If historical trace views are needed later, deprecated rows can remain available there.

## Transition rule

During patching:

1. deprecate grouped placeholder rows
2. insert explicit 9 seat rows
3. bind live views to explicit rows only
4. preserve deprecated rows only for trace / history if needed

No mixed authority.
No half-live overlap.

## Distinctions preserved

- Temple remains separate
- Chamber remains distinct
- explicit chamber rows are the active seating truth
- deprecated grouped rows remain trace only
- release_state governs reveal, not insertion

