---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR1 - Seat DB-Held Style Profiles and CSS-Held Mechanics for 13 Surfaces
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_seat_db_held_style_profiles_and_css_held_mechanics_for_13_surfaces_v1
---

# OAR1 - Seat DB-Held Style Profiles and CSS-Held Mechanics for 13 Surfaces

## EXECUTION METHOD

Live DB queried: measures_encounter_surface_assignment metadata for all 13 surfaces.
CSS data attribute audit run via grep across measures_registry renderer files.
Migration 202606300019 written and applied via `npx supabase db push` (exit code 0).
No source files changed. TypeScript `npx tsc --noEmit` zero errors.
Post-migration style_profile fields verified via PostgREST anon query (sample 6 surfaces confirmed).

---

## PRE-MUTATION STATE

### measures_encounter_surface_assignment metadata (before)

All 13 surfaces had `metadata.profile = "<surface_key>"` from prior seeding migrations.
None had `metadata.style_profile` or `metadata.registered_surface`.

### FREE runtime consumption of style_profile

No matches for `style_profile`, `data-style-profile`, or `data-layout-profile` in
`src/measures_registry/encounter_renderer/**/*.tsx`. FREE does not read
`metadata.style_profile`. Runtime consumption gap confirmed.

### data-layout-contract audit (CSS infrastructure)

`data-layout-contract` is present in renderer components as hardcoded CSS hook values.
Current occurrences (all internal CSS hooks — not authority):

| File | Value | Component | Authority Status |
|---|---|---|---|
| EncounterBoundary.tsx:45 | `unavailable` | boundary error state | CSS hook — not authority |
| CrystalSeatRenderer.tsx:172 | `intro` | IntroHookSeat | CSS hook — not authority |
| CrystalSeatRenderer.tsx:378 | `transition_choice` | PathChoiceSeat (dead code) | CSS hook — not authority |
| CrystalSeatRenderer.tsx:458 | `passage` | StructurePassageSeat | CSS hook — not authority |
| LapisChamberRenderer.tsx:191 | `undrifted_publication` | UnDriftedIndex | CSS hook — not authority |
| LapisChamberRenderer.tsx:453 | `publication_encounter` | PublicationDispatch | CSS hook — not authority |
| MarbleChamberRenderer.tsx:151 | `marble_chamber_directory` | MapIntegrityGovernance | CSS hook — not authority |

None of these values define registered surface identity, chamber authority, route authority,
release state, scoring meaning, payment standing, or compact authority.

`data-layout-contract` is legacy CSS infrastructure. Not public/native authority.
Recommend future rename to `data-layout-profile` or `data-style-profile` in a
CSS-mechanic cleanup OAR. No broad rename performed here (not dependency-safe in this scope).

---

## POST-MUTATION STATE

### metadata.style_profile and metadata.registered_surface seeded

| # | Registered Surface | surface_key | style_profile | DB Seated |
|---|---|---|---|---|
| 1 | crystal_seat_intro | crystal_seat_intro | media_intro_full_bleed | ✓ |
| 2 | crystal_seat_threshold | crystal_seat_threshold | split_threshold_motion_still | ✓ |
| 3 | crystal_seat_orientation | crystal_seat_orientation | talking_head_orientation | ✓ |
| 4 | crystal_seat_encounter | crystal_seat_encounter | public_about_encounter | ✓ |
| 5 | lapis_chamber_encounter | lapis_chamber_encounter | publication_index_promoted | ✓ |
| 6 | obsidian_chamber_orientation | obsidian_chamber_orientation | media_orientation_full_bleed | ✓ |
| 7 | obsidian_chamber_encounter_surface | obsidian_chamber_encounter_surface | assessment_form_surface | ✓ |
| 8 | obsidian_chamber_C1_compact | obsidian_chamber_C1_compact | compact_contact_capture | ✓ |
| 9 | marble_chamber_orientation | marble_chamber_orientation | report_orientation_media | ✓ |
| 10 | marble_chamber_encounter | marble_chamber_encounter | assessment_findings_report | ✓ |
| 11 | marble_chamber_C2_compact | marble_chamber_C2_compact | map_compact_cards | ✓ |
| 12 | marble_chamber_C2_agreement | marble_chamber_C2_agreement | payment_agreement_surface | ✓ |
| 13 | marble_chamber_C2_resolution | marble_chamber_C2_resolution | confirmation_resolution_surface | ✓ |

### metadata shape after migration

Each row now contains:
```json
{
  "profile": "<surface_key>",          // legacy field — retained, not treated as style authority
  "registered_surface": "<surface_key>",
  "style_profile": "<style_profile_key>",
  "source_oar2": "..."                 // on 6 newly created surfaces from prior OAR
}
```

---

## OAR1 TABLE — STYLE PROFILE STANDING

| # | Registered Surface | surface_key | registry_key | style_profile | DB Metadata Seated | FREE Consumes style_profile | CSS selector/data key | CSS authority status | Final Standing |
|---|---|---|---|---|---|---|---|---|---|
| 1 | crystal_seat_intro | crystal_seat_intro | crystal_seat_intro | media_intro_full_bleed | ✓ | NO (gap) | data-layout-contract: none | N/A | style_profile_seated |
| 2 | crystal_seat_threshold | crystal_seat_threshold | ai_isnt_broken_intro | split_threshold_motion_still | ✓ | NO (gap) | data-layout-contract: "intro" (IntroHookSeat) | CSS hook — not authority | style_profile_seated |
| 3 | crystal_seat_orientation | crystal_seat_orientation | ai_isnt_broken_intro | talking_head_orientation | ✓ | NO (gap) | data-layout-contract: "intro" (IntroHookSeat) | CSS hook — not authority | style_profile_seated |
| 4 | crystal_seat_encounter | crystal_seat_encounter | about_measures_registry | public_about_encounter | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 5 | lapis_chamber_encounter | lapis_chamber_encounter | undrifted | publication_index_promoted | ✓ | NO (gap) | data-layout-contract: "undrifted_publication" | CSS hook — not authority | style_profile_seated |
| 6 | obsidian_chamber_orientation | obsidian_chamber_orientation | obsidian_chamber_orientation | media_orientation_full_bleed | ✓ | NO (gap) | data-layout-contract: "passage" (EvalPassage) | CSS hook — not authority | style_profile_seated |
| 7 | obsidian_chamber_encounter_surface | obsidian_chamber_encounter_surface | measures_assessment | assessment_form_surface | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 8 | obsidian_chamber_C1_compact | obsidian_chamber_C1_compact | obsidian_chamber_C1_compact | compact_contact_capture | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 9 | marble_chamber_orientation | marble_chamber_orientation | marble_chamber_orientation | report_orientation_media | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 10 | marble_chamber_encounter | marble_chamber_encounter | marble_chamber_encounter | assessment_findings_report | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 11 | marble_chamber_C2_compact | marble_chamber_C2_compact | map_integrity_governance | map_compact_cards | ✓ | NO (gap) | data-layout-contract: "marble_chamber_directory" | CSS hook — not authority | style_profile_seated |
| 12 | marble_chamber_C2_agreement | marble_chamber_C2_agreement | marble_chamber_C2_agreement | payment_agreement_surface | ✓ | NO (gap) | none | N/A | style_profile_seated |
| 13 | marble_chamber_C2_resolution | marble_chamber_C2_resolution | marble_chamber_C2_resolution | confirmation_resolution_surface | ✓ | NO (gap) | none | N/A | style_profile_seated |

---

## FREE RUNTIME CONSUMPTION GAP

**Gap**: FREE does not read `metadata.style_profile`. No match for `style_profile` or
`data-style-profile` in any `*.tsx` file under `src/measures_registry/encounter_renderer/`.

**Impact**: DB-held style profiles exist but have zero effect on current rendering.
The `data-layout-contract` attributes in renderer components are hardcoded CSS hooks — they
do not read the DB `style_profile` field. CSS mechanics are therefore disconnected from
DB-held style profile authority.

**What would be needed to wire FREE consumption:**
1. Add `styleProfile: string | null` to `RenderableEncounter` and `ComposedEncounter` types
2. In the orchestrator: extract `metadata.style_profile` from the matching `surfaceAssignmentRow`
3. In each chamber renderer: accept `styleProfile` from encounter and apply as `data-style-profile` on root `<main>` element
4. CSS selectors migrate from `[data-layout-contract="..."]` to `[data-style-profile="..."]`

**This wiring is deferred** — cascade change across types, orchestrator, and all 4 chamber
renderers. OAR2 authorized reporting the gap; wiring is not yet dependency-safe within this
OAR scope. Recommend a dedicated renderer-wire OAR.

---

## CSS MECHANICS AUTHORITY AUDIT

### data-layout-contract

Status: **legacy CSS infrastructure — not authority**

All occurrences are hardcoded string literals in renderer components. None are derived from DB.
None define registered surface identity, chamber authority, route authority, release state,
scoring meaning, or payment standing. Confirmed CSS implementation mechanics only.

Recommendation: future rename to `data-layout-profile` or `data-style-profile` in a
dedicated CSS mechanic rename OAR. Not performed here.

### Other data attributes

- `data-surface={encounter.surface}` — runtime DB surface_key (authority: DB, correct)
- `data-material-family` — hardcoded per renderer component (CSS hook)
- `data-release-standing` — hardcoded or derived from gate result (CSS hook + gate state)
- No `data-style-profile` attribute exists in the codebase currently

### CSS does not own profile authority

Confirmed: no CSS attribute or class defines registered surface identity or style_profile
authority. CSS mechanics are implementer-held, not DB-held.

---

## VALIDATION CHECKLIST

| Item | Status |
|---|---|
| style_profile seeded in DB for all 13 registered surfaces | ✓ |
| registered_surface seeded alongside style_profile | ✓ |
| metadata.profile retained as legacy (not removed) | ✓ |
| registered surface identity not changed by style_profile seeding | ✓ |
| contract terminology not introduced | ✓ |
| CSS mechanics are implementation-held (confirmed) | ✓ |
| CSS does not own profile authority (confirmed) | ✓ |
| data-layout-contract audited as legacy CSS hook | ✓ |
| FREE runtime consumption gap reported | ✓ |
| FREE wiring deferred with what-would-be-needed documented | ✓ |
| Passages remain held | ✓ |
| Antechambers remain held | ✓ |
| No payment/scoring/report changes | ✓ |
| TypeScript zero errors | ✓ |

---

## FINAL DISPOSITION

**SEATED** — DB-held style_profile metadata seeded for all 13 registered surfaces.

DB holds style standing. FREE does not yet read it (runtime consumption gap — deferred).
CSS mechanics remain implementation-held. Registered surface identity is separate from style
profile. data-layout-contract attributes are confirmed legacy CSS infrastructure, not authority.

DB holds style standing.
FREE reads style standing. (DEFERRED — gap reported)
CSS implements mechanics.

Registered surfaces are authority.
Style profiles are presentation standing.
CSS styles are mechanics.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.
