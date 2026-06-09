---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_correction
title: OAR1 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_obsidian_eval_result_css_binding_marble_accent_reference_and_passage_auto_advance_v1.meta.md
executor: claude
execution_date: 2026-06-09
commit: 2d318ba
tags:
  - oar1
  - measures-registry
  - runtime-correction
  - obsidian
  - marble
  - eval-result
  - css-binding
  - media-map
  - passage-auto-advance
---

# OAR1 — Correct Obsidian Eval Result CSS Binding, Marble Accent Reference, and Passage Auto-Advance v1

## OBJECTIVE

Apply three discrete corrective mutations identified by runtime audit OAR1 (`oar1_runtime_audit_obsidian_eval_report_and_marble_route_binding_v1.meta.md`):

1. Bind `--registry-obsidian-eval-result-visual` to the eval result surface in CSS
2. Deactivate the codexstone artifact in `marble_accent_reference`
3. Add `onEnded` auto-advance to the passage video

## ACTION

### Fix 1 — CSS binding

**File:** `src/measures_registry/registered_runtime/styles/registry.visual-system.css`

**Selector added:**

```css
.measures-registry-runtime[data-material-family="obsidian"][data-layout-contract="result_gate"] {
  --registry-source-image: var(--registry-obsidian-eval-result-visual, none);
}
```

Inserted after the `[data-material-family="obsidian"]` base token block (line 49-55), before the `::before` pseudo-element rule.

Mechanism: the `result_gate` layout contract is set on the outer `<main>` when `evalSubmitted === true` in `PublicAssessmentSurface`. This selector overrides the base obsidian `--registry-source-image` token with the eval-result-specific visual variable that was already set in `chamberStyle` by the runtime. The `::before` pseudo-element background-image layer now consumes the eval result visual via the `--registry-source-image` cascade.

No hardcoded URL. No change to the base obsidian material tokens. No change to other layout states.

---

### Fix 2 — Marble accent reference deactivation

**Table:** `measures_media_map`

**SQL executed:**

```sql
UPDATE measures_media_map
SET is_active = false
WHERE media_role = 'marble_accent_reference';
```

**Result:** 1 row updated.

| media_role | storage_path | is_active |
|---|---|---|
| marble_accent_reference | measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp | false |

`marbleAccentReferenceUrl` in `MeasuresRegistryRuntimeRegistered` now resolves to `null` for this role. `MarbleCommerceDirectory` renders no `<img class="registry-marble-accent">` in either the directory or payment confirmation state. Codexstone artifact no longer appears as the public Marble Chamber visual.

No other media map rows touched.

---

### Fix 3 — Passage auto-advance

**File:** `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

**Change:** Added `onEnded` handler to the passage video element in the `obsidian_to_marble_passage_video` surface.

```tsx
<video
  className="registry-pathway-passage-video"
  src={beforeThePathwayVideoUrl}
  autoPlay
  muted={passageMuted}
  playsInline
  preload="auto"
  aria-label="Before the Pathway"
  onEnded={() => navigate("marble_pathway_reveal")}
/>
```

When the video ends, the runtime navigates to `marble_pathway_reveal` without user action. The manual CTA at `navigate("marble_pathway_reveal")` remains in place. Mute toggle unchanged. Registered passage is not bypassed — the route sequence from eval result to Marble Directory is preserved.

---

## BUILD

```
npm run build:registry
✓ 103 modules transformed
✓ built in 7.84s
dist-registry/assets/index-BRq4Qeqj.js   539.01 kB
dist-registry/assets/index-D1PySCUU.css  237.10 kB
dist-registry/index.html
dist-registry/ai-operations-assessment/index.html
dist-registry/structural-drift/index.html
dist-registry/undrifted/index.html
```

Build passed. No TypeScript errors. Chunk size warning is a pre-existing condition, not a regression.

---

## RESULT

### Validation

1. **CSS selector consuming `--registry-obsidian-eval-result-visual`**: YES — `[data-material-family="obsidian"][data-layout-contract="result_gate"]` sets `--registry-source-image: var(--registry-obsidian-eval-result-visual, none)` in `registry.visual-system.css`

2. **Eval result surface uses `obsidian_eval_result_surface_visual_v1.webp`**: YES — the runtime sets `--registry-obsidian-eval-result-visual: url("...")` in `chamberStyle` from `obsidianEvalResultVisualUrl`; the new selector feeds this into the `::before` layer background

3. **`marble_accent_reference` no longer codexstone**: YES — `is_active = false` confirmed via SQL RETURNING; `marbleAccentReferenceUrl` resolves to null at runtime

4. **`marble_pathway_reveal` still mounts `MarbleCommerceDirectory`**: YES — no handler or import changed

5. **Passage auto-advances on video end**: YES — `onEnded={() => navigate("marble_pathway_reveal")}` added

6. **Manual CTA still routes to `marble_pathway_reveal`**: YES — unchanged

7. **Lapis files unchanged**: YES — no Lapis files touched

8. **MAP pricing/contracts unchanged**: YES — no commerce contract data touched

9. **No c3 Key / SEAT / wallet activation**: YES — none touched

10. **Build passes**: YES — `✓ built in 7.84s`

11. **OAR1 written**: this document

---

## COMMIT

`2d318ba` — pushed to `origin/measures`

Files changed:
- `src/measures_registry/registered_runtime/styles/registry.visual-system.css` — CSS binding added
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` — `onEnded` added
- `dist-registry/` — rebuilt artifacts
- `docs/oar/measures_registry/` — OAR governance docs

---

## CLOSES

OAR2: docs/oar/measures_registry/oar2_correct_obsidian_eval_result_css_binding_marble_accent_reference_and_passage_auto_advance_v1.meta.md

## NEXT

1. **Deploy verification** — confirm live at `https://measuresregistry.com/?surface=measures_assessment` that:
   - Obsidian eval result visual is applied at the result gate
   - Marble Chamber Directory loads without accent image
   - Passage video auto-advances to Marble Directory

2. **Cloudflare Pages env vars** — must be configured manually in CF dashboard:
   - `STRIPE_SECRET_KEY` (from `.env.local`)
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase dashboard → Settings → API)
   - `STRIPE_WEBHOOK_SECRET` (after Stripe dashboard webhook registration)

3. **Chamber-set registration closeout**

4. **Lapis / SEO / socials**
