---
document_type: oar1
authority_level: closeout
document_scope: undrifted_publication_cover_style_contract
title: OAR1 — Style unDrifted Publication Cover to Approved Chazz Render
status: browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_style_undrifted_publication_cover_to_approved_chazz_render_v1.meta.md
final_seat_standing: held_browser_qa
---

# OAR1 — Style unDrifted Publication Cover to Approved Chazz Render v1

## Closeout

```yaml
closeout:
  status: browser_qa_pending
  layout_deployed: true
  layout_browser_qa: approved
  media_map_audit: complete
  media_map_inserted: true
  media_wiring_deployed: true
  loaddata_isolation_deployed: true
  map_c2_circuit_rls_required: true
  final_seat_standing: held_browser_qa
```

## Phase 1 — Layout (Deployed, Browser QA Approved)

```yaml
layout:
  status: approved
  commit: 6c6ab17 (renderer + CSS) / b8ea5f2 (OAR1)
  browser_qa: operator confirmed layout approved
```

Five-section Chazz layout deployed and browser-verified as approved.

## Phase 2 — Media Map Audit

### DB audit result

```yaml
table: measures_media_map
total_rows_at_audit: 2
rows:
  - campaign_key: agents_of_chaos_integrity_governance
    media_role: hero_poster
    storage_bucket: measures-registry
    storage_path: measures_registry_poster.webp
    is_active: true
  - campaign_key: agents_of_chaos_integrity_governance
    media_role: registry_mark
    storage_bucket: measures-registry
    storage_path: measures_registry_mark.webp
    is_active: true
```

No other campaign keys present at audit time. All required publication-cover media roles absent.

### Storage audit — confirmed assets

```yaml
supabase_bucket: measures-registry

exists_in_storage_not_in_db:
  - path: measures_registry_logo.webp
    size: 131KB
    mime: image/webp
    required_role: measures_registry_logo
    surface_assignment: "publication masthead (topbar), About dispatch card"

  - path: ai_isnt_broken_landing.webp
    size: 195KB
    mime: image/webp
    required_role: ai_isnt_broken_landing
    surface_assignment: "hero media box — image when video absent, video poster when video seated"

  - path: agents_with_keys.webp
    size: 89KB
    mime: image/webp
    required_role: agents_with_keys_cover
    surface_assignment: "Agents With Keys article card cover (insights section)"

  - path: fables_and_myths.webp
    size: 237KB
    mime: image/webp
    required_role: fables_and_myths_cover
    surface_assignment: "Fables and Myths article card cover (insights section)"

r2_bucket: measures-media
r2_public_base: https://media.c3field.online (VITE_R2_PUBLIC_BASE_URL)

exists_in_r2_not_in_db:
  - path: questions_ungoverned_systems_cannot_answer.mp4
    size: 133MB (139905333 bytes)
    mime: video/mp4
    required_role: questions_ungoverned_systems_cannot_answer_video
    surface_assignment: "hero media box — primary video"
    runtime_resolution: resolveRuntimeMediaUrl → isR2Media(measures-media) → VITE_R2_PUBLIC_BASE_URL/path

not_in_storage:
  - role: questions_ungoverned_systems_cannot_answer
    note: video role is primary; ai_isnt_broken_landing covers still fallback — no action required

  - role: undrifted_fill
    surface: leadership visual card background
    action_required: operator uploads if visual card fill is desired
```

## Phase 2 — Media Map INSERT (Executed 2026-06-23)

```yaml
insert_executed: true
insert_date: 2026-06-23
rows_inserted: 5
campaign_key: agents_of_chaos_integrity_governance
registry_key: undrifted_publication_landing
encounter_key: undrifted_publication_cover
```

All five rows confirmed inserted and validated via REST:

| media_role | bucket | path | mime | active |
|---|---|---|---|---|
| `measures_registry_logo` | measures-registry | measures_registry_logo.webp | image/webp | true |
| `ai_isnt_broken_landing` | measures-registry | ai_isnt_broken_landing.webp | image/webp | true |
| `agents_with_keys_cover` | measures-registry | agents_with_keys.webp | image/webp | true |
| `fables_and_myths_cover` | measures-registry | fables_and_myths.webp | image/webp | true |
| `questions_ungoverned_systems_cannot_answer_video` | measures-media (R2) | questions_ungoverned_systems_cannot_answer.mp4 | video/mp4 | true |

Anon read access for `measures_media_map` confirmed OK. All public storage URLs return 200.

## Phase 2 — Media Wiring Deployed

```yaml
commit: 9295ed7
branch: measures
files_changed:
  - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
  - src/measures_registry/registered_runtime/styles/registry.visual-system.css
```

### REGISTERED_MEDIA_ROLES additions

```
+ "questions_ungoverned_systems_cannot_answer"
+ "questions_ungoverned_systems_cannot_answer_video"
+ "measures_registry_logo"
+ "ai_isnt_broken_landing"
+ "undrifted_fill"
+ "agents_with_keys_cover"
+ "fables_and_myths_cover"
```

### URL derivations added

```typescript
const questionsUngovernedSystemsVideoUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer_video"))
const questionsUngovernedImageUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer"))
const registryLogoUrl = mediaUrl(mediaMap.get("measures_registry_logo"))
const aiIsntBrokenLandingUrl = mediaUrl(mediaMap.get("ai_isnt_broken_landing"))
const undriftedFillUrl = mediaUrl(mediaMap.get("undrifted_fill"))
const agentsWithKeysCoverUrl = mediaUrl(mediaMap.get("agents_with_keys_cover"))
const fablesAndMythsCoverUrl = mediaUrl(mediaMap.get("fables_and_myths_cover"))
```

### Renderer surface assignments

| Media role | Surface target | Behavior |
|---|---|---|
| `measures_registry_logo` | Topbar wordmark | `<img>` replacing text wordmark; text fallback if not seated |
| `measures_registry_logo` | About dispatch card | `<img>` above eyebrow; absent if not seated |
| `ai_isnt_broken_landing` | Hero media box | `<img>` fill when no video; poster on `<video>` |
| `questions_ungoverned_systems_cannot_answer` | Hero media box | `<img>` fallback after ai_isnt_broken_landing |
| `questions_ungoverned_systems_cannot_answer_video` | Hero media box | `<video controls>` primary |
| `undrifted_fill` | Leadership visual card | Absolutely positioned `<img>` at 28% opacity |
| `agents_with_keys_cover` | Insights — Agents With Keys card | Cover image in article card |
| `fables_and_myths_cover` | Insights — Fables and Myths card | Cover image in article card |

### Media box fallback chain (dispatch left)

```
IF questionsUngovernedVideoUrl:      <video poster={aiIsntBrokenLandingUrl} controls />
ELSE IF aiIsntBrokenLandingUrl:      <img src={aiIsntBrokenLandingUrl} />
ELSE IF questionsUngovernedImageUrl: <img src={questionsUngovernedImageUrl} />
ELSE: media box hidden
```

## Phase 3 — QA Failure and Root Cause (2026-06-23)

### QA attempt 1 — does not resolve

After DB INSERT, browser QA attempted on `/undrifted`. Page did not resolve — stuck at "Resolving registry authority."

Browser console showed:
```
GET /rest/v1/map_c2_circuit?...&release_state=eq.active 401 (Unauthorized)
```

No other Supabase errors. `measures_media_map` anon access confirmed OK in parallel probe.

### Root cause diagnosis

```yaml
table: map_c2_circuit
issue: no RLS SELECT policy for anon role
behavior: Supabase client rejects Promise on 401 (not return { error })
cascade: Promise.all() in loadData() rejects → setLandingUnitsLoaded(true) never called
result: page permanently stuck at "Resolving registry authority." — no render, no media
```

The `loadData()` function used a single `Promise.all()` for all 7 queries including `map_c2_circuit`. No try-catch. `void loadData()` silently discards the rejection. `setLandingUnitsLoaded(true)` was never reached.

### Fix applied — commit 5b0deb9

`map_c2_circuit` removed from core `Promise.all()` and queried sequentially after `setLandingUnitsLoaded(true)` is called. The 6 core queries (encounter defs, registry units, media map, design tokens, publications, dispatches) still run in parallel. `map_c2_circuit` runs after — its failure cannot block page render or media loading.

```yaml
commit: 5b0deb9
branch: measures
pushed: true
cloudflare_build: triggered
file: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
```

## Remaining Operator Actions

```yaml
required:
  - action: apply RLS SELECT policy on map_c2_circuit for anon role
    scope: Supabase dashboard → SQL Editor
    sql: |
      CREATE POLICY "anon_read_active_circuits"
      ON map_c2_circuit
      FOR SELECT
      TO anon
      USING (release_state = 'active');
    impact: MAP circuit data (payment tiers) will load in assessment surface
    note: does not affect undrifted rendering — that is now isolated from map_c2_circuit

  - action: browser QA after Cloudflare Pages build completes (commit 5b0deb9)
    surface: /undrifted
    verify:
      - logo appears in topbar
      - hero video loads (questions_ungoverned_systems_cannot_answer.mp4 from R2)
      - ai_isnt_broken_landing.webp as video poster
      - agents_with_keys.webp in Agents With Keys card
      - fables_and_myths.webp in Fables and Myths card
      - no Facebook in social links
      - LinkedIn present if seated
      - /ai-operations-assessment CTA routes correctly
      - /about-measures-registry link routes correctly

optional:
  - role: undrifted_fill
    surface: leadership visual card background
    action: upload image asset if visual fill is desired
```

## Final Standing

```yaml
repair_standing: browser_qa_pending
layout_deployed: true
layout_browser_qa: approved
media_map_inserted: true
media_wiring_deployed: true
loaddata_isolation_deployed: true
final_seat_standing: held_browser_qa

seat_advancement:
  current: held_browser_qa
  requires:
    - Cloudflare Pages build completes (commit 5b0deb9)
    - browser QA passes on /undrifted media
  map_circuit_rls_separate_action: true
```

Layout approved. Media inserted. QA failure diagnosed — `map_c2_circuit` 401 blocked render. Fix deployed (`5b0deb9`). Browser QA required after build completes.
