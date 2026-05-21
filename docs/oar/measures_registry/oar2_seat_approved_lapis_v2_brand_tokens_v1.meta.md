---
document_type: oar2
authority_level: working
document_scope: measures_registry_brand_tokens
title: OAR2 — Seat Approved Lapis v2 Brand Tokens v1
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
  - measures-registry
  - branding
  - lapis-v2
  - design-tokens
  - brand-authority
  - frontend-alignment
source_alignment:
  - OAR1 - Measures Registry Branding + Frontend Dependency Audit v1
  - Measures Registry Brand Package Lapis v2
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Seat Approved Lapis v2 Brand Tokens v1

## OBSERVED

Measures Registry runtime already contains functioning design-token plumbing through:

public.measures_design_token

However, the approved Lapis v2 branding palette is not yet the active runtime token authority.

Current runtime token state includes:

- legacy Measures-era tones
- near-match values
- inline hardcoded colors
- Inanna-adjacent material remnants
- off-palette accent values

The branding audit confirmed:

- approved palette exists
- runtime token infrastructure exists
- frontend styling still depends on mixed token + hardcoded color state

The correction required is:

- token seating
- governed token alignment
- token replacement preparation

not broad redesign.

## ALIGNED

Branding is governed visual authority.

Approved Measures Registry Lapis v2 palette becomes the active Measures Registry runtime token authority.

Approved palette:

Obsidian      #0E0E17
Deep Lapis    #1F2F8D
Lapis Night   #101A4D
Silver Frame  #D7DBE3
Crystal Star  #F2F4F8
Marble Accent #C7CBD2

The token system must support:

- runtime consistency
- DB-first rendering
- governed visual continuity
- reusable institutional styling
- future frontend replacement alignment

This OAR2 governs:

- token seating
- token authority
- token mapping preparation

This OAR2 does not authorize:

- broad CSS rewrite
- arbitrary redesign
- frontend styling experimentation
- removal of historical material tokens used outside Measures Registry scope

## ROUTED

### 1. Seat approved Measures Registry brand tokens

Seat explicit approved brand token rows into:

public.measures_design_token

Recommended token keys:

brand_obsidian
brand_deep_lapis
brand_lapis_night
brand_silver_frame
brand_crystal_star
brand_marble_accent

Recommended values:

brand_obsidian       = #0E0E17
brand_deep_lapis     = #1F2F8D
brand_lapis_night    = #101A4D
brand_silver_frame   = #D7DBE3
brand_crystal_star   = #F2F4F8
brand_marble_accent  = #C7CBD2

### 2. Preserve existing token stability

Do not immediately overwrite:

- historical material tokens
- Inanna-specific tokens
- phase-map material tokens
- unrelated runtime surfaces

Seat approved Measures Registry brand tokens first.

Replacement alignment occurs in a later OAR2.

### 3. Add token metadata standing

Each token should include metadata describing:

- token family
- brand scope
- intended usage
- visual authority role
- launch status

Suggested scope:

measures_registry_lapis_v2

### 4. Confirm runtime token visibility

Verify runtime can resolve newly seated tokens.

Return:

- token keys
- token values
- active standing
- runtime read confirmation

### 5. Prepare replacement alignment map

Produce recommended mapping between:

- current runtime colors
- approved brand tokens

Example:

background_obsidian
→ brand_obsidian

accent_cool
→ brand_deep_lapis

text_primary
→ brand_silver_frame

No replacement execution yet.

### 6. Preserve Measures vs Inanna boundary

Do not collapse:

- Measures Registry branding
and
- Measures of Inanna material systems

Material token families may remain distinct where appropriate.

Measures Registry Lapis v2 governs:

- institutional/public runtime surfaces
- assessment surfaces
- Structured Environment surfaces
- governance/public encounter surfaces

### 7. Preserve no-hardcoded-color direction

Future frontend styling should progressively resolve through governed token authority instead of:

- inline hex values
- arbitrary RGBA values
- component-owned colors

This OAR2 establishes the token authority layer required before frontend replacement alignment.

## CODY ROLE

Cody may:

- inspect current token standing
- insert approved brand token rows
- add token metadata
- verify runtime token resolution
- produce token replacement alignment map
- preserve existing unrelated token families
- write OAR1 closeout

Cody may not:

- broadly rewrite CSS
- remove Inanna material token systems
- arbitrarily replace all colors
- introduce unsupported palette values
- hardcode replacement colors into frontend
- bypass DB token authority

## VALIDATION

This OAR2 resolves successfully when:

- approved Lapis v2 brand tokens are seated
- runtime can resolve token rows
- token metadata exists
- Measures Registry token authority becomes explicit
- replacement alignment map is returned
- no unrelated token families are damaged
- frontend replacement work can proceed from governed token authority

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_approved_lapis_v2_brand_tokens_v1.meta.md

## CLOSE

Seat the authority first.

Then align the surface.
