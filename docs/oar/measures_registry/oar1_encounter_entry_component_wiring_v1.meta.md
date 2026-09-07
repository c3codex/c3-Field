---
document_type: oar1
authority_level: working
title: OAR1 — Encounter Entry Component Wiring
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_encounter_entry_component_wiring_v1.meta.md
---

# OAR1 — Encounter Entry Component Wiring

## OBJECTIVE

Encounter Entry component created.

One file created. No migrations. No DB changes. No monolith edits.
Zero TypeScript errors. Build passes (5.67s).

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
EncounterEntry                   ← THIS OAR (pipeline begins here)
  resolverData.loading → loading state
  resolverData.error   → unavailable state
  loadEncounterProfile(activeSurface, resolverData)
  → RenderableEncounterResult
↓
EncounterBoundary
  result.renderable: false → unavailable state
  result.renderable: true  → RenderableEncounter
↓
ChamberRouter
↓
Environment Renderer
↓
Who encounters.
↓
Optics proves.
↓
Immutable Lived Memory.
```

---

## FILE CREATED

### NEW: `encounter_renderer/EncounterEntry.tsx`

**Props contract:**

```typescript
export type EncounterEntryProps = EncounterRendererProps & {
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  onCaptureSubscription?: (payload: SubscriptionCapturePayload) => Promise<{ error: string | null }>
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
}
```

Extends `EncounterRendererProps` (already typed in `encounterRendererTypes.ts`):
```typescript
// EncounterRendererProps (from types):
{
  activeSurface: EncounterSurface
  resolverData: RegistryResolverData
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

**Dispatch:**

| Condition | Outcome |
|---|---|
| `resolverData.loading === true` | Public-safe loading state — `data-release-standing="pending"`, `aria-live="polite"` |
| `resolverData.error !== null` | Public-safe unavailable state — no error internals surfaced |
| settled | `loadEncounterProfile(activeSurface, resolverData)` → `<EncounterBoundary result={result} .../>` |

**Pipeline call:**

```typescript
const result = loadEncounterProfile(activeSurface, resolverData)
// result: RenderableEncounterResult
//   | { renderable: true; encounter: RenderableEncounter }
//   | { renderable: false; reason: string }
```

`loadEncounterProfile` is synchronous — resolver data is already fetched. No hooks. No async.

---

## COMPLETE ENCOUNTER RENDERER PIPELINE

```
EncounterEntry                   ← entry point
  ↓ activeSurface + resolverData
  encounterProfileLoader.loadEncounterProfile()
    → surfaceAssignment lookup
    → material/chamber validation
    → registryRow lookup
    → encounterComposition.composeEncounter()
    → releaseGate.checkReleaseGate()
    → RenderableEncounterResult

EncounterBoundary                ← constitutional threshold
  ↓ (held)     → public-safe unavailable state
  ↓ (released) → RenderableEncounter

ChamberRouter                    ← environment dispatch
  obsidian     → ObsidianChamberRenderer
  lapis        → LapisChamberRenderer
  marble       → MarbleChamberRenderer
  crystal_seat → CrystalSeatRenderer
  never        → unavailable state
```

Every component now exists. Pipeline is complete.

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  EncounterEntry.tsx                     ← NEW (entry point)
  boundary/
    EncounterBoundary.tsx                unchanged
  chambers/
    CrystalSeatRenderer.tsx              unchanged
    MarbleChamberRenderer.tsx            unchanged
    LapisChamberRenderer.tsx             unchanged
    ObsidianChamberRenderer.tsx          unchanged
  composition/
    encounterComposition.ts              unchanged
  resolver/
    registryResolver.ts                  unchanged
    releaseGate.ts                       unchanged
    transitionResolver.ts                unchanged
    encounterProfileLoader.ts            unchanged
  router/
    ChamberRouter.tsx                    unchanged
  types/
    encounterRendererTypes.ts            unchanged
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Concern | Owner | Not in entry |
|---|---|---|
| Data fetching | `registryResolver` (caller provides `resolverData`) | ✓ |
| Loading / error state | `EncounterEntry` | — |
| Surface assignment lookup | `encounterProfileLoader` | ✓ |
| DB type validation | `encounterProfileLoader` | ✓ |
| Encounter composition | `encounterComposition` | ✓ |
| Release gate | `releaseGate` via `encounterProfileLoader` | ✓ |
| Held state presentation | `EncounterBoundary` | ✓ |
| Environment dispatch | `ChamberRouter` | ✓ |
| Chamber rendering | Environment renderers | ✓ |
| DB writes (capture) | Callbacks from caller | ✓ |

---

## NOTCHAZZ FLAGS

None raised.

- No environment rendered directly from entry
- `EncounterBoundary` not bypassed
- `ChamberRouter` not bypassed
- No shell abstraction
- No DB access from entry (no `supabase` import)
- No DB mutation
- `resolverData.error` not surfaced publicly — generic unavailable state only
- Gate reasons not surfaced publicly — `loadEncounterProfile` internals stay internal
- No content invented
- No environment inferred outside pipeline
- No monolith edited
- No live cutover

---

## VALIDATION

| Constraint | Status |
|---|---|
| `EncounterEntry.tsx` created at encounter_renderer root | PASS |
| Extends `EncounterRendererProps` — no parallel type definition | PASS |
| `resolverData.loading` → public-safe loading state | PASS |
| `resolverData.error` → public-safe unavailable state (no error exposed) | PASS |
| Settled: calls `loadEncounterProfile` | PASS |
| Result passed to `EncounterBoundary` | PASS |
| All capture callbacks passed through | PASS |
| No direct chamber rendering | PASS |
| `EncounterBoundary` not bypassed | PASS |
| `ChamberRouter` not bypassed | PASS |
| No DB access | PASS |
| No content invented | PASS |
| Internal gate reasons not surfaced | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 5.67s |

---

## CLOSE

`EncounterEntry` exists.

It begins the pipeline.

It does not render encounters directly.

It does not determine standing.

It does not bypass the boundary.

Everything above determines. Everything below presents. The line holds.

The pipeline is complete. From resolver data to rendered surface — every component exists,
every boundary is held, every responsibility is seated in the correct layer.

Encounter renderer is ready for integration.

Commit: pending

Recommended next OAR2: parity validation — confirm encounter renderer surfaces match
monolith behavior before cutover.
