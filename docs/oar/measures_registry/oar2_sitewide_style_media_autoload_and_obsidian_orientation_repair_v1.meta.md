---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Sitewide Style Media Autoload and Obsidian Orientation Repair
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Sitewide Style Media Autoload and Obsidian Orientation Repair

## OBSERVED

The 13 registered surfaces now render and consume DB-held standing.

Remaining launch blockers are Field/style/runtime behavior:

- surfaces need a coherent sitewide style profile
- page setup, buttons, fonts, branding, and CTA visibility need consistency
- one-frame display is preferred wherever possible
- if scrolling is required, scrolling must be obvious and CTA-safe
- media should autoload and auto-advance where appropriate
- audio should not default mute
- marble_tone should play low-volume sitewide
- intro currently requires click/manual action before loading correctly
- report surface can trap the CTA out of reach
- /undrifted lacks media presence
- crystal_seat_orientation reachability/media still needs QA
- obsidian_chamber_orientation is surfacing internal terms and has no media

This is not architecture creation.

This is launch QA and Field appearance repair.

## ALIGNED

FREE is the public render surface of Field.

Field arranges public appearance.

DB holds style/content/media/directory standing.

CSS implements mechanics.

Sitewide style profile governs the frame.

Surface style profile governs the encounter.

No CSS-owned truth.

No frontend-owned authority.

## SITEWIDE STYLE PROFILE

Seat and implement:

- sitewide_style_profile: `measures_registry_public_frame`

This profile governs:

- page shell
- frame behavior
- one-frame preference
- scroll fallback
- CTA visibility
- typography
- button system
- logo/brand placement
- background/media behavior
- mobile/laptop containment
- accessibility states
- global spacing
- page transition safety

## FRAME RULE

One-frame layout is preferred.

If a surface can fit in one viewport, keep it in one frame.

If content exceeds one frame:

- scrolling must be obvious
- CTA must remain reachable
- CTA must not render below inaccessible overflow
- no user should have to discover hidden scroll accidentally
- laptop and mobile containment must both be tested

Report CTA is launch-blocking if inaccessible.

## BUTTON / CTA RULE

All primary CTAs must be:

- visible
- reachable
- keyboard accessible
- mobile reachable
- not hidden behind overflow
- not dependent on accidental scroll discovery

Buttons must be consistent sitewide unless a surface style profile intentionally differs.

## FONT / BRANDING RULE

Apply consistent sitewide:

- font scale
- button styling
- logo/mark placement
- footer behavior where applicable
- watermark/brand treatment
- material chamber atmosphere without SaaS block drift

No surface should feel like it comes from a different site unless intentionally chamber-styled.

## MEDIA AUTLOAD / AUTO ADVANCE RULE

Media-bearing surfaces must support:

- autoload
- auto-play where browser permits
- auto-advance after completion where seated
- graceful fallback if autoplay is blocked
- visible manual continue control
- no default mute for audio-bearing media

If browser autoplay policy blocks unmuted media, FREE must:

- show clear tap-to-play control
- preserve route progression
- avoid blank/failed surface state

## AUDIO RULE

Audio should not default mute.

Sitewide ambient audio:

- `marble_tone`
- low volume
- whole-site ambient layer
- should not block interaction
- should respect browser autoplay limitations
- should provide user control if required

Do not make marble_tone surface authority.

It is ambient atmosphere.

## OBSIDIAN ORIENTATION REPAIR

`obsidian_chamber_orientation` currently has two launch blockers:

1. It surfaces internal terms.
2. It has no media.

Required repair:

- remove internal/implementation-facing terms from public display
- render public-facing orientation copy only
- use DB-held content_profile where seated
- use media_locator for `structural_coherence_explainer` or correct seated media
- if media is missing, report exact media gap
- do not show registry keys, surface keys, renderer terms, contract terms, or internal OAR language publicly

Public-facing intent:

- prepare the user for AI Operations Assessment
- explain structural coherence / operational drift in public language
- continue into `obsidian_chamber_encounter_surface`

## UNDIFTED MEDIA REPAIR

`lapis_chamber_encounter` must have media presence if media is seated.

Cody must verify:

- media_locator for /undrifted
- article card media roles
- lapis background / publication media
- Paragraph article cover image roles

If media is missing:

- report exact missing media rows or campaign fetch issue
- do not invent media URLs

## CRYSTAL ORIENTATION QA

Cody must verify:

- `crystal_seat_intro` uses `ai_isnt_broken_intro`
- `crystal_seat_threshold` owns L/R motion-to-still
- `crystal_seat_orientation` uses `measures_position`
- right path routes to `crystal_seat_orientation`
- no active path routes to `crystal_seat_orientation_passage`

If orientation still shares the wrong registry/media authority, report exact gap and fix only if dependency-safe.

## ROUTED

Cody must:

1. Audit current sitewide layout/CSS frame behavior.
2. Seat or use `sitewide_style_profile = measures_registry_public_frame`.
3. Repair CTA visibility and scroll containment, especially report CTA.
4. Ensure media autoload/auto-advance behavior on media-bearing surfaces.
5. Ensure audio does not default mute where allowed.
6. Add low-volume marble_tone sitewide ambient layer where source exists.
7. Repair obsidian_chamber_orientation public copy/media.
8. Repair /undrifted media presence where DB media exists.
9. Verify crystal orientation routing/media.
10. Run browser/dev validation if available.
11. Run TypeScript/build validation.
12. Write OAR1 with screenshots/notes if possible.

## DO NOT TOUCH

This OAR does not authorize:

- architecture renaming
- new registered surfaces
- passage activation
- antechamber activation
- scoring changes
- report copy rewrite beyond removing internal terms from public orientation display
- payment logic changes
- Stripe changes
- certification claims
- conversion claims
- registered_runtime restoration

## REQUIRED OAR1 TABLE

OAR1 must include:

- issue
- file/component touched
- DB authority used
- CSS/style action
- before state
- after state
- validation result
- remaining gap if any

Minimum validation rows:

- report CTA reachable
- /undrifted media status
- crystal_seat_orientation status
- intro autoload status
- media auto-advance status
- audio mute status
- marble_tone ambient status
- obsidian orientation copy/media status
- mobile/laptop containment status

## VALIDATION

Validation succeeds when:

- sitewide style frame is applied
- report CTA is reachable
- one-frame layout is preserved where possible
- scrolling is obvious and CTA-safe where needed
- buttons/fonts/branding are consistent
- media autoloads and auto-advances where browser permits
- audio does not default mute unless browser blocks autoplay
- marble_tone plays low-volume or exact browser/source blocker is reported
- obsidian_chamber_orientation no longer surfaces internal terms
- obsidian_chamber_orientation has media or exact missing media gap is reported
- /undrifted media presence is restored or exact media gap is reported
- crystal_seat_orientation route/media is verified
- no scoring/report/payment mutation occurs
- TypeScript/build passes or exact failure is reported

## EXPECTED OAR1

docs/oar/measures_registry/oar1_sitewide_style_media_autoload_and_obsidian_orientation_repair_v1.meta.md

## CLOSE

Architecture is seated.

Now Field must render cleanly.

Sitewide frame.
Surface design.
CTA-safe scroll.
Autoload media.
Low-volume marble_tone.
Public-facing Obsidian orientation.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
