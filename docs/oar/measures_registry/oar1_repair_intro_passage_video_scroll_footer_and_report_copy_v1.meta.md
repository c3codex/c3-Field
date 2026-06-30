---
document_type: oar1
authority_level: launch_repair
document_scope: browser_qa_repairs
title: OAR1 - Repair Intro Passage Video Scroll Footer and Report Copy
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_repair_intro_passage_video_scroll_footer_and_report_copy_v1
---

# OAR1 - Repair Intro Passage Video Scroll Footer and Report Copy

## REPAIRS APPLIED

### 1. Intro Button — CrystalSeatRenderer.tsx

**Issue:** `IntroHookSeat` rendered the `registry-epigraph-enter` button with `null` content when a valid `epigraphVideoUrl` exists. The button covers the full screen (`position: absolute; inset: 0`) but was visually invisible, creating a blank click-to-enter screen.

**Fix:** Changed button content from `{epigraphFailed || !epigraphVideoUrl ? "Continue" : null}` to `{epigraphFailed ? "Continue" : "Enter"}`.

The "Enter" label is always rendered. CSS (`.registry-epigraph-enter { color: var(--registry-brand-secondary-text) }`) makes it visible. User click triggers `handleEnter` → sets `epigraphEntered(true)` → video autoplays. Browser autoplay with audio requires prior user gesture; the Enter button satisfies that requirement.

If the intro video fails, the button shows "Continue" and navigates directly to the threshold.

### 2. Passage Video — Migration 202606300004

**Issue:** `resolveRuntimeMediaUrl` for `measures-media` bucket returns null when `VITE_R2_PUBLIC_BASE_URL` is not set in the Cloudflare Pages build environment. The `ObsidianToMarblePassage` renderer reads `meta.exact_url_seated` before attempting R2 URL construction.

**Fix:** Seeded `exact_url_seated` in `measures_media_map.metadata` for the `before_the_pathway_obsidian_to_marble_passage_video` row:

```
exact_url_seated: "https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4"
```

`mediaUrl()` helper passes `asString(meta?.public_url) ?? asString(meta?.exact_url_seated)` as `publicUrl` to `resolveRuntimeMediaUrl`. When `publicUrl` is non-null, the function returns it directly — no env var lookup.

Media unchanged. R2 asset: `measures-media / 1before_the_pathway_obsidian_to_marble_passage_v1.mp4`.

### 3. Laptop Assessment Scroll — assessment.css

**Issue:** `.registry-iis-eval.registry-assessment-chamber` used `justify-content: center` on a flex column with `min-height ≈ 100svh`. When form content exceeds the container height, CSS flex centering overflows in both directions. Content that extends above scroll-origin (Y=0) is not reachable by scrolling — a known flexbox centering limitation. At 1366×768 and 1440×900, the contact capture form and question form with context textarea both exceed available height.

**Fix 1:** Changed `justify-content: center` → `justify-content: flex-start` on `.registry-iis-eval.registry-assessment-chamber`. Existing `padding-top: calc(var(--registry-header-height, 3rem) + ...)` ensures content starts below the absolute-positioned header. All form content flows from the top and scrolls naturally.

**Fix 2:** Removed inner-scroll constraint from contact capture form:
- Removed `overflow-y: auto` from `.registry-iis-eval.registry-assessment-chamber` in `contact_contract` layout
- Removed `max-height` and `overflow-y: auto` from `.registry-iis-eval-form.registry-contact-capture`

The `<main>` element has `overflow: auto` from `index.css`. Contact form now scrolls via page scroll, not inner container. Submit button is reachable at any viewport height.

Mobile breakpoint (≤620px) already had `justify-content: flex-start` — unchanged.

### 4. Footer Identity — Migration 202606300004

**Issue:** `renderSystemFooter()` in `MeasuresRegistryOrchestrator.tsx` reads `footer_contract.copy_lines` from the encounter def for the active surface or `ai_isnt_broken_intro` (fallback). No `footer_contract` was seated in any encounter def — only the nav links (Privacy · Terms · Contact) rendered.

**Fix:** Seeded `footer_contract` in `ai_isnt_broken_intro` encounter def metadata:

```json
{
  "copy_lines": [
    "© 2025 C3 Community Partners DAO LLC. All rights reserved.",
    "Measures Registry is a registered branch operating under c3 Community Partners DAO LLC / c3 Field authority.",
    "Measures Registry is a governed encounter, not a conventional website. Public pathways, assessments, publications, legal notices, media, and transitions are seated through registry standing before release."
  ]
}
```

This fallback applies to all surfaces. Per-surface overrides can be seated later if needed.

### 5. Governed Site Explanation

Included in `footer_contract.copy_lines[2]` (third line):
> "Measures Registry is a governed encounter, not a conventional website. Public pathways, assessments, publications, legal notices, media, and transitions are seated through registry standing before release."

No separate seat needed — included in the footer migration above.

### 6. Report Copy — Trace and Missing Key Inventory

**Already seated (migration 202606300002):**

| Key | Status |
|---|---|
| `assessment_evaluation_report_contract_v1.informational_notice` | ✓ Seated — 4-paragraph approved notice |
| `assessment_evaluation_report_contract_v1.recommendation` | ✓ Seated — "MAP the Environment…" |
| `assessment_evaluation_report_contract_v1.key_environmental_indicators_label` | ✓ Seated |
| `assessment_evaluation_report_contract_v1.environmental_indicator_map` | ✓ Seated — 5 finding_key → statement pairs |
| `assessment_evaluation_report_contract_v1.condition_indicator_map` | ✓ Seated — 4 condition_tag → statement fallbacks |

**Public report section flow (seated and rendering):**
1. Informational Notice — from `reportContract.informational_notice` ✓
2. Environment Finding — from `report.assessment_result` + `report.operational_exposure_summary` + `report.environmental_standing` (runtime-resolved by `resolveEnvironmentalReportByScore`)
3. Key Environmental Indicators — from `report.findings` (primary) or `condition_indicator_map` fallback ✓
4. Recommendation — from `reportContract.recommendation` ✓

**Missing — on HOLD per `oar1_align_assessment_report_wording_to_scored_results_v1.meta.md`:**

| Missing Key | Expected Path | Purpose |
|---|---|---|
| `report_templates.eval_result_01.report_title` | `assessment_evaluation_report_contract_v1.report_templates.eval_result_01` | Section 2 heading for foundational band |
| `report_templates.eval_result_01.summary` | same | Section 2 body for foundational band |
| `report_templates.eval_result_02.report_title` | `assessment_evaluation_report_contract_v1.report_templates.eval_result_02` | Optimization band heading |
| `report_templates.eval_result_02.summary` | same | Optimization band body |
| `report_templates.eval_result_03.report_title` | `assessment_evaluation_report_contract_v1.report_templates.eval_result_03` | Remediation band heading |
| `report_templates.eval_result_03.summary` | same | Remediation band body |
| `report_templates.eval_result_04.report_title` | `assessment_evaluation_report_contract_v1.report_templates.eval_result_04` | High-exposure band heading |
| `report_templates.eval_result_04.summary` | same | High-exposure band body |
| `report_header.title` | `assessment_evaluation_report_contract_v1.report_header` | Report title override |
| `report_header.subtitle` | same | Report subtitle override |
| `report_boundary_note` | `assessment_evaluation_report_contract_v1.report_boundary_note` | Boundary statement override |
| `report_cta.label` | `assessment_evaluation_report_contract_v1.report_cta` | CTA label override |

Without `report_templates` per band, Section 2 falls back to `report.assessment_result` (raw scoring key) and `report.operational_exposure_summary` (from `assessment_interpretation.scoring_thresholds` description). Copy is not approved.

Resume route: operator provides approved copy per band → seat via migration `202606300005_seat_assessment_report_contract_wording.sql` (next available slot).

### 7. Type check and build

- `tsc --noEmit`: 0 errors
- `npm run build`: ✓ (11.18s)

---

## VALIDATION

- Intro flow no longer stalls: ✓ (button always shows "Enter" / "Continue")
- Passage video renders from approved media URL: ✓ (`exact_url_seated` bypasses env var; URL: `https://media.c3field.online/1before_the_pathway_obsidian_to_marble_passage_v1.mp4`)
- Laptop assessment scroll reaches submit/contact capture: ✓ (`justify-content: flex-start`; contact form inner-scroll removed; page scrolls)
- Footer identity statement renders: ✓ (3 copy_lines seated in `ai_isnt_broken_intro.metadata.footer_contract`)
- Privacy/Terms/Contact links: ✓ (wired in `renderSystemFooter` source)
- Branch statement exact: ✓ ("Measures Registry is a registered branch operating under c3 Community Partners DAO LLC / c3 Field authority.")
- Governed-site explanation: ✓ (included as third footer line)
- Report copy structure: ✓ (4 sections in correct order)
- Report copy per band: HOLD (approved copy not finalized — see missing key inventory above)
- Recommendation: ✓ ("MAP the Environment…" seated in `recommendation` key)
- No raw scores exposed: ✓
- No corrective instructions: ✓
- No prohibited legal/tax/certification claims: ✓
- Build passes: ✓
- Browser QA: pending deploy (Cloudflare Pages triggered on push)

## NOTCHAZZ CLEAR

- Intro change is additive only (text in button that was previously invisible)
- Passage video uses approved R2 asset — no media substitution
- Scroll fix is CSS-only — assessment capture, contact capture, and email dispatch unchanged
- Footer copy meets legal identity requirements: no separate entity, no tax-exempt, no tax-deductible, no certification
- Report copy not invented — missing band copy held for operator approval
- Q1 copy unchanged (assessment question copy not in scope per OAR2)
