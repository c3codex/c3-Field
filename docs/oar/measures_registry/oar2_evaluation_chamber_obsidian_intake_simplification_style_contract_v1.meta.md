---
document_type: oar2
authority_level: working
document_scope: evaluation_chamber
title: OAR2 — Evaluation Chamber Obsidian Intake Simplification + Style Contract
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - evaluation
  - obsidian
  - intake
  - styling
  - gate1
  - assessment
  - src
  - threshold
source_alignment:
  - Seed Concordance
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Evaluation Chamber Obsidian Intake Simplification + Style Contract

## OBSERVED

Live evaluation chamber now includes expanded SRC-style fields:

institution_name
institution_type
institution_address
institution_phone
contact_name
contact_position
contact_email
assessment_intent
capture_context

This over-expanded the first intake surface and created UI/UX drift.

Observed issues:

- too many fields before assessment entry
- form feels administrative instead of encounter-based
- rectangular input/answer styling feels too literal
- evaluation chamber is visually oversized on screen
- blue/lapis styling is misaligned for assessment/gate passage
- evaluation should resolve as obsidian threshold styling
- current form does not fit fully in the intended screen experience

The prior correction over-applied SRC completeness to the visible UI layer.

That was the miss.

The system needs SRC-valid capture without exposing every SRC-held field as required visible intake before the assessment.

## ALIGNED

The evaluation chamber is a Gate 1 assessment passage.

Gate 1 begins in an obsidian threshold condition, not a lapis relation condition.

Obsidian is the correct material family for:

- threshold
- reduction
- passage
- exposure
- structural drift recognition

Frontend must still render seated state only and not invent authority.

However, SRC completeness does not require all SRC-held fields to be visible on the first intake screen.

Visible first-step intake should be minimal.

Additional SRC detail may be:

- deferred
- captured later
- stored in metadata only when provided
- marked held if required later for implementation standing

Gate 1 assessment can proceed with minimal institutional identity, while deeper SRC requirements remain part of later standing validation.

## ROUTED

### 1. Reduce visible pre-assessment fields

The Environment Identity form should show only:

- company / organization name
- type of business / organization
- contact name
- contact email

Field mapping:

- company / organization name ? institution_name
- type of business / organization ? metadata.institution_type
- contact name ? contact_name
- contact email ? contact_email

Remove from visible first-screen intake:

- institution_address
- institution_phone
- contact_position
- assessment_intent
- capture_context

These may remain supported in schema/metadata but must not appear in the first visible chamber form.

### 2. Preserve SRC standing without visual overload

If additional SRC-held fields are required later, they should be handled as:

deferred_src_fields

Recommended metadata structure:

{
  "institution_type": "",
  "deferred_src_fields": {
    "institution_address": null,
    "institution_phone": null,
    "contact_position": null,
    "assessment_intent": null,
    "capture_context": null
  }
}

Do not block the evaluation chamber entry on deferred fields.

Do not treat deferred missing fields as visual failure.

### 3. Gate 1 standing refinement

Gate 1 Assessment Entry may proceed when:

- institution_name
- metadata.institution_type
- contact_name
- contact_email

are present.

Gate 1 completion remains dependent on:

- assessment completed
- assessment returned
- minimum identity captured
- eligibility updated

Do not require full implementation SRC detail before assessment entry.

### 4. Shift evaluation chamber material contract to Obsidian

Update evaluation chamber styling contract:

material_family: obsidian

Visual direction:

- dark obsidian field
- reduced blue intensity
- smoke/glass depth
- faint Measures watermark
- thin metallic/gold or cool-white edge accents
- less lapis glow
- more threshold atmosphere

Evaluation should feel like:

threshold diagnostic chamber

not:

lapis relationship chamber

### 5. Replace rectangular form styling

Input and answer controls should stop reading as plain rectangles.

Required style direction:

- soft capsule or beveled plaque fields
- thin luminous edge
- transparent obsidian fill
- subtle inner shadow
- no heavy rectangular boxes
- larger breathing room
- reduced border dominance

Answer options should use:

- 3 tailored options
- capsule/plaque form
- numbered or sigil-like indicator
- no overlap with question text

### 6. Resize chamber to fit viewport

Evaluation identity form and question chamber must fit the active screen better.

Required layout behavior:

- max-height: viewport-aware
- reduced vertical padding
- centered chamber body
- responsive two-column form only when width allows
- single-column on smaller screens
- no hidden lower controls at default desktop/iPad scale

Primary screen should show:

- title
- brief framing
- compact identity chamber
- begin evaluation control
- audio control

without requiring excessive scroll.

### 7. Strengthen Measures Registry branding

Branding must become more visible but not loud.

Required:

- faint watermark behind chamber content
- Measures Registry mark visible in chamber field
- brand title present without DB label leakage
- no exposed internal mapping labels

Watermark should be visible on obsidian/blue-black background.

### 8. Preserve runtime warning honesty

If media role mapping remains incomplete, Cody may keep the development warning.

But Cody must not suppress missing registry state through CSS.

If media role mapping is completed, the warning should disappear because seated state is complete.

### 9. Preserve assessment mechanics

Do not break:

- answer persistence
- 5-question flow
- 3 tailored options
- assessment return
- findings logic
- email/report routing
- protocol reveal
- implementation eligibility language

## CODY ROLE

Cody may:

- simplify visible identity form to 4 fields
- preserve removed fields as deferred metadata support
- update material contract to obsidian
- adjust chamber layout to fit viewport
- replace rectangular field styling with capsule/plaque styling
- strengthen watermark and brand presence
- preserve no-fallback media discipline

Cody may not:

- expose all SRC-held fields on first screen
- block assessment entry on deferred implementation fields
- hardcode media fallbacks
- suppress registry warnings without resolving mapping
- create frontend-owned truth
- change assessment logic outside this scope

## VALIDATION

This OAR2 resolves successfully when:

- first screen shows only company name, type of business, contact name, and email
- removed fields no longer appear visually on the initial chamber
- institution_type is preserved in metadata
- evaluation chamber reads as obsidian, not lapis
- form and answer controls no longer appear as hard rectangles
- chamber fits the visible screen more cleanly
- watermark/branding is visible
- assessment mechanics remain intact
- no frontend fallback authority is introduced

## EXPECTED OAR1

docs/oar/measures_registry/oar1_evaluation_chamber_obsidian_intake_simplification_style_contract_v1.meta.md

## PROCESS REFERENCE

implementation branch: measures

downstream alignment target: c3field

## CLOSE

Minimal intake first.

Obsidian threshold before assessment.

Do not make SRC completeness look like paperwork.
