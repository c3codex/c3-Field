---
document_type: baseline_evidence
document_scope: new_moon_to_lions_gate_inanna_seat_initiative
source_oar2: docs/oar/c3_field/oar2_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md
captured_at_utc: 2026-07-14T21:08:43.082Z
amended_at_utc: 2026-07-14T21:30:00Z
captured_before_mutation: true
operator: op044
system: c3_field
initiative_key: new_moon_to_lions_gate_2026
baseline_standing: provisional_register_seat_discovery_required
---

# Baseline Evidence - New Moon to Lion's Gate Inanna SEAT Initiative

## Authority Boundary

This baseline was captured before initiative registration mutation.

Authorized by:

- docs/oar/c3_field/oar2_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md

No FREE cutover, public release, held encounter activation, Phase Calendar mutation, legacy-runtime retirement, artwork release, or Priceless Gallery launch was performed during baseline capture.

## Public Runtime

| Target | Status | HTML bytes | Markers |
|---|---:|---:|---|
| https://measuresofinanna.com/ | 200 | 3548 | inanna=true; free=false; c3=true |
| https://c3field.online/ | 200 | 1920 | inanna=false; free=false; c3=true |

Interpretation:

- Measures of Inanna public runtime is reachable.
- c3field.online is reachable.
- FREE marker was not found in the fetched root HTML for either target.

## Targeted Registry Sample - Non-Authoritative

Pre-mutation targeted registry query returned 7 rows.

This result is a non-authoritative sample only. It must not be treated as the complete Inanna register_SEAT baseline or as proof of Inanna branch ownership.

Known omitted Inanna registry units requiring follow-on discovery include:

- `crystal_temple_home`
- `temple_antechamber`
- Gates
- Epithets
- MEs

The chamber-directory rows below may have matched the broad query without proving Inanna branch ownership.

| Registry key | Title | Family | Release | Access |
|---|---|---|---|---|
| epigraph | Epigraph | spine | released | encounterable |
| inanna_seat | Inanna's Seat | spine | released | callable |
| obsidian_directory | Obsidian Directory | chamber_directory | held | visible |
| marble_directory | Marble Directory | chamber_directory | released | visible |
| lapis_directory | Lapis Directory | chamber_directory | released | visible |
| crystal_directory | Crystal Directory | chamber_directory | held | visible |
| inanna_encounter | A Letter to My Divine Feminine Energy | spine | released | callable |

Release/access summary for this targeted sample only:

| Release | Access | Count |
|---|---|---:|
| held | visible | 2 |
| released | callable | 2 |
| released | encounterable | 1 |
| released | visible | 2 |

## Encounter Inventory Baseline

The broad Inanna encounter query found active encounter definitions including:

- epigraph_view
- crystal_temple_home_view
- phase_map
- gate encounter surfaces
- epithet encounter surfaces
- ME encounter surfaces

The pre-mutation registry family summary confirmed the standing described by the OAR:

| Family | Released count | Held count |
|---|---:|---:|
| gate | 3 | 4 |
| epithet | 3 | 6 |
| me | 1 | 12 |

Notes:

- Gate 4 appeared in the Phase Map metadata as released while interaction remained gated/non-interactive in the captured payload. This contradiction is a registered reconciliation gap for the next discovery OAR.
- Gates 4-7, Epithets 4-9, and MEs 02-13 remain governed follow-on inventory/reconciliation targets. No release state was altered here.

## Media Standing - Incorrect Surface Reclassified

The initial baseline query against `public.measures_media_map` is not accepted as the Inanna installation media baseline.

The returned roles look consistent with Measures Registry publication/campaign media, not the Inanna installation:

| Media role | Count |
|---|---:|
| hero_image | 1 |
| hero_measured_image | 1 |
| hero_video | 1 |
| paragraph_cover | 1 |
| path_choice_background | 1 |
| registry_banner | 1 |
| social_card | 1 |

These rows must not be used as Inanna register_SEAT media authority.

Actual Inanna media discovery must inspect:

- `public.measures_surface_media_map`
- `public.codex_media_asset`
- remaining `public.temp_exhibition_media` fallbacks

No artwork or media rows were added, released, or remapped during baseline capture.

## Phase Calendar Standing

`public.measures_phase_calendar` contained 17 active rows.

Relevant 2026 anchors:

| Phase key | Family | Anchor | Date | Standing |
|---|---|---|---|---|
| gate_6_anchor | gate | new_moon | 2026-07-14 | scheduled |
| me_group_5_phased_ritual_release | me | full_moon | 2026-07-29 | phased_ritual_release |
| epithet_last_3_lions_gate | epithet | lions_gate | 2026-08-08 | scheduled |
| gate_7_anchor | gate | new_moon | 2026-08-12 | scheduled |

No Phase Calendar rows were changed.

Interpretation:

- The Gate 6 anchor on 2026-07-14 is seated in the Phase Calendar.
- Live release standing still shows only Gates 1-3 released in the registry-family summary.
- This demonstrates cadence debt without authorizing a fix under this registration OAR.

## Process, Role, Evidence, and Branch Standing Before Mutation

Before mutation:

- `public.system_process_registry` had 11 rows.
- No process row matched `new_moon_to_lions_gate_2026`.
- No relevant process row matched Inanna, FREE, Gallery, SEAT, or initiative terms in the targeted query.
- `public.c3_role_contract` had 2 rows: Measures Registry and Measures of Inanna system contracts.
- `public.c3_evidence_contract` had 2 rows: Measures Registry and Measures of Inanna evidence contracts.
- No Priceless Gallery match was found in `public.measures_registry` or `public.system_process_registry`.

Admission view baseline:

- `public.v_c3_measures_registry_admission_binding_v1` exposed Measures Registry admission bindings.
- No Inanna or Priceless Gallery admission binding was found in the sampled readback.

## Baseline Gaps

- Dedicated initiative registry table was not found.
- Existing `system_process_registry` and OAR spine are the coherent Codex authority surfaces for initiative/process registration.
- Chazz, Claude, and Cody system execution identities were not already present as separate initiative executor roles.
- Priceless Gallery successor branch standing was not found in the queried live authority surfaces.
- FREE standing was not visible from root HTML markers and requires follow-on discovery.
- Exact 2026 Phase Calendar reconciliation remains incomplete and must be handled by a next bounded OAR2.
- The 7-row targeted registry sample is provisional and incomplete for register_SEAT authority.
- Inanna branch ownership must be established through full register_SEAT discovery, not inferred from broad text matches.
- Inanna media authority must be discovered through `measures_surface_media_map`, `codex_media_asset`, and remaining `temp_exhibition_media` fallbacks.
- Gate 4 released/gated contradiction is registered as a reconciliation gap.
- Gate 6 July 14 Phase Calendar anchor plus Gates 1-3 live release standing demonstrates cadence debt; no correction was made in this OAR.

## No-Mutation Confirmation For Baseline Capture

Baseline capture used read-only HTTP and database queries only.

No `src` files were edited.
No DB rows were mutated during baseline capture.
No runtime routes were invented.
No public state was inferred from missing state.
