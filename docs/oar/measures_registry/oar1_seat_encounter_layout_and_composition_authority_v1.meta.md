---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_layout_composition_authority
title: OAR1 - Seat Encounter Layout and Composition Authority
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_seat_encounter_layout_and_composition_authority_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar1
  - measures-registry
  - layout-authority
  - composition-authority
  - encounter-rendering
  - visual-governance
---

# OAR1 - Seat Encounter Layout and Composition Authority

## Result

RESOLVED.

Layout and composition vocabulary is now bounded in TypeScript, the encounter style profile contract carries the four new fields, and all 14 active surfaces have `layout_profile` / `mobile_layout_profile` / `composition_profile` / `mobile_composition_profile` seated except the one documented gap (`marble_chamber_encounter`, which has no visible DOM). `publication_dispatch` remains excluded, unchanged, per boundary.

No CSS was rewritten. No renderer attributes were wired. No live visual behavior changed. This closes the DB-authority gate; a later OAR is required before any renderer/CSS consumption of these fields.

## Evidence Basis

This OAR reused the browser QA evidence already gathered and recorded in [oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md](oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md) and the screenshots in [oar1_browser_qa_seat_held_encounter_style_fields_v1_evidence/](oar1_browser_qa_seat_held_encounter_style_fields_v1_evidence/) (desktop 1440×900 + mobile 390×844, all 14 surfaces, captured against a local dev server running unmodified production source against the same Supabase project). No additional browser inspection was needed — the OBSERVED section of this OAR2 named specific, already-visible drift (threshold mobile, MAP three-panel/hero conflation, MAP mobile stacking, results-card narrowness, payment-agreement thinness), all of which is visible in that existing evidence set.

## 1. Layout and Composition Vocabulary

Added to [src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts](../../../src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts):

- `LayoutProfile` union: `hero_layout | split_layout | stacked_layout | editorial_layout | report_layout | assessment_layout | form_layout | three_panel_layout | single_card_layout | chamber_layout`
- `CompositionProfile` union: `cinematic_composition | threshold_composition | institutional_composition | assessment_composition | document_composition | exchange_composition | ceremonial_composition | publication_composition | confirmation_composition`
- `EncounterStyleProfile` extended with `layout_profile`, `mobile_layout_profile`, `composition_profile`, `mobile_composition_profile` (all `| null`), kept distinct from `frame_profile`, `space_profile`, `content_anchor`, `content_width`, `mobile_behavior` as required.
- `GAP_FIELDS` updated to include the four new keys as `null`, so `resolveEncounterStyleProfile()` continues to return only `profile_key` as non-null and every other field — including the four new ones — as a documented gap. Behavior of every existing call site (`data-style-profile={...?.profile_key}`) is unchanged; verified no file constructs an `EncounterStyleProfile` object literal other than `encounterStyleProfile.ts` itself (`chambers/*.tsx` only read `.profile_key`).

No renderer file was edited. No CSS file was edited.

## 2. Per-Surface Layout and Composition Assignments

| surface_key | layout_profile | mobile_layout_profile | composition_profile | mobile_composition_profile | basis |
| --- | --- | --- | --- | --- | --- |
| crystal_seat_intro | hero_layout | hero_layout | cinematic_composition | cinematic_composition | Full-viewport video, one dominant media area; mobile evidence (`01_crystal_intro_mobile.png`) shows the identical full-bleed treatment preserved — no layout change between viewports. |
| crystal_seat_threshold | split_layout | **stacked_layout** (target authority — see drift note) | threshold_composition | threshold_composition | Two equal panels presenting two paths ("Assess" / "Understand") = textbook `split_layout`. Composition is passage/choice emphasis = `threshold_composition`. **Drift:** OAR2 OBSERVED names this surface explicitly — mobile evidence (`02_crystal_threshold_mobile.png`) shows the desktop 50/50 split literally preserved at 390px (two 195px columns), not resolved into a mobile-appropriate arrangement. `mobile_layout_profile` is seated as the *target* authority (`stacked_layout`) per the OAR2 rendering order (DB authority precedes CSS execution); current CSS does not yet match this seated value. Flagged for the follow-up renderer/CSS OAR. |
| crystal_seat_orientation | hero_layout | stacked_layout | institutional_composition | institutional_composition | Portrait talking-head video is the dominant anchor with supporting governed copy — closer to a high-impact single-anchor entry surface than a two-choice split. Mobile evidence (`12_crystal_orientation_mobile.png`) confirms video stacks above copy, matching `stacked_layout`. Copy is Codexstone/legibility-forward = `institutional_composition`. |
| crystal_seat_encounter | editorial_layout | stacked_layout | institutional_composition | institutional_composition | Multi-section long-form public page (seal, orientation, our story, bridge, connect) — matches `editorial_layout`'s "article/publication-style" definition. Mobile evidence (`11_crystal_encounter_about_mobile.png`) confirms full stack. Institutional/trust framing throughout. |
| obsidian_chamber_orientation | hero_layout | stacked_layout | threshold_composition | threshold_composition | Video-anchored pre-assessment briefing functioning as a passage into the diagnostic — `hero_layout` + `threshold_composition`. Mobile evidence (`03_obsidian_orientation_mobile.png`) confirms stack. |
| obsidian_chamber_encounter_surface | assessment_layout | assessment_layout | assessment_composition | assessment_composition | Progress indicator ("1 OF 7"), question, radio options, textarea, Continue — exact match for `assessment_layout` / `assessment_composition`. Desktop and mobile evidence (`04_*`) show the same vertical question-card arrangement at both viewports, only the card width changes — no distinct mobile layout. |
| obsidian_chamber_C1_compact | form_layout | form_layout | institutional_composition | institutional_composition | Contact/consent field list with legal notices — `form_layout`. Legibility/trust framing (privacy/terms notices, standing-boundary copy) = `institutional_composition`, consistent at both viewports per evidence (`05_*`). |
| marble_chamber_orientation | single_card_layout | single_card_layout | ceremonial_composition | ceremonial_composition | One centered card ("Assessment Complete") over a full-bleed ceremonial marble hall — exact `single_card_layout`. Marble-hall gravity/centering = `ceremonial_composition`. Mobile evidence (`06_marble_orientation_mobile.png`) confirms the same centered-card composition, just narrower. |
| marble_chamber_results | report_layout | **stacked_layout** | **document_composition** (target authority — see drift note) | document_composition | Structured findings document — `report_layout` / `document_composition` are direct vocabulary matches. **Drift:** OAR2 OBSERVED names "marble results report card is too narrow in large desktop space" — desktop evidence (`07_marble_results_desktop.png`) measured the card at ~47% of viewport width, narrow for a document-gravity composition. `document_composition` is seated as the target authority implying a wider desktop measure than currently rendered; the narrowness itself is a content_width/CSS gap for a later OAR, not resolved here. Mobile evidence confirms full-width stacking. |
| marble_chamber_encounter | null (held) | null (held) | null (held) | null (held) | No visible DOM. `MarbleChamberRenderer.tsx:70-74` returns `null` and immediately calls `onNavigate("marble_chamber_results")`. Per OAR2 explicit instruction, left null/held unless Field/Measures converts it to a real surface. `release_state_behavior` (`unavailable_state`) was already seated in the prior OAR and is unchanged. |
| marble_chamber_C2_compact | three_panel_layout | **stacked_layout** | **exchange_composition** (target authority — see drift note) | **exchange_composition** (target authority — see drift note) | CAR panel / center overview / exchange panel is a genuine `three_panel_layout` (three distinct authorities visible together, per vocab). **Drift:** OAR2 OBSERVED names two issues on this surface — (a) desktop: "tries to act as left rail / center chamber / right exchange and hero at the same time," i.e. the ceremonial marble-hall background pulls toward a chamber/hero read that competes with the three-panel structure; (b) mobile: "stacks desktop structure without becoming a mobile composition." Both `composition_profile` and `mobile_composition_profile` are seated as `exchange_composition` — declaring the single authoritative composition intent (payment/continuation exchange, not chamber/hero) that should govern both viewports once a later CSS OAR implements it. Desktop evidence (`08_marble_c2_compact_desktop.png`, panel span 1400/1440) and mobile evidence (`08_marble_c2_compact_mobile.png`, mechanical vertical stack of the same three panels) are the observed basis for naming this a target rather than a confirmed-matching value. |
| marble_chamber_C2_agreement | single_card_layout | single_card_layout | **exchange_composition** (target authority — see drift note) | exchange_composition | Centered panel with one payment CTA — `single_card_layout`. **Drift:** OAR2 OBSERVED names "payment agreement surface lacks sufficient composition content and visual anchor" — evidence (`09_marble_c2_agreement_desktop.png`) shows a mostly-empty centered panel (title, pathway line, single button) against a large ceremonial marble background. `exchange_composition` is seated as the correct target intent for a payment-agreement surface; the thinness itself is a content/copy gap for Field/Measures to fill in a later pass, not a classification gap this OAR can close. Mobile evidence confirms the same sparse centered composition, unchanged. |
| marble_chamber_C2_resolution | single_card_layout | single_card_layout | confirmation_composition | confirmation_composition | Centered "Registration Received" confirmation panel with a single Finish CTA — exact `single_card_layout` / `confirmation_composition` match at both viewports per evidence (`10_*`). |
| lapis_chamber_encounter | editorial_layout | stacked_layout | publication_composition | publication_composition | Magazine-style feature grid (masthead, hero feature, feature articles, sidebar CTA) — `editorial_layout` is named explicitly in the OAR2 vocabulary for "unDrifted and long-form public content." `publication_composition` (editorial hierarchy, story grouping, article discovery) is a direct match. Mobile evidence (`13_lapis_encounter_mobile.png`) confirms the grid collapses to one stacked column. |

## Drift Registered, Not Fixed

Per OAR2 §8 ("No CSS rewrite under this OAR") and the CODY ROLE boundary, the following are seated as **target authority** — the value layout/composition authority ought to resolve to — even where current rendering does not yet match it. No CSS or renderer file was touched to close these gaps; each requires a follow-up OAR:

1. `crystal_seat_threshold.mobile_layout_profile = stacked_layout` — currently renders as a preserved 50/50 split at 390px.
2. `marble_chamber_results.composition_profile = document_composition` — currently renders as a narrower-than-document-gravity card on large desktop viewports.
3. `marble_chamber_C2_compact.composition_profile` / `mobile_composition_profile = exchange_composition` — desktop currently reads as three-panel-plus-hero/chamber background competing for attention; mobile currently reads as a mechanical stack of the desktop panels rather than a deliberately composed mobile sequence.
4. `marble_chamber_C2_agreement.composition_profile = exchange_composition` — currently under-filled with content relative to the surrounding ceremonial marble background, so the intended exchange emphasis reads as visually thin.

These four are flagged explicitly so a later renderer/CSS OAR can close them against a seated, governed target rather than re-deriving intent from scratch.

## Validation Query Output

```sql
select
  surface_key,
  metadata->>'style_profile' as style_profile,
  metadata->>'layout_profile' as layout_profile,
  metadata->>'mobile_layout_profile' as mobile_layout_profile,
  metadata->>'composition_profile' as composition_profile,
  metadata->>'mobile_composition_profile' as mobile_composition_profile,
  metadata->>'release_state_behavior' as release_state_behavior
from public.measures_encounter_surface_assignment
where surface_key in (
  'crystal_seat_intro', 'crystal_seat_threshold', 'crystal_seat_orientation', 'crystal_seat_encounter',
  'obsidian_chamber_orientation', 'obsidian_chamber_encounter_surface', 'obsidian_chamber_C1_compact',
  'marble_chamber_orientation', 'marble_chamber_results', 'marble_chamber_encounter',
  'marble_chamber_C2_compact', 'marble_chamber_C2_agreement', 'marble_chamber_C2_resolution',
  'lapis_chamber_encounter', 'publication_dispatch'
)
order by surface_key;
```

| surface_key | style_profile | layout_profile | mobile_layout_profile | composition_profile | mobile_composition_profile | release_state_behavior |
| --- | --- | --- | --- | --- | --- | --- |
| crystal_seat_encounter | public_about_encounter | editorial_layout | stacked_layout | institutional_composition | institutional_composition | visible_state |
| crystal_seat_intro | media_intro_full_bleed | hero_layout | hero_layout | cinematic_composition | cinematic_composition | visible_state |
| crystal_seat_orientation | talking_head_orientation | hero_layout | stacked_layout | institutional_composition | institutional_composition | visible_state |
| crystal_seat_threshold | split_threshold_motion_still | split_layout | stacked_layout | threshold_composition | threshold_composition | visible_state |
| lapis_chamber_encounter | publication_index_promoted | editorial_layout | stacked_layout | publication_composition | publication_composition | visible_state |
| marble_chamber_C2_agreement | marble_payment_surface_profile | single_card_layout | single_card_layout | exchange_composition | exchange_composition | dependent_state |
| marble_chamber_C2_compact | marble_map_surface_profile | three_panel_layout | stacked_layout | exchange_composition | exchange_composition | visible_state |
| marble_chamber_C2_resolution | marble_confirmation_surface_profile | single_card_layout | single_card_layout | confirmation_composition | confirmation_composition | dependent_state |
| marble_chamber_encounter | assessment_findings_report | null | null | null | null | unavailable_state |
| marble_chamber_orientation | marble_orientation_surface_profile | single_card_layout | single_card_layout | ceremonial_composition | ceremonial_composition | visible_state |
| marble_chamber_results | marble_results_surface_profile | report_layout | stacked_layout | document_composition | document_composition | dependent_state |
| obsidian_chamber_C1_compact | compact_contact_capture | form_layout | form_layout | institutional_composition | institutional_composition | dependent_state |
| obsidian_chamber_encounter_surface | assessment_form_surface | assessment_layout | assessment_layout | assessment_composition | assessment_composition | visible_state |
| obsidian_chamber_orientation | media_orientation_full_bleed | hero_layout | stacked_layout | threshold_composition | threshold_composition | visible_state |
| publication_dispatch | null | null | null | null | null | null |

All 13 real surfaces carry seated values for all four fields. `marble_chamber_encounter` carries null for all four, with `release_state_behavior: unavailable_state` (seated in the prior OAR, unchanged here) as the only non-null field — justified above. `publication_dispatch` remains fully unseated.

## Publication Dispatch Gap

Unchanged from the prior OAR1: `publication_dispatch` has no `style_profile` binding, so per OAR2 boundary no layout or composition authority was seated for it. Still requires a resolver/style-profile binding decision in a later OAR.

## Boundary Preservation

- No CSS was rewritten.
- No renderer attributes were wired (chamber renderers still only read `resolveEncounterStyleProfile(...)?.profile_key`; nothing reads the four new fields anywhere in `src/`).
- No layout, mobile, MAP, payment, assessment, release/routing, or public-claims behavior was changed.
- `publication_dispatch` was not seated.
- No duplicate layout or composition authority surface was created — all four fields landed as sibling keys on the existing `measures_encounter_surface_assignment.metadata` object.
- No previously-seated field (style authority from the prior OAR, or `release_state_behavior`) was altered — verified in the validation query above.

## Closeout

Layout and composition vocabulary is now bounded in code and DB. Per-surface authority is seated for 13 of 14 active surfaces, with the 14th (`marble_chamber_encounter`) honestly held for lack of a visible DOM. Four specific drift points named in this OAR2's OBSERVED section were registered as target authority rather than silently matched to current (incorrect) rendering, and are flagged for a follow-up renderer/CSS OAR. No visual change occurred in this OAR.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody classified from existing browser evidence and seated layout/composition authority.
src was not changed.
