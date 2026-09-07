---
document_type: architecture
authority_level: working
title: FREE — Frontend Replacement Encounter Environment
version: v1
operator: op044
system: measures_registry
status: seated
---

# FREE — Frontend Replacement Encounter Environment

## DEFINITION

FREE means: **Frontend Replacement Encounter Environment**

FREE replaces the former frontend runtime that acted as an inferred authority layer.

The former runtime authored intention. It inferred meaning. It made determination.
That model is deprecated.

FREE defines the frontend architecture that:
- receives registry-resolved state from DB
- passes resolved state through the Encounter Boundary
- manifests only what has already become encounterable

Frontend does not run intention. Frontend resolves encounter environment.

---

## NATIVE ORDER

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
Optics prove.
↓
The who is invariant.
```

The system does not choose who encounters.
The system chooses what is encountered.

---

## FOUNDATIONAL RULES

| Rule | Statement |
|---|---|
| Runtime retired | Frontend is not a runtime authority layer |
| Frontend does not author truth | Standing is seated in DB; frontend reads it |
| Frontend does not infer intention | No route-based inference, no material inference |
| Frontend does not determine standing | Only DB-seated registry rows carry standing |
| Frontend does not arrange Field | Field arrangement is registry and system work |
| Frontend manifests encounterable state only | Held state stays held; unavailable state is public-safe |
| Missing state remains missing | Nothing is invented to fill a gap |
| Renderers receive only released encounter state | `RenderableEncounter.gateResult.status === "released"` is enforced by type |
| Encounter Boundary is the only threshold | No component below the boundary may determine standing |
| Optics observe after manifestation | Optics do not create, determine, arrange, or govern |

---

## COMPONENT DEFINITIONS

---

### 1. registryResolver

**Native function:** Fetches all raw state from DB for the current measures_registry session.

**Technical function:** React hook / async fetch — queries `measures_registry`, `measures_encounter_def`, `measures_encounter_media`, `measures_encounter_surface_assignment`, `measures_encounter_design_tokens`. Returns `RegistryResolverData` with `loading` and `error` signals.

**Input:** Current session context (auth, route surface).

**Output:** `RegistryResolverData` — raw DB rows, no authority decisions.

**May:**
- Query DB tables it is authorized to read
- Return loading state while fetch is in progress
- Return error state on fetch failure
- Surface raw rows as-is

**May not:**
- Make authority decisions
- Filter rows by release state
- Infer encounter intent
- Write to DB

**Replaces runtime behavior:** Former runtime queried disparate data sources and inferred arrangement from query results. `registryResolver` delivers raw seated state only — arrangement belongs to composition.

**NotChazz flags:**
- Authority decision inside resolver
- Release state filtering inside resolver
- Route-based content inference

---

### 2. encounterProfileLoader

**Native function:** Finds and validates the surface assignment for a given encounter surface, then orchestrates encounter assembly.

**Technical function:** `loadEncounterProfile(surface, resolverData) → RenderableEncounterResult`. Validates `material_identity` and `chamber_assignment` from DB against compile-time union type guards. Delegates assembly to `encounterComposition`. Applies `releaseGate`. Returns `{ renderable: true, encounter }` or `{ renderable: false, reason }`.

**Input:** `EncounterSurface`, `RegistryResolverData`.

**Output:** `RenderableEncounterResult`.

**May:**
- Look up surface assignment row
- Validate DB-carried type values against type guard sets
- Call `composeEncounter`
- Call `checkReleaseGate`
- Return fail-closed result for any missing or invalid state

**May not:**
- Query DB directly
- Infer environment from route or material
- Make release decisions outside `checkReleaseGate`
- Surface private gate reason to presentation layer

**Replaces runtime behavior:** Former runtime inferred surface context from route state and component hierarchy. `encounterProfileLoader` reads surface assignment from explicit DB-seated rows only.

**NotChazz flags:**
- Direct DB query
- Environment inference from route
- Gate reason surfaced to presentation

---

### 3. encounterComposition

**Native function:** Assembles composed encounter state from validated, seated data.

**Technical function:** `composeEncounter(...) → ComposedEncounter`. Pure function — no authority decisions, no release checks, no routing. Builds `mediaByRole` map, extracts `transitionNodes` from `measures_registry_root.metadata.encounter_structure`, resolves `encounterDef` by registry key.

**Input:** Validated surface, assignment row, registry row, material identity, chamber assignment, `RegistryResolverData`.

**Output:** `ComposedEncounter`.

**May:**
- Build `mediaByRole` from active media rows
- Extract transition nodes from root registry metadata
- Resolve encounter def by `assignment.registry_key`
- Return null for absent optional fields

**May not:**
- Make authority decisions
- Apply release gate
- Filter media by intent
- Invent missing encounter def content

**Replaces runtime behavior:** Former runtime assembled display state through component-level data access and contextual inference. Composition is now explicit, pure, and fully traceable.

**NotChazz flags:**
- Authority decision inside composition
- Release check inside composition
- Invented content for absent fields

---

### 4. releaseGate

**Native function:** Evaluates whether a registry entry has been released for encounter.

**Technical function:** `checkReleaseGate(registryRow) → GateResult`. Checks `is_active` and `release_state === "released"`. Returns `{ status: "released" }` or `{ status: "held", reason }`. Fail-closed — any non-released state is held.

**Input:** `RegistryRow`.

**Output:** `GateResult` — `{ status: "released" }` or `{ status: "held", reason: string }`.

**May:**
- Check `is_active` flag
- Check `release_state` value
- Return held result with internal reason string

**May not:**
- Surface held reason to presentation layer
- Infer release from any source other than the registry row
- Grant release for any state other than `release_state === "released"`
- Be bypassed

**Replaces runtime behavior:** Former runtime rendered surfaces regardless of release state, relying on feature flags and component conditions. Release gate is now a hard, fail-closed gate that prevents any unreleased state from reaching a renderer.

**NotChazz flags:**
- Gate bypassed
- Release inferred from route or component context
- Held reason surfaced in presentation

---

### 5. EncounterEntry

**Native function:** The entry point of the encounter renderer pipeline. Begins determination from settled resolver data.

**Technical function:** React component. Handles `resolverData.loading` and `resolverData.error` as public-safe states. Calls `loadEncounterProfile(activeSurface, resolverData)`. Passes `RenderableEncounterResult` to `EncounterBoundary` with all optional callbacks.

**Input:** `EncounterEntryProps` — `EncounterRendererProps` + optional capture callbacks.

**Output:** `EncounterBoundary` call (or public-safe loading/error state).

**May:**
- Handle loading state with public-safe presentation
- Handle resolver error with public-safe unavailable state
- Call `loadEncounterProfile`
- Pass result to `EncounterBoundary`
- Pass callbacks through

**May not:**
- Render encounter surfaces directly
- Bypass `EncounterBoundary`
- Bypass `ChamberRouter`
- Expose resolver error internals
- Infer environment
- Invent encounter state

**Replaces runtime behavior:** Former runtime routed directly to surface-specific components based on route state. `EncounterEntry` routes only through the settled pipeline — no route inference, no component-level authority.

**NotChazz flags:**
- Direct surface rendering without EncounterBoundary
- EncounterBoundary bypassed
- Resolver error surfaced publicly
- Environment inferred from route

---

### 6. EncounterBoundary

**Native function:** The constitutional threshold where prepared state becomes encounterable state.

**Technical function:** React component. Receives `RenderableEncounterResult`. If `renderable: false` → public-safe unavailable state (no reason surfaced). If `renderable: true` → passes `result.encounter` to `ChamberRouter` with all callbacks.

**Input:** `RenderableEncounterResult` + optional capture callbacks + presentation utilities.

**Output:** Public-safe unavailable state (held), or `ChamberRouter` call (released).

**May:**
- Surface public-safe held state when encounter is not renderable
- Pass released `RenderableEncounter` to `ChamberRouter`
- Wire capture callbacks through to `ChamberRouter`

**May not:**
- Query DB
- Call `registryResolver`, `encounterComposition`, or `releaseGate`
- Infer environment
- Mutate encounter
- Expose held reason
- Bypass `ChamberRouter`

**Replaces runtime behavior:** Former runtime had no constitutional threshold — surface rendering began wherever route matched a component. `EncounterBoundary` is the one, invariant line. Nothing below it presents without a released encounter.

**NotChazz flags:**
- DB access inside boundary
- Held reason surfaced in presentation
- ChamberRouter bypassed
- Encounter mutated at boundary

---

### 7. ChamberRouter

**Native function:** Dispatches a released encounter to the correct environment renderer based on `chamberAssignment`.

**Technical function:** React component. Reads `encounter.chamberAssignment` and dispatches to the corresponding renderer. TypeScript `never` exhaustiveness confirms all `EncounterEnvironmentAssignment` members are handled. Unknown assignment → public-safe unavailable state.

**Input:** `RenderableEncounter` + optional capture callbacks + presentation utilities.

**Output:** Environment renderer call, or unavailable state.

**May:**
- Read `chamberAssignment` from `RenderableEncounter`
- Dispatch to: `ObsidianChamberRenderer`, `LapisChamberRenderer`, `MarbleChamberRenderer`, `CrystalSeatRenderer`
- Surface public-safe unavailable state for exhausted `never` branch

**May not:**
- Make authority decisions
- Query DB
- Infer environment from any source other than `chamberAssignment`
- Bypass a renderer for any reason other than `never` exhaustion

**Replaces runtime behavior:** Former runtime routed surface rendering through component hierarchy and conditional logic that mixed arrangement and presentation. `ChamberRouter` dispatches from explicit, DB-seated `chamberAssignment` only.

**NotChazz flags:**
- Authority decision inside router
- Environment inferred outside `chamberAssignment`
- New environment added without `never` exhaustiveness check
- DB access inside router

---

### 8. CrystalSeatRenderer

**Native function:** Identity and entry. Crystal Seat establishes identity and presents entry before chamber encounter conditions.

**Technical function:** React component. Receives only `RenderableEncounter`. Dispatches to sub-presentations by surface key: `IntroHookSeat`, `PathChoiceSeat`, `StructurePassageSeat`, `AboutMeasuresRegistry`. All content from `encounterDef.metadata` and `mediaByRole`. Optional `onCaptureConnect` callback for connect form.

**Input:** `CrystalSeatProps` — `RenderableEncounter` + callbacks + presentation utilities.

**Output:** Identity and entry presentation, or public-safe gap state for absent content.

**May:**
- Render identity and entry surfaces
- Read content from `encounterDef.metadata`
- Read media from `mediaByRole`
- Render honest gap when content is absent
- Invoke `onCaptureConnect` when provided

**May not:**
- Query DB
- Render Obsidian (assessment), Lapis (publication), or Marble (governance) content
- Implement chamber behavior
- Infer content from route or material
- Be called "Crystal Chamber"

**Replaces runtime behavior:** Former frontend inferred crystal seat content from a custom `LandingSectionRow` data type and mixed identity, entry, and directory behavior. `CrystalSeatRenderer` reads from `encounterDef.metadata` only — what is seated is what renders.

**NotChazz flags:**
- "Crystal Chamber" language
- Assessment, Lapis, or Marble content inside Crystal Seat
- DB access inside renderer
- Content invented for absent encounter def

---

### 9. ObsidianChamberRenderer

**Native function:** Assessment. Obsidian reveals structural alignment through governed evaluation.

**Technical function:** React component. Receives only `RenderableEncounter`. Handles `measures_assessment` surface — full evaluation mechanic from `encounterDef.metadata` and `mediaByRole`. Optional `onCaptureAssessment` callback for contact capture persistence.

**Input:** `ObsidianChamberProps` — `RenderableEncounter` + callbacks + presentation utilities.

**Output:** Assessment presentation, or public-safe gap/renderer-gap state.

**May:**
- Render assessment mechanic surfaces
- Read evaluation content from `encounterDef.metadata`
- Read media from `mediaByRole`
- Invoke `onCaptureAssessment` when provided

**May not:**
- Query DB
- Determine assessment outcome outside encounter data
- Render Lapis, Marble, or Crystal Seat content
- Certify or convert participants
- Access session state outside what encounter provides

**Replaces runtime behavior:** Former assessment runtime mixed DB queries, session state, and rendering in a single component tree. `ObsidianChamberRenderer` receives a complete `RenderableEncounter` — no DB access, no session inference.

**NotChazz flags:**
- DB access inside renderer
- Certification or conversion logic
- Lapis/Marble/Crystal content
- Session state inference

---

### 10. LapisChamberRenderer

**Native function:** Relational encounter. Lapis relates through unDrifted publication and structural dispatch.

**Technical function:** React component. Receives only `RenderableEncounter`. Handles `structural_drift_dispatches` (publication landing) and `publication_dispatch` (article container — honest gap, data not in encounter model). Optional `onCaptureSubscription` callback for subscription persistence.

**Input:** `LapisChamberProps` — `RenderableEncounter` + callbacks + presentation utilities.

**Output:** Publication landing or honest data-model gap state.

**May:**
- Render `structural_drift_dispatches` from `encounterDef.metadata` and `mediaByRole`
- Surface honest gap for `publication_dispatch` (data not in resolver)
- Invoke `onCaptureSubscription` when provided

**May not:**
- Query DB
- Render Obsidian, Marble, or Crystal Seat content
- Invent publication content
- Bypass honest gap for absent data

**Replaces runtime behavior:** Former Lapis runtime queried `measures_publication_dispatch` directly and mixed publication data, subscription logic, and routing in a single surface component. `LapisChamberRenderer` reads from encounter data model only; absent data surfaces as a governed gap state.

**NotChazz flags:**
- DB access inside renderer
- Publication content invented
- Obsidian/Marble/Crystal content
- Honest gap bypassed

---

### 11. MarbleChamberRenderer

**Native function:** Governance encounter. Marble governs through MAP integrity framing.

**Technical function:** React component. Receives only `RenderableEncounter`. Handles `map_integrity_governance` via `MapIntegrityGovernance` sub-component. No payment logic, no certification, no assessment. All content from `encounterDef.metadata` and `mediaByRole`.

**Input:** `MarbleChamberProps` — `RenderableEncounter` + callbacks + presentation utilities.

**Output:** Governance encounter framing, or public-safe renderer gap state.

**May:**
- Render governance encounter framing from encounter data
- Read pathway cards, governance header, action readiness from `encounterDef.metadata`
- Read media from `mediaByRole`

**May not:**
- Query DB
- Access `map_c2_circuit` (MAP payment options — not in encounter model)
- Access session-held assessment context (`evalReport`, `conditionTraces`)
- Implement payment or certification logic
- Render Obsidian, Lapis, or Crystal Seat content

**Replaces runtime behavior:** Former Marble runtime required `map_c2_circuit` DB query, Stripe checkout API, payment verification, and session-held assessment context — all in a single chamber component. `MarbleChamberRenderer` renders what the encounter provides; dynamic governance context flows from Encounter Boundary in a subsequent OAR.

**NotChazz flags:**
- DB access inside renderer
- Payment / checkout logic
- Certification or conversion logic
- Obsidian/Lapis/Crystal content
- Assessment context inference

---

### 12. Optics / EncounterResolution

**Native function:** Observation. Optics prove how a governed encounter resolved.

**Technical function:** TypeScript type surface — `EncounterResolutionStatus`, `EncounterCaptureType`, `EncounterResolutionEvent`, `createResolutionEvent`. Pure factory function. No DB write seated yet. No analytics provider. Observes after manifestation only.

**Input:** Encounter fields — `registry_key`, `surface`, `environment`, `event_type`, optional `transition_target`, `capture_type`, `metadata` (primitives only, no PII).

**Output:** `EncounterResolutionEvent` — public-safe, structured, timestamped.

**May:**
- Observe how an encounter resolved
- Record entered, completed, abandoned, held, unavailable, transition, and capture events
- Accept public-safe primitive metadata only

**May not:**
- Determine standing
- Mutate encounter state
- Replace OAR authority
- Expose private gate reason
- Accept raw PII
- Integrate analytics vendor without explicit OAR
- Write to DB without seated write surface

**Replaces runtime behavior:** Former runtime had no structured observation layer — analytics were mixed into rendering logic or absent entirely. Optics are architecturally separated from rendering and operate only after manifestation.

**NotChazz flags:**
- Standing determination inside Optics
- Encounter mutation from Optics
- Private gate reason in event payload
- Raw PII in event metadata
- Analytics vendor added without OAR
- Optics collapsed into rendering logic

---

## COMPLETE FREE ARCHITECTURE

```
DB (Supabase)
  measures_registry
  measures_encounter_def
  measures_encounter_media
  measures_encounter_surface_assignment
  measures_encounter_design_tokens
  ↓

registryResolver               — fetches raw seated state
  ↓ RegistryResolverData

EncounterEntry                 — pipeline entry, loading/error handling
  encounterProfileLoader       — surface lookup, type validation, orchestration
    encounterComposition       — pure assembly of ComposedEncounter
    releaseGate                — fail-closed release check
  ↓ RenderableEncounterResult

EncounterBoundary              — constitutional threshold
  ↓ (held)     → public-safe unavailable state
  ↓ (released) → RenderableEncounter

ChamberRouter                  — environment dispatch from chamberAssignment
  "crystal_seat"  → CrystalSeatRenderer    — identity + entry
  "obsidian"      → ObsidianChamberRenderer — assessment
  "lapis"         → LapisChamberRenderer   — publication + relational
  "marble"        → MarbleChamberRenderer  — governance
  never           → public-safe unavailable state

                               — Manifestation complete

Optics / EncounterResolution   — observes how encounter resolved
  EncounterResolutionEvent     — public-safe, no PII, no gate reason
```

---

## RETIREMENT NOTICE

The following patterns are retired and must not be reintroduced:

| Retired pattern | Replacement |
|---|---|
| Route-based environment inference | `chamberAssignment` from `measures_encounter_surface_assignment` |
| Frontend as runtime authority | `registryResolver` + `encounterProfileLoader` + `releaseGate` |
| Component-level DB queries | `registryResolver` delivers all data before pipeline |
| Inferred standing from session | `registryRow.is_active` + `registryRow.release_state` via `releaseGate` |
| Shell abstraction | `EncounterBoundary` |
| Mixed presentation and authority | Hard separation enforced by `RenderableEncounter` type boundary |
| Crystal Chamber | Crystal Seat |
| Analytics mixed into rendering | Optics / `EncounterResolution` (observation after manifestation) |

---

## CLOSE

FREE replaces runtime.

Frontend does not run intention.

Frontend resolves encounter environment.

The who is invariant.

The system chose what was encountered.

Nothing is invented.
