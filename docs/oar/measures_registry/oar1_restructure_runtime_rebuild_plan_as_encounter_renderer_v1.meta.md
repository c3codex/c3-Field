---
document_type: oar1
authority_level: working
title: OAR1 — Restructure Rebuild Plan as Encounter Renderer
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restructure_runtime_rebuild_plan_as_encounter_renderer_v1.meta.md
supersedes: docs/oar/measures_registry/oar1_rebuild_measures_registry_runtime_without_monolith_extraction_v1.meta.md
---

# OAR1 — Restructure Rebuild Plan as Encounter Renderer

## OBJECTIVE

Revise the prior rebuild plan.

Replace `runtime_v2` framing with encounter renderer framing.
Replace contract/profile language with encounter profile language.
Update file map to operator-specified directory structure.
Update authority flow.
Update phased OAR2 sequence.

No source changes applied.

---

## TERMINOLOGY CORRECTION

| Prior (rejected) | Correct |
|---|---|
| `runtime_v2` | `encounter_renderer` |
| runtime shell | encounter renderer shell |
| contract validator | encounter profile resolver |
| runtime contract | encounter profile |
| chamber runtime | chamber renderer |
| `ChamberProps` | `EncounterRendererProps` |
| `runtimeTypes.ts` | `encounterRendererTypes.ts` |

Prohibited language in all future OARs for this system:
- `runtime_v2`
- contract profile
- runtime authority layer
- chamber runtime

---

## AUTHORITY FLOW

```
Codex
→ Registry Standing
→ Release Gate
→ Encounter Profile
→ Chamber Renderer
→ Surface Renderer
```

The encounter renderer does not execute authority.
It resolves seated encounter profiles from registry standing and renders them.

---

## FILE MAP

### Target Directory

`src/measures_registry/encounter_renderer/`

### Required Structure

```
encounter_renderer/
  shell/
    MeasuresRegistryEncounterRenderer.tsx
  resolver/
    registryResolver.ts
    releaseGate.ts
    transitionResolver.ts
    encounterProfileResolver.ts
  chambers/
    ObsidianChamberRenderer.tsx
    CrystalSeatRenderer.tsx
    LapisChamberRenderer.tsx
    MarbleChamberRenderer.tsx
  types/
    encounterRendererTypes.ts
```

### File Responsibilities

| File | Responsibility | Phase | LOC Est. |
|---|---|---|---|
| `types/encounterRendererTypes.ts` | All shared type definitions including `EncounterProfile`, `RegistryResolverData`, `GateResult`, `EncounterRendererProps` | 1 | ~80 |
| `resolver/registryResolver.ts` | Data loading hook `useRegistryResolver()` — loads all required tables in single Promise.all; returns raw `RegistryResolverData` | 1 | ~130 |
| `resolver/releaseGate.ts` | Pure function `checkReleaseGate()` — no DB access, no side effects | 1 | ~40 |
| `resolver/transitionResolver.ts` | Pure function `resolveTransition()` — reads transition node from encounter profile metadata, validates target through release gate before returning | 1 | ~60 |
| `resolver/encounterProfileResolver.ts` | Pure function `resolveEncounterProfile()` — assembles full encounter profile from raw resolver data: registry record + encounter def + media mappings + transition nodes + material identity + chamber assignment | 1 | ~80 |
| `chambers/ObsidianChamberRenderer.tsx` | Renders: eval_passage, measures_assessment, contact capture, obsidian_to_marble_passage_video | 2 | ~350 |
| `chambers/CrystalSeatRenderer.tsx` | Renders: intro_hook, intro, path_choice, structure_passage (held), about_measures_registry (held) | 3 | ~250 |
| `chambers/LapisChamberRenderer.tsx` | Renders: structural_drift_dispatches, publication_dispatch | 3 | ~200 |
| `chambers/MarbleChamberRenderer.tsx` | Renders: map_integrity_governance | 3 | ~150 |
| `shell/MeasuresRegistryEncounterRenderer.tsx` | Encounter renderer shell: calls `useRegistryResolver()`, resolves initial surface from URL, applies release gate, routes to chamber renderer | 4 | ~150 |

Total estimated: ~1,490 LOC across 10 files.

---

## ENCOUNTER PROFILE

An encounter profile is the resolved rendering contract for a single surface.

The encounter profile resolver assembles it from raw registry data. No chamber renderer may bypass the profile.

Encounter profile resolves:
- registry record (`is_active`, `release_state`, `access_state`, `metadata`)
- release state (computed by release gate from registry record)
- encounter definition (`encounter_key`, `display_title`, `metadata`)
- media mappings (filtered from resolver media rows by role)
- text/content profile (from encounter_def metadata — display copy, section copy, footer contract)
- transition nodes (from registry or root unit encounter_structure metadata)
- material identity (`obsidian` | `crystal` | `lapis` | `marble`)
- chamber assignment (`ObsidianChamberRenderer` | `CrystalSeatRenderer` | `LapisChamberRenderer` | `MarbleChamberRenderer`)

If the encounter profile cannot resolve (registry missing, inactive, held, release state blocked):

render governed held state.

---

## SURFACE ASSIGNMENTS

| Surface | Chamber Renderer | Registry Key | Release Gate |
|---|---|---|---|
| `intro` / `intro_hook` | Crystal | `ai_isnt_broken_intro` | RELEASED |
| `path_choice` | Crystal | `evaluate_structure_path` | RELEASED |
| `structure_passage` / `measures_structured_environments` | Crystal | `structure_passage` | **HELD** |
| `about_measures_registry` | Crystal | `about_measures_registry` | **HELD** |
| `ai_operations_assessment_landing` | **Removed** | — | DEAD |
| `eval_passage` / `structural_coherence_explainer` | Obsidian | `eval_passage` | RELEASED |
| `measures_assessment` | Obsidian | `measures_assessment` | RELEASED |
| `obsidian_to_marble_passage_video` | Obsidian | `obsidian_to_marble_passage_video` | RELEASED |
| `map_integrity_governance` | Marble | `map_integrity_governance` | RELEASED |
| `structural_drift_dispatches` / `publication_dispatch` | Lapis | `structural_drift_publication` | RELEASED |

---

## FILES DEPRECATED AFTER CUTOVER (not deleted)

| File | Status |
|---|---|
| `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | `deprecated_reference_only` |
| `registered_runtime/registeredRuntimeTypes.ts` | superceded by `encounter_renderer/types/encounterRendererTypes.ts` |

## FILES VALIDATED AND WIRED (not copied, not extracted)

Existing renderers are not modified. New chamber renderers import them only after per-surface revalidation against registry standing.

| File | Validated For | Used By |
|---|---|---|
| `renderers/RegisteredIntro.tsx` | intro_hook, intro | CrystalSeatRenderer |
| `renderers/RegisteredPathChoice.tsx` | path_choice | CrystalSeatRenderer |
| `renderers/RegisteredPublicUnderstand.tsx` | structure_passage (held gate applied) | CrystalSeatRenderer |
| `renderers/RegisteredAboutMeasuresRegistry.tsx` | about_measures_registry (held gate applied) | CrystalSeatRenderer |
| `renderers/RegisteredPassage.tsx` | eval_passage | ObsidianChamberRenderer |
| `renderers/RegisteredPublicAssessment.tsx` | measures_assessment | ObsidianChamberRenderer |

## FILES NOT USED IN ENCOUNTER RENDERER

| File | Reason |
|---|---|
| `renderers/RegisteredAssessmentLanding.tsx` | `ai_operations_assessment_landing` dead — removed |
| `renderers/RegisteredGovernedStatus.tsx` | Review during Phase 3; may be superseded by held state |

---

## PHASED IMPLEMENTATION PLAN

### Phase 1 — Resolver Infrastructure (OAR2: `oar2_encounter_renderer_infrastructure_v1`)

**Scope:** `encounterRendererTypes.ts`, `registryResolver.ts`, `releaseGate.ts`, `transitionResolver.ts`, `encounterProfileResolver.ts`

**Deliverables:**
- `EncounterProfile` type defined
- `RegistryResolverData` type defined
- `GateResult` type defined
- `EncounterRendererProps` type defined
- `useRegistryResolver()` hook: loads registry records, encounter defs, media, design tokens, landing units in single Promise.all
- `checkReleaseGate()`: pure function — registry missing / inactive / held / release_state_blocked
- `resolveTransition()`: validates target release gate before returning next surface key
- `resolveEncounterProfile()`: assembles full profile from raw resolver data

**Entry point:** None changed. No rendering yet.
**Build must pass.**
**Bounded.**

---

### Phase 2 — Obsidian Chamber Renderer (OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`)

**Scope:** `chambers/ObsidianChamberRenderer.tsx`

**Surfaces rendered:**
- `eval_passage` — encounter profile resolved, released
- `measures_assessment` — encounter profile resolved, released
- `obsidian_to_marble_passage_video` — encounter profile resolved, released

**State owned by Obsidian:**
- evalFields, evalAnswers, evalStep, evalSectionIndex
- evalSubmitting, evalSubmitted, evalError
- evalReport, evalScore, evalCaptureId, evalEmailArtifact
- conditionTraces
- passageMuted

**Receives from shell via `EncounterRendererProps`:**
- resolverData (media, encounter profile, design tokens)
- registryTokenStyle
- onNavigate (shell decides whether gate passes)
- renderHeader, renderSystemFooter

**Does not own:**
- Transition targets (resolved via `transitionResolver`)
- Media resolution (via encounter profile)
- Authority over next surface

**Build must pass.**

---

### Phase 3 — Crystal Seat, Lapis, and Marble Chamber Renderers (OAR2: `oar2_encounter_renderer_chamber_renderers_v1`)

**Scope:** `CrystalSeatRenderer.tsx`, `LapisChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`

**CrystalSeatRenderer surfaces:**
- `intro` / `intro_hook` — released
- `path_choice` — released
- `structure_passage` — **HELD** — renders governed held state only
- `about_measures_registry` — **HELD** — renders governed held state only

**LapisChamberRenderer surfaces:**
- `structural_drift_dispatches` — released
- `publication_dispatch` — released

**MarbleChamberRenderer surfaces:**
- `map_integrity_governance` — released

All chamber renderers receive encounter profiles from shell.
None query DB independently.
Dead surface `ai_operations_assessment_landing` not included in any chamber.

**Held state for Crystal:**
When encounter profile resolves as `released: false` for `structure_passage` or `about_measures_registry` — render public-safe held state. No `RegisteredPublicUnderstand` or `RegisteredAboutMeasuresRegistry` rendered.

**Build must pass.**

---

### Phase 4 — Encounter Renderer Shell (OAR2: `oar2_encounter_renderer_shell_v1`)

**Prerequisite:** Phases 1, 2, 3 complete.

**Scope:** `shell/MeasuresRegistryEncounterRenderer.tsx`

**Responsibilities:**
- Call `useRegistryResolver()` — single data load
- Resolve initial surface from URL
- Call `resolveEncounterProfile()` for active surface
- Apply `checkReleaseGate()` — route to chamber renderer only if released
- Route to: ObsidianChamberRenderer | CrystalSeatRenderer | LapisChamberRenderer | MarbleChamberRenderer
- Render loading state while resolver loads
- Render governed held/missing state for unknown or unresolvable surfaces
- Own: URL history sync, popstate handler, marble tone continuity

**Does not own:**
- Surface copy
- Media truth
- Assessment mechanics
- Transition targets
- Chamber state

**Parallel mount beside monolith:**

```tsx
// In parent mount:
const USE_ENCOUNTER_RENDERER = false  // operator flips after parity validation
{USE_ENCOUNTER_RENDERER
  ? <MeasuresRegistryEncounterRenderer />
  : <MeasuresRegistryRuntimeRegistered />}
```

**Build must pass.**

---

### Phase 5 — Parity Validation (OAR2: `oar2_encounter_renderer_parity_validation_v1`)

**Prerequisite:** Phase 4 complete.

**Scope:** Validation only. No source changes unless blockers found.

**Assess Flow:**
```
/ → intro_hook → path_choice → eval_passage → measures_assessment
  → contact_capture → obsidian_to_marble_passage_video → map_integrity_governance
```

**Understand Flow:**
```
/ → intro_hook → path_choice → structure_passage [HELD] → about_measures_registry [HELD]
```
Held surfaces must render governed held state — not live renderers.

**Lapis Flow:**
```
/undrifted → structural_drift_dispatches → publication_dispatch
```

All transitions confirmed via `resolveTransition()` — no hardcoded surface keys in any chamber.
All parity gaps documented in OAR1 with required follow-up OAR2.

---

### Phase 6 — Cutover (OAR2: `oar2_encounter_renderer_cutover_v1`)

**Prerequisite:** Phase 5 parity validated, no blocking gaps.

**Actions:**
1. Flip `USE_ENCOUNTER_RENDERER = true` in parent mount
2. Remove feature flag — `MeasuresRegistryEncounterRenderer` becomes sole entry
3. Add `// deprecated_reference_only` header to `MeasuresRegistryRuntimeRegistered.tsx`
4. Rebuild `dist-registry` and deploy
5. Monolith remains in repo — not deleted

---

## BLOCKERS (unchanged from prior OAR1)

**Blocker 1 — Pending Migrations A-D:**
Deprecated aliases `marble_pathway_reveal` and `iis_eval_gate1` remain active in DB.
Encounter renderer will not reference them.
Must be deactivated before cutover.

**Blocker 2 — Held surfaces:**
`structure_passage` and `about_measures_registry` are correctly gated as HELD by encounter renderer.
If they are to be released before cutover, separate OAR2 and DB migration required.

**Blocker 3 — Transition node standing:**
All `next_surface` values in encounter_structure metadata must be confirmed in registry and pass release gate.
Any held target blocks navigation — shell renders held-navigation state.

---

## CLOSE

Prior plan (`oar1_rebuild_measures_registry_runtime_without_monolith_extraction_v1`) superseded by this document.

Revised:
- Terminology corrected throughout
- File map updated to operator-specified directory structure
- `encounterProfileResolver.ts` made explicit as separate resolver file
- 4 chamber renderer files specified (including Lapis and Marble as new files in encounter_renderer)
- All `runtime_v2` and contract-profile language removed
- Authority flow corrected: Registry Standing → Release Gate → Encounter Profile → Chamber Renderer → Surface Renderer
- Phased OAR2 names corrected

No source changes.
No monolith patched.
No monolith extracted.

Recommended next OAR2: `oar2_encounter_renderer_infrastructure_v1`
Scope: 5 files, ~390 LOC, resolver directory only, no entry point change.
Bounded.
