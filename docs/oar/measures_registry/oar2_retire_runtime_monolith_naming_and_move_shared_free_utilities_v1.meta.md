---
document_type: oar2
authority_level: launch_repair
document_scope: runtime_monolith_retirement
title: OAR2 - Retire Runtime Monolith Naming and Move Shared FREE Utilities
status: closed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Retire Runtime Monolith Naming and Move Shared FREE Utilities

## PURPOSE

Remove active dependency on registered_runtime naming and monolith source location.

FREE is active, but runtime-named shared utilities, styles, and legal renderers still influence public output.

This OAR retires runtime terminology from active FREE source paths.

Nothing is invented.

## OBSERVED

Current state:

- MeasuresRegistryRuntimeRegistered is rollback_only.
- FREE is active route authority.
- registered_runtime folder still contains active shared dependencies:
  - registeredRuntimeUtils.ts
  - registry.encounter.css
  - RegisteredPrivacy.tsx
  - RegisteredTerms.tsx

This creates terminology drift and risks inaccurate public rendering.

## REQUIRED ACTIONS

### 1. Inventory active registered_runtime imports

Search all src imports from:

src/measures_registry/registered_runtime/

Classify each as:

- rollback_only
- active_shared_utility
- active_style
- active_legal_renderer
- dead_code
- unsafe_to_move
- safe_to_move

### 2. Move shared utilities to FREE path

Move:

src/measures_registry/registered_runtime/registeredRuntimeUtils.ts

to:

src/measures_registry/encounter_renderer/shared/encounterRendererUtils.ts

Update all active imports.

Do not change function behavior.

### 3. Move encounter CSS to FREE path

Move:

src/measures_registry/registered_runtime/styles/registry.encounter.css

to:

src/measures_registry/encounter_renderer/styles/registry.encounter.css

Update imports.

Do not redesign styles.

No visual changes intended.

### 4. Move legal renderers to FREE path

Move:

src/measures_registry/registered_runtime/renderers/RegisteredPrivacy.tsx
src/measures_registry/registered_runtime/renderers/RegisteredTerms.tsx

to:

src/measures_registry/encounter_renderer/legal/RegisteredPrivacy.tsx
src/measures_registry/encounter_renderer/legal/RegisteredTerms.tsx

Update imports.

Do not change legal copy.

### 5. Preserve rollback file

Keep:

MeasuresRegistryRuntimeRegistered.tsx

as rollback_only for now.

It must not be imported by active FREE route authority.

Add or confirm clear comment:

ROLLBACK_ONLY — not active route authority.

### 6. Do not perform broad redesign

Do not split index.css in this OAR.

Do not rewrite styles.

Do not alter flow.

This is a path/terminology/source-boundary cleanup only.

## VALIDATION

Return OAR1 evidence showing:

- all active registered_runtime imports inventoried
- shared utilities moved to encounter_renderer/shared
- CSS moved to encounter_renderer/styles
- legal renderers moved to encounter_renderer/legal
- active imports updated
- MeasuresRegistryRuntimeRegistered remains rollback_only
- no active FREE import depends on registered_runtime except rollback references if unavoidable
- build passes
- browser smoke QA passes:
  - intro
  - assessment
  - contact capture
  - passage video
  - report
  - MAP
  - footer/legal links

## NOTCHAZZ FLAGS

Raise NotChazz if:

- active route authority reverts to registered runtime
- legal copy changes
- assessment scoring changes
- report copy changes
- payment behavior changes
- CSS redesign occurs
- index.css is broadly refactored
- runtime naming remains active without classification
- operator is governed instead of the work body

## CLOSE

Retire runtime monolith naming from active FREE source.

FREE becomes the source boundary.

The system aligns.
