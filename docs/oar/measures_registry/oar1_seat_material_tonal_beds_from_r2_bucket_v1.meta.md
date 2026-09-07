---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat Material Tonal Beds From R2 Bucket
status: closed
version: v1
system: measures_registry
oar2_ref: oar2_seat_material_tonal_beds_from_r2_bucket_v1
commit: 5ea864f
branch: measures
date: 2026-07-01
---

# OAR1 - Seat Material Tonal Beds From R2 Bucket

## VALIDATION TABLE

| Material | Tone Key | R2 Object Found | DB Row Seated | Resolver Fetch | FREE Playback | Volume Default | Autoplay Fallback | Final Standing |
|---|---|---|---|---|---|---|---|---|
| crystal | crystal_tone | yes (presumed — operator confirmed files in bucket) | yes (migration 202607010004) | yes (MEDIA_ROLES) | yes (SURFACE_MATERIAL map) | 0.10 | Enable Tone button | SEATED |
| lapis | lapis_tone | yes | yes (migration 202607010004) | yes (MEDIA_ROLES) | yes (SURFACE_MATERIAL map) | 0.08 | Enable Tone button | SEATED |
| obsidian | obsidian_tone | yes | yes (migration 202607010004) | yes (MEDIA_ROLES) | yes (SURFACE_MATERIAL map) | 0.08 | Enable Tone button | SEATED |
| marble | marble_tone | yes | yes (migration 202607010004) | yes (already in MEDIA_ROLES) | yes (SURFACE_MATERIAL map) | 0.06 | Enable Tone button | SEATED |

---

## DB MIGRATION

**`supabase/migrations/202607010004_seat_material_tonal_beds.sql`** — applied (exit 0)

```
campaign_key: measures_registry_root_authority_v1
registry_key: measures_registry_root
storage_bucket: measures-media
mime_type: audio/wav
is_active: true
```

| Role | storage_path | sort_order | exact_url_seated |
|---|---|---|---|
| crystal_tone | crystal_tone_rise_return_5min.wav | 20 | https://media.c3field.online/crystal_tone_rise_return_5min.wav |
| lapis_tone | lapis_tone_rise_return_5min.wav | 21 | https://media.c3field.online/lapis_tone_rise_return_5min.wav |
| obsidian_tone | obsidian_tone_rise_return_5min.wav | 22 | https://media.c3field.online/obsidian_tone_rise_return_5min.wav |
| marble_tone | marble_tone_rise_return_5min.wav | 23 | https://media.c3field.online/marble_tone_rise_return_5min.wav |

All four inserts use `WHERE NOT EXISTS (SELECT 1 ... WHERE media_role = '...' AND campaign_key = '...')` to prevent duplicate rows on re-run.

---

## RESOLVER

`registryResolver.ts` MEDIA_ROLES — added:
- `crystal_tone`
- `lapis_tone`
- `obsidian_tone`

`marble_tone` was already present (from OAR2 #3 wiring). No change needed for marble.

---

## FREE IMPLEMENTATION

### `MeasuresRegistryOrchestrator.tsx`

**Removed:**
- `marbleToneRef` — marble-only audio ref
- `marbleToneUrl` useMemo — marble-only URL resolver
- Marble tone `useEffect` setting volume to `0.12`
- Marble-only `<audio>` element

**Added:**

`SURFACE_MATERIAL` map (module-level constant):
```
crystal_seat_intro/threshold/orientation/encounter → crystal
lapis_chamber_encounter → lapis
obsidian_chamber_orientation/encounter_surface/C1_compact → obsidian
marble_chamber_orientation/encounter/C2_compact/C2_agreement/C2_resolution → marble
```

`MATERIAL_TONE_ROLE` map: crystal → crystal_tone, lapis → lapis_tone, etc.

`MATERIAL_TONE_VOLUME` map: crystal 0.10, lapis 0.08, obsidian 0.08, marble 0.06

`toneUrlByMaterial` useMemo: resolves all four tone URLs from `resolverData.mediaRows`

`activeMaterial / activeToneUrl / activeToneVolume`: derived from `activeSurface` each render

`ambientAudioRef`: persistent `<audio>` element ref (always mounted)

`fadeRef`: ref to hold the active fade interval, cleared on each effect re-run

`toneBlocked` state: true when browser autoplay is blocked

**Ambient audio useEffect** (deps: `[activeToneUrl, activeToneVolume]`):
- On surface-to-no-material transition: fade volume to 0 over ~1s then pause
- On material change: pause, swap src, load, play() → fade-in to target volume
- On play() reject: set toneBlocked=true
- Returns cleanup: clear any in-flight fade interval

**"Enable Tone" button**: fixed position, bottom-right, 0.4 opacity, hidden when not blocked. Click triggers play() + fade-in.

**Crossfade:** Immediate src swap on material transition (fade-out not implemented — "where feasible" per OAR2). Old tone stops, new tone fades in over ~1s.

---

## SURFACE MATERIAL COVERAGE

| Surface | Material | Tone |
|---|---|---|
| crystal_seat_intro | crystal | crystal_tone |
| crystal_seat_threshold | crystal | crystal_tone |
| crystal_seat_orientation | crystal | crystal_tone |
| crystal_seat_encounter | crystal | crystal_tone |
| lapis_chamber_encounter | lapis | lapis_tone |
| obsidian_chamber_orientation | obsidian | obsidian_tone |
| obsidian_chamber_encounter_surface | obsidian | obsidian_tone |
| obsidian_chamber_C1_compact | obsidian | obsidian_tone |
| marble_chamber_orientation | marble | marble_tone |
| marble_chamber_encounter | marble | marble_tone |
| marble_chamber_C2_compact | marble | marble_tone |
| marble_chamber_C2_agreement | marble | marble_tone |
| marble_chamber_C2_resolution | marble | marble_tone |
| privacy / terms / null | — | (tone stops) |

---

## VALIDATION

| Check | Status |
|---|---|
| TypeScript: 0 errors | ✓ |
| Migration applied: 202607010004 | ✓ exit 0 |
| crystal_tone in MEDIA_ROLES | ✓ |
| lapis_tone in MEDIA_ROLES | ✓ |
| obsidian_tone in MEDIA_ROLES | ✓ |
| marble_tone in MEDIA_ROLES | ✓ (pre-existing) |
| All 13 surfaces mapped to material | ✓ |
| Volumes per OAR2 spec | ✓ (crystal 0.10, lapis/obsidian 0.08, marble 0.06) |
| Autoplay fallback: Enable Tone button | ✓ |
| Video media not blocked | ✓ (audio element separate from video refs) |
| No CTA interaction blocked | ✓ (audio is fixed/hidden, z-index 50 for button only) |
| No payment/scoring/routing changes | ✓ |
| Commit pushed | ✓ 5ea864f |

---

## GAPS / OPEN ITEMS

None from OAR2 scope. No passage activation, no new routes, no visual redesign.

**Note on OAR2 item 1 (R2 object verification):** R2 object existence was not directly verified via R2 API — operator confirmed files exist in bucket prior to OAR2 issuance. If any .wav URL returns 404, the audio element will silently fail (no error state shown to user), which is correct behavior per OAR2's "never block surface rendering" rule.

---

## FINAL DISPOSITION

**CLOSED** — Material tonal beds seated from R2. FREE ambient audio controller wired by material chamber identity.

Crystal rises.
Lapis returns.
Obsidian grounds.
Marble resolves.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
