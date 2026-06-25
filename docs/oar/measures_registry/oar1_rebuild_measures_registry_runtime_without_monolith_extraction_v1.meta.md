---
document_type: oar1
authority_level: working
title: OAR1 — Rebuild Measures Registry Runtime Without Monolith Extraction
status: plan_returned
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_rebuild_measures_registry_runtime_without_monolith_extraction_v1.meta.md
---

# OAR1 — Rebuild Measures Registry Runtime Without Monolith Extraction

## SCOPE DETERMINATION

Full rebuild is not bounded in a single OAR execution.

Monolith (`MeasuresRegistryRuntimeRegistered.tsx`): 1164 lines.

Domain complexity requiring revalidation per OAR2 constraints (no extraction, no copy unless revalidated):
- Contact capture form: field validation, RLS-constrained INSERT, error state
- Assessment scoring: 7-question contract, mechanic resolution, env report binding
- Eval carry-forward: DB reconstruction on MAP surface reload
- Marble tone continuity: cross-surface audio persistence
- History management: pushState / popState per surface
- 4 distinct chamber domains with independent copy and transition contracts

This OAR1 returns:
- Registry standing audit
- Binding contract
- File map
- Phased cutover plan (6 OAR2s)
- Blockers

No source changes applied. No monolith patched.

---

## REGISTRY STANDING AUDIT

### `measures_registry` — Surfaces in Scope

| Registry Key | is_active | release_state | New Runtime Gate |
|---|---|---|---|
| `ai_isnt_broken_intro` | true | released | RELEASED |
| `evaluate_structure_path` | true | released | RELEASED |
| `eval_passage` | true | released | RELEASED |
| `measures_assessment` | true | released | RELEASED |
| `obsidian_to_marble_passage_video` | true | released | RELEASED |
| `map_integrity_governance` | true | released | RELEASED |
| `structural_drift_publication` | true | released | RELEASED |
| `about_measures_registry` | **false** | **held** | **HELD** |
| `structure_passage` | **false** | **held** | **HELD** |
| `ai_operations_assessment_landing` | true | released | **DEAD — remove** |

### `measures_encounter_def` — Surfaces in Scope

| Encounter Key | is_active | Used By |
|---|---|---|
| `ai_isnt_broken_intro` | true | Crystal |
| `evaluate_structure_path` | true | Crystal |
| `structure_passage` | true | Crystal |
| `about_measures_registry` | true | Crystal |
| `eval_passage` | true | Obsidian |
| `measures_assessment` | true | Obsidian |
| `obsidian_to_marble_passage_video` | true | Obsidian |
| `map_integrity_governance` | true | Marble |
| `structural_drift_publication` | true | Lapis |
| `ai_operations_assessment_landing` | **absent** | None — dead |

Note: encounter_def is_active = true for `structure_passage` and `about_measures_registry`. The governing authority for rendering is the `measures_registry` record, which is `is_active: false / held`. The new runtime gates on `measures_registry` standing. encounter_def is loaded as content contract, not as render authority.

### NotChazz Flags from Audit

**Flag 1:** `about_measures_registry` — registry held/inactive, runtime currently renders as live.
**Flag 2:** `structure_passage` — registry held/inactive, runtime currently renders as live.
**Flag 3:** `ai_operations_assessment_landing` — dead surface, never navigated to. Registry active/released but unreachable. Should be removed from new runtime.
**Flag 4:** `marble_pathway_reveal` and `iis_eval_gate1` — deprecated aliases, active/released in DB. Not addressed in this OAR — pending Migrations A-D from prior OAR1.

---

## BINDING CONTRACT

The new runtime must satisfy these contracts before any surface may render.

### I. Registry Resolver Contract

The resolver is the only source of authority data. No chamber runtime may query the DB independently.

```typescript
// src/measures_registry/runtime_v2/runtimeTypes.ts

export type RegistryRecord = {
  registry_key: string
  is_active: boolean
  release_state: string
  access_state: string | null
  metadata: Record<string, unknown> | null
}

export type EncounterDef = {
  encounter_key: string
  display_title: string | null
  metadata: Record<string, unknown> | null
  is_active: boolean
}

export type MediaRecord = {
  media_role: string
  storage_bucket: string
  storage_path: string
  mime_type: string | null
  is_active: boolean | null
}

export type DesignToken = {
  token_key: string
  token_value: string
  media_query: string | null
  is_active: boolean | null
}

export type LandingUnit = {
  registry_key: string
  release_state: string | null
  access_state: string | null
  metadata: Record<string, unknown> | null
}

export type ResolverState = {
  loaded: boolean
  registryRecords: Map<string, RegistryRecord>
  encounterDefs: Map<string, EncounterDef>
  mediaRecords: MediaRecord[]
  designTokens: DesignToken[]
  landingUnits: Map<string, LandingUnit>
}
```

### II. Release Gate Contract

Pure function. No side effects. No DB access. Called by shell only.

```typescript
// src/measures_registry/runtime_v2/releaseGate.ts

const RELEASED_STATES = new Set(["released", "active", "published"])

export type GateResult =
  | { released: true }
  | { released: false; reason: "registry_missing" | "inactive" | "held" | "release_state_blocked" }

export function checkReleaseGate(
  registryKey: string,
  resolver: ResolverState
): GateResult {
  if (!resolver.loaded) return { released: false, reason: "registry_missing" }
  const record = resolver.registryRecords.get(registryKey)
  if (!record) return { released: false, reason: "registry_missing" }
  if (!record.is_active) return { released: false, reason: "inactive" }
  if (record.release_state === "held") return { released: false, reason: "held" }
  if (!RELEASED_STATES.has(record.release_state)) return { released: false, reason: "release_state_blocked" }
  return { released: true }
}
```

### III. Transition Resolver Contract

Reads transition node from registry metadata. Validates target release state before returning.

```typescript
// src/measures_registry/runtime_v2/transitionResolver.ts

export function resolveTransition(
  node: Record<string, unknown> | null,
  metadataKey: string,
  gate: (registryKey: string) => GateResult
): string | null {
  const target = node?.[metadataKey]
  if (typeof target !== "string") return null
  const result = gate(target)
  if (!result.released) return null  // do not navigate to held/missing target
  return target
}
```

No hardcoded surface names in any transition call. All `next_surface` values come from registry node metadata, validated through this resolver before navigation is permitted.

### IV. Chamber Runtime Contract

Chamber runtimes receive a sealed props contract from the shell. They may not query the DB, resolve surfaces, or own transition authority.

```typescript
// src/measures_registry/runtime_v2/runtimeTypes.ts (continued)

export type ChamberProps = {
  resolver: ResolverState
  activeSurface: string
  registryTokenStyle: React.CSSProperties
  onNavigate: (surface: string, gateResult: GateResult) => void
  renderHeader: (override?: Record<string, unknown> | null) => React.ReactNode
  renderSystemFooter: () => React.ReactNode | null
}
```

`onNavigate` receives the gate result — the chamber does not decide whether navigation succeeds; the shell does.

### V. Held State Contract

All held states must be public-safe.

Permitted copy:
- "This surface is not currently available."
- "Content is not yet released."
- Neutral, factual unavailability statement

Prohibited in held state:
- SEAT
- c3 Key
- certification
- conversion
- DAO
- chamber names
- internal governance terms
- registry keys

Held state rendered as:
```tsx
<main className="measures-registry-runtime" data-surface={surfaceKey} data-release-standing="held">
  {renderHeader({ title: "Measures Registry" })}
  <section className="registry-held-state" role="status" aria-live="polite">
    <p>This surface is not currently available.</p>
  </section>
  {renderSystemFooter()}
</main>
```

---

## FILE MAP

### New Directory

`src/measures_registry/runtime_v2/`

### Files to Create

| File | Responsibility | Phase | LOC Est. |
|---|---|---|---|
| `runtime_v2/runtimeTypes.ts` | All shared type definitions | 1 | ~80 |
| `runtime_v2/releaseGate.ts` | Pure gate function | 1 | ~40 |
| `runtime_v2/transitionResolver.ts` | Transition validation | 1 | ~60 |
| `runtime_v2/registryResolver.ts` | Data loading hook `useRegistryResolver()` | 1 | ~150 |
| `runtime_v2/chambers/ObsidianChamberRuntime.tsx` | eval_passage + assessment + contact capture + obsidian-to-marble | 2 | ~350 |
| `runtime_v2/chambers/CrystalSeatRuntime.tsx` | intro + path_choice + structure_passage + about | 3 | ~250 |
| `runtime_v2/MeasuresRegistryRuntime.tsx` | Thin shell: resolve → gate → route to chamber | 4 | ~150 |

Total estimated: ~1,080 LOC across 7 files.

### Files Deprecated (not deleted)

| File | Status After Cutover |
|---|---|
| `registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | `deprecated_reference_only` — comment header added |
| `registered_runtime/registeredRuntimeTypes.ts` | superceded by `runtime_v2/runtimeTypes.ts` |

### Files Validated and Wired (not copied, not extracted)

These existing files are not modified. New chambers import them only after per-surface revalidation against registry standing.

| File | Validated For | Used By |
|---|---|---|
| `renderers/RegisteredIntro.tsx` | intro_hook, intro | CrystalSeatRuntime |
| `renderers/RegisteredPathChoice.tsx` | path_choice | CrystalSeatRuntime |
| `renderers/RegisteredPublicUnderstand.tsx` | structure_passage (held gate applied) | CrystalSeatRuntime |
| `renderers/RegisteredAboutMeasuresRegistry.tsx` | about_measures_registry (held gate applied) | CrystalSeatRuntime |
| `renderers/RegisteredPassage.tsx` | eval_passage | ObsidianChamberRuntime |
| `renderers/RegisteredPublicAssessment.tsx` | measures_assessment | ObsidianChamberRuntime |
| `chambers/LapisChamberRuntime.tsx` | structural_drift_dispatches, publication_dispatch | Shell (direct) |
| `chambers/MarbleChamberRuntime.tsx` | map_integrity_governance | Shell (direct) |

### Files Not Used in New Runtime

| File | Reason |
|---|---|
| `renderers/RegisteredAssessmentLanding.tsx` | `ai_operations_assessment_landing` dead surface — removed |
| `renderers/RegisteredGovernedStatus.tsx` | Review during Phase 4 — may supercede or fold into held state |

---

## PHASED CUTOVER PLAN

### Phase 1 — Infrastructure (OAR2: `oar2_runtime_v2_infrastructure_v1`)

**Scope:** `runtimeTypes.ts`, `releaseGate.ts`, `transitionResolver.ts`, `registryResolver.ts`

**Deliverables:**
- All types defined
- Gate implemented as pure function with tests via TypeScript types
- Resolver hook `useRegistryResolver()` loads all required tables in single Promise.all
- Transition resolver validates target before returning

**Registry keys loaded by resolver:**
```
measures_registry: [
  "ai_isnt_broken_intro", "evaluate_structure_path", "eval_passage",
  "measures_assessment", "obsidian_to_marble_passage_video",
  "map_integrity_governance", "structural_drift_publication",
  "about_measures_registry", "structure_passage"
]
measures_encounter_def: REGISTERED_ENCOUNTER_KEYS (all active encounters)
measures_media_map: REGISTERED_MEDIA_ROLES (all campaign media)
measures_design_token: DESIGN_REGISTRY_KEY
measures_registry (landing units): ROUTE_UNIT_KEYS
```

**Entry point:** None changed. No rendering yet.
**Build must pass.**

---

### Phase 2 — Obsidian Chamber (OAR2: `oar2_runtime_v2_obsidian_chamber_v1`)

**Scope:** `ObsidianChamberRuntime.tsx`

**Surfaces:**
- `eval_passage` — gated, released
- `measures_assessment` — gated, released
- `obsidian_to_marble_passage_video` — gated, released

**State owned by Obsidian:**
- evalFields, evalAnswers, evalStep, evalSectionIndex
- evalSubmitting, evalSubmitted, evalError
- evalReport, evalScore, evalCaptureId, evalEmailArtifact
- conditionTraces
- passageMuted

**Receives from shell (via ChamberProps):**
- resolver (media, encounter copy, tokens)
- registryTokenStyle
- onNavigate
- renderHeader, renderSystemFooter

**Does not own:**
- Contact capture INSERT (DML — passes result up via callback)
- Transition targets (resolved via `transitionResolver`)
- Media resolution (via resolver)

**Transitions (all via transitionResolver):**
- eval_passage → next_surface from `evalPassageNode` metadata
- measures_assessment → `obsidian_to_marble_passage_video` (from registry node)
- obsidian_to_marble_passage_video → `map_integrity_governance` (from registry node)

**Build must pass.**

---

### Phase 3 — Crystal Seat Chamber (OAR2: `oar2_runtime_v2_crystal_seat_chamber_v1`)

**Scope:** `CrystalSeatRuntime.tsx`

**Surfaces:**
- `intro` / `intro_hook` — gated, released
- `path_choice` — gated, released
- `structure_passage` — gated, **HELD** (is_active: false) → renders held state
- `about_measures_registry` — gated, **HELD** (is_active: false) → renders held state

**Dead surface removed:**
- `ai_operations_assessment_landing` — not included in Crystal or any chamber

**Held state behavior:**
When gate returns `released: false` for `structure_passage` or `about_measures_registry`:
- Render public-safe held state
- Do not render `RegisteredPublicUnderstand` or `RegisteredAboutMeasuresRegistry`
- Shell is notified via `onNavigate` gate result

**Transitions (all via transitionResolver):**
- intro_hook → next_surface from `introHookNode` metadata
- path_choice left → next_surface from `leftChoiceNode` metadata
- path_choice right → next_surface from `rightChoiceNode` metadata
- structure_passage → next_surface from `structurePassageNode` metadata (if surface ever released)

**Build must pass.**

---

### Phase 4 — Shell (OAR2: `oar2_runtime_v2_shell_v1`)

**Prerequisite:** Phases 1, 2, 3 complete and built.

**Scope:** `MeasuresRegistryRuntime.tsx`

**Responsibilities:**
- Call `useRegistryResolver()` — single data load
- Resolve initial surface from URL via `ROUTE_SURFACE_ALIASES`
- Apply `checkReleaseGate` before routing to chamber
- Route to: ObsidianChamberRuntime | CrystalSeatRuntime | LapisChamberRuntime | MarbleChamberRuntime
- Render loading state while resolver loads
- Render held/missing state for unknown or unresolvable surfaces
- Own: URL history sync, popstate handler, marble tone continuity

**Shell does not own:**
- Surface copy
- Media truth
- Assessment mechanics
- Transition targets
- Chamber state

**Parallel entry point:**
Shell wired in parallel beside monolith. Monolith remains active. Cutover controlled by feature flag in parent mount.

```tsx
// In parent component:
const USE_RUNTIME_V2 = false  // operator flips after parity validation
{USE_RUNTIME_V2
  ? <MeasuresRegistryRuntime />
  : <MeasuresRegistryRuntimeRegistered />}
```

**Build must pass.**

---

### Phase 5 — Parity Validation (OAR2: `oar2_runtime_v2_parity_validation_v1`)

**Prerequisite:** Phase 4 complete.

**Scope:** Validation only. No source changes unless blockers found.

**Assess Flow validation:**
```
/ → intro_hook → path_choice (right) → eval_passage → measures_assessment → contact_capture → obsidian_to_marble_passage_video → map_integrity_governance
```
Each step confirmed:
- Surface renders
- Gate passes
- Transition resolves from registry (not hardcoded)
- Contact capture INSERT succeeds
- evalReport bound in carry-forward

**Understand Flow validation:**
```
/ → intro_hook → path_choice (left) → structure_passage [HELD] → about_measures_registry [HELD]
```
Held surfaces confirmed:
- Held state renders (not live renderer)
- No internal language exposed
- Navigation to held surface does not break flow

**Lapis Flow validation:**
```
/undrifted → structural_drift_dispatches → publication_dispatch
```

**Parity gaps:** Any gap documented in OAR1 with required OAR2.

---

### Phase 6 — Cutover (OAR2: `oar2_runtime_v2_cutover_v1`)

**Prerequisite:** Phase 5 parity validated with no blocking gaps.

**Actions:**
1. Flip `USE_RUNTIME_V2 = true` in parent mount
2. Add `// deprecated_reference_only` header to `MeasuresRegistryRuntimeRegistered.tsx`
3. Remove `USE_RUNTIME_V2` flag — `MeasuresRegistryRuntime` becomes sole entry
4. `dist-registry` rebuild and deploy
5. Monolith remains in repo as reference — not deleted

**Does not delete:**
- `MeasuresRegistryRuntimeRegistered.tsx`
- Existing renderers
- Existing chamber files

---

## SURFACE ASSIGNMENT MAP

| Surface | Chamber | Registry Key | Gate Result |
|---|---|---|---|
| `intro` / `intro_hook` | Crystal | `ai_isnt_broken_intro` | RELEASED |
| `path_choice` | Crystal | `evaluate_structure_path` | RELEASED |
| `structure_passage` | Crystal | `structure_passage` | **HELD** |
| `measures_structured_environments` | Crystal (alias) | `structure_passage` | **HELD** |
| `about_measures_registry` | Crystal | `about_measures_registry` | **HELD** |
| `ai_operations_assessment_landing` | **Removed** | — | DEAD |
| `eval_passage` | Obsidian | `eval_passage` | RELEASED |
| `structural_coherence_explainer` | Obsidian (alias) | `eval_passage` | RELEASED |
| `measures_assessment` | Obsidian | `measures_assessment` | RELEASED |
| `obsidian_to_marble_passage_video` | Obsidian | `obsidian_to_marble_passage_video` | RELEASED |
| `map_integrity_governance` | Marble | `map_integrity_governance` | RELEASED |
| `structural_drift_dispatches` | Lapis | `structural_drift_publication` | RELEASED |
| `publication_dispatch` | Lapis | `structural_drift_publication` | RELEASED |

---

## BLOCKERS

These must be resolved before or during parity validation.

**Blocker 1 — Pending Migrations A-D (from prior OAR1):**
Deprecated aliases `marble_pathway_reveal` and `iis_eval_gate1` remain active in DB.
New runtime will not reference them. They do not block rebuild but must be deactivated before cutover to prevent DB residue from remaining active after old runtime is deprecated.

**Blocker 2 — `structure_passage` and `about_measures_registry` registry records:**
Both are currently held/inactive. New runtime correctly gates them as HELD.
This is correct behavior. If these surfaces are to be released, separate OAR2 and DB migration required before cutover.

**Blocker 3 — Transition node registry standing:**
Transitions for eval_passage, structure_passage, and intro_hook must have `next_surface` values set in their `measures_registry_root.encounter_structure` metadata nodes AND those targets must pass the release gate.
If a `next_surface` target is held, the transition resolver returns null and navigation does not proceed.
Shell must render held-navigation state rather than silently failing.

---

## CLOSE

Full rebuild is not bounded in a single session.
This OAR1 returns binding contract, file map, and 6-phase cutover plan.
No source changes applied.
No monolith patched.
No monolith extracted.

Recommended next OAR2: `oar2_runtime_v2_infrastructure_v1`
Scope: 4 files, ~330 LOC, no entry point change, build-only validation.
Bounded.
