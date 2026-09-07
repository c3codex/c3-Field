---
document_type: oar1
authority_level: urgent
document_scope: about_measures_registry_route_reconciliation
title: OAR1 — Reconcile About Measures Registry Route to Right-Path Encounter
status: executed
version: v1
operator: op044
system: measures_registry
process_key: reconcile_about_measures_registry_route_to_right_path_encounter
source_oar2: docs/oar/measures_registry/oar2_reconcile_about_measures_registry_route_to_right_path_encounter_v1.meta.md
---

# OAR1 — Reconcile About Measures Registry Route to Right-Path Encounter v1

## OBJECTIVE

Replace the stale `/about-measures-registry` white page render with the right-path encounter surface model — a 2-state renderer (encounter → supporting) styled within the Measures Registry dark visual system.

## ACTION

### DB Standing Verified First

Queried `measures_encounter_def` and `measures_media_map` before implementation. DB authority confirmed:

- `about_measures_registry` encounter is seated with `content_contract`, `approved_content_contract` (support_points, primary_statement), and all required metadata
- `about_measures_registry_video` is seated and active: `https://media.c3field.online/about_measures_registry.mp4`
- `structure_passage` encounter has `eyebrow: "OUR APPROACH"` and `title: "About Measures Registry"` — confirmed as the right-path encounter source for encounter-state copy

### Files Modified

**`src/measures_registry/registered_runtime/registeredRuntimeUtils.ts`**
- Added `approvedContentContract: asRecord(metadata.approved_content_contract)` to `sectionCopy` return — exposes `approved_content_contract.support_points` and `approved_content_contract.primary_statement` to renderers

**`src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx`**
- Full rewrite as a 2-state encounter renderer with internal `view: "encounter" | "supporting"` state
- Props updated: added `encounterCopy: SectionCopy`, `passageMuted: boolean`, `onToggleMuted: () => void`; removed `sealUrl`
- Encounter state: reuses `registry-structure-passage-layout` (same grid as right-path passage), reads eyebrow/title/position paragraph from `encounterCopy` (structure_passage), renders `aboutMeasuresRegistryVideoUrl` with autoPlay + muted toggle + Continue
- Supporting state: renders `approved_content_contract.title`, `primary_statement`, `support_points` list; adds unDrifted bridge card and Connect card; no hardcoded media URLs
- Both states use `data-public-path` attribute for CSS scoping; dark branded background in all states; no plain white render

**`src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`**
- Updated `about_measures_registry` surface dispatcher to pass: `encounterCopy={structurePassageCopy}`, `passageMuted`, `onToggleMuted={() => setPassageMuted((current) => !current)}`
- Removed `sealUrl` prop

**`src/measures_registry/registered_runtime/styles/encounters/about.css`** *(new)*
- `data-public-path="about_encounter"`: dark branded background (radial gradient + brand-field), passage layout applied via inherited `.registry-structure-passage-layout` grid
- `data-public-path="about_supporting"`: dark branded background, content container with max-width, supporting title, primary statement, support points list with accent dots
- `.registry-about-cards`: auto-fit grid, 2-column desktop / 1-column mobile
- `.registry-about-card`: dark glass card (border + subtle gradient background), eyebrow span, serif headline, body paragraph, CTA link
- `.registry-about-card-cta`: inline button-style anchor with brand-highlight border, hover fill

**`src/measures_registry/registered_runtime/styles/registry.runtime.css`**
- Added `@import "./encounters/about.css"` after public_understand import

### Scope Preserved

- `/undrifted` layout and media: unchanged
- Root encounter sequence: unchanged
- Assessment questions, scoring, contact capture, MAP/payment: unchanged
- `c3 Field` redirect: unchanged

## RESULT

`/about-measures-registry` now renders the right-path About encounter surface:

**Encounter state**:
- Dark branded Measures Registry background
- Measures Registry mark (via renderHeader)
- Eyebrow: "OUR APPROACH" (from `structure_passage.metadata.eyebrow`, DB-sourced)
- Headline: "About Measures Registry" (from `structure_passage.metadata.title`, DB-sourced)
- Position paragraph (from `structure_passage` encounter copy, DB-sourced)
- Talking-head video autoloads muted (from `about_measures_registry_video` media map)
- Audio button toggles unmuted playback
- Continue button advances to supporting state

**Supporting state**:
- Dark branded background (no plain white)
- `approved_content_contract.title` headline
- `approved_content_contract.primary_statement` paragraph
- `approved_content_contract.support_points` list
- unDrifted bridge card → routes to `/undrifted`
- Connect card → `mailto:connect@measuresregistry.com`

**Scope note**: `about_measures_registry.metadata.eyebrow` is seated as "ABOUT MEASURES REGISTRY" in `measures_encounter_def`. The encounter state reads from `structure_passage` (right-path encounter source), which has `eyebrow: "OUR APPROACH"` — matching the OAR2 specification. If the operator wishes the about encounter to have its own eyebrow independent of `structure_passage`, the `about_measures_registry.metadata` should be updated with an `encounter_eyebrow` field and the renderer updated accordingly.

## CLOSE

`/about-measures-registry` reconciled to the right-path encounter model. No stale white page remains. Encounter and supporting states styled within the Measures Registry dark visual system.
