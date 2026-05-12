---
document_type: oar2
authority_level: working
document_scope: inanna_transition_encounter_resolution
title: OAR2 — Diagnose Inanna Transition and Encounter Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_inanna_governed_media_public_read_policy_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Diagnose Inanna Transition and Encounter Resolution

## OBSERVED

Inanna now loads and the epigraph media behavior has improved.

Resolved standing from prior work:

- governed media public read visibility corrected
- Inanna domain/html binding corrected
- muted epigraph autoplay corrected
- epigraph completion routing corrected toward crystal_temple_home

Current operator report:

- epigraph now loads and autoadvances
- temple does not load
- antechamber loads
- Harrumuk passage does not load
- phase map loads
- clicking center node returns encounter cannot be resolved

The active seam is no longer media storage or public media visibility.

The active seam is encounter routing / transition resolution.

## ALIGNED

Codex remains authority.

Field structures encounter relation.

Measures registers sequence, access, reveal, and transition.

Chazz diagnoses routing.

Cody executes only from this OAR2.

This OAR2 authorizes diagnostic inspection only.

This OAR2 does not authorize:

- DB mutation
- frontend mutation
- resolver rewrite
- transition repair
- media mutation
- fallback deletion

## ROUTED

### 1. Trace expected Inanna path

Cody must trace the live expected path:

    epigraph
    -> crystal_temple_home
    -> temple_antechamber
    -> temple_harrumuk_passage
    -> phase_map
    -> center node target

For each step, report:

- requested key
- resolved registry row yes/no
- registry id
- parent relation
- family/surface type
- encounter key
- encounter_def row yes/no
- renderer
- release/access standing
- transition source/target rule if present
- final render decision

### 2. Identify actual requested failing keys

Cody must capture the exact key requested when runtime displays:

    encounter cannot be resolved

Especially inspect:

- temple route after epigraph autoadvance
- Harrumuk target after antechamber
- phase map center node target

Report exact runtime requested key, not inferred expected key.

### 3. Compare expected keys to live DB keys

Cody must compare runtime requested keys against live DB standing in:

- public.measures_registry
- public.measures_encounter_def
- public.measures_release_state
- public.measures_transition_rule if used by this runtime path

### 4. Distinguish failure class

Classify each failure as one of:

- missing registry row
- wrong registry key requested
- missing encounter_def
- wrong encounter_key
- unsupported surface_type/renderer
- release/access state blocks render
- transition_rule target mismatch
- parent/child relation mismatch
- phase_map node target mismatch
- frontend route construction drift

### 5. Phase map center node

Cody must inspect the center node target specifically.

Report:

- node id or role
- intended target key
- actual clicked target key
- whether target exists
- whether target has encounter_def
- whether renderer can handle target
- exact reason it returns unresolved

### 6. No mutation boundary

No DB changes.

No frontend changes.

No routing changes.

No transition changes.

This OAR produces diagnostic evidence only.

Any fix must be routed through a follow-up OAR2.

## VALIDATION

OAR1 must report:

1. traced expected path
2. exact failing requested keys
3. DB standing for each key
4. encounter_def standing for each target
5. release/access standing
6. transition/phase-map target standing
7. exact failure class per broken step
8. recommended next OAR2
9. mutation count 0

## CODY ROLE

Cody may:

- inspect DB rows
- inspect runtime route construction
- inspect phase map node target logic
- run read-only validation scripts
- produce diagnostic table
- write OAR1 closeout

Cody may not:

- mutate DB rows
- change frontend routing
- repair transition rules
- alter media logic
- create fallback routes
- invent missing encounter targets

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_diagnose_inanna_transition_and_encounter_resolution_v1.meta.md

## CLOSE

Media is resolved enough.

Now trace the route.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
