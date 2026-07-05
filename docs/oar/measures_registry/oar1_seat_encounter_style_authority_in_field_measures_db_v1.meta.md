---
document_type: oar1
authority_level: working
title: OAR1 — Seat Encounter Style Authority in Field Measures DB
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_encounter_style_authority_in_field_measures_db_v1.meta.md
migration: seat_encounter_style_authority_in_field_measures_db + correct_publication_dispatch_and_seat_paragraph_social_link (project zfihrspxvennjzazxcbj)
---

# OAR1 — Seat Encounter Style Authority in Field Measures DB

## FINAL DISPOSITION

**STYLE_AUTHORITY_SEATED_FOR_14_ACTIVE_SURFACES — 6 OF 16 FIELDS DELIBERATELY HELD SITEWIDE**

Every one of the 14 surfaces carrying a `style_profile` key now has all 7 concordance dimensions seated with per-surface judgment (not blind material-default copy), plus `media_ratio` and `audio_control_treatment` where direct code evidence supported a value. The other 6 detail fields are explicit `null` everywhere — held, not guessed, per the OAR2's own instruction. No CSS or renderer behavior was touched; no visual claim is made. `publication_dispatch` — which has no `style_profile` seeded — was correctly excluded per the OAR2's own binding-key rule, after being caught and reverted mid-pass.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Current style authority source identified | PASS | Confirmed via direct query: `measures_encounter_surface_assignment.metadata.style_profile`, exactly as OAR2 expected — not assumed |
| DB seating method documented | PASS | Sibling metadata keys on the same surface-assignment row (OAR2's "preferred" method) — no new table created, no duplicate authority surface |
| Migration seats canonical fields where valid | PASS | 14 surfaces updated (13 unique + the `marble_chamber_encounter` alias, mirrored from `marble_chamber_results` since it forwards immediately and never renders its own content) |
| Unresolved fields reported as held/null, not guessed | PASS | `content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `mobile_behavior`, `release_state_behavior` are explicit JSON `null` on all 14 surfaces — no value invented for any of them |
| Validation query confirms seated values per active surface | PASS | Full query output below — every surface, every field |
| No CSS or renderer behavior changed | PASS | Zero `.tsx`/`.css` files touched in this OAR |
| No visual claim made without browser QA | PASS | Nothing rendered differently — this is pure DB state |
| OAR1 written beside OAR2 | PASS | This document |

---

## SEATING METHOD

Sibling keys added directly to `measures_encounter_surface_assignment.metadata` (jsonb merge via `metadata || jsonb_build_object(...)`), on the same row where `style_profile` already lives. Idempotent — safe to re-run, later values simply overwrite. No normalized style-profile table was created; the existing metadata bag was judged sufficient (OAR2 ROUTED §2's "allowed alternative" — a normalized table — was not needed since nothing about the current shape is structurally wrong).

## VALIDATION QUERY OUTPUT — ALL 14 ACTIVE SURFACES

| surface_key | style_profile | material_family | frame_profile | space_profile | content_anchor | typography_profile | motion_profile | surface_density | visual_tension | media_ratio | audio_control_treatment |
|---|---|---|---|---|---|---|---|---|---|---|---|
| crystal_seat_intro | media_intro_full_bleed | crystal | cinematic_frame | immersive_space | anchor_bottom | signal_type | cinematic_motion | minimal_density | calm_tension | — | always_visible_audio |
| crystal_seat_threshold | split_threshold_motion_still | crystal | split_frame | immersive_space | anchor_center | whisper_type | passage_motion | minimal_density | threshold_tension | — | — |
| crystal_seat_orientation | talking_head_orientation | crystal | gallery_frame | ceremonial_space | anchor_center | institutional_type | breathing_motion | minimal_density | ceremonial_tension | portrait_9_16 | always_visible_audio |
| crystal_seat_encounter | public_about_encounter | crystal | document_frame | institutional_space | anchor_left | institutional_type | still_motion | narrative_density | ceremonial_tension | — | — |
| obsidian_chamber_orientation | media_orientation_full_bleed | obsidian | threshold_frame | immersive_space | anchor_right | institutional_type | passage_motion | operational_density | diagnostic_tension | landscape_16_9 | always_visible_audio |
| obsidian_chamber_encounter_surface | assessment_form_surface | obsidian | threshold_frame | immersive_space | anchor_right | institutional_type | passage_motion | operational_density | diagnostic_tension | — | — |
| obsidian_chamber_C1_compact | compact_contact_capture | obsidian | document_frame | intimate_space | anchor_center | institutional_type | still_motion | operational_density | threshold_tension | — | — |
| marble_chamber_orientation | marble_orientation_surface_profile | marble | threshold_frame | ceremonial_space | anchor_center | institutional_type | breathing_motion | minimal_density | ceremonial_tension | landscape_16_9 | always_visible_audio |
| marble_chamber_results | marble_results_surface_profile | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension | — | — |
| marble_chamber_encounter (alias) | assessment_findings_report | marble | document_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | ceremonial_tension | — | — |
| marble_chamber_C2_compact | marble_map_surface_profile | marble | split_frame | compressed_space | anchor_right | institutional_type | still_motion | operational_density | threshold_tension | — | — |
| marble_chamber_C2_agreement | marble_payment_surface_profile | marble | threshold_frame | ceremonial_space | anchor_center | institutional_type | still_motion | operational_density | ceremonial_tension | — | — |
| marble_chamber_C2_resolution | marble_confirmation_surface_profile | marble | threshold_frame | ceremonial_space | anchor_center | institutional_type | still_motion | minimal_density | ceremonial_tension | — | — |
| lapis_chamber_encounter | publication_index_promoted | lapis | gallery_frame | institutional_space | anchor_left | editorial_type | still_motion | narrative_density | transformative_tension | — | — |

`content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `mobile_behavior`, `release_state_behavior` are `null` on every row above (— omitted from the table for width; confirmed via direct query, all explicit JSON null, none silently absent).

`publication_dispatch` is intentionally **excluded** — see correction below.

---

## PER-SURFACE JUDGMENT — WHERE AND WHY IT DEVIATES FROM THE OAR2 "MATERIAL BASELINE"

OAR2 §4 gives material baselines explicitly as "baseline only where they are valid," and Cody's role explicitly forbids "treat[ing] provisional defaults as final where per-surface judgment is required." Reading each surface's actual renderer code (all already read in full this session) surfaced clear, evidence-based reasons to deviate in most cases:

- **crystal_seat_intro**: CSS (`crystal.css`) shows the intro section is `position: absolute; inset: 0` with the video at `width/height: 100%; object-fit: cover` — literally edge-to-edge (`immersive_space`, not the crystal baseline `ceremonial_space`, which implies margins). `align-items: flex-end` with no `justify-content` puts the headline low-left, matching `anchor_bottom` ("content reveal below or low in frame") over the baseline's `anchor_center`. It's a genuine autoplay hero video driving the whole frame, matching `cinematic_motion` ("significant media motion... full-bleed encounters") over the baseline's `breathing_motion`.
- **crystal_seat_threshold**: the actual DOM is a literal two-panel split (`registry-threshold-hero` with left/right seats) — `split_frame` fits its defined purpose ("used for path choice or relational comparison surfaces") far better than the crystal baseline `cinematic_frame`. Plaque copy is short supporting text over media, matching `whisper_type` over the baseline's `signal_type`. It is, by name and role, the entry/transition point — `threshold_tension` is a near-exact definitional match.
- **crystal_seat_orientation**: has a media zone *and* a governed-copy/seal zone at roughly equal weight — matches `gallery_frame`'s definition ("image/video and text must remain equally present") over the baseline `cinematic_frame`. Structured paragraphs read as `institutional_type`, not the declarative-headline `signal_type`. The Codexstone Seal is explicitly ceremonial imagery — `ceremonial_tension` fits better than baseline `calm_tension`.
- **crystal_seat_encounter** (About page): a genuine multi-section long-form explainer with a connect form — matches `document_frame`/`institutional_space`/`anchor_left`/`institutional_type`/`narrative_density` far better than the crystal baseline built for the minimal, media-first intro/threshold/orientation surfaces.
- **obsidian_chamber_orientation** and **obsidian_chamber_encounter_surface**: the obsidian baseline was written for exactly these surfaces and fits without deviation — `diagnostic_tension` ("evaluative and investigative; used for assessment and structural drift detection") is a near-exact match for the assessment flow.
- **obsidian_chamber_C1_compact**: no media at all in this surface (pure contact/consent form) — `document_frame`/`intimate_space` (narrow, close-proximity form) fits far better than the media-first `threshold_frame`/`immersive_space` baseline built for orientation/assessment. `threshold_tension` reflects it being the gate immediately before results.
- **marble_chamber_orientation**: an active video-bearing transition card ("Assessment Complete") — `threshold_frame` (passage/transition) fits better than the reading-oriented baseline `document_frame`; single centered card matches `ceremonial_space`/`anchor_center` over `institutional_space`/`anchor_left`.
- **marble_chamber_results**: the one Marble surface the baseline was clearly written for (a genuine findings report) — kept as-is, undeviated.
- **marble_chamber_C2_compact** (3-panel CAR/overview/payment dashboard): none of the 6 frame values describe a 3-panel dashboard precisely; `split_frame` was the closest available fit (documented as approximate, not a confident match). `compressed_space` and `operational_density` are strong, direct fits ("high-density information surface... must fit inside one frame"). Payment CTA lives in the right panel — `anchor_right`.
- **marble_chamber_C2_agreement / C2_resolution**: both are single, centered panels (payment agreement / confirmation), not left-anchored reading surfaces — `threshold_frame`/`ceremonial_space`/`anchor_center` fits their actual layout; `ceremonial_tension` retained since "formal passage" (OAR2's own definition text) describes a payment/confirmation moment precisely.
- **lapis_chamber_encounter** (unDrifted index): a rich, multi-section magazine-style landing (masthead, cover story, article grid, role call) — far more substantial than the lapis baseline's `split_frame`/`intimate_space`/`whisper_type`, which reads as built for a simpler two-choice surface. `gallery_frame`/`institutional_space`/`anchor_left`/`editorial_type` fit the actual observed structure; `narrative_density` and `transformative_tension` from the baseline were kept since they already fit well.

## media_ratio and audio_control_treatment — seated only with direct evidence

- `media_ratio`: seated only where a CSS `aspect-ratio` rule is scoped to that exact surface's own media selector — `[data-surface="crystal_seat_orientation"] .registry-crystal-orientation-media { aspect-ratio: 9/16 }`, `[data-surface="obsidian_chamber_orientation"] .registry-obsidian-orientation-media { aspect-ratio: 16/9 }`, `.registry-marble-orientation-video-frame { aspect-ratio: 16/9 }` (unique to `MarbleOrientationSeat`). Other `aspect-ratio` rules found in the codebase (`.undrifted-insight-cover img` at 3/4, `.registry-pathway-passage-video-frame` at 16/9, several `.registry-public-understand-*` rules) were deliberately **not** attributed to a surface's overall `media_ratio` — they govern sub-element thumbnails or interstitial passage clips, not the surface's defining media relationship, or (for the `public_understand`/`crystal-chamber-video` selectors) don't match any class actually rendered by the 14 active surfaces.
- `audio_control_treatment`: seated as `always_visible_audio` only where the JSX unconditionally renders a custom audio-toggle button whenever a video URL exists (`{videoUrl ? <button className="...-audio">...</button> : null}`, no hover-only CSS gating) — confirmed for `crystal_seat_intro`, `crystal_seat_orientation`, `obsidian_chamber_orientation`, `marble_chamber_orientation`. `crystal_seat_encounter`'s video uses the native browser `controls` attribute instead of a custom registry control — a genuinely different pattern that doesn't map cleanly to any of the 5 defined values, so it was left `null` rather than forced. `crystal_seat_threshold`'s audio behavior is phase-dependent (epigraph video has a mute toggle; L/R plaque motion clips have none) and doesn't reduce to one value honestly, so it's also `null`.

---

## CORRECTION MADE MID-PASS

The first migration run mistakenly included `publication_dispatch` in the seating pass. On review, `publication_dispatch` has **no `style_profile` key at all** (confirmed via direct query) — its content model is still a documented gap (`PublicationDispatch` renders a held-state message; dispatch article body isn't yet in the encounter data model). OAR2 §3 says to "use existing `profile_key` / `style_profile` values as the binding key," which this surface doesn't have yet, so it wasn't a valid target. A follow-up migration (`correct_publication_dispatch_and_seat_paragraph_social_link`) removed the mistakenly-added 16 keys from that row before this OAR1 closed, restoring it to its true pre-existing gap state. Caught and corrected within this same session, before any code consumed the incorrect values (none was written — this OAR2 explicitly defers renderer/CSS wiring).

---

## NOT DONE / DEFERRED

- **6 of 16 fields held sitewide** (`content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `mobile_behavior`, `release_state_behavior`): no surface has direct, unambiguous code evidence for these — determining them honestly would require either a much deeper CSS audit per surface than is proportionate for one pass, or live browser inspection (still blocked — no browser/screenshot tool available this session).
- **`publication_dispatch`**: has no `style_profile` yet, so no style authority was seated for it. Unblocks once its content model (and a `style_profile` key) is seated — likely alongside the previously-flagged gap of wiring real dispatch article bodies into the encounter data model.
- **Renderer/CSS consumption**: explicitly out of scope for this OAR2 ("Do not wire renderer or CSS consumption in this OAR unless DB seating is complete and validated first... A later OAR may update `resolveEncounterStyleProfile()`"). Not attempted.

## RECOMMENDED NEXT OAR2

1. Field/Measures: review the per-surface deviations above (especially the Marble payment-family surfaces and the approximate `split_frame` fit for the 3-panel MAP dashboard) and confirm or adjust.
2. A browser-QA-equipped Cody pass to determine the 6 held fields with real measurement rather than code inference, and to seat `publication_dispatch`'s content model + style_profile.
3. Only after both of the above: extend `resolveEncounterStyleProfile()` to read these newly-seated fields for real, and begin wiring `[data-frame-profile]`-style CSS selectors — with visual verification available.

---

## NOTCHAZZ FLAGS

None raised.

- No unseated values invented — every seated field traces to either a documented material-baseline judgment call (explained above) or direct code evidence; every unresolved field is explicit null.
- No duplicate style authority surface created — sibling keys on the existing surface-assignment row only.
- No frontend hardcoding — this OAR is DB-only; `resolveEncounterStyleProfile()` was not touched.
- No CSS rewritten, no renderer wired, no visual behavior claimed.
- No flow, MAP, payment, assessment, release, or routing logic touched.
- Mid-pass error (over-seating `publication_dispatch`) caught and corrected before this OAR1 closed, not left standing.
