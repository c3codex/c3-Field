---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Seat DB-Held Style Profiles and CSS-Held Mechanics for 13 Surfaces
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Seat DB-Held Style Profiles and CSS-Held Mechanics for 13 Surfaces

## OBSERVED

The 13 SEAT items are registered surfaces.

Each registered surface needs a style profile.

Prior work separated DB-held styling authority from CSS-held implementation mechanics.

That separation must be preserved.

Style profile authority must not collapse into CSS.

CSS must not define surface identity.

Registered surface names must not be treated as style profile names.

## ALIGNED

Distinction:

- registered_surface = what the encounter is
- style_profile = DB-held presentation standing
- CSS styles = implementation mechanics

Required order:

DB seats style_profile.
FREE reads style_profile.
CSS implements style_profile.

CSS may mirror a style_profile key for mechanics, but CSS does not own the profile.

No contracts.

No frontend-owned truth.

## REQUIRED STYLE PROFILE MAP

Each of the 13 registered surfaces must receive one DB-held style_profile.

1. `crystal_seat_intro`
   - style_profile: `media_intro_full_bleed`

2. `crystal_seat_threshold`
   - style_profile: `split_threshold_motion_still`

3. `crystal_seat_orientation`
   - style_profile: `talking_head_orientation`

4. `crystal_seat_encounter`
   - style_profile: `public_about_encounter`

5. `lapis_chamber_encounter`
   - style_profile: `publication_index_promoted`

6. `obsidian_chamber_orientation`
   - style_profile: `media_orientation_full_bleed`

7. `obsidian_chamber_encounter_surface`
   - style_profile: `assessment_form_surface`

8. `obsidian_chamber_C1_compact`
   - style_profile: `compact_contact_capture`

9. `marble_chamber_orientation`
   - style_profile: `report_orientation_media`

10. `marble_chamber_encounter`
    - style_profile: `assessment_findings_report`

11. `marble_chamber_C2_compact`
    - style_profile: `map_compact_cards`

12. `marble_chamber_C2_agreement`
    - style_profile: `payment_agreement_surface`

13. `marble_chamber_C2_resolution`
    - style_profile: `confirmation_resolution_surface`

## DB-HELD STYLING RULE

DB must hold style profile standing.

Preferred metadata shape:

    {
      "registered_surface": "<registered_surface_key>",
      "style_profile": "<style_profile_key>"
    }

Do not use:

    {
      "profile": "<registered_surface_key>"
    }

as style authority.

If existing `metadata.profile` remains in use as legacy standing, do not treat it as the style profile unless explicitly migrated.

`metadata.style_profile` is the preferred field.

## CSS-HELD MECHANICS RULE

CSS may implement:

- layout pattern
- media sizing
- motion safety
- animation-to-still behavior
- responsive containment
- scroll containment
- CTA placement
- reading density
- accessibility states
- fallback layout
- interaction states

CSS may not define:

- registered surface identity
- chamber identity
- route authority
- release state
- report meaning
- scoring meaning
- payment standing
- compact authority
- certification/conversion language

CSS classes/selectors may mirror style_profile names only as mechanics.

CSS is not authority.

## FREE RULE

FREE must:

- read registered surface standing from registry/FREE surface data
- read DB-held style_profile where available
- pass style_profile to renderer/CSS mechanics
- not infer style_profile from CSS classes
- not infer registered surface identity from style_profile
- render fallback safely if style_profile is missing

If FREE does not currently consume `metadata.style_profile`, Cody must report that gap.

Do not pretend DB-held style profiles affect runtime until FREE reads them.

## ROUTED

Cody must:

1. Verify all 13 registered surfaces exist or are blocked by the companion hot-surface OAR.
2. Seat `metadata.registered_surface` and `metadata.style_profile` for each existing registered surface.
3. Report any of the 13 that cannot receive style_profile because the registered surface is not seated.
4. Audit current CSS selectors/data attributes related to style/profile.
5. Confirm CSS does not own profile authority.
6. If safe, wire FREE to read `metadata.style_profile`.
7. If not safe, report runtime consumption gap.
8. Preserve registered surface identity distinct from style profile.
9. Preserve passages and antechambers as held for secured/scale.

## REQUIRED OAR1 TABLE

OAR1 must include:

- registered_surface
- surface_key
- registry_key
- style_profile
- DB metadata seated yes/no
- FREE consumes style_profile yes/no
- CSS selector/data key present yes/no
- CSS selector/data key authority status
- final standing

Final standing values:

- style_profile_seated
- blocked_registered_surface_missing
- blocked_free_consumption_gap
- blocked_css_authority_drift

## CONTRACT USE BAN

The term `contract` is banned except `smart_contract`.

If `data-layout-contract` remains as a CSS data attribute:

- report it as legacy CSS infrastructure
- confirm it is not public/native authority
- do not expand it
- optionally recommend future rename to `data-layout-profile` or `data-style-profile`

Do not perform broad CSS rename unless explicitly dependency-safe.

## DO NOT TOUCH

This OAR does not authorize:

- new registered surfaces outside the 13
- passage activation
- antechamber activation
- report copy changes
- scoring changes
- Stripe/payment logic changes
- certification claims
- conversion claims
- registered_runtime restoration
- visual redesign

## VALIDATION

Validation succeeds when:

- DB-held style_profile assignments exist for each available registered surface
- registered_surface and style_profile remain distinct
- CSS mechanics are not treated as authority
- FREE consumption is implemented or explicitly reported as a gap
- no registered surface name is used as the style profile unless intentionally mapped
- no contract terminology is introduced
- passages and antechambers remain held
- no report/scoring/payment mutation occurs
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_db_held_style_profiles_and_css_held_mechanics_for_13_surfaces_v1.meta.md

## CLOSE

DB holds style standing.
FREE reads style standing.
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
