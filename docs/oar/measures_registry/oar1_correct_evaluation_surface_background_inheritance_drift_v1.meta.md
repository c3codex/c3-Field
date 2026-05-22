---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Correct Evaluation Surface Background Inheritance Drift
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_evaluation_surface_background_inheritance_drift_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - evaluation-surface
  - background-inheritance
  - material-boundary
  - visual-contract
---

# OAR1 — Correct Evaluation Surface Background Inheritance Drift

## OBJECTIVE

Execute correction for:

`docs/oar/measures_registry/oar2_correct_evaluation_surface_background_inheritance_drift_v1.meta.md`

Suppress inherited chamberplate `::before` bleed on the obsidian evaluation surface.

---

## ACTION

### CSS Correction

File: `src/index.css`

Added one rule inside the obsidian material contract block, immediately before the existing `.registry-assessment-chamber` obsidian override at line 5287:

```css
.measures-registry-runtime[data-material-family="obsidian"] .registry-assessment-chamber::before {
  content: none;
}
```

This suppresses the full-viewport `position: fixed; inset: 0; z-index: -1` pseudo-element for the obsidian material family. The obsidian `<main>` ambient background gradient resolves the surface correctly without the `::before` layer.

### Preserved

- Obsidian `<main>` background gradient — unchanged
- Obsidian chamber card background — unchanged
- Obsidian `::after` marble accent strip — unchanged
- Standard (non-obsidian) `::before` ambient layer — unchanged
- No renderer logic modified
- No routing changed
- No DB state changed

---

## RESULT

### Background Stack — After Correction

```
html, body, #root
  background: #050505

<main class="measures-registry-runtime" data-material-family="obsidian">
  background:
    radial-gradient(circle at 50% 12%, ...white 6%..., transparent 24rem),
    linear-gradient(145deg, #03050a 0%, #090b14 46%, #020307 100%)

  <section class="registry-assessment-chamber">

    ::before
      content: none  ← suppressed for obsidian
      (chamberplate lapis bleed eliminated)

    chamber card background
      linear-gradient(145deg, #070912 90%..., #11131c 78%...),
      var(--registry-assessment-background-image)

    ::after
      obsidian marble accent strip — bounded, intentional
```

Chamberplate lapis background no longer bleeds into the obsidian evaluation surface. Obsidian ambient layer resolves from the `<main>` gradient only. Material boundary is now enforced at the pseudo-element level.

---

## VALIDATION

### Build Status

Command: `npm.cmd run build:registry`

Result: passed

Output directory: `dist-registry`

Generated build artifacts cleaned after validation.

### File References

| File | Change |
|---|---|
| `src/index.css:5287` (prior) | Added `::before { content: none }` rule for obsidian immediately before the chamber override |

### Confirmation

- `::before` suppressed for `data-material-family="obsidian"` via `content: none`
- Standard evaluation contract `::before` unaffected
- No other surfaces modified
- Build passed

---

## IMPLEMENTATION STATUS

CSS correction executed.

No renderer files modified.

No DB state changed.

Build validated.

---

## CLOSEOUT

OAR2 correction executed.

Chamberplate background inheritance eliminated from the obsidian evaluation surface.

Material boundary now enforced at the pseudo-element level through the seated obsidian material contract.

OAR1 ready for operator review.
