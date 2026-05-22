---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Audit Evaluation Surface Background Inheritance Drift
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_evaluation_surface_background_inheritance_drift_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - evaluation-surface
  - background-inheritance
  - runtime-drift
  - material-boundary
  - visual-contract
---

# OAR1 — Audit Evaluation Surface Background Inheritance Drift

## OBJECTIVE

Audit the evaluation surface render stack to identify the source of the lower-layer visual artifact visible beneath the evaluation surface.

No implementation performed.

---

## ACTION

### Files Inspected

- `src/measures_registry/MeasuresAssessmentChamber.tsx` — chamber style contract and background-image assignment
- `src/measures_registry/MeasuresRegistryRuntime.tsx` — media URL resolution and chamber prop assignment
- `src/index.css` — full background stack for `.registry-assessment-chamber`, `.registry-assessment-chamber::before`, `.registry-assessment-chamber::after`, `.measures-registry-runtime[data-material-family="obsidian"]` overrides, `body`, `html`, `#root`

### Background Stack Inspected

1. `body` / `html` / `#root` global background rules
2. `.measures-registry-runtime` base background
3. `.measures-registry-runtime[data-material-family="obsidian"]` background override
4. `.registry-assessment-chamber` background contract
5. `.registry-assessment-chamber::before` — full-viewport pseudo-element
6. `.registry-assessment-chamber::after` — obsidian marble accent strip
7. `.measures-registry-runtime[data-material-family="obsidian"] .registry-assessment-chamber` — obsidian chamber override
8. `--registry-assessment-background-image` — CSS custom property carrying the lapis background image
9. `--registry-marble-accent-image` — CSS custom property carrying the marble accent reference
10. `lapisBackgroundUrl` and `marbleAccentReferenceUrl` media resolution

---

## RESULT

### Background Stack — Evaluation Surface (Obsidian)

```
html, body, #root
  background: #050505  (Session 24 global rule — src/index.css:7346)
  overflow: hidden

<main class="measures-registry-runtime" data-material-family="obsidian">
  background:
    radial-gradient(circle at 50% 12%, ...white 6%..., transparent 24rem),
    linear-gradient(145deg, #03050a 0%, #090b14 46%, #020307 100%)
  (src/index.css:5282–5284)

  <section class="registry-iis-eval registry-assessment-chamber">

    ::before  ← ARTIFACT SOURCE
      position: fixed
      inset: 0
      z-index: -1
      background:
        linear-gradient(90deg, field-wash, field-wash),
        var(--registry-assessment-background-image, fallback-gradient) center / cover no-repeat,
        radial-gradient(circle at 50% 10%, panel-wash, transparent),
        linear-gradient(135deg, panel-surface, field, panel-surface)
      (src/index.css:4919–4929)

    chamber card background
      linear-gradient(145deg, #070912 90%..., #11131c 78%...),
      var(--registry-assessment-background-image)  ← lapis image in card
      (src/index.css:5289–5291)

    ::after  ← obsidian-only marble accent strip
      position: absolute
      inset: auto 9% 0
      var(--registry-marble-accent-image)
      (src/index.css:5458–5472 — intentional, bounded to chamber bottom)
```

### Artifact Source — Confirmed

**`.registry-assessment-chamber::before`** at `src/index.css:4919–4929`.

Properties:
- `position: fixed` — positions relative to the viewport, not the chamber
- `inset: 0` — covers the full viewport
- `z-index: -1` — renders behind chamber content
- Background includes `var(--registry-assessment-background-image)` — the lapis background image resolved from `lapisBackgroundUrl`

This pseudo-element is the chamberplate ambient background layer. It is intentional for the standard evaluation contract and creates an ambient lapis backdrop behind the chamber card.

**It has no obsidian material override.**

The obsidian CSS contract (`src/index.css:5278+`) provides:
- `<main>` background — overridden ✓
- `.registry-assessment-chamber` background — overridden ✓
- `.registry-assessment-chamber::after` — added as obsidian marble accent ✓
- `.registry-assessment-chamber::before` — **not overridden** ✗

The `::before` continues to render the lapis background image as a full-viewport fixed layer when `data-material-family="obsidian"` is active. The obsidian gradient on `<main>` covers the `<main>` element area, but the `::before` with `position: fixed` bleeds outside the stacking context of the chamber and produces the visible lower-layer artifact.

### Inheritance Classification

| Layer | Source | Classification |
|---|---|---|
| `body` background `#050505` | `src/index.css:7346` | Intentional — global dark base |
| `<main>` obsidian gradient | `src/index.css:5282–5284` | Intentional — obsidian contract |
| `::before` lapis background | `src/index.css:4919–4929` | **Drift — chamberplate asset bleeds through; no obsidian override** |
| Chamber card background | `src/index.css:5289–5291` | Intentional — obsidian override applies lapis within card |
| `::after` marble accent strip | `src/index.css:5458–5472` | Intentional — obsidian-only accent |

### Media Contract Path

`lapisBackgroundUrl` is resolved as:

```ts
mediaUrl(mediaMap.get("background")) ?? mediaUrl(mediaMap.get("lapis_background"))
```

(`MeasuresRegistryRuntime.tsx:878`)

This is passed as `registryBackgroundUrl` to `MeasuresAssessmentChamber`, which sets it as the inline CSS custom property `--registry-assessment-background-image` on the chamber `<main>`.

The lapis background image is:
- Intentionally consumed by the chamber card background under obsidian (correct — within the card)
- Unintentionally consumed by the `::before` pseudo-element under obsidian (incorrect — full-viewport fixed layer)

### Material Boundary Failure

The `::before` pseudo-element does not respect the obsidian material boundary. The chamberplate background image bleeds into the obsidian evaluation surface as a full-viewport layer. The surface does not resolve as fully operational/obsidian — ceremonial/chamberplate texture is visible in the lower ambient layer.

---

## MINIMAL CORRECTION REQUIRED

One CSS rule addition in `src/index.css`:

Suppress or replace the `::before` pseudo-element for the obsidian material family.

**Option A — Suppress entirely:**

```css
.measures-registry-runtime[data-material-family="obsidian"] .registry-assessment-chamber::before {
  content: none;
}
```

The obsidian `<main>` background gradient already provides the full-viewport ambient layer. The `::before` is redundant and carries the incorrect lapis asset.

**Option B — Replace with obsidian ambient:**

```css
.measures-registry-runtime[data-material-family="obsidian"] .registry-assessment-chamber::before {
  background:
    radial-gradient(circle at 50% 12%, color-mix(in srgb, #ffffff 5%, transparent), transparent 24rem),
    linear-gradient(145deg, #03050a 0%, #090b14 46%, #020307 100%);
}
```

This preserves the ambient layer behavior while replacing the chamberplate asset with the obsidian gradient.

Option A is minimal and correct — the `<main>` background already covers the obsidian ambient surface. Option B is additive and provides redundant coverage.

---

## VALIDATION

### Build Status

Not checked. Audit is read-only per OAR2 scope.

### File References

| File | Relevance |
|---|---|
| `src/index.css:4919–4929` | `::before` — artifact source |
| `src/index.css:5278–5334` | Obsidian contract — missing `::before` override |
| `src/index.css:5458–5472` | `::after` — obsidian marble accent, correctly bounded |
| `src/measures_registry/MeasuresAssessmentChamber.tsx:129–133` | `chamberStyle` — sets `--registry-assessment-background-image` |
| `src/measures_registry/MeasuresRegistryRuntime.tsx:878, 899` | `lapisBackgroundUrl` resolved and passed as `backgroundUrl` |

### Line References

| Location | Note |
|---|---|
| `src/index.css:4919` | `.registry-assessment-chamber::before` — `position: fixed; inset: 0; z-index: -1` |
| `src/index.css:4926` | `--registry-assessment-background-image` consumed by `::before` — lapis image, full-viewport |
| `src/index.css:5278` | Obsidian contract begins — no `::before` override in this block |
| `src/index.css:5458` | `.registry-assessment-chamber::after` — obsidian-only, correctly bounded |
| `MeasuresAssessmentChamber.tsx:131` | `--registry-assessment-background-image` set from `registryBackgroundUrl` |
| `MeasuresRegistryRuntime.tsx:878` | `lapisBackgroundUrl` — source of the chamberplate background asset |

---

## IMPLEMENTATION STATUS

Audit only.

No implementation performed.

No files modified.

No DB state changed.

---

## ROUTING RECOMMENDATION

Single-rule CSS correction OAR2.

Add an obsidian override for `.registry-assessment-chamber::before` inside the existing obsidian contract block at `src/index.css:5278+`.

Option A (`content: none`) is the minimal and correct correction. The obsidian ambient surface is already provided by the `<main>` background. The `::before` is not needed and carries the wrong asset.

---

## CLOSEOUT

Artifact source identified: `.registry-assessment-chamber::before` at `src/index.css:4919–4929`.

Chamberplate lapis background bleeds through as a full-viewport fixed layer because the obsidian material contract does not override or suppress the `::before` pseudo-element.

All other background layers are correctly contracted or intentionally bounded.

OAR1 ready for operator review.
