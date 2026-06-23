---
document_type: oar1
authority_level: closeout
document_scope: undrifted_publication_cover_style_contract
title: OAR1 — Style unDrifted Publication Cover to Approved Chazz Render
status: media_map_insert_required
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
  status: media_map_insert_required
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

No other campaign keys present. All required publication-cover media roles are absent from the registry mapping.

### Storage bucket audit

Storage bucket: `measures-registry` (Supabase public storage)

```yaml
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

not_in_storage_not_in_db:
  - role: questions_ungoverned_systems_cannot_answer_video
    surface: hero media box (primary — video)
    storage_status: not found in bucket
    action_required: operator uploads video asset

  - role: questions_ungoverned_systems_cannot_answer
    surface: hero media box (still fallback)
    storage_status: not found in bucket
    action_required: operator uploads image asset

  - role: undrifted_fill
    surface: leadership visual card background
    storage_status: not found in bucket
    action_required: operator uploads image asset

  - role: agents_with_keys_cover
    surface: Agents With Keys article card cover
    storage_status: not found in bucket
    action_required: operator uploads image asset

  - role: fables_and_myths_cover
    surface: Fables and Myths article card cover
    storage_status: not found in bucket
    action_required: operator uploads image asset
```

## Required Operator Action — DB INSERT

Two assets exist in storage without registry mapping. INSERT required before media loads.

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
  );
```

After INSERT, the runtime will resolve these on next load without any further code change. No rebuild required.

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
+ "measures_registry_logo"
+ "ai_isnt_broken_landing"
+ "undrifted_fill"
```

### URL derivations added

```typescript
const questionsUngovernedImageUrl = mediaUrl(mediaMap.get("questions_ungoverned_systems_cannot_answer"))
const registryLogoUrl = mediaUrl(mediaMap.get("measures_registry_logo"))
const aiIsntBrokenLandingUrl = mediaUrl(mediaMap.get("ai_isnt_broken_landing"))
const undriftedFillUrl = mediaUrl(mediaMap.get("undrifted_fill"))
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

### Media box fallback chain (dispatch left)

```
IF questionsUngovernedVideoUrl:   <video poster={aiIsntBrokenLandingUrl} controls />
ELSE IF aiIsntBrokenLandingUrl:   <img src={aiIsntBrokenLandingUrl} />
ELSE IF questionsUngovernedImageUrl: <img src={questionsUngovernedImageUrl} />
ELSE: media box hidden
```

No invented content. No hardcoded fallback URLs. No direct bucket references.

## Remaining Operator Actions

```yaml
required_db_inserts:
  immediate:
    - role: measures_registry_logo (asset exists in storage)
    - role: ai_isnt_broken_landing (asset exists in storage)
  pending_upload:
    - role: questions_ungoverned_systems_cannot_answer_video (upload + insert required)
    - role: questions_ungoverned_systems_cannot_answer (upload + insert required)
    - role: undrifted_fill (upload + insert required)
    - role: agents_with_keys_cover (upload + insert required)
    - role: fables_and_myths_cover (upload + insert required)

no_rebuild_required_after_insert: true
```

## Final Standing

```yaml
repair_standing: media_map_insert_required
layout_deployed: true
layout_browser_qa: approved
media_wiring_deployed: true
db_inserts_required: true
final_seat_standing: held_media_map_insert

seat_advancement:
  current: held
  next: media_visible
  requires: operator executes INSERT payload for measures_registry_logo and ai_isnt_broken_landing
  full_media_requires: all five additional roles uploaded and inserted
```

Layout approved. Media wiring deployed. DB INSERT required for two immediately available assets. Five additional assets require operator upload before mapping.
