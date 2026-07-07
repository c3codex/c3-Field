---
document_type: oar1
authority_level: proof
document_scope: publication_launch
title: OAR1 - Finalize unDrifted Launch Projection and Encounter Profile
closes: OAR/OAR2/publication/oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Finalize unDrifted Launch Projection and Encounter Profile

## Summary

Both remaining ownership gaps from the synchronization OAR1 are resolved. A Publication Encounter Profile now exists as the governed composition authority, is projected into Encounter Projection, and is consumed by FREE via data attributes and CSS custom properties — no hardcoded issue content, no new libraries, no competing layout authority. Verified locally (build + dev server + Playwright) at laptop/desktop/tablet/mobile: real, visible composition improvement, zero console errors, zero horizontal overflow, all links and CTAs correct. **Not deployed to production** — see Blockers.

---

## 1. Deployment Status

**Prepared, not pushed.** `npm run build:registry` completed successfully (109 modules, clean build, route heads generated for `/ai-operations-assessment`, `/structural-drift`, `/undrifted`). The resulting `dist-registry/` output is staged in this commit, matching this repo's established convention of committing build output alongside source changes. **Git push to `origin/measures` was deliberately not performed** — this branch is now 9 commits ahead of remote from this session's OAR chain, and pushing/triggering a Cloudflare Pages production deploy is a shared-state, publicly-visible action outside the scope of what this OAR2 chain's standing execution authority covers by default. Recommend the operator confirm before this is pushed. All verification below was performed against a local build and dev server, not production.

## 2. Files Changed

```
src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx   (modified — reads section_labels/encounter_profile, emits composition data-attrs + viewport CSS vars)
src/measures_registry/encounter_renderer/styles/encounters/lapis.css        (modified — profile-driven composition rules, all scoped under data-attributes)
scripts/regenerate-undrifted-encounter-projection.cjs                        (modified — now also projects assessment_feature, section_labels, encounter_profile; landing_design_contract no longer preserved-as-gap, sourced canonically)
supabase/migrations/20260707224818_..._encounter_profile.sql                 (new — seats canonical ownership in Publication Registry)
supabase/migrations/20260707224927_project_..._encounter_profile.sql        (new — projects it into Encounter Projection)
dist-registry/**                                                             (build output — see §1)
```

## 3. Migrations Created/Applied

Both applied live against project `zfihrspxvennjzazxcbj` (Measures Codex) via direct migration, then mirrored into `supabase/migrations/`:

1. `20260707224818_seat_undrifted_assessment_feature_section_labels_and_encounter_profile` — additive `jsonb` merge onto `measures_publication_registry.metadata` for `publication_key='undrifted'`. No existing field touched.
2. `20260707224927_project_undrifted_assessment_feature_section_labels_and_encounter_profile` — additive merge onto `measures_encounter_def.metadata` for `encounter_key='undrifted'`, projecting the four new/changed fields.

## 4. Ownership Resolution — assessment_feature

**Resolved via the preferred route.** Seated as canonical `measures_publication_registry.metadata.assessment_feature`, using the exact copy already live (not invented): `feature_title: "AI OPERATIONS ASSESSMENT"`, `cta_label: "ASSESS THE ENVIRONMENT"`, `route_path: "/ai-operations-assessment"`, etc. Re-projected into `measures_encounter_def` by the updated regeneration script/migration. `LapisChamberRenderer.tsx` required no read-path change here — it already read `meta?.assessment_feature`; only the upstream source changed from "nowhere" to "Publication Registry."

## 5. Ownership Resolution — landing_design_contract

**Resolved via explicit supersession, per the OAR2's alternate-acceptable route** ("If landing_design_contract is superseded by Publication Encounter Profile, record that explicitly and prevent both from acting as competing layout authorities"):

- Its copy fields (`cover_eyebrow`, `insights_eyebrow`, `insights_heading`) — genuine publication content, not composition — moved to a new canonical `measures_publication_registry.metadata.section_labels`.
- Its two `*_contract_key` pointer fields are retained only for historical trace, now carrying `standing: "superseded"` and `superseded_by: "undrifted_publication_encounter_profile_v1"`.
- `LapisChamberRenderer.tsx` now reads copy from `section_labels` first (falling back to the legacy `landing_design_contract` shape only if absent), and the `data-landing-contract` DOM attribute now emits the new `encounter_profile.profile_key` instead of the retired `landing_contract_key` — confirmed live via DOM inspection: `data-landing-contract="undrifted_publication_encounter_profile_v1"`.
- **No competing layout authority**: `landing_design_contract` no longer drives any rendering decision: it is present in the projection purely as an audit trail.

## 6. Publication Encounter Profile — Standing

**Seated** at `measures_publication_registry.metadata.encounter_profile`, `profile_key: undrifted_publication_encounter_profile_v1`, with all eleven required fields from the OAR2's minimum list (`route_scope`, `encounter_type`, `viewport_contract`, `region_order`, `region_weights`, `masthead_behavior`, `cover_story_behavior`, `assessment_feature_behavior`, `featured_article_behavior`, `role_call_behavior`, `responsive_rules`, `forbidden_patterns`). Governs composition only — no article/issue content lives in it. Projected into `measures_encounter_def.metadata.encounter_profile` by the same regeneration mechanism as everything else, not a separate ad hoc path.

## 7. Wiring Into Projection and FREE

- **Allowed path used exactly as specified**: profile metadata is projected into `measures_encounter_def` (§6), consumed in `UnDriftedIndex` by reading `meta?.encounter_profile`, exposed as `data-masthead-behavior`, `data-cover-story-behavior`, `data-assessment-behavior`, `data-featured-article-behavior`, `data-role-call-behavior` attributes on the root element, plus `viewport_contract` values threaded through as CSS custom properties (`--undrifted-desktop-max-width`, `--undrifted-tablet-max-width`, `--undrifted-mobile-max-width`) merged into the existing inline `style` alongside the already-reconnected `style_contract.tokens`.
- **Nothing hardcoded**: every behavior value read from DB; `lapis.css` only ever selects on the resulting `data-*` attributes/CSS vars, never on issue-specific content.
- **CSS changes, all explicitly profile-referenced** (each carries a comment naming the profile field and this OAR2):
  - `.undrifted-shell` desktop width override (`@media (min-width: 1024px)`, matching the profile's own `desktop_breakpoint`) — reads `--undrifted-desktop-max-width`.
  - Masthead rule + issue rail accent unification, scoped to `[data-masthead-behavior="unified_with_issue_rail"]`.
  - Cover grid ratio + headline size, scoped to `[data-cover-story-behavior="dominant_full_width_on_desktop"]`, desktop-only.
  - Assessment card accent border/wash, scoped to `[data-assessment-behavior="elevated_accent_primary_cta"]`.
  - Featured-article cover column width, scoped to `[data-featured-article-behavior="editorial_spread_large_cover"]`, desktop-only.
  - Role Call de-boxed pull-quote treatment, scoped to `[data-role-call-behavior="borderless_editorial_pullquote"]`.
- No unregistered/unreferenced CSS was added — every new rule is gated by a profile-sourced selector.

## 8. Launch Surface Verification

Performed against a local production build (`npm run build:registry`, then `npm run dev:registry` for interactive verification — build output identical to what a deploy would ship) via Playwright, not production (see §1).

| Check | Result |
|---|---|
| Desktop 1440px | Verified — wider content column, dominant cover headline, accented assessment card, larger article covers, de-boxed Role Call, unified masthead/issue-rail line. |
| Laptop 1280px | Verified — desktop composition rules active (≥1024px breakpoint), no overflow. |
| Tablet 834px | Verified — below the profile's desktop breakpoint, standard measure and card grid retained unchanged, no overflow. |
| Mobile 390px | Verified — single-column stack, standard readable width, no overflow. Role Call's borderless treatment (not width-gated) renders correctly at this size too. |
| Scroll behavior | No unexpected scroll traps observed at any tested width. |
| Article links | DOM-verified: both "Read the Dispatch →" links resolve to their live Paragraph URLs. |
| Assessment CTA route | DOM-verified: both the header nav link and in-page CTA resolve to `/ai-operations-assessment`. |
| Issue metadata | "ISSUE 001 · JUNE 2026 · LAUNCH EDITION" renders correctly (per the prior synchronization OAR). |
| Publication styling | Obsidian palette + cyan/blue accent tokens render correctly, confirmed via screenshots. |
| Console errors | Zero, at all four tested widths. |
| Horizontal overflow | Confirmed absent via `document.documentElement.scrollWidth > clientWidth` check at 1440px — `false`. |
| Hidden CTA | Assessment CTA and both article CTAs visible and reachable at every tested width. |
| Route regression | `/undrifted`, `/ai-operations-assessment`, `/about` link targets unchanged; no route map or surface-assignment table touched. |

Typecheck (`npx tsc --noEmit`): clean, both before and after the renderer change.

## 9. Future Expansion — Held

Confirmed not implemented: contributors, social registry, feed, comments, issue archive, magazine flipbook, library route. No new npm dependency installed.

---

## Launch Readiness Assessment

**Code and data are launch-ready. Production is not yet updated.** Every Routed item this OAR2 could resolve locally is resolved: ownership gaps closed, Publication Encounter Profile seated and wired, composition visibly improved and verified responsive at four widths with no regressions. The sole remaining step is a deploy decision, which is deliberately left to the operator rather than executed unilaterally.

## Blockers

1. **Push/deploy not performed** — awaiting explicit confirmation. Once confirmed: `git push`, then either wait for Cloudflare Pages' connected-branch auto-build or run whatever manual deploy step the operator uses (no `wrangler.toml`/local deploy script exists in this repo to infer one).
2. None of the DB-only changes (assessment_feature, section_labels, encounter_profile, landing_design_contract supersession) require a deploy — they're already live, since `/undrifted` reads `measures_encounter_def` client-side at runtime. Only the `LapisChamberRenderer.tsx`/`lapis.css` changes need a build+deploy to reach the public site.

## Next Recommended OAR2

None required to reach launch — this closes the publication-authority chain (audit → audit → synchronize → finalize). Any further unDrifted work belongs to the explicitly-held future scope (contributor/social/feed/library) and should wait for its own OAR2 per this chain's repeated instruction.
