---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat Material Tonal Beds From R2 Bucket
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat Material Tonal Beds From R2 Bucket

## OBSERVED

Measures Registry needs material tonal beds as site atmosphere.

The tonal bed files already exist in the R2 bucket.

Files:

- `crystal_tone_rise_return_5min.wav`
- `lapis_tone_rise_return_5min.wav`
- `obsidian_tone_rise_return_5min.wav`
- `marble_tone_rise_return_5min.wav`

This is not an upload task.

This is R2 media locator seating and ambient playback wiring.

## ALIGNED

Material tones are atmospheric Field mechanics.

They are not authority.

They do not define chamber standing.

They do not determine release state.

They do not block interaction.

They support public appearance and chamber identity.

FREE is the Field public render surface.

CSS implements mechanics.

DB holds media locator standing.

## MATERIAL TONE MAP

### Crystal

- material: `crystal`
- tone_key: `crystal_tone`
- r2_object: `crystal_tone_rise_return_5min.wav`
- default_volume: `0.10`
- loop: true
- use:
  - `crystal_seat_intro`
  - `crystal_seat_threshold`
  - `crystal_seat_orientation`
  - `crystal_seat_encounter`

### Lapis

- material: `lapis`
- tone_key: `lapis_tone`
- r2_object: `lapis_tone_rise_return_5min.wav`
- default_volume: `0.08`
- loop: true
- use:
  - `lapis_chamber_encounter`

### Obsidian

- material: `obsidian`
- tone_key: `obsidian_tone`
- r2_object: `obsidian_tone_rise_return_5min.wav`
- default_volume: `0.08`
- loop: true
- use:
  - `obsidian_chamber_orientation`
  - `obsidian_chamber_encounter_surface`
  - `obsidian_chamber_C1_compact`

### Marble

- material: `marble`
- tone_key: `marble_tone`
- r2_object: `marble_tone_rise_return_5min.wav`
- default_volume: `0.06`
- loop: true
- use:
  - `marble_chamber_orientation`
  - `marble_chamber_encounter`
  - `marble_chamber_C2_compact`
  - `marble_chamber_C2_agreement`
  - `marble_chamber_C2_resolution`

## PLAYBACK RULE

Material tones should:

- play at low volume
- loop
- fade in
- fade out
- crossfade between material chambers where feasible
- respect browser autoplay limits
- provide user control if playback is blocked
- never block surface rendering
- never block CTA interaction

If unmuted autoplay is blocked by browser policy:

- show subtle "Enable Ambient Tone" control
- preserve route progression
- do not show an error state

## DB-HELD MEDIA LOCATOR RULE

Cody must seat media locator standing for each tone.

Preferred DB target:

- `measures_media_map`

Required fields or metadata equivalent:

- material_identity
- media_role
- media_key / tone_key
- storage_path / r2_object
- media_type: audio
- is_active: true
- default_volume
- loop
- standing: ambient_tone
- source: R2

Do not hardcode R2 paths in renderer if DB media locator can hold them.

## FREE IMPLEMENTATION RULE

FREE must resolve material tone by active surface material.

Surface material source:

- `encounter.materialIdentity`
- or chamber/material assignment already in resolved encounter

FREE should select tone by material:

- crystal -> crystal_tone
- lapis -> lapis_tone
- obsidian -> obsidian_tone
- marble -> marble_tone

No page-specific hardcoding unless used as fallback.

## ROUTED

Cody must:

1. Verify all four R2 objects exist.
2. Seat media locator rows for all four tonal beds.
3. Add or update resolver fetch scope for material tone audio.
4. Add ambient audio controller if none exists.
5. Bind active tone to current material chamber.
6. Set low-volume defaults.
7. Support browser autoplay fallback.
8. Provide visible user control if required.
9. Preserve existing media playback behavior for surface videos.
10. Run TypeScript/build validation.
11. Write OAR1 with before/after evidence.

## DO NOT TOUCH

This OAR does not authorize:

- new chamber surfaces
- route changes
- report copy changes
- scoring changes
- payment changes
- Stripe changes
- passage activation
- antechamber activation
- registered_runtime restoration
- visual redesign

## REQUIRED OAR1 TABLE

OAR1 must include:

- material
- tone_key
- r2_object found yes/no
- DB media locator seated yes/no
- resolver fetch yes/no
- FREE playback yes/no
- volume default
- autoplay fallback
- final standing

## VALIDATION

Validation succeeds when:

- all four tonal bed R2 objects are found
- all four media locator records are seated and active
- FREE can resolve tone by material chamber
- tone plays low-volume where browser permits
- tone can be enabled manually if autoplay blocks
- tone does not block video media
- tone does not block navigation or CTA
- TypeScript/build passes or exact failure is reported
- OAR1 records proof and remaining gaps

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_material_tonal_beds_from_r2_bucket_v1.meta.md

## CLOSE

Material tones are seated from R2.

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
