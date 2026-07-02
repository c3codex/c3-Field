---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Launchable Path to Marble Chamber Entry
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Launchable Path to Marble Chamber Entry

## OBJECTIVE

Make the public Measures Registry path launchable through entry into the Marble Chamber.

This OAR does not attempt to finish every downstream Marble/MAP/payment polish item.

Target launchable path:

    crystal_seat_intro
      -> crystal_seat_threshold
        -> obsidian_chamber_orientation
          -> obsidian_chamber_encounter_surface
            -> obsidian_chamber_C1_compact
              -> marble_chamber_orientation

Success means the user can reliably reach the Marble Chamber orientation from public entry.

## OBSERVED ISSUES TO FIX

Current launch-blocking issues before Marble entry:

1. Media does not reliably load.
2. Large top header dominates encounter frame.
3. Crystal threshold does not show L/R animated-to-still behavior.
4. Talking-head media has no clear sound enable/control.
5. Codexstone seal is too small.
6. Crystal orientation/about media locator may be wrong.
7. Obsidian orientation is missing or surfacing wrong/internal terminology.
8. Obsidian orientation media should be `obsidian`, not `structural_coherence_explainer`.
9. Assessment works.
10. Contact capture works.
11. Transition into Marble must route to `marble_chamber_orientation`.
12. Marble orientation should be reachable and contained enough to confirm chamber entry.
13. Material tones load but volume must be lower.

## SCOPE

In scope:

- Crystal intro
- Crystal threshold
- Crystal orientation
- Crystal encounter/about only as needed for right-path launchability
- Obsidian orientation
- Obsidian assessment
- Obsidian C1 compact/contact capture
- Transition into Marble orientation
- Tone volume
- Header/footer/frame containment through Marble entry

Out of scope:

- full Marble MAP redesign
- payment QA
- Stripe rewrite
- confirmation polish
- c3field.online buildout
- full /undrifted redesign
- passage/antechamber activation

## REQUIRED FLOW

### Crystal

`crystal_seat_intro`
- media: `ai_isnt_broken_intro`
- must load without awkward manual click where browser permits
- if autoplay/audio blocked, show clear play/audio control

`crystal_seat_threshold`
- L/R threshold
- media: animated-to-still threshold media
- choices:
  - Assess the Environment -> `obsidian_chamber_orientation`
  - Understand the Environment -> `crystal_seat_orientation`
- no `crystal_seat_split_path`
- no `crystal_seat_orientation_passage`

`crystal_seat_orientation`
- media: `measures_position`
- governed site section
- Codexstone seal visibly readable
- CTA to `crystal_seat_encounter`
- one-frame preferred
- if scroll required, CTA reachable

`crystal_seat_encounter`
- route: `/about-measures-registry`
- verify `about_measures_registry` R2 locator
- do not block left-path launchability

### Obsidian

`obsidian_chamber_orientation`
- media_locator: `obsidian`
- content_profile: assessment orientation content
- public-facing language only
- no `structural_coherence_explainer`
- no internal terms
- not a passage
- next: `obsidian_chamber_encounter_surface`

`obsidian_chamber_encounter_surface`
- route: `/ai-operations-assessment`
- assessment must still work
- next after final question: `obsidian_chamber_C1_compact`

`obsidian_chamber_C1_compact`
- contact_capture + email continuance
- consent/acknowledgement bundle
- submit must write pending report and continue
- next: `marble_chamber_orientation`

### Marble Entry

`marble_chamber_orientation`
- entry surface into Marble Chamber
- must be reachable after C1 compact
- media: `assessment_report_orientation` if locator active
- if media missing, render clean contained gap state
- must not fullscreen-dominate page
- CTA reachable

## MEDIA LOCATOR REPAIRS

Cody must audit and repair where dependency-safe:

- `ai_isnt_broken_intro`
- threshold L/R animation-to-still media
- `measures_position`
- `official_codexstone_seal`
- `about_measures_registry`
- `obsidian`
- `assessment_report_orientation`

Correct known drift:

- replace active use of `structural_coherence_explainer` with `obsidian`
- verify `about_measures_registry` R2 object title/path exactly
- verify `official_codexstone_seal` Supabase object path exactly

Do not invent media URLs.

If a media locator is missing, report exact blocker.

## FRAME / STYLE REPAIRS

Apply through Marble entry:

- remove or minimize oversized generic top header
- keep immersive surfaces one-frame where possible
- make scroll obvious where required
- guarantee CTA reachability
- increase Codexstone seal size
- lower material tone volumes:
  - crystal <= 0.035
  - lapis <= 0.03
  - obsidian <= 0.025
  - marble <= 0.02
- provide user audio control where browser policy requires interaction

## TRANSITION REPAIR

Critical transition:

    obsidian_chamber_encounter_surface
      -> obsidian_chamber_C1_compact
        -> marble_chamber_orientation

No active transition may point to:

- `obsidian_to_marble_passage_video`
- `obsidian_chamber_orientation_passage`
- `crystal_seat_orientation_passage`
- `structure_passage`

Passages and antechambers remain held for secured/scale.

## DO NOT TOUCH

This OAR does not authorize:

- scoring changes
- assessment question changes
- report copy rewrite
- payment/Stripe changes
- MAP redesign
- certification claims
- conversion claims
- passage activation
- antechamber activation
- registered_runtime restoration

## REQUIRED OAR1 TABLE

OAR1 must include:

- surface
- issue found
- media locator status
- transition status
- style/frame action
- browser validation
- remaining blocker

Minimum rows:

- crystal_seat_intro
- crystal_seat_threshold
- crystal_seat_orientation
- crystal_seat_encounter
- obsidian_chamber_orientation
- obsidian_chamber_encounter_surface
- obsidian_chamber_C1_compact
- marble_chamber_orientation
- material tones
- header/footer/frame

## VALIDATION

Validation succeeds when:

- user can enter site
- user can choose Assess the Environment
- user reaches Obsidian orientation
- Obsidian orientation shows public content and correct media or clean media gap
- assessment works
- contact capture works
- user reaches Marble orientation
- no held passage surface is reached
- Codexstone seal is readable on Crystal orientation
- header no longer dominates launch path
- CTA remains reachable on all launch path surfaces
- tones are lower volume
- TypeScript/build passes or exact failure is reported

## EXPECTED OAR1

docs/oar/measures_registry/oar1_launchable_path_to_marble_chamber_entry_v1.meta.md

## CLOSE

Make the path launchable through Marble entry.

Crystal opens.
Obsidian assesses.
C1 captures.
Marble receives.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
