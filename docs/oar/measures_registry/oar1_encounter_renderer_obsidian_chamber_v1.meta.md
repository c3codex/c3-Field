---
document_type: oar1
authority_level: working
title: OAR1 — Encounter Renderer Obsidian Chamber
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_encounter_renderer_obsidian_chamber_v1.meta.md
---

# OAR1 — Encounter Renderer Obsidian Chamber

## OBJECTIVE

Obsidian Chamber Renderer created.

Accepts only `RenderableEncounter`. Contains presentation logic only.
Zero authority logic. Zero DB access. Zero release logic. Zero routing logic.

One file created. No migration. No DB changes. No entry point changes. No monolith edits.
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
→ Chamber Router          (Phase 4)
→ Obsidian Chamber Renderer ← THIS OAR
→ Surface
```

---

## FILE CREATED

### NEW: `chambers/ObsidianChamberRenderer.tsx` (~430 LOC)

**Props contract:**
```typescript
export type ObsidianChamberProps = {
  encounter: RenderableEncounter
  registryTokenStyle: CSSProperties
  onNavigate: (surface: EncounterSurface) => void
  onCaptureAssessment?: (payload: AssessmentCapturePayload) => Promise<{ error: string | null }>
  renderHeader: (opts: { title: string }) => ReactNode
  renderSystemFooter: () => ReactNode
}
```

- Accepts only `RenderableEncounter` — no resolver data, no registry rows, no assignment rows, no held state
- `onCaptureAssessment` is optional — shell provides the DB write in Phase 4; omitting disables capture persistence without breaking rendering
- `renderHeader` / `renderSystemFooter` — shell-provided render slots

**Presentation dispatch:**

| Surface | Sub-presentation |
|---|---|
| `eval_passage` | `EvalPassage` — video passage with mute control and continue |
| `structural_coherence_explainer` | `EvalPassage` — same passage layout, different registry content |
| `measures_assessment` | `MeasuresAssessment` → delegates to `PublicAssessmentSurface` |
| `obsidian_to_marble_passage_video` | `ObsidianToMarblePassage` — video passage with transcript and pathway CTA |
| any other obsidian surface | Renderer gap — `data-release-standing="renderer_gap"` |

Dispatch reads `encounter.surface` — seated via DB surface assignment. Not hardcoded authority.

---

## PRESENTATION PRINCIPLES (per OAR2)

**Content from encounter data — not hardcoded:**
- Titles: `encounter.encounterDef?.display_title` or `encounterDef.metadata.title`
- Video: `encounter.mediaByRole.get("explainer_video")`, etc.
- Assessment mechanics: `allAssessmentMechanics(meta?.assessment_mechanics)` from `encounterDef.metadata`
- Report interpretation: `meta?.assessment_interpretation`
- Transcript lines: `meta?.passage_transcript`
- CTA labels: `meta?.cta?.label`

**Transitions from `encounter.transitionNodes` — not hardcoded:**
- `resolveNextSurface(encounter)` reads `transitionNodes[encounter.surface]?.next_surface`
- No surface key is hardcoded in navigation paths
- The shell re-validates the target through `loadEncounterProfile` when navigating — held targets fail closed there

**Media via `resolveRuntimeMediaUrl` — no DB access:**
- `mediaUrl()` local helper wraps `resolveRuntimeMediaUrl` for `EncounterMediaRow`
- Handles both R2 and Supabase storage via bucket-name detection (existing shared utility)
- No Supabase import in this file

---

## ASSESSMENT FLOW (`measures_assessment`)

Local presentation state (transient, not authority):
- `evalStep: EvalStep` — src_capture → diagnostic → contact_capture
- `evalFields`, `evalAnswers`, `evalSectionIndex`, `evalReport`, `evalEmailArtifact`
- `passageMuted: boolean`

Delegated to `PublicAssessmentSurface` (existing shared component at `src/measures_registry/PublicAssessmentSurface.tsx`). The chamber manages state and callbacks; `PublicAssessmentSurface` owns the assessment layout.

Assessment mechanics: `allAssessmentMechanics(meta?.assessment_mechanics)` — read from `encounterDef.metadata`. If mechanics are not seated in the encounter definition, `questionContractStanding.ready = false` is passed to `PublicAssessmentSurface`, which renders a governed held contract state.

Contact capture: `onCaptureAssessment` callback. Chamber collects form data and calls callback with typed payload. Shell performs the DB write. If callback is not provided (Phase 2 validation), the form submits locally and navigates. No `supabase` import in this file.

---

## DIRECTORY STRUCTURE

```
src/measures_registry/encounter_renderer/
  chambers/
    ObsidianChamberRenderer.tsx        ← NEW (~430 LOC)
  composition/
    encounterComposition.ts            unchanged
  resolver/
    registryResolver.ts                unchanged
    releaseGate.ts                     unchanged
    transitionResolver.ts              unchanged
    encounterProfileLoader.ts          unchanged
  types/
    encounterRendererTypes.ts          unchanged
```

---

## RESPONSIBILITY BOUNDARIES (confirmed)

| Concern | Owner | Not in chamber |
|---|---|---|
| Material identity | DB (surface assignment) | ✓ |
| Chamber routing | Shell — Phase 4 | ✓ |
| Release gate | `encounterProfileLoader` | ✓ |
| Registry authority | `registryResolver` + `measures_registry` | ✓ |
| DB reads | `registryResolver` | ✓ |
| DB writes (capture) | Shell via `onCaptureAssessment` callback | ✓ |
| Presentation | `ObsidianChamberRenderer` | — |
| Local UI state | `ObsidianChamberRenderer` | — |
| Transition navigation | `onNavigate` prop (shell) | — |

---

## NOTCHAZZ FLAGS

None raised.

- Renderer accepts only `RenderableEncounter` — no `ComposedEncounter`, no held state, no resolver data
- No Supabase import in this file
- No authority decisions made in this file
- No release checks in this file
- No routing decisions (transitions via `onNavigate` + `transitionNodes`, not hardcoded)
- No hardcoded encounter content (all from `encounterDef.metadata` and `mediaByRole`)
- No hardcoded progression (all from `transitionNodes`)
- Shell integration deferred to Phase 4

---

## VALIDATION

| Constraint | Status |
|---|---|
| `chambers/ObsidianChamberRenderer.tsx` created | PASS |
| Accepts only `RenderableEncounter` | PASS |
| No DB access (`supabase` import absent) | PASS |
| No authority logic (release, routing, material, chamber) | PASS |
| No hardcoded encounter content | PASS |
| No hardcoded progression | PASS |
| Held state cannot reach renderer (by type contract from Phase 4.1) | PASS |
| Renderer gap state for unknown obsidian surfaces | PASS |
| `onCaptureAssessment` optional — Phase 4 wires it | PASS |
| No entry point changed | PASS |
| No monolith edited | PASS |
| No live behavior changes | PASS |
| TypeScript type-check (`tsc --noEmit`) | PASS — 0 errors |
| Vite production build | PASS — 4.29s |

---

## CLOSE

`ObsidianChamberRenderer` exists.
It renders. It does not decide.
Authority ends before it. Routing ends after it.

Commit: `4933852`

Recommended next OAR2: `oar2_encounter_renderer_crystal_chamber_v1`
(or `oar2_encounter_renderer_lapis_chamber_v1` / `oar2_encounter_renderer_marble_chamber_v1` per operator direction)
