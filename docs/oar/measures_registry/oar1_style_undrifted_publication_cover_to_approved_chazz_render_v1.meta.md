---
document_type: oar1
authority_level: closeout
document_scope: undrifted_publication_cover_style_contract
title: OAR1 — Style unDrifted Publication Cover to Approved Chazz Render
status: media_map_insert_ready
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_style_undrifted_publication_cover_to_approved_chazz_render_v1.meta.md
final_seat_standing: held_media_map_insert
---

# OAR1 — Style unDrifted Publication Cover to Approved Chazz Render v1

## Closeout

```yaml
closeout:
  status: media_map_insert_ready
  layout_deployed: true
  layout_browser_qa: approved
  media_map_audit: complete
  media_map_insert_required: true
  media_wiring_deployed: true
  final_seat_standing: held_media_map_insert
```

## Phase 1 — Layout (Deployed, Browser QA Approved)

```yaml
layout:
  status: approved
  commit: 6c6ab17 (renderer + CSS) / b8ea5f2 (OAR1)
  browser_qa: operator confirmed layout approved
```

Five-section Chazz layout deployed and browser-verified as approved. See initial OAR1 for full layout record.

## Phase 2 — Media Map Audit

### DB audit result

```yaml
table: measures_media_map
total_rows: 2
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

No other campaign keys present. All required publication-cover media roles absent from registry mapping.

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
    surface: hero media box (still fallback — video is primary; fallback is ai_isnt_broken_landing)
    storage_status: not found in any probed bucket
    action_required: none — video role is primary; ai_isnt_broken_landing covers still fallback

  - role: undrifted_fill
    surface: leadership visual card background
    storage_status: not found in any probed bucket
    action_required: operator uploads if visual card fill is desired
```

## Required Operator Action — DB INSERT

Five assets confirmed in storage without registry mapping. All five are required before media loads on the publication cover.

```sql
INSERT INTO measures_media_map (campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active)
VALUES
  (
    'agents_of_chaos_integrity_governance',
    'measures_registry_logo',
    'measures-registry',
    'measures_registry_logo.webp',
    'image/webp',
    true
  ),
  (
    'agents_of_chaos_integrity_governance',
    'ai_isnt_broken_landing',
    'measures-registry',
    'ai_isnt_broken_landing.webp',
    'image/webp',
    true
  ),
  (
    'agents_of_chaos_integrity_governance',
    'agents_with_keys_cover',
    'measures-registry',
    'agents_with_keys.webp',
    'image/webp',
    true
  ),
  (
    'agents_of_chaos_integrity_governance',
    'fables_and_myths_cover',
    'measures-registry',
    'fables_and_myths.webp',
    'image/webp',
    true
  ),
  (
    'agents_of_chaos_integrity_governance',
    'questions_ungoverned_systems_cannot_answer_video',
    'measures-media',
    'questions_ungoverned_systems_cannot_answer.mp4',
    'video/mp4',
    true
  );
```

After INSERT, the runtime resolves all five roles on next load. No rebuild required.

### R2 routing note

`questions_ungoverned_systems_cannot_answer_video` uses bucket `measures-media`. The runtime `resolveRuntimeMediaUrl` detects this bucket via `R2_PUBLIC_BASE_URL_ENV_BY_BUCKET` and constructs the URL from `VITE_R2_PUBLIC_BASE_URL` (`https://media.c3field.online`). No code change required.

## Phase 2 — Media Wiring Deployed

### Code changes

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
| `measures_registry_logo` | Topbar wordmark | Renders as `<img>` replacing text wordmark; text fallback if not seated |
| `measures_registry_logo` | About dispatch card | `<img>` above eyebrow; absent if not seated |
| `ai_isnt_broken_landing` | Hero media box | `<img>` fill when no video; also set as `poster` attr on `<video>` |
| `questions_ungoverned_systems_cannot_answer` | Hero media box | `<img>` fallback after ai_isnt_broken_landing |
| `questions_ungoverned_systems_cannot_answer_video` | Hero media box | `<video controls>` primary; uses ai_isnt_broken_landing as poster |
| `undrifted_fill` | Leadership visual card | Absolutely positioned `<img>` at 28% opacity behind gradient overlay |
| `agents_with_keys_cover` | Insights — Agents With Keys card | Cover image in article card |
| `fables_and_myths_cover` | Insights — Fables and Myths card | Cover image in article card |

### Media box fallback chain (dispatch left)

```
IF questionsUngovernedVideoUrl:      <video poster={aiIsntBrokenLandingUrl} controls />
ELSE IF aiIsntBrokenLandingUrl:      <img src={aiIsntBrokenLandingUrl} />
ELSE IF questionsUngovernedImageUrl: <img src={questionsUngovernedImageUrl} />
ELSE: media box hidden
```

No invented content. No hardcoded fallback URLs. No direct bucket references.

## Remaining Operator Actions

```yaml
required_db_inserts:
  all_assets_confirmed_in_storage: true
  ready_to_insert:
    - role: measures_registry_logo
      bucket: measures-registry
      path: measures_registry_logo.webp
    - role: ai_isnt_broken_landing
      bucket: measures-registry
      path: ai_isnt_broken_landing.webp
    - role: agents_with_keys_cover
      bucket: measures-registry
      path: agents_with_keys.webp
    - role: fables_and_myths_cover
      bucket: measures-registry
      path: fables_and_myths.webp
    - role: questions_ungoverned_systems_cannot_answer_video
      bucket: measures-media (Cloudflare R2)
      path: questions_ungoverned_systems_cannot_answer.mp4

pending_upload:
  - role: undrifted_fill (not in storage — upload optional)

no_rebuild_required_after_insert: true
```

## Final Standing

```yaml
repair_standing: media_map_insert_ready
layout_deployed: true
layout_browser_qa: approved
media_wiring_deployed: true
all_available_assets_confirmed: true
db_inserts_required: true
final_seat_standing: held_media_map_insert

seat_advancement:
  current: held
  next: media_visible
  requires: operator executes 5-row INSERT payload above
  browser_qa_required_after_insert: true
```

Layout approved. Media wiring deployed. All five available assets confirmed in storage. DB INSERT ready — operator executes, no rebuild required. Browser QA required after INSERT.
