---
document_type: oar1
authority_level: working
title: OAR1 — Marble Chamber Renderer (Governance Encounter Environment)
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_marble_chamber_renderer_governance_encounter_environment_v1.meta.md
---

# OAR1 — Marble Chamber Renderer (Governance Encounter Environment)

## OBJECTIVE

Marble Chamber Renderer created.

Accepts only `RenderableEncounter`. Contains presentation logic only.
Zero authority logic. Zero DB access. Zero assessment logic. Zero payment logic.
Zero certification logic. Zero governance-authority decisions.

Two files changed. No migration. No DB changes. No entry point changes. No monolith edits.
Build passes. Zero TypeScript errors.

---

## AUTHORITY ORDER (confirmed)

```
Codex
→ Registry Standing       (measures_registry)
→ Surface Assignment      (measures_encounter_surface_assignment)
→ Encounter Definition    (measures_encounter_def)
→ Encounter Composition   (composition/encounterComposition.ts)
→ Release Gate            (checkReleaseGate — evaluated after composition)
→ Renderable Encounter    (RenderableEncounter — gate-narrowed)
→ Chamber Router          (dispatches marble → MarbleChamberRenderer)
→ Marble Chamber Renderer ← THIS OAR
→ Surface
```

---

## FILE CREATED

### NEW: `chambers/MarbleChamberRenderer.tsx` (~180 LOC)

**Props contract:**
```typescript
export type MarbleChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

- Accepts only `RenderableEncounter` — no resolver data, no session state, no assessment result, no held state
- No governance-action callbacks in this OAR — payment initiation and MAP circuit selection are shell territory (Phase 4)

**Presentation dispatch:**

| Surface | Sub-presentation |
|---|---|
| `map_integrity_governance` | `MapIntegrityGovernance` — governance framing from `encounterDef.metadata` + `mediaByRole` |
| any other marble surface | Renderer gap — `data-release-standing="renderer_gap"` |

---

## PRESENTATION PRINCIPLES (per OAR2)

**Content from encounter data — not hardcoded:**
- Title: `encounterDef.metadata.governance_header.title` or `encounterDef.display_title`
- Description/principle: `encounterDef.metadata.governance_header.description/principle`
- MAP framing: `encounterDef.metadata.map_framing.title/body`
- Pathway cards: `encounterDef.metadata.pathway_cards[]` — title, boundary, access, deliverables, payment boundary
- Action readiness: `encounterDef.metadata.action_readiness.title/body/cta_label/cta_route`
- Seat hold statement: `encounterDef.metadata.seat_hold.statement`

**Media from `encounter.mediaByRole` — no DB access:**
- `right_measured_hero` / `installation_tone_marble` — marble accent image
- `installation_tone_marble_rise_return_v1` — marble tone

**Null-safe throughout:**
- `encounterDef` not yet seeded for `map_integrity_governance` — all fields resolve safely to null
- Elements omit when content absent — no invented governance fallback

---

## DATA BOUNDARY NOTE

The monolith's `MarbleChamberRuntime` requires:
1. `map_c2_circuit` DB query — active MAP payment options
2. Session-held assessment context (`evalReport`, `conditionTraces`, `organizationName`)
3. Stripe checkout API call
4. Payment return verification API call

None of these are in `RenderableEncounter` or the encounter data model.

`MarbleChamberRenderer` renders governance encounter framing from what the encounter provides.
Assessment context and MAP circuit data are session-held values — the shell will provide these
in Phase 4 via governance callbacks (separate OAR).

The renderer does not invent payment standing, assessment results, or MAP recommendations.

---

## FILE UPDATED

### UPDATED: `router/ChamberRouter.tsx`

- Added `MarbleChamberRenderer` import
- `"marble"` now dispatches to `MarbleChamberRenderer` (previously: renderer gap)
- `"crystal_seat"` remains renderer gap (not yet implemented)
- TypeScript `never` exhaustiveness assertion still holds — all 4 union members handled

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  chambers/
    MarbleChamberRenderer.tsx          ← NEW (~180 LOC)
    LapisChamberRenderer.tsx           unchanged
    ObsidianChamberRenderer.tsx        unchanged
  composition/
    encounterComposition.ts            unchanged
  resolver/
    registryResolver.ts                unchanged
    releaseGate.ts                     unchanged
    transitionResolver.ts              unchanged
    encounterProfileLoader.ts          unchanged
  router/
    ChamberRouter.tsx                  updated — marble dispatch
  types/
    encounterRendererTypes.ts          unchanged
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Concern | Owner | Not in chamber |
|---|---|---|
| Environment assignment | DB (surface assignment) | ✓ |
| Release gate | `encounterProfileLoader` | ✓ |
| Registry authority | `registryResolver` + `measures_registry` | ✓ |
| DB reads | `registryResolver` | ✓ |
| MAP circuit data | DB (`map_c2_circuit`) — not in encounter model | ✓ |
| Assessment context (evalReport, traces) | Session-held via shell — Phase 4 | ✓ |
| Payment initiation | Shell API call — Phase 4 | ✓ |
| Certification/conversion | Registry authority — not a chamber concern | ✓ |
| Governance encounter framing | `MarbleChamberRenderer` | — |
| Pathway card presentation | `MarbleChamberRenderer` | — |
| Navigation controls | `MarbleChamberRenderer` + `onNavigate` | — |

---

## NOTCHAZZ FLAGS

None raised.

- Renderer accepts only `RenderableEncounter` — no session state, no assessment result
- No Supabase import
- No payment logic, no checkout logic, no certification logic
- No assessment logic (no `evalReport`, no `conditionTraces`)
- No hardcoded governance content (all from `encounterDef.metadata`)
- Honest gap for dynamic MAP circuit and assessment context not in encounter model
- No shell integration started
- No monolith edited
- No live cutover

---

## VALIDATION

| Constraint | Status |
|---|---|
| `chambers/MarbleChamberRenderer.tsx` created | PASS |
| Accepts only `RenderableEncounter` | PASS |
| No DB access (`supabase` import absent) | PASS |
| No authority logic | PASS |
| No assessment logic | PASS |
| No payment logic | PASS |
| No certification / conversion logic | PASS |
| No hardcoded governance content | PASS |
| Honest gap for MAP circuit / assessment context | PASS |
| Renderer gap for unknown marble surfaces | PASS |
| `ChamberRouter` dispatches `"marble"` → `MarbleChamberRenderer` | PASS |
| `ChamberRouter` `never` exhaustiveness still holds | PASS |
| Crystal Seat remains renderer gap | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 6.81s |

---

## ENCOUNTER RENDERER — CHAMBER STATUS

| Environment | Status |
|---|---|
| `obsidian` | `ObsidianChamberRenderer` — implemented |
| `lapis` | `LapisChamberRenderer` — implemented |
| `marble` | `MarbleChamberRenderer` — implemented ← THIS OAR |
| `crystal_seat` | renderer gap — not yet implemented |

---

## CLOSE

`MarbleChamberRenderer` exists.
It governs presentation. It does not grant governance.
Assessment context flows from session. MAP circuit flows from DB.
Neither is invented here.

Commit: `56659f2`

Recommended next OAR2:
- `oar2_encounter_renderer_shell_v1` (Phase 4 — shell + entry point)
- Crystal Seat renderer
- Resolver extension for publication dispatch data
- Governance context callback contract (assessment result → marble)
