---
document_type: oar2
title: OAR2 — Route Plate Visual Correction
version: v1
status: ready_for_cody
system: measures_registry
surface: landing_path_surface
---


# OAR2 — route_plate_visual_correction_v1

## OBSERVED

- Landing currently renders path selection using card-like UI elements.
- Both paths have similar size, weight, and interaction patterns.
- Background split exists but does not enforce directional meaning.
- Desktop reads as equivalent options with no visual hierarchy.
- System signal (failure vs coherence) is not visually expressed.

## ALIGNED

Paths must express:

    failure ≠ coherence

Coherence must feel:
    stable, aligned, inevitable

Failure must feel:
    unstable, drifting, unresolved

Constraints:
- no card paradigm
- no symmetric UI
- no decorative styling
- no frontend invention

## ROUTED

### 1. Remove Card Paradigm

Remove:
- card containers
- boxed layouts
- uniform borders
- equal elevation

Replace with:
- route plates embedded in field

### 2. Layout Structure (Desktop)

full-width split field

left  = failure  
right = coherence  

hard vertical divide at center

paths are embedded in each side, not centered

### 3. Asymmetry

LEFT — failure

- smaller visual footprint
- lower contrast
- darker tone
- slight internal misalignment
- minimal hover response

RIGHT — coherence

- larger or more open footprint
- higher clarity and contrast
- precise alignment
- hover lift + slight scale

### 4. Directional Pull

- subtle forward bias toward right side
- right feels slightly closer
- left feels flat or recessed

no heavy animation required

### 5. Background Behavior

LEFT:
- slow drift
- unstable geometry
- dim red/amber interference

RIGHT:
- slow alignment
- orthogonal geometry
- blue/white/lapis tones

motion ≤ 10% intensity

### 6. Content Placement

- no panels or containers
- text sits directly in field
- max width ~420px
- left-aligned

### 7. Interaction

LEFT:
- minimal hover
- no strong invitation

RIGHT:
- hover lift
- slight forward motion
- increased clarity

### 8. Remove Visual Equivalence

Prevent:
- equal padding
- equal borders
- mirrored layout
- equal elevation

### 9. Mobile (non-blocking)

- may remain stacked
- coherence must remain primary

## CODY ROLE

- refactor landing_path_choice renderer
- remove card components
- implement split-field layout
- apply asymmetry rules
- preserve routing

Cody must NOT:
- add new UI components
- equalize visual weight
- add decorative motion
- reinterpret content

## VALIDATION

Cody must confirm:

1. no card components remain  
2. asymmetry between paths  
3. coherence path has higher authority  
4. background expresses distinction  
5. no text containers  
6. differentiated hover behavior  
7. desktop = split-field layout  
8. routing unchanged  

## CLOSE

visual equivalence removed  
directional inevitability established  
