---
document_type: oar1
authority_level: launch_repair
document_scope: free_styling_authority
title: OAR1 - Inventory and Normalize FREE Styling Authority
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_inventory_and_normalize_free_styling_authority_v1
---

# OAR1 - Inventory and Normalize FREE Styling Authority

## NORMALIZATION APPLIED

Three changes applied:

1. All 12 CSS files moved from `registered_runtime/styles/` to `encounter_renderer/styles/`
2. `encounter_renderer/styles/registry.encounter.css` import paths updated from `../../registered_runtime/styles/` to `./`
3. `registered_runtime/styles/registry.encounter.css` replaced with a redirect stub to `../../encounter_renderer/styles/registry.encounter.css`
4. Dead `mediaUrl(MediaRow)` export removed from `encounterRendererUtils.ts` (line 521–529 original)
5. Dead `sectionCopy(LandingSectionRow)` export and `SectionCopy` type removed from `encounterRendererUtils.ts` (lines 536–620 original)
6. Stale type import `import type { LandingSectionRow, MediaRow } from "../../registered_runtime/registeredRuntimeTypes"` removed from `encounterRendererUtils.ts`

Build passes. CSS bundle byte-identical before and after move (282.73 kB gzip 41.17 kB).

---

## ACTIVE CSS FILE INVENTORY

### Entry points

| File | Consumer | Path |
|---|---|---|
| `encounter_renderer/styles/registry.encounter.css` | `MeasuresRegistryOrchestrator.tsx` | canonical FREE entry point |
| `registered_runtime/styles/registry.encounter.css` | `MeasuresRegistryRuntimeRegistered.tsx` | redirect stub → encounter_renderer |

### File inventory and classification

| File | Lines | Primary classification |
|---|---|---|
| `registry.tokens.css` | 18 | `design_token_candidate` (hardcoded obsidian fallbacks) + `layout_utility_keep_in_css` (shell dimensions) |
| `registry.layout.css` | 10 | `layout_utility_keep_in_css` |
| `registry.materials.css` | 64 | `style_profile_candidate` (material family CSS var overrides — already `data-material-family` driven) |
| `registry.buttons.css` | 99 | `keep_in_css` (interaction states, `:hover`, `:focus-visible`, `:active`, `:disabled` must stay in CSS) |
| `registry.footer.css` | 41 | `keep_in_css` (layout utility) |
| `registry.visual-system.css` | 2522 | `chamber_profile_candidate` (undrifted publication, MAP surface, crystal/lapis layout contracts, result_gate) + `style_profile_candidate` (animation, gradient spec) |
| `encounters/path-choice.css` | 121 | `chamber_profile_candidate` (`data-surface="landing_path_choice"` locked rules) + `responsive_utility_keep_in_css` |
| `encounters/passage.css` | 206 | `encounter_profile_candidate` (passage surface) + `media_profile_candidate` (video sizing) |
| `encounters/assessment.css` | 436 | `encounter_profile_candidate` (assessment chamber) + `responsive_utility_keep_in_css` |
| `encounters/about.css` | 314 | `encounter_profile_candidate` (about surface) + `responsive_utility_keep_in_css` |
| `encounters/legal.css` | 63 | `keep_in_css` (reading surface layout, typography scale) |
| `encounters/public_understand.css` | 383 | `encounter_profile_candidate` (understand/lapis) + `responsive_utility_keep_in_css` |

**Total moved: 4277 lines across 12 files**

---

## DB STYLE PROFILE CANDIDATES

Identified from CSS audit. Not implemented in this OAR.

| Candidate profile key | Governs | Source file |
|---|---|---|
| `obsidian_full_bleed_video` | intro video layer, passage video full-bleed | `registry.visual-system.css` + `encounters/passage.css` |
| `obsidian_assessment_surface` | assessment chamber layout, form structure | `encounters/assessment.css` |
| `obsidian_to_marble_passage` | passage surface, video/report phase | `encounters/passage.css` + `encounters/assessment.css` |
| `crystal_split_path_choice` | two-panel path choice split | `encounters/path-choice.css` |
| `crystal_about_surface` | about encounter four-section layout | `encounters/about.css` |
| `lapis_publication_surface` | unDrifted publication cover, grid | `registry.visual-system.css` |
| `marble_map_cards` | MAP pathway cards, scroll layout | `registry.visual-system.css` |
| `assessment_scrollable_form` | assessment form scrollable container | `encounters/assessment.css` |
| `report_result_gate` | result gate scroll authority, CTA placement | `encounters/assessment.css` |
| `legal_reading_surface` | legal document reading container | `encounters/legal.css` |
| `governed_footer` | footer bar, legal links | `registry.footer.css` |

---

## HARDCODED ASSESSMENT COPY STATUS

| Constant | Value | Classification | Action |
|---|---|---|---|
| `ASSESSMENT_PROCESS_TITLE` | `"MEASURES AI OPERATIONAL EVALUATION"` | `content_authority` — no DB replacement | No change — OAR2 rule: no copy change without DB-seated replacement |
| `ASSESSMENT_SUPPORT_LINE` | `"AI reflects the structure of the environment it operates within."` | `content_authority` — no DB replacement | No change |
| `ASSESSMENT_SUB_SUPPORT_LINE` | `"Structure enables acceleration. Ambiguity creates drift."` | `content_authority` — no DB replacement | No change |
| `ASSESSMENT_TITLE` | `"MEASURES AI ENVIRONMENT ASSESSMENT"` | `content_authority` — fallback for `report.assessment_title` (DB-seated replacement IS active) | No change — fallback only, not active display value |

These are content strings, not styling authority. They are out of scope for CSS normalization.

---

## REMAINING REGISTERED_RUNTIME TIES IN ACTIVE SOURCE

After this OAR:

| Tie | Location | Status |
|---|---|---|
| CSS styles | `encounter_renderer/styles/` | RESOLVED — all CSS now under encounter_renderer authority |
| Redirect stub | `registered_runtime/styles/registry.encounter.css` | KEPT — required by `MeasuresRegistryRuntimeRegistered.tsx` (rollback target) |
| Type exports `mediaUrl(MediaRow)` / `sectionCopy` / `SectionCopy` | `encounterRendererUtils.ts` | REMOVED — dead in FREE renderer; canonical is `registeredRuntimeUtils.ts` |
| `LandingSectionRow`, `MediaRow` type import | `encounterRendererUtils.ts` | REMOVED — tied to dead exports |

Remaining registered_runtime dependencies in active FREE source:
- NONE — all CSS authority now under `encounter_renderer/styles/`
- `registeredRuntimeTypes.ts` still active for `MeasuresRegistryRuntimeRegistered.tsx` (rollback target, unchanged)

---

## BUILD VERIFICATION

```
npm run build → ✓ built in 10.91s
CSS bundle: 282.73 kB gzip 41.17 kB (byte-identical before and after CSS file move)
Zero TypeScript errors
Zero CSS import errors
```

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| All 12 active CSS files inventoried and classified | ✓ |
| Remaining runtime style imports identified | ✓ |
| Runtime style imports moved to encounter_renderer/styles/ | ✓ |
| encounter_renderer/styles/registry.encounter.css uses local ./ imports | ✓ |
| registered_runtime/styles/registry.encounter.css is now a redirect stub | ✓ |
| Dead sectionCopy, mediaUrl(MediaRow), SectionCopy removed from encounterRendererUtils | ✓ |
| Stale type import removed from encounterRendererUtils | ✓ |
| DB style profile candidates listed | ✓ |
| No broad redesign performed | ✓ |
| CSS bundle byte-identical after move | ✓ |
| Build passes | ✓ |
| No TypeScript errors | ✓ |
| Browser smoke QA | PENDING — operator action required |

---

## NO VISUAL CHANGES

No rules modified. Files moved. Import paths updated. Dead code removed.
CSS bundle byte-identical confirms zero styling delta.

---

## FINAL DISPOSITION

**STYLE_AUTHORITY_INVENTORY_COMPLETE**

All active CSS files inventoried and classified. Runtime style path authority moved to `encounter_renderer/styles/`. Dead exports removed. DB style profile candidates documented for future OAR.
