---
document_type: oar1
authority_level: working
title: OAR1 — Crystal Seat Environment Renderer Before Encounter Shell
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_crystal_seat_environment_renderer_before_encounter_shell_v1.meta.md
---

# OAR1 — Crystal Seat Environment Renderer Before Encounter Shell

## OBJECTIVE

Crystal Seat Renderer created.

Accepts only `RenderableEncounter`. Contains identity and entry presentation only.
Crystal is not a chamber. No assessment logic. No governance logic. No publication logic.
No DB access. No chamber behavior. No hardcoded c3 content.

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
→ Chamber Router          (dispatches crystal_seat → CrystalSeatRenderer)
→ Crystal Seat Renderer   ← THIS OAR
→ Surface
```

---

## TERMINOLOGY (confirmed)

| Allowed | Not allowed |
|---|---|
| Crystal Seat | Crystal Chamber |
| CrystalSeatRenderer | CrystalChamberRenderer |
| crystal_seat | crystal_chamber |

Crystal Seat establishes identity and entry before chamber encounter conditions.
It is not a chamber.

---

## FILE CREATED

### NEW: `chambers/CrystalSeatRenderer.tsx` (~450 LOC)

**Props contract:**
```typescript
export type ConnectCapturePayload = {
  fields: Record<string, string>
}

export type CrystalSeatProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureConnect?: (payload: ConnectCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

- Accepts only `RenderableEncounter` — no resolver data, no session state, no held state
- `onCaptureConnect` optional — shell provides the connect capture DB write in Phase 4
- Follows same optional-callback pattern as Obsidian/Lapis/Marble chambers

**Presentation dispatch:**

| Surface | Sub-presentation |
|---|---|
| `intro_hook` / `intro` | `IntroHookSeat` — epigraph video + threshold hero from `encounterDef.metadata` + `mediaByRole` |
| `path_choice` | `PathChoiceSeat` — two-choice path from `encounterDef.metadata` + `mediaByRole` |
| `structure_passage` | `StructurePassageSeat` — passage video + continue |
| `about_measures_registry` | `AboutMeasuresRegistry` — orientation + bridge + connect form |
| `measures_structured_environments` | Data-model gap state (surface held in DB; not in encounter model) |
| unknown crystal seat surface | Renderer gap |

---

## PRESENTATION PRINCIPLES (per OAR2)

**Content from encounter data — not hardcoded:**

`IntroHookSeat`:
- Epigraph: `encounterDef.metadata.intro_copy.*`
- Threshold plaques: `encounterDef.metadata.threshold_copy.plaques[]` or `encounterDef.metadata.plaques[]`
- Navigation: `transitionNodes[surface].left/right.next_surface`

`PathChoiceSeat`:
- Plaques: `encounterDef.metadata.plaques[]` or `encounterDef.metadata.hero_paths[]`
- Navigation: `transitionNodes.path_choice.left/right.next_surface`

`StructurePassageSeat`:
- Title: `encounterDef.metadata.title` or `encounterDef.display_title`
- Navigation: `transitionNodes.structure_passage.next_surface`

`AboutMeasuresRegistry`:
- All content: `encounterDef.metadata.approved_content_contract.*`
- Orientation sections, bridge section, connect section — all from metadata
- Connect form fields: `approved_content_contract.connect_section.fields[]` or default fields
- `onCaptureConnect` optional callback for DB write

**Media from `encounter.mediaByRole` — no DB access:**
- `intro_hook_video` — epigraph video
- `left_hero_fracture` / `left_hero_fracture_motion` — left threshold
- `right_measured_hero` / `measured_hero_motion_graphic` — right threshold
- `about_measures_registry_video` — about page video

**Null-safe throughout:**
- `encounterDef` not yet seeded for crystal seat surfaces — all content derives safely to null
- `IntroHookSeat` renders with media only when copy is absent (no invented threshold text)
- `AboutMeasuresRegistry` falls to `held_missing_registry_content` gap when `approved_content_contract` absent
- Sections omit entirely when encounter metadata absent

---

## DATA BOUNDARY NOTE

Encounter def content (`measures_encounter_def`) is not yet seeded for crystal seat registry keys:
- `ai_isnt_broken_intro`
- `evaluate_structure_path`
- `structure_passage`
- `about_measures_registry`

Media IS available (resolver fetches `intro_hook_video`, `left_hero_fracture`, etc.).

Surfaces render with available media where possible. Text content absent → elements omit.
`about_measures_registry` → explicit `held_missing_registry_content` gap (by approved_content_contract check).

The monolith reads crystal content from `LandingSectionRow` (custom data type, separate query path).
The encounter renderer reads from `encounterDef.metadata`. These are separate data channels.
Seating crystal encounter def content is a subsequent OAR.

---

## FILE UPDATED

### UPDATED: `router/ChamberRouter.tsx`

- Added `CrystalSeatRenderer` import + `ConnectCapturePayload` type import
- Added `onCaptureConnect?` to `ChamberRouterProps`
- `"crystal_seat"` now dispatches to `CrystalSeatRenderer`
- Removed dead renderer-gap block from former `crystal_seat` branch
- **All 4 `EncounterEnvironmentAssignment` members now dispatch to implementations**
- `never` exhaustiveness assertion confirmed — `chamberAssignment` narrows to `never` before the dead branch

---

## CHAMBER ROUTER — COMPLETE DISPATCH TABLE

| `chamberAssignment` | Renderer |
|---|---|
| `"obsidian"` | `ObsidianChamberRenderer` |
| `"lapis"` | `LapisChamberRenderer` |
| `"marble"` | `MarbleChamberRenderer` |
| `"crystal_seat"` | `CrystalSeatRenderer` |
| `never` (exhausted) | unavailable state |

No renderer gap states remain in the router. All environments implemented.

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  chambers/
    CrystalSeatRenderer.tsx            ← NEW (~450 LOC)
    MarbleChamberRenderer.tsx          unchanged
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
    ChamberRouter.tsx                  updated — crystal_seat dispatch + onCaptureConnect
  types/
    encounterRendererTypes.ts          unchanged
```

---

## NOTCHAZZ FLAGS

None raised.

- "Crystal Chamber" language is absent throughout
- Renderer accepts only `RenderableEncounter` — no resolver data, no session state
- No DB access (`supabase` import absent)
- No assessment logic
- No governance logic
- No publication (Lapis) logic
- Content from encounter data or omitted — nothing hardcoded, nothing invented
- `onCaptureConnect` optional — mutation lives in shell
- No shell integration
- No monolith edits
- No live cutover

---

## VALIDATION

| Constraint | Status |
|---|---|
| `chambers/CrystalSeatRenderer.tsx` created | PASS |
| `CrystalSeatRenderer` — not `CrystalChamberRenderer` | PASS |
| `crystal_seat` — not `crystal_chamber` in all language | PASS |
| Accepts only `RenderableEncounter` | PASS |
| No DB access (`supabase` import absent) | PASS |
| No assessment logic | PASS |
| No governance logic | PASS |
| No publication / Lapis logic | PASS |
| No hardcoded c3 content | PASS |
| Content from `encounterDef.metadata` + `mediaByRole` only | PASS |
| Honest gap for absent encounter def content | PASS |
| `onCaptureConnect` optional — Phase 4 wires it | PASS |
| `ChamberRouter` dispatches `"crystal_seat"` → `CrystalSeatRenderer` | PASS |
| All 4 environments implemented — no renderer gaps remain in router | PASS |
| `never` exhaustiveness confirmed | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 10.47s |

---

## ENCOUNTER RENDERER — CHAMBER STATUS (COMPLETE)

| Environment | Status |
|---|---|
| `obsidian` | `ObsidianChamberRenderer` — implemented |
| `lapis` | `LapisChamberRenderer` — implemented |
| `marble` | `MarbleChamberRenderer` — implemented |
| `crystal_seat` | `CrystalSeatRenderer` — implemented ← THIS OAR |

All environments implemented. ChamberRouter dispatch table is complete.

---

## CLOSE

`CrystalSeatRenderer` exists.
Crystal Seat is not a chamber.
It establishes identity. It establishes entry. It does not assess, govern, or orient.
Content comes from what Registry has seated. Nothing is invented.

Commit: `718da45`

Recommended next OAR2: `oar2_encounter_renderer_shell_v1` (Phase 4 — shell + entry point).
All chamber environments are now implemented.
