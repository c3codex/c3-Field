---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Make unDrifted Launch Edition Publication Cover
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Make unDrifted Launch Edition Publication Cover

## OBJECTIVE

Make `/undrifted` feel like the native authority launch edition cover for Measures Registry.

Not a blog.
Not a dashboard.
Not a SaaS page.

A public launch publication surface.

## OBSERVED

Current `/undrifted` renders, but:

- unDrifted branding is too weak
- masthead is not dominant enough
- article containers need tightening
- cover treatment needs stronger editorial authority
- assessment CTA needs stronger publication-style callout
- Issue date should be July 2026
- launch page should feel like "Wired meets c3"
- persistent unDrifted mark should link back to `/undrifted` from selected Crystal surfaces

## ALIGNED

unDrifted public launch identity:

- masthead: `unDrifted`
- slogan: `DETECT • MEASURE • CORRECT • GOVERN`
- descriptor: `Integrity Governance for AI-Accelerated Systems`
- issue: `ISSUE 001 • JULY 2026`
- core cover line: `AI ISN'T BROKEN. SYSTEMS ARE.`
- publisher standing: `Published by Measures Registry`
- branch standing: `A Registered Branch of the c3 Field`

Use seated masthead media:

- Supabase bucket: `measures-registry`
- file: `undrifted_publication_masthead.webp`
- media_role: `undrifted_publication_masthead`

## REQUIRED DESIGN DIRECTION

Make `/undrifted` feel like:

- editorial
- authoritative
- collectible
- launch edition
- publication cover
- c3-native

Reference mood:

- Wired energy
- c3 structure
- integrity governance authority

Do not copy any existing publication brand.

## REQUIRED SURFACE REPAIR

Surface:

- `lapis_chamber_encounter`
- route: `/undrifted`

Required sections:

1. Masthead
   - use `undrifted_publication_masthead.webp`
   - dominant visual identity
   - restore unDrifted branding

2. Issue rail
   - `ISSUE 001 • JULY 2026`
   - `Published by Measures Registry`
   - `A Registered Branch of the c3 Field`

3. Cover hero
   - `AI ISN'T BROKEN. SYSTEMS ARE.`
   - `Structural drift is detectable.`
   - `Collapse is not the default.`

4. Assessment callout
   - editorial house-ad style
   - copy:
     - `AI OPERATIONS ASSESSMENT`
     - `Structural drift is detectable.`
     - `7 Questions.`
     - `2 Minutes.`
     - `Governed Findings.`
     - CTA: `ASSESS THE ENVIRONMENT`
   - route: `/ai-operations-assessment`

5. Article containers
   - tighten spacing
   - stronger image prominence
   - editorial card structure
   - no loose dashboard/card drift
   - use only seated dispatch/article records

6. Role Call / leadership invitation
   - if source copy exists, render it
   - otherwise add only DB-seated copy, not hardcoded authority
   - preferred copy:
     - `Systems are built by people.`
     - `What role will you play?`

7. Links
   - `/about-measures-registry`
   - `/ai-operations-assessment`
   - seated Paragraph articles

## PERSISTENT UNDRIFTED MARK

Add a small persistent branded unDrifted mark on selected Crystal surfaces:

- `crystal_seat_threshold`
- `crystal_seat_orientation`
- `crystal_seat_encounter`

Mark:

- `unDrifted`
- `Issue 001 • July 2026`

Click route:

- `/undrifted`

This is not a browser back button.

This is publication return/access.

Do not add to:

- assessment surface
- contact capture
- Marble surfaces
- payment/resolution surfaces

## DB-HELD AUTHORITY

Cody must seat or verify:

- `undrifted_publication_masthead` media locator
- issue date: July 2026
- descriptor line
- assessment callout copy
- article preview source
- role call copy if used
- persistent mark copy/route

Preferred storage:

- `measures_encounter_def.metadata` for `encounter_key = 'undrifted'`
- surface assignment metadata only where surface-specific

Do not make CSS the content authority.

## STYLE RULES

CSS may implement:

- masthead scale
- editorial cover layout
- article card density
- assessment callout styling
- persistent mark positioning
- responsive layout
- one-frame hero where possible
- readable scroll where needed

CSS may not define:

- article truth
- issue standing
- route authority
- publication authority
- branch standing

## DO NOT TOUCH

This OAR does not authorize:

- article copy rewrite
- invented article records
- scoring changes
- assessment logic changes
- payment changes
- passage activation
- antechamber activation
- registered_runtime restoration
- c3field.online buildout
- public navigation restructure beyond persistent unDrifted mark

## REQUIRED OAR1 TABLE

OAR1 must include:

- item
- DB source
- media locator status
- renderer/CSS action
- route/link status
- validation result
- remaining gap

Minimum rows:

- masthead
- issue rail
- cover hero
- assessment callout
- article cards
- role call
- persistent unDrifted mark
- links

## VALIDATION

Validation succeeds when:

- `/undrifted` shows dominant unDrifted masthead
- masthead uses `undrifted_publication_masthead.webp`
- issue shows July 2026
- cover line remains `AI ISN'T BROKEN. SYSTEMS ARE.`
- assessment callout is visibly stronger and routes correctly
- article containers are tighter and editorial
- no article truth is invented
- persistent unDrifted mark appears only on selected Crystal surfaces
- persistent mark routes to `/undrifted`
- `/about-measures-registry` link works
- `/ai-operations-assessment` link works
- TypeScript/build passes or exact failure is reported

## EXPECTED OAR1

docs/oar/measures_registry/oar1_make_undrifted_launch_edition_publication_cover_v1.meta.md

## CLOSE

Make unDrifted the launch edition.

AI isn't broken.
Systems are.

Detect.
Measure.
Correct.
Govern.

DB holds.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.

Collapse is not the default.
