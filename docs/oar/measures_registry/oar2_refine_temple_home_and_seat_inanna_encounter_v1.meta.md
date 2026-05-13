---
document_type: oar2
authority_level: working
document_scope: temple_home_and_inanna_encounter_refinement
title: OAR2 — Refine Temple Home Embedded Navigation and Seat Inanna Encounter
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_refine_ceremonial_traversal_and_installation_tones_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Refine Temple Home Embedded Navigation and Seat Inanna Encounter

## OBSERVED

Runtime validation exposed a Temple Home interaction drift:

- crystal_temple_home lost its Antechamber access
- visible button-style navigation is not desired for Temple Home
- Temple Home should function as pure encounter routing, not explanatory UI
- Antechamber already carries explanatory/entry framing

Operator has added or confirmed new media:

- new Temple Home image in Supabase measures-registry
- new Inanna encounter video in R2
- Inanna encounter source title:
  - A Letter to My Divine Feminine Energy
- contribution attribution:
  - letter/text contribution: Pezvak
  - mixed feminine artwork: Ariyah
- Inanna encounter should use combined tone
- embedded video audio should be muted
- Inanna encounter should return only to Temple Home
- Inanna encounter should not expose chamberplate aspects

## ALIGNED

Codex remains authority.

Field structures encounter relation and contributor distinction.

Measures registers media, navigation, tone, and return behavior.

Chazz routes Temple encounter refinement.

Cody executes only from this OAR2.

This OAR2 authorizes:

- Temple Home media replacement
- embedded spatial navigation for Temple Home
- Inanna encounter DB seating
- Inanna encounter media seating
- contributor/provenance metadata seating
- combined tone assignment
- return-only Inanna behavior

This OAR2 does not authorize:

- Phase Map redesign
- operator/contributor Codex identity seating for Ariyah
- broad contributor registry redesign
- chamberplate aspect changes
- invented media filenames
- hardcoded URLs

## ROUTED

### 1. Replace Temple Home media

Cody must inspect and seat the new crystal_temple_home image from Supabase measures-registry.

Requirements:

- source object must return 200
- content type should be image/webp
- governed media mapping must replace or supersede prior Temple Home image authority
- no duplicate primary still authority should remain active
- no fallback media should override governed media

### 2. Remove visible Temple Home UI overlays

Temple Home should render as pure encounter architecture.

Remove or suppress on Temple Home only:

- title overlay
- branding overlay
- visible button styling
- explicit Antechamber/Inanna labels if currently rendered as UI

Do not remove explanatory UI from Antechamber.

### 3. Embed Temple Home spatial navigation

Temple Home navigation must be embedded into the image/architecture:

LEFT interaction zone:

    crystal_temple_home
    → kumurrah_passage
    → temple_antechamber

RIGHT interaction zone:

    crystal_temple_home
    → inanna_encounter

Rules:

- no visible conventional buttons
- interaction regions may use subtle hover/focus affordance
- navigation must remain keyboard-accessible if implemented in frontend
- route targets must remain governed by DB metadata or transition rules
- no hardcoded route shortcuts where DB can govern

### 4. Seat Inanna encounter

Cody must seat or repair DB standing for:

    inanna_encounter

Encounter title:

    A Letter to My Divine Feminine Energy

Encounter role:

    ceremonial witness / invocation surface

Contributor/provenance metadata:

- text / letter contribution:
  - Pezvak

- mixed feminine artwork:
  - Ariyah

- encounter seat:
  - Measures of Inanna governed encounter

If current schema lacks formal contributor relation fields, Cody may seat provenance in encounter/media metadata and report the schema gap without inventing new schema.

### 5. Seat Inanna encounter media

Cody must inspect R2 for the Inanna encounter video and seat verified governed media authority only if retrieval returns 200.

Runtime behavior:

- autoplay or user-start according to browser policy
- embedded video audio muted
- combined tone used as encounter audio
- no crystal-only tone for Inanna encounter
- no competing audio layer
- no fallback truth

### 6. Inanna return behavior

Inanna encounter must have only one exit path:

    inanna_encounter
    → crystal_temple_home

No onward chamber traversal.

No Phase Map route.

No chamberplate aspects.

No aspect rail.

### 7. Preserve installation distinctions

Temple Home:

- orientation / architectural choice
- crystal standing
- embedded left/right encounter routing

Inanna Encounter:

- invocation / witness surface
- combined tone standing
- return-only behavior
- no chamberplate aspects

Antechamber:

- explanatory / entry framing remains separate

### 8. Validation

After repair, Cody must validate:

- Temple Home image resolves from governed media
- Temple Home has no visible button-style UI
- left interaction routes through kumurrah_passage to temple_antechamber
- right interaction routes to inanna_encounter
- Inanna encounter resolves as DB-seated encounter
- Inanna video retrieves 200
- Inanna video audio is muted
- combined tone is selected
- Inanna returns only to Temple Home
- no chamberplate aspects render on Inanna
- no hardcoded media URLs introduced
- local vs deployed standing reported

## CODY ROLE

Cody may:

- inspect Supabase and R2 media objects
- create/update governed media rows
- create/update media mappings
- create/update encounter metadata
- create/update transition metadata
- implement embedded Temple Home navigation
- implement Inanna return-only behavior
- write OAR1 closeout

Cody may not:

- invent contributor records beyond available schema
- seat Ariyah’s full Codex identity in this OAR
- redesign Phase Map
- alter chamberplate aspect contracts
- hardcode media URLs
- invent missing source media
- collapse Temple Home, Antechamber, and Inanna encounter roles

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. Temple Home media replacement completed or held with reason
2. Temple Home embedded navigation works
3. visible button-style Temple Home UI removed
4. Inanna encounter seated
5. Inanna media and combined tone verified
6. Inanna return-only behavior validated
7. contributor/provenance metadata seated or schema gap reported
8. no chamberplate aspects render on Inanna
9. no hardcoded media paths introduced
10. local/deployed standing reported

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_refine_temple_home_and_seat_inanna_encounter_v1.meta.md

## CLOSE

Temple is encounter routing.

Antechamber explains.

Inanna witnesses.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
