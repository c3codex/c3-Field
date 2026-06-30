---
document_type: oar2
authority_level: launch_repair
document_scope: free_transition_repair
title: OAR2 - Repair FREE Route Transitions and Assessment Completion Flow
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Repair FREE Route Transitions and Assessment Completion Flow

## PURPOSE

Repair the FREE cutover transition behavior before public launch.

Current production behavior is not acceptable.

Nothing is invented.
Evidence precedes mutation.

## OBSERVED

After FREE cutover:

- intro loads
- path choice loads
- Crystal/right side shows "encounter not available"
- Assessment/left side opens raw obsidian orientation passage
- Continue opens assessment
- Assessment completion auto-loads `/about-measures-registry`
- Expected results/MAP completion flow does not occur

## REQUIRED REPAIR

### 1. Crystal path

Fix right/Crystal path so it resolves to a valid encounter.

Expected:

path_choice right
  -> crystal_seat_orientation_passage
  -> about_measures_registry

No "encounter not available" state.

### 2. Obsidian path

Fix left/assessment path so obsidian orientation behaves as intended.

Expected:

path_choice left
  -> obsidian_chamber_orientation_passage
  -> measures_assessment

Orientation may render only if approved, branded, and intentional.

Do not expose raw key/title-only surface.

### 3. Assessment completion

Fix assessment completion route.

Expected after assessment submit:

measures_assessment
  -> assessment result / MAP-ready completion flow

Do not auto-route to `/about-measures-registry`.

Preserve capture insert, consent state, notification_state queued, and email dispatch compatibility.

### 4. Transition authority

Read existing DB transition rows and source transition mapping.

Do not infer missing transitions.

If FREE route map is overriding DB transition authority, repair it.

### 5. Validation

Return evidence showing:

- right path no longer shows encounter unavailable
- left path reaches assessment through intentional obsidian orientation or skips correctly
- assessment completion no longer redirects to about
- assessment capture still inserts
- consent remains unchecked by default
- notification_state remains queued
- email dispatch compatibility preserved
- build passes

## NOTCHAZZ FLAGS

Raise NotChazz if:

- raw encounter keys are rendered as public copy
- fallback routing is treated as success
- assessment completion routes to about
- DB capture breaks
- consent behavior changes
- frontend invents transition authority
- registered_runtime becomes active route authority again
- operator is governed instead of the work body

## CLOSE

Repair FREE transition behavior.

No public launch until this passes.
