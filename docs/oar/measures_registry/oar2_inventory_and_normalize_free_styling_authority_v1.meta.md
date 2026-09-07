---
document_type: oar2
authority_level: launch_repair
document_scope: free_styling_authority
title: OAR2 - Inventory and Normalize FREE Styling Authority
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Inventory and Normalize FREE Styling Authority

## PURPOSE

Inventory and normalize FREE styling authority.

The site architecture now resolves. Remaining issues are primarily presentation and CSS authority.

Do not redesign.

Nothing is invented.

## STANDING

Registry decides what the encounter is.

FREE renders it safely.

DB / registry should govern:

- material family
- design tokens
- style profile
- media role
- background treatment
- surface density
- CTA placement profile
- footer visibility
- passage / assessment / about visual contract

FREE / CSS should carry:

- browser-safe layout implementation
- responsive behavior
- accessibility
- fallback behavior
- media sizing mechanics
- interaction states
- safe animation behavior

## OBSERVED

Current styling has two layers:

Layer 1 — DB-driven design tokens:
- base colors only

Layer 2 — hardcoded CSS:
- layout
- spacing
- typography scale
- gradient shapes
- overlays
- grid structure
- media queries
- button composition
- encounter-specific presentation

This means DB can say what surface is active, but CSS still controls too much of how it looks.

## REQUIRED INVENTORY

Inventory active CSS sources:

- index.css
- registry.tokens.css
- registry.materials.css
- registry.visual-system.css
- registry.buttons.css
- assessment.css
- passage.css
- path-choice.css
- about.css
- legal.css
- footer.css
- any remaining registered_runtime/styles imports

For each file, classify rules into:

- keep_in_css
- design_token_candidate
- style_profile_candidate
- chamber_profile_candidate
- encounter_profile_candidate
- media_profile_candidate
- cta_profile_candidate
- layout_utility_keep_in_css
- responsive_utility_keep_in_css
- accessibility_keep_in_css
- legacy_runtime_style_candidate

## STYLE PROFILE TARGETS

Identify candidate DB style profiles, such as:

- obsidian_full_bleed_video
- obsidian_assessment_surface
- obsidian_to_marble_passage
- crystal_split_path_choice
- crystal_about_surface
- lapis_publication_surface
- marble_map_cards
- assessment_scrollable_form
- report_result_gate
- legal_reading_surface
- governed_footer

Do not implement DB style profiles in this OAR unless already supported.

## REQUIRED NORMALIZATION

### 1. Remove remaining runtime style path authority

Move any remaining active style imports from:

src/measures_registry/registered_runtime/styles/

to:

src/measures_registry/encounter_renderer/styles/

Update imports.

Do not redesign.

Do not change visual intent.

### 2. Identify hardcoded active assessment copy style dependencies

Confirm whether the following hardcoded assessment shell strings are styling/content authority or out of scope:

- ASSESSMENT_PROCESS_TITLE
- ASSESSMENT_SUPPORT_LINE
- ASSESSMENT_SUB_SUPPORT_LINE

Do not change copy in this OAR unless DB-seated replacement already exists.

### 3. Preserve current functioning flow

Do not break:

- intro
- path choice
- assessment
- contact capture
- passage video
- report
- MAP
- payment wiring
- right-side crystal flow
- footer/legal links

### 4. No redesign rule

Do not visually redesign the site.

This OAR is inventory, movement, classification, and normalization only.

If a CSS move causes visible regression, revert and classify as unsafe_to_move.

## VALIDATION

Return OAR1 evidence showing:

- all active CSS files inventoried
- remaining runtime style imports identified
- runtime style imports moved or classified
- style authority classified by category
- DB style profile candidates listed
- no broad redesign performed
- index.css not split unless required and safe
- current flow remains functional
- build passes
- browser smoke QA confirms:
  - intro
  - path choice
  - assessment
  - passage
  - report
  - MAP
  - footer

## FINAL DISPOSITION

Return one:

- STYLE_AUTHORITY_INVENTORY_COMPLETE
- STYLE_AUTHORITY_NORMALIZATION_PARTIAL
- STYLE_AUTHORITY_HOLD
- STYLE_AUTHORITY_FAIL

## NOTCHAZZ FLAGS

Raise NotChazz if:

- styling is claimed DB-governed without DB evidence
- CSS redesign occurs
- working flow breaks
- report copy changes
- assessment scoring changes
- MAP behavior changes
- payment behavior changes
- legal copy changes
- runtime style paths remain active without classification
- operator is governed instead of the work body

## CLOSE

Inventory styling authority.

Move what is safe.

Classify what must become DB profile-governed later.

The system aligns.
