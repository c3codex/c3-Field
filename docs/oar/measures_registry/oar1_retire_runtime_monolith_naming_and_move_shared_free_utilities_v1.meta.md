---
document_type: oar1
authority_level: launch_repair
document_scope: runtime_monolith_retirement
title: OAR1 - Retire Runtime Monolith Naming and Move Shared FREE Utilities
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_retire_runtime_monolith_naming_and_move_shared_free_utilities_v1
---

# OAR1 - Retire Runtime Monolith Naming and Move Shared FREE Utilities

## IMPORT INVENTORY

All imports from `src/measures_registry/registered_runtime/` in active FREE source:

| File | Import | Classification |
|---|---|---|
| `PublicAssessmentResult.tsx` | `registeredRuntimeUtils` → `asString, asStringArray` | active_shared_utility |
| `MeasuresRegistryOrchestrator.tsx` | `styles/registry.encounter.css` | active_style |
| `MeasuresRegistryOrchestrator.tsx` | `registeredRuntimeUtils` → `cssTokenName` | active_shared_utility |
| `MeasuresRegistryOrchestrator.tsx` | `renderers/RegisteredPrivacy` | active_legal_renderer |
| `MeasuresRegistryOrchestrator.tsx` | `renderers/RegisteredTerms` | active_legal_renderer |
| `ObsidianChamberRenderer.tsx` | `registeredRuntimeUtils` → multiple | active_shared_utility |
| `CrystalSeatRenderer.tsx` | `registeredRuntimeUtils` → multiple | active_shared_utility |
| `MarbleChamberRenderer.tsx` | `registeredRuntimeUtils` → multiple | active_shared_utility |
| `LapisChamberRenderer.tsx` | `registeredRuntimeUtils` → multiple | active_shared_utility |
| `MeasuresRegistryRuntimeRegistered.tsx` | all of the above (internal) | rollback_only |

## REPAIRS APPLIED

### 1. Shared utility moved

```
registered_runtime/registeredRuntimeUtils.ts
→ encounter_renderer/shared/encounterRendererUtils.ts
```

Content identical. Internal relative imports adjusted:
- `../measuresAssessmentTypes` → `../../measuresAssessmentTypes`
- `./registeredRuntimeTypes` → `../../registered_runtime/registeredRuntimeTypes`

`registeredRuntimeTypes` remains in `registered_runtime/` — type-only file, not in scope for this OAR.

### 2. CSS entry point moved

```
registered_runtime/styles/registry.encounter.css
→ encounter_renderer/styles/registry.encounter.css
```

`@import` paths updated to `../../registered_runtime/styles/...` (style sub-files remain in `registered_runtime/styles/` — CSS split is out of scope per OAR).

### 3. Legal renderers moved

```
registered_runtime/renderers/RegisteredPrivacy.tsx
→ encounter_renderer/legal/RegisteredPrivacy.tsx

registered_runtime/renderers/RegisteredTerms.tsx
→ encounter_renderer/legal/RegisteredTerms.tsx
```

Legal copy unchanged. No internal relative imports in either file.

### 4. Active import paths updated

| File | Old import | New import |
|---|---|---|
| `MeasuresRegistryOrchestrator.tsx` | `../registered_runtime/styles/registry.encounter.css` | `./styles/registry.encounter.css` |
| `MeasuresRegistryOrchestrator.tsx` | `../registered_runtime/registeredRuntimeUtils` | `./shared/encounterRendererUtils` |
| `MeasuresRegistryOrchestrator.tsx` | `../registered_runtime/renderers/RegisteredPrivacy` | `./legal/RegisteredPrivacy` |
| `MeasuresRegistryOrchestrator.tsx` | `../registered_runtime/renderers/RegisteredTerms` | `./legal/RegisteredTerms` |
| `ObsidianChamberRenderer.tsx` | `../../registered_runtime/registeredRuntimeUtils` | `../shared/encounterRendererUtils` |
| `CrystalSeatRenderer.tsx` | `../../registered_runtime/registeredRuntimeUtils` | `../shared/encounterRendererUtils` |
| `MarbleChamberRenderer.tsx` | `../../registered_runtime/registeredRuntimeUtils` | `../shared/encounterRendererUtils` |
| `LapisChamberRenderer.tsx` | `../../registered_runtime/registeredRuntimeUtils` | `../shared/encounterRendererUtils` |
| `PublicAssessmentResult.tsx` | `./registered_runtime/registeredRuntimeUtils` | `./encounter_renderer/shared/encounterRendererUtils` |

### 5. Rollback file confirmed

`MeasuresRegistryRuntimeRegistered.tsx` — ROLLBACK_ONLY comment already present at line 1:
```
// ROLLBACK_ONLY — not_active_route_authority
```
No active FREE import references it. No change made to this file.

## REMAINING registered_runtime REFERENCES (expected — not violations)

- `encounter_renderer/styles/registry.encounter.css` — `@import` to style sub-files. Sub-files remain in `registered_runtime/styles/`. CSS sub-file split is out of scope.
- `encounter_renderer/shared/encounterRendererUtils.ts` — `import type { LandingSectionRow, MediaRow }` from `registeredRuntimeTypes`. Type-only file, not in scope for this OAR.
- `MeasuresRegistryRuntimeRegistered.tsx` — rollback_only, expected.

No active FREE route authority file directly imports from `registered_runtime`.

## VALIDATION

- Active registered_runtime imports inventoried: ✓ (9 import sites classified)
- Shared utility moved to encounter_renderer/shared: ✓ (`encounterRendererUtils.ts`)
- CSS moved to encounter_renderer/styles: ✓ (`registry.encounter.css`)
- Legal renderers moved to encounter_renderer/legal: ✓ (`RegisteredPrivacy.tsx`, `RegisteredTerms.tsx`)
- Active imports updated: ✓ (9 import sites updated across 6 files)
- MeasuresRegistryRuntimeRegistered remains rollback_only: ✓
- No active FREE import depends on registered_runtime (except transitive type/CSS refs out of scope): ✓
- Build passes: ✓ (vite build — 106 modules, 7.36s)
- Browser smoke QA: pending deploy (Cloudflare Pages triggered on push)

## SECURITY CONSTRAINTS

- No active route authority reverted to registered runtime: ✓
- Legal copy unchanged: ✓ (files copied verbatim — same LEGAL_NAME, EFFECTIVE_DATE, CONTACT_EMAIL, all sections)
- Assessment scoring unchanged: ✓ (no scoring logic touched)
- Report copy unchanged: ✓
- Payment behavior unchanged: ✓
- CSS not redesigned: ✓ (entry point moved, sub-files unchanged)
- index.css not refactored: ✓
- Runtime naming classified, not active: ✓
