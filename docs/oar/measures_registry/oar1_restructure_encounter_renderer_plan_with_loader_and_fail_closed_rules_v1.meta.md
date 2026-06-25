---
document_type: oar1
authority_level: working
title: OAR1 — Restructure Encounter Renderer Plan with Loader and Fail-Closed Rules
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restructure_encounter_renderer_plan_with_loader_and_fail_closed_rules_v1.meta.md
supersedes: docs/oar/measures_registry/oar1_restructure_runtime_rebuild_plan_as_encounter_renderer_v1.meta.md
---

# OAR1 — Restructure Encounter Renderer Plan with Loader and Fail-Closed Rules

## OBJECTIVE

Revise prior encounter renderer plan.

Three changes:
1. `encounterProfileResolver` → `encounterProfileLoader`
2. Add explicit fail-closed rule
3. Add explicit chamber renderer constraint

No source changes applied.
No monolith patched.
No extraction.

---

## TERMINOLOGY

| Prior | Correct |
|---|---|
| `encounterProfileResolver` | `encounterProfileLoader` |
| encounter profile resolver | encounter profile loader |

All other terminology from prior OAR1 stands:

| Rejected | Correct |
|---|---|
| `runtime_v2` | `encounter_renderer` |
| runtime shell | encounter renderer shell |
| contract validator | encounter profile loader |
| runtime contract | encounter profile |
| chamber runtime | chamber renderer |

Prohibited in all future OARs for this system:
- `runtime_v2`
- contract profile
- contract validator
- runtime authority
- runtime contract
- encounter profile resolver

---

## AUTHORITY FLOW

```
Codex
→ Registry Standing
→ Release Gate
→ Encounter Profile Loader
→ Chamber Renderer
→ Surface Renderer
```

The encounter profile loader loads seated encounter profiles from registry standing.

It does not resolve, validate into existence, invent, or decide profiles.

Profiles exist in registry standing or they do not.

---

## FAIL-CLOSED RULE

Encounter renderers never fail open.

No fallback truth.
No best-effort public rendering.
No assumed standing.

Every one of the following conditions resolves to governed held state:

| Condition | Result |
|---|---|
| Missing authority | Governed held state |
| Missing registry record | Governed held state |
| Missing release standing | Governed held state |
| Inactive registry record (`is_active: false`) | Governed held state |
| Held release state | Governed held state |
| Missing encounter profile | Governed held state |
| Missing required media | Governed held state |
| Missing transition | Governed held state |
| Unknown chamber assignment | Governed held state |
| Deprecated alias | Governed held state |
| Working residue | Governed held state |

Held state must be public-safe per prior contract.
Held state must not expose internal terms.

---

## CHAMBER RENDERER CONSTRAINT

A chamber renderer renders only encounters already assigned to its chamber.

A chamber renderer never determines chamber assignment.

Chamber assignment is resolved before rendering reaches the chamber — through registry standing and encounter profile loading.

The shell applies release gate and routes to the assigned chamber.
The chamber renders what the profile permits.
The chamber does not inspect or decide its own scope.

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
    encounterProfileLoader.ts
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
| `types/encounterRendererTypes.ts` | `EncounterProfile`, `RegistryResolverData`, `GateResult`, `EncounterRendererProps` | 1 | ~80 |
| `resolver/registryResolver.ts` | `useRegistryResolver()` hook — loads all required tables in single Promise.all; returns raw `RegistryResolverData`; no authority decisions | 1 | ~130 |
| `resolver/releaseGate.ts` | `checkReleaseGate()` — pure function; no DB access; no side effects | 1 | ~40 |
| `resolver/transitionResolver.ts` | `resolveTransition()` — reads transition node metadata; validates target through release gate before returning; returns null if target is held/missing | 1 | ~60 |
| `resolver/encounterProfileLoader.ts` | `loadEncounterProfile()` — assembles encounter profile from raw resolver data; registry record + encounter def + media mappings + transition nodes + material identity + chamber assignment; fails closed if any required field is absent | 1 | ~80 |
| `chambers/ObsidianChamberRenderer.tsx` | Renders: eval_passage, measures_assessment, contact capture, obsidian_to_marble_passage_video | 2 | ~350 |
| `chambers/CrystalSeatRenderer.tsx` | Renders: intro_hook, intro, path_choice; held state for structure_passage and about_measures_registry | 3 | ~250 |
| `chambers/LapisChamberRenderer.tsx` | Renders: structural_drift_dispatches, publication_dispatch | 3 | ~200 |
| `chambers/MarbleChamberRenderer.tsx` | Renders: map_integrity_governance | 3 | ~150 |
| `shell/MeasuresRegistryEncounterRenderer.tsx` | Calls `useRegistryResolver()`, loads encounter profile, applies release gate, routes to chamber renderer | 4 | ~150 |

Total estimated: ~1,490 LOC across 10 files.

---

## ENCOUNTER PROFILE

An encounter profile is the loaded rendering state for a single surface.

The encounter profile loader assembles it from raw registry data.
No chamber renderer may bypass the loaded profile.
The encounter profile loader does not create authority — it assembles what is already seated.

Encounter profile contains:

- registry record (`is_active`, `release_state`, `access_state`, `metadata`)
- gate result (computed by release gate from registry record)
- encounter definition (`encounter_key`, `display_title`, `metadata`)
- media mappings (filtered from resolver media rows by role)
- text/content profile (from encounter_def metadata)
- transition nodes (from registry or root unit encounter_structure metadata)
- material identity (`obsidian` | `crystal` | `lapis` | `marble`)
- chamber assignment (`ObsidianChamberRenderer` | `CrystalSeatRenderer` | `LapisChamberRenderer` | `MarbleChamberRenderer`)

If any required field is absent or fails gate:
profile load fails closed → shell renders governed held state.

---

## SURFACE ASSIGNMENTS

| Surface | Chamber | Registry Key | Gate Result |
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
| `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | `deprecated_reference_only` — no header added until cutover OAR2 explicitly approves |
| `registered_runtime/registeredRuntimeTypes.ts` | superceded by `encounter_renderer/types/encounterRendererTypes.ts` |

## FILES VALIDATED AND WIRED (not copied, not extracted)

| File | Validated For | Used By |
|---|---|---|
| `renderers/RegisteredIntro.tsx` | intro_hook, intro | CrystalSeatRenderer |
| `renderers/RegisteredPathChoice.tsx` | path_choice | CrystalSeatRenderer |
| `renderers/RegisteredPublicUnderstand.tsx` | structure_passage (held — not rendered live) | CrystalSeatRenderer |
| `renderers/RegisteredAboutMeasuresRegistry.tsx` | about_measures_registry (held — not rendered live) | CrystalSeatRenderer |
| `renderers/RegisteredPassage.tsx` | eval_passage | ObsidianChamberRenderer |
| `renderers/RegisteredPublicAssessment.tsx` | measures_assessment | ObsidianChamberRenderer |

## FILES NOT USED IN ENCOUNTER RENDERER

| File | Reason |
|---|---|
| `renderers/RegisteredAssessmentLanding.tsx` | `ai_operations_assessment_landing` dead — removed |
| `renderers/RegisteredGovernedStatus.tsx` | Review in Phase 3; may be superseded by held state |

---

## PHASED IMPLEMENTATION PLAN

### Phase 1 — Infrastructure (OAR2: `oar2_encounter_renderer_infrastructure_v1`)

**Scope:** 5 files in `types/` and `resolver/` only.

**Deliverables:**
- `encounterRendererTypes.ts` — all shared types
- `registryResolver.ts` — `useRegistryResolver()` data loading hook
- `releaseGate.ts` — `checkReleaseGate()` pure function
- `transitionResolver.ts` — `resolveTransition()` pure function
- `encounterProfileLoader.ts` — `loadEncounterProfile()` pure function; fails closed on any missing required field

**Entry point:** None changed.
**No rendering.**
**No monolith edits.**
**Build must pass.**
**Bounded.**

---

### Phase 2 — Obsidian Chamber Renderer (OAR2: `oar2_encounter_renderer_obsidian_chamber_v1`)

**Scope:** `chambers/ObsidianChamberRenderer.tsx`

**Chamber assignment:** Obsidian. Pre-resolved. Chamber does not determine its own assignment.

**Surfaces rendered:**
- `eval_passage` — profile loaded, gate RELEASED
- `measures_assessment` — profile loaded, gate RELEASED
- `obsidian_to_marble_passage_video` — profile loaded, gate RELEASED

**State owned by Obsidian chamber:**
- evalFields, evalAnswers, evalStep, evalSectionIndex
- evalSubmitting, evalSubmitted, evalError
- evalReport, evalScore, evalCaptureId, evalEmailArtifact
- conditionTraces, passageMuted

**Receives via `EncounterRendererProps`:**
- encounter profiles (loaded by shell before routing)
- registryTokenStyle
- `onNavigate` (shell validates gate; chamber does not decide)
- renderHeader, renderSystemFooter

**Does not own:** Transition targets, media resolution, release authority, chamber routing.

**Fails closed:** If encounter profile is missing or gate fails, shell renders governed held state — ObsidianChamberRenderer is never called.

**Build must pass.**

---

### Phase 3 — Crystal, Lapis, and Marble Chamber Renderers (OAR2: `oar2_encounter_renderer_chamber_renderers_v1`)

**Scope:** `CrystalSeatRenderer.tsx`, `LapisChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`

**CrystalSeatRenderer:**
- `intro` / `intro_hook` — profile loaded, RELEASED
- `path_choice` — profile loaded, RELEASED
- `structure_passage` — profile loaded, gate **HELD** → renders governed held state; `RegisteredPublicUnderstand` is not called
- `about_measures_registry` — profile loaded, gate **HELD** → renders governed held state; `RegisteredAboutMeasuresRegistry` is not called

**LapisChamberRenderer:**
- `structural_drift_dispatches`, `publication_dispatch` — profile loaded, RELEASED

**MarbleChamberRenderer:**
- `map_integrity_governance` — profile loaded, RELEASED

All chambers receive pre-loaded profiles.
None query DB independently.
None determine their own chamber assignment.
Dead surface `ai_operations_assessment_landing` not present in any chamber.

**Build must pass.**

---

### Phase 4 — Encounter Renderer Shell (OAR2: `oar2_encounter_renderer_shell_v1`)

**Prerequisite:** Phases 1, 2, 3 complete.

**Scope:** `shell/MeasuresRegistryEncounterRenderer.tsx`

**Responsibilities:**
- Call `useRegistryResolver()` — single data load
- Resolve initial surface from URL
- Call `loadEncounterProfile()` for active surface
- Apply `checkReleaseGate()` — route to chamber only if profile loaded and gate passes
- Route to assigned chamber renderer
- Render loading state while resolver loads
- Render governed held/missing state for unknown or unresolvable surfaces
- Own: URL history sync, popstate handler, marble tone continuity

**Does not own:** Copy, media truth, assessment mechanics, transition targets, chamber state.

**Fails closed:** If release gate fails or encounter profile cannot load → shell renders governed held state, does not route to any chamber.

**Parallel mount beside monolith:**

```tsx
// In parent mount — operator flips after parity validation:
const USE_ENCOUNTER_RENDERER = false
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
Held surfaces render governed held state — not live renderers.

**Lapis Flow:**
```
/undrifted → structural_drift_dispatches → publication_dispatch
```

Fail-closed confirmed at every step: missing profile, held gate, missing transition each produce governed held state — not errors, not blank renders, not partial renders.

All parity gaps documented in OAR1. Each gap requires its own OAR2 before cutover.

---

### Phase 6 — Cutover (OAR2: `oar2_encounter_renderer_cutover_v1`)

**Prerequisite:** Phase 5 parity validated. No blocking gaps.

**Actions:**
1. Flip `USE_ENCOUNTER_RENDERER = true` in parent mount
2. Remove feature flag — `MeasuresRegistryEncounterRenderer` becomes sole entry
3. Add `// deprecated_reference_only` header to `MeasuresRegistryRuntimeRegistered.tsx` (first approval of any monolith edit)
4. Rebuild `dist-registry` and deploy
5. Monolith remains in repo — not deleted

---

## BLOCKERS (unchanged)

**Blocker 1 — Pending Migrations A-D:**
Deprecated aliases `marble_pathway_reveal` and `iis_eval_gate1` remain active in DB.
Encounter renderer does not reference them.
Must be deactivated before cutover — deprecated aliases resolve to governed held state under fail-closed rule.

**Blocker 2 — Held surfaces:**
`structure_passage` and `about_measures_registry` are correctly gated as HELD.
Encounter renderer renders governed held state for both.
Releasing either requires separate OAR2 and DB migration.

**Blocker 3 — Transition node standing:**
All `next_surface` values in encounter_structure metadata must pass release gate.
Any held or missing target returns null from `resolveTransition()` — no navigation proceeds.
Shell renders governed held-navigation state.

---

## NOTCHAZZ FLAGS

**Flag 1:** If any chamber renderer calls the DB directly — NotChazz. Chambers receive loaded profiles only.
**Flag 2:** If any chamber renderer determines its own chamber assignment — NotChazz.
**Flag 3:** If any surface renders live while registry record is inactive or held — NotChazz.
**Flag 4:** If `encounterProfileLoader` is described as authority or validator — NotChazz. It loads. Profiles exist in registry or they do not.
**Flag 5:** If any condition from the fail-closed rule produces a fallback render instead of governed held state — NotChazz.

---

## CLOSE

Three changes from prior OAR1:

1. `encounterProfileResolver.ts` → `encounterProfileLoader.ts` throughout
2. Fail-closed rule added — explicit list of 11 conditions that all resolve to governed held state
3. Chamber renderer constraint added — chamber never determines its own assignment; assignment is pre-resolved by shell before routing

No source changes.
No monolith patched.
No monolith extracted.

Recommended next OAR2: `oar2_encounter_renderer_infrastructure_v1`
Scope: 5 files in `types/` and `resolver/`, ~390 LOC, no entry point change, no rendering.
Bounded.
