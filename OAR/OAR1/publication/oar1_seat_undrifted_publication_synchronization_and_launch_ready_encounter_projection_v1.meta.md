---
document_type: oar1
authority_level: proof
document_scope: publication_synchronization
title: OAR1 - Seat unDrifted Publication Synchronization and Launch-Ready Encounter Projection
closes: OAR/OAR2/publication/oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-07
---

# OAR1: Seat unDrifted Publication Synchronization and Launch-Ready Encounter Projection

## Summary

Encounter Projection (`measures_encounter_def`) has been regenerated from Publication Registry + Publication Dispatch, correcting every concrete drift the two prior audits found or that this pass additionally discovered. The canonical style contract (previously stripped to a bare key) is now reconnected end-to-end — DB → renderer → CSS — and verified live at desktop/tablet/mobile against a local build. No new publication authority was created; no table was merged; no future-scope feature was implemented.

---

## 1. Canonical Ownership — Confirmed

| Layer | Owns | Confirmed this pass |
|---|---|---|
| **Publication Registry** (`measures_publication_registry`) | Publication identity, contracts, architecture, style contract, issue metadata, integrations, branding | Verified as the sole source for every field regenerated below. |
| **Publication Dispatch** (`measures_publication_dispatch`) | Dispatch bodies, published articles, article metadata, article URLs | Verified as the sole source for `featured_article_set` — resolved via `issue_record.section_sequence`, never hand-typed. |
| **Publication Release** (`measures_publication_release`) | Active issue, release state, archive transition, publication state | Not touched this pass — its one row (`undrifted_issue01_release01`) governs the *separate*, still-pending file-registry Issue 01 content decision from the earlier Publication Release OAR2, not the currently-live issue this OAR2 synchronized. No conflict: different issues, correctly left alone. |
| **Encounter Projection** (`measures_encounter_def`) | Render-ready projection only, no independent authority | Regenerated wholesale from the two rows above via a governed, idempotent script/migration — not hand-edited. |

## 2. Encounter Projection Normalized

**Regeneration mechanism:** `scripts/regenerate-undrifted-encounter-projection.cjs` (checked in as the sanctioned, repeatable regeneration path — dry-run by default, `--apply` to write) and mirrored as SQL in migration `20260707211717_regenerate_undrifted_encounter_projection_from_publication_authority` (applied live to project `zfihrspxvennjzazxcbj` via direct SQL first, then re-applied through `apply_migration` so it's recorded in migration history — both produce the identical deterministic result; no local `SUPABASE_SERVICE_ROLE_KEY` was available to run the `.cjs` script directly, so the equivalent SQL was executed and the script committed as the reusable mechanism for future runs).

### Field-by-field disposition

| Field | Canonical source | Action taken | Drift found? |
|---|---|---|---|
| `issue_record` | Publication Registry | Replaced wholesale | **Yes** — `June 2026` (canonical) vs `JULY 2026` (stale projection). Corrected to June 2026. **This is a visible date change on the live page — see Blockers if June 2026 is not actually the intended launch date.** |
| `style_contract` | Publication Registry | Replaced wholesale | **Yes** — projection held only `{"key": "undrifted_publication_style_v1"}`; canonical has the full token set (`--undrifted-bg`, `--undrifted-blue`, `--undrifted-cyan`, etc.), `base_material: obsidian`, `visual_posture`, `texture_contract`, `forbidden_visual_patterns`. Now fully projected. |
| `role_call_feature` | Publication Registry | Replaced wholesale | **Yes** — live copy read "Systems are built by people." / "What role will you play?" (a superseded pre-polish version); canonical (seated later by `oar2_polish_undrifted_issue_001_cover_composition_qa_fixes_v1`) reads "ALL POSITIONS AVAILABLE" / "WHAT IS YOURS?". Corrected. |
| `brand_copy` | Publication Registry, `descriptor_line` preserved from projection | Merged | **Yes** — `principles_line` was "DETECT • MEASURE • CORRECT • GOVERN" (scrambled order) vs canonical "Measure · Detect · Correct · Govern" (matches the footer, which was never scrambled — corroborating evidence). Corrected. `descriptor_line` ("Integrity Governance for AI-Accelerated Systems") has no Publication Registry source — preserved unchanged, not deleted. |
| `next_issue_teaser`, `footer_record` | Publication Registry | Replaced wholesale | No — already matched. Now provably regenerated rather than coincidentally correct. |
| `cover_story`, `brand_assets` | Publication Registry | Replaced wholesale | No visible drift — canonical adds internal tracking fields (`feature_key`, `feature_type`, etc.) not previously projected; rendered content unchanged. |
| `featured_article_set` | Publication Dispatch, resolved via Publication Registry's `issue_record.section_sequence` | Regenerated deterministically | No — resolved to the same two articles (Agents With Keys, Fables & Myths) already live, now provably sourced rather than hand-maintained. Zero unresolved sequence entries. |
| `hierarchy`, `parent_authority`, `primary_series` | Publication Registry | Added (new fields, not previously projected) | N/A — closes the "publication hierarchy metadata" gap named in Routed §2. Informational only; nothing currently renders from them. |
| `assessment_feature` | **No Publication Registry source exists** | **Preserved unchanged** | Standing gap, not corrected — see §6. |
| `landing_design_contract` | **No Publication Registry source exists** | **Preserved unchanged** | Standing gap, not corrected — see §6. |
| `media_locator`, `content_profile`, `directory_key` | FREE-technical, not publication content | Preserved unchanged | Correctly projection-only by design — not drift. |

**Fields deliberately never copied** (governance/credential/compliance metadata with no rendering use): `claim_boundary`, `cta_boundary`, `allowed_cta_labels`, `publication_architecture_contract`, `paragraph_api_publishing_contract`, `buffer_scheduler_contract`, `api_credential_validation_contract`, `social_media_distribution_contract`, `logo_contract`, `media_profile`. These stay exclusively in Publication Registry.

A `projection_meta` field was added to the encounter row recording `regenerated_at`, `regenerated_by_oar2`, `regeneration_script`, and `canonical_sources` — so any future hand-edit of this row is now detectable against a known-good regeneration timestamp.

## 3. Launch Encounter — Restored Within Existing Authority

**Reconnected the style contract end-to-end** (previously seated in DB but never wired to anything):

- `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx` — `UnDriftedIndex` now reads `style_contract.tokens` from the (now-complete) projection and merges them into the root element's inline `style`, alongside the existing sitewide `registryTokenStyle`. This is a *reconnection*, not a hardcode — future edits to Publication Registry's `style_contract.tokens` flow through without a code change.
- `src/measures_registry/encounter_renderer/styles/encounters/lapis.css` — two surgical changes, both scoped to `[data-layout-contract="undrifted_publication"]`:
  - Root background/text: `var(--registry-brand-field, #060709)` / `var(--registry-brand-primary-text, #edf2f8)` → `var(--undrifted-bg, #030608)` / `var(--undrifted-text, #e8edf2)`. This was the actual root cause of the "generic navy SaaS page" complaint from the prior design-authority audit: unDrifted is chamber-assigned `material_identity: lapis`, so it was inheriting the sitewide lapis-material navy (`lapis_field: #0B1238`) instead of its own specified `obsidian`-family palette. Fixed by scoping the override to unDrifted's own layout contract, without touching `material_identity` or chamber assignment (`Do not redesign` / `preserve existing architecture` — no routing or dispatch logic changed).
  - Cover-headline hover accent: fallback swapped from an arbitrary `#7fb8ff` to the canonical `--undrifted-cyan` token.
- **No other CSS rule was touched.** Spacing, grid structure, card layout, and typography scale are unchanged — this is a color/material correction, not a redesign.

**Launch objectives assessed against what canonical authority actually supports:**

| Objective | Status | Basis |
|---|---|---|
| Editorial magazine feel / dominant publication identity | **Improved** | Obsidian-family palette now live, matches `visual_posture: dark_editorial` and `forbidden_visual_patterns` (explicitly excludes `generic_saas_dashboard`) — this was the concrete, canonically-backed correction available. |
| Assessment as primary launch center | **Unchanged — no canonical authority to act on** | No Publication Registry field specifies CTA visual prominence/weight. Untouched, not regressed. |
| Full viewport usage | **Unchanged — no canonical authority exists** | No content-width/layout field exists anywhere in Publication Registry. Acting here would mean inventing new design authority, which this OAR2 explicitly prohibits (`Executor may not create new publication authority` / `redesign publication architecture`). This remains exactly what the prior design-authority audit already recommended as its own follow-up OAR2 (Publication Design Profile) — not duplicated or overridden here. |
| Stronger editorial hierarchy | **Improved (copy only)** | `role_call_feature` correction ("ALL POSITIONS AVAILABLE" vs. the softer prior copy) reads with more editorial confidence — a content fix, not a layout fix. |
| Repeatable issue layout | **Unchanged, already satisfied** | Confirmed again — the projection is fully data-driven; a second issue would render through the same components without code changes. |

## 4. Architecture Preserved

Confirmed not done: no table merged, no new publication-authority table created (`measures_publication_release` from the earlier OAR2 was left untouched), no publication ownership moved into FREE, no publication metadata duplicated beyond the existing, now-corrected Registry ⇄ Projection relationship, `material_identity`/`chamber_assignment`/routing untouched, `measures_encounter_surface_assignment` untouched.

## 5. Launch Verification

Ran `npm run dev:registry` locally (production code changes are not yet deployed — see Blockers) and drove `/undrifted` with a real browser (Playwright) rather than relying on typecheck alone.

- **Desktop (1440×900):** obsidian background live, issue metadata reads "JUNE 2026," Role Call reads "ALL POSITIONS AVAILABLE" / "WHAT IS YOURS?" — all three corrections visually confirmed. Zero console errors.
- **Tablet (834×1194):** layout reflows correctly, no overflow, all sections present and legible.
- **Mobile (390×844):** single-column stack, no horizontal overflow, obsidian background and corrected copy both present.
- **Article links:** verified via DOM query — both "Read the Dispatch →" links resolve to their live Paragraph URLs (`paragraph.com/@undrifted/agents-with-keys`, `paragraph.com/@undrifted/fables-and-myths`), sourced live from the regenerated `featured_article_set`.
- **Assessment CTA:** verified via DOM query — both the header nav link and the in-page assessment card resolve to `/ai-operations-assessment`.
- **Publication hierarchy / issue metadata:** confirmed rendering the corrected values, not the drifted ones.
- **Publication styling:** obsidian palette confirmed rendering in the live DOM (not just in the DB row) via the screenshots above.

Typecheck: `npx tsc --noEmit` — zero errors introduced by the `LapisChamberRenderer.tsx` change.

## 6. Future Expansion — Held

Not implemented, per Routed §6: contributor registry, social registry, publication feed, comments, library expansion, issue archive runtime. No files created for any of these.

---

## Remaining Blockers

1. **Code changes are not yet deployed to production.** The DB regeneration (issue date, role call copy, style tokens present in the row) is already live on `measuresregistry.com/undrifted` since it's read client-side at runtime. The **CSS/renderer reconnection** (obsidian background, cyan hover accent) requires `npm run build:registry` + a deploy to take effect on the public site — verified only against a local dev build in this pass. Recommend a deploy as the immediate next action once this OAR1 is reviewed.
2. **`June 2026` vs `July 2026`:** this OAR2 resolved the drift by treating Publication Registry as canonical per its own explicit ownership declaration, which changes the visibly-rendered issue date. If July 2026 was actually the intended, correct launch date and June 2026 is itself the error, the fix belongs upstream — in `measures_publication_registry.metadata.issue_record.issue_date` — not in the projection. Flagging explicitly so this can be checked against operator intent rather than assumed correct.
3. **`assessment_feature` and `landing_design_contract` remain projection-only**, with no Publication Registry source to regenerate them from or correct them against. They were preserved, not deleted, but this is a standing violation of "Encounter Projection must never become an independently edited authority surface" that this OAR2 could not resolve without inventing new Publication Registry fields (explicitly disallowed). Recommend a small follow-up OAR2 to formally decide: backfill these into Publication Registry as canonical, or explicitly accept them as a documented projection-only exception.
4. **Full-viewport-usage and CTA-prominence launch objectives remain unmet**, as they have no canonical authority to restore from — this is the same gap the prior design-authority audit already flagged and recommended a `Publication Design Profile` OAR2 for. Not duplicated here; still open.

## Next Recommended OAR2

Deploy this session's changes to production, then decide the `assessment_feature`/`landing_design_contract` backfill-or-accept question above. The previously-recommended Publication Design Profile OAR2 (for viewport usage, CTA prominence, and other layout-authority gaps) remains the follow-up after that.
