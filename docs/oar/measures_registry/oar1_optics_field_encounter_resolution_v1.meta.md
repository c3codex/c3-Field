---
document_type: oar1
authority_level: working
title: OAR1 — Optics Field: Encounter Resolution
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_optics_field_encounter_resolution_v1.meta.md
---

# OAR1 — Optics Field: Encounter Resolution

## OBJECTIVE

Encounter Resolution seated as the first Optics Field.

One file created. No migrations. No DB writes. No analytics provider. No dashboard.
No monolith edits. No renderer changes. No release behavior changes.
Zero TypeScript errors. Build passes (7.34s).

---

## AUTHORITY ORDER (confirmed)

```
Codex holds.
↓
Systems align.
↓
Measures determine.
↓
Field arranges.
↓
Encounter Boundary allows.
↓
Renderer manifests.
↓
Optics observe resolution.     ← THIS OAR
↓
Optics prove.
↓
The who remains invariant.
```

---

## OPTICS FIELD BOUNDARY (confirmed)

Optics observe after encounter manifestation.

Optics do not create encounter.
Optics do not determine encounter.
Optics do not arrange encounter.
Optics do not govern encounter.
Optics prove encounter outcome.

Nothing determined above the boundary changes because Optics observed it.

---

## FILE CREATED

### NEW: `optics/encounterResolution.ts`

**Types:**

```typescript
export type EncounterResolutionStatus =
  | "entered"
  | "completed"
  | "abandoned"
  | "transition_selected"
  | "capture_submitted"
  | "capture_failed"
  | "held_encountered"
  | "unavailable_encountered"
  | "return_path_taken"
  | "continuation_path_taken"

export type EncounterCaptureType =
  | "assessment"
  | "subscription"
  | "connect"

export type EncounterResolutionEvent = {
  event_type: EncounterResolutionStatus
  registry_key: string
  surface: EncounterSurface
  environment: EncounterEnvironmentAssignment
  timestamp: string
  transition_target?: string | null
  capture_type?: EncounterCaptureType | null
  metadata?: Record<string, string | number | boolean | null>
}
```

**Helper:**

```typescript
export function createResolutionEvent(
  fields: Omit<EncounterResolutionEvent, "timestamp"> & { timestamp?: string },
): EncounterResolutionEvent
```

Pure. No side effects. No DB write. No analytics call. Auto-timestamps if not provided.

---

## DESIGN DECISIONS

**`surface` and `environment` are typed against existing union types:**

`EncounterSurface` and `EncounterEnvironmentAssignment` are imported from
`../encounter_renderer/types/encounterRendererTypes`. Optics are downstream of the
renderer — this coupling is appropriate and intentional.

**`metadata` is `Record<string, string | number | boolean | null>`:**

Primitives only. No nested objects. No arrays. Structural enforcement of
public-safe payload restriction at the type level.

**No DB surface wired yet:**

The OAR2 permits DB write only if an existing seated optics surface exists.
None was found. `createResolutionEvent` produces an event shape; where events
are persisted is a subsequent OAR.

**`createResolutionEvent` helper:**

Included because the factory enforces the event shape contract at call sites
and provides consistent auto-timestamp behavior. Pure — no side effects.

---

## RESOLUTION STATUS COVERAGE

| Status | When |
|---|---|
| `entered` | Encounter surface first rendered |
| `completed` | Encounter flow reached a terminal state |
| `abandoned` | Encounter exited without completion |
| `transition_selected` | Navigation transition chosen (capture `transition_target`) |
| `capture_submitted` | `onCapture*` callback invoked successfully |
| `capture_failed` | `onCapture*` callback returned `{ error: string }` |
| `held_encountered` | EncounterBoundary surfaced held state |
| `unavailable_encountered` | EncounterEntry or ChamberRouter surfaced unavailable state |
| `return_path_taken` | Participant returned through a backward transition |
| `continuation_path_taken` | Participant continued through a forward transition |

---

## CAPTURE TYPE COVERAGE

| Type | Renderer | Callback |
|---|---|---|
| `assessment` | `ObsidianChamberRenderer` | `onCaptureAssessment` |
| `subscription` | `LapisChamberRenderer` | `onCaptureSubscription` |
| `connect` | `CrystalSeatRenderer` | `onCaptureConnect` |

---

## DIRECTORY STRUCTURE

```
src/measures_registry/
  optics/
    encounterResolution.ts              ← NEW (Optics Field: Encounter Resolution)
  encounter_renderer/                   unchanged
  registered_runtime/                   unchanged
```

---

## NOTCHAZZ FLAGS

None raised.

- Optics do not determine standing
- Optics do not mutate encounter state
- Optics do not replace OAR
- No private gate reason in event shape
- `metadata` restricted to primitives — no raw PII vector
- No dashboard created
- No analytics provider added
- No DB migration created
- No DB write implemented (no seated surface exists)
- No monolith edited
- No renderer modified
- No release behavior changed
- `createResolutionEvent` is pure — no side effects

---

## VALIDATION

| Constraint | Status |
|---|---|
| `optics/encounterResolution.ts` created | PASS |
| `EncounterResolutionStatus` covers all OAR2-specified events | PASS |
| `EncounterResolutionEvent` is public-safe — no PII, no gate reason | PASS |
| `metadata` restricted to primitives only | PASS |
| `createResolutionEvent` is pure — no side effects | PASS |
| No DB write | PASS |
| No analytics provider | PASS |
| No dashboard | PASS |
| No standing determination | PASS |
| No encounter mutation | PASS |
| No renderer modified | PASS |
| No ChamberRouter modified | PASS |
| No monolith edited | PASS |
| No release behavior changed | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 7.34s |

---

## CLOSE

Encounter Resolution exists as an Optics Field.

It observes. It does not determine.

It proves outcome. It does not arrange it.

The who remains invariant.

The system chose what was encountered.

Optics record how it resolved.

Commit: pending

Recommended next OAR2: optics persistence surface — seat the write path for
`EncounterResolutionEvent` (DB table, RLS, insert function, Encounter Boundary
integration for `onResolve` callback).
