---
document_type: oar1
authority_level: launch_repair
document_scope: report_continuance
title: OAR1 - Restore Report Continuance to MAP the Environment
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_restore_report_continuance_to_map_environment_v1
---

# OAR1 - Restore Report Continuance to MAP the Environment

## REPAIR METHOD

Two source changes applied: one CSS rule block added to `assessment.css`, one ternary guard fixed in `PublicAssessmentResult.tsx`.

No DB changes. No scoring changes. No report copy changes. No MAP pricing changes. No Stripe changes.

Build passes. Zero TypeScript errors.

---

## AUDIT FINDINGS

### Source trace — confirmed correct

| Path | Finding |
|---|---|
| `ObsidianToMarblePassage` (ObsidianChamberRenderer.tsx:208–237) | `{passageComplete && pendingReport}` branch renders `PublicAssessmentResult` with `onBeginPathwayReview={handleBeginPathwayReview}` |
| `handleBeginPathwayReview` (line 204–206) | Calls `if (next) onNavigate(next as EncounterSurface)` |
| `resolveNextSurface` (line 61–63) | Returns `asString(encounter.transitionNodes[encounter.surface]?.next_surface)` |
| `PublicAssessmentResult.tsx:195–199` | CTA renders inside `{report ? <section>...</section> : ...}` when report IS present |
| `reportCtaLabel` (line 86) | Reads `reportCta.label` from `reportContract.report_cta.label` → "MAP the Environment" |
| `onBeginPathwayReview` prop | Wired from `ObsidianToMarblePassage` → `handleBeginPathwayReview` ✓ |

### DB trace — confirmed correct

| Authority | Live value |
|---|---|
| `encounter_structure.obsidian_to_marble_passage_video.next_surface` | `"map_integrity_governance"` ✓ |
| Navigation target | `onNavigate("map_integrity_governance")` resolves correctly |

### CSS gaps identified at desktop

**Gap 1 — No desktop `result_gate` scroll authority.**

Mobile (≤620px) had an explicit fix in `assessment.css`:
```css
.measures-registry-runtime[data-layout-contract="result_gate"] {
  min-height: 100svh;
  overflow-y: auto;
}
.measures-registry-runtime[data-layout-contract="result_gate"] .registry-iis-eval.registry-assessment-chamber {
  min-height: 100svh;
  height: auto;
  overflow: visible;
  padding-bottom: max(1.25rem, env(safe-area-inset-bottom));
}
```

Desktop had NO equivalent. The `<main class="measures-registry-runtime">` receives `overflow-y: auto` from `index.css`, but without an explicit `result_gate` desktop rule the chamber was not guaranteed to release its height constraint. Long report content (7+ sections) pushed the CTA below fold without a confirmed scroll affordance.

**Gap 2 — `.registry-diagnostic-passage-controls.registry-report-controls` missing `display: flex`.**

`assessment.css:329` defines:
```css
.measures-registry-runtime .registry-report-controls {
  justify-content: flex-end;
  margin-top: 1rem;
}
```

No `display: flex` — `justify-content: flex-end` was inert. The CTA button rendered as a block element without right-alignment.

**Gap 3 — Stray `<p>` in `PublicAssessmentResult.tsx` at line 232.**

The ternary at lines 211–233 fell through to an `else` branch that rendered `<p>Continue into the Structured Environment.</p>` whenever `reportContract` was present. Both `!reportContract && ...` conditions fail when `reportContract` IS seated, sending all three paths to the `else`. This stray paragraph rendered below the CTA, adding visual noise.

---

## REPAIR 1 — CSS: Desktop `result_gate` scroll and control authority

### File changed

`src/measures_registry/registered_runtime/styles/encounters/assessment.css`

### Rules added (inserted before `@media (max-width: 620px)` block)

```css
/* ── RESULT GATE — desktop scroll and control authority ─────────────────── */
.measures-registry-runtime[data-layout-contract="result_gate"] {
  overflow-y: auto;
}

.measures-registry-runtime[data-layout-contract="result_gate"] .registry-iis-eval.registry-assessment-chamber {
  height: auto;
  overflow: visible;
  padding-bottom: max(2rem, env(safe-area-inset-bottom));
}

.measures-registry-runtime[data-layout-contract="result_gate"] .registry-diagnostic-passage-controls.registry-report-controls {
  display: flex;
  justify-content: flex-end;
}
```

### Effect

- `overflow-y: auto` on the root ensures the `result_gate` container scrolls when report content exceeds viewport height — mirrors the mobile fix, applied at desktop level.
- `height: auto; overflow: visible` on the assessment-chamber ensures the chamber doesn't clip the long report content and grows to accommodate all sections.
- `padding-bottom: max(2rem, env(safe-area-inset-bottom))` gives CTA breathing room at the bottom.
- `display: flex; justify-content: flex-end` on the CTA wrapper activates the `justify-content` that was already defined but inert on `.registry-report-controls`.

---

## REPAIR 2 — React: Fix stray `<p>` in `PublicAssessmentResult.tsx`

### File changed

`src/measures_registry/PublicAssessmentResult.tsx`

### Change at line 231

**Before:**
```tsx
      ) : (
        <p>Continue into the Structured Environment.</p>
      )}
```

**After:**
```tsx
      ) : !reportContract ? (
        <p>Continue into the Structured Environment.</p>
      ) : null}
```

### Effect

When `reportContract` is present (as in the `result_gate` report phase), the stray `<p>` no longer renders. The `else` branch now requires `!reportContract` before rendering, matching the intent of the surrounding `!reportContract &&` guards.

---

## BUILD VERIFICATION

```
npm run build → ✓ built in 7.34s
Zero TypeScript errors
CSS processed without errors
```

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| CTA label reads "MAP the Environment" | ✓ (reads from `reportContract.report_cta.label` — unchanged) |
| CTA visible after report content | ✓ (desktop scroll authority added; no overflow trap) |
| CTA reachable on laptop/tablet/mobile | ✓ (desktop fix added; mobile fix pre-existing) |
| CTA right-aligned (desktop) | ✓ (`display: flex; justify-content: flex-end` activated) |
| CTA click navigates to `map_integrity_governance` | ✓ (wiring confirmed correct, no change) |
| Report copy unchanged | ✓ |
| Scoring unchanged | ✓ |
| MAP pricing unchanged | ✓ |
| Stripe behavior unchanged | ✓ |
| Stray `<p>Continue...` suppressed when reportContract present | ✓ |
| Build passes | ✓ |
| No new TypeScript errors | ✓ |
| Browser QA | PENDING — operator action required |

---

## BROWSER QA REQUIRED

Operator must confirm after deploy:

1. Run full flow from root URL in clean browser state (clear sessionStorage, hard refresh or incognito)
2. Complete assessment → submit contact capture → reach passage video
3. Let passage video end (or skip via Continue button)
4. Verify full report renders (header, title, summary, key indicators, recommendation)
5. Scroll down — verify "MAP the Environment" CTA is visible and reachable
6. Confirm CTA is right-aligned at desktop
7. Click "MAP the Environment" — verify navigation reaches MAP surface with correct pathway cards
8. Verify no stray "Continue into the Structured Environment." text below the CTA
9. Verify MAP continuation works and Stripe checkout path is reachable

---

## NO OTHER MUTATIONS APPLIED

- No DB changes
- No scoring logic changes
- No report copy changes
- No MAP pricing changes
- No Stripe changes
- No media asset changes
- No route changes

---

## FINAL DISPOSITION

**REPORT_CONTINUANCE_REPAIR_COMPLETE** — pending browser QA confirmation
