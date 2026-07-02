---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Style Crystal Orientation and About Encounter With Codexstone and Links
status: closed
version: v1
system: measures_registry
oar2_ref: oar2_style_crystal_orientation_and_about_encounter_with_codexstone_and_links_v1
commit: 5f8b467
branch: measures
date: 2026-07-01
---

# OAR1 - Style Crystal Orientation and About Encounter With Codexstone and Links

## VALIDATION TABLE

| Surface | Media Locator Status | Content Profile Update | Style Implementation | Links Added | CTA Reachability | Mobile/Laptop | Remaining Gap |
|---|---|---|---|---|---|---|---|
| crystal_seat_orientation | measures_position: seated (migration 202607010002) / official_codexstone_seal: seated (migration 202607010005 — filename assumed official_codexstone_seal.png) | governed_site_paragraphs + codexstone_captions added to surface_assignment metadata | New crystal.css: two-column 9:16 video + content, Codexstone seal, CTA | None (orientation routes to crystal_seat_encounter) | Button always visible in content column | Grid collapses to 1-col at 760px, video capped 22rem | Operator must verify official_codexstone_seal.png filename in measures-registry bucket |
| crystal_seat_encounter | about_measures_registry_video: seated (migration 202607010005 — filename assumed about_measures_registry.mp4) / official_codexstone_seal: shared with orientation | c3field_links_section added to approved_content_contract | about.css fixed selectors + added seal and c3field sections | Our Story + Bigger Picture → c3field.online (video-link styled, target="_blank") | Connect form CTA visible within connect section | 860px breakpoint collapses grid to 1-col | Operator must verify about_measures_registry.mp4 filename in R2 bucket |

---

## DB CHANGES — migration 202607010005

### STEP 1: crystal_seat_orientation surface assignment metadata
Added to `measures_encounter_surface_assignment` WHERE `surface_key = 'crystal_seat_orientation'`:
- `governed_site_paragraphs` — 7-paragraph governed site description (exact copy from OAR2)
- `codexstone_captions` — `["A GOVERNED SYSTEM OF RECORD.", "The stone remembers."]`

### STEP 2: about_measures_registry encounter def
Added to `approved_content_contract.c3field_links_section`:
- `label`: "c3 Field"
- `links`: Our Story + Bigger Picture → https://c3field.online
- `link_style`: "video_link"

### STEP 3: official_codexstone_seal media locator
```
campaign_key: measures_registry_root_authority_v1
registry_key: measures_registry_root
media_role: official_codexstone_seal
storage_bucket: measures-registry (Supabase)
storage_path: official_codexstone_seal.png  ← OPERATOR VERIFY
is_active: true, sort_order: 30
```

### STEP 4: about_measures_registry_video media locator
```
campaign_key: measures_registry_root_authority_v1
registry_key: measures_registry_root
media_role: about_measures_registry_video
storage_bucket: measures-media (R2)
storage_path: about_measures_registry.mp4  ← OPERATOR VERIFY
exact_url_seated: https://media.c3field.online/about_measures_registry.mp4
is_active: true, sort_order: 12
```

Both inserts use `WHERE NOT EXISTS` guard.

---

## RENDERER CHANGES — CrystalSeatRenderer.tsx

### Dispatch
- Removed `crystal_seat_orientation` from IntroHookSeat dispatch
- Added `surface === "crystal_seat_orientation"` → `CrystalOrientationSeat` (new function)
- `crystal_seat_intro` and `crystal_seat_threshold` remain on IntroHookSeat (media-fill, unchanged)

### CrystalOrientationSeat (new)
- Reads `governed_site_paragraphs` + `codexstone_captions` from `encounter.surfaceAssignmentMetadata`
- Resolves `measures_position` (video) and `official_codexstone_seal` (image) from `encounter.mediaByRole`
- Layout: two-column — 9:16 video left (sticky), content right
- Content: governed-site paragraphs, Codexstone seal image + captions, Continue CTA
- Continue → `resolveNextSurface(encounter)` (crystal_seat_encounter)

### AboutMeasuresRegistry updates
- `data-surface`: changed from hardcoded `"about_measures_registry"` to `encounter.surface` (= `"crystal_seat_encounter"`)
- Added `codexstoneSealSection` rendering above orientation section (from `approved_content_contract.codexstone_seal_section` — already in DB from migration 202606240005)
- Added `sealUrl` = `official_codexstone_seal` media role
- Added `c3fieldLinksSection` / `c3fieldLinks` rendering between bridge and connect sections

---

## CSS CHANGES

### New: encounters/crystal.css
- Selector: `[data-surface="crystal_seat_orientation"]`
- Two-column grid layout (1fr / 1.35fr)
- 9:16 media container (aspect-ratio: 9/16, sticky on scroll)
- Content column: governed-site copy, Codexstone seal/captions, CTA
- Gold-toned Codexstone accent: `rgba(210, 190, 140, ...)` for border and captions
- 760px breakpoint: stacks to single column, video max-width 22rem centered

### Fixed: encounters/about.css
- All selectors corrected: `data-public-path="about_measures_registry"` → `data-surface="crystal_seat_encounter"` (all instances — these were dead code before)
- Added `.registry-about-seal` section styles: image, title, subtitle
- Added `.registry-about-c3field` section styles: label, links container, link pill (with "→" ::after)

### Updated: registry.encounter.css
- Added `@import "./encounters/crystal.css";`

---

## SURFACE SCOPE

| Surface | Crystal Branded Background | Layout | Media |
|---|---|---|---|
| crystal_seat_intro | NO (media-fill via IntroHookSeat) | Video fullscreen | intro_hook_video |
| crystal_seat_threshold | NO (media-fill via IntroHookSeat) | Split threshold hero | left/right motion stills |
| crystal_seat_orientation | YES (CrystalOrientationSeat + crystal.css) | Two-column 9:16 + copy | measures_position |
| crystal_seat_encounter | YES (AboutMeasuresRegistry + about.css) | Multi-section governed encounter | about_measures_registry_video |

---

## GAPS / OPERATOR VERIFY ITEMS

1. **official_codexstone_seal.png filename** — seated as `official_codexstone_seal.png` in Supabase `measures-registry` bucket. If actual filename differs, UPDATE `measures_media_map` SET `storage_path = '<actual_filename>'` WHERE `media_role = 'official_codexstone_seal'`.

2. **about_measures_registry.mp4 filename** — seated as `about_measures_registry.mp4` in R2 `measures-media` bucket. If actual filename differs, UPDATE with correct `storage_path` and `exact_url_seated`.

3. **Article preview from Lapis/Paragraph records** — OAR2 requested "optional article preview from seated Lapis/Paragraph dispatch records." The existing `approved_content_contract.featured_article` path reads from the encounter def. If no featured_article is seated, the preview simply does not render (no error). The bridge section (unDrifted Issue 001 panel) serves as the existing article preview entry point.

4. **Role call / leadership section** — OAR2 requested "role call / leadership section where source copy exists." The connect section serves as the primary contact/leadership entry. A dedicated role call section has not been added as no distinct source copy was specified beyond what exists in `approved_content_contract`. If needed, add `role_call_section` to the encounter def and wire renderer.

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors | ✓ |
| Migration 202607010005 applied | ✓ exit 0 |
| crystal_seat_orientation dispatches CrystalOrientationSeat | ✓ |
| crystal_seat_intro/threshold remain IntroHookSeat | ✓ |
| crystal_seat_encounter dispatches AboutMeasuresRegistry | ✓ |
| Governed site copy seated in surface assignment metadata | ✓ |
| Codexstone captions seated in surface assignment metadata | ✓ |
| c3field_links_section seated in about_measures_registry encounter def | ✓ |
| official_codexstone_seal DB row inserted | ✓ (filename pending operator verify) |
| about_measures_registry_video DB row inserted | ✓ (filename pending operator verify) |
| Both media roles already in MEDIA_ROLES (resolver fetches them) | ✓ |
| Crystal branded background: orientation + encounter only | ✓ (materials.css via data-material-family="crystal") |
| about.css selector corrected | ✓ (was dead code, now active) |
| crystal.css one-frame layout: video + copy in viewport | ✓ |
| CTA reachable: Continue always in content column | ✓ |
| Mobile: grid collapses, content scrollable | ✓ |
| No scoring/report/payment/passage changes | ✓ |
| Commit pushed | ✓ 5f8b467 |

---

## FINAL DISPOSITION

**CLOSED** — Crystal orientation and about encounter surfaces styled. Codexstone seal wired. c3field links seated. Media locators registered pending operator filename verification.

Crystal orientation begins the governed site frame.
Crystal encounter continues the governed branch explanation.
Codexstone Seal marks registered standing.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
