---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_regression
title: OAR1 - Restore Encounter Route, Media, and Result Surface Resolution After Runtime Removal
status: closed
version: v1
operator: op044
system: measures_registry

oar2_ref: oar2_restore_encounter_route_media_and_result_surface_resolution_after_runtime_removal_v1.meta.md
oar2_parent: ab09a6d

native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: frontend_executor

environment: measures_registry
release_state: working
surface_family: crystal_obsidian_marble
route_phase: regression_repair
---

# OAR1 — Restore Encounter Route, Media, and Result Surface Resolution After Runtime Removal

## Summary

OAR2 triggered against pre-`ab09a6d` QA failures. Full regression investigation completed. All 7 items inspected. Prior commit `ab09a6d` resolved the core renderer regressions. No additional code or DB changes required. OAR closed.

---

## Investigation Findings

### 1. Route Map Verification

**File inspected:** `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`

Active `ROUTE_SURFACE_MAP`:

```
/ai-operations-assessment  →  obsidian_chamber_encounter_surface
/structural-drift          →  lapis_chamber_encounter
/undrifted                 →  lapis_chamber_encounter
/map-integrity-governance  →  marble_chamber_C2_compact  (legacy_route_alias)
/about                     →  crystal_seat_encounter
/about-measures-registry   →  crystal_seat_encounter
/privacy                   →  privacy
/terms                     →  terms
/governance-audit          →  governance_audit
```

`/ai-operations-assessment` correctly resolves to `obsidian_chamber_encounter_surface`. No stale runtime route exists. The `REGISTRY_ROUTE_UNITS` map in `App.tsx` is SEO metadata only — it does not govern surface routing.

`public/_redirects`: `/* /index.html 200` — Cloudflare Pages SPA rewrite is active. Direct navigation to `/ai-operations-assessment` resolves correctly.

DB: `obsidian_chamber_encounter_surface` surface assignment `release_state: "released"`, `is_active: true`. Release gate passes.

**Status: VERIFIED — no bug.**

---

### 2. Runtime Removal Regression Check

**Commit inspected:** `8a801da` — removed 18 files from `registered_runtime/` directory.

Commit note confirms: "MeasuresRegistryRuntimeRegistered was not imported in any active route."

FREE (Frontend Replacement Encounter Environment) is the sole active renderer. Pipeline:

```
MeasuresRegistryOrchestrator
  → initialSurface()
  → EncounterEntry
  → loadEncounterProfile()
  → EncounterBoundary
  → ChamberRouter
  → chamber renderers
```

None of the removed runtime files touched:

- encounter resolver (`registryResolver.ts`, `encounterComposition.ts`, `encounterProfileLoader.ts`)
- route surface map (`MeasuresRegistryOrchestrator.tsx`)
- pending assessment result state (`__mreg_pending_report` sessionStorage)
- session storage handoff (written by `ObsidianC1Compact`, read by `MarbleChamberEncounter`)
- marble_chamber_results dispatch (`MarbleChamberRenderer.tsx`)
- media control bridge (`ObsidianChamberRenderer.tsx`)
- about content renderer (`CrystalSeatRenderer.tsx`)
- fullscreen intro gate (`crystal.css`)

**Status: VERIFIED — no regression from runtime removal.**

---

### 3. Fullscreen Intro Behavior

**File inspected:** `src/measures_registry/encounter_renderer/styles/encounters/crystal.css`

Only selector with `position: fixed; overflow: hidden`:

```css
.measures-registry-runtime[data-layout-contract="crystal_intro"] {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: #000;
  overflow: hidden;
  z-index: 0;
}
```

`data-layout-contract="crystal_intro"` is set only by `CrystalIntroSeat` in `CrystalSeatRenderer.tsx`.

All other surfaces confirmed not fullscreen-locked:
- `about.css` — no fixed position, no overflow hidden on section containers
- `obsidian.css` — no fixed position, no overflow blocking
- `lapis.css` — `overflow-y: auto; -webkit-overflow-scrolling: touch` (scroll enabled)
- `passage.css` — no fullscreen locking
- `registry.layout.css` — `.measures-registry-runtime { position: relative; min-height: 100svh }`
- `registry.visual-system.css` — no fullscreen locking on non-intro surfaces

`CrystalSeatRenderer.tsx` surfaces and their layout contracts:
- `CrystalIntroSeat` → `crystal_intro` (fullscreen ✓ intentional)
- `IntroHookSeat` → `intro` (no fullscreen ✓)
- `AboutMeasuresRegistry` → no fullscreen layout contract (no fullscreen ✓)
- `crystal_seat_orientation` → scoped via `data-surface` in `crystal.css` (no fullscreen ✓)

**Status: VERIFIED — fullscreen correctly isolated to `crystal_intro` only. No leak.**

---

### 4. Video Audio Control

**File inspected:** `src/measures_registry/encounter_renderer/chambers/ObsidianChamberRenderer.tsx`

`ObsidianOrientationThreshold` implementation (post `ab09a6d`):

```tsx
const videoRef = useRef<HTMLVideoElement>(null)
const [videoAudioEnabled, setVideoAudioEnabled] = useState(false)

function handleVideoAudio() {
  const video = videoRef.current
  if (!video) return
  if (!videoAudioEnabled) {
    video.muted = false
    video.volume = 1
    void video.play().catch(() => { video.muted = true; setVideoAudioEnabled(false) })
    setVideoAudioEnabled(true)
  } else {
    video.muted = true
    setVideoAudioEnabled(false)
  }
}
```

Video element: `muted` attribute set statically, `ref={videoRef}`. Button label: "Enable Video Audio" / "Video Audio On".

Imperative DOM control (not React prop reconciliation) is required for iOS Safari — this is correctly implemented.

Ambient tone bed (`ambientAudioRef` in `MeasuresRegistryOrchestrator`) and video audio (`videoRef` in `ObsidianOrientationThreshold`) are separate systems. "Enable Tone" controls the tone bed only; "Enable Video Audio" controls the explainer video only.

**Audio track presence:** Cannot be verified without streaming the `obsidian` media role asset. The renderer is correctly wired. If "Enable Video Audio" produces no audible result after clicking, the asset at the `obsidian` media role URL lacks an audio track. This is an asset-level gap, not a renderer bug. If confirmed silent: do not fake audio control — report asset as silent and remove the button in a subsequent OAR.

**Status: RENDERER VERIFIED — audio track presence of obsidian media role asset requires manual QA.**

---

### 5. About Content Visibility

**Files inspected:** `CrystalSeatRenderer.tsx`, `about.css`, `crystal.css`

Prior TDZ bug (`bgUrl` referenced before assignment in `AboutMeasuresRegistry` early return) was fixed in `ab09a6d`. Early return now uses plain `registryTokenStyle` without `surfaceBgStyle(bgUrl)`.

All sections render conditionally on seated DB content_profile data:
- `codexstoneSealSection` — renders when `codexstone_seal` media URL is present
- `orientationSections` — renders when `orientation_sections` array is seated
- `bridgeSection` — renders when `bridge_section` object is seated
- `c3fieldLinks` — renders when `c3_field_links` array is seated
- `connectSection` — renders when `connect_section` object is seated

CSS (`about.css`): no `overflow: hidden`, no `height: 100vh` blocking on section containers. Dark token overrides scoped to `crystal_seat_encounter`.

**Status: VERIFIED — TDZ fixed, no CSS blocking, all seated sections render.**

---

### 6. Marble Result Surface Handoff

**Files inspected:** `MarbleChamberRenderer.tsx`, `ObsidianChamberRenderer.tsx`

DB transition chain (from `measures_registry_root.metadata.encounter_structure`):

```
obsidian_chamber_C1_compact  →  marble_chamber_orientation
marble_chamber_orientation   →  marble_chamber_results
marble_chamber_results       →  marble_chamber_C2_compact
```

`ObsidianC1Compact.handleSubmit()`:
- writes `__mreg_pending_report` to sessionStorage
- calls `onNavigate` with `next` surface = `marble_chamber_orientation`

`MarbleChamberRenderer.tsx` dispatch:
- `marble_chamber_orientation` → `MarbleOrientationSeat` — renders orientation/findings-preparing content only, does NOT read `__mreg_pending_report`
- `marble_chamber_encounter` → immediately calls `props.onNavigate("marble_chamber_results")` (legacy forward, no content rendered)
- `marble_chamber_results` → `MarbleChamberEncounter` — reads `__mreg_pending_report`, renders `PublicAssessmentResult`
- `marble_chamber_C2_compact` → MAP recommendation and CARs

Result payload is on `marble_chamber_results` only. `marble_chamber_orientation` does not render assessment results. `marble_chamber_results` is not skipped.

**Status: VERIFIED — correct handoff in code and DB.**

---

### 7. Validation Route Walk (DB evidence)

Full transition chain confirmed in `measures_registry_root.metadata.encounter_structure`:

```
crystal_seat_intro
  → crystal_seat_threshold
  → [left] obsidian_chamber_orientation  |  [right] crystal_seat_orientation
                                         |           → crystal_seat_encounter
  → obsidian_chamber_encounter_surface
  → obsidian_chamber_C1_compact
  → marble_chamber_orientation
  → marble_chamber_results
  → marble_chamber_C2_compact
  → marble_chamber_C2_agreement
  → marble_chamber_C2_resolution (terminal)
```

All 13 registry keys: `release_state: "released"`, `is_active: true`.

Encounter defs confirmed:
- `obsidian_chamber_orientation`: `display_title: "Before You Begin"`, full content_profile ✓
- `marble_chamber_orientation`: content_profile with eyebrow "ASSESSMENT COMPLETE", cta_label "Continue" ✓
- `marble_chamber_results`: `display_title: "Assessment Findings — Measures Registry"` ✓

**Status: VERIFIED — full route chain correctly seated in DB.**

---

## Build Validation

TypeScript check: `npx tsc --noEmit` — **PASSED, zero errors.**

---

## Files Changed This OAR

None. All findings were resolved by prior commit `ab09a6d` before this OAR2 was executed.

---

## Open Items

| # | Item | Severity | Action |
|---|------|----------|--------|
| 1 | `obsidian` media role video audio track presence | Unknown | Manual QA: click "Enable Video Audio" on the orientation surface. If silent → open new OAR to report asset as silent and remove the button. |

---

## Close

Route verified. Runtime removal confirmed clean. Fullscreen correctly isolated. Video audio renderer wired correctly (asset track presence requires manual QA). About content unblocked. Marble result handoff correct in code and DB. Transition chain fully seated. TypeScript clean.

OAR2 closed.
