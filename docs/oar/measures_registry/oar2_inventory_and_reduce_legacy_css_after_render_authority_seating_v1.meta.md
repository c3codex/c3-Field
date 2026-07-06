---
document_type: oar2
authority_level: working
document_scope: measures_registry_legacy_css_cleanup
title: OAR2 — Inventory and Reduce Legacy CSS After Render Authority Seating
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - css-cleanup
  - index-css
  - legacy-css
  - render-authority
  - browser-qa
---

# OAR2 — Inventory and Reduce Legacy CSS After Render Authority Seating

## OBSERVED

Measures Registry visual authority is now seated and renderer-visible.

The system now has governed:

- style authority
- layout authority
- composition authority
- render intent authority
- background authority
- browser QA evidence

However, legacy CSS debt remains.

Known condition:

- `src/index.css` remains very large
- encounter-specific CSS files remain active
- prior OARs identified duplicated and competing CSS authority
- broad cleanup was previously deferred because browser QA was not yet available
- browser QA is now available
- cleanup can now proceed from evidence instead of guesswork

## ALIGNED

What is not registered cannot be governed.

What is still active must not be deleted by assumption.

CSS is execution only.

Renderer authority now provides registered data attributes.

Legacy CSS should be reduced only where:

- dead
- duplicated
- overridden
- replaced by registered data-attribute execution
- verified through browser/computed-style evidence

No deletion without proof.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

CSS cleanup order:

inventory
-> classify
-> prove
-> reduce
-> browser QA
-> OAR1 evidence

## ROUTED

Perform a bounded CSS inventory and reduction pass after render authority seating.

### 1. Inventory CSS files

Audit at minimum:

- `src/index.css`
- `src/measures_registry/encounter_renderer/styles/registry.encounter.css`
- all files imported by `registry.encounter.css`
- all encounter CSS files
- any CSS modules or component-level styles used by Measures Registry surfaces

Record:

- file path
- line count before cleanup
- major selector groups
- surfaces affected
- whether selectors are global, material-scoped, surface-scoped, or data-authority-scoped

### 2. Classify CSS authority

Classify rules as:

- active_required
- active_shared
- active_surface_scoped
- duplicate_overridden
- dead_selector
- stale_surface_selector
- unsafe_to_remove
- candidate_for_data_attribute_migration

### 3. Verify before deletion

A rule may be deleted only when at least one is true:

- selector matches no DOM in browser QA
- rule is fully overridden and computed style is unchanged without it
- rule targets deprecated/stale surface only
- rule is duplicate of a later authority-scoped rule
- rule is unreachable after route deprecation

If uncertain, leave it and mark `unsafe_to_remove`.

### 4. Prefer data-authority selectors

Where safe, migrate rules toward registered renderer attributes:

- data-style-profile
- data-layout-profile
- data-mobile-layout-profile
- data-composition-profile
- data-mobile-composition-profile
- data-render-status
- data-render-intent
- data-background-treatment

Do not create new vocabulary.

Do not introduce hardcoded one-off visual authority.

### 5. Protect matched surfaces

Surfaces with:

- render_status: matched
- render_intent: preserve

must not visually change.

If a cleanup affects them, browser QA must prove no regression.

### 6. Deprecated surface cleanup

Since `publication_dispatch` is deprecated:

- remove or quarantine active CSS selectors that only support `publication_dispatch`
- do not delete historical DB rows
- do not remove type members or renderer branches unless separately authorized
- do not resurrect the route

### 7. Browser QA required

After cleanup, validate:

- crystal_seat_intro
- crystal_seat_threshold
- crystal_seat_orientation
- crystal_seat_encounter
- obsidian_chamber_orientation
- obsidian_chamber_encounter_surface
- obsidian_chamber_C1_compact
- marble_chamber_orientation
- marble_chamber_results
- marble_chamber_C2_compact
- marble_chamber_C2_agreement
- marble_chamber_C2_resolution
- lapis_chamber_encounter

Minimum viewports:

- desktop/laptop
- mobile portrait

Required checks:

- no visual regression on matched surfaces
- corrected drift remains corrected
- payment background/content remains correct
- `/publication/structural_drift` routes to `/undrifted`
- no stale surface CSS becomes active
- build passes

### 8. Cleanup boundaries

Cody may remove verified dead CSS and reduce duplication.

Cody may not:

- change route behavior
- change MAP/payment/assessment logic
- change DB authority
- change public claims
- change content model
- create new visual vocabulary
- rewrite the whole design system
- remove CSS without evidence

## CODY ROLE

Cody may:

- inventory CSS
- use browser/computed-style evidence
- remove verified dead CSS
- migrate safe rules to data-authority selectors
- reduce duplication
- run browser QA
- write OAR1 with before/after line counts and evidence

Cody may not:

- guess dead code
- broad-delete CSS
- alter live logic
- create new authority terms
- change matched surfaces visually
- bypass browser QA
- delete historical trace

## VALIDATION

This OAR resolves when:

- CSS inventory is documented
- removed selectors are proven dead/duplicate/stale
- unsafe selectors are held with reason
- before/after line counts are reported
- browser QA passes on required surfaces
- build passes
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_inventory_and_reduce_legacy_css_after_render_authority_seating_v1.meta.md

## CLOSE

CSS executes.

It does not govern.

Now that render authority is seated, legacy CSS can be reduced safely.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.
