---
document_type: oar1
authority_level: working
title: OAR1 — Align /undrifted Runtime to Issue 001 Publication System
status: executed
version: v1
operator: op044
system: undrifted
process_key: align_undrifted_runtime_issue_001
source_oar2: docs/oar/undrifted/oar2_align_undrifted_runtime_to_issue_001_publication_system_v1.meta.md
---

## OBJECTIVE

Refactor /undrifted runtime to better reflect the Issue 001 publication system as established by the cover reference. Target hierarchy: Issue → Featured Story → Supporting Stories → Leadership Briefing → Assessment Feature.

## DB STANDING VERIFIED FIRST

MCP Supabase was unauthorized (no access token). DB standing confirmed by reading runtime source:

`LapisChamberRuntime.tsx` loads:
- `measures_publication_registry` WHERE `publication_key IN ('structural_drift', 'undrifted')` AND `status = 'published'` — confirms publication registry exists
- `measures_publication_dispatch` WHERE `publication_key = 'undrifted'` AND `status = 'published'` — confirms dispatch records exist
- `measures_media_map` for LAPIS media roles including `agents_with_keys_cover`, `fables_and_myths_cover`, `undrifted_fill`, `ai_isnt_broken_landing`

`MeasuresRegistryRuntimeRegistered.tsx` loads:
- `measures_registry` WHERE `registry_key = 'undrifted_publication_landing'` — confirms landing unit with `featured_article_set`, `assessment_feature`, `landing_design_contract`, `content_profile`

All required fields for rendering (issue_number, issue_date, edition, cover_story, featured_article_set, assessment_feature, role_call_feature, next_issue_teaser, footer_record) are already sourced from DB. No hardcoded content exists in the renderer.

**Conflicts found:**

None that require Chazz resolution. All identified gaps were CSS layout and renderer render gaps — both within Claude executor scope.

## ACTION

**File 1: `src/measures_registry/registered_runtime/styles/registry.visual-system.css`**

1. **Cover image** — Changed `undrifted_publication` cover visual img from `object-fit: contain` to `object-fit: cover`. The magazine cover uses a full-bleed dramatic image; `contain` was leaving dead space on sides.

2. **Column swap — role-call and next-issue** — The publication layout places content in a 3-column grid (row 6). The Issue 001 cover shows: NEXT ISSUE on the left (wide, 2-column) and LEADERSHIP BRIEFING on the right (narrow, 1-column). The runtime had these reversed: role-call (leadership briefing) was `grid-column: 1 / span 2` and next-issue was `grid-column: 3`.

   Corrected:
   - `undrifted-role-call` → `grid-column: 3` (right narrow)
   - `undrifted-next-issue` → `grid-column: 1 / span 2` (left wide)
   - Removed `border-right` from role-call (now rightmost column)
   - Added `border-right` to next-issue (now left of role-call)

3. **Typography adjustment** — role-call h2 reduced from `clamp(2rem, 4vw, 4rem)` to `clamp(1.4rem, 2.2vw, 2rem)` — appropriate for narrow right column. next-issue h2 increased from `clamp(1.5rem, 2.7vw, 2.4rem)` to `clamp(1.8rem, 3.2vw, 3rem)` — now in wide column.

4. **role-call body** — `max-width: 44rem` → `max-width: none` for narrow column. Font size reduced slightly.

5. **860px responsive breakpoint** — Updated column assignments to match the swap: next-issue left (`grid-column: 1`), role-call right (`grid-column: 2`).

6. **New CSS classes:**
   - `.undrifted-insight-teaser` — uppercase, weighted teaser text for article cards (activated when DB `teaser` or `excerpt` field is present)
   - `.undrifted-assessment-rating` — gold star display slot for assessment feature (activated when DB `rating_display` field is present)

**File 2: `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`**

1. **Article cards** — Added rendering for two new DB fields per article in `featured_article_set`:
   - `feature_label` / `section_label` → `undrifted-eyebrow` span above `h3`
   - `teaser` / `excerpt` → `undrifted-insight-teaser` p between `h3` and `description`
   
   Both render conditionally — no output if field absent from DB.

2. **Assessment feature** — Added `assessmentRatingDisplay` from `assessmentFeature.rating_display`. Renders as `undrifted-assessment-rating` div between the title and body. Renders conditionally — no output if absent.

## RESULT

**`/undrifted` index surface:**

- Cover image now fills the full cover frame as intended by the Issue 001 reference
- Bottom row layout now matches the magazine cover: NEXT ISSUE on left (wide), LEADERSHIP BRIEFING on right (narrow)
- Article cards will surface `feature_label` eyebrow and `teaser` text when those fields are seated in DB
- Assessment feature will surface `rating_display` when that field is seated in DB
- Frontend remains renderer-only — no copy was hardcoded; all new render slots are conditional on DB presence

**DB fields not yet seated (NotChazz flags not raised — these are render-ready slots, not authority gaps):**
- `featured_article_set[*].feature_label` — eyebrow slot ready; no content yet
- `featured_article_set[*].teaser` — teaser slot ready; no content yet
- `assessmentFeature.rating_display` — rating slot ready; no content yet

These fields require Operator to seat content in the `measures_registry` table (`undrifted_publication_landing`) and `measures_publication_registry` (`undrifted` publication metadata). Claude may not seed them.

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors

Files modified:
- `src/measures_registry/registered_runtime/styles/registry.visual-system.css`
- `src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`

Commit: `853d252` — "Feat: align /undrifted runtime to Issue 001 publication system"
Push: pushed to `origin/measures`
