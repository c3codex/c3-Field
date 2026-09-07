---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_render_intent_authority
title: OAR1 - Seat Render Intent Authority for Layout Composition Drift
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_seat_render_intent_authority_for_layout_composition_drift_v1.meta.md
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
  - render-intent
  - layout-authority
  - composition-authority
  - drift-resolution
  - visual-governance
---

# OAR1 - Seat Render Intent Authority for Layout Composition Drift

## Result

RESOLVED.

`render_status` and `render_intent` vocabulary is bounded in TypeScript, the encounter style profile contract carries the three new fields (`render_status`, `render_intent`, `render_drift_note`), and all 14 active surfaces have render authority seated: 9 `matched`/`preserve`, 4 `drift_detected` (the exact `transform`/`resolve` values and drift notes prescribed by this OAR2, carried forward from the prior OAR's evidence), and 1 `unavailable`/`hold` for the alias surface with no visible DOM. `publication_dispatch` remains excluded, unchanged.

No CSS was rewritten. No renderer attributes were wired. No live visual behavior changed. This closes the render-intent registration gate; a later OAR is required before any renderer/CSS correction proceeds against `transform`/`resolve` surfaces.

## Evidence Basis

This OAR did not require new browser inspection. All values were already evidenced by the two prior OARs in this sequence:

- [oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md](oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md) + [.../_evidence/](oar1_browser_qa_seat_held_encounter_style_fields_v1_evidence/) — desktop/mobile screenshots and computed layout for all 14 surfaces.
- [oar1_seat_encounter_layout_and_composition_authority_v1.meta.md](oar1_seat_encounter_layout_and_composition_authority_v1.meta.md) — seated target `layout_profile`/`composition_profile` per surface, and named exactly four points where current rendering was observed to diverge from that target ("Drift Registered, Not Fixed" section).

This OAR2 supplied the exact `render_status`/`render_intent`/`render_drift_note` values for the four named drift points and the one alias surface directly in its ROUTED section (§5, §4); those were seated verbatim rather than re-derived, since they are a faithful restatement of the already-evidenced OAR1 findings. The remaining 9 active surfaces had no drift named in either prior OAR1, so — per OAR2 §4 ("only do this where browser QA already supports current rendering alignment") — they were seated `matched`/`preserve`.

## 1. Render Status and Render Intent Vocabulary

Added to [src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts](../../../src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts):

- `RenderStatus` union: `matched | target_registered | drift_detected | held | unavailable`
- `RenderIntent` union: `preserve | transform | suppress | resolve | hold`
- `EncounterStyleProfile` extended with `render_status: RenderStatus | null`, `render_intent: RenderIntent | null`, `render_drift_note: string | null` — kept distinct from style/layout/composition fields per the OAR2 instruction not to collapse them together.
- `GAP_FIELDS` updated to include the three new keys as `null`, so `resolveEncounterStyleProfile()` is unchanged in behavior: it still returns only `profile_key` as non-null, with every other field — including the three new ones — a documented gap.

Verified no file in `src/` reads `render_status`, `render_intent`, `render_drift_note`, `RenderStatus`, or `RenderIntent` anywhere outside `encounterStyleProfile.ts` itself — confirming no renderer was wired and no live visual behavior changed.

No renderer file was edited. No CSS file was edited.

## 2. Per-Surface Render Authority

| surface_key | render_status | render_intent | render_drift_note | basis |
| --- | --- | --- | --- | --- |
| crystal_seat_intro | matched | preserve | — | No drift named in either prior OAR1; desktop/mobile evidence showed the full-bleed hero treatment identically preserved across viewports. |
| crystal_seat_threshold | drift_detected | transform | mobile target is stacked_layout but current mobile rendering preserves compressed split_layout columns | OAR2-prescribed value (§5), restating OAR1 layout/composition finding #1 — mobile evidence measured two 195px columns (compressed 50/50 split) at 390px instead of a resolved mobile composition. |
| crystal_seat_orientation | matched | preserve | — | No drift named; mobile evidence confirmed the video-above-copy stack matches its seated `stacked_layout` target. |
| crystal_seat_encounter | matched | preserve | — | No drift named; mobile evidence confirmed full section stacking matches its seated target. |
| obsidian_chamber_orientation | matched | preserve | — | No drift named; mobile evidence confirmed stacking matches target. |
| obsidian_chamber_encounter_surface | matched | preserve | — | No drift named; desktop/mobile evidence showed the same assessment-card arrangement at both viewports (card width scales, structure doesn't change). |
| obsidian_chamber_C1_compact | matched | preserve | — | No drift named; desktop/mobile evidence showed the same field-list arrangement at both viewports. |
| marble_chamber_orientation | matched | preserve | — | No drift named; mobile evidence confirmed the centered single-card composition is preserved, just narrower. |
| marble_chamber_results | drift_detected | resolve | target document_composition is seated but desktop report card is too narrow for document gravity | OAR2-prescribed value (§5), restating OAR1 finding #2 — desktop evidence measured the report card at ~47% of viewport width, narrow for the seated `document_composition` target. |
| marble_chamber_encounter | unavailable | hold | legacy alias forwards to marble_chamber_results and renders no visible DOM | OAR2-prescribed value (§4) — `MarbleChamberRenderer.tsx:70-74` returns `null` and immediately calls `onNavigate("marble_chamber_results")`; no browser-visible instance exists to evaluate, consistent with both prior OARs. |
| marble_chamber_C2_compact | drift_detected | resolve | target exchange_composition is seated but current desktop/mobile rendering still competes with chamber/hero composition | OAR2-prescribed value (§5), restating OAR1 finding #3 — desktop/mobile evidence showed the three-panel MAP structure visually competing with its ceremonial marble-hall background, and mobile mechanically stacking the same three panels rather than resolving a distinct mobile composition. |
| marble_chamber_C2_agreement | drift_detected | resolve | target exchange_composition is seated but current payment agreement surface is visually under-anchored and content-thin | OAR2-prescribed value (§5), restating OAR1 finding #4 — desktop evidence showed a mostly-empty centered panel (title, one line, one button) against a large ceremonial background. |
| marble_chamber_C2_resolution | matched | preserve | — | No drift named in either prior OAR1; desktop/mobile evidence confirmed the centered confirmation panel is preserved consistently. |
| lapis_chamber_encounter | matched | preserve | — | No drift named; mobile evidence confirmed the editorial grid collapses to a single stacked column matching its seated target. |

## Validation Query Output

```sql
select
  surface_key,
  metadata->>'style_profile' as style_profile,
  metadata->>'layout_profile' as layout_profile,
  metadata->>'mobile_layout_profile' as mobile_layout_profile,
  metadata->>'composition_profile' as composition_profile,
  metadata->>'mobile_composition_profile' as mobile_composition_profile,
  metadata->>'render_status' as render_status,
  metadata->>'render_intent' as render_intent,
  metadata->>'render_drift_note' as render_drift_note
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

| surface_key | layout_profile | composition_profile | render_status | render_intent | render_drift_note |
| --- | --- | --- | --- | --- | --- |
| crystal_seat_encounter | editorial_layout | institutional_composition | matched | preserve | null |
| crystal_seat_intro | hero_layout | cinematic_composition | matched | preserve | null |
| crystal_seat_orientation | hero_layout | institutional_composition | matched | preserve | null |
| crystal_seat_threshold | split_layout | threshold_composition | drift_detected | transform | mobile target is stacked_layout but current mobile rendering preserves compressed split_layout columns |
| lapis_chamber_encounter | editorial_layout | publication_composition | matched | preserve | null |
| marble_chamber_C2_agreement | single_card_layout | exchange_composition | drift_detected | resolve | target exchange_composition is seated but current payment agreement surface is visually under-anchored and content-thin |
| marble_chamber_C2_compact | three_panel_layout | exchange_composition | drift_detected | resolve | target exchange_composition is seated but current desktop/mobile rendering still competes with chamber/hero composition |
| marble_chamber_C2_resolution | single_card_layout | confirmation_composition | matched | preserve | null |
| marble_chamber_encounter | null | null | unavailable | hold | legacy alias forwards to marble_chamber_results and renders no visible DOM |
| marble_chamber_orientation | single_card_layout | ceremonial_composition | matched | preserve | null |
| marble_chamber_results | report_layout | document_composition | drift_detected | resolve | target document_composition is seated but desktop report card is too narrow for document gravity |
| obsidian_chamber_C1_compact | form_layout | institutional_composition | matched | preserve | null |
| obsidian_chamber_encounter_surface | assessment_layout | assessment_composition | matched | preserve | null |
| obsidian_chamber_orientation | hero_layout | threshold_composition | matched | preserve | null |
| publication_dispatch | null | null | null | null | null |

(`style_profile`/`mobile_layout_profile`/`mobile_composition_profile` columns omitted above for width; full 8-column result set was returned and matches the per-surface table in §2.)

Null/held/unavailable accounting:

- `marble_chamber_encounter` — `render_status: unavailable`, `render_intent: hold`, with drift note. This is the only active surface with a null `layout_profile`/`composition_profile`, and the only one with a non-`matched`/`preserve` status that isn't one of the four named drift points. Reason unchanged from both prior OARs: no visible DOM.
- `publication_dispatch` — fully null across all queried columns. No `style_profile` binding exists, so per OAR2 boundary (§8, "seat publication_dispatch without a style_profile binding" is disallowed) nothing was seated.

## Boundary Preservation

- No CSS was rewritten.
- No renderer attributes were wired — grep-confirmed zero references to the three new fields or their types outside `encounterStyleProfile.ts`.
- No layout, mobile, MAP, payment, assessment, release/routing, or public-claims behavior was changed.
- `publication_dispatch` was not seated.
- No duplicate render authority surface was created — all three fields landed as sibling keys on the existing `measures_encounter_surface_assignment.metadata` object.
- No previously-seated field (style, layout, composition, or release authority from prior OARs) was altered — verified in the validation query above.

## Closeout

Render status and render intent are now registered for every active surface: 9 confirmed matched-and-preserve, 4 confirmed drift-detected with an explicit next action (`transform` for the one layout-level mobile drift, `resolve` for the three composition-level drifts), and 1 correctly held unavailable. No renderer or CSS work occurred in this OAR — that is deliberately deferred to the next OAR, which now has a deterministic, evidenced starting point instead of open interpretation.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seated render intent from evidence.
src was not changed.
