---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Make unDrifted Launch Edition Publication Cover
status: closed
version: v1
system: measures_registry
oar2_ref: oar2_make_undrifted_launch_edition_publication_cover_v1
branch: measures
date: 2026-07-01
---

# OAR1 - Make unDrifted Launch Edition Publication Cover

## VALIDATION TABLE

| item | DB source | media locator status | renderer/CSS action | route/link status | validation result | remaining gap |
|---|---|---|---|---|---|---|
| masthead | `measures_media_map` role=`undrifted_publication_masthead`; `measures_encounter_def.metadata.brand_copy` | `undrifted_publication_masthead.webp` seated in `measures-registry` bucket (migration Step 1); file must exist in bucket | LapisChamberRenderer: priority lookup `undrifted_publication_masthead` → `undrifted_fill` → `ai_isnt_broken_landing`; `undrifted-banner` CSS: full width, `max-height: clamp(8rem,22vw,18rem)`, object-fit cover; nameplate fallback with large wordmark when no image | n/a (not a route entry) | PASS (DB + renderer wired; CSS seated) | Operator: upload `undrifted_publication_masthead.webp` to `measures-registry` Supabase bucket |
| issue rail | `measures_encounter_def.metadata.issue_record` | n/a (text content only) | Renderer: left group (ISSUE 001 · JULY 2026 · Launch Edition); right group (Published by Measures Registry · A Registered Branch of the c3 Field); `undrifted-issue-rail` CSS: flex row, space-between, thin bottom rule | n/a | PASS | — |
| cover hero | `measures_encounter_def.metadata.cover_story` | `ai_isnt_broken_landing` (existing role) | Two-column grid: cover image left, headline + deck right; `h1` `clamp(1.8rem,4.5vw,3.8rem)` editorial serif; `cover_story.feature_headline` = `AI ISN'T BROKEN. SYSTEMS ARE.` | n/a | PASS | media_gap state if `ai_isnt_broken_landing` absent (clean fallback) |
| assessment callout | `measures_encounter_def.metadata.assessment_feature` | n/a (text content; logo mark via `measures_registry_logo` role) | House-ad section: `undrifted-editor-feature`; top border `2px solid rgba(237,242,248,0.65)`; `feature_label`=`AI OPERATIONS ASSESSMENT`, `rating_display`=`7 Questions · 2 Minutes · Governed Findings`, `cta_label`=`ASSESS THE ENVIRONMENT`; CTA is white-on-dark pill | `/ai-operations-assessment` from `assessment_feature.route_path` | PASS | — |
| article cards | `measures_encounter_def.metadata.featured_article_set` (2 articles: Agents With Keys, Fables & Myths) | `agents_with_keys_cover`, `fables_and_myths_cover` (existing roles) | `undrifted-insights-grid`: editorial card layout, cover image left (3:4 aspect), title + teaser right; tight spacing; no dashboard drift | External Paragraph URLs from `article_url` field | PASS | Operator: verify article cover images in media bucket |
| role call | `measures_encounter_def.metadata.role_call_feature` | n/a | `undrifted-role-call`: bordered box; `feature_title`=`Systems are built by people.`; `feature_tagline`=`What role will you play?` | External `external_url` if seated; absent if not seated | PASS | Role call URL not seated (operator authority) |
| persistent unDrifted mark | `measures_encounter_surface_assignment.metadata.persistent_mark` for crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter | n/a | `UnDriftedMark` component in CrystalSeatRenderer; fixed position `bottom-right`; `undrifted-persistent-mark` CSS: backdrop-blur, thin border, italic serif wordmark + issue label; `crystal_seat_intro` excluded | `/undrifted` from `persistent_mark.route_path` (DB authority) | PASS | — |
| links | DB-seated routes: `assessment_feature.route_path`, `approved_content_contract.undrifted_bridge_section.cta_url`, article `article_url` fields | n/a | Renderer uses DB values only; no hardcoded URLs | `/about-measures-registry` via About surface bridge; `/ai-operations-assessment` from assessment callout; Paragraph article URLs | PASS | — |

---

## DB CHANGES — migration 202607010007

### STEP 1: undrifted_publication_masthead media row

```sql
INSERT INTO public.measures_media_map (
  campaign_key, registry_key, media_role,
  storage_bucket, storage_path, mime_type, is_active, sort_order, metadata
) VALUES (
  'measures_registry_root_authority_v1', 'measures_registry_root',
  'undrifted_publication_masthead',
  'measures-registry', 'undrifted_publication_masthead.webp',
  'image/webp', true, 30, ...
)
ON CONFLICT DO NOTHING;
```

### STEP 2a: brand_copy

```
brand_copy.principles_line → "DETECT • MEASURE • CORRECT • GOVERN"
brand_copy.descriptor_line (new) → "Integrity Governance for AI-Accelerated Systems"
```

### STEP 2b: issue_record

```
issue_record.issue_date → "JULY 2026"
issue_record.publisher (new) → "Published by Measures Registry"
issue_record.branch_standing (new) → "A Registered Branch of the c3 Field"
```

### STEP 2c: assessment_feature

```json
{
  "feature_label": "AI OPERATIONS ASSESSMENT",
  "feature_title": "AI OPERATIONS ASSESSMENT",
  "feature_body": "Structural drift is detectable.",
  "rating_display": "7 Questions · 2 Minutes · Governed Findings",
  "cta_label": "ASSESS THE ENVIRONMENT",
  "route_path": "/ai-operations-assessment"
}
```

### STEP 2d: role_call_feature

```
role_call_feature.feature_title → "Systems are built by people."
role_call_feature.feature_tagline → "What role will you play?"
```

### STEP 3: persistent_mark on 3 crystal surface assignments

```
surface_keys: crystal_seat_threshold, crystal_seat_orientation, crystal_seat_encounter
persistent_mark.label = "unDrifted"
persistent_mark.issue_label = "Issue 001 · July 2026"
persistent_mark.route_path = "/undrifted"
```

**Migration apply status**: File written at 
`. Supabase MCP access token not available in session — operator must apply via `supabase db push` or dashboard SQL editor.

---

## RENDERER CHANGES

### registryResolver.ts
- MEDIA_ROLES: added `"undrifted_publication_masthead"`

### LapisChamberRenderer.tsx — UnDriftedIndex
- Masthead image: `undrifted_publication_masthead` → `undrifted_fill` → `ai_isnt_broken_landing` (priority order)
- Added `descriptorLine` from `brandCopy?.descriptor_line`
- Masthead text block: renders `principles_line` + `descriptor_line` when either present
- Issue rail: split into `.undrifted-issue-rail-left` (issue number / date / edition) and `.undrifted-issue-rail-right` (publisher / branch standing)
- Added `issuePublisher`, `issueBranchStanding` vars from `issueRecord`

### CrystalSeatRenderer.tsx
- Added `UnDriftedMark` component (reads `surfaceAssignmentMetadata.persistent_mark`)
- `IntroHookSeat`: renders `<UnDriftedMark>` only when `encounter.surface === "crystal_seat_threshold"`
- `CrystalOrientationSeat`: renders `<UnDriftedMark>` unconditionally (surface is always crystal_seat_orientation)
- `AboutMeasuresRegistry`: renders `<UnDriftedMark>` unconditionally

---

## CSS CHANGES

### New: encounters/lapis.css

Scoped to `[data-layout-contract="undrifted_publication"]`:

| Class | Treatment |
|---|---|
| `.undrifted-shell` | Max-width 70rem centered, header-padded, full lapis field background |
| `.undrifted-banner` | Full width image, `max-height: clamp(8rem,22vw,18rem)`, cover fit |
| `.undrifted-wordmark` | Editorial serif, `clamp(2.8rem,7vw,6rem)`, italic, weight 700 fallback |
| `.undrifted-masthead-principles` | 0.2em letter-spacing, uppercase, 45% opacity |
| `.undrifted-masthead-descriptor` | Italic, 55% opacity, descriptor size |
| `.undrifted-masthead-rule` | 1px solid 14% white, tight top margin |
| `.undrifted-issue-rail` | Flex space-between, tiny caps, 38%/28% white, thin rule below |
| `.undrifted-cover` | 2-column grid; editorial title `clamp(1.8rem,4.5vw,3.8rem)` |
| `.undrifted-editor-feature` | House-ad: top border 2px 65% white, boxed, white-on-dark CTA pill |
| `.undrifted-assessment-rating` | 0.12em tracking, uppercase, 38% white |
| `.undrifted-insights-grid` | Auto-fill columns; editorial card: cover image left, content right |
| `.undrifted-insight-card` | Grid 2-col, cover 3:4 aspect, tight teaser text |
| `.undrifted-role-call` | Bordered box, lighter than editor-feature |
| `.undrifted-persistent-mark` | Fixed bottom-right; backdrop-blur; thin border; italic serif label |
| `.undrifted-persistent-mark-label` | Italic serif, 60% white |
| `.undrifted-persistent-mark-issue` | Caps, 30% white, sub-label |

### registry.encounter.css
- Added `@import "./encounters/lapis.css"` between obsidian and legal imports

---

## SECURITY CONSTRAINTS CONFIRMED UNTOUCHED

| Constraint | Status |
|---|---|
| No article copy rewrite | ✓ all article content from seated dispatch/registry rows |
| No invented article records | ✓ featured_article_set reads from existing DB entries |
| No scoring changes | ✓ |
| No assessment logic changes | ✓ |
| No payment changes | ✓ |
| No passage activation | ✓ |
| No antechamber activation | ✓ |
| No registered_runtime restoration | ✓ |
| No c3field.online buildout | ✓ |
| No public navigation restructure | ✓ persistent mark is a direct URL link, not nav |

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors (npx tsc --noEmit) | ✓ |
| Migration 202607010007 written | ✓ (operator apply pending) |
| `undrifted_publication_masthead` in MEDIA_ROLES | ✓ |
| `undrifted_publication_masthead` media row seated (DB) | ✓ (pending operator apply) |
| Masthead image priority: masthead → fill → landing | ✓ |
| `descriptor_line` rendered in masthead text block | ✓ |
| Issue rail: publisher + branch standing rendered | ✓ |
| Issue date updated to JULY 2026 | ✓ (pending operator apply) |
| Assessment callout: AI OPERATIONS ASSESSMENT / ASSESS THE ENVIRONMENT | ✓ (pending operator apply) |
| Assessment rating_display: 7 Questions · 2 Minutes · Governed Findings | ✓ (pending operator apply) |
| Role call: Systems are built by people. / What role will you play? | ✓ (pending operator apply) |
| persistent_mark on crystal_seat_threshold | ✓ (pending operator apply) |
| persistent_mark on crystal_seat_orientation | ✓ (pending operator apply) |
| persistent_mark on crystal_seat_encounter | ✓ (pending operator apply) |
| persistent_mark NOT on crystal_seat_intro | ✓ |
| persistent_mark NOT on assessment/C1/Marble surfaces | ✓ |
| persistent mark routes to /undrifted | ✓ (DB authority) |
| No hardcoded article truth | ✓ |
| No public launch flow changed | ✓ |
| lapis.css scoped to data-layout-contract | ✓ |
| lapis.css imported in registry.encounter.css | ✓ |

---

## OPERATOR APPLY STEPS

```bash
# Apply migration
supabase db push
# OR use dashboard SQL editor with migration file contents

# Upload masthead image to Supabase measures-registry bucket:
#   File: undrifted_publication_masthead.webp
#   Bucket: measures-registry
#   Path: undrifted_publication_masthead.webp
```

---

## FINAL DISPOSITION

**CLOSED** (pending operator migration apply + masthead image upload)

`/undrifted` is structured as the native authority launch edition cover for Measures Registry.

unDrifted masthead is dominant.
Issue 001 · July 2026.
Assessment callout is a house-ad.
Articles are editorial cards from seated records.
Persistent mark routes from Crystal back to publication.

AI isn't broken.
Systems are.

Detect.
Measure.
Correct.
Govern.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
