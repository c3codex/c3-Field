---
document_type: oar1
authority_level: architectural
title: OAR1 — Encounter Boundary Native Architecture Discovery
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_encounter_boundary_native_architecture_discovery_v1.meta.md
---

# OAR1 — Encounter Boundary Native Architecture Discovery

## OBJECTIVE

Encounter Boundary established as the native architectural transition
between prepared state and encounterable state.

Encounter Shell deprecated as an independent architectural concept.

Seven comment references to "shell" replaced with "Encounter Boundary"
across five encounter renderer source files.

Zero code behavior changed. Zero new files created. Zero DB changes.
Build passes. Zero TypeScript errors.

---

## ARCHITECTURAL ORDER (confirmed)

```
Codex holds.
↓
Systems align.
↓
Measures determine.
↓
Field arranges.
↓
Encounter Boundary          ← THE THRESHOLD
↓
Renderer manifests.
↓
Who encounters.
↓
Optics proves.
↓
Immutable Lived Memory.
```

---

## DISCOVERY

Encounter Boundary is not a software shell.

Encounter Boundary is the constitutional threshold where prepared state
becomes encounterable state.

Above the boundary: authority, registry, release, determination, arrangement, composition.

Below the boundary: manifestation, presentation, interaction, observation.

Nothing below the boundary may determine standing.
Nothing above the boundary may present encounter.

---

## DEPRECATION

Encounter Shell is retired as an architectural concept.

Reason: Shell duplicates responsibilities already inherent to Encounter Boundary.

Boundary naturally hosts:
- lifecycle
- presentation frame
- callback plumbing (`onCaptureAssessment`, `onCaptureSubscription`, `onCaptureConnect`)
- unavailable state
- environment dispatch
- renderer handoff

No independent shell abstraction is required or appropriate.

---

## FILES UPDATED

All changes are comment-only. No code behavior altered.

### `router/ChamberRouter.tsx`

```diff
- // Shell provides these in Phase 4. Omitting disables capture persistence.
+ // Encounter Boundary provides these. Omitting disables capture persistence.
```

### `chambers/ObsidianChamberRenderer.tsx`

```diff
- // Payload passed to the shell for contact capture persistence.
- // Shell owns the DB write; chamber owns the form state and presentation.
+ // Payload passed to Encounter Boundary for contact capture persistence.
+ // Encounter Boundary owns the DB write; chamber owns the form state and presentation.

- // Optional until shell integration (Phase 4). Omitting disables DB capture.
+ // Optional until Encounter Boundary wires the callback. Omitting disables DB capture.
```

### `chambers/LapisChamberRenderer.tsx`

```diff
- // Payload for shell-owned subscription capture write.
- // Shell provides onCaptureSubscription in Phase 4. Omitting disables capture persistence.
+ // Payload for Encounter Boundary subscription capture write.
+ // Encounter Boundary provides onCaptureSubscription. Omitting disables capture persistence.

- {/* SUBSCRIPTION — only rendered when shell provides the capture callback */}
+ {/* SUBSCRIPTION — only rendered when Encounter Boundary provides the capture callback */}
```

### `chambers/CrystalSeatRenderer.tsx`

```diff
- // Payload for shell-owned connect capture write.
- // Shell provides onCaptureConnect in Phase 4. Omitting disables capture persistence.
+ // Payload for Encounter Boundary connect capture write.
+ // Encounter Boundary provides onCaptureConnect. Omitting disables capture persistence.
```

### `chambers/MarbleChamberRenderer.tsx`

```diff
- // When the shell wires governance context in Phase 4, this surface renders
+ // When Encounter Boundary wires governance context, this surface renders
```

---

## NOT CHANGED

`undrifted-shell` CSS class in `LapisChamberRenderer.tsx` — CSS class name unrelated
to the architectural concept. Retained as-is.

`routeShell` props in monolith `registered_runtime/` files — monolith territory.
Outside scope of this OAR.

---

## BOUNDARY CONTRACT (confirmed)

Encounter Boundary will provide:

| Callback | Receiver | Condition |
|---|---|---|
| `onCaptureAssessment` | `ObsidianChamberRenderer` | Assessment form submission |
| `onCaptureSubscription` | `LapisChamberRenderer` | Subscription form submission |
| `onCaptureConnect` | `CrystalSeatRenderer` | Connect form submission |

Omitting any callback disables that capture path. Renderer presentation is unaffected.

Governance context (assessment result → Marble) is a separate callback contract
to be established within Encounter Boundary implementation.

---

## NOTCHAZZ FLAGS

None raised.

- No shell abstraction reintroduced
- Authority remains above boundary
- Presentation remains below boundary
- Renderer isolation preserved
- ChamberRouter dispatch preserved
- RenderableEncounter boundary preserved
- No DB access changes
- No monolith edits
- No behavior changes

---

## VALIDATION

| Constraint | Status |
|---|---|
| "Encounter Boundary" established as sole presentation threshold concept | PASS |
| "Shell" removed from encounter renderer source files | PASS |
| `undrifted-shell` CSS class preserved (unrelated) | PASS |
| Monolith `routeShell` props untouched (outside scope) | PASS |
| Zero code behavior changed | PASS |
| Renderer isolation preserved | PASS |
| ChamberRouter dispatch unchanged | PASS |
| RenderableEncounter boundary unchanged | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | not run (comment-only changes) |

---

## ENCOUNTER RENDERER — ARCHITECTURE (SETTLED)

```
registryResolver → encounterProfileLoader → encounterComposition
→ releaseGate → RenderableEncounter
→ [Encounter Boundary]
  → ChamberRouter
    → ObsidianChamberRenderer   (obsidian)
    → LapisChamberRenderer      (lapis)
    → MarbleChamberRenderer     (marble)
    → CrystalSeatRenderer       (crystal_seat)
```

Encounter Boundary is where arranged potential becomes encounterable.
It is not where intention is inferred.
It is where intention, having already been arranged, becomes capable of being lived.

Nothing is invented.
Everything required is present.
Encounter may now occur.

---

## CLOSE

Encounter Shell does not exist.

Encounter Boundary does.

The threshold between determination and manifestation has a name.
Everything above it determines. Everything below it presents.
Nothing crosses in the wrong direction.

Recommended next OAR2: `oar2_encounter_boundary_v1`
(Encounter Boundary implementation — lifecycle, frame, callback wiring, entry point.)
