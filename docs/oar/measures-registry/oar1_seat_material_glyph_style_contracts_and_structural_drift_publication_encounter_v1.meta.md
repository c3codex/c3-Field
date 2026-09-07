---
document_type: oar1
authority_level: execution_record
document_scope: measures_registry_runtime
title: Seat Material Glyph Style Contracts and Structural Drift Publication Encounter
status: completed
version: v1
operator: codex
system: measures_registry
source_oar2: docs/oar/measures-registry/oar2_seat_material_glyph_style_contracts_and_structural_drift_publication_encounter_v1.meta.md
completed_at: 2026-06-04
tags:
  - measures-registry
  - material-style-contracts
  - glyphs
  - chamber-layout
  - structural-drift
  - publication-encounter
  - oar1
---

# OAR1 — Seat Material Glyph Style Contracts and Structural Drift Publication Encounter v1

## Scope

Executed the OAR2 to seat reusable material, layout, and glyph rendering contracts in registered database metadata and to convert Structural Drift inside the Crystal Chamber from a raw text section into a compact publication encounter.

No routing, scoring, pricing, payment, c3 Key, permission, recognition, certification, DAO, conversion, or distribution standing was added.

## Files Changed

- `docs/oar/measures-registry/inspect-material-glyph-and-structural-drift-media-v1.cjs`
- `docs/oar/measures-registry/execute-seat-material-glyph-style-contracts-and-structural-drift-publication-encounter-v1.cjs`
- `docs/oar/measures-registry/oar1_seat_material_glyph_style_contracts_and_structural_drift_publication_encounter_v1.meta.md`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/public_understand.css`

## DB Seating

Executed:

```powershell
node .\docs\oar\measures-registry\execute-seat-material-glyph-style-contracts-and-structural-drift-publication-encounter-v1.cjs
```

Result: PASS.

Seated contracts:

- `material_style_contracts_v1` for `obsidian`, `crystal`, `lapis`, and `marble`.
- `layout_contracts_v1` for `passage`, `sparse_chamber`, `assessment`, `contact_contract`, `publication_encounter`, `cta_panel`, and `footer`.
- `glyph_contracts_v1` with public rendering rules forbidding visible labels, media role names, bucket paths, metadata bleed, and unregistered URL hardcoding.
- `publication_encounter_contract_v1` for `structural_drift_publication`.
- Crystal Chamber `structural_drift_publication_block` with publication encounter placement.

## Glyph and Media Findings

Registered glyph/media roles available and used:

- `registry_mark`
- `registry_watermark`
- `watermark`
- `marble_accent_reference`

Dedicated material glyph roles were not present in live media mapping:

- `obsidian_glyph`
- `crystal_glyph`
- `lapis_glyph`
- `marble_glyph`

No dedicated glyph URLs were invented. No hardcoded glyph fallback was added.

Structural Drift cover mapping found:

- media role: `structural_drift_featured_image`
- bucket: `measures-registry`
- path: `structural_drift.webp`
- active: `true`

The runtime now resolves Structural Drift cover media through registered media roles in priority order, including the live `structural_drift_featured_image` row.

## Runtime Changes

`MeasuresRegistryRuntimeRegistered.tsx` now registers Structural Drift cover media role candidates and passes the resolved cover URL and registry mark URL into the Crystal Chamber renderer.

`RegisteredCrystalChamber.tsx` now renders Structural Drift as a `publication_encounter` surface with:

- title: `Structural Drift`
- deck: `AI instability is not only a model problem. It is often an environment problem.`
- abstract from seated Crystal/Structural Drift metadata
- CTA: `Read Structural Drift`
- cover image from registered media map
- subtle registry seal only where seated

`public_understand.css` adds compact publication encounter styling and tightens Crystal Chamber desktop fit while preserving the sparse sequence:

1. Questions Explainer video.
2. Structural Drift publication encounter.
3. Foundational Leadership CTA.
4. Assess the Environment CTA.

## Validation

Build:

```powershell
npm.cmd run build:registry
```

Result: PASS. Existing Vite large chunk warning remains.

Local runtime:

- URL checked: `http://127.0.0.1:4189/?surface=crystal_chamber`
- Browser: installed Chrome via bundled Playwright library.
- Supabase REST responses returned `200`.
- Required seated state appeared after runtime data load.

Observed final browser state:

- Questions video present: `https://media.c3field.online/questions_ungoverned_systems_cannot_answer.mp4`
- Structural Drift cover present: `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/structural_drift.webp`
- Cover decoded: `1536x1024`, complete.
- Visible headings: `Questions Ungoverned Systems Cannot Answer`, `Structural Drift`.
- Visible CTAs: `Read Structural Drift`, `Request a Foundational Leadership Conversation`, `Assess the Environment`.
- Forbidden visible labels: none found for `EMBLEM ONLY`, `GLYPH ONLY`, `asset label`, `media role`, `bucket path`, `debug label`, `contract label`, `storage_bucket`, or `storage_path`.

Desktop fit at `1280x720`:

- Crystal Chamber frame height: 686px, visible inside viewport.
- Questions video visible.
- Publication encounter visible.
- Structural Drift cover visible.
- All three CTAs visible.
- Footer begins at the chamber boundary and does not force excessive scroll.

## Deployment

Deployment was not performed in this OAR1.

## Unresolved Dependencies

Dedicated per-material glyph roles remain unseated in the live media map:

- `obsidian_glyph`
- `crystal_glyph`
- `lapis_glyph`
- `marble_glyph`

The renderer uses only registered assets that exist. Future material-specific glyph treatment should be seated through media mapping before public rendering.

## Close

Material contracts are seated.

Layout contracts are seated.

Glyph rules are seated without invented media.

Structural Drift now renders as a professional publication encounter from registered state.

Codex holds.
Field structures.
Measures registers.
src renders seated state only.
