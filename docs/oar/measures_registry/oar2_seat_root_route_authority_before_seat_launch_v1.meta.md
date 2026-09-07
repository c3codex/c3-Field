---
document_type: oar2
authority_level: working
document_scope: root_route_authority_repair
title: OAR2 — Seat Root Route Authority Before SEAT Launch
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: seat_root_route_authority_before_seat_launch
source_oar1: docs/oar/measures_registry/oar1_root_authority_isolation_failure_audit_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
tags:
  - oar2
  - root-authority
  - seat-launch
  - runtime-isolation
  - registry-resolved-route
  - no-fallback-truth
---

# OAR2 — Seat Root Route Authority Before SEAT Launch v1

## OBSERVED

Root authority audit confirmed:

classification: B_hardcoded_src_authority

`/` is selected by `initialSurface()` in runtime source, not by seated registry authority.

SEAT/runtime isolation cannot be confirmed while renderer owns root encounter selection.

The audit identified:

- root encounter selection owner: `src_initialSurface`
- root registry binding read: false
- root manifest key: none
- root release state read: false
- root transition record read: false
- DB can select root under current renderer: false
- renderer owns root choice: true
- incomplete SEAT/runtime replacement: true

## ALIGNED

Do not redesign.

Do not add new content.

Do not remap the right path.

Do not update About Measures Registry.

Do not change media mappings.

Do not change style profiles.

Correct only the root authority breach so SEAT can launch from Codex-seated state.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Runtime

Frontend may not define root truth.

Runtime may not own root encounter authority.

Root encounter standing must resolve from registry-seated authority.

## ROUTED

Repair root route authority before SEAT launch.

### 1. Define root route binding

Define or verify one explicit root route binding in the registry-resolved route / manifest authority.

Required standing:

`/` must resolve from seated registry state.

The binding must not be inferred from `initialSurface()` or static fallback.

If the root registry authority is missing, report missing record and hold.

### 2. Remove renderer-owned root selection

Remove `initialSurface()` authority over root encounter selection.

The renderer may read selected state only after route authority is resolved.

The renderer may not choose the root encounter from source fallback logic.

### 3. Preserve currently seated SEAT state

Preserve existing SEAT content and runtime sequence as currently seated.

Do not redesign root behavior beyond making root registry-resolved.

Do not introduce new public copy.

Do not introduce new route meaning.

Do not mutate `/undrifted`, right path, left path, About Measures Registry, or Our Story.

### 4. No fallback root truth

Do not create a new local default root surface.

Do not create a hardcoded redirect.

Do not create a client-side root preference.

Fallback is not permission.

If registry root authority fails to resolve, render held / missing authority state and return evidence.

### 5. Validation query / evidence

Return evidence showing:

- actual root route source
- actual root encounter source
- actual root manifest or route binding
- actual release state source where applicable
- whether `/` is DB / registry resolved
- whether `initialSurface()` no longer owns root selection
- whether static fallback route maps still control root

## CODY ROLE

Execute only this authority repair.

Cody may:

- inspect runtime route handling
- inspect registry route binding usage
- update renderer root resolution so `/` resolves from seated registry authority
- add only the minimum route-binding read required for root authority
- return validation evidence

Cody may not:

- redesign pages
- add content
- update media
- update style profiles
- remap right path
- remap left path
- mutate About Measures Registry
- mutate Our Story
- create fallback root truth
- treat successful render as authority proof without evidence
- bypass registry state

## VALIDATION

Successful completion requires:

- `/` no longer selected by hardcoded src fallback
- root encounter source equals registry-resolved authority
- root route binding is explicit and inspectable
- SEAT launch path loads from seated state
- missing registry state renders held / missing authority instead of fallback truth
- OAR1 is written with validation evidence

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_root_route_authority_before_seat_launch_v1.meta.md

## CLOSE

After OAR1 confirms root authority is registry-resolved, launch SEAT and verify landing.
