---
document_type: oar1
authority_level: proof
document_scope: publication_design_audit
title: OAR1 — Audit unDrifted Editorial Design Authority and Drift Origin
closes: OAR/OAR2/publication/oar2_audit_undrifted_editorial_design_authority_and_drift_origin_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Audit unDrifted Editorial Design Authority and Drift Origin

**This is an audit only. No styling, renderer, DB metadata, or routing was changed.** The only external action taken was a read-only browser screenshot of the live production page for comparison.

## Summary Answer

- **No seated Publication/Editorial Design Profile exists for unDrifted, and never has.** What looks like one (`style_contract_key: undrifted_publication_style_v1`, `landing_contract_key: undrifted_issue_001_landing_v1`) is a **content/brand governance label**, not a visual design specification — it was seated on 2026-06-05 for claim-boundary/CTA-boundary tracking on a since-superseded table, carried forward as an inert string, and is emitted into the DOM as a `data-*` attribute that **no CSS selector in the codebase targets**.
- The actual visual layout is **100% CSS-only**, in `lapis.css`, and has used the **sitewide generic design-token set** (shared `content_max_width: 1080px`, same tokens obsidian/marble/crystal use) since the file's first commit. It was never given unDrifted-specific wide-format/magazine tokens.
- A **real, separate drift event did occur and was already fixed** the day before this audit (commit `7bb4b80`, 2026-07-06): ~1,608 lines of three superseded prior unDrifted redesigns, left behind in `registry.visual-system.css`, were loading after and overriding `lapis.css` via higher specificity, plus an inline light background image was overriding the intended dark theme. That's been removed.
- **What the operator is seeing now is not a new regression** — it's `lapis.css`'s baseline design, fully exposed now that the override bug is gone. That baseline was built within the sitewide generic constraints from day one, so it reads as "component-assembled" rather than "governed as an editorial issue" — confirmed by a live screenshot of production, below.

---

## 1. Seated Design Authority — Inspection

| Candidate location | Finding |
|---|---|
| `measures_design_token` (registry_key = `measures_registry`) | 53 tokens, all **sitewide/generic** (crystal/lapis/obsidian/marble colors, `content_max_width: 1080px`, `text_max_width: 680px`, spacing, typography scale). **None are unDrifted-specific or editorial/magazine-specific.** |
| `measures_encounter_def.metadata` for `encounter_key = 'undrifted'` | Top-level keys: `brand_copy`, `cover_story`, `brand_assets`, `issue_record`, `footer_record`, `media_locator`, `content_source`, `style_contract`, `content_profile`, `next_issue_teaser`, `role_call_feature`, `assessment_feature`, `featured_article_set`, `landing_design_contract`, `source_oar2`. `style_contract` = `{"key": "undrifted_publication_style_v1"}` — **only a key, no layout values.** `landing_design_contract` = `{"hero": {"cover_eyebrow": "..."}, "insights_eyebrow": "...", "insights_heading": "...", "style_contract_key": "...", "landing_contract_key": "undrifted_issue_001_landing_v1"}` — **copy strings and two more inert keys, no layout/dimension/grid values.** |
| `measures_encounter_surface_assignment` | Two rows for `registry_key = 'undrifted'`: `lapis_chamber_encounter` → `/undrifted`, `publication_dispatch` → `/publication/structural_drift`. `metadata` column present but carries routing/style-profile-key metadata already covered above, not layout authority. |
| Migrations referencing `undrifted`/`design_token`/`style_contract` | `seat-undrifted-publication-brand-style-contract-v1.sql` (2026-06-05) — seated `style_contract_key: undrifted_publication_style_v1` onto `measures_publication_registry` (a **different, now-superseded** table from the pre-FREE-cutover publication architecture) as part of a brand/claim-boundary contract (`claim_boundary`, `cta_boundary`, CTA copy) — **not a visual design system.** `202606300017_seed_undrifted_encounter_def.sql` later ported that same key into the current `measures_encounter_def` row as inherited metadata, alongside the actual display copy. No migration anywhere defines unDrifted-specific layout tokens (grid columns, cover proportions, wide-format breakpoints, etc.). |

**Classification (per OAR2's own taxonomy):** the design authority exists only as a **CSS-only implementation** (`lapis.css`), dressed with **inert metadata labels** that imply a design-profile layer was intended but never built. Functionally, for layout purposes, this is **absent / not seated**.

## 2. Renderer Consumption — Inspection

- `registryResolver.ts` queries `measures_design_token` unconditionally (all active rows for `registry_key = measures_registry`, sitewide) and `measures_encounter_def` for the `undrifted` key (allowlisted). No unDrifted-specific design-token query exists or could exist today — the token table has no rows scoped to unDrifted.
- `MeasuresRegistryOrchestrator.tsx` (`registryTokenStyle`, ~line 169) converts every active design-token row into a CSS custom property via `cssTokenName(token_key, media_query)` and passes that single sitewide style object to every surface, including `UnDriftedIndex`. There is no per-surface or per-publication token override mechanism.
- `LapisChamberRenderer.tsx`'s `UnDriftedIndex` reads `style_contract`/`landing_design_contract` from `encounter.encounterDef.metadata` and emits them as `data-style-contract` / `data-landing-contract` attributes on the root `<main>` (confirmed at lines ~196–198). **Grepped the entire `src/` tree for `undrifted_publication_style_v1` and `undrifted_issue_001_landing_v1` as CSS selector values — zero matches outside this one TSX file.** No stylesheet, anywhere, targets `[data-style-contract="undrifted_publication_style_v1"]` or `[data-landing-contract="undrifted_issue_001_landing_v1"]`.
- Actual layout regions (`undrifted-shell`, `undrifted-masthead`, `undrifted-cover`, `undrifted-editor-feature`, `undrifted-insights-grid`, `undrifted-role-call`, etc.) are governed entirely by class-name selectors in `lapis.css`, scoped under `.measures-registry-runtime[data-layout-contract="undrifted_publication"]`. These are **hardcoded layout rules**, not driven by any DB value beyond the shared `--registry-content-max-width` (etc.) custom properties.
- **No profile-based layout switch exists.** There is exactly one CSS implementation of the unDrifted surface; the `data-style-contract`/`data-landing-contract` attributes have no conditional consumer.

**Conclusion:** layout is fully hardcoded CSS, generic-token-bound; the "design profile" metadata is decorative, present in the DOM but functionally dead.

## 3. Drift Origin — Git History

Traced `lapis.css` history (`git log --follow`):

```
46d8a7b  Build: LapisChamberRenderer — relational encounter environment       (origin — .undrifted-shell created here, already using shared --registry-content-max-width, fallback 70rem)
cd700e3  Fix intro surface, tone label, undrifted mark, motion CDN urls, copyright year 2026
ab09a6d  OAR2: resolve crystal/obsidian QA — style, audio, scroll, orientation content
7bb4b80  OAR2/OAR1: resolve final launch blockers — Stripe verification, header nav, unDrifted flagship cover   (2026-07-06, most recent)
```

**The generic, shared-token, non-bespoke layout approach is original to the file** (`46d8a7b`) — it is not something that drifted away from a once-bespoke design; unDrifted was built this way from its first commit.

**A separate, real drift event did happen and has already been fixed**, one day before this audit, in `7bb4b80` (2026-07-06). That commit's own message states it root-caused the "/undrifted desktop scroll trap" and "doesn't feel like a flagship issue" complaints to **three overlapping, superseded unDrifted redesigns (~1,608 lines) left in `registry.visual-system.css`**, loading after `lapis.css` and overriding it via higher CSS specificity — plus an inline light background image overriding the intended dark theme via inline-style precedence. Both were removed. The same commit also enlarged the masthead wordmark, added the cover slogan, linked the cover headline to the assessment route, and tightened section spacing (cosmetic improvements layered on the existing generic-token structure, not a new design system).

**So: this OAR2's own git-history question has a dual answer.** The catastrophic drift (dead CSS winning by specificity) is real, identified, and already resolved as of yesterday. The residual "doesn't feel governed as an editorial issue" complaint is not drift at all — it's `lapis.css`'s original, always-generic baseline, now fully visible with the override bug gone.

## 4. Current Surface vs. Intended Editorial Design Requirements

Verified live via a real browser screenshot of `https://measuresregistry.com/undrifted` at 1440×900 (desktop viewport), taken during this audit — not inferred from CSS alone.

| Requirement | Status | Evidence |
|---|---|---|
| Magazine-cover feel | **Partially satisfied** | Banner + large italic wordmark + issue rail present; but overall page reads as a stacked sequence of bordered content blocks, not a unified cover composition. |
| Active use of viewport | **Failed** | At 1440px width, content is bound to `min(var(--registry-content-max-width, 70rem), 100%)` = 1080px (the shared sitewide token) — noticeably centered with unused space on both sides, confirmed visually in the screenshot. |
| Strong masthead + issue identity | **Partially satisfied** | Masthead (black banner box) is bold, but sits visually disconnected from the issue rail/cover below it — different background treatment, reads as two stacked pieces rather than one cover. |
| Cover story as dominant feature | **Partially satisfied** | Present (2-col image + headline), but modest relative to full viewport — doesn't dominate the page the way a print/digital magazine cover does. |
| Assessment CTA as launch center | **Failed** | Renders as a bordered callout box (`undrifted-editor-feature`) visually identical in weight to the sections above/below it — reads as "a card," not the centerpiece of the launch. |
| Featured articles as editorial spread, not blog list | **Failed** | `undrifted-insights-grid` renders exactly two small thumbnail+text cards, side by side — structurally indistinguishable from a generic blog "related posts" grid. |
| Publication identity stronger than generic page layout | **Partially satisfied** | Copy and branding (unDrifted wordmark, issue metadata) are distinct; layout chrome (borders, spacing, card treatment) is shared with the rest of the site's generic component style. |
| No SaaS/card-stack feel | **Failed** | Role Call, Next Issue, and email-capture sections are each a bordered rectangle stacked vertically — reads as a SaaS landing page's feature-list pattern. |
| Issue structure repeatable for future issues | **Satisfied (architecturally)** | Content is fully DB-driven off `encounter.encounterDef.metadata`; a second issue could populate the same component tree without code changes (modulo the still-open Publication Release content-authority question from the prior OAR2). |

**4 of 9 requirements failed, 4 partially satisfied, 1 fully satisfied.** This matches the OBSERVED symptoms in the OAR2 essentially point for point.

## 5. Recommended Restoration Path

**Seat a missing Publication Design Profile** — this is the only option that fits the evidence. Specifically not:
- *"Bind existing seated design profile to renderer"* — there is nothing real to bind; the seated keys are content-governance labels, not layout data.
- *"Repair CSS regression"* — already done, in `7bb4b80`, yesterday. Nothing currently overrides `lapis.css`.
- *"Repair renderer region mapping"* — regions map correctly to DB copy; the gap is layout authority, not wiring.
- *"Revert specific commit"* — there is nothing to revert to; the generic-token baseline is original, not a reverted-from-better state.

**Recommended shape of the follow-up OAR2** ("seat missing Publication Design Profile"): define unDrifted-specific design tokens/layout rules (e.g. a wider `--undrifted-content-max-width` distinct from the sitewide `--registry-content-max-width`, a genuine full-bleed or asymmetric cover treatment, a differentiated "launch CTA" visual weight, and an editorial-spread treatment for featured articles) either as (a) new rows in `measures_design_token` scoped to unDrifted, consumed via new CSS custom properties, or (b) a documented CSS-only redesign of `lapis.css`'s unDrifted rules that intentionally departs from the shared token set — and, either way, retire or genuinely wire the currently-inert `style_contract_key`/`landing_design_contract_key` so they stop implying an authority that doesn't exist.

## 6. Relationship to Publication Release Pipeline

This audit does not replace `oar2_establish_undrifted_publication_release_pipeline_v1` (governs content-authority: which articles/banners render) — it's orthogonal, governing presentation instead. Per the OAR2's own instruction: **recommend Publication Design Profile be seated before or alongside Publication Release**, since both ultimately land in the same `measures_encounter_def` row for `encounter_key = 'undrifted'`, and sequencing a design-profile migration alongside (or just before) the content-sync migration avoids two separate touches to the same live row.

---

## Blockers

None for this audit itself — it completed. The only "blocker" is the absence itself: there is no seated Publication Design Profile to restore-by-reference; a new one must be designed and seated, which is explicitly out of scope for this audit OAR2.

## Files Inspected (no changes made)

```
src/measures_registry/encounter_renderer/resolver/registryResolver.ts
src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx
src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx
src/measures_registry/encounter_renderer/styles/encounters/lapis.css
src/measures_registry/encounter_renderer/styles/registry.visual-system.css
docs/oar/measures_registry/oar1_seat_undrifted_publication_brand_and_style_contract_v1.meta.md
docs/oar/measures_registry/oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1.meta.md
supabase/migrations/202606300017_seed_undrifted_encounter_def.sql
supabase/migrations/202606230002_featured_article_set_article_url_and_teasers.sql
supabase/migrations/202606230003_seat_undrifted_cover_surface_contract_fields.sql
```

## DB Read-Only Queries Run (project zfihrspxvennjzazxcbj, Measures Codex)

- `measures_design_token` — full active token list for `registry_key = 'measures_registry'`
- `measures_encounter_def.metadata` top-level keys and `style_contract`/`landing_design_contract`/`source_oar2` values for `encounter_key = 'undrifted'`
- `measures_encounter_surface_assignment` rows for `registry_key = 'undrifted'`

## External Verification

Live production screenshot of `https://measuresregistry.com/undrifted` at 1440×900, captured during this audit (saved to local scratch, not committed to the repo — diagnostic evidence only, not a registered asset).

## Next Recommended OAR2

`oar2_seat_undrifted_publication_design_profile_v1` — define and seat a bespoke editorial/magazine design authority for unDrifted (tokens and/or CSS), sequenced before or alongside the pending Publication Release content-authority decision, and retire the currently-inert `style_contract_key`/`landing_design_contract_key` once real authority replaces them.
